(() => {
    'use strict';

    function init () {
        const radioWidgets = document.querySelectorAll('form input[name=options]');
        const selectedRadioWidget = document.querySelector('form input[name=options]:checked');

        if (selectedRadioWidget) {
            handleRadioSelection(selectedRadioWidget.value);
        }

        radioWidgets.forEach(radio => {
            radio.addEventListener('change', function () {
                handleRadioSelection(this.value);
            });
        });

        const usernameInput = document.getElementById('id_username');
        if (usernameInput) usernameInput.focus();
    };
    function handleRadioSelection (value) {
        const pwInput = document.getElementById('id_password');
        if (!pwInput) return;

        if (value == 'anonymous' || value == 'new') {
            pwInput.setAttribute('disabled', 'disabled');
        } else {
            pwInput.removeAttribute('disabled');
        }
    }

    init();
})();

