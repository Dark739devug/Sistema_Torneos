from rest_framework import viewsets, permissions, filters, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.hashers import make_password
from django.utils import timezone
from django.db import OperationalError, connection
from django.db.utils import OperationalError

from .models import (
    Usuario, Torneo, Grupo, AvanceFase, Jornada, 
    Equipo, Cancha, Partido, Inscripcion, Participante,
    Tarjeta, HistorialSuspension, Resultado, Goleador, TablaPosiciones,
    HistorialCambiosResultado, BasesTorneo, DisponibilidadCancha, 
)
from .serializers import (
    CustomTokenObtainPairSerializer, BasesTorneoSerializer, AvanceFaseSerializer,
    TorneoSerializer, GrupoSerializer, JornadaSerializer, EquipoSerializer,
    CanchaSerializer, InscripcionSerializer,
    ParticipanteSerializer, TarjetaSerializer, ResultadoSerializer,
    GoleadorSerializer, HistorialSuspensionSerializer, TablaPosicionesSerializer,
    HistorialCambiosResultadoSerializer, PartidoDetalleSerializer,
)


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class RegistroUsuarioAPIView(APIView):
    def post(self, request):
        nombre = request.data.get('nombre')
        correo = request.data.get('correo')
        password = request.data.get('password')
        nombre_rol = request.data.get('nombre_rol', 'Estudiante')  

        if not nombre or not correo or not password:
            return Response({'error': 'Todos los campos son requeridos.'}, status=status.HTTP_400_BAD_REQUEST)

        if Usuario.objects.filter(correo=correo).exists():
            return Response({'error': 'El correo ya está registrado.'}, status=status.HTTP_400_BAD_REQUEST)

        usuario = Usuario.objects.create(
            nombre=nombre,
            correo=correo,
            nombre_rol=nombre_rol,
            password=make_password(password)
        )

        return Response({'message': 'Usuario registrado exitosamente.'}, status=status.HTTP_201_CREATED)


class TorneoViewSet(viewsets.ModelViewSet):
    queryset = Torneo.objects.all()
    serializer_class = TorneoSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['nombre_torneo', 'descripcion_torneo', 'fase_actual']

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            # 🔹 Guardamos el torneo normalmente
            self.perform_create(serializer)
            id_torneo = serializer.instance.id  # ✅ Usamos 'id' en lugar de 'id_torneo'

            # 🔹 Llamamos al procedimiento almacenado para crear los grupos automáticamente
            with connection.cursor() as cursor:
                cursor.callproc('CrearGruposParaTorneoSeguro', [id_torneo])

        except OperationalError as e:
            error_msg = str(e)
            if 'La fecha de fin no puede ser anterior' in error_msg:
                return Response({'error': 'La fecha de fin no puede ser menor a la fecha de inicio.'}, status=status.HTTP_400_BAD_REQUEST)
            if 'La fecha de fin de inscripción no puede ser anterior' in error_msg:
                return Response({'error': 'La fecha de fin de inscripción no puede ser menor a la fecha de inicio de inscripción.'}, status=status.HTTP_400_BAD_REQUEST)
            return Response({'error': error_msg}, status=status.HTTP_400_BAD_REQUEST)

        headers = self.get_success_headers(serializer.data)
        return Response(
            {
                'mensaje': ' Torneo registrado y grupos generados automáticamente.',
                'torneo': serializer.data
            },
            status=status.HTTP_201_CREATED,
            headers=headers
        )

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        try:
            self.perform_update(serializer)
        except OperationalError as e:
            error_msg = str(e)
            if 'La fecha de fin no puede ser anterior' in error_msg:
                return Response({'error': 'La fecha de fin no puede ser menor a la fecha de inicio.'}, status=status.HTTP_400_BAD_REQUEST)
            if 'La fecha de fin de inscripción no puede ser anterior' in error_msg:
                return Response({'error': 'La fecha de fin de inscripción no puede ser menor a la fecha de inicio de inscripción.'}, status=status.HTTP_400_BAD_REQUEST)
            return Response({'error': error_msg}, status=status.HTTP_400_BAD_REQUEST)

        return Response(
            {
                'mensaje': '✅ Edición exitosa.',
                'torneo': serializer.data
            },
            status=status.HTTP_200_OK
        )


class BasesTorneoViewSet(viewsets.ModelViewSet):
    queryset = BasesTorneo.objects.all()
    serializer_class = BasesTorneoSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class GrupoViewSet(viewsets.ModelViewSet):
    queryset = Grupo.objects.all()
    serializer_class = GrupoSerializer
    permission_classes = [permissions.AllowAny]

class JornadaViewSet(viewsets.ModelViewSet):
    queryset = Jornada.objects.all()
    serializer_class = JornadaSerializer
    permission_classes = [permissions.AllowAny]

class AvanceFaseViewSet(viewsets.ModelViewSet):
    queryset = AvanceFase.objects.all()
    serializer_class = AvanceFaseSerializer
    permission_classes = [permissions.AllowAny]


class EquipoViewSet(viewsets.ModelViewSet):
    queryset = Equipo.objects.all()
    serializer_class = EquipoSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['nombre_equipo', 'color_uniforme', 'estado_equipo']
    parser_classes = (MultiPartParser, FormParser)

    def perform_create(self, serializer):
        torneo_id = self.request.data.get('torneo')
        if not torneo_id:
            raise ValidationError({'torneo': 'Debe indicar el torneo'})

        try:
            torneo = Torneo.objects.get(pk=torneo_id)
        except Torneo.DoesNotExist:
            raise ValidationError({'torneo': 'Torneo no encontrado'})

        # Verificar máximo de equipos permitidos
        equipos_existentes = Equipo.objects.filter(torneo=torneo).count()
        if equipos_existentes >= torneo.maximo_equipos:
            raise ValidationError({'error': 'Se alcanzó el máximo de equipos permitidos para este torneo'})

        # Asignar grupo dinámicamente
        grupos = list(Grupo.objects.filter(torneo=torneo).order_by('id'))
        if not grupos:
            raise ValidationError({'error': 'No hay grupos definidos para este torneo'})

        grupo_index = equipos_existentes % len(grupos)
        grupo_asignado = grupos[grupo_index]

        # Crear el equipo
        equipo = serializer.save(
            torneo=torneo,
            grupo=grupo_asignado,
            fecha_creacion=timezone.now(),
            fecha_modificacion=timezone.now()
        )

        Inscripcion.objects.create(
            equipo=equipo,
            estado='Pendiente',
            fecha_solicitud=timezone.now()
        )

    def perform_update(self, serializer):
        serializer.save(
            fecha_modificacion=timezone.now()
        )
        
from rest_framework import generics
from rest_framework.exceptions import ValidationError


from rest_framework import generics
from rest_framework.exceptions import ValidationError
from .models import Equipo, Grupo, Torneo
from .serializers import EquipoSerializer

class EquipoViewSet(viewsets.ModelViewSet):
    queryset = Equipo.objects.all()
    serializer_class = EquipoSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['nombre_equipo', 'color_uniforme', 'estado_equipo']
    parser_classes = (MultiPartParser, FormParser)

    def perform_create(self, serializer):
        torneo_id = self.request.data.get('torneo')
        if not torneo_id:
            raise ValidationError({'torneo': 'Debe indicar el torneo'})

        try:
            torneo = Torneo.objects.get(pk=torneo_id)
        except Torneo.DoesNotExist:
            raise ValidationError({'torneo': 'Torneo no encontrado'})

        # Verificar el máximo de equipos permitidos
        equipos_existentes = Equipo.objects.filter(torneo=torneo).count()
        if equipos_existentes >= torneo.maximo_equipos:
            raise ValidationError({'error': 'Se alcanzó el máximo de equipos permitidos para este torneo'})

        # Asignar el grupo correspondiente
        grupos = list(Grupo.objects.filter(torneo=torneo).order_by('id'))
        if not grupos:
            raise ValidationError({'error': 'No hay grupos definidos para este torneo'})

        grupo_index = equipos_existentes % torneo.numero_grupos
        grupo_asignado = grupos[grupo_index]

        serializer.save(
            torneo=torneo,  # ✅ Asigna el torneo correctamente
            grupo=grupo_asignado,
            fecha_creacion=timezone.now(),
            fecha_modificacion=timezone.now()
        )

    def perform_update(self, serializer):
        serializer.save(
            fecha_modificacion=timezone.now()
        )

        
class CanchaViewSet(viewsets.ModelViewSet):
    queryset = Cancha.objects.all()
    serializer_class = CanchaSerializer
    permission_classes = [permissions.AllowAny]


class InscripcionViewSet(viewsets.ModelViewSet):
    queryset = Inscripcion.objects.all()
    serializer_class = InscripcionSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        equipo = serializer.validated_data.get('equipo')
        # Verifica cuántas inscripciones existen para este equipo
        inscripciones_count = Inscripcion.objects.filter(equipo=equipo).count()
        if inscripciones_count >= 2:
            raise ValidationError({'error': '❌ Este equipo ya tiene 2 inscripciones.'})

        # Asigna automáticamente el estado y la fecha
        serializer.save(
            estado='Pendiente',
            fecha_solicitud=timezone.now()
        )

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        data = response.data
        data['mensaje'] = '✅ Inscripción creada correctamente'
        return Response(data, status=status.HTTP_201_CREATED)
    
    queryset = Inscripcion.objects.all()
    serializer_class = InscripcionSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        serializer.save(estado='Pendiente')

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        data = response.data
        data['mensaje'] = '✅ Inscripción creada correctamente'
        return Response(data, status=status.HTTP_201_CREATED)

class ParticipanteViewSet(viewsets.ModelViewSet):
    queryset = Participante.objects.all()
    serializer_class = ParticipanteSerializer
    permission_classes = [permissions.AllowAny]

class TarjetaViewSet(viewsets.ModelViewSet):
    queryset = Tarjeta.objects.all()
    serializer_class = TarjetaSerializer
    permission_classes = [permissions.AllowAny]

class HistorialSuspensionViewSet(viewsets.ModelViewSet):
    queryset = HistorialSuspension.objects.all()
    serializer_class = HistorialSuspensionSerializer
    permission_classes = [permissions.AllowAny]

class ResultadoViewSet(viewsets.ModelViewSet):
    queryset = Resultado.objects.all()
    serializer_class = ResultadoSerializer
    permission_classes = [permissions.AllowAny]

class GoleadorViewSet(viewsets.ModelViewSet):
    queryset = Goleador.objects.all()
    serializer_class = GoleadorSerializer
    permission_classes = [permissions.AllowAny]

class TablaPosicionesViewSet(viewsets.ModelViewSet):
    queryset = TablaPosiciones.objects.all()
    serializer_class = TablaPosicionesSerializer
    permission_classes = [permissions.AllowAny]

class HistorialCambiosResultadoViewSet(viewsets.ModelViewSet):
    queryset = HistorialCambiosResultado.objects.all()
    serializer_class = HistorialCambiosResultadoSerializer
    permission_classes = [permissions.AllowAny]

    
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.db.models import Q
from .models import Torneo, Grupo, Partido

@csrf_exempt
def contar_partidos_necesarios(request):
    if request.method == 'GET':
        torneo_id = request.GET.get('torneo')
        num_jornada = request.GET.get('jornada')

        if not torneo_id or not num_jornada:
            return JsonResponse({'error': 'Datos incompletos'}, status=400)

        try:
            torneo = Torneo.objects.get(pk=torneo_id)
        except Torneo.DoesNotExist:
            return JsonResponse({'error': 'Torneo no encontrado'}, status=404)

        # Contar cuántos partidos se necesitan (lógica similar a la de crear_partidos_jornada)
        grupos = Grupo.objects.filter(torneo=torneo)
        partidos_a_crear = []
        for grupo in grupos:
            equipos = list(grupo.equipo_set.all())
            if len(equipos) < 2:
                continue

            # Generar emparejamientos
            n = len(equipos)
            if n % 2 != 0:
                equipos.append(None)
            mitad = n // 2
            emparejamientos = []
            for _ in range(n - 1):
                ronda = []
                for j in range(mitad):
                    local = equipos[j]
                    visitante = equipos[n - 1 - j]
                    if local and visitante:
                        ronda.append((local, visitante))
                emparejamientos.append(ronda)
                equipos = [equipos[0]] + equipos[2:] + [equipos[1]]

            # Aplanar y contar solo los partidos que aún no existen
            partidos_planos = []
            for ronda in emparejamientos:
                partidos_planos.extend(ronda)

            for local, visitante in partidos_planos:
                if not Partido.objects.filter(
                    jornada__torneo=torneo,
                    equipo_local=local,
                    equipo_visitante=visitante
                ).exists():
                    partidos_a_crear.append((grupo, local, visitante))

        return JsonResponse({
            'partidos_necesarios': len(partidos_a_crear)
        }, status=200)

    return JsonResponse({'error': 'Método no permitido'}, status=405)

from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.db import transaction
from datetime import datetime, timedelta
from django.utils import timezone
from django.db.models import Q
import json

from .models import Torneo, Grupo, Jornada, Cancha, Partido, DisponibilidadCancha


def calcular_fecha(dia_semana):
    dias = {
        'Lunes': 0, 'Martes': 1, 'Miércoles': 2,
        'Jueves': 3, 'Viernes': 4, 'Sábado': 5,
        'Domingo': 6
    }
    objetivo = dias.get(dia_semana.capitalize(), None)
    if objetivo is None:
        return None
    hoy = datetime.now().date()
    faltantes = (objetivo - hoy.weekday() + 7) % 7 or 7
    return hoy + timedelta(days=faltantes)


def verificar_disponibilidad(cancha, fecha, hi, hf):
    if not fecha:
        return False
    return not Partido.objects.filter(
        cancha=cancha,
        fecha_partido=fecha,
        hora_inicio__lt=hf,
        hora_fin__gt=hi
    ).exists() and not DisponibilidadCancha.objects.filter(
        cancha=cancha, fecha=fecha, estado='Ocupado',
        hora_inicio__lt=hf, hora_fin__gt=hi
    ).exists()


def verificar_equipos_disponibles(local, visitante, fecha, hi, hf):
    return not Partido.objects.filter(
        fecha_partido=fecha,
        hora_inicio__lt=hf,
        hora_fin__gt=hi
    ).filter(
        Q(equipo_local=local) |
        Q(equipo_visitante=local) |
        Q(equipo_local=visitante) |
        Q(equipo_visitante=visitante)
    ).exists()


def generar_partidos_intergrupos(equipos_a, equipos_b):
    n = min(len(equipos_a), len(equipos_b))
    return [(equipos_a[i], equipos_b[i]) for i in range(n)]


@csrf_exempt
def contar_partidos_necesarios(request):
    if request.method != 'GET':
        return JsonResponse({'error': 'Método no permitido'}, status=405)
    torneo_id = request.GET.get('torneo')
    if not torneo_id:
        return JsonResponse({'error': 'Torneo requerido'}, status=400)
    try:
        torneo = Torneo.objects.get(pk=torneo_id)
    except Torneo.DoesNotExist:
        return JsonResponse({'error': 'Torneo no existe'}, status=404)

    grupos = list(Grupo.objects.filter(torneo=torneo))
    if len(grupos) < 2:
        return JsonResponse({'error': 'Se requieren al menos dos grupos'}, status=400)

    equipos_a = list(grupos[0].equipo_set.all())
    equipos_b = list(grupos[1].equipo_set.all())
    count = min(len(equipos_a), len(equipos_b))
    return JsonResponse({'partidos_necesarios': count}, status=200)


@csrf_exempt
def crear_partidos_jornada(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Método no permitido'}, status=405)
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'JSON inválido'}, status=400)

    torneo_id = data.get('torneo')
    slots = data.get('dias', [])
    if not torneo_id or not slots:
        return JsonResponse({'error': 'Campos torneo y dias son requeridos'}, status=400)

    try:
        torneo = Torneo.objects.get(pk=torneo_id)
    except Torneo.DoesNotExist:
        return JsonResponse({'error': 'Torneo no encontrado'}, status=404)

    grupos = list(Grupo.objects.filter(torneo=torneo))
    if len(grupos) < 2:
        return JsonResponse({'error': 'Se requieren mínimo dos grupos'}, status=400)

    equipos_a = list(grupos[0].equipo_set.all())
    equipos_b = list(grupos[1].equipo_set.all())
    partidos = generar_partidos_intergrupos(equipos_a, equipos_b)

    if len(partidos) > len(slots):
        return JsonResponse({'error': f'Slots insuficientes. Necesarios: {len(partidos)}, Disponibles: {len(slots)}'}, status=400)

    ultima = Jornada.objects.filter(torneo=torneo).order_by('-numero_jornada').first()
    num = 1 if not ultima else ultima.numero_jornada + 1

    with transaction.atomic():
        jornada = Jornada.objects.create(
            numero_jornada=num,
            fecha_inicio=timezone.now().date(),
            fecha_fin=timezone.now().date(),
            torneo=torneo
        )
        creado = []
        for idx, (local, visitante) in enumerate(partidos):
            slot = slots[idx]
            if not all(slot.get(k) for k in ("dia","hora_inicio","hora_fin","cancha")):
                return JsonResponse({'error': f'Slot {idx+1} incompleto'}, status=400)

            cancha = Cancha.objects.filter(nombre_cancha=slot["cancha"]).first()
            if not cancha:
                return JsonResponse({'error': f'Cancha no encontrada: {slot["cancha"]}'}, status=400)

            base = calcular_fecha(slot["dia"])
            if not base:
                return JsonResponse({'error': f'Día inválido: {slot["dia"]}'}, status=400)

            fecha = base
            for _ in range(4):
                if verificar_disponibilidad(cancha, fecha, slot["hora_inicio"], slot["hora_fin"]) and verificar_equipos_disponibles(local, visitante, fecha, slot["hora_inicio"], slot["hora_fin"]):
                    p = Partido.objects.create(
                        fecha_partido=fecha,
                        hora_inicio=slot["hora_inicio"],
                        hora_fin=slot["hora_fin"],
                        cancha=cancha,
                        jornada=jornada,
                        equipo_local=local,
                        equipo_visitante=visitante,
                        creado_por="Sistema"
                    )
                    DisponibilidadCancha.objects.create(cancha=cancha, fecha=fecha, hora_inicio=slot["hora_inicio"], hora_fin=slot["hora_fin"], estado="Ocupado", partido=p)
                    creado.append({
                        "id": p.id,
                        "equipos": f"{local.nombre_equipo} vs {visitante.nombre_equipo}",
                        "fecha": fecha.strftime("%Y-%m-%d"),
                        "hora": f"{slot['hora_inicio']} a {slot['hora_fin']}",
                        "cancha": slot["cancha"]
                    })
                    break
                fecha += timedelta(weeks=1)

        return JsonResponse({"jornada": num, "partidos": creado}, status=201)


import json
from datetime import datetime, timedelta
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Jornada, Torneo

@csrf_exempt
def generar_jornadas(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        id_torneo = data.get('id_torneo')
        num_jornadas = data.get('num_jornadas')
        fecha_inicio = data.get('fecha_inicio')
        intervalo_dias = data.get('intervalo_dias', 7)

        if not id_torneo or not num_jornadas or not fecha_inicio:
            return JsonResponse({'error': 'Datos incompletos'}, status=400)

        try:
            torneo = Torneo.objects.get(pk=id_torneo)
        except Torneo.DoesNotExist:
            return JsonResponse({'error': 'Torneo no encontrado'}, status=404)

        fecha_actual = datetime.strptime(fecha_inicio, "%Y-%m-%d").date()

        for i in range(num_jornadas):
            Jornada.objects.create(
                numero_jornada=i+1,
                 fecha_inicio=fecha_actual,
                fecha_fin=fecha_actual,
                torneo=torneo
            )
            fecha_actual += timedelta(days=intervalo_dias)

        return JsonResponse({'mensaje': 'Jornadas generadas correctamente'}, status=201)

    return JsonResponse({'error': 'Método no permitido'}, status=405)


from rest_framework.decorators import action

class PartidoViewSet(viewsets.ReadOnlyModelViewSet):
  
    queryset = Partido.objects.all().order_by('fecha_partido')
    serializer_class = PartidoDetalleSerializer

    @action(detail=False, methods=['get'], url_path='por-torneo/(?P<id_torneo>[^/.]+)')
    def por_torneo(self, request, id_torneo=None):
      
        partidos = Partido.objects.filter(jornada__torneo_id=id_torneo).order_by('fecha_partido', 'hora_inicio')
        serializer = self.get_serializer(partidos, many=True)
        return Response(serializer.data)


