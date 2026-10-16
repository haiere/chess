/**
 * js/bridge/learn-bridge.js — v10.
 * - Reorder DOM: #lessonDetail dipindah ke atas #lessonList
 * - Auto-select dengan retry (3x)
 * - Persistent patch broad
 */
import { IDShim } from "./id-shim.js";

let INIT_ATTEMPTED = false;
let instance = null;
const $ = id => document.getElementById(id);

function placeholderText() {
  const lang = window.I18n ? window.I18n.getLang() : "id";
  return lang === "en" ? "Learning module not available." : "Modul pembelajaran belum tersedia.";
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
    return $("lessonDetail") || $("learn-content");
  }
  return null;
}

/** Pindahkan #lessonDetail ke ATAS #lessonList. */
function reorderLearnDOM() {
  const content = $("learn-content");
  if (!content) return;
  const list = $("lessonList");
  const detail = $("lessonDetail");
  if (!list || !detail) return;
  if (list.parentNode !== content || detail.parentNode !== content) return;
  // Cek kalau detail SUDAH di atas list
  const pos = list.compareDocumentPosition(detail);
  if (pos & Node.DOCUMENT_POSITION_FOLLOWING) {
    // detail ada setelah list → pindah ke atas
    content.insertBefore(detail, list);
    console.info("[LearnBridge v10] #lessonDetail dipindah ke atas #lessonList");
  }
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

function tryAutoSelect() {
  const detail = $("lessonDetail");
  if (detail && detail.children.length > 0) {
    console.info("[LearnBridge v10] detail sudah terisi:", detail.children.length);
    return true;
  }
  const list = $("lessonList");
  if (!list || list.children.length === 0) return false;

  try {
    const ev = new MouseEvent("click", { bubbles: true, cancelable: true, view: window });
    list.children[0].dispatchEvent(ev);
    console.info("[LearnBridge v10] auto-select lesson #1 dispatched");
    return true;
  } catch (e) {
    console.warn("[LearnBridge v10] auto-select error:", e);
    return false;
  }
}

function doInit() {
  console.info("[LearnBridge v10] ---- init ----");

  const container = $("learn-content");
  if (!container) { console.warn("[LearnBridge v10] #learn-content tidak ada"); return null; }

  const LM = window.LessonsMode;
  if (!LM || typeof LM.init !== "function") {
    showPlaceholder(placeholderText());
    return null;
  }

  const old = container.querySelector(".app-placeholder");
  if (old) old.remove();

  // Skeleton loading saat lesson dirender
  if (window.AppSkeleton) {
    const ll = $("lessonList");
    if (ll) window.AppSkeleton.cards(ll, 4);
  }

  const result = IDShim.runWithShim(() => {
    try { LM.init(); }
    catch (e) { console.warn("[LearnBridge v10] init threw:", e && e.message); }
  }, {
    visibleContainerId: "learn-content",
    containerFor: lessonContainerFor
  });

  console.info("[LearnBridge v10] ID shimmed:", result.createdIds);

  // Persistent patch broad
  IDShim.persistentPatch(
    [
      /^lesson/i,
      /^btnLesson/i,
      /^step/i,
      /^quiz/i,
      /^detail/i,
      /^progress/i,
      /^learn-/i
    ],
    {
      visibleContainer: container,
      containerFor: function (id) {
        if (/^btn/i.test(id)) return null;
        if (/progress/i.test(id)) return $("learn-progress") || container;
        const lower = id.toLowerCase();
        if (lower === "lessonlist" || lower === "lessondetail") return container;
        return $("lessonDetail") || container;
      },
      verbose: true
    }
  );
  console.info("[LearnBridge v10] persistent patch selesai.");

  // Reorder detail ke atas list
  reorderLearnDOM();
  setTimeout(reorderLearnDOM, 100);

  const list = $("lessonList");
  console.info("[LearnBridge v10] #lessonList children:",
    list ? list.children.length : "no el");

  bindNavButtons();

  // Auto-select dengan retry
  let tries = 0;
  const interval = setInterval(() => {
    tries++;
    if (tryAutoSelect()) {
      clearInterval(interval);
      setTimeout(() => {
        const d = $("lessonDetail");
        console.info("[LearnBridge v10] #lessonDetail children:",
          d ? d.children.length : "no el");
      }, 400);
    } else if (tries >= 5) {
      clearInterval(interval);
      console.warn("[LearnBridge v10] auto-select gagal setelah 5 percobaan");
    }
  }, 200);

  instance = LM;
  console.info("[LearnBridge v10] ✓ selesai.");
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
window.__LearnBridgeV10 = true;

(function () {
  if (typeof window === "undefined") return;
  if (window.__LearnAutoV10) return;
  window.__LearnAutoV10 = true;

  function routeIsLearn() {
    return (location.hash || "").replace(/^#\/?/, "").trim() === "learn";
  }

  function tryOnce(reason) {
    if (INIT_ATTEMPTED) return true;
    if (!routeIsLearn()) return false;
    console.info("[LearnBridge v10] AUTO-INIT:", reason);
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
    if (routeIsLearn()) { tryOnce("poll"); clearInterval(iv); return; }
    if (tries >= 10) clearInterval(iv);
  }, 500);

  window.addEventListener("hashchange", () => {
    if (!INIT_ATTEMPTED && routeIsLearn()) setTimeout(() => tryOnce("hashchange"), 100);
  });
})();

export default LearnBridge;
