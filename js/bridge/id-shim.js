/**
 * js/bridge/id-shim.js — v2.
 * Sekarang mendukung per-ID container mapping:
 *   - Default: ke visible container (jika diset)
 *   - Tombol (btn*) dan Modal (*Modal): ke hidden container
 *   - Bisa override per-ID via containerFor callback.
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

function createShim(id, container) {
  const tag = inferTag(id);
  const el = document.createElement(tag);
  el.id = id;
  el.setAttribute("data-shim", "1");
  el.tabIndex = -1;

  const isHidden = container && container.dataset && container.dataset.hidden === "1";
  if (isHidden) {
    el.setAttribute("aria-hidden", "true");
    el.style.cssText =
      "position:absolute;width:0;height:0;overflow:hidden;" +
      "left:-9999px;top:-9999px;pointer-events:none;";
  }

  if (tag === "button") {
    el.type = "button";
  } else if (tag === "select") {
    const o = document.createElement("option");
    o.value = "";
    o.textContent = "";
    el.appendChild(o);
  } else if (id.toLowerCase().includes("modal")) {
    el.className = "modal-overlay hidden";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-hidden", "true");
  }

  (container || document.body).appendChild(el);
  CREATED.add(id);
  return el;
}

function getHiddenContainer() {
  let c = document.getElementById("compat-shell");
  if (!c) {
    c = document.createElement("div");
    c.id = "compat-shell";
    c.dataset.hidden = "1";
    c.setAttribute("aria-hidden", "true");
    c.style.cssText = "position:absolute;width:0;height:0;overflow:hidden;left:-9999px;top:-9999px;pointer-events:none;";
    document.body.appendChild(c);
  }
  return c;
}

export const IDShim = {
  /**
   * @param {Function} fn - fungsi init yang akan dijalankan
   * @param {Object} [opts]
   * @param {string} [opts.visibleContainerId] - container default untuk elemen non-tombol
   * @param {Function} [opts.containerFor] - callback(id) → HTMLElement, override per-ID
   */
  runWithShim(fn, opts) {
    opts = opts || {};
    const requested = new Set();
    const missing = new Set();
    const orig = document.getElementById;

    const hidden = getHiddenContainer();
    const visible = opts.visibleContainerId
      ? document.getElementById(opts.visibleContainerId)
      : null;

    function pickContainer(id) {
      if (typeof opts.containerFor === "function") {
        const custom = opts.containerFor(id);
        if (custom) return custom;
      }
      const lower = id.toLowerCase();
      if (lower.startsWith("btn")) return hidden;
      if (lower.includes("modal")) return hidden;
      return visible || hidden;
    }

    document.getElementById = function (id) {
      if (id) requested.add(id);
      let el = orig.call(document, id);
      if (!el && id && opts.autoCreate !== false) {
        el = createShim(id, pickContainer(id));
        missing.add(id);
      }
      return el;
    };

    let error = null;
    try { fn(); }
    catch (e) { error = e; }
    finally { document.getElementById = orig; }

    const result = {
      requestedIds: Array.from(requested),
      createdIds: Array.from(missing),
      error
    };
    LOG.push(result);
    return result;
  },

  ensure(id, container) {
    const existing = document.getElementById(id);
    if (existing) return existing;
    return createShim(id, container);
  },

  list() { return Array.from(CREATED); },
  log() { return LOG.slice(); },
  _reset() { CREATED.clear(); LOG.length = 0; }
};

if (typeof window !== "undefined") window.IDShim = IDShim;
export default IDShim;
