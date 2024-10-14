from django.apps import AppConfig


class AdminConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'customAdmin'
    
class CustomAxesConfig(AppConfig):
    name = 'axes' 
    verbose_name = 'Seguridad autenticación'
