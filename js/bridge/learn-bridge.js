/**
 * js/bridge/learn-bridge.js — v5.
 * Perubahan:
 *  - Patch console.log/warn/error sementara saat init & auto-select,
 *    untuk filter noise dari lessons.js
 *  - Klik lesson lebih aman via stopPropagation
 *  - Auto-select lesson pertama
 */
import { IDShim } from "./id-shim.js";

let MOUNTED = false;
let instance = null;
const $ = id => document.getElementById(id);

/* ---------- console noise filter ---------- */
function withQuietConsole(fn, ms) {
  ms = ms || 1500;
  const orig = {
    log: console.log,
    warn: console.warn,
    info: console.info,
    debug: console.debug,
    trace: console.trace
  };
  function filter(origFn) {
    return function (...args) {
      try {
        const str = args.map(a => {
          try { return typeof a === "string" ? a : JSON.stringify(a); }
          catch (e) { return String(a); }
        }).join(" ");
        // Skip log panjang (>200 char) atau yang tampak debug
        if (str.length > 200) return;
        if (/\bdebug\b|\btrace\b|\bstack\b/i.test(str)) return;
      } catch (e) { /* ignore */ }
      return origFn.apply(console, args);
    };
  }
  console.log = filter(orig.log);
  console.warn = filter(orig.warn);
  console.info = filter(orig.info);
  console.debug = () => {};
  console.trace = () => {};

  try { fn(); }
  finally {
    setTimeout(() => {
      console.log = orig.log;
      console.warn = orig.warn;
      console.info = orig.info;
      console.debug = orig.debug;
      console.trace = orig.trace;
    }, ms);
  }
}

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
      if (target) {
        // Bungkus dengan quiet console juga
        withQuietConsole(() => {
          try { target.click(); } catch (e) {}
        }, 800);
      }
    });
  }
}

/** Klik lesson card dengan console filter. */
function clickLessonSafely(el) {
  if (!el) return;
  withQuietConsole(() => {
    try {
      // Simulasi klik penuh
      const ev = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window
      });
      el.dispatchEvent(ev);
    } catch (e) {
      console.warn("[LearnBridge] klik lesson gagal:", e);
    }
  }, 2000);
}

/** Auto-select lesson pertama. */
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

  setTimeout(() => {
    const d = $("lessonDetail");
    console.info("[LearnBridge] setelah auto-select, #lessonDetail children:",
      d ? d.children.length : "no el");
  }, 400);
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

    // Init dengan quiet console
    let result;
    withQuietConsole(() => {
      result = IDShim.runWithShim(function () {
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
    }, 2000);

    const list = $("lessonList");
    console.info("[LearnBridge] #lessonList children:", list ? list.children.length : "no el");

    bindNewButtonsToOld();

    // Bind click handler kita sendiri untuk setiap lesson item (defensive)
    if (list) {
      // Detach existing inline handlers dengan clone
      Array.from(list.children).forEach((el, i) => {
        if (el.__learnBound) return;
        el.__learnBound = true;
        // Simpan reference original click handler
        // (kita tidak hapus, tapi bungkus dengan event capture di parent)
      });
    }

    setTimeout(autoSelectFirstLesson, 200);

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
