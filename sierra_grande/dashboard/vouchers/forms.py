from crispy_bootstrap5.bootstrap5 import Field
from crispy_bootstrap5.bootstrap5 import FloatingField
from crispy_forms.helper import FormHelper
from crispy_forms.layout import HTML
from crispy_forms.layout import Column
from crispy_forms.layout import Hidden
from crispy_forms.layout import Layout
from crispy_forms.layout import Reset
from crispy_forms.layout import Row
from crispy_forms.layout import Submit
from django import forms
from django.db import transaction
from django.urls import reverse
from django.utils.html import format_html
from django.utils.translation import gettext
from django.utils.translation import gettext_lazy as _
from oscar.apps.voucher.utils import get_unused_code
from oscar.core.loading import get_class
from oscar.core.loading import get_model
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
            Row(
                Column(FloatingField("name"), css_class="col-lg-4 col-md-6"),
                Column(FloatingField("code"), css_class="col-lg-4 col-md-6"),
                Column(
                    Field(
                        "start_datetime",
                        template="oscar/forms/widgets/floating_field_date_picker.html",
                    ),
                    css_class="col-lg-4 col-md-6",
                ),
                Column(
                    Field(
                        "end_datetime",
                        template="oscar/forms/widgets/floating_field_date_picker.html",
                    ),
                    css_class="col-lg-4 col-md-6",
                ),
                Column(FloatingField("usage"), css_class="col-lg-4 col-md-6"),
                Column(FloatingField("offers"), css_class="col-lg-4 col-md-6"),
                Column(
                    HTML(
                        '<a class="btn btn-secondary w-100"'
                        f'href="{reverse("dashboard:voucher-list")}"'
                        f'role="button">{gettext("Cancel")}</a>',
                    ),
                    css_class="col-6 col-md-auto",
                ),
                Column(
                    Submit(
                        "submit",
                        _("Save"),
                        data_loading_text=_("Saving..."),
                        css_class="w-100",
                    ),
                    css_class="col-6 col-md-auto",
                ),
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
                        f'href="#">{_("Advanced Search")}</a>',
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
        self.helper.form_tag = False
        self.helper.layout = Layout(
            Row(
                Column(FloatingField("name"), css_class="col-lg-4 col-md-6"),
                Column(FloatingField("code_length"), css_class="col-lg-4 col-md-6"),
                Column(FloatingField("description"), css_class="col-lg-4 col-md-6"),
                Column(
                    Field(
                        "start_datetime",
                        template="oscar/forms/widgets/floating_field_date_picker.html",
                    ),
                    css_class="col-lg-4 col-md-6",
                ),
                Column(
                    Field(
                        "end_datetime",
                        template="oscar/forms/widgets/floating_field_date_picker.html",
                    ),
                    css_class="col-lg-4 col-md-6",
                ),
                Column(FloatingField("count"), css_class="col-lg-4 col-md-6"),
                Column(
                    FloatingField("usage", wrapper_class="mb-0"),
                    css_class="col-lg-4 col-md-6",
                ),
                Column(
                    FloatingField("offers", wrapper_class="m-0"),
                    css_class="col-lg-4 col-md-6",
                ),
                css_class="align-items-center",
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
