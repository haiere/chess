/* BoardView — reusable interactive chessboard renderer.
   Used by Game mode, Puzzle mode, and as a static example board
   in Lessons. Emits square clicks; drag support via Pointer events. */
(function () {
    'use strict';

    class BoardView {
        /**
         * @param {HTMLElement} container element with role="grid"
         * @param {object} opts { orientation, showCoords, interactive, onMove }
         */
        constructor(container, opts) {
            this.el = container;
            this.orientation = (opts && opts.orientation) || 'white';
            this.showCoords = opts && opts.showCoords !== undefined ? opts.showCoords : true;
            this.interactive = opts && opts.interactive !== undefined ? opts.interactive : true;
            this.onMove = (opts && opts.onMove) || null;   // (fromRow, fromCol) => legal moves or null
            this.onSquareClick = (opts && opts.onSquareClick) || null;
            this.state = null;
            this.marks = {};
            this._drag = null;
            this._suppressClick = false;
            this._bindPointer();
        }

        setState(engineState, marks) {
            this.state = engineState;
            if (marks) this.marks = marks;
            this.render();
        }

        setOrientation(o) { this.orientation = o; this.render(); }
        setCoords(v) { this.showCoords = v; this.render(); }
        setMarks(marks) { this.marks = marks || {}; this.render(); }

        destroy() {
            this.el.innerHTML = '';
            this.state = null;
        }

        squareEl(row, col) {
            return this.el.querySelector(`.square[data-row="${row}"][data-col="${col}"]`);
        }

        render() {
            if (!this.el) return;
            this.el.innerHTML = '';
            if (!this.state) return;
            const flipped = this.orientation === 'black';
            const m = this.marks;

            for (let dr = 0; dr < 8; dr++) {
                for (let dc = 0; dc < 8; dc++) {
                    const ar = flipped ? 7 - dr : dr;
                    const ac = flipped ? 7 - dc : dc;
                    const sq = document.createElement('div');
                    sq.className = 'square ' + ((ar + ac) % 2 === 0 ? 'light' : 'dark');
                    sq.dataset.row = ar;
                    sq.dataset.col = ac;
                    sq.setAttribute('role', 'gridcell');
                    sq.setAttribute('aria-label', Chess.sqName(ar, ac));

                    if (m.selected && m.selected.row === ar && m.selected.col === ac) sq.classList.add('selected');
                    if (m.lastMove && ((m.lastMove.fromRow === ar && m.lastMove.fromCol === ac) ||
                                       (m.lastMove.toRow === ar && m.lastMove.toCol === ac))) sq.classList.add('last-move');
                    if (m.checkSquare && m.checkSquare.row === ar && m.checkSquare.col === ac) sq.classList.add('in-check');
                    if (m.hintFrom && m.hintFrom.row === ar && m.hintFrom.col === ac) sq.classList.add('hint-from');
                    if (m.hintTo && m.hintTo.row === ar && m.hintTo.col === ac) sq.classList.add('hint-to');
                    if (m.wrongSquare && m.wrongSquare.row === ar && m.wrongSquare.col === ac) sq.classList.add('wrong-move');
                    if (m.goodSquare && m.goodSquare.row === ar && m.goodSquare.col === ac) sq.classList.add('good-move');

                    const legal = m.legalMoves && m.legalMoves.find(mm => mm.toRow === ar && mm.toCol === ac);
                    if (legal) sq.classList.add((legal.captured || legal.special === 'en-passant') ? 'capture-move' : 'legal-move');

                    if (this.showCoords) {
                        if (ac === (flipped ? 7 : 0)) {
                            const rl = document.createElement('span');
                            rl.className = 'coord-label coord-rank';
                            rl.textContent = 8 - ar;
                            sq.appendChild(rl);
                        }
                        if (ar === (flipped ? 0 : 7)) {
                            const fl = document.createElement('span');
                            fl.className = 'coord-label coord-file';
                            fl.textContent = Chess.FILES[ac];
                            sq.appendChild(fl);
                        }
                    }

                    const piece = this.state.board[ar][ac];
                    if (piece) {
                        const img = document.createElement('img');
                        img.className = 'piece-img';
                        img.src = window.ChessPieces[piece.color][piece.type];
                        img.alt = piece.color + ' ' + piece.type;
                        img.draggable = false;
                        sq.appendChild(img);
                    }

                    sq.addEventListener('click', () => this._onClick(ar, ac));
                    this.el.appendChild(sq);
                }
            }
        }

        _onClick(row, col) {
            if (!this.interactive || this._suppressClick) return;
            if (this.onSquareClick) this.onSquareClick(row, col);
        }

        _bindPointer() {
            if (!this.el) return;
            this.el.addEventListener('pointerdown', (e) => {
                if (!this.interactive || !this.onMove) return;
                const sq = e.target.closest('.square');
                if (!sq || !this.state) return;
                const row = +sq.dataset.row, col = +sq.dataset.col;
                const piece = this.state.board[row][col];
                if (!piece) return;
                this._drag = { row, col, piece, moved: false, id: e.pointerId };
            });
            this.el.addEventListener('pointermove', (e) => {
                if (!this._drag || this._drag.moved) return;
                this._drag.moved = true;
                if (this.onSquareClick) this.onSquareClick(this._drag.row, this._drag.col); // select on drag start
            });
            this.el.addEventListener('pointerup', (e) => {
                if (!this._drag) return;
                const d = this._drag;
                this._drag = null;
                if (!d.moved) return; // plain click already handled
                const el = document.elementFromPoint(e.clientX, e.clientY);
                const sq = el && el.closest('.square');
                this._suppressClick = true;
                setTimeout(() => { this._suppressClick = false; }, 120);
                if (sq && this.onDrop) this.onDrop(d.row, d.col, +sq.dataset.row, +sq.dataset.col);
            });
            this.el.addEventListener('pointercancel', () => { this._drag = null; });
        }
    }

    window.BoardView = BoardView;
})();
