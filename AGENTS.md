# AI Games Arcade — Agent Instructions

## Core Rules

1. **Static-only** — Every game must work on a static-content hosted website with no back-end server. No server-side code, no APIs, no databases.
2. **No build systems** — Do not use bundlers (`webpack`, `vite`, `parcel`, etc.) or transpilers. The source files _are_ the production files.
3. **No package managers** — Do not use `npm`, `yarn`, or `pnpm` to install dependencies.
4. **CDN imports are welcome** — You may use any framework or library (game engines, CSS frameworks, utility libraries) as long as it can be loaded via a `<script>` or `<link>` tag from a CDN (e.g. unpkg, cdnjs, jsdelivr).

## Recommended Libraries

These are popular, CDN-friendly libraries well-suited for this project:

- **Game engines:** Phaser, PixiJS, Babylon.js, Three.js, Kaboom.js
- **Creative coding:** p5.js
- **Physics:** Matter.js, Planck.js
- **Audio:** Howler.js, Tone.js
- **Animation:** GSAP, Anime.js
- **CSS frameworks:** Any that work via a `<link>` tag

## Project Structure

```
ai-games/
├── index.html          # Landing page with game cards
├── styles.css          # Shared site styles
├── AGENTS.md           # These instructions
├── README.md           # Human-facing readme
├── games/
│   └── <game-name>/    # Each game in its own folder
│       └── index.html  # Game entry point (self-contained)
```

## Game Page Conventions

Each game page (`games/<game-name>/index.html`) should:

- Be fully self-contained (all game code in this file or sibling files within the folder)
- Include `<meta charset="UTF-8">` and viewport meta tag
- Include a descriptive `<title>` in the format: `Game Name — AI Games Arcade`
- Include a meta description
- Include a "← Back to Arcade" link pointing to `../../index.html`

## Landing Page Cards

When adding a game, a card must be added to `index.html` inside the `<section class="games-grid">` element. Each card follows this pattern:

```html
<a href="games/<game-name>/index.html" class="game-card game-card--<color-theme>" id="card-<game-name>">
  <div class="game-card__thumb game-card__thumb--<game>">
    <!-- Abstract thumbnail shapes -->
  </div>
  <div class="game-card__body">
    <h2 class="game-card__title">Game Name</h2>
    <p class="game-card__desc">Short one-line description of the game.</p>
    <span class="game-card__cta">Play <span class="game-card__cta-arrow">→</span></span>
  </div>
</a>
```

Existing color themes: `game-card--purple-cyan`, `game-card--orange-pink`, `game-card--green-yellow`. New cards can use an existing theme or define a new one in `styles.css`.

## Workflows

See `.agents/workflows/` for step-by-step procedures (e.g. `add-game.md`).
