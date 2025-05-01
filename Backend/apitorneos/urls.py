from rest_framework.routers import DefaultRouter  # Corregir la importación
from .views import ParticipanteViewSet  # Asegúrate de que la vista está correctamente importada

# Crear una instancia del router
router = DefaultRouter()

# Registrar el 'ParticipanteViewSet' con la ruta correcta
router.register('apitorneos', ParticipanteViewSet, basename='participante')  # Corregir la ruta

# Asignar las URLs generadas a urlpatterns
urlpatterns = router.urls
