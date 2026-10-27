const FILES = ['a','b','c','d','e','f','g','h'];
const RANKS = ['8','7','6','5','4','3','2','1'];

const SVG_PIECES = {
  wK: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22.5 11.63V6M20 8h5" stroke-linejoin="miter"/><path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill="#fff" stroke-linecap="butt" stroke-linejoin="miter"/><path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-3.5-7.5-13-10.5-16-4-3 6 5 10 5 10V37z" fill="#fff"/><path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0" stroke="#000"/></g></svg>`,
  wQ: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="#fff" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM24.5 7.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM16 8.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM33 9a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/><path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-14V25L7 14l2 12z" stroke-linecap="butt"/><path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z" stroke-linecap="butt"/><path d="M11.5 30c3.5-1 18.5-1 22 0M12 33.5c6-1 15-1 21 0" fill="none"/></g></svg>`,
  wR: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="#fff" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5" stroke-linecap="butt"/><path d="M34 14l-3 3H14l-3-3"/><path d="M31 17v12.5H14V17" stroke-linecap="butt" stroke-linejoin="miter"/><path d="M31 29.5l1.5 2.5h-20l1.5-2.5"/><path d="M11 14h23" fill="none" stroke-linejoin="miter"/></g></svg>`,
  wB: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><g fill="#fff" stroke-linecap="butt"><path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.354.49-2.323.47-3-.5 1.354-1.94 3-2 3-2z"/><path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z"/><path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/></g><path d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5" stroke-linejoin="miter"/></g></svg>`,
  wN: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill="#fff"/><path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3" fill="#fff"/><path d="M9.5 25.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zM15 15.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z" fill="#000" stroke="#000"/></g></svg>`,
  wP: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="#fff" stroke="#000" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  bK: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22.5 11.63V6" stroke-linejoin="miter"/><path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill="#000" stroke-linecap="butt" stroke-linejoin="miter"/><path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-3.5-7.5-13-10.5-16-4-3 6 5 10 5 10V37z" fill="#000"/><path d="M20 8h5" stroke-linejoin="miter"/><path d="M32 29.5s8.5-4 6.03-9.65C34.15 14 25 18 22.5 24.5l.01 2.1-.01-2.1C20 18 9.906 14 6.997 19.85c-2.497 5.65 4.853 9 4.853 9M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0" stroke="#fff"/></g></svg>`,
  bQ: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="#000" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><g fill="#000" stroke="none"><circle cx="6" cy="12" r="2.75"/><circle cx="14" cy="9" r="2.75"/><circle cx="22.5" cy="8" r="2.75"/><circle cx="31" cy="9" r="2.75"/><circle cx="39" cy="12" r="2.75"/></g><path d="M9 26c8.5-1.5 21-1.5 27 0l2.5-12.5L31 25l-.3-14.1-5.2 13.6-3-14.5-3 14.5-5.2-13.6L14 25 6.5 13.5 9 26z" stroke-linecap="butt"/><path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z" stroke-linecap="butt"/><path d="M11 38.5a35 35 1 0 0 23 0" fill="none" stroke-linecap="butt"/><path d="M11 29a35 35 1 0 1 23 0M12.5 31.5h20M11.5 34.5a35 35 1 0 0 22 0M10.5 37.5a35 35 1 0 0 24 0" fill="none" stroke="#fff"/></g></svg>`,
  bR: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="#000" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 39h27v-3H9v3zM12.5 32l1.5-2.5h17l1.5 2.5h-20zM12 36v-4h21v4H12z" stroke-linecap="butt"/><path d="M14 29.5v-13h17v13H14z" stroke-linecap="butt" stroke-linejoin="miter"/><path d="M14 16.5L11 14h23l-3 2.5H14zM11 14V9h4v2h5V9h5v2h5V9h4v5H11z" stroke-linecap="butt"/><path d="M12 35.5h21M13 31.5h19M14 29.5h17M14 16.5h17M11 14h23" fill="none" stroke="#fff" stroke-width="1" stroke-linejoin="miter"/></g></svg>`,
  bB: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><g fill="#000" stroke-linecap="butt"><path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.354.49-2.323.47-3-.5 1.354-1.94 3-2 3-2z"/><path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z"/><path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/></g><path d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5" stroke="#fff" stroke-linejoin="miter"/></g></svg>`,
  bN: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill="#000"/><path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3" fill="#000"/><path d="M9.5 25.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zM15 15.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z" fill="#fff" stroke="#fff"/><path d="M24.55 10.4l-.45 1.45.5.15c3.15 1 5.65 2.49 7.9 6.75S35.75 29.06 35.25 39l-.05.5h2.25l.05-.5c.5-10.06-.88-16.85-3.25-21.34-2.37-4.49-5.79-6.64-9.19-7.16l-.51-.1z" fill="#fff" stroke="none"/></g></svg>`,
  bP: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="#000" stroke="#000" stroke-width="1.5" stroke-linecap="round"/></svg>`
};

function normalizeType(t) {
  if (!t) return '';
  const s = String(t).toLowerCase();
  const map = { king:'K', queen:'Q', rook:'R', bishop:'B', knight:'N', pawn:'P' };
  return map[s] || s[0].toUpperCase();
}

export class BoardView {
  /* Dual signature:
     - new BoardView(el, options)      → game.js style, onSquareClick(row, col)
     - new BoardView({ el, ...opts })  → puzzle.js / lessons.js style, onSquareClick(sq) */
  constructor(elOrOpts, maybeOpts) {
    const isObjectForm = elOrOpts
      && typeof elOrOpts === 'object'
      && !elOrOpts.nodeType
      && 'el' in elOrOpts;

    let el, options;
    if (isObjectForm) { options = elOrOpts; el = options.el; }
    else              { el = elOrOpts;    options = maybeOpts || {}; }

    this.el = typeof el === 'string' ? document.getElementById(el) : el;
    if (!this.el) { console.error('[BoardView] container not found'); return; }

    this.orientation   = options.orientation === 'black' || options.orientation === 'b' ? 'b' : 'w';
    this.showCoords    = options.showCoords !== false;
    this.onSquareClick = options.onSquareClick || (() => {});
    this.clickStyle    = isObjectForm ? 'square' : 'coords';

    this._pieces      = {};
    this._selected    = null;
    this._legalMoves  = [];
    this._lastMove    = null;
    this._checkSquare = null;
    this._destroyed   = false;

    this._build();
  }

  _build() {
    this.el.innerHTML = '';
    // #board / #puzzle-board / #lesson-board → direkt grid.
    // #*-container → wrap inner .board.
    const direct = this.el.classList.contains('board')
                || /^(board|puzzle-board|lesson-board|puzzleBoard|lessonBoard)$/.test(this.el.id);
    if (direct) {
      this.el.classList.add('board');
      this._gridEl = this.el;
    } else {
      this._gridEl = document.createElement('div');
      this._gridEl.className = 'board';
      this.el.appendChild(this._gridEl);
    }
    this.el.__boardView = this;
    this._renderAll();
  }

  _sq(row, col) { return FILES[col] + RANKS[row]; }

  /* game.js API — state lengkap */
  setState(engineState, opts = {}) {
    if (this._destroyed || !engineState) return;
    this._pieces = {};
    if (engineState.board) {
      for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
        const p = engineState.board[r][c];
        if (p) this._pieces[this._sq(r, c)] = {
          color: p.color === 'white' ? 'w' : 'b',
          type: normalizeType(p.type)
        };
      }
    }
    this._selected    = opts.selected ? this._sq(opts.selected.row, opts.selected.col) : null;
    this._legalMoves  = opts.legalMoves ? opts.legalMoves.map(m => this._sq(m.toRow, m.toCol)) : [];
    this._lastMove    = opts.lastMove ? {
      from: this._sq(opts.lastMove.fromRow, opts.lastMove.fromCol),
      to:   this._sq(opts.lastMove.toRow, opts.lastMove.toCol)
    } : null;
    this._checkSquare = opts.checkSquare ? this._sq(opts.checkSquare.row, opts.checkSquare.col) : null;
    this._renderAll();
  }

  /* puzzle.js / lessons.js API */
  setPosition(fenOrBoard) {
    if (this._destroyed) return;
    this._pieces = {};
    const fen = typeof fenOrBoard === 'string' ? fenOrBoard
              : (fenOrBoard && typeof fenOrBoard.fen === 'string') ? fenOrBoard.fen
              : '';
    (fen.split(' ')[0] || '').split('/').forEach((row, r) => {
      if (r >= 8) return;
      let c = 0;
      for (const ch of row) {
        if (/\d/.test(ch)) { c += parseInt(ch, 10); continue; }
        if (c >= 8) break;
        this._pieces[this._sq(r, c)] = {
          color: ch === ch.toUpperCase() ? 'w' : 'b',
          type: ch.toUpperCase()
        };
        c++;
      }
    });
    this._renderAll();
  }

  setSelected(sq)   { this._selected = sq || null; this._renderAll(); }
  setLegalMoves(a)  { this._legalMoves = Array.isArray(a) ? a.slice() : []; this._renderAll(); }
  setLastMove(mv) {
    if (!mv) { this._lastMove = null; this._renderAll(); return; }
    this._lastMove = {
      from: mv.from && typeof mv.from === 'object' ? this._sq(mv.from.row, mv.from.col) : mv.from,
      to:   mv.to   && typeof mv.to   === 'object' ? this._sq(mv.to.row,   mv.to.col)   : mv.to
    };
    this._renderAll();
  }
  clearHighlights() {
    this._selected = null;
    this._legalMoves = [];
    this._lastMove = null;
    this._checkSquare = null;
    this._renderAll();
  }

  _renderAll() {
    if (this._destroyed || !this._gridEl) return;
    const frag  = document.createDocumentFragment();
    const files = this.orientation === 'b' ? [...FILES].reverse() : FILES;
    const ranks = this.orientation === 'b' ? [...RANKS].reverse() : RANKS;

    for (const r of ranks) {
      for (const f of files) {
        const sq = f + r;
        const row = RANKS.indexOf(r);
        const col = FILES.indexOf(f);
        const cell = document.createElement('div');
        cell.className = `square ${(col + row) % 2 === 0 ? 'light' : 'dark'}`;
        cell.dataset.square = sq;
        cell.setAttribute('role', 'gridcell');
        cell.setAttribute('aria-label', sq);

        if (this._lastMove && (sq === this._lastMove.from || sq === this._lastMove.to)) cell.classList.add('last-move');
        if (sq === this._checkSquare)              cell.classList.add('in-check');
        if (sq === this._selected)                 cell.classList.add('selected');
        if (this._legalMoves.includes(sq))         cell.classList.add('legal-target');

        const p = this._pieces[sq];
        if (p) {
          const wrap = document.createElement('div');
          wrap.className = `piece piece-${p.color}${p.type}`;
          wrap.innerHTML = SVG_PIECES[p.color + p.type] || '';
          cell.appendChild(wrap);
        }

        if (this.showCoords) {
          if ((this.orientation === 'w' && r === '1') || (this.orientation === 'b' && r === '8')) {
            const el = document.createElement('span');
            el.className = 'coord-file'; el.textContent = f;
            cell.appendChild(el);
          }
          if ((this.orientation === 'w' && f === 'a') || (this.orientation === 'b' && f === 'h')) {
            const el = document.createElement('span');
            el.className = 'coord-rank'; el.textContent = r;
            cell.appendChild(el);
          }
        }

        cell.addEventListener('click', () => {
          if (this._destroyed) return;
          if (this.clickStyle === 'square') this.onSquareClick(sq, row, col);
          else                              this.onSquareClick(row, col);
        });

        frag.appendChild(cell);
      }
    }
    this._gridEl.replaceChildren(frag);
  }

  setOrientation(o) { this.orientation = (o === 'black' || o === 'b') ? 'b' : 'w'; this._renderAll(); }
  setCoords(show)   { this.showCoords = show; this._renderAll(); }

  destroy() {
    if (this._destroyed) return;
    this._destroyed = true;
    if (this.el) {
      this.el.innerHTML = '';
      if (this.el.__boardView === this) delete this.el.__boardView;
    }
    this._pieces = []; this._legalMoves = []; this._selected = null;
    this._lastMove = null; this._checkSquare = null; this._gridEl = null;
  }
}

if (typeof window !== 'undefined') window.BoardView = BoardView;
