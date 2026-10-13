/**
 * js/bridge/game-bridge.js — ESM v6.
 * Pendekatan baru: game.js menangani semua binding internal.
 * Bridge hanya menyiapkan DOM shell via CompatShell, lalu init().
 */
import { CompatShell } from "./compat-shell.js";

let MOUNTED = false, instance = null;

function $(id) { return document.getElementById(id); }

function placeholderText(key) {
  const lang = window.I18n ? window.I18n.getLang() : "id";
  const texts = {
    id: {
      noBoard: "Elemen papan tidak ditemukan.",
      noGameMode: "Modul permainan belum tersedia.",
      initFailed: "Modul permainan gagal diinisialisasi. Buka Console untuk detail."
    },
    en: {
      noBoard: "Board element not found.",
      noGameMode: "Game module not available.",
      initFailed: "Game module failed to initialize. Check Console."
    }
  };
  return (texts[lang] || texts.id)[key];
}

function showPlaceholder(msg) {
  const container = $("board-container");
  const boardEl = $("board");
  if (!container) return;
  if (boardEl) boardEl.style.display = "none";
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

function clearPlaceholder() {
  const container = $("board-container");
  const boardEl = $("board");
  if (container) {
    const old = container.querySelector(".app-placeholder");
    if (old) old.remove();
  }
  if (boardEl) boardEl.style.display = "";
}

export const GameBridge = {
  init() {
    if (MOUNTED) return instance;
    MOUNTED = true;

    // 1. Pastikan #board ada
    let boardEl = $("board");
    if (!boardEl) {
      const container = $("board-container");
      if (container) {
        boardEl = document.createElement("div");
        boardEl.id = "board";
        boardEl.className = "board";
        container.appendChild(boardEl);
        console.warn("[GameBridge] #board tidak ada, dibuat baru.");
      } else {
        showPlaceholder(placeholderText("noBoard"));
        return null;
      }
    }

    // 2. Cek GameMode
    const GM = window.GameMode;
    if (!GM || typeof GM.init !== "function") {
      showPlaceholder(placeholderText("noGameMode"));
      return null;
    }

    // 3. Siapkan DOM shell SEBELUM init — critical!
    console.info("[GameBridge] menyiapkan compat shell...");
    CompatShell.ensure();
    clearPlaceholder();

    // 4. Panggil init
    try {
      console.info("[GameBridge] memanggil GameMode.init()...");
      GM.init();
      instance = GM;
    } catch (e) {
      console.error("[GameBridge] GameMode.init() throw:", e);
      showPlaceholder(placeholderText("initFailed"));
      return null;
    }

    // 5. Cek hasil
    if (boardEl.children.length === 0) {
      console.warn("[GameBridge] init() selesai tapi board kosong. Kemungkinan render() gagal di dalam.");
      showPlaceholder(placeholderText("initFailed"));
      return null;
    }

    console.info("[GameBridge] siap. Board children:", boardEl.children.length);
    return instance;
  },
  getInstance() { return instance; },
  _reset() { MOUNTED = false; instance = null; }
};

if (typeof window !== "undefined") window.GameBridge = GameBridge;
export default GameBridge;
