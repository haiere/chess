/**
 * js/bridge/game-bridge.js — ESM.
 * Adapter HTML #board/#btn-* ↔ window.GameMode (dari modul user).
 */
let MOUNTED = false, instance = null;
const $ = id => document.getElementById(id);

function safe(label, fn) {
  try { return fn(); }
  catch (e) { console.warn("[GameBridge] " + label + " gagal:", e); return null; }
}
function showPlaceholder(msg) {
  const c = $("board-container") || $("board");
  if (!c) return;
  c.innerHTML = '<div class="app-placeholder" role="status">' + msg + "</div>";
}
function detectApi() {
  const api = {};
  api.BoardView = window.BoardView || (window.Board && typeof window.Board === "object" ? window.Board : null);
  api.GameMode = window.GameMode || (window.Game && typeof window.Game === "object" ? window.Game : null);
  return api;
}
function tryInit(api, boardEl) {
  if (!api.GameMode) return null;
  const attempts = [
    () => api.GameMode.init({ board: boardEl, onStateChange: onState, onStatusChange: onStatus }),
    () => api.GameMode.init(boardEl),
    () => api.GameMode.init(),
    () => new api.GameMode({ board: boardEl }),
    () => new api.GameMode(boardEl)
  ];
  for (let i = 0; i < attempts.length; i++) {
    const r = safe("GameMode.init#" + i, attempts[i]);
    if (r) return r;
  }
  return null;
}
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
    else if (window.GameMode && typeof window.GameMode[actionName] === "function") safe(actionName, () => window.GameMode[actionName]());
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
    if (!value && window.GameMode) {
      if (kind === "fen" && window.GameMode.getFEN) value = window.GameMode.getFEN();
      if (kind === "pgn" && window.GameMode.getPGN) value = window.GameMode.getPGN();
    }
    if (!value) return;
    copy(value).then(() => toast(window.I18n ? window.I18n.t("toast.copied") : "Copied"))
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

export const GameBridge = {
  init() {
    if (MOUNTED) return instance;
    MOUNTED = true;
    const boardEl = $("board");
    if (!boardEl) { console.warn("[GameBridge] #board tidak ditemukan"); return null; }
    const api = detectApi();
    if (!api.GameMode) {
      showPlaceholder("Modul permainan belum tersedia. Pastikan <code>js/game.js</code> dimuat (lihat Console).");
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
    updateStatus(instance.getState ? instance.getState() : null);
    if (window.I18n && window.I18n.onChange) {
      window.I18n.onChange(() => updateStatus(instance.getState ? instance.getState() : null));
    }
    console.info("[GameBridge] siap.");
    return instance;
  },
  getInstance() { return instance; },
  _reset() { MOUNTED = false; instance = null; }
};

if (typeof window !== "undefined") window.GameBridge = GameBridge;
export default GameBridge;
