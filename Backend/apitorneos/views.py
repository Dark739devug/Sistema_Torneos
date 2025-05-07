from rest_framework import viewsets, permissions
from .models import (Participante, Torneo, ConfiguracionTorneo, Grupo, Equipo,
    GrupoEquipo, Jornada, Calendario, ParticipanteEquipo, Partido,
    Resultado, ParticipantePartido, Coach, Canchas, PartidoCancha,
    Arbitro, ArbitroPartido, Sancion, TablaPosiciones, HistorialSuspension
)
from .serializers import (ParticipanteSerializer, TorneoSerializer,
                          ConfiguracionTorneoSerializer, GrupoSerializer, EquipoSerializer, GrupoEquipoSerializer,
                          JornadaSerializer, CalendarioSerializer, 
                          ParticipanteEquipoSerializer, PartidoCanchaSerializer,
                          PartidoSerializer, ResultadoSerializer, 
                          ParticipantePartidoSerializer, CoachSerializer,
                          CanchasSerializer, ArbitroPartidoSerializer, 
                          ArbitroSerializer, SancionSerializer, 
                          TablaposicionesSerializer, HistorialSuspensionSerializer)

class ParticipanteViewSet(viewsets.ModelViewSet):
    queryset = Participante.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = ParticipanteSerializer

class TorneoViewSet(viewsets.ModelViewSet):
    queryset = Torneo.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = TorneoSerializer

class ConfiguracionTorneoViewSet(viewsets.ModelViewSet):
    queryset = ConfiguracionTorneo.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = ConfiguracionTorneoSerializer

class GrupoViewSet(viewsets.ModelViewSet):
    queryset = Grupo.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = GrupoSerializer

class EquipoViewSet(viewsets.ModelViewSet):
    queryset = Equipo.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = EquipoSerializer

class GrupoEquipoViewSet(viewsets.ModelViewSet):
    queryset = GrupoEquipo.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = GrupoEquipoSerializer

class JornadaViewSet(viewsets.ModelViewSet):
    queryset = Jornada.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = JornadaSerializer

class CalendarioViewSet(viewsets.ModelViewSet):
    queryset = Calendario.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = CalendarioSerializer

class ParticipanteEquipoViewSet(viewsets.ModelViewSet):
    queryset = ParticipanteEquipo.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = ParticipanteEquipoSerializer

class PartidoViewSet(viewsets.ModelViewSet):
    queryset = Partido.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = PartidoSerializer

class ResultadoViewSet(viewsets.ModelViewSet):
    queryset = Resultado.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = ResultadoSerializer

class ParticipantePartidoViewSet(viewsets.ModelViewSet):
    queryset = ParticipantePartido.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = ParticipantePartidoSerializer

class CoachViewSet(viewsets.ModelViewSet):
    queryset = Coach.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = CoachSerializer

class CanchasViewSet(viewsets.ModelViewSet):
    queryset = Canchas.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = CanchasSerializer

class PartidoCanchaViewSet(viewsets.ModelViewSet):
    queryset = PartidoCancha.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = PartidoCanchaSerializer

class ArbitroViewSet(viewsets.ModelViewSet):
    queryset = Arbitro.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = ArbitroSerializer

class ArbitroPartidoViewSet(viewsets.ModelViewSet):
    queryset = ArbitroPartido.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = ArbitroPartidoSerializer

class SancionViewSet(viewsets.ModelViewSet):
    queryset = Sancion.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = SancionSerializer

class TablaposicionesViewSet(viewsets.ModelViewSet):
    queryset = TablaPosiciones.objects.all()
    serializer_class = TablaposicionesSerializer

class HistorialSuspensionViewset(viewsets.ModelViewSet):
    queryset = HistorialSuspension.objects.all()
    serializer_class = HistorialSuspensionSerializer



