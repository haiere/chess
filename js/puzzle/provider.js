// PuzzleProvider — abstraction untuk sumber puzzle
const providers = new Map();

export function registerProvider(name, provider) {
  providers.set(name, provider);
}

export function getProvider(name = 'local') {
  const p = providers.get(name);
  if (!p) throw new Error(`Puzzle provider "${name}" not registered`);
  return p;
}

// Contoh: provider lokal
registerProvider('local', {
  async load({ difficulty, count = 20 }) {
    const res = await fetch('js/data/puzzles.json');
    const all = await res.json();
    return all
      .filter(p => p.difficulty === difficulty)
      .slice(0, count)
      .map(validatePuzzle);
  },
  async getDaily() {
    const res = await fetch('js/data/daily.json');
    return validatePuzzle(await res.json());
  }
});

function validatePuzzle(p) {
  if (!p.id || !p.fen || !Array.isArray(p.solution)) {
    console.warn('Invalid puzzle skipped:', p);
    return null;
  }
  // Validasi FEN dengan chess.js
  try {
    const chess = new Chess(p.fen);
    if (!chess.isValid()) throw new Error('Invalid FEN');
    return p;
  } catch (e) {
    console.warn('Invalid puzzle FEN:', p.id, e.message);
    return null;
  }
      }
