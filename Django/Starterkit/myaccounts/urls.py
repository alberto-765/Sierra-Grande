from django.urls import path
from myaccounts.views import (

    signup_view,
    signin_view,
    password_reset_view,
    password_change_view,
    success_msg_view,
    twostep_verification_view,
    logout_view,
    error404_view,
    error500_view,
    coming_soon_view,
)

app_name = 'myaccounts'

urlpatterns = [
    
    path("signup",view=signup_view,name="signup"),
    path("signin",view=signin_view,name="signin"),
    path("password_reset",view=password_reset_view,name="password_reset"),
    path("password_change",view=password_change_view,name="password_change"),
    path("success_msg",view=success_msg_view,name="success_msg"),
    path("twostep_verification",view=twostep_verification_view,name="twostep_verification"),
    path("logout",view=logout_view,name="logout"),
    path("error404",view=error404_view,name="error404"),
    path("error500",view=error500_view,name="error500"),
    path("coming_soon",view=coming_soon_view,name="coming_soon"),
]
