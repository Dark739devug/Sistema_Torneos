from rest_framework import viewsets, permissions
from .models import ( Usuario,Torneo, Grupo, AvanceFase, Jornada, Calendario, Horario,
                     CalendarioHorario, Equipo, Cancha, Partido,
                     Inscripcion, Participante, Tarjeta, HistorialSuspension,
                     Resultado, Goleador, TablaPosiciones, HistorialCambiosResultado, BasesTorneo)

from .serializers import ( CustomTokenObtainPairSerializer,BasesTorneoSerializer, AvanceFaseSerializer, TorneoSerializer, GrupoSerializer,
                          JornadaSerializer, CalendarioSerializer, HorarioSerializer,
                          CalendarioHorarioSerializer, EquipoSerializer, CanchaSerializer,
                          PartidoSerializer, InscripcionSerializer, ParticipanteSerializer,
                          TarjetaSerializer, HistorialCambiosResultado, ResultadoSerializer,
                          GoleadorSerializer, HistorialSuspensionSerializer, TablaPosicionesSerializer, HistorialCambiosResultadoSerializer)    


from rest_framework_simplejwt.views import TokenObtainPairView



class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from django.contrib.auth.hashers import make_password
from rest_framework import viewsets, filters, status
from rest_framework.response import Response
from django.db import OperationalError

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
            self.perform_create(serializer)
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
                'mensaje': '✅ Registro exitoso.',
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


