from rest_framework import viewsets, permissions
from .models import Participante
from .serializers import ParticipanteSerializer

class ParticipanteViewSet(viewsets.ModelViewSet):
    queryset = Participante.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = ParticipanteSerializer

