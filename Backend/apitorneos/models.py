from django.db import models
from rest_framework import serializers

class Participante(models.Model):
    id_participante = models.IntegerField(primary_key=True, db_column='ID_Participante')
    nombre_estudiante = models.CharField(max_length=50, db_column='Nombre_Estudiante')
    apellido_estudiante = models.CharField(max_length=50, db_column='Apellido_Estudiante')
    carrera_estudiante = models.CharField(max_length=100, db_column='Carrera_Estudiante')
    semestre_estudiante = models.CharField(max_length=40, db_column='Semestre_Estudiante')
    estado_activo = models.BooleanField(db_column='Estado_Activo', default=True, null=True)

    class Meta:
        managed = False
        db_table = 'participante'


class Torneo(models.Model):
    nombre_torneo = models.CharField(max_length=40, db_column='Nombre_Torneo')
    fecha_inicio = models.DateField(db_column='Fecha_inicio')
    fecha_fin = models.DateField(db_column='Fecha_Fin')
    descripcion_torneo = models.CharField(max_length=200, db_column='Descripcion_Torneo')
    inscripcion_equipo = models.CharField(max_length=50, db_column='Inscripcion_Equipo')
    participante = models.ForeignKey(Participante, on_delete=models.SET_NULL, null=True, db_column='ID_Participante')

    class Meta:
        managed = False
        db_table = 'Torneo'

class ConfiguracionTorneo(models.Model):
    torneo = models.ForeignKey(Torneo, on_delete=models.CASCADE, db_column='ID_Torneo')
    puntos_ganado = models.IntegerField(db_column='Puntos_Ganado')
    puntos_empatado = models.IntegerField(db_column='Puntos_Empatado')
    puntos_perdido = models.IntegerField(db_column='Puntos_Perdido')
    puntos_no_presentado = models.IntegerField(db_column='Puntos_No_Presentado')
    tarjetas_amarillas_suspension = models.IntegerField(db_column='Tarjetas_Amarillas_Suspension')
    tarjetas_rojas_suspension = models.IntegerField(db_column='Tarjetas_Rojas_Suspension')

    class Meta:
        managed = False
        db_table = 'Configuracion_Torneo'

class Grupo(models.Model):
    nombre_grupo = models.CharField(max_length=50, db_column='Nombre_Grupo')
    torneo = models.ForeignKey(Torneo, on_delete=models.CASCADE, db_column='ID_Torneo')

    class Meta:
        managed = False
        db_table = 'Grupo'

class Equipo(models.Model):
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
    grupo = models.ForeignKey(Grupo, on_delete=models.CASCADE, db_column='ID_Grupo')
    equipo = models.ForeignKey(Equipo, on_delete=models.CASCADE, db_column='ID_Equipo')

    class Meta:
        managed = False
        db_table = 'Grupo_Equipo'
        unique_together = (('grupo', 'equipo'),)

class Jornada(models.Model):
    numero_jornada = models.IntegerField(db_column='Numero_Jornada')
    fecha_inicio = models.DateField(db_column='Fecha_Inicio')
    fecha_fin = models.DateField(db_column='Fecha_Fin')
    torneo = models.ForeignKey(Torneo, on_delete=models.CASCADE, db_column='ID_Torneo')

    class Meta:
        managed = False
        db_table = 'Jornada'

class Calendario(models.Model):
    fecha_inicio = models.DateField(db_column='Fecha_Inicio')
    dia_semana = models.CharField(max_length=20, db_column='Dia_Semana')
    hora = models.DateTimeField(db_column='Hora')

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
    fecha_partido = models.DateField(db_column='Fecha_Partido')
    hora_partido = models.TimeField(db_column='Hora_Partido')
    jornada = models.ForeignKey(Jornada, on_delete=models.CASCADE, db_column='ID_Jornada')
    calendario = models.ForeignKey(Calendario, on_delete=models.CASCADE, db_column='ID_Calendario')

    class Meta:
        managed = False
        db_table = 'Partido'

class Resultado(models.Model):
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
    participante = models.ForeignKey(Participante, on_delete=models.CASCADE, db_column='ID_Participante')
    partido = models.ForeignKey(Partido, on_delete=models.CASCADE, db_column='ID_Partidos')

    class Meta:
        managed = False
        db_table = 'Participante_Partido'
        unique_together = (('participante', 'partido'),)

class Coach(models.Model):
    nombre_coach = models.CharField(max_length=50, db_column='Nombre_Coach')
    puntos_coach1 = models.IntegerField(db_column='Puntos_Coach1')
    puntos_coach2 = models.IntegerField(db_column='Puntos_Coach2')
    estado_partido = models.CharField(max_length=50, db_column='Estado_Partido')
    participante = models.ForeignKey(Participante, on_delete=models.SET_NULL, null=True, db_column='ID_Participante')
    partido = models.ForeignKey(Partido, on_delete=models.SET_NULL, null=True, db_column='ID_Partidos')

    class Meta:
        managed = False
        db_table = 'Coach'

class Canchas(models.Model):
    nombre_cancha = models.CharField(max_length=50, db_column='Nombre_Cancha')
    estado_cancha = models.CharField(max_length=50, db_column='Estado_Cancha')

    class Meta:
        managed = False
        db_table = 'Canchas'

class PartidoCancha(models.Model):
    partido = models.ForeignKey(Partido, on_delete=models.CASCADE, db_column='ID_Partidos')
    cancha = models.ForeignKey(Canchas, on_delete=models.CASCADE, db_column='ID_Cancha')

    class Meta:
        managed = False
        db_table = 'Partido_Cancha'
        unique_together = (('partido', 'cancha'),)

class Arbitro(models.Model):
    nombre_arbitro = models.CharField(max_length=100, db_column='Nombre_Arbitro')

    class Meta:
        managed = False
        db_table = 'Arbitro'

class ArbitroPartido(models.Model):
    arbitro = models.ForeignKey(Arbitro, on_delete=models.CASCADE, db_column='ID_Arbitro')
    partido = models.ForeignKey(Partido, on_delete=models.CASCADE, db_column='ID_Partido')

    class Meta:
        managed = False
        db_table = 'Arbitro_Partido'
        unique_together = (('arbitro', 'partido'),)

class Sancion(models.Model):
    participante = models.ForeignKey(Participante, on_delete=models.CASCADE, db_column='ID_Participante')
    tipo = models.CharField(max_length=20, db_column='Tipo', choices=[('Amarilla', 'Amarilla'), ('Roja', 'Roja')])
    partido = models.ForeignKey(Partido, on_delete=models.CASCADE, db_column='ID_Partido')
    fecha_sancio = models.DateField(db_column='Fecha_Sancio')

    class Meta:
        managed = False
        db_table = 'Sanción'