from oscar.apps.dashboard.catalogue.tables import *  # noqa: F403

ProductTable.icon = "streamline:pork-meat-solid"  # noqa: F405
ProductTable.Meta.attrs = {  # noqa: F405
    "class": "table table-striped table-bordered caption-top",
}
CategoryTable.icon = AttributeOptionGroupTable.icon = "fa-solid:sitemap"  # noqa: F405
OptionTable.icon = ""  # noqa: F405
