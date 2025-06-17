((options) => {
    'use strict';

    let is_form_being_submitted = false;
    let url;

    function init () {
        if (typeof options == 'undefined') {
            options = { 'basketURL': document.URL };
        }
        url = options.basketURL || document.URL;

        const contentInner = document.getElementById('content_inner');
        if (!contentInner) return;

        // Basket form event delegation
        contentInner.addEventListener('click', function (e) {
            // Remove item click
            if (e.target.closest('#basket_formset a[data-behaviours~="remove"]')) {
                e.preventDefault();
                checkAndSubmit(e.target.closest('a'), 'form', 'DELETE');
            }

            // Save for later click
            else if (e.target.closest('#basket_formset a[data-behaviours~="save"]')) {
                e.preventDefault();
                checkAndSubmit(e.target.closest('a'), 'form', 'save_for_later');
            }

            // Move to basket click
            else if (e.target.closest('#saved_basket_formset a[data-behaviours~="move"]')) {
                e.preventDefault();
                checkAndSubmit(e.target.closest('a'), 'form', 'move_to_basket');
            }

            // Remove from saved click
            else if (e.target.closest('#saved_basket_formset a[data-behaviours~="remove"]')) {
                e.preventDefault();
                checkAndSubmit(e.target.closest('a'), 'form', 'DELETE');
            }

            // Voucher form toggle
            else if (e.target.closest('#voucher_form_link a')) {
                e.preventDefault();
                showVoucherForm();
            }

            // Voucher form cancel
            else if (e.target.closest('#voucher_form_cancel')) {
                e.preventDefault();
                hideVoucherForm();
            }
        });

        // Handle basket form submissions
        const basketForm = document.getElementById('basket_formset');
        if (basketForm) {
            basketForm.addEventListener('submit', function (e) {
                e.preventDefault();
                submitBasketForm();
            });
        }

        // Show voucher form if hash is present
        if (window.location.hash == '#voucher') {
            showVoucherForm();
        }
    };

    function submitBasketForm () {
        document.getElementById('messages').innerHTML = '';
        const form = document.getElementById('basket_formset');
        if (!form) return;

        const formData = new FormData(form);

        fetch(url, {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
            .then(response => response.json())
            .then(data => submitFormSuccess(data))
            .catch(error => console.error('Error submitting basket form:', error));
    };

    function submitFormSuccess (data) {
        document.getElementById('content_inner').innerHTML = data.content_html;

        // Show any flash messages
        oscar.messages.clear();
        for (let level in data.messages) {
            for (let i = 0; i < data.messages[level].length; i++) {
                oscar.messages[level](data.messages[level][i]);
            }
        }
        is_form_being_submitted = false;
    };
    function showVoucherForm () {
        const voucherContainer = document.getElementById('voucher_form_container');
        const voucherLink = document.getElementById('voucher_form_link');
        if (voucherContainer) voucherContainer.style.display = 'block';
        if (voucherLink) voucherLink.style.display = 'none';

        const codeInput = document.getElementById('id_code');
        if (codeInput) codeInput.focus();
    };
    function hideVoucherForm () {
        const voucherContainer = document.getElementById('voucher_form_container');
        const voucherLink = document.getElementById('voucher_form_link');
        if (voucherContainer) voucherContainer.style.display = 'none';
        if (voucherLink) voucherLink.style.display = 'block';
    };
    function checkAndSubmit (element, formPrefix, idSuffix) {
        if (is_form_being_submitted) {
            return;
        }

        const form = element.closest('form');
        const formID = element.dataset.id;
        if (!form || !formID) return;

        const input = form.querySelector(`input[name="${ formPrefix }-${ formID }-${ idSuffix }"]`);
        if (input) input.checked = true;

        is_form_being_submitted = true;
        form.submit();
    }

    init();
})(options);
