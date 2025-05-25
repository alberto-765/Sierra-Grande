from django.shortcuts import render,redirect

from django.urls import reverse_lazy
from allauth.account.views import PasswordChangeView, PasswordSetView

class MyPasswordChangeView( PasswordChangeView):
    success_url = reverse_lazy("dashboard:dashboard")


class MyPasswordSetView( PasswordSetView):
    success_url = reverse_lazy("dashboard:dashboard")