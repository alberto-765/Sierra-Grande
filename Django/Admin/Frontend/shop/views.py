from django.shortcuts import render
from django.views.generic import TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin

# Create your views here.

class ShopView(LoginRequiredMixin,TemplateView):
    pass

# checkout pages
address_view = ShopView.as_view(template_name = 'shop/address.html')
track_order_view = ShopView.as_view(template_name = 'shop/track-order.html')
payment_view = ShopView.as_view(template_name = 'shop/payment.html')
review_view = ShopView.as_view(template_name = 'shop/review.html')
confirmation_view = ShopView.as_view(template_name = 'shop/confirmation.html')
order_history_view = ShopView.as_view(template_name = 'shop/order-history.html')

# support
shop_cart_view = ShopView.as_view(template_name = 'shop/shop-cart.html')
checkout_view = ShopView.as_view(template_name = 'shop/checkout.html')
wishlist_view = ShopView.as_view(template_name = 'shop/wishlist.html')
  