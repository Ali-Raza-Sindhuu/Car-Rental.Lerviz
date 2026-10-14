# Car Rental Platform — Backend Specification

> **Audience:** Codex (AI coding agent) and human reviewers.
> **Goal:** A clean, complete, production-style REST API backend that works as a LinkedIn/GitHub portfolio showcase.
> **Scope:** Backend only. Admin module + Customer module. Compact database (12 tables). No frontend in this phase.

---

## 1. Project Goals

1. Show real-world backend engineering: auth, RBAC, relational modeling, business rules, transactions, validation, testing, docs.
2. Keep it **readable**: small files, clear names, comments only where logic is non-obvious.
3. Keep it **compact**: only the tables and endpoints that demonstrate skill. No over-engineering.
4. Anyone should be able to clone, run one command, and have a working API with seeded demo data.

## 2. Tech Stack (default — do not change unless something is impossible)

| Concern | Choice |
|---|---|
| Runtime / Language | Node.js 20+ with **TypeScript** (strict mode) |
| Framework | **Express** |
| Database | **PostgreSQL 16** |
| ORM / Migrations | **Prisma** |
| Validation | **Zod** |
| Auth | JWT access token (15 min) + refresh token (7 days, stored hashed in DB), **bcrypt** for passwords |
| Docs | **Swagger / OpenAPI 3** served at `/api/docs` |
| Testing | **Jest + Supertest** (unit tests for services, integration tests for key flows) |
| Security | `helmet`, `cors`, `express-rate-limit`, input validation on every endpoint |
| Logging | `pino` (+ `pino-http`) |
| DevOps | **Docker + docker-compose** (api + postgres), `.env.example`, GitHub Actions CI (lint + test) |
| Code quality | ESLint + Prettier, Husky optional |

## 3. Roles & Permissions

| Role | Description |
|---|---|
| `CUSTOMER` | Registers themselves, browses vehicles, books, pays, cancels, reviews. |
| `ADMIN` | Seeded account. Manages fleet, locations, bookings, customers, coupons, maintenance, sees dashboard/reports. |

RBAC is enforced by middleware (`authenticate` then `authorize('ADMIN')`). Customers can only access **their own** bookings, payments and profile.

## 4. Database Design (12 tables)

Use UUID primary keys, `created_at` / `updated_at` on every table, and soft delete (`deleted_at`) where noted.

| # | Table | Purpose | Key columns |
|---|---|---|---|
| 1 | `users` | Login accounts | id, email (unique), password_hash, full_name, phone, role (`ADMIN`/`CUSTOMER`), is_active, deleted_at |
| 2 | `customer_profiles` | Extra rental info (1–1 with user) | user_id, date_of_birth, driving_license_no, license_expiry, address, city, country |
| 3 | `refresh_tokens` | Session management | id, user_id, token_hash, expires_at, revoked_at |
| 4 | `locations` | Pickup/drop-off branches | id, name, city, address, phone, is_active |
| 5 | `vehicle_categories` | Economy, SUV, Luxury, Van… | id, name (unique), description, base_daily_rate, deposit_amount |
| 6 | `vehicles` | The fleet | id, category_id, location_id, make, model, year, plate_no (unique), vin (unique), transmission, fuel_type, seats, doors, color, mileage_km, daily_rate, status (`AVAILABLE`/`MAINTENANCE`/`RETIRED`), deleted_at |
| 7 | `vehicle_images` | Photos per vehicle | id, vehicle_id, url, is_primary |
| 8 | `bookings` | Core reservation record | id, booking_no (unique, human-readable), customer_id, vehicle_id, pickup_location_id, dropoff_location_id, start_at, end_at, actual_return_at, status, daily_rate_snapshot, total_days, subtotal, discount_amount, tax_amount, late_fee, deposit_amount, total_amount, coupon_id, cancel_reason, notes |
| 9 | `payments` | Payments & refunds | id, booking_id, type (`RENTAL`/`DEPOSIT`/`LATE_FEE`/`REFUND`), amount, method (`CARD`/`CASH`/`ONLINE`), status (`PENDING`/`PAID`/`FAILED`/`REFUNDED`), transaction_ref, paid_at |
| 10 | `reviews` | Customer feedback | id, booking_id (unique), customer_id, vehicle_id, rating (1–5), comment |
| 11 | `maintenance_logs` | Vehicle service history | id, vehicle_id, type (`SERVICE`/`REPAIR`/`INSPECTION`), description, cost, start_date, end_date, status |
| 12 | `coupons` | Discount codes | id, code (unique), discount_type (`PERCENT`/`FIXED`), value, min_days, valid_from, valid_to, max_uses, used_count, is_active |

**Relationships:** user 1–1 customer_profile; user 1–N bookings; vehicle 1–N bookings; booking 1–N payments; booking 1–1 review; vehicle 1–N images / maintenance_logs; category 1–N vehicles; location 1–N vehicles.

**Indexes:** `bookings(vehicle_id, start_at, end_at)`, `bookings(customer_id)`, `vehicles(status, category_id, location_id)`, `payments(booking_id)`.

## 5. Booking Lifecycle

```
PENDING ──(admin confirms / payment paid)──► CONFIRMED ──(admin marks pickup)──► ACTIVE ──(admin marks return)──► COMPLETED
   │                                             │
   └──────(customer or admin cancels)────────────┴──► CANCELLED
   └──(admin rejects)──► REJECTED
```

Invalid transitions must return `409 Conflict` with a clear message. Put the state machine in one place (`booking.state.ts`).

## 6. Core Business Rules (this is where the showcase value is)

1. **No double booking.** A vehicle cannot have two bookings with overlapping date ranges in statuses `PENDING`, `CONFIRMED`, `ACTIVE`. Overlap check: `new.start < existing.end AND new.end > existing.start`. Run availability check and insert **inside one DB transaction** (use serializable isolation or row lock) to be race-condition safe.
2. **Vehicle must be bookable:** status `AVAILABLE`, not soft-deleted, no maintenance overlapping the dates.
3. **Customer eligibility:** profile must be complete; age ≥ 21 (configurable); driving license must not expire before `end_at`.
4. **Date validation:** `start_at` in the future, `end_at` after `start_at`, minimum 1 day, maximum 30 days (configurable).
5. **Pricing (single `pricing.service.ts`):**
   - `total_days = ceil((end - start) / 24h)`
   - `subtotal = total_days × daily_rate`
   - Long-rental discount: 7+ days → 10% off (configurable constant)
   - Coupon: validate active, in date range, `min_days`, usage limit; apply percent or fixed
   - `tax = 10%` of (subtotal − discounts) (configurable)
   - `deposit` taken from category; refundable
   - `total_amount = subtotal − discounts + tax` (deposit tracked separately)
   - Store `daily_rate_snapshot` so later price changes do not alter old bookings.
6. **Late return:** if `actual_return_at > end_at`, `late_fee = extra_hours_ceil_to_day × daily_rate × 1.5`. Creates a `LATE_FEE` payment record.
7. **Cancellation policy:** free cancel ≥ 48h before pickup (full refund); 48h–24h → 50% refund; < 24h → no refund. Create a `REFUND` payment record.
8. **Payments:** implement a `PaymentGateway` interface with a `MockPaymentGateway` (always succeeds unless amount invalid) so a real gateway (Stripe) can be dropped in later. Do not integrate real payment APIs.
9. **Reviews:** only the booking's customer, only after status `COMPLETED`, one review per booking, rating 1–5.
10. **Vehicle deletion:** soft delete only; blocked if it has `CONFIRMED`/`ACTIVE` bookings.
11. **Maintenance:** creating an open maintenance log sets the vehicle to `MAINTENANCE`; closing it sets it back to `AVAILABLE`. Block if there are upcoming confirmed bookings in that window (return 409).
12. **Return mileage:** admin can update `mileage_km` when completing a booking.

## 7. API Design

Base URL: `/api/v1`. JSON only. Consistent response envelope:

```json
{ "success": true, "data": {}, "meta": { "page": 1, "limit": 10, "total": 42 } }
{ "success": false, "error": { "code": "BOOKING_OVERLAP", "message": "Vehicle is not available for the selected dates", "details": [] } }
```

Use proper HTTP codes (200, 201, 204, 400, 401, 403, 404, 409, 422, 429, 500). List endpoints support `page`, `limit`, `sort`, and relevant filters.

### 7.1 Auth (public)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Customer registration |
| POST | `/auth/login` | Returns access + refresh token |
| POST | `/auth/refresh` | Rotate refresh token |
| POST | `/auth/logout` | Revoke refresh token |
| GET | `/auth/me` | Current user |
| PATCH | `/auth/change-password` | Change own password |

### 7.2 Public / Customer — Catalog
| Method | Endpoint | Description |
|---|---|---|
| GET | `/vehicles` | Browse/search: filter by `category`, `location`, `transmission`, `fuel`, `seats`, `minPrice`, `maxPrice`, and **available between `startDate` & `endDate`**; sort by price/year |
| GET | `/vehicles/:id` | Details, images, average rating |
| GET | `/vehicles/:id/availability` | Booked date ranges for calendar use |
| GET | `/vehicles/:id/reviews` | Public reviews |
| GET | `/categories` | List categories |
| GET | `/locations` | List active locations |
| POST | `/bookings/quote` | Price preview (days, discount, tax, deposit, total) without creating a booking |

### 7.3 Customer — Authenticated
| Method | Endpoint | Description |
|---|---|---|
| GET / PUT | `/customers/me/profile` | View / complete profile (license, DOB, address) |
| POST | `/bookings` | Create booking (applies all rules in section 6) |
| GET | `/bookings/my` | My bookings (filter by status) |
| GET | `/bookings/:id` | My booking details (ownership enforced) |
| POST | `/bookings/:id/cancel` | Cancel with refund policy |
| POST | `/bookings/:id/payments` | Pay for booking (mock gateway) |
| GET | `/bookings/:id/payments` | Payment history for booking |
| POST | `/bookings/:id/review` | Leave review after completion |

### 7.4 Admin — requires `ADMIN`
| Method | Endpoint | Description |
|---|---|---|
| GET | `/admin/dashboard` | KPIs: total vehicles, available now, active rentals, pending bookings, customers, revenue (today / month), top 5 vehicles, fleet utilization % |
| CRUD | `/admin/vehicles` | Create / update / list / soft-delete vehicles; `POST /admin/vehicles/:id/images` |
| CRUD | `/admin/categories` | Manage categories |
| CRUD | `/admin/locations` | Manage locations |
| GET | `/admin/bookings` | All bookings with filters (status, date range, customer, vehicle) |
| PATCH | `/admin/bookings/:id/confirm` | Confirm |
| PATCH | `/admin/bookings/:id/reject` | Reject with reason |
| PATCH | `/admin/bookings/:id/pickup` | Mark as picked up (ACTIVE) |
| PATCH | `/admin/bookings/:id/return` | Mark returned (COMPLETED), compute late fee, update mileage |
| GET | `/admin/customers` | List/search customers |
| GET | `/admin/customers/:id` | Customer detail + rental history |
| PATCH | `/admin/customers/:id/status` | Activate / deactivate account |
| GET | `/admin/payments` | All payments, filter by status/date |
| CRUD | `/admin/maintenance` | Maintenance logs |
| CRUD | `/admin/coupons` | Manage discount codes |
| GET | `/admin/reports/revenue` | Revenue grouped by day/month (`from`, `to`) |
| GET | `/admin/reports/utilization` | Per-vehicle / per-category utilization |
| GET | `/admin/reviews` | List reviews; `DELETE` to moderate |

> Do not add more tables or modules than listed. Extra scope is out of bounds for this phase.

## 8. Folder Structure (feature/module based)

```
car-rental-backend/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── src/
│   ├── app.ts                  # Express app setup (middleware, routes)
│   ├── server.ts               # Bootstrap + graceful shutdown
│   ├── config/                 # env.ts (zod-validated), logger.ts, swagger.ts, prisma.ts
│   ├── common/
│   │   ├── errors/             # AppError, error codes, error-handler middleware
│   │   ├── middleware/         # authenticate, authorize, validate, rate-limit, not-found
│   │   ├── utils/              # asyncHandler, pagination, date helpers, booking-number generator
│   │   └── types/              # shared types, express.d.ts
│   ├── modules/
│   │   ├── auth/               # auth.routes.ts, auth.controller.ts, auth.service.ts, auth.schema.ts
│   │   ├── customers/
│   │   ├── vehicles/
│   │   ├── categories/
│   │   ├── locations/
│   │   ├── bookings/           # + booking.state.ts, pricing.service.ts, availability.service.ts
│   │   ├── payments/           # + gateways/payment-gateway.interface.ts, mock.gateway.ts
│   │   ├── reviews/
│   │   ├── maintenance/
│   │   ├── coupons/
│   │   └── admin/              # dashboard + reports (read-only aggregation queries)
│   └── routes.ts               # mounts all module routers under /api/v1
├── tests/
│   ├── unit/                   # pricing, state machine, availability, cancellation policy
│   └── integration/            # auth flow, booking flow, admin flow
├── docs/
│   ├── ER_DIAGRAM.md           # Mermaid ER diagram
│   └── API.md                  # short endpoint overview (Swagger is the full source)
├── .github/workflows/ci.yml
├── .env.example
├── .eslintrc / .prettierrc
├── docker-compose.yml
├── Dockerfile
├── package.json
├── tsconfig.json
└── README.md
```

**Layering rule per module:** `routes → controller → service → prisma`. Controllers handle HTTP only; services hold business logic; no Prisma calls inside controllers. Each module owns its Zod schemas.

## 9. Code Quality Requirements

- TypeScript `strict: true`; no `any` unless justified in a comment.
- One responsibility per file; functions short and well named; avoid deep nesting (use early returns).
- No magic numbers: tax rate, late-fee multiplier, min age, max rental days, refund windows live in `config/constants.ts`.
- All inputs validated with Zod; all errors go through the central error handler; never leak stack traces in production.
- Passwords hashed with bcrypt (cost 10+); refresh tokens stored hashed; never return `password_hash`.
- Add concise JSDoc to services' public methods and to the pricing/availability logic.
- Use transactions for: create booking, cancel + refund, complete + late fee, maintenance state changes.
- Conventional commit style for every commit (`feat:`, `fix:`, `test:`, `docs:`, `chore:`).

## 10. Seed Data (`prisma/seed.ts`)

- 1 admin: `admin@carrental.com` / `Admin@12345`
- 3 demo customers (complete profiles) — `customer1@example.com` / `Customer@12345`, etc.
- 3 locations, 5 categories, ~20 vehicles with images (placeholder URLs), a few coupons (`WELCOME10`, `WEEKEND15`)
- ~10 bookings across all statuses, with payments and 2–3 reviews so the dashboard has real numbers.

## 11. Testing Requirements

- **Unit:** pricing (days rounding, long-rental discount, coupon, tax), state machine transitions, overlap detection, cancellation refund tiers, late-fee calculation.
- **Integration (Supertest):** register → login → browse → quote → book → pay; double-booking rejected (including two concurrent requests); customer cannot access another customer's booking; admin confirm → pickup → return flow; role-based access (403 for customer on admin routes).
- Target: all tests green in CI, meaningful coverage on `bookings` and `pricing`.

## 12. Documentation Deliverables

1. **README.md** (portfolio-quality): project overview, feature list, tech stack, ER diagram (Mermaid), architecture/folder explanation, booking flow diagram, setup (Docker + local), env variables, seed credentials, how to run tests, API overview with link to Swagger, key design decisions (transaction-safe booking, pricing snapshot, state machine, payment gateway abstraction), future improvements.
2. **docs/ER_DIAGRAM.md** — Mermaid `erDiagram` of all 12 tables.
3. **Swagger** — every endpoint documented with request/response examples and auth requirement.
4. **Postman collection** exported to `docs/postman_collection.json` (optional but preferred).

## 13. Definition of Done

- [ ] `docker compose up` starts API + Postgres; migrations and seed run automatically
- [ ] All endpoints in section 7 implemented and visible in Swagger
- [ ] All business rules in section 6 implemented and covered by tests
- [ ] `npm run lint`, `npm run build`, `npm test` all pass
- [ ] No secrets committed; `.env.example` complete
- [ ] README is complete and the repo looks clean for recruiters

## 14. Out of Scope (do not build now)

Frontend, real payment gateways, email/SMS sending, file upload storage (store image URLs only), driver/chauffeur module, multi-currency, microservices, GraphQL, websockets, caching layers. Mention some of these under "Future Improvements" in the README instead.
