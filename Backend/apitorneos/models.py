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
