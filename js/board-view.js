const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];
const PIECES = { wK: '♔', wQ: '♕', wR: '♖', wB: '♗', wN: '♘', wP: '♙', bK: '♚', bQ: '♛', bR: '♜', bB: '♝', bN: '♞', bP: '♟' };

export class BoardView {
  constructor(options = {}) {
    // Robustness: accept string ID, DOM element, or { el: ... }
    if (typeof options === 'string') {
      this.el = document.getElementById(options);
      this.onSquareClick = () => {};
    } else if (options instanceof HTMLElement) {
      this.el = options;
      this.onSquareClick = () => {};
    } else {
      this.el = options.el;
      this.onSquareClick = options.onSquareClick || (() => {});
    }

    if (!this.el) {
      console.error("BoardView: Container element not found!");
      return;
    }

    this.orientation = options.orientation === 'b' ? 'b' : 'w';
    this._pieces = {};
    this._selected = null;
    this._legalMoves = [];
    this._lastMove = null;
    
    this._build();
  }

  _build() {
    this.el.innerHTML = '';
    this.el.classList.add('board-wrapper');
    
    this._boardEl = document.createElement('div');
    this._boardEl.className = 'board';
    this._boardEl.setAttribute('role', 'grid');
    this.el.appendChild(this._boardEl);
    
    this._renderAll();
  }

  _renderAll() {
    if (!this._boardEl) return;
    const frag = document.createDocumentFragment();
    const files = this.orientation === 'b' ? [...FILES].reverse() : FILES;
    const ranks = this.orientation === 'b' ? [...RANKS].reverse() : RANKS;

    for (const r of ranks) {
      for (const f of files) {
        const sq = f + r;
        const cell = document.createElement('div');
        const isLight = (FILES.indexOf(f) + RANKS.indexOf(r)) % 2 === 0;
        cell.className = `square ${isLight ? 'light' : 'dark'}`;
        cell.dataset.square = sq;
        
        // Piece
        const p = this._pieces[sq];
        if (p) {
          const span = document.createElement('span');
          span.className = `piece piece-${p.color}${p.type}`;
          span.textContent = PIECES[p.color + p.type] || '';
          cell.appendChild(span);
        }

        if (this._lastMove && (sq === this._lastMove.from || sq === this._lastMove.to)) cell.classList.add('last-move');
        if (sq === this._selected) cell.classList.add('selected');
        if (this._legalMoves.includes(sq)) cell.classList.add('legal-target');

        cell.addEventListener('click', () => this.onSquareClick(sq));
        frag.appendChild(cell);
      }
    }
    this._boardEl.replaceChildren(frag);
  }

  setPosition(fenOrBoard) {
    if (typeof fenOrBoard === 'object') {
      this._pieces = { ...fenOrBoard };
    } else {
      this._pieces = {};
      const rows = (fenOrBoard || '').split(' ')[0]?.split('/') || [];
      rows.forEach((row, r) => {
        let fileIdx = 0;
        for (const ch of row) {
          if (/\d/.test(ch)) { fileIdx += parseInt(ch, 10); continue; }
          this._pieces[FILES[fileIdx] + RANKS[r]] = { color: ch === ch.toUpperCase() ? 'w' : 'b', type: ch.toUpperCase() };
          fileIdx++;
        }
      });
    }
    this._renderAll();
  }

  setOrientation(o) { this.orientation = o === 'b' ? 'b' : 'w'; this._renderAll(); }
  setSelected(sq) { this._selected = sq; this._renderAll(); }
  setLegalMoves(moves) { this._legalMoves = moves || []; this._renderAll(); }
  setLastMove(move) { this._lastMove = move; this._renderAll(); }
  clearHighlights() { this._selected = null; this._legalMoves = []; this._lastMove = null; this._renderAll(); }
}

window.BoardView = BoardView;
