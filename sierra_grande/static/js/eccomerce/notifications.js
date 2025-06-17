(() => {
    'use strict';

    function init () {
        document.querySelectorAll('a[data-behaviours~="archive"]').forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                checkAndSubmit(this, 'archive');
            });
        });

        document.querySelectorAll('a[data-behaviours~="delete"]').forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                checkAndSubmit(this, 'delete');
            });
        });
    };

    function checkAndSubmit (element, btnVal) {
        const checkbox = element.closest('tr').querySelector('input');
        if (checkbox) checkbox.checked = true;

        const submitBtn = element.closest('form').querySelector(`button[value="${ btnVal }"]`);
        if (submitBtn) submitBtn.click();

        return false;
    }

    init();
})();
