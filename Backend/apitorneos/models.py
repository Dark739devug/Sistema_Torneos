from django.db import models

from django.contrib.auth.models import BaseUserManager

class UsuarioManager(BaseUserManager):
    def create_user(self, correo, nombre, password=None, nombre_rol='Estudiante'):
        if not correo:
            raise ValueError('El usuario debe tener un correo electrónico.')
        correo = self.normalize_email(correo)
        usuario = self.model(
            correo=correo,
            nombre=nombre,
            nombre_rol=nombre_rol,
        )
        usuario.set_password(password)
        usuario.save(using=self._db)
        return usuario

    def create_superuser(self, correo, nombre, password):
        usuario = self.create_user(
            correo=correo,
            nombre=nombre,
            password=password,
            nombre_rol='Administrador'
        )
        usuario.is_staff = True
        usuario.is_superuser = True
        usuario.save(using=self._db)
        return usuario



from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin


class Usuario(AbstractBaseUser, PermissionsMixin):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    correo = models.EmailField(unique=True)
    nombre_rol = models.CharField(
        max_length=20,
        choices=[
            ('Estudiante', 'Estudiante'),
            ('Administrador', 'Administrador'),
            ('Couch', 'Couch'),
        ]
    )
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = 'correo'
    REQUIRED_FIELDS = ['nombre']

    objects = UsuarioManager()

    def __str__(self):
        return self.nombre

    class Meta:
        db_table = 'Usuario'

FASES = [
    ('Fase de grupos', 'Fase de grupos'),
    ('Semifinal', 'Semifinal'),
    ('Final', 'Final'),
    ('Finalizado', 'Finalizado')
]


class Torneo(models.Model):
    id = models.AutoField(db_column='ID_Torneo', primary_key=True)
    nombre_torneo = models.CharField(max_length=40)
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField()
    descripcion_torneo = models.TextField()
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_modificacion = models.DateTimeField(auto_now=True)
    creado_por = models.CharField(max_length=50)
    maximo_equipos = models.IntegerField()
    numero_grupos = models.IntegerField()
    fase_actual = models.CharField(max_length=20, choices=FASES)
    imagen = models.ImageField(upload_to='torneos/', blank=True, null=True)
    fecha_inicio_inscripcion = models.DateField(null=True, blank=True)
    fecha_fin_inscripcion = models.DateField(null=True, blank=True)

    class Meta:
        db_table = 'Torneo'
        managed = False

from django.db import models

from django.db import models

class BasesTorneo(models.Model):
    id = models.AutoField(db_column='ID_Base', primary_key=True)
    id_torneo = models.ForeignKey('Torneo', db_column='ID_Torneo', on_delete=models.CASCADE)
    descripcion_base = models.CharField(max_length=500)

    class Meta:
        db_table = 'Bases_Torneo'
        managed = False  

    def __str__(self):
        return f'Base {self.id} para Torneo {self.id_torneo_id}'



class AvanceFase(models.Model):
    id = models.AutoField(db_column='ID_Avance', primary_key=True)
    torneo = models.ForeignKey(Torneo, db_column='ID_Torneo', on_delete=models.CASCADE)
    fase = models.CharField(db_column='Fase', max_length=20)
    fecha_cambio = models.DateTimeField(db_column='Fecha_Cambio')
    comentario = models.CharField(db_column='Comentario', max_length=255, null=True, blank=True)

    class Meta:
        db_table = 'Avance_Fase'
        managed = False


class Grupo(models.Model):
    id = models.AutoField(db_column='ID_Grupo', primary_key=True)
    nombre_grupo = models.CharField(db_column='Nombre_Grupo', max_length=50)
    torneo = models.ForeignKey(Torneo, db_column='ID_Torneo', on_delete=models.CASCADE)

    class Meta:
        db_table = 'Grupo'
        managed = False


class Jornada(models.Model):
    id = models.AutoField(db_column='ID_Jornada', primary_key=True)
    numero_jornada = models.IntegerField(db_column='Numero_Jornada')
    fecha_inicio = models.DateField(db_column='Fecha_Inicio')
    fecha_fin = models.DateField(db_column='Fecha_Fin')
    torneo = models.ForeignKey(Torneo, db_column='ID_Torneo', on_delete=models.CASCADE)

    class Meta:
        db_table = 'Jornada'
        managed = False


class Calendario(models.Model):
    id = models.AutoField(db_column='ID_Calendario', primary_key=True)
    fecha = models.DateField(db_column='Fecha')
    dia_semana = models.CharField(db_column='Dia_Semana', max_length=10)
    jornada = models.ForeignKey(Jornada, db_column='ID_Jornada', on_delete=models.CASCADE)

    class Meta:
        db_table = 'Calendario'
        managed = False


class Horario(models.Model):
    id = models.AutoField(db_column='ID_Horario', primary_key=True)
    hora_inicio = models.TimeField(db_column='Hora_Inicio')
    hora_fin = models.TimeField(db_column='Hora_Fin')

    class Meta:
        db_table = 'Horario'
        managed = False


class CalendarioHorario(models.Model):
    id = models.AutoField(db_column='ID_Calendario_Horario', primary_key=True)
    calendario = models.ForeignKey(Calendario, db_column='ID_Calendario', on_delete=models.CASCADE)
    horario = models.ForeignKey(Horario, db_column='ID_Horario', on_delete=models.CASCADE)

    class Meta:
        db_table = 'Calendario_Horario'
        managed = False


class Cancha(models.Model):
    id = models.AutoField(db_column='ID_Cancha', primary_key=True)
    nombre_cancha = models.CharField(db_column='Nombre_Cancha', max_length=50)
    estado_cancha = models.CharField(db_column='Estado_Cancha', max_length=20, default='Desocupado')

    class Meta:
        db_table = 'Canchas'
        managed = False


class Equipo(models.Model):
    id = models.AutoField(db_column='ID_Equipo', primary_key=True)
    nombre_equipo = models.CharField(db_column='Nombre_Equipo', max_length=50)
    color_uniforme = models.CharField(db_column='Color_Uniforme', max_length=50)
    estado_equipo = models.CharField(db_column='Estado_Equipo', max_length=50)
    torneo = models.ForeignKey(Torneo, db_column='ID_Torneo', on_delete=models.CASCADE)
    grupo = models.ForeignKey(Grupo, db_column='ID_Grupo', on_delete=models.CASCADE, null=True, blank=True)
    fecha_creacion = models.DateTimeField(db_column='Fecha_Creacion')
    fecha_modificacion = models.DateTimeField(db_column='Fecha_Modificacion')
    imagen = models.ImageField(upload_to='Equipos/', blank=True, null=True)
    creado_por = models.CharField(db_column='Creado_Por', max_length=50)

    class Meta:
        db_table = 'Equipo'
        managed = False
        
class Partido(models.Model):
    id = models.AutoField(db_column='ID_Partidos', primary_key=True)
    cancha = models.ForeignKey('Cancha', db_column='ID_Cancha', null=True, on_delete=models.SET_NULL)
    fecha_partido = models.DateField(db_column='Fecha_Partido')
    jornada = models.ForeignKey('Jornada', db_column='ID_Jornada', on_delete=models.CASCADE)
    calendario = models.ForeignKey('Calendario', db_column='ID_Calendario', on_delete=models.CASCADE)
    horario = models.ForeignKey('Horario', db_column='ID_Horario', on_delete=models.CASCADE)
    equipo_local = models.ForeignKey('Equipo', db_column='Equipo_Local', related_name='equipo_local', on_delete=models.CASCADE)
    equipo_visitante = models.ForeignKey('Equipo', db_column='Equipo_Visitante', related_name='equipo_visitante', on_delete=models.CASCADE)
    fecha_creacion = models.DateTimeField(db_column='Fecha_Creacion')
    fecha_modificacion = models.DateTimeField(db_column='Fecha_Modificacion')
    creado_por = models.CharField(db_column='Creado_Por', max_length=50)

    class Meta:
        db_table = 'Partido'
        managed = False


class Inscripcion(models.Model):
    id = models.AutoField(db_column='ID_Inscripcion', primary_key=True)
    equipo = models.ForeignKey('Equipo', db_column='ID_Equipo', on_delete=models.CASCADE)
    estado = models.CharField(db_column='Estado', max_length=20)
    fecha_solicitud = models.DateTimeField(db_column='Fecha_Solicitud')

    class Meta:
        db_table = 'Inscripcion'
        managed = False


class Participante(models.Model):
    id = models.AutoField(db_column='ID_Participante', primary_key=True)
    carnet = models.CharField(db_column='Carnet', max_length=50)
    nombre_estudiante = models.CharField(db_column='Nombre_Estudiante', max_length=50)
    apellido_estudiante = models.CharField(db_column='Apellido_Estudiante', max_length=50)
    carrera_estudiante = models.CharField(db_column='Carrera_Estudiante', max_length=100)
    semestre_estudiante = models.CharField(db_column='Semestre_Estudiante', max_length=40)
    estado_activo = models.BooleanField(db_column='Estado_Activo', default=True)
    equipo = models.ForeignKey('Equipo', db_column='ID_Equipo', on_delete=models.CASCADE)

    class Meta:
        db_table = 'Participante'
        managed = False


class Tarjeta(models.Model):
    id = models.AutoField(db_column='ID_Tarjeta', primary_key=True)
    participante = models.ForeignKey('Participante', db_column='ID_Participante', on_delete=models.CASCADE)
    partido = models.ForeignKey('Partido', db_column='ID_Partidos', on_delete=models.CASCADE)
    tipo = models.CharField(db_column='Tipo', max_length=10)
    fecha_registro = models.DateTimeField(db_column='Fecha_Registro', auto_now_add=True)

    class Meta:
        db_table = 'Tarjeta'
        managed = False


class HistorialSuspension(models.Model):
    id = models.AutoField(db_column='ID_Historial', primary_key=True)
    participante = models.ForeignKey('Participante', db_column='ID_Participante', on_delete=models.CASCADE)
    fecha_suspension = models.DateField(db_column='Fecha_Suspension')
    motivo = models.CharField(db_column='Motivo', max_length=100)
    estado_antes = models.BooleanField(db_column='Estado_Antes')
    estado_despues = models.BooleanField(db_column='Estado_Despues')

    class Meta:
        db_table = 'Historial_Suspension'
        managed = False


class Resultado(models.Model):
    id = models.AutoField(db_column='ID_Resultado', primary_key=True)
    partido = models.ForeignKey('Partido', db_column='ID_Partidos', on_delete=models.CASCADE)
    equipo = models.ForeignKey('Equipo', db_column='ID_Equipo', on_delete=models.CASCADE)
    goles_equipo = models.IntegerField(db_column='Goles_Equipo')
    tarjetas_amarillas = models.IntegerField(db_column='Tarjetas_Amarillas')
    tarjetas_rojas = models.IntegerField(db_column='Tarjetas_Rojas')
    puntos_equipo = models.IntegerField(db_column='Puntos_Equipo')
    tipo_resultado = models.CharField(db_column='Tipo_Resultado', max_length=20)

    class Meta:
        db_table = 'Resultado'
        managed = False


class Goleador(models.Model):
    id = models.AutoField(db_column='ID_Goleador', primary_key=True)
    participante = models.ForeignKey('Participante', db_column='ID_Participante', on_delete=models.CASCADE)
    partido = models.ForeignKey('Partido', db_column='ID_Partido', on_delete=models.CASCADE)
    goles = models.IntegerField(db_column='Goles')

    class Meta:
        db_table = 'Goleador'
        managed = False


class TablaPosiciones(models.Model):
    id = models.AutoField(db_column='ID_Posicion', primary_key=True)
    torneo = models.ForeignKey('Torneo', db_column='ID_Torneo', on_delete=models.CASCADE)
    equipo = models.ForeignKey('Equipo', db_column='ID_Equipo', on_delete=models.CASCADE)
    partidos_jugados = models.IntegerField(db_column='Partidos_Jugados', default=0)
    ganados = models.IntegerField(db_column='Ganados', default=0)
    empatados = models.IntegerField(db_column='Empatados', default=0)
    perdidos = models.IntegerField(db_column='Perdidos', default=0)
    goles_favor = models.IntegerField(db_column='Goles_Favor', default=0)
    goles_contra = models.IntegerField(db_column='Goles_Contra', default=0)
    puntos = models.IntegerField(db_column='Puntos', default=0)

    class Meta:
        db_table = 'Tabla_Posiciones'
        managed = False


class HistorialCambiosResultado(models.Model):
    id = models.AutoField(db_column='ID_Historial', primary_key=True)
    resultado = models.ForeignKey('Resultado', db_column='ID_Resultado', on_delete=models.CASCADE)
    fecha_cambio = models.DateTimeField(db_column='Fecha_Cambio')
    modificado_por = models.CharField(db_column='Modificado_Por', max_length=50)
    detalles_cambio = models.CharField(db_column='Detalles_Cambio', max_length=255)

    class Meta:
        db_table = 'Historial_Cambios_Resultado'
        managed = False
