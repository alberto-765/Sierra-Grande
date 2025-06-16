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
                const errors = pane.querySelectorAll(':is(.text-danger.error, .alert.alert-danger, .invalid-feedback):not(:empty)');
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
                if (isChoicesVal["data-choices-placeholder-false"]) {
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
                    counter.forEach(function (counter_value) {
                        function updateCount () {
                            let target = +counter_value.dataset.target;
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
            init: (dailyTotals, title, dataName) => {
                debugger;
                dailyTotals[0].total_incl_tax = 100;
                dailyTotals[1].total_incl_tax = 100;
                dailyTotals[2].total_incl_tax = 100;
                dailyTotals[3].total_incl_tax = 30;
                dailyTotals[4].total_incl_tax = 40;
                dailyTotals[5].total_incl_tax = 40;
                // Extract data from Django context
                const dates = dailyTotals.map(function (item) {
                    return item.date;
                });
                const totals = dailyTotals.map(function (item) {
                    return item.total_incl_tax;
                });

                // ApexCharts configuration
                const options = {
                    chart: {
                        type: 'bar',
                        height: 350,
                        // width: 'auto'
                    },
                    series: [{
                        name: dataName,
                        data: totals
                    }],
                    xaxis: {
                        categories: dates,
                        tooltip: {
                            enabled: true,
                        }
                    },
                    title: {
                        text: title,
                        align: 'center'
                    },
                    colors: ['#4875f0'],  // Teal color from example
                    grid: {
                        yaxis: {
                            lines: { show: true }
                        },
                        xaxis: {
                            lines: { show: false }
                        }
                    },
                    plotOptions: {
                        bar: {
                            borderRadius: 4,
                            dataLabels: {
                                position: 'top',
                            },
                        },
                    },
                    dataLabels: {
                        enabled: true,
                        formatter: function (val) {
                            return val + "%";
                        },
                        offsetY: -20,
                        style: {
                            fontSize: '12px',
                            colors: ["#adb5bd"]
                        }
                    },
                };

                // Render chart
                const chart = new ApexCharts(document.querySelector("#chart"), options);
                chart.render();
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
        initWidgets: function (options) {
            o.dashboard.initMasks();
            o.dashboard.initSelects(options);
        },
    };

    return o;

})(oscar || {});
