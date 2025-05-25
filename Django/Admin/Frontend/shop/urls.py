from django.urls import path
from shop.views import(
    
    address_view,
    track_order_view,
    payment_view,
    review_view,
    confirmation_view,
    order_history_view,
    
    shop_cart_view,
    checkout_view,
    wishlist_view,
)

app_name ='shop'

urlpatterns = [
    
    # checkout pages
    path('address',view=address_view,name='address_view'),
    path('track_order',view=track_order_view,name='track_order_view'),
    path('payment',view=payment_view,name='payment_view'),
    path('review',view=review_view,name='review_view'),
    path('confirmation',view=confirmation_view,name='confirmation_view'),
    path('order_history',view=order_history_view,name='order_history_view'),
    
    # support
    path('shop_cart',view=shop_cart_view,name='shop_cart_view'),
    path('checkout',view=checkout_view,name='checkout_view'),
    path('wishlist',view=wishlist_view,name='wishlist_view'),
    
]