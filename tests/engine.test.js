import { test } from 'node:test';
import assert from 'node:assert/strict';
import { C, playUci, playLine } from './chess-api.mjs';

test('langkah legal diterima dan giliran berganti', () => {
  const st = C.initialState();
  const next = playUci(st, 'e2e4');
  assert.ok(next, 'e2e4 harus legal');
  assert.equal(next.currentPlayer, 'black');
});

test('langkah ilegal ditolak', () => {
  assert.equal(playUci(C.initialState(), 'e2e5'), null);
});

test('FEN valid lolos, FEN rusak ditolak', () => {
  assert.equal(C.validateFEN(C.INITIAL_FEN), true);
  assert.equal(C.validateFEN('invalid'), false);
});

test('check terdeteksi', () => {
  const st = C.parseFEN('rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 1 3');
  assert.equal(C.isInCheck(st, 'white'), true);
});

test('checkmate (fool\'s mate) terdeteksi', () => {
  const st = playLine(C.INITIAL_FEN, ['f2f3', 'e7e5', 'g2g4', 'd8h4']);
  assert.ok(st);
  const s = C.status(st);
  assert.equal(s.checkmate, true);
  assert.equal(s.over, true);
});

test('stalemate terdeteksi', () => {
  const st = C.parseFEN('7k/5Q2/6K1/8/8/8/8/8 b - - 0 1');
  assert.equal(C.status(st).stalemate, true);
});

test('castling rajaSisi berjalan (raja e1 → g1, benteng h1 → f1)', () => {
  const st = C.parseFEN('r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1');
  const next = playUci(st, 'e1g1');
  assert.ok(next, 'castling harus legal');
  assert.equal(next.board[7][6]?.type, 'king');
  assert.equal(next.board[7][5]?.type, 'rook');
});

test('promosi dengan pilihan bidak', () => {
  const st = C.parseFEN('8/P6k/8/8/8/8/8/K7 w - - 0 1');
  const next = playUci(st, 'a7a8q');
  assert.ok(next);
  assert.equal(next.board[0][0]?.type, 'queen');
});

test('en passant berjalan', () => {
  const st = playLine(C.INITIAL_FEN, ['e2e4', 'a7a6', 'e4e5', 'd7d5']);
  assert.ok(st);
  const next = playUci(st, 'e5d6');
  assert.ok(next, 'en passant harus legal');
  assert.equal(next.board[3][3], null, 'pion yang ditangkap en passant harus hilang');
});
