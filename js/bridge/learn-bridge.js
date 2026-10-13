/** js/bridge/learn-bridge.js — ESM. */
let MOUNTED = false, instance = null;
const $ = id => document.getElementById(id);
function safe(label, fn) {
  try { return fn(); } catch (e) { console.warn("[LearnBridge] " + label + " gagal:", e); return null; }
}
function showPlaceholder(msg) {
  const c = $("learn-content");
  if (!c) return;
  c.innerHTML = '<div class="app-placeholder" role="status">' + msg + "</div>";
}
function detectApi() {
  const api = {};
  api.LessonsMode = window.LessonsMode || (window.Lessons && typeof window.Lessons === "object" ? window.Lessons : null);
  return api;
}
function tryInit(api) {
  if (!api.LessonsMode) return null;
  const container = $("learn-content");
  const attempts = [
    () => api.LessonsMode.init({ container, onProgress }),
    () => api.LessonsMode.init(container),
    () => api.LessonsMode.init()
  ];
  for (let i = 0; i < attempts.length; i++) {
    const r = safe("LessonsMode.init#" + i, attempts[i]);
    if (r) return r;
  }
  return null;
}
function onProgress(p) {
  const el = $("learn-progress");
  if (!el || !p) return;
  el.textContent = window.I18n
    ? window.I18n.t("learning.progress", { done: p.done || 0, total: p.total || 0 })
    : (p.done || 0) + " / " + (p.total || 0);
}
function bindButton(id, actionName) {
  const btn = $(id);
  if (!btn || btn.__bridgeBound) return;
  btn.__bridgeBound = true;
  btn.addEventListener("click", e => {
    e.preventDefault();
    const fn = instance && instance[actionName];
    if (typeof fn === "function") safe(actionName, () => fn.call(instance));
    else if (window.LessonsMode && typeof window.LessonsMode[actionName] === "function") safe(actionName, () => window.LessonsMode[actionName]());
    else console.warn("[LearnBridge] aksi tidak tersedia:", actionName);
  });
}
function bindButtons() {
  bindButton("btn-learn-prev", "previous");
  bindButton("btn-learn-next", "next");
  bindButton("btn-learn-restart", "restart");
  bindButton("btn-learn-finish", "finish");
}

export const LearnBridge = {
  init() {
    if (MOUNTED) return instance;
    MOUNTED = true;
    const container = $("learn-content");
    if (!container) return null;
    const api = detectApi();
    if (!api.LessonsMode) {
      showPlaceholder("Modul pembelajaran belum tersedia. Pastikan <code>js/lessons.js</code> dimuat (lihat Console).");
      bindButtons();
      return null;
    }
    instance = tryInit(api);
    if (!instance) {
      showPlaceholder("Modul pembelajaran gagal diinisialisasi. Buka Console untuk detail.");
      bindButtons();
      return null;
    }
    bindButtons();
    console.info("[LearnBridge] siap.");
    return instance;
  },
  getInstance() { return instance; },
  _reset() { MOUNTED = false; instance = null; }
};

if (typeof window !== "undefined") window.LearnBridge = LearnBridge;
export default LearnBridge;
