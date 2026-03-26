# AI Lab

A collection of web projects built with the help of AI.

> **Frameworks & Libraries Are Welcome** — You may use external frameworks and libraries (CSS frameworks, game engines, utility libraries, etc.) as long as they can be imported directly into the page via `<script>` or `<link>` tags (e.g. from a CDN). No package managers or build systems required.

## Projects

### 🕹️ The Arcade

A collection of AI-generated browser arcade games.

### 🧪 The Sandbox

Experimental projects and interactive concepts still in development.

## Running Locally

Run this from inside the project folder to serve it locally at `http://localhost:3000/`:

```sh
npx -y serve -l 3000
```

## Project Structure

```
ai-lab/
├── index.html          # AI Lab landing page
├── styles.css          # Root page styles
├── AGENTS.md           # AI agent instructions
├── arcade/
│   ├── index.html      # The Arcade landing page
│   ├── styles.css      # Shared arcade styles
│   ├── landing.css     # Arcade landing page styles
│   └── <game-name>/    # Each game in its own folder
│       └── index.html
└── sandbox/
    ├── index.html      # The Sandbox landing page
    └── <project-name>/ # Each project in its own folder
```

## Contributing (for AI agents)

See [AGENTS.md](AGENTS.md) for project rules and conventions, and `.agents/workflows/` for step-by-step procedures.
