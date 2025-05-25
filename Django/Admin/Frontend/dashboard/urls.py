from django.urls import path
from dashboard.views import(
    
    dashboard_view,
    watch_main_layout_view,
    modern_fashion_view,
    trend_fashion_view,
    
    contact_us_view,
)

app_name ='dashboard'

urlpatterns = [
    
    path('',view=dashboard_view,name='dashboard'),
    path('watch_main_layout',view=watch_main_layout_view,name='watch_main_layout'),
    path('modern_fashion',view=modern_fashion_view,name='modern_fashion'),
    path('trend_fashion',view=trend_fashion_view,name='trend_fashion'),
    
    
    
    path('contact_us',view=contact_us_view,name='contact_us'),
    
]