from django import forms

from oscar.core.loading import get_model
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Layout
from crispy_bootstrap5.bootstrap5 import Field

from tinymce.widgets import TinyMCE


class WeightBasedForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.form_tag = False
        self.helper.disable_csrf = True
        self.helper.layout = Layout(
            "name",
            "description",
            "default_weight",
            Field("countries", wrapper_class=" "),
        )

    class Meta:
        model = get_model("shipping", "WeightBased")
        fields = ["name", "description", "default_weight", "countries"]
        widgets = {
            "description": TinyMCE(
                attrs={"cols": 80, "rows": 30},
            ),
            "countries": forms.Select(
                attrs={
                    "data-choices": "",
                    "data-choices-search-true": "",
                    "data-choices-removeItem": "",
                    "data-choices-sorting-true": "",
                },
            ),
        }


class WeightBandForm(forms.ModelForm):
    def __init__(self, method, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.instance.method = method
        self.helper = FormHelper()
        self.helper.form_tag = False
        self.helper.disable_csrf = True
        self.helper.layout = Layout(
            "upper_limit",
            "charge",
        )

    class Meta:
        model = get_model("shipping", "WeightBand")
        fields = ("upper_limit", "charge")
