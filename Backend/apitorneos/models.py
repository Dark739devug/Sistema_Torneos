from django.db import models
from rest_framework import serializers

class Participante(models.Model):
    ID_participante = models.AutoField(primary_key=True)
    nombre_estudiante = models.CharField(max_length=50, db_column='Nombre_Estudiante')
    apellido_estudiante = models.CharField(max_length=50, db_column='Apellido_Estudiante')
    carrera_estudiante = models.CharField(max_length=100, db_column='Carrera_Estudiante')
    semestre_estudiante = models.CharField(max_length=40, db_column='Semestre_Estudiante')
    estado_activo = models.BooleanField(db_column='Estado_Activo', default=True, null=True)

    class Meta:
        managed = False
        db_table = 'participante'


class Torneo(models.Model):
    ID_torneo = models.AutoField(primary_key=True, db_column='ID_Torneo')
    nombre_torneo = models.CharField(max_length=40, db_column='Nombre_Torneo')
    fecha_inicio = models.DateField(db_column='Fecha_Inicio')
    fecha_fin = models.DateField(db_column='Fecha_Fin')
    descripcion_torneo = models.CharField(max_length=200, db_column='Descripcion_Torneo')
    fecha_creacion = models.DateTimeField(db_column='Fecha_Creacion', null=True, blank=True)
    fecha_modificacion = models.DateTimeField(db_column='Fecha_Modificacion', null=True, blank=True)
    creado_por = models.CharField(max_length=50, db_column='Creado_Por', null=True, blank=True)
    participante = models.ForeignKey(
        Participante, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        db_column='ID_Participante'
    )

    class Meta:
        managed = False  # Mantienes el control manual del esquema
        db_table = 'Torneo'


class ConfiguracionTorneo(models.Model):
    ID_Configuracion = models.AutoField(primary_key=True, db_column='ID_Configuracion')
    torneo = models.ForeignKey(Torneo, on_delete=models.CASCADE, db_column='ID_Torneo')
    puntos_ganado = models.IntegerField(db_column='Puntos_Ganado')
    puntos_empatado = models.IntegerField(db_column='Puntos_Empatado')
    puntos_perdido = models.IntegerField(db_column='Puntos_Perdido')
    puntos_no_presentado = models.IntegerField(db_column='Puntos_No_Presentado')
    tarjetas_amarillas_suspension = models.IntegerField(db_column='Tarjetas_Amarillas_Suspension')
    tarjetas_rojas_suspension = models.IntegerField(db_column='Tarjetas_Rojas_Suspension')

    class Meta:
        managed = False  # Mantienes el control manual del esquema
        db_table = 'Configuracion_Torneo'
        db_table = 'Configuracion_Torneo'

class Grupo(models.Model):
    ID_Grupo = models.AutoField(primary_key=True, db_column='ID_Grupo')
    nombre_grupo = models.CharField(max_length=50, db_column='Nombre_Grupo')
    torneo = models.ForeignKey(Torneo, on_delete=models.CASCADE, db_column='ID_Torneo')

    class Meta:
        managed = False  # Mantienes el control manual del esquema
        db_table = 'Grupo'

class Horario(models.Model):
    ID_Horario = models.AutoField(primary_key=True, db_column='ID_Horario')
    hora_inicio = models.TimeField(db_column='Hora_Inicio')
    hora_fin = models.TimeField(db_column='Hora_Fin')

    class Meta:
        managed = False
        db_table = 'Horario'

class Equipo(models.Model):
    ID_Equipo = models.AutoField(primary_key=True, db_column='ID_Equipo')  # Clave primaria explícita
    nombre_equipo = models.CharField(max_length=50, db_column='Nombre_Equipo')
    color_uniforme = models.CharField(max_length=50, db_column='Color_Uniforme')
    estado_equipo = models.CharField(max_length=50, db_column='Estado_Equipo')
    foto_equipo = models.CharField(max_length=40, db_column='Foto_Equipo')
    capitan = models.ForeignKey(Participante, on_delete=models.SET_NULL, null=True, db_column='ID_Capitan')
    torneo = models.ForeignKey(Torneo, on_delete=models.SET_NULL, null=True, db_column='ID_Torneo')

    class Meta:
        managed = False
        db_table = 'Equipo'

class GrupoEquipo(models.Model):
    ID_Grupo = models.ForeignKey(Grupo, on_delete=models.CASCADE, db_column='ID_Grupo')
    ID_Equipo = models.ForeignKey(Equipo, on_delete=models.CASCADE, db_column='ID_Equipo')

    class Meta:
        managed = False
        db_table = 'Grupo_Equipo'
        unique_together = (('ID_Grupo', 'ID_Equipo'),)
        
class Jornada(models.Model):
    ID_Jornada = models.AutoField(primary_key=True, db_column='ID_Jornada')  # Clave primaria explícita
    numero_jornada = models.IntegerField(db_column='Numero_Jornada')
    fecha_inicio = models.DateField(db_column='Fecha_Inicio')
    fecha_fin = models.DateField(db_column='Fecha_Fin')
    torneo = models.ForeignKey(Torneo, on_delete=models.CASCADE, db_column='ID_Torneo')

    class Meta:
        managed = False
        db_table = 'Jornada'


class Calendario(models.Model):
    ID_Calendario = models.AutoField(primary_key=True, db_column='ID_Calendario')
    fecha_inicio = models.DateField(db_column='Fecha_Inicio')
    dia_semana = models.CharField(max_length=20, db_column='Dia_Semana')
    hora = models.DateTimeField(db_column='Hora')
    jornada = models.ForeignKey(Jornada, on_delete=models.SET_NULL, null=True, db_column='ID_Jornada')

    class Meta:
        managed = False
        db_table = 'Calendario'

class ParticipanteEquipo(models.Model):
    participante = models.ForeignKey(Participante, on_delete=models.CASCADE, db_column='ID_Participante')
    equipo = models.ForeignKey(Equipo, on_delete=models.CASCADE, db_column='ID_Equipo')
    es_capitan = models.BooleanField(db_column='Es_Capitan', default=False)

    class Meta:
        managed = False
        db_table = 'Participante_Equipo'
        unique_together = (('participante', 'equipo'),)

class Partido(models.Model):
    ID_Partidos = models.AutoField(primary_key=True, db_column='ID_Partidos')
    fecha_partido = models.DateField(db_column='Fecha_Partido')
    hora_partido = models.TimeField(db_column='Hora_Partido')
    jornada = models.ForeignKey(Jornada, on_delete=models.CASCADE, db_column='ID_Jornada')
    calendario = models.ForeignKey(Calendario, on_delete=models.CASCADE, db_column='ID_Calendario')
    horario = models.ForeignKey(Horario, on_delete=models.SET_NULL, null=True, db_column='ID_Horario')

    class Meta:
        managed = False
        db_table = 'Partido'

class Resultado(models.Model):
    ID_Resultado = models.AutoField(primary_key=True, db_column='ID_Resultado')
    puntos_equipo = models.IntegerField(db_column='Puntos_Equipo')
    tarjetas_amarillas = models.IntegerField(db_column='Tarjetas_Amarillas')
    tarjetas_rojas = models.IntegerField(db_column='Tarjetas_Rojas')
    goles_equipo = models.IntegerField(db_column='Goles_Equipo')
    partido = models.ForeignKey(Partido, on_delete=models.CASCADE, db_column='ID_Partidos')
    equipo = models.ForeignKey(Equipo, on_delete=models.CASCADE, db_column='ID_Equipo')

    class Meta:
        managed = False
        db_table = 'Resultado'

class ParticipantePartido(models.Model):
    participante = models.ForeignKey(
        Participante, 
        on_delete=models.CASCADE, 
        db_column='ID_Participante'
    )
    partido = models.ForeignKey(
        Partido, 
        on_delete=models.CASCADE, 
        db_column='ID_Partidos'
    )

    class Meta:
        managed = False
        db_table = 'Participante_Partido'
        unique_together = (('participante', 'partido'),)  # Esto crea la clave compuesta

class Coach(models.Model):
    ID_Coach = models.AutoField(primary_key=True, db_column='ID_Coach')
    nombre_coach = models.CharField(max_length=50, db_column='Nombre_Coach')
    puntos_coach1 = models.IntegerField(db_column='Puntos_Coach1')
    puntos_coach2 = models.IntegerField(db_column='Puntos_Coach2')
    estado_partido = models.CharField(max_length=50, db_column='Estado_Partido')
    participante = models.ForeignKey(Participante, on_delete=models.SET_NULL, null=True, db_column='ID_Participante')
    partido = models.ForeignKey(Partido, on_delete=models.SET_NULL, null=True, db_column='ID_Partidos')

    class Meta:
        managed = True
        db_table = 'Coach'

class Canchas(models.Model):
    ID_Cancha = models.AutoField(primary_key=True, db_column='ID_Cancha')
    nombre_cancha = models.CharField(max_length=50, db_column='Nombre_Cancha')
    estado_cancha = models.CharField(max_length=50, db_column='Estado_Cancha')

    class Meta:
        managed = False
        db_table = 'Canchas'


class PartidoCancha(models.Model):
    id_partidos = models.ForeignKey(Partido, on_delete=models.CASCADE, db_column='ID_Partidos')
    id_cancha = models.ForeignKey(Canchas, on_delete=models.CASCADE, db_column='ID_Cancha')

    class Meta:
        managed = False
        db_table = 'Partido_Cancha'
        unique_together = (('id_partidos', 'id_cancha'),)


class Arbitro(models.Model):
    id_arbitro = models.AutoField(db_column='ID_Arbitro', primary_key=True)  # Field name made lowercase.
    nombre_arbitro = models.CharField(db_column='Nombre_Arbitro', max_length=100, db_collation='utf8mb3_general_ci', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'arbitro'


class ArbitroPartido(models.Model):
    id_arbitro = models.ForeignKey(Arbitro, on_delete=models.CASCADE, db_column='ID_Arbitro')
    id_partido = models.ForeignKey(Partido, on_delete=models.CASCADE, db_column='ID_Partido')

    class Meta:
        managed = False
        db_table = 'Arbitro_Partido'
        unique_together = (('id_arbitro', 'id_partido'),)

class Sancion(models.Model):
    ID_Sancion = models.AutoField(primary_key=True, db_column='ID_Sancion')
    participante = models.ForeignKey(Participante, on_delete=models.CASCADE, db_column='ID_Participante')
    tipo = models.CharField(max_length=20, db_column='Tipo', choices=[('Amarilla', 'Amarilla'), ('Roja', 'Roja')])
    partido = models.ForeignKey(Partido, on_delete=models.CASCADE, db_column='ID_Partido')
    fecha_Sancion = models.DateField(db_column='Fecha_Sancion')

    class Meta:
        managed = False
        db_table = 'Sancion'  

class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class AuthUser(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.IntegerField()
    username = models.CharField(unique=True, max_length=150)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.CharField(max_length=254)
    is_staff = models.IntegerField()
    is_active = models.IntegerField()
    date_joined = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'auth_user'


class AuthUserGroups(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_groups'
        unique_together = (('user', 'group'),)


class AuthUserUserPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_user_permissions'
        unique_together = (('user', 'permission'),)

class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.PositiveSmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'django_admin_log'

class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    id = models.BigAutoField(primary_key=True)
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'

class TablaPosiciones(models.Model):
    id_posicion = models.AutoField(db_column='ID_Posicion', primary_key=True)  # Field name made lowercase.
    id_torneo = models.ForeignKey('Torneo', models.DO_NOTHING, db_column='ID_Torneo', blank=True, null=True)  # Field name made lowercase.
    id_equipo = models.ForeignKey(Equipo, models.DO_NOTHING, db_column='ID_Equipo', blank=True, null=True)  # Field name made lowercase.
    partidos_jugados = models.IntegerField(db_column='Partidos_Jugados', blank=True, null=True)  # Field name made lowercase.
    ganados = models.IntegerField(db_column='Ganados', blank=True, null=True)  # Field name made lowercase.
    empatados = models.IntegerField(db_column='Empatados', blank=True, null=True)  # Field name made lowercase.
    perdidos = models.IntegerField(db_column='Perdidos', blank=True, null=True)  # Field name made lowercase.
    goles_favor = models.IntegerField(db_column='Goles_Favor', blank=True, null=True)  # Field name made lowercase.
    goles_contra = models.IntegerField(db_column='Goles_Contra', blank=True, null=True)  # Field name made lowercase.
    puntos = models.IntegerField(db_column='Puntos', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'tabla_posiciones'
        

class HistorialSuspension(models.Model):
    id_historial = models.AutoField(db_column='ID_Historial', primary_key=True)  # Field name made lowercase.
    id_participante = models.ForeignKey('Participante', models.DO_NOTHING, db_column='ID_Participante', blank=True, null=True)  # Field name made lowercase.
    fecha_suspension = models.DateField(db_column='Fecha_Suspension', blank=True, null=True)  # Field name made lowercase.
    motivo = models.CharField(db_column='Motivo', max_length=100, db_collation='utf8mb3_general_ci', blank=True, null=True)  # Field name made lowercase.
    estado_antes = models.TextField(db_column='Estado_Antes', blank=True, null=True)  # Field name made lowercase. This field type is a guess.
    estado_despues = models.TextField(db_column='Estado_Despues', blank=True, null=True)  # Field name made lowercase. This field type is a guess.

    class Meta:
        managed = False
        db_table = 'historial_suspension'

class HistorialCambiosResultado(models.Model):
    id_historial = models.AutoField(db_column='ID_Historial', primary_key=True)  # Field name made lowercase.
    id_resultado = models.ForeignKey('Resultado', models.DO_NOTHING, db_column='ID_Resultado', blank=True, null=True)  # Field name made lowercase.
    fecha_cambio = models.DateTimeField(db_column='Fecha_Cambio', blank=True, null=True)  # Field name made lowercase.
    modificado_por = models.CharField(db_column='Modificado_Por', max_length=50, db_collation='utf8mb3_general_ci', blank=True, null=True)  # Field name made lowercase.
    detalles_cambio = models.CharField(db_column='Detalles_Cambio', max_length=255, db_collation='utf8mb3_general_ci', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'historial_cambios_resultado'

class Goleador(models.Model):
    id_goleador = models.AutoField(db_column='ID_Goleador', primary_key=True)  # Field name made lowercase.
    id_participante = models.ForeignKey('Participante', models.DO_NOTHING, db_column='ID_Participante', blank=True, null=True)  # Field name made lowercase.
    id_partido = models.ForeignKey('Partido', models.DO_NOTHING, db_column='ID_Partido', blank=True, null=True)  # Field name made lowercase.
    goles = models.IntegerField(db_column='Goles', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'goleador'


class Login(models.Model):
    id_login = models.AutoField(db_column='ID_Login', primary_key=True)  # Field name made lowercase.
    nombre_usuario = models.CharField(db_column='Nombre_Usuario', max_length=50, db_collation='utf8mb3_general_ci', blank=True, null=True)  # Field name made lowercase.
    contraseña_hash = models.CharField(db_column='Contrase±a_Hash', max_length=255, db_collation='utf8mb3_general_ci', blank=True, null=True)  # Field name made lowercase.
    tipo_usuario = models.CharField(db_column='Tipo_Usuario', max_length=50, db_collation='utf8mb3_general_ci', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'login'
