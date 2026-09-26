document.addEventListener('DOMContentLoaded', () => {
    // ========== SVG PIECES ==========
    const SVG_WHITE_KING = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22.5 11.63V6" stroke-linecap="round"/><path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill="#fff"/><path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-3.5-7.5-13-10.5-16-4-3 6 6 10.5 6 10.5v7" fill="#fff"/><path d="M20 8h5" stroke-linecap="round"/><circle cx="22.5" cy="33.5" r="1.5" fill="#000"/><circle cx="20.5" cy="30.5" r="1.5" fill="#000"/><circle cx="24.5" cy="30.5" r="1.5" fill="#000"/></g></svg>');
    const SVG_WHITE_QUEEN = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zm16.5-4.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zm13 4.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0z" fill="#fff"/><path d="M9 26c8.5-1.5 21-1.5 27 0l2.5-12.5L31 12l-3.5 6.5-5.5-7-5.5 7L13 12l-7.5 1.5L9 26z" fill="#fff"/><path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 2-1 .5-2.5 0 0 0-1.5-1.5-2.5-.5-2.5.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z" fill="#fff"/><circle cx="6" cy="12" r="1.5" fill="#000"/><circle cx="20.5" cy="7" r="1.5" fill="#000"/><circle cx="35" cy="12" r="1.5" fill="#000"/></g></svg>');
    const SVG_WHITE_ROOK = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 39h27v-3H9v3zm3.5-7h18V10h-18v22zm3-17.5h12" fill="#fff"/><path d="M15 10V3h15v7M15 10h-4.5v6.5M30 10h4.5v6.5" fill="#fff"/></g></svg>');
    const SVG_WHITE_BISHOP = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><g fill="#fff"><path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.35.49-2.32.47-3-.5 1.35-1.46 3-2 3-2z"/><path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z"/><path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z"/></g></g></svg>');
    const SVG_WHITE_KNIGHT = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10c10.5 1 16.5 8 16 15H15c0-9 10-6.5 8-21" fill="#fff"/><path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3" fill="#fff"/></g></svg>');
    const SVG_WHITE_PAWN = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 13 19 13 23.5v3h19v-3c0-4.5-4.33-7-6.28-8.12.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="#fff" stroke="#000" stroke-width="1.5" stroke-linecap="round"/></svg>');

    const SVG_BLACK_KING = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22.5 11.63V6" stroke-linecap="round"/><path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill="#000"/><path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-3.5-7.5-13-10.5-16-4-3 6 6 10.5 6 10.5v7" fill="#000"/><path d="M20 8h5" stroke-linecap="round"/><circle cx="22.5" cy="33.5" r="1.5" fill="#fff"/><circle cx="20.5" cy="30.5" r="1.5" fill="#fff"/><circle cx="24.5" cy="30.5" r="1.5" fill="#fff"/></g></svg>');
    const SVG_BLACK_QUEEN = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zm16.5-4.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zm13 4.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0z" fill="#000"/><path d="M9 26c8.5-1.5 21-1.5 27 0l2.5-12.5L31 12l-3.5 6.5-5.5-7-5.5 7L13 12l-7.5 1.5L9 26z" fill="#000"/><path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 2-1 .5-2.5 0 0 0-1.5-1.5-2.5-.5-2.5.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z" fill="#000"/><circle cx="6" cy="12" r="1.5" fill="#fff"/><circle cx="20.5" cy="7" r="1.5" fill="#fff"/><circle cx="35" cy="12" r="1.5" fill="#fff"/></g></svg>');
    const SVG_BLACK_ROOK = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 39h27v-3H9v3zm3.5-7h18V10h-18v22zm3-17.5h12" fill="#000"/><path d="M15 10V3h15v7M15 10h-4.5v6.5M30 10h4.5v6.5" fill="#000"/></g></svg>');
    const SVG_BLACK_BISHOP = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><g fill="#000"><path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.35.49-2.32.47-3-.5 1.35-1.46 3-2 3-2z"/><path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z"/><path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z"/></g></g></svg>');
    const SVG_BLACK_KNIGHT = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10c10.5 1 16.5 8 16 15H15c0-9 10-6.5 8-21" fill="#000"/><path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3" fill="#000"/></g></svg>');
    const SVG_BLACK_PAWN = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 13 19 13 23.5v3h19v-3c0-4.5-4.33-7-6.28-8.12.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="#000" stroke="#000" stroke-width="1.5" stroke-linecap="round"/></svg>');

    const PIECE_ASSETS = {
        white: { king: SVG_WHITE_KING, queen: SVG_WHITE_QUEEN, rook: SVG_WHITE_ROOK, bishop: SVG_WHITE_BISHOP, knight: SVG_WHITE_KNIGHT, pawn: SVG_WHITE_PAWN },
        black: { king: SVG_BLACK_KING, queen: SVG_BLACK_QUEEN, rook: SVG_BLACK_ROOK, bishop: SVG_BLACK_BISHOP, knight: SVG_BLACK_KNIGHT, pawn: SVG_BLACK_PAWN }
    };

    // ========== SOUND ENGINE ==========
    let audioCtx = null;
    let soundEnabled = true;
    const soundVolume = 0.5;

    function getAudioCtx() {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        return audioCtx;
    }

    function playTone(freq, duration, type = 'sine', vol = 0.3) {
        if (!soundEnabled) return;
        try {
            const ctx = getAudioCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            gain.gain.setValueAtTime(vol * soundVolume, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + duration);
        } catch (e) { /* silent */ }
    }

    function playSound(type) {
        switch (type) {
            case 'move':      playTone(600, 0.08, 'sine', 0.2); break;
            case 'capture':   playTone(200, 0.15, 'triangle', 0.35); playTone(150, 0.1, 'sawtooth', 0.2); break;
            case 'check':     playTone(800, 0.15, 'square', 0.4); setTimeout(() => playTone(1000, 0.2, 'square', 0.4), 150); break;
            case 'castle':    playTone(500, 0.1, 'sine', 0.25); setTimeout(() => playTone(700, 0.1, 'sine', 0.25), 100); break;
            case 'game-over': playTone(400, 0.3, 'triangle', 0.4); setTimeout(() => playTone(300, 0.3, 'triangle', 0.4), 300); setTimeout(() => playTone(200, 0.5, 'triangle', 0.4), 600); break;
            case 'promote':   playTone(900, 0.2, 'sine', 0.3); break;
        }
    }

    // ========== GAME STATE ==========
    const INITIAL_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

    let gameState = {
        board: [], currentPlayer: 'white', selectedSquare: null, legalMoves: [],
        moveHistory: [], capturedPieces: { white: [], black: [] },
        castlingRights: { whiteKingSide: true, whiteQueenSide: true, blackKingSide: true, blackQueenSide: true },
        enPassantTarget: null, halfmoveClock: 0, fullmoveNumber: 1,
        lastMove: null, isCheck: false, isCheckmate: false, isStalemate: false,
        gameOver: false, gameResult: null,
    };

    let boardOrientation = 'white';
    let redoStack = [];
    let gameMode = 'pvp';
    let playerColor = 'white';
    let aiDifficulty = 'medium';
    let timerMode = { initial: 600, increment: 0 };
    let timers = { white: 600, black: 600 };
    let timerInterval = null;
    let showCoordinates = true;
    let aiThinking = false;

    const boardEl = document.getElementById('board');

    // ========== FEN ==========
    function parseFEN(fen) {
        const parts = fen.trim().split(/\s+/);
        const boardPart = parts[0];
        const activeColor = parts[1] || 'w';
        const castling = parts[2] || 'KQkq';
        const enPassant = parts[3] || '-';
        const halfmove = parseInt(parts[4]) || 0;
        const fullmove = parseInt(parts[5]) || 1;

        const board = [];
        const ranks = boardPart.split('/');
        for (let r = 0; r < 8; r++) {
            const row = [];
            const rankStr = ranks[r] || '';
            for (const ch of rankStr) {
                if (ch >= '1' && ch <= '8') {
                    for (let i = 0; i < parseInt(ch); i++) row.push(null);
                } else {
                    const color = ch === ch.toUpperCase() ? 'white' : 'black';
                    const pieceMap = { k: 'king', q: 'queen', r: 'rook', b: 'bishop', n: 'knight', p: 'pawn' };
                    row.push({ type: pieceMap[ch.toLowerCase()], color });
                }
            }
            board.push(row);
        }
        return {
            board,
            currentPlayer: activeColor === 'w' ? 'white' : 'black',
            castlingRights: {
                whiteKingSide: castling.includes('K'),
                whiteQueenSide: castling.includes('Q'),
                blackKingSide: castling.includes('k'),
                blackQueenSide: castling.includes('q'),
            },
            enPassantTarget: enPassant !== '-' ? enPassant : null,
            halfmoveClock: halfmove,
            fullmoveNumber: fullmove,
        };
    }

    function exportFEN() {
        let fen = '';
        for (let r = 0; r < 8; r++) {
            let empty = 0;
            for (let c = 0; c < 8; c++) {
                const piece = gameState.board[r][c];
                if (!piece) { empty++; continue; }
                if (empty > 0) { fen += empty; empty = 0; }
                const map = { king: 'k', queen: 'q', rook: 'r', bishop: 'b', knight: 'n', pawn: 'p' };
                const ch = map[piece.type];
                fen += piece.color === 'white' ? ch.toUpperCase() : ch;
            }
            if (empty > 0) fen += empty;
            if (r < 7) fen += '/';
        }
        fen += ' ' + (gameState.currentPlayer === 'white' ? 'w' : 'b');
        let cr = '';
        if (gameState.castlingRights.whiteKingSide) cr += 'K';
        if (gameState.castlingRights.whiteQueenSide) cr += 'Q';
        if (gameState.castlingRights.blackKingSide) cr += 'k';
        if (gameState.castlingRights.blackQueenSide) cr += 'q';
        fen += ' ' + (cr || '-');
        fen += ' ' + (gameState.enPassantTarget || '-');
        fen += ' ' + gameState.halfmoveClock;
        fen += ' ' + gameState.fullmoveNumber;
        return fen;
    }

    function loadFromFEN(fen) {
        const parsed = parseFEN(fen);
        gameState.board = parsed.board;
        gameState.currentPlayer = parsed.currentPlayer;
        gameState.castlingRights = parsed.castlingRights;
        gameState.enPassantTarget = parsed.enPassantTarget;
        gameState.halfmoveClock = parsed.halfmoveClock;
        gameState.fullmoveNumber = parsed.fullmoveNumber;
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
        loadFromFEN(INITIAL_FEN);
        resetTimers();
        if (gameMode === 'pvc' && playerColor === 'black') {
            setTimeout(() => makeComputerMove(), 400);
        }
    }

    // ========== TIMERS ==========
    function startTimer() {
        if (timerInterval || timerMode.initial === 0) return;
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
            } else {
                updateTimerUI();
            }
        }, 1000);
    }

    function stopTimer() {
        if (timerInterval) clearInterval(timerInterval);
        timerInterval = null;
    }

    function resetTimers() {
        timers.white = timerMode.initial;
        timers.black = timerMode.initial;
        updateTimerUI();
        stopTimer();
        if (timerMode.initial > 0) startTimer();
    }

    function formatTime(seconds) {
        if (seconds <= 0) return '00:00';
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }

    function updateTimerUI() {
        const wTimer = document.getElementById('whiteTimer');
        const bTimer = document.getElementById('blackTimer');
        if (wTimer) {
            wTimer.textContent = formatTime(timers.white);
            wTimer.classList.toggle('low-time', timerMode.initial > 0 && timers.white <= 30 && timers.white > 0);
        }
        if (bTimer) {
            bTimer.textContent = formatTime(timers.black);
            bTimer.classList.toggle('low-time', timerMode.initial > 0 && timers.black <= 30 && timers.black > 0);
        }
    }

    // ========== MOVE GENERATION ==========
    function cloneBoard(board) {
        return board.map(row => row.map(cell => cell ? { ...cell } : null));
    }

    function getPieceAt(board, row, col) {
        if (row < 0 || row > 7 || col < 0 || col > 7) return undefined;
        return board[row][col];
    }

    function isSquareAttackedBy(board, row, col, attackerColor) {
        const enemy = attackerColor;
        const knightMoves = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
        for (const [dr, dc] of knightMoves) {
            const p = getPieceAt(board, row + dr, col + dc);
            if (p && p.color === enemy && p.type === 'knight') return true;
        }

        const kingMoves = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
        for (const [dr, dc] of kingMoves) {
            const p = getPieceAt(board, row + dr, col + dc);
            if (p && p.color === enemy && p.type === 'king') return true;
        }

        const pawnDir = enemy === 'white' ? -1 : 1;
        for (const dc of [-1, 1]) {
            const p = getPieceAt(board, row + pawnDir, col + dc);
            if (p && p.color === enemy && p.type === 'pawn') return true;
        }

        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]];
        for (const [dr, dc] of directions) {
            let r = row + dr, c = col + dc;
            while (r >= 0 && r < 8 && c >= 0 && c < 8) {
                const p = board[r][c];
                if (p) {
                    if (p.color === enemy) {
                        const isDiagonal = Math.abs(dr) === 1 && Math.abs(dc) === 1;
                        const isOrthogonal = (dr === 0) !== (dc === 0);
                        if (p.type === 'queen') return true;
                        if (isDiagonal && p.type === 'bishop') return true;
                        if (isOrthogonal && p.type === 'rook') return true;
                    }
                    break;
                }
                r += dr; c += dc;
            }
        }
        return false;
    }

    function findKing(board, color) {
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const p = board[r][c];
                if (p && p.type === 'king' && p.color === color) return { row: r, col: c };
            }
        }
        return null;
    }

    function isKingInCheckOnBoard(board, color) {
        const king = findKing(board, color);
        if (!king) return true;
        const enemy = color === 'white' ? 'black' : 'white';
        return isSquareAttackedBy(board, king.row, king.col, enemy);
    }

    function getPseudoLegalMoves(board, row, col, castlingRights, enPassantTarget) {
        const piece = board[row][col];
        if (!piece) return [];
        const moves = [];
        const color = piece.color;
        const enemy = color === 'white' ? 'black' : 'white';
        const type = piece.type;

        function addMove(tr, tc, special = null) {
            if (tr >= 0 && tr < 8 && tc >= 0 && tc < 8) {
                const target = board[tr][tc];
                if (!target || target.color === enemy) {
                    moves.push({ fromRow: row, fromCol: col, toRow: tr, toCol: tc, piece, captured: target, special });
                }
            }
        }

        function addSliding(dr, dc) {
            let r = row + dr, c = col + dc;
            while (r >= 0 && r < 8 && c >= 0 && c < 8) {
                const target = board[r][c];
                if (target) {
                    if (target.color === enemy) moves.push({ fromRow: row, fromCol: col, toRow: r, toCol: c, piece, captured: target, special: null });
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
                if (!board[row + dir]?.[col]) {
                    addMove(row + dir, col);
                    if (row === startRow && !board[row + 2 * dir]?.[col]) addMove(row + 2 * dir, col, 'double-push');
                }
                for (const dc of [-1, 1]) {
                    const tr = row + dir, tc = col + dc;
                    if (tr >= 0 && tr < 8 && tc >= 0 && tc < 8) {
                        const target = board[tr][tc];
                        if (target && target.color === enemy) addMove(tr, tc);
                    }
                }
                if (enPassantTarget) {
                    const epCol = enPassantTarget.charCodeAt(0) - 97;
                    const epRow = 8 - parseInt(enPassantTarget[1]);
                    if (row + dir === epRow && Math.abs(col - epCol) === 1) {
                        moves.push({ fromRow: row, fromCol: col, toRow: epRow, toCol: epCol, piece, captured: board[epRow - dir]?.[epCol], special: 'en-passant' });
                    }
                }
                break;
            }
            case 'knight':
                for (const [dr, dc] of [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]]) addMove(row + dr, col + dc);
                break;
            case 'bishop':
                for (const [dr, dc] of [[-1, -1], [-1, 1], [1, -1], [1, 1]]) addSliding(dr, dc);
                break;
            case 'rook':
                for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) addSliding(dr, dc);
                break;
            case 'queen':
                for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]]) addSliding(dr, dc);
                break;
            case 'king':
                for (const [dr, dc] of [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]) addMove(row + dr, col + dc);
                if (color === 'white' && row === 7 && col === 4) {
                    if (castlingRights.whiteKingSide && !board[7][5] && !board[7][6] &&
                        !isSquareAttackedBy(board, 7, 4, enemy) && !isSquareAttackedBy(board, 7, 5, enemy) && !isSquareAttackedBy(board, 7, 6, enemy) &&
                        board[7][7]?.type === 'rook' && board[7][7]?.color === 'white') {
                        moves.push({ fromRow: 7, fromCol: 4, toRow: 7, toCol: 6, piece, captured: null, special: 'kingside-castle' });
                    }
                    if (castlingRights.whiteQueenSide && !board[7][1] && !board[7][2] && !board[7][3] &&
                        !isSquareAttackedBy(board, 7, 4, enemy) && !isSquareAttackedBy(board, 7, 3, enemy) && !isSquareAttackedBy(board, 7, 2, enemy) &&
                        board[7][0]?.type === 'rook' && board[7][0]?.color === 'white') {
                        moves.push({ fromRow: 7, fromCol: 4, toRow: 7, toCol: 2, piece, captured: null, special: 'queenside-castle' });
                    }
                }
                if (color === 'black' && row === 0 && col === 4) {
                    if (castlingRights.blackKingSide && !board[0][5] && !board[0][6] &&
                        !isSquareAttackedBy(board, 0, 4, enemy) && !isSquareAttackedBy(board, 0, 5, enemy) && !isSquareAttackedBy(board, 0, 6, enemy) &&
                        board[0][7]?.type === 'rook' && board[0][7]?.color === 'black') {
                        moves.push({ fromRow: 0, fromCol: 4, toRow: 0, toCol: 6, piece, captured: null, special: 'kingside-castle' });
                    }
                    if (castlingRights.blackQueenSide && !board[0][1] && !board[0][2] && !board[0][3] &&
                        !isSquareAttackedBy(board, 0, 4, enemy) && !isSquareAttackedBy(board, 0, 3, enemy) && !isSquareAttackedBy(board, 0, 2, enemy) &&
                        board[0][0]?.type === 'rook' && board[0][0]?.color === 'black') {
                        moves.push({ fromRow: 0, fromCol: 4, toRow: 0, toCol: 2, piece, captured: null, special: 'queenside-castle' });
                    }
                }
                break;
        }
        return moves;
    }

    function getLegalMoves(board, row, col, castlingRights, enPassantTarget) {
        const pseudoMoves = getPseudoLegalMoves(board, row, col, castlingRights, enPassantTarget);
        const piece = board[row][col];
        if (!piece) return [];
        const legal = [];
        for (const move of pseudoMoves) {
            const newBoard = cloneBoard(board);
            newBoard[move.toRow][move.toCol] = newBoard[move.fromRow][move.fromCol];
            newBoard[move.fromRow][move.fromCol] = null;
            if (move.special === 'en-passant') {
                const capturedRow = piece.color === 'white' ? move.toRow + 1 : move.toRow - 1;
                newBoard[capturedRow][move.toCol] = null;
            }
            if (move.special === 'kingside-castle') {
                newBoard[move.toRow][5] = newBoard[move.toRow][7];
                newBoard[move.toRow][7] = null;
            }
            if (move.special === 'queenside-castle') {
                newBoard[move.toRow][3] = newBoard[move.toRow][0];
                newBoard[move.toRow][0] = null;
            }
            if (!isKingInCheckOnBoard(newBoard, piece.color)) legal.push(move);
        }
        return legal;
    }

    function getAllLegalMovesForColor(board, color, castlingRights, enPassantTarget) {
        const allMoves = [];
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const p = board[r][c];
                if (p && p.color === color) allMoves.push(...getLegalMoves(board, r, c, castlingRights, enPassantTarget));
            }
        }
        return allMoves;
    }

    function updateCheckStatus() {
        gameState.isCheck = isKingInCheckOnBoard(gameState.board, gameState.currentPlayer);
        const allMoves = getAllLegalMovesForColor(gameState.board, gameState.currentPlayer, gameState.castlingRights, gameState.enPassantTarget);
        if (allMoves.length === 0) {
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
            if (!gameState.gameOver) gameState.gameResult = null;
        }
    }

    // ========== EXECUTE MOVE ==========
    function algebraicNotation(move) {
        const files = 'abcdefgh';
        const ranks = '87654321';
        const fromFile = files[move.fromCol];
        const toFile = files[move.toCol];
        const toRank = ranks[move.toRow];
        const piece = move.piece;

        if (move.special === 'kingside-castle') return 'O-O';
        if (move.special === 'queenside-castle') return 'O-O-O';

        let notation = '';
        if (piece.type === 'pawn') {
            if (move.captured || move.special === 'en-passant') notation = fromFile + 'x' + toFile + toRank;
            else notation = toFile + toRank;
        } else {
            const pieceMap = { king: 'K', queen: 'Q', rook: 'R', bishop: 'B', knight: 'N' };
            notation = pieceMap[piece.type];
            if (move.captured) notation += 'x';
            notation += toFile + toRank;
        }
        if (move.special === 'en-passant') notation += ' e.p.';
        return notation;
    }

    function executeMove(move, record = true) {
        const board = gameState.board;
        const piece = board[move.fromRow][move.fromCol];
        const captured = board[move.toRow][move.toCol] || (move.special === 'en-passant' ? board[move.fromRow][move.toCol] : null);

        if (captured) {
            gameState.capturedPieces[captured.color].push(captured);
            gameState.halfmoveClock = 0;
        } else if (piece.type === 'pawn') {
            gameState.halfmoveClock = 0;
        } else {
            gameState.halfmoveClock++;
        }

        board[move.toRow][move.toCol] = piece;
        board[move.fromRow][move.fromCol] = null;

        if (move.special === 'en-passant') {
            const capturedRow = piece.color === 'white' ? move.toRow + 1 : move.toRow - 1;
            const epCaptured = board[capturedRow][move.toCol];
            if (epCaptured) gameState.capturedPieces[epCaptured.color].push(epCaptured);
            board[capturedRow][move.toCol] = null;
        }

        if (move.special === 'kingside-castle') {
            board[move.toRow][5] = board[move.toRow][7];
            board[move.toRow][7] = null;
        }
        if (move.special === 'queenside-castle') {
            board[move.toRow][3] = board[move.toRow][0];
            board[move.toRow][0] = null;
        }

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

        gameState.lastMove = { fromRow: move.fromRow, fromCol: move.fromCol, toRow: move.toRow, toCol: move.toCol };

        if (gameState.currentPlayer === 'black') gameState.fullmoveNumber++;
        gameState.currentPlayer = gameState.currentPlayer === 'white' ? 'black' : 'white';

        if (record) {
            const notation = algebraicNotation(move);
            gameState.moveHistory.push({ ...move, notation });
            redoStack = [];
        }

        if (piece.type === 'pawn' && (move.toRow === 0 || move.toRow === 7)) {
            return { needsPromotion: true, move };
        }

        updateCheckStatus();
        updateGameStatus();
        return { needsPromotion: false, move };
    }

    function promotePawn(move, promoteTo) {
        gameState.board[move.toRow][move.toCol] = { type: promoteTo, color: move.piece.color };
        updateCheckStatus();
        updateGameStatus();
        playSound('promote');
    }

    function handleMove(move) {
        const result = executeMove(move);
        if (result.needsPromotion) { showPromotionModal(result.move); return; }
        finalizeMove();
    }

    function finalizeMove() {
        // Award increment to the mover (the player who just moved)
        const mover = gameState.currentPlayer === 'white' ? 'black' : 'white';
        if (timerMode.increment > 0 && !gameState.gameOver) {
            timers[mover] += timerMode.increment;
        }

        renderBoard();
        updateMoveHistoryUI();
        updateCapturedUI();
        updatePlayerStatusUI();
        updateTimerUI();

        if (gameState.gameOver) {
            stopTimer();
            handleGameOver();
            return;
        }

        if (gameState.isCheck) playSound('check');
        else if (gameState.moveHistory.length > 0) {
            const lastMove = gameState.moveHistory[gameState.moveHistory.length - 1];
            if (lastMove.special === 'kingside-castle' || lastMove.special === 'queenside-castle') playSound('castle');
            else if (lastMove.captured || lastMove.special === 'en-passant') playSound('capture');
            else playSound('move');
        }

        if (gameMode === 'pvc' && gameState.currentPlayer !== playerColor) {
            aiThinking = true;
            updatePlayerStatusUI();
            renderBoard();
            setTimeout(() => makeComputerMove(), 320);
        }
    }

    function handleGameOver() {
        stopTimer();
        playSound('game-over');
        const result = gameState.gameResult;
        let title, message;
        if (result === 'draw') {
            title = '🤝 Permainan Remis!';
            message = gameState.isStalemate ? 'Stalemate — tidak ada langkah legal.' : 'Permainan berakhir draw.';
        } else {
            const winner = result === 'white' ? 'Putih' : 'Hitam';
            title = `🏆 ${winner} Menang!`;
            message = gameState.isCheckmate ? 'Checkmate!' : 'Waktu habis!';
        }
        showGameOverModal(title, message);
    }

    // ========== AI ENGINE ==========
    function makeComputerMove() {
        if (gameState.gameOver) { aiThinking = false; return; }
        const color = gameState.currentPlayer;
        const allMoves = getAllLegalMovesForColor(gameState.board, color, gameState.castlingRights, gameState.enPassantTarget);
        if (allMoves.length === 0) { aiThinking = false; return; }

        let chosenMove;
        if (aiDifficulty === 'easy') {
            chosenMove = allMoves[Math.floor(Math.random() * allMoves.length)];
        } else if (aiDifficulty === 'medium') {
            chosenMove = minimaxMove(gameState, 2, color);
        } else {
            chosenMove = minimaxMove(gameState, 3, color);
        }
        if (!chosenMove) chosenMove = allMoves[0];

        aiThinking = false;
        const result = executeMove(chosenMove);
        if (result.needsPromotion) promotePawn(result.move, 'queen');
        finalizeMove();
    }

    function evaluateBoard(board) {
        const values = { pawn: 100, knight: 320, bishop: 330, rook: 500, queen: 900, king: 20000 };
        let score = 0;
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const p = board[r][c];
                if (p) {
                    const val = values[p.type] || 0;
                    score += p.color === 'white' ? val : -val;
                }
            }
        }
        return score;
    }

    function minimaxMove(state, depth, color) {
        const allMoves = getAllLegalMovesForColor(state.board, color, state.castlingRights, state.enPassantTarget);
        if (allMoves.length === 0) return null;

        let bestMove = allMoves[0];
        let bestScore = color === 'white' ? -Infinity : Infinity;
        const isMax = color === 'white';

        for (const move of allMoves) {
            const newState = simulateMove(state, move);
            const score = minimax(newState, depth - 1, -Infinity, Infinity, !isMax);
            if (isMax && score > bestScore) { bestScore = score; bestMove = move; }
            if (!isMax && score < bestScore) { bestScore = score; bestMove = move; }
        }
        return bestMove;
    }

    function simulateMove(state, move) {
        const newBoard = cloneBoard(state.board);
        const piece = newBoard[move.fromRow][move.fromCol];
        newBoard[move.toRow][move.toCol] = piece;
        newBoard[move.fromRow][move.fromCol] = null;
        if (move.special === 'en-passant') {
            const cr = piece.color === 'white' ? move.toRow + 1 : move.toRow - 1;
            newBoard[cr][move.toCol] = null;
        }
        if (move.special === 'kingside-castle') {
            newBoard[move.toRow][5] = newBoard[move.toRow][7];
            newBoard[move.toRow][7] = null;
        }
        if (move.special === 'queenside-castle') {
            newBoard[move.toRow][3] = newBoard[move.toRow][0];
            newBoard[move.toRow][0] = null;
        }
        const newCR = { ...state.castlingRights };
        if (piece.type === 'king') {
            if (piece.color === 'white') newCR.whiteKingSide = newCR.whiteQueenSide = false;
            else newCR.blackKingSide = newCR.blackQueenSide = false;
        }
        return { board: newBoard, castlingRights: newCR, currentPlayer: state.currentPlayer === 'white' ? 'black' : 'white' };
    }

    function minimax(state, depth, alpha, beta, isMax) {
        if (depth === 0) return evaluateBoard(state.board);
        const color = state.currentPlayer;
        const allMoves = getAllLegalMovesForColor(state.board, color, state.castlingRights, null);
        if (allMoves.length === 0) {
            if (isKingInCheckOnBoard(state.board, color)) return isMax ? -99999 : 99999;
            return 0;
        }
        if (isMax) {
            let maxEval = -Infinity;
            for (const move of allMoves) {
                const ns = simulateMove(state, move);
                const evalScore = minimax(ns, depth - 1, alpha, beta, false);
                maxEval = Math.max(maxEval, evalScore);
                alpha = Math.max(alpha, evalScore);
                if (beta <= alpha) break;
            }
            return maxEval;
        } else {
            let minEval = Infinity;
            for (const move of allMoves) {
                const ns = simulateMove(state, move);
                const evalScore = minimax(ns, depth - 1, alpha, beta, true);
                minEval = Math.min(minEval, evalScore);
                beta = Math.min(beta, evalScore);
                if (beta <= alpha) break;
            }
            return minEval;
        }
    }

    // ========== RENDER BOARD ==========
    function renderBoard() {
        if (!boardEl) return;
        boardEl.innerHTML = '';
        const flipped = boardOrientation === 'black';

        for (let displayRow = 0; displayRow < 8; displayRow++) {
            for (let displayCol = 0; displayCol < 8; displayCol++) {
                const actualRow = flipped ? 7 - displayRow : displayRow;
                const actualCol = flipped ? 7 - displayCol : displayCol;
                const isLight = (actualRow + actualCol) % 2 === 0;
                const square = document.createElement('div');
                square.className = 'square ' + (isLight ? 'light' : 'dark');
                square.dataset.row = actualRow;
                square.dataset.col = actualCol;
                square.setAttribute('role', 'gridcell');

                if (gameState.selectedSquare &&
                    gameState.selectedSquare.row === actualRow &&
                    gameState.selectedSquare.col === actualCol) {
                    square.classList.add('selected');
                }
                if (gameState.lastMove && !gameState.gameOver) {
                    if ((gameState.lastMove.fromRow === actualRow && gameState.lastMove.fromCol === actualCol) ||
                        (gameState.lastMove.toRow === actualRow && gameState.lastMove.toCol === actualCol)) {
                        square.classList.add('last-move');
                    }
                }
                if (gameState.isCheck) {
                    const king = findKing(gameState.board, gameState.currentPlayer);
                    if (king && king.row === actualRow && king.col === actualCol) square.classList.add('in-check');
                }
                for (const move of gameState.legalMoves) {
                    if (move.toRow === actualRow && move.toCol === actualCol) {
                        if (move.captured || move.special === 'en-passant') square.classList.add('capture-move');
                        else square.classList.add('legal-move');
                        break;
                    }
                }

                if (showCoordinates) {
                    if (actualCol === (flipped ? 7 : 0)) {
                        const rankLabel = document.createElement('span');
                        rankLabel.className = 'coord-label coord-rank';
                        rankLabel.textContent = 8 - actualRow;
                        square.appendChild(rankLabel);
                    }
                    if (actualRow === (flipped ? 0 : 7)) {
                        const fileLabel = document.createElement('span');
                        fileLabel.className = 'coord-label coord-file';
                        fileLabel.textContent = 'abcdefgh'[actualCol];
                        square.appendChild(fileLabel);
                    }
                }

                const piece = gameState.board[actualRow][actualCol];
                if (piece) {
                    const img = document.createElement('img');
                    img.className = 'piece-img';
                    img.src = PIECE_ASSETS[piece.color][piece.type];
                    img.alt = `${piece.color} ${piece.type}`;
                    img.draggable = !gameState.gameOver && !aiThinking;
                    img.dataset.row = actualRow;
                    img.dataset.col = actualCol;
                    img.addEventListener('dragstart', handleDragStart);
                    img.addEventListener('dragend', handleDragEnd);
                    square.appendChild(img);
                }

                square.addEventListener('click', () => handleSquareClick(actualRow, actualCol));
                square.addEventListener('dragover', (e) => { e.preventDefault(); square.classList.add('drag-over'); });
                square.addEventListener('dragleave', () => square.classList.remove('drag-over'));
                square.addEventListener('drop', (e) => {
                    e.preventDefault();
                    square.classList.remove('drag-over');
                    handleDrop(actualRow, actualCol);
                });

                boardEl.appendChild(square);
            }
        }

        if (gameState.selectedSquare && !gameState.gameOver && !aiThinking) {
            gameState.legalMoves = getLegalMoves(
                gameState.board,
                gameState.selectedSquare.row,
                gameState.selectedSquare.col,
                gameState.castlingRights,
                gameState.enPassantTarget
            );
        }
        updatePlayerStatusUI();
    }

    function refreshHighlights() {
        if (!boardEl) return;
        const sel = gameState.selectedSquare;
        const last = gameState.lastMove;
        const showLast = last && !gameState.gameOver;
        const king = gameState.isCheck ? findKing(gameState.board, gameState.currentPlayer) : null;

        boardEl.querySelectorAll('.square').forEach(sq => {
            const r = +sq.dataset.row, c = +sq.dataset.col;
            sq.classList.toggle('selected', !!sel && sel.row === r && sel.col === c);
            sq.classList.toggle('last-move', !!showLast &&
                ((last.fromRow === r && last.fromCol === c) || (last.toRow === r && last.toCol === c)));
            sq.classList.toggle('in-check', !!king && king.row === r && king.col === c);

            let match = null;
            for (const m of gameState.legalMoves) {
                if (m.toRow === r && m.toCol === c) { match = m; break; }
            }
            sq.classList.toggle('legal-move', !!match && !match.captured && match.special !== 'en-passant');
            sq.classList.toggle('capture-move', !!match && (!!match.captured || match.special === 'en-passant'));
        });
    }

    // ========== INTERACTION ==========
    let dragData = null;

    function handleSquareClick(row, col) {
        if (gameState.gameOver || aiThinking) return;
        const piece = gameState.board[row][col];

        if (gameState.selectedSquare) {
            const sel = gameState.selectedSquare;
            const legalMoves = getLegalMoves(gameState.board, sel.row, sel.col, gameState.castlingRights, gameState.enPassantTarget);
            const targetMove = legalMoves.find(m => m.toRow === row && m.toCol === col);
            if (targetMove) {
                gameState.selectedSquare = null;
                gameState.legalMoves = [];
                handleMove(targetMove);
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
    }

    function handleDragStart(e) {
        if (gameState.gameOver || aiThinking) { e.preventDefault(); return; }
        const row = parseInt(e.target.dataset.row);
        const col = parseInt(e.target.dataset.col);
        const piece = gameState.board[row][col];
        if (!piece || piece.color !== gameState.currentPlayer) { e.preventDefault(); return; }

        dragData = { row, col, piece };
        e.target.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        try { e.dataTransfer.setData('text/plain', `${row},${col}`); } catch (_) {}

        gameState.selectedSquare = { row, col };
        gameState.legalMoves = getLegalMoves(gameState.board, row, col, gameState.castlingRights, gameState.enPassantTarget);
        refreshHighlights(); // Do NOT re-render – it would cancel the drag
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
        const legalMoves = getLegalMoves(gameState.board, dragData.row, dragData.col, gameState.castlingRights, gameState.enPassantTarget);
        const targetMove = legalMoves.find(m => m.toRow === toRow && m.toCol === toCol);
        dragData = null;
        if (targetMove) {
            gameState.selectedSquare = null;
            gameState.legalMoves = [];
            handleMove(targetMove);
        } else {
            gameState.selectedSquare = null;
            gameState.legalMoves = [];
            refreshHighlights();
        }
    }

    // -------- Touch (delegated on board) --------
    let touchState = null;

    function onBoardTouchStart(e) {
        if (gameState.gameOver || aiThinking) return;
        const img = e.target.closest('.piece-img');
        if (!img) return;
        const row = +img.dataset.row;
        const col = +img.dataset.col;
        const piece = gameState.board[row][col];
        if (!piece || piece.color !== gameState.currentPlayer) return;
        const t = e.touches[0];
        touchState = { row, col, startX: t.clientX, startY: t.clientY, moved: false };
    }

    function onBoardTouchMove(e) {
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

    function onBoardTouchEnd(e) {
        if (!touchState) return;
        const state = touchState;
        touchState = null;
        document.querySelectorAll('.square.drag-over').forEach(s => s.classList.remove('drag-over'));

        if (!state.moved) return; // Let the click handler process taps

        const t = e.changedTouches[0];
        const el = document.elementFromPoint(t.clientX, t.clientY);
        const sq = el?.closest('.square');
        if (sq) {
            const toRow = +sq.dataset.row;
            const toCol = +sq.dataset.col;
            const legalMoves = getLegalMoves(gameState.board, state.row, state.col, gameState.castlingRights, gameState.enPassantTarget);
            const move = legalMoves.find(m => m.toRow === toRow && m.toCol === toCol);
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
        boardEl.addEventListener('touchstart', onBoardTouchStart, { passive: true });
        boardEl.addEventListener('touchmove', onBoardTouchMove, { passive: false });
        boardEl.addEventListener('touchend', onBoardTouchEnd);
        boardEl.addEventListener('touchcancel', () => {
            touchState = null;
            document.querySelectorAll('.square.drag-over').forEach(s => s.classList.remove('drag-over'));
        });
    }

    // ========== MODALS ==========
    function showPromotionModal(move) {
        const modal = document.getElementById('promotionModal');
        const optionsContainer = document.getElementById('promotionOptions');
        if (!modal || !optionsContainer) return;
        optionsContainer.innerHTML = '';
        const color = move.piece.color;
        const pieces = ['queen', 'rook', 'bishop', 'knight'];
        for (const type of pieces) {
            const btn = document.createElement('div');
            btn.className = 'promotion-btn';
            btn.setAttribute('role', 'button');
            btn.setAttribute('tabindex', '0');
            btn.setAttribute('aria-label', `Promosi ke ${type}`);
            const img = document.createElement('img');
            img.src = PIECE_ASSETS[color][type];
            img.alt = type;
            btn.appendChild(img);
            const choose = () => {
                promotePawn(move, type);
                hideModal('promotionModal');
                finalizeMove();
            };
            btn.addEventListener('click', choose);
            btn.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); choose(); } });
            optionsContainer.appendChild(btn);
        }
        modal.classList.remove('hidden');
    }

    function showGameOverModal(title, message) {
        const modal = document.getElementById('gameOverModal');
        const content = document.getElementById('gameOverContent');
        if (!modal || !content) return;
        content.innerHTML = `
            <h2>${title}</h2>
            <p>${message}</p>
            <div class="modal-buttons">
                <button class="btn accent" id="btnRematch">🔄 Rematch</button>
                <button class="btn" id="btnCopyPGNGameOver">📋 Copy PGN</button>
                <button class="btn" id="btnCloseGameOver">Tutup</button>
            </div>
        `;
        modal.classList.remove('hidden');
        document.getElementById('btnRematch')?.addEventListener('click', () => { hideModal('gameOverModal'); resetGame(); });
        document.getElementById('btnCopyPGNGameOver')?.addEventListener('click', copyPGN);
        document.getElementById('btnCloseGameOver')?.addEventListener('click', () => hideModal('gameOverModal'));
    }

    function hideModal(id) {
        document.getElementById(id)?.classList.add('hidden');
    }

    function showToast(text, type = 'info') {
        const container = document.getElementById('toastContainer');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = text;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 2500);
    }

    // ========== UNDO & REDO ==========
    function undoMove() {
        if (gameState.gameOver) return;
        if (gameState.moveHistory.length === 0) { showToast('Tidak ada langkah untuk di-undo', 'error'); return; }

        const stepsToUndo = (gameMode === 'pvc' && gameState.moveHistory.length >= 2) ? 2 : 1;
        for (let i = 0; i < stepsToUndo; i++) {
            if (gameState.moveHistory.length > 0) redoStack.push(gameState.moveHistory.pop());
        }

        loadFromFEN(INITIAL_FEN);
        const historyCopy = [...gameState.moveHistory];
        gameState.moveHistory = [];

        for (const m of historyCopy) {
            // Replay by re-fetching piece from board
            const pieceAt = gameState.board[m.fromRow][m.fromCol];
            if (!pieceAt) continue;
            const move = {
                fromRow: m.fromRow, fromCol: m.fromCol,
                toRow: m.toRow, toCol: m.toCol,
                piece: pieceAt, captured: m.captured, special: m.special
            };
            executeMove(move, true);
        }
        updateCheckStatus();
        updateGameStatus();
        renderBoard();
        updateMoveHistoryUI();
        updateCapturedUI();
        updatePlayerStatusUI();
        showToast('Undo berhasil', 'success');
    }

    function redoMove() {
        if (redoStack.length === 0) { showToast('Tidak ada langkah untuk di-redo', 'error'); return; }
        const moveData = redoStack.pop();
        const pieceAt = gameState.board[moveData.fromRow][moveData.fromCol];
        if (!pieceAt) { showToast('Tidak bisa redo', 'error'); return; }
        const move = {
            fromRow: moveData.fromRow, fromCol: moveData.fromCol,
            toRow: moveData.toRow, toCol: moveData.toCol,
            piece: pieceAt, captured: moveData.captured, special: moveData.special
        };
        const result = executeMove(move, true);
        if (result.needsPromotion) promotePawn(result.move, 'queen');
        finalizeMove();
        showToast('Redo berhasil', 'success');
    }

    // ========== UI UPDATES ==========
    function updateGameStatus() {
        const statusEl = document.getElementById('gameStatusText');
        const subEl = document.getElementById('gameSubStatus');
        if (!statusEl || !subEl) return;

        if (gameState.gameOver) {
            if (gameState.isCheckmate) {
                const winner = gameState.gameResult === 'white' ? 'Putih' : 'Hitam';
                statusEl.textContent = `🏆 ${winner} Menang - Checkmate!`;
            } else if (gameState.isStalemate) {
                statusEl.textContent = '🤝 Stalemate';
            } else {
                statusEl.textContent = '🏁 Game Over';
            }
            subEl.textContent = '';
        } else if (gameState.isCheck) {
            statusEl.textContent = '⚠️ Check!';
            subEl.textContent = `${gameState.currentPlayer === 'white' ? 'White' : 'Black'} harus melindungi raja`;
        } else {
            statusEl.textContent = `${gameState.currentPlayer === 'white' ? 'White' : 'Black'} to move`;
            subEl.textContent = '';
        }
    }

    function updatePlayerStatusUI() {
        const wStatus = document.getElementById('whiteStatus');
        const bStatus = document.getElementById('blackStatus');
        if (!wStatus || !bStatus) return;

        if (aiThinking && gameState.currentPlayer !== playerColor) {
            if (gameState.currentPlayer === 'white') wStatus.textContent = 'Thinking...';
            else bStatus.textContent = 'Thinking...';
            return;
        }

        wStatus.className = 'player-status' + (gameState.currentPlayer === 'white' ? ' active' : '');
        bStatus.className = 'player-status' + (gameState.currentPlayer === 'black' ? ' active' : '');
        wStatus.textContent = gameState.currentPlayer === 'white' ? 'Your turn' : 'Waiting';
        bStatus.textContent = gameState.currentPlayer === 'black' ? 'Your turn' : 'Waiting';
    }

    function updateCapturedUI() {
        const wCap = document.getElementById('whiteCaptured');
        const bCap = document.getElementById('blackCaptured');
        if (!wCap || !bCap) return;
        wCap.innerHTML = '';
        bCap.innerHTML = '';
        gameState.capturedPieces.white.forEach(p => {
            const img = document.createElement('img');
            img.className = 'captured-piece';
            img.src = PIECE_ASSETS[p.color][p.type];
            img.alt = p.type;
            wCap.appendChild(img);
        });
        gameState.capturedPieces.black.forEach(p => {
            const img = document.createElement('img');
            img.className = 'captured-piece';
            img.src = PIECE_ASSETS[p.color][p.type];
            img.alt = p.type;
            bCap.appendChild(img);
        });
    }

    function updateMoveHistoryUI() {
        const historyEl = document.getElementById('moveHistory');
        if (!historyEl) return;
        historyEl.innerHTML = '';

        for (let i = 0; i < gameState.moveHistory.length; i += 2) {
            const moveNum = Math.floor(i / 2) + 1;
            const wMove = gameState.moveHistory[i];
            const bMove = gameState.moveHistory[i + 1];

            const row = document.createElement('div');
            row.className = 'move-row';

            const numCol = document.createElement('span');
            numCol.className = 'move-number';
            numCol.textContent = moveNum + '.';

            const wCol = document.createElement('span');
            wCol.className = 'move-white';
            wCol.textContent = wMove ? wMove.notation : '';

            const bCol = document.createElement('span');
            bCol.className = 'move-black';
            bCol.textContent = bMove ? bMove.notation : '';

            row.appendChild(numCol);
            row.appendChild(wCol);
            row.appendChild(bCol);
            historyEl.appendChild(row);
        }
        historyEl.scrollTop = historyEl.scrollHeight;
    }

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
        navigator.clipboard.writeText(pgn)
            .then(() => showToast('PGN disalin ke clipboard!', 'success'))
            .catch(() => showToast('Gagal menyalin PGN', 'error'));
    }

    function downloadPGN() {
        const pgn = buildPGN();
        const blob = new Blob([pgn], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'chess-game.pgn';
        a.click();
        URL.revokeObjectURL(url);
    }

    // ========== EVENT LISTENERS ==========
    document.getElementById('btnFlip')?.addEventListener('click', () => {
        boardOrientation = boardOrientation === 'white' ? 'black' : 'white';
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
        document.getElementById('newGameModal')?.classList.remove('hidden');
    });

    document.getElementById('btnCancelNewGame')?.addEventListener('click', () => hideModal('newGameModal'));

    document.getElementById('btnStartGame')?.addEventListener('click', () => {
        gameMode = document.getElementById('ngMode')?.value || 'pvp';
        playerColor = document.getElementById('ngColor')?.value || 'white';
        aiDifficulty = document.getElementById('ngDifficulty')?.value || 'medium';

        const timerVal = document.getElementById('ngTimer')?.value || '10|0';
        const [mins, inc] = timerVal.split('|').map(Number);
        timerMode = { initial: mins * 60, increment: inc };

        const selectedTheme = document.getElementById('ngBoardTheme')?.value || 'classic';
        document.documentElement.setAttribute('data-board-theme', selectedTheme);

        boardOrientation = playerColor;
        hideModal('newGameModal');
        resetGame();
    });

    document.getElementById('btnCopyPGN')?.addEventListener('click', copyPGN);
    document.getElementById('btnDownloadPGN')?.addEventListener('click', downloadPGN);

    document.getElementById('btnTheme')?.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        document.documentElement.setAttribute('data-theme', current === 'light' ? 'dark' : 'light');
    });

    document.getElementById('btnSoundToggle')?.addEventListener('click', (e) => {
        soundEnabled = !soundEnabled;
        e.currentTarget.classList.toggle('active', soundEnabled);
        showToast(soundEnabled ? 'Suara Diaktifkan' : 'Suara Dimatikan', 'info');
    });

    document.getElementById('btnImportFEN')?.addEventListener('click', () => {
        const fen = prompt('Masukkan FEN string:');
        if (fen) {
            try {
                loadFromFEN(fen.trim());
                resetTimers();
                showToast('FEN berhasil di-load', 'success');
            } catch (e) {
                showToast('Format FEN tidak valid', 'error');
            }
        }
    });

    document.getElementById('btnExportFEN')?.addEventListener('click', () => {
        const fen = exportFEN();
        navigator.clipboard.writeText(fen)
            .then(() => showToast('FEN disalin ke clipboard!', 'success'))
            .catch(() => showToast('Gagal menyalin FEN', 'error'));
    });

    document.getElementById('btnSettings')?.addEventListener('click', () => {
        document.getElementById('newGameModal')?.classList.remove('hidden');
    });

    // Close modal on overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay && overlay.id !== 'promotionModal' && overlay.id !== 'gameOverModal') {
                overlay.classList.add('hidden');
            }
        });
    });

    // ESC to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.getElementById('newGameModal')?.classList.add('hidden');
            document.getElementById('gameOverModal')?.classList.add('hidden');
        }
    });

    // Start default game
    resetGame();
});