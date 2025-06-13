from django_flatpickr.widgets import (
    DateTimePickerInput,
    DatePickerInput,
    TimePickerInput,
)
from django.templatetags.static import static
from django import forms


class CustomDatePickerInput(DatePickerInput):
    @property
    def media(self):
        return forms.Media(
            css={"all": [static("libs/flatpickr/flatpickr.min.css")]},
            js=[
                static("libs/flatpickr/flatpickr.min.js"),
                static("libs/flatpickr/django-flatpickr.js"),
            ],
        )


class CustomDateTimePickerInput(DateTimePickerInput):
    @property
    def media(self):
        return forms.Media(
            css={"all": [static("libs/flatpickr/flatpickr.min.css")]},
            js=[
                static("libs/flatpickr/flatpickr.min.js"),
                static("libs/flatpickr/django-flatpickr.js"),
            ],
        )


class CustomTimePickerInput(TimePickerInput):
    @property
    def media(self):
        return forms.Media(
            css={"all": [static("libs/flatpickr/flatpickr.min.css")]},
            js=[
                static("libs/flatpickr/flatpickr.min.js"),
                static("libs/flatpickr/django-flatpickr.js"),
            ],
        )
