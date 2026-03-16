# AI Games Arcade

A collection of AI-generated, client-side-only browser games. No servers, no frameworks — just HTML, CSS, and JavaScript.

## Structure

```
ai-games/
├── index.html          # Landing page
├── styles.css          # Shared styles
├── games/
│   ├── gravity-drop/   # Each game lives in its own folder
│   │   └── index.html
│   ├── neon-snake/
│   │   └── index.html
│   └── pixel-maze/
│       └── index.html
```

## Adding a New Game

1. Create a new folder under `games/` (e.g. `games/my-game/`).
2. Add an `index.html` inside it — this is the game's entry point.
3. Add a card to the landing page (`index.html`) linking to your game.

## Running

Open `index.html` in any browser, or serve with:

```sh
npx -y serve .
```
