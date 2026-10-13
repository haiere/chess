/**
 * learn-bridge.js — Adapter HTML pembelajaran (#learn-content, #btn-learn-*)
 * ke modul LessonsMode.
 */
(function (global) {
  "use strict";

  var MOUNTED = false;
  var instance = null;

  function $(id) { return document.getElementById(id); }
  function safe(label, fn) {
    try { return fn(); }
    catch (e) {
      if (global.console) console.warn("[LearnBridge] " + label + " gagal:", e);
      return null;
    }
  }

  function detectApi() {
    var api = {};
    if (global.LessonsMode) api.LessonsMode = global.LessonsMode;
    else if (global.Lessons && typeof global.Lessons === "object") api.LessonsMode = global.Lessons;
    return api;
  }

  function showPlaceholder(msg) {
  var c = $("learn-content");
  if (!c) return;
  c.innerHTML = '<div class="app-placeholder" role="status">' + msg + "</div>";
  }

  var container = $("learn-content");
if (!container) return null;
var api = detectApi();
if (!api.LessonsMode) {
  showPlaceholder("Modul pembelajaran belum tersedia. Pastikan <code>js/lessons.js</code> dimuat dan mengekspos <code>window.LessonsMode</code>.");
  bindButtons();
  return null;
}
var instance = initLessons(api);
if (!instance) {
  showPlaceholder("Modul pembelajaran gagal diinisialisasi.");
  bindButtons();
  return null;
}

  function initLessons(api) {
    if (!api.LessonsMode) return null;
    var container = $("learn-content");
    var attempts = [
      function () {
        return api.LessonsMode.init({
          container: container,
          onProgress: onProgress
        });
      },
      function () { return api.LessonsMode.init(container); },
      function () { return api.LessonsMode.init(); }
    ];
    for (var i = 0; i < attempts.length; i++) {
      var r = safe("LessonsMode.init#" + i, attempts[i]);
      if (r) return r;
    }
    return null;
  }

  function onProgress(p) {
    var el = $("learn-progress");
    if (!el || !p) return;
    var I18n = global.I18n;
    el.textContent = I18n
      ? I18n.t("learning.progress", { done: p.done || 0, total: p.total || 0 })
      : (p.done || 0) + " / " + (p.total || 0);
  }

  function bindButton(id, actionName) {
    var btn = $(id);
    if (!btn || btn.__bridgeBound) return;
    btn.__bridgeBound = true;
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      var fn = instance && instance[actionName];
      if (typeof fn === "function") safe(actionName, function () { fn.call(instance); });
      else if (global.LessonsMode && typeof global.LessonsMode[actionName] === "function") {
        safe(actionName, function () { global.LessonsMode[actionName](); });
      } else {
        if (global.console) console.warn("[LearnBridge] aksi tidak tersedia:", actionName);
      }
    });
  }

  function bindButtons() {
    bindButton("btn-learn-prev", "previous");
    bindButton("btn-learn-next", "next");
    bindButton("btn-learn-restart", "restart");
    bindButton("btn-learn-finish", "finish");
  }

  var LearnBridge = {
    init: function () {
      if (MOUNTED) return instance;
      MOUNTED = true;

      var container = $("learn-content");
      if (!container) return null;

      var api = detectApi();
      if (!api.LessonsMode) {
        showPlaceholder(
          container,
          "Modul pembelajaran belum tersedia. " +
          "Pastikan <code>js/lessons.js</code> dimuat sebelum bridge."
        );
        bindButtons();
        return null;
      }

      instance = initLessons(api);
      bindButtons();
      if (global.console && console.info) console.info("[LearnBridge] siap.");
      return instance;
    },
    getInstance: function () { return instance; },
    _reset: function () { MOUNTED = false; instance = null; }
  };

  global.LearnBridge = LearnBridge;
})(typeof window !== "undefined" ? window : this); 
