---
description: How to add a new game to the AI Games Arcade
---

# Add a New Game

## Steps

1. **Create the game folder** — Create a new directory under `games/` with a kebab-case name (e.g. `games/space-invaders/`).

2. **Create `index.html`** — Add an `index.html` file inside the game folder. This is the entry point. It should include:
   - A `<meta charset="UTF-8">` and viewport meta tag
   - A `<title>` in the format `Game Name — AI Games Arcade`
   - A `<meta name="description">` with a short game summary
   - The shared favicon (copy from an existing game page)
   - A "← Back to Arcade" link: `<a href="../../index.html">← Back to Arcade</a>`
   - All game logic (inline or in sibling `.js` files within the same folder)
   - Any CDN library imports via `<script>` or `<link>` tags

3. **Add a card to the landing page** — Open the root `index.html` and add a new `<a class="game-card">` element inside `<section class="games-grid">`. Follow the card HTML pattern documented in `AGENTS.md`. Choose an existing color theme or create a new one.

4. **Add thumbnail shapes** — Inside the card's `game-card__thumb` div, add abstract SVG or CSS shapes that visually represent the game. Look at existing cards in `index.html` for examples.

5. **(Optional) Add custom styles** — If the game card needs a new color theme or the game page needs custom styles, add them to `styles.css` or a local CSS file in the game folder.

6. **Test** — Open the root `index.html` in a browser and verify the new card renders correctly, links to the game page, and the game page works.
