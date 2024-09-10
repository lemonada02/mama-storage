from django.db import models
from django.contrib.auth.models import User
import os

class Persona(models.Model):
    nombre = models.CharField(max_length=100)
    apellidos = models.CharField(max_length=100)
    fecha_nacimiento = models.DateField()
    nie = models.CharField(max_length=20, unique=True)
    direccion = models.CharField(max_length=255, blank=True, null=True)
    telefono = models.IntegerField(blank=True, null=True)
    tiempo_marchena = models.IntegerField()
    tiempo_espana = models.IntegerField()
    nivel_espanol = models.CharField(max_length=50)
    nivel_estudios = models.CharField(max_length=100)
    situacion_laboral = models.CharField(max_length=100)
    profesion = models.CharField(max_length=100, blank=True, null=True)
    familiares = models.CharField(max_length=255, blank=True, null=True)
    tipo_vivienda = models.CharField(max_length=100, blank=True, null=True)
    comparte_vivienda = models.CharField(max_length=100, blank=True, null=True)
    respuesta = models.TextField(blank=True, null=True)
    derivacion = models.TextField(blank=True, null=True)
    asistencias = models.TextField()  
    usuario = models.ForeignKey(User, on_delete=models.CASCADE) 
    
    def __str__(self):
        return f'{self.nombre} {self.apellidos}'

class Archivo(models.Model):
    nombre = models.CharField(max_length=255)
    archivo = models.FileField(upload_to='archivos/')
    persona = models.ForeignKey(Persona, on_delete=models.CASCADE)

    def __str__(self):
        return f'Archivos {self.nombre} de {self.persona.nombre} {self.persona.apellidos}'

    def delete(self, *args, **kwargs):
        # Verifica si el archivo existe antes de intentar eliminarlo
        if self.archivo and os.path.isfile(self.archivo.path):
            os.remove(self.archivo.path)
        super().delete(*args, **kwargs)

    def save(self, *args, **kwargs):
        # Llama a la función de guardado del padre primero
        super().save(*args, **kwargs)
        
        # Si el objeto tiene una instancia antigua, elimina el archivo viejo
        if self.pk:  
            old_instance = Archivo.objects.filter(pk=self.pk).first()
            if old_instance and old_instance.archivo != self.archivo:
                if old_instance.archivo and os.path.isfile(old_instance.archivo.path):
                    os.remove(old_instance.archivo.path)
