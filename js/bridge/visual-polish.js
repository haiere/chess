/**
 * js/bridge/visual-polish.js — v4 FINAL.
 * Semua polish CSS. Termasuk #puzzleBoard (camelCase) — sebelumnya hilang.
 */
(function () {
  "use strict";
  if (typeof document === "undefined") return;
  if (document.getElementById("visual-polish-style")) return;

  const css = `
    /* ============================================================
       1. BOARD AESTHETICS (game + puzzle)
       ============================================================ */
    #board, #puzzleBoard {
      border: 1px solid rgba(255,255,255,0.10);
      border-radius: 12px;
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,0.06),
        0 12px 40px rgba(0,0,0,0.38);
      overflow: hidden;
      position: relative;
      transition: box-shadow 0.2s ease;
    }
    [data-theme="light"] #board,
    [data-theme="light"] #puzzleBoard {
      border-color: rgba(0,0,0,0.10);
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,0.9),
        0 12px 40px rgba(0,0,0,0.14);
    }

    /* ============================================================
       2. PUZZLE BOARD — GRID FORCE (camelCase id)
       ============================================================ */
    #puzzleBoard {
      display: grid !important;
      grid-template-columns: repeat(8, 1fr) !important;
      grid-template-rows: repeat(8, 1fr) !important;
      aspect-ratio: 1 / 1;
      width: 100%;
      max-width: 640px;
      margin: 0 auto;
      gap: 0;
      overflow: hidden;
    }
    #puzzleBoard > * {
      position: relative;
      display: flex !important;
      align-items: center;
      justify-content: center;
      width: 100% !important;
      height: 100% !important;
      max-width: none !important;
      max-height: none !important;
      box-sizing: border-box;
      cursor: pointer;
      margin: 0 !important;
      padding: 0 !important;
      grid-column: auto !important;
      grid-row: auto !important;
    }
    #puzzleBoard > *.light,
    #puzzleBoard > *[data-color="light"],
    #puzzleBoard > *.sq-light { background: #f0d9b5; }
    #puzzleBoard > *.dark,
    #puzzleBoard > *[data-color="dark"],
    #puzzleBoard > *.sq-dark  { background: #b58863; }

    /* ============================================================
       3. BOARD — GAME (dash id) grid juga
       ============================================================ */
    #board {
      display: grid !important;
      grid-template-columns: repeat(8, 1fr) !important;
      grid-template-rows: repeat(8, 1fr) !important;
      aspect-ratio: 1 / 1;
      width: 100%;
      max-width: 640px;
      margin: 0 auto;
      gap: 0;
    }
    #board > * {
      position: relative;
      display: flex !important;
      align-items: center;
      justify-content: center;
      width: 100% !important;
      height: 100% !important;
      box-sizing: border-box;
      cursor: pointer;
      margin: 0 !important;
      padding: 0 !important;
    }
    #board > *.light,
    #board > *[data-color="light"] { background: #f0d9b5; }
    #board > *.dark,
    #board > *[data-color="dark"]  { background: #b58863; }

    /* Pieces */
    #board img, #puzzleBoard img {
      width: 92% !important;
      height: 92% !important;
      max-width: 92% !important;
      max-height: 92% !important;
      object-fit: contain;
      pointer-events: none;
      user-select: none;
      -webkit-user-drag: none;
      display: block;
      filter: drop-shadow(0 1px 2px rgba(0,0,0,0.38));
      transition: transform 0.12s ease;
    }
    #board > *:hover img, #puzzleBoard > *:hover img { transform: scale(1.03); }

    /* Coordinates */
    #board .coord, #board .coord-rank, #board .coord-file,
    #puzzleBoard .coord, #puzzleBoard .coord-rank, #puzzleBoard .coord-file {
      font-size: 0.6rem;
      font-weight: 700;
      letter-spacing: 0.02em;
      opacity: 0.75;
      color: rgba(0,0,0,0.85);
      text-shadow: 0 1px 1px rgba(255,255,255,0.45);
      pointer-events: none;
      user-select: none;
    }

    /* Highlight states */
    #board > *.selected, #board > *[data-selected="1"],
    #puzzleBoard > *.selected, #puzzleBoard > *[data-selected="1"] {
      box-shadow:
        inset 0 0 0 3px #3b82f6,
        inset 0 0 24px rgba(59,130,246,0.35) !important;
    }
    #board > *.legal::before, #board > *[data-legal="1"]::before,
    #puzzleBoard > *.legal::before, #puzzleBoard > *[data-legal="1"]::before {
      content: "";
      position: absolute;
      width: 26%; height: 26%;
      left: 50%; top: 50%;
      border-radius: 50%;
      background: rgba(15,20,25,0.42);
      transform: translate(-50%, -50%);
      pointer-events: none;
    }
    [data-theme="dark"] #board > *.legal::before,
    [data-theme="dark"] #puzzleBoard > *.legal::before {
      background: rgba(255,255,255,0.35);
    }
    #board > *.legal-capture::before,
    #puzzleBoard > *.legal-capture::before {
      content: "";
      position: absolute;
      inset: 6%;
      border-radius: 50%;
      border: 4px solid rgba(220,38,38,0.55);
      background: transparent;
    }
    #board > *.last-move, #board > *[data-last-move="1"],
    #puzzleBoard > *.last-move, #puzzleBoard > *[data-last-move="1"] {
      background-image: linear-gradient(rgba(250,204,21,0.28),rgba(250,204,21,0.28));
      background-blend-mode: multiply;
    }
    #board > *.check, #board > *[data-check="1"],
    #puzzleBoard > *.check, #puzzleBoard > *[data-check="1"] {
      background-image: radial-gradient(circle at 50% 50%,
        rgba(239,68,68,0.75) 22%, rgba(239,68,68,0.30) 52%, transparent 78%);
    }

    /* ============================================================
       4. BUTTONS
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
      transition: background 0.15s ease, border-color 0.15s ease,
                  transform 0.06s ease, box-shadow 0.15s ease;
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    }
    .app-main button:not(.compat-close):not(#btn-theme):hover {
      background: color-mix(in srgb, var(--app-surface) 88%, var(--app-accent));
      border-color: color-mix(in srgb, var(--app-border) 65%, var(--app-accent));
      box-shadow: 0 2px 8px rgba(0,0,0,0.10);
    }
    .app-main button:not(.compat-close):not(#btn-theme):active { transform: translateY(1px); }
    .app-main button:not(.compat-close):not(#btn-theme):focus-visible {
      outline: 2px solid var(--app-accent);
      outline-offset: 2px;
    }
    #btn-new-game, #btn-puzzle-next {
      background: var(--app-accent) !important;
      border-color: var(--app-accent) !important;
      color: #fff !important;
      font-weight: 600 !important;
      box-shadow: 0 2px 12px rgba(59,130,246,0.35) !important;
    }
    #btn-new-game:hover, #btn-puzzle-next:hover {
      background: color-mix(in srgb, var(--app-accent) 88%, #fff) !important;
      box-shadow: 0 4px 16px rgba(59,130,246,0.45) !important;
    }
    #btn-resign {
      color: #ef4444 !important;
      border-color: color-mix(in srgb, var(--app-border) 55%, #ef4444) !important;
    }
    #btn-resign:hover {
      background: color-mix(in srgb, var(--app-surface) 88%, #ef4444) !important;
    }

    /* ============================================================
       5. CARDS & HEADINGS
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
    .app-card { padding: 20px; transition: border-color 0.15s ease; }
    .app-card:hover {
      border-color: color-mix(in srgb, var(--app-border) 70%, var(--app-accent));
    }

    /* ============================================================
       6. MOVE HISTORY
       ============================================================ */
    #moveHistory {
      display: flex;
      flex-direction: column;
      max-height: 260px;
      overflow-y: auto;
      padding: 4px 0;
      font-family: Inter, system-ui, sans-serif;
    }
    #moveHistory .move-row {
      display: grid;
      grid-template-columns: 44px 1fr 1fr;
      gap: 8px;
      padding: 6px 10px;
      border-radius: 6px;
      font-size: 0.9rem;
      align-items: center;
    }
    #moveHistory .move-row:nth-child(even) { background: rgba(255,255,255,0.025); }
    [data-theme="light"] #moveHistory .move-row:nth-child(even) { background: rgba(0,0,0,0.025); }
    #moveHistory .move-row:last-child {
      background: color-mix(in srgb, var(--app-accent) 12%, transparent);
      font-weight: 600;
    }
    #moveHistory .move-number {
      color: var(--app-muted);
      font-variant-numeric: tabular-nums;
      font-size: 0.82rem;
    }
    #moveHistory .move-white, #moveHistory .move-black {
      font-weight: 500;
      font-family: ui-monospace, 'SF Mono', Menlo, monospace;
    }

    /* ============================================================
       7. LESSON LIST
       ============================================================ */
    #lessonList { display: block !important; margin-bottom: 20px; }
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
      flex-direction: row !important;
    }
    #lessonList > *:hover {
      border-color: color-mix(in srgb, var(--app-border) 55%, var(--app-accent)) !important;
      background: color-mix(in srgb, var(--app-bg) 92%, var(--app-accent)) !important;
    }
    #lessonList > *.active, #lessonList > *[aria-current="true"] {
      background: var(--app-accent-soft) !important;
      border-color: var(--app-accent) !important;
    }
    #lessonList > * > * {
      display: inline !important;
      width: auto !important;
      height: auto !important;
      min-width: 0 !important;
      max-width: 100% !important;
      position: static !important;
      flex: none !important;
      float: none !important;
      margin: 0 !important;
      padding: 0 !important;
      border: 0 !important;
      background: transparent !important;
      font-size: inherit !important;
      font-weight: inherit !important;
      color: inherit !important;
      vertical-align: middle !important;
    }
    #lessonList > * [class*="badge" i],
    #lessonList > * [class*="level" i],
    #lessonList > * [data-level] {
      display: inline-block !important;
      padding: 2px 10px !important;
      border-radius: 20px !important;
      font-size: 0.68rem !important;
      font-weight: 700 !important;
      text-transform: uppercase !important;
      letter-spacing: 0.03em !important;
      background: rgba(16,185,129,0.18) !important;
      color: #10b981 !important;
      margin-right: 8px !important;
    }
    #lessonList > * h3, #lessonList > * h4, #lessonList > * strong {
      display: inline !important;
      font-size: 1rem !important;
      font-weight: 600 !important;
      color: var(--app-text) !important;
      vertical-align: middle !important;
    }
    #lessonList > * p, #lessonList > * small {
      display: block !important;
      margin-top: 6px !important;
      font-size: 0.85rem !important;
      color: var(--app-muted) !important;
      line-height: 1.55 !important;
    }
    #lessonList:empty { display: none; }

    /* ============================================================
       8. LESSON DETAIL
       ============================================================ */
    #lessonDetail {
      display: block;
      line-height: 1.7;
      font-size: 0.95rem;
      color: var(--app-text);
      padding: 4px 0;
    }
    #lessonDetail h1, #lessonDetail h2, #lessonDetail h3 {
      margin: 20px 0 10px;
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--app-text);
    }
    #lessonDetail h1:first-child, #lessonDetail h2:first-child, #lessonDetail h3:first-child { margin-top: 0; }
    #lessonDetail p { margin: 10px 0; }
    #lessonDetail ul, #lessonDetail ol { margin: 10px 0; padding-left: 22px; }
    #lessonDetail li { margin: 6px 0; }
    #lessonDetail strong { font-weight: 600; }
    #lessonDetail code {
      background: var(--app-bg);
      padding: 2px 6px;
      border-radius: 4px;
      font-family: ui-monospace, monospace;
      font-size: 0.88em;
    }
    #lessonDetail blockquote {
      border-left: 3px solid var(--app-accent);
      padding: 6px 14px;
      margin: 12px 0;
      background: var(--app-accent-soft);
      border-radius: 0 8px 8px 0;
      color: var(--app-muted);
    }
    #lessonDetail img { max-width: 100%; height: auto; border-radius: 8px; margin: 10px 0; }
    #lessonDetail:empty { display: none; }

    #lessonProgressText {
      font-size: 0.85rem;
      color: var(--app-muted);
      margin-bottom: 12px;
      font-weight: 500;
    }

    /* ============================================================
       9. PUZZLE STATUS / STATS / INFO
       ============================================================ */
    #puzzle-status, #pzStatus {
      font-size: 0.95rem;
      font-weight: 500;
      color: var(--app-text);
      display: block;
      margin-top: 10px;
    }
    #puzzle-status:empty, #pzStatus:empty { display: none; }
    #pzStats, #pzInfo {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px solid var(--app-border);
      font-size: 0.82rem;
      color: var(--app-muted);
    }
    #pzStats:empty, #pzInfo:empty { display: none; border: 0; padding: 0; margin: 0; }
    #pzDifficulty {
      position: absolute !important;
      left: -9999px !important;
      width: 0 !important;
      height: 0 !important;
    }

    /* ============================================================
       10. PUZZLE CONTAINER
       ============================================================ */
    #puzzle-board-container {
      display: flex !important;
      flex-direction: column;
      gap: 12px;
    }
    #puzzle-board-container .board {
      width: 100%;
      max-width: 640px;
      margin: 0 auto;
    }

    /* ============================================================
       11. TOAST / MODAL / HEADER / NAV
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
    .modal-overlay[data-compat="1"] > .compat-inner {
      animation: modalIn 0.22s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes modalIn {
      from { opacity: 0; transform: translateY(10px) scale(0.98); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    .app-header {
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      background: color-mix(in srgb, var(--app-surface) 92%, transparent);
    }
    .app-brand { transition: opacity 0.15s ease; }
    .app-brand:hover { opacity: 0.85; }
    .lang-switcher__select { border-radius: 10px; transition: border-color 0.15s ease; }
    .lang-switcher__select:hover {
      border-color: color-mix(in srgb, var(--app-border) 60%, var(--app-accent));
    }
    .app-nav a { transition: background 0.15s ease, color 0.15s ease, transform 0.1s ease; }
    .app-nav a:hover { transform: translateX(2px); }
    .app-bottomnav a { transition: color 0.15s ease, transform 0.1s ease; }
    .app-bottomnav a:active { transform: scale(0.94); }

    /* ============================================================
       12. RESPONSIVE
       ============================================================ */
    @media (max-width: 480px) {
      .app-page-title { font-size: 1.3rem; }
      .app-main { padding: 14px 10px; }
      .app-card { padding: 14px; }
      #moveHistory { max-height: 200px; }
      #moveHistory .move-row { padding: 5px 8px; font-size: 0.85rem; grid-template-columns: 38px 1fr 1fr; }
      #board .coord, #puzzleBoard .coord { font-size: 0.55rem; }
    }

    /* ============================================================
       13. REDUCED MOTION
       ============================================================ */
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.001ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.001ms !important;
        scroll-behavior: auto !important;
      }
      #board img, #board > *:hover img,
      #puzzleBoard img, #puzzleBoard > *:hover img { transform: none !important; }
      .app-nav a:hover { transform: none !important; }
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

  console.info("[VisualPolish] v4 FINAL diterapkan (" + css.length + " bytes).");
})();

export {};
