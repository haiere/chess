// Helper: load the real chess engine (window.Chess) in Node.
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
globalThis.window = globalThis;
await import(join(dirname(fileURLToPath(import.meta.url)), '..', 'js', 'chess', 'engine.js'));
export const C = globalThis.Chess;

/* Apply a UCI move string to a state. Returns new state or null if illegal. */
export function playUci(state, uci) {
  const mv = C.findMove(state, uci);
  return mv ? C.applyMove(state, mv).state : null;
}
/* Play a full UCI line from a FEN. Returns final state or null if any move is illegal. */
export function playLine(fen, moves) {
  let st = C.parseFEN(fen);
  for (const m of moves) { st = playUci(st, m); if (!st) return null; }
  return st;
}
