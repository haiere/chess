/**
 * js/bridge/game-bridge.js — ESM v3.
 * - Placeholder fix (block, tidak flex)
 * - tryInit lebih robust (15+ signature)
 * - Fallback ke BoardView kalau GameMode gagal
 */
let MOUNTED = false, instance = null, currentApi = null;
const $ = id => document.getElementById(id);

function safe(label, fn) {
  try { return fn(); } catch (e) {
    console.warn("[GameBridge] " + label + " gagal:", e && e.message ? e.message : e);
    return null;
  }
}

function placeholderText(key) {
  const lang = window.I18n ? window.I18n.getLang() : "id";
  const texts = {
    id: {
      noGameMode: "Modul permainan belum tersedia. Pastikan <code>js/game.js</code> dimuat (lihat Console).",
      initFailed: "Modul permainan ada, tetapi gagal diinisialisasi. Buka Console untuk detail.",
      noBoard: "Elemen papan tidak ditemukan."
    },
    en: {
      noGameMode: "Game module not available. Make sure <code>js/game.js</code> is loaded (see Console).",
      initFailed: "Game module exists but failed to initialize. Check Console for details.",
      noBoard: "Board element not found."
    }
  };
  return (texts[lang] || texts.id)[key];
}

function showPlaceholder(msg) {
  const c = $("board-container") || $("board");
  if (!c) return;
  // Pakai display:block + text-align:center agar teks & <code> tidak wrap berdampingan
  c.innerHTML =
    '<div role="status" style="' +
    'display:block;text-align:center;' +
    'padding:32px 24px;color:var(--app-muted);' +
    'font-size:.9rem;line-height:1.6;' +
    'border:1px dashed var(--app-border);' +
    'border-radius:12px;min-height:200px;">' +
    '<span style="display:inline-block;max-width:520px;">' + msg + '</span>' +
    '</div>';
}

function detectApi() {
  const api = {};
  api.BoardView = window.BoardView
    || (window.Board && typeof window.Board === "object" ? window.Board : null);
  api.GameMode = window.GameMode
    || (window.Game && typeof window.Game === "object" ? window.Game : null);
  api.Chess = window.Chess || window.ChessEngine || null;
  return api;
}

/**
 * tryInit — coba banyak signature.
 * Penting: kalau return undefined TAPI board sudah terisi anak, treat sebagai sukses.
 */
function tryInit(api, boardEl) {
  if (!api.GameMode) return null;
  const GM = api.GameMode;

  function hasRendered() {
    return boardEl && boardEl.children.length > 0;
  }
  function attempt(fn, label) {
    try {
      const r = fn();
      if (r) return r;
      if (hasRendered()) {
        console.info("[GameBridge] " + label + " → tidak return instance, tapi board terisi. Treat as success.");
        return GM;
      }
    } catch (e) {
      console.warn("[GameBridge] " + label + " error:", e && e.message ? e.message : e);
    }
    return null;
  }

  // 1. init dengan object config
  let r = attempt(() => GM.init({
    board: boardEl,
    container: boardEl,
    element: boardEl,
    onStateChange: onState,
    onStatusChange: onStatus,
    onChange: onState
  }), "init({board,...})");
  if (r) return r;

  // 2. init dengan element langsung
  r = attempt(() => GM.init(boardEl), "init(boardEl)");
  if (r) return r;

  // 3. init tanpa argumen
  r = attempt(() => GM.init(), "init()");
  if (r) return r;

  // 4. new GameMode(...)
  if (typeof GM === "function") {
    r = attempt(() => new GM({ board: boardEl }), "new GameMode({board})");
    if (r) return r;
    r = attempt(() => new GM(boardEl), "new GameMode(boardEl)");
    if (r) return r;
    r = attempt(() => new GM(), "new GameMode()");
    if (r) return r;
  }

  // 5. Cari method alternatif
  const altMethods = ["start", "mount", "setup", "boot", "render", "newGame", "reset", "initialize"];
  for (const m of altMethods) {
    if (typeof GM[m] !== "function") continue;
    r = attempt(() => GM[m]({ board: boardEl, container: boardEl }), m + "({board})");
    if (r) return r;
    r = attempt(() => GM[m](boardEl), m + "(boardEl)");
    if (r) return r;
    r = attempt(() => GM[m](), m + "()");
    if (r) return r;
  }

  return null;
}

/**
 * Fallback: kalau GameMode tidak bisa init, coba render board via BoardView.
 * Board tidak akan playable, tapi setidaknya bidak muncul.
 */
function tryFallbackBoard(api, boardEl) {
  if (!api.BoardView) return null;
  const BV = api.BoardView;

  function tryCreate(fn, label) {
    try {
      const r = fn();
      if (r && typeof r.render === "function") {
        try { r.render(); } catch (e) { console.warn("[GameBridge] render() error:", e); }
        console.info("[GameBridge] fallback BoardView via " + label);
        return r;
      }
      if (r) return r;
      if (boardEl.children.length > 0) {
        console.info("[GameBridge] fallback BoardView " + label + " → board terisi.");
        return {};
      }
    } catch (e) {
      console.warn("[GameBridge] BoardView " + label + " error:", e && e.message ? e.message : e);
    }
    return null;
  }

  if (typeof BV === "function") {
    let r = tryCreate(() => new BV({ container: boardEl, board: boardEl }), "new BoardView({container})");
    if (r) return r;
    r = tryCreate(() => new BV(boardEl), "new BoardView(boardEl)");
    if (r) return r;
    r = tryCreate(() => new BV(), "new BoardView()");
    if (r) return r;
  }
  if (typeof BV === "object") {
    let r = tryCreate(() => BV.init && BV.init({ container: boardEl }), "BoardView.init({container})");
    if (r) return r;
    r = tryCreate(() => BV.init && BV.init(boardEl), "BoardView.init(boardEl)");
    if (r) return r;
    r = tryCreate(() => BV.init && BV.init(), "BoardView.init()");
    if (r) return r;
  }
  return null;
}

/* ---------- Handlers ---------- */
function onState(s) { renderMoveHistory(s); updateStatus(s); }
function onStatus(status) {
  const el = $("game-status");
  if (!el || !status) return;
  const key = typeof status === "string" ? status : (status.key || "yourTurn");
  el.textContent = window.I18n ? window.I18n.t("game." + key) : key;
}
function updateStatus(state) {
  const el = $("game-status");
  if (!el) return;
  let key = "game.yourTurn";
  if (state && state.turn) key = state.turn === "w" ? "game.whiteTurn" : "game.blackTurn";
  if (state && state.status) {
    const map = { check:"game.check", checkmate:"game.checkmate", stalemate:"game.stalemate", draw:"game.drawResult" };
    if (map[state.status]) key = map[state.status];
  }
  el.textContent = window.I18n ? window.I18n.t(key) : key;
}
function renderMoveHistory(state) {
  const list = $("move-history");
  if (!list || !state || !Array.isArray(state.moves)) return;
  list.innerHTML = "";
  for (const mv of state.moves) {
    const li = document.createElement("li");
    li.textContent = mv;
    list.appendChild(li);
  }
}

/* ---------- Buttons ---------- */
function bindButton(id, actionName, opts) {
  const btn = $(id);
  if (!btn || btn.__bridgeBound) return;
  btn.__bridgeBound = true;
  btn.addEventListener("click", e => {
    e.preventDefault();
    if (opts && typeof opts.confirmKey === "function") {
      const msg = opts.confirmKey();
      if (msg && !window.confirm(msg)) return;
    }
    const fn = instance && instance[actionName];
    if (typeof fn === "function") safe(actionName, () => fn.call(instance));
    else if (currentApi && currentApi.GameMode && typeof currentApi.GameMode[actionName] === "function")
      safe(actionName, () => currentApi.GameMode[actionName]());
    else console.warn("[GameBridge] aksi tidak tersedia:", actionName);
  });
}
function bindCopy(id, kind) {
  const btn = $(id);
  if (!btn || btn.__bridgeBound) return;
  btn.__bridgeBound = true;
  btn.addEventListener("click", e => {
    e.preventDefault();
    let value = null;
    if (instance) {
      if (kind === "fen") value = (instance.getFEN && instance.getFEN()) || (instance.exportFEN && instance.exportFEN());
      if (kind === "pgn") value = (instance.getPGN && instance.getPGN()) || (instance.exportPGN && instance.exportPGN());
    }
    if (!value && currentApi && currentApi.GameMode) {
      const GM = currentApi.GameMode;
      if (kind === "fen" && GM.getFEN) value = GM.getFEN();
      if (kind === "pgn" && GM.getPGN) value = GM.getPGN();
    }
    if (!value) return;
    copy(value)
      .then(() => toast(window.I18n ? window.I18n.t("toast.copied") : "Copied"))
      .catch(() => toast(window.I18n ? window.I18n.t("toast.copyFailed") : "Copy failed"));
  });
}
function copy(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text);
  return new Promise((res, rej) => {
    try {
      const ta = document.createElement("textarea");
      ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      const ok = document.execCommand("copy"); document.body.removeChild(ta);
      ok ? res() : rej(new Error("exec failed"));
    } catch (e) { rej(e); }
  });
}
function toast(msg) {
  const el = document.createElement("div");
  el.setAttribute("role", "status"); el.setAttribute("aria-live", "polite");
  el.textContent = msg;
  el.style.cssText = "position:fixed;left:50%;bottom:24px;transform:translateX(-50%);background:var(--app-surface);color:var(--app-text);border:1px solid var(--app-border);border-radius:8px;padding:10px 16px;font-size:.9rem;z-index:9999;box-shadow:0 4px 12px rgba(0,0,0,.15);transition:opacity .2s;";
  document.body.appendChild(el);
  setTimeout(() => { el.style.opacity = "0"; setTimeout(() => el.remove(), 220); }, 1800);
}
function bindButtons() {
  const t = window.I18n ? k => window.I18n.t(k) : k => k;
  bindButton("btn-new-game", "newGame", { confirmKey: () => t("game.restartConfirm") });
  bindButton("btn-undo", "undo");
  bindButton("btn-redo", "redo");
  bindButton("btn-flip", "flipBoard");
  bindButton("btn-resign", "resign", { confirmKey: () => t("game.resignConfirm") });
  bindCopy("btn-copy-fen", "fen");
  bindCopy("btn-copy-pgn", "pgn");
}

/* ---------- Public ---------- */
export const GameBridge = {
  init() {
    if (MOUNTED) return instance;
    MOUNTED = true;

    const boardEl = $("board");
    if (!boardEl) {
      showPlaceholder(placeholderText("noBoard"));
      return null;
    }

    const api = detectApi();
    currentApi = api;

    if (!api.GameMode && !api.BoardView) {
      showPlaceholder(placeholderText("noGameMode"));
      bindButtons();
      return null;
    }

    // Coba GameMode dulu
    instance = tryInit(api, boardEl);
    if (instance) {
      bindButtons();
      updateStatus(instance.getState ? instance.getState() : null);
      if (window.I18n && window.I18n.onChange) {
        window.I18n.onChange(() => updateStatus(instance.getState ? instance.getState() : null));
      }
      console.info("[GameBridge] siap (GameMode).");
      return instance;
    }

    // Fallback: BoardView saja
    const fallback = tryFallbackBoard(api, boardEl);
    if (fallback) {
      bindButtons();
      console.warn("[GameBridge] GameMode tidak bisa init. Hanya BoardView yang aktif — game belum bisa dimainkan.");
      return fallback;
    }

    // Gagal total
    showPlaceholder(placeholderText("initFailed"));
    bindButtons();
    return null;
  },
  getInstance() { return instance; },
  _reset() { MOUNTED = false; instance = null; currentApi = null; }
};

if (typeof window !== "undefined") window.GameBridge = GameBridge;
export default GameBridge;
