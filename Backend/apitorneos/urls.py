from rest_framework.routers import DefaultRouter
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegistroUsuarioAPIView, CustomTokenObtainPairView

from .views import ( CustomTokenObtainPairView, 
   
    TorneoViewSet,
    AvanceFaseViewSet,
    GrupoViewSet,
    JornadaViewSet,
    CalendarioViewSet,
    HorarioViewSet,
    CalendarioHorarioViewSet,
    EquipoViewSet,
    CanchaViewSet,
    PartidoViewSet,
    InscripcionViewSet,
    ParticipanteViewSet,
    TarjetaViewSet,
    HistorialSuspensionViewSet,
    ResultadoViewSet,
    GoleadorViewSet,
    TablaPosicionesViewSet,
    HistorialCambiosResultadoViewSet,
   
    
)

router = DefaultRouter()
router.register('torneos', TorneoViewSet)
router.register('avance-fase', AvanceFaseViewSet)
router.register('grupos', GrupoViewSet)
router.register('jornadas', JornadaViewSet)
router.register('calendarios', CalendarioViewSet)
router.register('horarios', HorarioViewSet)
router.register('calendario-horario', CalendarioHorarioViewSet)
router.register('equipos', EquipoViewSet)
router.register('canchas', CanchaViewSet)
router.register('partidos', PartidoViewSet)
router.register('inscripciones', InscripcionViewSet)
router.register('participantes', ParticipanteViewSet)
router.register('tarjetas', TarjetaViewSet)
router.register('historial-suspension', HistorialSuspensionViewSet)
router.register('resultados', ResultadoViewSet)
router.register('goleadores', GoleadorViewSet)
router.register('tabla-posiciones', TablaPosicionesViewSet)
router.register('historial-cambios-resultado', HistorialCambiosResultadoViewSet)


urlpatterns = [
    path('', include(router.urls)),
   path('registro/', RegistroUsuarioAPIView.as_view(), name='registro_usuario'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

