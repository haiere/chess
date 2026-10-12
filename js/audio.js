/* ============================================================
   SFX — Web Audio oscillator sounds, no audio files required.
   Exposed as window.SFX. Audio never plays before a user gesture.
   ============================================================ */
(function () {
    'use strict';

    const VOLUME = 0.4;
    let ctx = null;
    let enabled = /* App shell — hash router, navigation (top bar desktop / bottom bar
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
;

    function getCtx() {
        try {
            if (!ctx) {
                const Ctor = window.AudioContext || window.webkitAudioContext;
                if (!Ctor) return null;
                ctx = new Ctor();
            }
            if (ctx.state === 'suspended') ctx.resume().catch(() => {});
            return ctx;
        } catch (err) {
            return null;
        }
    }

    function tone(freq, duration, type, vol) {
        if (!enabled) return;
        try {
            const ac = getCtx();
            if (!ac) return;
            const osc = ac.createOscillator();
            const gain = ac.createGain();
            osc.type = type || 'sine';
            osc.frequency.setValueAtTime(freq, ac.currentTime);
            gain.gain.setValueAtTime((vol || 0.3) * VOLUME, ac.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration);
            osc.connect(gain);
            gain.connect(ac.destination);
            osc.start(ac.currentTime);
            osc.stop(ac.currentTime + duration);
        } catch (err) { /* silent */ }
    }

    const SFX = {
        setEnabled(value) { enabled = !!value; },
        isEnabled() { return enabled; },

        play(type) {
            switch (type) {
                case 'move':      tone(600, 0.08, 'sine', 0.2); break;
                case 'capture':   tone(200, 0.15, 'triangle', 0.35); break;
                case 'check':
                    tone(800, 0.15, 'square', 0.35);
                    setTimeout(() => tone(1000, 0.2, 'square', 0.35), 150);
                    break;
                case 'castle':
                    tone(500, 0.1, 'sine', 0.25);
                    setTimeout(() => tone(700, 0.1, 'sine', 0.25), 100);
                    break;
                case 'promote':   tone(900, 0.2, 'sine', 0.3); break;
                case 'game-over':
                    tone(400, 0.3, 'triangle', 0.4);
                    setTimeout(() => tone(300, 0.3, 'triangle', 0.4), 300);
                    setTimeout(() => tone(200, 0.5, 'triangle', 0.4), 600);
                    break;
                case 'success':
                    tone(660, 0.12, 'sine', 0.3);
                    setTimeout(() => tone(880, 0.18, 'sine', 0.3), 120);
                    break;
                case 'error':     tone(180, 0.2, 'sawtooth', 0.25); break;
            }
        }
    };

    window.SFX = SFX;
})();
