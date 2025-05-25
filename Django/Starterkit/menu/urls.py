from django.urls import path
from menu.views import (
    
    dashboard_view,
   
)

app_name = 'menu'

urlpatterns = [
    
    path('',view=dashboard_view,name='dashboard'),
   
    
    
]
