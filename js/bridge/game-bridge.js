/**
 * game-bridge.js — Adapter antara HTML baru (#board, #btn-*, #move-history)
 * dengan modul GameMode / BoardView yang sudah ada.
 *
 * Prinsip:
 *  - Tidak menyentuh logika aturan catur (engine.js tetap otoritas).
 *  - Feature-detect API. Kalau tidak ada, tampilkan placeholder ramah.
 *  - Semua elemen opsional; bridge skip kalau elemen tidak ada.
 *  - Aman dipanggil berulang (idempotent per elemen).
 */
(function (global) {
  "use strict";

  var MOUNTED = false;
  var instance = null;

  function $(id) { return document.getElementById(id); }

  function safe(label, fn) {
    try { return fn(); }
    catch (e) {
      if (global.console) console.warn("[GameBridge] " + label + " gagal:", e);
      return null;
    }
  }

  function showPlaceholder(container, message) {
    if (!container) return;
    container.innerHTML =
      '<div role="status" style="display:flex;align-items:center;justify-content:center;' +
      'min-height:320px;border:1px dashed var(--app-border);border-radius:12px;' +
      'color:var(--app-muted);text-align:center;padding:24px;font-size:.9rem;">' +
      message + "</div>";
  }

  /**
   * Deteksi API game. Mengembalikan object dengan method yang tersedia
   * atau null jika modul inti tidak ditemukan.
   */
  function detectGameApi() {
    var api = {};

    // BoardView: komponen papan
    if (global.BoardView) {
      api.BoardView = global.BoardView;
    } else if (global.Board && typeof global.Board === "object") {
      // komponen Board (js/components/Board.js) sebagai alternatif
      api.BoardView = global.Board;
    }

    // GameMode: mode permainan
    if (global.GameMode) {
      api.GameMode = global.GameMode;
    } else if (global.Game && typeof global.Game === "object") {
      api.GameMode = global.Game;
    }

    // Engine: validasi aturan
    if (global.Chess) api.Chess = global.Chess;
    else if (global.ChessEngine) api.ChessEngine = global.ChessEngine;

    return api;
  }

  /**
   * Coba berbagai signature umum untuk init GameMode.
   * Karena kita tidak tahu persis signature-nya, coba berlapis.
   */
  function initGameMode(api, boardContainer) {
    if (!api.GameMode) return null;

    var attempts = [
      function () {
        return api.GameMode.init({
          board: boardContainer,
          onStateChange: handleStateChange,
          onStatusChange: handleStatusChange
        });
      },
      function () {
        return api.GameMode.init(boardContainer);
      },
      function () {
        return api.GameMode.init();
      },
      function () {
        return new api.GameMode({ board: boardContainer });
      },
      function () {
        return new api.GameMode(boardContainer);
      }
    ];

    for (var i = 0; i < attempts.length; i++) {
      var result = safe("GameMode.init#" + i, attempts[i]);
      if (result) return result;
    }
    return null;
  }

  /* ---------- Handlers ---------- */

  function handleStateChange(state) {
    if (!state) return;
    renderMoveHistory(state);
    updateStatus(state);
  }

  function handleStatusChange(status) {
    var el = $("game-status");
    if (!el || !status) return;
    var key = status.key || status;
    var text = global.I18n ? global.I18n.t("game." + key) : key;
    el.textContent = text;
    el.setAttribute("aria-live", "polite");
  }

  function updateStatus(state) {
    var el = $("game-status");
    if (!el) return;
    var I18n = global.I18n;
    var key = "game.yourTurn";
    if (state && state.turn) {
      key = state.turn === "w" ? "game.whiteTurn" : "game.blackTurn";
    }
    if (state && state.status) {
      var statusMap = {
        check: "game.check",
        checkmate: "game.checkmate",
        stalemate: "game.stalemate",
        draw: "game.drawResult"
      };
      if (statusMap[state.status]) key = statusMap[state.status];
    }
    el.textContent = I18n ? I18n.t(key) : key;
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

  /* ---------- Button bindings ---------- */

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
      if (typeof fn === "function") {
        safe(actionName, function () { fn.call(instance); });
      } else if (global.GameMode && typeof global.GameMode[actionName] === "function") {
        safe(actionName, function () { global.GameMode[actionName](); });
      } else {
        if (global.console) console.warn("[GameBridge] aksi tidak tersedia:", actionName);
      }
    });
  }

  function bindButtons() {
    var I18n = global.I18n;
    var t = I18n ? function (k) { return I18n.t(k); } : function (k) { return k; };

    bindButton("btn-new-game", "newGame", {
      confirmKey: function () { return t("game.restartConfirm"); }
    });
    bindButton("btn-undo", "undo");
    bindButton("btn-redo", "redo");
    bindButton("btn-flip", "flipBoard");
    bindButton("btn-resign", "resign", {
      confirmKey: function () { return t("game.resignConfirm"); }
    });
    bindCopyButton("btn-copy-fen", "fen", "game.copyFEN");
    bindCopyButton("btn-copy-pgn", "pgn", "game.copyPGN");
  }

  function bindCopyButton(id, kind, labelKey) {
    var btn = $(id);
    if (!btn || btn.__bridgeBound) return;
    btn.__bridgeBound = true;

    btn.addEventListener("click", function (e) {
      e.preventDefault();
      var value = null;
      if (instance) {
        if (typeof instance.getFEN === "function" && kind === "fen") value = instance.getFEN();
        if (typeof instance.getPGN === "function" && kind === "pgn") value = instance.getPGN();
        if (typeof instance.exportFEN === "function" && kind === "fen") value = instance.exportFEN();
        if (typeof instance.exportPGN === "function" && kind === "pgn") value = instance.exportPGN();
      }
      if (!value && global.GameMode) {
        if (kind === "fen" && typeof global.GameMode.getFEN === "function") value = global.GameMode.getFEN();
        if (kind === "pgn" && typeof global.GameMode.getPGN === "function") value = global.GameMode.getPGN();
      }
      if (!value) {
        if (global.console) console.warn("[GameBridge] tidak bisa ekspor " + kind);
        return;
      }
      copyToClipboard(value).then(function () {
        toast(global.I18n ? global.I18n.t("toast.copied") : "Copied");
      }).catch(function () {
        toast(global.I18n ? global.I18n.t("toast.copyFailed") : "Copy failed");
      });
    });
  }

  function copyToClipboard(text) {
    if (global.navigator && navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      try {
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        var ok = document.execCommand("copy");
        document.body.removeChild(ta);
        ok ? resolve() : reject(new Error("execCommand failed"));
      } catch (e) { reject(e); }
    });
  }

  function toast(msg) {
    var el = document.createElement("div");
    el.setAttribute("role", "status");
    el.setAttribute("aria-live", "polite");
    el.textContent = msg;
    el.style.cssText =
      "position:fixed;left:50%;bottom:24px;transform:translateX(-50%);" +
      "background:var(--app-surface);color:var(--app-text);" +
      "border:1px solid var(--app-border);border-radius:8px;" +
      "padding:10px 16px;font-size:.9rem;z-index:9999;" +
      "box-shadow:0 4px 12px rgba(0,0,0,.15);" +
      "transition:opacity .2s;";
    document.body.appendChild(el);
    setTimeout(function () {
      el.style.opacity = "0";
      setTimeout(function () { el.remove(); }, 220);
    }, 1800);
  }

  /* ---------- Public API ---------- */

  var GameBridge = {
    init: function () {
      if (MOUNTED) return instance;
      MOUNTED = true;

      var container = $("board") || $("board-container");
      if (!container) {
        if (global.console) console.warn("[GameBridge] #board tidak ditemukan");
        return null;
      }

      var api = detectGameApi();
      if (!api.GameMode) {
        showPlaceholder(
          container,
          "Modul permainan belum tersedia. " +
          "Pastikan <code>js/game.js</code> dimuat sebelum bridge."
        );
        bindButtons(); // tetap bind tombol untuk masa depan
        return null;
      }

      instance = initGameMode(api, container);
      bindButtons();
      updateStatus(instance && instance.getState ? instance.getState() : null);

      // Re-render teks saat bahasa berganti
      if (global.I18n && global.I18n.onChange) {
        global.I18n.onChange(function () {
          updateStatus(instance && instance.getState ? instance.getState() : null);
        });
      }

      if (global.console && console.info) {
        console.info("[GameBridge] siap.");
      }
      return instance;
    },

    getInstance: function () { return instance; },

    /** Untuk test: reset state mount */
    _reset: function () { MOUNTED = false; instance = null; }
  };

  global.GameBridge = GameBridge;
})(typeof window !== "undefined" ? window : this);
