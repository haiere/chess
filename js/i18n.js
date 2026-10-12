/* ============================================================
   I18n — lightweight bilingual system (vanilla JS, no deps).
   - Source of truth: locales/id.json and locales/en.json
   - Loaded synchronously via window.LOCALES (js/locales.js,
     regenerate with: node tests/build-locales.mjs)
   - Default + fallback language: "id"
   - Persisted choice: AppStorage key "lang"
   - Missing key: falls back to "id", then returns the key
     itself (never throws, never crashes).
   Usage: I18n.t('game.undo') or I18n.t('puzzle.progress', {done:1,total:3})
   ============================================================ */
(function () {
    'use strict';

    const SUPPORTED = ['id', 'en'];
    const FALLBACK = 'id';
    const STORAGE_KEY = 'lang';

    let lang = detectInitial();
    const listeners = [];

    function detectInitial() {
        try {
            const stored = window.AppStorage.get(STORAGE_KEY, null);
            if (SUPPORTED.includes(stored)) return stored;
            const nav = ((navigator.languages && navigator.languages[0]) || navigator.language || 'id').toLowerCase();
            if (nav.indexOf('en') === 0) return 'en';
        } catch (e) { /* noop */ }
        return FALLBACK;
    }

    function dict(l) {
        const all = window.LOCALES || {};
        return all[l] || all[FALLBACK] || {};
    }

    function lookup(key, l) {
        let node = dict(l);
        for (const part of key.split('.')) {
            if (!node || typeof node !== 'object') return undefined;
            node = node[part];
        }
        return (typeof node === 'string') ? node : undefined;
    }

    /**
     * Translate a dotted key with optional {param} interpolation.
     * @param {string} key e.g. 'game.check'
     * @param {object} [params] e.g. { done: 1, total: 3 }
     * @returns {string} translated text (never throws)
     */
    function t(key, params) {
        if (typeof key !== 'string' || !key) return '';
        let str = lookup(key, lang);
        if (str === undefined) str = lookup(key, FALLBACK);
        if (str === undefined) return key; // safe fallback: raw key, app keeps running
        if (params) {
            str = str.replace(/\{(\w+)\}/g, (m, name) =>
                (params[name] !== undefined && params[name] !== null) ? String(params[name]) : m);
        }
        return str;
    }

    /** Re-apply data-i18n / data-i18n-aria attributes under root (default: whole document). */
    function apply(root) {
        const scope = root || document;
        scope.querySelectorAll('[data-i18n]').forEach(el => {
            el.textContent = t(el.getAttribute('data-i18n'));
        });
        scope.querySelectorAll('[data-i18n-aria]').forEach(el => {
            el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria')));
        });
    }

    /** Switch language without page reload. Notifies all subscribers. */
    function setLang(next, silent) {
        if (!SUPPORTED.includes(next)) next = FALLBACK;
        if (next === lang) return;
        lang = next;
        try { window.AppStorage.set(STORAGE_KEY, lang); } catch (e) { /* noop */ }
        document.documentElement.setAttribute('lang', lang);
        if (!silent) {
            apply(document);
            listeners.forEach(cb => { try { cb(lang); } catch (e) { /* noop */ } });
        }
    }

    function onChange(cb) { listeners.push(cb); }

    document.documentElement.setAttribute('lang', lang);

    window.I18n = {
        t, apply, setLang, onChange,
        get lang() { return lang; },
        get supported() { return SUPPORTED.slice(); },
        FALLBACK
    };
})();
