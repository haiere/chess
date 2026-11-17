/**
 * js/ai/ai-worker.js — pencari langkah lawan komputer (classic Web Worker).
 * Berjalan di luar main thread: tidak menyentuh DOM. Memakai aturan dari chess/engine.js.
 * Protokol: masuk { id, state, difficulty } → keluar { id, move } atau { id, error }.
 * move = { fromRow, fromCol, toRow, toCol, promotion } (dicocokkan ulang oleh main thread).
 */
self.window = self;
importScripts('../chess/engine.js');

const C = self.Chess;
const VALUES = { pawn: 100, knight: 320, bishop: 330, rook: 500, queen: 900, king: 0 };

function evaluate(st) {
  let s = 0;
  for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
    const p = st.board[r][c];
    if (p) s += (p.color === 'white' ? 1 : -1) * VALUES[p.type];
  }
  return s;
}

function minimax(state, depth, alpha, beta, isMax) {
  if (depth === 0) return evaluate(state);
  const moves = C.allLegalMoves(state, state.currentPlayer);
  if (moves.length === 0) {
    return C.isInCheck(state, state.currentPlayer) ? (isMax ? -99999 : 99999) : 0;
  }
  if (isMax) {
    let best = -Infinity;
    for (const m of moves) {
      const v = minimax(C.applyMove(state, m).state, depth - 1, alpha, beta, false);
      if (v > best) best = v;
      if (v > alpha) alpha = v;
      if (beta <= alpha) break;
    }
    return best;
  }
  let best = Infinity;
  for (const m of moves) {
    const v = minimax(C.applyMove(state, m).state, depth - 1, alpha, beta, true);
    if (v < best) best = v;
    if (v < beta) beta = v;
    if (beta <= alpha) break;
  }
  return best;
}

function choose(state, difficulty) {
  const color = state.currentPlayer;
  const moves = C.allLegalMoves(state, color);
  if (!moves.length) return null;
  for (let i = moves.length - 1; i > 0; i--) {           // acak agar langkah setara bervariasi
    const j = Math.floor(Math.random() * (i + 1));
    [moves[i], moves[j]] = [moves[j], moves[i]];
  }
  const depth = difficulty === 'hard' ? 3 : 2;
  const isMax = color === 'white';
  let best = moves[0], bestScore = isMax ? -Infinity : Infinity;
  for (const m of moves) {
    const v = minimax(C.applyMove(state, m).state, depth - 1, -Infinity, Infinity, !isMax);
    if (isMax ? v > bestScore : v < bestScore) { bestScore = v; best = m; }
  }
  return {
    fromRow: best.fromRow, fromCol: best.fromCol,
    toRow: best.toRow, toCol: best.toCol,
    promotion: best.promotion || null
  };
}

self.onmessage = (e) => {
  const { id, state, difficulty } = e.data || {};
  try {
    self.postMessage({ id, move: choose(state, difficulty) });
  } catch (err) {
    self.postMessage({ id, error: String((err && err.message) || err) });
  }
};
