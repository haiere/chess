/**
 * js/main.js — Entry ESM.
 * Strategi:
 *  1) Import i18n + LanguageSwitcher (statis, urutan terjamin).
 *  2) Import bridges (definisi saja, belum init).
 *  3) Dynamic-import modul user, mapping export → window.*
 *  4) Boot: init i18n, restore theme, router, mount switcher, trigger bridge.
 *
 * Toleran: modul yang gagal load di-log, bukan crash.
 */
import "./i18n.js";
import "./components/LanguageSwitcher.js";
import "./bridge/game-bridge.js";
import "./bridge/index.js";

async function safeImport(path) {
  try {
    return await import(path);
  } catch (e) {
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

// Daftar modul user + nama export yang mungkin → nama global yang diharapkan bridge
const USER_MODULES = [
  { path: "./storage.js",           globals: ["AppStorage", "Storage"] },
  { path: "./utils/storage.js",     globals: ["AppStorage", "Storage"] },
  { path: "./utils/theme.js",       globals: ["Theme"] },
  { path: "./audio.js",             globals: ["Audio", "Sound"] },
  { path: "./pieces.js",            globals: ["Pieces"] },
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
  { path: "./lessons.js",           globals: ["LessonsMode", "Lessons", "Mode"] },
  { path: "./pages/PuzzlePage.js",  globals: ["PuzzlePage"] },
  { path: "./pages/LearnPage.js",   globals: ["LearnPage"] }
];

async function loadUserModules() {
  const loaded = [];
  for (const entry of USER_MODULES) {
    const mod = await safeImport(entry.path);
    if (!mod) continue;
    const value = pick(mod, ...entry.globals);
    if (!value) {
      // Modul tidak punya export yang kita kenali — mungkin hanya side-effect
      loaded.push(entry.path + " (side-effect)");
      continue;
    }
    for (const g of entry.globals) {
      if (!window[g]) window[g] = value;
    }
    loaded.push(entry.path + " → " + entry.globals[0]);
  }
  console.info("[main] modul dimuat:", loaded.length ? loaded : "(tidak ada)");
}

function normalize(hash) {
  const ROUTES = ["game", "puzzle", "learn", "settings", "about"];
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
  try { document.dispatchEvent(new CustomEvent("route:change", { detail: { route } })); } catch (e) {}
  const main = document.getElementById("main-content");
  if (main && main.focus) { try { main.focus({ preventScroll: true }); } catch (e) { main.focus(); } }
}

function initLangSwitcher() {
  if (!window.LanguageSwitcher || !window.LanguageSwitcher.mount) return;
  ["lang-slot", "lang-slot-settings"].forEach(id => {
    const slot = document.getElementById(id);
    if (!slot) return;
    try { window.LanguageSwitcher.mount(slot); }
    catch (e) { console.warn("[main] LanguageSwitcher.mount(#" + id + ") gagal:", e); }
  });
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

async function boot() {
  if (document.readyState === "loading") {
    await new Promise(r => document.addEventListener("DOMContentLoaded", r, { once: true }));
  }

  // i18n dulu
  if (window.I18n && window.I18n.init) {
    try { window.I18n.init(); } catch (e) { console.warn("[main] I18n.init gagal:", e); }
  }

  // Muat modul user
  await loadUserModules();

  console.info("[main] window map:", {
    Chess: typeof window.Chess,
    GameMode: typeof window.GameMode,
    BoardView: typeof window.BoardView,
    PuzzleMode: typeof window.PuzzleMode,
    LessonsMode: typeof window.LessonsMode,
    AppStorage: typeof window.AppStorage
  });

  restoreTheme();
  initThemeToggle();

  // Router
  window.addEventListener("hashchange", () => showRoute(normalize(location.hash)));
  if (!location.hash) {
    try { history.replaceState(null, "", "#game"); } catch (e) { location.hash = "game"; }
  }
  showRoute(normalize(location.hash));

  // Switcher
  initLangSwitcher();

  // Trigger bridge untuk route awal
  if (window.Bridge && window.Bridge.initForRoute) {
    window.Bridge.initForRoute(normalize(location.hash));
  }

  console.info("[main] Siap.");
}

boot().catch(e => console.error("[main] boot gagal:", e));
