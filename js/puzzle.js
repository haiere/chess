/* Puzzle mode — difficulty selection, random/next/previous/daily puzzle,
   staged hints, retry on mistakes, solution reveal, statistics with streak,
   all persisted via AppStorage. PuzzleProvider abstracts the data source
   so an external dataset can replace PUZZLE_DATA without UI changes. */
(function () {
    'use strict';

    const S = window.AppStorage, SFX = window.SFX;
    const T = (k, p) => window.I18n.t(k, p);
    const DIFFICULTIES = ['easy', 'medium', 'hard', 'expert'];
    const DIFF_KEY = { easy: 'puzzle.easy', medium: 'puzzle.medium', hard: 'puzzle.hard', expert: 'puzzle.expert' };
    const HINT_STAGES = 3;
    const MAX_SEEN = 300;

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
            const all = this.byDifficulty(diff);
            const fresh = all.filter(p => !excludeIds.has(p.id));
            const pool = fresh.length ? fresh : all;
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

    let provider = null;
    let puzzle = null;
    let state = null;
    let stepIndex = 0;
    let beforeWrong = null;
    let board = null;
    let selected = null, legalSel = [];
    let hintStage = 0;
    let hintTimer = null;

    const defaultStats = () => ({ solved: [], mistakes: 0, bestStreak: 0, streak: 0, seconds: 0 });
    let stats = S.get('puzzleStats', defaultStats());
    if (!stats || typeof stats !== 'object' || !Array.isArray(stats.solved)) stats = defaultStats();
    let seen = new Set(Array.isArray(S.get('puzzleSeen', [])) ? S.get('puzzleSeen', []) : []);
    let sessionStart = Date.now();

    const $ = (id) => document.getElementById(id);
    function saveStats() { S.set('puzzleStats', stats); S.set('puzzleSeen', Array.from(seen)); }

    function activeColor() { return puzzle ? Chess.parseFEN(puzzle.fen).currentPlayer : 'white'; }
    function currentDiff() { return $('pzDifficulty').value; }

    function lastMovePlayed() {
        if (!puzzle || stepIndex === 0) return null;
        const prev = puzzle.solution[stepIndex - 1];
        const f = Chess.parseSquare(prev.slice(0, 2)), t = Chess.parseSquare(prev.slice(2, 4));
        return f && t ? { fromRow: f.row, fromCol: f.col, toRow: t.row, toCol: t.col } : null;
    }

    function render() {
        if (!state) { updateStatusUI(); updateStatsUI(); updateNavUI(); return; }
        const marks = { selected, legalMoves: legalSel };
        const lm = lastMovePlayed();
        if (lm) marks.lastMove = lm;
        const st = Chess.status(state);
        if (st.check) marks.checkSquare = Chess.findKing(state.board, state.currentPlayer);
        if (hintStage >= 1 && stepIndex < puzzle.solution.length) {
            const from = Chess.parseSquare(puzzle.solution[stepIndex].slice(0, 2));
            if (from) marks.hintFrom = from;
        }
        if (hintStage >= 2 && stepIndex < puzzle.solution.length) {
            const to = Chess.parseSquare(puzzle.solution[stepIndex].slice(2, 4));
            if (to) marks.hintTo = to;
        }
        board.setState(state, marks);
        updateStatusUI();
        updateStatsUI();
        updateNavUI();
    }

    function updateStatusUI() {
        const el = $('pzStatus');
        if (!el) return;
        if (!puzzle) { el.textContent = T('puzzle.pick'); el.className = 'pz-status'; return; }
        const total = Math.ceil(puzzle.solution.length / 2);
        const done = Math.ceil(stepIndex / 2);
        const colorKey = activeColor() === 'white' ? 'game.white' : 'game.black';
        if (stepIndex >= puzzle.solution.length) {
            el.textContent = T('puzzle.solved');
            el.className = 'pz-status success';
        } else if (beforeWrong) {
            el.textContent = T('puzzle.wrong');
            el.className = 'pz-status error';
        } else if (hintStage > 0) {
            el.textContent = T('puzzle.hintStatus', { level: hintStage, max: HINT_STAGES, color: T(colorKey), done, total });
            el.className = 'pz-status hint';
        } else {
            el.textContent = T('puzzle.inProgress', { color: T(colorKey), done, total });
            el.className = 'pz-status';
        }
    }

    function updateStatsUI() {
        const el = $('pzStats');
        if (!el) return;
        const total = Math.floor((Date.now() - sessionStart) / 1000) + (stats.seconds || 0);
        el.textContent = T('puzzle.statsLine', {
            solved: stats.solved.length, mistakes: stats.mistakes,
            streak: stats.streak, best: stats.bestStreak,
            minutes: Math.floor(total / 60), seconds: total % 60
        });
    }

    function updateNavUI() {
        if (!provider) return;
        const diff = currentDiff();
        const n = provider.count(diff);
        const info = $('pzInfo');
        if (info) {
            info.textContent = puzzle
                ? T('puzzle.info', {
                    title: (window.I18n.lang === 'en' && puzzle.title_en) ? puzzle.title_en : (puzzle.title || puzzle.id),
                    difficulty: T(DIFF_KEY[puzzle.difficulty]),
                    rating: puzzle.rating || '?',
                    themes: puzzle.themes ? ' · ' + puzzle.themes.join(', ') : ''
                  })
                : T('puzzle.available', { count: n, label: T(DIFF_KEY[diff]) });
        }
        const inProgress = puzzle && stepIndex < puzzle.solution.length && !beforeWrong;
        $('btnPzHint').disabled = !inProgress || hintStage >= HINT_STAGES;
        $('btnPzSolution').disabled = !inProgress;
        $('btnPzRetry').disabled = !beforeWrong;
        $('btnPzPrev').disabled = !n;
        $('btnPzNext').disabled = !n;
    }

    function startPuzzle(p) {
        if (!p) { window.GameMode.toast(T('puzzle.noPuzzles'), 'error'); return; }
        puzzle = p;
        state = Chess.parseFEN(p.fen);
        stepIndex = 0;
        beforeWrong = null;
        selected = null; legalSel = [];
        hintStage = 0;
        if (hintTimer) { clearTimeout(hintTimer); hintTimer = null; }
        try { S.set('lastPuzzle', p.id); } catch (e) {}
        seen.add(p.id);
        if (seen.size > MAX_SEEN) {
            const keep = new Set(stats.solved);
            seen = keep.size ? keep : new Set(Array.from(seen).slice(-50));
        }
        saveStats();
        board.setOrientation(activeColor());
        render();
        renderBrowseList();
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

    function tryUserMove(mv) {
        const uci = Chess.sqName(mv.fromRow, mv.fromCol) + Chess.sqName(mv.toRow, mv.toCol);
        const expected = expectedMove();
        selected = null; legalSel = [];
        if (uci === expected || uci + 'q' === expected) handleCorrectMove(mv);
        else handleWrongMove(mv);
    }

    function onSquareClick(row, col) {
        if (!puzzle || stepIndex >= puzzle.solution.length || beforeWrong) return;
        const piece = state.board[row][col];
        if (selected) {
            if (selected.row === row && selected.col === col) {
                selected = null; legalSel = []; render(); return;
            }
            const mv = legalSel.find(m => m.toRow === row && m.toCol === col);
            if (mv) { tryUserMove(mv); return; }
            if (piece) { selected = { row, col }; legalSel = Chess.legalMovesFrom(state, row, col); render(); return; }
            selected = null; legalSel = []; render();
        } else if (piece) {
            selected = { row, col };
            legalSel = Chess.legalMovesFrom(state, row, col);
            render();
        }
    }

    function handleCorrectMove(mv) {
        state = Chess.applyMove(state, mv).state;
        stepIndex++;
        SFX.play(stepIndex >= puzzle.solution.length ? 'success' : 'move');
        if (stepIndex >= puzzle.solution.length) {
            onSolved();
            render();
            return;
        }
        render();
        setTimeout(() => {
            if (!puzzle || stepIndex >= puzzle.solution.length) return;
            playSolutionStep(puzzle.solution[stepIndex]);
        }, 450);
    }

    function handleWrongMove(mv) {
        beforeWrong = state;
        state = Chess.applyMove(state, mv).state;
        stats.mistakes++;
        stats.streak = 0;
        saveStats();
        SFX.play('error');
        board.setMarks({ ...board.marks, wrongSquare: { row: mv.toRow, col: mv.toCol } });
        window.GameMode.toast(T('puzzle.toastWrong'), 'error');
        updateStatusUI();
        updateStatsUI();
        updateNavUI();
        if (hintStage === 0) hintStage = 1;
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
        window.GameMode.toast(T('puzzle.toastSolved', { streak: stats.streak }), 'success');
        updateStatsUI();
    }

    function hint() {
        if (!puzzle || stepIndex >= puzzle.solution.length || beforeWrong) return;
        hintStage = Math.min(HINT_STAGES, hintStage + 1);
        if (hintStage >= HINT_STAGES) {
            render();
            if (hintTimer) clearTimeout(hintTimer);
            hintTimer = setTimeout(() => {
                hintTimer = null;
                hintStage = 0;
                playSolutionStep(expectedMove());
            }, 900);
        } else render();
    }

    function showSolution() {
        if (!puzzle || stepIndex >= puzzle.solution.length) return;
        hintStage = 0;
        beforeWrong = null;
        for (let i = stepIndex; i < puzzle.solution.length; i++) {
            const mv = Chess.findMove(state, puzzle.solution[i]);
            if (mv) state = Chess.applyMove(state, mv).state;
        }
        stepIndex = puzzle.solution.length;
        selected = null; legalSel = [];
        render();
    }

    function resetProgress() {
        if (!confirm(T('puzzle.resetConfirm'))) return;
        stats = defaultStats();
        seen = new Set();
        sessionStart = Date.now();
        saveStats();
        render();
        window.GameMode.toast(T('learning.resetToast'), 'success');
    }

    function renderBrowseList() {
        const listEl = $('puzzleList');
        if (!listEl || !provider) return;
        const q = (window.__puzzleQ || '').toLowerCase();
        const favOnly = !!window.__puzzleFav;
        let diff = 'all';
        try { diff = currentDiff(); } catch (e) {}
        const items = provider.puzzles.filter((p) => {
            if (diff !== 'all' && p.difficulty !== diff) return false;
            if (favOnly && !(window.Favorites && Favorites.has('puzzle', p.id))) return false;
            const hay = ((p.title_en || p.title || '') + ' ' + p.id + ' ' + (p.themes || []).join(' ')).toLowerCase();
            return !q || hay.indexOf(q) >= 0;
        });
        listEl.innerHTML = '';
        if (!items.length) {
            const box = document.createElement('div');
            box.className = 'state-box';
            box.setAttribute('role', 'status');
            const pEl = document.createElement('p');
            pEl.textContent = T('search.noResults');
            box.appendChild(pEl);
            listEl.appendChild(box);
            return;
        }
        for (const p of items) {
            const row = document.createElement('button');
            row.type = 'button';
            row.className = 'item-row' + (puzzle && puzzle.id === p.id ? ' active' : '');
            row.setAttribute('role', 'listitem');
            const label = (window.I18n && window.I18n.lang === 'en' && p.title_en) ? p.title_en : (p.title || p.id);
            const body = document.createElement('span');
            body.className = 'item-body';
            const t = document.createElement('strong');
            t.textContent = label;
            const meta = document.createElement('small');
            meta.textContent = p.id + ' \u00b7 ' + T(DIFF_KEY[p.difficulty] || 'puzzle.difficulty') + (p.rating ? ' \u00b7 ' + p.rating : '');
            body.append(t, meta);
            const star = document.createElement('span');
            star.className = 'fav-btn' + ((window.Favorites && Favorites.has('puzzle', p.id)) ? ' on' : '');
            star.textContent = '\u2605';
            star.setAttribute('aria-label', T('favorites.add'));
            const onFav = (ev) => {
                if (ev) { ev.stopPropagation(); ev.preventDefault(); }
                if (!window.Favorites) return;
                const on = Favorites.toggle('puzzle', p.id);
                star.classList.toggle('on', on);
                if (window.GameMode && GameMode.toast) GameMode.toast(T(on ? 'favorites.added' : 'favorites.removed'), 'success');
                if (window.__puzzleFav && !on) renderBrowseList();
            };
            star.addEventListener('click', onFav);
            row.append(body, star);
            row.addEventListener('click', () => startPuzzle(p));
            listEl.appendChild(row);
        }
    }

    window.PuzzleMode = {
        init() {
            provider = new PuzzleProvider(window.PUZZLE_DATA);
            board = new BoardView($('puzzleBoard'), { showCoords: S.get('coords', true), onSquareClick });
            board.onDrop = (fr, fc, tr, tc) => {
                if (!puzzle || stepIndex >= puzzle.solution.length || beforeWrong) return;
                const mv = Chess.legalMovesFrom(state, fr, fc).find(m => m.toRow === tr && m.toCol === tc);
                if (!mv) { selected = null; legalSel = []; render(); return; }
                tryUserMove(mv);
            };
            const qIn = document.getElementById('puzzle-search');
            if (qIn && !qIn.__bound) { qIn.__bound = true;
                qIn.addEventListener('input', () => { window.__puzzleQ = qIn.value; renderBrowseList(); }); }
            const favChk = document.getElementById('puzzle-fav-only');
            if (favChk && !favChk.__bound) { favChk.__bound = true;
                favChk.addEventListener('change', () => { window.__puzzleFav = favChk.checked; renderBrowseList(); }); }
            $('pzDifficulty').addEventListener('change', () => { startPuzzle(provider.random(currentDiff(), seen)); renderBrowseList(); });
            $('btnPzRandom').addEventListener('click', () => startPuzzle(provider.random(currentDiff(), seen)));
            $('btnPzNext').addEventListener('click', () => {
                const nxt = provider.nextAfter(puzzle ? puzzle.id : null, currentDiff(), +1) ||
                            provider.random(currentDiff(), new Set());
                startPuzzle(nxt);
                try { location.hash = '/puzzle/' + nxt.id; } catch (e) {}
            });
            $('btnPzPrev').addEventListener('click', () => {
                const prv = provider.nextAfter(puzzle ? puzzle.id : null, currentDiff(), -1) ||
                            provider.random(currentDiff(), new Set());
                startPuzzle(prv);
                try { location.hash = '/puzzle/' + prv.id; } catch (e) {}
            });
            $('btnPzDaily').addEventListener('click', () => startPuzzle(provider.daily(currentDiff())));
            $('btnPzHint').addEventListener('click', hint);
            $('btnPzSolution').addEventListener('click', showSolution);
            $('btnPzRetry').addEventListener('click', retry);
            $('btnPzReset').addEventListener('click', resetProgress);
            render();
            updateStatsUI();
        },
        selectPuzzle(id) {
            try {
                const p = provider && provider.all.find(x => x.id === id);
                if (!p) return;
                if (puzzle && puzzle.id === id) return; // sudah aktif
                startPuzzle(p);
            } catch (e) { console.warn('[PuzzleMode] selectPuzzle:', e); }
        },
        solvedCount() { try { return (S.get('puzzleSeen', []) || []).length; } catch (e) { return 0; } },
        refreshCoords() { if (board) board.setCoords(S.get('coords', true)); },
        rerender() { render(); }
    };
})();
