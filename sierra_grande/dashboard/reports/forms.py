from crispy_forms.helper import FormHelper
from crispy_forms.layout import Submit, Layout, Row, Column
from crispy_bootstrap5.bootstrap5 import FloatingField, Switch
from django import forms
from django.utils.translation import gettext_lazy as _
from oscar.core.loading import get_class
from oscar.forms.widgets import DatePickerInput

GeneratorRepository = get_class("dashboard.reports.utils", "GeneratorRepository")


class ReportForm(forms.Form):
    generators = GeneratorRepository().get_report_generators()

    type_choices = [(generator.code, generator.description) for generator in generators]

    report_type = forms.ChoiceField(
        widget=forms.Select(),
        choices=type_choices,
        label=_("Report Type"),
        help_text=_("Only the offer and order reports use the selected date range"),
    )

    date_from = forms.DateField(
        label=_("Date from"),
        required=False,
        widget=DatePickerInput,
    )
    date_to = forms.DateField(
        label=_("Date to"),
        help_text=_("The report is inclusive of this date"),
        required=False,
        widget=DatePickerInput,
    )
    download = forms.BooleanField(label=_("Download"), required=False)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.form_method = "GET"
        self.helper.layout = Layout(
            Row(
                Column(FloatingField("report_type")),
                Column("date_from"),
                Column(FloatingField("date_to")),
            ),
            Row(
                Column(Switch("download", label="Pito")),
                Column(
                    Submit(
                        "submit",
                        _("Generate report"),
                        css_class="btn btn-primary",
                        data={"loading-text": _("Generating...")},
                    )
                ),
            ),
        )

    def clean(self):
        date_from = self.cleaned_data.get("date_from", None)
        date_to = self.cleaned_data.get("date_to", None)
        if (
            all([date_from, date_to])
            and self.cleaned_data["date_from"] > self.cleaned_data["date_to"]
        ):
            raise forms.ValidationError(
                _("Your start date must be before your end date"),
            )
        return self.cleaned_data
