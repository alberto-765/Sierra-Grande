from django import forms
from django.utils.translation import gettext_lazy as _
from django.utils.translation import pgettext_lazy

from oscar.core.compat import get_user_model
from oscar.core.loading import get_model

from crispy_bootstrap5.bootstrap5 import Field
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Column
from crispy_forms.layout import Layout

User = get_user_model()
ProductAlert = get_model("customer", "ProductAlert")


class UserSearchForm(forms.Form):
    email = forms.CharField(required=False, label=_("Email"))
    name = forms.CharField(required=False, label=pgettext_lazy("User's name", "Name"))


class ProductAlertUpdateForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        alert = kwargs["instance"]
        if alert.user:
            # Remove 'unconfirmed' from list of available choices when editing
            # an alert for a real user
            choices = self.fields["status"].choices
            del choices[0]
            self.fields["status"].choices = choices

        self.fields["status"].label = _("Status:")

        self.helper = FormHelper()
        self.helper.form_tag = False
        self.helper.form_show_errors = True
        self.helper.layout = Layout(
            Field("status", wrapper_class="form-label-inline"),
        )

    class Meta:
        model = ProductAlert
        fields = [
            "status",
        ]
        widgets = {
            "status": forms.Select(
                attrs={
                    "data-choices": "",
                    "data-choices-search-true": "",
                    "data-choices-sorting-true": "",
                }
            ),
        }


class ProductAlertSearchForm(forms.Form):
    STATUS_CHOICES = (("", "------------"),) + ProductAlert.STATUS_CHOICES

    status = forms.ChoiceField(
        required=False,
        choices=STATUS_CHOICES,
        label=_("Status"),
        widget=forms.Select(
            attrs={
                "data-choices": "",
                "data-choices-search-true": "",
                "data-choices-removeItem": "",
                "data-choices-sorting-true": "",
            }
        ),
    )
    name = forms.CharField(required=False, label=_("Name"))
    email = forms.EmailField(required=False, label=_("Email"))

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.form_tag = False
        self.helper.form_show_errors = True
        self.helper.layout = Layout(
            Column(Field("status", wrapper_class=" "), css_class="col-sm-auto"),
            Column(Field("name", wrapper_class=" "), css_class="col-sm-auto"),
            Column(Field("email", wrapper_class=" "), css_class="col-sm-auto"),
        )
