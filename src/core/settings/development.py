from .base import *

DEBUG = True
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
ALLOWED_HOSTS = ['127.0.0.1', 'localhost']

INTERNAL_IPS = ['127.0.0.1', '172.18.0.1']

# Compresión de archivos estáticos
COMPRESS_ENABLED = False
COMPRESS_OFFLINE = False
COMPRESS_ROOT=''

# Carpeta donde guardar los archivos estáticos
STATIC_URL = 'static/'

# Configuración de archivos multimedia
MEDIA_URL = '/media/'

