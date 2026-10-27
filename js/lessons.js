import { BoardView } from './board-view.js';
import { i18n } from './i18n.js';

const T = (key, params, defaultValue) =>
  i18n.t(key, params, defaultValue ? { defaultValue } : undefined);

const STORAGE_KEY = 'chess:lesson-progress';

function loadProgress() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') || { completed:[], current:null }; }
  catch (_) { return { completed:[], current:null }; }
}
function saveProgress(p) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch (_) {}
}
function pickLocalized(obj) {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  const lang = i18n.getLang();
  return obj[lang] || obj.en || '';
}

class LessonsMode {
  constructor({ provider, root }) {
    this.provider = provider;
    this.root = root;
    this.progress = loadProgress();
    this.currentLesson = null;
    this.stepIndex = 0;
    this.board = null;
    this.state = 'idle';
    this._pendingFrom = null;

    this._cacheEls();
    this._bindEvents();
    this._listenRoute();
    this._listenI18n();
  }

  _cacheEls() {
    const $ = id => document.getElementById(id);
    this.els = {
      title:         $('lesson-title'),
      subtitle:      $('lesson-subtitle'),
      boardContainer:$('lesson-board-container'),
      status:        $('lesson-status'),
      stepTitle:     $('lesson-step-title'),
      stepBody:      $('lesson-step-body'),
      prevBtn:       $('lesson-prev'),
      nextBtn:       $('lesson-next'),
      completeBtn:   $('lesson-complete'),
      tryAgainBtn:   $('lesson-try-again'),
      progressEl:    $('lesson-progress'),
      levelEl:       $('lesson-level')
    };
  }

  _bindEvents() {
    this.els.nextBtn?.addEventListener('click', () => this._nextStep());
    this.els.prevBtn?.addEventListener('click', () => this._prevStep());
    this.els.completeBtn?.addEventListener('click', () => this._complete());
    this.els.tryAgainBtn?.addEventListener('click', () => this._resetStep());
  }

  _listenRoute() { window.addEventListener('hashchange', () => this._applyRoute()); }
  _listenI18n()  { i18n.onChange(() => { this._renderStatic(); this._renderStep(); }); }

  mount() { this._renderStatic(); this._applyRoute(); }

  /* Dipanggil dari main.js via LessonsMode.openLesson(id) */
  openLesson(id) {
    if (!id) return;
    const lesson = this.provider.getById(id);
    if (lesson) this._loadLesson(lesson);
  }

  _applyRoute() {
    const m = (location.hash || '#/learning').match(/^#\/learning\/([^/]+)/);
    const id = m ? m[1] : null;
    const lesson = id ? this.provider.getById(id) : this.provider.getFirst();
    if (!lesson) {
      if (this.els.status) this.els.status.textContent = T('learning.noLesson', null, 'Lesson not found.');
      return;
    }
    if (this.currentLesson && this.currentLesson.id === lesson.id && this.board) return;
    this._loadLesson(lesson);
  }

  _loadLesson(lesson) {
    this.currentLesson = lesson;
    this.stepIndex = 0;
    this.state = 'idle';
    this._pendingFrom = null;

    if (this.board) this.board.destroy();
    if (this.els.boardContainer) {
      this.board = new BoardView({
        el: this.els.boardContainer,
        orientation: 'w',
        onSquareClick: sq => this._onSquareClick(sq)
      });
    }
    this._renderStatic();
    this._renderStep();
  }

  _currentStep() { return this.currentLesson?.steps?.[this.stepIndex] || null; }

  _renderStatic() {
    if (!this.currentLesson) return;
    if (this.els.title)       this.els.title.textContent = pickLocalized(this.currentLesson.title);
    if (this.els.subtitle)    this.els.subtitle.textContent = pickLocalized(this.currentLesson.summary);
    if (this.els.prevBtn)     this.els.prevBtn.textContent = T('learning.previous', null, 'Previous');
    if (this.els.nextBtn)     this.els.nextBtn.textContent = T('learning.next', null, 'Next');
    if (this.els.completeBtn) this.els.completeBtn.textContent = T('learning.markComplete', null, 'Mark Complete');
    if (this.els.tryAgainBtn) this.els.tryAgainBtn.textContent = T('learning.tryAgain', null, 'Try Again');
    if (this.els.levelEl)     this.els.levelEl.textContent = pickLocalized(this.currentLesson.levelLabel) || '';
    this._renderProgress();
  }

  _renderProgress() {
    if (!this.els.progressEl || !this.currentLesson) return;
    const total = this.currentLesson.steps?.length || 1;
    const cur = Math.min(this.stepIndex + 1, total);
    this.els.progressEl.textContent = `${cur} / ${total}`;
    this.els.progressEl.setAttribute('aria-valuenow', cur);
    this.els.progressEl.setAttribute('aria-valuemax', total);
  }

  _renderStep() {
    const step = this._currentStep();
    if (!step) return;
    if (this.els.stepTitle) {
      this.els.stepTitle.textContent =
        pickLocalized(step.title) || `${T('learning.step', null, 'Step')} ${this.stepIndex + 1}`;
    }
    if (this.els.stepBody) this.els.stepBody.textContent = pickLocalized(step.body) || '';
    if (step.board?.fen && this.board) {
      this.board.setPosition(step.board.fen);
      this.board.clearHighlights();
    }
    if (step.exercise && this.els.status) {
      this.els.status.textContent = T('learning.exercise', null, 'Exercise');
    }
    this._renderProgress();
    this._renderButtons();
  }

  _renderButtons() {
    const total = this.currentLesson?.steps?.length || 0;
    if (this.els.prevBtn) this.els.prevBtn.disabled = this.stepIndex === 0;
    if (this.els.nextBtn) this.els.nextBtn.disabled = this.stepIndex >= total - 1;
    if (this.els.tryAgainBtn) this.els.tryAgainBtn.hidden = !this._currentStep()?.exercise;
  }

  _onSquareClick(sq) {
    const step = this._currentStep();
    if (!step?.exercise || !this.board) return;
    if (this.state === 'correct') return;

    if (!this._pendingFrom) {
      this._pendingFrom = sq;
      this.board.setSelected(sq);
      this.board.setLegalMoves(step.exercise.solution.filter(s => s.from === sq).map(s => s.to));
      return;
    }
    const from = this._pendingFrom;
    const to = sq;
    this._pendingFrom = null;
    this.board.clearHighlights();

    if (step.exercise.solution.some(s => s.from === from && s.to === to)) {
      this.state = 'correct';
      this.board.setLastMove({ from, to });
      if (this.els.status) {
        this.els.status.textContent = T('learning.correct', null, 'Correct!');
        this.els.status.dataset.state = 'correct';
      }
    } else {
      this.state = 'incorrect';
      if (this.els.status) {
        this.els.status.textContent = T('learning.incorrect', null, 'Not quite.');
        this.els.status.dataset.state = 'incorrect';
      }
    }
  }

  _resetStep() {
    this.state = 'idle';
    this._pendingFrom = null;
    const step = this._currentStep();
    if (step?.exercise?.board?.fen && this.board) this.board.setPosition(step.exercise.board.fen);
    this.board?.clearHighlights();
    if (this.els.status) this.els.status.textContent = '';
  }

  _nextStep() {
    const total = this.currentLesson?.steps?.length || 0;
    if (this.stepIndex < total - 1) { this.stepIndex++; this.state = 'idle'; this._pendingFrom = null; this._renderStep(); }
  }
  _prevStep() {
    if (this.stepIndex > 0) { this.stepIndex--; this.state = 'idle'; this._pendingFrom = null; this._renderStep(); }
  }

  _complete() {
    if (!this.currentLesson) return;
    if (!this.progress.completed.includes(this.currentLesson.id)) {
      this.progress.completed.push(this.currentLesson.id);
    }
    this.progress.current = this.currentLesson.id;
    saveProgress(this.progress);
    this._renderStatic();
    if (this.els.status) {
      this.els.status.textContent = T('learning.completed', null, 'Completed');
      this.els.status.dataset.state = 'solved';
    }
  }
}

export function initLessonsMode(provider) {
  if (typeof window !== 'undefined' && window.LessonsMode) return window.LessonsMode;
  const root = document.getElementById('page-learning');
  if (!root) return null;
  const mode = new LessonsMode({ provider, root });
  mode.mount();
  if (typeof window !== 'undefined') window.LessonsMode = mode;
  return mode;
  }
