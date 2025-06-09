from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.db import transaction
from datetime import datetime, timedelta
import json
from django.utils import timezone
from django.db.models import Q

from .models import Torneo, Grupo, Jornada, Cancha, Partido, DisponibilidadCancha, Equipo


def calcular_fecha(dia_semana):
    dias = {
        'Lunes': 0,
        'Martes': 1,
        'Miércoles': 2,
        'Jueves': 3,
        'Viernes': 4,
        'Sábado': 5,
        'Domingo': 6
    }
    if not dia_semana:
        return None
    dia_semana = dia_semana.capitalize()
    dia_objetivo = dias.get(dia_semana)
    if dia_objetivo is None:
        return None

    hoy = datetime.now().date()
    dia_actual = hoy.weekday()
    dias_faltantes = (dia_objetivo - dia_actual + 7) % 7
    if dias_faltantes == 0:
        dias_faltantes = 7
    return hoy + timedelta(days=dias_faltantes)


def verificar_disponibilidad(cancha, fecha, hora_inicio, hora_fin):
    if not fecha:
        return False

    solapamiento = Partido.objects.filter(
        cancha=cancha,
        fecha_partido=fecha,
        hora_inicio__lt=hora_fin,
        hora_fin__gt=hora_inicio
    ).exists()
    bloqueo = DisponibilidadCancha.objects.filter(
        cancha=cancha,
        fecha=fecha,
        hora_inicio__lt=hora_fin,
        hora_fin__gt=hora_inicio,
        estado='Ocupado'
    ).exists()
    return not (solapamiento or bloqueo)


def actualizar_disponibilidad(cancha, fecha, hora_inicio, hora_fin, partido):
    if not fecha:
        raise ValueError("La fecha no puede ser nula (error interno)")

    DisponibilidadCancha.objects.create(
        cancha=cancha,
        fecha=fecha,
        hora_inicio=hora_inicio,
        hora_fin=hora_fin,
        estado='Ocupado',
        partido=partido
    )


def verificar_equipos_disponibles(local, visitante, fecha, hora_inicio, hora_fin):
    conflictos = Partido.objects.filter(
        Q(equipo_local=local) | Q(equipo_visitante=local) |
        Q(equipo_local=visitante) | Q(equipo_visitante=visitante),
        fecha_partido=fecha,
        hora_inicio__lt=hora_fin,
        hora_fin__gt=hora_inicio
    ).exists()
    return not conflictos


def generar_emparejamientos(equipos):
    n = len(equipos)
    if n % 2 != 0:
        equipos.append(None)  # Añadir dummy si es impar
    emparejamientos = []
    mitad = n // 2
    for i in range(n - 1):
        ronda = []
        for j in range(mitad):
            local = equipos[j]
            visitante = equipos[n - 1 - j]
            if local and visitante:
                ronda.append((local, visitante))
        emparejamientos.append(ronda)
        equipos = [equipos[0]] + [equipos[-1]] + equipos[1:-1]
    return emparejamientos


@csrf_exempt
def crear_partidos_jornada(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            torneo_id = data.get('torneo')
            slots = data.get('dias', [])

            if not torneo_id or not slots:
                return JsonResponse({'error': 'Datos incompletos'}, status=400)

            torneo = Torneo.objects.get(pk=torneo_id)
            grupos = Grupo.objects.filter(torneo=torneo)
            ultima_jornada = Jornada.objects.filter(torneo=torneo).order_by('-numero_jornada').first()
            nueva_jornada_num = 1 if not ultima_jornada else ultima_jornada.numero_jornada + 1

            with transaction.atomic():
                nueva_jornada = Jornada.objects.create(
                    numero_jornada=nueva_jornada_num,
                    fecha_inicio=timezone.now().date(),
                    fecha_fin=timezone.now().date(),
                    torneo=torneo
                )

                partidos_a_crear = []
                for grupo in grupos:
                    equipos = list(grupo.equipo_set.all())
                    if len(equipos) < 2:
                        continue

                    todos_partidos = generar_emparejamientos(equipos.copy())
                    partidos_existentes = Partido.objects.filter(
                        jornada__torneo=torneo,
                        equipo_local__in=equipos,
                        equipo_visitante__in=equipos
                    )
                    partidos_pendientes = []
                    for ronda in todos_partidos:
                        for local, visitante in ronda:
                            if not partidos_existentes.filter(
                                equipo_local=local,
                                equipo_visitante=visitante
                            ).exists():
                                partidos_pendientes.append((grupo, local, visitante))

                    partidos_a_crear.extend(partidos_pendientes[:len(slots)])

                if len(partidos_a_crear) > len(slots):
                    return JsonResponse({
                        'error': f'Slots insuficientes. Necesarios: {len(partidos_a_crear)}, Disponibles: {len(slots)}'
                    }, status=400)

                partidos_creados = []
                for i, (grupo, local, visitante) in enumerate(partidos_a_crear):
                    slot = slots[i]
                    dia = slot.get('dia')
                    hora_inicio = slot.get('hora_inicio')
                    hora_fin = slot.get('hora_fin')
                    cancha_nombre = slot.get('cancha')

                    if not dia or not hora_inicio or not hora_fin or not cancha_nombre:
                        return JsonResponse({
                            'error': f'Slot incompleto en la posición {i+1}'
                        }, status=400)

                    fecha_real = calcular_fecha(dia)
                    print(f"Debug - Slot {i+1}: {slot}, fecha_real: {fecha_real}")

                    if not fecha_real:
                        return JsonResponse({'error': f'Día inválido o sin fecha: {dia}'}, status=400)

                    try:
                        cancha = Cancha.objects.get(nombre_cancha=cancha_nombre)
                    except Cancha.DoesNotExist:
                        return JsonResponse({
                            'error': f'Cancha no encontrada: {cancha_nombre}'
                        }, status=400)

                    if not verificar_disponibilidad(cancha, fecha_real, hora_inicio, hora_fin):
                        return JsonResponse({
                            'error': f'Cancha {cancha_nombre} ocupada en {fecha_real} ({hora_inicio}-{hora_fin})'
                        }, status=400)

                    if not verificar_equipos_disponibles(local, visitante, fecha_real, hora_inicio, hora_fin):
                        return JsonResponse({
                            'error': f'Equipo(s) no disponibles en {fecha_real} ({hora_inicio}-{hora_fin})'
                        }, status=400)

                    partido = Partido.objects.create(
                        fecha_partido=fecha_real,
                        hora_inicio=hora_inicio,
                        hora_fin=hora_fin,
                        cancha=cancha,
                        jornada=nueva_jornada,
                        equipo_local=local,
                        equipo_visitante=visitante,
                        creado_por='Sistema'
                    )
                    actualizar_disponibilidad(cancha, fecha_real, hora_inicio, hora_fin, partido)
                    partidos_creados.append({
                        'id': partido.id,
                        'equipos': f'{local.nombre_equipo} vs {visitante.nombre_equipo}',
                        'fecha': fecha_real.strftime("%Y-%m-%d"),
                        'hora': f'{hora_inicio} a {hora_fin}',
                        'cancha': cancha_nombre
                    })

                return JsonResponse({
                    'jornada': nueva_jornada_num,
                    'partidos': partidos_creados
                }, status=201)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Método no permitido'}, status=405)
