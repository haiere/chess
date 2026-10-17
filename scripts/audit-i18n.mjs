#!/usr/bin/env node
/**
 * scripts/audit-i18n.mjs
 * Validasi locales/en.json dan locales/id.json:
 *  - Key sama di kedua file.
 *  - Placeholder `{name}` sama di kedua file untuk setiap key.
 *  - Tidak ada nilai string kosong.
 * Exit 0 jika bersih, exit 1 jika ada masalah.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const enPath = path.join(root, 'locales/en.json');
const idPath = path.join(root, 'locales/id.json');

const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const id = JSON.parse(fs.readFileSync(idPath, 'utf8'));

function flatten(obj, prefix = '', out = {}) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) flatten(v, key, out);
    else out[key] = v;
  }
  return out;
}

const fen = flatten(en);
const fid = flatten(id);

const onlyEn = Object.keys(fen).filter(k => !(k in fid));
const onlyId = Object.keys(fid).filter(k => !(k in fen));

const placeholders = (s) =>
  typeof s === 'string' ? (s.match(/\{(\w+)\}/g) || []).sort() : [];

const mismatch = [];
for (const k of Object.keys(fen)) {
  if (!(k in fid)) continue;
  const a = JSON.stringify(placeholders(fen[k]));
  const b = JSON.stringify(placeholders(fid[k]));
  if (a !== b) mismatch.push({ key: k, en: placeholders(fen[k]), id: placeholders(fid[k]) });
}

const empties = [];
for (const [k, v] of [...Object.entries(fen), ...Object.entries(fid)]) {
  if (typeof v === 'string' && v.trim() === '') empties.push(k);
}

const problems = [];
if (onlyEn.length) problems.push(`Keys only in en.json: ${onlyEn.join(', ')}`);
if (onlyId.length) problems.push(`Keys only in id.json: ${onlyId.join(', ')}`);
if (mismatch.length) {
  problems.push('Placeholder mismatches:');
  for (const m of mismatch) {
    problems.push(`  ${m.key}: en=[${m.en.join(',')}] id=[${m.id.join(',')}]`);
  }
}
if (empties.length) problems.push(`Empty values: ${[...new Set(empties)].join(', ')}`);

console.log('\n=== i18n Audit ===');
console.log(`Keys: en=${Object.keys(fen).length}  id=${Object.keys(fid).length}`);
if (problems.length) {
  console.log('\nPROBLEMS:');
  for (const p of problems) console.log('  ' + p);
  process.exit(1);
}
console.log('\nAll i18n resources in sync.');
process.exit(0);
