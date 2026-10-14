/**
 * js/bridge/i18n-extend.js — v3.
 * Tambah keys learning.done, learning.completed, dan lain-lain.
 */
(function () {
  "use strict";
  if (typeof window === "undefined") return;
  if (window.__I18nExtendV3) return;
  window.__I18nExtendV3 = true;

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
        steps: "{count} langkah",
        lessonProgress: "Progres: {done} dari {total}",
        completed: "Selesai",
        done: "Selesai",
        notStarted: "Belum Dimulai",
        inProgress: "Sedang Dipelajari",
        start: "Mulai",
        continue: "Lanjutkan",
        restart: "Ulangi",
        finish: "Selesaikan",
        tryAgain: "Coba Lagi",
        previous: "Sebelumnya",
        next: "Berikutnya"
      },
      common: {
        done: "Selesai",
        completed: "Selesai",
        loading: "Memuat..."
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
        steps: "{count} steps",
        lessonProgress: "Progress: {done} of {total}",
        completed: "Completed",
        done: "Completed",
        notStarted: "Not Started",
        inProgress: "In Progress",
        start: "Start",
        continue: "Continue",
        restart: "Restart",
        finish: "Finish",
        tryAgain: "Try Again",
        previous: "Previous",
        next: "Next"
      },
      common: {
        done: "Done",
        completed: "Completed",
        loading: "Loading..."
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
    if (I18n.__extendedV3) return true;

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
          return interpolate(val, params);
        }
        return val;
      }
      return origT(key, params);
    };
    I18n.__extendedV3 = true;
    console.info("[I18n-extend v3] Keys tambahan (learning, common) terpasang.");
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
