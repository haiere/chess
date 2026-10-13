/**
 * js/main.js — Entry ESM.
 *
 * Urutan eksekusi:
 *  1. Import i18n + LanguageSwitcher + bridges (statis).
 *  2. Dynamic-import modul user, mapping export → window.*
 *  3. Boot: init i18n, restore theme, router, mount switcher, trigger bridge.
 *
 * Toleran: modul yang gagal load di-log, bukan crash.
 * File pages/PuzzlePage.js dan pages/LearnPage.js SENGAJA tidak dimuat
 * karena mengandung sintaks private class field yang gagal di-parser,
 * dan halaman tersebut sudah di-handle oleh bridge.
 */
import "./i18n.js";
import "./components/LanguageSwitcher.js";
import "./bridge/compat-shell.js";
import "./bridge/game-bridge.js";
import "./bridge/puzzle-bridge.js";
import "./bridge/learn-bridge.js";
import "./bridge/index.js";

/* ---------- helpers ---------- */

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

/* ---------- daftar modul user ---------- */

/**
 * Setiap entry: path relatif + nama export yang mungkin.
 * Urutan penting: storage/i18n dulu, lalu engine, lalu mode, terakhir pages.
 * Entry dengan globals: null artinya side-effect saja (tidak perlu di-map ke window).
 */
const USER_MODULES = [
  // --- storage & utils ---
  { path: "./storage.js",           globals: ["AppStorage", "Storage"] },
  { path: "./utils/storage.js",     globals: ["AppStorage", "Storage"] },
  { path: "./utils/theme.js",       globals: ["Theme"] },

  // --- media & icons ---
  { path: "./audio.js",             globals: ["SFX", "Audio", "Sound"] },
  { path: "./pieces.js",            globals: ["ChessPieces", "Pieces"] },
  { path: "./icons/svg.js",         globals: ["Icons", "SvgIcons"] },

  // --- engine ---
  { path: "./engine.js",            globals: ["Chess", "Engine", "ChessEngine"] },
  { path: "./chess/engine.js",      globals: ["Chess", "Engine", "ChessEngine"] },
  { path: "./chess/constants.js",   globals: ["ChessConstants", "Constants"] },

  // --- board view & components ---
  { path: "./board-view.js",        globals: ["BoardView", "View", "Board"] },
  { path: "./components/Board.js",  globals: ["Board"] },
  { path: "./components/Icon.js",   globals: ["Icon"] },

  // --- modes ---
  { path: "./game.js",              globals: ["GameMode", "Game", "Mode"] },
  { path: "./puzzle-data.js",       globals: ["PuzzleData"] },
  { path: "./data/puzzles.js",      globals: ["Puzzles", "PuzzleData"] },
  { path: "./puzzle/provider.js",   globals: ["PuzzleProvider", "Provider"] },
  { path: "./puzzle.js",            globals: ["PuzzleMode", "Puzzle", "Mode"] },
  { path: "./lessons-data.js",      globals: ["LessonsData"] },
  { path: "./data/Lesson.js",       globals: ["Lesson", "LessonsData"] },
  { path: "./lessons.js",           globals: ["LessonsMode", "Lessons", "Mode"] }

  // CATATAN: pages/PuzzlePage.js dan pages/LearnPage.js TIDAK dimuat.
  // Alasan: mengandung private class field (#selected) yang gagal di-parse
  // di browser target, dan halaman tersebut di-handle oleh bridge.
  // Kalau nanti file-nya sudah diperbaiki, tambahkan kembali:
  // { path: "./pages/PuzzlePage.js", globals: ["PuzzlePage"] },
  // { path: "./pages/LearnPage.js",  globals: ["LearnPage"] }
];

async function loadUserModules() {
  const loaded = [];
  for (const entry of USER_MODULES) {
    const mod = await safeImport(entry.path);
    if (!mod) continue;

    // Kalau globals null → side-effect saja
    if (!entry.globals) {
      loaded.push(entry.path + " (side-effect)");
      continue;
    }

    const value = pick(mod, ...entry.globals);
    if (!value) {
      // Modul ter-load tapi tidak punya export yang kita kenali
      loaded.push(entry.path + " (loaded, no matching export)");
      continue;
    }

    for (const g of entry.globals) {
      if (!window[g]) window[g] = value;
    }
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
  try {
    document.dispatchEvent(new CustomEvent("route:change", { detail: { route } }));
  } catch (e) { /* ignore */ }
  const main = document.getElementById("main-content");
  if (main && main.focus) {
    try { main.focus({ preventScroll: true }); } catch (e) { main.focus(); }
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
    } catch (e) { /* ignore */ }
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
  } catch (e) { /* ignore */ }
}

/* ---------- language switcher ---------- */

function initLangSwitcher() {
  if (!window.LanguageSwitcher || !window.LanguageSwitcher.mount) return;
  ["lang-slot", "lang-slot-settings"].forEach(id => {
    const slot = document.getElementById(id);
    if (!slot) return;
    // Cegah double-mount
    if (slot.__mounted) return;
    slot.__mounted = true;
    try {
      window.LanguageSwitcher.mount(slot);
    } catch (e) {
      console.warn("[main] LanguageSwitcher.mount(#" + id + ") gagal:", e);
    }
  });
}

/* ---------- boot ---------- */

async function boot() {
  if (document.readyState === "loading") {
    await new Promise(r => document.addEventListener("DOMContentLoaded", r, { once: true }));
  }

  // 1. i18n dulu — semua modul lain butuh ini
  if (window.I18n && window.I18n.init) {
    try { window.I18n.init(); }
    catch (e) { console.warn("[main] I18n.init gagal:", e); }
  }

  // 2. Muat semua modul user (map ke window.*)
  await loadUserModules();

  // 3. Diagnostic ringkas
  console.info("[main] window map:", {
    Chess:       typeof window.Chess,
    GameMode:    typeof window.GameMode,
    BoardView:   typeof window.BoardView,
    PuzzleMode:  typeof window.PuzzleMode,
    LessonsMode: typeof window.LessonsMode,
    AppStorage:  typeof window.AppStorage
  });

  // 4. Theme
  restoreTheme();
  initThemeToggle();

  // 5. Router
  window.addEventListener("hashchange", () => showRoute(normalize(location.hash)));
  if (!location.hash) {
    try { history.replaceState(null, "", "#game"); }
    catch (e) { location.hash = "game"; }
  }
  showRoute(normalize(location.hash));

  // 6. Mount language switcher
  initLangSwitcher();

  // 7. Trigger bridge untuk route awal
  if (window.Bridge && window.Bridge.initForRoute) {
    window.Bridge.initForRoute(normalize(location.hash));
  }

  console.info("[main] Siap.");
}

boot().catch(e => console.error("[main] boot gagal:", e));
