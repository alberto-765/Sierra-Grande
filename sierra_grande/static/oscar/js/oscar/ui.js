var oscar = ((o) => {
    'use strict';

    // Replicate Django's flash messages so they can be used by AJAX callbacks.
    o.messages = {
        addMessage: function (tag, msg) {
            const msgHTML = `<div class="alert alert-dismissible fade show alert-${ tag }">
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>${ msg }
                </div>`;
            document.getElementById('messages').insertAdjacentHTML('beforeend', msgHTML);
        },
        debug: function (msg) { o.messages.addMessage('debug', msg); },
        info: function (msg) { o.messages.addMessage('info', msg); },
        success: function (msg) { o.messages.addMessage('success', msg); },
        warning: function (msg) { o.messages.addMessage('warning', msg); },
        error: function (msg) { o.messages.addMessage('danger', msg); },
        clear: function () {
            document.getElementById('messages').innerHTML = '';
        },
        scrollTo: function () {
            window.scrollTo({
                top: document.getElementById('messages').offsetTop,
                behavior: 'smooth'
            });
        }
    };

    o.search = {
        init: function () {
            o.search.initSortWidget();
            o.search.initFacetWidgets();
        },
        initSortWidget: function () {
            // Auto-submit (hidden) search form when selecting a new sort-by option
            const sortSelect = document.getElementById('id_sort_by');
            if (sortSelect) {
                sortSelect.addEventListener('change', function () {
                    this.closest('form').submit();
                });
            }
        },
        initFacetWidgets: function () {
            // Bind events to facet checkboxes
            document.querySelectorAll('.facet_checkbox').forEach(checkbox => {
                checkbox.addEventListener('change', function () {
                    const facetUrl = this.nextElementSibling;
                    if (facetUrl && facetUrl.classList.contains('facet_url')) {
                        window.location.href = facetUrl.value;
                    }
                });
            });
        }
    };

    // Notifications inbox within 'my account' section.
    o.notifications = {
        init: function () {
            document.querySelectorAll('a[data-behaviours~="archive"]').forEach(link => {
                link.addEventListener('click', function (e) {
                    e.preventDefault();
                    o.notifications.checkAndSubmit(this, 'archive');
                });
            });

            document.querySelectorAll('a[data-behaviours~="delete"]').forEach(link => {
                link.addEventListener('click', function (e) {
                    e.preventDefault();
                    o.notifications.checkAndSubmit(this, 'delete');
                });
            });
        },
        checkAndSubmit: function (element, btnVal) {
            const checkbox = element.closest('tr').querySelector('input');
            if (checkbox) checkbox.checked = true;

            const submitBtn = element.closest('form').querySelector(`button[value="${ btnVal }"]`);
            if (submitBtn) submitBtn.click();

            return false;
        }
    };

    // Site-wide forms events
    o.forms = {
        init: function () {
            // Handle button loading states
            document.querySelectorAll('[data-loading-text]').addEventListener('click', function (e) {
                const btn = e.target;
                const form = btn.closest('form');

                if (!form || form.checkValidity()) {
                    // Use requestAnimationFrame to delay disabling until after form submission begins
                    requestAnimationFrame(function () {
                        const loadingText = btn.getAttribute('data-loading-text');
                        if (btn.tagName === 'INPUT') {
                            btn.value = loadingText;
                        } else {
                            btn.textContent = loadingText;
                        }
                        btn.classList.add('disabled');
                        btn.setAttribute('disabled', 'disabled');
                    });
                }
            });

            // Add href to url for tab display
            document.querySelectorAll('.nav-tabs a').forEach(tab => {
                tab.addEventListener('shown.bs.tab', function (e) {
                    window.location.hash = e.target.hash;
                });
            });
        },
        submitIfNotLocked: function (e) {
            if (this.dataset.locked === 'true') {
                e.preventDefault();
                return false;
            }
            this.dataset.locked = 'true';
        },
        reviewRatingClick: function () {
            const ratings = ['One', 'Two', 'Three', 'Four', 'Five']; // Possible classes for display state
            const starIndex = Array.from(this.parentNode.children).indexOf(this);

            // Remove all rating classes and add the correct one
            this.parentNode.classList.remove('One', 'Two', 'Three', 'Four', 'Five');
            this.parentNode.classList.add(ratings[starIndex]);

            // Update hidden select value
            const select = this.closest('.controls').querySelector('select');
            if (select) select.value = starIndex + 1;
        }
    };

    o.basket = {
        is_form_being_submitted: false,
        init: function (options) {
            if (typeof options == 'undefined') {
                options = { 'basketURL': document.URL };
            }
            o.basket.url = options.basketURL || document.URL;

            const contentInner = document.getElementById('content_inner');
            if (!contentInner) return;

            // Basket form event delegation
            contentInner.addEventListener('click', function (e) {
                // Remove item click
                if (e.target.closest('#basket_formset a[data-behaviours~="remove"]')) {
                    e.preventDefault();
                    o.basket.checkAndSubmit(e.target.closest('a'), 'form', 'DELETE');
                }

                // Save for later click
                else if (e.target.closest('#basket_formset a[data-behaviours~="save"]')) {
                    e.preventDefault();
                    o.basket.checkAndSubmit(e.target.closest('a'), 'form', 'save_for_later');
                }

                // Move to basket click
                else if (e.target.closest('#saved_basket_formset a[data-behaviours~="move"]')) {
                    e.preventDefault();
                    o.basket.checkAndSubmit(e.target.closest('a'), 'form', 'move_to_basket');
                }

                // Remove from saved click
                else if (e.target.closest('#saved_basket_formset a[data-behaviours~="remove"]')) {
                    e.preventDefault();
                    o.basket.checkAndSubmit(e.target.closest('a'), 'form', 'DELETE');
                }

                // Voucher form toggle
                else if (e.target.closest('#voucher_form_link a')) {
                    e.preventDefault();
                    o.basket.showVoucherForm();
                }

                // Voucher form cancel
                else if (e.target.closest('#voucher_form_cancel')) {
                    e.preventDefault();
                    o.basket.hideVoucherForm();
                }
            });

            // Handle basket form submissions
            const basketForm = document.getElementById('basket_formset');
            if (basketForm) {
                basketForm.addEventListener('submit', function (e) {
                    e.preventDefault();
                    o.basket.submitBasketForm();
                });
            }

            // Show voucher form if hash is present
            if (window.location.hash == '#voucher') {
                o.basket.showVoucherForm();
            }
        },
        submitBasketForm: function () {
            document.getElementById('messages').innerHTML = '';
            const form = document.getElementById('basket_formset');
            if (!form) return;

            const formData = new FormData(form);

            fetch(o.basket.url, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
                .then(response => response.json())
                .then(data => o.basket.submitFormSuccess(data))
                .catch(error => console.error('Error submitting basket form:', error));
        },
        submitFormSuccess: function (data) {
            document.getElementById('content_inner').innerHTML = data.content_html;

            // Show any flash messages
            o.messages.clear();
            for (let level in data.messages) {
                for (let i = 0; i < data.messages[level].length; i++) {
                    o.messages[level](data.messages[level][i]);
                }
            }
            o.basket.is_form_being_submitted = false;
        },
        showVoucherForm: function () {
            const voucherContainer = document.getElementById('voucher_form_container');
            const voucherLink = document.getElementById('voucher_form_link');
            if (voucherContainer) voucherContainer.style.display = 'block';
            if (voucherLink) voucherLink.style.display = 'none';

            const codeInput = document.getElementById('id_code');
            if (codeInput) codeInput.focus();
        },
        hideVoucherForm: function () {
            const voucherContainer = document.getElementById('voucher_form_container');
            const voucherLink = document.getElementById('voucher_form_link');
            if (voucherContainer) voucherContainer.style.display = 'none';
            if (voucherLink) voucherLink.style.display = 'block';
        },
        checkAndSubmit: function (element, formPrefix, idSuffix) {
            if (o.basket.is_form_being_submitted) {
                return;
            }

            const formID = element.dataset.id;
            const inputID = `#id_${ formPrefix }-${ formID }-${ idSuffix }`;
            const input = document.querySelector(inputID);
            if (input) input.checked = true;

            const form = element.closest('form');
            if (form) form.submit();

            o.basket.is_form_being_submitted = true;
        }
    };

    o.checkout = {
        gateway: {
            init: function () {
                const radioWidgets = document.querySelectorAll('form input[name=options]');
                const selectedRadioWidget = document.querySelector('form input[name=options]:checked');

                if (selectedRadioWidget) {
                    o.checkout.gateway.handleRadioSelection(selectedRadioWidget.value);
                }

                radioWidgets.forEach(radio => {
                    radio.addEventListener('change', function () {
                        o.checkout.gateway.handleRadioSelection(this.value);
                    });
                });

                const usernameInput = document.getElementById('id_username');
                if (usernameInput) usernameInput.focus();
            },
            handleRadioSelection: function (value) {
                const pwInput = document.getElementById('id_password');
                if (!pwInput) return;

                if (value == 'anonymous' || value == 'new') {
                    pwInput.setAttribute('disabled', 'disabled');
                } else {
                    pwInput.removeAttribute('disabled');
                }
            }
        }
    };

    o.customer = {
        wishlists: {
            init: function () {
                document.querySelectorAll('.clipboard-item').forEach(item => {
                    item.addEventListener('click', function (e) {
                        e.preventDefault();
                        o.customer.wishlists.copyHrefToClipboard(this);
                    });
                });
            },
            copyHrefToClipboard: function (el) {
                const href = window.location.origin + el.getAttribute('href');
                navigator.clipboard.writeText(href).catch(function (err) {
                    console.log('Something went wrong while copying: ' + err);
                });
            }
        }
    };

    o.init = function () {
        o.forms.init();
    };

    return o;

})(oscar || {});
