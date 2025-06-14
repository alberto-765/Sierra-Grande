import json
from datetime import timedelta
from decimal import ROUND_UP
from decimal import Decimal as D

from django.contrib import messages
from django.contrib.auth import views as auth_views
from django.contrib.auth.forms import AuthenticationForm
from django.db.models import Avg
from django.db.models import Count
from django.db.models import Sum
from django.template.response import TemplateResponse
from django.urls import reverse_lazy
from django.utils.timezone import now
from django.views.generic import TemplateView
from oscar.core.compat import get_user_model
from oscar.core.loading import get_class
from oscar.core.loading import get_model

RelatedFieldWidgetWrapper = get_class("dashboard.widgets", "RelatedFieldWidgetWrapper")
ConditionalOffer = get_model("offer", "ConditionalOffer")
Voucher = get_model("voucher", "Voucher")
Basket = get_model("basket", "Basket")
StockAlert = get_model("partner", "StockAlert")
Product = get_model("catalogue", "Product")
Order = get_model("order", "Order")
Line = get_model("order", "Line")
User = get_user_model()


class IndexView(TemplateView):
    """
    An overview view which displays several reports about the shop.

    Supports the permission-based dashboard. It is recommended to add a
    :file:`oscar/dashboard/index_nonstaff.html` template because Oscar's
    default template will display potentially sensitive store information.
    """

    def get_template_names(self):
        if self.request.user.is_staff:
            return [
                "oscar/dashboard/index.html",
            ]
        # TODO: Add a template for non-staff users.
        return ["oscar/dashboard/index_nonstaff.html", "oscar/dashboard/index.html"]

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx.update(self.get_stats())
        return ctx

    def get_active_vouchers(self):
        """
        Get all active vouchers. The returned ``Queryset`` of vouchers
        is filtered by end date greater then the current date.
        """
        return Voucher.objects.filter(end_datetime__gt=now())

    def get_daily_report_last_week(self, orders):
        """
        Generate a report of order revenue for the last 7 days, split by day.
        Returns a context dictionary with daily totals for use in a column chart.
        """
        # Get current time, set to start of day
        time_now = now().replace(hour=0, minute=0, second=0, microsecond=0)
        start_date = time_now - timedelta(
            days=6
        )  # Start 6 days ago to include 7 days total

        daily_totals = []
        for i in range(7):
            current_date = start_date + timedelta(days=i)
            next_date = current_date + timedelta(days=1)
            daily_orders = orders.filter(
                date_placed__gte=current_date,
                date_placed__lt=next_date,
            )
            total = daily_orders.aggregate(Sum("total_incl_tax"))[
                "total_incl_tax__sum"
            ] or D("0.0")
            daily_totals.append(
                {
                    "date": current_date.strftime("%a %d %b"),  # e.g., "Mon 14 Jun"
                    "total_incl_tax": float(total),  # Convert to float for JavaScript
                }
            )

        ctx = {
            "daily_totals": daily_totals,
        }
        return ctx

    def get_stats(self):
        datetime_24hrs_ago = now() - timedelta(hours=24)

        orders = Order.objects.all()
        alerts = StockAlert.objects.all()
        baskets = Basket.objects.filter(status=Basket.OPEN)
        customers = User.objects.filter(orders__isnull=False).distinct()
        lines = Line.objects.filter()
        products = Product.objects.all()

        user = self.request.user
        if not user.is_staff:
            partners_ids = tuple(user.partners.values_list("id", flat=True))
            orders = orders.filter(lines__partner_id__in=partners_ids).distinct()
            alerts = alerts.filter(stockrecord__partner_id__in=partners_ids)
            baskets = baskets.filter(
                lines__stockrecord__partner_id__in=partners_ids,
            ).distinct()
            customers = customers.filter(
                orders__lines__partner_id__in=partners_ids,
            ).distinct()
            lines = lines.filter(partner_id__in=partners_ids)
            products = products.filter(stockrecords__partner_id__in=partners_ids)

        orders_last_day = orders.filter(date_placed__gt=datetime_24hrs_ago)

        open_alerts = alerts.filter(status=StockAlert.OPEN)
        closed_alerts = alerts.filter(status=StockAlert.CLOSED)

        total_lines_last_day = lines.filter(order__in=orders_last_day).count()
        stats = {
            "total_orders_last_day": orders_last_day.count(),
            "total_lines_last_day": total_lines_last_day,
            "average_order_costs": orders_last_day.aggregate(Avg("total_incl_tax"))[
                "total_incl_tax__avg"
            ]
            or D("0.00"),
            "total_revenue_last_day": orders_last_day.aggregate(Sum("total_incl_tax"))[
                "total_incl_tax__sum"
            ]
            or D("0.00"),
            "daily_report_dict": self.get_daily_report_last_week(orders),
            "total_customers_last_day": customers.filter(
                date_joined__gt=datetime_24hrs_ago,
            ).count(),
            "total_open_baskets_last_day": baskets.filter(
                date_created__gt=datetime_24hrs_ago,
            ).count(),
            "total_products": products.count(),
            "total_open_stock_alerts": open_alerts.count(),
            "total_closed_stock_alerts": closed_alerts.count(),
            "total_customers": customers.count(),
            "total_open_baskets": baskets.count(),
            "total_orders": orders.count(),
            "total_lines": lines.count(),
            "total_revenue": orders.aggregate(Sum("total_incl_tax"))[
                "total_incl_tax__sum"
            ]
            or D("0.00"),
            "order_status_breakdown": orders.order_by("status")
            .values("status")
            .annotate(freq=Count("id")),
        }
        if user.is_staff:
            stats.update(
                offer_maps=(
                    ConditionalOffer.objects.filter(end_datetime__gt=now())
                    .values("offer_type")
                    .annotate(count=Count("id"))
                    .order_by("offer_type")
                ),
                total_vouchers=self.get_active_vouchers().count(),
            )
        return stats


class PopUpWindowMixin:
    @property
    def is_popup(self):
        return self.request.GET.get(
            RelatedFieldWidgetWrapper.IS_POPUP_VAR,
            self.request.POST.get(RelatedFieldWidgetWrapper.IS_POPUP_VAR),
        )

    @property
    def is_popup_var(self):
        return RelatedFieldWidgetWrapper.IS_POPUP_VAR

    def add_success_message(self, message):
        if not self.is_popup:
            messages.success(self.request, message)


class PopUpWindowCreateUpdateMixin(PopUpWindowMixin):
    @property
    def to_field(self):
        return self.request.GET.get(
            RelatedFieldWidgetWrapper.TO_FIELD_VAR,
            self.request.POST.get(RelatedFieldWidgetWrapper.TO_FIELD_VAR),
        )

    @property
    def to_field_var(self):
        return RelatedFieldWidgetWrapper.TO_FIELD_VAR

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)

        if self.is_popup:
            ctx["to_field"] = self.to_field
            ctx["to_field_var"] = self.to_field_var
            ctx["is_popup"] = self.is_popup
            ctx["is_popup_var"] = self.is_popup_var

        return ctx


class PopUpWindowCreateMixin(PopUpWindowCreateUpdateMixin):
    def popup_response(self, obj):
        if self.to_field:
            attr = str(self.to_field)
        else:
            attr = obj._meta.pk.attname
        value = obj.serializable_value(attr)
        popup_response_data = json.dumps(
            {
                "value": str(value),
                "obj": str(obj),
            },
        )
        return TemplateResponse(
            self.request,
            "oscar/dashboard/widgets/popup_response.html",
            {
                "popup_response_data": popup_response_data,
            },
        )


class PopUpWindowUpdateMixin(PopUpWindowCreateUpdateMixin):
    def popup_response(self, obj):
        opts = obj._meta
        if self.to_field:
            attr = str(self.to_field)
        else:
            attr = opts.pk.attname
        # Retrieve the `object_id` from the resolved pattern arguments.
        value = self.request.resolver_match.kwargs["pk"]
        new_value = obj.serializable_value(attr)
        popup_response_data = json.dumps(
            {
                "action": "change",
                "value": str(value),
                "obj": str(obj),
                "new_value": str(new_value),
            },
        )
        return TemplateResponse(
            self.request,
            "oscar/dashboard/widgets/popup_response.html",
            {
                "popup_response_data": popup_response_data,
            },
        )


class PopUpWindowDeleteMixin(PopUpWindowMixin):
    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)

        if self.is_popup:
            ctx["is_popup"] = self.is_popup
            ctx["is_popup_var"] = self.is_popup_var

        return ctx

    def delete(self, request, *args, **kwargs):
        """
        Calls the delete() method on the fetched object and then
        redirects to the success URL, or closes the popup, it it is one.
        """
        obj = self.get_object()

        response = super().delete(request, *args, **kwargs)

        if self.is_popup:
            obj_id = obj.pk
            popup_response_data = json.dumps(
                {
                    "action": "delete",
                    "value": str(obj_id),
                },
            )
            return TemplateResponse(
                request,
                "oscar/dashboard/widgets/popup_response.html",
                {
                    "popup_response_data": popup_response_data,
                },
            )
        return response

    def post(self, request, *args, **kwargs):
        """
        Calls the delete() method on the fetched object and then
        redirects to the success URL, or closes the popup, it it is one.
        """
        return self.delete(request, *args, **kwargs)


class LoginView(auth_views.LoginView):
    template_name = "oscar/dashboard/login.html"
    authentication_form = AuthenticationForm
    login_redirect_url = reverse_lazy("dashboard:index")

    def get_success_url(self):
        url = self.get_redirect_url()
        return url or self.login_redirect_url
