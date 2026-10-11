const wrap = (inner) => 'data:image/svg+xml,' + encodeURIComponent(inner);

export const PIECE_SVG = {
  white: {
    king:   wrap('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45">…</svg>'),
    queen:  wrap('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45">…</svg>'),
    rook:   wrap('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45">…</svg>'),
    bishop: wrap('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45">…</svg>'),
    knight: wrap('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45">…</svg>'),
    pawn:   wrap('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45">…</svg>'),
  },
  black: { /* sama, dengan fill="#000" */ },
};

export const INITIAL_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
export const DIFFICULTIES = ['easy', 'medium', 'hard'];
export const TIMER_OPTIONS = [
  { value: '10|0', label: '10|0 Rapid', initial: 600, increment: 0 },
  { value: '5|3',  label: '5|3 Blitz',  initial: 300, increment: 3 },
  { value: '3|2',  label: '3|2 Blitz',  initial: 180, increment: 2 },
  { value: '1|0',  label: '1|0 Bullet', initial: 60,  increment: 0 },
  { value: '0|0',  label: 'Tanpa Timer', initial: 0,   increment: 0 },
];
