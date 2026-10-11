import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ChessEngine } from '../js/chess/engine.js';

test('langkah legal diterima', () => {
  const e = new ChessEngine();
  const move = e.move('e2', 'e4');
  assert.ok(move);
  assert.equal(e.turn, 'black');
});

test('langkah ilegal ditolak', () => {
  const e = new ChessEngine();
  const move = e.move('e2', 'e5');
  assert.equal(move, null);
  assert.equal(e.turn, 'white');
});

test('check terdeteksi', () => {
  const e = new ChessEngine();
  e.reset('rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 1 3');
  assert.equal(e.isCheck, true);
});

test('checkmate terdeteksi', () => {
  const e = new ChessEngine();
  e.reset('rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 1 3');
  assert.equal(e.isCheckmate, true);
  assert.equal(e.isGameOver, true);
});

test('stalemate terdeteksi', () => {
  const e = new ChessEngine();
  e.reset('7k/5Q2/6K1/8/8/8/8/8 b - - 0 1');
  assert.equal(e.isStalemate, true);
});

test('castling berjalan', () => {
  const e = new ChessEngine();
  e.reset('r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1');
  const move = e.move('e1', 'g1');
  assert.ok(move);
  assert.equal(move.flags.includes('k'), true);
});

test('en passant berjalan', () => {
  const e = new ChessEngine();
  e.reset('rnbqkbnr/ppp1p1pp/8/3pPp2/8/8/PPPP1PPP/RNBQKBNR w KQkq f6 0 3');
  const move = e.move('e5', 'f6');
  assert.ok(move);
  assert.equal(move.flags.includes('e'), true);
});

test('promotion berjalan', () => {
  const e = new ChessEngine();
  e.reset('8/4P3/8/8/8/8/8/4K2k w - - 0 1');
  const move = e.move('e7', 'e8', 'q');
  assert.ok(move);
  assert.equal(move.promotion, 'q');
});
