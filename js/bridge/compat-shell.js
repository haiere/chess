/**
 * js/bridge/compat-shell.js — ESM v2.
 * Perubahan v2: tambah CSS board grid (.board 8x8 + square + piece styling).
 * Tanpa ini, 64 square dari BoardView akan bertumpuk (bidak raksasa).
 */

const BUTTONS = [
  "btnFlip","btnUndo","btnRedo","btnResign","btnDraw",
  "btnNewGame","btnCancelNewGame","btnStartGame",
  "btnCopyPGN","btnDownloadPGN","btnTheme","btnSoundToggle",
  "btnImportFEN","btnExportFEN"
];

const SELECTS = {
  ngMode:        [["pvp","Player vs Player"],["pvc","Player vs Computer"]],
  ngColor:       [["white","White"],["black","Black"],["random","Random"]],
  ngDifficulty:  [["easy","Easy"],["medium","Medium"],["hard","Hard"]],
  ngTimer:       [["0|0","No time"],["1|0","1 min"],["3|2","3+2"],["5|0","5 min"],["10|0","10 min"],["15|10","15+10"]],
  ngBoardTheme:  [["classic","Classic"],["emerald","Emerald"],["midnight","Midnight"],["rose","Rose"],["bw","B&W"],["neon","Neon"]],
  setTheme:      [["light","Light"],["dark","Dark"],["system","System"]],
  setBoardTheme: [["classic","Classic"],["emerald","Emerald"],["midnight","Midnight"],["rose","Rose"],["bw","B&W"],["neon","Neon"]]
};

const DIVS = [
  "whiteStatus","blackStatus","whiteCaptured","blackCaptured",
  "gameStatusText","gameSubStatus","moveHistory",
  "whiteTimer","blackTimer","toastContainer"
];

const PROXY = {
  "btn-new-game": "btnNewGame",
  "btn-undo":     "btnUndo",
  "btn-redo":     "btnRedo",
  "btn-flip":     "btnFlip",
  "btn-resign":   "btnResign",
  "btn-copy-fen": "btnExportFEN",
  "btn-copy-pgn": "btnCopyPGN"
};

let ENSURED = false;

function injectStyleOnce() {
  if (document.getElementById("compat-shell-style")) return;
  const s = document.createElement("style");
  s.id = "compat-shell-style";
  s.textContent = `
    /* ============================================
       BOARD GRID — critical, tanpa ini square bertumpuk
       ============================================ */
    #board,
    body #board.board {
      display: grid !important;
      grid-template-columns: repeat(8, 1fr) !important;
      grid-template-rows: repeat(8, 1fr) !important;
      aspect-ratio: 1 / 1;
      width: 100%;
      max-width: 640px;
      margin: 0 auto;
      gap: 0;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,.25);
      user-select: none;
      -webkit-user-select: none;
      touch-action: manipulation;
    }

    /* Square — universal untuk class apapun (.square, .sq, [data-square]) */
    #board > * {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      cursor: pointer;
    }
    #board > *.light,
    #board > *[data-color="light"] { background: #f0d9b5; }
    #board > *.dark,
    #board > *[data-color="dark"]  { background: #b58863; }

    /* Piece image — jangan overflow dari square */
    #board img {
      width: 92%;
      height: 92%;
      object-fit: contain;
      pointer-events: none;
      user-select: none;
      -webkit-user-drag: none;
      display: block;
    }

    /* Coordinate labels — pojok kiri-atas & kanan-bawah square */
    #board .coord,
    #board .coord-file,
    #board .coord-rank {
      position: absolute;
      font-size: 0.65rem;
      font-weight: 600;
      color: rgba(0,0,0,.55);
      pointer-events: none;
      line-height: 1;
    }
    #board .coord-rank { top: 3px; left: 3px; }
    #board .coord-file { bottom: 3px; right: 3px; }

    /* Highlight state */
    #board > *.selected,
    #board > *[data-selected="1"] {
      box-shadow: inset 0 0 0 3px rgba(59,130,246,.75);
    }
    #board > *.legal,
    #board > *[data-legal="1"]::before {
      content: "";
      position: absolute;
      inset: 0;
      background: radial-gradient(circle, rgba(59,130,246,.4) 22%, transparent 24%);
      pointer-events: none;
    }
    #board > *.legal-capture::before {
      background: radial-gradient(circle, transparent 68%, rgba(239,68,68,.45) 70%);
    }
    #board > *.last-move,
    #board > *[data-last-move="1"] {
      background-image: linear-gradient(rgba(250,204,21,.35), rgba(250,204,21,.35));
    }
    #board > *.check,
    #board > *[data-check="1"] {
      background-image: radial-gradient(circle, rgba(239,68,68,.65) 40%, transparent 70%);
    }

    /* Theme overrides */
    [data-board-theme="emerald"] #board > *.light,
    [data-board-theme="emerald"] #board > *[data-color="light"] { background: #ecefd6; }
    [data-board-theme="emerald"] #board > *.dark,
    [data-board-theme="emerald"] #board > *[data-color="dark"]  { background: #779556; }
    [data-board-theme="midnight"] #board > *.light,
    [data-board-theme="midnight"] #board > *[data-color="light"] { background: #cdd7e0; }
    [data-board-theme="midnight"] #board > *.dark,
    [data-board-theme="midnight"] #board > *[data-color="dark"]  { background: #4a5568; }
    [data-board-theme="rose"] #board > *.light,
    [data-board-theme="rose"] #board > *[data-color="light"] { background: #f4e0e0; }
    [data-board-theme="rose"] #board > *.dark,
    [data-board-theme="rose"] #board > *[data-color="dark"]  { background: #a67474; }
    [data-board-theme="bw"] #board > *.light,
    [data-board-theme="bw"] #board > *[data-color="light"] { background: #ffffff; }
    [data-board-theme="bw"] #board > *.dark,
    [data-board-theme="bw"] #board > *[data-color="dark"]  { background: #2d2d2d; }
    [data-board-theme="neon"] #board > *.light,
    [data-board-theme="neon"] #board > *[data-color="light"] { background: #1b2733; }
    [data-board-theme="neon"] #board > *.dark,
    [data-board-theme="neon"] #board > *[data-color="dark"]  { background: #0b1017; }

    /* Mobile: papan selalu muat viewport */
    @media (max-width: 480px) {
      #board { border-radius: 6px; }
      #board .coord { font-size: 0.55rem; }
    }

    /* Reduced motion */
    @media (prefers-reduced-motion: reduce) {
      #board *, #board img { transition: none !important; animation: none !important; }
    }

    /* ============================================
       MODAL (dari v1, dipertahankan)
       ============================================ */
    .modal-overlay[data-compat="1"] {
      position: fixed; inset: 0; background: rgba(0,0,0,.55);
      display: flex; align-items: center; justify-content: center;
      z-index: 2000; padding: 16px; box-sizing: border-box;
    }
    .modal-overlay[data-compat="1"].hidden { display: none !important; }
    .modal-overlay[data-compat="1"] > .compat-inner {
      background: var(--app-surface,#1e293b); color: var(--app-text,#e2e8f0);
      border: 1px solid var(--app-border,#334155); border-radius: 12px;
      padding: 24px; max-width: min(92vw,520px); max-height: 90vh; overflow: auto;
      box-shadow: 0 20px 60px rgba(0,0,0,.4); min-width: 260px;
    }
    .modal-overlay[data-compat="1"] label {
      display: block; margin: 12px 0 4px; font-size: .85rem; color: var(--app-muted,#94a3b8);
    }
    .modal-overlay[data-compat="1"] select {
      width: 100%; min-height: 40px; padding: 6px 10px; border-radius: 8px;
      background: var(--app-bg,#0f172a); color: inherit;
      border: 1px solid var(--app-border,#334155);
    }
    .modal-overlay[data-compat="1"] .compat-actions {
      display: flex; gap: 8px; justify-content: flex-end; margin-top: 20px;
    }
    .modal-overlay[data-compat="1"] .compat-actions button {
      padding: 8px 16px; border-radius: 8px; border: 1px solid var(--app-border,#334155);
      background: var(--app-bg,#0f172a); color: inherit; cursor: pointer; min-height: 40px;
    }
    .modal-overlay[data-compat="1"] .compat-actions button.accent {
      background: var(--app-accent,#3b82f6); border-color: var(--app-accent,#3b82f6); color: #fff;
    }

    /* ============================================
       HIDDEN SHELL (tombol & select lama)
       ============================================ */
    #compat-shell {
      position: absolute; width: 0; height: 0; overflow: hidden;
      left: -9999px; top: -9999px; pointer-events: none;
    }

    /* ============================================
       TOAST
       ============================================ */
    #toastContainer {
      position: fixed; left: 50%; bottom: 24px; transform: translateX(-50%);
      z-index: 3000; display: flex; flex-direction: column; gap: 8px; pointer-events: none;
    }
    #toastContainer .toast {
      background: var(--app-surface,#1e293b); color: var(--app-text,#e2e8f0);
      border: 1px solid var(--app-border,#334155); border-radius: 8px;
      padding: 10px 16px; font-size: .9rem; box-shadow: 0 4px 12px rgba(0,0,0,.2);
    }

    /* ============================================
       MOVE HISTORY
       ============================================ */
    #moveHistory {
      max-height: 240px; overflow: auto;
      font-family: ui-monospace, monospace; font-size: .9rem;
    }
    #moveHistory .move-row {
      display: grid; grid-template-columns: 36px 1fr 1fr; gap: 4px; padding: 2px 0;
    }
    #moveHistory .move-number { color: var(--app-muted,#94a3b8); }

    /* ============================================
       PROMOTION MODAL
       ============================================ */
    #promotionOptions { display: flex; gap: 8px; justify-content: center; }
    #promotionOptions .promotion-btn {
      cursor: pointer; padding: 8px; border-radius: 8px; background: var(--app-bg,#0f172a);
    }
    #promotionOptions .promotion-btn img { width: 48px; height: 48px; display: block; }
  `;
  document.head.appendChild(s);
}

function ensureShellContainer() {
  let shell = document.getElementById("compat-shell");
  if (!shell) {
    shell = document.createElement("div");
    shell.id = "compat-shell";
    shell.setAttribute("aria-hidden", "true");
    document.body.appendChild(shell);
  }
  return shell;
}

function ensureButtons(shell) {
  for (const id of BUTTONS) {
    if (document.getElementById(id)) continue;
    const b = document.createElement("button");
    b.id = id;
    b.type = "button";
    b.tabIndex = -1;
    shell.appendChild(b);
  }
}

function ensureSelects(shell) {
  for (const [id, opts] of Object.entries(SELECTS)) {
    if (document.getElementById(id)) continue;
    const sel = document.createElement("select");
    sel.id = id;
    sel.tabIndex = -1;
    for (const [val, label] of opts) {
      const o = document.createElement("option");
      o.value = val;
      o.textContent = label;
      sel.appendChild(o);
    }
    shell.appendChild(sel);
  }
}

function ensureDivs(shell) {
  for (const id of DIVS) {
    if (document.getElementById(id)) continue;
    const d = document.createElement("div");
    d.id = id;
    shell.appendChild(d);
  }
}

function ensureModal(id, buildInner) {
  if (document.getElementById(id)) return;
  const overlay = document.createElement("div");
  overlay.id = id;
  overlay.className = "modal-overlay hidden";
  overlay.setAttribute("data-compat", "1");
  overlay.setAttribute("aria-hidden", "true");
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");

  const inner = document.createElement("div");
  inner.className = "compat-inner";

  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.className = "compat-close";
  closeBtn.setAttribute("data-close", id);
  closeBtn.setAttribute("aria-label", "Close");
  closeBtn.textContent = "×";
  closeBtn.style.cssText =
    "float:right;background:transparent;border:0;color:inherit;font-size:1.4rem;" +
    "cursor:pointer;line-height:1;padding:0 4px;min-height:auto;";

  inner.appendChild(closeBtn);
  if (typeof buildInner === "function") buildInner(inner);

  overlay.appendChild(inner);
  document.body.appendChild(overlay);
}

function buildNewGameModal(inner) {
  const h = document.createElement("h2");
  h.textContent = "New Game";
  h.style.margin = "0 0 12px";
  inner.appendChild(h);

  const rows = [
    ["ngMode", "Mode"],
    ["ngColor", "Play as"],
    ["ngDifficulty", "AI Difficulty"],
    ["ngTimer", "Time control"],
    ["ngBoardTheme", "Board theme"]
  ];
  for (const [id, label] of rows) {
    const l = document.createElement("label");
    l.setAttribute("for", id + "-visible");
    l.textContent = label;
    inner.appendChild(l);
    const src = document.getElementById(id);
    const sel = document.createElement("select");
    sel.id = id + "-visible";
    if (src) {
      for (const o of src.options) {
        const c = document.createElement("option");
        c.value = o.value;
        c.textContent = o.textContent;
        sel.appendChild(c);
      }
      sel.value = src.value;
    }
    sel.addEventListener("change", () => {
      const real = document.getElementById(id);
      if (real) {
        real.value = sel.value;
        real.dispatchEvent(new Event("change"));
      }
    });
    inner.appendChild(sel);
  }

  const actions = document.createElement("div");
  actions.className = "compat-actions";
  const cancel = document.createElement("button");
  cancel.type = "button";
  cancel.textContent = "Cancel";
  cancel.addEventListener("click", () => {
    const m = document.getElementById("newGameModal");
    if (m) { m.classList.add("hidden"); m.setAttribute("aria-hidden", "true"); }
  });
  const start = document.createElement("button");
  start.type = "button";
  start.className = "accent";
  start.textContent = "Start";
  start.addEventListener("click", () => {
    const real = document.getElementById("btnStartGame");
    if (real) real.click();
  });
  actions.appendChild(cancel);
  actions.appendChild(start);
  inner.appendChild(actions);
}

function ensureModals() {
  ensureModal("newGameModal", buildNewGameModal);
  ensureModal("promotionModal", inner => {
    const h = document.createElement("h2");
    h.textContent = "Promote pawn";
    h.style.margin = "0 0 12px";
    const opts = document.createElement("div");
    opts.id = "promotionOptions";
    inner.appendChild(h);
    inner.appendChild(opts);
  });
  ensureModal("gameOverModal", inner => {
    const c = document.createElement("div");
    c.id = "gameOverContent";
    inner.appendChild(c);
  });
}

function bindProxies() {
  for (const [realId, aliasId] of Object.entries(PROXY)) {
    const real = document.getElementById(realId);
    const alias = document.getElementById(aliasId);
    if (!real || !alias || real.__proxyBound) continue;
    real.__proxyBound = true;
    real.addEventListener("click", () => {
      try { alias.click(); } catch (err) { /* ignore */ }
    });
  }
}

export const CompatShell = {
  ensure() {
    if (ENSURED) return true;
    ENSURED = true;
    try {
      injectStyleOnce();
      const shell = ensureShellContainer();
      ensureButtons(shell);
      ensureSelects(shell);
      ensureDivs(shell);
      ensureModals();
      bindProxies();
      console.info("[CompatShell] DOM shell siap (36 elemen + board CSS).");
      return true;
    } catch (e) {
      console.error("[CompatShell] gagal:", e);
      return false;
    }
  },
  _reset() { ENSURED = false; }
};

export default CompatShell;
