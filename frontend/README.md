# Instalaciones
python -m venv env
env\Scripts\activate

pip install -r requirements.txt
django-admin startproject backend

cd backend
python manage.py startapp api

## settings.py
#### IMPORTS
from datetime import timedelta
from dotenv import load_dotenv
import os

load_dotenv()

#### ALLOWED_HOSTS
ALLOWED_HOSTS = ["*"]

#### INSTALLED APPS
'api',
'rest_framework',
'corsheaders',

#### MIDDLEWARE
'corsheaders.middleware.CorsMiddleware',

#### FINAL
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOWS_CREDENTIALS = True

# Register
### serializers.py
(crear en ./api)
UserSerializer
### views.py
createUserView
### urls.py (backend)
path('admin/', admin.site.urls),
path('api/user/register/', createUserView.as_view(), name="register"),
path('api/token/', TokenObtainPairView.as_view(), name="get_token"),
path('api/token/refresh/', TokenRefreshView.as_view(), name="refresh"),
path('api-auth/', include('rest_framework.urls')),

## Migraciones
python manage.py makemigrations
python manage.py migrate

### models.py
### serializers.py
NoteSerializer
### views.py
CRUD (Note)
### urls.py (api)
(crear nuevo en ./api)
### urls.py (backend)
path('api/', include('api.urls')),

## Migraciones
python manage.py makemigrations
python manage.py migrate

# FrontEnd
npm create vite@latest frontend -- --template react
npm install axios react-router-dom jwt-decode
crear .env

# src
vaciar App y main
crear constants.js y api.js
crear carpetas pages, components, styles
