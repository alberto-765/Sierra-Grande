from crispy_bootstrap5.bootstrap5 import FloatingField
from crispy_bootstrap5.bootstrap5 import Switch
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Column
from crispy_forms.layout import Field
from crispy_forms.layout import Layout
from crispy_forms.layout import Row
from crispy_forms.layout import Submit
from django import forms
from django.utils.translation import gettext_lazy as _
from django.utils.translation import gettext
from oscar.core.loading import get_class

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
    )
    date_to = forms.DateField(
        label=_("Date to"),
        help_text=_("The report is inclusive of this date"),
        required=False,
    )
    download = forms.BooleanField(label=_("Download"), required=False)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.form_method = "GET"
        self.helper.layout = Layout(
            Row(
                Column(FloatingField("report_type", wrapper_class="m-0")),
                Column(
                    Field(
                        "date_from",
                        template="oscar/forms/widgets/floating_field_date_picker.html",
                    ),
                ),
                Column(
                    Field(
                        "date_to",
                        template="oscar/forms/widgets/floating_field_date_picker.html",
                    ),
                ),
            ),
            Row(
                Column(Switch("download", label="Pito")),
                Column(
                    Submit(
                        "submit",
                        gettext("Generate report"),
                        css_class="btn btn-primary",
                        data={"loading-text": gettext("Generating...")},
                    ),
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
