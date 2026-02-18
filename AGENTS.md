# AGENTS.md — Agar Tidak Lupa

## Commands
- Dev: `npm run dev` (port 3000) + `npx convex dev` (backend)
- Build: `npm run build` | Test: `npm run test` | Single test: `npx vitest run src/path/to/file.test.ts`
- Lint: `npm run lint` | Format: `npm run format` | Check: `npm run check`

## Architecture
- **Frontend:** TanStack Start + Router (file-based routes in `src/routes/`), React 19, Vite, deployed on Netlify.
- **Backend:** Convex (`convex/` dir) — schema in `convex/schema.ts`, queries/mutations as exported functions.
- **Styling:** Tailwind CSS v4 — Neo Brutalism design system. Styles in `src/styles.css`.
- **Path alias:** `@/*` maps to `src/*`. Components in `src/components/`, data layer in `src/data/`, integrations in `src/integrations/`.
- Route tree is auto-generated (`src/routeTree.gen.ts`) — never edit manually.

## Code Style
- TypeScript strict mode. Formatter: Biome — **tabs**, **double quotes**, organize imports on save.
- Components: PascalCase files (`Header.tsx`). Routes: lowercase in `src/routes/`.
- Convex functions: use `query`/`mutation` from `convex/_generated/server`, validate all args with `v` validators.
- Convex schemas: don't add `_id` or `_creationTime` (auto-provided). Use `v.id("table")` for references.
- Icons: `lucide-react`. No other UI library installed.
