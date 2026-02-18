# Agar Tidak Lupa

A minimalist personal link saver — *so you don't forget*.

Save, organize, and revisit links that matter to you. Built with a Neo Brutalism design system.

## Tech Stack

- **Framework:** [TanStack Router](https://tanstack.com/router) (file-based routing)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Database:** [Convex](https://www.convex.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) — Neo Brutalism design
- **Linting & Formatting:** [Biome](https://biomejs.dev/)
- **Testing:** [Vitest](https://vitest.dev/)

## Getting Started

```bash
npm install
npm run dev
```

### Convex Setup

1. Set `VITE_CONVEX_URL` and `CONVEX_DEPLOYMENT` in `.env.local` (or run `npx convex init`).
2. Run `npx convex dev` to start the Convex dev server.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run test` | Run tests |
| `npm run lint` | Lint with Biome |
| `npm run format` | Format with Biome |
| `npm run check` | Lint + format check |
