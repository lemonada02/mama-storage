from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Persona, Archivo
import os

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
        extra_kwargs = {"password": {"required": True}}
        
    def create(self, validated_data):
        print(validated_data)
        user = User.objects.create_user(**validated_data)
        return user

class PersonaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Persona
        fields = "__all__"
        extra_kwargs = {"usuario": {"read_only": True}}

    def create(self, validated_data):
        print(validated_data)
        persona = Persona.objects.create(**validated_data)
        return persona

    def update(self, instance, validated_data):
        instance.nombre = validated_data.get("nombre", instance.nombre)
        instance.apellidos = validated_data.get("apellidos", instance.apellidos)
        instance.fecha_nacimiento = validated_data.get("fecha_nacimiento", instance.fecha_nacimiento)
        instance.nie = validated_data.get("nie", instance.nie)
        instance.direccion = validated_data.get("direccion", instance.direccion)
        instance.telefono = validated_data.get("telefono", instance.telefono)
        instance.tiempo_marchena = validated_data.get("tiempo_marchena", instance.tiempo_marchena)
        instance.tiempo_espana = validated_data.get("tiempo_espana", instance.tiempo_espana)
        instance.nivel_espanol = validated_data.get("nivel_espanol", instance.nivel_espanol)
        instance.nivel_estudios = validated_data.get("nivel_estudios", instance.nivel_estudios)
        instance.situacion_laboral = validated_data.get("situacion_laboral", instance.situacion_laboral)
        instance.profesion = validated_data.get("profesion", instance.profesion)
        instance.familiares = validated_data.get("familiares", instance.familiares)
        instance.tipo_vivienda = validated_data.get("tipo_vivienda", instance.tipo_vivienda)
        instance.comparte_vivienda = validated_data.get("comparte_vivienda", instance.comparte_vivienda)
        instance.respuesta = validated_data.get("respuesta", instance.respuesta)
        instance.derivacion = validated_data.get("derivacion", instance.derivacion)
        instance.asistencias = validated_data.get("asistencias", instance.asistencias)
        instance.save()
        return instance

class ArchivoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Archivo
        fields = "__all__"

    def create(self, validated_data):
        archivo = Archivo.objects.create(**validated_data)
        return archivo
        
    def update(self, instance, validated_data):
        instance.nombre = validated_data.get("nombre", instance.nombre)
        
        archivo = validated_data.pop('archivo', None)
        
        if archivo:
            # Elimina el archivo antiguo si existe
            if instance.archivo and os.path.isfile(instance.archivo.path):
                os.remove(instance.archivo.path)
            
            # Guarda el nuevo archivo
            instance.archivo.save(archivo.name, archivo)
        
        instance.save()
        return instance