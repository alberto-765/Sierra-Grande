from django.shortcuts import render
from django.views.generic import TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin

# Create your views here.

class catalog(LoginRequiredMixin,TemplateView):
    pass

# men
clothing_view = catalog.as_view(template_name = 'catalog/product-grid-sidebar-banner.html')
watches_view = catalog.as_view(template_name = 'catalog/product-grid-right.html')
bag_luggage_view = catalog.as_view(template_name = 'catalog/product-list-left.html')
footwear_view = catalog.as_view(template_name = 'catalog/product-grid-right.html')
innerwear_view = catalog.as_view(template_name = 'catalog/product-list.html')
other_accessories_view = catalog.as_view(template_name = 'catalog/product-list-right.html')

# women
western_wear_view = catalog.as_view(template_name = 'catalog/product-list-defualt.html')
handbags_clutches_view = catalog.as_view(template_name = 'catalog/product-list-left.html')
lingerie_nightwear_view = catalog.as_view(template_name = 'catalog/product-grid-right.html')
women_footwear_view = catalog.as_view(template_name = 'catalog/product-grid-sidebar-banner.html')
fashion_silver_Jewellery_view = catalog.as_view(template_name = 'catalog/product-grid-defualt.html')

# accessories & others
home_kitchen_pets_view = catalog.as_view(template_name = 'catalog/product-grid-right.html')
beauty_health_grocery_view = catalog.as_view(template_name = 'catalog/product-list-left.html')
sports_fitness_bags_luggage_view = catalog.as_view(template_name = 'catalog/product-grid-sidebar-banner.html')
car_motorbike_industrial_view = catalog.as_view(template_name = 'catalog/product-list.html')
books_view = catalog.as_view(template_name = 'catalog/product-list-right.html')
 
# others
sign_up_view = catalog.as_view(template_name = 'catalog/auth-signup-basic.html')
sign_in_view = catalog.as_view(template_name = 'catalog/auth-signin-basic.html')
password_reset_view = catalog.as_view(template_name = 'catalog/auth-pass-reset-basic.html')
error404_view = catalog.as_view(template_name = 'catalog/auth-404.html')
