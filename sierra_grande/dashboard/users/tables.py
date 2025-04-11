# ruff: noqa: F403, F405

from oscar.apps.dashboard.users.tables import *

if hasattr(UserTable, "icon"):
    UserTable.icon = "fa-solid:users"
