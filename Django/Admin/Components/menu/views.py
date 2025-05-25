from django.shortcuts import render
from django.views.generic import TemplateView

# Create your views here.

class ComponentsView(TemplateView):
    pass 

# bootstrap-ui
alerts_view =ComponentsView.as_view(template_name='menu/bootstrap-ui/ui-alerts.html')
badges_view =ComponentsView.as_view(template_name='menu/bootstrap-ui/ui-badges.html')
buttons_view =ComponentsView.as_view(template_name='menu/bootstrap-ui/ui-buttons.html')
colors_view =ComponentsView.as_view(template_name='menu/bootstrap-ui/ui-colors.html')
cards_view =ComponentsView.as_view(template_name='menu/bootstrap-ui/ui-cards.html')
carousel_view =ComponentsView.as_view(template_name='menu/bootstrap-ui/ui-carousel.html')
dropdowns_view =ComponentsView.as_view(template_name='menu/bootstrap-ui/ui-dropdowns.html')
grid_view =ComponentsView.as_view(template_name='menu/bootstrap-ui/ui-grid.html')
images_view =ComponentsView.as_view(template_name='menu/bootstrap-ui/ui-images.html')
tabs_view =ComponentsView.as_view(template_name='menu/bootstrap-ui/ui-tabs.html')
accordions_view =ComponentsView.as_view(template_name='menu/bootstrap-ui/ui-accordions.html')
modals_view =ComponentsView.as_view(template_name='menu/bootstrap-ui/ui-modals.html')
offcanvas_view =ComponentsView.as_view(template_name='menu/bootstrap-ui/ui-offcanvas.html')
placeholders_view =ComponentsView.as_view(template_name='menu/bootstrap-ui/ui-placeholders.html')
progress_view =ComponentsView.as_view(template_name='menu/bootstrap-ui/ui-progress.html')
notifications_view =ComponentsView.as_view(template_name='menu/bootstrap-ui/ui-notifications.html')
media_view =ComponentsView.as_view(template_name='menu/bootstrap-ui/ui-media.html')
embed_video_view =ComponentsView.as_view(template_name='menu/bootstrap-ui/ui-embed-video.html')
typography_view =ComponentsView.as_view(template_name='menu/bootstrap-ui/ui-typography.html')
lists_view =ComponentsView.as_view(template_name='menu/bootstrap-ui/ui-lists.html')
general_view =ComponentsView.as_view(template_name='menu/bootstrap-ui/ui-general.html')
utilities_view =ComponentsView.as_view(template_name='menu/bootstrap-ui/ui-utilities.html')

# advance-ui
advance_ui_sweetalerts_view =ComponentsView.as_view(template_name='menu/advance-ui/advance-ui-sweetalerts.html')
advance_ui_nestable_view =ComponentsView.as_view(template_name='menu/advance-ui/advance-ui-nestable.html')
advance_ui_scrollbar_view =ComponentsView.as_view(template_name='menu/advance-ui/advance-ui-scrollbar.html')
advance_ui_swiper_view =ComponentsView.as_view(template_name='menu/advance-ui/advance-ui-swiper.html')
advance_ui_ratings_view =ComponentsView.as_view(template_name='menu/advance-ui/advance-ui-ratings.html')
advance_ui_highlight_view =ComponentsView.as_view(template_name='menu/advance-ui/advance-ui-highlight.html')
advance_ui_scrollspy_view =ComponentsView.as_view(template_name='menu/advance-ui/advance-ui-scrollspy.html')

# custom-ui
custom_ui_ribbons_view =ComponentsView.as_view(template_name='menu/custom-ui/ui-ribbons.html')
custom_ui_profile_view =ComponentsView.as_view(template_name='menu/custom-ui/ui-profile.html')
custom_ui_counter_view =ComponentsView.as_view(template_name='menu/custom-ui/ui-counter.html')

# forms
forms_elements_view =ComponentsView.as_view(template_name='menu/forms/forms-elements.html')
forms_select_view =ComponentsView.as_view(template_name='menu/forms/forms-select.html')
forms_checkboxs_radios_view =ComponentsView.as_view(template_name='menu/forms/forms-checkboxs-radios.html')
forms_pickers_view =ComponentsView.as_view(template_name='menu/forms/forms-pickers.html')
forms_input_masks_view =ComponentsView.as_view(template_name='menu/forms/forms-masks.html')
forms_advanced_view =ComponentsView.as_view(template_name='menu/forms/forms-advanced.html')
forms_range_sliders_view =ComponentsView.as_view(template_name='menu/forms/forms-range-sliders.html')
forms_validation_view =ComponentsView.as_view(template_name='menu/forms/forms-validation.html')
forms_wizard_view =ComponentsView.as_view(template_name='menu/forms/forms-wizard.html')
forms_editors_view =ComponentsView.as_view(template_name='menu/forms/forms-editors.html')
forms_file_upload_view =ComponentsView.as_view(template_name='menu/forms/forms-file-uploads.html')
forms_layouts_view =ComponentsView.as_view(template_name='menu/forms/forms-layouts.html')
forms_tom_select_view =ComponentsView.as_view(template_name='menu/forms/forms-tom-select.html')

# tables
tables_basic_view =ComponentsView.as_view(template_name='menu/tables/tables-basic.html')
tables_gridjs_view =ComponentsView.as_view(template_name='menu/tables/tables-gridjs.html')
tables_listjs_view =ComponentsView.as_view(template_name='menu/tables/tables-listjs.html')
tables_datatables_view =ComponentsView.as_view(template_name='menu/tables/tables-datatables.html')

# apexcharts
apexcharts_line_view =ComponentsView.as_view(template_name='menu/apexcharts/charts-apex-line.html')
apexcharts_area_view =ComponentsView.as_view(template_name='menu/apexcharts/charts-apex-area.html')
apexcharts_column_view =ComponentsView.as_view(template_name='menu/apexcharts/charts-apex-column.html')
apexcharts_bar_view =ComponentsView.as_view(template_name='menu/apexcharts/charts-apex-bar.html')
apexcharts_mixed_view =ComponentsView.as_view(template_name='menu/apexcharts/charts-apex-mixed.html')
apexcharts_timeline_view =ComponentsView.as_view(template_name='menu/apexcharts/charts-apex-timeline.html')
apexcharts_candlestick_view =ComponentsView.as_view(template_name='menu/apexcharts/charts-apex-candlestick.html')
apexcharts_boxplot_view =ComponentsView.as_view(template_name='menu/apexcharts/charts-apex-boxplot.html')
apexcharts_bubble_view =ComponentsView.as_view(template_name='menu/apexcharts/charts-apex-bubble.html')
apexcharts_scatter_view =ComponentsView.as_view(template_name='menu/apexcharts/charts-apex-scatter.html')
apexcharts_heatmap_view =ComponentsView.as_view(template_name='menu/apexcharts/charts-apex-heatmap.html')
apexcharts_treemap_view =ComponentsView.as_view(template_name='menu/apexcharts/charts-apex-treemap.html')
apexcharts_pie_view =ComponentsView.as_view(template_name='menu/apexcharts/charts-apex-pie.html')
apexcharts_radialbar_view =ComponentsView.as_view(template_name='menu/apexcharts/charts-apex-radialbar.html')
apexcharts_radar_view =ComponentsView.as_view(template_name='menu/apexcharts/charts-apex-radar.html')
apexcharts_polar_view =ComponentsView.as_view(template_name='menu/apexcharts/charts-apex-polar.html')

# icons
icons_remix_view =ComponentsView.as_view(template_name='menu/icons/icons-remix.html')
icons_boxicons_view =ComponentsView.as_view(template_name='menu/icons/icons-boxicons.html')
icons_materialdesign_view =ComponentsView.as_view(template_name='menu/icons/icons-materialdesign.html')
icons_bootstrap_view =ComponentsView.as_view(template_name='menu/icons/icons-bootstrap.html')
icons_phosphor_view =ComponentsView.as_view(template_name='menu/icons/icons-phosphor.html')

# maps
maps_google_view =ComponentsView.as_view(template_name='menu/maps/maps-google.html')
maps_vector_view =ComponentsView.as_view(template_name='menu/maps/maps-vector.html')
maps_leaflet_view =ComponentsView.as_view(template_name='menu/maps/maps-leaflet.html')
