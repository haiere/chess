// Pemeriksaan aksesibilitas statis pada index.html (tanpa DOM/jsdom).
// Tes overflow & layout nyata ada di tests/e2e/smoke.py (Playwright).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const html = readFileSync(join(root, 'index.html'), 'utf8');

test('setiap tombol punya nama aksesibel (teks atau aria-label)', () => {
  const buttons = [...html.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/g)];
  assert.ok(buttons.length > 0);
  const unlabeled = buttons
    .filter(([, attrs, inner]) => !/aria-label\s*=|data-i18n-aria\s*=/.test(attrs) && !inner.replace(/<[^>]+>/g, '').trim())
    .map(([m]) => m.slice(0, 80));
  assert.deepEqual(unlabeled, []);
});

test('setiap tombol teks wajib punya data-i18n (tidak ada teks hardcoded)', () => {
  const buttons = [...html.matchAll(/<button\b([^>]*)>([^<]+)<\/button>/g)];
  const hardcoded = buttons.filter(([, attrs]) => !/data-i18n\s*=/.test(attrs)).map(([, , t]) => t.trim());
  assert.deepEqual(hardcoded, []);
});

test('skip link dan landmark utama ada', () => {
  assert.match(html, /href="#main|href="#content|skip/i);
});
