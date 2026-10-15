/**
 * js/bridge/id-shim.js — v5.
 * - persistentPatch stackable, merge benar
 * - Logging unconditional (tidak tertelan try/catch)
 * - Patch querySelector #id juga
 */

const CREATED = new Set();
const LOG = [];

let _persistentActive = false;
let _persistentOrigGet = null;
let _persistentOrigQS = null;
let _persistentPatterns = [];
let _persistentOpts = { containerFor: null, visibleContainer: null, verbose: false };

function inferTag(id) {
  if (!id) return "div";
  const lower = id.toLowerCase();
  if (lower.startsWith("btn")) return "button";
  if (lower.startsWith("set") || lower.includes("select")) return "select";
  if (lower.includes("input") || lower.includes("field")) return "input";
  return "div";
}

function getHiddenContainer() {
  let c = document.getElementById("compat-shell");
  if (!c) {
    c = document.createElement("div");
    c.id = "compat-shell";
    c.dataset.hidden = "1";
    c.setAttribute("aria-hidden", "true");
    c.style.cssText =
      "position:absolute;width:0;height:0;overflow:hidden;" +
      "left:-9999px;top:-9999px;pointer-events:none;";
    document.body.appendChild(c);
  }
  return c;
}

function createShim(id, container) {
  const tag = inferTag(id);
  const el = document.createElement(tag);
  el.id = id;
  el.setAttribute("data-shim", "1");
  el.tabIndex = -1;

  const isHidden = !container || (container.dataset && container.dataset.hidden === "1");
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

  (container || getHiddenContainer()).appendChild(el);
  CREATED.add(id);
  return el;
}

function idMatchesAny(id, patterns) {
  if (!id) return false;
  for (const re of patterns) {
    try { if (re.test(id)) return true; } catch (e) {}
  }
  return false;
}

export const IDShim = {
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

  /**
   * STACKABLE persistent patch — v5.
   * Setiap pemanggil menambah pattern. Tidak pernah menimpa.
   */
  persistentPatch(patterns, opts) {
    opts = opts || {};
    patterns = Array.isArray(patterns) ? patterns.filter(Boolean) : [];

    console.info("[IDShim v5] persistentPatch dipanggil dengan",
      patterns.length, "patterns. Sudah aktif:", _persistentActive);

    // Sudah aktif — merge
    if (_persistentActive) {
      let added = 0;
      for (const p of patterns) {
        const already = _persistentPatterns.some(e => e.source === p.source);
        if (!already) { _persistentPatterns.push(p); added++; }
      }
      if (typeof opts.containerFor === "function") {
        const oldCF = _persistentOpts.containerFor;
        _persistentOpts.containerFor = function (id) {
          const r = opts.containerFor(id);
          if (r) return r;
          return oldCF ? oldCF(id) : null;
        };
      }
      console.info("[IDShim v5] patterns stacked: +" + added +
        ", total=" + _persistentPatterns.length);
      return;
    }

    // Pertama kali
    _persistentActive = true;
    _persistentPatterns = patterns.slice();
    _persistentOpts = {
      containerFor: opts.containerFor || null,
      visibleContainer: opts.visibleContainer || null,
      verbose: opts.verbose !== false
    };

    _persistentOrigGet = document.getElementById;
    _persistentOrigQS = document.querySelector;
    const hidden = getHiddenContainer();

    function pickContainer(id) {
      if (typeof _persistentOpts.containerFor === "function") {
        const custom = _persistentOpts.containerFor(id);
        if (custom) return custom;
      }
      const lower = id.toLowerCase();
      if (lower.startsWith("btn")) return hidden;
      if (lower.includes("modal")) return hidden;
      return _persistentOpts.visibleContainer || hidden;
    }

    document.getElementById = function (id) {
      const el = _persistentOrigGet.call(document, id);
      if (el) return el;
      if (idMatchesAny(id, _persistentPatterns)) {
        const newEl = createShim(id, pickContainer(id));
        if (_persistentOpts.verbose) {
          console.info("[IDShim v5] auto-create (getById):", id);
        }
        return newEl;
      }
      return null;
    };

    document.querySelector = function (sel) {
      try {
        const el = _persistentOrigQS.call(document, sel);
        if (el) return el;
      } catch (e) {}
      if (typeof sel === "string" && sel.charAt(0) === "#" &&
          sel.indexOf(" ") === -1 && sel.indexOf(".") === -1 &&
          sel.indexOf(":") === -1 && sel.indexOf("[") === -1) {
        const id = sel.slice(1);
        if (idMatchesAny(id, _persistentPatterns)) {
          const newEl = createShim(id, pickContainer(id));
          if (_persistentOpts.verbose) {
            console.info("[IDShim v5] auto-create (querySelector):", id);
          }
          return newEl;
        }
      }
      return null;
    };

    console.info("[IDShim v5] persistent patch INIT. Patterns:",
      _persistentPatterns.map(p => p.source));
  },

  persistentUnpatch() {
    if (!_persistentActive) return;
    document.getElementById = _persistentOrigGet;
    document.querySelector = _persistentOrigQS;
    _persistentActive = false;
    _persistentOrigGet = null;
    _persistentOrigQS = null;
    _persistentPatterns = [];
    _persistentOpts = { containerFor: null, visibleContainer: null, verbose: false };
  },

  ensure(id, container) {
    const existing = document.getElementById(id);
    if (existing) return existing;
    return createShim(id, container);
  },

  list() { return Array.from(CREATED); },
  log() { return LOG.slice(); },
  _reset() { CREATED.clear(); LOG.length = 0; this.persistentUnpatch(); }
};

if (typeof window !== "undefined") window.IDShim = IDShim;
export default IDShim;
/**
 * js/bridge/id-shim.js — v5.
 * - persistentPatch stackable, merge benar
 * - Logging unconditional (tidak tertelan try/catch)
 * - Patch querySelector #id juga
 */

const CREATED = new Set();
const LOG = [];

let _persistentActive = false;
let _persistentOrigGet = null;
let _persistentOrigQS = null;
let _persistentPatterns = [];
let _persistentOpts = { containerFor: null, visibleContainer: null, verbose: false };

function inferTag(id) {
  if (!id) return "div";
  const lower = id.toLowerCase();
  if (lower.startsWith("btn")) return "button";
  if (lower.startsWith("set") || lower.includes("select")) return "select";
  if (lower.includes("input") || lower.includes("field")) return "input";
  return "div";
}

function getHiddenContainer() {
  let c = document.getElementById("compat-shell");
  if (!c) {
    c = document.createElement("div");
    c.id = "compat-shell";
    c.dataset.hidden = "1";
    c.setAttribute("aria-hidden", "true");
    c.style.cssText =
      "position:absolute;width:0;height:0;overflow:hidden;" +
      "left:-9999px;top:-9999px;pointer-events:none;";
    document.body.appendChild(c);
  }
  return c;
}

function createShim(id, container) {
  const tag = inferTag(id);
  const el = document.createElement(tag);
  el.id = id;
  el.setAttribute("data-shim", "1");
  el.tabIndex = -1;

  const isHidden = !container || (container.dataset && container.dataset.hidden === "1");
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

  (container || getHiddenContainer()).appendChild(el);
  CREATED.add(id);
  return el;
}

function idMatchesAny(id, patterns) {
  if (!id) return false;
  for (const re of patterns) {
    try { if (re.test(id)) return true; } catch (e) {}
  }
  return false;
}

export const IDShim = {
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

  /**
   * STACKABLE persistent patch — v5.
   * Setiap pemanggil menambah pattern. Tidak pernah menimpa.
   */
  persistentPatch(patterns, opts) {
    opts = opts || {};
    patterns = Array.isArray(patterns) ? patterns.filter(Boolean) : [];

    console.info("[IDShim v5] persistentPatch dipanggil dengan",
      patterns.length, "patterns. Sudah aktif:", _persistentActive);

    // Sudah aktif — merge
    if (_persistentActive) {
      let added = 0;
      for (const p of patterns) {
        const already = _persistentPatterns.some(e => e.source === p.source);
        if (!already) { _persistentPatterns.push(p); added++; }
      }
      if (typeof opts.containerFor === "function") {
        const oldCF = _persistentOpts.containerFor;
        _persistentOpts.containerFor = function (id) {
          const r = opts.containerFor(id);
          if (r) return r;
          return oldCF ? oldCF(id) : null;
        };
      }
      console.info("[IDShim v5] patterns stacked: +" + added +
        ", total=" + _persistentPatterns.length);
      return;
    }

    // Pertama kali
    _persistentActive = true;
    _persistentPatterns = patterns.slice();
    _persistentOpts = {
      containerFor: opts.containerFor || null,
      visibleContainer: opts.visibleContainer || null,
      verbose: opts.verbose !== false
    };

    _persistentOrigGet = document.getElementById;
    _persistentOrigQS = document.querySelector;
    const hidden = getHiddenContainer();

    function pickContainer(id) {
      if (typeof _persistentOpts.containerFor === "function") {
        const custom = _persistentOpts.containerFor(id);
        if (custom) return custom;
      }
      const lower = id.toLowerCase();
      if (lower.startsWith("btn")) return hidden;
      if (lower.includes("modal")) return hidden;
      return _persistentOpts.visibleContainer || hidden;
    }

    document.getElementById = function (id) {
      const el = _persistentOrigGet.call(document, id);
      if (el) return el;
      if (idMatchesAny(id, _persistentPatterns)) {
        const newEl = createShim(id, pickContainer(id));
        if (_persistentOpts.verbose) {
          console.info("[IDShim v5] auto-create (getById):", id);
        }
        return newEl;
      }
      return null;
    };

    document.querySelector = function (sel) {
      try {
        const el = _persistentOrigQS.call(document, sel);
        if (el) return el;
      } catch (e) {}
      if (typeof sel === "string" && sel.charAt(0) === "#" &&
          sel.indexOf(" ") === -1 && sel.indexOf(".") === -1 &&
          sel.indexOf(":") === -1 && sel.indexOf("[") === -1) {
        const id = sel.slice(1);
        if (idMatchesAny(id, _persistentPatterns)) {
          const newEl = createShim(id, pickContainer(id));
          if (_persistentOpts.verbose) {
            console.info("[IDShim v5] auto-create (querySelector):", id);
          }
          return newEl;
        }
      }
      return null;
    };

    console.info("[IDShim v5] persistent patch INIT. Patterns:",
      _persistentPatterns.map(p => p.source));
  },

  persistentUnpatch() {
    if (!_persistentActive) return;
    document.getElementById = _persistentOrigGet;
    document.querySelector = _persistentOrigQS;
    _persistentActive = false;
    _persistentOrigGet = null;
    _persistentOrigQS = null;
    _persistentPatterns = [];
    _persistentOpts = { containerFor: null, visibleContainer: null, verbose: false };
  },

  ensure(id, container) {
    const existing = document.getElementById(id);
    if (existing) return existing;
    return createShim(id, container);
  },

  list() { return Array.from(CREATED); },
  log() { return LOG.slice(); },
  _reset() { CREATED.clear(); LOG.length = 0; this.persistentUnpatch(); }
};

if (typeof window !== "undefined") window.IDShim = IDShim;
export default IDShim;
