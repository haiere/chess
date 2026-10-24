const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];
const PIECES = { wK: '♔', wQ: '♕', wR: '♖', wB: '♗', wN: '♘', wP: '♙', bK: '♚', bQ: '♛', bR: '♜', bB: '♝', bN: '♞', bP: '♟' };

class BoardView {
  constructor(el, options = {}) {
    this.el = typeof el === 'string' ? document.getElementById(el) : el;
    if (!this.el) return console.error("Board container not found!");

    this.orientation = options.orientation === 'black' || options.orientation === 'b' ? 'b' : 'w';
    this.showCoords = options.showCoords !== false;
    this.onSquareClick = options.onSquareClick || (() => {});
    this.onDrop = null;
    
    this._pieces = {};
    this._selected = null;
    this._legalMoves = [];
    this._lastMove = null;
    this._checkSquare = null;
    
    this._build();
  }

  _build() {
    this.el.innerHTML = '';
    this.el.classList.add('board-wrapper');
    this._boardEl = document.createElement('div');
    this._boardEl.className = 'board';
    this.el.appendChild(this._boardEl);
    this._renderAll();
  }

  // Fungsi ini menjembatani state dari engine.js (game.js) ke visual
  setState(engineState, opts = {}) {
    if (!engineState) return;
    
    // Terjemahkan array board engine ke format { square: {color, type} }
    this._pieces = {};
    if (engineState.board) {
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const p = engineState.board[r][c];
          if (p) {
            const sq = FILES[c] + RANKS[r];
            this._pieces[sq] = { color: p.color === 'white' ? 'w' : 'b', type: p.type.toUpperCase()[0] };
          }
        }
      }
    }

    this._selected = opts.selected ? (FILES[opts.selected.col] + RANKS[opts.selected.row]) : null;
    
    // Terjemahkan legalMoves dari engine
    this._legalMoves = [];
    if (opts.legalMoves) {
      opts.legalMoves.forEach(m => {
        this._legalMoves.push(FILES[m.toCol] + RANKS[m.toRow]);
      });
    }
    
    if (opts.lastMove) {
      this._lastMove = {
        from: FILES[opts.lastMove.fromCol] + RANKS[opts.lastMove.fromRow],
        to: FILES[opts.lastMove.toCol] + RANKS[opts.lastMove.toRow]
      };
    } else {
      this._lastMove = null;
    }

    if (opts.checkSquare) {
      this._checkSquare = FILES[opts.checkSquare.col] + RANKS[opts.checkSquare.row];
    } else {
      this._checkSquare = null;
    }

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

        if (this._lastMove && (sq === this._lastMove.from || sq === this._lastMove.to)) cell.classList.add('last-move');
        if (sq === this._checkSquare) cell.classList.add('in-check');
        if (sq === this._selected) cell.classList.add('selected');
        if (this._legalMoves.includes(sq)) cell.classList.add('legal-target');

        const p = this._pieces[sq];
        if (p) {
          const span = document.createElement('span');
          span.className = `piece piece-${p.color}${p.type}`;
          span.textContent = PIECES[p.color + p.type] || '';
          cell.appendChild(span);
        }

        // Koordinat
        if (this.showCoords) {
           if ((this.orientation === 'w' && r === '1') || (this.orientation === 'b' && r === '8')) {
              const el = document.createElement('span'); el.className = 'coord-file'; el.textContent = f; cell.appendChild(el);
           }
           if ((this.orientation === 'w' && f === 'a') || (this.orientation === 'b' && f === 'h')) {
              const el = document.createElement('span'); el.className = 'coord-rank'; el.textContent = r; cell.appendChild(el);
           }
        }

        cell.addEventListener('click', () => {
           const row = RANKS.indexOf(r);
           const col = FILES.indexOf(f);
           this.onSquareClick(row, col);
        });
        
        frag.appendChild(cell);
      }
    }
    this._boardEl.replaceChildren(frag);
  }

  setOrientation(o) {
    this.orientation = (o === 'black' || o === 'b') ? 'b' : 'w';
    this._renderAll();
  }
  setCoords(show) {
    this.showCoords = show;
    this._renderAll();
  }
}

window.BoardView = BoardView;
