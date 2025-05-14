# ruff: noqa: ERA001, E501
"""Base settings to build other settings files upon."""

import ssl
from pathlib import Path

import environ
from django.utils.translation import get_language
from django.utils.translation import gettext_lazy as _
from oscar.defaults import *  # noqa: F403

BASE_DIR = Path(__file__).resolve(strict=True).parent.parent.parent
# sierra_grande/
APPS_DIR = BASE_DIR / "sierra_grande"
env = environ.Env()

READ_DOT_ENV_FILE = env.bool("DJANGO_READ_DOT_ENV_FILE", default=False)
if READ_DOT_ENV_FILE:
    # OS environment variables take precedence over variables from .env
    env.read_env(str(BASE_DIR / ".env"))

# GENERAL
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#debug
DEBUG = env.bool("DJANGO_DEBUG", False)
# Local time zone. Choices are
# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
# though not all of them may be available with every OS.
# In Windows, this must be set to your system time zone.
TIME_ZONE = "UTC"
# https://docs.djangoproject.com/en/dev/ref/settings/#language-code
LANGUAGE_CODE = "es-ES"
# https://docs.djangoproject.com/en/dev/ref/settings/#languages

LANGUAGES = [
    ("es", _("Spanish")),
    ("en", _("English")),
    ("fr", _("French")),
    ("pt", _("Portuguese")),
    ("it", _("Italian")),
    ("de", _("German")),
    ("sv", _("Swedish")),
    ("et", _("Estonian")),
    ("hr", _("Croatian")),
    ("fi", _("Finnish")),
    ("cs", _("Czech")),
    ("bg", _("Bulgarian")),
]
# https://docs.djangoproject.com/en/dev/ref/settings/#site-id
SITE_ID = 1
# https://docs.djangoproject.com/en/dev/ref/settings/#use-i18n
USE_I18N = True
# https://docs.djangoproject.com/en/dev/ref/settings/#use-tz
USE_TZ = True

# https://docs.djangoproject.com/en/dev/ref/settings/#locale-paths
LOCALE_PATHS = [str(BASE_DIR / "locale")]

# DATABASES
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#databases
DATABASES = {"default": env.db("DATABASE_URL")}
DATABASES["default"]["ATOMIC_REQUESTS"] = True
# https://docs.djangoproject.com/en/stable/ref/settings/#std:setting-DEFAULT_AUTO_FIELD
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# URLS
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#root-urlconf
# This tells Django where to find the URL configuration for the project
ROOT_URLCONF = "config.urls"
# https://docs.djangoproject.com/en/dev/ref/settings/#wsgi-application
WSGI_APPLICATION = "config.wsgi.application"

# APPS
# ------------------------------------------------------------------------------
BEGIN_APPS = [
    "grappelli",
    "filebrowser",
    "tinymce",
]

DJANGO_APPS = [
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.sites",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.humanize",  # Handy template tags
    "django.contrib.admin",
    "django.forms",
    "django.contrib.flatpages",
]
THIRD_PARTY_APPS = [
    "crispy_forms",
    "crispy_bootstrap5",
    "allauth",
    "allauth.account",
    "allauth.mfa",
    "allauth.socialaccount",
    "django_celery_beat",
    # Django-oscar
    "oscar.config.Shop",
    "oscar.apps.analytics.apps.AnalyticsConfig",
    "oscar.apps.checkout.apps.CheckoutConfig",
    "oscar.apps.address.apps.AddressConfig",
    "oscar.apps.shipping.apps.ShippingConfig",
    "oscar.apps.catalogue.apps.CatalogueConfig",
    "oscar.apps.catalogue.reviews.apps.CatalogueReviewsConfig",
    "oscar.apps.communication.apps.CommunicationConfig",
    "oscar.apps.basket.apps.BasketConfig",
    "oscar.apps.payment.apps.PaymentConfig",
    "oscar.apps.offer.apps.OfferConfig",
    "oscar.apps.order.apps.OrderConfig",
    "oscar.apps.customer.apps.CustomerConfig",
    "oscar.apps.search.apps.SearchConfig",
    "oscar.apps.wishlists.apps.WishlistsConfig",
    "oscar.apps.dashboard.communications.apps.CommunicationsDashboardConfig",
    "oscar.apps.dashboard.shipping.apps.ShippingDashboardConfig",
    # 3rd-party apps that oscar depends on
    "widget_tweaks",
    "haystack",
    "treebeard",
    "easy_thumbnails",
    "django_tables2",
]

LOCAL_APPS = [
    "sierra_grande.users",
    "sierra_grande.partner.apps.PartnerConfig",
    "sierra_grande.voucher.apps.VoucherConfig",
    "sierra_grande.dashboard.apps.DashboardConfig",
    "sierra_grande.dashboard.reports.apps.ReportsDashboardConfig",
    "sierra_grande.dashboard.users.apps.UsersDashboardConfig",
    "sierra_grande.dashboard.orders.apps.OrdersDashboardConfig",
    "sierra_grande.dashboard.catalogue.apps.CatalogueDashboardConfig",
    "sierra_grande.dashboard.offers.apps.OffersDashboardConfig",
    "sierra_grande.dashboard.partners.apps.PartnersDashboardConfig",
    "sierra_grande.dashboard.ranges.apps.RangesDashboardConfig",
    "sierra_grande.dashboard.reviews.apps.ReviewsDashboardConfig",
    "sierra_grande.dashboard.vouchers.apps.VouchersDashboardConfig",
    "sierra_grande.dashboard.pages.apps.PagesDashboardConfig",
]

# https://docs.djangoproject.com/en/dev/ref/settings/#installed-apps
INSTALLED_APPS = BEGIN_APPS + DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

# MIGRATIONS
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#migration-modules
MIGRATION_MODULES = {"sites": "sierra_grande.contrib.sites.migrations"}

# AUTHENTICATION
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#authentication-backends
AUTHENTICATION_BACKENDS = [
    "django.contrib.auth.backends.ModelBackend",
    "allauth.account.auth_backends.AuthenticationBackend",
]
# TODO: INTEGRATE ALL-AUTH
# https://docs.djangoproject.com/en/dev/ref/settings/#auth-user-model
AUTH_USER_MODEL = "users.User"
# # https://docs.djangoproject.com/en/dev/ref/settings/#login-redirect-url
LOGIN_REDIRECT_URL = "users:redirect"
# # https://docs.djangoproject.com/en/dev/ref/settings/#login-url
# LOGIN_URL = "account_login"
LOGIN_URL = "account_login"

# PASSWORDS
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#password-hashers
PASSWORD_HASHERS = [
    # https://docs.djangoproject.com/en/dev/topics/auth/passwords/#using-argon2-with-django
    "django.contrib.auth.hashers.Argon2PasswordHasher",
    "django.contrib.auth.hashers.PBKDF2PasswordHasher",
    "django.contrib.auth.hashers.PBKDF2SHA1PasswordHasher",
    "django.contrib.auth.hashers.BCryptSHA256PasswordHasher",
]
# https://docs.djangoproject.com/en/dev/ref/settings/#auth-password-validators
AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# MIDDLEWARE
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#middleware
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.locale.LocaleMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "allauth.account.middleware.AccountMiddleware",
    # Django-oscar
    "oscar.apps.basket.middleware.BasketMiddleware",
    "django.contrib.flatpages.middleware.FlatpageFallbackMiddleware",
]

# STATIC
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#static-root
# The absolute path to the directory where collectstatic will collect static files for deployment.
STATIC_ROOT = str(BASE_DIR / "staticfiles")

# https://docs.djangoproject.com/en/dev/ref/settings/#static-url
# Sets the base URL for serving static files.
STATIC_URL = "/static/"

# https://docs.djangoproject.com/en/dev/ref/contrib/staticfiles/#std:setting-STATICFILES_DIRS
# Specifies additional directories to look for static files before collecting them into STATIC_ROOT
STATICFILES_DIRS = [str(APPS_DIR / "static")]

# https://docs.djangoproject.com/en/dev/ref/contrib/staticfiles/#staticfiles-finders
STATICFILES_FINDERS = [
    "django.contrib.staticfiles.finders.FileSystemFinder",  # Looks for files in the STATICFILES_DIRS setting
    "django.contrib.staticfiles.finders.AppDirectoriesFinder",  # Looks for files in the static subdirectory of each app
]

# MEDIA
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#media-root
MEDIA_ROOT = str(APPS_DIR / "media")
# https://docs.djangoproject.com/en/dev/ref/settings/#media-url
MEDIA_URL = "/media/"

# TEMPLATES
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#templates
TEMPLATES = [
    {
        # https://docs.djangoproject.com/en/dev/ref/settings/#std:setting-TEMPLATES-BACKEND
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        # https://docs.djangoproject.com/en/dev/ref/settings/#dirs
        "DIRS": [str(APPS_DIR / "templates")],
        # https://docs.djangoproject.com/en/dev/ref/settings/#app-dirs
        "APP_DIRS": True,
        "OPTIONS": {
            # https://docs.djangoproject.com/en/dev/ref/settings/#template-context-processors
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.template.context_processors.i18n",
                "django.template.context_processors.media",
                "django.template.context_processors.static",
                "django.template.context_processors.tz",
                "django.contrib.messages.context_processors.messages",
                "sierra_grande.users.context_processors.allauth_settings",
                "oscar.apps.search.context_processors.search_form",
                "oscar.apps.checkout.context_processors.checkout",
                "oscar.apps.communication.notifications.context_processors.notifications",
                "oscar.core.context_processors.metadata",
            ],
        },
    },
]

# https://docs.djangoproject.com/en/dev/ref/settings/#form-renderer
FORM_RENDERER = "django.forms.renderers.TemplatesSetting"

# http://django-crispy-forms.readthedocs.io/en/latest/install.html#template-packs
CRISPY_TEMPLATE_PACK = "bootstrap5"
CRISPY_ALLOWED_TEMPLATE_PACKS = "bootstrap5"

# FIXTURES
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#fixture-dirs
FIXTURE_DIRS = (str(APPS_DIR / "fixtures"),)

# SECURITY
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#session-cookie-httponly
SESSION_COOKIE_HTTPONLY = True
# https://docs.djangoproject.com/en/dev/ref/settings/#csrf-cookie-httponly
CSRF_COOKIE_HTTPONLY = True
# https://docs.djangoproject.com/en/dev/ref/settings/#x-frame-options
X_FRAME_OPTIONS = "DENY"

# EMAIL
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#email-backend
EMAIL_BACKEND = env(
    "DJANGO_EMAIL_BACKEND",
    default="django.core.mail.backends.smtp.EmailBackend",
)

# https://docs.djangoproject.com/en/dev/ref/settings/#email-timeout
EMAIL_TIMEOUT = 5

# ADMIN
# ------------------------------------------------------------------------------
# Django Admin URL.
ADMIN_URL = "admin/"
# https://docs.djangoproject.com/en/dev/ref/settings/#admins
# ADMINS = env("ADMINS")
# # https://docs.djangoproject.com/en/dev/ref/settings/#managers
# MANAGERS = ADMINS
# https://cookiecutter-django.readthedocs.io/en/latest/settings.html#other-environment-settings
# Force the `admin` sign in process to go through the `django-allauth` workflow
DJANGO_ADMIN_FORCE_ALLAUTH = env.bool("DJANGO_ADMIN_FORCE_ALLAUTH", default=False)

# LOGGING
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#logging
# See https://docs.djangoproject.com/en/dev/topics/logging for
# more details on how to customize your logging configuration.
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {
            "format": "%(levelname)s %(asctime)s %(module)s %(process)d %(thread)d %(message)s",
        },
    },
    "handlers": {
        "console": {
            "level": "DEBUG",
            "class": "logging.StreamHandler",
            "formatter": "verbose",
        },
    },
    "root": {"level": "DEBUG", "handlers": ["console"]},
}

REDIS_URL = env("REDIS_URL", default="redis://redis:6379/0")
REDIS_SSL = REDIS_URL.startswith("rediss://")

# Celery
# ------------------------------------------------------------------------------
if USE_TZ:
    # https://docs.celeryq.dev/en/stable/userguide/configuration.html#std:setting-timezone
    CELERY_TIMEZONE = TIME_ZONE
# https://docs.celeryq.dev/en/stable/userguide/configuration.html#std:setting-broker_url
CELERY_BROKER_URL = REDIS_URL
# https://docs.celeryq.dev/en/stable/userguide/configuration.html#redis-backend-use-ssl
CELERY_BROKER_USE_SSL = {"ssl_cert_reqs": ssl.CERT_NONE} if REDIS_SSL else None
# https://docs.celeryq.dev/en/stable/userguide/configuration.html#std:setting-result_backend
CELERY_RESULT_BACKEND = REDIS_URL
# https://docs.celeryq.dev/en/stable/userguide/configuration.html#redis-backend-use-ssl
CELERY_REDIS_BACKEND_USE_SSL = CELERY_BROKER_USE_SSL
# https://docs.celeryq.dev/en/stable/userguide/configuration.html#result-extended
CELERY_RESULT_EXTENDED = True
# https://docs.celeryq.dev/en/stable/userguide/configuration.html#result-backend-always-retry
# https://github.com/celery/celery/pull/6122
CELERY_RESULT_BACKEND_ALWAYS_RETRY = True
# https://docs.celeryq.dev/en/stable/userguide/configuration.html#result-backend-max-retries
CELERY_RESULT_BACKEND_MAX_RETRIES = 10
# https://docs.celeryq.dev/en/stable/userguide/configuration.html#std:setting-accept_content
CELERY_ACCEPT_CONTENT = ["json"]
# https://docs.celeryq.dev/en/stable/userguide/configuration.html#std:setting-task_serializer
CELERY_TASK_SERIALIZER = "json"
# https://docs.celeryq.dev/en/stable/userguide/configuration.html#std:setting-result_serializer
CELERY_RESULT_SERIALIZER = "json"
# https://docs.celeryq.dev/en/stable/userguide/configuration.html#task-time-limit
# TODO: set to whatever value is adequate in your circumstances
CELERY_TASK_TIME_LIMIT = 5 * 60
# https://docs.celeryq.dev/en/stable/userguide/configuration.html#task-soft-time-limit
# TODO: set to whatever value is adequate in your circumstances
CELERY_TASK_SOFT_TIME_LIMIT = 60
# https://docs.celeryq.dev/en/stable/userguide/configuration.html#beat-scheduler
CELERY_BEAT_SCHEDULER = "django_celery_beat.schedulers:DatabaseScheduler"
# https://docs.celeryq.dev/en/stable/userguide/configuration.html#worker-send-task-events
CELERY_WORKER_SEND_TASK_EVENTS = True
# https://docs.celeryq.dev/en/stable/userguide/configuration.html#std-setting-task_send_sent_event
CELERY_TASK_SEND_SENT_EVENT = True
# https://docs.celeryq.dev/en/stable/userguide/configuration.html#worker-hijack-root-logger
CELERY_WORKER_HIJACK_ROOT_LOGGER = False


# django-allauth
# ------------------------------------------------------------------------------
ACCOUNT_ALLOW_REGISTRATION = env.bool("DJANGO_ACCOUNT_ALLOW_REGISTRATION", True)

# https://docs.allauth.org/en/latest/account/configuration.html
ACCOUNT_LOGIN_METHODS = {"email"}

# https://docs.allauth.org/en/latest/account/configuration.html
ACCOUNT_SIGNUP_FIELDS = ["email*", "password1*", "password2*"]

# https://docs.allauth.org/en/latest/account/configuration.html
ACCOUNT_USER_MODEL_USERNAME_FIELD = None

# https://docs.allauth.org/en/latest/account/configuration.html
ACCOUNT_EMAIL_VERIFICATION = "mandatory"

# https://docs.allauth.org/en/latest/account/configuration.html
ACCOUNT_ADAPTER = "sierra_grande.users.adapters.AccountAdapter"

# https://docs.allauth.org/en/latest/account/forms.html
ACCOUNT_FORMS = {"signup": "sierra_grande.users.forms.UserSignupForm"}

# https://docs.allauth.org/en/latest/socialaccount/configuration.html
SOCIALACCOUNT_ADAPTER = "sierra_grande.users.adapters.SocialAccountAdapter"

# https://docs.allauth.org/en/latest/socialaccount/configuration.html
SOCIALACCOUNT_FORMS = {"signup": "sierra_grande.users.forms.UserSocialSignupForm"}

# django-compressor
# ------------------------------------------------------------------------------
# https://django-compressor.readthedocs.io/en/latest/quickstart/#installation
INSTALLED_APPS += ["compressor"]
STATICFILES_FINDERS += ["compressor.finders.CompressorFinder"]

# HAYSTACK
# ------------------------------------------------------------------------------
HAYSTACK_CONNECTIONS = {
    "default": {
        "ENGINE": "haystack.backends.solr_backend.SolrEngine",
        "URL": env("HAYSTACK_URL") + "/sandbox",
        "ADMIN_URL": env("HAYSTACK_URL") + "/admin/cores",
        "INCLUDE_SPELLING": True,  # Enable spelling suggestions
        "TIMEOUT": 60 * 5,
        "BATCH_SIZE": 10,
    },
}


# Django-oscar
# ------------------------------------------------------------------------------
# Menu structure of the dashboard navigation
OSCAR_DASHBOARD_NAVIGATION = [
    {
        "label": _("Dashboard"),
        "icon": "fluent:list-16-regular",
        "url_name": "dashboard:index",
    },
    {
        "label": _("Catalogue"),
        "icon": "fa-solid:sitemap",
        "children": [
            {
                "label": _("Products"),
                "url_name": "dashboard:catalogue-product-list",
            },
            {
                "label": _("Product Types"),
                "url_name": "dashboard:catalogue-class-list",
            },
            {
                "label": _("Categories"),
                "url_name": "dashboard:catalogue-category-list",
            },
            {
                "label": _("Ranges"),
                "url_name": "dashboard:range-list",
            },
            {
                "label": _("Low stock alerts"),
                "url_name": "dashboard:stock-alert-list",
            },
            {
                "label": _("Options"),
                "url_name": "dashboard:catalogue-option-list",
            },
            {
                "label": _("Attribute Option Groups"),
                "url_name": "dashboard:catalogue-attribute-option-group-list",
            },
        ],
    },
    {
        "label": _("Fulfilment"),
        "icon": "fa-solid:shopping-cart",
        "children": [
            {
                "label": _("Orders"),
                "url_name": "dashboard:order-list",
            },
            {
                "label": _("Statistics"),
                "url_name": "dashboard:order-stats",
            },
            {
                "label": _("Partners"),
                "url_name": "dashboard:partner-list",
            },
            # The shipping method dashboard is disabled by default as it might
            # be confusing. Weight-based shipping methods aren't hooked into
            # the shipping repository by default (as it would make
            # customising the repository slightly more difficult).
            # {
            #     'label': _('Shipping charges'),
            #     'url_name': 'dashboard:shipping-method-list',
            # },
        ],
    },
    {
        "label": _("Customers"),
        "icon": "fa-solid:users",
        "children": [
            {
                "label": _("Customers"),
                "url_name": "dashboard:users-index",
            },
            {
                "label": _("Stock alert requests"),
                "url_name": "dashboard:user-alert-list",
            },
        ],
    },
    {
        "label": _("Offers"),
        "icon": "fa-solid:bullhorn",
        "children": [
            {
                "label": _("Offers"),
                "url_name": "dashboard:offer-list",
            },
            {
                "label": _("Vouchers"),
                "url_name": "dashboard:voucher-list",
            },
            {
                "label": _("Voucher Sets"),
                "url_name": "dashboard:voucher-set-list",
            },
        ],
    },
    {
        "label": _("Content"),
        "icon": "fa-solid:folder",
        "children": [
            {
                "label": _("Pages"),
                "url_name": "dashboard:page-list",
            },
            {
                "label": _("Email templates"),
                "url_name": "dashboard:comms-list",
            },
            {
                "label": _("Reviews"),
                "url_name": "dashboard:reviews-list",
            },
        ],
    },
    {
        "label": _("Reports"),
        "icon": "mdi:report-areaspline",
        "url_name": "dashboard:reports-index",
    },
]


# TinyMCE
# ------------------------------------------------------------------------------
TINYMCE_JS_URL = str(Path(STATIC_URL) / "tinymce/tinymce.min.js")
TINYMCE_DEFAULT_CONFIG = {
    "license_key": "qagffr3pkuv17a8on1afax661irst1hbr4e6tbv888sz91jc",
    "height": 600,
    "width": "100%",
    "plugins": (
        "importword exportword exportpdf preview powerpaste casechange importcss searchreplace autolink autosave save  advcode "
        "visualblocks visualchars fullscreen image link media mediaembed codesample table charmap pagebreak nonbreaking anchor tableofcontents "
        "insertdatetime advlist lists checklist wordcount tinymcespellchecker a11ychecker editimage help formatpainter permanentpen pageembed charmap "
        "tinycomments mentions quickbars linkchecker emoticons advtable footnotes mergetags autocorrect typography advtemplate markdown "
    ),
    "mobile": {
        "plugins": "preview powerpaste casechange importcss searchreplace autolink autosave save advcode visualblocks visualchars fullscreen image link media mediaembed codesample table charmap pagebreak nonbreaking anchor tableofcontents insertdatetime advlist lists checklist wordcount tinymcespellchecker a11ychecker help formatpainter pageembed charmap mentions quickbars linkchecker emoticons advtable footnotes mergetags autocorrect typography advtemplate",
    },
    "menu": {
        "tc": {
            "title": "Comments",
            "items": "addcomment showcomments deleteallconversations",
        }
    },
    "menubar": "file edit view insert format tools table tc help",
    "toolbar": "undo redo | importword exportword exportpdf | aidialog aishortcuts | blocks fontsizeinput strikethrough forecolor backcolor | bold italic | align numlist bullist | link image accordion | table math media pageembed | lineheight  outdent indent | formatpainter removeformat | charmap emoticons checklist | code fullscreen preview | save print | pagebreak anchor codesample footnotes mergetags | addtemplate inserttemplate | addcomment showcomments | casechange | spellcheckdialog a11ycheck",
    "image_advtab": True,
    "media_alt_source": True,
    "media_poster": True,
    "file_picker_callback": "oscar.dashboard.filebrowser_callback",  # Filebrowser integration
    "file_picker_types": "file image media",  # Enable for images, videos, and files
    "relative_urls": False,
    "remove_script_host": False,
    "custom_undo_redo_levels": 10,
    "valid_elements": "*[*]",
    "extended_valid_elements": "iframe[src|width|height|frameborder|allowfullscreen],video[*],source[*]",
    "paste_data_images": True,
    "image_caption": True,  # Allow image captions
    "toolbar_mode": "wrap",  # Wrap toolbar for all buttons
    "branding": False,
    "promotion": False,  # ⬅️ For TinyMCE 6+
    "skin": "oxide",
    "content_css": "default",
    "autosave_ask_before_unload": True,
    "autosave_interval": "30s",
    "autosave_prefix": "{path}{query}-{id}-",
    "autosave_restore_when_empty": False,
    "autosave_retention": "2m",
    "a11y_advanced_options": True,
    "autocorrect_capitalize": True,
    "typography_rules": [
        "common/punctuation/quote",
        "en-US/dash/main",
        "common/nbsp/afterParagraphMark",
        "common/nbsp/afterSectionMark",
        "common/nbsp/afterShortWord",
        "common/nbsp/beforeShortLastNumber",
        "common/nbsp/beforeShortLastWord",
        "common/nbsp/dpi",
        "common/punctuation/apostrophe",
        "common/space/delBeforePunctuation",
        "common/space/afterComma",
        "common/space/afterColon",
        "common/space/afterExclamationMark",
        "common/space/afterQuestionMark",
        "common/space/afterSemicolon",
        "common/space/beforeBracket",
        "common/space/bracket",
        "common/space/delBeforeDot",
        "common/space/squareBracket",
        "common/number/mathSigns",
        "common/number/times",
        "common/number/fraction",
        "common/symbols/arrow",
        "common/symbols/cf",
        "common/symbols/copy",
        "common/punctuation/delDoublePunctuation",
        "common/punctuation/hellip",
    ],
    "typography_ignore": ["code"],
    "advtemplate_list": [
        {
            "id": "1",
            "title": "Resolving tickets",
            "content": "<p>As we have not heard back from you in over a week, we have gone ahead and resolved your ticket.</p>",
        },
        {
            "id": "2",
            "title": "Quick replies",
            "items": [
                {
                    "id": "3",
                    "title": "Message received",
                    "content": "<p>Just a quick note to say we have received your message, and will get back to you within 48 hours.</p>",
                },
                {
                    "id": "4",
                    "title": "Progress update",
                    "content": "</p>Just a quick note to let you know we are still working on your case</p>",
                },
            ],
        },
    ],
    "tinycomments_mode": "embedded",
    "tinycomments_author": "User",
    "quickbars_selection_toolbar": "bold italic | quicklink h2 h3 blockquote quickimage quicktable",
    "importcss_append": True,
    "noneditable_class": "mceNonEditable",
    "contextmenu": "link image editimage table configurepermanentpen",
}
