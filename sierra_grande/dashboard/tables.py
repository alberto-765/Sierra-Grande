import oscar.apps.dashboard.tables as table


class DashboardTable(table.DashboardTable):
    class Meta:
        template_name = "oscar/dashboard/table.html"
        attrs = {"class": "table table-bordered table-hover align-middle"}
