from django.shortcuts import render
from django.views.generic import TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin


# Create your views here.

class MenuView(LoginRequiredMixin,TemplateView):
    pass

dashboard_view = MenuView.as_view(template_name = "menu/index.html") 

# product
product_list_view = MenuView.as_view(template_name = "menu/products/product-list.html") 
product_grid_view = MenuView.as_view(template_name = "menu/products/product-grid.html") 
product_overview_view = MenuView.as_view(template_name = "menu/products/product-overview.html") 
product_create_view = MenuView.as_view(template_name = "menu/products/product-create.html") 
categories_view = MenuView.as_view(template_name = "menu/products/categories.html") 
sub_categories_view = MenuView.as_view(template_name = "menu/products/sub-categories.html") 

# orders
orders_list_view = MenuView.as_view(template_name = "menu/orders/orders-list-view.html") 
orders_overview_view = MenuView.as_view(template_name = "menu/orders/orders-overview.html") 

calendar_view = MenuView.as_view(template_name = "menu/calendar.html") 

# sellers
seller_list_view = MenuView.as_view(template_name = "menu/sellers/sellers-list-view.html") 
seller_grid_view = MenuView.as_view(template_name = "menu/sellers/sellers-grid-view.html") 
seller_overview_view = MenuView.as_view(template_name = "menu/sellers/seller-overview.html") 

# invoice
invoice_list_view = MenuView.as_view(template_name = "menu/invoice/invoices-list.html") 
invoice_details_view = MenuView.as_view(template_name = "menu/invoice/invoices-details.html") 
invoice_create_view = MenuView.as_view(template_name = "menu/invoice/invoices-create.html") 

users_list_view = MenuView.as_view(template_name = "menu/users-list.html") 

# shipping
shipping_list_view = MenuView.as_view(template_name = "menu/shipping/shipping-list.html") 
shipments_view = MenuView.as_view(template_name = "menu/shipping/shipments.html") 

coupons_view = MenuView.as_view(template_name = "menu/coupons.html") 

reviews_rating_view = MenuView.as_view(template_name = "menu/reviews-ratings.html") 

brands_view = MenuView.as_view(template_name = "menu/brands.html") 

statistics_view = MenuView.as_view(template_name = "menu/statistics.html") 

transactions_view = MenuView.as_view(template_name = "menu/localization/transactions.html") 

currency_rates_view = MenuView.as_view(template_name = "menu/localization/currency-rates.html") 
