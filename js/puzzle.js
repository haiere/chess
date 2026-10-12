/* Puzzle mode — difficulty selection, random/next/previous/daily puzzle,
   staged hints, retry on mistakes, solution reveal, session statistics
   (solved, mistakes, time, streak) persisted via AppStorage.
   Architecture: PuzzleProvider abstracts the data source so an external
   dataset (e.g. lichess puzzle DB via adapter) can replace PUZZLE_DATA
   without touching the UI. */
(function () {
    'use strict';

    const S = window.AppStorage, SFX = window.SFX;
    const DIFFICULTIES = ['easy', 'medium', 'hard', 'master'];
    const DIFF_LABEL = { easy: 'Mudah', medium: 'Menengah', hard: 'Sulit', master: 'Master' };
    const HINT_STAGES = 3;

    /* ---------------- PuzzleProvider ---------------- */
    function validatePuzzle(p) {
        if (!p || typeof p !== 'object') return false;
        if (!Chess.validateFEN(p.fen)) return false;
        if (!Array.isArray(p.solution) || p.solution.length < 1) return false;
        if (!DIFFICULTIES.includes(p.difficulty)) return false;
        try {
            let st = Chess.parseFEN(p.fen);
            for (const step of p.solution) {
                const mv = Chess.findMove(st, step);
                if (!mv) return false;
                st = Chess.applyMove(st, mv).state;
            }
        } catch (e) { return false; }
        return true;
    }

    class PuzzleProvider {
        constructor(dataset) {
            this.puzzles = (Array.isArray(dataset) ? dataset : []).filter(validatePuzzle);
            this.index = new Map(this.puzzles.map((p, i) => [p.id, i]));
        }
        byId(id) { return this.puzzles[this.index.get(id)] || null; }
        byDifficulty(diff) { return this.puzzles.filter(p => p.difficulty === diff); }
        count(diff) { return diff ? this.byDifficulty(diff).length : this.puzzles.length; }
        nextAfter(id, diff, dir) {
            const list = this.byDifficulty(diff);
            if (!list.length) return null;
            const i = list.findIndex(p => p.id === id);
            return list[(i + dir + list.length) % list.length];
        }
        random(diff, excludeIds) {
            const list = this.byDifficulty(diff).filter(p => !excludeIds.has(p.id));
            const pool = list.length ? list : this.byDifficulty(diff);
            if (!pool.length) return null;
            return pool[Math.floor(Math.random() * pool.length)];
        }
        daily(diff) {
            const list = this.byDifficulty(diff);
            if (!list.length) return null;
            const now = new Date();
            const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
            return list[dayOfYear % list.length];
        }
    }

    /* ---------------- state ---------------- */
    let provider = null;
    let puzzle = null;          // active puzzle object
    let state = null;           // engine state at current solution step
    let stepIndex = 0;          // next expected solution index
    let beforeWrong = null;     // engine state snapshot for retry
    let board = null;
    let selected = null, legalSel = [];
    let hintStage = 0;
    let hintTimer = null;

    const defaultStats = () => ({ solved: [], mistakes: 0, bestStreak: 0, streak: 0, seconds: 0 });
    let stats = S.get('puzzleStats', defaultStats());
    let seen = new Set(S.get('puzzleSeen', []));
    let sessionStart = Date.now();

    const $ = (id) => document.getElementById(id);

    function saveStats() { S.set('puzzleStats', stats); S.set('puzzleSeen', Array.from(seen)); }

    /* ---------------- rendering ---------------- */
    function activeColor() { return puzzle ? Chess.parseFEN(puzzle.fen).currentPlayer : 'white'; }

    function render() {
        const marks = { selected, legalMoves: legalSel };
        const lm = lastMovePlayed();
        if (lm) marks.lastMove = lm;
        const st = Chess.status(state);
        if (st.check) marks.checkSquare = Chess.findKing(state.board, state.currentPlayer);
        if (hintStage >= 1) {
            const from = Chess.parseSquare(puzzle.solution[stepIndex].slice(0, 2));
            if (from) marks.hintFrom = from;
        }
        if (hintStage >= 2) {
            const to = Chess.parseSquare(puzzle.solution[stepIndex].slice(2, 4));
            if (to) marks.hintTo = to;
        }
        board.setState(state, marks);
        updateStatusUI();
        updateStatsUI();
        updateNavUI();
    }
    function lastMovePlayed() {
        if (!puzzle || stepIndex === 0) return null;
        const prev = puzzle.solution[stepIndex - 1];
        const f = Chess.parseSquare(prev.slice(0, 2)), t = Chess.parseSquare(prev.slice(2, 4));
        return f && t ? { fromRow: f.row, fromCol: f.col, toRow: t.row, toCol: t.col } : null;
    }

    function updateStatusUI() {
        const el = $('pzStatus');
        if (!el) return;
        if (!puzzle) { el.textContent = 'Pilih tingkat kesulitan untuk memulai.'; return; }
        const total = Math.ceil(puzzle.solution.length / 2);
        const done = Math.ceil(stepIndex / 2);
        const who = activeColor() === 'white' ? 'Putih' : 'Hitam';
        if (stepIndex >= puzzle.solution.length) {
            el.textContent = 'Puzzle selesai — langkah benar!';
            el.className = 'pz-status success';
        } else if (beforeWrong) {
            el.textContent = 'Langkah salah. Coba lagi atau lihat petunjuk.';
            el.className = 'pz-status error';
        } else if (hintStage > 0) {
            el.textContent = `Petunjuk level ${hintStage}/${HINT_STAGES} — ${who} bergerak (${done}/${total})`;
            el.className = 'pz-status hint';
        } else {
            el.textContent = `${who} bergerak — temukan langkah terbaik (${done}/${total})`;
            el.className = 'pz-status';
        }
    }

    function updateStatsUI() {
        const el = $('pzStats');
        if (!el) return;
        const total = Math.floor((Date.now() - sessionStart) / 1000) + (stats.seconds || 0);
        el.textContent = `Diselesaikan: ${stats.solved.length} · Salah: ${stats.mistakes} · Streak: ${stats.streak} (terbaik ${stats.bestStreak}) · Waktu: ${Math.floor(total / 60)}m${total % 60}s`;
    }

    function updateNavUI() {
        const diff = $('pzDifficulty').value;
        const n = provider.count(diff);
        const info = $('pzInfo');
        if (info) {
            info.textContent = puzzle
                ? `${puzzle.title || puzzle.id} · ${DIFF_LABEL[puzzle.difficulty]} · rating ${puzzle.rating || '?'}${puzzle.themes ? ' · ' + puzzle.themes.join(', ') : ''}`
                : `${n} puzzle tersedia untuk level ${DIFF_LABEL[diff]}`;
        }
        const inProgress = puzzle && stepIndex < puzzle.solution.length && !beforeWrong;
        $('btnPzHint').disabled = !inProgress || hintStage >= HINT_STAGES;
        $('btnPzSolution').disabled = !inProgress;
        $('btnPzRetry').disabled = !beforeWrong;
        $('btnPzPrev').disabled = !provider || !provider.count(diff);
        $('btnPzNext').disabled = !provider || !provider.count(diff);
    }

    /* ---------------- flow ---------------- */
    function startPuzzle(p) {
        if (!p) { window.GameMode.toast('Tidak ada puzzle untuk level ini', 'error'); return; }
        puzzle = p;
        state = Chess.parseFEN(p.fen);
        stepIndex = 0;
        beforeWrong = null;
        selected = null; legalSel = [];
        hintStage = 0;
        if (hintTimer) { clearTimeout(hintTimer); hintTimer = null; }
        seen.add(p.id);
        saveStats();
        // orientation: side to move at bottom
        board.setOrientation(activeColor());
        render();
    }

    function expectedMove() { return puzzle.solution[stepIndex]; }

    function playSolutionStep(fromTo) {
        const mv = Chess.findMove(state, fromTo);
        if (!mv) return false;
        state = Chess.applyMove(state, mv).state;
        stepIndex++;
        selected = null; legalSel = [];
        render();
        return true;
    }

    function onSquareClick(row, col) {
        if (!puzzle || stepIndex >= puzzle.solution.length || beforeWrong) return;
        const piece = state.board[row][col];
        if (selected) {
            if (selected.row === row && selected.col === col) {
                selected = null; legalSel = []; render(); return;
            }
            const mv = legalSel.find(m => m.toRow === row && m.toCol === col);
            if (mv) {
                const uci = Chess.sqName(mv.fromRow, mv.fromCol) + Chess.sqName(mv.toRow, mv.toCol);
                const expected = expectedMove();
                // allow any legal promotion piece
                if (uci === expected || (uci + 'q') === expected) {
                    selected = null; legalSel = [];
                    handleCorrectMove(mv, expected);
                } else {
                    handleWrongMove(mv);
                }
                return;
            }
            if (piece) { selected = { row, col }; legalSel = Chess.legalMovesFrom(state, row, col); render(); return; }
            selected = null; legalSel = []; render();
        } else if (piece) {
            selected = { row, col };
            legalSel = Chess.legalMovesFrom(state, row, col);
            render();
        }
    }

    function handleCorrectMove(mv, expected) {
        state = Chess.applyMove(state, { ...mv, promotion: mv.promotion }).state;
        stepIndex++;
        SFX.play(stepIndex >= puzzle.solution.length ? 'success' : 'move');
        if (stepIndex >= puzzle.solution.length) {
            onSolved();
            render();
            return;
        }
        // auto-play opponent reply
        render();
        setTimeout(() => {
            if (!puzzle || stepIndex >= puzzle.solution.length) return;
            playSolutionStep(puzzle.solution[stepIndex]);
        }, 450);
    }

    function handleWrongMove(mv) {
        beforeWrong = state; // snapshot for retry
        state = Chess.applyMove(state, mv).state;
        stats.mistakes++;
        stats.streak = 0;
        saveStats();
        SFX.play('error');
        const to = Chess.parseSquare(expectedMove().slice(2, 4));
        board.setMarks({ ...board.marks, wrongSquare: { row: mv.toRow, col: mv.toCol } });
        window.GameMode.toast('Langkah salah — coba lagi', 'error');
        updateStatusUI();
        updateStatsUI();
        updateNavUI();
        if (hintStage === 0) hintStage = 1; // gentle first hint after a mistake
    }

    function retry() {
        if (!beforeWrong) return;
        state = beforeWrong;
        beforeWrong = null;
        selected = null; legalSel = [];
        render();
    }

    function onSolved() {
        if (!stats.solved.includes(puzzle.id)) stats.solved.push(puzzle.id);
        stats.streak++;
        stats.bestStreak = Math.max(stats.bestStreak, stats.streak);
        const total = Math.floor((Date.now() - sessionStart) / 1000);
        stats.seconds = (stats.seconds || 0) + total;
        sessionStart = Date.now();
        saveStats();
        window.GameMode.toast('Puzzle selesai! Streak ' + stats.streak, 'success');
        updateStatsUI();
    }

    /* ---------------- hints ---------------- */
    function hint() {
        if (!puzzle || stepIndex >= puzzle.solution.length || beforeWrong) return;
        hintStage = Math.min(HINT_STAGES, hintStage + 1);
        if (hintStage >= HINT_STAGES) {
            // full move revealed: briefly flash, then auto-play it
            render();
            hintTimer = setTimeout(() => {
                hintStage = 0;
                playSolutionStep(expectedMove());
            }, 900);
        } else render();
    }

    function showSolution() {
        if (!puzzle || stepIndex >= puzzle.solution.length) return;
        hintStage = 0;
        beforeWrong = null;
        const rest = [];
        for (let i = stepIndex; i < puzzle.solution.length; i++) rest.push(puzzle.solution[i]);
        stepIndex = puzzle.solution.length;
        for (const uci of rest) {
            const mv = Chess.findMove(state, uci);
            if (mv) state = Chess.applyMove(state, mv).state;
        }
        selected = null; legalSel = [];
        render();
    }

    function resetProgress() {
        if (!confirm('Reset semua progres puzzle (statistik dan puzzle yang sudah selesai)?')) return;
        stats = defaultStats();
        seen = new Set();
        sessionStart = Date.now();
        saveStats();
        render();
        window.GameMode.toast('Progres puzzle direset', 'success');
    }

    /* ---------------- boot ---------------- */
    window.PuzzleMode = {
        init() {
            provider = new PuzzleProvider(window.PUZZLE_DATA);
            board = new BoardView($('puzzleBoard'), { showCoords: S.get('coords', true), onSquareClick });
            board.onDrop = (fr, fc, tr, tc) => {
                if (!puzzle || stepIndex >= puzzle.solution.length || beforeWrong) return;
                const mv = Chess.legalMovesFrom(state, fr, fc).find(m => m.toRow === tr && m.toCol === tc);
                if (!mv) { selected = null; legalSel = []; render(); return; }
                const uci = Chess.sqName(fr, fc) + Chess.sqName(tr, tc);
                const expected = expectedMove();
                selected = null; legalSel = [];
                if (uci === expected || (uci + 'q') === expected) handleCorrectMove(mv, expected);
                else handleWrongMove(mv);
            };
            $('pzDifficulty').addEventListener('change', () => {
                startPuzzle(provider.random($('pzDifficulty').value, seen));
            });
            $('btnPzRandom').addEventListener('click', () => startPuzzle(provider.random(currentDiff(), seen)));
            $('btnPzNext').addEventListener('click', () => {
                startPuzzle(provider.nextAfter(puzzle ? puzzle.id : null, currentDiff(), +1) ||
                            provider.random(currentDiff(), new Set()));
            });
            $('btnPzPrev').addEventListener('click', () => {
                startPuzzle(provider.nextAfter(puzzle ? puzzle.id : null, currentDiff(), -1) ||
                            provider.random(currentDiff(), new Set()));
            });
            $('btnPzDaily').addEventListener('click', () => startPuzzle(provider.daily(currentDiff())));
            $('btnPzHint').addEventListener('click', hint);
            $('btnPzSolution').addEventListener('click', showSolution);
            $('btnPzRetry').addEventListener('click', retry);
            $('btnPzReset').addEventListener('click', resetProgress);
            render();
            updateStatsUI();
        },
        refreshCoords() { if (board) board.setCoords(S.get('coords', true)); }
    };
    function currentDiff() { return $('pzDifficulty').value; }
})();
