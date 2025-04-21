/*
 * Code in this file adapted from Django's admin app
 * Original source: django/contrib/admin/static/admin/js/admin/RelatedObjectLookups.js
 *
 * Updated to remove jQuery dependencies and modernized for Bootstrap 5
 */

// Handles related-objects functionality: Add Another links.

var oscar = ((o) => {
    'use strict';

    // Function copied from Django's JavaScript translation catalog library
    o.interpolate = function (fmt, obj, named) {
        if (named) {
            return fmt.replace(/%\(\w+\)s/g, function (match) {
                return String(obj[match.slice(2, -2)]);
            });
        } else {
            return fmt.replace(/%s/g, function () {
                return String(obj.shift());
            });
        }
    };

    // IE doesn't accept periods or dashes in the window name, but the element IDs
    // we use to generate popup window names may contain them, therefore we map them
    // to allowed characters in a reversible way so that we can locate the correct
    // element when the popup window is dismissed.
    o.id_to_windowname = function (text) {
        text = text.replace(/\./g, '__dot__');
        text = text.replace(/-/g, '__dash__');
        return text;
    };

    o.windowname_to_id = function (text) {
        text = text.replace(/__dot__/g, '.');
        text = text.replace(/__dash__/g, '-');
        return text;
    };

    o.showDashboardPopup = function (triggeringLink, nameRegexp, addPopup) {
        const name = triggeringLink.id.replace(nameRegexp, '');
        const windowName = o.id_to_windowname(name);
        let href = triggeringLink.href;

        if (addPopup) {
            href += href.indexOf('?') === -1 ? '?_popup=1' : '&_popup=1';
        }

        const win = window.open(href, windowName, 'height=500,width=800,resizable=yes,scrollbars=yes');
        win.focus();
        return false;
    };

    o.showRelatedObjectPopup = function (triggeringLink) {
        return o.showDashboardPopup(triggeringLink, /^(update|create|delete)_/, false);
    };

    o.updateRelatedObjectLinks = function (triggeringLink) {
        const siblings = Array.from(triggeringLink.parentNode.children)
            .filter(el => el !== triggeringLink &&
                (el.classList.contains('change-related') || el.classList.contains('delete-related')));

        if (!siblings.length) return;

        const value = triggeringLink.value;

        if (value) {
            siblings.forEach(sibling => {
                const template = sibling.getAttribute('data-href-template');
                if (template) {
                    sibling.href = template.replace('__fk__', value);
                }
            });
        } else {
            siblings.forEach(sibling => {
                sibling.removeAttribute('href');
            });
        }
    };

    o.dismissAddRelatedObjectPopup = function (win, newId, newRepr) {
        const name = o.windowname_to_id(win.name);
        const elem = document.getElementById(name);

        if (!elem) return;

        const elemName = elem.nodeName.toUpperCase();

        if (elemName === 'SELECT') {
            const option = document.createElement('option');
            option.value = newId;
            option.text = newRepr;
            option.selected = true;
            elem.appendChild(option);
        }

        // Trigger a change event to update related links if required
        const event = new Event('change', { bubbles: true });
        elem.dispatchEvent(event);

        win.close();
    };

    o.dismissChangeRelatedObjectPopup = function (win, objId, newRepr, newId) {
        const id = o.windowname_to_id(win.name).replace(/^change_/, '');
        const selectorsToUpdate = [`#${ id }`, `#${ id }_from`, `#${ id }_to`];

        selectorsToUpdate.forEach(selector => {
            const select = document.querySelector(selector);
            if (!select) return;

            Array.from(select.options).forEach(option => {
                if (option.value === objId) {
                    option.textContent = newRepr;
                    option.value = newId;
                }
            });

            // Trigger change event
            const event = new Event('change', { bubbles: true });
            select.dispatchEvent(event);
        });

        win.close();
    };

    o.dismissDeleteRelatedObjectPopup = function (win, objId) {
        const id = o.windowname_to_id(win.name).replace(/^delete_/, '');
        const selectorsToUpdate = [`#${ id }`, `#${ id }_from`, `#${ id }_to`];

        selectorsToUpdate.forEach(selector => {
            const select = document.querySelector(selector);
            if (!select) return;

            Array.from(select.options).forEach(option => {
                if (option.value === objId) {
                    option.remove();
                }
            });

            // Trigger change event
            const event = new Event('change', { bubbles: true });
            select.dispatchEvent(event);
        });

        win.close();
    };

    // Event delegation for related widget functionality
    document.addEventListener('DOMContentLoaded', function () {
        // Handle click on related links
        document.querySelectorAll('.related-widget-wrapper-link').forEach((link) => {
            link.addEventListener('click', function (e) {
                if (!link.href) return;

                e.preventDefault();
                // Create and dispatch custom event
                const customEvent = new CustomEvent('oscar:show-related', {
                    bubbles: true,
                    cancelable: true,
                    detail: { href: link.href }
                });

                link.dispatchEvent(customEvent);

                if (!customEvent.defaultPrevented) {
                    o.showRelatedObjectPopup(link);
                }
            }, true);
        });


        // Handle change on related selects
        document.querySelectorAll('.related-widget-wrapper select').forEach((select) => {
            select.addEventListener('change', function () {

                // Create and dispatch custom event
                const customEvent = new CustomEvent('oscar:update-related', {
                    bubbles: true,
                    cancelable: true
                });

                select.dispatchEvent(customEvent);

                if (!customEvent.defaultPrevented) {
                    o.updateRelatedObjectLinks(select);
                }
            });
        });

        // Initial update of all related selects
        document.querySelectorAll('.related-widget-wrapper select').forEach(select => {
            const event = new Event('change', { bubbles: true });
            select.dispatchEvent(event);
        });
    });

    return o;

})(oscar || {});
