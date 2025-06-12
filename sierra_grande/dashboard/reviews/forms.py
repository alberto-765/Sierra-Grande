from crispy_forms.helper import FormHelper
from crispy_forms.layout import Column, Row
from crispy_forms.layout import Field
from crispy_forms.layout import Layout
from django import forms
from django.utils.translation import gettext_lazy as _
from oscar.core.loading import get_model

ProductReview = get_model("reviews", "productreview")


class DashboardProductReviewForm(forms.ModelForm):
    choices = (
        (ProductReview.APPROVED, _("Approved")),
        (ProductReview.REJECTED, _("Rejected")),
    )
    status = forms.ChoiceField(
        choices=choices,
        label=_("Update status of selected reviews:"),
        widget=forms.Select(
            attrs={
                "data-choices": "",
                "data-choices-search-true": "",
                "data-choices-sorting-true": "",
            },
        ),
    )

    def __init__(self, *args, update_view=True, **kwargs):
        super().__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.form_tag = False
        self.helper.form_show_errors = True
        if update_view:
            self.helper.layout = Layout(
                Row(
                    "title",
                    "body",
                    Column(Field("score", wrapper_class="mb-3 mb-md-0")),
                    Column(Field("status", wrapper_class=" ")),
                )
            )
        else:
            self.helper.layout = Layout(
                Field("status", wrapper_class="form-label-inline")
            )

    class Meta:
        model = ProductReview
        fields = ("title", "body", "score", "status")
        widgets = {
            "score": forms.Select(
                attrs={
                    "data-choices": "",
                    "data-choices-search-true": "",
                    "data-choices-removeItem": "",
                    "data-choices-sorting-true": "",
                },
            ),
            "body": forms.Textarea(
                attrs={
                    "rows": 6,
                }
            ),
        }


class ProductReviewSearchForm(forms.Form):
    STATUS_CHOICES = (("", "------------"), *ProductReview.STATUS_CHOICES)
    keyword = forms.CharField(required=False, label=_("Keyword"))
    status = forms.ChoiceField(
        required=False,
        choices=STATUS_CHOICES,
        label=_("Status"),
        widget=forms.Select(
            attrs={
                "data-choices": "",
                "data-choices-search-true": "",
                "data-choices-sorting-true": "",
            },
        ),
    )
    date_from = forms.DateTimeField(required=False, label=_("Date from"))
    date_to = forms.DateTimeField(required=False, label=_("Date to"))
    name = forms.CharField(required=False, label=_("Customer name"))

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.form_tag = False
        self.helper.form_show_errors = True
        self.helper.layout = Layout(
            Column(Field("name", wrapper_class="m-0"), css_class="col-md-auto"),
            Column(Field("keyword", wrapper_class="m-0"), css_class="col-md-auto"),
            Column(Field("status", wrapper_class="m-0"), css_class="col-md-auto"),
            Column(
                Field(
                    "date_from",
                    wrapper_class=" ",
                ),
                css_class="col-md-auto",
            ),
            Column(
                Field(
                    "date_to",
                    wrapper_class=" ",
                ),
                css_class="col-md-auto",
            ),
        )

    def get_friendly_status(self):
        raw = int(self.cleaned_data["status"])
        for key, value in self.STATUS_CHOICES:
            if key == raw:
                return value
        return ""
