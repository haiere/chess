import { validateFEN } from '../js/engine.js'; // sesuaikan path & signature
import { puzzles } from '../js/puzzle/puzzles.js'; // sesuaikan

const REQUIRED = ['id', 'fen', 'solution', 'difficulty', 'level', 'theme'];
const seen = new Set();
const report = { ok: [], warn: [], fail: [] };

for (const p of puzzles) {
  const errs = [];
  for (const k of REQUIRED) if (!p[k]) errs.push(`missing field: ${k}`);
  if (p.id && seen.has(p.id)) errs.push('duplicate id');
  seen.add(p.id);
  if (p.fen) {
    const v = validateFEN(p.fen);
    if (!v.ok) errs.push(`invalid FEN: ${v.reason}`);
    else {
      // replays solusi via engine agar langkah & legalitas terverifikasi
      const replay = replaySolution(p.fen, p.solution);
      if (!replay.ok) errs.push(`invalid solution: ${replay.reason}`);
    }
  }
  (errs.length ? report.fail : report.ok).push({ id: p.id, errs });
}

console.log(JSON.stringify(report, null, 2));
console.log(`Total=${puzzles.length} OK=${report.ok.length} FAIL=${report.fail.length}`);
