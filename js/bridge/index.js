/**
 * bridge/index.js — Bootstrap semua bridge setelah DOM siap.
 * Dipanggil dari bootstrap inline di index.html.
 *
 * Setiap bridge di-init saat halaman terkait pertama kali dibuka
 * (lazy init) agar tidak membebani first paint.
 */
(function (global) {
  "use strict";

  var INITIALIZED = {
    game: false,
    puzzle: false,
    learn: false
  };

  function safe(label, fn) {
    try { return fn(); }
    catch (e) {
      if (global.console) console.warn("[bridge] " + label + " gagal:", e);
    }
  }

  function initForRoute(route) {
    if (route === "game" && !INITIALIZED.game) {
      INITIALIZED.game = true;
      safe("GameBridge.init", function () {
        global.GameBridge && global.GameBridge.init();
      });
    }
    if (route === "puzzle" && !INITIALIZED.puzzle) {
      INITIALIZED.puzzle = true;
      safe("PuzzleBridge.init", function () {
        global.PuzzleBridge && global.PuzzleBridge.init();
      });
    }
    if (route === "learn" && !INITIALIZED.learn) {
      INITIALIZED.learn = true;
      safe("LearnBridge.init", function () {
        global.LearnBridge && global.LearnBridge.init();
      });
    }
  }

  function bindSettings() {
    var themeSel = document.getElementById("setting-theme");
    if (themeSel && !themeSel.__bridgeBound) {
      themeSel.__bridgeBound = true;
      themeSel.addEventListener("change", function (e) {
        var val = e.target.value;
        var root = document.documentElement;
        document.body.setAttribute("data-theme", val === "system"
          ? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
          : val);
        try {
          if (global.AppStorage && AppStorage.set) AppStorage.set("theme", val);
          else if (global.localStorage) localStorage.setItem("chess:theme", val);
        } catch (err) { /* ignore */ }
      });
    }

    var boardSel = document.getElementById("setting-board-theme");
    if (boardSel && !boardSel.__bridgeBound) {
      boardSel.__bridgeBound = true;
      boardSel.addEventListener("change", function (e) {
        document.documentElement.setAttribute("data-board-theme", e.target.value);
        try {
          if (global.AppStorage && AppStorage.set) AppStorage.set("boardTheme", e.target.value);
          else if (global.localStorage) localStorage.setItem("chess:boardTheme", e.target.value);
        } catch (err) { /* ignore */ }
      });
    }

    var resetBtn = document.getElementById("btn-reset-all");
    if (resetBtn && !resetBtn.__bridgeBound) {
      resetBtn.__bridgeBound = true;
      resetBtn.addEventListener("click", function () {
        var I18n = global.I18n;
        var msg = I18n ? I18n.t("settings.resetConfirm") : "Reset all settings?";
        if (!confirm(msg)) return;
        try {
          if (global.AppStorage && AppStorage.clear) AppStorage.clear();
          else if (global.localStorage) {
            Object.keys(localStorage)
              .filter(function (k) { return k.indexOf("chess:") === 0; })
              .forEach(function (k) { localStorage.removeItem(k); });
          }
        } catch (err) { /* ignore */ }
        location.reload();
      });
    }
  }

  function restoreBoardTheme() {
    try {
      var saved = null;
      if (global.AppStorage && AppStorage.get) saved = AppStorage.get("boardTheme");
      else if (global.localStorage) saved = localStorage.getItem("chess:boardTheme");
      if (saved) document.documentElement.setAttribute("data-board-theme", saved);
    } catch (e) { /* ignore */ }
  }

  function boot() {
    restoreBoardTheme();
    bindSettings();
    document.addEventListener("route:change", function (e) {
      if (e && e.detail && e.detail.route) initForRoute(e.detail.route);
    });
    // Init halaman awal
    var initialRoute = (location.hash || "#game").replace(/^#\/?/, "") || "game";
    initForRoute(initialRoute);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  global.Bridge = {
    initForRoute: initForRoute,
    _reset: function () {
      INITIALIZED = { game: false, puzzle: false, learn: false };
    }
  };
})(typeof window !== "undefined" ? window : this);
