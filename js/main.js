/**
 * js/main.js — v5 BULLETPROOF.
 * TIDAK ADA static import. Semua dynamic dengan try/catch.
 * Apapun yang terjadi di file lain, main.js tetap execute.
 */
console.log("%c[main-v5] main.js LOADED", "color:#10b981;font-weight:bold");

const BRIDGE_IMPORTS = [
  "./i18n.js",
  "./components/LanguageSwitcher.js",
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
  { path: "./data/puzzles.js",      globals: ["Puzzles", "PuzzleData"] },
  { path: "./puzzle/provider.js",   globals: ["PuzzleProvider", "Provider"] },
  { path: "./puzzle.js",            globals: ["PuzzleMode", "Puzzle", "Mode"] },
  { path: "./lessons-data.js",      globals: ["LessonsData"] },
  { path: "./data/Lesson.js",       globals: ["Lesson", "LessonsData"] },
  { path: "./lessons.js",           globals: ["LessonsMode", "Lessons", "Mode"] }
];

/* ---------- helpers ---------- */
async function safeImport(path) {
  try { return await import(path); }
  catch (e) {
    console.warn("[main-v5] gagal load", path, "→", e && e.message ? e.message : e);
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

/* ---------- load bridge modules (dynamic) ---------- */
async function loadBridges() {
  const loaded = [];
  for (const path of BRIDGE_IMPORTS) {
    const mod = await safeImport(path);
    if (mod) loaded.push(path);
  }
  console.info("[main-v5] bridge modules loaded:", loaded);
}

/* ---------- load user modules ---------- */
async function loadUserModules() {
  const loaded = [];
  for (const entry of USER_MODULES) {
    const mod = await safeImport(entry.path);
    if (!mod) continue;
    if (!entry.globals) { loaded.push(entry.path + " (side-effect)"); continue; }
    const value = pick(mod, ...entry.globals);
    if (!value) { loaded.push(entry.path + " (no export)"); continue; }
    for (const g of entry.globals) if (!window[g]) window[g] = value;
    loaded.push(entry.path + " → " + entry.globals[0]);
  }
  console.info("[main-v5] user modules loaded:", loaded.length, "of", USER_MODULES.length);
  return loaded;
}

/* ---------- router ---------- */
const ROUTES = ["game", "puzzle", "learn", "settings", "about"];
function normalize(hash) {
  const r = (hash || "").replace(/^#\/?/, "").trim();
  return ROUTES.includes(r) ? r : "game";
}
function showRoute(route) {
  document.querySelectorAll(".app-page").forEach(p => {
    const active = p.getAttribute("data-page") === route;
    p.classList.toggle("is-active", active);
    p.hidden = !active;
  });
  document.querySelectorAll("[data-route]").forEach(a => {
    if (a.getAttribute("data-route") === route) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
  try { document.dispatchEvent(new CustomEvent("route:change", { detail: { route } })); }
  catch (e) {}
  const main = document.getElementById("main-content");
  if (main && main.focus) { try { main.focus({ preventScroll: true }); } catch (e) { main.focus(); } }
}

/* ---------- bridges ---------- */
const bridgeInit = { game: false, puzzle: false, learn: false };

function initBridgeForRoute(route) {
  if (route === "game" && !bridgeInit.game) {
    bridgeInit.game = true;
    console.info("[main-v5] → GameBridge.init()");
    if (window.GameBridge && typeof window.GameBridge.init === "function") {
      try { window.GameBridge.init(); }
      catch (e) { console.error("[main-v5] GameBridge.init() throw:", e); }
    } else {
      console.warn("[main-v5] GameBridge tidak tersedia");
    }
  }
  if (route === "puzzle" && !bridgeInit.puzzle) {
    bridgeInit.puzzle = true;
    console.info("[main-v5] → PuzzleBridge.init()");
    if (window.PuzzleBridge && typeof window.PuzzleBridge.init === "function") {
      try { window.PuzzleBridge.init(); }
      catch (e) { console.error("[main-v5] PuzzleBridge.init() throw:", e); }
    } else {
      console.warn("[main-v5] PuzzleBridge tidak tersedia");
    }
  }
  if (route === "learn" && !bridgeInit.learn) {
    bridgeInit.learn = true;
    console.info("[main-v5] → LearnBridge.init()");
    if (window.LearnBridge && typeof window.LearnBridge.init === "function") {
      try { window.LearnBridge.init(); }
      catch (e) { console.error("[main-v5] LearnBridge.init() throw:", e); }
    } else {
      console.warn("[main-v5] LearnBridge tidak tersedia");
    }
  }
}

/* ---------- theme ---------- */
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

/* ---------- language switcher ---------- */
function initLangSwitcher() {
  if (!window.LanguageSwitcher || !window.LanguageSwitcher.mount) return;
  ["lang-slot", "lang-slot-settings"].forEach(id => {
    const slot = document.getElementById(id);
    if (!slot || slot.__mounted) return;
    slot.__mounted = true;
    try { window.LanguageSwitcher.mount(slot); }
    catch (e) { console.warn("[main-v5] LanguageSwitcher.mount(#" + id + ") gagal:", e); }
  });
}

/* ---------- settings ---------- */
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

/* ---------- boot ---------- */
async function boot() {
  if (document.readyState === "loading") {
    await new Promise(r => document.addEventListener("DOMContentLoaded", r, { once: true }));
  }
  console.log("[main-v5] DOM ready, starting boot...");

  // 1. Load bridges (dynamic)
  await loadBridges();
  console.log("[main-v5] bridges loaded. window.GameBridge:", typeof window.GameBridge);

  // 2. Init i18n
  if (window.I18n && window.I18n.init) {
    try { window.I18n.init(); }
    catch (e) { console.warn("[main-v5] I18n.init gagal:", e); }
  }

  // 3. Load user modules
  await loadUserModules();

  // 4. Report
  console.info("[main-v5] window map:", {
    Chess:       typeof window.Chess,
    GameMode:    typeof window.GameMode,
    BoardView:   typeof window.BoardView,
    PuzzleMode:  typeof window.PuzzleMode,
    LessonsMode: typeof window.LessonsMode,
    AppStorage:  typeof window.AppStorage,
    I18n:        typeof window.I18n,
    CompatShell: typeof window.CompatShell,
    IDShim:      typeof window.IDShim,
    GameBridge:  typeof window.GameBridge,
    PuzzleBridge: typeof window.PuzzleBridge,
    LearnBridge: typeof window.LearnBridge
  });

  // 5. Theme
  restoreTheme();
  initThemeToggle();
  bindSettings();

  // 6. Router
  window.addEventListener("hashchange", () => showRoute(normalize(location.hash)));
  if (!location.hash) {
    try { history.replaceState(null, "", "#game"); }
    catch (e) { location.hash = "game"; }
  }
  showRoute(normalize(location.hash));

  // 7. Language switcher
  initLangSwitcher();

  // 8. Bridge for current route
  initBridgeForRoute(normalize(location.hash));

  // 9. Bridge for future routes
  document.addEventListener("route:change", e => {
    if (e && e.detail && e.detail.route) initBridgeForRoute(e.detail.route);
  });

  console.log("%c[main-v5] Siap.", "color:#10b981;font-weight:bold");
}

boot().catch(e => console.error("[main-v5] boot gagal:", e));
