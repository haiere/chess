/**
 * js/bridge/id-shim.js — Universal ID shim.
 * Menyediakan API untuk menjalankan fungsi init dengan auto-injection
 * elemen DOM untuk ID yang diminta tapi tidak ada.
 *
 * Berguna untuk modul lama (puzzle.js, lessons.js) yang mengasumsikan
 * struktur HTML tertentu tanpa null-check.
 */

const CREATED = new Set();
const LOG = [];

function inferTag(id) {
  if (!id) return "div";
  const lower = id.toLowerCase();
  if (lower.startsWith("btn")) return "button";
  if (lower.startsWith("set") || lower.includes("select")) return "select";
  if (lower.includes("input") || lower.includes("field")) return "input";
  return "div";
}

function createShim(id) {
  const tag = inferTag(id);
  const el = document.createElement(tag);
  el.id = id;
  el.setAttribute("data-shim", "1");
  el.setAttribute("aria-hidden", "true");
  el.tabIndex = -1;
  el.style.cssText =
    "position:absolute;width:0;height:0;overflow:hidden;" +
    "left:-9999px;top:-9999px;pointer-events:none;";

  if (tag === "button") {
    el.type = "button";
  } else if (tag === "select") {
    // Beberapa option default supaya select tidak crash saat .value diakses
    const o = document.createElement("option");
    o.value = "";
    o.textContent = "";
    el.appendChild(o);
  } else if (tag === "div" && id.toLowerCase().includes("modal")) {
    el.className = "modal-overlay hidden";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-hidden", "true");
  }

  document.body.appendChild(el);
  CREATED.add(id);
  return el;
}

export const IDShim = {
  /**
   * Jalankan fn() dengan getElementById di-patch.
   * Setiap ID yang diminta tapi tidak ada → auto-create.
   */
  runWithShim(fn, opts) {
    opts = opts || {};
    const requested = new Set();
    const missing = new Set();
    const orig = document.getElementById;

    document.getElementById = function (id) {
      if (id) requested.add(id);
      let el = orig.call(document, id);
      if (!el && id && opts.autoCreate !== false) {
        el = createShim(id);
        missing.add(id);
      }
      return el;
    };

    let error = null;
    try {
      fn();
    } catch (e) {
      error = e;
    } finally {
      document.getElementById = orig;
    }

    const result = {
      requestedIds: Array.from(requested),
      createdIds: Array.from(missing),
      error
    };
    LOG.push(result);
    return result;
  },

  /** Buat elemen untuk ID tertentu secara manual. */
  ensure(id) {
    const existing = document.getElementById(id);
    if (existing) return existing;
    return createShim(id);
  },

  /** Daftar ID yang sudah dibuat shim-nya. */
  list() { return Array.from(CREATED); },

  log() { return LOG.slice(); },

  _reset() { CREATED.clear(); LOG.length = 0; }
};

if (typeof window !== "undefined") window.IDShim = IDShim;
export default IDShim;
