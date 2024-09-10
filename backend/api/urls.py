from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("personas/list/", views.PersonaListCreate.as_view(), name="persona-list"),
    path("personas/detail/<int:pk>/", views.PersonaDetail.as_view(), name="detail-persona"),
    path("personas/update/<int:pk>/", views.PersonaUpdate.as_view(), name="update-persona"),
    path("personas/delete/<int:pk>/", views.PersonaDelete.as_view(), name="delete-persona"),
    
    path("archivos/list/", views.ArchivoListCreate.as_view(), name="archivo-list"),
    path("archivos/update/<int:pk>/", views.ArchivoUpdate.as_view(), name="update-archivo"),
    path("archivos/delete/<int:pk>/", views.ArchivoDelete.as_view(), name="delete-archivo"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
