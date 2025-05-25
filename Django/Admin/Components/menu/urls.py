from django.urls import path
from menu.views import (
    
    # bootstrap_ui
    alerts_view,
    badges_view,
    buttons_view,
    colors_view,
    cards_view,
    carousel_view,
    dropdowns_view,
    grid_view,
    images_view,
    tabs_view,
    accordions_view,
    modals_view,
    offcanvas_view,
    placeholders_view,
    progress_view,
    notifications_view,
    media_view,
    embed_video_view,
    typography_view,
    lists_view,
    general_view,
    utilities_view,
    
    # advance-ui
    advance_ui_sweetalerts_view,
    advance_ui_nestable_view,
    advance_ui_scrollbar_view,
    advance_ui_swiper_view,
    advance_ui_ratings_view,
    advance_ui_highlight_view,
    advance_ui_scrollspy_view,
    
    # custom-ui
    custom_ui_ribbons_view,
    custom_ui_profile_view,
    custom_ui_counter_view,
    
    # forms
    forms_elements_view,
    forms_select_view,
    forms_checkboxs_radios_view,
    forms_pickers_view,
    forms_input_masks_view,
    forms_advanced_view,
    forms_range_sliders_view,
    forms_validation_view,
    forms_wizard_view,
    forms_editors_view,
    forms_file_upload_view,
    forms_layouts_view,
    forms_tom_select_view,
    
    # tables
    tables_basic_view,
    tables_gridjs_view,
    tables_listjs_view,
    tables_datatables_view,
    
    # apexcharts
    apexcharts_line_view,
    apexcharts_area_view,
    apexcharts_column_view,
    apexcharts_bar_view,
    apexcharts_mixed_view,
    apexcharts_timeline_view,
    apexcharts_candlestick_view,
    apexcharts_boxplot_view,
    apexcharts_bubble_view,
    apexcharts_scatter_view,
    apexcharts_heatmap_view,
    apexcharts_treemap_view,
    apexcharts_pie_view,
    apexcharts_radialbar_view,
    apexcharts_radar_view,
    apexcharts_polar_view,
    
    # icons
    icons_remix_view,
    icons_boxicons_view,
    icons_materialdesign_view,
    icons_bootstrap_view,
    icons_phosphor_view,
    
    # maps
    maps_google_view,
    maps_vector_view,
    maps_leaflet_view,
    
)

app_name = "menu"

urlpatterns = [
    
    # bootstrap_ui
    path('bootstrap_ui/alerts',view=alerts_view,name='bootstrap-ui.alerts'),
    path('bootstrap_ui/badges',view=badges_view,name='bootstrap-ui.badges'),
    path('bootstrap_ui/buttons',view=buttons_view,name='bootstrap-ui.buttons'),
    path('bootstrap_ui/colors',view=colors_view,name='bootstrap-ui.colors'),
    path('bootstrap_ui/cards',view=cards_view,name='bootstrap-ui.cards'),
    path('bootstrap_ui/carousel',view=carousel_view,name='bootstrap-ui.carousel'),
    path('bootstrap_ui/dropdowns',view=dropdowns_view,name='bootstrap-ui.dropdowns'),
    path('bootstrap_ui/grid',view=grid_view,name='bootstrap-ui.grid'),
    path('bootstrap_ui/images',view=images_view,name='bootstrap-ui.images'),
    path('bootstrap_ui/tabs',view=tabs_view,name='bootstrap-ui.tabs'),
    path('bootstrap_ui/accordions',view=accordions_view,name='bootstrap-ui.accordions'),
    path('bootstrap_ui/modals',view=modals_view,name='bootstrap-ui.modals'),
    path('bootstrap_ui/offcanvas',view=offcanvas_view,name='bootstrap-ui.offcanvas'),
    path('bootstrap_ui/placeholders',view=placeholders_view,name='bootstrap-ui.placeholders'),
    path('bootstrap_ui/progress',view=progress_view,name='bootstrap-ui.progress'),
    path('bootstrap_ui/notifications',view=notifications_view,name='bootstrap-ui.notifications'),
    path('bootstrap_ui/media',view=media_view,name='bootstrap-ui.media'),
    path('bootstrap_ui/embed_video',view=embed_video_view,name='bootstrap-ui.embed_video'),
    path('bootstrap_ui/typography',view=typography_view,name='bootstrap-ui.typography'),
    path('bootstrap_ui/lists',view=lists_view,name='bootstrap-ui.lists'),
    path('bootstrap_ui/general',view=general_view,name='bootstrap-ui.general'),
    path('bootstrap_ui/utilities',view=utilities_view,name='bootstrap-ui.utilities'),
    
    # advance-ui
    path('advance_ui/sweetalerts',view=advance_ui_sweetalerts_view,name='advance-ui.sweetalerts'),
    path('advance_ui/nestable',view=advance_ui_nestable_view,name='advance-ui.nestable'),
    path('advance_ui/scrollbar',view=advance_ui_scrollbar_view,name='advance-ui.scrollbar'),
    path('advance_ui/swiper',view=advance_ui_swiper_view,name='advance-ui.swiper'),
    path('advance_ui/ratings',view=advance_ui_ratings_view,name='advance-ui.ratings'),
    path('advance_ui/highlight',view=advance_ui_highlight_view,name='advance-ui.highlight'),
    path('advance_ui/scrollspy',view=advance_ui_scrollspy_view,name='advance-ui.scrollspy'),
    
    # custom-ui
    path('custom_ui/ribbons',view=custom_ui_ribbons_view,name='custom-ui.ribbons'),
    path('custom_ui/profile',view=custom_ui_profile_view,name='custom-ui.profile'),
    path('custom_ui/counter',view=custom_ui_counter_view,name='custom-ui.counter'),
    
    # forms
    path('forms/basic_elements',view=forms_elements_view,name='forms.elements'),
    path('forms/form_select',view=forms_select_view,name='forms.form_select'),
    path('forms/checkboxs_radios',view=forms_checkboxs_radios_view,name='forms.checkboxs_radios'),
    path('forms/pickers',view=forms_pickers_view,name='forms.pickers'),
    path('forms/input_masks',view=forms_input_masks_view,name='forms.input_masks'),
    path('forms/input_advanced',view=forms_advanced_view,name='forms.advanced'),
    path('forms/range_sliders',view=forms_range_sliders_view,name='forms.range_sliders'),
    path('forms/validation',view=forms_validation_view,name='forms.validation'),
    path('forms/wizard',view=forms_wizard_view,name='forms.wizard'),
    path('forms/editors',view=forms_editors_view,name='forms.editors'),
    path('forms/file_upload',view=forms_file_upload_view,name='forms.file_upload'),
    path('forms/layouts',view=forms_layouts_view,name='forms.layouts'),
    path('forms/tom_select',view=forms_tom_select_view,name='forms.tom_select'),
    
    # table
    path('tables/basic',view=tables_basic_view,name='tables.basic'),
    path('tables/gridjs',view=tables_gridjs_view,name='tables.gridjs'),
    path('tables/listjs',view=tables_listjs_view,name='tables.listjs'),
    path('tables/datatables',view=tables_datatables_view,name='tables.datatables'),
    
    # apexcharts
    path('apexcharts/line',view=apexcharts_line_view,name='apexcharts.line'),
    path('apexcharts/area',view=apexcharts_area_view,name='apexcharts.area'),
    path('apexcharts/column',view=apexcharts_column_view,name='apexcharts.column'),
    path('apexcharts/bar',view=apexcharts_bar_view,name='apexcharts.bar'),
    path('apexcharts/mixed',view=apexcharts_mixed_view,name='apexcharts.mixed'),
    path('apexcharts/timeline',view=apexcharts_timeline_view,name='apexcharts.timeline'),
    path('apexcharts/candlestick',view=apexcharts_candlestick_view,name='apexcharts.candlestick'),
    path('apexcharts/boxplot',view=apexcharts_boxplot_view,name='apexcharts.boxplot'),
    path('apexcharts/bubble',view=apexcharts_bubble_view,name='apexcharts.bubble'),
    path('apexcharts/scatter',view=apexcharts_scatter_view,name='apexcharts.scatter'),
    path('apexcharts/heatmap',view=apexcharts_heatmap_view,name='apexcharts.heatmap'),
    path('apexcharts/treemap',view=apexcharts_treemap_view,name='apexcharts.treemap'),
    path('apexcharts/pie',view=apexcharts_pie_view,name='apexcharts.pie'),
    path('apexcharts/radialbar',view=apexcharts_radialbar_view,name='apexcharts.radialbar'),
    path('apexcharts/radar',view=apexcharts_radar_view,name='apexcharts.radar'),
    path('apexcharts/polar',view=apexcharts_polar_view,name='apexcharts.polar'),
    
    # icons
    path('icons/remix',view=icons_remix_view,name='icons.remix'),
    path('icons/boxicons',view=icons_boxicons_view,name='icons.boxicons'),
    path('icons/materialdesign',view=icons_materialdesign_view,name='icons.materialdesign'),
    path('icons/bootstrap',view=icons_bootstrap_view,name='icons.bootstrap'),
    path('icons/phosphor',view=icons_phosphor_view,name='icons.phosphor'),
    
    # maps
    path('maps/google',view=maps_google_view,name='icons.google'),
    path('maps/vector',view=maps_vector_view,name='icons.vector'),
    path('maps/leaflet',view=maps_leaflet_view,name='icons.leaflet'),
    
]