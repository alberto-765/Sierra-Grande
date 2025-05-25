from django.shortcuts import render
from django.views.generic import TemplateView

# Create your views here.

class overview(TemplateView):
    pass 

index_view = overview.as_view(template_name='overview/index.html')