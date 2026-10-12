/* ============================================================
   Chess — pure chess rules engine (no DOM, no globals besides
   window.Chess). Immutable API: every mutation-style operation
   returns a NEW state object, which makes undo/redo trivial and
   keeps the engine reusable by Game, Puzzle and Lessons modes.

   State shape:
   {
     board: 8x8 array, board[row][col] = { type, color } | null
     currentPlayer: 'white' | 'black'
     castlingRights: { whiteKingSide, whiteQueenSide,
                       blackKingSide, blackQueenSide }
     enPassantTarget: 'e3' | null
     halfmoveClock: number
     fullmoveNumber: number
   }
   Move shape:
   { fromRow, fromCol, toRow, toCol, piece, captured, special, promotion }
   ============================================================ */
(function () {
    'use strict';

    const FILES = 'abcdefgh';
    const INITIAL_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    const PIECE_FEN = { king: 'k', queen: 'q', rook: 'r', bishop: 'b', knight: 'n', pawn: 'p' };
    const FEN_PIECE = { k: 'king', q: 'queen', r: 'rook', b: 'bishop', n: 'knight', p: 'pawn' };
    const KNIGHT_OFFSETS = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
    const KING_OFFSETS = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
    const SLIDE_DIRS = [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[-1,1],[1,-1],[1,1]];
    const PROMOTION_TYPES = ['queen', 'rook', 'bishop', 'knight'];

    /* ---------- square helpers ---------- */

    function sqName(row, col) { return FILES[col] + (8 - row); }
    function parseSquare(name) {
        if (typeof name !== 'string' || name.length !== 2) return null;
        const col = FILES.indexOf(name[0]);
        const row = 8 - parseInt(name[1], 10);
        if (col < 0 || row < 0 || row > 7) return null;
        return { row, col };
    }
    function other(color) { return color === 'white' ? 'black' : 'white'; }
    function inBounds(r, c) { return r >= 0 && r < 8 && c >= 0 && c < 8; }

    /* ---------- FEN ---------- */

    function validateFEN(fen) {
        if (typeof fen !== 'string') return false;
        const parts = fen.trim().split(/\s+/);
        if (parts.length !== 6) return false;
        const ranks = parts[0].split('/');
        if (ranks.length !== 8) return false;
        for (const rank of ranks) {
            let count = 0;
            for (const ch of rank) {
                if (ch >= '1' && ch <= '8') count += parseInt(ch, 10);
                else if (/[prnbqkPRNBQK]/.test(ch)) count++;
                else return false;
            }
            if (count !== 8) return false;
        }
        if (parts[1] !== 'w' && parts[1] !== 'b') return false;
        if (!/^[KQkq-]+$/.test(parts[2])) return false;
        if (parts[3] !== '-' && !/^[a-h][36]$/.test(parts[3])) return false;
        if (isNaN(parseInt(parts[4], 10)) || isNaN(parseInt(parts[5], 10))) return false;
        return true;
    }

    function parseFEN(fen) {
        if (!validateFEN(fen)) throw new Error('Invalid FEN: ' + fen);
        const parts = fen.trim().split(/\s+/);
        const board = [];
        const ranks = parts[0].split('/');
        for (let r = 0; r < 8; r++) {
            const row = [];
            for (const ch of ranks[r]) {
                if (ch >= '1' && ch <= '8') {
                    for (let i = 0; i < parseInt(ch, 10); i++) row.push(null);
                } else {
                    const color = ch === ch.toUpperCase() ? 'white' : 'black';
                    row.push({ type: FEN_PIECE[ch.toLowerCase()], color });
                }
            }
            board.push(row);
        }
        const castling = parts[2];
        return {
            board,
            currentPlayer: parts[1] === 'w' ? 'white' : 'black',
            castlingRights: {
                whiteKingSide: castling.includes('K'),
                whiteQueenSide: castling.includes('Q'),
                blackKingSide: castling.includes('k'),
                blackQueenSide: castling.includes('q')
            },
            enPassantTarget: parts[3] !== '-' ? parts[3] : null,
            halfmoveClock: parseInt(parts[4], 10) || 0,
            fullmoveNumber: parseInt(parts[5], 10) || 1
        };
    }

    function toFEN(state) {
        let fen = '';
        for (let r = 0; r < 8; r++) {
            let empty = 0;
            for (let c = 0; c < 8; c++) {
                const p = state.board[r][c];
                if (!p) { empty++; continue; }
                if (empty > 0) { fen += empty; empty = 0; }
                const ch = PIECE_FEN[p.type];
                fen += p.color === 'white' ? ch.toUpperCase() : ch;
            }
            if (empty > 0) fen += empty;
            if (r < 7) fen += '/';
        }
        fen += ' ' + (state.currentPlayer === 'white' ? 'w' : 'b');
        let cr = '';
        if (state.castlingRights.whiteKingSide) cr += 'K';
        if (state.castlingRights.whiteQueenSide) cr += 'Q';
        if (state.castlingRights.blackKingSide) cr += 'k';
        if (state.castlingRights.blackQueenSide) cr += 'q';
        fen += ' ' + (cr || '-');
        fen += ' ' + (state.enPassantTarget || '-');
        fen += ' ' + state.halfmoveClock + ' ' + state.fullmoveNumber;
        return fen;
    }

    /* ---------- attack detection ---------- */

    function isSquareAttacked(board, row, col, byColor) {
        for (const [dr, dc] of KNIGHT_OFFSETS) {
            const p = inBounds(row + dr, col + dc) ? board[row + dr][col + dc] : null;
            if (p && p.color === byColor && p.type === 'knight') return true;
        }
        for (const [dr, dc] of KING_OFFSETS) {
            const p = inBounds(row + dr, col + dc) ? board[row + dr][col + dc] : null;
            if (p && p.color === byColor && p.type === 'king') return true;
        }
        const pawnDir = byColor === 'white' ? -1 : 1;
        for (const dc of [-1, 1]) {
            // A pawn attacks one row forward; it sits one row BEHIND the target.
            const pr = row - pawnDir;
            const p = inBounds(pr, col + dc) ? board[pr][col + dc] : null;
            if (p && p.color === byColor && p.type === 'pawn') return true;
        }
        for (const [dr, dc] of SLIDE_DIRS) {
            let r = row + dr, c = col + dc;
            while (inBounds(r, c)) {
                const p = board[r][c];
                if (p) {
                    if (p.color === byColor) {
                        const diag = Math.abs(dr) === 1 && Math.abs(dc) === 1;
                        const orth = (dr === 0) !== (dc === 0);
                        if (p.type === 'queen') return true;
                        if (diag && p.type === 'bishop') return true;
                        if (orth && p.type === 'rook') return true;
                    }
                    break;
                }
                r += dr; c += dc;
            }
        }
        return false;
    }

    function findKing(board, color) {
        for (let r = 0; r < 8; r++)
            for (let c = 0; c < 8; c++) {
                const p = board[r][c];
                if (p && p.type === 'king' && p.color === color) return { row: r, col: c };
            }
        return null;
    }

    function isInCheck(state, color) {
        const k = findKing(state.board, color);
        if (!k) return true;
        return isSquareAttacked(state.board, k.row, k.col, other(color));
    }

    /* ---------- move generation ---------- */

    function cloneBoard(board) {
        return board.map(row => row.map(cell => (cell ? { type: cell.type, color: cell.color } : null)));
    }

    function pseudoMoves(state, row, col) {
        const b = state.board;
        const piece = b[row][col];
        if (!piece) return [];
        const moves = [];
        const color = piece.color;
        const enemy = other(color);
        const cr = state.castlingRights;
        const ep = state.enPassantTarget;

        function addMove(tr, tc, special) {
            if (!inBounds(tr, tc)) return;
            const target = b[tr][tc];
            if (!target || target.color === enemy) {
                moves.push({
                    fromRow: row, fromCol: col, toRow: tr, toCol: tc,
                    piece, captured: target || null, special: special || null, promotion: null
                });
            }
        }
        function slide(dr, dc) {
            let r = row + dr, c = col + dc;
            while (inBounds(r, c)) {
                const t = b[r][c];
                if (t) {
                    if (t.color === enemy) {
                        moves.push({ fromRow: row, fromCol: col, toRow: r, toCol: c, piece, captured: t, special: null, promotion: null });
                    }
                    break;
                }
                moves.push({ fromRow: row, fromCol: col, toRow: r, toCol: c, piece, captured: null, special: null, promotion: null });
                r += dr; c += dc;
            }
        }

        switch (piece.type) {
            case 'pawn': {
                const dir = color === 'white' ? -1 : 1;
                const startRow = color === 'white' ? 6 : 1;
                const promoRow = color === 'white' ? 0 : 7;
                if (inBounds(row + dir, col) && !b[row + dir][col]) {
                    addMove(row + dir, col);
                    if (row === startRow && !b[row + 2 * dir][col]) addMove(row + 2 * dir, col, 'double-push');
                }
                for (const dc of [-1, 1]) {
                    const tr = row + dir, tc = col + dc;
                    if (inBounds(tr, tc)) {
                        const t = b[tr][tc];
                        if (t && t.color === enemy) addMove(tr, tc);
                    }
                }
                if (ep) {
                    const epSq = parseSquare(ep);
                    if (epSq && row + dir === epSq.row && Math.abs(col - epSq.col) === 1) {
                        moves.push({
                            fromRow: row, fromCol: col, toRow: epSq.row, toCol: epSq.col,
                            piece, captured: b[epSq.row - dir][epSq.col] || null,
                            special: 'en-passant', promotion: null
                        });
                    }
                }
                // mark promotion moves
                for (const m of moves) {
                    if (m.piece === piece && m.toRow === promoRow) m.promotion = 'queen';
                }
                break;
            }
            case 'knight':
                for (const [dr, dc] of KNIGHT_OFFSETS) addMove(row + dr, col + dc);
                break;
            case 'bishop':
                for (const [dr, dc] of [[-1,-1],[-1,1],[1,-1],[1,1]]) slide(dr, dc);
                break;
            case 'rook':
                for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]) slide(dr, dc);
                break;
            case 'queen':
                for (const [dr, dc] of SLIDE_DIRS) slide(dr, dc);
                break;
            case 'king': {
                for (const [dr, dc] of KING_OFFSETS) addMove(row + dr, col + dc);
                const homeRow = color === 'white' ? 7 : 0;
                if (row === homeRow && col === 4) {
                    const ks = color === 'white' ? cr.whiteKingSide : cr.blackKingSide;
                    const qs = color === 'white' ? cr.whiteQueenSide : cr.blackQueenSide;
                    if (ks && !b[homeRow][5] && !b[homeRow][6] &&
                        !isSquareAttacked(b, homeRow, 4, enemy) &&
                        !isSquareAttacked(b, homeRow, 5, enemy) &&
                        !isSquareAttacked(b, homeRow, 6, enemy) &&
                        b[homeRow][7] && b[homeRow][7].type === 'rook' && b[homeRow][7].color === color) {
                        moves.push({ fromRow: homeRow, fromCol: 4, toRow: homeRow, toCol: 6, piece, captured: null, special: 'kingside-castle', promotion: null });
                    }
                    if (qs && !b[homeRow][1] && !b[homeRow][2] && !b[homeRow][3] &&
                        !isSquareAttacked(b, homeRow, 4, enemy) &&
                        !isSquareAttacked(b, homeRow, 3, enemy) &&
                        !isSquareAttacked(b, homeRow, 2, enemy) &&
                        b[homeRow][0] && b[homeRow][0].type === 'rook' && b[homeRow][0].color === color) {
                        moves.push({ fromRow: homeRow, fromCol: 4, toRow: homeRow, toCol: 2, piece, captured: null, special: 'queenside-castle', promotion: null });
                    }
                }
                break;
            }
        }
        return moves;
    }

    /** Apply a move to a board clone and return the new board. */
    function boardAfter(board, move) {
        const nb = cloneBoard(board);
        const piece = nb[move.fromRow][move.fromCol];
        nb[move.toRow][move.toCol] = piece;
        nb[move.fromRow][move.fromCol] = null;
        if (move.special === 'en-passant') {
            const dir = piece.color === 'white' ? 1 : -1;
            nb[move.toRow + dir][move.toCol] = null;
        }
        if (move.special === 'kingside-castle') { nb[move.toRow][5] = nb[move.toRow][7]; nb[move.toRow][7] = null; }
        if (move.special === 'queenside-castle') { nb[move.toRow][3] = nb[move.toRow][0]; nb[move.toRow][0] = null; }
        if (move.promotion) nb[move.toRow][move.toCol] = { type: move.promotion, color: piece.color };
        return nb;
    }

    function legalMovesFrom(state, row, col) {
        const piece = state.board[row][col];
        if (!piece) return [];
        const legal = [];
        for (const m of pseudoMoves(state, row, col)) {
            const nb = boardAfter(state.board, m);
            if (!isKingInCheckBoard(nb, piece.color)) legal.push(m);
        }
        return legal;
    }

    function isKingInCheckBoard(board, color) {
        const k = findKing(board, color);
        if (!k) return true;
        return isSquareAttacked(board, k.row, k.col, other(color));
    }

    function allLegalMoves(state, color) {
        const all = [];
        for (let r = 0; r < 8; r++)
            for (let c = 0; c < 8; c++) {
                const p = state.board[r][c];
                if (p && p.color === color) all.push(...legalMovesFrom(state, r, c));
            }
        return all;
    }

    /**
     * Find the legal move matching a "from-to" string such as "e2e4".
     * Optional promotion piece suffix ("e7e8q") is ignored for matching
     * since the returned move carries a default promotion of queen.
     */
    function findMove(state, fromTo) {
        if (typeof fromTo !== 'string' || fromTo.length < 4) return null;
        const from = parseSquare(fromTo.slice(0, 2));
        const to = parseSquare(fromTo.slice(2, 4));
        if (!from || !to) return null;
        const moves = legalMovesFrom(state, from.row, from.col);
        return moves.find(m => m.toRow === to.row && m.toCol === to.col) || null;
    }

    /* ---------- move application (immutable) ---------- */

    /**
     * Apply a legal move and return { state, move } with the enriched move
     * (captured piece, SAN notation with check/mate suffix).
     */
    function applyMove(state, move) {
        const piece = state.board[move.fromRow][move.fromCol];
        const newState = {
            board: boardAfter(state.board, move),
            currentPlayer: other(state.currentPlayer),
            castlingRights: { ...state.castlingRights },
            enPassantTarget: null,
            halfmoveClock: state.halfmoveClock + 1,
            fullmoveNumber: state.fullmoveNumber
        };

        // captured reference for history
        let captured = move.captured;
        if (move.special === 'en-passant') {
            const dir = piece.color === 'white' ? 1 : -1;
            captured = state.board[move.toRow + dir][move.toCol];
        }

        if (captured || piece.type === 'pawn') newState.halfmoveClock = 0;
        if (state.currentPlayer === 'black') newState.fullmoveNumber++;

        if (move.special === 'double-push') {
            const epRow = piece.color === 'white' ? move.toRow + 1 : move.toRow - 1;
            newState.enPassantTarget = sqName(epRow, move.toCol);
        }

        const cr = newState.castlingRights;
        if (piece.type === 'king') {
            if (piece.color === 'white') { cr.whiteKingSide = false; cr.whiteQueenSide = false; }
            else { cr.blackKingSide = false; cr.blackQueenSide = false; }
        }
        if (piece.type === 'rook') {
            if (move.fromRow === 7 && move.fromCol === 0) cr.whiteQueenSide = false;
            if (move.fromRow === 7 && move.fromCol === 7) cr.whiteKingSide = false;
            if (move.fromRow === 0 && move.fromCol === 0) cr.blackQueenSide = false;
            if (move.fromRow === 0 && move.fromCol === 7) cr.blackKingSide = false;
        }
        if (captured && captured.type === 'rook') {
            if (move.toRow === 7 && move.toCol === 0) cr.whiteQueenSide = false;
            if (move.toRow === 7 && move.toCol === 7) cr.whiteKingSide = false;
            if (move.toRow === 0 && move.toCol === 0) cr.blackQueenSide = false;
            if (move.toRow === 0 && move.toCol === 7) cr.blackKingSide = false;
        }

        const enriched = { ...move, piece, captured, promotion: move.promotion || null };
        enriched.san = moveToSAN(state, enriched);

        return { state: newState, move: enriched };
    }

    /* ---------- SAN ---------- */

    function moveToSAN(state, move) {
        let san;
        if (move.special === 'kingside-castle') san = 'O-O';
        else if (move.special === 'queenside-castle') san = 'O-O-O';
        else if (move.piece.type === 'pawn') {
            san = move.captured || move.special === 'en-passant'
                ? FILES[move.fromCol] + 'x' + sqName(move.toRow, move.toCol)
                : sqName(move.toRow, move.toCol);
        } else {
            const letter = { king: 'K', queen: 'Q', rook: 'R', bishop: 'B', knight: 'N' }[move.piece.type];
            san = letter + (move.captured ? 'x' : '') + sqName(move.toRow, move.toCol);
        }
        if (move.promotion) san += '=' + { queen: 'Q', rook: 'R', bishop: 'B', knight: 'N' }[move.promotion];
        if (move.special === 'en-passant') san += ' e.p.';

        const next = applyMoveNoSAN(state, move);
        if (isKingInCheckBoard(next.board, next.currentPlayer)) {
            san += allLegalMoves(next, next.currentPlayer).length === 0 ? '#' : '+';
        }
        return san;
    }

    function applyMoveNoSAN(state, move) {
        const piece = state.board[move.fromRow][move.fromCol];
        return {
            board: boardAfter(state.board, move),
            currentPlayer: other(state.currentPlayer),
            castlingRights: state.castlingRights,
            enPassantTarget: null,
            halfmoveClock: 0,
            fullmoveNumber: state.fullmoveNumber
        };
    }

    /* ---------- game status ---------- */

    function status(state) {
        const check = isInCheck(state, state.currentPlayer);
        const legal = allLegalMoves(state, state.currentPlayer);
        let checkmate = false, stalemate = false, over = false, result = null;
        if (legal.length === 0) {
            over = true;
            if (check) {
                checkmate = true;
                result = other(state.currentPlayer);
            } else {
                stalemate = true;
                result = 'draw';
            }
        }
        return { check, checkmate, stalemate, over, result, legalCount: legal.length };
    }

    function insufficientMaterial(state) {
        const minor = [];
        for (let r = 0; r < 8; r++)
            for (let c = 0; c < 8; c++) {
                const p = state.board[r][c];
                if (!p) continue;
                if (p.type === 'king') continue;
                if (p.type === 'pawn' || p.type === 'rook' || p.type === 'queen') return false;
                minor.push({ type: p.type, color: p.color, row: r, col: c });
            }
        if (minor.length === 0) return true;                       // K vs K
        if (minor.length === 1) return true;                       // K+minor vs K
        if (minor.length === 2 && minor[0].type === 'bishop' && minor[1].type === 'bishop'
            && minor[0].color !== minor[1].color
            && ((minor[0].row + minor[0].col) % 2) === ((minor[1].row + minor[1].col) % 2)) {
            return true;                                           // same-color bishops
        }
        return false;
    }

    window.Chess = {
        INITIAL_FEN,
        PROMOTION_TYPES,
        FILES,
        validateFEN,
        parseFEN,
        toFEN,
        initialState() { return parseFEN(INITIAL_FEN); },
        sqName,
        parseSquare,
        other,
        isInCheck,
        isSquareAttacked,
        findKing,
        legalMovesFrom,
        allLegalMoves,
        findMove,
        applyMove,
        moveToSAN,
        status,
        insufficientMaterial,
        cloneBoard
    };
})();
