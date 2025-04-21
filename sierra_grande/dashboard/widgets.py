import copy
import re

from django import forms
from django.urls import reverse
from django.utils.translation import gettext_lazy as _

SMALL_LIST_THRESHOLD = 4


class RelatedFieldWidgetWrapper(forms.WidgetWidget):
    """
    This class is a wrapper to a given widget to add the add icon for the
    Oscar dashboard.
    """

    template_name = "oscar/dashboard/widgets/related_widget_wrapper.html"

    IS_POPUP_VALUE = "1"
    IS_POPUP_VAR = "_popup"
    TO_FIELD_VAR = "_to_field"

    # pylint: disable=super-init-not-called
    def __init__(self, widget, rel):
        self.needs_multipart_form = widget.needs_multipart_form
        self.attrs = widget.attrs
        self.choices = widget.choices
        self.widget = widget
        self.rel = rel

    def __deepcopy__(self, memo):
        obj = copy.copy(self)
        obj.widget = copy.deepcopy(self.widget, memo)
        obj.attrs = self.widget.attrs
        memo[id(self)] = obj
        return obj

    @property
    def is_hidden(self):
        return self.widget.is_hidden

    @property
    def media(self):
        return self.widget.media

    def get_related_url(self, info, action, *args):
        app_label = info[0]
        model_object_name = info[1]
        # Convert the model's object name into lowercase, with dashes between
        # the camel-cased words
        model_object_name = "-".join(
            re.sub("([a-z])([A-Z])", r"\1 \2", model_object_name).lower().split(),
        )
        # Does not specify current app
        return reverse(
            f"dashboard:{app_label}-{model_object_name}-{action}",
            args=args,
        )

    def get_context(self, name, value, attrs):
        rel_model = self.rel.model
        app_label = rel_model._meta.app_label
        model_name = rel_model._meta.model_name
        verbose_name = rel_model._meta.verbose_name
        info = (app_label, model_name)

        self._disable_in_empty_choices(verbose_name, attrs)
        self.widget.choices = self.choices
        url_params = "&".join(
            f"{param[0]}={param[1]}"
            for param in [
                (
                    RelatedFieldWidgetWrapper.TO_FIELD_VAR,
                    self.rel.get_related_field().name,
                ),
                (
                    RelatedFieldWidgetWrapper.IS_POPUP_VAR,
                    RelatedFieldWidgetWrapper.IS_POPUP_VALUE,
                ),
            ]
        )
        context = {
            "rendered_widget": self.widget.render(name, value, attrs),
            "name": name,
            "url_params": url_params,
            "model": verbose_name,
        }
        change_related_template_url = self.get_related_url(info, "update", "__fk__")
        context.update(
            change_related_template_url=change_related_template_url,
        )
        add_related_url = self.get_related_url(info, "create")
        context.update(
            add_related_url=add_related_url,
        )
        delete_related_template_url = self.get_related_url(info, "delete", "__fk__")
        context.update(
            delete_related_template_url=delete_related_template_url,
        )
        return context

    def value_from_datadict(self, data, files, name):
        return self.widget.value_from_datadict(data, files, name)

    def value_omitted_from_data(self, data, files, name):
        return self.widget.value_omitted_from_data(data, files, name)

    def id_for_label(self, id_):
        return self.widget.id_for_label(id_)

    def _disable_in_empty_choices(self, model: str, attrs: dict):
        if not self.choices.queryset.exists():
            attrs["disabled"] = "disabled"
            self.choices = [("", _("Create the first {{model}}"))]
        else:
            count = self.choices.queryset.count()
            if count < SMALL_LIST_THRESHOLD:
                attrs["size"] = count


class RelatedMultipleFieldWidgetWrapper(RelatedFieldWidgetWrapper):
    template_name = "oscar/dashboard/widgets/related_multiple_widget_wrapper.html"


class CustomSelectMultiple(forms.SelectMultiple):
    def __init__(self, model_name="", attrs=None):
        self.model_name = model_name
        super().__init__(attrs)

    def get_context(self, name, value, attrs):
        context = super().get_context(name, value, attrs)

        # Accedemos al queryset si está disponible (esto depende del field)
        if hasattr(self, "choices") and hasattr(self.choices, "queryset"):
            queryset = self.choices.queryset
            if not queryset.exists():
                context["widget"]["attrs"]["disabled"] = "disabled"
                context["widget"]["optgroups"] = [
                    (None, [("", _("Create the first %s") % self.model_name)], 0),
                ]
            else:
                count = queryset.count()
                if count < SMALL_LIST_THRESHOLD:
                    context["widget"]["attrs"]["size"] = str(count)

        return context
