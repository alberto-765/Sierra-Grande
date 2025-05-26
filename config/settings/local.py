# ruff: noqa: E501
from .base import *  # noqa: F403
from .base import INSTALLED_APPS
from .base import MIDDLEWARE
from .base import env

# GENERAL
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#debug
DEBUG = True

# https://docs.djangoproject.com/en/dev/ref/settings/#secret-key
#  Is a critical security setting in Django. It is used for:
#   1. Cryptographic signing - Ensures the integrity of data such as cookies, sessions, and CSRF tokens.
#   2. Hashing passwords - Used in password encryption and other security-related tasks.
#   3. Preventing attacks . If exposed, attackers could forge cookies or session data.
SECRET_KEY = env(
    "DJANGO_SECRET_KEY",
    default="rscaQ9baaGpSTmzsrYBPEKHDggdx5vO6W8EqA0IkLS9vVlPIQtvg9X1Jp76ICtZr",
)

# https://docs.djangoproject.com/en/dev/ref/settings/#allowed-hosts
ALLOWED_HOSTS = ["localhost", "0.0.0.0", "127.0.0.1"]  # noqa: S104

# CACHES
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#caches
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "LOCATION": "",
    },
}

# EMAIL
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#email-host
EMAIL_HOST = env("EMAIL_HOST", default="mailpit")
# https://docs.djangoproject.com/en/dev/ref/settings/#email-port
EMAIL_PORT = 1025

# django-debug-toolbar
# ------------------------------------------------------------------------------
# https://django-debug-toolbar.readthedocs.io/en/latest/installation.html#prerequisites
INSTALLED_APPS += ["debug_toolbar"]
# https://django-debug-toolbar.readthedocs.io/en/latest/installation.html#middleware
MIDDLEWARE += ["debug_toolbar.middleware.DebugToolbarMiddleware"]
# https://django-debug-toolbar.readthedocs.io/en/latest/configuration.html#debug-toolbar-config
DEBUG_TOOLBAR_CONFIG = {
    "DISABLE_PANELS": [
        "debug_toolbar.panels.redirects.RedirectsPanel",
        # Disable profiling panel due to an issue with Python 3.12:
        # https://github.com/jazzband/django-debug-toolbar/issues/1875
        "debug_toolbar.panels.profiling.ProfilingPanel",
    ],
    "SHOW_TEMPLATE_CONTEXT": True,
}

# https://django-debug-toolbar.readthedocs.io/en/latest/installation.html#internal-ips
# INTERNAL_IPS is a Django setting that specifies which IP addresses are considered "internal" for debugging purposes.
# 127.0.0.1 → Localhost (your own computer).
# 10.0.2.2 → Used by Android Emulators (like in VirtualBox or Genymotion).
INTERNAL_IPS = ["127.0.0.1", "10.0.2.2"]

# Get ips of docker for debugging tools
if env("USE_DOCKER") == "yes":
    import socket

    hostname, _, ips = socket.gethostbyname_ex(socket.gethostname())
    INTERNAL_IPS += [".".join(ip.split(".")[:-1] + ["1"]) for ip in ips]

# django-extensions
# ------------------------------------------------------------------------------
# https://django-extensions.readthedocs.io/en/latest/installation_instructions.html#configuration
INSTALLED_APPS += ["django_extensions"]
# Celery
# ------------------------------------------------------------------------------

# https://docs.celeryq.dev/en/stable/userguide/configuration.html#task-eager-propagates
# CELERY_TASK_EAGER_PROPAGATES = True is a Celery setting that determines whether exceptions in eagerly executed tasks should propagate.
CELERY_TASK_EAGER_PROPAGATES = True


# TEMPLATES
# ------------------------------------------------------------------------------

# Django-oscar
# ------------------------------------------------------------------------------
OSCAR_INITIAL_ORDER_STATUS = "Pending"
OSCAR_INITIAL_LINE_STATUS = "Pending"
OSCAR_ORDER_STATUS_PIPELINE = {
    "Pending": (
        "Being processed",
        "Cancelled",
    ),
    "Being processed": (
        "Processed",
        "Cancelled",
    ),
    "Cancelled": (),
}


# django-compressor
# ------------------------------------------------------------------------------
# https://django-compressor.readthedocs.io/en/latest/STATIC_URL/#installation
COMPRESS_SASS_SOURCE_MAP = True  # Source maps for debugging SCSS in browser tools
COMPRESS_CSS_FILTERS = [
    "compressor.filters.sass.SassFilter",  # Compiles SCSS to CSS
    "compressor.filters.css_default.CssAbsoluteFilter",  # Handles URL paths
]
