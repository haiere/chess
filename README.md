<div align="center">

# Modern Chess

**A modern, responsive, browser-based chess game**

Player versus player · computer opponents · configurable time controls · move history · PGN/FEN tools · board themes · offline support

<br />

<a href="https://hajir.is-a.dev/chess">
  <img src="https://img.shields.io/badge/Play_Modern_Chess-111827?style=for-the-badge&logo=google-chrome&logoColor=white" alt="Play Modern Chess">
</a>
<a href="https://buymeacoffee.com/hajirstudio">
  <img src="https://img.shields.io/badge/Support_This_Project-FFDD00?style=for-the-badge&logo=buymeacoffee&logoColor=black" alt="Support this project">
</a>

<br />

<img src="https://img.shields.io/github/license/haiere/modern-chess?style=flat-square" alt="License">
<img src="https://img.shields.io/github/last-commit/haiere/modern-chess?style=flat-square" alt="Last commit">
<img src="https://img.shields.io/github/repo-size/haiere/modern-chess?style=flat-square" alt="Repository size">
<img src="https://img.shields.io/badge/Version-v0.1.3-4C8BF5?style=flat-square" alt="App version v0.1.3">

<br />

<img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white" alt="HTML5">
<img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white" alt="CSS3">
<img src="https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?style=flat-square&logo=javascript&logoColor=black" alt="JavaScript">
<img src="https://img.shields.io/badge/Works_Offline-success?style=flat-square" alt="Works offline">

</div>

---

## Table of Contents

- [Overview](#overview)
- [Live Demo](#live-demo)
- [Technology](#technology)
- [Requirements](#requirements)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Features](#features)
  - [Game Features](#game-features)
  - [Interface and Tooling](#interface-and-tooling)
- [Game Controls](#game-controls)
- [Interaction Methods](#interaction-methods)
- [Game Configuration](#game-configuration)
- [Move History](#move-history)
- [FEN Support](#fen-support)
- [PGN Support](#pgn-support)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Offline Support](#offline-support)
- [Privacy](#privacy)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)
- [Browser Compatibility](#browser-compatibility)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Support the Project](#support-the-project)
- [License](#license)
- [Credits](#credits)

---

## Overview

**Modern Chess** is a self-contained chess application that runs entirely in the browser.

### What It Provides

- Responsive glassmorphism interface.
- Standard chess rules.
- Player-versus-player gameplay.
- Built-in computer opponent.
- Configurable timers and board themes.
- PGN and FEN support.
- No backend or build process.

### What It Does Not Need

- No server.
- No runtime.
- No package manager.
- No external JavaScript dependency.
- No database.
- No build step.

After the font stylesheet has been cached, the game can also be used offline.

---

## Live Demo

Play the game online without installing anything:

<div align="center">

**[Open Modern Chess](https://hajir.is-a.dev/chess)**

</div>

---

## Technology

Modern Chess is built with standard web technologies.

| Layer | Technology |
|---|---|
| Markup | HTML5 |
| Styling | CSS3 and responsive CSS layout |
| Logic | Vanilla JavaScript ES6+ |
| Audio | Web Audio API |
| Clipboard | Clipboard API |

No framework, bundler, database, or server-side code is used.

---

## Requirements

- A modern web browser with JavaScript enabled.
- Chrome, Firefox, Edge, or Safari is recommended.
- An internet connection is only required to load the Google Fonts stylesheet.
- No server, runtime, build process, or external JavaScript dependency is required.

---

## Installation

### Run Locally

1. Clone or download this repository.
2. Keep `index.html`, `style.css`, and `script.js` in the same directory.
3. Open `index.html` in a modern browser.
4. Select **New Game** and choose your preferred settings.

### Clone with Git

```bash
git clone [https://github.com/haiere/modern-chess.git](https://github.com/haiere/modern-chess.git)
cd modern-chess
```

You can then open `index.html` in your browser.

### Self-Hosting

Modern Chess can be deployed to any static hosting service, including:

- GitHub Pages.
- Cloudflare Pages.
- Netlify.
- Vercel.
- Firebase Hosting.
- Any standard static web server.

Upload the project files while preserving their relative paths.

---

## Quick Start

### Start a Game

1. Open the [live version](https://hajir.is-a.dev/chess) or run the project locally.
2. Select **New Game**.
3. Choose the game mode, player color, AI difficulty, time control, and board theme.
4. Select one of your pieces.
5. Choose a highlighted destination square.

### Review and Export

6. Review the game using the move history panel.
7. Copy or download the game as PGN.
8. Copy the current position as FEN.

---

## Features

### Game Features

- **Player versus Player** — Two people can play on the same device.
- **Player versus Computer** — Play against the built-in computer opponent.
- **Multiple AI difficulties** — Choose Easy, Medium, or Hard.
- **Configurable time controls** — Supports `10|0`, `5|3`, `3|2`, `1|0`, and unlimited time.
- **Fischer increment** — Adds time after each move when configured.
- **Complete chess rules** — Includes castling, en passant, promotion, check, checkmate, and stalemate detection.
- **Undo and redo** — Navigate backward and forward through game history.
- **Board flip** — Switch between White and Black perspectives.

### Interface and Tooling

- **Move history** — View moves in Standard Algebraic Notation.
- **PGN export** — Copy the current game or download it as a `.pgn` file.
- **FEN import and export** — Load or save positions using Forsyth–Edwards Notation.
- **Captured pieces** — Track captured material for both players.
- **Sound effects** — Audio feedback for moves, captures, checks, castling, promotion, and game-over events.
- **Board themes** — Classic Brown, Emerald, Midnight Blue, Rose, Black and White, and Neon Cyberpunk.
- **Light and dark interface themes** — Switch the application appearance.
- **Multiple input methods** — Click, tap, drag and drop, and touch drag.
- **Responsive layout** — Designed for phones, tablets, laptops, and desktop screens.
- **Timer warnings** — Timers below 30 seconds receive a visual warning.
- **Safe-area support** — Compatible with notched and rounded-corner displays.

> [!NOTE]
> AI performance may vary depending on the device and browser. Higher difficulty levels may require more processing time.

---

## Game Controls

| Control | Description |
|---|---|
| **New Game** | Opens the game configuration dialog. |
| **Undo** | Reverts the last move. In Player versus Computer mode, it normally reverts both the player's move and the computer's reply. |
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

---

## Interaction Methods

| Method | How It Works |
|---|---|
| **Click** | Select a piece, then click a highlighted destination square. |
| **Tap** | Tap a piece, then tap a highlighted destination square. |
| **Drag and drop** | Drag a piece to a valid square on desktop devices. |
| **Touch drag** | Drag a piece on supported touch devices and release it over a valid square. |

---

## Game Configuration

### Game Modes

| Mode | Description |
|---|---|
| **Player versus Player** | Two players take turns on the same device. |
| **Player versus Computer** | Play against the built-in computer opponent. |

### Player Color

The player color setting applies to Player versus Computer mode.

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

### Time Controls

| Setting | Description |
|---|---|
| `10|0` | Ten minutes with no increment. |
| `5|3` | Five minutes with a three-second increment. |
| `3|2` | Three minutes with a two-second increment. |
| `1|0` | One minute with no increment. |
| **No Timer** | Unlimited time for both players. |

### Board Themes

| Theme | Description |
|---|---|
| **Classic Brown** | Traditional wooden-style colors. |
| **Emerald** | Green-toned board colors. |
| **Midnight Blue** | Dark blue color palette. |
| **Rose** | Warm pink and rose tones. |
| **Black and White** | High-contrast monochrome style. |
| **Neon Cyberpunk** | Dark interface with bright neon accents. |

---

## Move History

The move history panel displays played moves in Standard Algebraic Notation and groups them by move number.

| Notation | Meaning |
|---|---|
| `e4` | Pawn move. |
| `Nf3` | Knight move. |
| `O-O` | Kingside castling. |
| `O-O-O` | Queenside castling. |
| `exd5` | Capture. |
| `e.p.` | En passant. |
| `+` | Check. |
| `#` | Checkmate. |

The move history automatically scrolls as new moves are played.

---

## FEN Support

FEN stands for **Forsyth–Edwards Notation**, a compact format used to describe a complete chess position.

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

---

## PGN Support

PGN stands for **Portable Game Notation**, a standard format for recording chess games.

| Control | Action |
|---|---|
| **Copy PGN** | Copies the current game to the clipboard. |
| **Download PGN** | Downloads the current game as a `.pgn` file. |

Moves are recorded in Standard Algebraic Notation, including castling, captures, promotion, checks, checkmate, and en passant notation.

---

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Escape` | Closes the currently open modal, such as New Game, Promotion, or Game Over. |

---

## Offline Support

The core application runs entirely in the browser and does not require an active server connection.

### Available Offline

- Chessboard rendering.
- Chess rules.
- AI calculations.
- Timers.
- Move history.
- PGN generation.
- FEN import and export.
- Sound effects after browser audio initialization.

> [!NOTE]
> The only external resource is the Google Fonts stylesheet used for the Inter font. If the font has already been cached, the application can continue working without an internet connection.

---

## Privacy

Modern Chess is designed to run locally on the user's device.

- No game data is sent to a server.
- No cookies are used by the application.
- No analytics or tracking scripts are included.
- No game state is saved to `localStorage`.
- Refreshing the page resets the current game.
- Chess calculations and AI processing occur locally in the browser.
- The optional Buy Me a Coffee link opens an external website only when selected by the user.

---

## Project Structure

```text
modern-chess/
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

---

## Troubleshooting

<details>
<summary><b>The AI does not move</b></summary>

<br />

Check that:

- The game mode is set to **Player versus Computer**.
- It is currently the computer's turn.
- The game has not ended.
- The selected position is valid.

Hard difficulty may require slightly more processing time than Easy or Medium.

</details>

<details>
<summary><b>The timer does not start</b></summary>

<br />

Select a time-control option with a positive time limit.

Timers run only during the active player's turn and stop automatically when the game ends.

</details>

<details>
<summary><b>Sound effects are not playing</b></summary>

<br />

Browsers usually require user interaction before audio can play.

1. Click the chessboard or any button.
2. Confirm that the Sound control is enabled.
3. Check that the browser tab is not muted.
4. Check your device volume.

</details>

<details>
<summary><b>Drag and drop does not work on mobile</b></summary>

<br />

Use tap-to-select and tap-to-move instead. This is the recommended interaction method for small touchscreens.

</details>

<details>
<summary><b>FEN import fails</b></summary>

<br />

Make sure the FEN string:

- Contains all six required fields.
- Uses valid piece symbols.
- Uses a valid active color.
- Uses valid castling notation.
- Uses a valid en passant square.
- Contains valid halfmove and fullmove numbers.

Invalid FEN strings are rejected and the current position is preserved.

</details>

<details>
<summary><b>The board does not update</b></summary>

<br />

1. Refresh the page.
2. Start a new game.
3. Clear any invalid FEN input.
4. Open the browser console and check for JavaScript errors.

The application does not persist the current game between sessions.

</details>

---

## Browser Compatibility

Modern Chess is intended for current versions of:

| Browser | Status |
|---|---|
| Google Chrome | Supported |
| Mozilla Firefox | Supported |
| Microsoft Edge | Supported |
| Apple Safari | Supported |

The application uses modern browser features such as:

- ES6 JavaScript.
- CSS Grid and Flexbox.
- Web Audio API.
- Clipboard API.
- Pointer and touch events.

---

## Deployment

Modern Chess is compatible with static hosting platforms.

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

Import the repository and deploy it as a static site.

No build command or environment variable is required.

---

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
- Test mouse and touch interactions.
- Avoid breaking PGN and FEN functionality.
- Use clear and descriptive commit messages.
- Update this README when adding major features.

---

## Support the Project

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

## License

This project is provided as open-source software.

See [`LICENSE`](LICENSE) for the complete license terms.

---

## Credits

<div align="center">

Developed by **Haiere** and **Hajir Studio**

<br />

<a href="https://hajir.is-a.dev/chess">
  <img src="https://img.shields.io/badge/Live_Demo-hajir.is--a.dev%2Fchess-4C8BF5?style=flat-square&logo=google-chrome&logoColor=white" alt="Live Demo">
</a>
<a href="https://github.com/haiere/modern-chess">
  <img src="https://img.shields.io/badge/Repository-github.com%2Fhaiere%2Fmodern--chess-181717?style=flat-square&logo=github&logoColor=white" alt="Repository">
</a>
<a href="https://buymeacoffee.com/hajirstudio">
  <img src="https://img.shields.io/badge/Support-buymeacoffee.com%2Fhajirstudio-FFDD00?style=flat-square&logo=buymeacoffee&logoColor=black" alt="Support">
</a>

</div>

---

<div align="center">
<sub>Last updated: September 2026</sub>
</div>