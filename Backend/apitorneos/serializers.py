from rest_framework import serializers
from .models import (Participante,Torneo, ConfiguracionTorneo, Grupo, Equipo, GrupoEquipo,
                     Jornada, Calendario, ParticipanteEquipo, Partido, Resultado,
                     ParticipantePartido, Coach, Canchas, PartidoCancha, Arbitro, ArbitroPartido, Sancion, TablaPosiciones,
                     HistorialSuspension, Login)

from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.hashers import make_password

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Login
        fields = ['username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def validate_password(self, value):
        validate_password(value)  # Validar fortaleza de contraseña
        return value

    def validate(self, data):
        # Validar unicidad solo para el email, no para el username
        if Login.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({'email': 'Ya existe este email'})
        return data

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)

class LoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = Login
        fields = ['email', 'password']

class ParticipanteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Participante
        fields = "__all__"     
        
class TorneoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Torneo
        fields = '__all__'
        


class ConfiguracionTorneoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConfiguracionTorneo
        fields = '__all__'


class GrupoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grupo
        fields = '__all__'


class EquipoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Equipo
        fields = '__all__'


class GrupoEquipoSerializer(serializers.ModelSerializer):
    class Meta:
        model = GrupoEquipo
        fields = '__all__'


class JornadaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Jornada
        fields = '__all__'


class CalendarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Calendario
        fields = '__all__'


class ParticipanteEquipoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ParticipanteEquipo
        fields = '__all__'


class PartidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Partido
        fields = '__all__'


class ResultadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resultado
        fields = '__all__'


class ParticipantePartidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ParticipantePartido
        fields = '__all__'


class CoachSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coach
        fields = '__all__'


class CanchasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Canchas
        fields = '__all__'


class PartidoCanchaSerializer(serializers.ModelSerializer):
    class Meta:
        model = PartidoCancha
        fields = '__all__'


class ArbitroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Arbitro
        fields = '__all__'


class ArbitroPartidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArbitroPartido
        fields = '__all__'

class SancionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sancion
        fields = '__all__'

class TablaposicionesSerializer(serializers.ModelSerializer):
    class Meta: 
        model = TablaPosiciones
        fields = '__all__'

class HistorialSuspensionSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistorialSuspension
        fields = '__all__'



