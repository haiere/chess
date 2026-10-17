import fs from 'node:fs';
const id = JSON.parse(fs.readFileSync('locales/id.json'));
const en = JSON.parse(fs.readFileSync('locales/en.json'));

const flat = (o, p = '', out = {}) => {
  for (const [k, v] of Object.entries(o)) {
    const key = p ? `${p}.${k}` : k;
    if (v && typeof v === 'object') flat(v, key, out);
    else out[key] = v;
  }
  return out;
};

const fid = flat(id), fen = flat(en);
const onlyId = Object.keys(fid).filter(k => !(k in fen));
const onlyEn = Object.keys(fen).filter(k => !(k in fid));

const interp = s => (s.match(/{{\s*\w+\s*}}/g) || []).sort();
const mismatch = [];
for (const k of Object.keys(fid)) {
  if (!(k in fen)) continue;
  if (JSON.stringify(interp(fid[k])) !== JSON.stringify(interp(fen[k])))
    mismatch.push({ key: k, id: interp(fid[k]), en: interp(fen[k]) });
}

// deteksi key mentah di HTML/JS
const files = walk('js'); files.push('index.html');
const rawRe = /\b[a-z]+(\.[a-zA-Z0-9_]+){1,}\b/g;
const suspicious = [];
for (const f of files) {
  const txt = fs.readFileSync(f, 'utf8');
  for (const m of txt.matchAll(rawRe)) {
    const s = m[0];
    if (s.includes('/') || s.startsWith('http')) continue;
    // filter heuristik: bukan property akses objek biasa
    if (/^(data|aria|http|www|json|www|\.)/.test(s)) continue;
    suspicious.push({ file: f, token: s });
  }
}

console.log(JSON.stringify({ onlyId, onlyEn, mismatch, suspicious }, null, 2));
