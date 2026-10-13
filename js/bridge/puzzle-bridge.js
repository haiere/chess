/**
 * puzzle-bridge.js — Adapter HTML puzzle (#puzzle-board, #btn-puzzle-*)
 * ke modul PuzzleMode yang sudah ada.
 */
(function (global) {
  "use strict";

  var MOUNTED = false;
  var instance = null;

  function $(id) { return document.getElementById(id); }
  function safe(label, fn) {
    try { return fn(); }
    catch (e) {
      if (global.console) console.warn("[PuzzleBridge] " + label + " gagal:", e);
      return null;
    }
  }

  function showPlaceholder(msg) {
  var c = $("puzzle-board-container") || $("puzzle-board");
  if (!c) return;
  c.innerHTML = '<div class="app-placeholder" role="status">' + msg + "</div>";
  }

  function detectPuzzleApi() {
    var api = {};
    if (global.PuzzleMode) api.PuzzleMode = global.PuzzleMode;
    else if (global.Puzzle && typeof global.Puzzle === "object") api.PuzzleMode = global.Puzzle;
    if (global.PuzzleProvider) api.PuzzleProvider = global.PuzzleProvider;
    return api;
  }

  function initPuzzleMode(api, boardContainer) {
    if (!api.PuzzleMode) return null;

    var attempts = [
      function () {
        return api.PuzzleMode.init({
          board: boardContainer,
          onStatus: onStatus,
          onProgress: onProgress,
          onStats: onStats
        });
      },
      function () { return api.PuzzleMode.init(boardContainer); },
      function () { return api.PuzzleMode.init(); },
      function () { return new api.PuzzleMode({ board: boardContainer }); }
    ];

    for (var i = 0; i < attempts.length; i++) {
      var r = safe("PuzzleMode.init#" + i, attempts[i]);
      if (r) return r;
    }
    return null;
  }

  function onStatus(status) {
    var el = $("puzzle-status");
    if (!el) return;
    var I18n = global.I18n;
    var key = typeof status === "string" ? status : (status && status.key) || "inProgress";
    var fullKey = key.indexOf("puzzle.") === 0 ? key : "puzzle." + key;
    el.textContent = I18n ? I18n.t(fullKey) : fullKey;
  }

  function onProgress(progress) {
    var el = $("puzzle-progress");
    if (!el || !progress) return;
    var I18n = global.I18n;
    el.textContent = I18n
      ? I18n.t("puzzle.progress", { current: progress.current, total: progress.total })
      : progress.current + "/" + progress.total;
  }

  function onStats(stats) {
    if (!stats) return;
    // Stats opsional, tidak wajib ada elemen di HTML awal
  }

  function bindButton(id, actionName) {
    var btn = $(id);
    if (!btn || btn.__bridgeBound) return;
    btn.__bridgeBound = true;
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      var fn = instance && instance[actionName];
      if (typeof fn === "function") {
        safe(actionName, function () { fn.call(instance); });
      } else if (global.PuzzleMode && typeof global.PuzzleMode[actionName] === "function") {
        safe(actionName, function () { global.PuzzleMode[actionName](); });
      } else {
        if (global.console) console.warn("[PuzzleBridge] aksi tidak tersedia:", actionName);
      }
    });
  }

  function bindButtons() {
    bindButton("btn-puzzle-hint", "hint");
    bindButton("btn-puzzle-retry", "retry");
    bindButton("btn-puzzle-next", "next");
    bindButton("btn-puzzle-solution", "showSolution");
    bindButton("btn-puzzle-reset", "reset");

    var diff = $("puzzle-difficulty");
    if (diff && !diff.__bridgeBound) {
      diff.__bridgeBound = true;
      diff.addEventListener("change", function (e) {
        var fn = instance && instance.setDifficulty;
        if (typeof fn === "function") {
          safe("setDifficulty", function () { fn.call(instance, e.target.value); });
        } else if (global.PuzzleMode && typeof global.PuzzleMode.setDifficulty === "function") {
          safe("setDifficulty", function () { global.PuzzleMode.setDifficulty(e.target.value); });
        }
      });
    }
  }

  var PuzzleBridge = {
    init: function () {
      if (MOUNTED) return instance;
      MOUNTED = true;

      var container = $("puzzle-board") || $("puzzle-board-container");
      if (!container) return null;

      var api = detectPuzzleApi();
      if (!api.PuzzleMode) {
        showPlaceholder(
          container,
          "Modul teka-teki belum tersedia. " +
          "Pastikan <code>js/puzzle.js</code> dimuat sebelum bridge."
        );
        bindButtons();
        return null;
      }

      instance = initPuzzleMode(api, container);
      bindButtons();
      if (global.console && console.info) console.info("[PuzzleBridge] siap.");
      return instance;
    },
    getInstance: function () { return instance; },
    _reset: function () { MOUNTED = false; instance = null; }
  };

  global.PuzzleBridge = PuzzleBridge;
})(typeof window !== "undefined" ? window : this);
