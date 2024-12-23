from .base import *
import sentry_sdk


DEBUG = False
#GOOGLE_ANALYTICS_JS_PROPERTY_ID = 'UA-XXXXXXXX-X'  
#GOOGLE_ANALYTICS_GTAG_PROPERTY_ID = 'UA-XXXXXXXX-X'  

ALLOWED_HOSTS = ['domain.com', 'www.domain.com']

# Compresión de archivos estáticos
COMPRESS_ENABLED = True
COMPRESS_OFFLINE = True

# ------ Configuración de Amazon S3 --------
AWS_ACCESS_KEY_ID = config('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = config('AWS_SECRET_ACCESS_KEY')
AWS_STORAGE_BUCKET_NAME = config('AWS_STORAGE_BUCKET_NAME')
AWS_DEFAULT_ACL = 'public-read'
AWS_S3_CUSTOM_DOMAIN = f'{AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com'
AWS_S3_OBJECT_PARAMETERS = {'CacheControl': 'max-age=86400'}

# s3 static settings
STATIC_LOCATION = 'static'
STATIC_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/{STATIC_LOCATION}/'
STATICFILES_STORAGE = 'storages.backends.s3.S3Boto3'

# s3 public media settings
PUBLIC_MEDIA_LOCATION = 'media'
MEDIA_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/{PUBLIC_MEDIA_LOCATION}/'
DEFAULT_FILE_STORAGE = 'storages.backends.s3.S3Boto3'


# -------- REDIS --------
# Configuración de sesiones
# SESSION_ENGINE = "django.contrib.sessions.backends.cache"
# SESSION_CACHE_ALIAS = "default"

# # Configuración de caché
# CACHES = {
#     "default": {
#         "BACKEND": "django_redis.cache.RedisCache",
#         "LOCATION": "redis://127.0.0.1:6379/1",  # Cambia la ubicación según sea necesario
#         "OPTIONS": {
#             "CLIENT_CLASS": "django_redis.client.DefaultClient",
#         }
#     }
# }

# Control de errores con sentry
sentry_sdk.init(
    dsn="https://2e33aaee75ca0726a7e8401d5c4a2b09@o4507995828256768.ingest.de.sentry.io/4507995832516688",
    # Set traces_sample_rate to 1.0 to capture 100%
    # of transactions for tracing.
    traces_sample_rate=1.0,
    # Set profiles_sample_rate to 1.0 to profile 100%
    # of sampled transactions.
    # We recommend adjusting this value in production.
    profiles_sample_rate=1.0,
)
