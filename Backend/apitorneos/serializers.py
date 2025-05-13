from rest_framework import serializers
from .models import (Participante,Torneo, ConfiguracionTorneo, Grupo, Equipo, GrupoEquipo,
                     Jornada, Calendario, ParticipanteEquipo, Partido, Resultado,
                     ParticipantePartido, Coach, Canchas, PartidoCancha, Arbitro, ArbitroPartido, Sancion, TablaPosiciones,
                     HistorialSuspension)

from django.contrib.auth import get_user_model

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'username', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user
    
from django.contrib.auth import authenticate

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        # Intentar autenticar al usuario
        user = authenticate(email=data['email'], password=data['password'])
        if user is None:
            raise serializers.ValidationError("Credenciales inválidas.")
        data['user'] = user
        return data




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



