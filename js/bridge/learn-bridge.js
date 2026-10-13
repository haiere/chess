/**
 * js/bridge/learn-bridge.js — ESM v2 self-contained.
 * Auto-init saat route #learn. Pakai IDShim universal.
 */
import { IDShim } from "./id-shim.js";

let MOUNTED = false;
let instance = null;
const $ = id => document.getElementById(id);

function placeholderText(key) {
  const lang = window.I18n ? window.I18n.getLang() : "id";
  const texts = {
    id: {
      noLessonsMode: "Modul pembelajaran belum tersedia. Buka Console untuk detail.",
      initFailed: "Modul pembelajaran gagal diinisialisasi. Buka Console untuk detail."
    },
    en: {
      noLessonsMode: "Learning module not available. Check Console for details.",
      initFailed: "Learning module failed to initialize. Check Console for details."
    }
  };
  return (texts[lang] || texts.id)[key];
}

function showPlaceholder(msg) {
  const container = $("learn-content");
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

function clearPlaceholder() {
  const container = $("learn-content");
  if (container) {
    const old = container.querySelector(".app-placeholder");
    if (old) old.remove();
  }
}

export const LearnBridge = {
  init() {
    if (MOUNTED) return instance;
    MOUNTED = true;
    console.info("[LearnBridge] ---- init ----");

    const container = $("learn-content");
    if (!container) {
      console.warn("[LearnBridge] #learn-content tidak ada.");
      return null;
    }

    const LM = window.LessonsMode;
    console.info("[LearnBridge] LessonsMode:", typeof LM, "init:", typeof (LM && LM.init));
    if (!LM || typeof LM.init !== "function") {
      showPlaceholder(placeholderText("noLessonsMode"));
      return null;
    }

    clearPlaceholder();

    console.info("[LearnBridge] memanggil LessonsMode.init() dengan IDShim...");
    const result = IDShim.runWithShim(function () {
      try {
        LM.init();
      } catch (e) {
        console.warn("[LearnBridge] LessonsMode.init() threw:", e);
      }
    });

    console.info("[LearnBridge] ID yang diminta lessons.js:", result.requestedIds);
    console.info("[LearnBridge] ID yang di-shim:", result.createdIds);

    instance = LM;
    console.info("[LearnBridge] ✓ selesai.");
    return instance;
  },

  getInstance() { return instance; },
  _reset() { MOUNTED = false; instance = null; }
};

if (typeof window !== "undefined") window.LearnBridge = LearnBridge;

/* AUTO-INIT */
(function () {
  if (typeof window === "undefined") return;
  if (window.__LearnBridgeAutoInit) return;
  window.__LearnBridgeAutoInit = true;

  function routeIsLearn() {
    const h = (location.hash || "").replace(/^#\/?/, "").trim();
    return h === "learn";
  }

  let attempts = 0;
  const interval = setInterval(function () {
    attempts++;
    if (routeIsLearn() && LearnBridge.getInstance() === null) {
      const ok = LearnBridge.init();
      if (ok) clearInterval(interval);
    }
    if (attempts > 120) clearInterval(interval);
  }, 500);

  window.addEventListener("hashchange", function () {
    if (routeIsLearn() && !LearnBridge.getInstance()) {
      setTimeout(function () { LearnBridge.init(); }, 100);
    }
  });
})();

export default LearnBridge;
