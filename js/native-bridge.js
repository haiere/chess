(function () {
    'use strict';
    if (!window.Capacitor || !window.Capacitor.isNativePlatform || !window.Capacitor.isNativePlatform()) return;
    function currentTheme() { return document.documentElement.getAttribute('data-theme') || 'dark'; }
    async function setup() {
        try {
            const sb = await import('../vendor/status-bar/index.js');
            const { StatusBar, Style } = sb;
            const apply = () => {
                const dark = currentTheme() === 'dark';
                StatusBar.setStyle({ style: dark ? Style.Dark : Style.Light }).catch(() => {});
                StatusBar.setBackgroundColor({ color: dark ? '#0f1117' : '#f4f5f8' }).catch(() => {});
            };
            apply();
            new MutationObserver(apply).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
        } catch (e) { console.warn('status-bar unavailable', e); }
        try {
            const { App } = await import('../vendor/core/index.js');
            App.addListener('backButton', () => {
                if ((location.hash || '#main') !== '#main' && history.length > 1) history.back();
                else App.exitApp();
            });
        } catch (e) { /* noop */ }
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup);
    else setup();
})();
