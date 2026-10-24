/* Game mode — Player vs Player and Player vs Computer. */
(function () {
    'use strict';

    const S = window.AppStorage, SFX = window.SFX;
    const T = (k, p) => window.I18n ? window.I18n.t(k, p) : k;

    let gameMode = S.get('mode', 'pvp');
    let playerColor = S.get('playerColor', 'white');
    let aiDifficulty = S.get('difficulty', 'medium');
    let timerMode = S.get('timerMode', { initial: 600, increment: 0 });
    if (typeof timerMode !== 'object' || timerMode === null) timerMode = { initial: 600, increment: 0 };
    let showCoordinates = S.get('coords', true);
    let soundEnabled = S.get('sound', true);

    let current = null;
    let history = [];
    let future = [];
    let lastMove = null;
    let statusInfo = null;
    let boardOrientation = S.get('orientation', 'white');
    let timers = { white: timerMode.initial, black: timerMode.initial };
    let timerInterval = null;
    let aiTimeoutId = null;
    let aiThinking = false;
    let selected = null;
    let legalSel = [];
    let board = null;

    const $ = (id) => document.getElementById(id);

    function toast(text, type) {
        const c = $('toastContainer');
        if (!c) return;
        const t = document.createElement('div');
        t.className = 'toast ' + (type || 'info');
        t.textContent = text;
        c.appendChild(t);
        setTimeout(() => t.remove(), 2600);
    }
    function showModal(id) {
        const el = $(id);
        if (!el) return;
        el.classList.remove('hidden');
        el.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
    }
    function hideModal(id) {
        const el = $(id);
        if (!el) return;
        el.classList.add('hidden');
        el.setAttribute('aria-hidden', 'true');
        if (!document.querySelector('.modal-overlay:not(.hidden)')) document.body.classList.remove('modal-open');
    }

    function applyTheme(theme) {
        if (theme === 'system') {
            const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
        } else document.documentElement.setAttribute('data-theme', theme);
        S.set('theme', theme);
        const sel = $('setTheme'); if (sel) sel.value = theme;
    }
    function applyBoardTheme(theme) {
        document.documentElement.setAttribute('data-board-theme', theme);
        S.set('boardTheme', theme);
        const s1 = $('setBoardTheme'); if (s1) s1.value = theme;
        const s2 = $('ngBoardTheme'); if (s2) s2.value = theme;
    }
    function initTheme() {
        applyTheme(S.get('theme', 'system'));
        applyBoardTheme(S.get('boardTheme', 'classic'));
        try {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
                if (S.get('theme', 'system') === 'system') applyTheme('system');
            });
        } catch (e) { }
    }

    function refreshStatus() {
        if (!window.Chess) return;
        statusInfo = window.Chess.status(current);
        if (statusInfo.over && statusInfo.stalemate && window.Chess.insufficientMaterial(current)) statusInfo.result = 'draw';
    }

    function render() {
        if (!current) return;
        refreshStatus();
        const checkSquare = statusInfo.check && window.Chess.findKing ? window.Chess.findKing(current.board, current.currentPlayer) : null;
        
        if (board) {
            board.setState(current, { selected, legalMoves: legalSel, lastMove, checkSquare });
        }
        updateStatusUI();
        updatePlayersUI();
        updateCapturedUI();
        updateHistoryUI();
        updateTimerUI();
    }

    function updateStatusUI() {
        const s = $('gameStatusText'), sub = $('gameSubStatus');
        if (!s || !sub) return;
        if (statusInfo.over) {
            if (statusInfo.checkmate) s.textContent = T('game.checkmateWin', { color: T(statusInfo.result === 'white' ? 'game.white' : 'game.black') });
            else if (statusInfo.stalemate) s.textContent = T('game.stalemate');
            else s.textContent = T('game.gameOver');
            sub.textContent = '';
        } else if (statusInfo.check) {
            s.textContent = T('game.statusCheck');
            sub.textContent = T('game.statusProtect', { color: T(current.currentPlayer === 'white' ? 'game.white' : 'game.black') });
        } else {
            s.textContent = T(current.currentPlayer === 'white' ? 'game.whiteToMove' : 'game.blackToMove');
            sub.textContent = '';
        }
        const gs = document.getElementById('game-status');
        if (gs) gs.textContent = sub.textContent ? s.textContent + ' — ' + sub.textContent : s.textContent;
    }

    function updatePlayersUI() {
        const w = $('whiteStatus'), b = $('blackStatus');
        if (!w || !b) return;
        w.className = 'player-status'; b.className = 'player-status';
        w.classList.toggle('active', current.currentPlayer === 'white' && !statusInfo.over);
        b.classList.toggle('active', current.currentPlayer === 'black' && !statusInfo.over);
        if (aiThinking) {
            (current.currentPlayer === 'white' ? w : b).textContent = T('game.thinking');
            return;
        }
        if (gameMode === 'pvc') {
            w.textContent = current.currentPlayer === 'white' ? (playerColor === 'white' ? T('game.yourTurn') : T('game.computer')) : T('game.waiting');
            b.textContent = current.currentPlayer === 'black' ? (playerColor === 'black' ? T('game.yourTurn') : T('game.computer')) : T('game.waiting');
        } else {
            w.textContent = current.currentPlayer === 'white' ? T('game.yourTurn') : T('game.waiting');
            b.textContent = current.currentPlayer === 'black' ? T('game.yourTurn') : T('game.waiting');
        }
    }

    function updateCapturedUI() {
        const w = $('whiteCaptured'), b = $('blackCaptured');
        if (!w || !b || !window.ChessPieces) return;
        w.innerHTML = ''; b.innerHTML = '';
        for (const f of history) {
            if (f.move.captured) {
                const img = document.createElement('img');
                img.className = 'captured-piece';
                img.src = window.ChessPieces[f.move.captured.color][f.move.captured.type];
                img.alt = f.move.captured.type;
                (f.move.captured.color === 'black' ? w : b).appendChild(img);
            }
        }
    }

    function updateHistoryUI() {
        const ol = document.getElementById('move-history');
        if (ol) {
            ol.innerHTML = '';
            for (let i = 0; i < history.length; i += 2) {
                const row = document.createElement('li');
                row.className = 'move-row';
                const n = document.createElement('span'); n.className = 'move-number'; n.textContent = (Math.floor(i / 2) + 1) + '.';
                const ws = document.createElement('span'); ws.className = 'move-white'; ws.textContent = history[i] ? history[i].move.san : '';
                const bs = document.createElement('span'); bs.className = 'move-black'; bs.textContent = history[i + 1] ? history[i + 1].move.san : '';
                row.append(n, ws, bs);
                ol.appendChild(row);
            }
            ol.scrollTop = ol.scrollHeight;
        }
    }

    function formatTime(s) {
        if (s <= 0) return '00:00';
        return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
    }
    function updateTimerUI() {
        const w = $('whiteTimer'), b = $('blackTimer');
        if (!w || !b) return;
        w.textContent = formatTime(timers.white);
        b.textContent = formatTime(timers.black);
        w.classList.toggle('low-time', timerMode.initial > 0 && timers.white <= 30 && timers.white > 0);
        b.classList.toggle('low-time', timerMode.initial > 0 && timers.black <= 30 && timers.black > 0);
    }

    function stopTimer() { if (timerInterval) { clearInterval(timerInterval); timerInterval = null; } }
    function startTimer() {
        stopTimer();
        if (timerMode.initial === 0 || (statusInfo && statusInfo.over)) return;
        timerInterval = setInterval(() => {
            if (statusInfo.over) { stopTimer(); return; }
            const active = current.currentPlayer;
            timers[active]--;
            if (timers[active] <= 0) {
                timers[active] = 0;
                refreshStatus();
                statusInfo.over = true;
                statusInfo.result = active === 'white' ? 'black' : 'white';
                updateTimerUI(); stopTimer();
                render();
                onGameOver(true);
            } else updateTimerUI();
        }, 1000);
    }
    function resetTimers() {
        timers.white = timerMode.initial;
        timers.black = timerMode.initial;
        updateTimerUI(); stopTimer();
        if (timerMode.initial > 0) startTimer();
    }

    const VALUES = { pawn: 100, knight: 320, bishop: 330, rook: 500, queen: 900, king: 0 };
    function evaluate(st) {
        let s = 0;
        for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
            const p = st.board[r][c];
            if (p) s += (p.color === 'white' ? 1 : -1) * VALUES[p.type];
        }
        return s;
    }
    function minimax(state, depth, alpha, beta, isMax) {
        if (depth === 0) return evaluate(state);
        const moves = window.Chess.allLegalMoves(state, state.currentPlayer);
        if (moves.length === 0) {
            return window.Chess.isInCheck(state, state.currentPlayer) ? (isMax ? -99999 : 99999) : 0;
        }
        if (isMax) {
            let best = -Infinity;
            for (const m of moves) {
                const v = minimax(window.Chess.applyMove(state, m).state, depth - 1, alpha, beta, false);
                if (v > best) best = v;
                if (v > alpha) alpha = v;
                if (beta <= alpha) break;
            }
            return best;
        }
        let best = Infinity;
        for (const m of moves) {
            const v = minimax(window.Chess.applyMove(state, m).state, depth - 1, alpha, beta, true);
            if (v < best) best = v;
            if (v < beta) beta = v;
            if (beta <= alpha) break;
        }
        return best;
    }
    function chooseAIMove() {
        const color = current.currentPlayer;
        const moves = window.Chess.allLegalMoves(current, color);
        if (!moves.length) return null;
        if (aiDifficulty === 'easy') return moves[Math.floor(Math.random() * moves.length)];
        for (let i = moves.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [moves[i], moves[j]] = [moves[j], moves[i]];
        }
        const depth = aiDifficulty === 'hard' ? 3 : 2;
        const isMax = color === 'white';
        let best = moves[0], bestScore = isMax ? -Infinity : Infinity;
        for (const m of moves) {
            const v = minimax(window.Chess.applyMove(current, m).state, depth - 1, -Infinity, Infinity, !isMax);
            if (isMax ? v > bestScore : v < bestScore) { bestScore = v; best = m; }
        }
        return best;
    }
    function scheduleAI() {
        if (gameMode !== 'pvc' || current.currentPlayer === playerColor || statusInfo.over) return;
        aiThinking = true;
        updatePlayersUI();
        if (aiTimeoutId) clearTimeout(aiTimeoutId);
        aiTimeoutId = setTimeout(() => {
            aiTimeoutId = null;
            if (statusInfo.over) { aiThinking = false; updatePlayersUI(); return; }
            const mv = chooseAIMove();
            aiThinking = false;
            if (mv) playMove(mv);
            else { refreshStatus(); render(); }
        }, 350);
    }

    function playMove(move, promotion) {
        const played = promotion ? { ...move, promotion } : move;
        const r = window.Chess.applyMove(current, played);
        history.push({ state: current, move: r.move });
        future = [];
        current = r.state;
        lastMove = { fromRow: r.move.fromRow, fromCol: r.move.fromCol, toRow: r.move.toRow, toCol: r.move.toCol };
        selected = null; legalSel = [];

        if (timerMode.increment > 0 && !window.Chess.status(current).over) {
            timers[r.move.piece.color] += timerMode.increment;
        }

        refreshStatus();
        render();

        if (statusInfo.over) { stopTimer(); onGameOver(false); return; }
        if (SFX) {
            if (statusInfo.check) SFX.play('check');
            else if (r.move.special === 'kingside-castle' || r.move.special === 'queenside-castle') SFX.play('castle');
            else if (r.move.captured) SFX.play('capture');
            else SFX.play('move');
        }

        scheduleAI();
    }

    function onUserMove(move) {
        if (move.promotion) { openPromotion(move); return; }
        playMove(move);
    }

    function openPromotion(move) {
        const modal = $('promotionModal'), opts = $('promotionOptions');
        if (!modal || !opts) { playMove(move, 'queen'); return; }
        opts.innerHTML = '';
        for (const type of window.Chess.PROMOTION_TYPES) {
            const btn = document.createElement('div');
            btn.className = 'promotion-btn';
            btn.setAttribute('role', 'button');
            btn.setAttribute('tabindex', '0');
            btn.setAttribute('aria-label', T('game.promoteTo', { type }));
            if (window.ChessPieces) {
                const img = document.createElement('img');
                img.src = window.ChessPieces[move.piece.color][type];
                img.alt = type;
                btn.appendChild(img);
            }
            const choose = () => { hideModal('promotionModal'); playMove(move, type); };
            btn.addEventListener('click', choose);
            btn.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(); } });
            opts.appendChild(btn);
        }
        showModal('promotionModal');
        setTimeout(() => opts.firstElementChild && opts.firstElementChild.focus(), 50);
    }

    function onGameOver(flagTimeout) {
        stopTimer();
        if (SFX) SFX.play('game-over');
        let title, message;
        if (statusInfo.result === 'draw') {
            title = T('game.drawTitle');
            message = statusInfo.stalemate ? T('game.msgStalemate') :
                      (window.Chess.insufficientMaterial(current) ? T('game.msgInsufficient') : T('game.msgDraw'));
        } else {
            title = T(statusInfo.result === 'white' ? 'game.whiteWins' : 'game.blackWins');
            message = flagTimeout ? T('game.msgTimeout') : T('game.msgCheckmate');
        }
        const modal = $('gameOverModal'), content = $('gameOverContent');
        if (!modal || !content) return;
        content.innerHTML = '';
        const h = document.createElement('h2'); h.id = 'gameOverTitle'; h.textContent = title;
        const p = document.createElement('p'); p.textContent = message;
        const wrap = document.createElement('div'); wrap.className = 'modal-buttons';
        const rematch = mkBtn('btn accent', T('game.rematch'), () => { hideModal('gameOverModal'); resetGame(); });
        const copy = mkBtn('btn', T('game.copyPGN'), copyPGN);
        const close = mkBtn('btn', T('game.closeBtn'), () => hideModal('gameOverModal'));
        wrap.append(rematch, copy, close);
        content.append(h, p, wrap);
        showModal('gameOverModal');
        setTimeout(() => rematch.focus(), 50);
    }
    function mkBtn(cls, label, fn) {
        const b = document.createElement('button');
        b.type = 'button'; b.className = cls; b.textContent = label; b.addEventListener('click', fn);
        return b;
    }

    function onSquareClick(row, col) {
        if (statusInfo.over || aiThinking || !current) return;
        if (gameMode === 'pvc' && current.currentPlayer !== playerColor) return;
        const piece = current.board[row][col];

        if (selected) {
            if (selected.row === row && selected.col === col) {
                selected = null; legalSel = []; render(); return;
            }
            const mv = legalSel.find(m => m.toRow === row && m.toCol === col);
            if (mv) { selected = null; legalSel = []; onUserMove(mv); return; }
            if (piece && piece.color === current.currentPlayer) {
                selected = { row, col }; legalSel = window.Chess.legalMovesFrom(current, row, col); render(); return;
            }
            selected = null; legalSel = []; render();
        } else if (piece && piece.color === current.currentPlayer) {
            selected = { row, col }; legalSel = window.Chess.legalMovesFrom(current, row, col); render();
        }
    }

    function undo() {
        if (!history.length) { toast(T('game.undoEmpty'), 'error'); return; }
        stopTimer();
        if (aiTimeoutId) { clearTimeout(aiTimeoutId); aiTimeoutId = null; }
        aiThinking = false;
        const steps = (gameMode === 'pvc' && history.length >= 2) ? 2 : 1;
        for (let i = 0; i < steps && history.length; i++) {
            const f = history.pop(); future.push(f); current = f.state;
        }
        lastMove = history.length ? (() => { const m = history[history.length - 1].move; return { fromRow: m.fromRow, fromCol: m.fromCol, toRow: m.toRow, toCol: m.toCol }; })() : null;
        refreshStatus(); render();
        if (timerMode.initial > 0 && !statusInfo.over) startTimer();
        toast(T('game.undoOk'), 'success');
    }
    function redo() {
        if (!future.length) { toast(T('game.redoEmpty'), 'error'); return; }
        const steps = (gameMode === 'pvc' && future.length >= 2) ? 2 : 1;
        for (let i = 0; i < steps && future.length; i++) {
            const f = future.pop(); history.push(f); current = window.Chess.applyMove(f.state, f.move).state;
        }
        const m = history[history.length - 1].move;
        lastMove = { fromRow: m.fromRow, fromCol: m.fromCol, toRow: m.toRow, toCol: m.toCol };
        refreshStatus(); render();
        if (statusInfo.over) { stopTimer(); onGameOver(false); return; }
        scheduleAI(); toast(T('game.redoOk'), 'success');
    }

    function copyText(text, okMsg, errMsg) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => toast(okMsg, 'success')).catch(() => toast(errMsg, 'error'));
        } else toast(T('game.clipboardUnsupported'), 'error');
    }
    function buildPGN() {
        let pgn = '';
        for (let i = 0; i < history.length; i += 2) {
            const w = history[i] ? history[i].move.san : '';
            const b = history[i + 1] ? history[i + 1].move.san : '';
            pgn += (Math.floor(i / 2) + 1) + '. ' + w + ' ' + b + '\n';
        }
        if (statusInfo && statusInfo.over) {
            pgn += statusInfo.result === 'draw' ? '1/2-1/2' : (statusInfo.result === 'white' ? '1-0' : '0-1');
        }
        return pgn.trim();
    }
    function copyPGN() {
        const pgn = buildPGN();
        if (!pgn) { toast(T('game.pgnEmpty'), 'info'); return; }
        copyText(pgn, T('game.pgnCopied'), T('game.pgnCopyFail'));
    }
    function downloadPGN() {
        const pgn = buildPGN();
        if (!pgn) { toast(T('game.pgnEmpty'), 'info'); return; }
        try {
            const blob = new Blob([pgn], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a'); a.href = url; a.download = 'chess-game.pgn'; a.click();
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        } catch (e) { toast(T('game.pgnDownloadFail'), 'error'); }
    }

    function resetGame() {
        stopTimer();
        if (aiTimeoutId) { clearTimeout(aiTimeoutId); aiTimeoutId = null; }
        aiThinking = false;
        current = window.Chess.initialState();
        history = []; future = []; lastMove = null; selected = null; legalSel = [];
        refreshStatus(); render(); resetTimers(); scheduleAI();
    }
    function loadFEN(fen) {
        try {
            stopTimer();
            current = window.Chess.parseFEN(fen);
            history = []; future = []; lastMove = null; selected = null; legalSel = [];
            refreshStatus(); render(); resetTimers(); scheduleAI();
            toast(T('game.fenLoaded'), 'success');
        } catch (e) { toast(T('game.fenInvalid'), 'error'); }
    }

    function syncSettingsUI() {
        const sb = $('btnSoundToggle');
        if (sb) { sb.classList.toggle('active', soundEnabled); sb.setAttribute('aria-pressed', String(soundEnabled)); }
    }

    // --- PERBAIKAN UTAMA: Tambahkan NULL GUARDS di semua tombol ---
    function bind() {
        const addL = (id, event, fn) => { const el = $(id); if (el) el.addEventListener(event, fn); };

        addL('btnFlip', 'click', () => { boardOrientation = boardOrientation === 'white' ? 'black' : 'white'; S.set('orientation', boardOrientation); board.setOrientation(boardOrientation); });
        addL('btnUndo', 'click', undo);
        addL('btnRedo', 'click', redo);
        
        addL('btnResign', 'click', () => {
            if (statusInfo.over) return;
            if (!confirm(T('game.confirmResign'))) return;
            refreshStatus(); statusInfo.over = true; statusInfo.result = current.currentPlayer === 'white' ? 'black' : 'white';
            render(); onGameOver(false);
        });
        
        addL('btnDraw', 'click', () => {
            if (statusInfo.over) return;
            if (confirm(T('game.confirmDraw'))) {
                refreshStatus(); statusInfo.over = true; statusInfo.result = 'draw'; render(); onGameOver(false);
            }
        });

        addL('btnNewGame', 'click', () => {
            const ngMode = $('ngMode'); if (ngMode) ngMode.value = gameMode;
            const ngColor = $('ngColor'); if (ngColor) ngColor.value = playerColor;
            const ngDiff = $('ngDifficulty'); if (ngDiff) ngDiff.value = aiDifficulty;
            const ngTimer = $('ngTimer'); if (ngTimer) ngTimer.value = (timerMode.initial / 60) + '|' + timerMode.increment;
            const ngTheme = $('ngBoardTheme'); if (ngTheme) ngTheme.value = S.get('boardTheme', 'classic');
            showModal('newGameModal');
        });

        addL('btnCancelNewGame', 'click', () => hideModal('newGameModal'));
        addL('btnStartGame', 'click', () => {
            const running = history.length > 0 && !statusInfo.over;
            if (running && !confirm(T('game.confirmNewGame'))) return;
            const ngMode = $('ngMode'); if (ngMode) gameMode = ngMode.value;
            let color = $('ngColor') ? $('ngColor').value : 'white';
            if (color === 'random') color = Math.random() < 0.5 ? 'white' : 'black';
            playerColor = color;
            if ($('ngDifficulty')) aiDifficulty = $('ngDifficulty').value;
            const tv = ($('ngTimer') ? $('ngTimer').value : '10|0').split('|').map(Number);
            timerMode = { initial: (tv[0] || 0) * 60, increment: tv[1] || 0 };
            if ($('ngBoardTheme')) applyBoardTheme($('ngBoardTheme').value);
            S.set('mode', gameMode); S.set('playerColor', playerColor); S.set('difficulty', aiDifficulty); S.set('timerMode', timerMode);
            boardOrientation = playerColor; S.set('orientation', boardOrientation); board.setOrientation(boardOrientation);
            hideModal('newGameModal'); resetGame();
        });

        addL('btnCopyPGN', 'click', copyPGN);
        addL('btnDownloadPGN', 'click', downloadPGN);
        addL('btnTheme', 'click', () => {
            const cur = document.documentElement.getAttribute('data-theme') || 'dark';
            const next = cur === 'dark' ? 'light' : 'dark';
            applyTheme(next); toast(next === 'dark' ? T('game.themeDark') : T('game.themeLight'), 'info');
        });
        addL('btnSoundToggle', 'click', () => {
            soundEnabled = !soundEnabled; S.set('sound', soundEnabled);
            if (SFX) SFX.setEnabled(soundEnabled);
            syncSettingsUI(); toast(soundEnabled ? T('game.soundOn') : T('game.soundOff'), 'info');
        });
        addL('btnImportFEN', 'click', () => {
            const fen = prompt(T('game.fenPrompt'));
            if (!fen) return;
            if (!window.Chess.validateFEN(fen.trim())) { toast(T('game.fenInvalid'), 'error'); return; }
            loadFEN(fen.trim());
        });
        addL('btnExportFEN', 'click', () => copyText(window.Chess.toFEN(current), T('game.fenCopied'), T('game.fenCopyFail')));
        
        const bcf = document.getElementById('btn-copy-fen');
        if (bcf && !bcf.__bound) { bcf.__bound = true; bcf.addEventListener('click', () => copyText(window.Chess.toFEN(current), T('game.fenCopied'), T('game.fenCopyFail'))); }
        const bcp = document.getElementById('btn-copy-pgn');
        if (bcp && !bcp.__bound) { bcp.__bound = true; bcp.addEventListener('click', copyPGN); }

        document.querySelectorAll('[data-close]').forEach(btn => btn.addEventListener('click', () => hideModal(btn.dataset.close)));
        document.querySelectorAll('.modal-overlay').forEach(o => o.addEventListener('click', (e) => {
            if (e.target === o && o.id !== 'promotionModal' && o.id !== 'gameOverModal') hideModal(o.id);
        }));
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') ['newGameModal', 'promotionModal'].forEach(hideModal); });
        window.addEventListener('beforeunload', () => { stopTimer(); if (aiTimeoutId) clearTimeout(aiTimeoutId); });
    }

    window.GameMode = {
        init() {
            try {
                if (SFX) SFX.setEnabled(soundEnabled);
                const boardContainer = $('board') || $('game-board-container') || $('board-container');
                
                if (!boardContainer) {
                    throw new Error("Elemen HTML dengan ID 'board' tidak ditemukan.");
                }

                board = new window.BoardView(boardContainer, {
                    orientation: boardOrientation,
                    showCoords: showCoordinates,
                    onSquareClick
                });
                
                initTheme();
                bind();
                syncSettingsUI();
                resetGame();
                console.log("✅ Game Mode berhasil diinisialisasi.");
            } catch (err) {
                console.error("Game Init Error:", err);
                const errDiv = document.createElement('div');
                errDiv.className = 'error-state';
                errDiv.innerHTML = `<strong>Gagal memuat papan:</strong> ${err.message}`;
                const main = document.querySelector('.app-main') || document.body;
                main.prepend(errDiv);
            }
        },
        applyTheme, applyBoardTheme, syncSettingsUI, toast,
        rerender() { refreshStatus(); render(); },
        get soundEnabled() { return soundEnabled; },
        set soundEnabled(v) { soundEnabled = !!v; S.set('sound', soundEnabled); if (SFX) SFX.setEnabled(soundEnabled); },
        get showCoordinates() { return showCoordinates; },
        set showCoordinates(v) { showCoordinates = !!v; S.set('coords', showCoordinates); if (board) board.setCoords(v); }
    };
})();
