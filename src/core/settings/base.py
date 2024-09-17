
from pathlib import Path
from decouple import config #decouple


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = config('SECRET_KEY')

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # All-Auth
    'django.contrib.sites',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',
    'allauth.socialaccount.providers.facebook',
    'allauth.socialaccount.providers.apple',  
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'

# All-Auth
SITE_ID = 1

AUTHENTICATION_BACKENDS = [
    # Necesario para permitir la autenticación por nombre de usuario en Django admin
    'django.contrib.auth.backends.ModelBackend',
    
    # Backend de autenticación de Django Allauth
    'allauth.account.auth_backends.AuthenticationBackend',
]
   
# ----- Condiguracion all-auth --------

# Urls
LOGIN_REDIRECT_URL = '/'        # Redirigir después de iniciar sesión
LOGOUT_REDIRECT_URL = "/"       # Redirigir después de cerrar sesión

# Si se debe verificar el email para activar la cuenta
ACCOUNT_EMAIL_VERIFICATION = 'mandatory'  # Opciones: 'none', 'optional', 'mandatory'

# Configurar cómo se maneja el email como nombre de usuario
ACCOUNT_USERNAME_REQUIRED = False  # Si el nombre de usuario es requerido
ACCOUNT_EMAIL_REQUIRED = True     # Si el email es requerido
ACCOUNT_UNIQUE_EMAIL = True       # Si el email debe ser único
ACCOUNT_CHANGE_EMAIL = True       # Permitir solo una cuenta de email   

# Permitir login con email
ACCOUNT_AUTHENTICATION_METHOD = 'email'

#Cokkies 
ACCOUNT_SESSION_REMEMBER = True     # Permite mantener la sesión válida un tiempo
SESSION_COOKIE_AGE = 60 * 60 * 24 * 30  # 30 días duración cookies
SESSION_COOKIE_SECURE = True        # Seguridad solo permmitir https
SESSION_SAVE_EVERY_REQUEST = True

# Database
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
