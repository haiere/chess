/**
 * js/lessons/provider.js — adapter data lesson.
 * window.LESSON_DATA (js/lessons-data.js) memakai skema: lesson.description, step.text,
 * step.board (string FEN), lesson.exercise { fen, solution: [UCI] }, step.exercise (boolean).
 * LessonsMode memakai skema: lesson.summary, step.body, step.board.fen, step.exercise.solution [{from,to}].
 * Adapter ini menjembatani keduanya. Lesson rusak dilewati; tidak pernah melempar error.
 */
const LEVEL_LABELS = {
  beginner:     { en: 'Beginner',     id: 'Pemula' },
  elementary:   { en: 'Elementary',   id: 'Dasar' },
  intermediate: { en: 'Intermediate', id: 'Menengah' },
  advanced:     { en: 'Advanced',     id: 'Lanjutan' }
};
const UCI_RE = /^[a-h][1-8][a-h][1-8][qrbn]?$/;

function toMoves(uciList) {
  if (!Array.isArray(uciList)) return null;
  const out = [];
  for (const u of uciList) {
    if (typeof u !== 'string' || !UCI_RE.test(u)) return null;
    out.push({ from: u.slice(0, 2), to: u.slice(2, 4) });
  }
  return out.length ? out : null;
}

function normalizeLesson(raw) {
  if (!raw || typeof raw.id !== 'string' || !Array.isArray(raw.steps) || !raw.steps.length) return null;
  const top = raw.exercise && typeof raw.exercise.fen === 'string'
    ? { fen: raw.exercise.fen, solution: toMoves(raw.exercise.solution) }
    : null;
  const steps = raw.steps.map(s => {
    const isExercise = s.exercise === true && top && top.solution;
    return {
      title: s.title,
      body: s.text,
      board: typeof s.board === 'string' ? { fen: s.board } : (s.board || null),
      exercise: isExercise ? { board: { fen: top.fen }, solution: top.solution } : null
    };
  });
  return {
    id: raw.id,
    level: raw.level,
    levelLabel: LEVEL_LABELS[raw.level] || { en: String(raw.level || ''), id: String(raw.level || '') },
    title: raw.title,
    summary: raw.description,
    goal: raw.goal,
    steps
  };
}

export function createLessonProvider() {
  const raw = (typeof window !== 'undefined' && Array.isArray(window.LESSON_DATA)) ? window.LESSON_DATA : [];
  const list = raw.map(normalizeLesson).filter(Boolean);
  const index = new Map(list.map((l, i) => [l.id, i]));
  return {
    count: () => list.length,
    all: () => list.slice(),
    getById: (id) => (index.has(id) ? list[index.get(id)] : null),
    getFirst: () => list[0] || null
  };
}
