import { storage } from '../utils/storage.js';
import { renderBoard } from '../components/Board.js';
import { ChessEngine } from '../chess/engine.js';
import { Icon } from '../components/Icon.js';
import { LESSONS } from '../data/lessons.js';

export class LearnPage {
  #progress = storage.get('learn-progress', {});
  #currentLesson = null;
  #stepIndex = 0;
  #engine = new ChessEngine();

  constructor(root) { this.root = root; }

  mount() {
    this.root.innerHTML = `
      <div class="page page-learn">
        <header class="page-header">
          <button class="btn icon-btn" data-nav="game" aria-label="Kembali">${Icon('arrowLeft')}</button>
          <h1>Belajar</h1>
        </header>
        <div class="learn-layout">
          <nav class="learn-sidebar" aria-label="Daftar pelajaran">
            ${LESSONS.map(l => `
              <button class="learn-item ${this.#progress[l.id] === 'done' ? 'done' : ''}" data-lesson="${l.id}">
                <span class="learn-item-title">${l.title}</span>
                <span class="learn-item-level">${l.level}</span>
                ${this.#progress[l.id] === 'done' ? Icon('check') : ''}
              </button>
            `).join('')}
          </nav>
          <article class="learn-content" id="learnContent"></article>
        </div>
      </div>
    `;

    this.root.querySelectorAll('[data-lesson]').forEach(btn => {
      btn.addEventListener('click', () => this.#openLesson(btn.dataset.lesson));
    });
    this.#openLesson(LESSONS[0].id);
  }

  #openLesson(id) {
    this.#currentLesson = LESSONS.find(l => l.id === id);
    this.#stepIndex = 0;
    this.#renderLesson();
  }

  #renderLesson() {
    const l = this.#currentLesson;
    if (!l) return;
    const step = l.content[this.#stepIndex];
    const contentEl = document.getElementById('learnContent');
    if (!contentEl) return;

    contentEl.innerHTML = `
      <div class="learn-header">
        <h2>${l.title}</h2>
        <p class="learn-desc">${l.description}</p>
      </div>
      <div class="learn-body">${step.html || ''}</div>
      ${step.fen ? '<div class="board-wrapper learn-board"><div class="board-container" id="lessonBoard"></div></div>' : ''}
      <div class="learn-nav">
        <button class="btn" id="lessonPrev" ${this.#stepIndex === 0 ? 'disabled' : ''}>${Icon('arrowLeft')}<span>Sebelumnya</span></button>
        <span class="learn-step">${this.#stepIndex + 1} / ${l.content.length}</span>
        <button class="btn accent" id="lessonNext">${this.#stepIndex === l.content.length - 1 ? 'Selesai' : 'Berikutnya'}${Icon('arrowRight')}</button>
      </div>
    `;

    if (step.fen) {
      this.#engine.reset(step.fen);
      renderBoard(document.getElementById('lessonBoard'), this.#engine, {
        interactive: false,
        showCoords: true,
        orientation: 'white',
      });
    }

    document.getElementById('lessonPrev')?.addEventListener('click', () => {
      if (this.#stepIndex > 0) { this.#stepIndex--; this.#renderLesson(); }
    });
    document.getElementById('lessonNext')?.addEventListener('click', () => {
      if (this.#stepIndex < l.content.length - 1) {
        this.#stepIndex++;
        this.#renderLesson();
      } else {
        this.#progress[l.id] = 'done';
        storage.set('learn-progress', this.#progress);
        this.#renderLesson();
        // refresh sidebar
        this.mount();
      }
    });
  }
} 
