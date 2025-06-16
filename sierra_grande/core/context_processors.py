from django.conf import settings


def contact(request):
    """
    Contact information for the shop
    """
    return {
        "contact_email": settings.CONTACT_EMAILS,
        "contact_phone_numbers": settings.CONTACT_PHONE_NUMBERS,
    }
