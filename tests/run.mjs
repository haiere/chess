/* Node test suite — run with: node tests/run.mjs */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
globalThis.window = globalThis;
for (const f of ['engine.js', 'puzzle-data.js', 'lessons-data.js']) {
    try { eval(readFileSync(join(root, 'js', f), 'utf8')); } catch (e) { if (f !== 'lessons-data.js') throw e; }
}

const Chess = globalThis.Chess;
let passed = 0, failed = 0;
const failures = [];
function ok(cond, name, extra) {
    if (cond) passed++;
    else { failed++; failures.push(name + (extra ? ' — ' + extra : '')); }
}
function section(t) { console.log('\n== ' + t + ' =='); }

/* 1. initial position */
section('initial position');
{
    const s = Chess.initialState();
    ok(Chess.allLegalMoves(s, 'white').length === 20, '20 legal moves');
    ok(Chess.toFEN(s) === Chess.INITIAL_FEN, 'FEN round-trip');
    const st = Chess.status(s);
    ok(!st.check && !st.over, 'quiet');
}

/* 2. fool's mate */
section("fool's mate");
{
    let s = Chess.initialState();
    for (const m of ['f2f3', 'e7e5', 'g2g4']) s = Chess.applyMove(s, Chess.findMove(s, m)).state;
    const mate = Chess.findMove(s, 'd8h4');
    ok(!!mate, 'Qh4 exists');
    const r = Chess.applyMove(s, mate);
    ok(r.move.san === 'Qh4#', 'SAN Qh4#', r.move.san);
    ok(Chess.status(r.state).checkmate, 'mate detected');
}

/* 3. scholar's mate */
section("scholar's mate");
{
    let s = Chess.initialState();
    for (const m of ['e2e4', 'e7e5', 'f1c4', 'b8c6', 'd1h5', 'g8f6']) s = Chess.applyMove(s, Chess.findMove(s, m)).state;
    const mate = Chess.findMove(s, 'h5f7');
    const r = Chess.applyMove(s, mate);
    ok(r.move.san === 'Qxf7#', 'SAN Qxf7#', r.move.san);
    ok(Chess.status(r.state).checkmate, 'mate');
}

/* 4. back-rank mate */
section('back-rank mate');
{
    const s = Chess.parseFEN('6k1/5ppp/8/8/8/8/8/4R1K1 w - - 0 1');
    const mv = Chess.findMove(s, 'e1e8');
    ok(mv && Chess.applyMove(s, mv).move.san === 'Re8#', 'Re8#');
}

/* 5. stalemate */
section('stalemate');
{
    const s = Chess.parseFEN('7k/5Q2/6K1/8/8/8/8/8 b - - 0 1');
    const st = Chess.status(s);
    ok(st.stalemate && st.over && st.result === 'draw', 'stalemate');
}

/* 6. castling */
section('castling');
{
    const s = Chess.parseFEN('r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R w KQkq - 0 1');
    const ks = Chess.findMove(s, 'e1g1');
    const qs = Chess.findMove(s, 'e1c1');
    ok(ks && ks.special === 'kingside-castle', 'white KS castle');
    ok(qs && qs.special === 'queenside-castle', 'white QS castle');
    const after = Chess.applyMove(s, ks).state;
    ok(after.board[7][6].type === 'king' && after.board[7][5].type === 'rook', 'castle moved');
    ok(after.castlingRights.whiteKingSide === false, 'right consumed');
    const s2 = Chess.parseFEN('r3kr1r/8/8/8/8/8/8/R3K2R w KQkq - 0 1');
    ok(!Chess.findMove(s2, 'e1g1'), 'castle through f1 check illegal');
    ok(!!Chess.findMove(s2, 'e1c1'), 'QS castle still legal');
    const s2b = Chess.parseFEN('r3k2r/8/8/8/8/8/5ppp/R3K2R w KQkq - 0 1');
    ok(Chess.isInCheck(s2b, 'white'), 'pawn check on e1');
    ok(!Chess.findMove(s2b, 'e1g1'), 'no castle out of pawn check');
    const s4 = Chess.parseFEN('4r3/8/8/8/8/8/4R3/4K3 w - - 0 1');
    ok(!Chess.findMove(s4, 'e2d2'), 'pinned rook cannot move off file');
}

/* 7. en passant */
section('en passant');
{
    const s = Chess.parseFEN('rnbqkbnr/ppp1p1pp/8/3pPp2/8/8/PPPP1PPP/RNBQKBNR w KQkq f6 0 3');
    const ep = Chess.findMove(s, 'e5f6');
    ok(ep && ep.special === 'en-passant', 'en passant move');
    const r = Chess.applyMove(s, ep);
    ok(r.move.captured && r.move.captured.type === 'pawn', 'captured pawn');
    ok(!r.state.board[3][5], 'pawn removed from f5');
    ok(r.state.board[2][5] && r.state.board[2][5].type === 'pawn', 'pawn on f6');
    ok(r.move.san.indexOf('e.p.') !== -1, 'SAN e.p.');
}

/* 8. promotion */
section('promotion');
{
    const s = Chess.parseFEN('8/P6k/8/8/8/8/8/K7 w - - 0 1');
    const mv = Chess.findMove(s, 'a7a8');
    ok(mv && mv.promotion === 'queen', 'promotion flagged');
    const r = Chess.applyMove(s, { ...mv, promotion: 'knight' });
    ok(r.state.board[0][0].type === 'knight', 'under-promotion to knight');
    ok(r.move.san.indexOf('=N') !== -1, 'SAN =N');
}

/* 9. FEN validation */
section('FEN validation');
{
    ok(Chess.validateFEN(Chess.INITIAL_FEN), 'initial valid');
    ok(!Chess.validateFEN('garbage'), 'garbage rejected');
    ok(!Chess.validateFEN('8/8/8/8/8/8/8/8 w - - 0'), 'missing field');
    ok(!Chess.validateFEN('9/8/8/8/8/8/8/8 w - - 0 1'), 'bad rank sum');
    let threw = false;
    try { Chess.parseFEN('nope'); } catch (e) { threw = true; }
    ok(threw, 'parseFEN throws');
}

/* 10. immutability */
section('immutability');
{
    const s = Chess.initialState();
    const fenBefore = Chess.toFEN(s);
    Chess.applyMove(s, Chess.findMove(s, 'e2e4'));
    ok(Chess.toFEN(s) === fenBefore, 'source unchanged');
}

/* 11. insufficient material */
section('insufficient material');
{
    ok(Chess.insufficientMaterial(Chess.parseFEN('8/8/4k3/8/8/4K3/8/8 w - - 0 1')), 'K vs K');
    ok(Chess.insufficientMaterial(Chess.parseFEN('8/8/4k3/8/8/4K3/8/3B4 w - - 0 1')), 'K+B vs K');
    ok(!Chess.insufficientMaterial(Chess.parseFEN('8/8/4k3/8/8/4K3/8/3Q4 w - - 0 1')), 'K+Q vs K not insufficient');
}

/* 12. perft */
section('perft');
{
    function perft(state, depth) {
        if (depth === 0) return 1;
        let nodes = 0;
        for (const m of Chess.allLegalMoves(state, state.currentPlayer)) nodes += perft(Chess.applyMove(state, m).state, depth - 1);
        return nodes;
    }
    ok(perft(Chess.initialState(), 3) === 8902, 'perft(3) = 8902');
    ok(perft(Chess.initialState(), 4) === 197281, 'perft(4) = 197281');
    const kiw = Chess.parseFEN('r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1');
    ok(perft(kiw, 2) === 2039, 'perft(2) Kiwipete = 2039');
}

/* 13. puzzle dataset */
section('puzzle dataset');
{
    const data = globalThis.PUZZLE_DATA;
    ok(Array.isArray(data) && data.length >= 12, 'dataset >= 12 puzzles', data ? data.length : 0);
    if (Array.isArray(data)) {
        const ids = new Set();
        const DIFFS = ['easy', 'medium', 'hard', 'expert'];
        let okCount = 0;
        for (const p of data) {
            const label = p && p.id;
            if (!p || typeof p !== 'object') { failures.push('puzzle not object'); failed++; continue; }
            ok(typeof p.id === 'string' && !ids.has(p.id), 'unique id ' + label); ids.add(p.id);
            ok(DIFFS.includes(p.difficulty), 'valid diff ' + label);
            ok(Chess.validateFEN(p.fen), 'valid FEN ' + label);
            ok(Array.isArray(p.solution) && p.solution.length >= 1, 'has solution ' + label);
            let s; try { s = Chess.parseFEN(p.fen); } catch (e) { ok(false, 'parse ' + label, e.message); continue; }
            let legal = true;
            for (const step of p.solution) {
                const mv = Chess.findMove(s, step);
                if (!mv) { legal = false; failures.push('illegal solution ' + step + ' in ' + label); failed++; break; }
                s = Chess.applyMove(s, mv).state;
            }
            if (legal) {
                okCount++;
                if (p.themes && p.themes.includes('mate')) {
                    const st = Chess.status(s);
                    ok(st.checkmate, 'mate theme ends in mate ' + label);
                }
            }
        }
        ok(okCount === data.length, 'all solutions legal (' + okCount + '/' + data.length + ')');
        for (const d of DIFFS) ok(data.some(p => p.difficulty === d), 'difficulty "' + d + '" present');
        ok(data.some(p => Chess.parseFEN(p.fen).currentPlayer === 'black'), 'black-to-move puzzle');
    }
}

/* 14. lesson data */
section('lesson data');
{
    const lessons = globalThis.LESSON_DATA;
    ok(Array.isArray(lessons) && lessons.length >= 10, 'lessons >= 10', lessons ? lessons.length : 0);
    const ids = new Set();
    for (const l of lessons) {
        ok(typeof l.id === 'string' && l.id && !ids.has(l.id), 'unique lesson id ' + l.id);
        ids.add(l.id);
        ok(Array.isArray(l.steps) && l.steps.length > 0, 'has steps ' + l.id);
        for (const s of l.steps) {
            if (s.board) ok(Chess.validateFEN(s.board), 'valid board FEN in ' + l.id + ' / ' + s.title);
            if (s.quiz) {
                ok(typeof s.quiz.question === 'string', 'quiz question ' + l.id);
                ok(Array.isArray(s.quiz.options) && s.quiz.options.length > 0, 'quiz options ' + l.id);
                ok(typeof s.quiz.answer === 'number' && s.quiz.answer >= 0 && s.quiz.answer < s.quiz.options.length,
                    'quiz answer in range ' + l.id);
            }
        }
    }
}

/* 15. DOM static consistency — ids referenced in JS must exist in HTML */
section('DOM static consistency');
{
    const html = readFileSync(join(root, 'index.html'), 'utf8');
    const idSet = new Set();
    const idRe = /id=["']([^"']+)["']/g;
    let m;
    while ((m = idRe.exec(html)) !== null) idSet.add(m[1]);
    const jsFiles = ['storage.js','audio.js','pieces.js','engine.js','board-view.js','game.js','puzzle-data.js','puzzle.js','lessons-data.js','lessons.js','app.js'];
    const missing = [];
    for (const f of jsFiles) {
        const code = readFileSync(join(root, 'js', f), 'utf8');
        const dollarRe = /\$(["'])([a-zA-Z0-9_-]+)\1/g;
        while ((m = dollarRe.exec(code)) !== null) {
            const id = m[2];
            if (!idSet.has(id)) missing.push(f + ': $("' + id + '")');
        }
    }
    if (missing.length) { console.log('Missing IDs:\n  ' + missing.join('\n  ')); }
    ok(missing.length === 0, 'all $() ids exist in HTML', missing.length + ' missing');
}


/* 16. i18n validation */
section('i18n');
{
    const idJson = JSON.parse(readFileSync(join(root, 'locales', 'id.json'), 'utf8'));
    const enJson = JSON.parse(readFileSync(join(root, 'locales', 'en.json'), 'utf8'));

    // flatten key sets
    function flatten(obj, prefix, out) {
        out = out || new Set();
        for (const k of Object.keys(obj)) {
            const v = obj[k];
            const key = prefix ? prefix + '.' + k : k;
            if (v && typeof v === 'object') flatten(v, key, out);
            else out.add(key);
        }
        return out;
    }
    const idKeys = flatten(idJson);
    const enKeys = flatten(enJson);
    ok(idKeys.size > 100, 'id locale has >100 keys', idKeys.size);
    ok(idKeys.size === enKeys.size, 'same key count id/en', idKeys.size + ' vs ' + enKeys.size);
    const missingInEn = [...idKeys].filter(k => !enKeys.has(k));
    const missingInId = [...enKeys].filter(k => !idKeys.has(k));
    ok(missingInEn.length === 0, 'no keys missing in en', missingInEn.slice(0, 5).join(','));
    ok(missingInId.length === 0, 'no keys missing in id', missingInId.slice(0, 5).join(','));

    // placeholder parity: every {x} in id must exist in en for same key
    const idFlat = {};
    (function walk(o, p) { for (const k in o) { const key = p ? p + '.' + k : k; if (o[k] && typeof o[k] === 'object') walk(o[k], key); else idFlat[key] = o[k]; } })(idJson, '');
    const enFlat = {};
    (function walk(o, p) { for (const k in o) { const key = p ? p + '.' + k : k; if (o[k] && typeof o[k] === 'object') walk(o[k], key); else enFlat[key] = o[k]; } })(enJson, '');
    let placeholderMismatch = [];
    for (const k of idKeys) {
        const pi = (idFlat[k].match(/\{(\w+)\}/g) || []).sort().join(',');
        const pe = ((enFlat[k] || '').match(/\{(\w+)\}/g) || []).sort().join(',');
        if (pi !== pe) placeholderMismatch.push(k);
    }
    ok(placeholderMismatch.length === 0, 'placeholder parity id/en', placeholderMismatch.slice(0, 5).join(','));

    // all data-i18n / data-i18n-aria keys used in index.html must exist
    const html = readFileSync(join(root, 'index.html'), 'utf8');
    const usedKeys = new Set();
    const attrRe = /data-i18n(?:-aria)?="([^"]+)"/g;
    let mm;
    while ((mm = attrRe.exec(html)) !== null) usedKeys.add(mm[1]);
    const missingHtml = [...usedKeys].filter(k => !idKeys.has(k));
    ok(missingHtml.length === 0, 'all HTML i18n keys exist', missingHtml.slice(0, 5).join(','));

    // all t('...') literals in js must exist
    const jsFiles = ['game.js', 'puzzle.js', 'lessons.js', 'app.js', 'board-view.js', 'i18n.js'];
    const tRe = /\bT\('([a-z][\w.]+)'/g;
    const tRe2 = /I18n\.t\('([a-z][\w.]+)'/g;
    const usedJs = new Set();
    for (const f of jsFiles) {
        if (f === 'i18n.js') continue; // usage examples live in comments
        let code = readFileSync(join(root, 'js', f), 'utf8');
        code = code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
        while ((mm = tRe.exec(code)) !== null) usedJs.add(mm[1]);
        while ((mm = tRe2.exec(code)) !== null) usedJs.add(mm[1]);
    }
    const missingJs = [...usedJs].filter(k => !idKeys.has(k) && !k.endsWith('.'));
    ok(missingJs.length === 0, 'all JS t() keys exist', missingJs.slice(0, 8).join(','));

    // dynamic keys built via T(colorKey) pattern: verify game.white/black etc exist
    for (const k of ['game.white','game.black','pieces.white','pieces.black','pieces.king','pieces.queen','pieces.rook','pieces.bishop','pieces.knight','pieces.pawn'])
        ok(idKeys.has(k), 'dynamic key exists: ' + k);

    // locales.js must be in sync with JSON
    const gen = readFileSync(join(root, 'js', 'locales.js'), 'utf8');
    ok(gen.indexOf('"undo"') !== -1 && gen.length > 5000, 'js/locales.js generated and non-trivial');
}

console.log('\n========================================');
console.log('PASSED: ' + passed + '  FAILED: ' + failed);
if (failures.length) {
    console.log('\nFailures:');
    for (const f of failures) console.log('  ✗ ' + f);
    process.exit(1);
}
console.log('ALL TESTS PASSED');
