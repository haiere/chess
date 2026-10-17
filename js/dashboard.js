/* Dashboard — statistik progres lokal (tanpa login).
   Aman terhadap localStorage kosong/rusak: semua baca via helper safe(). */
(function () {
  'use strict';
  const T = (k, p) => (window.I18n ? window.I18n.t(k, p) : k);
  const safe = (fn, fb) => { try { const v = fn(); return v == null ? fb : v; } catch (e) { return fb; } };

  function tile(label, value, sub) {
    return '<div class="stat-tile" role="listitem"><div class="stat-value">' + value + '</div>' +
      '<div class="stat-label">' + label + '</div>' +
      (sub ? '<div class="stat-sub">' + sub + '</div>' : '') + '</div>';
  }

  function render() {
    const el = document.getElementById('dashboard-content');
    if (!el) return;
    const S = window.AppStorage;
    if (!S) { if (window.AppSkeleton) window.AppSkeleton.empty(el, 'common.error', true); return; }

    const stats = safe(() => S.get('puzzleStats', null), null) || { solved: [], mistakes: 0, streak: 0, bestStreak: 0, seconds: 0 };
    if (!Array.isArray(stats.solved)) stats.solved = [];
    const lp = safe(() => S.get('lessonProgress', {}), {}) || {};
    const lastLesson = safe(() => S.get('lastLesson', null), null);
    const lastPuzzle = safe(() => S.get('lastPuzzle', null), null);
    const favP = safe(() => S.get('favPuzzles', []), []) || [];
    const favL = safe(() => S.get('favLessons', []), []) || [];
    const totalP = (window.PUZZLE_DATA || []).length;
    const totalL = (window.LESSON_DATA || []).length;
    const rec = (window.PUZZLE_DATA || []).find(function (p) { return stats.solved.indexOf(p.id) < 0; }) || null;

    let html = '<div class="stat-grid" role="list">';
    html += tile(T('dashboard.puzzlesSolved'), stats.solved.length, T('dashboard.totalPuzzles', { total: totalP }));
    html += tile(T('dashboard.lessonsCompleted'), Object.keys(lp).length, T('dashboard.totalLessons', { total: totalL }));
    html += tile(T('dashboard.streak'), stats.streak || 0, T('dashboard.bestStreak') + ': ' + (stats.bestStreak || 0));
    html += tile(T('favorites.title'), favP.length + favL.length, T('dashboard.lastPuzzle') + ': ' + (lastPuzzle || '—'));
    html += '</div>';

    html += '<div class="app-card"><h2 class="app-card-title">' + T('dashboard.quickActions') + '</h2>' +
      '<div class="btn-row">';
    const lessons = window.LESSON_DATA || [];
    const contId = lastLesson || (lessons[0] && lessons[0].id) || null;
    html += '<a class="btn accent" href="#/learning' + (contId ? '/' + contId : '') + '">' +
      (lastLesson ? T('dashboard.continueLearning') : T('dashboard.startLearning')) + '</a>';
    html += '<a class="btn" href="#/puzzle' + (rec ? '/' + rec.id : '') + '">' + T('dashboard.solvePuzzle') + '</a>';
    html += '</div></div>';

    if (!stats.solved.length && !Object.keys(lp).length) {
      html += '<div class="state-box" role="status"><p>' + T('dashboard.noProgress') + '</p></div>';
    }
    el.innerHTML = html;
  }

  function banner(show) {
    const b = document.getElementById('offline-banner');
    if (b) b.classList.toggle('hidden', !show);
  }

  function init() {
    document.addEventListener('route:change', function (e) {
      if (e && e.detail && e.detail.route === 'dashboard') render();
    });
    window.addEventListener('online', function () { banner(false); });
    window.addEventListener('offline', function () { banner(true); });
    if (typeof navigator !== 'undefined' && navigator.onLine === false) banner(true);
  }

  window.Dashboard = { init: init, render: render };
})();
