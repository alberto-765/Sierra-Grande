'use strict';

// Place defautl theme to light
document.documentElement.dataset.theme = 'light';

document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('toggle-nav-sidebar');
    toggleBtn.classList = 'sidebar__hideBtn';
    toggleBtn.innerHTML = '<iconify-icon icon="mdi:home"></iconify-icon>';

    const nav = document.getElementById('nav-sidebar');
    nav.id = '';
    nav.classList = '';
});
