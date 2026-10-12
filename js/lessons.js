/* Lessons mode — step cards with optional static example boards and
   optional quizzes. Progress persisted in AppStorage. */
(function () {
    'use strict';

    const S = window.AppStorage, SFX = window.SFX;
    const T = (k, p) => window.I18n.t(k, p);
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
        list.innerHTML = '';
        detail.classList.add('hidden');
        list.classList.remove('hidden');
        for (const lesson of window.LESSON_DATA) {
            const card = document.createElement('button');
            card.type = 'button';
            card.className = 'lesson-card' + (isDone(lesson.id) ? ' done' : '');
            const badge = document.createElement('span');
            badge.className = 'lesson-badge ' + lesson.level;
            badge.textContent = lesson.level;
            const body = document.createElement('span');
            body.className = 'lesson-card-body';
            const title = document.createElement('strong');
            title.textContent = lesson.title;
            const desc = document.createElement('small');
            desc.textContent = lesson.description;
            body.append(title, desc);
            const state = document.createElement('span');
            state.className = 'lesson-state';
            state.textContent = isDone(lesson.id) ? T('learning.done') : T('learning.stepsCount', { count: lesson.steps.length });
            card.append(badge, body, state);
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
        $('lessonList').classList.add('hidden');
        $('lessonDetail').classList.remove('hidden');
        renderStep();
    }

    function renderStep() {
        const lesson = currentLesson;
        const step = lesson.steps[stepIndex];
        $('lessonTitle').textContent = lesson.title;
        $('lessonGoal').textContent = T('learning.goal', { goal: lesson.goal });
        $('lessonStepCount').textContent = T('learning.stepCounter', { current: stepIndex + 1, total: lesson.steps.length });
        $('lessonStepTitle').textContent = step.title;
        $('lessonStepText').textContent = step.text;

        const wrap = $('lessonBoardWrap');
        const boardEl = $('lessonBoard');
        if (step.board && Chess.validateFEN(step.board)) {
            wrap.classList.remove('hidden');
            if (!exampleBoard) exampleBoard = new BoardView(boardEl, { interactive: false, showCoords: true });
            exampleBoard.setState(Chess.parseFEN(step.board), {});
        } else wrap.classList.add('hidden');

        const quizWrap = $('lessonQuiz');
        const quizEl = $('lessonQuizOptions');
        quizWrap.classList.add('hidden');
        quizEl.innerHTML = '';
        if (step.quiz) {
            $('lessonQuizQuestion').textContent = step.quiz.question;
            step.quiz.options.forEach((opt, i) => {
                const b = document.createElement('button');
                b.type = 'button';
                b.className = 'quiz-option';
                b.textContent = opt;
                b.addEventListener('click', () => answerQuiz(i, b));
                quizEl.appendChild(b);
            });
            quizWrap.classList.remove('hidden');
        }

        $('btnLessonPrev').disabled = stepIndex === 0;
        const last = stepIndex === lesson.steps.length - 1;
        $('btnLessonNext').textContent = last ? T('learning.done') : T('learning.next');
    }

    function answerQuiz(i, btn) {
        const quiz = currentLesson.steps[stepIndex].quiz;
        const buttons = $('lessonQuizOptions').querySelectorAll('.quiz-option');
        buttons.forEach(b => { b.disabled = true; });
        if (i === quiz.answer) {
            btn.classList.add('correct');
            SFX.play('success');
        } else {
            btn.classList.add('wrong');
            buttons[quiz.answer].classList.add('correct');
            SFX.play('error');
        }
    }

    function next() {
        if (stepIndex < currentLesson.steps.length - 1) {
            stepIndex++;
            renderStep();
        } else {
            progress[currentLesson.id] = true;
            save();
            SFX.play('success');
            window.GameMode.toast(T('learning.completedToast', { title: currentLesson.title }), 'success');
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
            $('btnLessonBack').addEventListener('click', renderList);
            $('btnLessonPrev').addEventListener('click', prev);
            $('btnLessonNext').addEventListener('click', next);
            $('btnLessonRepeat').addEventListener('click', () => openLesson(currentLesson, 0));
            $('btnLessonReset').addEventListener('click', resetProgress);
            renderList();
        }
    };
})();
