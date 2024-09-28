from .base import *
from datetime import timedelta

DEBUG = True
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
INTERNAL_IPS="127.0.0.1"
ALLOWED_HOSTS = ['127.0.0.1', 'localhost']


# Seguridad con axes
AXES_FAILURE_LIMIT = 5  # Número de intentos fallidos antes del bloqueo
AXES_COOLOFF_TIME = timedelta(minutes=10)  # Tiempo de espera antes de intentar de nuevo
AXES_LOCKOUT_TEMPLATE = 'lockout.html'  # Plantilla para la página de bloqueo (opcional)
AXES_RESET_ON_SUCCESS = True  # Restablecer el contador de intentos fallidos tras un inicio de sesión exitoso

# Compresión de archivos estáticos
COMPRESS_ENABLED = False
COMPRESS_OFFLINE = False
COMPRESS_ROOT=''

# Carpeta donde guardar los archivos estáticos
STATIC_URL = 'static/'

# Configuración de archivos multimedia
MEDIA_URL = '/media/'

