/** js/bridge/index.js — ESM. */
const INITIALIZED = { game: false, puzzle: false, learn: false };

function safe(label, fn) {
  try { fn(); } catch (e) { console.warn("[bridge] " + label + " gagal:", e); }
}
function initForRoute(route) {
  if (route === "game" && !INITIALIZED.game) {
    INITIALIZED.game = true;
    safe("GameBridge.init", () => window.GameBridge && window.GameBridge.init());
  }
  if (route === "puzzle" && !INITIALIZED.puzzle) {
    INITIALIZED.puzzle = true;
    safe("PuzzleBridge.init", () => window.PuzzleBridge && window.PuzzleBridge.init());
  }
  if (route === "learn" && !INITIALIZED.learn) {
    INITIALIZED.learn = true;
    safe("LearnBridge.init", () => window.LearnBridge && window.LearnBridge.init());
  }
}
function bindSettings() {
  const themeSel = document.getElementById("setting-theme");
  if (themeSel && !themeSel.__bridgeBound) {
    themeSel.__bridgeBound = true;
    themeSel.addEventListener("change", e => {
      const val = e.target.value;
      const resolved = val === "system"
        ? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
        : val;
      document.body.setAttribute("data-theme", resolved);
      document.documentElement.setAttribute("data-theme", resolved);
      try {
        if (window.AppStorage && window.AppStorage.set) window.AppStorage.set("theme", val);
        else if (window.localStorage) localStorage.setItem("chess:theme", val);
      } catch (err) {}
    });
  }
  const boardSel = document.getElementById("setting-board-theme");
  if (boardSel && !boardSel.__bridgeBound) {
    boardSel.__bridgeBound = true;
    boardSel.addEventListener("change", e => {
      document.documentElement.setAttribute("data-board-theme", e.target.value);
      try {
        if (window.AppStorage && window.AppStorage.set) window.AppStorage.set("boardTheme", e.target.value);
        else if (window.localStorage) localStorage.setItem("chess:boardTheme", e.target.value);
      } catch (err) {}
    });
  }
  const resetBtn = document.getElementById("btn-reset-all");
  if (resetBtn && !resetBtn.__bridgeBound) {
    resetBtn.__bridgeBound = true;
    resetBtn.addEventListener("click", () => {
      const msg = window.I18n ? window.I18n.t("settings.resetConfirm") : "Reset all?";
      if (!confirm(msg)) return;
      try {
        if (window.AppStorage && window.AppStorage.clear) window.AppStorage.clear();
        else if (window.localStorage) {
          Object.keys(localStorage).filter(k => k.indexOf("chess:") === 0).forEach(k => localStorage.removeItem(k));
        }
      } catch (err) {}
      location.reload();
    });
  }
}
function restoreBoardTheme() {
  try {
    const saved = (window.AppStorage && window.AppStorage.get)
      ? window.AppStorage.get("boardTheme")
      : (window.localStorage ? localStorage.getItem("chess:boardTheme") : null);
    if (saved) document.documentElement.setAttribute("data-board-theme", saved);
  } catch (e) {}
}
function boot() {
  restoreBoardTheme();
  bindSettings();
  document.addEventListener("route:change", e => {
    if (e && e.detail && e.detail.route) initForRoute(e.detail.route);
  });
  const initial = (location.hash || "#game").replace(/^#\/?/, "") || "game";
  initForRoute(initial);
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
else boot();

export const Bridge = {
  initForRoute,
  _reset() { INITIALIZED.game = INITIALIZED.puzzle = INITIALIZED.learn = false; }
};

if (typeof window !== "undefined") window.Bridge = Bridge;
export default Bridge;
