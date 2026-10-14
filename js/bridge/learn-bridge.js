/**
 * js/bridge/learn-bridge.js — v3.
 * - Shim lessonList/lessonDetail ke #learn-content (visible)
 * - Shim lessonProgressText ke #learn-progress (visible)
 * - Tombol tetap hidden, diproxy dari #btn-learn-prev / #btn-learn-next
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
      noLessonsMode: "Learning module not available. Check Console.",
      initFailed: "Learning module failed to initialize. Check Console."
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

function bindNewButtonsToOld() {
  const map = [
    ["btn-learn-prev", "btnLessonPrev"],
    ["btn-learn-next", "btnLessonNext"]
  ];
  for (const [newId, oldId] of map) {
    const btn = $(newId);
    if (!btn || btn.__bridgeBound) continue;
    btn.__bridgeBound = true;
    btn.addEventListener("click", () => {
      const target = $(oldId);
      if (target) target.click();
    });
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

    // Bersihkan placeholder kalau ada
    const old = container.querySelector(".app-placeholder");
    if (old) old.remove();

    console.info("[LearnBridge] memanggil LessonsMode.init() dengan IDShim (visible)...");
    const result = IDShim.runWithShim(function () {
      try { LM.init(); }
      catch (e) { console.warn("[LearnBridge] LessonsMode.init() threw:", e); }
    }, {
      visibleContainerId: "learn-content",
      containerFor: function (id) {
        // progress text → taruh di #learn-progress
        if (id === "lessonProgressText") {
          return document.getElementById("learn-progress")
            || document.getElementById("learn-content");
        }
        return null; // fallback ke default heuristic
      }
    });

    console.info("[LearnBridge] ID diminta:", result.requestedIds);
    console.info("[LearnBridge] ID di-shim:", result.createdIds);

    // Cek hasil — apakah lessonList punya konten?
    const list = $("lessonList");
    const detail = $("lessonDetail");
    console.info("[LearnBridge] #lessonList children:", list ? list.children.length : "no el");
    console.info("[LearnBridge] #lessonDetail children:", detail ? detail.children.length : "no el");

    bindNewButtonsToOld();

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
    return (location.hash || "").replace(/^#\/?/, "").trim() === "learn";
  }

  let attempts = 0;
  const interval = setInterval(function () {
    attempts++;
    if (routeIsLearn() && !LearnBridge.getInstance()) {
      if (LearnBridge.init()) clearInterval(interval);
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
