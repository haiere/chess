/**
 * BoardView — papan catur 8x8 yang selalu persegi.
 * - Grid: grid-template-columns/rows: repeat(8, minmax(0, 1fr)); aspect-ratio: 1/1.
 * - Render parsial: pakai DocumentFragment + replaceChildren (tanpa innerHTML = '').
 * - Keyboard: arrow keys, Enter/Space untuk pilih.
 * - Orientation: 'w' | 'b'.
 * - Tidak menyimpan ukuran papan; semuanya via CSS.
 */

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

const PIECE_UNICODE = {
  wK: '♔', wQ: '♕', wR: '♖', wB: '♗', wN: '♘', wP: '♙',
  bK: '♚', bQ: '♛', bR: '♜', bB: '♝', bN: '♞', bP: '♟'
};

function squaresInOrder(orientation) {
  const files = orientation === 'b' ? [...FILES].reverse() : FILES;
  const ranks = orientation === 'b' ? [...RANKS].reverse() : RANKS;
  const out = [];
  for (const r of ranks) for (const f of files) out.push(f + r);
  return out;
}

function colorOf(square, orientation) {
  const f = FILES.indexOf(square[0]);
  const r = RANKS.indexOf(square[1]);
  const light = (f + r) % 2 === 0;
  return light ? 'light' : 'dark';
}

export class BoardView {
  constructor(options = {}) {
    this.el = options.el;
    if (!this.el) throw new Error('BoardView: el required');

    this.onSquareClick = options.onSquareClick || (() => {});
    this.orientation = options.orientation === 'b' ? 'b' : 'w';
    this.showCoords = options.showCoords !== false;
    this.interactive = options.interactive !== false;

    this._pieces = {};       // square -> { color, type } | null
    this._selected = null;
    this._legalMoves = [];   // array of target squares
    this._lastMove = null;   // { from, to }
    this._checkSquare = null;
    this._focusSquare = 'e2'; // for keyboard

    this._build();
  }

  _build() {
    this.el.innerHTML = '';
    this.el.classList.add('board-wrapper');

    const board = document.createElement('div');
    board.className = 'board';
    board.setAttribute('role', 'grid');
    board.setAttribute('aria-label', window.I18n ? window.I18n.t('aria.board') : 'Chess board');
    board.tabIndex = 0;

    board.addEventListener('keydown', (e) => this._onKeyDown(e));
    this._boardEl = board;
    this.el.appendChild(board);

    this._renderAll();
  }

  _renderAll() {
    if (!this._boardEl) return;
    const frag = document.createDocumentFragment();
    const squares = squaresInOrder(this.orientation);

    for (const sq of squares) {
      const cell = document.createElement('div');
      cell.className = `square ${colorOf(sq, this.orientation)}`;
      cell.dataset.square = sq;
      cell.setAttribute('role', 'gridcell');
      cell.setAttribute('aria-label', this._ariaFor(sq));
      cell.tabIndex = -1;

      // Coordinates
      const file = sq[0];
      const rank = sq[1];
      if (this.showCoords) {
        const showFile = (this.orientation === 'w' && rank === '1') ||
                         (this.orientation === 'b' && rank === '8');
        const showRank = (this.orientation === 'w' && file === 'a') ||
                         (this.orientation === 'b' && file === 'h');
        if (showFile) {
          const f = document.createElement('span');
          f.className = 'coord coord-file';
          f.textContent = file;
          cell.appendChild(f);
        }
        if (showRank) {
          const r = document.createElement('span');
          r.className = 'coord coord-rank';
          r.textContent = rank;
          cell.appendChild(r);
        }
      }

      // Piece
      const piece = this._pieces[sq];
      if (piece) {
        const p = document.createElement('span');
        p.className = `piece piece-${piece.color}${piece.type}`;
        p.textContent = PIECE_UNICODE[piece.color + piece.type] || '';
        p.setAttribute('aria-hidden', 'true');
        cell.appendChild(p);
      }

      // Highlights
      if (this._lastMove && (sq === this._lastMove.from || sq === this._lastMove.to)) {
        cell.classList.add('last-move');
      }
      if (sq === this._checkSquare) cell.classList.add('in-check');
      if (sq === this._selected) cell.classList.add('selected');
      if (this._legalMoves.includes(sq)) cell.classList.add('legal-target');

      cell.addEventListener('click', () => this._onClick(sq));
      frag.appendChild(cell);
    }

    this._boardEl.replaceChildren(frag);
  }

  _ariaFor(sq) {
    const piece = this._pieces[sq];
    const label = window.I18n ? window.I18n.t('aria.boardSquare', { square: sq }) : sq;
    if (!piece) return label;
    const colorName = piece.color === 'w' ? 'white' : 'black';
    const typeNames = { K: 'king', Q: 'queen', R: 'rook', B: 'bishop', N: 'knight', P: 'pawn' };
    return `${label} ${colorName} ${typeNames[piece.type] || ''}`.trim();
  }

  _onClick(sq) {
    if (!this.interactive) return;
    this._focusSquare = sq;
    this.onSquareClick(sq);
  }

  _onKeyDown(e) {
    if (!this.interactive) return;
    const files = this.orientation === 'b' ? [...FILES].reverse() : FILES;
    const ranks = this.orientation === 'b' ? [...RANKS].reverse() : RANKS;
    const cur = this._focusSquare || (this.orientation === 'w' ? 'e2' : 'd7');
    let f = files.indexOf(cur[0]);
    let r = ranks.indexOf(cur[1]);

    switch (e.key) {
      case 'ArrowLeft':  f = Math.max(0, f - 1); break;
      case 'ArrowRight': f = Math.min(7, f + 1); break;
      case 'ArrowUp':    r = Math.max(0, r - 1); break;
      case 'ArrowDown':  r = Math.min(7, r + 1); break;
      case 'Home':       f = 0; r = 0; break;
      case 'End':        f = 7; r = 7; break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        this.onSquareClick(cur);
        return;
      default:
        return;
    }
    e.preventDefault();
    const next = files[f] + ranks[r];
    this._focusSquare = next;
    const cell = this._boardEl.querySelector(`[data-square="${next}"]`);
    if (cell) cell.focus();
  }

  setPosition(fenOrBoard) {
    this._pieces = this._parsePosition(fenOrBoard);
    this._renderAll();
  }

  _parsePosition(fenOrBoard) {
    // Accept FEN string or plain object map.
    if (fenOrBoard && typeof fenOrBoard === 'object' && !Array.isArray(fenOrBoard)) {
      return { ...fenOrBoard };
    }
    const fen = typeof fenOrBoard === 'string' ? fenOrBoard : '';
    const out = {};
    const rows = fen.split(' ')[0]?.split('/') || [];
    for (let r = 0; r < 8 && r < rows.length; r++) {
      let fileIdx = 0;
      for (const ch of rows[r]) {
        if (/\d/.test(ch)) { fileIdx += parseInt(ch, 10); continue; }
        const color = ch === ch.toUpperCase() ? 'w' : 'b';
        const type = ch.toUpperCase();
        const sq = FILES[fileIdx] + RANKS[r];
        out[sq] = { color, type };
        fileIdx++;
      }
    }
    return out;
  }

  setOrientation(o) {
    this.orientation = o === 'b' ? 'b' : 'w';
    this._renderAll();
  }

  setSelected(square) {
    this._selected = square || null;
    this._renderAll();
  }

  setLegalMoves(squares) {
    this._legalMoves = Array.isArray(squares) ? squares.slice() : [];
    this._renderAll();
  }

  setLastMove(move) {
    this._lastMove = move ? { from: move.from, to: move.to } : null;
    this._renderAll();
  }

  setCheck(square) {
    this._checkSquare = square || null;
    this._renderAll();
  }

  clearHighlights() {
    this._selected = null;
    this._legalMoves = [];
    this._lastMove = null;
    this._checkSquare = null;
    this._renderAll();
  }

  destroy() {
    if (this._boardEl) {
      this._boardEl.replaceChildren();
      this._boardEl.remove();
    }
    this.el.classList.remove('board-wrapper');
    this._boardEl = null;
  }
}

if (typeof window !== 'undefined') {
  window.BoardView = BoardView;
}
