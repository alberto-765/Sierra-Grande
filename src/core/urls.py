from django.contrib import admin
from django.urls import path, include
from debug_toolbar.toolbar import debug_toolbar_urls


urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('allauth.urls')), # Ruta para las URLs de allauth
]  + debug_toolbar_urls()



# ------ Admin panel configuration ----------

# Principal header admin panel
admin.site.site_header = "Sierra Grande de Hornachos"
# Window chrome title
admin.site.index_title = "Bienvenido al panel de administración"
admin.site.site_title = "Sierra Grande de Hornachos"