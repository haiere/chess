import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ChessEngine } from '../js/chess/engine.js';

// Simulasi validasi puzzle
function validatePuzzle(p) {
  if (!p.id || !p.fen || !Array.isArray(p.solution)) return false;
  try { new ChessEngine().reset(p.fen); } catch { return false; }
  // Verifikasi setiap langkah solusi legal
  const e = new ChessEngine();
  e.reset(p.fen);
  if (p.firstMove) {
    const m = e.move(p.firstMove.slice(0,2), p.firstMove.slice(2,4), p.firstMove[4] || 'q');
    if (!m) return false;
  }
  for (const uci of p.solution) {
    const m = e.move(uci.slice(0,2), uci.slice(2,4), uci[4] || 'q');
    if (!m) return false;
  }
  return true;
}

const puzzles = [
  { id: 'p1', fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3', solution: ['f3e5'] },
  { id: 'p2', fen: 'invalid-fen', solution: ['e2e4'] },
  { id: 'p3', fen: '6k1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1', solution: ['a1a8'] },
];

test('puzzle valid lolos validasi', () => {
  assert.equal(validatePuzzle(puzzles[0]), true);
  assert.equal(validatePuzzle(puzzles[2]), true);
});

test('puzzle FEN invalid ditolak', () => {
  assert.equal(validatePuzzle(puzzles[1]), false);
});

test('langkah ilegal dalam solusi ditolak', () => {
  assert.equal(validatePuzzle({ id: 'bad', fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', solution: ['e2e5'] }), false);
});
