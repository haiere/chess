import { Chess } from 'https://cdn.jsdelivr.net/npm/chess.js@1.4.0/+esm';

export class ChessEngine {
  #game = new Chess();

  reset(fen) {
    this.#game = fen ? new Chess(fen) : new Chess();
    if (fen && this.#game.isGameOver() && this.#game.history().length === 0) {
      throw new Error('Posisi FEN tidak valid');
    }
  }

  get board() { return this.#game.board(); }
  get turn() { return this.#game.turn() === 'w' ? 'white' : 'black'; }
  get fen() { return this.#game.fen(); }
  get pgn() { return this.#game.pgn(); }
  get history() { return this.#game.history({ verbose: true }); }

  get isCheck() { return this.#game.inCheck(); }
  get isCheckmate() { return this.#game.isCheckmate(); }
  get isStalemate() { return this.#game.isStalemate(); }
  get isDraw() { return this.#game.isDraw(); }
  get isGameOver() { return this.#game.isGameOver(); }
  get isThreefold() { return this.#game.isThreefoldRepetition(); }
  get isInsufficient() { return this.#game.isInsufficientMaterial(); }

  legalMoves(square) {
    return this.#game.moves({ square, verbose: true });
  }

  allLegalMoves() {
    return this.#game.moves({ verbose: true });
  }

  move(from, to, promotion = 'q') {
    try {
      return this.#game.move({ from, to, promotion });
    } catch {
      return null; // langkah ilegal
    }
  }

  undo() { return this.#game.undo(); }

  function parseFENBoard(placement) {
    const board = [];
    const ranks = placement.split('/');
    for (let r = 0; r < 8; r++) {
        const row = [];
        for (const ch of ranks[r]) {
            if (ch >= '1' && ch <= '8') {
                for (let i = 0; i < parseInt(ch, 10); i++) row.push(null);
            } else {
                const color = ch === ch.toUpperCase() ? 'white' : 'black';
                row.push({ type: FEN_PIECE[ch.toLowerCase()], color });
            }
        }
        board.push(row);
    }
    return board;
  }

  /** Kembalikan posisi setelah langkah tanpa mengubah state */
  peek(fen, from, to, promotion = 'q') {
    const tmp = new Chess(fen);
    try { return tmp.move({ from, to, promotion }); }
    catch { return null; }
  }
}
