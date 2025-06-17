(() => {
    'use strict';

    function init () {
        initSortWidget();
        initFacetWidgets();
    };

    function initSortWidget () {
        // Auto-submit (hidden) search form when selecting a new sort-by option
        const sortSelect = document.getElementById('id_sort_by');
        if (sortSelect) {
            sortSelect.addEventListener('change', function () {
                this.closest('form').submit();
            });
        }
    };

    function initFacetWidgets () {
        // Bind events to facet checkboxes
        document.querySelectorAll('.facet_checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', function () {
                const facetUrl = this.nextElementSibling;
                if (facetUrl && facetUrl.classList.contains('facet_url')) {
                    window.location.href = facetUrl.value;
                }
            });
        });
    };

    init();
})();
