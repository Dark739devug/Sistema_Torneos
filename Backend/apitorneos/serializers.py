
from .models import (Usuario, Torneo,AvanceFase, Grupo, Jornada, Calendario, Horario,
                    CalendarioHorario, Equipo, Cancha, Partido,
                    Inscripcion, Participante, Tarjeta, HistorialSuspension,
                        Resultado, Goleador, TablaPosiciones, HistorialCambiosResultado
                    , BasesTorneo)
                     
from rest_framework import serializers

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer



    

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    correo = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        # Toma los datos originales
        correo = attrs.get('correo')
        password = attrs.get('password')

        # Renombra 'correo' a 'username' en el diccionario
        attrs['username'] = correo

        # Llama a la validación original de SimpleJWT con los nombres que espera ('username' y 'password')
        data = super().validate(attrs)

        # Añade información adicional al token
        usuario = self.user  # El usuario autenticado que SimpleJWT encontró
        data['nombre'] = usuario.nombre
        data['rol'] = usuario.nombre_rol

        return data

class BasesTorneoSerializer(serializers.ModelSerializer):
    class Meta:
        model = BasesTorneo
        fields = ['id', 'descripcion_base', 'id_torneo']
        extra_kwargs = {
            'id_torneo': {'write_only': True} 
        }

class TorneoSerializer(serializers.ModelSerializer):
    bases = BasesTorneoSerializer(many=True, source='basestorneo_set', read_only=True)  # 👈 Campo solo de lectura

    class Meta:
        model = Torneo
        fields = '__all__'


class AvanceFaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = AvanceFase
        fields = '__all__'

class GrupoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grupo
        fields = '__all__'

class JornadaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Jornada
        fields = '__all__'

class CalendarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Calendario
        fields = '__all__'

class HorarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Horario
        fields = '__all__'

class CalendarioHorarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = CalendarioHorario
        fields = '__all__'

class EquipoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Equipo
        fields = '__all__'

class CanchaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cancha
        fields = '__all__'

class PartidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Partido
        fields = '__all__'

class InscripcionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inscripcion
        fields = '__all__'

class ParticipanteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Participante
        fields = '__all__'

class TarjetaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tarjeta
        fields = '__all__'

class HistorialSuspensionSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistorialSuspension
        fields = '__all__'

class ResultadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resultado
        fields = '__all__'

class GoleadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Goleador
        fields = '__all__'

class TablaPosicionesSerializer(serializers.ModelSerializer):
    class Meta:
        model = TablaPosiciones
        fields = '__all__'

class HistorialCambiosResultadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistorialCambiosResultado
        fields = '__all__'
