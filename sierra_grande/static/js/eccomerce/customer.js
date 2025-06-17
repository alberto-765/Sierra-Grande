(() => {
    'use strict';

    function init () {
        document.querySelectorAll('.clipboard-item').forEach(item => {
            item.addEventListener('click', function (e) {
                e.preventDefault();
                copyHrefToClipboard(this);
            });
        });
    };

    function copyHrefToClipboard (el) {
        const href = window.location.origin + el.getAttribute('href');
        navigator.clipboard.writeText(href).catch(function (err) {
            console.log('Something went wrong while copying: ' + err);
        });
    }

    init();
})();
