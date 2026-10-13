/**
 * game-bridge.js — v2 dengan placeholder fallback.
 * Perubahan utama: kalau GameMode ada tapi init gagal, placeholder tetap muncul.
 * Placeholder selalu render ke #board-container (bukan #board).
 */
(function (global) {
  "use strict";

  var MOUNTED = false, instance = null;
  function $(id) { return document.getElementById(id); }
  function safe(label, fn) {
    try { return fn(); } catch (e) {
      if (global.console) console.warn("[GameBridge] " + label + " gagal:", e);
      return null;
    }
  }
  function showPlaceholder(msg) {
    var c = $("board-container") || $("board");
    if (!c) return;
    c.innerHTML = '<div class="app-placeholder" role="status">' + msg + "</div>";
  }
  function detectApi() {
    var api = {};
    if (global.BoardView) api.BoardView = global.BoardView;
    else if (global.Board && typeof global.Board === "object") api.BoardView = global.Board;
    if (global.GameMode) api.GameMode = global.GameMode;
    else if (global.Game && typeof global.Game === "object") api.GameMode = global.Game;
    return api;
  }
  function tryInit(api, boardEl) {
    if (!api.GameMode) return null;
    var attempts = [
      function () { return api.GameMode.init({ board: boardEl, onStateChange: onState, onStatusChange: onStatus }); },
      function () { return api.GameMode.init(boardEl); },
      function () { return api.GameMode.init(); },
      function () { return new api.GameMode({ board: boardEl }); },
      function () { return new api.GameMode(boardEl); }
    ];
    for (var i = 0; i < attempts.length; i++) {
      var r = safe("GameMode.init#" + i, attempts[i]);
      if (r) return r;
    }
    return null;
  }
  function onState(state) { renderMoveHistory(state); updateStatus(state); }
  function onStatus(status) {
    var el = $("game-status");
    if (!el || !status) return;
    var key = typeof status === "string" ? status : (status.key || "yourTurn");
    el.textContent = global.I18n ? global.I18n.t("game." + key) : key;
  }
  function updateStatus(state) {
    var el = $("game-status");
    if (!el) return;
    var key = "game.yourTurn";
    if (state && state.turn) key = state.turn === "w" ? "game.whiteTurn" : "game.blackTurn";
    if (state && state.status) {
      var map = { check:"game.check", checkmate:"game.checkmate", stalemate:"game.stalemate", draw:"game.drawResult" };
      if (map[state.status]) key = map[state.status];
    }
    el.textContent = global.I18n ? global.I18n.t(key) : key;
  }
  function renderMoveHistory(state) {
    var list = $("move-history");
    if (!list || !state || !Array.isArray(state.moves)) return;
    list.innerHTML = "";
    for (var i = 0; i < state.moves.length; i++) {
      var li = document.createElement("li");
      li.textContent = state.moves[i];
      list.appendChild(li);
    }
  }
  function bindButton(id, actionName, opts) {
    var btn = $(id);
    if (!btn || btn.__bridgeBound) return;
    btn.__bridgeBound = true;
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      if (opts && typeof opts.confirmKey === "function") {
        var msg = opts.confirmKey();
        if (msg && !global.confirm(msg)) return;
      }
      var fn = instance && instance[actionName];
      if (typeof fn === "function") safe(actionName, function () { fn.call(instance); });
      else if (global.GameMode && typeof global.GameMode[actionName] === "function") safe(actionName, function () { global.GameMode[actionName](); });
      else if (global.console) console.warn("[GameBridge] aksi tidak tersedia:", actionName);
    });
  }
  function bindCopy(id, kind) {
    var btn = $(id);
    if (!btn || btn.__bridgeBound) return;
    btn.__bridgeBound = true;
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      var value = null;
      if (instance) {
        if (kind === "fen" && typeof instance.getFEN === "function") value = instance.getFEN();
        if (kind === "pgn" && typeof instance.getPGN === "function") value = instance.getPGN();
        if (kind === "fen" && typeof instance.exportFEN === "function") value = instance.exportFEN();
        if (kind === "pgn" && typeof instance.exportPGN === "function") value = instance.exportPGN();
      }
      if (!value && global.GameMode) {
        if (kind === "fen" && typeof global.GameMode.getFEN === "function") value = global.GameMode.getFEN();
        if (kind === "pgn" && typeof global.GameMode.getPGN === "function") value = global.GameMode.getPGN();
      }
      if (!value) return;
      copy(value).then(function () {
        toast(global.I18n ? global.I18n.t("toast.copied") : "Copied");
      }).catch(function () {
        toast(global.I18n ? global.I18n.t("toast.copyFailed") : "Copy failed");
      });
    });
  }
  function copy(text) {
    if (global.navigator && navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text);
    return new Promise(function (res, rej) {
      try {
        var ta = document.createElement("textarea");
        ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
        document.body.appendChild(ta); ta.select();
        var ok = document.execCommand("copy"); document.body.removeChild(ta);
        ok ? res() : rej(new Error("exec failed"));
      } catch (e) { rej(e); }
    });
  }
  function toast(msg) {
    var el = document.createElement("div");
    el.setAttribute("role", "status"); el.setAttribute("aria-live", "polite");
    el.textContent = msg;
    el.style.cssText = "position:fixed;left:50%;bottom:24px;transform:translateX(-50%);background:var(--app-surface);color:var(--app-text);border:1px solid var(--app-border);border-radius:8px;padding:10px 16px;font-size:.9rem;z-index:9999;box-shadow:0 4px 12px rgba(0,0,0,.15);transition:opacity .2s;";
    document.body.appendChild(el);
    setTimeout(function () {
      el.style.opacity = "0";
      setTimeout(function () { el.remove(); }, 220);
    }, 1800);
  }
  function bindButtons() {
    var t = global.I18n ? function (k) { return global.I18n.t(k); } : function (k) { return k; };
    bindButton("btn-new-game", "newGame", { confirmKey: function () { return t("game.restartConfirm"); } });
    bindButton("btn-undo", "undo");
    bindButton("btn-redo", "redo");
    bindButton("btn-flip", "flipBoard");
    bindButton("btn-resign", "resign", { confirmKey: function () { return t("game.resignConfirm"); } });
    bindCopy("btn-copy-fen", "fen");
    bindCopy("btn-copy-pgn", "pgn");
  }

  var GameBridge = {
    init: function () {
      if (MOUNTED) return instance;
      MOUNTED = true;
      var boardEl = $("board");
      if (!boardEl) {
        if (global.console) console.warn("[GameBridge] #board tidak ditemukan");
        return null;
      }
      var api = detectApi();
      if (!api.GameMode) {
        showPlaceholder("Modul permainan belum tersedia. Pastikan <code>js/game.js</code> dimuat sebelum bridge, dan mengekspos <code>window.GameMode</code>.");
        bindButtons();
        return null;
      }
      instance = tryInit(api, boardEl);
      if (!instance) {
        showPlaceholder("Modul permainan ada, tetapi gagal diinisialisasi. Buka Console untuk detail.");
        bindButtons();
        return null;
      }
      bindButtons();
      updateStatus(instance && instance.getState ? instance.getState() : null);
      if (global.I18n && global.I18n.onChange) {
        global.I18n.onChange(function () {
          updateStatus(instance && instance.getState ? instance.getState() : null);
        });
      }
      if (global.console && console.info) console.info("[GameBridge] siap.");
      return instance;
    },
    getInstance: function () { return instance; },
    _reset: function () { MOUNTED = false; instance = null; }
  };
  global.GameBridge = GameBridge;
})(typeof window !== "undefined" ? window : this);
