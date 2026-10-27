import { BoardView } from './board-view.js';
import { i18n } from './i18n.js';

const T = (key, params, defaultValue) =>
  i18n.t(key, params, defaultValue ? { defaultValue } : undefined);

const STORAGE_KEY = 'chess:puzzle-progress';

function loadProgress() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') || { solved:[], streak:0, best:0 }; }
  catch (_) { return { solved:[], streak:0, best:0 }; }
}
function saveProgress(p) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch (_) {}
}

class PuzzleMode {
  constructor({ provider, root }) {
    this.provider = provider;
    this.root = root;
    this.progress = loadProgress();
    this.currentPuzzle = null;
    this.state = 'idle';
    this.board = null;
    this.attemptedMoves = [];
    this._pendingFrom = null;

    this._cacheEls();
    this._bindEvents();
    this._listenRoute();
    this._listenI18n();
  }

  _cacheEls() {
    const $ = id => document.getElementById(id);
    this.els = {
      title:         $('puzzle-title'),
      subtitle:      $('puzzle-subtitle'),
      boardContainer:$('puzzle-board-container'),
      status:        $('puzzle-status'),
      difficulty:    $('puzzle-difficulty'),
      level:         $('puzzle-level'),
      nextBtn:       $('puzzle-next'),
      prevBtn:       $('puzzle-prev'),
      tryAgainBtn:   $('puzzle-try-again'),
      hintBtn:       $('puzzle-hint'),
      solutionBtn:   $('puzzle-solution'),
      randomBtn:     $('puzzle-random'),
      streakEl:      $('puzzle-streak'),
      solvedEl:      $('puzzle-solved'),
      bestEl:        $('puzzle-best')
    };
  }

  _bindEvents() {
    this.els.tryAgainBtn?.addEventListener('click', () => this._reset());
    this.els.nextBtn?.addEventListener('click', () => this._next());
    this.els.prevBtn?.addEventListener('click', () => this._prev());
    this.els.hintBtn?.addEventListener('click', () => this._hint());
    this.els.solutionBtn?.addEventListener('click', () => this._reveal());
    this.els.randomBtn?.addEventListener('click', () => this._random());
  }

  _listenRoute() { window.addEventListener('hashchange', () => this._applyRoute()); }
  _listenI18n()  { i18n.onChange(() => { this._renderStatic(); this._renderStatus(); this._renderStats(); }); }

  mount() { this._renderStatic(); this._renderStats(); this._applyRoute(); }

  /* Dipanggil dari main.js via PuzzleMode.selectPuzzle(id) */
  selectPuzzle(id) {
    if (!id) return;
    const p = this.provider.getById(id);
    if (p) this._loadPuzzle(p);
  }

  _applyRoute() {
    const m = (location.hash || '#/puzzle').match(/^#\/puzzle\/([^/]+)/);
    const id = m ? m[1] : null;
    const puzzle = id ? this.provider.getById(id) : this.provider.getRandom();
    if (!puzzle) return this._showEmpty();
    if (this.currentPuzzle && this.currentPuzzle.id === puzzle.id && this.board) return;
    this._loadPuzzle(puzzle);
  }

  _loadPuzzle(puzzle) {
    this.currentPuzzle = puzzle;
    this.state = 'playing';
    this.attemptedMoves = [];
    this._pendingFrom = null;

    if (this.board) this.board.destroy();
    if (this.els.boardContainer) {
      this.board = new BoardView({
        el: this.els.boardContainer,
        orientation: puzzle.turn === 'b' ? 'b' : 'w',
        onSquareClick: sq => this._onSquareClick(sq)
      });
      if (puzzle.fen) this.board.setPosition(puzzle.fen);
    }
    this._renderStatic();
    this._renderStatus();
  }

  _onSquareClick(sq) {
    if (this.state !== 'playing' || !this.currentPuzzle || !this.board) return;
    const p = this.currentPuzzle;
    const step = this.attemptedMoves.length;
    const expected = p.solution[step];
    if (!expected) return;

    if (!this._pendingFrom) {
      this._pendingFrom = sq;
      this.board.setSelected(sq);
      this.board.setLegalMoves(p.solution.filter(s => s.from === sq).map(s => s.to));
      return;
    }

    const from = this._pendingFrom;
    const to = sq;
    this._pendingFrom = null;
    this.board.clearHighlights();

    if (expected.from === from && expected.to === to) {
      this.attemptedMoves.push({ from, to, promo: expected.promo });
      this.board.setPosition(this._fenAfterMoves(p.fen, this.attemptedMoves));
      this.board.setLastMove({ from, to });
      if (this.attemptedMoves.length >= p.solution.length) this._onSolved();
      else this._renderStatus();
    } else {
      this._onWrong();
    }
  }

  _fenAfterMoves(fen, moves) {
    try {
      const C = window.Chess;
      if (C && typeof C.parseFEN === 'function'
            && typeof C.applyMove === 'function'
            && typeof C.toFEN === 'function') {
        let state = C.parseFEN(fen);
        for (const m of moves) {
          const r = C.applyMove(state, m);
          state = r && r.state ? r.state : r;
        }
        return C.toFEN(state);
      }
    } catch (_) {}
    return fen;
  }

  _onSolved() {
    this.state = 'solved';
    const p = this.currentPuzzle;
    if (!this.progress.solved.includes(p.id)) this.progress.solved.push(p.id);
    this.progress.streak = (this.progress.streak || 0) + 1;
    this.progress.best = Math.max(this.progress.best || 0, this.progress.streak);
    saveProgress(this.progress);
    this._renderStatus();
    this._renderStats();
  }

  _onWrong() {
    this.state = 'wrong';
    this._renderStatus();
    if (this.currentPuzzle && this.board) this.board.setPosition(this.currentPuzzle.fen);
  }

  _reset() {
    if (!this.currentPuzzle || !this.board) return;
    this.state = 'playing';
    this.attemptedMoves = [];
    this._pendingFrom = null;
    this.board.setPosition(this.currentPuzzle.fen);
    this.board.clearHighlights();
    this._renderStatus();
  }

  _next()    { const p = this.provider.getNext(this.currentPuzzle?.id); if (p) location.hash = `#/puzzle/${p.id}`; }
  _prev()    { const p = this.provider.getPrev(this.currentPuzzle?.id); if (p) location.hash = `#/puzzle/${p.id}`; }
  _random()  { const p = this.provider.getRandom(); if (p) location.hash = `#/puzzle/${p.id}`; }

  _hint() {
    if (!this.currentPuzzle || !this.board) return;
    const s = this.currentPuzzle.solution[this.attemptedMoves.length];
    if (!s) return;
    this.board.setSelected(s.from);
    this.board.setLegalMoves([s.to]);
    this._flashStatus(T('puzzle.hint', null, 'Hint'));
  }

  _reveal() {
    if (!this.currentPuzzle || !this.board) return;
    this.state = 'solved';
    this.board.setPosition(this.currentPuzzle.fen);
    this.board.setLastMove(this.currentPuzzle.solution[0] || null);
    this._renderStatus();
  }

  _showEmpty() {
    if (this.els.status) this.els.status.textContent = T('puzzle.noPuzzle', null, 'Puzzle not found.');
    this.board?.destroy();
    this.board = null;
  }

  _renderStatic() {
    if (this.els.title)       this.els.title.textContent = T('puzzle.title', null, 'Puzzles');
    if (this.els.subtitle)    this.els.subtitle.textContent = T('puzzle.subtitle', null, '');
    if (this.els.nextBtn)     this.els.nextBtn.textContent = T('puzzle.next', null, 'Next');
    if (this.els.prevBtn)     this.els.prevBtn.textContent = T('puzzle.previous', null, 'Previous');
    if (this.els.tryAgainBtn) this.els.tryAgainBtn.textContent = T('puzzle.tryAgain', null, 'Try again');
    if (this.els.hintBtn)     this.els.hintBtn.textContent = T('puzzle.showHint', null, 'Show hint');
    if (this.els.solutionBtn) this.els.solutionBtn.textContent = T('puzzle.showSolution', null, 'Show solution');
    if (this.els.randomBtn)   this.els.randomBtn.textContent = T('puzzle.random', null, 'Random');

    if (this.els.difficulty && this.currentPuzzle) {
      this.els.difficulty.textContent = T(`puzzle.${this.currentPuzzle.difficulty || 'medium'}`,
        null, this.currentPuzzle.difficulty || '');
    }
    if (this.els.level && this.currentPuzzle) {
      this.els.level.textContent = `${T('puzzle.level', null, 'Level')} ${this.currentPuzzle.level ?? ''}`.trim();
    }
  }

  _renderStatus() {
    if (!this.els.status) return;
    const map = { idle:'puzzle.statusReady', playing:'puzzle.statusPlaying', solved:'puzzle.solved', wrong:'puzzle.wrong' };
    const defaults = { solved:'Solved!', wrong:'Not quite.', playing:'In progress', idle:'Ready' };
    this.els.status.textContent = T(map[this.state] || 'puzzle.statusReady', null, defaults[this.state] || '');
    this.els.status.dataset.state = this.state;
    this.els.status.setAttribute('aria-live', 'polite');
  }

  _flashStatus(msg) {
    if (!this.els.status) return;
    this.els.status.textContent = msg;
    this.els.status.setAttribute('aria-live', 'polite');
  }

  _renderStats() {
    if (this.els.streakEl) this.els.streakEl.textContent = String(this.progress.streak || 0);
    if (this.els.solvedEl) this.els.solvedEl.textContent = String(this.progress.solved.length);
    if (this.els.bestEl)   this.els.bestEl.textContent   = String(this.progress.best   || 0);
  }
}

export function initPuzzleMode(provider) {
  if (typeof window !== 'undefined' && window.PuzzleMode) return window.PuzzleMode;
  const root = document.getElementById('page-puzzle');
  if (!root) return null;
  const mode = new PuzzleMode({ provider, root });
  mode.mount();
  if (typeof window !== 'undefined') window.PuzzleMode = mode;
  return mode;
  }
