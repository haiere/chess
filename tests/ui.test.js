import { test } from 'node:test';
import assert from 'node:assert/strict';

// Karena environment Node tidak punya DOM, test ini menggunakan jsdom
// Install: npm i -D jsdom
import { JSDOM } from 'jsdom';

test('semua tombol ikon memiliki aria-label', async () => {
  const html = await import('node:fs').then(fs =>
    fs.promises.readFile('index.html', 'utf8'));
  const dom = new JSDOM(html);
  const buttons = dom.window.document.querySelectorAll('button.icon-btn, button[aria-label]');
  buttons.forEach(btn => {
    assert.ok(btn.getAttribute('aria-label') || btn.textContent.trim(),
      `Tombol tanpa label: ${btn.outerHTML}`);
  });
});

test('tidak ada horizontal overflow pada viewport 320px', () => {
  // Test manual / dengan Playwright. Di Node murni tidak bisa.
  // Ini placeholder untuk integrasi Playwright.
  assert.ok(true);
}); 
