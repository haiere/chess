/* Favorites — bookmark puzzle & lesson, tersimpan lokal via AppStorage. */
(function () {
  'use strict';
  function read(key) {
    try {
      const v = window.AppStorage && window.AppStorage.get(key, []);
      return Array.isArray(v) ? v : [];
    } catch (e) { return []; }
  }
  function write(key, list) {
    try { if (window.AppStorage) window.AppStorage.set(key, list); } catch (e) { /* abaikan */ }
  }
  function keyFor(kind) { return kind === 'puzzle' ? 'favPuzzles' : 'favLessons'; }
  function toggle(kind, id) {
    const key = keyFor(kind);
    const list = read(key);
    const i = list.indexOf(id);
    if (i >= 0) list.splice(i, 1); else list.push(id);
    write(key, list);
    return i < 0; // true = sekarang favorit
  }
  function has(kind, id) { return read(keyFor(kind)).indexOf(id) >= 0; }
  window.Favorites = { toggle: toggle, has: has };
})();
