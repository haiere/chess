<div align="center">

# Modern Chess

**A modern, responsive, dependency-free chess game for the browser**

Player vs Player · Player vs Computer · Time controls · Move history · PGN and FEN tools · Board themes · Preference persistence

<br />

<a href="https://hajir.is-a.dev/chess">
  <img src="https://img.shields.io/badge/Play_Modern_Chess-111827?style=for-the-badge&logo=google-chrome&logoColor=white" alt="Play Modern Chess">
</a>
<a href="https://buymeacoffee.com/hajirstudio">
  <img src="https://img.shields.io/badge/Support_This_Project-FFDD00?style=for-the-badge&logo=buymeacoffee&logoColor=black" alt="Support this project">
</a>

<br />

<img src="https://img.shields.io/badge/version-0.2.0-4C8BF5?style=flat-square" alt="Version 0.2.0">
<img src="https://img.shields.io/github/license/haiere/chess?style=flat-square" alt="License">
<img src="https://img.shields.io/github/last-commit/haiere/chess?style=flat-square" alt="Last commit">
<img src="https://img.shields.io/github/repo-size/haiere/chess?style=flat-square" alt="Repository size">

<br />

<img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white" alt="HTML5">
<img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white" alt="CSS3">
<img src="https://img.shields.io/badge/JavaScript-ES2020-F7DF1E?style=flat-square&logo=javascript&logoColor=black" alt="JavaScript">
<img src="https://img.shields.io/badge/Dependencies-none-success?style=flat-square" alt="No dependencies">

</div>

---

## Table of Contents

- [Overview](#overview)
- [Live Demo](#live-demo)
- [Highlights](#highlights)
- [Technology](#technology)
- [Requirements](#requirements)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Features](#features)
- [Game Controls](#game-controls)
- [Interaction Methods](#interaction-methods)
- [Game Configuration](#game-configuration)
- [Move History](#move-history)
- [FEN Support](#fen-support)
- [PGN Support](#pgn-support)
- [Keyboard and Accessibility](#keyboard-and-accessibility)
- [Preference Storage](#preference-storage)
- [Offline Support](#offline-support)
- [Privacy](#privacy)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)
- [Browser Compatibility](#browser-compatibility)
- [Deployment](#deployment)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [Support the Project](#support-the-project)
- [License](#license)
- [Credits](#credits)

---

## Overview

**Modern Chess** is a self-contained chess application that runs entirely in the browser. It provides a modern, distraction-free interface for playing chess against another person on the same device or against a built-in computer opponent.

The application is built without any framework, bundler, or runtime dependency. All chess rules, move generation, and the AI engine are implemented in plain JavaScript.

### What It Provides

- Complete and accurate chess rules.
- Responsive, accessible interface.
- Player-versus-player and player-versus-computer modes.
- Configurable time controls with Fischer increment.
- Six board themes and light/dark interface themes.
- FEN import/export and PGN export.
- Preference persistence through `localStorage`.

### What It Does Not Require

- No server or backend.
- No package manager.
- No build step.
- No runtime dependency.
- No external JavaScript library.

---

## Live Demo

Play the latest version online:

<div align="center">

**[https://hajir.is-a.dev/chess](https://hajir.is-a.dev/chess)**

</div>

---

## Highlights

| Area | Details |
|---|---|
| **Rules** | Legal move validation, check, checkmate, stalemate, castling, en passant, promotion, fifty-move clock tracking |
| **AI** | Minimax with alpha-beta pruning; three difficulty levels |
| **Timers** | Rapid, Blitz, Bullet, and unlimited time controls with increment |
| **Tools** | FEN import/export, PGN copy/download, move history, captured pieces |
| **UI** | Responsive layout, glass-style panels, safe-area support for notched devices |
| **Themes** | Six board themes, light/dark/system interface themes |
| **Accessibility** | Keyboard navigation, ARIA labels, focus-visible outlines, reduced-motion support |
| **Persistence** | Theme, board theme, sound, coordinates, orientation, and game settings saved locally |

---

## Technology

Modern Chess uses only standard web technologies.

| Layer | Technology |
|---|---|
| Markup | HTML5 (semantic, ARIA-annotated) |
| Styling | CSS3 with custom properties, CSS Grid, Flexbox |
| Logic | Vanilla JavaScript (ES2020, strict mode) |
| Audio | Web Audio API (oscillator-based, no audio files) |
| Clipboard | Clipboard API with prompt fallback |
| Storage | `localStorage` with in-memory fallback |

No frameworks, no bundlers, no third-party JavaScript.

---

## Requirements

- A modern web browser with JavaScript enabled.
- Chrome, Firefox, Edge, or Safari (recent versions).
- An internet connection only to load the Inter font from Google Fonts.

No server, no runtime, no build process.

---

## Installation

### Run Locally

1. Clone or download this repository.
2. Keep `index.html`, `style.css`, and `script.js` in the same directory.
3. Open `index.html` in a modern browser.

### Clone with Git

```bash
git clone https://github.com/haiere/chess.git
cd chess
```

Then open index.html in your browser, or serve the directory with any static server:

```bash
python3 -m http.server 8080
# or
npx serve .
```

Self-Hosting

Modern Chess can be deployed to any static host:

· GitHub Pages
· Cloudflare Pages
· Netlify
· Vercel
· Firebase Hosting
· Any standard static web server

Upload the files while preserving their relative paths. No build step is required.

---

Quick Start

1. Open the live version or run the project locally.
2. Select New Game.
3. Choose the game mode, player color, AI difficulty, time control, and board theme.
4. Select one of your pieces, then select a highlighted destination square.
5. Review the game using the move history panel.
6. Copy or download the game as PGN, or export the current position as FEN.

---

Features

Gameplay

· Player versus Player — Two players share the same device.
· Player versus Computer — Play against the built-in AI.
· Three AI difficulty levels — Easy (random), Medium (2-ply minimax), Hard (3-ply minimax).
· Random color option — Let the game choose White or Black for you.
· Time controls — 10+0 Rapid, 5+3 Blitz, 3+2 Blitz, 1+0 Bullet, or unlimited.
· Fischer increment — Time is added after each move when an increment is set.
· Complete rule enforcement — Legal move validation, check, checkmate, stalemate, castling, en passant, and promotion.
· Undo and redo — Revert or replay moves; in PvC mode Undo also reverts the AI's reply.
· Resign and draw — End the game with confirmation dialogs to prevent accidental losses.

Interface and Tooling

· Move history — Displayed in Standard Algebraic Notation and grouped by move number.
· Captured pieces — Tracked and displayed for both players.
· PGN export — Copy the game to the clipboard or download it as a .pgn file.
· FEN import and export — Load or copy the current position with strict validation.
· Board flip — Switch perspective between White and Black.
· Six board themes — Classic Brown, Emerald, Midnight Blue, Rose, Black and White, and Neon Cyberpunk.
· Light, dark, and system themes — Follow the operating system or choose manually.
· Sound effects — Web Audio API generates distinct tones for move, capture, check, castle, promotion, and game over.
· Coordinate labels — File and rank labels can be toggled.
· Responsive layout — Optimized for phones, tablets, laptops, and wide desktop screens.
· Low-time warnings — Timers below 30 seconds pulse in a distinct color.

Accessibility

· Full keyboard support — Skip link, focus-visible outlines, Escape to close modals.
· ARIA annotations — aria-label, aria-live, aria-modal, and role="grid" on the board.
· Reduced-motion respect — Animations are disabled when prefers-reduced-motion is set.
· Screen-reader friendly — All interactive elements carry meaningful accessible names.
· No emoji icons — Every UI icon is a scalable inline SVG that inherits currentColor.

---

Game Controls

Control Description
New Game Opens the game configuration dialog.
Undo Reverts the last move. In PvC mode, also reverts the AI's reply.
Redo Reapplies a previously undone move.
Resign Ends the game and declares the opponent the winner.
Draw Offers or confirms a draw.
Flip Board Changes the board perspective between White and Black.
Copy PGN Copies the current game in PGN format to the clipboard.
Download PGN Downloads the current game as a .pgn file.
Settings Opens the settings dialog.
Theme Cycles between light and dark interface themes.
Sound Enables or disables sound effects.
Import FEN Loads a position from a FEN string.
Export FEN Copies the current position as a FEN string.

---

Interaction Methods

Method How It Works
Click Select a piece, then click a highlighted destination square.
Tap Tap a piece, then tap a highlighted destination square.
Drag and drop Drag a piece to a valid square on desktop.
Touch drag Drag a piece on supported touch devices and release it over a valid square.

The board prevents duplicate moves from rapid taps and from touch events that also fire mouse events.

---

Game Configuration

Game Modes

Mode Description
Player versus Player Two players alternate on the same device.
Player versus Computer Play against the built-in AI engine.

Player Color

Option Description
White You play as White and move first.
Black You play as Black; the AI moves first.
Random The game chooses a side for you at the start.

AI Difficulty

Level Search Description
Easy Random Selects any legal move. Suitable for beginners.
Medium 2-ply minimax Alpha-beta pruning with material evaluation.
Hard 3-ply minimax Stronger search; may take longer on slower devices.

Time Controls

Setting Description
10+0 Ten minutes, no increment.
5+3 Five minutes with a three-second increment per move.
3+2 Three minutes with a two-second increment per move.
1+0 One minute, no increment.
No Timer Unlimited time for both players.

Board Themes

Theme Description
Classic Brown Traditional wooden tones.
Emerald Green-toned palette.
Midnight Blue Deep blue color scheme.
Rose Warm pink and rose tones.
Black and White High-contrast monochrome.
Neon Cyberpunk Dark board with neon accents.

---

Move History

Moves are displayed in Standard Algebraic Notation and grouped by move number.

Notation Meaning
e4 Pawn move.
Nf3 Knight move.
O-O Kingside castling.
O-O-O Queenside castling.
exd5 Capture.
e.p. En passant.
+ Check.
# Checkmate.

The panel scrolls automatically as new moves are played.

---

FEN Support

FEN (Forsyth–Edwards Notation) describes a complete chess position in a single line.

Use Import FEN to load a position or Export FEN to copy the current one.

Starting Position

```text
rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
```

A complete FEN string contains six fields:

1. Piece placement.
2. Active color (w or b).
3. Castling availability (KQkq or -).
4. En passant target square (e.g. e3) or -.
5. Halfmove clock.
6. Fullmove number.

Imported FEN strings are validated before being applied. Invalid input is rejected with a toast notification and the current position is preserved.

---

PGN Support

PGN (Portable Game Notation) records a full game in a portable text format.

Control Action
Copy PGN Copies the current game to the clipboard.
Download PGN Downloads the current game as a .pgn file.

The exported PGN uses Standard Algebraic Notation and includes castling, captures, promotion, check, checkmate, and en passant.

---

Keyboard and Accessibility

Feature Behavior
Skip link Tab from the top of the page reveals a "Skip to board" link.
Modal close Escape closes New Game, Settings, and other dismissible dialogs.
Focus outline :focus-visible styling is applied to all interactive elements.
Promotion dialog Pieces are focusable and respond to Enter and Space.
Board grid Squares expose role="gridcell" and are labeled for screen readers.
Reduced motion Animations are minimized when prefers-reduced-motion: reduce is set.

All UI icons are inline SVG elements that inherit currentColor and are marked aria-hidden="true" when decorative.

---

Preference Storage

The application stores user preferences in localStorage under keys prefixed with chess:. No game state is saved between sessions.

Key Purpose
chess:theme Interface theme: dark, light, or system.
chess:boardTheme Selected board theme.
chess:sound Sound enabled state.
chess:coords Coordinate label visibility.
chess:orientation Board orientation (white or black).
chess:mode Last selected game mode.
chess:playerColor Last selected player color.
chess:difficulty Last selected AI difficulty.
chess:timerMode Last selected time control.

If localStorage is unavailable (for example, in private browsing or when blocked by the browser), the application transparently falls back to an in-memory store and continues to run without errors.

Preference data can be reset at any time from the Settings dialog.

---

Offline Support

The core application runs entirely in the browser and does not require an active server connection.

Available Offline

· Board rendering.
· Chess rules and validation.
· AI calculations.
· Timers.
· Move history.
· PGN and FEN export.
· Sound effects after the browser initializes audio.

Note
The only external resource is the Google Fonts stylesheet for Inter. Once it is cached, the application can continue to work without an internet connection.

---

Privacy

Modern Chess is designed to run locally on the user's device.

· No game data is transmitted to any server.
· No cookies are used by the application.
· No analytics or tracking scripts are included.
· Only non-identifying preferences are stored in localStorage.
· Chess calculations and AI processing happen entirely in the browser.
· The optional Buy Me a Coffee link opens an external site only when the user selects it.

---

Project Structure

```text
chess/
├── index.html
├── style.css
├── script.js
├── LICENSE
└── README.md
```

File Description
index.html Application markup, controls, dialogs, and semantic structure.
style.css Layout, themes, responsive styles, and animations.
script.js Chess rules, board rendering, AI, timers, audio, FEN, and PGN logic.
LICENSE Project license and usage terms.
README.md Project documentation.

---

Troubleshooting

<details>
<summary><b>The AI does not move</b></summary>

<br />

Check that:

· The game mode is set to Player versus Computer.
· It is currently the computer's turn.
· The game has not ended.
· The selected position is valid.

Hard difficulty may require slightly more processing time than Easy or Medium.

</details>

<details>
<summary><b>The timer does not start</b></summary>

<br />

Select a time control with a positive time limit. Timers run only during the active player's turn and stop automatically when the game ends.

</details>

<details>
<summary><b>Sound effects are not playing</b></summary>

<br />

Browsers require user interaction before audio can play.

1. Click the board or any button.
2. Confirm that the Sound control is enabled.
3. Check that the browser tab is not muted.
4. Check device volume.

</details>

<details>
<summary><b>Drag and drop does not work on mobile</b></summary>

<br />

Use tap-to-select and tap-to-move instead. This is the recommended interaction method on small touchscreens.

</details>

<details>
<summary><b>FEN import fails</b></summary>

<br />

Make sure the FEN string contains all six fields, uses valid piece symbols, a valid active color, valid castling notation, a valid en passant square, and numeric halfmove and fullmove values.

Invalid FEN strings are rejected and the current position is preserved.

</details>

<details>
<summary><b>My theme or settings are not saved</b></summary>

<br />

The application stores preferences in localStorage. If localStorage is blocked (private browsing, strict privacy settings), preferences fall back to an in-memory store and reset on refresh. Allowing site data for this origin restores persistence.

</details>

<details>
<summary><b>The board does not update</b></summary>

<br />

1. Refresh the page.
2. Start a new game.
3. Clear any invalid FEN input.
4. Open the browser console and check for JavaScript errors.

The current game is not preserved between sessions.

</details>

---

Browser Compatibility

Modern Chess targets current versions of:

Browser Status
Google Chrome Supported
Mozilla Firefox Supported
Microsoft Edge Supported
Apple Safari Supported

The application relies on modern browser features:

· ES2020 JavaScript (optional chaining, nullish coalescing).
· CSS Grid, Flexbox, and custom properties.
· Web Audio API.
· Clipboard API with fallback.
· Pointer, mouse, and touch events.

---

Deployment

Modern Chess is compatible with static hosting platforms.

GitHub Pages

1. Push the project to a GitHub repository.
2. Open Settings > Pages.
3. Select the deployment branch.
4. Save the configuration.
5. Open the generated Pages URL.

Cloudflare Pages

1. Connect the GitHub repository.
2. Select the project repository.
3. Leave the build command empty.
4. Set the output directory to the project root.
5. Deploy.

Netlify or Vercel

Import the repository and deploy it as a static site. No build command or environment variables are required.

---

Roadmap

Planned improvements for future releases:

☐ Puzzle mode with difficulty levels and progress tracking.
☐ Interactive lessons for beginners (piece movement, tactics, endgames).
☐ Threefold repetition and insufficient material detection.
☐ AI moved to a Web Worker to keep the interface fully responsive.
☐ Optional Stockfish integration for stronger play.
☐ Progressive Web App (manifest and service worker) for full offline install.

---

Contributing

Contributions, bug reports, and suggestions are welcome.

Development Workflow

1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes.
4. Test the application across multiple browsers and screen sizes.
5. Commit your changes:
   ```bash
   git commit -m "Describe your change"
   ```
6. Push the branch:
   ```bash
   git push origin feature/your-feature-name
   ```
7. Open a pull request.

Contribution Guidelines

· Keep the project dependency-free.
· Preserve existing element IDs referenced by script.js.
· Maintain responsive behavior on phones, tablets, and desktops.
· Test both mouse and touch interactions.
· Do not break PGN or FEN functionality.
· Keep all UI icons as SVG; do not introduce emoji or icon fonts.
· Write clear and descriptive commit messages.
· Update this README when adding major features.

---

Support the Project

If Modern Chess is useful to you, you can support its development through Buy Me a Coffee.

<div align="center">

<a href="https://buymeacoffee.com/hajirstudio">
  <img src="https://img.shields.io/badge/Buy_Me_a_Coffee-Support_the_Project-FFDD00?style=for-the-badge&logo=buymeacoffee&logoColor=black" alt="Buy Me a Coffee">
</a>

<br />
<br />

<sub>Your support helps maintain the project and develop future improvements.</sub>

</div>

---

License

This project is provided as open-source software.

See LICENSE for the complete license terms.

---

Credits

<div align="center">

Developed by Haiere and Hajir Studio

<br />

<a href="https://hajir.is-a.dev/chess">
  <img src="https://img.shields.io/badge/Live_Demo-hajir.is--a.dev%2Fchess-4C8BF5?style=flat-square&logo=google-chrome&logoColor=white" alt="Live Demo">
</a>
<a href="https://github.com/haiere/chess">
  <img src="https://img.shields.io/badge/Repository-github.com%2Fhaiere%2Fchess-181717?style=flat-square&logo=github&logoColor=white" alt="Repository">
</a>
<a href="https://buymeacoffee.com/hajirstudio">
  <img src="https://img.shields.io/badge/Support-buymeacoffee.com%2Fhajirstudio-FFDD00?style=flat-square&logo=buymeacoffee&logoColor=black" alt="Support">
</a>

</div>

---

<div align="center">
<sub>Last updated: October 2026</sub>
</div>