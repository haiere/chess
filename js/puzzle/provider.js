/**
 * js/puzzle/provider.js — sumber data puzzle.
 * Membaca window.PUZZLE_DATA (dimuat dari js/puzzle-data.js).
 * Entri yang rusak dilewati, sehingga satu data buruk tidak membuat aplikasi crash.
 */
function validEntries() {
  const raw = (typeof window !== 'undefined' && Array.isArray(window.PUZZLE_DATA)) ? window.PUZZLE_DATA : [];
  return raw.filter(p => p && typeof p.id === 'string' && typeof p.fen === 'string' && Array.isArray(p.solution) && p.solution.length);
}

export function createPuzzleProvider() {
  const list = validEntries();
  const index = new Map(list.map((p, i) => [p.id, i]));
  return {
    count: () => list.length,
    all: () => list.slice(),
    getById: (id) => (index.has(id) ? list[index.get(id)] : null),
    getFirst: () => list[0] || null,
    getRandom: () => (list.length ? list[Math.floor(Math.random() * list.length)] : null),
    getNext: (id) => {
      const i = index.get(id);
      return i === undefined ? list[0] || null : list[(i + 1) % list.length] || null;
    },
    getPrev: (id) => {
      const i = index.get(id);
      return i === undefined ? list[list.length - 1] || null : list[(i - 1 + list.length) % list.length] || null;
    }
  };
}
 
