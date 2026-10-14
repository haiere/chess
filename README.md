<div align="center">

# Hajir Chess

**A modern, responsive, dependency-free chess application for the browser.**

Play against another person, challenge the built-in computer opponent, solve chess puzzles, learn chess fundamentals, and analyze games using PGN and FEN tools.

[![Play Online](https://img.shields.io/badge/Play%20Online-hajir.is--a.dev-7c3aed?style=for-the-badge&logo=googlechrome&logoColor=white)](https://hajir.is-a.dev/chess)
[![Source Code](https://img.shields.io/badge/Source-GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/haiere/chess)

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)](https://developer.mozilla.org/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES2020-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/docs/Web/JavaScript)
[![Dependencies](https://img.shields.io/badge/Dependencies-None-22c55e?style=flat-square)](#technology)
[![License](https://img.shields.io/badge/License-See%20LICENSE-blue?style=flat-square)](./LICENSE)

[![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=flat-square)](#roadmap)
[![Version](https://img.shields.io/badge/Version-1.0.0-blue?style=flat-square)](#changelog)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-ff69b4?style=flat-square)](#contributing)
[![Issues](https://img.shields.io/badge/Issues-Open-ff9800?style=flat-square)](https://github.com/haiere/chess/issues)
[![Stars](https://img.shields.io/github/stars/haiere/chess?style=flat-square&logo=github)](https://github.com/haiere/chess/stargazers)
[![Last Commit](https://img.shields.io/github/last-commit/haiere/chess?style=flat-square&logo=git)](https://github.com/haiere/chess/commits)

[![Android](https://img.shields.io/badge/Android-Capacitor-3DDC84?style=flat-square&logo=android&logoColor=white)](#android-app-capacitor)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=flat-square&logo=pwa&logoColor=white)](#roadmap)
[![Accessibility](https://img.shields.io/badge/A11y-WCAG%20AA-005A9C?style=flat-square&logo=w3c&logoColor=white)](#accessibility)
[![Bilingual](https://img.shields.io/badge/i18n-ID%20%2B%20EN-0052CC?style=flat-square&logo=googletranslate&logoColor=white)](#internationalization)
[![Mobile Friendly](https://img.shields.io/badge/Responsive-320px%20to%204K-22c55e?style=flat-square&logo=responsive&logoColor=white)](#interface)

[![Buy Me a Coffee](https://img.shields.io/badge/Buy_Me_a_Coffee-Support_this_work-FFDD00?style=flat-square&logo=buymeacoffee&logoColor=black)](https://buymeacoffee.com/hajirstudio)
[![Sociabuzz](https://img.shields.io/badge/Sociabuzz-Support_this_work-2563EB?style=flat-square)](https://sociabuzz.com/HajirStudio)

</div>

---

## Overview

Hajir Chess is a self-contained chess application that runs entirely in the browser.

It supports:

- Player vs Player games.
- Player vs Computer games.
- Configurable time controls.
- Chess puzzles with progressive hints.
- Interactive bilingual lessons.
- Move history and captured pieces.
- PGN export and FEN import/export.
- Custom board and interface themes.
- Keyboard, mouse, touch, and drag-and-drop interaction.
- Local preference and progress persistence.

The application uses plain HTML, CSS, and JavaScript. It requires no framework, bundler, backend, account, or package manager.

> All game calculations, AI processing, and user preferences remain on the device.

---

## Preview

<div align="center">
  <img src="https://api.pikwy.com/web/6acca01f441d6662de5dd3a0.jpg" alt="Hajir Chess preview" width="900">
</div>

---

## Live Demo

Play Hajir Chess online:

**[https://hajir.is-a.dev/chess](https://hajir.is-a.dev/chess)**

---

## Highlights

| Area | Details |
| --- | --- |
| Chess rules | Legal moves, check, checkmate, stalemate, castling, en passant, promotion, and draw conditions |
| Game modes | Player vs Player and Player vs Computer |
| AI | Minimax with alpha-beta pruning and three difficulty levels |
| Time controls | Rapid, Blitz, Bullet, unlimited time, and Fischer increment |
| Puzzles | Four difficulty tiers, hints, statistics, and daily puzzles |
| Lessons | Beginner-to-intermediate lessons with quizzes |
| Board themes | Six board themes |
| Interface themes | Light, dark, and system themes |
| Languages | Bahasa Indonesia and English |
| Game tools | Move history, PGN export, FEN import/export, and board flipping |
| Accessibility | Keyboard navigation, ARIA labels, focus indicators, and reduced-motion support |
| Storage | Preferences, puzzle statistics, and lesson progress saved locally |

---

## Features

### Gameplay

- Player vs Player on the same device.
- Player vs Computer with Easy, Medium, and Hard difficulty.
- White, Black, or Random player color.
- Legal move validation.
- Check, checkmate, and stalemate detection.
- Castling, en passant, promotion, and under-promotion.
- Undo and redo support.
- Resign and draw controls.
- Captured-piece tracking.
- Move history in Standard Algebraic Notation.

### Time Controls

Available presets:

| Preset | Category |
| --- | --- |
| `10+0` | Rapid |
| `5+3` | Blitz |
| `3+2` | Blitz |
| `1+0` | Bullet |
| Unlimited | No timer |

Fischer increment is automatically added after each move when configured.

### Puzzle Mode

- Engine-validated positions and solutions.
- Easy, Medium, Hard, and Master difficulty tiers.
- Random, next, previous, and daily puzzle navigation.
- Progressive hints:
  1. Highlight the origin square.
  2. Highlight the destination square.
  3. Play the correct move.
- Try Again and Reveal Solution controls.
- Solved puzzle, mistake, streak, and time statistics.
- Session-based anti-repeat selection.

### Learning Mode

Lessons cover:

- Board coordinates and piece movement.
- Piece values.
- Check and checkmate.
- Castling, en passant, and promotion.
- Opening principles.
- Center control and development.
- King safety.
- Forks, pins, skewers, discovered attacks, and back-rank tactics.
- Basic endgames.
- Common beginner mistakes.

Each lesson includes a learning goal, explanatory content, example positions, and interactive quizzes.

### Interface

- Responsive layout for phones, tablets, laptops, and desktop screens.
- Six board themes:
  - Classic Brown.
  - Emerald.
  - Midnight Blue.
  - Rose.
  - Black and White.
  - Neon Cyberpunk.
- Light, dark, and system interface themes.
- Board orientation switching.
- Coordinate labels.
- Sound effects generated with the Web Audio API.
- Low-time warnings.
- Mobile bottom navigation.
- Inline SVG icons without emoji or icon fonts.

---

## Technology

Hajir Chess is built with standard web technologies:

| Layer | Technology |
| --- | --- |
| Markup | HTML5 with semantic elements and ARIA attributes |
| Styling | CSS3, custom properties, CSS Grid, and Flexbox |
| Logic | Vanilla JavaScript, ES2020 modules, strict mode |
| Audio | Web Audio API with oscillator-generated sounds |
| Clipboard | Clipboard API with fallback support |
| Storage | `localStorage` with an in-memory fallback |
| Android | Capacitor wrapper with `@capacitor/status-bar` |

There are no frameworks, bundlers, runtime dependencies, or third-party JavaScript libraries in the web build.

---

## Requirements

- A modern browser with JavaScript enabled.
- Recent Chrome, Firefox, Edge, or Safari.
- Node.js 18 or later for running the test suite.
- An internet connection is only needed to load the Inter font from Google Fonts.

---

## Installation

### Clone the Repository

```bash
git clone https://github.com/haiere/chess.git
cd chess
```

Run Directly

Open index.html in a modern browser.

Run with a Local Server

```bash
python3 -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

Alternatively:

```bash
npx serve .
```

No installation or build step is required.

---

Quick Start

1. Open the live demo or run the project locally.
2. Select New Game.
3. Choose the game mode, player color, AI difficulty, timer, and board theme.
4. Select a piece and choose a highlighted destination square.
5. Review moves using the move history panel.
6. Copy or download the game as PGN.
7. Export the current position as FEN when needed.

---

Android App (Capacitor)

The website is wrapped as a native Android app with Capacitor.
No external URLs are used as sources — all assets are embedded from dist/.

Prerequisites

· Node.js 18 or later.
· JDK 17.
· Android Studio with SDK and automatic Gradle wrapper.

Commands

```bash
npm install              # install dependencies
npm run build            # copy web app to dist/ + vendor Capacitor plugins
npx cap add android      # once only — generate android/ folder
npm run build:android    # build + cap sync android
npx cap open android     # open in Android Studio
```

Shortcuts:

· npm run sync:android — sync only.
· npm run open:android — open in Android Studio.

Building APK / AAB

Target Command Output
Debug APK cd android && ./gradlew assembleDebug android/app/build/outputs/apk/debug/app-debug.apk
Release APK Android Studio → Build → Generate Signed Bundle / APK → APK android/app/build/outputs/apk/release/app-release.apk
AAB (Play Store) Android Studio → same dialog → Android App Bundle android/app/build/outputs/bundle/release/app-release.aab

Configuration

· capacitor.config.json — appId: dev.isahajir.chess, appName: Hajir Chess, webDir: dist.
· Status bar colors and light/dark icons are controlled at runtime by js/native-bridge.js through @capacitor/status-bar.
· Plugins are vendored into dist/vendor/ by scripts/build.mjs.
· The Android back button navigates pages first before exiting the app.
· Offline bilingual: inline locales in js/locales.js are included in the APK.

---

Interaction

Method Usage
Click Select a piece, then select a highlighted destination square
Tap Tap a piece, then tap a highlighted destination square
Drag and drop Drag a piece to a legal square on desktop
Touch drag Drag pieces on supported touch devices
Keyboard Navigate the board with arrow keys and select with Enter

Tap-to-move is recommended on small touchscreens.

The board prevents duplicate moves caused by rapid taps or touch events that also trigger mouse events.

---

Game Controls

Control Description
New Game Opens the game configuration dialog
Undo Reverts the latest move; in PvC mode, also reverts the AI reply
Redo Reapplies an undone move
Resign Ends the game and declares the opponent the winner
Draw Offers or confirms a draw
Flip Board Switches the board perspective
Copy PGN Copies the current game in PGN format
Download PGN Downloads the game as a .pgn file
Settings Opens application settings
Theme Changes the interface theme
Sound Enables or disables sound effects
Import FEN Loads a position from a FEN string
Export FEN Copies the current position as FEN

---

AI Difficulty

Level Search Description
Easy Random legal move Suitable for beginners
Medium 2-ply minimax Uses alpha-beta pruning and material evaluation
Hard 3-ply minimax Stronger play but may require more processing time

The AI is intentionally lightweight and runs directly in the browser.

---

Move History

Moves are displayed using Standard Algebraic Notation.

Notation Meaning
e4 Pawn move
Nf3 Knight move
O-O Kingside castling
O-O-O Queenside castling
exd5 Capture
e.p. En passant
+ Check
# Checkmate

The history panel automatically scrolls as new moves are played.

---

FEN Support

FEN describes a complete chess position in a single line.

Starting position:

```text
rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
```

A complete FEN string contains six fields:

1. Piece placement.
2. Active color.
3. Castling availability.
4. En passant target square.
5. Halfmove clock.
6. Fullmove number.

Imported FEN strings are validated before being applied. Invalid input is rejected while the current position remains unchanged.

---

PGN Support

PGN records a chess game in a portable text format.

Hajir Chess supports:

· Copying the current game to the clipboard.
· Downloading the game as a .pgn file.
· Standard Algebraic Notation.
· Castling.
· Captures.
· Promotion.
· Check and checkmate.
· En passant.

---

Internationalization

Hajir Chess currently supports:

· Bahasa Indonesia.
· English.

The language system includes:

· Automatic browser-language detection.
· Live language switching without reloading.
· Persistent language preference.
· Translated modals, toasts, game statuses, and ARIA labels.
· Indonesian fallback when a translation is unavailable.

Translation files are located in:

```text
locales/
├── id.json
└── en.json
```

Both locale files must contain identical keys and placeholders.

Adding a Translation Key

1. Add the key to both locale files.
2. Keep the same key path and placeholders.
3. Run the test suite.
4. Regenerate the locale bundle.

```bash
node tests/run.mjs
node tests/build-locales.mjs
```

---

Accessibility

Hajir Chess includes:

· Keyboard navigation.
· Skip link support.
· Focus-visible outlines.
· Escape-to-close modal behavior.
· Arrow-key board navigation.
· Enter and Space support for promotion choices.
· ARIA labels and live regions.
· role="grid" and role="gridcell" board semantics.
· Screen-reader-friendly controls.
· Reduced-motion support through prefers-reduced-motion.

All decorative icons use inline SVG and are marked with aria-hidden="true".

---

Preference Storage

Preferences are stored locally using keys prefixed with chess:.

Stored data includes:

· Interface theme.
· Board theme.
· Sound preference.
· Coordinate visibility.
· Board orientation.
· Last selected game mode.
· Player color.
· AI difficulty.
· Time control.
· Language.
· Puzzle statistics.
· Lesson progress.

No game state is saved between sessions.

If localStorage is unavailable, the application falls back to in-memory storage and continues running without errors.

---

Offline Support

The core application runs locally in the browser and does not require a backend.

Available offline:

· Board rendering.
· Chess rules and validation.
· AI calculations.
· Timers.
· Move history.
· PGN and FEN tools.
· Sound effects after audio initialization.
· Puzzle mode.
· Lesson mode.

The only external resource is the Inter font stylesheet from Google Fonts. Once cached, the application can continue working without an internet connection.

---

Privacy

Hajir Chess is designed to operate locally on the user's device.

· No game data is sent to a server.
· No account is required.
· No application cookies are used.
· No analytics or tracking scripts are included.
· Only non-identifying preferences are stored locally.
· Chess calculations and AI processing happen in the browser.
· The optional Buy Me a Coffee link opens an external website only when selected.

---

Project Structure

```text
chess/
├── index.html
├── style.css
├── style.ext.css
├── js/
│   ├── main.js                  # ESM entry point
│   ├── storage.js               # Storage wrapper with fallback
│   ├── i18n.js                  # Bilingual engine (embedded locales)
│   ├── locales.js               # Generated locale bundle
│   ├── audio.js                 # Web Audio API sound effects
│   ├── pieces.js                # Piece rendering helpers
│   ├── engine.js                # Immutable chess rules engine
│   ├── board-view.js            # Reusable board component
│   ├── game.js                  # Game mode (PvP + PvC + AI)
│   ├── puzzle-data.js           # Puzzle dataset
│   ├── puzzle.js                # Puzzle mode
│   ├── lessons-data.js          # Lesson dataset
│   ├── lessons.js               # Learning mode
│   ├── native-bridge.js         # Capacitor runtime bridge
│   ├── app.js                   # Legacy app bootstrap
│   ├── bridge/
│   │   ├── game-bridge.js       # HTML <-> GameMode adapter
│   │   ├── puzzle-bridge.js     # HTML <-> PuzzleMode adapter
│   │   ├── learn-bridge.js      # HTML <-> LessonsMode adapter
│   │   ├── id-shim.js           # Persistent element shim
│   │   ├── visual-polish.js     # Runtime CSS polish
│   │   ├── i18n-extend.js       # i18n runtime extensions
│   │   └── index.js             # Bridge orchestrator
│   ├── components/
│   │   ├── Board.js
│   │   ├── Icon.js
│   │   └── LanguageSwitcher.js
│   ├── chess/
│   │   ├── engine.js
│   │   └── constants.js
│   ├── puzzle/
│   │   └── provider.js
│   ├── pages/
│   │   ├── PuzzlePage.js
│   │   └── LearnPage.js
│   ├── data/
│   │   ├── puzzles.js
│   │   └── Lesson.js
│   ├── icons/
│   │   └── svg.js
│   └── utils/
│       ├── storage.js
│       └── theme.js
├── locales/
│   ├── id.json
│   └── en.json
├── tests/
│   ├── run.mjs
│   ├── build-locales.mjs
│   ├── engine.test.js
│   ├── chess.rules.test.js
│   └── i18n.test.js
├── scripts/
│   └── build.mjs
├── capacitor.config.json
├── package.json
├── LICENSE
└── README.md
```

---

Architecture

The project follows several design principles:

· Pure chess engine: Chess.applyMove() returns a new immutable state.
· Reusable board component: BoardView handles mouse, touch, drag, and keyboard interaction.
· Provider pattern: puzzle data is accessed through PuzzleProvider.
· Bridge pattern: HTML layout is decoupled from game modules via js/bridge/.
· Runtime CSS polish: theme tokens and board rendering are applied at runtime.
· Separated content: lesson data and translations are independent from UI components.
· Zero dependency: the project works without npm installation or a bundler.
· Static-host friendly: compatible with GitHub Pages and other static hosting providers.

---

Testing

The project includes a Node.js test suite.

```bash
node tests/run.mjs
```

The test suite validates:

· Move generation.
· Legal move handling.
· Checkmate and stalemate.
· Castling and en passant.
· Promotion and under-promotion.
· FEN validation.
· State immutability.
· Insufficient material.
· Puzzle positions and solutions.
· Lesson structure and example FENs.
· Translation key parity.
· HTML translation attributes.
· JavaScript translation references.
· DOM element references.

Selected engine tests include:

```text
perft(3) = 8902
perft(4) = 197281
Kiwipete(2) = 2039
```

---

Extending the Project

Add a Puzzle

Edit js/puzzle-data.js:

```js
{
  id: 'puzzle-unique-001',
  difficulty: 'medium',
  rating: 1000,
  title: 'Judul Bahasa Indonesia',
  title_en: 'English Title',
  fen: '...',
  solution: ['d5e7', 'g8h8', 'e7c8'],
  themes: ['fork', 'advantage']
}
```

The test suite validates the FEN, solution legality, difficulty, and puzzle themes.

Add a Lesson

Edit js/lessons-data.js:

```js
{
  id: 'unique-lesson-id',
  title: 'Lesson Title',
  level: 'beginner',
  description: 'One-sentence summary.',
  goal: 'What the learner should achieve.',
  steps: [
    {
      title: 'Introduction',
      text: 'Lesson content.'
    },
    {
      title: 'Example',
      text: 'Example position.',
      board: '<example FEN>'
    },
    {
      title: 'Quiz',
      text: '',
      quiz: {
        question: 'Question?',
        options: ['A', 'B', 'C', 'D'],
        answer: 1
      }
    }
  ]
}
```

---

Troubleshooting

AI Is Not Moving

Check that:

· The selected mode is Player vs Computer.
· It is currently the computer's turn.
· The game has not ended.
· The position is valid.

Hard difficulty may take longer on low-end devices.

Timer Is Not Running

Timers only run during an active game with a positive time limit.

No Sound

Browsers require user interaction before audio playback is allowed.

Try:

· Clicking the board or a button.
· Enabling Sound in the controls.
· Checking the browser tab volume.
· Checking the device volume.

Touch Interaction Is Not Working

Use tap-to-select and tap-to-move. This is the recommended interaction method on small touchscreens.

FEN Import Fails

Ensure that the FEN contains all six fields and uses valid:

· Piece symbols.
· Active color.
· Castling notation.
· En passant square.
· Halfmove clock.
· Fullmove number.

Preferences Are Not Saved

Preferences require access to localStorage. Private browsing or strict browser privacy settings may cause preferences to reset after refresh.

Board Appears Blank

If the board does not render:

1. Open the browser console.
2. Look for [main-v6] LOADED and [GameBridge] log lines.
3. Perform a hard refresh (Ctrl+Shift+R / Cmd+Shift+R).
4. Clear cached files if the issue persists.

---

Browser Compatibility

Hajir Chess targets current versions of:

· Google Chrome.
· Mozilla Firefox.
· Microsoft Edge.
· Apple Safari.

The application uses:

· ES2020 JavaScript modules.
· CSS Grid and Flexbox.
· CSS custom properties.
· Web Audio API.
· Clipboard API with fallback.
· Pointer, mouse, and touch events.

---

Deployment

Hajir Chess can be deployed to any static hosting platform.

Supported platforms include:

· GitHub Pages.
· Cloudflare Pages.
· Netlify.
· Vercel.
· Firebase Hosting.
· Any standard static web server.

GitHub Pages

1. Push the repository to GitHub.
2. Open Settings → Pages.
3. Select the deployment branch.
4. Save the configuration.
5. Open the generated Pages URL.

No build command is required.

Cloudflare Pages

Use the following configuration:

```text
Build command: None
Output directory: /
```

Netlify or Vercel

Import the repository and deploy it as a static site. No build command or environment variables are required.

---

Roadmap

Planned improvements:

· Larger puzzle library.
· External puzzle dataset adapters.
· Interactive lesson board challenges.
· Threefold repetition detection.
· More complete insufficient-material detection.
· Web Worker support for AI calculations.
· Optional Stockfish integration.
· Progressive Web App support.
· Additional interface languages.
· TypeScript migration for the runtime layer.

---

Known Limitations

· The AI uses 2-ply to 3-ply minimax with simple material evaluation.
· Hard difficulty may feel slow on low-end phones.
· AI calculations currently run on the main thread.
· The built-in puzzle dataset is relatively small.
· Lessons currently use static example boards and quizzes.
· Puzzle variations are not supported.
· Each puzzle currently has one main solution line.
· Tap-to-move is recommended on iOS Safari.

---

Contributing

Contributions, bug reports, and suggestions are welcome.

Development Workflow

```bash
git checkout -b feature/your-feature-name
```

Make your changes, then run:

```bash
node tests/run.mjs
```

Commit and push your branch:

```bash
git add .
git commit -m "Describe your change"
git push origin feature/your-feature-name
```

Finally, open a pull request.

Contribution Guidelines

· Keep the project dependency-free.
· Preserve existing DOM IDs used by JavaScript.
· Maintain responsive behavior.
· Test mouse, touch, and keyboard interactions.
· Do not break PGN or FEN functionality.
· Use inline SVG for interface icons.
· Avoid emoji and icon fonts.
· Write clear commit messages.
· Update the README for major changes.
· Run the complete test suite before submitting a pull request.

---

Support the Project

If Hajir Chess is useful to you, consider supporting its development through Buy Me a Coffee.

Your support helps maintain the project and develop future improvements.

---

License

This project is open source.

See the LICENSE file for complete license terms.

---

Credits

Developed by Haiere and Hajir Studio.

· Repository: github.com/haiere/chess
· Live Demo: hajir.is-a.dev/chess

<div align="center">

Built with care for the chess community.

https://img.shields.io/badge/Back%20to%20Top-7c3aed?style=for-the-badge

</div>
