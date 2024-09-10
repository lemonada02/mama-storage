from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import UserSerializer, PersonaSerializer, ArchivoSerializer
from .models import Persona, Archivo
from django.contrib.auth.models import User
import os

# User --> eliminar
class CreateUserView(generics.CreateAPIView): 
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class UserList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

# Persona
class PersonaListCreate(generics.ListCreateAPIView):
    serializer_class = PersonaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Persona.objects.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

class PersonaDetail(generics.RetrieveAPIView):
    serializer_class = PersonaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Persona.objects.filter(usuario=self.request.user)

class PersonaDelete(generics.DestroyAPIView):
    serializer_class = PersonaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Persona.objects.filter(usuario=self.request.user)
    
    def perform_destroy(self, instance):
        # Eliminar los archivos asociados a la persona
        archivos = Archivo.objects.filter(persona=instance)
        for archivo in archivos:
            if archivo.archivo and os.path.isfile(archivo.archivo.path):
                os.remove(archivo.archivo.path)
            archivo.delete()  # Eliminar el registro en la base de datos

        # Eliminar la instancia de Persona
        instance.delete()

class PersonaUpdate(generics.UpdateAPIView):
    serializer_class = PersonaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Persona.objects.filter(usuario=self.request.user)
    
# Archivo
class ArchivoListCreate(generics.ListCreateAPIView):
    serializer_class = ArchivoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Archivo.objects.filter(persona__usuario=self.request.user)

    def perform_create(self, serializer):
        # Obtener la primera instancia de Persona asociada al usuario
        persona_id = self.request.data.get('persona')
        persona = Persona.objects.filter(id= persona_id,usuario=self.request.user).first()
        if persona:
            serializer.save(persona=persona)
        else:
            # Manejo si no se encuentra ninguna instancia de Persona
            raise Exception("No se encontró ninguna instancia de Persona para el usuario.")



class ArchivoDelete(generics.DestroyAPIView):
    serializer_class = ArchivoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Archivo.objects.filter(persona__usuario=self.request.user)

class ArchivoUpdate(generics.UpdateAPIView):
    serializer_class = ArchivoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Archivo.objects.filter(persona__usuario=self.request.user)
    
    def update(self, request, *args, **kwargs):
        instance = self.get_object()  # Obtiene la instancia del objeto a actualizar
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        # Eliminar el archivo antiguo si se está subiendo uno nuevo
        if 'archivo' in request.FILES:
            old_file = instance.archivo
            if old_file and os.path.isfile(old_file.path):
                os.remove(old_file.path)

        self.perform_update(serializer)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def perform_update(self, serializer):
        serializer.save()
