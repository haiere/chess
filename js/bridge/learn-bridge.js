/**
 * js/bridge/learn-bridge.js — v8 FINAL.
 * - Poll tidak spam (max 10 attempts, berhenti setelahnya)
 * - Init hanya sekali (INIT_ATTEMPTED flag)
 * - Persistent patch untuk lesson runtime IDs
 */
import { IDShim } from "./id-shim.js";

let INIT_ATTEMPTED = false;
let instance = null;
const $ = id => document.getElementById(id);

function placeholderText() {
  const lang = window.I18n ? window.I18n.getLang() : "id";
  return lang === "en"
    ? "Learning module not available."
    : "Modul pembelajaran belum tersedia.";
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

function lessonContainerFor(id) {
  if (!id) return null;
  const lower = id.toLowerCase();
  if (lower.startsWith("btn")) return null;
  if (lower.includes("progress")) return $("learn-progress") || $("learn-content");
  if (lower === "lessonlist" || lower === "lessondetail") return $("learn-content");
  if (lower.startsWith("lesson")) {
    const detail = $("lessonDetail");
    if (detail) return detail;
  }
  return null;
}

function bindNavButtons() {
  const map = [
    ["btn-learn-prev", "btnLessonPrev"],
    ["btn-learn-next", "btnLessonNext"]
  ];
  for (const [newId, oldId] of map) {
    const btn = $(newId);
    if (!btn || btn.__bound) continue;
    btn.__bound = true;
    btn.addEventListener("click", () => {
      const target = $(oldId);
      if (target) { try { target.click(); } catch (e) {} }
    });
  }
}

function autoSelectFirst() {
  const detail = $("lessonDetail");
  if (detail && detail.children.length > 0) return;
  const list = $("lessonList");
  if (!list || list.children.length === 0) return;

  try {
    const ev = new MouseEvent("click", { bubbles: true, cancelable: true, view: window });
    list.children[0].dispatchEvent(ev);
  } catch (e) {
    console.warn("[LearnBridge] auto-select gagal:", e);
  }

  setTimeout(() => {
    const d = $("lessonDetail");
    console.info("[LearnBridge] #lessonDetail children after select:",
      d ? d.children.length : "no el");
  }, 400);
}

function doInit() {
  console.info("[LearnBridge v8] ---- init ----");

  const container = $("learn-content");
  if (!container) {
    console.warn("[LearnBridge v8] #learn-content tidak ada.");
    return null;
  }

  const LM = window.LessonsMode;
  if (!LM || typeof LM.init !== "function") {
    showPlaceholder(placeholderText());
    return null;
  }

  const old = container.querySelector(".app-placeholder");
  if (old) old.remove();

  const result = IDShim.runWithShim(() => {
    try { LM.init(); }
    catch (e) { console.warn("[LearnBridge v8] init threw:", e && e.message); }
  }, {
    visibleContainerId: "learn-content",
    containerFor: lessonContainerFor
  });

  console.info("[LearnBridge v8] ID shimmed:", result.createdIds);

  try {
    IDShim.persistentPatch([/^lesson/i, /^btnLesson/, /^learn-/i], {
      visibleContainer: container,
      containerFor: function (id) {
        if (/^btn/i.test(id)) return null;
        if (/progress/i.test(id)) return $("learn-progress") || container;
        const lower = id.toLowerCase();
        if (lower === "lessonlist" || lower === "lessondetail") return container;
        const detail = $("lessonDetail");
        if (detail) return detail;
        return container;
      },
      verbose: false
    });
  } catch (e) {}

  const list = $("lessonList");
  console.info("[LearnBridge v8] #lessonList children:", list ? list.children.length : "no el");

  bindNavButtons();
  setTimeout(autoSelectFirst, 200);

  instance = LM;
  console.info("[LearnBridge v8] ✓ selesai.");
  return instance;
}

export const LearnBridge = {
  init() {
    if (INIT_ATTEMPTED) return instance;
    INIT_ATTEMPTED = true;
    return doInit();
  },
  getInstance() { return instance; },
  _reset() { INIT_ATTEMPTED = false; instance = null; }
};

if (typeof window !== "undefined") window.LearnBridge = LearnBridge;
window.__LearnBridgeV8 = true;

/* Auto-init: 1x percobaan saja, tanpa spam */
(function () {
  if (typeof window === "undefined") return;
  if (window.__LearnAutoV8) return;
  window.__LearnAutoV8 = true;

  function routeIsLearn() {
    return (location.hash || "").replace(/^#\/?/, "").trim() === "learn";
  }

  function tryOnce(reason) {
    if (INIT_ATTEMPTED) return true;
    if (!routeIsLearn()) return false;
    console.info("[LearnBridge v8] AUTO-INIT:", reason);
    LearnBridge.init();
    return true;
  }

  if (document.readyState === "complete" || document.readyState === "interactive") {
    tryOnce("ready");
  } else {
    document.addEventListener("DOMContentLoaded", () => tryOnce("DOMContentLoaded"), { once: true });
  }

  let tries = 0;
  const iv = setInterval(() => {
    tries++;
    if (INIT_ATTEMPTED) { clearInterval(iv); return; }
    if (routeIsLearn()) { tryOnce("poll #" + tries); clearInterval(iv); return; }
    if (tries >= 10) clearInterval(iv);
  }, 500);

  window.addEventListener("hashchange", () => {
    if (!INIT_ATTEMPTED && routeIsLearn()) setTimeout(() => tryOnce("hashchange"), 100);
  });
})();

export default LearnBridge;
