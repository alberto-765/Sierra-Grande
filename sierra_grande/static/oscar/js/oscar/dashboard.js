var oscar = ((o) => {
    'use strict';

    // Method launched when File input change
    function onFileChange (evt) {
        const fileInput = evt.target;

        // Exit if FileReader or FileInput isn't in the DOM
        if (!window.FileReader || !fileInput) return;

        const preview = document.querySelector(`#${ fileInput.id }-image img`);
        const file = fileInput.files[0];

        const reader = new FileReader();
        reader.addEventListener("load", function () {
            preview.src = reader.result;
            preview.classList.remove('d-none');
        }, false);

        if (file) {
            reader.readAsDataURL(fileInput.files[0]);
        }

        // Active the reorder button
        const parentTab = fileInput.closest('.tab-pane');
        const imageContainer = fileInput.closest('.sortable-handle');

        if (imageContainer) {
            const reorderBtns = imageContainer.querySelectorAll('.btn-reorder');
            reorderBtns.forEach(btn => {
                btn.disabled = false;
                btn.classList.remove('disabled');
            });
        }

        const uploadImageContainer = fileInput.closest('.upload-image');
        if (!uploadImageContainer) return;

        const lastImageItem = uploadImageContainer.querySelector('.sortable-handle:last-child');
        if (!lastImageItem) return;

        const totalFormsInput = parentTab.querySelector("input[name$=images-TOTAL_FORMS]");
        const maxFormsInput = parentTab.querySelector("input[name$=images-MAX_NUM_FORMS]");

        if (!totalFormsInput || !maxFormsInput) return;

        const numExisting = parseInt(totalFormsInput.value, 10);
        const numMax = parseInt(maxFormsInput.value, 10);

        // Add new image field if necessary
        if (numExisting < numMax) {
            const newImg = o.dashboard._extraProductImg.cloneNode(true);
            const productId = document.getElementById('id_images-0-product').value;

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

            // Update cloned item hidden input's values
            const displayOrderInput = newImg.querySelector(`#id_images-${ numExisting }-display_order`);
            if (displayOrderInput) displayOrderInput.value = numExisting;

            const productInput = newImg.querySelector(`#id_images-${ numExisting }-product`);
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

            };

            o.dashboard.options = Object.assign({}, defaults, options);

            o.dashboard.initWidgets(o.dashboard.options);
            o.dashboard.initForms();
            o.dashboard.initTemplate();
            o.dashboard.initClock();

            // Adds error icon if there are errors in the product update form
            document.querySelectorAll('[data-behaviour="tab-nav-errors"] .tab-pane').forEach(pane => {
                const errors = pane.querySelectorAll(':is(.text-danger.error, .alert.alert-danger):not(:empty)');
                if (errors.length > 0) {
                    const paneId = pane.id;
                    const tabLink = document.querySelector(`.custom-nav :is(a[href="#${ paneId }"], button[data-bs-target="#${ paneId }"])`);
                    if (tabLink) {
                        const icon = document.createElement('iconify-icon');
                        icon.icon = 'material-symbols:error';
                        icon.ariaHidden = true;
                        icon.classList.add('text-danger', 'ms-auto');
                        icon.width = icon.height = '1rem';
                        icon.inline = true;
                        tabLink.appendChild(icon);
                    }
                }
            });

            o.dashboard.filereader.init();

            // Hidde welcome alert when login
            const alertContainer = document.getElementById('messages');
            if (alertContainer) {
                const alertsDom = document.querySelectorAll('.alert.alert-dismissible');
                let countAlerts = alertsDom.length;
                alertsDom.forEach((alertDom) => {
                    const alert = bootstrap.Alert.getOrCreateInstance(alertDom);

                    // Listen for the closed event
                    alertDom.addEventListener('closed.bs.alert', () => {
                        countAlerts--;
                        if (countAlerts === 0) alertContainer.style.display = 'none';
                    }, { once: true });

                    setTimeout(() => {
                        alert.close();
                    }, 60 * 1000);
                });
            }
        },

        initMasks: function () {
            // Using vanilla Inputmask (without jQuery)
            const inputs = document.querySelectorAll('input, textarea, select, button');
            inputs.forEach(input => {
                Inputmask().mask(input);
            });
        },

        // TODO: TEST THIS OF TINYMCE
        filebrowser_callback: function (field_name, url, type, win) {
            let filebrowserUrl = '/filebrowser/browse/?pop=2&type=' + type;
            tinymce.activeEditor.windowManager.openUrl({
                title: 'File Browser',
                url: filebrowserUrl,
                width: 800,
                height: 600,
                onMessage: function (api, message) {
                    if (message.mceAction === 'fileSelected') {
                        win.document.getElementById(field_name).value = message.url;
                        api.close();
                    }
                }
            });
        },
        initForms: function () {

            // Handle button loading states
            document.querySelectorAll('form:has([data-loading-text])').forEach((form) => {
                form.querySelectorAll('[data-loading-text]').forEach(btn => {
                    btn.addEventListener('click', () => {

                        // Use requestAnimationFrame to delay disabling until after form submission begins
                        if (!form || form.checkValidity()) {
                            requestAnimationFrame(() => {
                                const loadingText = btn.dataset.loadingText;
                                if (btn.tagName === 'INPUT') {
                                    btn.value = loadingText;
                                } else {
                                    btn.classList.remove('btn-label', 'right', 'left');
                                    btn.classList.add('icon-link');
                                    btn.innerHTML = `
                                    <div class="spinner-border spinner-border-sm" role="status">
                                        <span class="visually-hidden">${ loadingText }</span>
                                    </div>
                                    ${ loadingText }`;
                                }
                                btn.classList.add('disabled');
                                btn.disabled = true;
                            });
                        }
                    });
                });

                form.querySelectorAll('.tab-pane input').forEach(input => {
                    input.addEventListener('invalid', (e) => {
                        const invalidInput = form.querySelector('input:invalid');

                        // Show tab with errors if form is invalid
                        if (input == invalidInput) {
                            const tabPane = input.closest('.tab-pane');
                            if (tabPane) {
                                if (tabPane.id) {
                                    // We need a vanilla JS replacement for Bootstrap's tab 'show' method
                                    const tabLink = form.querySelector(`.nav-link:is([data-bs-target="#${ tabPane.id }"], [href="#${ tabPane.id }"])`);
                                    if (tabLink) {
                                        tabLink.click();
                                    }
                                }
                            }
                        } else {
                            e.preventDefault();
                            e.stopPropagation();
                        }
                    });
                });
            });

            // Add href to url for tab display
            document.querySelectorAll('.nav-tabs a').forEach(tab => {
                tab.addEventListener('shown.bs.tab', function (e) {
                    window.location.hash = e.target.hash;
                });
            });
        },
        initProductImages: function () {
            const productImages = document.getElementById('product_images');
            if (!productImages) return;

            const extraImg = productImages.querySelector('.upload-image .sortable-handle:last-child');
            if (extraImg) {
                o.dashboard._extraProductImg = extraImg.cloneNode(true);
            }


            // Initialize SortableJS for image reordering
            const uploadImages = document.querySelectorAll('.upload-image');
            uploadImages.forEach(list => {
                new Sortable(list, {
                    animation: 150,
                    handle: '.btn-reorder',
                    filter: 'disabled',
                    ghostClass: 'sortable-ghost',
                    onEnd: () => {
                        // Update display order when items are reordered
                        const sortFields = document.querySelectorAll("input[name$=-display_order]");
                        sortFields.forEach((field, i) => {
                            field.value = i;
                        });
                    }
                });
            });
        },
        initSelects: (options) => {
            const choicesExamples = document.querySelectorAll("[data-choices]");
            choicesExamples.forEach(function (item) {
                const choiceData = {
                    noChoicesText: options.noChoicesText,
                    noResultsText: options.noResultsText,
                    placeholderValue: options.placeholderValue,
                };
                const isChoicesVal = item.attributes;
                if (isChoicesVal["data-choices-search-false"]) {
                    choiceData.searchEnabled = false;
                } else {
                    if (isChoicesVal["data-choices-search-true"]) {
                        choiceData.searchEnabled = true;
                    }
                }
                if (isChoicesVal["data-placeholder-false"]) {
                    choiceData.placeholder = false;
                }
                if (isChoicesVal["data-choices-removeItem"]) {
                    choiceData.removeItemButton = true;
                }
                if (isChoicesVal["data-choices-sorting-false"]) {
                    choiceData.shouldSort = false;
                } else {
                    if (isChoicesVal["data-choices-sorting-true"]) {
                        choiceData.shouldSort = true;
                    }
                }
                if (isChoicesVal["data-choices-limit"]) {
                    choiceData.maxItemCount = isChoicesVal["data-choices-limit"].value.toString();
                }
                if (isChoicesVal["data-choices-text-unique-true"]) {
                    choiceData.duplicateItemsAllowed = false;
                }
                if (isChoicesVal["data-choices-text-disabled-true"]) {
                    choiceData.addItems = false;
                }
                isChoicesVal["data-choices-text-disabled-true"] ? new Choices(item, choiceData).disable() : new Choices(item, choiceData);
            });
        },
        initDeleteModal: (deleteAction, replacePattern) => {
            const modal = document.querySelector("#deleteModal");
            const form = document.querySelector('.deleteModal__form');
            if (modal && form && deleteAction?.trim()) {
                modal.addEventListener("show.bs.modal", (event) => {
                    const button = event.relatedTarget;
                    const pk = button.dataset.bsPk;
                    const name = button.dataset.bsName;
                    const modalBody = modal.querySelector(".deleteModal__body");
                    modalBody.textContent = name;
                    form.action = deleteAction.replace(replacePattern, pk);
                });
            } else {
                document.querySelectorAll('.dropdown__deleteButton').forEach(btn => {
                    btn.disabled = true;
                });
            }
        },
        initTemplate: () => {
            let horizontalMenuSplit = 5; // after this number all horizontal menus will be moved in More menu options

            function pluginData () {
                /**
                 * Common plugins
                 */

                /**
                 * flatpickr
                 */
                let flatpickrExamples = document.querySelectorAll("[data-provider]");
                Array.from(flatpickrExamples).forEach(function (item) {
                    if (item.getAttribute("data-provider") == "flatpickr") {
                        let dateData = {};
                        let isFlatpickerVal = item.attributes;
                        if (isFlatpickerVal["data-date-format"])
                            dateData.dateFormat = isFlatpickerVal["data-date-format"].value.toString();
                        if (isFlatpickerVal["data-enable-time"]) {
                            (dateData.enableTime = true),
                                (dateData.dateFormat = isFlatpickerVal["data-date-format"].value.toString() + " H:i");
                        }
                        if (isFlatpickerVal["data-altFormat"]) {
                            (dateData.altInput = true),
                                (dateData.altFormat = isFlatpickerVal["data-altFormat"].value.toString());
                        }
                        if (isFlatpickerVal["data-minDate"]) {
                            dateData.minDate = isFlatpickerVal["data-minDate"].value.toString();
                            dateData.dateFormat = isFlatpickerVal["data-date-format"].value.toString();
                        }
                        if (isFlatpickerVal["data-maxDate"]) {
                            dateData.maxDate = isFlatpickerVal["data-maxDate"].value.toString();
                            dateData.dateFormat = isFlatpickerVal["data-date-format"].value.toString();
                        }
                        if (isFlatpickerVal["data-deafult-date"]) {
                            dateData.defaultDate = isFlatpickerVal["data-deafult-date"].value.toString();
                            dateData.dateFormat = isFlatpickerVal["data-date-format"].value.toString();
                        }
                        if (isFlatpickerVal["data-multiple-date"]) {
                            dateData.mode = "multiple";
                            dateData.dateFormat = isFlatpickerVal["data-date-format"].value.toString();
                        }
                        if (isFlatpickerVal["data-range-date"]) {
                            dateData.mode = "range";
                            dateData.dateFormat = isFlatpickerVal["data-date-format"].value.toString();
                        }
                        if (isFlatpickerVal["data-inline-date"]) {
                            (dateData.inline = true),
                                (dateData.defaultDate = isFlatpickerVal["data-deafult-date"].value.toString());
                            dateData.dateFormat = isFlatpickerVal["data-date-format"].value.toString();
                        }
                        if (isFlatpickerVal["data-disable-date"]) {
                            let dates = [];
                            dates.push(isFlatpickerVal["data-disable-date"].value);
                            dateData.disable = dates.toString().split(",");
                        }
                        if (isFlatpickerVal["data-week-number"]) {
                            let dates = [];
                            dates.push(isFlatpickerVal["data-week-number"].value);
                            dateData.weekNumbers = true;
                        }
                        // TODO: 
                        // flatpickr(item, dateData);
                    } else if (item.getAttribute("data-provider") == "timepickr") {
                        let timeData = {};
                        let isTimepickerVal = item.attributes;
                        if (isTimepickerVal["data-time-basic"]) {
                            (timeData.enableTime = true),
                                (timeData.noCalendar = true),
                                (timeData.dateFormat = "H:i");
                        }
                        if (isTimepickerVal["data-time-hrs"]) {
                            (timeData.enableTime = true),
                                (timeData.noCalendar = true),
                                (timeData.dateFormat = "H:i"),
                                (timeData.time_24hr = true);
                        }
                        if (isTimepickerVal["data-min-time"]) {
                            (timeData.enableTime = true),
                                (timeData.noCalendar = true),
                                (timeData.dateFormat = "H:i"),
                                (timeData.minTime = isTimepickerVal["data-min-time"].value.toString());
                        }
                        if (isTimepickerVal["data-max-time"]) {
                            (timeData.enableTime = true),
                                (timeData.noCalendar = true),
                                (timeData.dateFormat = "H:i"),
                                (timeData.minTime = isTimepickerVal["data-max-time"].value.toString());
                        }
                        if (isTimepickerVal["data-default-time"]) {
                            (timeData.enableTime = true),
                                (timeData.noCalendar = true),
                                (timeData.dateFormat = "H:i"),
                                (timeData.defaultDate = isTimepickerVal["data-default-time"].value.toString());
                        }
                        if (isTimepickerVal["data-time-inline"]) {
                            (timeData.enableTime = true),
                                (timeData.noCalendar = true),
                                (timeData.defaultDate = isTimepickerVal["data-time-inline"].value.toString());
                            timeData.inline = true;
                        }
                        // TODO: 
                        // flatpickr(item, timeData);
                    }
                });
            }

            function initLeftMenuCollapse () {
                /**
                 * Vertical layout menu scroll add
                 */
                if (document.documentElement.getAttribute("data-layout") == "vertical") {
                    document.getElementById("scrollbar").setAttribute("data-simplebar", "");
                    document.getElementById("navbar-nav").setAttribute("data-simplebar", "");
                    document.getElementById("scrollbar").classList.add("h-100");
                }

                /**
                 * Horizontal layout menu
                 */
                if (document.documentElement.getAttribute("data-layout") == "horizontal") {
                    updateHorizontalMenus();
                }
            }

            function isLoadBodyElement () {
                let verticalOverlay = document.getElementsByClassName("vertical-overlay");
                if (verticalOverlay) {
                    Array.from(verticalOverlay).forEach(function (element) {
                        element.addEventListener("click", function () {
                            document.body.classList.remove("vertical-sidebar-enable");
                            document.documentElement.setAttribute("data-sidebar-size", sessionStorage.getItem("data-sidebar-size"));
                        });
                    });
                }
            }

            function windowResizeHover () {
                let windowSize = document.documentElement.clientWidth;
                if (windowSize < 1025 && windowSize > 767) {
                    if (sessionStorage.getItem("data-layout") == "vertical") {
                        document.documentElement.setAttribute("data-sidebar-size", "sm");
                    }
                    if (document.querySelector(".hamburger-icon")) {
                        document.querySelector(".hamburger-icon").classList.add("open");
                    }
                } else if (windowSize >= 1025) {
                    if (sessionStorage.getItem("data-layout") == "vertical") {
                        document.documentElement.setAttribute(
                            "data-sidebar-size",
                            sessionStorage.getItem("data-sidebar-size")
                        );
                    }
                    if (document.querySelector(".hamburger-icon")) {
                        document.querySelector(".hamburger-icon").classList.remove("open");
                    }
                } else if (windowSize <= 767) {
                    document.body.classList.remove("vertical-sidebar-enable");
                    if (sessionStorage.getItem("data-layout") != "horizontal") {
                        document.documentElement.setAttribute("data-sidebar-size", "lg");
                        document.querySelector(".app-menu.navbar-menu").classList.add("h-100");

                    }
                    if (document.querySelector(".hamburger-icon")) {
                        document.querySelector(".hamburger-icon").classList.add("open");
                    }
                }
            }

            function toggleHamburgerMenu () {
                let windowSize = document.documentElement.clientWidth;

                if (windowSize > 767)
                    document.querySelector(".hamburger-icon").classList.toggle("open");

                //For collapse horizontal menu
                if (document.documentElement.getAttribute("data-layout") === "horizontal") {
                    document.body.classList.contains("menu") ? document.body.classList.remove("menu") : document.body.classList.add("menu");
                }

                //For collapse vertical menu
                if (document.documentElement.getAttribute("data-layout") === "vertical") {
                    if (windowSize < 1025 && windowSize > 767) {
                        document.body.classList.remove("vertical-sidebar-enable");
                        document.documentElement.getAttribute("data-sidebar-size") == "sm" ?
                            document.documentElement.setAttribute("data-sidebar-size", "") :
                            document.documentElement.setAttribute("data-sidebar-size", "sm");
                    } else if (windowSize > 1025) {
                        document.body.classList.remove("vertical-sidebar-enable");
                        document.documentElement.getAttribute("data-sidebar-size") == "lg" ?
                            document.documentElement.setAttribute("data-sidebar-size", "sm") :
                            document.documentElement.setAttribute("data-sidebar-size", "lg");
                    } else if (windowSize <= 767) {
                        document.body.classList.add("vertical-sidebar-enable");
                        document.documentElement.setAttribute("data-sidebar-size", "lg");
                    }
                }
            }

            function windowLoadContent () {
                window.addEventListener("resize", windowResizeHover);
                windowResizeHover();

                window.addEventListener("load", function () {
                    initActiveMenu();
                    isLoadBodyElement();
                });
                if (document.getElementById("topnav-hamburger-icon")) {
                    document.getElementById("topnav-hamburger-icon").addEventListener("click", toggleHamburgerMenu);
                }
            }

            // two-column sidebar active js
            function initActiveMenu () {
                debugger;
                const currentPath = location.pathname;
                const sidebarLinks = document.getElementById("navbar-nav").querySelectorAll("a.nav-link");

                let matchedLink = null;
                let maxMatchLength = 0; // To get closest url

                sidebarLinks.forEach(link => {
                    const href = link.getAttribute('href');

                    if (href && currentPath.includes(href) && href.length > maxMatchLength) {
                        matchedLink = link;
                        maxMatchLength = href.length;
                    }
                });

                if (matchedLink) {
                    matchedLink.classList.add("active");

                    const parentCollapseDiv = matchedLink.closest(".collapse.menu-dropdown");
                    if (parentCollapseDiv) {
                        parentCollapseDiv.classList.add("show");
                        parentCollapseDiv.parentElement.children[0].classList.add("active");
                        parentCollapseDiv.parentElement.children[0].setAttribute("aria-expanded", "true");
                        if (parentCollapseDiv.parentElement.closest(".collapse.menu-dropdown")) {
                            parentCollapseDiv.parentElement.closest(".collapse").classList.add("show");
                            if (parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling)
                                parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling.classList.add("active");

                            if (parentCollapseDiv.parentElement.parentElement.parentElement.parentElement.closest(".collapse.menu-dropdown")) {
                                parentCollapseDiv.parentElement.parentElement.parentElement.parentElement.closest(".collapse").classList.add("show");
                                if (parentCollapseDiv.parentElement.parentElement.parentElement.parentElement.closest(".collapse").previousElementSibling) {

                                    parentCollapseDiv.parentElement.parentElement.parentElement.parentElement.closest(".collapse").previousElementSibling.classList.add("active");
                                    if ((document.documentElement.dataset.layout == "horizontal") && parentCollapseDiv.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.closest(".collapse")) {
                                        parentCollapseDiv.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.closest(".collapse").previousElementSibling.classList.add("active");
                                    }
                                }
                            }
                        }
                    }
                }
            }

            function initComponents () {
                // tooltip
                let tooltipTriggerList = [].slice.call(
                    document.querySelectorAll('[data-bs-toggle="tooltip"]')
                );
                tooltipTriggerList.map(function (tooltipTriggerEl) {
                    return new bootstrap.Tooltip(tooltipTriggerEl);
                });

                // popover
                let popoverTriggerList = [].slice.call(
                    document.querySelectorAll('[data-bs-toggle="popover"]')
                );
                popoverTriggerList.map(function (popoverTriggerEl) {
                    return new bootstrap.Popover(popoverTriggerEl);
                });
            }

            // Counter Number
            function counter () {
                let counter = document.querySelectorAll(".counter-value");
                let speed = 250; // The lower the slower
                counter &&
                    Array.from(counter).forEach(function (counter_value) {
                        function updateCount () {
                            let target = +counter_value.getAttribute("data-target");
                            let count = +counter_value.innerText;
                            let inc = target / speed;
                            if (inc < 1) {
                                inc = 1;
                            }
                            // Check if target is reached
                            if (count < target) {
                                // Add inc to count and output in counter_value
                                counter_value.innerText = (count + inc).toFixed(0);
                                // Call function every ms
                                setTimeout(updateCount, 1);
                            } else {
                                counter_value.innerText = numberWithCommas(target);
                            }
                            numberWithCommas(counter_value.innerText);
                        }
                        updateCount();
                    });

                function numberWithCommas (x) {
                    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                }
            }

            function updateHorizontalMenus () {
                document.getElementById("scrollbar").classList.remove("h-100");

                let splitMenu = horizontalMenuSplit;
                let extraMenuName = "More";
                let menuData = document.querySelectorAll("ul.navbar-nav > li.nav-item");
                let newMenus = "";
                let splitItem = "";

                Array.from(menuData).forEach(function (item, index) {
                    if (index + 1 === splitMenu) {
                        splitItem = item;
                    }
                    if (index + 1 > splitMenu) {
                        newMenus += item.outerHTML;
                        item.remove();
                    }

                    if (index + 1 === menuData.length) {
                        if (splitItem.insertAdjacentHTML) {
                            splitItem.insertAdjacentHTML(
                                "afterend",
                                '<li class="nav-item">\
						<a class="nav-link" href="#sidebarMore" data-bs-toggle="collapse" role="button" aria-expanded="false" aria-controls="sidebarMore">\
							<i class="ri-briefcase-2-line"></i> <span data-key="t-more">' + extraMenuName + '</span>\
						</a>\
						<div class="collapse menu-dropdown" id="sidebarMore"><ul class="nav nav-sm flex-column">' + newMenus + "</ul></div>\
					</li>");
                        }
                    }
                });
            }

            function initFullScreen () {
                let fullscreenBtn = document.querySelector('[data-toggle="fullscreen"]');
                fullscreenBtn &&
                    fullscreenBtn.addEventListener("click", function (e) {
                        e.preventDefault();
                        document.body.classList.toggle("fullscreen-enable");
                        if (!document.fullscreenElement &&
                            /* alternative standard method */
                            !document.mozFullScreenElement &&
                            !document.webkitFullscreenElement
                        ) {
                            // current working methods
                            if (document.documentElement.requestFullscreen) {
                                document.documentElement.requestFullscreen();
                            } else if (document.documentElement.mozRequestFullScreen) {
                                document.documentElement.mozRequestFullScreen();
                            } else if (document.documentElement.webkitRequestFullscreen) {
                                document.documentElement.webkitRequestFullscreen(
                                    Element.ALLOW_KEYBOARD_INPUT
                                );
                            }
                        } else {
                            if (document.cancelFullScreen) {
                                document.cancelFullScreen();
                            } else if (document.mozCancelFullScreen) {
                                document.mozCancelFullScreen();
                            } else if (document.webkitCancelFullScreen) {
                                document.webkitCancelFullScreen();
                            }
                        }
                    });

                document.addEventListener("fullscreenchange", exitHandler);
                document.addEventListener("webkitfullscreenchange", exitHandler);
                document.addEventListener("mozfullscreenchange", exitHandler);

                function exitHandler () {
                    if (!document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
                        document.body.classList.remove("fullscreen-enable");
                    }
                }
            }

            const initScrollToTop = () => {
                //
                /********************* scroll top js ************************/
                //
                let mybutton = document.getElementById("back-to-topback-to-top");

                if (mybutton) {
                    // When the user scrolls down 20px from the top of the document, show the button
                    window.onscroll = function () {
                        scrollFunction();
                    };

                    function scrollFunction () {
                        if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
                            mybutton.style.display = "block";
                        } else {
                            mybutton.style.display = "none";
                        }
                    }

                    mybutton.addEventListener('click', () => {
                        document.body.scrollTop = 0;
                        document.documentElement.scrollTop = 0;
                    });
                }
            };

            function init () {
                initFullScreen();
                windowLoadContent();
                counter();
                initLeftMenuCollapse();
                initComponents();
                pluginData();
                initScrollToTop();
            }
            init();
        },
        initClock: () => {
            const updateDateTime = () => {
                const now = new Date();

                // Options for date and hour
                const clockOptions = {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                };

                // Format according to user location
                const formatted = now.toLocaleDateString(o.dashboard.options["languageCode"], clockOptions);

                document.getElementById('current-time').textContent = formatted;
            };

            // Update immidiately
            updateDateTime();

            // Update each minute
            setInterval(updateDateTime, 60000);
        },
        index: {
            init: () => {
                // get colors array from the string
                function getChartColorsArray (chartId) {
                    if (document.getElementById(chartId) !== null) {
                        let colors = document.getElementById(chartId).getAttribute("data-colors");
                        if (colors) {
                            colors = JSON.parse(colors);
                            return colors.map(function (value) {
                                let newValue = value.replace(" ", "");
                                if (newValue.indexOf(",") === -1) {
                                    let color = getComputedStyle(document.documentElement).getPropertyValue(
                                        newValue
                                    );
                                    if (color) return color;
                                    else return newValue;
                                } else {
                                    let val = value.split(",");
                                    if (val.length == 2) {
                                        let rgbaColor = getComputedStyle(
                                            document.documentElement
                                        ).getPropertyValue(val[0]);
                                        rgbaColor = "rgba(" + rgbaColor + "," + val[1] + ")";
                                        return rgbaColor;
                                    } else {
                                        return newValue;
                                    }
                                }
                            });
                        } else {
                            console.warn('data-colors atributes not found on', chartId);
                        }
                    }
                }

                let linechartcustomerColors = getChartColorsArray("customer_impression_charts");
                if (linechartcustomerColors) {
                    let options = {
                        series: [{
                            name: "Orders",
                            type: "area",
                            data: [34, 65, 46, 68, 49, 61, 42, 44, 78, 52, 63, 67],
                        },
                        {
                            name: "Earnings",
                            type: "bar",
                            data: [
                                89.25, 98.58, 68.74, 108.87, 77.54, 84.03, 51.24, 28.57, 92.57, 42.36,
                                88.51, 36.57,
                            ],
                        },
                        {
                            name: "Refunds",
                            type: "line",
                            data: [8, 12, 7, 17, 21, 11, 5, 9, 7, 29, 12, 35],
                        },
                        ],
                        chart: {
                            height: 310,
                            type: "line",
                            toolbar: {
                                show: false,
                            },
                        },
                        stroke: {
                            curve: "straight",
                            dashArray: [0, 0, 8],
                            width: [0.1, 0, 2],
                        },
                        fill: {
                            opacity: [0.03, 0.9, 1],
                        },
                        markers: {
                            size: [0, 0, 0],
                            strokeWidth: 2,
                            hover: {
                                size: 4,
                            },
                        },
                        xaxis: {
                            categories: [
                                "Jan",
                                "Feb",
                                "Mar",
                                "Apr",
                                "May",
                                "Jun",
                                "Jul",
                                "Aug",
                                "Sep",
                                "Oct",
                                "Nov",
                                "Dec",
                            ],
                            axisTicks: {
                                show: false,
                            },
                            axisBorder: {
                                show: false,
                            },
                        },
                        grid: {
                            show: true,
                            xaxis: {
                                lines: {
                                    show: true,
                                },
                            },
                            yaxis: {
                                lines: {
                                    show: false,
                                },
                            },
                            padding: {
                                top: 0,
                                right: -2,
                                bottom: 15,
                                left: 10,
                            },
                        },
                        legend: {
                            show: true,
                            horizontalAlign: "center",
                            offsetX: 0,
                            offsetY: -5,
                            markers: {
                                width: 9,
                                height: 9,
                                radius: 6,
                            },
                            itemMargin: {
                                horizontal: 10,
                                vertical: 0,
                            },
                        },
                        plotOptions: {
                            bar: {
                                columnWidth: "20%",
                                barHeight: "100%",
                                borderRadius: [8],
                            },
                        },
                        colors: linechartcustomerColors,
                        tooltip: {
                            shared: true,
                            y: [{
                                formatter: function (y) {
                                    if (typeof y !== "undefined") {
                                        return y.toFixed(0);
                                    }
                                    return y;
                                },
                            },
                            {
                                formatter: function (y) {
                                    if (typeof y !== "undefined") {
                                        return "$" + y.toFixed(2) + "k";
                                    }
                                    return y;
                                },
                            },
                            {
                                formatter: function (y) {
                                    if (typeof y !== "undefined") {
                                        return y.toFixed(0) + " Sales";
                                    }
                                    return y;
                                },
                            },
                            ],
                        },
                    };
                    let chart = new ApexCharts(
                        document.querySelector("#customer_impression_charts"),
                        options
                    );
                    chart.render();
                }

                // Simple Donut Charts
                let chartDonutBasicColors = getChartColorsArray("#store-visits-source");
                if (chartDonutBasicColors) {
                    let options = {
                        series: [44, 55, 41, 17, 15],
                        labels: ["Direct", "Social", "Email", "Other", "Referrals"],
                        chart: {
                            height: 333,
                            type: "donut",
                        },
                        legend: {
                            position: "bottom",
                        },
                        stroke: {
                            show: false
                        },
                        dataLabels: {
                            dropShadow: {
                                enabled: false,
                            },
                        },
                        colors: chartDonutBasicColors,
                    };

                    let chart = new ApexCharts(
                        document.querySelector("#store-visits-source"),
                        options
                    );
                    chart.render();
                }

                let swiper = new Swiper(".selling-product", {
                    slidesPerView: "auto",
                    spaceBetween: 15,
                    pagination: {
                        el: ".swiper-pagination",
                        clickable: true,
                    },
                    autoplay: {
                        delay: 2500,
                        disableOnInteraction: false,
                    },
                });

                function currentTime () {
                    let ampm = new Date().getHours() >= 12 ? "pm" : "am";
                    let hour =
                        new Date().getHours() > 12 ?
                            new Date().getHours() % 12 :
                            new Date().getHours();
                    let minute =
                        new Date().getMinutes() < 10 ?
                            "0" + new Date().getMinutes() :
                            new Date().getMinutes();
                    if (hour < 10) {
                        return "0" + hour + ":" + minute + " " + ampm;
                    } else {
                        return hour + ":" + minute + " " + ampm;
                    }
                }

                setInterval(currentTime, 1000);


                //  Line chart datalabel
                let linechartDatalabelColors = getChartColorsArray("line_chart_datalabel");
                if (linechartDatalabelColors) {
                    let options = {
                        chart: {
                            height: 405,
                            zoom: {
                                enabled: true
                            },
                            toolbar: {
                                show: false
                            }
                        },
                        colors: linechartDatalabelColors,
                        markers: {
                            size: 0,
                            colors: "#ffffff",
                            strokeColors: linechartDatalabelColors,
                            strokeWidth: 1,
                            strokeOpacity: 0.9,
                            fillOpacity: 1,
                        },
                        dataLabels: {
                            enabled: false,
                        },
                        stroke: {
                            width: [2, 2, 2],
                            curve: 'smooth'
                        },
                        series: [{
                            name: "Orders",
                            type: 'line',
                            data: [180, 274, 346, 290, 370, 420, 490, 542, 510, 580, 636, 745]
                        },
                        {
                            name: "Refunds",
                            type: 'area',
                            data: [100, 154, 302, 411, 300, 284, 273, 232, 187, 174, 152, 122]
                        },
                        {
                            name: "Earnings",
                            type: 'line',
                            data: [260, 360, 320, 345, 436, 527, 641, 715, 832, 794, 865, 933]
                        }
                        ],
                        fill: {
                            type: ['solid', 'gradient', 'solid'],
                            gradient: {
                                shadeIntensity: 1,
                                type: "vertical",
                                inverseColors: false,
                                opacityFrom: 0.3,
                                opacityTo: 0.0,
                                stops: [20, 80, 100, 100]
                            },
                        },
                        grid: {
                            row: {
                                colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
                                opacity: 0.2
                            },
                            borderColor: '#f1f1f1'
                        },
                        xaxis: {
                            categories: [
                                "Jan",
                                "Feb",
                                "Mar",
                                "Apr",
                                "May",
                                "Jun",
                                "Jul",
                                "Aug",
                                "Sep",
                                "Oct",
                                "Nov",
                                "Dec",
                            ],
                        },
                        legend: {
                            position: 'top',
                            horizontalAlign: 'right',
                            floating: true,
                            offsetY: -25,
                            offsetX: -5
                        },
                        responsive: [{
                            breakpoint: 600,
                            options: {
                                chart: {
                                    toolbar: {
                                        show: false
                                    }
                                },
                                legend: {
                                    show: false
                                },
                            }
                        }]
                    };

                    let chart = new ApexCharts(
                        document.querySelector("#line_chart_datalabel"),
                        options
                    );
                    chart.render();
                }

                // world map with line & markers
                let vectorMapWorldLineColors = getChartColorsArray("world-map-line-markers");
                if (vectorMapWorldLineColors) {
                    const worldlinemap = new jsVectorMap({
                        map: "world_merc",
                        selector: "#world-map-line-markers",
                        zoomOnScroll: false,
                        zoomButtons: false,
                        markers: [{
                            name: "Greenland",
                            coords: [71.7069, 42.6043],
                            style: {
                                image: "../static/img/flags/gl.svg",
                            }
                        },
                        {
                            name: "Canada",
                            coords: [56.1304, -106.3468],
                            style: {
                                image: "../static/img/flags/ca.svg",
                            }
                        },
                        {
                            name: "Brazil",
                            coords: [-14.2350, -51.9253],
                            style: {
                                image: "../static/img/flags/br.svg",
                            }
                        },
                        {
                            name: "Serbia",
                            coords: [44.0165, 21.0059],
                            style: {
                                image: "../static/img/flags/rs.svg",
                            }
                        },
                        {
                            name: "Russia",
                            coords: [61, 105],
                            style: {
                                image: "../static/img/flags/ru.svg",
                            }
                        },
                        {
                            name: "US",
                            coords: [37.0902, -95.7129],
                            style: {
                                image: "../static/img/flags/us.svg",
                            }
                        },
                        {
                            name: "Australia",
                            coords: [25.2744, 133.7751],
                            style: {
                                image: "../static/img/flags/au.svg",
                            }
                        },
                        ],
                        lines: [{
                            from: "Canada",
                            to: "Serbia",
                        },
                        {
                            from: "Russia",
                            to: "Serbia"
                        },
                        {
                            from: "Greenland",
                            to: "Serbia"
                        },
                        {
                            from: "Brazil",
                            to: "Serbia"
                        },
                        {
                            from: "US",
                            to: "Serbia"
                        },
                        {
                            from: "Australia",
                            to: "Serbia"
                        },
                        ],
                        regionStyle: {
                            initial: {
                                stroke: "#9599ad",
                                strokeWidth: 0.25,
                                fill: vectorMapWorldLineColors,
                                fillOpacity: 1,
                            },
                        },
                        labels: {
                            markers: {
                                render (marker, index) {
                                    return marker.name || marker.labelName || 'Not available';
                                }
                            }
                        },
                        lineStyle: {
                            animation: true,
                            strokeDasharray: "6 3 6",
                        },
                    });
                }

                // Multi-Radial Bar
                let chartRadialbarMultipleColors = getChartColorsArray("multiple_radialbar");
                if (chartRadialbarMultipleColors) {
                    let options = {
                        series: [85, 69, 45, 78],
                        chart: {
                            height: 300,
                            type: 'radialBar',
                        },
                        sparkline: {
                            enabled: true
                        },
                        plotOptions: {
                            radialBar: {
                                startAngle: -90,
                                endAngle: 90,
                                dataLabels: {
                                    name: {
                                        fontSize: '22px',
                                    },
                                    value: {
                                        fontSize: '16px',
                                    },
                                    total: {
                                        show: true,
                                        label: 'Sales',
                                        formatter: function (w) {
                                            return 2922;
                                        }
                                    }
                                }
                            }
                        },
                        labels: ['Fashion', 'Electronics', 'Groceries', 'Others'],
                        colors: chartRadialbarMultipleColors,
                        legend: {
                            show: false,
                            fontSize: '16px',
                            position: 'bottom',
                            labels: {
                                useSeriesColors: true,
                            },
                            markers: {
                                size: 0
                            },
                        },
                    };

                    let chart = new ApexCharts(document.querySelector("#multiple_radialbar"), options);
                    chart.render();
                }


                //  Spline Area Charts
                let areachartSplineColors = getChartColorsArray("area_chart_spline");
                if (areachartSplineColors) {
                    let options = {
                        series: [{
                            name: 'This Month',
                            data: [49, 54, 48, 54, 67, 88, 96]
                        }, {
                            name: 'Last Month',
                            data: [57, 66, 74, 63, 55, 70, 85]
                        }],
                        chart: {
                            height: 250,
                            type: 'area',
                            toolbar: {
                                show: false
                            }
                        },
                        fill: {
                            type: ['gradient', 'gradient'],
                            gradient: {
                                shadeIntensity: 1,
                                type: "vertical",
                                inverseColors: false,
                                opacityFrom: 0.3,
                                opacityTo: 0.0,
                                stops: [50, 70, 100, 100]
                            },
                        },
                        markers: {
                            size: 4,
                            colors: "#ffffff",
                            strokeColors: areachartSplineColors,
                            strokeWidth: 1,
                            strokeOpacity: 0.9,
                            fillOpacity: 1,
                            hover: {
                                size: 6,
                            }
                        },
                        grid: {
                            show: false,
                            padding: {
                                top: -35,
                                right: 0,
                                bottom: 0,
                                left: -6,
                            },
                        },
                        legend: {
                            show: false,
                        },
                        dataLabels: {
                            enabled: false
                        },
                        stroke: {
                            width: [2, 2],
                            curve: 'smooth'
                        },
                        colors: areachartSplineColors,
                        xaxis: {
                            labels: {
                                show: false,
                            }
                        },
                        yaxis: {
                            labels: {
                                show: false,
                            }
                        },
                    };

                    let chart = new ApexCharts(document.querySelector("#area_chart_spline"), options);
                    chart.render();
                }
            }
        },
        offers: {
            init: function () {
                o.dashboard.offers.adjustBenefitForm();
                document.getElementById('id_type').addEventListener('change', function () {
                    o.dashboard.offers.adjustBenefitForm();
                });
            },
            adjustBenefitForm: function () {
                const typeSelect = document.getElementById('id_type');
                const valueContainer = document.getElementById('id_value').closest('.form-floating');

                if (valueContainer) {
                    if (typeSelect.value == 'Multibuy') {
                        document.getElementById('id_value').value = '';
                        valueContainer.style.display = 'none';
                    } else {
                        valueContainer.style.display = '';
                    }
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
                const optionGroupSelect = document.getElementById(typeSelect.id.replace('type', 'option_group'));
                const value = typeSelect.value;
                const showOptionGroup = value === 'option' || value === 'multi_option';
                const optionGroupWrapper = optionGroupSelect.closest('.related-widget-wrapper').parentElement.parentElement;

                if (showOptionGroup) {
                    optionGroupSelect.required = true;
                    optionGroupWrapper.classList.remove('d-none');
                } else {
                    optionGroupSelect.required = false;
                    optionGroupWrapper.classList.add('d-none');
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
            // TODO: What is this for?


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
            // TODO: TEST THIS

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
        initWidgets: function (options) {
            o.dashboard.initMasks();
            o.dashboard.initSelects(options);
        },
    };

    return o;

})(oscar || {});
