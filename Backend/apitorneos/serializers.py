from rest_framework import serializers
from .models import Participante

class ParticipanteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Participante
        fields = 'id_participante', 'nombre_estudiante', 'apellido_estudiante', 'carrera_estudiante', 'semestre_estudiante', 'estado_activo'
        read_only_fields = ['id_participante']
        
