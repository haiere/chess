/**
 * js/bridge/learn-bridge.js — v7 FINAL.
 * Perubahan:
 *  - Polling berhenti setelah init dipanggil sekali (sukses atau gagal).
 *  - Tidak spam log.
 *  - Persist patch aktif untuk klik lesson.
 *  - Auto-select lesson pertama.
 */
import { IDShim } from "./id-shim.js";

let MOUNTED = false;
let instance = null;
let INIT_ATTEMPTED = false;
const $ = id => document.getElementById(id);

/* ---------- Helpers ---------- */
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

function lessonContainerFor(id) {
  if (!id) return null;
  const lower = id.toLowerCase();
  if (lower.startsWith("btn")) return null;
  if (lower.includes("progress")) return $("learn-progress") || $("learn-content");
  if (lower === "lessonlist" || lower === "lessondetail") return $("learn-content");
  if (lower.startsWith("lesson")) {
    const detail = $("lessonDetail");
    if (detail) return detail;
    return $("learn-content");
  }
  return null;
}

function withQuietConsole(fn, ms) {
  ms = ms || 1500;
  const orig = {
    log: console.log, warn: console.warn, info: console.info,
    debug: console.debug, trace: console.trace
  };
  function filter(origFn) {
    return function () {
      try {
        const args = Array.prototype.slice.call(arguments);
        const str = args.map(function (a) {
          try { return typeof a === "string" ? a : JSON.stringify(a); }
          catch (e) { return String(a); }
        }).join(" ");
        if (str.length > 200) return;
        if (/\bdebug\b|\btrace\b|\bstack\b/i.test(str)) return;
      } catch (e) {}
      return origFn.apply(console, arguments);
    };
  }
  console.log = filter(orig.log);
  console.warn = filter(orig.warn);
  console.info = filter(orig.info);
  console.debug = function () {};
  console.trace = function () {};
  try { fn(); }
  finally {
    setTimeout(function () {
      console.log = orig.log;
      console.warn = orig.warn;
      console.info = orig.info;
      console.debug = orig.debug;
      console.trace = orig.trace;
    }, ms);
  }
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
    btn.addEventListener("click", function () {
      const target = $(oldId);
      if (target) {
        withQuietConsole(function () {
          try { target.click(); } catch (e) {}
        }, 800);
      }
    });
  }
}

function clickLessonSafely(el) {
  if (!el) return;
  withQuietConsole(function () {
    try {
      const ev = new MouseEvent("click", {
        bubbles: true, cancelable: true, view: window
      });
      el.dispatchEvent(ev);
    } catch (e) {
      console.warn("[LearnBridge] klik lesson gagal:", e);
    }
  }, 2000);
}

function autoSelectFirstLesson() {
  const detail = $("lessonDetail");
  if (detail && detail.children.length > 0) return;

  const list = $("lessonList");
  if (!list || list.children.length === 0) {
    console.warn("[LearnBridge] #lessonList kosong.");
    return;
  }

  const first = list.children[0];
  console.info("[LearnBridge] auto-select lesson pertama");
  clickLessonSafely(first);

  setTimeout(function () {
    const d = $("lessonDetail");
    console.info("[LearnBridge] setelah auto-select, #lessonDetail children:",
      d ? d.children.length : "no el");
  }, 400);
}

/* ---------- Main init (hanya dijalankan sekali) ---------- */
function doInit() {
  console.info("[LearnBridge] ---- init ----");

  const container = $("learn-content");
  if (!container) {
    console.warn("[LearnBridge] #learn-content tidak ada. Init dibatalkan.");
    return null;
  }

  const LM = window.LessonsMode;
  if (!LM || typeof LM.init !== "function") {
    showPlaceholder(placeholderText("noLessonsMode"));
    return null;
  }

  const old = container.querySelector(".app-placeholder");
  if (old) old.remove();

  let result;
  withQuietConsole(function () {
    result = IDShim.runWithShim(function () {
      try { LM.init(); }
      catch (e) {
        console.warn("[LearnBridge] LessonsMode.init() threw:",
          e && e.message ? e.message : e);
      }
    }, {
      visibleContainerId: "learn-content",
      containerFor: function (id) {
        const r = lessonContainerFor(id);
        if (r) return r;
        if (id === "lessonProgressText") return $("learn-progress") || null;
        return null;
      }
    });
  }, 2000);

  if (result) {
    console.info("[LearnBridge] ID di-shim saat init:", result.createdIds);
  }

  // Persistent patch — supaya klik lesson tidak error
  try {
    IDShim.persistentPatch(
      [/^lesson/i, /^btnLesson/, /^learn-/i],
      {
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
        verbose: true
      }
    );
    console.info("[LearnBridge] v7 — persistent patch aktif.");
  } catch (e) {
    console.warn("[LearnBridge] persistentPatch gagal:", e);
  }

  const list = $("lessonList");
  const detail = $("lessonDetail");
  console.info("[LearnBridge] #lessonList children:", list ? list.children.length : "no el");
  console.info("[LearnBridge] #lessonDetail children:", detail ? detail.children.length : "no el");

  bindNewButtonsToOld();
  setTimeout(autoSelectFirstLesson, 200);

  instance = LM;
  console.info("[LearnBridge] ✓ selesai.");
  return instance;
}

/* ---------- Public API ---------- */
export const LearnBridge = {
  init() {
    if (INIT_ATTEMPTED) return instance;
    INIT_ATTEMPTED = true;
    MOUNTED = true;
    return doInit();
  },
  getInstance() { return instance; },
  _reset() {
    MOUNTED = false;
    INIT_ATTEMPTED = false;
    instance = null;
  }
};

if (typeof window !== "undefined") window.LearnBridge = LearnBridge;

/* ---------- Auto-init (poll sekali saja, lalu berhenti) ---------- */
(function autoInitLearnBridge() {
  if (typeof window === "undefined") return;
  if (window.__LearnBridgeAutoInitV7) return;
  window.__LearnBridgeAutoInitV7 = true;

  function routeIsLearn() {
    return (location.hash || "").replace(/^#\/?/, "").trim() === "learn";
  }

  function tryOnce(reason) {
    if (INIT_ATTEMPTED) return true;
    if (!routeIsLearn()) return false;
    console.info("[LearnBridge] AUTO-INIT:", reason);
    LearnBridge.init();
    return true; // apapun hasilnya, kita sudah coba
  }

  // Coba saat DOM siap
  if (document.readyState === "complete" || document.readyState === "interactive") {
    tryOnce("document-ready");
  } else {
    document.addEventListener("DOMContentLoaded", function () {
      tryOnce("DOMContentLoaded");
    }, { once: true });
  }

  // Polling singkat — 10 kali saja, bukan 120
  let attempts = 0;
  const interval = setInterval(function () {
    attempts++;
    if (INIT_ATTEMPTED) { clearInterval(interval); return; }
    if (routeIsLearn()) {
      tryOnce("poll #" + attempts);
      clearInterval(interval);
    } else if (attempts > 10) {
      clearInterval(interval);
    }
  }, 500);

  // Trigger saat hashchange ke learn (sekali saja)
  window.addEventListener("hashchange", function () {
    if (INIT_ATTEMPTED) return;
    if (routeIsLearn()) {
      setTimeout(function () { tryOnce("hashchange"); }, 100);
    }
  });
})();

export default LearnBridge;
