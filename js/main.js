/**
 * js/main.js — v6.
 * - Guard: kalau sudah load, skip.
 * - Tambah i18n-extend.
 * - Semua dynamic import.
 */
const BRIDGE_IMPORTS = [
  "./i18n.js",
  "./components/LanguageSwitcher.js",
  "./bridge/i18n-extend.js",       // ← TAMBAH (sebelumnya hilang)
  "./bridge/visual-polish.js",
  "./bridge/id-shim.js",
  "./bridge/game-bridge.js",
  "./bridge/puzzle-bridge.js",
  "./bridge/learn-bridge.js"
];

const USER_MODULES = [
  { path: "./storage.js",           globals: ["AppStorage", "Storage"] },
  { path: "./utils/storage.js",     globals: ["AppStorage", "Storage"] },
  { path: "./utils/theme.js",       globals: ["Theme"] },
  { path: "./audio.js",             globals: ["SFX", "Audio", "Sound"] },
  { path: "./pieces.js",            globals: ["ChessPieces", "Pieces"] },
  { path: "./icons/svg.js",         globals: ["Icons", "SvgIcons"] },
  { path: "./engine.js",            globals: ["Chess", "Engine", "ChessEngine"] },
  { path: "./chess/engine.js",      globals: ["Chess", "Engine", "ChessEngine"] },
  { path: "./chess/constants.js",   globals: ["ChessConstants", "Constants"] },
  { path: "./board-view.js",        globals: ["BoardView", "View", "Board"] },
  { path: "./components/Board.js",  globals: ["Board"] },
  { path: "./components/Icon.js",   globals: ["Icon"] },
  { path: "./game.js",              globals: ["GameMode", "Game", "Mode"] },
  { path: "./puzzle-data.js",       globals: ["PuzzleData"] },
  { path: "./puzzle/provider.js",   globals: ["PuzzleProvider", "Provider"] },
  { path: "./puzzle.js",            globals: ["PuzzleMode", "Puzzle", "Mode"] },
  { path: "./lessons-data.js",      globals: ["LessonsData"] },
  { path: "./lessons.js",           globals: ["LessonsMode", "Lessons", "Mode"] }
];

async function safeImport(path) {
  try { return await import(path); }
  catch (e) {
    console.warn("[main-v6] gagal load", path, "→", e && e.message ? e.message : e);
    return null;
  }
}
function pick(mod, ...names) {
  if (!mod) return null;
  for (const n of names) if (mod[n]) return mod[n];
  if (mod.default) {
    for (const n of names) if (mod.default[n]) return mod.default[n];
    return mod.default;
  }
  return null;
}

async function loadBridges() {
  const loaded = [];
  for (const path of BRIDGE_IMPORTS) {
    const mod = await safeImport(path);
    if (mod) loaded.push(path);
  }
  console.info("[main-v6] bridges loaded:", loaded.length, "of", BRIDGE_IMPORTS.length);
}

async function loadUserModules() {
  const loaded = [];
  for (const entry of USER_MODULES) {
    const mod = await safeImport(entry.path);
    if (!mod) continue;
    if (!entry.globals) { loaded.push(entry.path); continue; }
    const value = pick(mod, ...entry.globals);
    if (!value) { loaded.push(entry.path + " (no export)"); continue; }
    for (const g of entry.globals) if (!window[g]) window[g] = value;
    loaded.push(entry.path + " → " + entry.globals[0]);
  }
  console.info("[main-v6] user modules:", loaded.length, "of", USER_MODULES.length);
}

const ROUTES = ["game", "puzzle", "learn", "settings", "about"];
function normalize(hash) {
  const r = (hash || "").replace(/^#\/?/, "").trim();
  return ROUTES.includes(r) ? r : "game";
}
function parseHash() {
  let h = (location.hash || "#/game").replace(/^#\/?/, "");
  let query = {};
  const qIdx = h.indexOf("?");
  if (qIdx >= 0) {
    h.slice(qIdx + 1).split("&").forEach(kv => {
      const [k, v] = kv.split("=");
      if (k) query[decodeURIComponent(k)] = decodeURIComponent(v || "");
    });
    h = h.slice(0, qIdx);
  }
  const [routeRaw, param] = h.split("/");
  const alias = { learn: "learning", "": "game" };
  return { route: alias[routeRaw] || routeRaw || "game", param: param || query.id || null };
}

function showRoute(route, param) {
  document.querySelectorAll(".app-page").forEach(p => {
    const active = p.getAttribute("data-page") === route;
    p.classList.toggle("is-active", active);
    p.hidden = !active;
  });
  document.querySelectorAll("[data-route]").forEach(a => {
    if (a.getAttribute("data-route") === route) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
  try { document.dispatchEvent(new CustomEvent("route:change", { detail: { route, param } })); } catch (e) {}
  const main = document.getElementById("main-content");
  if (main && main.focus) { try { main.focus({ preventScroll: true }); } catch (e) { main.focus(); } }
}

const bridgeInit = { game: false, puzzle: false, learn: false };
function initBridgeForRoute(route, param) {
  if (route === "game" && !bridgeInit.game) {
    bridgeInit.game = true;
    if (window.GameBridge && window.GameBridge.init) {
      try { window.GameBridge.init(); }
      catch (e) { console.error("[main-v6] GameBridge.init() throw:", e); }
    }
  }
  if (route === "puzzle") {
    if (window.PuzzleBridge && window.PuzzleBridge.init) {
      try {
        if (!bridgeInit.puzzle) { bridgeInit.puzzle = true; window.PuzzleBridge.init(); }
        if (param && window.PuzzleMode && window.PuzzleMode.selectPuzzle) window.PuzzleMode.selectPuzzle(param);
      }
      catch (e) { console.error("[main-v6] PuzzleBridge.init() throw:", e); }
    }
  }
  if (route === "learning") {
    if (window.LearnBridge && window.LearnBridge.init) {
      try {
        if (!bridgeInit.learn) { bridgeInit.learn = true; window.LearnBridge.init(); }
        if (param && window.LessonsMode && window.LessonsMode.openLesson) window.LessonsMode.openLesson(param);
      }
      catch (e) { console.error("[main-v6] LearnBridge.init() throw:", e); }
    }
  }
  if (route === "settings" && !bridgeInit.settings) {
    bridgeInit.settings = true;
    if (window.SettingsBridge && window.SettingsBridge.init) {
      try { window.SettingsBridge.init(); }
      catch (e) { console.error("[main-v6] SettingsBridge.init() throw:", e); }
    }
  }
}
function initThemeToggle() {
  const btn = document.getElementById("btn-theme");
  if (!btn || btn.__bound) return;
  btn.__bound = true;
  btn.addEventListener("click", () => {
    const cur = document.body.getAttribute("data-theme") || "dark";
    const next = cur === "dark" ? "light" : "dark";
    document.body.setAttribute("data-theme", next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      if (window.AppStorage && window.AppStorage.set) window.AppStorage.set("theme", next);
      else if (window.localStorage) localStorage.setItem("chess:theme", next);
    } catch (e) {}
  });
}
function restoreTheme() {
  try {
    const saved = (window.AppStorage && window.AppStorage.get)
      ? window.AppStorage.get("theme")
      : (window.localStorage ? localStorage.getItem("chess:theme") : null);
    if (saved === "light" || saved === "dark") {
      document.body.setAttribute("data-theme", saved);
      document.documentElement.setAttribute("data-theme", saved);
    }
  } catch (e) {}
}

function initLangSwitcher() {
  if (!window.LanguageSwitcher || !window.LanguageSwitcher.mount) return;
  ["lang-slot", "lang-slot-settings"].forEach(id => {
    const slot = document.getElementById(id);
    if (!slot || slot.__mounted) return;
    slot.__mounted = true;
    try { window.LanguageSwitcher.mount(slot); }
    catch (e) { console.warn("[main-v6] switcher mount gagal:", e); }
  });
}

function bindSettings() {
  const themeSel = document.getElementById("setting-theme");
  if (themeSel && !themeSel.__bound) {
    themeSel.__bound = true;
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
  if (boardSel && !boardSel.__bound) {
    boardSel.__bound = true;
    boardSel.addEventListener("change", e => {
      document.documentElement.setAttribute("data-board-theme", e.target.value);
      try {
        if (window.AppStorage && window.AppStorage.set) window.AppStorage.set("boardTheme", e.target.value);
        else if (window.localStorage) localStorage.setItem("chess:boardTheme", e.target.value);
      } catch (err) {}
    });
  }
}


// Util skeleton & state kosong/error (dipakai bridge/lessons/puzzle)
window.AppSkeleton = {
  _t: new WeakMap(),
  _arm(el) {
    clearTimeout(this._t.get(el));
    this._t.set(el, setTimeout(() => {
      // timeout pengaman: skeleton tak tampil selamanya
      if (el && el.querySelector(".skeleton")) this.empty(el, "common.error", true);
    }, 8000));
  },
  lines(el, n) {
    if (!el) return;
    let html = '<div class="skeleton skeleton--title" aria-hidden="true"></div>';
    for (let i = 0; i < (n || 4); i++) html += '<div class="skeleton skeleton--line" aria-hidden="true"></div>';
    el.innerHTML = html;
    this._arm(el);
  },
  cards(el, n) {
    if (!el) return;
    let html = '';
    for (let i = 0; i < (n || 3); i++) html += '<div class="skeleton skeleton--card" aria-hidden="true"></div>';
    el.innerHTML = html;
    this._arm(el);
  },
  board(el) { if (el) { el.innerHTML = '<div class="skeleton skeleton--board" aria-hidden="true"></div>'; this._arm(el); } },
  empty(el, key, retry) {
    if (!el) return;
    el.innerHTML = '<div class="state-box" role="status"><p>' +
      (window.I18n ? window.I18n.t(key) : key) + '</p>' +
      (retry ? '<button class="btn accent" data-retry>' +
        (window.I18n ? window.I18n.t("common.retry") : "Retry") + '</button>' : '') +
      '</div>';
    const b = el.querySelector("[data-retry]");
    if (b) b.addEventListener("click", () => location.reload());
  }
};

function initSidebarProgress() {
  const sp = document.getElementById("side-progress");
  if (!sp || !window.AppSkeleton) return;
  window.AppSkeleton.lines(sp, 3);
  setTimeout(() => {
    try {
      const T = window.I18n ? window.I18n.t : k => k;
      const lp = JSON.parse((window.AppStorage && AppStorage.get("lessonProgress")) || "{}");
      const cnt = window.PuzzleMode && PuzzleMode.solvedCount ? PuzzleMode.solvedCount() : 0;
      sp.innerHTML =
        '<h3 class="app-card-title">' + T("learning.progress") + '</h3>' +
        '<div class="text-sub">' + T("learning.progressCount", { current: Object.keys(lp).length, total: 50 }) + '</div>' +
        '<h3 class="app-card-title" style="margin-top:8px">' + T("puzzle.title") + '</h3>' +
        '<div class="text-sub">' + T("puzzle.solvedCount", { count: cnt }) + '</div>';
    } catch (e) { window.AppSkeleton && AppSkeleton.empty(sp, "common.error", false); }
  }, 600);
}

async function boot() {
  if (document.readyState === "loading") {
    await new Promise(r => document.addEventListener("DOMContentLoaded", r, { once: true }));
  }
  console.log("[main-v6] booting...");

  await loadBridges();

  if (window.I18n && window.I18n.init) {
    try { window.I18n.init(); } catch (e) { console.warn("[main-v6] I18n.init gagal:", e); }
  }

  await loadUserModules();

  console.info("[main-v6] window map:", {
    Chess: typeof window.Chess, GameMode: typeof window.GameMode,
    BoardView: typeof window.BoardView, PuzzleMode: typeof window.PuzzleMode,
    LessonsMode: typeof window.LessonsMode, AppStorage: typeof window.AppStorage,
    I18n: typeof window.I18n, CompatShell: typeof window.CompatShell,
    IDShim: typeof window.IDShim, GameBridge: typeof window.GameBridge,
    PuzzleBridge: typeof window.PuzzleBridge, LearnBridge: typeof window.LearnBridge
  });

  restoreTheme();initThemeToggle();
  initSidebarProgress();
  
  bindSettings();

  const current = parseHash();
  window.addEventListener("hashchange", () => {
    const r = parseHash();
    showRoute(r.route, r.param);
  });
  if (!location.hash) {
    try { history.replaceState(null, "", "#/game"); } catch (e) { location.hash = "/game"; }
  }
  showRoute(current.route, current.param);

  initLangSwitcher();
  initBridgeForRoute(current.route, current.param);

  document.addEventListener("route:change", e => {
    if (e && e.detail && e.detail.route) initBridgeForRoute(e.detail.route, e.detail.param);
  });

  console.log("%c[main-v6] Siap.", "color:#10b981;font-weight:bold");
}
const bootPromise = (typeof window !== "undefined" && !window.__mainV6Loaded)
  ? (window.__mainV6Loaded = true,
     console.log("%c[main-v6] LOADED", "color:#10b981;font-weight:bold"),
     boot())
  : (console.warn("[main-v6] duplicate load prevented."), null);
if (bootPromise && bootPromise.catch) {
  bootPromise.catch(e => console.error("[main-v6] boot gagal:", e));
}

// Sembunyikan splash loading setelah boot selesai (fade-out, lalu hapus)
function hideAppLoading() {
  const el = document.getElementById("app-loading");
  if (!el) return;
  el.classList.add("done");
  setTimeout(() => el.remove(), 400);
}
if (bootPromise && bootPromise.then) bootPromise.then(hideAppLoading);
// Fallback pengaman: selalu hilangkan splash walau boot lambat/gagal
setTimeout(hideAppLoading, 10000);
