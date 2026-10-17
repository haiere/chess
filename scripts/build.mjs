// build.mjs — Production build untuk Hajir Chess (pure web, tanpa native).
// 1. Validasi seluruh data puzzle & lesson (FEN, solusi, struktur).
// 2. Validasi sinkronisasi locale id/en.
// 3. Salin artefak web statis ke dist/.
// Build GAGAL jika ada data invalid — data adalah bagian dari build.
import { readFileSync, writeFileSync, mkdirSync, cpSync, rmSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
let errors = [];
const err = (m) => { errors.push(m); console.error('  ✗ ' + m); };
const ok = (m) => console.log('  ✓ ' + m);

// ---- Mini engine checker untuk FEN/solusi (independen dari app engine) ----
const FILES = 'abcdefgh';
function parseFEN(fen) {
    const parts = fen.trim().split(/\s+/);
    if (parts.length < 4) return null;
    const rows = parts[0].split('/');
    if (rows.length !== 8) return null;
    let board = [], kings = 0;
    for (const row of rows) {
        let r = [], n = 0;
        for (const ch of row) {
            if (/[1-8]/.test(ch)) { const c = +ch; for (let i = 0; i < c; i++) r.push(null); n += c; }
            else if (/[pnbrqkPNBRQK]/.test(ch)) { r.push(ch); n++; if (ch === 'k' || ch === 'K') kings++; }
            else return null;
        }
        if (n !== 8) return null;
        board.push(r);
    }
    if (kings !== 2) return null;
    const stm = parts[1];
    if (stm !== 'w' && stm !== 'b') return null;
    return { board, stm };
}
const isW = (p) => p && p === p.toUpperCase();
function squareAt(b, sq) { const f = FILES.indexOf(sq[0]), r = 8 - +sq[1]; return (r >= 0 && r < 8 && f >= 0 && f < 8) ? b[r][f] : undefined; }
function attacks(b, r, f, byWhite) {
    const dirs = [[1,0],[-1,0],[0,1],[0,-1]], diag = [[1,1],[1,-1],[-1,1],[-1,-1]];
    for (const [dr, df] of [...dirs, ...diag]) {
        let rr = r + dr, ff = f + df;
        while (rr >= 0 && rr < 8 && ff >= 0 && ff < 8) {
            const p = b[rr][ff];
            if (p) {
                if (isW(p) === byWhite) {
                    const q = p.toLowerCase();
                    const straight = dirs.some(([a, c]) => a === dr && c === df);
                    if (q === 'q' || (straight ? q === 'r' : q === 'b')) return true;
                }
                break;
            }
            rr += dr; ff += df;
        }
    }
    for (const [dr, df] of [[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]]) {
        const rr = r + dr, ff = f + df;
        if (rr >= 0 && rr < 8 && ff >= 0 && ff < 8) {
            const p = b[rr][ff];
            if (p && isW(p) === byWhite && p.toLowerCase() === 'n') return true;
        }
    }
    for (const dr of [-1, 0, 1]) for (const df of [-1, 0, 1]) {
        if (!dr && !df) continue;
        const rr = r + dr, ff = f + df;
        if (rr >= 0 && rr < 8 && ff >= 0 && ff < 8) {
            const p = b[rr][ff];
            if (p && isW(p) === byWhite && p.toLowerCase() === 'k') return true;
            // pawn: white attacks dari baris r+1, hitam dari r-1 (arah ke atas papan = white)
            if (p && isW(p) === byWhite && p.toLowerCase() === 'p') {
                const pawnRow = byWhite ? r - dr : r - dr; // simplify: capture direction
                if (Math.abs(dr) === 1 && Math.abs(df) === 1) {
                    if (byWhite ? rr === r - 1 : rr === r + 1) return true;
                }
            }
        }
    }
    return false;
}
function applySAN(b, stm, uci) {
    const from = uci.slice(0, 2), to = uci.slice(2, 4);
    const f1 = FILES.indexOf(from[0]), r1 = 8 - +from[1];
    const f2 = FILES.indexOf(to[0]), r2 = 8 - +to[1];
    const p = b[r1] && b[r1][f1];
    if (!p) return null;
    if (isW(p) !== (stm === 'w')) return null;
    const tgt = b[r2][f2];
    if (tgt && isW(tgt) === isW(p)) return null;
    const q = p.toLowerCase();
    const dr = r2 - r1, df = f2 - f1;
    const adr = Math.abs(dr), adf = Math.abs(df);
    let legal = false;
    if (q === 'n') legal = (adr === 1 && adf === 2) || (adr === 2 && adf === 1);
    else if (q === 'k') legal = adr <= 1 && adf <= 1 && (adr + adf) > 0;
    else if (q === 'p') {
        const fwd = isW(p) ? -1 : 1;
        if (df === 0 && !tgt && dr === fwd) legal = true;
        else if (df === 0 && !tgt && dr === 2 * fwd && ((isW(p) && r1 === 6) || (!isW(p) && r1 === 1))
                 && !b[r1 + fwd][f1]) legal = true;
        else if (adf === 1 && dr === fwd && tgt) legal = true;
        // en passant di puzzle tidak dipakai (tidak ada ep field di uci data)
    } else {
        let path = true;
        if (adr === 0 || adf === 0 || adr === adf) {
            const sr = Math.sign(dr), sf = Math.sign(df);
            let rr = r1 + sr, ff = f1 + sf;
            while (rr !== r2 || ff !== f2) { if (b[rr][ff]) { path = false; break; } rr += sr; ff += sf; }
            if (q === 'r') path = path && (adr === 0 || adf === 0);
            if (q === 'b') path = path && adr === adf;
            legal = path;
        }
    }
    if (!legal) return null;
    const nb = b.map(row => row.slice());
    nb[r1][f1] = null;
    nb[r2][f2] = p;
    // promosi: uci 5th char q/r/b/n
    if (q === 'p' && (r2 === 0 || r2 === 7)) {
        const pr = (uci[4] || 'q').toLowerCase();
        if ('qrbn'.includes(pr)) nb[r2][f2] = isW(p) ? pr.toUpperCase() : pr;
    }
    // raja sendiri tidak boleh tetap/ketika kena serangan setelah langkah
    let kr, kf;
    for (let r = 0; r < 8; r++) for (let f = 0; f < 8; f++)
        if (nb[r][f] === (stm === 'w' ? 'K' : 'k')) { kr = r; kf = f; }
    if (kr === undefined) return null;
    if (attacks(nb, kr, kf, stm !== 'w')) return null;
    return nb;
}

console.log('== Hajir Chess build ==');

// ---- 1. Data puzzle ----
const pzSrc = readFileSync(join(root, 'js', 'puzzle-data.js'), 'utf8');
const puzzles = JSON.parse(pzSrc.slice(pzSrc.indexOf('['), pzSrc.lastIndexOf(']') + 1));
const ids = new Set();
let badP = 0;
puzzles.forEach((p, i) => {
    const tag = 'puzzle[' + (p.id || i) + ']';
    if (!p.id || ids.has(p.id)) { err(tag + ': id unik'); badP++; return; }
    ids.add(p.id);
    if (!p.difficulty || !['easy','medium','hard','expert'].includes(p.difficulty)) { err(tag + ': difficulty'); badP++; return; }
    if (!Array.isArray(p.solution) || !p.solution.length) { err(tag + ': solution kosong'); badP++; return; }
    let st = parseFEN(p.fen || '');
    if (!st) { err(tag + ': FEN invalid'); badP++; return; }
    let b = st.board, stm = st.stm;
    for (const u of p.solution) {
        if (!/^[a-h][1-8][a-h][1-8][qrbn]?$/.test(u)) { err(tag + ': langkah invalid ' + u); badP++; return; }
        const nb = applySAN(b, stm, u);
        if (!nb) { err(tag + ': langkah ilegal ' + u); badP++; return; }
        b = nb; stm = stm === 'w' ? 'b' : 'w';
    }
});
if (!badP) ok(puzzles.length + ' puzzle valid (FEN + seluruh solusi legal)');

// ---- 2. Data lesson ----
const lsSrc = readFileSync(join(root, 'js', 'lessons-data.js'), 'utf8');
const lessons = JSON.parse(lsSrc.slice(lsSrc.indexOf('['), lsSrc.lastIndexOf(']') + 1));
const lv = new Set(['beginner','elementary','intermediate','advanced']);
const lIds = new Set();
let badL = 0;
lessons.forEach((l, i) => {
    const tag = 'lesson[' + (l.id || i) + ']';
    if (!l.id || lIds.has(l.id)) { err(tag + ': id unik'); badL++; return; }
    lIds.add(l.id);
    if (!lv.has(l.level)) { err(tag + ': level'); badL++; return; }
    for (const req of ['title', 'description', 'goal'])
        if (!l[req] || !l[req].en || !l[req].id) { err(tag + ': ' + req + ' bilingual'); badL++; return; }
    if (!Array.isArray(l.steps) || !l.steps.length) { err(tag + ': steps'); badL++; return; }
    l.steps.forEach((s, j) => {
        if (!s.title || !s.title.en || !s.title.id) { err(tag + '.step' + j + ': title'); badL++; }
        if (!s.text || !s.text.en || !s.text.id) { err(tag + '.step' + j + ': text'); badL++; }
        if (s.board && !parseFEN(s.board)) { err(tag + '.step' + j + ': FEN board'); badL++; }
    });
    if (l.exercise) {
        if (!parseFEN(l.exercise.fen || '')) { err(tag + ': exercise FEN'); badL++; }
        else {
            const st = parseFEN(l.exercise.fen); let b = st.board, stm = st.stm;
            for (const u of (l.exercise.solution || [])) {
                const nb = applySAN(b, stm, u);
                if (!nb) { err(tag + ': exercise solusi ilegal ' + u); badL++; break; }
                b = nb; stm = stm === 'w' ? 'b' : 'w';
            }
        }
    }
});
if (!badL) ok(lessons.length + ' lesson valid (struktur bilingual + FEN exercise legal)');

// ---- 3. Locale sync ----
const flat = (o, p = '', out = {}) => { for (const [k, v] of Object.entries(o)) (v && typeof v === 'object') ? flat(v, p + k + '.', out) : out[p + k] = v; return out; };
const idJ = flat(JSON.parse(readFileSync(join(root, 'locales', 'id.json'), 'utf8')));
const enJ = flat(JSON.parse(readFileSync(join(root, 'locales', 'en.json'), 'utf8')));
const mi = Object.keys(idJ).filter(k => !(k in enJ));
const me = Object.keys(enJ).filter(k => !(k in idJ));
if (mi.length || me.length) err('locale mismatch: ' + mi.concat(me).join(','));
else ok('locale id/en sinkron (' + Object.keys(idJ).length + ' key)');

if (errors.length) {
    console.error('\nBUILD DITOLAK: ' + errors.length + ' masalah data.');
    process.exit(1);
}

// ---- 4. Salin ke dist ----
rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
for (const item of ['index.html', 'style.css', 'js', 'locales']) {
    const src = join(root, item);
    if (existsSync(src)) cpSync(src, join(dist, item), { recursive: true });
}
ok('dist/ ditulis (index.html, style.css, js/, locales/)');
console.log('\nBUILD SUKSES — siap di-deploy sebagai static web.');
