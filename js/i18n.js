/**
 * i18n — Internasionalisasi Hajir Chess.
 * Default bahasa: English. Data terjemahan: js/i18n-data.js (digenerate dari locales/*.json).
 * Fallback aman: tidak pernah menampilkan key mentah.
 */
import { LOCALES } from './i18n-data.js';

const STORAGE_KEY = 'chess:lang';
const SUPPORTED = ['id', 'en'];
const DEFAULT_LANG = 'en';

export { LOCALES };

// ---------------------------------------------------------------------------
// Engine

function detectInitialLang() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && SUPPORTED.includes(saved)) return saved;
  } catch (_) {}
  return DEFAULT_LANG; // English bawaan; Bahasa Indonesia hanya bila dipilih user
}

function lookup(locale, path) {
  const parts = path.split('.');
  let node = locale;
  for (const p of parts) {
    if (node && typeof node === 'object' && p in node) node = node[p];
    else return undefined;
  }
  return typeof node === 'string' ? node : undefined;
}

function interpolate(str, params) {
  if (!params) return str;
  return str.replace(/\{(\w+)\}/g, (m, k) =>
    Object.prototype.hasOwnProperty.call(params, k) ? String(params[k]) : m
  );
}

function humanize(key) {
  const last = String(key).split('.').pop() || '';
  const spaced = last.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[_-]+/g, ' ');
  if (!spaced) return '';
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

class I18n {
  constructor() {
    this.lang = detectInitialLang();
    this.listeners = new Set();
    this._applyLangAttr();
    if (typeof document !== 'undefined') {
      if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => this.translateDom());
      else this.translateDom();
    }
  }

  /* Terjemahkan semua elemen [data-i18n]. Dipanggil saat load dan saat bahasa berubah. */
  translateDom(root) {
    if (typeof document === 'undefined') return;
    const scope = root || document;
    scope.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (!key) return;
      if (!el.dataset.i18nSource) el.dataset.i18nSource = el.textContent;
      el.textContent = this.t(key, null, { defaultValue: el.dataset.i18nSource });
    });
    scope.querySelectorAll('[data-i18n-aria]').forEach(el => {
      const key = el.getAttribute('data-i18n-aria');
      if (key) el.setAttribute('aria-label', this.t(key, null, { defaultValue: el.getAttribute('aria-label') || '' }));
    });
  }

  getLang() { return this.lang; }

  /* Kode bahasa yang didukung, dipakai LanguageSwitcher. */
  getAvailable() { return SUPPORTED.slice(); }

  setLang(lang) {
    if (!SUPPORTED.includes(lang) || lang === this.lang) return;
    this.lang = lang;
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (_) {}
    this._applyLangAttr();
    this.translateDom();
    this.emit();
  }

  onChange(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  emit() {
    for (const fn of this.listeners) {
      try { fn(this.lang); } catch (e) { console.error(e); }
    }
    if (typeof document !== 'undefined') {
      document.dispatchEvent(new CustomEvent('i18n:changed', { detail: { lang: this.lang } }));
    }
  }

  _applyLangAttr() {
    if (typeof document !== 'undefined' && document.documentElement) {
      document.documentElement.setAttribute('lang', this.lang);
    }
  }

  t(key, params, options) {
    if (!key) return '';
    const active = LOCALES[this.lang];
    let str = lookup(active, key);
    if (str === undefined) {
      const other = this.lang === 'id' ? 'en' : 'id';
      str = lookup(LOCALES[other], key);
    }
    if (str === undefined) {
      if (options && typeof options.defaultValue === 'string') return options.defaultValue;
      console.warn('[i18n] missing key:', key);
      return humanize(key);
    }
    return interpolate(str, params);
  }

  hasKey(key) {
    return lookup(LOCALES.id, key) !== undefined && lookup(LOCALES.en, key) !== undefined;
  }

  // Method kompatibel — main.js memanggilnya sebagai window.I18n.init()
  init() {
    this._applyLangAttr();
    this.translateDom();
    this.emit();
  }
}

export const i18n = new I18n();
export const t = (key, params, options) => i18n.t(key, params, options);
export const setLang = (lang) => i18n.setLang(lang);
export const getLang = () => i18n.getLang();

if (typeof window !== 'undefined') {
  window.I18n = {
    t,
    setLang,
    getLang,
    init:  () => i18n.init(),
    onChange: (fn) => i18n.onChange(fn),
    LOCALES
  };
      }
