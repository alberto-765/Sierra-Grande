from django.urls import path
from overview.views import(
    index_view,
)

app_name = 'overview'

urlpatterns = [
    
    path('', view=index_view, name="index"),
]