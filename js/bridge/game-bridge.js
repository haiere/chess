/**
 * js/bridge/game-bridge.js — ESM v4.
 * Perbaikan kunci:
 *  - showPlaceholder TIDAK menghapus #board
 *  - BoardView instantiation pakai signature (container, opts) yang benar
 *  - Fallback BoardView merender papan 8x8 minimal
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

/**
 * showPlaceholder — JANGAN hapus #board. Pakai sibling + sembunyikan board.
 * Idempotent: hapus placeholder lama sebelum tambah baru.
 */
function showPlaceholder(msg) {
  const container = $("board-container");
  const boardEl = $("board");
  if (!container) return;

  // Sembunyikan board asli (jangan hapus — bridge lain mungkin butuh)
  if (boardEl) boardEl.style.display = "none";

  // Hapus placeholder lama kalau ada
  const old = container.querySelector(".app-placeholder");
  if (old) old.remove();

  // Tambah placeholder sebagai sibling #board
  const ph = document.createElement("div");
  ph.className = "app-placeholder";
  ph.setAttribute("role", "status");
  ph.style.cssText =
    "display:block;text-align:center;padding:32px 24px;" +
    "color:var(--app-muted);font-size:.9rem;line-height:1.6;" +
    "border:1px dashed var(--app-border);border-radius:12px;min-height:200px;";
  ph.innerHTML = '<span style="display:inline-block;max-width:520px;">' + msg + "</span>";
  container.appendChild(ph);
}

function clearPlaceholder() {
  const container = $("board-container");
  const boardEl = $("board");
  if (container) {
    const old = container.querySelector(".app-placeholder");
    if (old) old.remove();
  }
  if (boardEl) boardEl.style.display = "";
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

/* ---------- GameMode init ---------- */
function tryInitGameMode(api, boardEl) {
  if (!api.GameMode) return null;
  const GM = api.GameMode;

  function hasRendered() { return boardEl && boardEl.children.length > 0; }
  function attempt(fn, label) {
    try {
      const r = fn();
      if (r) return r;
      if (hasRendered()) {
        console.info("[GameBridge] " + label + " → return undefined tapi board terisi. Treat as success.");
        return GM;
      }
    } catch (e) {
      console.warn("[GameBridge] GameMode." + label + " error:", e && e.message ? e.message : e);
    }
    return null;
  }

  // Coba semua signature umum
  const calls = [
    ["init({board,...})", () => GM.init({ board: boardEl, container: boardEl, element: boardEl, onStateChange: onState, onStatusChange: onStatus, onChange: onState })],
    ["init(boardEl)",     () => GM.init(boardEl)],
    ["init()",            () => GM.init()],
    ["start({board})",    () => GM.start && GM.start({ board: boardEl })],
    ["start(boardEl)",    () => GM.start && GM.start(boardEl)],
    ["mount({board})",    () => GM.mount && GM.mount({ board: boardEl })],
    ["setup(boardEl)",    () => GM.setup && GM.setup(boardEl)],
    ["boot(boardEl)",     () => GM.boot && GM.boot(boardEl)],
    ["render(boardEl)",   () => GM.render && GM.render(boardEl)],
    ["newGame(boardEl)",  () => GM.newGame && GM.newGame(boardEl)]
  ];
  for (const [label, fn] of calls) {
    const r = attempt(fn, label);
    if (r) { console.info("[GameBridge] GameMode sukses via " + label); return r; }
  }

  // Kalau GameMode adalah constructor class
  if (typeof GM === "function") {
    const ctors = [
      ["new GameMode(boardEl)",         () => new GM(boardEl)],
      ["new GameMode(boardEl, opts)",   () => new GM(boardEl, { onStateChange: onState })],
      ["new GameMode({board})",         () => new GM({ board: boardEl })]
    ];
    for (const [label, fn] of ctors) {
      const r = attempt(fn, label);
      if (r) { console.info("[GameBridge] GameMode sukses via " + label); return r; }
    }
  }

  return null;
}

/* ---------- BoardView fallback ---------- */
/**
 * Fallback: kalau GameMode tidak jalan, minimal render papan via BoardView.
 * Signature BoardView: constructor(container, opts) — DUA argumen.
 */
function tryFallbackBoard(api, boardEl) {
  if (!api.BoardView) return null;
  const BV = api.BoardView;
  if (typeof BV !== "function") return null;

  let view = null;
  const attempts = [
    ["new BoardView(boardEl, opts)",        () => new BV(boardEl, { orientation: "white", showCoords: true, interactive: true, onSquareClick: () => {} })],
    ["new BoardView(boardEl)",              () => new BV(boardEl)],
    ["new BoardView(boardEl, {})",          () => new BV(boardEl, {})]
  ];
  for (const [label, fn] of attempts) {
    try {
      view = fn();
      if (view) { console.info("[GameBridge] BoardView instantiated via " + label); break; }
    } catch (e) {
      console.warn("[GameBridge] " + label + " error:", e && e.message ? e.message : e);
    }
  }
  if (!view) return null;

  // Coba render posisi awal. BoardView biasanya punya method render/update/setPosition.
  const startFEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
  const renderCalls = [
    ["render(state)",       () => view.render && view.render({ fen: startFEN })],
    ["render(fen)",         () => view.render && view.render(startFEN)],
    ["render()",            () => view.render && view.render()],
    ["setPosition(fen)",    () => view.setPosition && view.setPosition(startFEN)],
    ["update(fen)",         () => view.update && view.update(startFEN)],
    ["renderFromFEN(fen)",  () => view.renderFromFEN && view.renderFromFEN(startFEN)]
  ];
  let rendered = false;
  for (const [label, fn] of renderCalls) {
    try {
      const r = fn();
      if (r !== false && boardEl.children.length > 0) {
        console.info("[GameBridge] BoardView rendered via " + label);
        rendered = true;
        break;
      }
    } catch (e) { /* continue */ }
  }
  if (!rendered && boardEl.children.length === 0) {
    console.warn("[GameBridge] BoardView ada tapi tidak bisa auto-render. Coba panggil view.render(...) manual.");
  }
  return view;
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
      // Cari alternatif: buat elemen #board kalau hilang
      const container = $("board-container");
      if (container) {
        const nb = document.createElement("div");
        nb.id = "board";
        nb.className = "board";
        container.appendChild(nb);
        console.warn("[GameBridge] #board tidak ada, dibuat baru.");
        return GameBridge._initWithBoard(nb);
      }
      showPlaceholder(placeholderText("noBoard"));
      return null;
    }
    return GameBridge._initWithBoard(boardEl);
  },

  _initWithBoard(boardEl) {
    clearPlaceholder(); // pastikan placeholder lama hilang
    const api = detectApi();
    currentApi = api;

    if (!api.GameMode && !api.BoardView) {
      showPlaceholder(placeholderText("noGameMode"));
      bindButtons();
      return null;
    }

    // 1. Coba GameMode
    instance = tryInitGameMode(api, boardEl);
    if (instance) {
      clearPlaceholder();
      bindButtons();
      updateStatus(instance.getState ? instance.getState() : null);
      if (window.I18n && window.I18n.onChange) {
        window.I18n.onChange(() => updateStatus(instance.getState ? instance.getState() : null));
      }
      console.info("[GameBridge] siap (GameMode).");
      return instance;
    }

    // 2. Fallback BoardView
    const fallback = tryFallbackBoard(api, boardEl);
    if (fallback) {
      clearPlaceholder();
      bindButtons();
      console.warn("[GameBridge] Hanya BoardView yang aktif. Game belum playable sampai GameMode.init dipetakan.");
      return fallback;
    }

    // 3. Gagal total
    showPlaceholder(placeholderText("initFailed"));
    bindButtons();
    return null;
  },

  getInstance() { return instance; },
  _reset() { MOUNTED = false; instance = null; currentApi = null; }
};

if (typeof window !== "undefined") window.GameBridge = GameBridge;
export default GameBridge;
