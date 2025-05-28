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

            // Hidde welcome alert when login
            setTimeout(() => {
                const alertContainer = document.getElementById('messages');
                // document.getElementById('messages').style.display = 'none';
                if (alertContainer) {
                    const alertsDom = document.querySelectorAll('.alert.alert-dismissible');
                    alertsDom.forEach((alertDom, index) => {
                        const alert = bootstrap.Alert.getOrCreateInstance(alertDom);
                        alert.close();

                        // Listen for the closed event
                        if (index == 0) {
                            alertDom.addEventListener('closed.bs.alert', () => {
                                alertContainer.style.display = 'none';
                            }, { once: true });
                        }
                    });
                }
            }, 60 * 1000);
        },

        initMasks: function (el) {
            // Using vanilla Inputmask (without jQuery)
            const inputs = el.querySelectorAll('input, textarea, select, button');
            inputs.forEach(input => {
                Inputmask().mask(input);
            });
        },
        initDatePickers: function (el) {
            // TODO: FINISH THIS AND REMOVE COMMENTS

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
        // TODO: TEST THIS OF TINYMCE
        filebrowser_callback: function (field_name, url, type, win) {
            var filebrowserUrl = '/filebrowser/browse/?pop=2&type=' + type;
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
        initTooltips: () => {
            const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
            const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
        },
        initDeleteModal: (deleteAction, replacePattern) => {
            o.dashboard.initTooltips();
            const modal = document.querySelector(".deleteModal");
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
        index: {
            init: () => {
                // get colors array from the string
                function getChartColorsArray (chartId) {
                    if (document.getElementById(chartId) !== null) {
                        var colors = document.getElementById(chartId).getAttribute("data-colors");
                        if (colors) {
                            colors = JSON.parse(colors);
                            return colors.map(function (value) {
                                var newValue = value.replace(" ", "");
                                if (newValue.indexOf(",") === -1) {
                                    var color = getComputedStyle(document.documentElement).getPropertyValue(
                                        newValue
                                    );
                                    if (color) return color;
                                    else return newValue;
                                } else {
                                    var val = value.split(",");
                                    if (val.length == 2) {
                                        var rgbaColor = getComputedStyle(
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

                var linechartcustomerColors = getChartColorsArray("customer_impression_charts");
                if (linechartcustomerColors) {
                    var options = {
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
                    var chart = new ApexCharts(
                        document.querySelector("#customer_impression_charts"),
                        options
                    );
                    chart.render();
                }

                // Simple Donut Charts
                var chartDonutBasicColors = getChartColorsArray("#store-visits-source");
                if (chartDonutBasicColors) {
                    var options = {
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

                    var chart = new ApexCharts(
                        document.querySelector("#store-visits-source"),
                        options
                    );
                    chart.render();
                }

                var swiper = new Swiper(".selling-product", {
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
                    var ampm = new Date().getHours() >= 12 ? "pm" : "am";
                    var hour =
                        new Date().getHours() > 12 ?
                            new Date().getHours() % 12 :
                            new Date().getHours();
                    var minute =
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

                optionGroupSelect.closest('.related-widget-wrapper').parentElement.parentElement.classList.toggle('d-none');
                const showOptionGroup = value === 'option' || value === 'multi_option';

                if (showOptionGroup) {
                    optionGroupSelect.required = true;
                } else {
                    optionGroupSelect.required = false;
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
        initWidgets: function (el) {
            o.dashboard.initDatePickers(el);
            o.dashboard.initMasks(el);
            o.dashboard.initProductImages(el);
        },
    };

    return o;

})(oscar || {});
