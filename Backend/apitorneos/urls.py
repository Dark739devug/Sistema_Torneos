from rest_framework.routers import DefaultRouter  # Corregir la importación
from .views import (
    ParticipanteViewSet,
    TorneoViewSet,
    ConfiguracionTorneoViewSet,
    GrupoViewSet,
    EquipoViewSet,
    GrupoEquipoViewSet,
    JornadaViewSet,
    CalendarioViewSet,
    ParticipanteEquipoViewSet,
    PartidoViewSet,
    ResultadoViewSet,
    ParticipantePartidoViewSet,
    CoachViewSet,
    CanchasViewSet,
    PartidoCanchaViewSet,
    ArbitroViewSet,
    ArbitroPartidoViewSet,
    SancionViewSet,
    TablaposicionesViewSet,
    HistorialSuspensionViewset
)  # Asegúrate de que la vista está correctamente importada

# Crear una instancia del router
router = DefaultRouter()

# Registrar el 'ParticipanteViewSet' con la ruta correcta
router.register('apitorneos', ParticipanteViewSet, basename='participante')  # Corregir la ruta
#cambios hechos por aracely
router.register('torneos',  TorneoViewSet, basename='torneo')
router.register('configuraciones-torneo', ConfiguracionTorneoViewSet, basename='configuraciontorneo')
router.register('grupos', GrupoViewSet, basename='grupo')
router.register('equipos', EquipoViewSet, basename='equipo')
router.register('grupo-equipos', GrupoEquipoViewSet, basename='grupoequipo')
router.register('jornadas', JornadaViewSet, basename='jornada')
router.register('calendarios', CalendarioViewSet, basename='calendario')
router.register('participante-equipos', ParticipanteEquipoViewSet, basename='participanteequipo')
router.register('partidos', PartidoViewSet, basename='partido')
router.register('resultados', ResultadoViewSet, basename='resultado')
router.register('participante-partidos', ParticipantePartidoViewSet, basename='participantepartido')
router.register('coaches', CoachViewSet, basename='coach')
router.register('canchas', CanchasViewSet, basename='cancha')
router.register('partido-canchas', PartidoCanchaViewSet, basename='partidocancha')
router.register('arbitros', ArbitroViewSet, basename='arbitro')
router.register('arbitro-partidos', ArbitroPartidoViewSet, basename='arbitropartido')
router.register('sanciones', SancionViewSet, basename='sancion')
router.register('tablaposiciones', TablaposicionesViewSet, basename='tablaposiciones' )
router.register('historialsuspension', HistorialSuspensionViewset, basename='historialsuspension')

# Asignar las URLs generadas a urlpatterns
urlpatterns = router.urls

