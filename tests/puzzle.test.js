import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { C, playLine } from './chess-api.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const UCI = /^[a-h][1-8][a-h][1-8][qrbn]?$/;

/* Validasi puzzle: FEN valid, setiap langkah UCI legal dan berurutan. */
function validatePuzzle(p) {
  if (!p || typeof p.fen !== 'string' || !Array.isArray(p.solution) || !p.solution.length) return false;
  if (!C.validateFEN(p.fen)) return false;
  if (!p.solution.every(u => typeof u === 'string' && UCI.test(u))) return false;
  return playLine(p.fen, p.solution) !== null;
}

test('semua puzzle di data valid (FEN + solusi legal)', () => {
  const src = readFileSync(join(root, 'js/puzzle-data.js'), 'utf8').replace(/^window\.PUZZLE_DATA\s*=\s*/, '').replace(/;\s*$/, '');
  const data = (0, eval)('(' + src + ')');
  assert.ok(data.length > 0);
  const bad = data.filter(p => !validatePuzzle(p)).map(p => p.id);
  assert.deepEqual(bad, []);
});

test('puzzle valid lolos validasi', () => {
  assert.equal(validatePuzzle({ id: 'ok', fen: '2k5/1ppp4/8/8/8/8/8/4K2R w - - 0 1', solution: ['h1h8'] }), true);
});

test('FEN puzzle rusak ditolak', () => {
  assert.equal(validatePuzzle({ id: 'bad', fen: 'invalid-fen', solution: ['e2e4'] }), false);
});

test('langkah ilegal dalam solusi ditolak', () => {
  assert.equal(validatePuzzle({ id: 'bad2', fen: C.INITIAL_FEN, solution: ['e2e5'] }), false);
});

test('format solusi bukan UCI ditolak', () => {
  assert.equal(validatePuzzle({ id: 'bad3', fen: C.INITIAL_FEN, solution: ['e2 to e4'] }), false);
});
