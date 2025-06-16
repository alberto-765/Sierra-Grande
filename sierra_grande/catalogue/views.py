from urllib.parse import quote

from django.utils.translation import gettext_lazy as _
from django.views.generic import TemplateView


class LandingPageView(TemplateView):
    template_name = "oscar/index.html"

    def get_context_data(self, *args, **kwargs):
        ctx = super().get_context_data(*args, **kwargs)
        # ctx["summary"] = _("All products")
        return ctx
