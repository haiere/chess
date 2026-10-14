/**
 * js/bridge/i18n-extend.js — Extend I18n.t() dengan keys tambahan.
 * Tidak perlu mengedit i18n.js. Override aman dengan fallback ke original.
 */
(function () {
  "use strict";
  if (typeof window === "undefined") return;
  if (window.__I18nExtend) return;
  window.__I18nExtend = true;

  const SUPP = {
    id: {
      puzzle: {
        statsLine: "Selesai: {solved} · Gagal: {failed} · Streak: {streak}",
        available: "{count} teka-teki tersedia",
        pick: "Pilih teka-teki"
      },
      learning: {
        stepsCount: "{count} langkah"
      }
    },
    en: {
      puzzle: {
        statsLine: "Solved: {solved} · Failed: {failed} · Streak: {streak}",
        available: "{count} puzzles available",
        pick: "Select a puzzle"
      },
      learning: {
        stepsCount: "{count} steps"
      }
    }
  };

  function getNested(obj, path) {
    if (!obj || !path) return undefined;
    let cur = obj;
    for (const p of path.split(".")) {
      if (cur == null || typeof cur !== "object") return undefined;
      cur = cur[p];
    }
    return cur;
  }

  function interpolate(tpl, params) {
    if (!params || typeof tpl !== "string") return tpl;
    return tpl.replace(/\{(\w+)\}/g, (m, n) =>
      Object.prototype.hasOwnProperty.call(params, n) ? String(params[n]) : m
    );
  }

  function install() {
    const I18n = window.I18n;
    if (!I18n || typeof I18n.t !== "function") return false;
    if (I18n.__extended) return true;

    const origT = I18n.t.bind(I18n);
    I18n.t = function (key, params) {
      const lang = I18n.getLang ? I18n.getLang() : "id";
      let val = getNested(SUPP[lang], key);
      if (val === undefined && lang !== "id") val = getNested(SUPP.id, key);
      if (val !== undefined) {
        return typeof val === "string" ? interpolate(val, params) : val;
      }
      return origT(key, params);
    };
    I18n.__extended = true;
    console.info("[I18n-extend] Keys tambahan terpasang.");
    return true;
  }

  if (!install()) {
    let tries = 0;
    const iv = setInterval(() => {
      tries++;
      if (install()) clearInterval(iv);
      if (tries > 40) clearInterval(iv);
    }, 100);
  }
})();

export {};
