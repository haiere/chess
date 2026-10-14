/**
 * js/bridge/i18n-extend.js — v2.
 * Wrapper I18n.t() untuk:
 *   - Keys tambahan (statsLine, available, pick, stepsCount)
 *   - Default params (failed:0 dll) saat params undefined
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
        pick: "Pilih teka-teki",
        loading: "Memuat teka-teki...",
        completed: "Selesai!"
      },
      learning: {
        stepsCount: "{count} langkah",
        lessonProgress: "Progres: {done} dari {total}",
        completed: "Selesai",
        notStarted: "Belum Dimulai",
        inProgress: "Sedang Dipelajari"
      }
    },
    en: {
      puzzle: {
        statsLine: "Solved: {solved} · Failed: {failed} · Streak: {streak}",
        available: "{count} puzzles available",
        pick: "Select a puzzle",
        loading: "Loading puzzles...",
        completed: "Completed!"
      },
      learning: {
        stepsCount: "{count} steps",
        lessonProgress: "Progress: {done} of {total}",
        completed: "Completed",
        notStarted: "Not Started",
        inProgress: "In Progress"
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
    return tpl.replace(/\{(\w+)\}/g, (m, n) => {
      const v = params[n];
      if (v === undefined || v === null) return "0";
      return String(v);
    });
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
        if (typeof val === "string") {
          // Default params untuk stats keys
          if (key.indexOf("statsLine") !== -1) {
            params = Object.assign({ solved: 0, failed: 0, streak: 0 }, params || {});
          }
          return interpolate(val, params);
        }
        return val;
      }
      return origT(key, params);
    };
    I18n.__extended = true;
    console.info("[I18n-extend v2] Keys tambahan terpasang.");
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
