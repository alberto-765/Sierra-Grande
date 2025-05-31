from crispy_bootstrap5.bootstrap5 import FloatingField
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Column
from crispy_forms.layout import Field
from crispy_forms.layout import Layout
from crispy_forms.layout import Row
from crispy_forms.layout import Submit
from django import forms
from django.utils.translation import gettext_lazy as _
from oscar.core.loading import get_model

ProductReview = get_model("reviews", "productreview")


class DashboardProductReviewForm(forms.ModelForm):
    choices = (
        (ProductReview.APPROVED, _("Approved")),
        (ProductReview.REJECTED, _("Rejected")),
    )
    status = forms.ChoiceField(choices=choices, label=_("Status"))

    class Meta:
        model = ProductReview
        fields = ("title", "body", "score", "status")


class ProductReviewSearchForm(forms.Form):
    STATUS_CHOICES = (("", "------------"), *ProductReview.STATUS_CHOICES)
    keyword = forms.CharField(required=False, label=_("Keyword"))
    status = forms.ChoiceField(
        required=False,
        choices=STATUS_CHOICES,
        label=_("Status"),
    )
    date_from = forms.DateTimeField(required=False, label=_("Date from"))
    date_to = forms.DateTimeField(required=False, label=_("Date to"))
    name = forms.CharField(required=False, label=_("Customer name"))

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.form_method = "GET"
        self.helper.layout = Layout(
            Row(
                Column(FloatingField("name", wrapper_class="m-0")),
                Column(FloatingField("keyword", wrapper_class="m-0")),
                Column(FloatingField("status", wrapper_class="m-0")),
                Column(
                    Field(
                        "date_from",
                        template="oscar/forms/widgets/floating_field_date_picker.html",
                        wrapper_class=" ",
                    ),
                ),
                Column(
                    Field(
                        "date_to",
                        template="oscar/forms/widgets/floating_field_date_picker.html",
                        wrapper_class=" ",
                    ),
                ),
                Column(
                    Submit(
                        "submit",
                        _("Search"),
                        css_class="btn btn-darken-primary",
                        data={"loading-text": _("Searching...")},
                    ),
                ),
                css_class="align-items-center",
            ),
        )

    def get_friendly_status(self):
        raw = int(self.cleaned_data["status"])
        for key, value in self.STATUS_CHOICES:
            if key == raw:
                return value
        return ""
