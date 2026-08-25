# Modern Chess

[![License](https://img.shields.io/github/license/USERNAME/modern-chess?style=flat-square)](LICENSE)
[![Last Commit](https://img.shields.io/github/last-commit/USERNAME/modern-chess?style=flat-square)](https://github.com/haiere/chess/commits/main)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Offline](https://img.shields.io/badge/works-offline-success?style=flat-square)](#requirements)

A feature-rich, browser-based chess game with support for player vs. player, player vs. computer, configurable timers, move history, and PGN/FEN export.

Modern Chess is a self-contained chess application that runs entirely in the browser. It provides a complete chess-playing experience with an elegant glass-morphism interface, standard chess rules, and a built-in computer opponent with configurable difficulty levels.

All game state is stored locally in the browser, allowing you to resume games later. No server connection is required, so the application can also be used offline.

---

## Features

- **Player vs. Player (PvP)** — Play against another person on the same device.
- **Player vs. Computer (PvC)** — Play against the built-in AI with Easy, Medium, and Hard difficulty levels.
- **Configurable timers** — Choose from 10|0, 5|3, 3|2, 1|0, or unlimited time controls.
- **Complete chess rules** — Supports castling, en passant, pawn promotion, check, and checkmate detection.
- **Move history** — View all moves in algebraic notation and navigate through previous positions.
- **PGN export** — Copy or download games in Portable Game Notation format.
- **FEN import/export** — Load or save chess positions using Forsyth–Edwards Notation.
- **Undo and redo** — Move backward and forward through the game history.
- **Board flip** — Rotate the board for a white or black perspective.
- **Captured pieces** — View captured pieces and material advantage indicators.
- **Sound effects** — Audio feedback for moves, captures, checks, and other game events.
- **Board themes** — Choose from Classic, Emerald, Midnight, Rose, Black & White, and Neon Cyberpunk.
- **Light and dark mode** — Switch between light and dark interface themes.
- **Drag and drop** — Move pieces using mouse or touch gestures.
- **Keyboard shortcuts** — Access common actions quickly from the keyboard.
- **Local storage** — Automatically save the current game state in the browser.

---

## Requirements

- A modern web browser with JavaScript enabled, such as Chrome, Firefox, Edge, or Safari.
- An internet connection is required only for loading the Google Fonts stylesheet.
- No server, runtime, build process, or external dependency is required.

---

## Installation

Modern Chess is a single HTML file.

### Hosted Version

1. Open the hosted application URL in your browser.
2. Start a new game and configure your preferred settings.

### Local Version

1. Download the `index.html` file.
2. Open the file directly in a modern web browser.

### Self-Hosting

Upload `index.html` to any static web hosting service, such as:

- GitHub Pages
- Cloudflare Pages
- Netlify
- Vercel
- Any other static web server

All styles, scripts, and assets are contained in the HTML file.

---

## Quick Start

1. **Start a game** — Click **New Game** to configure the game mode, player colour, AI difficulty, timer, and board theme.
2. **Select a piece** — Click or tap one of your pieces. Valid moves will be highlighted.
3. **Make a move** — Click or tap a highlighted square, or drag the piece to a valid destination.
4. **Play against the computer** — In PvC mode, the computer will automatically respond to your move.
5. **Review the game** — Use the move history panel to inspect or revisit previous positions.

---

## Usage

### Game Controls

| Control | Description |
|---|---|
| **New Game** | Opens the game configuration dialog. |
| **Undo** | Reverts the last move, or the last two moves in PvC mode. |
| **Redo** | Reapplies a previously undone move. |
| **Resign** | Ends the game and declares the opponent the winner. |
| **Draw** | Ends the game as a draw. |
| **Flip Board** | Rotates the board orientation. |

### Interaction Methods

- **Click** — Select a piece, then click a highlighted square.
- **Drag and drop** — Drag a piece to a valid square.
- **Touch** — Tap a piece, then tap a highlighted square.
- **Mobile drag** — Drag gestures are supported on compatible touch devices.

### Move History

The move history panel displays all moves in algebraic notation. Click any move to navigate to that position. The current position is highlighted.

### Settings

The Settings panel allows you to configure:

- Interface theme: Light or Dark.
- Board colour scheme.
- Coordinate display.
- Sound volume.

---

## Configuration

### Game Modes

| Mode | Description |
|---|---|
| **Player vs. Player** | Two players take turns on the same device. |
| **Player vs. Computer** | Play against the built-in computer opponent. |

### Player Colour

This option is available in PvC mode.

| Colour | Description |
|---|---|
| **White** | You play as White and make the first move. |
| **Black** | You play as Black and the computer makes the first move. |

### AI Difficulty

| Difficulty | Description |
|---|---|
| **Easy** | Plays random legal moves and is suitable for beginners. |
| **Medium** | Uses a 2-ply minimax search with material evaluation. |
| **Hard** | Uses a 3-ply minimax search with material evaluation. |

### Time Controls

| Setting | Description |
|---|---|
| **10\|0** | 10 minutes per player with no increment. |
| **5\|3** | 5 minutes per player with a 3-second increment per move. |
| **3\|2** | 3 minutes per player with a 2-second increment per move. |
| **1\|0** | 1 minute per player with no increment. |
| **No timer** | Unlimited time for both players. |

### Board Themes

- **Classic Brown** — Traditional wooden-style colours.
- **Emerald** — Green-toned board colours.
- **Midnight Blue** — Dark blue colour palette.
- **Rose** — Warm pink and rose tones.
- **Black & White** — High-contrast monochrome style.
- **Neon Cyberpunk** — Dark interface with neon accents.

---

## Game Formats

### FEN

FEN, or Forsyth–Edwards Notation, is a compact format for describing a chess position.

Use the FEN import and export controls to load or save positions.

Example:

```text
rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
```

A complete FEN string contains:

- Board position.
- Active colour.
- Castling availability.
- En passant target square.
- Halfmove clock.
- Fullmove number.

### PGN

PGN, or Portable Game Notation, is a standard format for recording chess games.

Use the **Copy PGN** or **Download PGN** controls to export the current game.

---

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Escape` | Close an open modal or cancel a pending pawn promotion. |

---

## Troubleshooting

### The AI does not move

Make sure the game is in PvC mode and that it is the computer's turn. The Hard difficulty may take longer to calculate a move.

### The timer does not start

Select a time-control option with a positive time limit. Timers only run during the active player's turn.

### Sound effects are not playing

The Web Audio API requires user interaction before audio can play. Click the board or any button to initialise the audio context.

### Drag and drop does not work on mobile

Use tap-to-select and tap-to-move as an alternative interaction method.

### The board does not update

Refresh the page. The current game state is stored locally and should be restored automatically.

### FEN import fails

Make sure the FEN string is complete and follows the standard six-field format.

---

## Privacy

Modern Chess runs entirely on the client side:

- No game data is sent to a server.
- No cookies are used by the application.
- No analytics or tracking scripts are included.
- Game state is stored in the browser's `localStorage`.
- All chess processing, including the AI logic, occurs locally in the browser.

---

## License

This application is provided as open-source software. See the [`LICENSE`](LICENSE) file for details.

---

## Author

Developed by **Haiere & Hajir Studio**.

**Last updated:** 2026
