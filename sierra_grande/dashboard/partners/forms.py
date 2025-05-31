from crispy_bootstrap5.bootstrap5 import Field
from crispy_bootstrap5.bootstrap5 import FloatingField
from crispy_forms.helper import FormHelper
from crispy_forms.layout import HTML
from crispy_forms.layout import Column
from crispy_forms.layout import Div
from crispy_forms.layout import Layout
from crispy_forms.layout import Row
from crispy_forms.layout import Submit
from django import forms
from django.contrib.auth.models import Permission
from django.contrib.auth.password_validation import validate_password
from django.urls import reverse
from django.utils.translation import gettext
from django.utils.translation import gettext_lazy as _
from django.utils.translation import pgettext_lazy
from oscar.core.compat import existing_user_fields
from oscar.core.compat import get_user_model
from oscar.core.loading import get_class
from oscar.core.loading import get_model

User = get_user_model()
Partner = get_model("partner", "Partner")
PartnerAddress = get_model("partner", "PartnerAddress")
EmailUserCreationForm = get_class("customer.forms", "EmailUserCreationForm")


class PartnerSearchForm(forms.Form):
    name = forms.CharField(
        required=False,
        label=pgettext_lazy("Partner's name", "Name"),
    )


class PartnerCreateForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Partner.name is optional and that is okay. But if creating through
        # the dashboard, it seems sensible to enforce as it's the only field
        # in the form.
        self.fields["name"].required = True
        self.helper = FormHelper()
        self.helper.form_tag = False
        self.helper.layout = Layout(
            Row(
                Column(
                    FloatingField("name", wrapper_class=" "),
                    css_class="col-sm-auto",
                )
            )
        )

    class Meta:
        model = Partner
        fields = ("name",)


ROLE_CHOICES = (
    ("staff", _("Full dashboard access")),
    ("limited", _("Limited dashboard access")),
)


class NewUserForm(EmailUserCreationForm):
    role = forms.ChoiceField(
        choices=ROLE_CHOICES,
        widget=forms.RadioSelect,
        label=_("User role"),
        initial="limited",
    )

    def __init__(self, partner, *args, **kwargs):
        self.partner = partner
        super().__init__(host=None, *args, **kwargs)
        self.helper = FormHelper()
        self.helper.form_method = "post"
        self.helper.form_class = "card card-body wysiwyg"
        self.helper.layout = Layout(
            FloatingField("first_name"),
            FloatingField("last_name"),
            FloatingField("email"),
            FloatingField("password1"),
            FloatingField("password2"),
            Field("role"),
            Div(
                Submit(
                    "submit",
                    _("Save"),
                    data_loading_text=_("Saving..."),
                    css_class="btn-darken-primary",
                ),
                HTML(
                    '<a class="btn btn-secondary"'
                    f'href="{reverse("dashboard:partner-managet", kwargs={"partner_pk": partner.id})}"'
                    f'role="button">{gettext("Cancel")}</a>',
                ),
                css_class="hstack column-gap-3",
            ),
        )

    def save(self):
        role = self.cleaned_data.get("role", "limited")
        user = super().save(commit=False)
        user.is_staff = role == "staff"
        user.save()
        self.partner.users.add(user)
        if role == "limited":
            dashboard_access_perm = Permission.objects.get(
                codename="dashboard_access",
                content_type__app_label="partner",
            )
            user.user_permissions.add(dashboard_access_perm)
        return user

    class Meta:
        model = User
        fields = existing_user_fields(["first_name", "last_name", "email"]) + [
            "password1",
            "password2",
        ]


class ExistingUserForm(forms.ModelForm):
    """
    Slightly different form that makes
    * makes saving password optional
    * doesn't regenerate username
    * doesn't allow changing email till #668 is resolved
    """

    role = forms.ChoiceField(
        choices=ROLE_CHOICES,
        widget=forms.RadioSelect,
        label=_("User role"),
    )
    password1 = forms.CharField(
        label=_("Password"),
        widget=forms.PasswordInput,
        required=False,
    )
    password2 = forms.CharField(
        required=False,
        label=_("Confirm Password"),
        widget=forms.PasswordInput,
    )

    def clean_password2(self):
        password1 = self.cleaned_data.get("password1", "")
        password2 = self.cleaned_data.get("password2", "")

        if password1 != password2:
            raise forms.ValidationError(_("The two password fields didn't match."))
        validate_password(password2, self.instance)
        return password2

    def __init__(self, *args, **kwargs):
        user = kwargs["instance"]
        role = "staff" if user.is_staff else "limited"
        kwargs.get("initial", {}).setdefault("role", role)
        super().__init__(*args, **kwargs)

    def save(self, commit=False):
        role = self.cleaned_data.get("role", "none")
        user = super().save(commit=False)
        user.is_staff = role == "staff"
        if self.cleaned_data["password1"]:
            user.set_password(self.cleaned_data["password1"])
        user.save()

        dashboard_perm = Permission.objects.get(
            codename="dashboard_access",
            content_type__app_label="partner",
        )
        user_has_perm = user.user_permissions.filter(pk=dashboard_perm.pk).exists()
        if role == "limited" and not user_has_perm:
            user.user_permissions.add(dashboard_perm)
        elif role == "staff" and user_has_perm:
            user.user_permissions.remove(dashboard_perm)
        return user

    class Meta:
        model = User
        fields = existing_user_fields(["first_name", "last_name"]) + [
            "password1",
            "password2",
        ]


class UserEmailForm(forms.Form):
    # We use a CharField so that a partial email address can be entered
    email = forms.CharField(
        label=_("Email address"),
        max_length=100,
        help_text=_(
            "A partial email address can be entered (eg '@example.com') to match multiple addresses.",
        ),
    )

    def __init__(self, *args, partner=None, **kwargs):
        super().__init__(*args, **kwargs)
        self.partner = partner
        reset_button = tuple()
        if self.is_bound and partner:
            reset_button = (
                Column(
                    HTML(
                        '<a class="btn btn-secondary w-100"'
                        f'href="{reverse("dashboard:partner-user-select", kwargs={"partner_pk": partner.id})}"'
                        f'role="button">{gettext("Reset")}</a>',
                    ),
                    css_class="col-sm-auto",
                ),
            )

        self.helper = FormHelper()
        self.helper.form_method = "get"
        self.helper.layout = Layout(
            Row(
                Column(
                    FloatingField("email", wrapper_class=" "),
                    css_class="col-sm-auto",
                ),
                Column(
                    Submit(
                        "submit",
                        _("Search"),
                        data_loading_text=_("Searching..."),
                        css_class="btn-darken-primary w-100",
                    ),
                    css_class="col-sm-auto",
                ),
                *reset_button,
                css_class="align-items-baseline g-3",
            ),
        )


class PartnerAddressForm(forms.ModelForm):
    name = forms.CharField(
        required=False,
        max_length=128,
        label=pgettext_lazy("Partner's name", "Name"),
    )

    class Meta:
        fields = (
            "name",
            "line1",
            "line2",
            "line3",
            "line4",
            "state",
            "postcode",
            "country",
        )
        model = PartnerAddress

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.form_tag = False
        self.helper.layout = Layout(
            FloatingField("name"),
            FloatingField("line1"),
            FloatingField("line2"),
            FloatingField("line3"),
            FloatingField("line4"),
            FloatingField("state"),
            FloatingField("postcode"),
            FloatingField("country"),
        )
