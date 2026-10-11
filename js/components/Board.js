import { PIECE_SVG } from '../chess/constants.js';

/**
 * Render papan catur.
 * @param {HTMLElement} container
 * @param {import('../chess/engine.js').ChessEngine} engine
 * @param {object} opts
 * @param {'white'|'black'} opts.orientation
 * @param {boolean} opts.interactive
 * @param {function({from:string,to:string}):void} opts.onMove
 * @param {{from:string,to:string}|null} opts.lastMove
 * @param {string|null} opts.selected
 * @param {string[]} opts.legalTargets
 * @param {boolean} opts.showCoords
 */
export function renderBoard(container, engine, opts = {}) {
  const {
    orientation = 'white',
    interactive = true,
    onMove = () => {},
    lastMove = null,
    selected = null,
    legalTargets = [],
    showCoords = true,
  } = opts;

  const board = engine.board;
  container.innerHTML = '';
  container.setAttribute('role', 'grid');
  container.setAttribute('aria-label', 'Papan catur');

  const files = 'abcdefgh';
  const flipped = orientation === 'black';

  for (let dr = 0; dr < 8; dr++) {
    for (let dc = 0; dc < 8; dc++) {
      const r = flipped ? 7 - dr : dr;
      const c = flipped ? 7 - dc : dc;
      const isLight = (r + c) % 2 === 0;
      const squareName = files[c] + (8 - r);

      const sq = document.createElement('div');
      sq.className = `square ${isLight ? 'light' : 'dark'}`;
      sq.dataset.square = squareName;
      sq.setAttribute('role', 'gridcell');
      sq.setAttribute('tabindex', interactive ? '0' : '-1');

      if (lastMove && (lastMove.from === squareName || lastMove.to === squareName)) {
        sq.classList.add('last-move');
      }
      if (selected === squareName) sq.classList.add('selected');
      if (legalTargets.includes(squareName)) {
        const targetPiece = board[r][c];
        sq.classList.add(targetPiece ? 'capture-move' : 'legal-move');
      }

      if (showCoords) {
        if (c === (flipped ? 7 : 0)) {
          const rl = document.createElement('span');
          rl.className = 'coord-label coord-rank';
          rl.textContent = 8 - r;
          sq.appendChild(rl);
        }
        if (r === (flipped ? 0 : 7)) {
          const fl = document.createElement('span');
          fl.className = 'coord-label coord-file';
          fl.textContent = files[c];
          sq.appendChild(fl);
        }
      }

      const piece = board[r][c];
      if (piece) {
        const img = document.createElement('img');
        img.className = 'piece-img';
        img.src = PIECE_SVG[piece.color][piece.type];
        img.alt = `${piece.color} ${piece.type}`;
        img.draggable = interactive;
        sq.appendChild(img);
      }

      if (interactive) {
        sq.addEventListener('click', () => onMove({ square: squareName }));
        sq.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onMove({ square: squareName });
          }
        });
      }

      container.appendChild(sq);
    }
  }
    }
