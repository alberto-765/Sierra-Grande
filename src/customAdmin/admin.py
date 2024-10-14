from django.contrib.admin import AdminSite
from axes.models import AccessAttempt, AccessLog, AccessFailureLog
from allauth.account.models import EmailAddress
from allauth.socialaccount.models import SocialAccount, SocialToken, SocialApp
from django.contrib.auth.models import User, Group

class MyAdminSite(AdminSite):
    site_title = "Sierra Grande de Hornachos" 
    site_header = "Sierra Grande de Hornachos" # Principal header admin panel
    index_title = "Bienvenido al panel de administración" # Window chrome title
    
    def get_app_list(self, request) -> None:
        """
        List for nav tab
        """
        
        app_list = super().get_app_list(request)

        # Lista para almacenar los modelos de allauth y auth
        grouped_models = []

        # Lista para almacenar todas las demás apps
        other_apps = []

        # Recorre las apps y modelos
        for app in app_list:
            # Filtra los modelos de allauth y auth
            if app['app_label'] in ['account', 'auth', 'socialaccount']:
                for model in app['models']:
                    grouped_models.append(model)
            else:
                # Añade las aplicaciones no modificadas
                other_apps.append(app)

        # Crea un nuevo grupo para los modelos de allauth y auth
        combined_app = {
            'name': 'Autenticación y autorización',
            'app_label': 'auth_group',
            'models': grouped_models
        }

        # Inserta el grupo de administración general al inicio de la lista de apps
        return [combined_app] + other_apps
    
# Intance de admin site
my_admin_site = MyAdminSite(name="myadmin")
    


#Custom model to axes
class CustomAccessAttempt(AccessAttempt):
    class Meta:
        proxy = True
        app_label = 'axes'
        verbose_name = "Intento de acceso"
        verbose_name_plural = "Intentos de accesos"
        
class CustomAccessLog(AccessLog):
    class Meta: 
        proxy = True
        app_label = 'axes'
        verbose_name = "Registro de acceso"
        verbose_name_plural = "Registro de accesos"
        
class CustomAccessFailureLog(AccessFailureLog):
    class Meta: 
        proxy = True
        app_label = 'axes'
        verbose_name = "Acceso fallido"
        verbose_name_plural = "Accesos fallidos"
    
    
    
    
# Regist all models off libraries    
my_admin_site.register(EmailAddress)
my_admin_site.register(SocialAccount)    
my_admin_site.register(SocialToken)    
my_admin_site.register(SocialApp)    
my_admin_site.register(User)    
my_admin_site.register(Group)    
my_admin_site.register(CustomAccessAttempt)
my_admin_site.register(CustomAccessLog)    
my_admin_site.register(CustomAccessFailureLog)    

