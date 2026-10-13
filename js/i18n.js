/**
 * i18n.js — Bilingual translation engine
 * Default & fallback: "id". Supported: "id", "en".
 * Storage key: "lang" (via AppStorage).
 *
 * Public API:
 *   I18n.init()               — inisialisasi (panggil sekali di app.js)
 *   I18n.t(key, params)       — translate, support interpolasi {name}
 *   I18n.setLang(lang)        — ganti bahasa + persist + emit event
 *   I18n.getLang()            — bahasa aktif saat ini
 *   I18n.getAvailable()       — daftar bahasa yang didukung
 *   I18n.applyToDOM(root)     — scan [data-i18n] dan isi teks
 *   I18n.onChange(cb)         — subscribe event ganti bahasa
 *
 * Attribute yang didukung di HTML:
 *   data-i18n="key"                 → textContent
 *   data-i18n-attr="aria-label:key" → setAttribute("aria-label", t("key"))
 *   data-i18n-attr="placeholder:key,title:key2" → multi attribute
 */
(function (global) {
  "use strict";

  var DEFAULT_LANG = "id";
  var FALLBACK_LANG = "id";
  var SUPPORTED = ["id", "en"];
  var STORAGE_KEY = "lang";
  var HTML_LANG_MAP = { id: "id", en: "en" };

  var currentLang = DEFAULT_LANG;
  var listeners = [];
  var locales = {}; // { id: {...}, en: {...} }

  function safeStorageGet(key) {
    try {
      if (global.AppStorage && typeof global.AppStorage.get === "function") {
        return global.AppStorage.get(key);
      }
      return global.localStorage ? global.localStorage.getItem("chess:" + key) : null;
    } catch (e) {
      return null;
    }
  }

  function safeStorageSet(key, value) {
    try {
      if (global.AppStorage && typeof global.AppStorage.set === "function") {
        global.AppStorage.set(key, value);
        return;
      }
      if (global.localStorage) {
        global.localStorage.setItem("chess:" + key, value);
      }
    } catch (e) {
      /* silently ignore — storage bisa diblokir */
    }
  }

  /**
   * Deteksi bahasa awal:
   *  1) preferensi tersimpan
   *  2) bahasa browser (jika didukung)
   *  3) fallback "id"
   */
  function detectInitialLang() {
    var saved = safeStorageGet(STORAGE_KEY);
    if (saved && SUPPORTED.indexOf(saved) !== -1) return saved;

    var nav = global.navigator || {};
    var candidates = [];
    if (Array.isArray(nav.languages)) candidates = candidates.concat(nav.languages);
    if (nav.language) candidates.push(nav.language);

    for (var i = 0; i < candidates.length; i++) {
      var code = String(candidates[i] || "").toLowerCase().split("-")[0];
      if (SUPPORTED.indexOf(code) !== -1) return code;
    }
    return DEFAULT_LANG;
  }

  /**
   * Ambil nilai nested dari object berdasarkan dot-path.
   * "game.undo" → locales[lang].game.undo
   */
  function getNested(obj, path) {
    if (!obj || !path) return undefined;
    var parts = path.split(".");
    var cur = obj;
    for (var i = 0; i < parts.length; i++) {
      if (cur == null || typeof cur !== "object") return undefined;
      cur = cur[parts[i]];
    }
    return cur;
  }

  /**
   * Interpolasi: "Puzzle {current} dari {total}" + {current:1,total:5}
   */
  function interpolate(template, params) {
    if (!params || typeof template !== "string") return template;
    return template.replace(/\{(\w+)\}/g, function (match, name) {
      return Object.prototype.hasOwnProperty.call(params, name)
        ? String(params[name])
        : match;
    });
  }

  function warnMissing(key) {
    if (global.console && console.warn) {
      console.warn("[i18n] Missing key:", key, "lang:", currentLang);
    }
  }

  var I18n = {
    DEFAULT_LANG: DEFAULT_LANG,
    FALLBACK_LANG: FALLBACK_LANG,

    init: function (options) {
      options = options || {};
      if (options.locales) {
        locales = options.locales;
      } else if (global.LOCALES && typeof global.LOCALES === "object") {
        locales = global.LOCALES;
      } else {
        locales = {};
      }

      currentLang = options.forceLang || detectInitialLang();
      if (SUPPORTED.indexOf(currentLang) === -1) currentLang = FALLBACK_LANG;

      I18n.applyLangAttribute();
      I18n.applyToDOM();
      return I18n;
    },

    getLang: function () {
      return currentLang;
    },

    getAvailable: function () {
      return SUPPORTED.slice();
    },

    /**
     * Translate key. Fallback berlapis:
     *   currentLang → FALLBACK_LANG → key itu sendiri (jangan crash)
     */
    t: function (key, params) {
      var value = getNested(locales[currentLang], key);
      if (value === undefined && currentLang !== FALLBACK_LANG) {
        value = getNested(locales[FALLBACK_LANG], key);
      }
      if (value === undefined) {
        warnMissing(key);
        return key;
      }
      if (typeof value !== "string") return value;
      return interpolate(value, params);
    },

    setLang: function (lang) {
      if (SUPPORTED.indexOf(lang) === -1) lang = FALLBACK_LANG;
      if (lang === currentLang) return I18n;

      currentLang = lang;
      safeStorageSet(STORAGE_KEY, lang);
      I18n.applyLangAttribute();
      I18n.applyToDOM();

      for (var i = 0; i < listeners.length; i++) {
        try {
          listeners[i](lang);
        } catch (e) {
          if (global.console && console.error) console.error(e);
        }
      }
      return I18n;
    },

    /**
     * Scan seluruh DOM untuk [data-i18n] dan [data-i18n-attr] lalu isi.
     * Aman dipanggil berulang.
     */
    applyToDOM: function (root) {
      var scope = root || global.document;
      if (!scope || !scope.querySelectorAll) return;

      // data-i18n → textContent
      var nodes = scope.querySelectorAll("[data-i18n]");
      for (var i = 0; i < nodes.length; i++) {
        var el = nodes[i];
        var key = el.getAttribute("data-i18n");
        if (key) el.textContent = I18n.t(key);
      }

      // data-i18n-attr="aria-label:key,placeholder:key2"
      var attrNodes = scope.querySelectorAll("[data-i18n-attr]");
      for (var j = 0; j < attrNodes.length; j++) {
        var el2 = attrNodes[j];
        var spec = el2.getAttribute("data-i18n-attr");
        if (!spec) continue;
        var pairs = spec.split(",");
        for (var k = 0; k < pairs.length; k++) {
          var pair = pairs[k].split(":");
          if (pair.length !== 2) continue;
          var attrName = pair[0].trim();
          var attrKey = pair[1].trim();
          if (attrName && attrKey) el2.setAttribute(attrName, I18n.t(attrKey));
        }
      }
    },

    applyLangAttribute: function () {
      if (global.document && global.document.documentElement) {
        global.document.documentElement.setAttribute(
          "lang",
          HTML_LANG_MAP[currentLang] || "id"
        );
      }
    },

    onChange: function (cb) {
      if (typeof cb === "function") listeners.push(cb);
      return function unsubscribe() {
        var idx = listeners.indexOf(cb);
        if (idx !== -1) listeners.splice(idx, 1);
      };
    }
  };

  global.I18n = I18n;
})(typeof window !== "undefined" ? window : this);
