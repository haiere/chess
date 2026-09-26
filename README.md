# Modern Chess

A modern, responsive, browser-based chess game with player-versus-player mode, computer opponents, configurable time controls, move history, PGN/FEN tools, board themes, and offline support.

<p align="center">
  <a href="https://hajir.is-a.dev/chess">
    <img src="https://img.shields.io/badge/Play%20Modern%20Chess-111827?style=for-the-badge&logo=google-chrome&logoColor=white" alt="Play Modern Chess">
  </a>
  <a href="https://buymeacoffee.com/hajirstudio">
    <img src="https://img.shields.io/badge/Support%20This%20Project-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black" alt="Support this project">
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/github/license/haiere/chess?style=flat-square" alt="License">
  <img src="https://img.shields.io/github/last-commit/haiere/chess?style=flat-square" alt="Last commit">
  <img src="https://img.shields.io/github/repo-size/haiere/chess?style=flat-square" alt="Repository size">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?style=flat-square&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/Works%20Offline-success?style=flat-square" alt="Works offline">
  [![Version](https://img.shields.io/badge/version-v0.1.3-4C8BF5?style=flat-square)](https://hajir.is-a.dev/chess)
</p>

---

## Overview

Modern Chess is a self-contained chess application that runs entirely in the browser.

It provides a complete chess-playing experience with:

- A responsive glassmorphism interface.
- Standard chess rules.
- Player-versus-player gameplay.
- A built-in computer opponent.
- Configurable timers and board themes.
- PGN and FEN support.
- No backend or build process.

No server, runtime, package manager, or external JavaScript dependency is required. After the font stylesheet has been cached, the game can also be used offline.

## Live Demo

Play the game online:

**[Open Modern Chess](https://hajir.is-a.dev/chess)**

## Features

- **Player vs. Player** — Play against another person on the same device.
- **Player vs. Computer** — Play against the built-in computer opponent.
- **Multiple AI difficulties** — Choose from Easy, Medium, or Hard.
- **Configurable time controls** — Supports `10|0`, `5|3`, `3|2`, `1|0`, and unlimited time.
- **Fischer increment** — Increment time is automatically added after each move when configured.
- **Complete chess rules** — Includes castling, en passant, pawn promotion, check, checkmate, and stalemate detection.
- **Move history** — View moves in Standard Algebraic Notation.
- **PGN export** — Copy the current game or download it as a `.pgn` file.
- **FEN import and export** — Load or save chess positions using Forsyth–Edwards Notation.
- **Undo and redo** — Navigate backward and forward through the game history.
- **Board flip** — Switch between White and Black perspectives.
- **Captured pieces** — Track captured material for both players.
- **Sound effects** — Audio feedback for moves, captures, checks, castling, promotion, and game-over events.
- **Board themes** — Classic Brown, Emerald, Midnight Blue, Rose, Black and White, and Neon Cyberpunk.
- **Light and dark interface themes** — Switch the application appearance.
- **Multiple input methods** — Supports click, tap, drag and drop, and touch drag.
- **Responsive layout** — Designed for phones, tablets, laptops, and desktop screens.
- **Timer warnings** — Timers below 30 seconds receive a visual warning.
- **Safe-area support** — Compatible with devices that have display notches or rounded corners.

## Technology

Modern Chess is built with standard web technologies:

- HTML5
- CSS3
- Vanilla JavaScript ES6+
- Web Audio API
- Clipboard API
- Responsive CSS layout

No framework, bundler, database, or server-side code is used.

## Requirements

- A modern web browser with JavaScript enabled.
- Chrome, Firefox, Edge, or Safari is recommended.
- An internet connection is only required to load the Google Fonts stylesheet.
- No server, runtime, build process, or external JavaScript dependency is required.

## Project Structure

```text
chess/
├── index.html
├── style.css
├── script.js
├── LICENSE
└── README.md
```

| File | Description |
|---|---|
| `index.html` | Application structure, controls, dialogs, and semantic markup. |
| `style.css` | Layout, themes, responsive styles, animations, and visual design. |
| `script.js` | Chess rules, board rendering, AI logic, timers, audio, PGN, and FEN functionality. |
| `LICENSE` | Project license and usage terms. |
| `README.md` | Project documentation. |

## Installation

### Run Locally

1. Clone or download this repository.
2. Keep `index.html`, `style.css`, and `script.js` in the same directory.
3. Open `index.html` in a modern web browser.
4. Click **New Game** and choose your preferred settings.

### Clone with Git

```bash
git clone [https://github.com/haiere/chess.git](https://github.com/haiere/chess.git)
cd chess
```

Then open `index.html` in your browser.

### Self-Hosting

Modern Chess can be deployed to any static hosting service, including:

- GitHub Pages
- Cloudflare Pages
- Netlify
- Vercel
- Firebase Hosting
- Any standard static web server

Upload the project files while preserving their relative paths.

## Quick Start

1. Open the [live version](https://hajir.is-a.dev/chess) or run the project locally.
2. Click **New Game**.
3. Select the game mode, player color, AI difficulty, time control, and board theme.
4. Select one of your pieces.
5. Choose a highlighted destination square.
6. Review the game using the move history panel.
7. Export the game as PGN or save the current position as FEN.

## Game Controls

| Control | Description |
|---|---|
| **New Game** | Opens the game configuration dialog. |
| **Undo** | Reverts the last move. In PvC mode, it normally reverts both the player's move and the computer's reply. |
| **Redo** | Reapplies a previously undone move. |
| **Resign** | Ends the game and declares the opponent the winner. |
| **Draw** | Offers or confirms a draw, depending on the current game state. |
| **Flip Board** | Changes the board perspective between White and Black. |
| **Copy PGN** | Copies the current game in PGN format to the clipboard. |
| **Download PGN** | Downloads the current game as a `.pgn` file. |
| **Settings** | Opens the game configuration dialog. |
| **Theme** | Toggles between light and dark interface themes. |
| **Sound** | Enables or disables sound effects. |
| **Import FEN** | Loads a chess position from a FEN string. |
| **Export FEN** | Copies the current position as a FEN string. |

## Interaction Methods

- **Click:** Select a piece, then click a highlighted destination square.
- **Tap:** Tap a piece, then tap a highlighted destination square.
- **Drag and drop:** Drag a piece to a valid square on desktop devices.
- **Touch drag:** Drag a piece on supported touch devices and release it over a valid square.

## Game Configuration

### Game Modes

| Mode | Description |
|---|---|
| **Player vs. Player** | Two players take turns on the same device. |
| **Player vs. Computer** | Play against the built-in computer opponent. |

### Player Color

The player color setting is used in Player vs. Computer mode.

| Color | Description |
|---|---|
| **White** | You play as White and make the first move. |
| **Black** | You play as Black and the computer makes the first move. |

### AI Difficulty

| Difficulty | Description |
|---|---|
| **Easy** | Selects random legal moves and is suitable for beginners. |
| **Medium** | Uses a 2-ply minimax search with alpha-beta pruning and material evaluation. |
| **Hard** | Uses a 3-ply minimax search with alpha-beta pruning and material evaluation. |

> AI performance may vary depending on the device and browser. Higher difficulty levels may require more processing time.

### Time Controls

| Setting | Description |
|---|---|
| `10\|0` | 10 minutes per player with no increment. |
| `5\|3` | 5 minutes per player with a 3-second increment after each move. |
| `3\|2` | 3 minutes per player with a 2-second increment after each move. |
| `1\|0` | 1 minute per player with no increment. |
| **No Timer** | Unlimited time for both players. |

### Board Themes

- **Classic Brown** — Traditional wooden-style colors.
- **Emerald** — Green-toned board colors.
- **Midnight Blue** — Dark blue color palette.
- **Rose** — Warm pink and rose tones.
- **Black and White** — High-contrast monochrome style.
- **Neon Cyberpunk** — Dark interface with bright neon accents.

## Move History

The move history panel displays played moves in Standard Algebraic Notation and groups them by move number.

Common notation includes:

- `e4` — Pawn move.
- `Nf3` — Knight move.
- `O-O` — Kingside castling.
- `O-O-O` — Queenside castling.
- `exd5` — Capture.
- `e.p.` — En passant.
- `+` — Check.
- `#` — Checkmate.

The move history automatically scrolls as new moves are played.

## FEN Support

FEN stands for **Forsyth–Edwards Notation**. It is a compact format used to describe a complete chess position.

Use **Import FEN** to load a position or **Export FEN** to copy the current position.

### Starting Position

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

## PGN Support

PGN stands for **Portable Game Notation**. It is a standard format for recording chess games.

Use the following controls to export a game:

- **Copy PGN** — Copies the current game to the clipboard.
- **Download PGN** — Downloads the current game as a `.pgn` file.

Moves are recorded in Standard Algebraic Notation, including castling, captures, promotion, checks, checkmate, and en passant notation.

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Escape` | Closes the currently open modal, such as New Game, Promotion, or Game Over. |

## Offline Support

The core application runs entirely in the browser and does not require a server connection.

Offline functionality includes:

- Chessboard rendering.
- Chess rules.
- AI calculations.
- Timers.
- Move history.
- PGN generation.
- FEN import and export.
- Sound effects after browser audio initialization.

The only external resource is the Google Fonts stylesheet used for the Inter font. If the font has already been cached, the application can continue working without an internet connection.

## Privacy

Modern Chess is designed to run locally on the user's device.

- No game data is sent to a server.
- No cookies are used by the application.
- No analytics or tracking scripts are included.
- No game state is saved to `localStorage`.
- Refreshing the page resets the current game.
- Chess calculations and AI processing occur locally in the browser.
- The optional Buy Me a Coffee link opens an external website only when selected by the user.

## Troubleshooting

### The AI Does Not Move

Make sure:

- The game mode is set to **Player vs. Computer**.
- It is currently the computer's turn.
- The game has not ended.
- The selected position is valid.

The Hard difficulty may require slightly more processing time than Easy or Medium.

### The Timer Does Not Start

Select a time-control option with a positive time limit. Timers run only during the active player's turn and stop automatically when the game ends.

### Sound Effects Are Not Playing

Browsers usually require user interaction before audio can play.

Try the following:

1. Click the chessboard or any button.
2. Make sure the **Sound** control is enabled.
3. Check that your browser tab is not muted.
4. Check your device volume.

### Drag and Drop Does Not Work on Mobile

Use tap-to-select and tap-to-move instead. This is the recommended interaction method for small touchscreens.

### FEN Import Fails

Make sure the FEN string:

- Contains all six required fields.
- Uses valid piece symbols.
- Contains a valid active color.
- Uses valid castling notation.
- Uses a valid en passant square.
- Contains valid halfmove and fullmove numbers.

Invalid FEN strings are rejected and the current position is preserved.

### The Board Does Not Update

Try the following:

1. Refresh the page.
2. Start a new game.
3. Clear any invalid FEN input.
4. Open the browser console and check for JavaScript errors.

The application does not persist the current game between sessions.

## Browser Compatibility

Modern Chess is intended for current versions of:

- Google Chrome
- Mozilla Firefox
- Microsoft Edge
- Apple Safari

The application uses modern browser features such as:

- ES6 JavaScript.
- CSS Grid and Flexbox.
- Web Audio API.
- Clipboard API.
- Pointer and touch events.

## Deployment

The project is compatible with static hosting platforms.

### GitHub Pages

1. Push the project to a GitHub repository.
2. Open **Settings**.
3. Select **Pages**.
4. Choose the deployment branch.
5. Save the configuration.
6. Open the generated GitHub Pages URL.

### Cloudflare Pages

1. Connect the GitHub repository.
2. Select the project repository.
3. Leave the build command empty.
4. Set the output directory to the project root.
5. Deploy the project.

### Netlify or Vercel

Import the repository and deploy it as a static site. No build command or environment variable is required.

## Contributing

Contributions, bug reports, and suggestions are welcome.

### Development Workflow

1. Fork the repository.
2. Create a feature branch:

```bash
git checkout -b feature/your-feature-name
```

3. Make your changes.
4. Test the application in multiple browsers and screen sizes.
5. Commit your changes:

```bash
git commit -m "Add: your feature description"
```

6. Push the branch:

```bash
git push origin feature/your-feature-name
```

7. Open a pull request.

### Contribution Guidelines

- Keep the project dependency-free.
- Preserve existing control IDs used by `script.js`.
- Keep the interface responsive.
- Test both mouse and touch interactions.
- Avoid breaking PGN and FEN functionality.
- Use clear and descriptive commit messages.
- Update this README when adding major features.

## Support the Project

If Modern Chess is useful to you, you can support its development through Buy Me a Coffee:

<p align="center">
  <a href="https://buymeacoffee.com/hajirstudio">
    <img src="https://img.shields.io/badge/Buy%20Me%20a%20Coffee-Support%20the%20Project-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black" alt="Buy Me a Coffee">
  </a>
</p>

Your support helps maintain the project and develop future improvements.

## License

This project is provided as open-source software.

See the [LICENSE](LICENSE) file for the complete license terms.

## Credits

Developed by **Haiere** and **Hajir Studio**.

- **Live Demo:** [hajir.is-a.dev/chess](https://hajir.is-a.dev/chess)
- **Repository:** [github.com/haiere/chess](https://github.com/haiere/chess)
- **Support:** [buymeacoffee.com/hajirstudio](https://buymeacoffee.com/hajirstudio)

---

_Last updated: September 2026_