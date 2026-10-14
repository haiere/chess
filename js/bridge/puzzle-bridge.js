/**
 * js/bridge/puzzle-bridge.js — v3.
 * Sama seperti learn-bridge: shim ke container visible.
 * Karena kita belum tahu persis struktur puzzle.js, kita pakai heuristic:
 *   - papan/puzzle* → #puzzle-board-container (visible)
 *   - status/progress → #puzzle-board-container juga
 *   - btn* → hidden (diproxy dari tombol baru)
 */
import { IDShim } from "./id-shim.js";

let MOUNTED = false;
let instance = null;
const $ = id => document.getElementById(id);

function placeholderText(key) {
  const lang = window.I18n ? window.I18n.getLang() : "id";
  const texts = {
    id: {
      noPuzzleMode: "Modul teka-teki belum tersedia. Buka Console untuk detail.",
      initFailed: "Modul teka-teki gagal diinisialisasi. Buka Console untuk detail."
    },
    en: {
      noPuzzleMode: "Puzzle module not available. Check Console.",
      initFailed: "Puzzle module failed to initialize. Check Console."
    }
  };
  return (texts[lang] || texts.id)[key];
}

function showPlaceholder(msg) {
  const container = $("puzzle-board-container") || $("puzzle-board");
  if (!container) return;
  const old = container.querySelector(".app-placeholder");
  if (old) old.remove();
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

function bindNewButtonsToOld() {
  const map = [
    ["btn-puzzle-hint", "btnPuzzleHint"],
    ["btn-puzzle-hint", "btnHint"],
    ["btn-puzzle-retry", "btnPuzzleRetry"],
    ["btn-puzzle-retry", "btnRetry"],
    ["btn-puzzle-next", "btnPuzzleNext"],
    ["btn-puzzle-next", "btnNext"],
    ["btn-puzzle-solution", "btnPuzzleSolution"],
    ["btn-puzzle-solution", "btnShowSolution"]
  ];
  const bound = new Set();
  for (const [newId, oldId] of map) {
    if (bound.has(newId)) continue;
    const btn = $(newId);
    if (!btn || btn.__bridgeBound) continue;
    // Cari target: coba semua kemungkinan oldId
    const candidates = map.filter(m => m[0] === newId).map(m => m[1]);
    const existing = candidates.find(c => $(c));
    if (!existing) continue;
    btn.__bridgeBound = true;
    bound.add(newId);
    btn.addEventListener("click", () => {
      const target = $(existing);
      if (target) target.click();
    });
  }
}

export const PuzzleBridge = {
  init() {
    if (MOUNTED) return instance;
    MOUNTED = true;
    console.info("[PuzzleBridge] ---- init ----");

    const boardEl = $("puzzle-board");
    if (!boardEl) {
      console.warn("[PuzzleBridge] #puzzle-board tidak ada.");
      return null;
    }

    const PM = window.PuzzleMode;
    console.info("[PuzzleBridge] PuzzleMode:", typeof PM, "init:", typeof (PM && PM.init));
    if (!PM || typeof PM.init !== "function") {
      showPlaceholder(placeholderText("noPuzzleMode"));
      return null;
    }

    const old = (boardEl.parentNode || boardEl).querySelector?.(".app-placeholder");
    if (old) old.remove();

    console.info("[PuzzleBridge] memanggil PuzzleMode.init() dengan IDShim (visible)...");
    const result = IDShim.runWithShim(function () {
      try { PM.init(); }
      catch (e) { console.warn("[PuzzleBridge] PuzzleMode.init() threw:", e); }
    }, {
      visibleContainerId: "puzzle-board-container",
      containerFor: function (id) {
        const lower = id.toLowerCase();
        // Status/progress → di bawah board, atau di body
        if (lower.includes("status")) return document.getElementById("puzzle-status");
        if (lower.includes("progress")) return document.getElementById("puzzle-status");
        return null;
      }
    });

    console.info("[PuzzleBridge] ID diminta:", result.requestedIds);
    console.info("[PuzzleBridge] ID di-shim:", result.createdIds);
    console.info("[PuzzleBridge] puzzle-board children:", boardEl.children.length);

    bindNewButtonsToOld();

    instance = PM;
    console.info("[PuzzleBridge] ✓ selesai.");
    return instance;
  },

  getInstance() { return instance; },
  _reset() { MOUNTED = false; instance = null; }
};

if (typeof window !== "undefined") window.PuzzleBridge = PuzzleBridge;

/* AUTO-INIT */
(function () {
  if (typeof window === "undefined") return;
  if (window.__PuzzleBridgeAutoInit) return;
  window.__PuzzleBridgeAutoInit = true;

  function routeIsPuzzle() {
    return (location.hash || "").replace(/^#\/?/, "").trim() === "puzzle";
  }

  let attempts = 0;
  const interval = setInterval(function () {
    attempts++;
    if (routeIsPuzzle() && !PuzzleBridge.getInstance()) {
      if (PuzzleBridge.init()) clearInterval(interval);
    }
    if (attempts > 120) clearInterval(interval);
  }, 500);

  window.addEventListener("hashchange", function () {
    if (routeIsPuzzle() && !PuzzleBridge.getInstance()) {
      setTimeout(function () { PuzzleBridge.init(); }, 100);
    }
  });
})();

export default PuzzleBridge;
