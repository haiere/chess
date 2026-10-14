/**
 * js/bridge/learn-bridge.js — v4.
 * Tambahan: setelah init, auto-select lesson pertama.
 */
import { IDShim } from "./id-shim.js";

let MOUNTED = false;
let instance = null;
const $ = id => document.getElementById(id);

function placeholderText(key) {
  const lang = window.I18n ? window.I18n.getLang() : "id";
  const texts = {
    id: { noLessonsMode: "Modul pembelajaran belum tersedia." },
    en: { noLessonsMode: "Learning module not available." }
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

/** Auto-select lesson pertama setelah init. */
function autoSelectFirstLesson() {
  const detail = $("lessonDetail");
  if (detail && detail.children.length > 0) return; // sudah ada isi

  const list = $("lessonList");
  if (!list || list.children.length === 0) {
    console.warn("[LearnBridge] #lessonList kosong, tidak bisa auto-select.");
    return;
  }

  const first = list.children[0];
  console.info("[LearnBridge] auto-select lesson pertama:", first.textContent.slice(0, 40));
  try { first.click(); } catch (e) {
    console.warn("[LearnBridge] auto-select gagal:", e);
  }

  // Cek hasilnya
  setTimeout(() => {
    const d = $("lessonDetail");
    console.info("[LearnBridge] setelah auto-select, #lessonDetail children:",
      d ? d.children.length : "no el");
  }, 250);
}

export const LearnBridge = {
  init() {
    if (MOUNTED) return instance;
    MOUNTED = true;
    console.info("[LearnBridge] ---- init ----");

    const container = $("learn-content");
    if (!container) return null;

    const LM = window.LessonsMode;
    if (!LM || typeof LM.init !== "function") {
      showPlaceholder(placeholderText("noLessonsMode"));
      return null;
    }

    const old = container.querySelector(".app-placeholder");
    if (old) old.remove();

    const result = IDShim.runWithShim(function () {
      try { LM.init(); }
      catch (e) { console.warn("[LearnBridge] LessonsMode.init() threw:", e); }
    }, {
      visibleContainerId: "learn-content",
      containerFor: function (id) {
        if (id === "lessonProgressText") {
          return document.getElementById("learn-progress")
            || document.getElementById("learn-content");
        }
        return null;
      }
    });

    const list = $("lessonList");
    console.info("[LearnBridge] #lessonList children:", list ? list.children.length : "no el");

    bindNewButtonsToOld();

    // Auto-select lesson pertama
    setTimeout(autoSelectFirstLesson, 150);

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
