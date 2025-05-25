from django.shortcuts import render
from django.views.generic import TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin


# Create your views here.

class MenuView(LoginRequiredMixin,TemplateView):
    pass

dashboard_view = MenuView.as_view(template_name = "menu/index.html") 

