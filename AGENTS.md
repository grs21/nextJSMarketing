# AGENTS.md

## Cursor Cloud specific instructions

This is a Next.js 16.x application (App Router) bootstrapped with `create-next-app`. Single service, no database or external dependencies.

### Services

| Service | Command | URL |
|---|---|---|
| Next.js dev server | `npm run dev` | http://localhost:3000 |

### Common commands

Standard npm scripts are in `package.json`:

- **Dev server:** `npm run dev`
- **Lint:** `npm run lint` (ESLint with `eslint-config-next`)
- **Build:** `npm run build`
- **Start (production):** `npm start`

### Notes

- The dev server uses Turbopack and supports hot reload out of the box.
- No `.env` files are needed; there are no environment variables required.
- No Docker, no database, no external services to configure.
