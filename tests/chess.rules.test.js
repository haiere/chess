import { test } from 'node:test';
import assert from 'node:assert/strict';

import { C } from './chess-api.mjs';

function isValidFEN(fen) { return C.validateFEN(fen); }

test('FEN valid diterima', () => {
    assert.equal(isValidFEN('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'), true);
});

test('FEN invalid ditolak', () => {
    assert.equal(isValidFEN('invalid'), false);
    assert.equal(isValidFEN('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR'), false);
    assert.equal(isValidFEN('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR x KQkq - 0 1'), false);
});
