'use strict';

document.addEventListener('DOMContentLoaded', () => {

/* ============================================================
   SVG PIECES
   ============================================================ */
const wrap = (inner) => 'data:image/svg+xml,' + encodeURIComponent(inner);

const SVG = {
    white: {
        king: wrap('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22.5 11.63V6"/><path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill="#fff"/><path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-3.5-7.5-13-10.5-16-4-3 6 6 10.5 6 10.5v7" fill="#fff"/><path d="M20 8h5"/><circle cx="22.5" cy="33.5" r="1.5" fill="#000"/><circle cx="20.5" cy="30.5" r="1.5" fill="#000"/><circle cx="24.5" cy="30.5" r="1.5" fill="#000"/></g></svg>'),
        queen: wrap('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zm16.5-4.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zm13 4.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0z" fill="#fff"/><path d="M9 26c8.5-1.5 21-1.5 27 0l2.5-12.5L31 12l-3.5 6.5-5.5-7-5.5 7L13 12l-7.5 1.5L9 26z" fill="#fff"/><path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 2-1 .5-2.5 0 0 0-1.5-1.5-2.5-.5-2.5.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z" fill="#fff"/><circle cx="6" cy="12" r="1.5" fill="#000"/><circle cx="20.5" cy="7" r="1.5" fill="#000"/><circle cx="35" cy="12" r="1.5" fill="#000"/></g></svg>'),
        rook: wrap('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 39h27v-3H9v3zm3.5-7h18V10h-18v22zm3-17.5h12" fill="#fff"/><path d="M15 10V3h15v7M15 10h-4.5v6.5M30 10h4.5v6.5" fill="#fff"/></g></svg>'),
        bishop: wrap('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><g fill="#fff"><path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.35.49-2.32.47-3-.5 1.35-1.46 3-2 3-2z"/><path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z"/><path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z"/></g></g></svg>'),
        knight: wrap('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10c10.5 1 16.5 8 16 15H15c0-9 10-6.5 8-21" fill="#fff"/><path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3" fill="#fff"/></g></svg>'),
        pawn: wrap('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 13 19 13 23.5v3h19v-3c0-4.5-4.33-7-6.28-8.12.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="#fff" stroke="#000" stroke-width="1.5" stroke-linecap="round"/></svg>')
    },
    black: {
        king: wrap('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22.5 11.63V6"/><path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill="#000"/><path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-3.5-7.5-13-10.5-16-4-3 6 6 10.5 6 10.5v7" fill="#000"/><path d="M20 8h5"/><circle cx="22.5" cy="33.5" r="1.5" fill="#fff"/><circle cx="20.5" cy="30.5" r="1.5" fill="#fff"/><circle cx="24.5" cy="30.5" r="1.5" fill="#fff"/></g></svg>'),
        queen: wrap('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zm16.5-4.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zm13 4.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0z" fill="#000"/><path d="M9 26c8.5-1.5 21-1.5 27 0l2.5-12.5L31 12l-3.5 6.5-5.5-7-5.5 7L13 12l-7.5 1.5L9 26z" fill="#000"/><path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 2-1 .5-2.5 0 0 0-1.5-1.5-2.5-.5-2.5.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z" fill="#000"/><circle cx="6" cy="12" r="1.5" fill="#fff"/><circle cx="20.5" cy="7" r="1.5" fill="#fff"/><circle cx="35" cy="12" r="1.5" fill="#fff"/></g></svg>'),
        rook: wrap('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 39h27v-3H9v3zm3.5-7h18V10h-18v22zm3-17.5h12" fill="#000"/><path d="M15 10V3h15v7M15 10h-4.5v6.5M30 10h4.5v6.5" fill="#000"/></g></svg>'),
        bishop: wrap('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><g fill="#000"><path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.35.49-2.32.47-3-.5 1.35-1.46 3-2 3-2z"/><path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z"/><path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z"/></g></g></svg>'),
        knight: wrap('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10c10.5 1 16.5 8 16 15H15c0-9 10-6.5 8-21" fill="#000"/><path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3" fill="#000"/></g></svg>'),
        pawn: wrap('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 13 19 13 23.5v3h19v-3c0-4.5-4.33-7-6.28-8.12.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="#000" stroke="#000" stroke-width="1.5" stroke-linecap="round"/></svg>')
    }
};

/* ============================================================
   STORAGE (safe wrapper)
   ============================================================ */
const STORAGE = {
    _mem: new Map(),
    _ok: null,
    check() {
        if (this._ok !== null) return this._ok;
        try {
            const k = '__t__';
            localStorage.setItem(k, '1');
            localStorage.removeItem(k);
            this._ok = true;
        } catch { this._ok = false; }
        return this._ok;
    },
    get(key, fallback = null) {
        try {
            const raw = this.check()
                ? localStorage.getItem('chess:' + key)
                : this._mem.get('chess:' + key);
            return raw != null ? JSON.parse(raw) : fallback;
        } catch { return fallback; }
    },
    set(key, value) {
        try {
            const raw = JSON.stringify(value);
            if (this.check()) localStorage.setItem('chess:' + key, raw);
            else this._mem.set('chess:' + key, raw);
        } catch { /* quota */ }
    },
    remove(key) {
        try {
            if (this.check()) localStorage.removeItem('chess:' + key);
            else this._mem.delete('chess:' + key);
        } catch { /* noop */ }
    }
};

/* ============================================================
   AUDIO
   ============================================================ */
let audioCtx = null;
let soundEnabled = STORAGE.get('sound', true);
const SOUND_VOL = 0.4;

function getAudioCtx() {
    try {
        if (!audioCtx) {
            const Ctx = window.AudioContext || window.webkitAudioContext;
            if (!Ctx) return null;
            audioCtx = new Ctx();
        }
        if (audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
        return audioCtx;
    } catch { return null; }
}

function playTone(freq, duration, type = 'sine', vol = 0.3) {
    if (!soundEnabled) return;
    try {
        const ctx = getAudioCtx();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(vol * SOUND_VOL, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + duration);
    } catch { /* silent */ }
}

function playSound(type) {
    switch (type) {
        case 'move':      playTone(600, 0.08, 'sine', 0.2); break;
        case 'capture':   playTone(200, 0.15, 'triangle', 0.35); break;
        case 'check':     playTone(800, 0.15, 'square', 0.35); setTimeout(() => playTone(1000, 0.2, 'square', 0.35), 150); break;
        case 'castle':    playTone(500, 0.1, 'sine', 0.25); setTimeout(() => playTone(700, 0.1, 'sine', 0.25), 100); break;
        case 'game-over': playTone(400, 0.3, 'triangle', 0.4); setTimeout(() => playTone(300, 0.3, 'triangle', 0.4), 300); setTimeout(() => playTone(200, 0.5, 'triangle', 0.4), 600); break;
        case 'promote':   playTone(900, 0.2, 'sine', 0.3); break;
    }
}

/* ============================================================
   FEN UTILITIES
   ============================================================ */
const INITIAL_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

function isValidFEN(fen) {
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
    const parts = fen.trim().split(/\s+/);
    const pieceMap = { k: 'king', q: 'queen', r: 'rook', b: 'bishop', n: 'knight', p: 'pawn' };
    const board = [];
    const ranks = parts[0].split('/');
    for (let r = 0; r < 8; r++) {
        const row = [];
        for (const ch of ranks[r]) {
            if (ch >= '1' && ch <= '8') {
                for (let i = 0; i < parseInt(ch, 10); i++) row.push(null);
            } else {
                const color = ch === ch.toUpperCase() ? 'white' : 'black';
                row.push({ type: pieceMap[ch.toLowerCase()], color });
            }
        }
        board.push(row);
    }
    const castling = parts[2] || 'KQkq';
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

function exportFEN(s) {
    let fen = '';
    const map = { king: 'k', queen: 'q', rook: 'r', bishop: 'b', knight: 'n', pawn: 'p' };
    for (let r = 0; r < 8; r++) {
        let empty = 0;
        for (let c = 0; c < 8; c++) {
            const p = s.board[r][c];
            if (!p) { empty++; continue; }
            if (empty > 0) { fen += empty; empty = 0; }
            const ch = map[p.type];
            fen += p.color === 'white' ? ch.toUpperCase() : ch;
        }
        if (empty > 0) fen += empty;
        if (r < 7) fen += '/';
    }
    fen += ' ' + (s.currentPlayer === 'white' ? 'w' : 'b');
    let cr = '';
    if (s.castlingRights.whiteKingSide) cr += 'K';
    if (s.castlingRights.whiteQueenSide) cr += 'Q';
    if (s.castlingRights.blackKingSide) cr += 'k';
    if (s.castlingRights.blackQueenSide) cr += 'q';
    fen += ' ' + (cr || '-');
    fen += ' ' + (s.enPassantTarget || '-');
    fen += ' ' + s.halfmoveClock + ' ' + s.fullmoveNumber;
    return fen;
}

/* ============================================================
   GAME STATE
   ============================================================ */
const gameState = {
    board: [], currentPlayer: 'white', selectedSquare: null, legalMoves: [],
    moveHistory: [], capturedPieces: { white: [], black: [] },
    castlingRights: { whiteKingSide: true, whiteQueenSide: true, blackKingSide: true, blackQueenSide: true },
    enPassantTarget: null, halfmoveClock: 0, fullmoveNumber: 1,
    lastMove: null, isCheck: false, isCheckmate: false, isStalemate: false,
    gameOver: false, gameResult: null
};

let boardOrientation = STORAGE.get('orientation', 'white');
let redoStack = [];
let gameMode = STORAGE.get('mode', 'pvp');
let playerColor = STORAGE.get('playerColor', 'white');
let aiDifficulty = STORAGE.get('difficulty', 'medium');
let timerMode = STORAGE.get('timerMode', { initial: 600, increment: 0 });
let timers = { white: timerMode.initial, black: timerMode.initial };
let timerInterval = null;
let aiTimeoutId = null;
let showCoordinates = STORAGE.get('coords', true);
let aiThinking = false;

const boardEl = document.getElementById('board');

/* ============================================================
   THEME
   ============================================================ */
function applyTheme(theme) {
    if (theme === 'system') {
        const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    } else {
        document.documentElement.setAttribute('data-theme', theme);
    }
    STORAGE.set('theme', theme);
    const sel = document.getElementById('setTheme');
    if (sel) sel.value = theme;
}

function applyBoardTheme(theme) {
    document.documentElement.setAttribute('data-board-theme', theme);
    STORAGE.set('boardTheme', theme);
    const s1 = document.getElementById('setBoardTheme');
    if (s1) s1.value = theme;
    const s2 = document.getElementById('ngBoardTheme');
    if (s2) s2.value = theme;
}

function initTheme() {
    applyTheme(STORAGE.get('theme', 'system'));
    applyBoardTheme(STORAGE.get('boardTheme', 'classic'));
    try {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            if (STORAGE.get('theme', 'system') === 'system') applyTheme('system');
        });
    } catch { /* older browsers */ }
}

/* ============================================================
   MOVE GENERATION
   ============================================================ */
function cloneBoard(b) { return b.map(row => row.map(c => c ? { ...c } : null)); }

function getPieceAt(b, r, c) {
    if (r < 0 || r > 7 || c < 0 || c > 7) return undefined;
    return b[r][c];
}

function isSquareAttackedBy(b, row, col, enemy) {
    const knights = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
    for (const [dr, dc] of knights) {
        const p = getPieceAt(b, row + dr, col + dc);
        if (p && p.color === enemy && p.type === 'knight') return true;
    }
    const kings = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
    for (const [dr, dc] of kings) {
        const p = getPieceAt(b, row + dr, col + dc);
        if (p && p.color === enemy && p.type === 'king') return true;
    }
    const pd = enemy === 'white' ? -1 : 1;
    for (const dc of [-1, 1]) {
        const p = getPieceAt(b, row + pd, col + dc);
        if (p && p.color === enemy && p.type === 'pawn') return true;
    }
    const dirs = [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[-1,1],[1,-1],[1,1]];
    for (const [dr, dc] of dirs) {
        let r = row + dr, c = col + dc;
        while (r >= 0 && r < 8 && c >= 0 && c < 8) {
            const p = b[r][c];
            if (p) {
                if (p.color === enemy) {
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

function findKing(b, color) {
    for (let r = 0; r < 8; r++)
        for (let c = 0; c < 8; c++) {
            const p = b[r][c];
            if (p && p.type === 'king' && p.color === color) return { row: r, col: c };
        }
    return null;
}

function isKingInCheck(b, color) {
    const k = findKing(b, color);
    if (!k) return true;
    const enemy = color === 'white' ? 'black' : 'white';
    return isSquareAttackedBy(b, k.row, k.col, enemy);
}

function getPseudoMoves(b, row, col, cr, ep) {
    const piece = b[row][col];
    if (!piece) return [];
    const moves = [];
    const color = piece.color;
    const enemy = color === 'white' ? 'black' : 'white';
    const type = piece.type;

    function addMove(tr, tc, special = null) {
        if (tr >= 0 && tr < 8 && tc >= 0 && tc < 8) {
            const target = b[tr][tc];
            if (!target || target.color === enemy) {
                moves.push({ fromRow: row, fromCol: col, toRow: tr, toCol: tc, piece, captured: target, special });
            }
        }
    }
    function slide(dr, dc) {
        let r = row + dr, c = col + dc;
        while (r >= 0 && r < 8 && c >= 0 && c < 8) {
            const t = b[r][c];
            if (t) {
                if (t.color === enemy) moves.push({ fromRow: row, fromCol: col, toRow: r, toCol: c, piece, captured: t, special: null });
                break;
            }
            moves.push({ fromRow: row, fromCol: col, toRow: r, toCol: c, piece, captured: null, special: null });
            r += dr; c += dc;
        }
    }

    switch (type) {
        case 'pawn': {
            const dir = color === 'white' ? -1 : 1;
            const startRow = color === 'white' ? 6 : 1;
            if (!getPieceAt(b, row + dir, col)) {
                addMove(row + dir, col);
                if (row === startRow && !getPieceAt(b, row + 2 * dir, col)) addMove(row + 2 * dir, col, 'double-push');
            }
            for (const dc of [-1, 1]) {
                const tr = row + dir, tc = col + dc;
                if (tr >= 0 && tr < 8 && tc >= 0 && tc < 8) {
                    const t = b[tr][tc];
                    if (t && t.color === enemy) addMove(tr, tc);
                }
            }
            if (ep) {
                const epCol = ep.charCodeAt(0) - 97;
                const epRow = 8 - parseInt(ep[1], 10);
                if (row + dir === epRow && Math.abs(col - epCol) === 1) {
                    moves.push({ fromRow: row, fromCol: col, toRow: epRow, toCol: epCol, piece, captured: getPieceAt(b, epRow - dir, epCol), special: 'en-passant' });
                }
            }
            break;
        }
        case 'knight':
            for (const [dr, dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]) addMove(row + dr, col + dc);
            break;
        case 'bishop':
            for (const [dr, dc] of [[-1,-1],[-1,1],[1,-1],[1,1]]) slide(dr, dc);
            break;
        case 'rook':
            for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]) slide(dr, dc);
            break;
        case 'queen':
            for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[-1,1],[1,-1],[1,1]]) slide(dr, dc);
            break;
        case 'king': {
            for (const [dr, dc] of [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]) addMove(row + dr, col + dc);
            if (color === 'white' && row === 7 && col === 4) {
                if (cr.whiteKingSide && !b[7][5] && !b[7][6] &&
                    !isSquareAttackedBy(b, 7, 4, enemy) && !isSquareAttackedBy(b, 7, 5, enemy) && !isSquareAttackedBy(b, 7, 6, enemy) &&
                    b[7][7]?.type === 'rook' && b[7][7]?.color === 'white') {
                    moves.push({ fromRow: 7, fromCol: 4, toRow: 7, toCol: 6, piece, captured: null, special: 'kingside-castle' });
                }
                if (cr.whiteQueenSide && !b[7][1] && !b[7][2] && !b[7][3] &&
                    !isSquareAttackedBy(b, 7, 4, enemy) && !isSquareAttackedBy(b, 7, 3, enemy) && !isSquareAttackedBy(b, 7, 2, enemy) &&
                    b[7][0]?.type === 'rook' && b[7][0]?.color === 'white') {
                    moves.push({ fromRow: 7, fromCol: 4, toRow: 7, toCol: 2, piece, captured: null, special: 'queenside-castle' });
                }
            }
            if (color === 'black' && row === 0 && col === 4) {
                if (cr.blackKingSide && !b[0][5] && !b[0][6] &&
                    !isSquareAttackedBy(b, 0, 4, enemy) && !isSquareAttackedBy(b, 0, 5, enemy) && !isSquareAttackedBy(b, 0, 6, enemy) &&
                    b[0][7]?.type === 'rook' && b[0][7]?.color === 'black') {
                    moves.push({ fromRow: 0, fromCol: 4, toRow: 0, toCol: 6, piece, captured: null, special: 'kingside-castle' });
                }
                if (cr.blackQueenSide && !b[0][1] && !b[0][2] && !b[0][3] &&
                    !isSquareAttackedBy(b, 0, 4, enemy) && !isSquareAttackedBy(b, 0, 3, enemy) && !isSquareAttackedBy(b, 0, 2, enemy) &&
                    b[0][0]?.type === 'rook' && b[0][0]?.color === 'black') {
                    moves.push({ fromRow: 0, fromCol: 4, toRow: 0, toCol: 2, piece, captured: null, special: 'queenside-castle' });
                }
            }
            break;
        }
    }
    return moves;
}

function getLegalMoves(b, row, col, cr, ep) {
    const pseudo = getPseudoMoves(b, row, col, cr, ep);
    const piece = b[row][col];
    if (!piece) return [];
    const legal = [];
    for (const m of pseudo) {
        const nb = cloneBoard(b);
        nb[m.toRow][m.toCol] = nb[m.fromRow][m.fromCol];
        nb[m.fromRow][m.fromCol] = null;
        if (m.special === 'en-passant') {
            const cr2 = piece.color === 'white' ? m.toRow + 1 : m.toRow - 1;
            nb[cr2][m.toCol] = null;
        }
        if (m.special === 'kingside-castle') { nb[m.toRow][5] = nb[m.toRow][7]; nb[m.toRow][7] = null; }
        if (m.special === 'queenside-castle') { nb[m.toRow][3] = nb[m.toRow][0]; nb[m.toRow][0] = null; }
        if (!isKingInCheck(nb, piece.color)) legal.push(m);
    }
    return legal;
}

function getAllLegalMoves(b, color, cr, ep) {
    const all = [];
    for (let r = 0; r < 8; r++)
        for (let c = 0; c < 8; c++) {
            const p = b[r][c];
            if (p && p.color === color) all.push(...getLegalMoves(b, r, c, cr, ep));
        }
    return all;
}

function updateCheckStatus() {
    gameState.isCheck = isKingInCheck(gameState.board, gameState.currentPlayer);
    const all = getAllLegalMoves(gameState.board, gameState.currentPlayer, gameState.castlingRights, gameState.enPassantTarget);
    if (all.length === 0) {
        if (gameState.isCheck) {
            gameState.isCheckmate = true;
            gameState.gameOver = true;
            gameState.gameResult = gameState.currentPlayer === 'white' ? 'black' : 'white';
        } else {
            gameState.isStalemate = true;
            gameState.gameOver = true;
            gameState.gameResult = 'draw';
        }
    } else {
        gameState.isCheckmate = false;
        gameState.isStalemate = false;
    }
}

/* ============================================================
   MOVE EXECUTION
   ============================================================ */
function algebraicNotation(move) {
    const files = 'abcdefgh';
    const ranks = '87654321';
    const ff = files[move.fromCol];
    const tf = files[move.toCol];
    const tr = ranks[move.toRow];
    const piece = move.piece;

    if (move.special === 'kingside-castle') return 'O-O';
    if (move.special === 'queenside-castle') return 'O-O-O';

    let n = '';
    if (piece.type === 'pawn') {
        if (move.captured || move.special === 'en-passant') n = ff + 'x' + tf + tr;
        else n = tf + tr;
    } else {
        const map = { king: 'K', queen: 'Q', rook: 'R', bishop: 'B', knight: 'N' };
        n = map[piece.type];
        if (move.captured) n += 'x';
        n += tf + tr;
    }
    if (move.special === 'en-passant') n += ' e.p.';
    return n;
}

function executeMove(move, record = true) {
    const b = gameState.board;
    const piece = b[move.fromRow][move.fromCol];
    const captured = b[move.toRow][move.toCol] || (move.special === 'en-passant' ? b[move.fromRow][move.toCol] : null);

    if (captured) {
        gameState.capturedPieces[captured.color].push(captured);
        gameState.halfmoveClock = 0;
    } else if (piece.type === 'pawn') {
        gameState.halfmoveClock = 0;
    } else {
        gameState.halfmoveClock++;
    }

    b[move.toRow][move.toCol] = piece;
    b[move.fromRow][move.fromCol] = null;

    if (move.special === 'en-passant') {
        const cr = piece.color === 'white' ? move.toRow + 1 : move.toRow - 1;
        const ep = b[cr][move.toCol];
        if (ep) gameState.capturedPieces[ep.color].push(ep);
        b[cr][move.toCol] = null;
    }
    if (move.special === 'kingside-castle') { b[move.toRow][5] = b[move.toRow][7]; b[move.toRow][7] = null; }
    if (move.special === 'queenside-castle') { b[move.toRow][3] = b[move.toRow][0]; b[move.toRow][0] = null; }

    if (move.special === 'double-push') {
        const epRow = piece.color === 'white' ? move.toRow + 1 : move.toRow - 1;
        gameState.enPassantTarget = 'abcdefgh'[move.toCol] + (8 - epRow);
    } else {
        gameState.enPassantTarget = null;
    }

    if (piece.type === 'king') {
        if (piece.color === 'white') gameState.castlingRights.whiteKingSide = gameState.castlingRights.whiteQueenSide = false;
        else gameState.castlingRights.blackKingSide = gameState.castlingRights.blackQueenSide = false;
    }
    if (piece.type === 'rook') {
        if (move.fromRow === 7 && move.fromCol === 0) gameState.castlingRights.whiteQueenSide = false;
        if (move.fromRow === 7 && move.fromCol === 7) gameState.castlingRights.whiteKingSide = false;
        if (move.fromRow === 0 && move.fromCol === 0) gameState.castlingRights.blackQueenSide = false;
        if (move.fromRow === 0 && move.fromCol === 7) gameState.castlingRights.blackKingSide = false;
    }
    if (captured && captured.type === 'rook') {
        if (move.toRow === 7 && move.toCol === 0) gameState.castlingRights.whiteQueenSide = false;
        if (move.toRow === 7 && move.toCol === 7) gameState.castlingRights.whiteKingSide = false;
        if (move.toRow === 0 && move.toCol === 0) gameState.castlingRights.blackQueenSide = false;
        if (move.toRow === 0 && move.toCol === 7) gameState.castlingRights.blackKingSide = false;
    }

    gameState.lastMove = { fromRow: move.fromRow, fromCol: move.fromCol, toRow: move.toRow, toCol: move.toCol };
    if (gameState.currentPlayer === 'black') gameState.fullmoveNumber++;
    gameState.currentPlayer = gameState.currentPlayer === 'white' ? 'black' : 'white';

    if (record) {
        gameState.moveHistory.push({ ...move, notation: algebraicNotation(move) });
        redoStack = [];
    }

    if (piece.type === 'pawn' && (move.toRow === 0 || move.toRow === 7)) {
        return { needsPromotion: true, move };
    }

    updateCheckStatus();
    updateGameStatus();
    return { needsPromotion: false, move };
}

function promotePawn(move, type) {
    gameState.board[move.toRow][move.toCol] = { type, color: move.piece.color };
    updateCheckStatus();
    updateGameStatus();
    playSound('promote');
}

/* ============================================================
   AI
   ============================================================ */
const VALUES = { pawn: 100, knight: 320, bishop: 330, rook: 500, queen: 900, king: 20000 };

function evaluateBoard(b) {
    let s = 0;
    for (let r = 0; r < 8; r++)
        for (let c = 0; c < 8; c++) {
            const p = b[r][c];
            if (p) s += (p.color === 'white' ? 1 : -1) * (VALUES[p.type] || 0);
        }
    return s;
}

function simulateMove(state, move) {
    const nb = cloneBoard(state.board);
    const piece = nb[move.fromRow][move.fromCol];
    nb[move.toRow][move.toCol] = piece;
    nb[move.fromRow][move.fromCol] = null;

    let newEp = null;
    if (move.special === 'double-push') {
        const epRow = piece.color === 'white' ? move.toRow + 1 : move.toRow - 1;
        newEp = 'abcdefgh'[move.toCol] + (8 - epRow);
    }
    if (move.special === 'en-passant') {
        const cr = piece.color === 'white' ? move.toRow + 1 : move.toRow - 1;
        nb[cr][move.toCol] = null;
    }
    if (move.special === 'kingside-castle') { nb[move.toRow][5] = nb[move.toRow][7]; nb[move.toRow][7] = null; }
    if (move.special === 'queenside-castle') { nb[move.toRow][3] = nb[move.toRow][0]; nb[move.toRow][0] = null; }

    const newCR = { ...state.castlingRights };
    if (piece.type === 'king') {
        if (piece.color === 'white') newCR.whiteKingSide = newCR.whiteQueenSide = false;
        else newCR.blackKingSide = newCR.blackQueenSide = false;
    }
    if (piece.type === 'rook') {
        if (move.fromRow === 7 && move.fromCol === 0) newCR.whiteQueenSide = false;
        if (move.fromRow === 7 && move.fromCol === 7) newCR.whiteKingSide = false;
        if (move.fromRow === 0 && move.fromCol === 0) newCR.blackQueenSide = false;
        if (move.fromRow === 0 && move.fromCol === 7) newCR.blackKingSide = false;
    }

    return {
        board: nb,
        castlingRights: newCR,
        currentPlayer: state.currentPlayer === 'white' ? 'black' : 'white',
        enPassantTarget: newEp
    };
}

function minimax(state, depth, alpha, beta, isMax) {
    if (depth === 0) return evaluateBoard(state.board);
    const color = state.currentPlayer;
    const all = getAllLegalMoves(state.board, color, state.castlingRights, state.enPassantTarget);
    if (all.length === 0) {
        if (isKingInCheck(state.board, color)) return isMax ? -99999 : 99999;
        return 0;
    }
    if (isMax) {
        let best = -Infinity;
        for (const m of all) {
            const ns = simulateMove(state, m);
            const score = minimax(ns, depth - 1, alpha, beta, false);
            if (score > best) best = score;
            if (score > alpha) alpha = score;
            if (beta <= alpha) break;
        }
        return best;
    } else {
        let best = Infinity;
        for (const m of all) {
            const ns = simulateMove(state, m);
            const score = minimax(ns, depth - 1, alpha, beta, true);
            if (score < best) best = score;
            if (score < beta) beta = score;
            if (beta <= alpha) break;
        }
        return best;
    }
}

function chooseAIMove() {
    const color = gameState.currentPlayer;
    const all = getAllLegalMoves(gameState.board, color, gameState.castlingRights, gameState.enPassantTarget);
    if (all.length === 0) return null;

    if (aiDifficulty === 'easy') return all[Math.floor(Math.random() * all.length)];

    const depth = aiDifficulty === 'hard' ? 3 : 2;
    const isMax = color === 'white';
    let bestMove = all[0];
    let bestScore = isMax ? -Infinity : Infinity;

    for (let i = all.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [all[i], all[j]] = [all[j], all[i]];
    }

    for (const m of all) {
        const ns = simulateMove(gameState, m);
        const score = minimax(ns, depth - 1, -Infinity, Infinity, !isMax);
        if (isMax ? score > bestScore : score < bestScore) {
            bestScore = score;
            bestMove = m;
        }
    }
    return bestMove;
}

function makeComputerMove() {
    aiTimeoutId = null;
    if (gameState.gameOver) { aiThinking = false; updatePlayerStatusUI(); return; }
    const move = chooseAIMove();
    if (!move) { aiThinking = false; updatePlayerStatusUI(); return; }
    aiThinking = false;
    const result = executeMove(move);
    if (result.needsPromotion) promotePawn(result.move, 'queen');
    finalizeMove();
}

function scheduleAIMove() {
    if (gameMode !== 'pvc' || gameState.currentPlayer === playerColor) return;
    if (gameState.gameOver) return;
    aiThinking = true;
    updatePlayerStatusUI();
    renderBoard();
    if (aiTimeoutId) clearTimeout(aiTimeoutId);
    aiTimeoutId = setTimeout(makeComputerMove, 350);
}

/* ============================================================
   TIMERS
   ============================================================ */
function startTimer() {
    stopTimer();
    if (timerMode.initial === 0) return;
    timerInterval = setInterval(() => {
        if (gameState.gameOver) { stopTimer(); return; }
        const active = gameState.currentPlayer;
        timers[active]--;
        if (timers[active] <= 0) {
            timers[active] = 0;
            gameState.gameOver = true;
            gameState.gameResult = active === 'white' ? 'black' : 'white';
            updateTimerUI();
            stopTimer();
            handleGameOver();
        } else updateTimerUI();
    }, 1000);
}
function stopTimer() { if (timerInterval) { clearInterval(timerInterval); timerInterval = null; } }
function resetTimers() {
    timers.white = timerMode.initial;
    timers.black = timerMode.initial;
    updateTimerUI();
    stopTimer();
    if (timerMode.initial > 0) startTimer();
}
function formatTime(s) {
    if (s <= 0) return '00:00';
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}
function updateTimerUI() {
    const w = document.getElementById('whiteTimer');
    const b = document.getElementById('blackTimer');
    if (w) { w.textContent = formatTime(timers.white); w.classList.toggle('low-time', timerMode.initial > 0 && timers.white <= 30 && timers.white > 0); }
    if (b) { b.textContent = formatTime(timers.black); b.classList.toggle('low-time', timerMode.initial > 0 && timers.black <= 30 && timers.black > 0); }
}

/* ============================================================
   RENDER
   ============================================================ */
function renderBoard() {
    if (!boardEl) return;
    boardEl.innerHTML = '';
    const flipped = boardOrientation === 'black';

    for (let dr = 0; dr < 8; dr++) {
        for (let dc = 0; dc < 8; dc++) {
            const ar = flipped ? 7 - dr : dr;
            const ac = flipped ? 7 - dc : dc;
            const isLight = (ar + ac) % 2 === 0;
            const sq = document.createElement('div');
            sq.className = 'square ' + (isLight ? 'light' : 'dark');
            sq.dataset.row = ar;
            sq.dataset.col = ac;
            sq.setAttribute('role', 'gridcell');

            if (gameState.selectedSquare && gameState.selectedSquare.row === ar && gameState.selectedSquare.col === ac) {
                sq.classList.add('selected');
            }
            if (gameState.lastMove) {
                if ((gameState.lastMove.fromRow === ar && gameState.lastMove.fromCol === ac) ||
                    (gameState.lastMove.toRow === ar && gameState.lastMove.toCol === ac)) {
                    sq.classList.add('last-move');
                }
            }
            if (gameState.isCheck) {
                const k = findKing(gameState.board, gameState.currentPlayer);
                if (k && k.row === ar && k.col === ac) sq.classList.add('in-check');
            }
            for (const m of gameState.legalMoves) {
                if (m.toRow === ar && m.toCol === ac) {
                    sq.classList.add((m.captured || m.special === 'en-passant') ? 'capture-move' : 'legal-move');
                    break;
                }
            }

            if (showCoordinates) {
                if (ac === (flipped ? 7 : 0)) {
                    const rl = document.createElement('span');
                    rl.className = 'coord-label coord-rank';
                    rl.textContent = 8 - ar;
                    sq.appendChild(rl);
                }
                if (ar === (flipped ? 0 : 7)) {
                    const fl = document.createElement('span');
                    fl.className = 'coord-label coord-file';
                    fl.textContent = 'abcdefgh'[ac];
                    sq.appendChild(fl);
                }
            }

            const piece = gameState.board[ar][ac];
            if (piece) {
                const img = document.createElement('img');
                img.className = 'piece-img';
                img.src = SVG[piece.color][piece.type];
                img.alt = `${piece.color} ${piece.type}`;
                img.draggable = !gameState.gameOver && !aiThinking;
                img.dataset.row = ar;
                img.dataset.col = ac;
                img.addEventListener('dragstart', handleDragStart);
                img.addEventListener('dragend', handleDragEnd);
                sq.appendChild(img);
            }

            sq.addEventListener('click', () => handleSquareClick(ar, ac));
            sq.addEventListener('dragover', (e) => { e.preventDefault(); sq.classList.add('drag-over'); });
            sq.addEventListener('dragleave', () => sq.classList.remove('drag-over'));
            sq.addEventListener('drop', (e) => { e.preventDefault(); sq.classList.remove('drag-over'); handleDrop(ar, ac); });

            boardEl.appendChild(sq);
        }
    }
    updatePlayerStatusUI();
}

function refreshHighlights() {
    if (!boardEl) return;
    const sel = gameState.selectedSquare;
    const last = gameState.lastMove;
    const k = gameState.isCheck ? findKing(gameState.board, gameState.currentPlayer) : null;
    boardEl.querySelectorAll('.square').forEach(sq => {
        const r = +sq.dataset.row, c = +sq.dataset.col;
        sq.classList.toggle('selected', !!sel && sel.row === r && sel.col === c);
        sq.classList.toggle('last-move', !!last && ((last.fromRow === r && last.fromCol === c) || (last.toRow === r && last.toCol === c)));
        sq.classList.toggle('in-check', !!k && k.row === r && k.col === c);
        let match = null;
        for (const m of gameState.legalMoves) if (m.toRow === r && m.toCol === c) { match = m; break; }
        sq.classList.toggle('legal-move', !!match && !match.captured && match.special !== 'en-passant');
        sq.classList.toggle('capture-move', !!match && (!!match.captured || match.special === 'en-passant'));
    });
}

/* ============================================================
   INTERACTION
   ============================================================ */
let dragData = null;
let suppressClick = false;
let isProcessing = false;

function handleSquareClick(row, col) {
    if (suppressClick || gameState.gameOver || aiThinking || isProcessing) return;
    if (gameMode === 'pvc' && gameState.currentPlayer !== playerColor) return;

    isProcessing = true;
    try {
        const piece = gameState.board[row][col];

        if (gameState.selectedSquare) {
            const sel = gameState.selectedSquare;
            if (sel.row === row && sel.col === col) {
                gameState.selectedSquare = null;
                gameState.legalMoves = [];
                renderBoard();
                return;
            }
            const legal = getLegalMoves(gameState.board, sel.row, sel.col, gameState.castlingRights, gameState.enPassantTarget);
            const target = legal.find(m => m.toRow === row && m.toCol === col);
            if (target) {
                gameState.selectedSquare = null;
                gameState.legalMoves = [];
                handleMove(target);
                return;
            }
            if (piece && piece.color === gameState.currentPlayer) {
                gameState.selectedSquare = { row, col };
                gameState.legalMoves = getLegalMoves(gameState.board, row, col, gameState.castlingRights, gameState.enPassantTarget);
                renderBoard();
                return;
            }
            gameState.selectedSquare = null;
            gameState.legalMoves = [];
            renderBoard();
        } else {
            if (piece && piece.color === gameState.currentPlayer) {
                gameState.selectedSquare = { row, col };
                gameState.legalMoves = getLegalMoves(gameState.board, row, col, gameState.castlingRights, gameState.enPassantTarget);
                renderBoard();
            }
        }
    } finally {
        requestAnimationFrame(() => { isProcessing = false; });
    }
}

function handleDragStart(e) {
    if (gameState.gameOver || aiThinking) { e.preventDefault(); return; }
    if (gameMode === 'pvc' && gameState.currentPlayer !== playerColor) { e.preventDefault(); return; }
    const row = parseInt(e.target.dataset.row, 10);
    const col = parseInt(e.target.dataset.col, 10);
    const piece = gameState.board[row][col];
    if (!piece || piece.color !== gameState.currentPlayer) { e.preventDefault(); return; }
    dragData = { row, col, piece };
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    try { e.dataTransfer.setData('text/plain', `${row},${col}`); } catch { /* noop */ }
    gameState.selectedSquare = { row, col };
    gameState.legalMoves = getLegalMoves(gameState.board, row, col, gameState.castlingRights, gameState.enPassantTarget);
    refreshHighlights();
}

function handleDragEnd(e) {
    if (e.target) e.target.classList.remove('dragging');
    dragData = null;
    document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
    if (!gameState.gameOver && gameState.selectedSquare) {
        gameState.selectedSquare = null;
        gameState.legalMoves = [];
        refreshHighlights();
    }
}

function handleDrop(toRow, toCol) {
    if (!dragData) return;
    const legal = getLegalMoves(gameState.board, dragData.row, dragData.col, gameState.castlingRights, gameState.enPassantTarget);
    const target = legal.find(m => m.toRow === toRow && m.toCol === toCol);
    dragData = null;
    if (target) {
        gameState.selectedSquare = null;
        gameState.legalMoves = [];
        handleMove(target);
    } else {
        gameState.selectedSquare = null;
        gameState.legalMoves = [];
        refreshHighlights();
    }
}

let touchState = null;
function onTouchStart(e) {
    if (gameState.gameOver || aiThinking) return;
    if (gameMode === 'pvc' && gameState.currentPlayer !== playerColor) return;
    const img = e.target.closest('.piece-img');
    if (!img) return;
    const row = +img.dataset.row;
    const col = +img.dataset.col;
    const piece = gameState.board[row][col];
    if (!piece || piece.color !== gameState.currentPlayer) return;
    const t = e.touches[0];
    touchState = { row, col, startX: t.clientX, startY: t.clientY, moved: false };
}
function onTouchMove(e) {
    if (!touchState) return;
    const t = e.touches[0];
    const dx = t.clientX - touchState.startX;
    const dy = t.clientY - touchState.startY;
    if (!touchState.moved && Math.hypot(dx, dy) > 8) {
        touchState.moved = true;
        gameState.selectedSquare = { row: touchState.row, col: touchState.col };
        gameState.legalMoves = getLegalMoves(gameState.board, touchState.row, touchState.col, gameState.castlingRights, gameState.enPassantTarget);
        renderBoard();
    }
    if (touchState.moved) {
        e.preventDefault();
        const el = document.elementFromPoint(t.clientX, t.clientY);
        const sq = el?.closest('.square');
        document.querySelectorAll('.square.drag-over').forEach(s => s.classList.remove('drag-over'));
        if (sq && sq !== boardEl) sq.classList.add('drag-over');
    }
}
function onTouchEnd(e) {
    if (!touchState) return;
    const state = touchState;
    touchState = null;
    document.querySelectorAll('.square.drag-over').forEach(s => s.classList.remove('drag-over'));
    if (!state.moved) return;
    suppressClick = true;
    setTimeout(() => { suppressClick = false; }, 100);
    const t = e.changedTouches[0];
    const el = document.elementFromPoint(t.clientX, t.clientY);
    const sq = el?.closest('.square');
    if (sq) {
        const toRow = +sq.dataset.row;
        const toCol = +sq.dataset.col;
        const legal = getLegalMoves(gameState.board, state.row, state.col, gameState.castlingRights, gameState.enPassantTarget);
        const move = legal.find(m => m.toRow === toRow && m.toCol === toCol);
        if (move) {
            gameState.selectedSquare = null;
            gameState.legalMoves = [];
            handleMove(move);
            return;
        }
    }
    gameState.selectedSquare = null;
    gameState.legalMoves = [];
    renderBoard();
}

if (boardEl) {
    boardEl.addEventListener('touchstart', onTouchStart, { passive: true });
    boardEl.addEventListener('touchmove', onTouchMove, { passive: false });
    boardEl.addEventListener('touchend', onTouchEnd);
    boardEl.addEventListener('touchcancel', () => {
        touchState = null;
        document.querySelectorAll('.square.drag-over').forEach(s => s.classList.remove('drag-over'));
    });
}

/* ============================================================
   MOVE FLOW
   ============================================================ */
function handleMove(move) {
    const r = executeMove(move);
    if (r.needsPromotion) { showPromotionModal(r.move); return; }
    finalizeMove();
}

function finalizeMove() {
    const mover = gameState.currentPlayer === 'white' ? 'black' : 'white';
    if (timerMode.increment > 0 && !gameState.gameOver) timers[mover] += timerMode.increment;

    renderBoard();
    updateMoveHistoryUI();
    updateCapturedUI();
    updatePlayerStatusUI();
    updateTimerUI();

    if (gameState.gameOver) { stopTimer(); handleGameOver(); return; }

    if (gameState.isCheck) playSound('check');
    else if (gameState.moveHistory.length > 0) {
        const lm = gameState.moveHistory[gameState.moveHistory.length - 1];
        if (lm.special === 'kingside-castle' || lm.special === 'queenside-castle') playSound('castle');
        else if (lm.captured || lm.special === 'en-passant') playSound('capture');
        else playSound('move');
    }

    if (gameMode === 'pvc' && gameState.currentPlayer !== playerColor) scheduleAIMove();
}

function handleGameOver() {
    stopTimer();
    playSound('game-over');
    const result = gameState.gameResult;
    let title, message;
    if (result === 'draw') {
        title = 'Permainan Remis';
        message = gameState.isStalemate ? 'Stalemate — tidak ada langkah legal.' : 'Permainan berakhir draw.';
    } else {
        const winner = result === 'white' ? 'Putih' : 'Hitam';
        title = `${winner} Menang`;
        message = gameState.isCheckmate ? 'Checkmate!' : 'Waktu habis!';
    }
    showGameOverModal(title, message);
}

/* ============================================================
   GAME INIT
   ============================================================ */
function loadFromFEN(fen) {
    if (!isValidFEN(fen)) throw new Error('FEN tidak valid');
    const p = parseFEN(fen);
    gameState.board = p.board;
    gameState.currentPlayer = p.currentPlayer;
    gameState.castlingRights = p.castlingRights;
    gameState.enPassantTarget = p.enPassantTarget;
    gameState.halfmoveClock = p.halfmoveClock;
    gameState.fullmoveNumber = p.fullmoveNumber;
    gameState.selectedSquare = null;
    gameState.legalMoves = [];
    gameState.moveHistory = [];
    gameState.capturedPieces = { white: [], black: [] };
    gameState.lastMove = null;
    gameState.isCheck = false;
    gameState.isCheckmate = false;
    gameState.isStalemate = false;
    gameState.gameOver = false;
    gameState.gameResult = null;
    redoStack = [];
    updateCheckStatus();
    updateGameStatus();
    renderBoard();
    updateMoveHistoryUI();
    updateCapturedUI();
    updatePlayerStatusUI();
}

function resetGame() {
    stopTimer();
    if (aiTimeoutId) { clearTimeout(aiTimeoutId); aiTimeoutId = null; }
    aiThinking = false;
    loadFromFEN(INITIAL_FEN);
    resetTimers();
    if (gameMode === 'pvc' && gameState.currentPlayer !== playerColor) scheduleAIMove();
}

/* ============================================================
   UI UPDATES
   ============================================================ */
function updateGameStatus() {
    const s = document.getElementById('gameStatusText');
    const sub = document.getElementById('gameSubStatus');
    if (!s || !sub) return;
    if (gameState.gameOver) {
        if (gameState.isCheckmate) s.textContent = `${gameState.gameResult === 'white' ? 'Putih' : 'Hitam'} Menang - Checkmate!`;
        else if (gameState.isStalemate) s.textContent = 'Stalemate';
        else s.textContent = 'Game Over';
        sub.textContent = '';
    } else if (gameState.isCheck) {
        s.textContent = 'Check!';
        sub.textContent = `${gameState.currentPlayer === 'white' ? 'White' : 'Black'} harus melindungi raja`;
    } else {
        s.textContent = `${gameState.currentPlayer === 'white' ? 'White' : 'Black'} to move`;
        sub.textContent = '';
    }
}

function updatePlayerStatusUI() {
    const w = document.getElementById('whiteStatus');
    const b = document.getElementById('blackStatus');
    if (!w || !b) return;
    w.className = 'player-status';
    b.className = 'player-status';
    w.classList.toggle('active', gameState.currentPlayer === 'white' && !gameState.gameOver);
    b.classList.toggle('active', gameState.currentPlayer === 'black' && !gameState.gameOver);
    if (aiThinking && gameState.currentPlayer !== playerColor) {
        if (gameState.currentPlayer === 'white') w.textContent = 'Berpikir...';
        else b.textContent = 'Berpikir...';
        return;
    }
    if (gameMode === 'pvc') {
        const wIsPlayer = playerColor === 'white';
        w.textContent = gameState.currentPlayer === 'white' ? (wIsPlayer ? 'Giliran Anda' : 'Komputer') : 'Menunggu';
        b.textContent = gameState.currentPlayer === 'black' ? (!wIsPlayer ? 'Giliran Anda' : 'Komputer') : 'Menunggu';
    } else {
        w.textContent = gameState.currentPlayer === 'white' ? 'Giliran Anda' : 'Menunggu';
        b.textContent = gameState.currentPlayer === 'black' ? 'Giliran Anda' : 'Menunggu';
    }
}

function updateCapturedUI() {
    const w = document.getElementById('whiteCaptured');
    const b = document.getElementById('blackCaptured');
    if (!w || !b) return;
    w.innerHTML = '';
    b.innerHTML = '';
    gameState.capturedPieces.white.forEach(p => {
        const img = document.createElement('img');
        img.className = 'captured-piece';
        img.src = SVG[p.color][p.type];
        img.alt = p.type;
        w.appendChild(img);
    });
    gameState.capturedPieces.black.forEach(p => {
        const img = document.createElement('img');
        img.className = 'captured-piece';
        img.src = SVG[p.color][p.type];
        img.alt = p.type;
        b.appendChild(img);
    });
}

function updateMoveHistoryUI() {
    const el = document.getElementById('moveHistory');
    if (!el) return;
    el.innerHTML = '';
    for (let i = 0; i < gameState.moveHistory.length; i += 2) {
        const num = Math.floor(i / 2) + 1;
        const wm = gameState.moveHistory[i];
        const bm = gameState.moveHistory[i + 1];
        const row = document.createElement('div');
        row.className = 'move-row';
        const nc = document.createElement('span');
        nc.className = 'move-number';
        nc.textContent = num + '.';
        const wc = document.createElement('span');
        wc.className = 'move-white';
        wc.textContent = wm ? wm.notation : '';
        const bc = document.createElement('span');
        bc.className = 'move-black';
        bc.textContent = bm ? bm.notation : '';
        row.appendChild(nc);
        row.appendChild(wc);
        row.appendChild(bc);
        el.appendChild(row);
    }
    el.scrollTop = el.scrollHeight;
}

/* ============================================================
   PGN
   ============================================================ */
function buildPGN() {
    let pgn = '';
    for (let i = 0; i < gameState.moveHistory.length; i += 2) {
        const num = Math.floor(i / 2) + 1;
        const w = gameState.moveHistory[i]?.notation || '';
        const b = gameState.moveHistory[i + 1]?.notation || '';
        pgn += `${num}. ${w} ${b} `.trim() + '\n';
    }
    return pgn.trim();
}

function copyPGN() {
    const pgn = buildPGN();
    if (!pgn) { showToast('Belum ada langkah', 'info'); return; }
    if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(pgn).then(() => showToast('PGN disalin!', 'success')).catch(() => showToast('Gagal menyalin PGN', 'error'));
    } else showToast('Clipboard tidak didukung', 'error');
}

function downloadPGN() {
    const pgn = buildPGN();
    if (!pgn) { showToast('Belum ada langkah', 'info'); return; }
    try {
        const blob = new Blob([pgn], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'chess-game.pgn';
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch { showToast('Gagal mengunduh PGN', 'error'); }
}

/* ============================================================
   UNDO / REDO
   ============================================================ */
function undoMove() {
    if (gameState.moveHistory.length === 0) { showToast('Tidak ada langkah untuk di-undo', 'error'); return; }
    gameState.gameOver = false;
    gameState.gameResult = null;
    gameState.isCheckmate = false;
    gameState.isStalemate = false;
    const steps = (gameMode === 'pvc' && gameState.moveHistory.length >= 2) ? 2 : 1;
    const undone = [];
    for (let i = 0; i < steps; i++) if (gameState.moveHistory.length > 0) undone.push(gameState.moveHistory.pop());

    const history = [...gameState.moveHistory];
    const p = parseFEN(INITIAL_FEN);
    gameState.board = p.board;
    gameState.currentPlayer = p.currentPlayer;
    gameState.castlingRights = p.castlingRights;
    gameState.enPassantTarget = p.enPassantTarget;
    gameState.halfmoveClock = p.halfmoveClock;
    gameState.fullmoveNumber = p.fullmoveNumber;
    gameState.capturedPieces = { white: [], black: [] };
    gameState.lastMove = null;
    gameState.moveHistory = [];

    for (const m of history) {
        const pieceAt = gameState.board[m.fromRow][m.fromCol];
        if (!pieceAt) continue;
        executeMove({ fromRow: m.fromRow, fromCol: m.fromCol, toRow: m.toRow, toCol: m.toCol, piece: pieceAt, captured: m.captured, special: m.special }, true);
    }
    for (const u of undone) redoStack.push(u);

    updateCheckStatus();
    updateGameStatus();
    renderBoard();
    updateMoveHistoryUI();
    updateCapturedUI();
    updatePlayerStatusUI();
    updateTimerUI();
    showToast('Undo berhasil', 'success');
}

function redoMove() {
    if (redoStack.length === 0) { showToast('Tidak ada langkah untuk di-redo', 'error'); return; }
    const steps = (gameMode === 'pvc' && redoStack.length >= 2) ? 2 : 1;
    for (let i = 0; i < steps; i++) {
        if (redoStack.length === 0) break;
        const md = redoStack.pop();
        const pieceAt = gameState.board[md.fromRow][md.fromCol];
        if (!pieceAt) continue;
        const r = executeMove({ fromRow: md.fromRow, fromCol: md.fromCol, toRow: md.toRow, toCol: md.toCol, piece: pieceAt, captured: md.captured, special: md.special }, true);
        if (r.needsPromotion) promotePawn(r.move, 'queen');
    }
    finalizeMove();
    showToast('Redo berhasil', 'success');
}

/* ============================================================
   MODALS — simple class-based scroll lock
   ============================================================ */
function showModal(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('hidden');
    el.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
}

function hideModal(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.add('hidden');
    el.setAttribute('aria-hidden', 'true');
    if (!document.querySelector('.modal-overlay:not(.hidden)')) {
        document.body.classList.remove('modal-open');
    }
}

function showPromotionModal(move) {
    const modal = document.getElementById('promotionModal');
    const opts = document.getElementById('promotionOptions');
    if (!modal || !opts) return;
    opts.innerHTML = '';
    const color = move.piece.color;
    const pieces = ['queen', 'rook', 'bishop', 'knight'];
    for (const type of pieces) {
        const btn = document.createElement('div');
        btn.className = 'promotion-btn';
        btn.setAttribute('role', 'button');
        btn.setAttribute('tabindex', '0');
        btn.setAttribute('aria-label', `Promosi ke ${type}`);
        const img = document.createElement('img');
        img.src = SVG[color][type];
        img.alt = type;
        btn.appendChild(img);
        const choose = () => {
            promotePawn(move, type);
            hideModal('promotionModal');
            finalizeMove();
        };
        btn.addEventListener('click', choose);
        btn.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(); } });
        opts.appendChild(btn);
    }
    showModal('promotionModal');
    setTimeout(() => opts.firstElementChild?.focus(), 50);
}

function showGameOverModal(title, message) {
    const modal = document.getElementById('gameOverModal');
    const content = document.getElementById('gameOverContent');
    if (!modal || !content) return;
    content.innerHTML = `
        <h2>${title}</h2>
        <p>${message}</p>
        <div class="modal-buttons">
            <button class="btn accent" id="btnRematch">
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M17.65 6.35A8 8 0 1 0 19.73 14H17.65a6 6 0 1 1-1.42-6.23L13 11h8V3l-3.35 3.35Z"/></svg>
                <span>Rematch</span>
            </button>
            <button class="btn" id="btnCopyPGNGameOver">
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M16 1H6a2 2 0 0 0-2 2v12h2V3h10V1Zm3 4H10a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm0 16H10V7h9v14Z"/></svg>
                <span>Copy PGN</span>
            </button>
            <button class="btn" id="btnCloseGameOver">Tutup</button>
        </div>
    `;
    showModal('gameOverModal');
    document.getElementById('btnRematch')?.addEventListener('click', () => { hideModal('gameOverModal'); resetGame(); });
    document.getElementById('btnCopyPGNGameOver')?.addEventListener('click', copyPGN);
    document.getElementById('btnCloseGameOver')?.addEventListener('click', () => hideModal('gameOverModal'));
    setTimeout(() => document.getElementById('btnRematch')?.focus(), 50);
}

/* ============================================================
   TOAST
   ============================================================ */
function showToast(text, type = 'info') {
    const c = document.getElementById('toastContainer');
    if (!c) return;
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.textContent = text;
    c.appendChild(t);
    setTimeout(() => t.remove(), 2600);
}

/* ============================================================
   EVENT BINDINGS
   ============================================================ */
function bindEvents() {
    document.getElementById('btnFlip')?.addEventListener('click', () => {
        boardOrientation = boardOrientation === 'white' ? 'black' : 'white';
        STORAGE.set('orientation', boardOrientation);
        renderBoard();
    });

    document.getElementById('btnUndo')?.addEventListener('click', undoMove);
    document.getElementById('btnRedo')?.addEventListener('click', redoMove);

    document.getElementById('btnResign')?.addEventListener('click', () => {
        if (gameState.gameOver) return;
        if (!confirm('Yakin ingin menyerah?')) return;
        gameState.gameOver = true;
        gameState.gameResult = gameState.currentPlayer === 'white' ? 'black' : 'white';
        handleGameOver();
    });

    document.getElementById('btnDraw')?.addEventListener('click', () => {
        if (gameState.gameOver) return;
        if (confirm('Tawarkan/Terima remis?')) {
            gameState.gameOver = true;
            gameState.gameResult = 'draw';
            handleGameOver();
        }
    });

    document.getElementById('btnNewGame')?.addEventListener('click', () => {
        document.getElementById('ngMode').value = gameMode;
        document.getElementById('ngColor').value = playerColor;
        document.getElementById('ngDifficulty').value = aiDifficulty;
        document.getElementById('ngTimer').value = `${timerMode.initial / 60}|${timerMode.increment}`;
        document.getElementById('ngBoardTheme').value = STORAGE.get('boardTheme', 'classic');
        showModal('newGameModal');
    });

    document.getElementById('btnCancelNewGame')?.addEventListener('click', () => hideModal('newGameModal'));

    document.getElementById('btnStartGame')?.addEventListener('click', () => {
        gameMode = document.getElementById('ngMode')?.value || 'pvp';
        let color = document.getElementById('ngColor')?.value || 'white';
        if (color === 'random') color = Math.random() < 0.5 ? 'white' : 'black';
        playerColor = color;
        aiDifficulty = document.getElementById('ngDifficulty')?.value || 'medium';
        const tv = document.getElementById('ngTimer')?.value || '10|0';
        const [mins, inc] = tv.split('|').map(Number);
        timerMode = { initial: (mins || 0) * 60, increment: inc || 0 };
        applyBoardTheme(document.getElementById('ngBoardTheme')?.value || 'classic');
        STORAGE.set('mode', gameMode);
        STORAGE.set('playerColor', playerColor);
        STORAGE.set('difficulty', aiDifficulty);
        STORAGE.set('timerMode', timerMode);
        boardOrientation = playerColor;
        STORAGE.set('orientation', boardOrientation);
        hideModal('newGameModal');
        resetGame();
    });

    document.getElementById('btnCopyPGN')?.addEventListener('click', copyPGN);
    document.getElementById('btnDownloadPGN')?.addEventListener('click', downloadPGN);

    document.getElementById('btnTheme')?.addEventListener('click', () => {
        const cur = STORAGE.get('theme', 'system');
        let next;
        if (cur === 'system') next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        else next = cur === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        showToast(next === 'dark' ? 'Mode Gelap' : 'Mode Terang', 'info');
    });

    document.getElementById('btnSoundToggle')?.addEventListener('click', (e) => {
        soundEnabled = !soundEnabled;
        STORAGE.set('sound', soundEnabled);
        e.currentTarget.classList.toggle('active', soundEnabled);
        e.currentTarget.setAttribute('aria-pressed', String(soundEnabled));
        showToast(soundEnabled ? 'Suara Aktif' : 'Suara Nonaktif', 'info');
    });

    document.getElementById('btnImportFEN')?.addEventListener('click', () => {
        const fen = prompt('Masukkan FEN string:');
        if (!fen) return;
        const t = fen.trim();
        if (!isValidFEN(t)) { showToast('Format FEN tidak valid', 'error'); return; }
        try {
            stopTimer();
            loadFromFEN(t);
            resetTimers();
            showToast('FEN berhasil dimuat', 'success');
        } catch { showToast('Gagal memuat FEN', 'error'); }
    });

    document.getElementById('btnExportFEN')?.addEventListener('click', () => {
        const fen = exportFEN(gameState);
        if (navigator.clipboard?.writeText) {
            navigator.clipboard.writeText(fen).then(() => showToast('FEN disalin!', 'success')).catch(() => showToast('Gagal menyalin FEN', 'error'));
        } else prompt('FEN:', fen);
    });

    document.getElementById('btnSettings')?.addEventListener('click', () => {
        document.getElementById('setTheme').value = STORAGE.get('theme', 'system');
        document.getElementById('setBoardTheme').value = STORAGE.get('boardTheme', 'classic');
        document.getElementById('setSound').value = soundEnabled ? 'on' : 'off';
        document.getElementById('setCoords').value = showCoordinates ? 'on' : 'off';
        showModal('settingsModal');
    });

    document.getElementById('btnCloseSettings')?.addEventListener('click', () => hideModal('settingsModal'));

    document.getElementById('setTheme')?.addEventListener('change', (e) => applyTheme(e.target.value));
    document.getElementById('setBoardTheme')?.addEventListener('change', (e) => applyBoardTheme(e.target.value));

    document.getElementById('setSound')?.addEventListener('change', (e) => {
        soundEnabled = e.target.value === 'on';
        STORAGE.set('sound', soundEnabled);
        document.getElementById('btnSoundToggle')?.classList.toggle('active', soundEnabled);
    });

    document.getElementById('setCoords')?.addEventListener('change', (e) => {
        showCoordinates = e.target.value === 'on';
        STORAGE.set('coords', showCoordinates);
        renderBoard();
    });

    document.getElementById('btnResetProgress')?.addEventListener('click', () => {
        if (!confirm('Reset semua preferensi ke default?')) return;
        ['theme','boardTheme','sound','coords','orientation','mode','playerColor','difficulty','timerMode'].forEach(k => STORAGE.remove(k));
        showToast('Preferensi direset', 'success');
        setTimeout(() => location.reload(), 800);
    });

    document.querySelectorAll('[data-close]').forEach(btn => {
        btn.addEventListener('click', () => hideModal(btn.dataset.close));
    });

    document.querySelectorAll('.modal-overlay').forEach(o => {
        o.addEventListener('click', (e) => {
            if (e.target === o && o.id !== 'promotionModal' && o.id !== 'gameOverModal') hideModal(o.id);
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            ['newGameModal','settingsModal'].forEach(id => hideModal(id));
        }
    });
}

/* ============================================================
   CLEANUP
   ============================================================ */
window.addEventListener('beforeunload', () => {
    stopTimer();
    if (aiTimeoutId) clearTimeout(aiTimeoutId);
});

/* ============================================================
   BOOT
   ============================================================ */
function boot() {
    // Pastikan tidak ada modal yang tertinggal terbuka dari state sebelumnya
    document.querySelectorAll('.modal-overlay').forEach(m => {
        m.classList.add('hidden');
        m.setAttribute('aria-hidden', 'true');
    });
    document.body.classList.remove('modal-open');

    initTheme();

    const soundBtn = document.getElementById('btnSoundToggle');
    if (soundBtn) {
        soundBtn.classList.toggle('active', soundEnabled);
        soundBtn.setAttribute('aria-pressed', String(soundEnabled));
    }

    bindEvents();
    resetGame();

    if (gameMode === 'pvc' && playerColor === 'black') scheduleAIMove();
}

boot();

});