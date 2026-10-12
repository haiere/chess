/* ============================================================
   AppStorage — safe localStorage wrapper with in-memory fallback.
   Keys are prefixed with "chess:". Exposed as window.AppStorage.
   ============================================================ */
(function () {
    'use strict';

    const PREFIX = 'chess:';
    const memory = new Map();
    let available = null;

    function check() {
        if (available !== null) return available;
        try {
            const k = '__chess_probe__';
            window.localStorage.setItem(k, '1');
            window.localStorage.removeItem(k);
            available = true;
        } catch (err) {
            available = false;
        }
        return available;
    }

    const AppStorage = {
        /** Returns true when persistent storage is available. */
        isPersistent: check,

        /**
         * Read and JSON-parse a value.
         * @param {string} key storage key (without prefix)
         * @param {*} fallback value returned on miss or corruption
         */
        get(key, fallback = null) {
            try {
                const raw = check()
                    ? window.localStorage.getItem(PREFIX + key)
                    : memory.get(PREFIX + key);
                return raw != null ? JSON.parse(raw) : fallback;
            } catch (err) {
                return fallback;
            }
        },

        /** JSON-serialize and store a value. Failures are swallowed. */
        set(key, value) {
            try {
                const raw = JSON.stringify(value);
                if (check()) window.localStorage.setItem(PREFIX + key, raw);
                else memory.set(PREFIX + key, raw);
            } catch (err) { /* quota or serialization error — ignore */ }
        },

        /** Remove a single key. */
        remove(key) {
            try {
                if (check()) window.localStorage.removeItem(PREFIX + key);
                else memory.delete(PREFIX + key);
            } catch (err) { /* noop */ }
        },

        /** Remove every key the app has written. */
        clearAll() {
            try {
                const keys = check()
                    ? Object.keys(window.localStorage)
                    : Array.from(memory.keys());
                for (const k of keys) {
                    if (k.indexOf(PREFIX) === 0) {
                        if (check()) window.localStorage.removeItem(k);
                        else memory.delete(k);
                    }
                }
            } catch (err) { /* noop */ }
        }
    };

    window.AppStorage = AppStorage;
})();
