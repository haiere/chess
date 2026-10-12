/* App shell — hash router, navigation (top bar desktop / bottom bar
   mobile), Settings page bindings, module bootstrapping. */
(function () {
    'use strict';
    const S = window.AppStorage;
    const $ = (id) => document.getElementById(id);
    const PAGES = ['main', 'puzzle', 'learn', 'settings', 'about'];

    function route() {
        const hash = (location.hash || '#main').slice(1);
        const page = PAGES.includes(hash) ? hash : 'main';
        for (const p of PAGES) {
            const el = $('page-' + p);
            if (el) el.classList.toggle('hidden', p !== page);
        }
        document.querySelectorAll('[data-nav]').forEach(a => {
            const active = a.dataset.nav === page;
            a.classList.toggle('active', active);
            if (active) a.setAttribute('aria-current', 'page');
            else a.removeAttribute('aria-current');
        });
        document.title = 'Chess — ' + page.charAt(0).toUpperCase() + page.slice(1);
    }

    function syncSettings() {
        $('setTheme').value = S.get('theme', 'system');
        $('setBoardTheme').value = S.get('boardTheme', 'classic');
        $('setSound').value = S.get('sound', true) ? 'on' : 'off';
        $('setCoords').value = S.get('coords', true) ? 'on' : 'off';
    }

    function bindSettings() {
        $('setTheme').addEventListener('change', (e) => window.GameMode.applyTheme(e.target.value));
        $('setBoardTheme').addEventListener('change', (e) => window.GameMode.applyBoardTheme(e.target.value));
        $('setSound').addEventListener('change', (e) => {
            window.GameMode.soundEnabled = e.target.value === 'on';
            window.GameMode.syncSettingsUI();
        });
        $('setCoords').addEventListener('change', (e) => {
            window.GameMode.showCoordinates = e.target.value === 'on';
            window.PuzzleMode.refreshCoords();
        });
        $('btnResetAll').addEventListener('click', () => {
            if (!confirm('Reset SEMUA data aplikasi (preferensi, progres puzzle, progres lesson)?')) return;
            window.AppStorage.clearAll();
            window.GameMode.toast(window.I18n.t('settings.resetToast'), 'success');
            setTimeout(() => location.reload(), 800);
        });
    }

    function bindLanguageSwitchers() {
        const top = $('langSwitcherTop');
        const settings = $('setLang');
        const sync = (value) => { if (top) top.value = value; if (settings) settings.value = value; };
        sync(window.I18n.lang);
        const onChange = (e) => window.I18n.setLang(e.target.value);
        if (top) top.addEventListener('change', onChange);
        if (settings) settings.addEventListener('change', onChange);
        window.I18n.onChange((l) => sync(l));
    }

    document.addEventListener('DOMContentLoaded', () => {
        window.GameMode.init();
        window.PuzzleMode.init();
        window.LessonsMode.init();
        window.I18n.apply(document);
        syncSettings();
        bindSettings();
        bindLanguageSwitchers();
        window.I18n.onChange(() => {
            window.GameMode.rerender();
            window.PuzzleMode.rerender();
            window.LessonsMode.rerender();
        });
        window.addEventListener('hashchange', route);
        route();
    });
})();
