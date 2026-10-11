import { GamePage } from './pages/GamePage.js';
import { PuzzlePage } from './pages/PuzzlePage.js';
import { LearnPage } from './pages/LearnPage.js';
import { initTheme } from './utils/theme.js';
import { Icon } from './components/Icon.js';
import { Toast } from './components/Toast.js';

const PAGES = {
  game:   { label: 'Main',    icon: 'playCircle', factory: GamePage },
  puzzle: { label: 'Puzzle',  icon: 'puzzle',     factory: PuzzlePage },
  learn:  { label: 'Belajar', icon: 'learn',      factory: LearnPage },
};

const app = document.getElementById('app');

function buildNav() {
  const nav = document.createElement('nav');
  nav.className = 'bottom-nav';
  nav.setAttribute('aria-label', 'Navigasi utama');
  for (const [key, page] of Object.entries(PAGES)) {
    const btn = document.createElement('button');
    btn.className = 'nav-btn';
    btn.dataset.nav = key;
    btn.setAttribute('aria-label', page.label);
    btn.innerHTML = `${Icon(page.icon, { size: 22 })}<span>${page.label}</span>`;
    btn.addEventListener('click', () => navigate(key));
    nav.appendChild(btn);
  }
  document.body.appendChild(nav);
  return nav;
}

let currentPage = null;

async function navigate(key) {
  if (currentPage?.unmount) currentPage.unmount();
  document.querySelectorAll('.nav-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.nav === key));

  app.innerHTML = '';
  const PageClass = PAGES[key].factory;
  currentPage = new PageClass(app, navigate);
  await currentPage.mount();
  location.hash = key;
}

window.addEventListener('hashchange', () => {
  const key = location.hash.replace('#', '') || 'game';
  if (PAGES[key] && key !== currentPage?.constructor.name?.toLowerCase()) navigate(key);
});

function boot() {
  initTheme();
  buildNav();
  const initial = location.hash.replace('#', '') || 'game';
  navigate(PAGES[initial] ? initial : 'game');
}

document.addEventListener('DOMContentLoaded', boot); 
