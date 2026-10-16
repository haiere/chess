/**
 * js/bridge/puzzle-bridge.js — v5.
 * Tambahan: setelah init, auto-load puzzle pertama.
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
  const container = $("puzzle-board-container");
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

function prepareContainer() {
  const container = $("puzzle-board-container");
  if (!container) return;
  const oldBoard = $("puzzle-board");
  if (oldBoard) {
    oldBoard.style.display = "none";
    oldBoard.setAttribute("aria-hidden", "true");
  }
  const old = container.querySelector(".app-placeholder");
  if (old) old.remove();
}

function containerFor(id) {
  const container = $("puzzle-board-container");
  const status = $("puzzle-status");

  if (id === "puzzleBoard") return container;
  if (id === "pzDifficulty") return container;
  if (id === "pzStatus" || id === "pzStats" || id === "pzInfo") {
    return status || container;
  }
  if (id.indexOf("btnPz") === 0) return null;
  if (id === "puzzle-status") return status;
  return container;
}

function bindPuzzleButtons() {
  const map = {
    "btn-puzzle-hint":     "btnPzHint",
    "btn-puzzle-retry":    "btnPzRetry",
    "btn-puzzle-next":     "btnPzNext",
    "btn-puzzle-solution": "btnPzSolution"
  };
  for (const [newId, oldId] of Object.entries(map)) {
    const btn = $(newId);
    if (!btn || btn.__bridgeBound) continue;
    btn.__bridgeBound = true;
    btn.addEventListener("click", () => {
      const target = $(oldId);
      if (target) target.click();
    });
  }
}

function bindDifficulty() {
  const real = $("puzzle-difficulty");
  const shim = $("pzDifficulty");
  if (!real || !shim || real.__bridgeBound) return;
  real.__bridgeBound = true;
  try { if (shim.value !== real.value) shim.value = real.value; } catch (e) {}
  real.addEventListener("change", () => {
    try {
      shim.value = real.value;
      shim.dispatchEvent(new Event("change"));
    } catch (e) {}
  });
}

// Persistent patch untuk puzzle IDs
IDShim.persistentPatch(
  [/^pz/i, /^puzzle/, /^btnPz/],
  {
    visibleContainer: document.getElementById("puzzle-board-container"),
    containerFor: containerFor,
    verbose: true
  }
);
console.info("[PuzzleBridge] persistent patch aktif untuk pola pz*/puzzle*.");

/** Auto-load puzzle pertama setelah init. */
function autoLoadFirstPuzzle() {
  const pBoard = $("puzzleBoard");
  if (pBoard && pBoard.children.length > 0) return; // sudah ada

  // Prioritas: Random > Next > Daily > klik item pertama
  const candidates = ["btnPzRandom", "btnPzNext", "btnPzDaily"];
  for (const id of candidates) {
    const btn = $(id);
    if (btn) {
      console.info("[PuzzleBridge] auto-load via #" + id);
      try { btn.click(); } catch (e) {}
      // Cek apakah berhasil
      setTimeout(() => {
        const c = $("puzzleBoard");
        console.info("[PuzzleBridge] setelah auto-load, #puzzleBoard children:",
          c ? c.children.length : "no el");
      }, 200);
      return;
    }
  }

  // Fallback: klik item pertama di puzzle list (kalau ada)
  const list = $("puzzleList") || $("puzzle-list");
  if (list && list.children.length > 0) {
    console.info("[PuzzleBridge] auto-load via item pertama di daftar puzzle");
    try { list.children[0].click(); } catch (e) {}
    return;
  }

  console.warn("[PuzzleBridge] tidak ada tombol auto-load. Puzzle perlu diklik manual.");
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

    // Skeleton loading saat puzzle disiapkan
    if (window.AppSkeleton) window.AppSkeleton.board(boardEl);

    const PM = window.PuzzleMode;
    if (!PM || typeof PM.init !== "function") {
      if (window.AppSkeleton) { window.AppSkeleton.empty(boardEl, "common.error", true); return null; }
      showPlaceholder(placeholderText("noPuzzleMode"));
      return null;
    }

    prepareContainer();

    const result = IDShim.runWithShim(function () {
      try { PM.init(); }
      catch (e) {
        console.warn("[PuzzleBridge] PuzzleMode.init() threw:", e);
        console.warn("[PuzzleBridge] stack:", e && e.stack);
      }
    }, { containerFor: containerFor });

    console.info("[PuzzleBridge] ID di-shim:", result.createdIds);

    bindPuzzleButtons();
    bindDifficulty();

    // Auto-load puzzle pertama
    setTimeout(autoLoadFirstPuzzle, 150);

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
