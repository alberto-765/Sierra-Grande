import oscar.apps.dashboard.tables as table


class DashboardTable(table.DashboardTable):
    class Meta:
        template_name = "oscar/dashboard/table.html"
        attrs = {"class": "table table-hover align-middle mb-0"}
