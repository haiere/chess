/* Lessons mode — step cards with optional static example boards and
   optional quizzes. Progress persisted in AppStorage. */
(function () {
    'use strict';

    const S = window.AppStorage, SFX = window.SFX;
    const T = (k, p) => window.I18n.t(k, p);
    const LANG = () => (window.I18n && window.I18n.getLang ? window.I18n.getLang() : "id");
    const pick = (v) => (v && typeof v === "object" ? (v[LANG()] || v.en || Object.values(v)[0]) : v);
    const $ = (id) => document.getElementById(id);
    const PROGRESS_KEY = 'lessonProgress';

    let progress = S.get(PROGRESS_KEY, {});
    if (!progress || typeof progress !== 'object') progress = {};
    let currentLesson = null;
    let stepIndex = 0;
    let exampleBoard = null;

    function save() { S.set(PROGRESS_KEY, progress); }
    function isDone(id) { return !!progress[id]; }

    function renderList() {
        const list = $('lessonList');
        const detail = $('lessonDetail');
        if (!list || !detail) return;
        const data = window.LESSON_DATA;
        if (!Array.isArray(data) || data.length === 0) {
            if (window.AppSkeleton) {
                window.AppSkeleton.setRetry(list, renderList);
                window.AppSkeleton.empty(list, 'common.error', true);
            }
            detail.classList.add('hidden');
            return;
        }
        list.innerHTML = '';
        detail.classList.add('hidden');
        list.classList.remove('hidden');
        // Filter: level, pencarian judul/deskripsi, favorit saja
        const q = (window.__lessonQ || '').toLowerCase();
        const lv = window.__lessonLevel || 'all';
        const favOnly = !!window.__lessonFav;
        const filtered = data.filter((lesson) => {
            if (lv !== 'all' && lesson.level !== lv) return false;
            if (favOnly && !(window.Favorites && Favorites.has('lesson', lesson.id))) return false;
            if (q && (pick(lesson.title) + ' ' + pick(lesson.description)).toLowerCase().indexOf(q) < 0) return false;
            return true;
        });
        if (!filtered.length) {
            const box = document.createElement('div');
            box.className = 'state-box';
            box.setAttribute('role', 'status');
            const p = document.createElement('p');
            p.textContent = T('search.noResults');
            box.appendChild(p);
            list.appendChild(box);
        }
        for (const lesson of filtered) {
            const card = document.createElement('button');
            card.type = 'button';
            card.className = 'lesson-card' + (isDone(lesson.id) ? ' done' : '');
            const badge = document.createElement('span');
            badge.className = 'lesson-badge ' + pick(lesson.level);
            badge.textContent = pick(lesson.level);
            const body = document.createElement('span');
            body.className = 'lesson-card-body';
            const title = document.createElement('strong');
            title.textContent = pick(lesson.title);
            const desc = document.createElement('small');
            desc.textContent = pick(lesson.description);
            body.append(title, desc);
            const state = document.createElement('span');
            state.className = 'lesson-state';
            state.textContent = isDone(lesson.id) ? T('learning.done') : T('learning.stepsCount', { count: lesson.steps.length });
            const star = document.createElement('span');
            star.className = 'fav-btn' + ((window.Favorites && Favorites.has('lesson', lesson.id)) ? ' on' : '');
            star.setAttribute('role', 'button');
            star.setAttribute('tabindex', '0');
            star.setAttribute('aria-label', T('favorites.add'));
            star.textContent = '\u2605';
            const onFav = (ev) => {
                if (ev) { ev.stopPropagation(); ev.preventDefault(); }
                if (!window.Favorites) return;
                const on = Favorites.toggle('lesson', lesson.id);
                star.classList.toggle('on', on);
                if (window.GameMode && GameMode.toast) GameMode.toast(T(on ? 'favorites.added' : 'favorites.removed'), 'success');
                if (window.__lessonFav && !on) renderList();
            };
            star.addEventListener('click', onFav);
            star.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' || ev.key === ' ') onFav(ev); });
            card.append(badge, body, state, star);
            card.addEventListener('click', () => openLesson(lesson));
            list.appendChild(card);
        }
        const done = window.LESSON_DATA.filter(l => isDone(l.id)).length;
        const p = $('lessonProgressText');
        if (p) p.textContent = T('learning.progress', { done, total: window.LESSON_DATA.length });
    }

    function openLesson(lesson, step) {
        currentLesson = lesson;
        stepIndex = step || 0;
        try { S.set('lastLesson', lesson.id); } catch (e) {}
        $('lessonList').classList.add('hidden');
        $('lessonDetail').classList.remove('hidden');
        renderStep();
    }

    function renderStep() {
        const lesson = currentLesson;
        const step = lesson.steps[stepIndex];
        $('lessonTitle').textContent = pick(lesson.title);
        $('lessonGoal').textContent = T('learning.goal', { goal: pick(lesson.goal) });
        $('lessonStepCount').textContent = T('learning.stepCounter', { current: stepIndex + 1, total: lesson.steps.length });
        $('lessonStepTitle').textContent = pick(step.title);
        $('lessonStepText').textContent = pick(step.text);

        const wrap = $('lessonBoardWrap');
        const boardEl = $('lessonBoard');
        if (step.board && Chess.validateFEN(step.board)) {
            wrap.classList.remove('hidden');
            if (!exampleBoard) exampleBoard = new BoardView(boardEl, { interactive: false, showCoords: true });
            exampleBoard.setState(Chess.parseFEN(step.board), {});
        } else wrap.classList.add('hidden');

        // Latihan interaktif (board 8x8) — tanpa kuis
        const exWrap = $('lessonQuizWrap');
        if (exWrap) exWrap.classList.add('hidden');
        if (step.exercise && currentLesson && currentLesson.exercise) {
            wrap.classList.remove('hidden');
            if (!exampleBoard) exampleBoard = new BoardView(boardEl, { interactive: false, showCoords: true });
            const ex = currentLesson.exercise;
            exampleBoard.setState(Chess.parseFEN(ex.fen), {});
            boardEl.style.pointerEvents = 'auto';
            boardEl.style.cursor = 'pointer';
            let sel = null, idx = 0;
            const finish = () => {
                boardEl.style.pointerEvents = 'none';
                SFX.play('success');
                window.GameMode && window.GameMode.toast(T('learning.exerciseSuccess'), 'success');
                markDone(currentLesson.id);
            };
            boardEl.onclick = (ev) => {
                const sqEl = ev.target.closest('.square');
                if (!sqEl) return;
                const r = +sqEl.dataset.row, c = +sqEl.dataset.col;
                const st = exampleBoard.state;
                if (!st) return;
                const piece = st.board[r][c];
                if (!sel) {
                    if (piece && piece.color === st.currentPlayer) {
                        sel = { r, c };
                        const legal = Chess.legalMovesFrom(st, r, c);
                        exampleBoard.setState(st, {
                            selected: { row: r, col: c },
                            legal: legal.map(m => ({ row: m.toRow, col: m.toCol })),
                        });
                    }
                } else {
                    const got = 'abcdefgh'[sel.c] + (8 - sel.r) + 'abcdefgh'[c] + (8 - r);
                    if (got === ex.solution[idx]) {
                        const mv = Chess.legalMovesFrom(st, sel.r, sel.c)
                            .find(m => m.toRow === r && m.toCol === c);
                        if (mv) {
                            const res = Chess.applyMove(st, mv);
                            exampleBoard.setState(res.state, {});
                            sel = null; idx++;
                            if (idx >= ex.solution.length) finish();
                            return;
                        }
                    }
                    sel = null;
                    exampleBoard.setState(st, {});
                    SFX.play('error');
                }
            };
        } else {
            boardEl.style.pointerEvents = 'none';
            boardEl.style.cursor = 'default';
            boardEl.onclick = null;
        }

        $('btnLessonPrev').disabled = stepIndex === 0;
        const last = stepIndex === lesson.steps.length - 1;
        $('btnLessonNext').textContent = last ? T('learning.done') : T('learning.next');
    }

    function markDone(id) {
        if (!id) return;
        progress[id] = true;
        save();
        renderList();
    }

    function next() {
        if (stepIndex < currentLesson.steps.length - 1) {
            stepIndex++;
            renderStep();
        } else {
            progress[currentLesson.id] = true;
            save();
            SFX.play('success');
            window.GameMode.toast(T('learning.completedToast', { title: pick(currentLesson.title) }), 'success');
            renderList();
        }
    }
    function prev() {
        if (stepIndex > 0) { stepIndex--; renderStep(); }
    }
    function resetProgress() {
        if (!confirm(T('learning.resetConfirm'))) return;
        progress = {};
        save();
        renderList();
        window.GameMode.toast(T('learning.resetToast'), 'success');
    }

    window.LessonsMode = {
        rerender() {
            if (currentLesson) renderStep(); else renderList();
        },
        init() {
            const qIn = document.getElementById('lesson-search');
            if (qIn && !qIn.__bound) { qIn.__bound = true;
                qIn.addEventListener('input', () => { window.__lessonQ = qIn.value; renderList(); }); }
            const lvSel = document.getElementById('lesson-level');
            if (lvSel && !lvSel.__bound) { lvSel.__bound = true;
                lvSel.addEventListener('change', () => { window.__lessonLevel = lvSel.value; renderList(); }); }
            const favChk = document.getElementById('lesson-fav-only');
            if (favChk && !favChk.__bound) { favChk.__bound = true;
                favChk.addEventListener('change', () => { window.__lessonFav = favChk.checked; renderList(); }); }
            $('btnLessonBack').addEventListener('click', renderList);
            $('btnLessonPrev').addEventListener('click', prev);
            $('btnLessonNext').addEventListener('click', next);
            $('btnLessonRepeat').addEventListener('click', () => openLesson(currentLesson, 0));
            $('btnLessonReset').addEventListener('click', resetProgress);
            renderList();
        }
    };
})();
