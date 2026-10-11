import { storage } from './storage.js';

const THEMES = ['dark', 'light', 'system'];
const BOARD_THEMES = ['classic', 'emerald', 'midnight', 'rose', 'bw', 'neon'];

export function initTheme() {
  const saved = storage.get('theme', 'system');
  applyTheme(saved);
  applyBoardTheme(storage.get('board-theme', 'classic'));

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (storage.get('theme', 'system') === 'system') applyTheme('system');
  });
}

export function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === 'system') {
    const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.setAttribute('data-theme', dark ? 'dark' : 'light');
  } else {
    root.setAttribute('data-theme', theme);
  }
  storage.set('theme', theme);
}

export function applyBoardTheme(theme) {
  if (!BOARD_THEMES.includes(theme)) theme = 'classic';
  document.documentElement.setAttribute('data-board-theme', theme);
  storage.set('board-theme', theme);
}

export function cycleTheme() {
  const current = storage.get('theme', 'system');
  const idx = THEMES.indexOf(current);
  const next = THEMES[(idx + 1) % THEMES.length];
  applyTheme(next);
  return next;
} 
