# Hajir Chess

<div align="center">

<img src="https://hajir.is-a.dev/chess/resources/icon.png" alt="Hajir Chess Logo" width="120" />

**A modern, dependency-free chess application for the browser.**

Play locally, challenge the built-in AI, solve puzzles, study chess lessons, and work with PGN and FEN tools — entirely in your browser.

[![Play Online](https://img.shields.io/badge/Play%20Online-hajir.is--a.dev/chess-7c3aed?style=for-the-badge&logo=googlechrome&logoColor=white)](https://hajir.is-a.dev/chess)
[![Source Code](https://img.shields.io/badge/Source%20Code-GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/haiere/chess)

[![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=flat-square)](https://github.com/haiere/chess)
[![Last Commit](https://img.shields.io/github/last-commit/haiere/chess?style=flat-square&logo=git&logoColor=white)](https://github.com/haiere/chess/commits/main)
[![Stars](https://img.shields.io/github/stars/haiere/chess?style=flat-square&logo=github)](https://github.com/haiere/chess/stargazers)
[![License](https://img.shields.io/badge/License-See%20LICENSE-blue?style=flat-square)](https://github.com/haiere/chess/blob/main/LICENSE)

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)](https://developer.mozilla.org/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES2020-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/docs/Web/JavaScript)
[![Dependencies](https://img.shields.io/badge/Dependencies-None-22c55e?style=flat-square)](package.json)

[![i18n](https://img.shields.io/badge/i18n-ID%20%2B%20EN-0052CC?style=flat-square)](https://github.com/haiere/chess)
[![Responsive](https://img.shields.io/badge/Responsive-Mobile%20%2B%20Desktop-22c55e?style=flat-square)](https://github.com/haiere/chess)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-ff69b4?style=flat-square)](https://github.com/haiere/chess/pulls)

</div>
---

## Overview

Hajir Chess is a self-contained chess application built with pure HTML, CSS, and JavaScript.

It runs directly in the browser without a framework, backend, account, bundler, or runtime dependency.

### Highlights

- Player vs Player on the same device.
- Player vs Computer with multiple difficulty levels.
- Configurable timers and Fischer increment.
- 50 validated chess puzzles across four difficulty levels.
- 50 bilingual lessons with interactive board exercises.
- Legal move validation, check, checkmate, castling, en passant, promotion, and draw detection.
- PGN export and FEN import/export.
- Move history and captured-piece tracking.
- Six board themes and light, dark, and system interface themes.
- Keyboard, mouse, touch, and drag-and-drop support.
- Skeleton loading states with error and retry fallbacks.
- Bahasa Indonesia and English.
- Local persistence for preferences, puzzle statistics, and lesson progress.
- No account, backend, analytics, or tracking.

## Live Demo

[Play Hajir Chess](https://hajir.is-a.dev/chess)

<div align="center">
  <img
    src="https://i.postimg.cc/v8N1R9WJ/Screenshot-20261017-102642.jpg"
    alt="Hajir Chess preview"
    width="900"
  >
</div>

## Features

### Game Modes

- Player vs Player.
- Player vs Computer.
- White, Black, or random player color.
- Easy, Medium, and Hard AI difficulty.
- Undo and redo.
- Resign and draw controls.
- Board flipping.
- Captured-piece display.
- Standard Algebraic Notation move history.

### Time Controls

- 10+0 Rapid.
- 5+3 Blitz.
- 3+2 Blitz.
- 1+0 Bullet.
- Unlimited time.
- Fischer increment support.

### Puzzle Mode

- 50 engine-validated puzzles.
- Easy, Medium, Hard, and Expert levels.
- Random, next, previous, and daily navigation.
- Progressive hints.
- Retry and reveal-solution controls.
- Puzzle statistics, streaks, mistakes, and completion time.
- Direct hash routes such as `#/puzzle/qlv01`.

### Learning Mode

- 50 bilingual chess lessons.
- Beginner, Elementary, Intermediate, and Advanced levels.
- Interactive 8×8 chessboard exercises.
- Board coordinates, piece movement, checkmate, castling, openings, tactics, and basic endgames.
- Lesson progress saved locally.
- Direct hash routes such as `#/learning/lesson-01`.

### Interface

- Responsive layout for mobile, tablet, and desktop.
- Desktop dual-panel layout.
- Mobile bottom navigation.
- Six board themes.
- Light, dark, and system themes.
- Inline SVG icons.
- Keyboard navigation and focus indicators.
- Reduced-motion support.
- Skeleton shimmer loading.
- Empty, error, and retry states.
- Hash-based routing.

## Routes

```text
#/game
#/puzzle
#/puzzle/:id
#/learning
#/learning/:id
#/settings
```

## Technology

| Area | Technology |
| --- | --- |
| Markup | Semantic HTML5 |
| Styling | CSS3, Custom Properties, Grid, Flexbox |
| Logic | Vanilla JavaScript, ES2020 modules |
| Audio | Web Audio API |
| Storage | localStorage with in-memory fallback |
| Routing | Hash-based client-side routing |
| Icons | Inline SVG |

The application has no framework, bundler, backend, or runtime dependency.

## Requirements

- A modern browser with JavaScript enabled.
- Chrome, Firefox, Edge, or Safari.
- Node.js 18 or later for tests.
- Internet access is only required for external font loading.

## Installation

```bash
git clone [https://github.com/haiere/chess.git](https://github.com/haiere/chess.git)
cd chess
```

No package installation or build step is required to run the application.

### Run Directly

Open `index.html` in a modern browser.

### Run with a Local Server

```bash
python3 -m http.server 8080
```

Open:

```text
http://localhost:8080
```

Alternatively:

```bash
npx serve .
```

## Quick Start

1. Open the live demo or local development server.
2. Select **New Game**.
3. Choose the game mode, color, AI difficulty, timer, and board theme.
4. Select a piece and choose a highlighted destination.
5. Review the move history.
6. Export the game as PGN or the position as FEN.
7. Open **Puzzle** or **Learning** to practice.

## Interaction

| Method | Usage |
| --- | --- |
| Click | Select a piece, then select a legal destination |
| Tap | Tap a piece, then tap a legal destination |
| Drag and drop | Drag a piece to a legal square |
| Keyboard | Navigate the board with arrow keys and select with Enter |

Tap-to-move is recommended on small touchscreens.

## Internationalization

Hajir Chess supports:

- Bahasa Indonesia as the default language.
- English.
- Automatic browser-language detection.
- Live language switching.
- Persistent language preference.
- Translated buttons, menus, dialogs, toasts, statuses, errors, and ARIA labels.
- Indonesian fallback for missing translations.
- Synchronized `html lang` attribute.

Translation files:

```text
locales/
├── id.json
└── en.json
```

When adding a translation key, update both locale files and keep their placeholders consistent.

## Accessibility

The application includes:

- Keyboard navigation.
- Skip-link support.
- Visible focus indicators.
- Escape-to-close dialogs.
- Arrow-key board navigation.
- ARIA labels and live regions.
- Semantic board roles.
- Screen-reader-friendly controls.
- Reduced-motion support.
- Inline SVG icons with appropriate accessibility attributes.

## Privacy and Storage

Hajir Chess runs locally in the browser.

- No account is required.
- No game data is sent to a server.
- No analytics or tracking scripts are included.
- Preferences and progress are stored locally.
- The application falls back to in-memory storage if localStorage is unavailable.
- Chess rules and AI calculations run on the device.

## Testing

Run the test suite with:

```bash
node tests/run.mjs
```

If locale generation is required:

```bash
node tests/build-locales.mjs
node tests/run.mjs
```

The tests cover chess rules, legal moves, checkmate, stalemate, castling, en passant, promotion, FEN validation, puzzle data, lesson data, translation parity, and DOM references.

## Project Structure

```text
chess/
├── index.html
├── style.css
├── js/
│   ├── main.js
│   ├── engine.js
│   ├── game.js
│   ├── puzzle.js
│   ├── puzzle-data.js
│   ├── lessons.js
│   ├── lessons-data.js
│   ├── i18n.js
│   ├── storage.js
│   ├── audio.js
│   ├── board-view.js
│   ├── components/
│   ├── bridge/
│   ├── chess/
│   ├── pages/
│   └── utils/
├── locales/
│   ├── id.json
│   └── en.json
├── tests/
├── scripts/
├── package.json
├── LICENSE
└── README.md
```

## Deployment

Hajir Chess works with static hosting providers, including:

- GitHub Pages.
- Cloudflare Pages.
- Netlify.
- Vercel.
- Firebase Hosting.
- Any standard static web server.

For GitHub Pages:

1. Push the repository to GitHub.
2. Open **Settings → Pages**.
3. Select the deployment branch.
4. Save the configuration.
5. Open the generated Pages URL.

No build command is required.

## Contributing

Contributions, bug reports, and suggestions are welcome.

```bash
git checkout -b feature/your-feature-name
```

Make your changes and run:

```bash
node tests/build-locales.mjs
node tests/run.mjs
```

Then commit and push:

```bash
git add .
git commit -m "Describe your change"
git push origin feature/your-feature-name
```

Please:

- Keep the project dependency-free.
- Preserve existing DOM IDs used by JavaScript.
- Test mobile, desktop, touch, mouse, and keyboard interaction.
- Do not break PGN or FEN support.
- Use inline SVG for interface icons.
- Keep all user-facing text inside the i18n system.
- Update the README for major changes.
- Run the complete test suite before opening a pull request.

## Roadmap

- Larger puzzle library.
- Puzzle variations and alternate solutions.
- More complete draw detection.
- Web Worker support for AI calculations.
- Optional Stockfish integration.
- Additional interface languages.
- TypeScript migration.
- Optional offline PWA support.

## Known Limitations

- The built-in AI is intentionally lightweight.
- Hard difficulty may require more processing time on low-end devices.
- AI calculations currently run on the main thread.
- Puzzle variations are not currently supported.
- Tap-to-move is recommended on some mobile browsers.

## License

This project is open source. See [`LICENSE`](./LICENSE) for the complete license terms.

## Credits

Developed by **Haiere** and **Hajir Studio**.

- Repository: [github.com/haiere/chess](https://github.com/haiere/chess)
- Live Demo: [hajir.is-a.dev/chess](https://hajir.is-a.dev/chess)

<div align="center">

Made with care for the chess community.

[Back to top](#hajir-chess)

</div>
