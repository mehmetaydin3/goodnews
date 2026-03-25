# Codebase Analysis

> Generated: 2026-03-12

---

## 1. App Structure

A musician services marketplace (Fiverr-style, but premium/editorial). The repo contains two distinct apps:

- `src/` — React design system (components + Storybook)
- `server/` — Express REST API (TypeScript + SQLite)
- `docs/` — Architecture/design docs (source of truth)
- `.storybook/` — Component development environment

---

## 2. Frontend Architecture

68 JSX components organized in 3 tiers:

| Tier | Count | Examples |
|---|---|---|
| UI base | 8 | Button, Tag, Avatar, RatingStars, AudioPreview |
| Features | 27 | MusicianGrid, ProfileCard, SearchFilterBar, BookingDrawer |
| Page compositions | 5 | LandingPage, MusicianListingPage, MusicianDetailPage |

**Key patterns:**
- CSS Modules for all styling (`*.module.css`)
- Barrel export via `src/index.js` (34 exports)
- Design tokens in `src/tokens/tokens.css` — 100+ CSS custom properties covering colors, spacing (8px grid), typography, shadows, motion
- Dark mode baked into the token system via `[data-theme="dark"]`
- No global state (no Redux/Zustand/Context) — components manage their own state

---

## 3. Backend Architecture

Express 5 + SQLite + JWT. 12 API endpoints across 4 route files:

```
POST /api/auth/register|login        — Auth (bcrypt + JWT, 24h)
GET  /api/musicians                  — List with search, filters, vibe query, pagination
GET  /api/musicians/:id              — Single musician + services
GET|POST /api/profile                — Authenticated user's profile (protected)
GET|POST|PUT|DELETE /api/services    — Service CRUD (protected)
GET  /health                         — Health check
```

A **vibe search system** maps natural language ("moody", "cinematic", "chill") to genres/instruments — lives in `server/src/utils/vibeMapper.ts`.

4 database tables: `users`, `musicians` (primary), `musician_profiles` (legacy), `services`

---

## 4. Key Dependencies

**Frontend:**
- React 18.2, Vite 5, Storybook 10, `@fontsource/outfit`, `@figma/code-connect`

**Backend:**
- Express 5.2, SQLite (`sqlite/sqlite3`), Zod 4, JWT, bcryptjs, uuid, tsx (TS runner)

---

## 5. Where to Make Changes for New Features

| Feature Type | Where |
|---|---|
| New UI component | `src/components/features/` or `ui/` |
| New page | `src/components/pages/` + add to `src/index.js` |
| New API endpoint | `server/src/routes/` + register in `server/src/index.ts` |
| New DB column | `server/src/db.ts` (raw SQL schema) + update `server/src/seed.ts` |
| Validation schema | `server/src/schemas/validation.ts` |
| Design tokens | `src/tokens/tokens.css` |
| Vibe search mapping | `server/src/utils/vibeMapper.ts` |

---

## 6. Technical Debt & Inconsistencies

### High Priority

1. **Dual schema problem** — `musician_profiles` (legacy) and `musicians` (primary) both exist with no clear deprecation path.
2. **Prisma schema exists but isn't used** — `server/prisma/schema.prisma` defines models, but all routes use raw SQL. Pick one and stick with it.
3. **JSON arrays in SQLite** — `instruments`, `genres`, `badges`, etc. stored as stringified JSON. Every query requires manual `JSON.parse/stringify`, creating fragility.
4. **Hardcoded JWT secret fallback** — `process.env.JWT_SECRET || 'secret'` is dangerous for production.

### Medium Priority

5. **No global state management** — 68 components with no shared state solution. Prop drilling will become painful as flows grow more complex.
6. **No test suite** — Storybook is used for manual validation only. Zero automated tests anywhere.
7. **Inconsistent field naming** — DB uses `ratingAverage`/`ratingCount`, but API adds compatibility aliases (`rating`, `reviewCount`). Some components may expect one or the other.
8. **No rate limiting on auth routes** — brute force vulnerability.

### Low Priority

9. No centralized API client on the frontend (components likely use raw `fetch`).
10. 47 components lack Storybook stories (only 21 of 68 are documented).
11. `dev.db` SQLite file should be confirmed in `.gitignore`.
