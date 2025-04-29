from crispy_bootstrap5.bootstrap5 import FloatingField, Field
from crispy_forms.helper import FormHelper
from crispy_forms.layout import HTML
from crispy_forms.layout import Column
from crispy_forms.layout import Hidden
from crispy_forms.layout import Layout
from crispy_forms.layout import Reset
from crispy_forms.layout import Row
from crispy_forms.layout import Submit, Div
from django import forms
from django.db import transaction
from django.urls import reverse
from django.utils.html import format_html
from django.utils.translation import gettext_lazy as _, gettext
from oscar.apps.voucher.utils import get_unused_code
from oscar.core.loading import get_model, get_class
from oscar.forms import widgets

Voucher = get_model("voucher", "Voucher")
VoucherSet = get_model("voucher", "VoucherSet")
ConditionalOffer = get_model("offer", "ConditionalOffer")
CustomSelectMultiple = get_class("dashboard.widgets", "CustomSelectMultiple")


class VoucherForm(forms.ModelForm):
    """
    A specialised form for creating a voucher model, and capturing the offers
    that apply to it.
    """

    offers = forms.ModelMultipleChoiceField(
        label=_("Which offers apply for this voucher?"),
        queryset=ConditionalOffer.objects.filter(offer_type=ConditionalOffer.VOUCHER),
        widget=CustomSelectMultiple(_("offer")),
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.form_method = "post"
        self.helper.layout = Layout(
            FloatingField("name"),
            FloatingField("code"),
            Field(
                "start_datetime",
                template="oscar/forms/widgets/floating_field_date_picker.html",
            ),
            Field(
                "end_datetime",
                template="oscar/forms/widgets/floating_field_date_picker.html",
            ),
            FloatingField("usage"),
            FloatingField("offers"),
            Div(
                Submit(
                    "submit",
                    _("Save"),
                    data_loading_text=_("Saving..."),
                ),
                HTML(
                    f'<a class="btn btn-secondary" href="{reverse("dashboard:voucher-list")}" role="button">{gettext("Cancel")}</a>'
                ),
                css_class="hstack column-gap-3 pt-3",
            ),
        )

    class Meta:
        model = Voucher
        fields = [
            "name",
            "code",
            "start_datetime",
            "end_datetime",
            "usage",
        ]

    def clean_code(self):
        return self.cleaned_data["code"].strip().upper()


class VoucherSearchForm(forms.Form):
    name = forms.CharField(required=False, label=_("Name"))
    code = forms.CharField(required=False, label=_("Code"))
    offer_name = forms.CharField(required=False, label=_("Offer name"))
    is_active = forms.NullBooleanField(
        required=False,
        label=_("Is active?"),
        widget=widgets.NullBooleanSelect,
    )
    in_set = forms.NullBooleanField(
        required=False,
        label=_("In voucher set?"),
        widget=widgets.NullBooleanSelect,
    )
    has_offers = forms.NullBooleanField(
        required=False,
        label=_("Has offers?"),
        widget=widgets.NullBooleanSelect,
    )

    basic_fields = [
        "name",
        "code",
        "is_active",
        "in_set",
    ]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.helper = FormHelper()
        # Create lists for the different field layouts
        self.helper.disable_csrf = True
        self.helper.form_method = "get"
        basic_field_layouts = []
        hidden_field_layouts = []

        # Process each field in the form
        for (
            field_name,
            field,
        ) in self.fields.items():
            if field_name in self.basic_fields and not (
                hasattr(field, "is_hidden") and field.is_hidden
            ):
                if field.widget.is_hidden:
                    # Campos básicos pero ocultos
                    basic_field_layouts.append(Hidden(field_name))
                else:
                    # Campos básicos visibles con form-floating
                    basic_field_layouts.append(
                        Column(FloatingField(field_name, wrapper_class="m-0")),
                    )
            else:
                # Campos no básicos como hidden inputs
                hidden_field_layouts.append(Hidden(field_name, field.initial or ""))

        # Finally, build the layout
        self.helper.layout = Layout(
            Row(
                *basic_field_layouts,
                Column(
                    Submit(
                        "submit",
                        _("Search"),
                        data_loading_text=_("Searching..."),
                    ),
                    css_class="col-auto",
                ),
                Column(
                    Reset("reset", _("Reset"), css_class="btn-secondary"),
                    css_class="col-auto",
                ),
                Column(
                    HTML(
                        '<a class="link-offset-3-hover link-underline '
                        'link-underline-opacity-0 link-underline-opacity-75-hover" '
                        'data-bs-toggle="modal" data-bs-target="#SearchModal" '
                        'href="#">{{ _("Advanced Search") }}</a>',
                    ),
                    css_class="col-auto",
                ),
                css_class="g-3 align-items-center",
            ),
            *hidden_field_layouts,
        )

    def clean_code(self):
        return self.cleaned_data["code"].upper()


class VoucherSetForm(forms.ModelForm):
    usage = forms.ChoiceField(
        choices=(("", "---------"), *Voucher.USAGE_CHOICES),
        label=_("Usage"),
    )

    offers = forms.ModelMultipleChoiceField(
        label=_("Which offers apply for this voucher set?"),
        queryset=ConditionalOffer.objects.filter(offer_type=ConditionalOffer.VOUCHER),
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.form_method = "post"
        self.helper.layout = Layout(
            FloatingField("name"),
            FloatingField("code_length"),
            FloatingField("description"),
            Field(
                "start_datetime",
                template="oscar/forms/widgets/floating_field_date_picker.html",
            ),
            Field(
                "end_datetime",
                template="oscar/forms/widgets/floating_field_date_picker.html",
            ),
            FloatingField("count"),
            Div(
                Submit(
                    "submit",
                    _("Save"),
                    data_loading_text=_("Saving..."),
                ),
                HTML(
                    f'<a class="btn btn-secondary" href="{reverse("dashboard:voucher-set-list")}" role="button">{gettext("Cancel")}</a>'
                ),
                css_class="hstack column-gap-3 pt-3",
            ),
        )

    class Meta:
        model = VoucherSet
        fields = [
            "name",
            "code_length",
            "description",
            "start_datetime",
            "end_datetime",
            "count",
        ]

    def clean_count(self):
        data = self.cleaned_data["count"]
        if (self.instance.pk is not None) and (data < self.instance.count):
            detail_url = reverse(
                "dashboard:voucher-set-detail",
                kwargs={"pk": self.instance.pk},
            )
            raise forms.ValidationError(
                format_html(
                    _(
                        "This cannot be used to delete vouchers (currently {}) in "
                        "this set. "
                        'You can do that on the <a href="{}">detail</a> page.',
                    ),
                    self.instance.count,
                    detail_url,
                ),
            )
        return data

    @transaction.atomic
    def save(self, commit=True):  # noqa: FBT002
        instance = super().save(commit)
        if commit:
            usage = self.cleaned_data["usage"]
            offers = self.cleaned_data["offers"]
            if instance is not None:
                # Update vouchers in this set
                for i, voucher in enumerate(instance.vouchers.order_by("date_created")):
                    voucher.name = (f"{instance.name} - {i + 1}",)
                    voucher.usage = usage
                    voucher.start_datetime = instance.start_datetime
                    voucher.end_datetime = instance.end_datetime
                    voucher.save()
                    voucher.offers.set(offers)
            # Add vouchers to this set
            vouchers_added = False
            for i in range(instance.vouchers.count(), instance.count):
                voucher = Voucher.objects.create(
                    name=f"{instance.name} - {i + 1}",
                    code=get_unused_code(length=instance.code_length),
                    voucher_set=instance,
                    usage=usage,
                    start_datetime=instance.start_datetime,
                    end_datetime=instance.end_datetime,
                )
                voucher.offers.add(*offers)
                vouchers_added = True
            if vouchers_added:
                instance.update_count()
        return instance


class VoucherSetSearchForm(forms.Form):
    code = forms.CharField(required=False, label=_("Code"))

    def clean_code(self):
        return self.cleaned_data["code"].upper()
