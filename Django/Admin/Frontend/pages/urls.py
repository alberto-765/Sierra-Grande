from django.urls import path
from pages.views import (
    
    product_details_view,
    
    # grid-view
    defualt_view,
    sidebar_with_banner_view,
    grid_right_sidebar_view,
    grid_no_sidebar_view,
    
    # list-view
    defualt_list_view,
    left_sidebar_view,
    right_sidebar_view,
    no_sidebar_view,
    
    #  users
    account_view,
    sign_in_view,
    sign_up_view,
    password_reset_view,
    password_change_view,
    success_msg_view,
    twostep_view,
    logout_view,
    error404_view,
    error500_view,
    coming_soon_view,
    
    category_view,
    about_us_view,
    purchase_guide_view,
    terms_conditions_view,
    privacy_policy_view,
    store_locator_view,
    ecommerce_faq_view,
    invoice_view,
    
    email_black_friday_view,
    email_flash_sale_view,
    email_order_success_view,
    email_order_success_2_view,
)

app_name = "pages"

urlpatterns = [
    
# products

    path('products/product_details',view=product_details_view,name='products.product_details'),

    # grid-view
    path('products/gridview/defualt_grid',view=defualt_view,name='products.gridview.defualt_grid'),
    path('products/gridview/sidebar_with_banner',view=sidebar_with_banner_view,name='products.gridview.sidebar_with_banner'),
    path('products/gridview/right_sidebar_grid',view=grid_right_sidebar_view,name='products.gridview.right_sidebar_grid'),
    path('products/gridview/no_sidebar_grid',view=grid_no_sidebar_view,name='products.gridview.no_sidebar_grid'),
    
    # list-view
    path('products/listview/defualt_list',view=defualt_list_view,name='products.listview.defualt'),
    path('products/listview/left_sidebar',view=left_sidebar_view,name='products.listview.left_sidebar'),
    path('products/listview/right_sidebar',view=right_sidebar_view,name='products.listview.right_sidebar'),
    path('products/listview/no_sidebar',view=no_sidebar_view,name='products.listview.no_sidebar'),
    
# users
    path('users/account',view=account_view,name='users.account'),
    path('users/sign_in',view=sign_in_view,name='users.sign_in'),
    path('users/sign_up',view=sign_up_view,name='users.sign_up'),
    path('users/password_reset',view=password_reset_view,name='users.password_reset'),
    path('users/password_change',view=password_change_view,name='users.password_change'),
    path('users/success_msg',view=success_msg_view,name='users.success_msg'),
    path('users/twostep',view=twostep_view,name='users.twostep'),
    path('users/logout',view=logout_view,name='users.logout'),
    path('users/error404',view=error404_view,name='users.error404'),
    path('users/error500',view=error500_view,name='users.error500'),
    path('users/coming_soon',view=coming_soon_view,name='users.coming_soon'),
    
    
    path('category',view=category_view,name='category'),
    path('about_us',view=about_us_view,name='about_us'),
    path('purchase_guide',view=purchase_guide_view,name='purchase_guide'),
    path('terms_condition',view=terms_conditions_view,name='terms_condition'),
    path('privacy_policy',view=privacy_policy_view,name='privacy_policy'),
    path('store_locator',view=store_locator_view,name='store_locator'),
    path('ecommerce_faq',view=ecommerce_faq_view,name='ecommerce_faq'),
    path('invoice_view',view=invoice_view,name='invoice_view'),
    
    path('email-template/email_black_friday',view=email_black_friday_view,name='email-template.email_black_friday'),
    path('email-template/email_flash_sale',view=email_flash_sale_view,name='email-template.email_flash_sale'),
    path('email-template/email_order_success',view=email_order_success_view,name='email-template.email_order_success'),
    path('email-template/email_order_success_2',view=email_order_success_2_view,name='email-template.email_order_success_2'),


]