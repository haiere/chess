/** js/bridge/puzzle-bridge.js — ESM. */
let MOUNTED = false, instance = null;
const $ = id => document.getElementById(id);
function safe(label, fn) {
  try { return fn(); } catch (e) { console.warn("[PuzzleBridge] " + label + " gagal:", e); return null; }
}
function showPlaceholder(msg) {
  const c = $("puzzle-board-container") || $("puzzle-board");
  if (!c) return;
  c.innerHTML = '<div class="app-placeholder" role="status">' + msg + "</div>";
}
function detectApi() {
  const api = {};
  api.PuzzleMode = window.PuzzleMode || (window.Puzzle && typeof window.Puzzle === "object" ? window.Puzzle : null);
  return api;
}
function tryInit(api, boardEl) {
  if (!api.PuzzleMode) return null;
  const attempts = [
    () => api.PuzzleMode.init({ board: boardEl, onStatus, onProgress }),
    () => api.PuzzleMode.init(boardEl),
    () => api.PuzzleMode.init(),
    () => new api.PuzzleMode({ board: boardEl })
  ];
  for (let i = 0; i < attempts.length; i++) {
    const r = safe("PuzzleMode.init#" + i, attempts[i]);
    if (r) return r;
  }
  return null;
}
function onStatus(status) {
  const el = $("puzzle-status");
  if (!el) return;
  let key = typeof status === "string" ? status : (status && status.key) || "inProgress";
  if (key.indexOf("puzzle.") !== 0) key = "puzzle." + key;
  el.textContent = window.I18n ? window.I18n.t(key) : key;
}
function onProgress(p) {
  const el = $("puzzle-progress");
  if (!el || !p) return;
  el.textContent = window.I18n
    ? window.I18n.t("puzzle.progress", { current: p.current, total: p.total })
    : p.current + "/" + p.total;
}
function bindButton(id, actionName) {
  const btn = $(id);
  if (!btn || btn.__bridgeBound) return;
  btn.__bridgeBound = true;
  btn.addEventListener("click", e => {
    e.preventDefault();
    const fn = instance && instance[actionName];
    if (typeof fn === "function") safe(actionName, () => fn.call(instance));
    else if (window.PuzzleMode && typeof window.PuzzleMode[actionName] === "function") safe(actionName, () => window.PuzzleMode[actionName]());
    else console.warn("[PuzzleBridge] aksi tidak tersedia:", actionName);
  });
}
function bindButtons() {
  bindButton("btn-puzzle-hint", "hint");
  bindButton("btn-puzzle-retry", "retry");
  bindButton("btn-puzzle-next", "next");
  bindButton("btn-puzzle-solution", "showSolution");
  bindButton("btn-puzzle-reset", "reset");
  const diff = $("puzzle-difficulty");
  if (diff && !diff.__bridgeBound) {
    diff.__bridgeBound = true;
    diff.addEventListener("change", e => {
      const fn = instance && instance.setDifficulty;
      if (typeof fn === "function") safe("setDifficulty", () => fn.call(instance, e.target.value));
      else if (window.PuzzleMode && typeof window.PuzzleMode.setDifficulty === "function") safe("setDifficulty", () => window.PuzzleMode.setDifficulty(e.target.value));
    });
  }
}

export const PuzzleBridge = {
  init() {
    if (MOUNTED) return instance;
    MOUNTED = true;
    const boardEl = $("puzzle-board");
    if (!boardEl) return null;
    const api = detectApi();
    if (!api.PuzzleMode) {
      showPlaceholder("Modul teka-teki belum tersedia. Pastikan <code>js/puzzle.js</code> dimuat (lihat Console).");
      bindButtons();
      return null;
    }
    instance = tryInit(api, boardEl);
    if (!instance) {
      showPlaceholder("Modul teka-teki gagal diinisialisasi. Buka Console untuk detail.");
      bindButtons();
      return null;
    }
    bindButtons();
    console.info("[PuzzleBridge] siap.");
    return instance;
  },
  getInstance() { return instance; },
  _reset() { MOUNTED = false; instance = null; }
};

if (typeof window !== "undefined") window.PuzzleBridge = PuzzleBridge;
export default PuzzleBridge;
