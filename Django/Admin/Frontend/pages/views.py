from django.shortcuts import render
from django.views.generic import TemplateView

# Create your views here.

class PagesView(TemplateView):
    pass 
 
# products

product_details_view = PagesView.as_view(template_name = 'pages/products/product-details.html')

    # grid-view
defualt_view = PagesView.as_view(template_name = 'pages/products/gridview/product-grid-defualt.html')
sidebar_with_banner_view = PagesView.as_view(template_name = 'pages/products/gridview/product-grid-sidebar-banner.html')
grid_right_sidebar_view = PagesView.as_view(template_name = 'pages/products/gridview/product-grid-right.html')
grid_no_sidebar_view = PagesView.as_view(template_name = 'pages/products/gridview/product-grid.html')

    # list-view
defualt_list_view = PagesView.as_view(template_name = 'pages/products/listview/product-list-defualt.html')
left_sidebar_view = PagesView.as_view(template_name = 'pages/products/listview/product-list-left.html')
right_sidebar_view = PagesView.as_view(template_name = 'pages/products/listview/product-list-right.html')
no_sidebar_view = PagesView.as_view(template_name = 'pages/products/listview/product-list.html')

# users
account_view = PagesView.as_view(template_name = 'pages/users/account.html')
sign_in_view = PagesView.as_view(template_name = 'pages/users/auth-signin-basic.html')
sign_up_view = PagesView.as_view(template_name = 'pages/users/auth-signup-basic.html')
password_reset_view = PagesView.as_view(template_name = 'pages/users/auth-pass-reset-basic.html')
password_change_view = PagesView.as_view(template_name = 'pages/users/auth-pass-change-basic.html')
success_msg_view = PagesView.as_view(template_name = 'pages/users/auth-success-msg-basic.html')
twostep_view = PagesView.as_view(template_name = 'pages/users/auth-twostep-basic.html')
logout_view = PagesView.as_view(template_name = 'pages/users/auth-logout-basic.html')
error404_view = PagesView.as_view(template_name = 'pages/users/auth-404.html')
error500_view = PagesView.as_view(template_name = 'pages/users/auth-500.html')
coming_soon_view = PagesView.as_view(template_name = 'pages/users/coming-soon.html')


category_view = PagesView.as_view(template_name = 'pages/products-category.html')
about_us_view = PagesView.as_view(template_name = 'pages/about-us.html')
purchase_guide_view = PagesView.as_view(template_name = 'pages/purchase-guide.html')
terms_conditions_view = PagesView.as_view(template_name = 'pages/terms-conditions.html')
privacy_policy_view = PagesView.as_view(template_name = 'pages/privacy-policy.html')
store_locator_view = PagesView.as_view(template_name = 'pages/store-locator.html')
ecommerce_faq_view = PagesView.as_view(template_name = 'pages/ecommerce-faq.html')
invoice_view = PagesView.as_view(template_name = 'pages/invoice.html')

# email template
email_black_friday_view = PagesView.as_view(template_name = 'pages/email-template/email-black-friday.html')
email_flash_sale_view = PagesView.as_view(template_name = 'pages/email-template/email-flash-sale.html')
email_order_success_view = PagesView.as_view(template_name = 'pages/email-template/email-order-success.html')
email_order_success_2_view = PagesView.as_view(template_name = 'pages/email-template/email-order-success-2.html')

    