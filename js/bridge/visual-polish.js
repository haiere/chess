/**
 * js/bridge/visual-polish.js — v5 SELF-HEALING.
 * - Retry inject kalau belum ada setelah 100ms, 500ms, 1s, 2s, 3s
 * - Cek setiap 1s apakah masih ada, re-inject kalau hilang
 * - Global marker window.__VisualPolishV5
 */
(function () {
  "use strict";
  if (typeof document === "undefined") return;
  if (window.__VisualPolishV5) return;
  window.__VisualPolishV5 = true;

  const CSS_TEXT = `/* Unified Design System v7: seluruh styling kini di style.css. */`;

  function inject() {
    if (!document.head) return false;
    if (document.getElementById("visual-polish-style")) return true;
    const s = document.createElement("style");
    s.id = "visual-polish-style";
    s.textContent = CSS_TEXT;
    document.head.appendChild(s);
    console.info("[VisualPolish v5] Style injected (" + CSS_TEXT.length + " bytes).");
    return true;
  }

  // Inject immediately
  if (!inject()) {
    // Retry if head not ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", inject, { once: true });
    }
  }

  // Retry dengan backoff untuk environment yang aneh
  [100, 500, 1000, 2000, 3000].forEach(ms => setTimeout(inject, ms));

  // Watchdog terbatas: cek maks 5x (10 detik) lalu berhenti — hindari interval selamanya
  let _watchdogRuns = 0;
  const _watchdog = setInterval(() => {
    if (++_watchdogRuns >= 5) { clearInterval(_watchdog); return; }
    if (!document.getElementById("visual-polish-style")) {
      console.warn("[VisualPolish v5] Style hilang, re-inject...");
      inject();
    }
  }, 2000);

  // Expose untuk diagnostic
  window.__visualPolishBytes = CSS_TEXT.length;
})();

export {};
