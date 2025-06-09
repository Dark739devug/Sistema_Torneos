from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

from .models import ( Torneo, Grupo, AvanceFase, Jornada, Calendario, Horario,
                     CalendarioHorario, Equipo, Cancha, Partido,
                     Inscripcion, Participante, Tarjeta, HistorialSuspension,
                     Resultado, Goleador, TablaPosiciones, HistorialCambiosResultado)

from .serializers import ( AvanceFaseSerializer, TorneoSerializer, GrupoSerializer,
                          JornadaSerializer, CalendarioSerializer, HorarioSerializer,
                          CalendarioHorarioSerializer, EquipoSerializer, CanchaSerializer,
                          PartidoSerializer, InscripcionSerializer, ParticipanteSerializer,
                          TarjetaSerializer, HistorialCambiosResultado, ResultadoSerializer,
                          GoleadorSerializer, HistorialSuspensionSerializer, TablaPosicionesSerializer, HistorialCambiosResultadoSerializer)
    
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer

from rest_framework.views import APIView
from django.contrib.auth.hashers import make_password
from django.utils import timezone
from .models import Usuario

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

# Agregando lógica personalizada para resultados y tabla de posiciones
class ResultadoViewSet(viewsets.ModelViewSet):
    queryset = Resultado.objects.all()
    serializer_class = ResultadoSerializer
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=['post'])
    def registrar_resultado_completo(self, request):
        data = request.data
        partido_id = data.get('partido_id')
        resultados = data.get('resultados')  # Lista de dicts: equipo_id, goles, tipo_resultado, etc.
        tarjetas = data.get('tarjetas')  # Lista de dicts: participante_id, tipo
        goleadores = data.get('goleadores')  # Lista de dicts: participante_id, goles

        for r in resultados:
            Resultado.objects.update_or_create(
                partido_id=partido_id,
                equipo_id=r['equipo_id'],
                defaults={
                    'goles_equipo': r['goles'],
                    'tarjetas_amarillas': r.get('amarillas', 0),
                    'tarjetas_rojas': r.get('rojas', 0),
                    'puntos_equipo': r.get('puntos', 0),
                    'tipo_resultado': r['tipo_resultado']
                }
            )

        for g in goleadores:
            Goleador.objects.create(
                participante_id=g['participante_id'],
                partido_id=partido_id,
                goles=g['goles']
            )

        # Nuevo fragmento sugerido
        for tarjeta_data in tarjetas:
            participante_id = tarjeta_data['participante_id']
            
            try:
                participante = Participante.objects.get(id=participante_id)
            except Participante.DoesNotExist:
                return Response({"error": f"Participante con ID {participante_id} no existe."}, status=404)

            Tarjeta.objects.create(
                participante=participante,
                partido_id=partido_id,
                tipo=tarjeta_data['tipo']
            )

            # Verificar suspensiones
            total_amarillas = Tarjeta.objects.filter(participante_id=participante_id, tipo='Amarilla').count()
            total_rojas = Tarjeta.objects.filter(participante_id=participante_id, tipo='Roja').count()

            if total_amarillas >= 4 or total_rojas >= 1:
                HistorialSuspension.objects.create(
                    participante=participante,
                    fecha_suspension=timezone.now().date(),
                    motivo='Suspensión automática por acumulación de tarjetas',
                    estado_antes=participante.estado_activo,
                    estado_despues=False
                )
                participante.estado_activo = False
                participante.save()

        self.actualizar_tabla_posiciones(partido_id)

        return Response({'mensaje': 'Resultado, tarjetas y goleadores registrados correctamente.'}, status=status.HTTP_200_OK)

    def actualizar_tabla_posiciones(self, partido_id):
        partido = Partido.objects.get(id=partido_id)
        torneo_id = partido.jornada.torneo.id

        equipos = Equipo.objects.filter(torneo_id=torneo_id)

        for equipo in equipos:
            resultados = Resultado.objects.filter(partido__jornada__torneo_id=torneo_id, equipo=equipo)

            pj = resultados.count()
            ganados = resultados.filter(tipo_resultado='Ganado').count()
            empatados = resultados.filter(tipo_resultado='Empatado').count()
            perdidos = resultados.filter(tipo_resultado='Perdido').count()
            gf = sum(r.goles_equipo for r in resultados)
            gc = sum(Resultado.objects.filter(partido=r.partido).exclude(equipo=equipo).first().goles_equipo for r in resultados)
            puntos = sum(r.puntos_equipo for r in resultados)

            TablaPosiciones.objects.update_or_create(
                torneo_id=torneo_id,
                equipo=equipo,
                defaults={
                    'partidos_jugados': pj,
                    'ganados': ganados,
                    'empatados': empatados,
                    'perdidos': perdidos,
                    'goles_favor': gf,
                    'goles_contra': gc,
                    'puntos': puntos
                }
            )

# Los demás ViewSets no cambian

class TorneoViewSet(viewsets.ModelViewSet):
    queryset = Torneo.objects.all()
    serializer_class = TorneoSerializer

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

class CalendarioViewSet(viewsets.ModelViewSet):
    queryset = Calendario.objects.all()
    serializer_class = CalendarioSerializer
    permission_classes = [permissions.AllowAny]

class HorarioViewSet(viewsets.ModelViewSet):
    queryset = Horario.objects.all()
    serializer_class = HorarioSerializer
    permission_classes = [permissions.AllowAny]

class CalendarioHorarioViewSet(viewsets.ModelViewSet):
    queryset = CalendarioHorario.objects.all()
    serializer_class = CalendarioHorarioSerializer
    permission_classes = [permissions.AllowAny]

class EquipoViewSet(viewsets.ModelViewSet):
    queryset = Equipo.objects.all()
    serializer_class = EquipoSerializer
    permission_classes = [permissions.AllowAny]

class CanchaViewSet(viewsets.ModelViewSet):
    queryset = Cancha.objects.all()
    serializer_class = CanchaSerializer
    permission_classes = [permissions.AllowAny]

class PartidoViewSet(viewsets.ModelViewSet):
    queryset = Partido.objects.all()
    serializer_class = PartidoSerializer
    permission_classes = [permissions.AllowAny]

class InscripcionViewSet(viewsets.ModelViewSet):
    queryset = Inscripcion.objects.all()
    serializer_class = InscripcionSerializer
    permission_classes = [permissions.AllowAny]

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

class ParticipanteEstadoViewSet(viewsets.ModelViewSet):
    queryset = Participante.objects.all()
    serializer_class = ParticipanteSerializer
    permission_classes = [permissions.AllowAny]

    @action(detail=True, methods=['patch'])
    def actualizar_estado(self, request, pk=None):
        participante = self.get_object()
        data = request.data

        estado = data.get("estado_activo", None)

        if estado is None:
            return Response({"error": "El campo 'estado_activo' es requerido."}, status=status.HTTP_400_BAD_REQUEST)

        if isinstance(estado, (bytes, bytearray)):
            estado = estado == b'\x01'
        elif isinstance(estado, str):
            estado = estado.lower() in ("true", "1", "t", "yes", "si")
        else:
            estado = bool(estado)

        participante.estado_activo = estado
        participante.save()

        return Response({"mensaje": "Estado del participante actualizado correctamente."}, status=status.HTTP_200_OK)
