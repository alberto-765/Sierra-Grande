from django.contrib import admin
from django.urls import path, include
from debug_toolbar.toolbar import debug_toolbar_urls


urlpatterns = [
    path('administracion/', admin.site.urls),
    path('accounts/', include('allauth.urls')), # Ruta para las URLs de allauth    
    # Only test
]  + debug_toolbar_urls() 





# ------ Admin panel configuration ----------
admin.site.site_header = "Sierra Grande de Hornachos" # Principal header admin panel
admin.site.index_title = "Bienvenido al panel de administración" # Window chrome title
admin.site.site_title = "Sierra Grande de Hornachos" 