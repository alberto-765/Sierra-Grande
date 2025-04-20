var oscar = ((o) => {
    'use strict';

    function onFileChange (evt) {
        if (!window.FileReader) return;

        const fileInput = evt.target;
        const imgId = fileInput.id + "-image";
        const reader = new FileReader();

        reader.onload = function (e) {
            const imgDiv = document.getElementById(imgId);
            if (imgDiv) {
                const img = imgDiv.querySelector('img');
                if (img) img.src = e.target.result;
            }
        };

        if (fileInput.files && fileInput.files[0]) {
            reader.readAsDataURL(fileInput.files[0]);
        }

        const parentTab = fileInput.closest('.tab-pane');
        const imageContainer = fileInput.closest('.sortable-handle');

        if (imageContainer) {
            const reorderBtns = imageContainer.querySelectorAll('.btn-reorder');
            reorderBtns.forEach(btn => {
                btn.removeAttribute('disabled');
                btn.classList.remove('disabled');
            });
        }

        const uploadImageContainer = fileInput.closest('.upload-image');
        if (!uploadImageContainer) return;

        const lastImageItem = uploadImageContainer.querySelector('li:last-child');
        if (!lastImageItem) return;

        const totalFormsInput = parentTab.querySelector("input[name$=images-TOTAL_FORMS]");
        const maxFormsInput = parentTab.querySelector("input[name$=images-MAX_NUM_FORMS]");

        if (!totalFormsInput || !maxFormsInput) return;

        const numExisting = parseInt(totalFormsInput.value, 10);
        const numMax = parseInt(maxFormsInput.value, 10);

        // Do not create extra image form if number of maximum allowed forms has reached.
        if (numExisting < numMax) {
            const newImg = o.dashboard._extraProductImg.cloneNode(true);
            const productId = document.getElementById('images-0-product').value;

            lastImageItem.insertAdjacentElement('afterend', newImg);

            // update attrs on cloned el
            const elementsToUpdate = newImg.querySelectorAll("[id^='id_images-'], [for^='id_images-'], [id^='upload_button_id_images-'], img[alt='thumbnail']");

            elementsToUpdate.forEach(el => {
                ["id", "name", "for", "onload", "onerror"].forEach(attr => {
                    const val = el.getAttribute(attr);
                    if (val) {
                        const parts = val.split('-');
                        parts[1] = numExisting;
                        el.setAttribute(attr, parts.join('-'));
                    }
                });
            });

            const displayOrderInput = newImg.querySelector('#id_images-' + numExisting + '-display_order');
            if (displayOrderInput) displayOrderInput.value = numExisting;

            const productInput = newImg.querySelector('#id_images-' + numExisting + '-product');
            if (productInput) productInput.value = productId;

            const newFile = newImg.querySelector('input[type="file"]');
            if (newFile) newFile.addEventListener('change', onFileChange);

            totalFormsInput.value = numExisting + 1;
        }
    }


    o.getCsrfToken = function () {
        // Extract CSRF token from cookies
        const cookies = document.cookie.split(';');
        let csrfToken = null;

        cookies.forEach(cookie => {
            const cookieParts = cookie.trim().split('=');
            if (cookieParts[0] === 'csrftoken') {
                csrfToken = cookieParts[1];
            }
        });

        // Extract from cookies fails for HTML-Only cookies
        if (!csrfToken) {
            const csrfInput = document.querySelector('[name="csrfmiddlewaretoken"]');
            if (csrfInput) csrfToken = csrfInput.value;
        }

        return csrfToken;
    };

    o.dashboard = {
        init: function (options) {
            // Run initialisation that should take place on every page of the dashboard.
            const defaults = {
                dateFormat: 'P',
                timeFormat: 'p',
                datetimeFormat: 'Pp',
                stepMinute: 15,
                quillConfig: {
                    modules: {
                        toolbar: [
                            ['bold', 'italic', 'underline', 'blockquote'],
                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                            ['link'],
                            ['clean']
                        ]
                    },
                    placeholder: 'Enter text...',
                    theme: 'snow'
                },
                icons: {
                    time: 'far fa-clock',
                    date: 'far fa-calendar',
                    up: 'fas fa-arrow-up',
                    down: 'fas fa-arrow-down',
                    previous: 'fas fa-chevron-left',
                    next: 'fas fa-chevron-right',
                    today: 'fas fa-calendar-check',
                    clear: 'fas fa-trash',
                    close: 'fas fa-times'
                }
            };

            o.dashboard.options = Object.assign({}, defaults, options);

            o.dashboard.initWidgets(window.document);
            o.dashboard.initForms();

            // Category select expand/contract
            document.querySelectorAll(".category-select ul").forEach(ul => {
                const link = ul.previousElementSibling;
                if (link && link.tagName === 'A') {
                    link.addEventListener('click', function (e) {
                        e.preventDefault();
                        const isExpanded = this.classList.contains('ico_expand');
                        if (isExpanded) {
                            this.classList.remove('ico_expand');
                            this.classList.add('ico_contract');
                        } else {
                            this.classList.remove('ico_contract');
                            this.classList.add('ico_expand');
                        }
                    });
                }
            });

            // Adds error icon if there are errors in the product update form
            document.querySelectorAll('[data-behaviour="tab-nav-errors"] .tab-pane').forEach(pane => {
                const errors = pane.querySelectorAll('[class*="error"]:not(:empty)');
                if (errors.length > 0) {
                    const paneId = pane.getAttribute('id');
                    const tabLink = document.querySelector('.tab-nav a[href="#' + paneId + '"]');
                    if (tabLink) {
                        const icon = document.createElement('i');
                        icon.className = 'fas fa-info-circle float-end';
                        tabLink.appendChild(icon);
                    }
                }
            });

            o.dashboard.filereader.init();
        },

        initWidgets: function (el) {
            o.dashboard.initDatePickers(el);
            o.dashboard.initMasks(el);
            o.dashboard.initWYSIWYG(el);
            o.dashboard.initSelects(el);
            o.dashboard.initProductImages(el);
            o.dashboard.initDropzones(el);
        },
        initMasks: function (el) {
            // Using vanilla Inputmask (without jQuery)
            const inputs = el.querySelectorAll('input, textarea, select, button');
            inputs.forEach(input => {
                Inputmask().mask(input);
            });
        },
        initSelects: function (el) {
            // Find all selects
            const selects = (el || document).querySelectorAll('select:not(.no-widget-init)');

            // For normal filtering without ajax call
            const setupLocalFiltering = (select, searchInput, optionsContainer) => {
                searchInput.addEventListener('keyup', () => {
                    const query = searchInput.value.toLowerCase();

                    // Clean the options
                    optionsContainer.innerHTML = '';

                    Array.from(select.options).forEach(option => {
                        if (option.text.toLowerCase().includes(query)) {
                            const optionEl = document.createElement('div');
                            optionEl.className = 'option-item';
                            optionEl.textContent = option.text;
                            optionEl.dataset.value = option.value;
                            optionsContainer.appendChild(optionEl);
                        }
                    });

                    // Show the container
                    if (optionsContainer.children.length > 0) {
                        optionsContainer.style.display = 'block';
                    } else {
                        optionsContainer.style.display = 'none';
                    }
                });
            };

            // For single select (normal)
            const setupSingleSelect = (select, optionsContainer) => {
                optionsContainer.addEventListener('click', (e) => {
                    if (e.target.classList.contains('option-item')) {
                        const value = e.target.dataset.value;
                        const text = e.target.textContent;

                        // Update real select
                        Array.from(select.options).forEach(option => {
                            option.selected = (option.value === value);
                        });

                        // Update the visualization
                        const displayValue = select.previousElementSibling;
                        if (displayValue.tagName === 'INPUT') {
                            displayValue.value = text;
                        }

                        // Hidde options
                        optionsContainer.style.display = 'none';

                        // Dispatch the change envet
                        select.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                });
            };

            // For related select (multiple)
            const setupMultipleRelatedSelect = (select, optionsContainer) => {
                // Create container for selected items
                const selectedContainer = document.createElement('div');
                selectedContainer.className = 'selected-items';
                select.parentNode.insertBefore(selectedContainer, optionsContainer);

                // Update initial sections
                updateSelectedItems(select, selectedContainer);

                optionsContainer.addEventListener('click', (e) => {
                    if (e.target.classList.contains('option-item')) {
                        const value = e.target.dataset.value;

                        // Update real select
                        Array.from(select.options).forEach(option => {
                            if (option.value === value) {
                                option.selected = !option.selected;
                            }
                        });

                        // Update visualization
                        updateSelectedItems(select, selectedContainer);

                        // Dispatch event
                        select.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                });
            };

            // For related selects (single)
            const setupSingleRelatedSelect = (select, optionsContainer) => {
                setupSingleSelect(select, optionsContainer);
            };

            // Update selected items
            const updateSelectedItems = (select, container) => {
                container.innerHTML = '';

                Array.from(select.selectedOptions).forEach(option => {
                    const badge = document.createElement('span');
                    badge.className = 'badge bg-primary me-1';
                    badge.innerHTML = `${ option.text } <button type="button" class="btn-close btn-close-white"
                                      data-value="${ option.value }"></button>`;
                    container.appendChild(badge);
                });

                // Event to remove items
                container.querySelectorAll('.btn-close').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const value = btn.dataset.value;

                        Array.from(select.options).forEach(option => {
                            if (option.value === value) {
                                option.selected = false;
                            }
                        });

                        updateSelectedItems(select, container);
                        select.dispatchEvent(new Event('change', { bubbles: true }));
                    });
                });
            };



            // Process each element
            selects.forEach(select => {

                // Create wrapper
                const wrapper = document.createElement('div');
                wrapper.className = 'custom-select-wrapper';
                select.parentNode.insertBefore(wrapper, select);
                wrapper.appendChild(select);

                // Create search field
                const searchInput = document.createElement('input');
                searchInput.type = 'text';
                searchInput.className = 'form-control custom-select-search';
                searchInput.placeholder = 'Buscar...';
                wrapper.insertBefore(searchInput, select);

                // Create options container
                const optionsContainer = document.createElement('div');
                optionsContainer.className = 'options-container';
                wrapper.appendChild(optionsContainer);

                // For selects with ajax
                if (select.dataset.ajaxUrl) {
                    // Configure HTMX for the search
                    searchInput.setAttribute('hx-post', select.dataset.ajaxUrl);
                    searchInput.setAttribute('hx-trigger', 'keyup changed delay:500ms');
                    searchInput.setAttribute('hx-target', '.options-container');

                    // Indicate the load
                    const spinner = document.createElement('span');
                    spinner.className = 'htmx-indicator';
                    spinner.innerHTML = '<div class="spinner-border spinner-border-sm"></div>';
                    searchInput.after(spinner);
                } else {
                    // For normal selects, using local filter
                    setupLocalFiltering(select, searchInput, optionsContainer);
                }

                // Multiple select or relationated
                if (select.multiple || select.closest('.related-widget-wrapper.multiple')) {
                    setupMultipleRelatedSelect(select, optionsContainer);
                } else if (select.closest('.related-widget-wrapper.single')) {
                    setupSingleRelatedSelect(select, optionsContainer);
                } else {
                    setupSingleSelect(select, optionsContainer);
                }
            });
        },
        initDatePickers: function (el) {
            const theme = localStorage.getItem('theme') || 'auto';

            // Date picker inputs
            const dateInputs = el.querySelectorAll('[data-oscarWidget="date"]:not(.no-widget-init)');
            dateInputs.forEach(input => {
                const initialOptions = {
                    display: {
                        icons: o.dashboard.options.icons,
                        components: {
                            clock: false,
                            hours: false,
                            minutes: false,
                            seconds: false,
                        },
                        theme
                    },
                    localization: {
                        format: input.dataset.dateformat?.trim() || o.dashboard.options.dateFormat,
                        locale: options.languageCode,
                    },
                };
                new tempusDominus.TempusDominus(input, initialOptions);
                // pick.subscribe(tempusDominus.Namespace.events.show, (e) => {
                //     const theme = localStorage.getItem('theme') || 'auto';
                //     const today = new tempusDominus.DateTime();
                //     pick.updateOptions({
                //         restrictions: {
                //             maxDate: today,
                //         }
                //     });
                // });
            });

            // Datetime picker inputs
            const datetimeInputs = el.querySelectorAll('[data-oscarWidget="datetime"]:not(.no-widget-init)');
            datetimeInputs.forEach(input => {
                const initialOptions = {
                    display: {
                        icons: o.dashboard.options.icons,
                        theme
                    },
                    stepping: o.dashboard.options.stepMinute,
                    localization: {
                        format: input.dataset.dateformat?.trim() || o.dashboard.options.datetimeFormat,
                    }
                };
                const pick = new tempusDominus.TempusDominus(input, initialOptions);
                pick.subscribe(tempusDominus.Namespace.events.show, () => {
                    const theme = localStorage.getItem('theme') || 'auto';
                    // pick.updateOptions({
                    //     ...initialOptions,
                    //     display: {
                    //         ...initialOptions.display,  // Mantén las opciones de display previas
                    //         theme // Solo actualiza el tema
                    //     }
                    // });
                });
            });

            // Time picker inputs
            const timeInputs = el.querySelectorAll('[data-oscarWidget="time"]:not(.no-widget-init)');
            timeInputs.forEach(input => {
                const initialOptions = {
                    display: {
                        icons: o.dashboard.options.icons,
                        components: {
                            decades: false,
                            year: false,
                            month: false,
                            date: false,
                            seconds: false
                        },
                        viewmode: 'clock',
                        theme
                    },
                    stepping: o.dashboard.options.stepMinute,
                    localization: {
                        format: input.dataset.dateformat?.trim() || o.dashboard.options.timeFormat,
                    }
                };
                const pick = new tempusDominus.TempusDominus(input, initialOptions);
                // pick.subscribe(tempusDominus.Namespace.events.show, () => {
                //     const theme = localStorage.getItem('theme') || 'auto';
                //     pick.updateOptions({
                //         debug: true
                //     });
                // });
            });
        },
        initWYSIWYG: function (el) {
            // Replace TinyMCE with Quill.js
            const textareas = el.querySelectorAll('textarea:not(.no-widget-init)');

            textareas.forEach(textarea => {
                if (textarea.closest('form.wysiwyg') || textarea.classList.contains('wysiwyg')) {
                    // Create container for Quill
                    const container = document.createElement('div');
                    container.className = 'quill-editor';
                    textarea.parentNode.insertBefore(container, textarea);

                    // Hide original textarea but keep it for form submission
                    textarea.style.display = 'none';

                    // Initialize Quill
                    const quill = new Quill(container, o.dashboard.options.quillConfig);

                    // Set initial content from textarea
                    quill.root.innerHTML = textarea.value;

                    // Update hidden textarea when Quill content changes
                    quill.on('text-change', function () {
                        textarea.value = quill.root.innerHTML;
                    });
                }
            });
        },
        initForms: function () {
            // Handle button loading states
            document.querySelectorAll('[data-loading-text]').forEach((input) => {
                input.addEventListener('click', function (e) {
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
            });

            // Add href to url for tab display
            document.querySelectorAll('.nav-tabs a').forEach(tab => {
                tab.addEventListener('shown.bs.tab', function (e) {
                    window.location.hash = e.target.hash;
                });
            });

            // Display tabs that have invalid input fields
            document.querySelectorAll('input').forEach(input => {
                input.addEventListener('invalid', function () {
                    const tabPane = this.closest('.tab-pane');
                    if (tabPane) {
                        const id = tabPane.getAttribute('id');
                        if (id) {
                            // We need a vanilla JS replacement for Bootstrap's tab 'show' method
                            const tabLink = document.querySelector('.bs-docs-sidenav a[href="#' + id + '"]');
                            if (tabLink) {
                                tabLink.click();
                            }
                        }
                    }
                });
            });
        },
        initProductImages: function () {
            const productImages = document.getElementById('product_images');
            if (!productImages) return;

            const extraImg = productImages.querySelector('.upload-image li:last-child');
            if (extraImg) {
                o.dashboard._extraProductImg = extraImg.cloneNode(true);
            }

            // Disable sorting for disabled items
            document.querySelectorAll('a:disabled').forEach(disabled => {
                const handle = disabled.closest('.sortable-handle');
                if (handle) {
                    // Mark as not sortable using data attribute
                    handle.setAttribute('data-sortable-disabled', 'true');
                }
            });

            // Initialize SortableJS for image reordering
            const uploadImages = document.querySelectorAll('ol.upload-image');
            uploadImages.forEach(list => {
                new Sortable(list, {
                    animation: 150,
                    handle: '.btn-handle',
                    filter: '[data-sortable-disabled="true"]',
                    onEnd: function () {
                        // Update display order when items are reordered
                        const sortFields = document.querySelectorAll("input[name$=-display_order]");
                        sortFields.forEach((field, i) => {
                            field.value = i;
                        });
                    }
                });
            });
        },
        initDropzones: function (el) {
            // Initialize Dropzone.js for file uploads
            const fileInputs = el.querySelectorAll('input[type="file"]');

            fileInputs.forEach(input => {
                // Create dropzone container
                const dropzoneContainer = document.createElement('div');
                dropzoneContainer.className = 'dropzone';
                input.parentNode.insertBefore(dropzoneContainer, input);

                // Hide original input but keep it for form compatibility
                input.style.display = 'none';

                // Initialize Dropzone
                new Dropzone(dropzoneContainer, {
                    url: input.closest('form').getAttribute('action') || window.location.href,
                    paramName: input.getAttribute('name'),
                    acceptedFiles: input.getAttribute('accept') || '',
                    maxFiles: 1,
                    autoProcessQueue: false, // Don't upload immediately
                    previewTemplate: '<div class="dz-preview dz-file-preview"><div class="dz-image"><img data-dz-thumbnail /></div><div class="dz-details"><div class="dz-filename"><span data-dz-name></span></div><div class="dz-size"><span data-dz-size></span></div></div><div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div><div class="dz-error-message"><span data-dz-errormessage></span></div></div>',

                    init: function () {
                        // Set up event to transfer the file to the original input when added
                        this.on('addedfile', function (file) {
                            // Create a FileList-like object
                            const dataTransfer = new DataTransfer();
                            dataTransfer.items.add(file);
                            input.files = dataTransfer.files;

                            // Trigger change event on the original input
                            const event = new Event('change', { bubbles: true });
                            input.dispatchEvent(event);
                        });
                    }
                });
            });
        },
        offers: {
            init: function () {
                oscar.dashboard.offers.adjustBenefitForm();
                document.getElementById('id_type').addEventListener('change', function () {
                    oscar.dashboard.offers.adjustBenefitForm();
                });
            },
            adjustBenefitForm: function () {
                const typeSelect = document.getElementById('id_type');
                // TODO: QUITAR form-group
                const valueContainer = document.getElementById('id_value').closest('.form-group');

                if (typeSelect.value == 'Multibuy') {
                    document.getElementById('id_value').value = '';
                    valueContainer.style.display = 'none';
                } else {
                    valueContainer.style.display = '';
                }
            }
        },
        product_attributes: {
            init: function () {
                const typeSelects = document.querySelectorAll("select[name$=type]");

                typeSelects.forEach(select => {
                    o.dashboard.product_attributes.toggleOptionGroup(select);

                    select.addEventListener('change', function () {
                        o.dashboard.product_attributes.toggleOptionGroup(this);
                    });
                });
            },

            toggleOptionGroup: function (typeSelect) {
                const optionGroupId = typeSelect.getAttribute('id').replace('type', 'option_group');
                const optionGroupSelect = document.getElementById(optionGroupId);
                if (!optionGroupSelect) return;

                // TODO: QUITAR form-group
                const formGroup = optionGroupSelect.closest('.form-group');
                const value = typeSelect.value;
                const showOptionGroup = value === 'option' || value === 'multi_option';

                if (formGroup) {
                    formGroup.style.display = showOptionGroup ? '' : 'none';
                }

                if (showOptionGroup) {
                    optionGroupSelect.setAttribute('required', 'required');
                } else {
                    optionGroupSelect.removeAttribute('required');
                }
            }
        },

        ranges: {
            init: function () {
                document.querySelectorAll('[data-behaviours~="remove"]').forEach(btn => {
                    btn.addEventListener('click', function () {
                        const table = this.closest('table');
                        const form = this.closest('form');

                        // Uncheck all checkboxes
                        table.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                            checkbox.checked = false;
                        });

                        // Check only the checkbox in this row
                        const rowCheckbox = this.closest('tr').querySelector('input[type="checkbox"]');
                        if (rowCheckbox) rowCheckbox.checked = true;

                        // Submit the form
                        if (form) form.submit();
                    });
                });
            }
        },

        orders: {
            initTabs: function () {
                if (location.hash) {
                    const tabLink = document.querySelector('.nav-tabs a[href="' + location.hash + '"]');
                    if (tabLink) {
                        // You'll need a vanilla JS way to show tabs - depends on your framework
                        // This is a placeholder assuming a Bootstrap-like API
                        const tab = new bootstrap.Tab(tabLink);
                        tab.show();
                    }
                }
            },
            initTable: function () {
                const table = document.querySelector('form table');
                if (!table) return;

                const firstHeader = table.querySelector('th:first-child');
                if (!firstHeader) return;

                const input = document.createElement('input');
                input.type = 'checkbox';
                input.style.marginRight = '5px';
                input.style.verticalAlign = 'top';

                firstHeader.prepend(input);

                input.addEventListener('change', function () {
                    const isChecked = this.checked;
                    table.querySelectorAll('tr td:first-child input').forEach(checkbox => {
                        checkbox.checked = isChecked;
                    });
                });
            }
        },

        reordering: (function () {
            let options = {
                handle: '.btn-handle',
                submit_url: '#'
            };

            function saveOrder (data) {
                // Get the csrf token, otherwise django will not accept the POST request.
                const csrf = o.getCsrfToken();

                fetch(options.submit_url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'X-CSRFToken': csrf
                    },
                    body: new URLSearchParams(data)
                }).then(response => response.json())
                    .catch(error => console.error('Error saving order:', error));
            }

            function init (userOptions) {
                options = { ...options, ...userOptions };

                const wrapper = document.querySelector(options.wrapper);
                if (!wrapper) return;

                const sortableInstance = new Sortable(wrapper.querySelector('tbody'), {
                    handle: options.handle,
                    animation: 150,
                    onEnd: function () {
                        // Serialize the data
                        const data = [];
                        wrapper.querySelectorAll('tbody tr').forEach(row => {
                            if (row.id) {
                                const parts = row.id.split('_');
                                data.push({ name: parts[0], value: parts[1] });
                            }
                        });

                        saveOrder(data);
                    }
                });

                return sortableInstance;
            }

            return {
                init: init,
                saveOrder: saveOrder
            };
        }()),

        filereader: {
            init: function () {
                if (window.FileReader) {
                    document.querySelectorAll('input[type="file"]').forEach(input => {
                        input.addEventListener('change', onFileChange);
                    });
                }
            },
        },

        product_lists: {
            init: function () {
                const imageModal = document.getElementById("product-image-modal");
                const thumbnails = document.querySelectorAll('.sub-image');

                thumbnails.forEach(thumbnail => {
                    thumbnail.addEventListener('click', function (e) {
                        e.preventDefault();

                        const img = this.querySelector('img');
                        if (imageModal && img) {
                            const modalTitle = imageModal.querySelector('h4');
                            const modalImg = imageModal.querySelector('img');

                            if (modalTitle) modalTitle.textContent = img.getAttribute('alt');
                            if (modalImg) modalImg.src = this.dataset.original;

                            // Open modal (implementation depends on your modal library)
                            const modal = new bootstrap.Modal(imageModal);
                            modal.show();
                        }
                    });
                });
            }
        },
    };

    return o;

})(oscar || {});
