from django.contrib.admin import AdminSite
from axes.models import AccessAttempt
from allauth.account.models import EmailAddress
from django.contrib.auth.models import User


class MyAdminSite(AdminSite):
    site_title = "Sierra Grande de Hornachos" 
    site_header = "Sierra Grande de Hornachos" # Principal header admin panel
    index_title = "Bienvenido al panel de administración" # Window chrome title
    
    # def get_urls(self):
    #     urls = super().get_urls();
    #     return urls
    

    # def each_context(self, request):
    #     # Get the default context from the parent class
    #     context = super().each_context(request)
    #     # Add custom data to the context
    #     context['axes_attempts'] = AccessAttempt.objects.all()
    #     context['user_emails'] = EmailAddress.objects.filter(user=request.user)
    #     print(request.user)
    #     print(User.objects.get(username=request.user).is_superuser)
    #     return context

# Intance de admin site
my_admin_site = MyAdminSite(name="myadmin")
    

