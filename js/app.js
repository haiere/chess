/* App shell — hash router, navigation (top bar on desktop, bottom bar
   on mobile), Settings page, About page, and module bootstrapping. */
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
            window.GameMode.toast('Semua data direset — memuat ulang...', 'success');
            setTimeout(() => location.reload(), 800);
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        window.GameMode.init();
        window.PuzzleMode.init();
        window.LessonsMode.init();
        syncSettings();
        bindSettings();
        window.addEventListener('hashchange', route);
        route();
    });
})();
 
