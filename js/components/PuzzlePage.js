import { storage } from '../utils/storage.js';
import { renderBoard } from '../components/Board.js';
import { ChessEngine } from '../chess/engine.js';
import { Icon } from '../components/Icon.js';
import { Toast } from '../components/Toast.js';

const DIFFICULTIES = ['easy', 'medium', 'hard', 'expert'];

export class PuzzlePage {
  #engine = new ChessEngine();
  #puzzles = [];
  #current = null;
  #solutionIndex = 0;
  #mistakes = 0;
  #hintsUsed = 0;
  #startTime = 0;
  #stats = storage.get('puzzle-stats', { solved: 0, mistakes: 0, streak: 0, bestStreak: 0 });
  #seenIds = new Set(storage.get('puzzle-seen', []));

  constructor(root, onNavigate) {
    this.root = root;
    this.onNavigate = onNavigate;
  }

  async mount() {
    this.root.innerHTML = `
      <div class="page page-puzzle">
        <header class="page-header">
          <button class="btn icon-btn" data-nav="game" aria-label="Kembali ke permainan">${Icon('arrowLeft')}</button>
          <h1>Teka-teki</h1>
          <button class="btn icon-btn" id="puzzleStatsBtn" aria-label="Statistik">${Icon('stats')}</button>
        </header>
        <div class="puzzle-toolbar">
          <select id="puzzleDifficulty" aria-label="Tingkat kesulitan">
            ${DIFFICULTIES.map(d => `<option value="${d}">${this.#label(d)}</option>`).join('')}
          </select>
          <button class="btn small" id="puzzleRandom">${Icon('refresh')}<span>Acak</span></button>
          <button class="btn small" id="puzzleHint">${Icon('hint')}<span>Petunjuk</span></button>
          <button class="btn small" id="puzzleSolution">${Icon('eye')}<span>Solusi</span></button>
        </div>
        <div class="puzzle-meta">
          <span id="puzzleTurn"></span>
          <span id="puzzleProgress"></span>
        </div>
        <div class="board-wrapper"><div class="board-container" id="puzzleBoard"></div></div>
        <div class="puzzle-feedback" id="puzzleFeedback" aria-live="polite"></div>
        <div class="puzzle-actions">
          <button class="btn" id="puzzleRetry">${Icon('restart')}<span>Coba Lagi</span></button>
          <button class="btn accent" id="puzzleNext">${Icon('skipNext')}<span>Berikutnya</span></button>
        </div>
      </div>
    `;

    try {
      this.#puzzles = await this.#loadPuzzles();
    } catch {
      Toast.show('Gagal memuat data puzzle', 'error');
      this.#puzzles = this.#fallbackPuzzles();
    }

    this.#bindEvents();
    this.#nextPuzzle();
  }

  async #loadPuzzles() {
    const res = await fetch('js/data/puzzles.json');
    if (!res.ok) throw new Error('fetch failed');
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error('invalid format');
    return data.filter(p => this.#validatePuzzle(p));
  }

  #validatePuzzle(p) {
    if (!p.id || !p.fen || !Array.isArray(p.solution) || p.solution.length === 0) return false;
    try {
      const test = new ChessEngine();
      test.reset(p.fen);
      return true;
    } catch { return false; }
  }

  #fallbackPuzzles() {
    return [
      {
        id: 'fallback-1', difficulty: 'easy',
        fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3',
        solution: ['f3e5'], themes: ['fork'], rating: 800,
        firstMove: null
      },
      {
        id: 'fallback-2', difficulty: 'medium',
        fen: '6k1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1',
        solution: ['a1a8'], themes: ['back-rank'], rating: 1200,
        firstMove: null
      }
    ];
  }

  #nextPuzzle() {
    const diff = document.getElementById('puzzleDifficulty').value;
    const pool = this.#puzzles.filter(p => p.difficulty === diff && !this.#seenIds.has(p.id));
    const list = pool.length > 0 ? pool : this.#puzzles.filter(p => p.difficulty === diff);
    if (list.length === 0) {
      Toast.show('Tidak ada puzzle untuk level ini', 'info');
      return;
    }
    this.#current = list[Math.floor(Math.random() * list.length)];
    this.#seenIds.add(this.#current.id);
    storage.set('puzzle-seen', [...this.#seenIds].slice(-200));
    this.#loadPuzzle();
  }

  #loadPuzzle() {
    const p = this.#current;
    this.#engine.reset(p.fen);
    this.#solutionIndex = 0;
    this.#mistakes = 0;
    this.#hintsUsed = 0;
    this.#startTime = Date.now();

    // Jika ada langkah lawan pembuka
    if (p.firstMove) {
      const fm = p.firstMove;
      this.#engine.move(fm.slice(0, 2), fm.slice(2, 4), fm[4] || 'q');
    }

    this.#render();
    const turn = this.#engine.turn === 'white' ? 'Putih' : 'Hitam';
    document.getElementById('puzzleTurn').textContent = `${turn} melangkah`;
    document.getElementById('puzzleFeedback').textContent = '';
    document.getElementById('puzzleFeedback').className = 'puzzle-feedback';
  }

  #render() {
    const boardEl = document.getElementById('puzzleBoard');
    if (!boardEl) return;
    const selected = this.#selected || null;
    const legalTargets = this.#legalTargets || [];
    renderBoard(boardEl, this.#engine, {
      orientation: this.#engine.turn,
      interactive: true,
      onMove: (m) => this.#handleSquare(m.square),
      lastMove: this.#lastMove || null,
      selected,
      legalTargets,
      showCoords: true,
    });
  }

  #handleSquare(square) {
    if (this.#solved) return;
    const engine = this.#engine;
    const piece = engine.board.flat().find((p, i) => {
      const r = Math.floor(i / 8), c = i % 8;
      const name = 'abcdefgh'[c] + (8 - r);
      return name === square && p;
    });
    const turnColor = engine.turn;
    const pieceColor = piece?.color;

    if (!this.#selected) {
      if (piece && pieceColor === turnColor) {
        this.#selected = square;
        this.#legalTargets = engine.legalMoves(square).map(m => m.to);
        this.#render();
      }
      return;
    }

    if (this.#selected === square) {
      this.#selected = null;
      this.#legalTargets = [];
      this.#render();
      return;
    }

    if (piece && pieceColor === turnColor) {
      this.#selected = square;
      this.#legalTargets = engine.legalMoves(square).map(m => m.to);
      this.#render();
      return;
    }

    // Coba langkah
    const move = engine.move(this.#selected, square);
    if (!move) {
      this.#selected = null;
      this.#legalTargets = [];
      this.#render();
      return;
    }

    this.#lastMove = { from: this.#selected, to: square };
    this.#selected = null;
    this.#legalTargets = [];

    // Verifikasi solusi
    const expected = this.#current.solution[this.#solutionIndex];
    const played = move.from + move.to + (move.promotion || '');
    const playedShort = move.from + move.to;

    if (expected.startsWith(playedShort)) {
      this.#solutionIndex++;
      this.#feedback('✅ Langkah benar!', 'success');

      if (this.#solutionIndex >= this.#current.solution.length) {
        this.#solved = true;
        this.#onSolved();
        return;
      }

      // Langkah lawan otomatis
      const opp = this.#current.solution[this.#solutionIndex];
      if (opp) {
        setTimeout(() => {
          engine.move(opp.slice(0, 2), opp.slice(2, 4), opp[4] || 'q');
          this.#solutionIndex++;
          this.#lastMove = { from: opp.slice(0, 2), to: opp.slice(2, 4) };
          this.#render();
          if (this.#solutionIndex >= this.#current.solution.length) {
            this.#solved = true;
            this.#onSolved();
          }
        }, 400);
      }
      this.#render();
    } else {
      // Langkah salah — undo
      engine.undo();
      this.#mistakes++;
      this.#feedback('❌ Langkah salah. Coba lagi.', 'error');
      this.#render();
    }
  }

  #feedback(text, type) {
    const el = document.getElementById('puzzleFeedback');
    if (!el) return;
    el.textContent = text;
    el.className = `puzzle-feedback ${type}`;
  }

  #onSolved() {
    const time = Math.round((Date.now() - this.#startTime) / 1000);
    this.#stats.solved++;
    this.#stats.streak++;
    if (this.#stats.streak > this.#stats.bestStreak) this.#stats.bestStreak = this.#stats.streak;
    this.#stats.mistakes += this.#mistakes;
    storage.set('puzzle-stats', this.#stats);

    this.#feedback(`🎉 Puzzle selesai! Waktu: ${time}s, Kesalahan: ${this.#mistakes}`, 'success');
    this.#render();
  }

  #hint() {
    if (!this.#current || this.#solved) return;
    const expected = this.#current.solution[this.#solutionIndex];
    if (!expected) return;
    const from = expected.slice(0, 2);
    this.#feedback(`💡 Petunjuk: bidak di ${from}`, 'info');
    this.#selected = from;
    this.#legalTargets = [];
    this.#render();
  }

  #showSolution() {
    if (!this.#current) return;
    const rest = this.#current.solution.slice(this.#solutionIndex).join(' → ');
    this.#feedback(`📖 Solusi: ${rest}`, 'info');
  }

  #label(d) {
    return { easy: 'Mudah', medium: 'Menengah', hard: 'Sulit', expert: 'Master' }[d] || d;
  }

  #bindEvents() {
    document.getElementById('puzzleNext')?.addEventListener('click', () => {
      this.#solved = false;
      this.#nextPuzzle();
    });
    document.getElementById('puzzleRetry')?.addEventListener('click', () => this.#loadPuzzle());
    document.getElementById('puzzleHint')?.addEventListener('click', () => this.#hint());
    document.getElementById('puzzleSolution')?.addEventListener('click', () => this.#showSolution());
    document.getElementById('puzzleRandom')?.addEventListener('click', () => {
      this.#solved = false;
      this.#nextPuzzle();
    });
    document.getElementById('puzzleDifficulty')?.addEventListener('change', () => {
      this.#solved = false;
      this.#nextPuzzle();
    });
    document.getElementById('puzzleStatsBtn')?.addEventListener('click', () => {
      const s = this.#stats;
      alert(`Statistik Puzzle\n\nDiselesaikan: ${s.solved}\nKesalahan: ${s.mistakes}\nStreak saat ini: ${s.streak}\nStreak terbaik: ${s.bestStreak}`);
    });
  }
                                                 }
