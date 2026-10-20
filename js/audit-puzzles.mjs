#!/usr/bin/env node
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

function loadInto(sandbox, relPath) {
    const abs = path.resolve(root, relPath);
    const code = fs.readFileSync(abs, 'utf8');
    vm.runInContext(code, sandbox, { filename: relPath });
}

const sandbox = vm.createContext({ window: {}, console });
loadInto(sandbox, 'js/chess/engine.js');
loadInto(sandbox, 'js/puzzle-data.js');

const Chess = sandbox.window.Chess;
const puzzles = sandbox.window.PUZZLE_DATA;

if (!Chess) { console.error('FATAL: window.Chess tidak ditemukan'); process.exit(2); }
if (!Array.isArray(puzzles)) { console.error('FATAL: window.PUZZLE_DATA tidak ditemukan'); process.exit(2); }

const DIFFS = ['easy', 'medium', 'hard', 'expert'];
const REQUIRED = ['id', 'fen', 'solution', 'difficulty'];

const seen = new Set();
const ok = [];
const fail = [];

function replay(fen, solution) {
    let st;
    try { st = Chess.parseFEN(fen); }
    catch (e) { return `parseFEN threw: ${e.message}`; }

    for (let i = 0; i < solution.length; i++) {
        const step = solution[i];
        if (typeof step !== 'string' || step.length < 4) return `step ${i} not a UCI string: ${step}`;
        const mv = Chess.findMove(st, step);
        if (!mv) return `step ${i} (${step}) illegal / not found`;
        if (mv.captured && mv.captured.type === 'king') return `step ${i} (${step}) captures a king`;
        st = Chess.applyMove(st, mv).state;
        if (!Chess.findKing(st.board, 'white')) return `step ${i} (${step}) removes white king`;
        if (!Chess.findKing(st.board, 'black')) return `step ${i} (${step}) removes black king`;
    }
    return null;
}

for (const p of puzzles) {
    if (!p || typeof p !== 'object') { fail.push({ id: '?', errs: ['not an object'] }); continue; }
    const errs = [];
    for (const k of REQUIRED) {
        if (p[k] === undefined || p[k] === null || p[k] === '') errs.push(`missing field: ${k}`);
    }
    if (p.id && seen.has(p.id)) errs.push(`duplicate id: ${p.id}`);
    seen.add(p.id);
    if (p.difficulty && !DIFFS.includes(p.difficulty)) errs.push(`invalid difficulty: ${p.difficulty}`);
    if (p.fen) {
        if (!Chess.validateFEN(p.fen)) errs.push('invalid FEN (structural or illegal position)');
        else if (Array.isArray(p.solution) && p.solution.length > 0) {
            const replayErr = replay(p.fen, p.solution);
            if (replayErr) errs.push(replayErr);
        }
    }
    if (errs.length) fail.push({ id: p.id || '?', errs });
    else ok.push(p.id);
}

console.log('\n=== Puzzle Audit ===');
console.log(`Total: ${puzzles.length}  OK: ${ok.length}  FAIL: ${fail.length}`);
if (fail.length) {
    console.log('\nFailed puzzles:');
    for (const f of fail) console.log(`  - ${f.id}: ${f.errs.join(' | ')}`);
    process.exit(1);
}
console.log('\nAll puzzles valid.');
process.exit(0); 
