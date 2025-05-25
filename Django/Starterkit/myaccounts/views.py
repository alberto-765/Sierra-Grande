from django.shortcuts import render
from django.views.generic import TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin

# Create your views here.

class MyaccountView(LoginRequiredMixin,TemplateView):
    pass 


signup_view = MyaccountView.as_view(template_name = "myaccounts/auth-signup-basic.html")
signin_view = MyaccountView.as_view(template_name = "myaccounts/auth-signin-basic.html")
password_reset_view = MyaccountView.as_view(template_name = "myaccounts/auth-pass-reset-basic.html")
password_change_view = MyaccountView.as_view(template_name = "myaccounts/auth-pass-change-basic.html")
success_msg_view = MyaccountView.as_view(template_name = "myaccounts/auth-success-msg-basic.html")
twostep_verification_view = MyaccountView.as_view(template_name = "myaccounts/auth-twostep-basic.html")
logout_view = MyaccountView.as_view(template_name = "myaccounts/auth-logout-basic.html")
error404_view = MyaccountView.as_view(template_name = "myaccounts/auth-404.html")
error500_view = MyaccountView.as_view(template_name = "myaccounts/auth-500.html")
coming_soon_view = MyaccountView.as_view(template_name = "myaccounts/coming-soon.html")