from rest_framework import serializers

from .models import (
   Participante, Torneo, ConfiguracionTorneo, Grupo, Equipo,
    GrupoEquipo, Jornada, Calendario, ParticipanteEquipo, Partido,
    Resultado, ParticipantePartido, Coach, Canchas, PartidoCancha,
    Arbitro, ArbitroPartido, Sancion
)

class ParticipanteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Participante
        fields = 'id_participante', 'nombre_estudiante', 'apellido_estudiante', 'carrera_estudiante', 'semestre_estudiante', 'estado_activo'
        read_only_fields = ['id_participante']
        
class TorneoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Torneo
        fields = 'nombre_torneo', 'fecha_inicio', 'fecha_fin'
        read_only_fields = ['id']

class ConfiguracionTorneoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConfiguracionTorneo
        fields = '__all__'
        read_only_fields = ['id']

class GrupoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grupo
        fields = '__all__'
        read_only_fields = ['id']

class EquipoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Equipo
        fields = '__all__'
        read_only_fields = ['id']

class GrupoEquipoSerializer(serializers.ModelSerializer):
    class Meta:
        model = GrupoEquipo
        fields = '__all__'
        read_only_fields = ['id']

class JornadaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Jornada
        fields = '__all__'
        read_only_fields = ['id']

class CalendarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Calendario
        fields = '__all__'
        read_only_fields = ['id']

class ParticipanteEquipoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ParticipanteEquipo
        fields = '__all__'
        read_only_fields = ['id']

class PartidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Partido
        fields = '__all__'
        read_only_fields = ['id']

class ResultadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resultado
        fields = '__all__'
        read_only_fields = ['id']

class ParticipantePartidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ParticipantePartido
        fields = '__all__'
        read_only_fields = ['id']

class CoachSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coach
        fields = '__all__'
        read_only_fields = ['id']

class CanchasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Canchas
        fields = '__all__'
        read_only_fields = ['id']

class PartidoCanchaSerializer(serializers.ModelSerializer):
    class Meta:
        model = PartidoCancha
        fields = '__all__'
        read_only_fields = ['id']

class ArbitroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Arbitro
        fields = '__all__'
        read_only_fields = ['id']

class ArbitroPartidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArbitroPartido
        fields = '__all__'
        read_only_fields = ['id']

class SancionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sancion
        fields = '__all__'
        read_only_fields = ['id']