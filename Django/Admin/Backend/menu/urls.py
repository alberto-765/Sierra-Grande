from django.urls import path
from menu.views import (
    
    dashboard_view,
    product_list_view,
    product_grid_view,
    product_overview_view,
    product_create_view,
    categories_view,
    sub_categories_view,
    
    orders_list_view,
    orders_overview_view,
    
    calendar_view,
    
    seller_list_view,
    seller_grid_view,
    seller_overview_view,
    
    invoice_list_view,
    invoice_details_view,
    invoice_create_view,
    
    users_list_view,
    
    shipping_list_view,
    shipments_view,
    
    coupons_view,
    reviews_rating_view,
    brands_view,
    statistics_view,
    transactions_view,
    currency_rates_view,
)

app_name = 'menu'

urlpatterns = [
    
    path('',view=dashboard_view,name='dashboard'),
    path('product/list_view',view=product_list_view,name='product.product_list_view'),
    path('product/grid_view',view=product_grid_view,name='product.product_grid_view'),
    path('product/product_overview',view=product_overview_view,name='product.product_overview'),
    path('product/product_create',view=product_create_view,name='product.product_create'),
    path('product/categories',view=categories_view,name='product.categories'),
    path('product/sub_categories',view=sub_categories_view,name='product.sub_categories'),
    
    path('orders/list_view',view=orders_list_view,name='orders.list_view'),
    path('orders/overview',view=orders_overview_view,name='orders.overview_view'),
    
    path('calendar',view=calendar_view,name='calendar'),
    
    path('sellers/list_view',view=seller_list_view,name='sellers.list_view'),
    path('sellers/grid_view',view=seller_grid_view,name='sellers.grid_view'),
    path('sellers/overview',view=seller_overview_view,name='sellers.seller_overview_view'),
    
    path('invoice/list_view',view=invoice_list_view,name='invoice.list_view'),
    path('invoice/details_view',view=invoice_details_view,name='invoice.details_view'),
    path('invoice/create_invoice',view=invoice_create_view,name='invoice.create_invoice'),
    
    path('users_list',view=users_list_view,name='users_list'),
    
    path('shipping/list_view',view=shipping_list_view,name='shipping.list_view'),
    path('shipping/shipments',view=shipments_view,name='shipping.shipments'),
    
    path('coupons',view=coupons_view,name='coupons'),
    
    path('reviews_rating',view=reviews_rating_view,name='reviews_rating'),
    
    path('brands',view=brands_view,name='brands'),
    
    path('statistics',view=statistics_view,name='statistics'),
    
    path('localization/transactions',view=transactions_view,name='localization.transactions'),
    
    path('localization/currency_rates',view=currency_rates_view,name='localization.currency_rates'),
    
    
]
