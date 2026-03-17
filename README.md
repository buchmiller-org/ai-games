# AI Games Arcade

A collection of AI-generated, client-side-only browser games. No servers, no build steps — just static files served directly in the browser.

> **Frameworks & Libraries Are Welcome** — You may use external frameworks and libraries (CSS frameworks, game engines, utility libraries, etc.) as long as they can be imported directly into the page via `<script>` or `<link>` tags (e.g. from a CDN). No package managers or build systems required.

## Games

| Game | Description |
|------|-------------|
| [Gravity Drop](games/gravity-drop/index.html) | Guide a falling orb through shifting gravity fields |
| [Neon Snake](games/neon-snake/index.html) | Classic snake reimagined with neon visuals |
| [Pixel Maze](games/pixel-maze/index.html) | Navigate procedurally generated mazes |

## Running Locally

Open `index.html` in any browser, or serve with:

```sh
npx -y serve .
```

## Project Structure

```
ai-games/
├── index.html          # Landing page
├── styles.css          # Shared styles
├── AGENTS.md           # AI agent instructions
├── games/
│   └── <game-name>/    # Each game in its own folder
│       └── index.html
```

## Contributing (for AI agents)

See [AGENTS.md](AGENTS.md) for project rules and conventions, and `.agents/workflows/` for step-by-step procedures.
