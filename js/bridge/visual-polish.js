/**
 * js/bridge/visual-polish.js — ESM.
 * Inject CSS polish ke <head>. Tidak mengubah struktur DOM.
 * Fokus: board aesthetics, highlight states, buttons, move history, toast.
 *
 * Impor setelah game-bridge.js agar CSS-nya menimpa compat-shell default.
 */
(function () {
  "use strict";
  if (typeof document === "undefined") return;
  if (document.getElementById("visual-polish-style")) return;

  const css = `
    /* ============================================================
       BOARD AESTHETICS
       ============================================================ */
    #board {
      border: 1px solid rgba(255,255,255,0.10);
      border-radius: 12px;
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,0.06),
        0 12px 40px rgba(0,0,0,0.38);
      overflow: hidden;
      position: relative;
      transition: box-shadow 0.2s ease;
    }

    [data-theme="light"] #board {
      border-color: rgba(0,0,0,0.10);
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,0.9),
        0 12px 40px rgba(0,0,0,0.14);
    }

    /* Piece drop shadow + subtle scale on hover */
    #board img {
      filter: drop-shadow(0 1px 2px rgba(0,0,0,0.38));
      transition: transform 0.12s ease;
    }
    #board > *:hover img { transform: scale(1.03); }

    /* Coordinate labels */
    #board .coord,
    #board .coord-rank,
    #board .coord-file {
      font-size: 0.6rem;
      font-weight: 700;
      letter-spacing: 0.02em;
      opacity: 0.75;
      color: rgba(0,0,0,0.85);
      text-shadow: 0 1px 1px rgba(255,255,255,0.45);
      pointer-events: none;
      user-select: none;
    }

    /* ============================================================
       HIGHLIGHT STATES
       ============================================================ */

    /* Selected square — blue glow */
    #board > *.selected,
    #board > *[data-selected="1"] {
      box-shadow:
        inset 0 0 0 3px #3b82f6,
        inset 0 0 24px rgba(59,130,246,0.35) !important;
    }

    /* Legal move (empty) — centered dot */
    #board > *.legal::before,
    #board > *[data-legal="1"]::before {
      content: "";
      position: absolute;
      width: 26%;
      height: 26%;
      left: 50%;
      top: 50%;
      border-radius: 50%;
      background: rgba(15,20,25,0.42);
      transform: translate(-50%, -50%);
      pointer-events: none;
    }

    [data-theme="dark"] #board > *.legal::before,
    [data-theme="dark"] #board > *[data-legal="1"]::before {
      background: rgba(255,255,255,0.35);
    }

    /* Legal capture — red ring */
    #board > *.legal-capture::before,
    #board > *.legal.capture::before {
      content: "";
      position: absolute;
      inset: 6%;
      left: 6%;
      top: 6%;
      width: auto;
      height: auto;
      border-radius: 50%;
      border: 4px solid rgba(220,38,38,0.55);
      background: transparent;
      transform: none;
    }

    /* Last move — soft yellow wash */
    #board > *.last-move,
    #board > *[data-last-move="1"] {
      background-image: linear-gradient(
        rgba(250,204,21,0.28),
        rgba(250,204,21,0.28)
      );
      background-blend-mode: multiply;
    }

    /* Check — radial red pulse */
    #board > *.check,
    #board > *[data-check="1"] {
      background-image:
        radial-gradient(circle at 50% 50%,
          rgba(239,68,68,0.75) 22%,
          rgba(239,68,68,0.30) 52%,
          transparent 78%);
    }

    /* ============================================================
       BUTTONS (main content area)
       ============================================================ */
    .app-main button:not(.compat-close):not(#btn-theme) {
      padding: 10px 16px;
      border-radius: 10px;
      border: 1px solid var(--app-border);
      background: var(--app-surface);
      color: var(--app-text);
      font: inherit;
      font-weight: 500;
      font-size: 0.9rem;
      cursor: pointer;
      min-height: 42px;
      transition:
        background 0.15s ease,
        border-color 0.15s ease,
        transform 0.06s ease,
        box-shadow 0.15s ease;
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    }

    .app-main button:not(.compat-close):not(#btn-theme):hover {
      background: color-mix(in srgb, var(--app-surface) 88%, var(--app-accent));
      border-color: color-mix(in srgb, var(--app-border) 65%, var(--app-accent));
      box-shadow: 0 2px 8px rgba(0,0,0,0.10);
    }

    .app-main button:not(.compat-close):not(#btn-theme):active {
      transform: translateY(1px);
    }

    .app-main button:not(.compat-close):not(#btn-theme):focus-visible {
      outline: 2px solid var(--app-accent);
      outline-offset: 2px;
    }

    /* Primary — New Game */
    #btn-new-game {
      background: var(--app-accent) !important;
      border-color: var(--app-accent) !important;
      color: #ffffff !important;
      font-weight: 600 !important;
      box-shadow: 0 2px 12px rgba(59,130,246,0.35) !important;
    }
    #btn-new-game:hover {
      background: color-mix(in srgb, var(--app-accent) 88%, #ffffff) !important;
      box-shadow: 0 4px 16px rgba(59,130,246,0.45) !important;
    }

    /* Destructive — Resign */
    #btn-resign {
      color: #ef4444 !important;
      border-color: color-mix(in srgb, var(--app-border) 55%, #ef4444) !important;
    }
    #btn-resign:hover {
      background: color-mix(in srgb, var(--app-surface) 88%, #ef4444) !important;
    }

    /* ============================================================
       PAGE HEADINGS & CARDS
       ============================================================ */
    .app-page-title {
      font-size: 1.5rem;
      font-weight: 700;
      letter-spacing: -0.015em;
      margin-bottom: 2px;
    }
    .app-page-subtitle {
      font-size: 0.95rem;
      font-weight: 400;
      margin-bottom: 22px;
    }

    .app-card {
      padding: 20px;
      transition: border-color 0.15s ease;
    }
    .app-card:hover {
      border-color: color-mix(in srgb, var(--app-border) 70%, var(--app-accent));
    }

    /* ============================================================
       MOVE HISTORY
       ============================================================ */
    #moveHistory {
      display: flex;
      flex-direction: column;
      gap: 0;
      max-height: 260px;
      overflow-y: auto;
      padding: 4px 0;
      font-family: Inter, system-ui, sans-serif;
      scrollbar-width: thin;
    }

    #moveHistory .move-row {
      display: grid;
      grid-template-columns: 44px 1fr 1fr;
      gap: 8px;
      padding: 6px 10px;
      border-radius: 6px;
      font-size: 0.9rem;
      align-items: center;
      transition: background 0.1s ease;
    }

    #moveHistory .move-row:nth-child(even) {
      background: rgba(255,255,255,0.025);
    }
    [data-theme="light"] #moveHistory .move-row:nth-child(even) {
      background: rgba(0,0,0,0.025);
    }

    #moveHistory .move-row:last-child {
      background: color-mix(in srgb, var(--app-accent) 12%, transparent);
      font-weight: 600;
    }

    #moveHistory .move-number {
      color: var(--app-muted);
      font-variant-numeric: tabular-nums;
      font-size: 0.82rem;
      font-weight: 500;
    }

    #moveHistory .move-white,
    #moveHistory .move-black {
      font-weight: 500;
      font-family: ui-monospace, 'SF Mono', Menlo, monospace;
      letter-spacing: -0.01em;
    }

    /* ============================================================
       STATUS
       ============================================================ */
    #game-status {
      font-weight: 500;
      color: var(--app-muted);
      font-size: 0.95rem;
      transition: color 0.15s ease;
    }

    /* ============================================================
       TOAST
       ============================================================ */
    #toastContainer .toast {
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      background: color-mix(in srgb, var(--app-surface) 90%, transparent);
      animation: toastIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      font-weight: 500;
    }

    @keyframes toastIn {
      from { opacity: 0; transform: translateY(8px) scale(0.98); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }

    /* ============================================================
       MODAL POLISH
       ============================================================ */
    .modal-overlay[data-compat="1"] > .compat-inner {
      animation: modalIn 0.22s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes modalIn {
      from { opacity: 0; transform: translateY(10px) scale(0.98); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }

    /* ============================================================
       HEADER POLISH
       ============================================================ */
    .app-header {
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      background: color-mix(in srgb, var(--app-surface) 92%, transparent);
    }

    .app-brand {
      transition: opacity 0.15s ease;
    }
    .app-brand:hover { opacity: 0.85; }

    /* Language switcher select — cleaner look */
    .lang-switcher__select {
      border-radius: 10px;
      transition: border-color 0.15s ease;
    }
    .lang-switcher__select:hover {
      border-color: color-mix(in srgb, var(--app-border) 60%, var(--app-accent));
    }

    /* ============================================================
       NAV POLISH
       ============================================================ */
    .app-nav a {
      transition:
        background 0.15s ease,
        color 0.15s ease,
        transform 0.1s ease;
    }
    .app-nav a:hover {
      transform: translateX(2px);
    }

    .app-bottomnav a {
      transition: color 0.15s ease, transform 0.1s ease;
    }
    .app-bottomnav a:active {
      transform: scale(0.94);
    }

    /* ============================================================
       RESPONSIVE TWEAKS
       ============================================================ */
    @media (max-width: 480px) {
      .app-page-title { font-size: 1.3rem; }
      .app-main { padding: 14px 10px; }
      .app-card { padding: 14px; }
      #moveHistory { max-height: 200px; }
      #moveHistory .move-row {
        padding: 5px 8px;
        font-size: 0.85rem;
        grid-template-columns: 38px 1fr 1fr;
      }
      #board .coord { font-size: 0.55rem; }
    }

    /* ============================================================
       REDUCED MOTION
       ============================================================ */
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.001ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.001ms !important;
        scroll-behavior: auto !important;
      }
      #board img, #board > *:hover img { transform: none !important; }
      .app-nav a:hover { transform: none !important; }
    }
    /* ============================================================
   LESSON LIST & DETAIL
   ============================================================ */
#lessonList {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 20px;
}
#lessonList > * {
  padding: 12px 16px;
  border-radius: 10px;
  background: var(--app-bg);
  border: 1px solid var(--app-border);
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: background 0.15s ease, border-color 0.15s ease;
}
#lessonList > *:hover {
  border-color: color-mix(in srgb, var(--app-border) 55%, var(--app-accent));
  background: color-mix(in srgb, var(--app-bg) 92%, var(--app-accent));
}
#lessonList > *.active,
#lessonList > *[aria-current="true"],
#lessonList > *[aria-selected="true"] {
  background: var(--app-accent-soft);
  border-color: var(--app-accent);
  color: var(--app-accent);
  font-weight: 600;
}
#lessonList:empty { display: none; }

#lessonDetail {
  line-height: 1.65;
  font-size: 0.95rem;
}
#lessonDetail h2,
#lessonDetail h3 {
  margin: 16px 0 8px;
  font-size: 1.05rem;
  font-weight: 700;
}
#lessonDetail h2:first-child,
#lessonDetail h3:first-child { margin-top: 0; }
#lessonDetail p { margin: 8px 0; }
#lessonDetail ul,
#lessonDetail ol {
  margin: 8px 0;
  padding-left: 20px;
}
#lessonDetail li { margin: 4px 0; }
#lessonDetail img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 8px 0;
}
#lessonDetail code {
  background: var(--app-bg);
  padding: 1px 6px;
  border-radius: 4px;
  font-family: ui-monospace, monospace;
  font-size: 0.9em;
}
#lessonDetail:empty { display: none; }

#lessonProgressText {
  font-size: 0.85rem;
  color: var(--app-muted);
  margin-bottom: 12px;
  font-weight: 500;
}

/* Puzzle status / progress */
#puzzle-status {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--app-text);
}
#puzzle-status:empty { display: none; }

/* Puzzle board container match game board */
#puzzle-board-container .board,
#puzzle-board-container #puzzle-board {
  display: grid !important;
  grid-template-columns: repeat(8, 1fr) !important;
  grid-template-rows: repeat(8, 1fr) !important;
  aspect-ratio: 1 / 1;
  width: 100%;
  max-width: 640px;
  margin: 0 auto;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(0,0,0,0.38);
}

/* ============================================================
   LESSON LIST — reset layout berantakan
   ============================================================ */
#lessonList {
  display: block !important;
  margin-bottom: 20px;
}

#lessonList > * {
  display: block !important;
  padding: 14px 16px !important;
  border-radius: 10px !important;
  background: var(--app-bg) !important;
  border: 1px solid var(--app-border) !important;
  cursor: pointer;
  margin-bottom: 8px !important;
  transition: border-color 0.15s ease, background 0.15s ease;
  line-height: 1.55;
  word-break: normal !important;
  overflow-wrap: break-word !important;
  hyphens: none !important;
  white-space: normal !important;
  grid-template-columns: none !important;
  grid-template-rows: none !important;
  flex-direction: row !important;
  gap: 0 !important;
}

#lessonList > *:hover {
  border-color: color-mix(in srgb, var(--app-border) 55%, var(--app-accent)) !important;
  background: color-mix(in srgb, var(--app-bg) 92%, var(--app-accent)) !important;
}

#lessonList > *.active,
#lessonList > *[aria-current="true"],
#lessonList > *[aria-selected="true"] {
  background: var(--app-accent-soft) !important;
  border-color: var(--app-accent) !important;
}

/* Reset children — inline flow natural */
#lessonList > * > * {
  display: inline !important;
  width: auto !important;
  height: auto !important;
  min-width: 0 !important;
  max-width: 100% !important;
  position: static !important;
  grid-column: auto !important;
  grid-row: auto !important;
  flex: none !important;
  float: none !important;
  margin: 0 !important;
  padding: 0 !important;
  border: 0 !important;
  background: transparent !important;
  font-size: inherit !important;
  font-weight: inherit !important;
  color: inherit !important;
  line-height: inherit !important;
  vertical-align: middle !important;
}

/* Level badge */
#lessonList > * [class*="badge" i],
#lessonList > * [class*="level" i],
#lessonList > * [class*="tag" i],
#lessonList > * [data-level] {
  display: inline-block !important;
  padding: 2px 10px !important;
  border-radius: 20px !important;
  font-size: 0.68rem !important;
  font-weight: 700 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.03em !important;
  background: rgba(16, 185, 129, 0.18) !important;
  color: #10b981 !important;
  margin-right: 8px !important;
  vertical-align: middle !important;
}

/* Title */
#lessonList > * h3,
#lessonList > * h4,
#lessonList > * [class*="title" i],
#lessonList > * strong {
  display: inline !important;
  font-size: 1rem !important;
  font-weight: 600 !important;
  color: var(--app-text) !important;
  vertical-align: middle !important;
}

/* Description & steps */
#lessonList > * p,
#lessonList > * [class*="desc" i],
#lessonList > * [class*="steps" i],
#lessonList > * small {
  display: block !important;
  margin-top: 6px !important;
  font-size: 0.85rem !important;
  color: var(--app-muted) !important;
  font-weight: 400 !important;
  line-height: 1.55 !important;
}

/* ============================================================
   PUZZLE BOARD — pastikan grid
   ============================================================ */
#puzzle-board {
  display: grid !important;
  grid-template-columns: repeat(8, 1fr) !important;
  grid-template-rows: repeat(8, 1fr) !important;
  aspect-ratio: 1 / 1;
  width: 100%;
  max-width: 640px;
  margin: 0 auto;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(0,0,0,0.38);
}
#puzzle-board > * {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  cursor: pointer;
}
#puzzle-board > *.light,
#puzzle-board > *[data-color="light"] { background: #f0d9b5; }
#puzzle-board > *.dark,
#puzzle-board > *[data-color="dark"]  { background: #b58863; }
#puzzle-board img {
  width: 92%;
  height: 92%;
  object-fit: contain;
  pointer-events: none;
  display: block;
}
#puzzle-board > *.selected { box-shadow: inset 0 0 0 3px #3b82f6; }
#puzzle-board > *.legal::before {
  content: "";
  position: absolute;
  width: 26%;
  height: 26%;
  left: 50%; top: 50%;
  border-radius: 50%;
  background: rgba(15,20,25,0.42);
  transform: translate(-50%, -50%);
}
#puzzle-board > *.last-move { background-image: linear-gradient(rgba(250,204,21,0.28),rgba(250,204,21,0.28)); }
#puzzle-board > *.check { background-image: radial-gradient(circle, rgba(239,68,68,0.75) 22%, transparent 78%); }

  /* ============================================================
   PUZZLE BOARD (camelCase id dari puzzle.js)
   ============================================================ */
#puzzleBoard {
  display: grid !important;
  grid-template-columns: repeat(8, 1fr) !important;
  grid-template-rows: repeat(8, 1fr) !important;
  aspect-ratio: 1 / 1;
  width: 100%;
  max-width: 640px;
  margin: 0 auto;
  border-radius: 12px;
  overflow: hidden;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.06),
    0 12px 40px rgba(0,0,0,0.38);
  border: 1px solid rgba(255,255,255,0.10);
}
[data-theme="light"] #puzzleBoard {
  border-color: rgba(0,0,0,0.10);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.9),
    0 12px 40px rgba(0,0,0,0.14);
}

#puzzleBoard > * {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  cursor: pointer;
}
#puzzleBoard > *.light,
#puzzleBoard > *[data-color="light"] { background: #f0d9b5; }
#puzzleBoard > *.dark,
#puzzleBoard > *[data-color="dark"]  { background: #b58863; }
#puzzleBoard img {
  width: 92%;
  height: 92%;
  object-fit: contain;
  pointer-events: none;
  user-select: none;
  -webkit-user-drag: none;
  display: block;
  filter: drop-shadow(0 1px 2px rgba(0,0,0,0.38));
}
#puzzleBoard > *.selected { box-shadow: inset 0 0 0 3px #3b82f6; }
#puzzleBoard > *.legal::before {
  content: "";
  position: absolute;
  width: 26%; height: 26%;
  left: 50%; top: 50%;
  border-radius: 50%;
  background: rgba(15,20,25,0.42);
  transform: translate(-50%, -50%);
}
[data-theme="dark"] #puzzleBoard > *.legal::before { background: rgba(255,255,255,0.35); }
#puzzleBoard > *.last-move { background-image: linear-gradient(rgba(250,204,21,0.28),rgba(250,204,21,0.28)); }
#puzzleBoard > *.check { background-image: radial-gradient(circle, rgba(239,68,68,0.75) 22%, transparent 78%); }

/* Puzzle status/stats/info */
#pzStatus, #pzStats, #pzInfo {
  display: block;
  margin-top: 12px;
  font-size: 0.9rem;
  color: var(--app-text);
  line-height: 1.6;
}
#pzStats, #pzInfo {
  color: var(--app-muted);
  font-size: 0.85rem;
}
#pzStats:empty, #pzInfo:empty, #pzStatus:empty { display: none; }

/* Difficulty select shim — hidden, karena kita pakai #puzzle-difficulty visible */
#pzDifficulty {
  position: absolute !important;
  left: -9999px !important;
  width: 0 !important;
  height: 0 !important;
}

/* Puzzle card container spacing */
#puzzle-board-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
#puzzle-board-container .board {
  width: 100%;
  max-width: 640px;
  margin: 0 auto;
}
  `;

  const style = document.createElement("style");
  style.id = "visual-polish-style";
  style.textContent = css;

  if (document.head) {
    document.head.appendChild(style);
  } else {
    document.addEventListener("DOMContentLoaded", () => {
      document.head.appendChild(style);
    }, { once: true });
  }

  console.info("[VisualPolish] CSS polish v1 diterapkan.");
})();

export {};
