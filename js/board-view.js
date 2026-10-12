/* BoardView — reusable interactive chessboard renderer.
   Used by Game mode, Puzzle mode, and as a static example board in Lessons.
   Supports mouse, touch (pointer events with capture), and keyboard. */
(function () {
    'use strict';

    class BoardView {
        constructor(container, opts) {
            opts = opts || {};
            this.el = container;
            this.orientation = opts.orientation || 'white';
            this.showCoords = opts.showCoords !== undefined ? opts.showCoords : true;
            this.interactive = opts.interactive !== undefined ? opts.interactive : true;
            this.onSquareClick = opts.onSquareClick || null;
            this.onDrop = null;
            this.state = null;
            this.marks = {};
            this._drag = null;
            this._suppressClick = false;
            this.kbFocus = null;
            this.el.setAttribute('tabindex', this.interactive ? '0' : '-1');
            this.el.addEventListener('keydown', (e) => this._onKeyDown(e));
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
        setInteractive(v) {
            this.interactive = v;
            this.el.setAttribute('tabindex', v ? '0' : '-1');
        }
        destroy() { this.el.innerHTML = ''; this.state = null; }

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
                    if (this.kbFocus && this.kbFocus.row === ar && this.kbFocus.col === ac) sq.classList.add('kb-focus');

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
                        img.alt = window.I18n
                            ? window.I18n.t('pieces.' + piece.color) + ' ' + window.I18n.t('pieces.' + piece.type)
                            : piece.color + ' ' + piece.type;
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
            this.kbFocus = { row, col };
            if (this.onSquareClick) this.onSquareClick(row, col);
        }

        /* Keyboard: arrows move a focus cursor, Enter/Space "clicks" it. */
        _onKeyDown(e) {
            if (!this.interactive || !this.state) return;
            const step = {
                ArrowUp: [-1, 0], ArrowDown: [1, 0],
                ArrowLeft: [0, -1], ArrowRight: [0, 1]
            }[e.key];
            if (step) {
                e.preventDefault();
                if (!this.kbFocus) {
                    this.kbFocus = this.orientation === 'white' ? { row: 7, col: 4 } : { row: 0, col: 3 };
                } else {
                    // move in visual space, then map back to board coords
                    const flipped = this.orientation === 'black';
                    let vr = (flipped ? 7 - this.kbFocus.row : this.kbFocus.row) + step[0];
                    let vc = (flipped ? 7 - this.kbFocus.col : this.kbFocus.col) + step[1];
                    vr = Math.max(0, Math.min(7, vr));
                    vc = Math.max(0, Math.min(7, vc));
                    this.kbFocus = { row: flipped ? 7 - vr : vr, col: flipped ? 7 - vc : vc };
                }
                this.render();
                return;
            }
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (this.kbFocus && this.onSquareClick) this.onSquareClick(this.kbFocus.row, this.kbFocus.col);
            }
        }

        _bindPointer() {
            if (!this.el) return;
            this.el.addEventListener('pointerdown', (e) => {
                if (!this.interactive || !this.onDrop || !this.state) return;
                const sq = e.target.closest('.square');
                if (!sq) return;
                this._drag = {
                    row: +sq.dataset.row, col: +sq.dataset.col,
                    moved: false, captured: false,
                    startX: e.clientX, startY: e.clientY
                };
            });
            this.el.addEventListener('pointermove', (e) => {
                const d = this._drag;
                if (!d || d.moved) return;
                const dx = e.clientX - d.startX, dy = e.clientY - d.startY;
                if (Math.sqrt(dx * dx + dy * dy) < 6) return; // treat as tap until 6px
                d.moved = true;
                // begin real drag: capture pointer so pointerup fires on container
                try { this.el.setPointerCapture(e.pointerId); d.captured = true; } catch (err) { /* noop */ }
                if (this.onSquareClick) this.onSquareClick(d.row, d.col);
            });
            this.el.addEventListener('pointerup', (e) => {
                const d = this._drag;
                this._drag = null;
                if (!d) return;
                // suppress the compatibility click event in both paths
                this._suppressClick = true;
                setTimeout(() => { this._suppressClick = false; }, 120);
                if (d.moved) {
                    const el = document.elementFromPoint(e.clientX, e.clientY);
                    const sq = el && el.closest('.square');
                    if (sq && this.onDrop) this.onDrop(d.row, d.col, +sq.dataset.row, +sq.dataset.col);
                } else {
                    // plain tap: handle directly (click event is suppressed above)
                    this.kbFocus = { row: d.row, col: d.col };
                    if (this.onSquareClick) this.onSquareClick(d.row, d.col);
                }
            });
            this.el.addEventListener('pointercancel', () => { this._drag = null; });
        }
    }

    window.BoardView = BoardView;
})();
