import { test } from 'node:test';
import assert from 'node:assert/strict';

// Karena script.js tidak modular, kita uji logika murni dengan fungsi terpisah.
// Rekomendasi: ekstrak logika ke modul terpisah (mis. chess-logic.js).

// Placeholder: test validasi FEN
function isValidFEN(fen) {
    if (typeof fen !== 'string') return false;
    const parts = fen.trim().split(/\s+/);
    if (parts.length !== 6) return false;
    const ranks = parts[0].split('/');
    if (ranks.length !== 8) return false;
    for (const rank of ranks) {
        let count = 0;
        for (const ch of rank) {
            if (ch >= '1' && ch <= '8') count += parseInt(ch);
            else if (/[prnbqkPRNBQK]/.test(ch)) count++;
            else return false;
        }
        if (count !== 8) return false;
    }
    return true;
}

test('FEN valid diterima', () => {
    assert.ok(isValidFEN('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'));
});

test('FEN invalid ditolak', () => {
    assert.equal(isValidFEN('invalid'), false);
    assert.equal(isValidFEN('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR'), false);
    assert.equal(isValidFEN('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR x KQkq - 0 1'), false);
});
