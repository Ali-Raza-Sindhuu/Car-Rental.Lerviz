# elcarro frontend

React 19 and Vite frontend for the [car rental API](../Backend/README.md). The existing marketing home page remains at `/`; the functional rental app starts at `/app`.

## Run locally

Start the backend on `http://localhost:8000` with its PostgreSQL database and seed data. Then, from `Frontend`:

```powershell
npm ci
npm run dev
```

Open `http://localhost:5173/app`. Vite proxies `/api` to port 8000, so no frontend environment file is required for local development. For a separately hosted backend, set `VITE_API_URL` to its full base URL ending in `/api/v1` (see `.env.example`). Run `npm run build` for a production bundle.

## Available flows

- Public: fleet search with category, location, price, seats, fuel, transmission, date availability, and sorting; vehicle details, booked dates, reviews, and rental quote.
- Customer: register, sign in, complete profile, change password, book, pay with the mock gateway, inspect payment history, cancel, and review completed rentals.
- Admin: dashboard, bookings lifecycle, customer status, payment and review lists, reports, and create/update/delete screens for vehicles, categories, locations, maintenance, and coupons. Vehicle images can be added by URL.

Demo credentials come from the backend seed: `admin@carrental.com` / `Admin@12345` and `customer1@example.com` / `Customer@12345`. The frontend keeps the demo session in browser session storage and rotates refresh tokens through the backend. No real payment credentials are requested.

The app uses the backend as its data source. The marketing home page still contains illustrative content and can be redesigned independently.
