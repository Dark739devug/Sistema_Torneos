from rest_framework.routers import DefaultRouter
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegistroUsuarioAPIView, CustomTokenObtainPairView, contar_partidos_necesarios
from .views import ( CustomTokenObtainPairView, crear_partidos_jornada, generar_jornadas,  PartidoViewSet, aprobar_inscripcion,
   
    TorneoViewSet,BasesTorneoViewSet,
    AvanceFaseViewSet,
    GrupoViewSet,
    JornadaViewSet,
    EquipoViewSet,
    CanchaViewSet,
    InscripcionViewSet,
    ParticipanteViewSet,
    TarjetaViewSet,
    HistorialSuspensionViewSet,
    ResultadoViewSet,
    GoleadorViewSet,
    TablaPosicionesViewSet,
    HistorialCambiosResultadoViewSet,
    ParticipanteEstadoViewSet,
)

router = DefaultRouter()
router.register('torneos', TorneoViewSet)
router.register('avance-fase', AvanceFaseViewSet)
router.register('grupos', GrupoViewSet)
router.register('equipos', EquipoViewSet)
router.register('jornadas', JornadaViewSet)
router.register('canchas', CanchaViewSet)
router.register('inscripciones', InscripcionViewSet)
router.register('participantes', ParticipanteViewSet)
router.register('tarjetas', TarjetaViewSet)
router.register('historial-suspension', HistorialSuspensionViewSet)
router.register('resultados', ResultadoViewSet)
router.register('goleadores', GoleadorViewSet)
router.register('tabla-posiciones', TablaPosicionesViewSet)
router.register('historial-cambios-resultado', HistorialCambiosResultadoViewSet)
router.register('bases_torneo', BasesTorneoViewSet, basename='bases_torneo')
router.register('partidos', PartidoViewSet, basename='partidos')
router.register(r'participantes-estado', ParticipanteEstadoViewSet, basename='participante-estado')


urlpatterns = [
    path('', include(router.urls)),
    path('registro/', RegistroUsuarioAPIView.as_view(), name='registro_usuario'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('crear-partidos/', crear_partidos_jornada, name='crear_partidos_jornada'),
    path('generar-jornadas/', generar_jornadas, name='generar_jornadas'),
    path('contar-partidos-necesarios/', contar_partidos_necesarios, name='contar_partidos_necesarios'),
    
    path('aprobar-inscripcion/', aprobar_inscripcion, name='aprobar-inscripcion'),

    
    



]

    


