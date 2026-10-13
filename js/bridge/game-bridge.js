/**
 * js/bridge/game-bridge.js — ESM v5.
 * - Panggil GameMode.init() langsung (arity 0)
 * - Intercept getElementById untuk log semua ID yang diminta game.js
 * - Fallback manual: render BoardView dengan setState + render
 * - Placeholder aman (tidak hapus #board)
 */
let MOUNTED = false, instance = null, currentApi = null, boardViewRef = null;
const $ = id => document.getElementById(id);

function safe(label, fn) {
  try { return fn(); } catch (e) {
    console.warn("[GameBridge] " + label + " gagal:", e && e.message ? e.message : e);
    return null;
  }
}

function placeholderText(key) {
  const lang = window.I18n ? window.I18n.getLang() : "id";
  const texts = {
    id: { noGameMode:"Modul permainan belum tersedia.", initFailed:"Modul permainan gagal diinisialisasi. Buka Console untuk detail.", noBoard:"Elemen papan tidak ditemukan." },
    en: { noGameMode:"Game module not available.", initFailed:"Game module failed to initialize. Check Console.", noBoard:"Board element not found." }
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

/* ---------- Intercept getElementById ---------- */
function callInitWithIdLogging() {
  const requestedIds = new Set();
  const original = document.getElementById;
  document.getElementById = function (id) {
    requestedIds.add(id);
    return original.call(document, id);
  };
  let error = null;
  try {
    if (window.GameMode && typeof window.GameMode.init === "function") {
      window.GameMode.init();
    }
  } catch (e) { error = e; }
  document.getElementById = original;
  return { requestedIds: Array.from(requestedIds), error };
}

/* ---------- Fallback BoardView manual render ---------- */
function manualBoardRender(boardEl) {
  const BV = window.BoardView;
  if (!BV || typeof BV !== "function") return null;

  let view = null;
  try {
    view = new BV(boardEl, {
      orientation: "white",
      showCoords: true,
      interactive: true,
      onSquareClick: function () {}
    });
  } catch (e) {
    console.warn("[GameBridge] new BoardView gagal:", e && e.message ? e.message : e);
    return null;
  }
  boardViewRef = view;

  // Coba setState dengan berbagai sumber state
  const startFEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
  const stateCandidates = [];

  // Dari Chess engine kalau ada
  if (window.Chess) {
    for (const fn of ["fromFEN", "parseFEN", "fenToState", "initialState", "initial"]) {
      if (typeof window.Chess[fn] === "function") {
        stateCandidates.push({
          label: "Chess." + fn + "()",
          fn: () => window.Chess[fn](startFEN)
        });
        stateCandidates.push({
          label: "Chess." + fn + "() no-arg",
          fn: () => window.Chess[fn]()
        });
      }
    }
  }

  // Objek dengan fen
  stateCandidates.push({ label: "setState({fen})", fn: () => ({ fen: startFEN }) });
  stateCandidates.push({ label: "setState(fen-string)", fn: () => startFEN });

  let stateSet = false;
  if (typeof view.setState === "function") {
    for (const c of stateCandidates) {
      try {
        const st = c.fn();
        if (st) {
          view.setState(st);
          console.info("[GameBridge] BoardView.setState via " + c.label);
          stateSet = true;
          break;
        }
      } catch (e) { /* coba berikutnya */ }
    }
    if (!stateSet) console.warn("[GameBridge] tidak bisa setState dengan kandidat manapun.");
  }

  // Render
  try {
    if (typeof view.render === "function") view.render();
    console.info("[GameBridge] BoardView.render() dipanggil. Board children:", boardEl.children.length);
  } catch (e) {
    console.warn("[GameBridge] render() error:", e && e.message ? e.message : e);
  }

  return view;
}

/* ---------- Aliasing ID lama → ID baru ---------- */
/**
 * Bikin elemen tersembunyi dengan ID lama, agar game.js bisa menemukan tombolnya.
 * Arah: klik tombol baru → trigger klik elemen alias → game.js listener bereaksi.
 */
const ID_ALIASES = [
  // [id lama yang mungkin dicari game.js, id baru di HTML kita]
  ["btnNew",       "btn-new-game"],
  ["btnNewGame",   "btn-new-game"],
  ["newGameBtn",   "btn-new-game"],
  ["btnUndo",      "btn-undo"],
  ["undoBtn",      "btn-undo"],
  ["btnRedo",      "btn-redo"],
  ["redoBtn",      "btn-redo"],
  ["btnFlip",      "btn-flip"],
  ["btnFlipBoard", "btn-flip"],
  ["flipBtn",      "btn-flip"],
  ["btnCopyFen",   "btn-copy-fen"],
  ["btnCopyFEN",   "btn-copy-fen"],
  ["btnResign",    "btn-resign"],
  ["resignBtn",    "btn-resign"],
  ["btnCopyPgn",   "btn-copy-pgn"],
  ["btnCopyPGN",   "btn-copy-pgn"]
];

function createAliases(requestedIds) {
  let created = 0;
  for (const [oldId, newId] of ID_ALIASES) {
    // Buat alias hanya kalau game.js benar-benar memintanya
    if (!requestedIds.includes(oldId)) continue;
    // Dan kalau belum ada
    if (document.getElementById(oldId)) continue;
    const real = document.getElementById(newId);
    if (!real) continue;

    const alias = document.createElement("button");
    alias.id = oldId;
    alias.type = "button";
    alias.style.cssText = "position:absolute;left:-9999px;width:1px;height:1px;opacity:0;pointer-events:none;";
    alias.setAttribute("aria-hidden", "true");
    alias.tabIndex = -1;
    // Klik alias = klik real, jadi listener yang di-bind ke alias terpanggil
    document.body.appendChild(alias);
    // Klik real → trigger klik alias
    real.addEventListener("click", function () {
      try { alias.click(); } catch (e) {}
    });
    created++;
  }
  if (created > 0) console.info("[GameBridge] " + created + " alias tombol dibuat untuk kompatibilitas game.js lama.");
  return created;
}

/* ---------- Handlers ---------- */
function onState(s) { renderMoveHistory(s); updateStatus(s); }
function updateStatus(state) {
  const el = $("game-status");
  if (!el) return;
  let key = "game.yourTurn";
  if (state && state.turn) key = state.turn === "w" ? "game.whiteTurn" : "game.blackTurn";
  el.textContent = window.I18n ? window.I18n.t(key) : key;
}
function renderMoveHistory(state) {
  const list = $("move-history");
  if (!list || !state || !Array.isArray(state.moves)) return;
  list.innerHTML = "";
  for (const mv of state.moves) {
    const li = document.createElement("li");
    li.textContent = mv;
    list.appendChild(li);
  }
}

/* ---------- Public ---------- */
export const GameBridge = {
  init() {
    if (MOUNTED) return instance;
    MOUNTED = true;

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

    clearPlaceholder();
    currentApi = {
      GameMode: window.GameMode || null,
      BoardView: window.BoardView || null,
      Chess: window.Chess || null
    };

    /* ==== LANGKAH 1: panggil GameMode.init() dengan ID logging ==== */
    console.info("[GameBridge] memanggil GameMode.init()...");
    const { requestedIds, error } = callInitWithIdLogging();
    console.info("[GameBridge] ID yang diminta game.js selama init:", requestedIds);
    if (error) console.error("[GameBridge] GameMode.init() throw:", error);

    /* ==== LANGKAH 2: cek apakah board terisi ==== */
    if (boardEl.children.length > 0) {
      console.info("[GameBridge] board terisi oleh GameMode.init(). Siap.");
      instance = window.GameMode;
      // Buat alias tombol untuk yang belum ada
      createAliases(requestedIds);
      return instance;
    }

    /* ==== LANGKAH 3: fallback — render BoardView manual ==== */
    console.warn("[GameBridge] board kosong setelah init(). Coba render BoardView manual.");
    const bv = manualBoardRender(boardEl);
    if (bv && boardEl.children.length > 0) {
      console.info("[GameBridge] board dirender manual (mode terbatas: tidak bisa main sampai tombol ter-wire).");
      instance = bv;
      createAliases(requestedIds);
      return instance;
    }

    /* ==== LANGKAH 4: gagal total ==== */
    showPlaceholder(placeholderText("initFailed"));
    return null;
  },
  getInstance() { return instance; },
  _reset() { MOUNTED = false; instance = null; currentApi = null; boardViewRef = null; }
};

if (typeof window !== "undefined") window.GameBridge = GameBridge;
export default GameBridge;
