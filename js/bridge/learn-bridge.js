/**
 * js/bridge/learn-bridge.js — v6 FINAL.
 *
 * Fitur:
 *  - IDShim untuk init (auto-create 8 ID yang lessons.js butuh)
 *  - Persistent patch setelah init: setiap ID pola lesson* yang diminta
 *    saat runtime akan di-auto-create, diarahkan ke #lessonDetail (bukan
 *    #learn-content) supaya tidak tumpang tindih dengan lessonList.
 *  - Auto-select lesson pertama setelah init.
 *  - Proxy tombol #btn-learn-prev / #btn-learn-next ke tombol lama.
 *  - Filter console noise dari lessons.js (kalau ada spam log).
 */
import { IDShim } from "./id-shim.js";

let MOUNTED = false;
let instance = null;
const $ = id => document.getElementById(id);

/* ============================================================
   Helpers
   ============================================================ */

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

/**
 * Container mapping untuk ID pelajaran.
 *
 * Aturan:
 *  - btnLesson* / btn* → null (hidden)
 *  - *progress* → #learn-progress
 *  - lessonList → #learn-content (list tetap di parent)
 *  - lessonDetail → #learn-content (parent dari detail)
 *  - lesson* lain (lessonTitle, lessonBody, dll) → #lessonDetail (agar tidak
 *    tumpang tindih dengan list; mereka memang anak dari detail panel)
 *  - default → null (hidden)
 */
function lessonContainerFor(id) {
  if (!id) return null;
  const lower = id.toLowerCase();

  // Tombol → hidden
  if (lower.startsWith("btn")) return null;

  // Progress text → taruh di #learn-progress
  if (lower.includes("progress")) {
    return $("learn-progress") || $("learn-content");
  }

  // lessonList & lessonDetail → parent container
  if (lower === "lessonlist" || lower === "lessondetail") {
    return $("learn-content");
  }

  // lesson* lain → jadikan anak dari #lessonDetail (visible)
  if (lower.startsWith("lesson")) {
    const detail = $("lessonDetail");
    if (detail) return detail;
    return $("learn-content");
  }

  return null;
}

/* ============================================================
   Console noise filter — untuk lessons.js yang mungkin spam log
   ============================================================ */

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
    return function () {
      try {
        const args = Array.prototype.slice.call(arguments);
        const str = args.map(function (a) {
          try { return typeof a === "string" ? a : JSON.stringify(a); }
          catch (e) { return String(a); }
        }).join(" ");
        if (str.length > 200) return;
        if (/\bdebug\b|\btrace\b|\bstack\b/i.test(str)) return;
      } catch (e) { /* ignore */ }
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

/* ============================================================
   Bindings
   ============================================================ */

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

/** Klik lesson card dengan console filter. */
function clickLessonSafely(el) {
  if (!el) return;
  withQuietConsole(function () {
    try {
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

  setTimeout(function () {
    const d = $("lessonDetail");
    console.info("[LearnBridge] setelah auto-select, #lessonDetail children:",
      d ? d.children.length : "no el");
  }, 400);
}

/* ============================================================
   LearnBridge
   ============================================================ */

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

    // Bersihkan placeholder lama
    const old = container.querySelector(".app-placeholder");
    if (old) old.remove();

    // 1. Init dengan shim (quiet console agar noise lessons.js tersaring)
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
          // Panggil helper umum
          const r = lessonContainerFor(id);
          if (r) return r;
          // Khusus lessonProgressText → #learn-progress
          if (id === "lessonProgressText") {
            return $("learn-progress") || null;
          }
          return null;
        }
      });
    }, 2000);

    if (result) {
      console.info("[LearnBridge] ID di-shim saat init:", result.createdIds);
      if (result.error) {
        console.warn("[LearnBridge] init error:", result.error);
      }
    }

    // 2. Persistent patch — runtime klik lesson akan auto-create ID
    //    dengan mapping ke #lessonDetail (bukan #learn-content)
    try {
      IDShim.persistentPatch(
        [/^lesson/i, /^btnLesson/, /^learn-/i],
        {
          visibleContainer: container,
          containerFor: function (id) {
            // Tombol → hidden
            if (/^btn/i.test(id)) return null;
            // Progress → #learn-progress
            if (/progress/i.test(id)) {
              return $("learn-progress") || container;
            }
            // lessonList / lessonDetail → parent
            const lower = id.toLowerCase();
            if (lower === "lessonlist" || lower === "lessondetail") {
              return container;
            }
            // lesson* lain → jadikan anak dari #lessonDetail
            const detail = $("lessonDetail");
            if (detail) return detail;
            return container;
          },
          verbose: true
        }
      );
      console.info("[LearnBridge] persistent patch aktif untuk pola lesson*/btnLesson*/learn-*.");
    } catch (e) {
      console.warn("[LearnBridge] persistentPatch gagal:", e);
    }

    // 3. Cek hasil init
    const list = $("lessonList");
    const detail = $("lessonDetail");
    console.info("[LearnBridge] #lessonList children:", list ? list.children.length : "no el");
    console.info("[LearnBridge] #lessonDetail children:", detail ? detail.children.length : "no el");

    // 4. Bind tombol navigasi baru → lama
    bindNewButtonsToOld();

    // 5. Auto-select lesson pertama
    setTimeout(autoSelectFirstLesson, 200);

    instance = LM;
    console.info("[LearnBridge] ✓ selesai.");
    return instance;
  },

  getInstance() { return instance; },

  _reset() {
    MOUNTED = false;
    instance = null;
  }
};

if (typeof window !== "undefined") window.LearnBridge = LearnBridge;

/* ============================================================
   AUTO-INIT — trigger saat route #learn
   ============================================================ */
(function autoInitLearnBridge() {
  if (typeof window === "undefined") return;
  if (window.__LearnBridgeAutoInit) return;
  window.__LearnBridgeAutoInit = true;

  function routeIsLearn() {
    return (location.hash || "").replace(/^#\/?/, "").trim() === "learn";
  }

  function tryInit(reason) {
    if (!routeIsLearn()) return false;
    if (LearnBridge.getInstance()) return true;
    console.info("[LearnBridge] AUTO-INIT trigger:", reason);
    return !!LearnBridge.init();
  }

  // Coba langsung kalau DOM siap
  if (document.readyState === "complete" || document.readyState === "interactive") {
    tryInit("document-ready");
  } else {
    document.addEventListener("DOMContentLoaded", function () {
      tryInit("DOMContentLoaded");
    });
  }

  // Polling fallback
  let attempts = 0;
  const interval = setInterval(function () {
    attempts++;
    if (tryInit("poll #" + attempts)) {
      clearInterval(interval);
    } else if (attempts > 120) {
      clearInterval(interval);
    }
  }, 500);

  // Trigger ulang saat pindah ke route learn
  window.addEventListener("hashchange", function () {
    if (routeIsLearn() && !LearnBridge.getInstance()) {
      setTimeout(function () { tryInit("hashchange"); }, 100);
    }
  });
})();

export default LearnBridge;
