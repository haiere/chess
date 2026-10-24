import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const css = readFileSync(join(ROOT, 'style.css'), 'utf8');
const boardSrc = readFileSync(join(ROOT, 'js/board-view.js'), 'utf8');

function extractRule(selector) {
  // Find first { ... } block for selector at top level
  const re = new RegExp(`${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\{([^}]*)\\}`);
  const m = css.match(re);
  return m ? m[1] : '';
}

test('style.css: .board is 8x8 grid', () => {
  const rule = extractRule('.board');
  assert.match(rule, /grid-template-columns:\s*repeat\(8,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(rule, /grid-template-rows:\s*repeat\(8,\s*minmax\(0,\s*1fr\)\)/);
});

test('style.css: .board uses aspect-ratio 1/1', () => {
  const rule = extractRule('.board');
  assert.match(rule, /aspect-ratio:\s*1\s*\/\s*1/);
});

test('style.css: .square has min-width/height 0 (prevents overflow)', () => {
  const rule = extractRule('.square');
  assert.match(rule, /min-width:\s*0/);
  assert.match(rule, /min-height:\s*0/);
});

test('style.css: header is sticky and bottom nav is fixed', () => {
  assert.match(extractRule('.app-header'), /position:\s*sticky/);
  assert.match(extractRule('.app-bottomnav'), /position:\s*fixed/);
});

test('style.css: main content is padded past header + bottom nav', () => {
  const rule = extractRule('.app-main');
  assert.match(rule, /padding-bottom:\s*calc\([^)]*--bottomnav-h/);
});

test('style.css: safe-area-inset used for header and bottom nav', () => {
  assert.match(css, /env\(safe-area-inset-bottom/);
  assert.match(css, /--safe-top/);
});

test('board-view.js: builds exactly 8*8=64 squares per render', () => {
  // Static check: squaresInOrder iterates 8x8
  assert.match(boardSrc, /for\s*\(const\s+r\s+of\s+ranks\)\s+for\s*\(const\s+f\s+of\s+files\)/);
});

test('board-view.js: uses replaceChildren (no innerHTML wipe)', () => {
  assert.match(boardSrc, /replaceChildren\(/);
  // Only the initial build wipes innerHTML once
  const wipeCount = (boardSrc.match(/innerHTML\s*=\s*['"]{2}/g) || []).length;
  assert.ok(wipeCount <= 1, `innerHTML='' appears ${wipeCount} times`);
});

test('board-view.js: squares use data-square attribute', () => {
  assert.match(boardSrc, /dataset\.square/);
  assert.match(boardSrc, /setAttribute\('role',\s*'gridcell'\)/);
});

test('board-view.js: orientation flip reverses files and ranks', () => {
  assert.match(boardSrc, /orientation\s*===\s*['"]b['"]\s*\?\s*\[\.\.\.FILES\]\.reverse\(\)/);
  assert.match(boardSrc, /orientation\s*===\s*['"]b['"]\s*\?\s*\[\.\.\.RANKS\]\.reverse\(\)/);
});

test('board-view.js: destroy() removes board element', () => {
  assert.match(boardSrc, /destroy\s*\(\s*\)/);
  assert.match(boardSrc, /replaceChildren\(\)[\s\S]*?\.remove\(\)/);
});
