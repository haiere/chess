/**
 * js/bridge/error-tracer.js — Global error tracer.
 * Log stack trace lengkap untuk error apapun.
 */
(function () {
  "use strict";
  if (typeof window === "undefined") return;
  if (window.__ErrorTracer) return;
  window.__ErrorTracer = true;

  window.addEventListener("error", function (e) {
    const err = e.error || e;
    if (err && err.message && err.message.indexOf("Cannot set properties") !== -1) {
      console.error("[ErrorTracer] TypeError terdeteksi:");
      console.error("  message:", err.message);
      console.error("  file:", e.filename);
      console.error("  line:", e.lineno, "col:", e.colno);
      if (err.stack) console.error("  stack:", err.stack);
    }
  });

  // Juga tangkap unhandled promise rejection
  window.addEventListener("unhandledrejection", function (e) {
    console.warn("[ErrorTracer] unhandled rejection:", e.reason);
  });

  console.info("[ErrorTracer] aktif.");
})();

export {};
