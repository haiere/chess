/**
 * js/bridge/puzzle-bridge.js — ESM v2 self-contained.
 * Auto-init saat route #puzzle. Pakai IDShim universal.
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
      noPuzzleMode: "Puzzle module not available. Check Console for details.",
      initFailed: "Puzzle module failed to initialize. Check Console for details."
    }
  };
  return (texts[lang] || texts.id)[key];
}

function showPlaceholder(msg) {
  const container = $("puzzle-board-container") || $("puzzle-board");
  if (!container) return;
  const boardEl = $("puzzle-board");
  if (boardEl) {
    boardEl.style.visibility = "hidden";
    boardEl.style.position = "absolute";
  }
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

function clearPlaceholder() {
  const container = $("puzzle-board-container");
  if (container) {
    const old = container.querySelector(".app-placeholder");
    if (old) old.remove();
  }
  const boardEl = $("puzzle-board");
  if (boardEl) {
    boardEl.style.visibility = "";
    boardEl.style.position = "";
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

    clearPlaceholder();

    // Jalankan init dengan ID shim
    console.info("[PuzzleBridge] memanggil PuzzleMode.init() dengan IDShim...");
    const result = IDShim.runWithShim(function () {
      try {
        PM.init();
      } catch (e) {
        console.warn("[PuzzleBridge] PuzzleMode.init() threw:", e);
      }
    });

    console.info("[PuzzleBridge] ID yang diminta puzzle.js:", result.requestedIds);
    console.info("[PuzzleBridge] ID yang di-shim:", result.createdIds);

    if (boardEl.children.length === 0) {
      console.warn("[PuzzleBridge] board kosong setelah init.");
      showPlaceholder(placeholderText("initFailed"));
      return null;
    }

    instance = PM;
    console.info("[PuzzleBridge] ✓ SUKSES. Board children:", boardEl.children.length);
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
    const h = (location.hash || "").replace(/^#\/?/, "").trim();
    return h === "puzzle";
  }

  let attempts = 0;
  const interval = setInterval(function () {
    attempts++;
    if (routeIsPuzzle() && PuzzleBridge.getInstance() === null) {
      const ok = PuzzleBridge.init();
      if (ok) clearInterval(interval);
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
