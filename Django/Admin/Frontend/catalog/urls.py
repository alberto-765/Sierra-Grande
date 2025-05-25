from django.urls import path
from catalog.views import(
    
    clothing_view,
    watches_view,
    bag_luggage_view,
    footwear_view,
    innerwear_view,
    other_accessories_view,
    
    western_wear_view,
    handbags_clutches_view,
    lingerie_nightwear_view,
    women_footwear_view,
    fashion_silver_Jewellery_view,
    
    home_kitchen_pets_view,
    beauty_health_grocery_view,
    sports_fitness_bags_luggage_view,
    car_motorbike_industrial_view,
    books_view,
    
    sign_up_view,
    sign_in_view,
    password_reset_view,
    error404_view,
)

app_name ='catalog'

urlpatterns = [
    
    # men
    path('clothing',view=clothing_view,name='clothing_view'),
    path('watches',view=watches_view,name='watches_view'),
    path('bag_luggage',view=bag_luggage_view,name='bag_luggage_view'),
    path('footwear',view=footwear_view,name='footwear_view'),
    path('innerwear',view=innerwear_view,name='innerwear_view'),
    path('other_accessories',view=other_accessories_view,name='other_accessories_view'),
    
    # women
    path('western_wear',view=western_wear_view,name='western_wear_view'),
    path('handbags_clutches',view=handbags_clutches_view,name='handbags_clutches_view'),
    path('lingerie_nightwear',view=lingerie_nightwear_view,name='lingerie_nightwear_view'),
    path('women_footwear_view',view=women_footwear_view,name='women_footwear_view'),
    path('fashion_silver_jewellery',view=fashion_silver_Jewellery_view,name='fashion_silver_Jewellery_view'),
    
    # accessories & others
    path('home_kitchen_pets',view=home_kitchen_pets_view,name='home_kitchen_pets_view'),
    path('beauty_health_grocery',view=beauty_health_grocery_view,name='beauty_health_grocery_view'),
    path('sports_fitness_bags_luggage',view=sports_fitness_bags_luggage_view,name='sports_fitness_bags_luggage_view'),
    path('car_motorbike_industrial',view=car_motorbike_industrial_view,name='car_motorbike_industrial_view'),
    path('books',view=books_view,name='books_view'),
    
    # others
    path('signup',view=sign_up_view,name='sign_up_view'),
    path('signin',view=sign_in_view,name='sign_in_view'),
    path('password_reset',view=password_reset_view,name='password_reset_view'),
    path('error404',view=error404_view,name='error404_view'),
    
]