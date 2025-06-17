var oscar = ((o) => {
    'use strict';

    o.template = {
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
                const formatted = now.toLocaleDateString(o.options["languageCode"], clockOptions);

                document.getElementById('current-time').textContent = formatted;
            };

            // Update immidiately
            updateDateTime();

            // Update each minute
            setInterval(updateDateTime, 60000);
        },
        initActiveMenu: () => {
            const currentPath = location.pathname;
            const headerLinks = document.getElementById("navigation-menu").querySelectorAll("a.nav-link");

            let matchedLink = null;
            let maxMatchLength = 0; // To get closest url

            headerLinks.forEach(link => {
                const href = link.getAttribute('href');

                if (href && currentPath.includes(href) && href.length > maxMatchLength) {
                    matchedLink = link;
                    maxMatchLength = href.length;
                }
            });

            if (matchedLink) {
                matchedLink.classList.add("active");
                const parentCollapseDiv = a.closest(".dropdown-menu");
                if (parentCollapseDiv) {
                    if (parentCollapseDiv.parentElement) {
                        parentCollapseDiv.parentElement.children[0].classList.add("active");
                        if (parentCollapseDiv.parentElement.parentElement.parentElement) {
                            parentCollapseDiv.parentElement.parentElement.parentElement.children[0].classList.add("active");
                            if (parentCollapseDiv.parentElement.parentElement.parentElement.parentElement.parentElement) {
                                parentCollapseDiv.parentElement.parentElement.parentElement.parentElement.parentElement.children[0].classList.add("active");
                                if (parentCollapseDiv.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement) {
                                    parentCollapseDiv.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.children[0].classList.add("active");
                                }
                            }
                        }
                    }
                }
            }
        },
        windowLoadContent: () => {
            window.addEventListener("load", function () {
                o.template.initActiveMenu();
            });
        },
        initMenuItemScroll: () => {
            const sidebarMenu = document.getElementById('navbarContent');
            sidebarMenu.addEventListener('show.bs.offcanvas', () => {
                if (sidebarMenu.querySelector(".nav-link.active")) {
                    const activeMenu = sidebarMenu.querySelector(".nav-link.active").offsetTop;
                    sidebarMenu.scrollTop = activeMenu;
                }
            });
        },
        scrollToTop: () => {
            if (o.backToTopButton) {
                // When the user scrolls down 20px from the top of the document, show the button
                window.addEventListener('scroll', function () {
                    scrollFunction();
                });

                mybutton.addEventListener('click', topFunction);

                function scrollFunction () {
                    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
                        mybutton.style.display = "block";
                    } else {
                        mybutton.style.display = "none";
                    }
                }
                // When the user clicks on the button, scroll to the top of the document
                function topFunction () {
                    document.body.scrollTop = 0;
                    document.documentElement.scrollTop = 0;
                }
            }
        },
        windowScroll: () => {
            window.addEventListener('scroll', function (ev) {
                ev.preventDefault();
                const navbar = document.getElementById("navbar");
                if (navbar) {
                    if (document.body.scrollTop >= 50 || document.documentElement.scrollTop >= 50) {
                        navbar.classList.add("is-sticky");
                    } else {
                        navbar.classList.remove("is-sticky");
                    }
                }
            });
        },
        init: () => {
            o.backToTopButton = document.getElementById("back-to-top");

            o.template.initClock();
            o.template.windowLoadContent();
            o.template.initMenuItemScroll();
            o.template.windowScroll();
            o.template.scrollToTop();
        }
    };

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

    // Site-wide forms events
    o.forms = {
        init: function () {
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

                if (form.dataset.behaviours.includes('lock')) {
                    form.addEventListener('submit', (e) => {
                        if (form.dataset.locked === 'true') {
                            e.preventDefault();
                            return false;
                        } else {
                            form.dataset.locked = 'true';
                        }
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

    o.init = function (options) {
        // Run initialisation that should take place on every page of the dashboard.
        const defaults = {

        };
        o.options = Object.assign({}, defaults, options);

        o.forms.init();
        o.template.init();
    };

    return o;

})(oscar || {});
