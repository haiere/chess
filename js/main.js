/**
 * js/main.js — Entry ESM v3.
 * Kontrol bridge secara eksplisit. TIDAK mengandalkan bridge/index.js.
 * Alasan: bridge/index.js pernah hilang/mismatch, menyebabkan GameBridge.init()
 * tidak pernah dipanggil.
 */
import "./i18n.js";
import "./components/LanguageSwitcher.js";
import "./bridge/game-bridge.js";
import "./bridge/visual-polish.js";
import "./bridge/puzzle-bridge.js";
import "./bridge/learn-bridge.js";
// bridge/index.js TIDAK diimpor — kita kontrol manual di bawah.

/* ---------- helpers ---------- */
async function safeImport(path) {
  try { return await import(path); }
  catch (e) {
    console.warn("[main] gagal load", path, "→", e && e.message ? e.message : e);
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

/* ---------- user modules ---------- */
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
  console.info("[main] modul dimuat:", loaded.length ? loaded : "(tidak ada)");
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

/* ---------- bridge controller (MANUAL) ---------- */
const bridgeInit = { game: false, puzzle: false, learn: false };

function initBridgeForRoute(route) {
  if (route === "game" && !bridgeInit.game) {
    bridgeInit.game = true;
    console.info("[main] → GameBridge.init()");
    if (window.GameBridge && typeof window.GameBridge.init === "function") {
      try { window.GameBridge.init(); }
      catch (e) { console.error("[main] GameBridge.init() throw:", e); }
    } else {
      console.warn("[main] window.GameBridge tidak tersedia.");
    }
  }
  if (route === "puzzle" && !bridgeInit.puzzle) {
    bridgeInit.puzzle = true;
    console.info("[main] → PuzzleBridge.init()");
    if (window.PuzzleBridge && typeof window.PuzzleBridge.init === "function") {
      try { window.PuzzleBridge.init(); }
      catch (e) { console.error("[main] PuzzleBridge.init() throw:", e); }
    } else {
      console.warn("[main] window.PuzzleBridge tidak tersedia.");
    }
  }
  if (route === "learn" && !bridgeInit.learn) {
    bridgeInit.learn = true;
    console.info("[main] → LearnBridge.init()");
    if (window.LearnBridge && typeof window.LearnBridge.init === "function") {
      try { window.LearnBridge.init(); }
      catch (e) { console.error("[main] LearnBridge.init() throw:", e); }
    } else {
      console.warn("[main] window.LearnBridge tidak tersedia.");
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
    catch (e) { console.warn("[main] LanguageSwitcher.mount(#" + id + ") gagal:", e); }
  });
}

/* ---------- settings bindings ---------- */
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

  // 1. i18n
  if (window.I18n && window.I18n.init) {
    try { window.I18n.init(); }
    catch (e) { console.warn("[main] I18n.init gagal:", e); }
  }

  // 2. muat modul user
  await loadUserModules();

  console.info("[main] window map:", {
    Chess:       typeof window.Chess,
    GameMode:    typeof window.GameMode,
    BoardView:   typeof window.BoardView,
    PuzzleMode:  typeof window.PuzzleMode,
    LessonsMode: typeof window.LessonsMode,
    AppStorage:  typeof window.AppStorage,
    CompatShell: typeof window.CompatShell,
    GameBridge:  typeof window.GameBridge,
    PuzzleBridge: typeof window.PuzzleBridge,
    LearnBridge: typeof window.LearnBridge,
    GameBridgeV: window.__GAME_BRIDGE_V__ || "(none)"
  });

  // 3. theme + settings
  restoreTheme();
  initThemeToggle();
  bindSettings();

  // 4. router
  window.addEventListener("hashchange", () => showRoute(normalize(location.hash)));
  if (!location.hash) {
    try { history.replaceState(null, "", "#game"); }
    catch (e) { location.hash = "game"; }
  }
  showRoute(normalize(location.hash));

  // 5. language switcher
  initLangSwitcher();

  // 6. bridge untuk route awal (MANUAL, eksplisit)
  initBridgeForRoute(normalize(location.hash));

  // 7. bridge untuk route selanjutnya
  document.addEventListener("route:change", e => {
    if (e && e.detail && e.detail.route) initBridgeForRoute(e.detail.route);
  });

  console.info("[main] Siap.");
}

boot().catch(e => console.error("[main] boot gagal:", e));
