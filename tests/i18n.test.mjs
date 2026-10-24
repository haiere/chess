import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// Import LOCALES from i18n.js by reading the source (avoids DOM deps).
const i18nSource = readFileSync(join(ROOT, 'js/i18n.js'), 'utf8');
const match = i18nSource.match(/export const LOCALES\s*=\s*({[\s\S]*?});\s*\n\s*\/\/ -{2,}/);
assert.ok(match, 'LOCALES not found in js/i18n.js');

// Evaluate LOCALES safely
const LOCALES = (new Function(`return (${match[1]});`))();

function flatten(obj, prefix = '', out = {}) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) flatten(v, key, out);
    else out[key] = v;
  }
  return out;
}

test('id and en have identical key structure', () => {
  const idKeys = Object.keys(flatten(LOCALES.id)).sort();
  const enKeys = Object.keys(flatten(LOCALES.en)).sort();
  const missingInEn = idKeys.filter(k => !enKeys.includes(k));
  const missingInId = enKeys.filter(k => !idKeys.includes(k));
  assert.deepEqual(missingInEn, [], `Missing in en: ${missingInEn.join(', ')}`);
  assert.deepEqual(missingInId, [], `Missing in id: ${missingInId.join(', ')}`);
});

test('every leaf value is a non-empty string', () => {
  for (const lang of ['id', 'en']) {
    for (const [k, v] of Object.entries(flatten(LOCALES[lang]))) {
      assert.equal(typeof v, 'string', `${lang}.${k} must be string`);
      assert.ok(v.trim().length > 0, `${lang}.${k} must not be empty`);
    }
  }
});

// Scan js/ and index.html for I18n.t('key') usages
function walk(dir, out = []) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(js|mjs|html)$/.test(f)) out.push(p);
  }
  return out;
}

test('all I18n.t() keys used in source exist in both locales', () => {
  const files = walk(join(ROOT, 'js')).concat([join(ROOT, 'index.html')]);
  const idFlat = flatten(LOCALES.id);
  const enFlat = flatten(LOCALES.en);
  const re = /\bI18n\.t\(\s*['"]([a-zA-Z0-9_.]+)['"]/g;
  const missing = [];
  for (const f of files) {
    const src = readFileSync(f, 'utf8');
    let m;
    while ((m = re.exec(src)) !== null) {
      const key = m[1];
      if (!(key in idFlat)) missing.push(`${f}: id missing ${key}`);
      if (!(key in enFlat)) missing.push(`${f}: en missing ${key}`);
    }
  }
  assert.deepEqual(missing, [], missing.join('\n'));
});

test('no raw dotted keys leak into rendered text', () => {
  // Heuristic: <span>Games.Xyz</span>, >game.msgCheckmate<, etc.
  const files = walk(join(ROOT, 'js'));
  const re = />\s*([A-Za-z]+\.[A-Za-z][A-Za-z0-9_.]*)\s*</g;
  const leaks = [];
  for (const f of files) {
    const src = readFileSync(f, 'utf8');
    let m;
    while ((m = re.exec(src)) !== null) {
      // Only flag plausible i18n keys (lowercase first segment, no spaces)
      if (/^[a-z][a-zA-Z0-9_]*\.[a-zA-Z]/.test(m[1])) leaks.push(`${f}: ${m[1]}`);
    }
  }
  assert.deepEqual(leaks, [], leaks.join('\n'));
});
