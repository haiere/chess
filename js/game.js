import { BoardView } from './board-view.js';
import { i18n } from './i18n.js';

const T = (key, def) => i18n.t(key, null, { defaultValue: def });

export class GameMode {
  constructor() {
    this.board = null;
    this.initialFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    this.fen = this.initialFen;
    this.init();
  }

  init() {
    try {
      const container = document.getElementById('game-board-container') || document.getElementById('board-container') || document.getElementById('board');
      
      if (!container) {
        throw new Error("Elemen papan (board container) tidak ditemukan di HTML.");
      }

      this.board = new BoardView({
        el: container,
        orientation: 'w',
        onSquareClick: (sq) => this.onSquareClick(sq)
      });

      this.board.setPosition(this.fen);
      this.updateUI();
      this.bindEvents();
      
    } catch (err) {
      console.error(err);
      this.showError();
    }
  }

  showError() {
    const container = document.getElementById('game-container') || document.querySelector('.app-main');
    if (container) {
      const errorDiv = document.createElement('div');
      errorDiv.className = 'error-state';
      errorDiv.innerHTML = `<div class="error-state__title">${T('common.error', 'Error')}</div><p>${T('game.initError', 'Gagal memuat game.')}</p>`;
      container.prepend(errorDiv);
    }
  }

  updateUI() {
    // Update teks i18n
    const titleEl = document.querySelector('h2');
    if (titleEl && titleEl.textContent.includes('Permainan')) {
      titleEl.textContent = T('game.title', 'Permainan');
    }
    
    // Ganti teks tombol hardcode
    document.querySelectorAll('button').forEach(btn => {
      const txt = btn.textContent.trim();
      if (txt === 'Permainan Baru') btn.textContent = T('game.newGame', 'Permainan Baru');
      if (txt === 'Urungkan') btn.textContent = T('game.undo', 'Urungkan');
      if (txt === 'Ulangi') btn.textContent = T('game.redo', 'Ulangi');
      if (txt === 'Putar Papan') btn.textContent = T('game.flip', 'Putar Papan');
      if (txt === 'Salin FEN') btn.textContent = T('game.copyFen', 'Salin FEN');
      if (txt === 'Menyerah') btn.textContent = T('game.resign', 'Menyerah');
    });

    const historyTitle = Array.from(document.querySelectorAll('h3, h2')).find(el => el.textContent.includes('Riwayat Langkah'));
    if (historyTitle) historyTitle.textContent = T('game.moveHistory', 'Riwayat Langkah');
  }

  bindEvents() {
    const btnNew = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Baru'));
    if (btnNew) {
      btnNew.addEventListener('click', () => {
        this.fen = this.initialFen;
        this.board.setPosition(this.fen);
        this.board.clearHighlights();
      });
    }
    // Tombol lain bisa ditambahkan di sini
  }

  onSquareClick(sq) {
    // Logika dasar klik kotak untuk testing
    this.board.setSelected(sq);
  }
}

// Bootstrap otomatis saat DOM siap
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('page-game') || document.querySelector('h2')) {
    window.gameMode = new GameMode();
  }
});
