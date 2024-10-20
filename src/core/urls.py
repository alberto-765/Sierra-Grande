from customAdmin.admin import my_admin_site
from django.urls import path, include
from debug_toolbar.toolbar import debug_toolbar_urls


urlpatterns = [
    path('administracion/', my_admin_site.urls),
    path('accounts/', include('allauth.urls')), # Ruta para las URLs de allauth    
    path('prueba/', include('customAdmin.urls'))
    # Only test
]  + debug_toolbar_urls() 
