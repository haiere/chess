/**
 * js/bridge/puzzle-bridge.js — v4.
 * Container mapping presisi berdasarkan ID yang puzzle.js benar-benar minta:
 *   puzzleBoard, pzDifficulty, pzStatus, pzStats, pzInfo → VISIBLE di #puzzle-board-container
 *   btnPz* → HIDDEN (diproxy dari tombol baru)
 *   puzzle-status → existing di HTML
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

/** Kumpulkan semua elemen visible yang sudah ada, agar tidak di-shim ulang. */
function prepareContainer() {
  const container = $("puzzle-board-container");
  if (!container) return;

  // Sembunyikan #puzzle-board lama (jangan hapus — bisa dipakai nanti)
  const oldBoard = $("puzzle-board");
  if (oldBoard) {
    oldBoard.style.display = "none";
    oldBoard.setAttribute("aria-hidden", "true");
  }

  // Bersihkan placeholder lama
  const old = container.querySelector(".app-placeholder");
  if (old) old.remove();
}

/** Mapping container untuk setiap ID yang puzzle.js minta. */
function containerFor(id) {
  const container = $("puzzle-board-container");
  const status = $("puzzle-status");

  // Papan utama → di dalam board container (visible)
  if (id === "puzzleBoard") return container;

  // Difficulty select → di dalam board container, akan kita proxy ke select HTML
  if (id === "pzDifficulty") return container;

  // Status / stats / info → di bawah board, pakai #puzzle-status kalau ada
  if (id === "pzStatus" || id === "pzStats" || id === "pzInfo") {
    return status || container;
  }

  // Tombol btnPz* → hidden (default IDShim behavior)
  if (id.indexOf("btnPz") === 0) return null;

  // `puzzle-status` sudah ada di HTML — IDShim tidak akan shim ini
  if (id === "puzzle-status") return status;

  return container;
}

/** Proxy tombol baru → tombol lama yang di-shim. */
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

/** Proxy difficulty select HTML → pzDifficulty shim. */
function bindDifficulty() {
  const real = $("puzzle-difficulty");
  const shim = $("pzDifficulty");
  if (!real || !shim || real.__bridgeBound) return;
  real.__bridgeBound = true;

  // Set initial value
  try {
    if (shim.value !== real.value) shim.value = real.value;
  } catch (e) { /* ignore */ }

  real.addEventListener("change", () => {
    try {
      shim.value = real.value;
      shim.dispatchEvent(new Event("change"));
    } catch (e) { /* ignore */ }
  });
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

    prepareContainer();

    console.info("[PuzzleBridge] memanggil PuzzleMode.init() dengan container mapping...");
    const result = IDShim.runWithShim(function () {
      try { PM.init(); }
      catch (e) {
        console.warn("[PuzzleBridge] PuzzleMode.init() threw:", e);
        console.warn("[PuzzleBridge] stack:", e && e.stack);
      }
    }, {
      containerFor: containerFor
    });

    console.info("[PuzzleBridge] ID diminta:", result.requestedIds);
    console.info("[PuzzleBridge] ID di-shim:", result.createdIds);
    if (result.error) console.warn("[PuzzleBridge] init error:", result.error);

    // Cek hasil
    const pBoard = $("puzzleBoard");
    const pStatus = $("pzStatus");
    console.info("[PuzzleBridge] #puzzleBoard children:", pBoard ? pBoard.children.length : "no el");
    console.info("[PuzzleBridge] #pzStatus text:", pStatus ? pStatus.textContent.slice(0, 80) : "no el");

    bindPuzzleButtons();
    bindDifficulty();

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
