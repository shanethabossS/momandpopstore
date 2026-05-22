# SOV Business Launch System — Build Tracker

**Project**: Shop868 / SOV Business Onboarding
**Location**: `C:\AI_WORKSPACE\01_PRODUCTS\WEB_APPS\mom-and-pops-shop`
**API Backend**: `api.sovdigitalgroup.com/api/shop868/*` (Express + VPS Postgres)
**Auth**: Central SOV Auth via proxy routes (HttpOnly cookies)
**Stack**: Next.js 16, TailwindCSS, TypeScript, mobile-first

---

## Phase 1 — Core (MVP)

- [x] Project scaffolded (Next.js 16, Tailwind, shadcn)
- [x] Security headers in next.config.ts
- [x] Auth system (proxy routes: login, register, me, logout, accept-token)
- [x] Auth context provider + rate limiter
- [x] Auth proxy (proxy.ts) for protected routes
- [x] Landing page (hero, value props, search, CTA)
- [x] Login page (email/password + Google OAuth)
- [x] Signup page (full name, email, phone, password + Google)
- [x] Onboarding wizard (4-step: business details → category/location → products → WhatsApp/payment)
- [x] API proxy routes for shop868 backend (shops, listings)
- [x] Merchant dashboard (stats, catalog CRUD, launch checklist)
- [x] Public storefront (/store/[slug]) with SEO, products, deals, reviews, about tabs

## Phase 2 — Growth

- [ ] Subscription management (Starter/Growth/Business tiers)
- [ ] Analytics dashboard (views, clicks, WhatsApp taps)
- [ ] QR code generation
- [ ] Reviews integration
- [ ] KYC/verification flow
- [ ] WhatsApp automation templates

## Phase 3 — Scale

- [ ] AI listing generator
- [ ] AI business assistant
- [ ] Delivery system prep
- [ ] Ecosystem integrations (FixNowTT, FindWorkTT, etc.)
- [ ] Advanced admin moderation (use existing admin dashboard)

---

## API Routes Available (shop868.js on VPS)

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | /listings | No | List active listings with filters |
| GET | /listings/:id | No | Single listing detail |
| GET | /shops/:id | No | Shop + its listings |
| POST | /shops | Yes | Create shop |
| POST | /listings | Yes | Create listing |
| PATCH | /listings/:id | Yes | Update listing (owner) |
| PATCH | /listings/:id/status | Yes | Update listing status |
| POST | /listings/:id/report | Yes | Report listing |
| POST | /payments/checkout | Yes | Create Fygaro checkout session |
| GET | /admin/me | Yes | Check admin status |
| PATCH | /admin/listings/:id | Admin | Admin update listing |
| PATCH | /admin/kyc/:id | Admin | Admin update KYC |

## API Routes Needed (add to shop868.js later)

- GET /shops/my — get current user's shop(s)
- PATCH /shops/:id — update shop details
- GET /subscriptions/my — get current subscription
- POST /subscriptions — create subscription
- POST /kyc — submit KYC documents

---

## Change Log

### Session 1 — Initial Build
- Created BUILD_TRACKER.md
- Set up auth system, landing page, login/signup, onboarding wizard
- Built merchant dashboard and public storefront
