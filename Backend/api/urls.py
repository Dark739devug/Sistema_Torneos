from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),  # Ruta para el admin de Django
    path('api/', include('apitorneos.urls')),  # Incluye las rutas de la aplicación 'apitorneos' bajo el prefijo 'api/'
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
