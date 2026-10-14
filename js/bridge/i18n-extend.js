(function () {
  "use strict";
  if (typeof window === "undefined") return;
  if (window.__I18nExtendV4) return;
  window.__I18nExtendV4 = true;

  const SUPP = {
    id: {
      puzzle: {
        statsLine: "Selesai: {solved} · Gagal: {failed} · Streak: {streak}",
        info: "Langkah {move} dari {total} · {side} melangkah",
        available: "{count} teka-teki tersedia",
        pick: "Pilih teka-teki",
        loading: "Memuat teka-teki...",
        completed: "Selesai!"
      },
      learning: {
        stepsCount: "{count} langkah",
        steps: "{count} langkah",
        done: "Selesai",
        completed: "Selesai"
      },
      common: { done: "Selesai", completed: "Selesai" }
    },
    en: {
      puzzle: {
        statsLine: "Solved: {solved} · Failed: {failed} · Streak: {streak}",
        info: "Move {move} of {total} · {side} to move",
        available: "{count} puzzles available",
        pick: "Select a puzzle",
        loading: "Loading puzzles...",
        completed: "Completed!"
      },
      learning: {
        stepsCount: "{count} steps",
        steps: "{count} steps",
        done: "Completed",
        completed: "Completed"
      },
      common: { done: "Done", completed: "Completed" }
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
    if (!tpl || typeof tpl !== "string") return tpl;
    if (!params) params = {};
    return tpl.replace(/\{(\w+)\}/g, (m, n) => {
      const v = params[n];
      return v === undefined || v === null ? "0" : String(v);
    });
  }

  function install() {
    const I18n = window.I18n;
    if (!I18n || typeof I18n.t !== "function") return false;
    if (I18n.__extendedV4) return true;

    const origT = I18n.t.bind(I18n);
    I18n.t = function (key, params) {
      const lang = I18n.getLang ? I18n.getLang() : "id";
      let val = getNested(SUPP[lang], key);
      if (val === undefined && lang !== "id") val = getNested(SUPP.id, key);
      if (val !== undefined) {
        if (typeof val === "string") {
          if (key.indexOf("statsLine") !== -1) {
            params = Object.assign({ solved: 0, failed: 0, streak: 0 }, params || {});
          }
          if (key.indexOf("stepsCount") !== -1 || key.indexOf("steps") !== -1) {
            params = Object.assign({ count: 0 }, params || {});
          }
          if (key.indexOf("puzzle.info") !== -1) {
            params = Object.assign({ move: 1, total: 1, side: "White" }, params || {});
          }
          return interpolate(val, params);
        }
        return val;
      }
      return origT(key, params);
    };
    I18n.__extendedV4 = true;
    console.info("[I18n-extend v4] terpasang.");
    return true;
  }

  if (!install()) {
    let tries = 0;
    const iv = setInterval(() => {
      tries++;
      if (install()) clearInterval(iv);
      if (tries > 50) clearInterval(iv);
    }, 100);
  }
})();
export {};
