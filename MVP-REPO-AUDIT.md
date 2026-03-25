# MVP Repository Audit — Prova Musician Marketplace

**Audit Date:** March 12, 2026
**Auditor Role:** Senior Product Engineer
**Scope:** Map current codebase against 7 required MVP capabilities; identify gaps and a recommended path forward.

---

## 1. Current Repository Architecture

### Frontend (`/`)
- React 18 + Storybook 10 (Vite)
- ~37 components with CSS Modules, organized as a design system
- No routing library — components are composed page-level but not yet wired into a real SPA router
- API integration exists in `MusicianListingPage` (fetches from `localhost:5001`); most other components use hardcoded mock props

### Backend (`/server`)
- Express 5 + TypeScript 5.9 + SQLite
- Four route files: `auth`, `musicians`, `profile`, `(health check)`
- JWT-based auth (`Authorization: Bearer <token>`)
- Zod validation on auth and profile routes
- Prisma schema defined but **routes use raw SQL** via the `sqlite` package — Prisma client is not used in practice

### Database (SQLite — `server/prisma/dev.db`)
Four tables exist (raw SQL, initialized in `db.ts`):

| Table | Purpose |
|-------|---------|
| `users` | Auth — email + passwordHash |
| `musician_profiles` | Profile creation via `/api/profile` |
| `musicians` | Browsable musician directory (seeded manually) |
| `services` | Service offerings per musician |

> **Critical gap:** `musician_profiles` and `musicians` are disconnected. A user who creates a profile via `/api/profile` does NOT appear in the `/api/musicians` browse listing.

---

## 2. Existing Marketplace Features (What Works Today)

| Feature | File(s) | Notes |
|---------|---------|-------|
| Browse musicians | `server/src/routes/musicians.ts`, `src/components/MusicianListingPage/` | Filtering (genre, instrument, service, search, sort), 12 seeded musicians, API + client-side fallback |
| Musician detail page | `server/src/routes/musicians.ts` (:id), `src/components/MusicianDetailPage/` | Full hero, bio, audio, services, review display |
| User registration & login | `server/src/routes/auth.ts` | Email/password, JWT returned on login |
| Musician profile CRUD (partial) | `server/src/routes/profile.ts` | Creates `musician_profiles` record; does not sync to `musicians` table |
| Service packages display | `src/components/ServicePackages/` | Read-only display; no create/edit |
| Review display | `src/components/ReviewList/` | Renders static/prop data; no backend fetch or submission |
| Booking flow UI | `src/components/BookingDrawer/` | Full 3-step UI (package → summary → confirm); booking is never persisted |

---

## 3. MVP Capability Gaps

### Capability 1 — Browse Musicians ✅ Mostly Complete
**Working:** Search, genre/instrument/service filters, sort, pagination, API integration, fallback.
**Gaps:**
- Backend does not support price range filtering (client-side only)
- No backend pagination offset/cursor (limit is capped at 100, not paginated)
- `musicians` table only populated via seed script, not by real user signups

---

### Capability 2 — View Musician Detail Page ✅ Complete
All data (bio, location, response time, genres, instruments, services, reviews) is returned by `GET /api/musicians/:id` and rendered by `MusicianDetailPage`.
No gaps.

---

### Capability 3 — Musicians Create/Manage Profile ⚠️ Partial (~40%)
**Working:** Auth routes, JWT middleware, `POST /api/profile` saves to `musician_profiles`.
**Gaps:**
- `musician_profiles` is not queried by `/api/musicians` — created profiles are invisible to browsers
- No profile edit UI (zero frontend components for this)
- No service creation/management endpoint or UI
- No file uploads (avatar, cover image, audio samples)
- Profile schema only covers basic fields; `musicians` table has 32 columns including rating, badges, etc.

---

### Capability 4 — Submit a Booking or Request ⚠️ Partial (~50% UI, 0% backend)
**Working UI:** `BookingDrawer` has a full 3-step flow (package selection → price review → confirmation), platform fee calculation, and a client-generated booking reference.
**Gaps:**
- No `bookings` table in the database
- No `POST /api/bookings` endpoint
- Booking confirmation is a fake success screen — nothing is persisted
- No auth check on booking (anonymous users can appear to book)
- No booking status tracking (pending → accepted → completed)
- No musician-side booking management UI

---

### Capability 5 — Messaging ❌ Completely Missing (0%)
**Nothing exists.** Contact buttons in `MusicianDetailHero`, `MusicianDetailPage`, and `ListingPageFull` all call empty `onContact` callbacks or `console.log`.
**Needed from scratch:**
- `conversations` and `messages` database tables
- REST or WebSocket messaging backend
- Message thread and inbox UI components

---

### Capability 6 — Payments ❌ Completely Missing (0%)
**Nothing exists.** `BookingDrawer` calculates a total + 10% platform fee on the frontend but there is no checkout, no payment gateway, and no transaction record.
**Needed from scratch:**
- Payment gateway integration (Stripe recommended)
- `transactions` / `payments` database table
- Checkout flow UI
- Payment confirmation and receipt
- Payout logic for musicians

---

### Capability 7 — Reviews After Completed Work ⚠️ Partial (~40%)
**Working:** `ReviewList` renders review data beautifully with rating distribution, avatars, and relative timestamps.
**Gaps:**
- No `reviews` table in the database
- No `GET /api/musicians/:id/reviews` endpoint
- No `POST /api/reviews` endpoint
- No review submission form component
- `ReviewList` receives static/prop data — not wired to any API
- No gating (only users with completed bookings should be able to review)
- Rating distribution chart is computed from review count, not actual star data

---

## 4. Summary Matrix

| MVP Capability | Status | Frontend | Backend | Database |
|----------------|--------|----------|---------|----------|
| 1. Browse musicians | ✅ ~95% | Complete | Complete | Complete (seeded) |
| 2. Musician detail page | ✅ 100% | Complete | Complete | Complete |
| 3. Create/manage profile | ⚠️ 40% | Missing | Partial | Disconnected tables |
| 4. Submit booking | ⚠️ 50% | Complete | Missing | Missing table |
| 5. Messaging | ❌ 0% | Missing | Missing | Missing tables |
| 6. Payments | ❌ 0% | Missing | Missing | Missing table |
| 7. Reviews | ⚠️ 40% | Display only | Missing | Missing table |

---

## 5. Suggested Refactor Areas

### 5a. Unify `musician_profiles` and `musicians` tables
The most critical data integrity issue. Options:
- **Preferred:** When a user completes their profile, auto-create or update a row in the `musicians` table. Add a `userId` foreign key column to `musicians` to link ownership.
- **Alternative:** Consolidate into one table. The `musicians` table already has all the right columns; `musician_profiles` can be deprecated.

### 5b. Add a router to the frontend
Currently there is no client-side routing. Pages are Storybook stories or manually composed. The MVP needs navigable URLs:
- `/` — home / listing page
- `/musicians/:id` — detail page
- `/profile/edit` — profile editor
- `/bookings` — booking history
- `/messages` — inbox

Recommended: **React Router v6** (lightweight, already common in the ecosystem).

### 5c. Wire up `BookingDrawer` to a real endpoint
`BookingDrawer` is ~80% done. The booking reference generation, package selection, and price calculation are already correct. It just needs a `POST /api/bookings` call and auth check.

### 5d. Introduce a file upload strategy early
Profile management and audio samples both need file storage. Decide on:
- Local disk (fine for MVP dev; not scalable)
- Cloudinary (easiest hosted option for media-heavy apps)
- S3/R2 (more control, slightly more setup)

This decision affects both profile creation and musician media upload flows.

### 5e. Defer WebSockets for messaging
Real-time messaging can be approximated with polling (`GET /api/conversations/:id/messages?since=<timestamp>`) for the MVP. This avoids socket infrastructure complexity at launch and can be upgraded later.

### 5f. Use Stripe for payments
The platform fee is already calculated (10%). Stripe Connect is well-suited for marketplaces (handles split payments, payouts to musicians). Integrate Stripe Elements on the frontend; webhook handling on the backend for async payment confirmation.

---

## 6. Recommended Implementation Order

### Phase 1 — Close the profile loop (Enables Capability 3)
1. Add `userId` foreign key to `musicians` table
2. Update `POST /api/profile` to upsert into `musicians` (not just `musician_profiles`)
3. Build `ProfileEditForm` component (frontend)
4. Add service creation endpoint `POST /api/services` + UI
5. Basic file upload for avatar (local disk for now)

### Phase 2 — Persist bookings (Enables Capability 4)
1. Add `bookings` table: `id, userId, musicianId, packageId, date, brief, status, totalAmount, platformFee, bookingRef, createdAt`
2. Add `POST /api/bookings` endpoint (requires auth)
3. Wire `BookingDrawer` to call the endpoint on "Confirm & Send"
4. Add `GET /api/bookings` (user's bookings) and `GET /api/bookings/incoming` (musician's received bookings)

### Phase 3 — Reviews (Enables Capability 7)
1. Add `reviews` table: `id, bookingId, authorId, musicianId, rating, text, createdAt`
2. Add `POST /api/reviews` endpoint (gated: booking must be in `completed` status)
3. Add `GET /api/musicians/:id/reviews` endpoint
4. Wire `ReviewList` to fetch from API
5. Add `ReviewForm` submission component

### Phase 4 — Payments (Enables Capability 6)
1. Add Stripe SDK to backend
2. Add `POST /api/payments/create-intent` endpoint (returns Stripe PaymentIntent)
3. Add `transactions` table
4. Add Stripe Elements to `BookingDrawer` step 2
5. Add Stripe webhook handler for payment confirmation → update booking status to `paid`
6. Set up Stripe Connect for musician payouts

### Phase 5 — Messaging (Enables Capability 5)
1. Add `conversations` table (id, participantIds, bookingId, createdAt) and `messages` table (id, conversationId, senderId, text, createdAt, readAt)
2. Add REST endpoints: `POST /api/conversations`, `POST /api/conversations/:id/messages`, `GET /api/conversations`, `GET /api/conversations/:id/messages`
3. Build `MessageThread` and `InboxList` components
4. Trigger conversation creation when booking is accepted
5. (Later) Upgrade to WebSockets for real-time delivery

### Phase 6 — Frontend routing + auth state
1. Add React Router
2. Add auth context (store JWT in memory/localStorage, expose `currentUser`)
3. Protect routes (profile, bookings, messages require login)
4. Add login/register pages/modals

---

## 7. Files to Create (Not Yet Existing)

| File | Purpose |
|------|---------|
| `server/src/routes/bookings.ts` | Booking CRUD |
| `server/src/routes/reviews.ts` | Review submission & fetch |
| `server/src/routes/messages.ts` | Messaging endpoints |
| `server/src/routes/payments.ts` | Stripe payment intent + webhook |
| `server/src/routes/uploads.ts` | File upload handling |
| `src/components/ProfileEditForm/` | Musician profile editor UI |
| `src/components/BookingHistory/` | User's booking list |
| `src/components/ReviewForm/` | Submit a review |
| `src/components/MessageThread/` | Chat thread view |
| `src/components/InboxList/` | Conversation inbox |
| `src/components/AuthModal/` | Login/register modal |
| `src/context/AuthContext.jsx` | JWT auth state |
| `src/router.jsx` | React Router routes |

---

## 8. Files to Modify (Existing, Need Updates)

| File | Change Needed |
|------|--------------|
| `server/src/db.ts` | Add `bookings`, `reviews`, `messages`, `conversations`, `transactions` tables; add `userId` to `musicians` |
| `server/src/routes/profile.ts` | Sync profile saves to `musicians` table |
| `server/src/index.ts` | Register new route files |
| `src/components/BookingDrawer/BookingDrawer.jsx` | Wire `onConfirm` to `POST /api/bookings` |
| `src/components/ReviewList/ReviewList.jsx` | Fetch reviews from `GET /api/musicians/:id/reviews` |
| `src/components/MusicianDetailPage/MusicianDetailPage.jsx` | Wire `onContact` to open message thread; wire `onBook` to authenticated booking |
| `src/index.js` | Export new components as they are built |

---

*This audit is intended as a planning reference. No code has been generated or modified.*
