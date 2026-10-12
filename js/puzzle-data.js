/* Puzzle dataset — every entry is validated by tests/run.mjs:
   FEN must be valid, every solution move must be legal, and puzzles
   themed "mate" must end in checkmate. Format for a new puzzle:
   { id, difficulty: easy|medium|hard|master, title, rating,
     fen, solution: ['dari-ke', ...], themes: [...] }
   Even indices = user moves, odd indices = opponent replies. */
(function () {
    'use strict';
    window.PUZZLE_DATA = [
        /* ---------- EASY ---------- */
        { id: 'scholar-mate', difficulty: 'easy', rating: 600, title: 'Mate Pelajar',
          fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4',
          solution: ['h5f7'], themes: ['mate', 'opening'] },
        { id: 'back-rank-mate', difficulty: 'easy', rating: 650, title: 'Skakmat Baris Belakang',
          fen: '6k1/5ppp/8/8/8/8/8/4R1K1 w - - 0 1',
          solution: ['e1e8'], themes: ['mate', 'backRankMate'] },
        { id: 'queen-corner-mate', difficulty: 'easy', rating: 650, title: 'Mate Pojok dengan Menteri',
          fen: '7k/8/5K2/8/8/8/8/6Q1 w - - 0 1',
          solution: ['g1g7'], themes: ['mate', 'endgame'] },
        { id: 'fools-mate', difficulty: 'easy', rating: 500, title: 'Mate Bodoh (hitam bermain)',
          fen: 'rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR b KQkq - 0 3',
          solution: ['d8h4'], themes: ['mate', 'opening'] },
        { id: 'free-queen', difficulty: 'easy', rating: 700, title: 'Menteri Menggantung',
          fen: '6k1/8/8/8/3q4/8/8/3Q2K1 w - - 0 1',
          solution: ['d1d4'], themes: ['advantage', 'capture'] },
        { id: 'rook-corner-mate', difficulty: 'easy', rating: 650, title: 'Mate Benteng di Baris Delapan',
          fen: '6k1/8/6K1/8/8/8/8/1R6 w - - 0 1',
          solution: ['b1b8'], themes: ['mate', 'endgame'] },
        /* ---------- MEDIUM ---------- */
        { id: 'knight-fork-queen', difficulty: 'medium', rating: 1000, title: 'Fork Kuda terhadap Menteri',
          fen: '3q1rk1/ppp2ppp/8/3N4/8/8/PPP2PPP/R2Q1RK1 w - - 0 1',
          solution: ['d5e7', 'g8h8', 'e7d8'], themes: ['fork', 'advantage'] },
        { id: 'hanging-queen-file', difficulty: 'medium', rating: 900, title: 'Menteri di Jalur Terbuka',
          fen: '6k1/8/8/8/4q3/8/8/4R1K1 w - - 0 1',
          solution: ['e1e4'], themes: ['advantage', 'capture'] },
        { id: 'promotion-wins-rook', difficulty: 'medium', rating: 950, title: 'Promosi Sekaligus Menang Benteng',
          fen: '2r5/1P6/8/8/8/6k1/8/6K1 w - - 0 1',
          solution: ['b7c8'], themes: ['promotion', 'advantage'] },
        { id: 'pinned-rook', difficulty: 'medium', rating: 950, title: 'Benteng Terjepit',
          fen: '4r1k1/8/8/8/8/4R3/8/4K3 w - - 0 1',
          solution: ['e3e8'], themes: ['pin', 'advantage'] },
        /* ---------- HARD ---------- */
        { id: 'two-rooks-mate-2', difficulty: 'hard', rating: 1250, title: 'Mate dalam 2: Dua Benteng',
          fen: '6k1/8/6K1/8/8/8/8/R6R w - - 0 1',
          solution: ['g6f6', 'g8f8', 'a1a8'], themes: ['mate', 'endgame'] },
        { id: 'queen-mate-2', difficulty: 'hard', rating: 1250, title: 'Mate dalam 2: Menteri dan Raja',
          fen: '7k/8/5K2/8/8/8/8/3Q4 w - - 0 1',
          solution: ['f6f7', 'h8h7', 'd1h1'], themes: ['mate', 'endgame'] },
        { id: 'knight-fork-rook', difficulty: 'hard', rating: 1200, title: 'Fork Kuda di Ruang Kosong',
          fen: '2r2rk1/ppp2ppp/8/3N4/8/8/PPP2PPP/R2Q1RK1 w - - 0 1',
          solution: ['d5e7', 'g8h8', 'e7c8'], themes: ['fork', 'advantage'] },
        /* ---------- MASTER ---------- */
        { id: 'queen-mate-3', difficulty: 'master', rating: 1600, title: 'Mate dalam 3: Pendekatan Raja',
          fen: '7k/8/5K2/8/8/8/6Q1/8 w - - 0 1',
          solution: ['f6e7', 'h8h7', 'e7f7', 'h7h8', 'g2g7'], themes: ['mate', 'endgame'] }
    ];
})();
