import datetime

from crispy_bootstrap5.bootstrap5 import FloatingField
from crispy_forms.helper import FormHelper
from crispy_forms.layout import HTML
from crispy_forms.layout import Column
from crispy_forms.layout import Field
from crispy_forms.layout import Layout
from crispy_forms.layout import Row
from crispy_forms.layout import Submit
from django import forms
from django.http import QueryDict
from django.urls import reverse_lazy
from django.utils.translation import gettext as _
from django.utils.translation import gettext_lazy
from django.utils.translation import pgettext_lazy
from oscar.core.loading import get_class
from oscar.core.loading import get_model
from oscar.forms.mixins import PhoneNumberMixin

Order = get_model("order", "Order")
OrderNote = get_model("order", "OrderNote")
ShippingAddress = get_model("order", "ShippingAddress")
SourceType = get_model("payment", "SourceType")
AbstractAddressForm = get_class("address.forms", "AbstractAddressForm")


class OrderStatsForm(forms.Form):
    date_from = forms.DateField(
        required=False,
        label=pgettext_lazy("start date", "Date from"),
    )
    date_to = forms.DateField(
        required=False,
        label=pgettext_lazy("end date", "Date to"),
    )

    _filters = _description = None
    action = reverse_lazy("dashboard:order-stats")

    def _determine_filter_metadata(self):
        self._filters = {}
        self._description = gettext_lazy("All orders")
        if self.errors:
            return

        date_from = self.cleaned_data["date_from"]
        date_to = self.cleaned_data["date_to"]
        if date_from and date_to:
            # We want to include end date so we adjust the date we use with the
            # 'range' function.
            self._filters = {
                "date_placed__range": [date_from, date_to + datetime.timedelta(days=1)],
            }
            self._description = gettext_lazy(
                "Orders placed between %(date_from)s and %(date_to)s",
            ) % {"date_from": date_from, "date_to": date_to}
        elif date_from and not date_to:
            self._filters = {"date_placed__gte": date_from}
            self._description = gettext_lazy("Orders placed since %s") % (date_from,)
        elif not date_from and date_to:
            self._filters = {"date_placed__lte": date_to}
            self._description = gettext_lazy("Orders placed until %s") % (date_to,)
        else:
            self._filters = {}
            self._description = gettext_lazy("All orders")

    def get_filters(self):
        if self._filters is None:
            self._determine_filter_metadata()
        return self._filters

    def get_filter_description(self):
        if self._description is None:
            self._determine_filter_metadata()
        return self._description

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.form_method = "GET"
        self.helper.form_action = self.action
        self.helper.layout = Layout(
            Row(
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
                        _("Filter result"),
                        css_class="btn btn-primary w-100",
                        data={"loading-text": _("Filtering...")},
                    ),
                    css_class="col-sm-auto",
                ),
                Column(
                    HTML(
                        f"""<a href="{self.action}"
                        'class="btn btn-secondary w-100">{_("Reset")}</a>""",
                    ),
                    css_class="col-sm-auto",
                ),
                css_class="align-items-center",
            ),
        )


class OrderSearchForm(forms.Form):
    order_number = forms.CharField(required=False, label=gettext_lazy("Order number"))
    name = forms.CharField(required=False, label=gettext_lazy("Customer name"))
    product_title = forms.CharField(required=False, label=gettext_lazy("Product name"))
    upc = forms.CharField(required=False, label=gettext_lazy("UPC"))
    partner_sku = forms.CharField(required=False, label=gettext_lazy("Partner SKU"))

    status_choices = (
        ("", "---------"),
        *tuple(
            [(v, v) for v in Order.all_statuses()],
        ),
    )
    status = forms.ChoiceField(
        choices=status_choices,
        label=gettext_lazy("Status"),
        required=False,
    )

    date_from = forms.DateField(
        required=False,
        label=gettext_lazy("Date from"),
    )
    date_to = forms.DateField(
        required=False,
        label=gettext_lazy("Date to"),
        widget=forms.DateInput(attrs={"type": "date", "class": "form-control"}),
    )

    voucher = forms.CharField(required=False, label=gettext_lazy("Voucher code"))

    payment_method = forms.ChoiceField(
        label=gettext_lazy("Payment method"),
        required=False,
        choices=(),
    )

    format_choices = (
        ("html", gettext_lazy("HTML")),
        ("csv", gettext_lazy("CSV")),
    )
    response_format = forms.ChoiceField(
        widget=forms.RadioSelect,
        required=False,
        choices=format_choices,
        initial="html",
        label=gettext_lazy("Get results as"),
    )

    def __init__(self, *args, **kwargs):
        # Ensure that 'response_format' is always set
        if "data" in kwargs:
            data = kwargs["data"]
            del kwargs["data"]
        elif len(args) > 0:
            data = args[0]
            args = args[1:]
        else:
            data = None

        if data:
            if data.get("response_format", None) not in self.format_choices:
                # Handle POST/GET dictionaries, which are immutable.
                if isinstance(data, QueryDict):
                    data = data.dict()
                data["response_format"] = "html"

        super().__init__(data, *args, **kwargs)
        self.fields["payment_method"].choices = self.payment_method_choices()
        self.helper = FormHelper()
        self.helper.form_method = "GET"
        self.helper.form_id = "search_form"
        self.helper.layout = Layout(
            Row(
                Column(
                    FloatingField("order_number", wrapper_class="m-0"),
                    css_class="col-auto",
                ),
                Column(
                    Submit(
                        "submit",
                        _("Search"),
                        data_loading_text=_("Searching..."),
                        css_class="btn-darken-primary",
                    ),
                    css_class="col-auto",
                ),
                Column(
                    HTML(
                        '<a class="link-offset-3-hover link-underline '
                        'link-underline-opacity-0 link-underline-opacity-75-hover" '
                        'data-bs-toggle="modal" data-bs-target="#SearchModal" '
                        f'href="#">{ _("Advanced Search") }</a>',
                    ),
                    css_class="col-auto",
                ),
                css_class="g-3 align-items-center",
            ),
        )

    def payment_method_choices(self):
        return (
            ("", "---------"),
            *tuple(
                [(src.code, src.name) for src in SourceType.objects.all()],
            ),
        )


class OrderNoteForm(forms.ModelForm):
    class Meta:
        model = OrderNote
        fields = ["message"]

    def __init__(self, order, user, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.instance.order = order
        self.instance.user = user


class ShippingAddressForm(PhoneNumberMixin, AbstractAddressForm):
    class Meta:
        model = ShippingAddress
        fields = [
            "first_name",
            "last_name",
            "line1",
            "line2",
            "line3",
            "line4",
            "state",
            "postcode",
            "country",
            "phone_number",
            "notes",
        ]


class OrderStatusForm(forms.Form):
    new_status = forms.ChoiceField(label=_("New order status"), choices=())

    def __init__(self, order, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # Set the choices
        choices = [(x, x) for x in order.available_statuses()]
        self.fields["new_status"].choices = choices

    @property
    def has_choices(self):
        return len(self.fields["new_status"].choices) > 0
