/**
 * js/bridge/visual-polish.js — v5 SELF-HEALING.
 * - Retry inject kalau belum ada setelah 100ms, 500ms, 1s, 2s, 3s
 * - Cek setiap 1s apakah masih ada, re-inject kalau hilang
 * - Global marker window.__VisualPolishV5
 */
(function () {
  "use strict";
  if (typeof document === "undefined") return;
  if (window.__VisualPolishV5) return;
  window.__VisualPolishV5 = true;

  const CSS_TEXT = `
    #board, #puzzleBoard {
      border: 1px solid rgba(255,255,255,0.10);
      border-radius: 12px;
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,0.06),
        0 12px 40px rgba(0,0,0,0.38);
      overflow: hidden;
      position: relative;
    }
    [data-theme="light"] #board,
    [data-theme="light"] #puzzleBoard {
      border-color: rgba(0,0,0,0.10);
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,0.9),
        0 12px 40px rgba(0,0,0,0.14);
    }
    #puzzleBoard, #board {
      display: grid !important;
      grid-template-columns: repeat(8, 1fr) !important;
      grid-template-rows: repeat(8, 1fr) !important;
      aspect-ratio: 1 / 1;
      width: 100%;
      max-width: 640px;
      margin: 0 auto;
      gap: 0;
    }
    #puzzleBoard > *, #board > * {
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
    #puzzleBoard > *.light, #puzzleBoard > *[data-color="light"],
    #board > *.light, #board > *[data-color="light"] { background: #f0d9b5; }
    #puzzleBoard > *.dark, #puzzleBoard > *[data-color="dark"],
    #board > *.dark, #board > *[data-color="dark"]  { background: #b58863; }
    #board img, #puzzleBoard img {
      width: 92% !important;
      height: 92% !important;
      object-fit: contain;
      pointer-events: none;
      user-select: none;
      -webkit-user-drag: none;
      display: block;
      filter: drop-shadow(0 1px 2px rgba(0,0,0,0.38));
    }
    #board .coord, #puzzleBoard .coord,
    #board .coord-rank, #puzzleBoard .coord-rank,
    #board .coord-file, #puzzleBoard .coord-file {
      font-size: 0.6rem; font-weight: 700; opacity: 0.75;
      color: rgba(0,0,0,0.85);
      text-shadow: 0 1px 1px rgba(255,255,255,0.45);
      pointer-events: none;
    }
    #board > *.selected, #puzzleBoard > *.selected {
      box-shadow: inset 0 0 0 3px #3b82f6, inset 0 0 24px rgba(59,130,246,0.35) !important;
    }
    #board > *.legal::before, #puzzleBoard > *.legal::before {
      content: ""; position: absolute;
      width: 26%; height: 26%; left: 50%; top: 50%;
      border-radius: 50%; background: rgba(15,20,25,0.42);
      transform: translate(-50%,-50%); pointer-events: none;
    }
    [data-theme="dark"] #board > *.legal::before,
    [data-theme="dark"] #puzzleBoard > *.legal::before { background: rgba(255,255,255,0.35); }
    #board > *.last-move, #puzzleBoard > *.last-move {
      background-image: linear-gradient(rgba(250,204,21,0.28),rgba(250,204,21,0.28));
    }
    #board > *.check, #puzzleBoard > *.check {
      background-image: radial-gradient(circle, rgba(239,68,68,0.75) 22%, transparent 78%);
    }

    .app-main button:not(.compat-close):not(#btn-theme) {
      padding: 10px 16px; border-radius: 10px;
      border: 1px solid var(--app-border);
      background: var(--app-surface); color: var(--app-text);
      font: inherit; font-weight: 500; font-size: 0.9rem;
      cursor: pointer; min-height: 42px;
      transition: background 0.15s ease, border-color 0.15s ease, transform 0.06s ease;
    }
    .app-main button:not(.compat-close):not(#btn-theme):hover {
      background: color-mix(in srgb, var(--app-surface) 88%, var(--app-accent));
      border-color: color-mix(in srgb, var(--app-border) 65%, var(--app-accent));
    }
    .app-main button:not(.compat-close):not(#btn-theme):focus-visible {
      outline: 2px solid var(--app-accent); outline-offset: 2px;
    }
    #btn-new-game, #btn-puzzle-next {
      background: var(--app-accent) !important;
      border-color: var(--app-accent) !important;
      color: #fff !important;
      font-weight: 600 !important;
      box-shadow: 0 2px 12px rgba(59,130,246,0.35) !important;
    }
    #btn-resign {
      color: #ef4444 !important;
      border-color: color-mix(in srgb, var(--app-border) 55%, #ef4444) !important;
    }
    #btn-resign:hover {
      background: color-mix(in srgb, var(--app-surface) 88%, #ef4444) !important;
    }

    .app-page-title { font-size: 1.5rem; font-weight: 700; letter-spacing: -0.015em; }
    .app-page-subtitle { font-size: 0.95rem; margin-bottom: 22px; }

    #moveHistory {
      display: flex; flex-direction: column;
      max-height: 260px; overflow-y: auto; padding: 4px 0;
    }
    #moveHistory .move-row {
      display: grid; grid-template-columns: 44px 1fr 1fr;
      gap: 8px; padding: 6px 10px; border-radius: 6px; font-size: 0.9rem;
    }
    #moveHistory .move-row:nth-child(even) { background: rgba(255,255,255,0.025); }
    #moveHistory .move-row:last-child {
      background: color-mix(in srgb, var(--app-accent) 12%, transparent);
      font-weight: 600;
    }
    #moveHistory .move-number {
      color: var(--app-muted); font-variant-numeric: tabular-nums; font-size: 0.82rem;
    }
    #moveHistory .move-white, #moveHistory .move-black {
      font-weight: 500; font-family: ui-monospace, Menlo, monospace;
    }

    #lessonList { display: block !important; margin-bottom: 20px; }
    #lessonList > * {
      display: block !important; padding: 14px 16px !important;
      border-radius: 10px !important;
      background: var(--app-bg) !important;
      border: 1px solid var(--app-border) !important;
      cursor: pointer; margin-bottom: 8px !important; line-height: 1.55;
    }
    #lessonList > *:hover {
      border-color: color-mix(in srgb, var(--app-border) 55%, var(--app-accent)) !important;
      background: color-mix(in srgb, var(--app-bg) 92%, var(--app-accent)) !important;
    }
    #lessonList > * > * {
      display: inline !important; width: auto !important; height: auto !important;
      min-width: 0 !important; position: static !important; flex: none !important;
      margin: 0 !important; padding: 0 !important; border: 0 !important;
      background: transparent !important; font-size: inherit !important;
      vertical-align: middle !important;
    }
    #lessonList > * [class*="badge" i],
    #lessonList > * [class*="level" i] {
      display: inline-block !important; padding: 2px 10px !important;
      border-radius: 20px !important; font-size: 0.68rem !important;
      font-weight: 700 !important; text-transform: uppercase !important;
      background: rgba(16,185,129,0.18) !important; color: #10b981 !important;
      margin-right: 8px !important;
    }
    #lessonList > * h3, #lessonList > * h4, #lessonList > * strong {
      display: inline !important; font-size: 1rem !important;
      font-weight: 600 !important; vertical-align: middle !important;
    }
    #lessonList > * p, #lessonList > * small {
      display: block !important; margin-top: 6px !important;
      font-size: 0.85rem !important; color: var(--app-muted) !important;
    }

    #lessonDetail {
      display: block; line-height: 1.7; font-size: 0.95rem; padding: 4px 0;
    }
    #lessonDetail h1, #lessonDetail h2, #lessonDetail h3 {
      margin: 20px 0 10px; font-size: 1.1rem; font-weight: 700;
    }
    #lessonDetail p { margin: 10px 0; }
    #lessonDetail ul, #lessonDetail ol { margin: 10px 0; padding-left: 22px; }
    #lessonDetail li { margin: 6px 0; }
    #lessonDetail:empty { display: none; }

    #puzzle-status, #pzStatus {
      font-size: 0.95rem; font-weight: 500; display: block; margin-top: 10px;
    }
    #pzStats, #pzInfo {
      display: flex; flex-wrap: wrap; gap: 12px;
      margin-top: 10px; padding-top: 10px;
      border-top: 1px solid var(--app-border);
      font-size: 0.82rem; color: var(--app-muted);
    }
    #pzDifficulty {
      position: absolute !important;
      left: -9999px !important;
      width: 0 !important; height: 0 !important;
    }
    #puzzle-board-container { display: flex !important; flex-direction: column; gap: 12px; }

    #toastContainer .toast {
      backdrop-filter: blur(10px);
      background: color-mix(in srgb, var(--app-surface) 90%, transparent);
      font-weight: 500;
    }
    .app-header {
      backdrop-filter: blur(10px);
      background: color-mix(in srgb, var(--app-surface) 92%, transparent);
    }
    .lang-switcher__select { border-radius: 10px; }
    .app-nav a { transition: background 0.15s ease, color 0.15s ease; }
    .app-bottomnav a:active { transform: scale(0.94); }

    @media (max-width: 480px) {
      .app-page-title { font-size: 1.3rem; }
      .app-main { padding: 14px 10px; }
      .app-card { padding: 14px; }
      #board .coord, #puzzleBoard .coord { font-size: 0.55rem; }
    }
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.001ms !important;
        transition-duration: 0.001ms !important;
      }
    }
  `;

  function inject() {
    if (!document.head) return false;
    if (document.getElementById("visual-polish-style")) return true;
    const s = document.createElement("style");
    s.id = "visual-polish-style";
    s.textContent = CSS_TEXT;
    document.head.appendChild(s);
    console.info("[VisualPolish v5] Style injected (" + CSS_TEXT.length + " bytes).");
    return true;
  }

  // Inject immediately
  if (!inject()) {
    // Retry if head not ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", inject, { once: true });
    }
  }

  // Retry dengan backoff untuk environment yang aneh
  [100, 500, 1000, 2000, 3000].forEach(ms => setTimeout(inject, ms));

  // Watchdog: cek setiap 2 detik, re-inject kalau hilang
  setInterval(() => {
    if (!document.getElementById("visual-polish-style")) {
      console.warn("[VisualPolish v5] Style hilang, re-inject...");
      inject();
    }
  }, 2000);

  // Expose untuk diagnostic
  window.__visualPolishBytes = CSS_TEXT.length;
})();

export {};
