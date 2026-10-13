# Backend plan (documentation only)

Status: **not built, not connected.** The frontend is fully static. This document describes what the backend should do so it can be built later without changing the home page design.

Suggested stack, to match the rest of the project: Node.js + Express, MySQL, run locally without Docker (MySQL installed on the machine).

## 1. What the home page needs from a backend

| Home section | Data it needs | Today |
|---|---|---|
| Hero | headline, stats (HP, range), customer count | `src/data/home.js` |
| About | spec cards (top speed, torque) | `src/data/home.js` |
| Inventory | list of featured cars with image, name, short text | `src/data/home.js` |
| Offer | 4 feature blurbs, 3 spec call-outs | `src/data/home.js` |
| Testimonials | reviews (name, role, text, rating, image), stats | `src/data/home.js` |
| Brands | brand list + "more brands" count | `src/data/home.js` |
| FAQ | questions and answers | `src/data/home.js` |
| Newsletter (footer) | **write**: save an email address | does nothing |
| Contact us / Get started | **write**: save a lead or test-drive request | does nothing |

Reads can stay static until content needs editing without a deploy. The two writes (newsletter, leads) are the first real backend features.

## 2. Data model (MySQL)

```
brands            id, name, slug, logo_url, sort_order, is_active
cars              id, brand_id → brands.id, name, slug, year, price, horsepower,
                  top_speed_kmh, torque_nm, displacement_cc, range_mi,
                  short_description, status (available|reserved|sold),
                  is_featured, featured_order, created_at, updated_at
car_images        id, car_id → cars.id, url, alt, sort_order, is_primary
testimonials      id, author_name, author_role, body, rating (1.0–5.0),
                  image_url, is_published, sort_order, created_at
faqs              id, question, answer, sort_order, is_published
site_stats        id, key (unique), value, label        -- e.g. happy_customers = 95K+
newsletter_subs   id, email (unique), status (active|unsubscribed), created_at
leads             id, name, email, phone, message, type (contact|test_drive),
                  car_id → cars.id (nullable), status (new|contacted|closed), created_at
```

Rules:
- Emails are stored lower-cased and unique.
- Never hard-delete cars that have leads; set `status` instead.
- Index `cars(is_featured, featured_order)`, `cars(slug)`, `leads(status, created_at)`.

## 3. API contract (REST, JSON)

Base path: `/api/v1`. All responses use `{ "data": ..., "error": null }` or `{ "data": null, "error": { "code", "message", "fields?" } }`.

### Public (no auth)

| Method | Path | Purpose | Notes |
|---|---|---|---|
| GET | `/home` | Everything the home page needs in one call | Combines featured cars, brands, testimonials, FAQs, stats |
| GET | `/cars` | List cars | Query: `brand`, `status`, `featured`, `page`, `limit` |
| GET | `/cars/:slug` | One car with images | 404 if not found |
| GET | `/brands` | List brands | |
| POST | `/newsletter` | Subscribe | Body: `{ email }` |
| POST | `/leads` | Contact / test-drive request | Body: `{ name, email, phone?, message?, type, carId? }` |

### Admin (later, requires auth)

CRUD for `cars`, `car_images`, `brands`, `testimonials`, `faqs`, `site_stats`; list and update status for `leads`; list and export `newsletter_subs`.

### Error codes

`VALIDATION_ERROR` (400), `NOT_FOUND` (404), `RATE_LIMITED` (429), `ALREADY_SUBSCRIBED` (409, treat as success in the UI), `SERVER_ERROR` (500).

### Example: subscribe

Request `POST /api/v1/newsletter` with `{ "email": "name@example.com" }`.
Success `201` with `{ "data": { "subscribed": true }, "error": null }`.

## 4. Validation and security

- Validate every body with a schema validator (for example Zod or Joi); reject unknown fields.
- Email: valid format, max 254 characters. Name: 1–100. Message: max 2000.
- Rate-limit the two public POST endpoints (suggested: 5 requests per minute per IP).
- Add a honeypot field to both forms to reduce spam.
- CORS: allow only the frontend origin (`http://localhost:5173` in development).
- Use parameterized queries only; never build SQL from input.
- Keep secrets in `.env`; never commit it. Provide `.env.example`.
- Admin auth (when added): hashed passwords (argon2 or bcrypt), short-lived access token, role check on every admin route.

## 5. Suggested folder structure

```
backend/
  src/
    server.js            start the server
    app.js               express setup, middleware, route mounting
    config/env.js        read and validate environment variables
    db/pool.js           MySQL connection pool
    db/migrations/       numbered .sql files
    db/seed.js           sample data (the content currently in home.js)
    routes/              home, cars, brands, newsletter, leads
    controllers/         request → response
    services/            business logic and queries
    validators/          request schemas
    middleware/          error handler, rate limit, auth (later)
  .env.example
  package.json
```

## 6. Environment variables

```
PORT=4000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=
DB_PASSWORD=
DB_NAME=lerviz
CORS_ORIGIN=http://localhost:5173
```

## 7. How the frontend will connect (when ready)

1. Add `VITE_API_URL=http://localhost:4000/api/v1` to the frontend `.env`.
2. Add `src/lib/api.js` with a small `fetch` wrapper that reads `VITE_API_URL`.
3. Home page: load `GET /home` and fall back to `src/data/home.js` if the request fails, so the page never renders empty.
4. Newsletter form (`Footer.jsx`): `POST /newsletter`, show success or error text under the input.
5. Contact button: open a small dialog (shadcn `dialog`) and `POST /leads`.

## 8. Build phases

1. **Foundation:** project setup, env loading, MySQL connection, health check `GET /health`.
2. **Schema and seed:** migrations for all tables, seed script from the current static content.
3. **Read API:** `/home`, `/cars`, `/cars/:slug`, `/brands`.
4. **Write API:** `/newsletter`, `/leads` with validation, rate limiting, honeypot.
5. **Connect frontend:** `api.js`, home page fetch with fallback, form submissions.
6. **Admin:** auth, CRUD endpoints, image upload.
7. **Hardening:** tests for validation and endpoints, logging, backups, deployment.

## 9. Out of scope for now

Online payments, user accounts for customers, booking availability calendars, real-time features. Add them as separate phases when needed.
