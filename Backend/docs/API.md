# API overview

Base path: `/api/v1`. All requests and responses use JSON. Interactive documentation, including request examples and bearer token support, is served at `/api/docs`.

| Area | Public or customer endpoints | Admin endpoints |
| --- | --- | --- |
| Auth | `/auth/register`, `/auth/login`, `/auth/refresh`, `/auth/logout`, `/auth/me`, `/auth/change-password` | Seeded admin signs in with `/auth/login` |
| Catalog | `/vehicles`, `/vehicles/:id`, `/vehicles/:id/availability`, `/vehicles/:id/reviews`, `/categories`, `/locations` | `/admin/vehicles`, `/admin/categories`, `/admin/locations` |
| Rentals | `/bookings/quote`, `/bookings`, `/bookings/my`, `/bookings/:id`, `/bookings/:id/cancel` | `/admin/bookings` and its confirm, reject, pickup, and return actions |
| Profile and feedback | `/customers/me/profile`, `/bookings/:id/review` | `/admin/customers`, `/admin/reviews` |
| Payments | `/bookings/:id/payments` | `/admin/payments` |
| Operations | — | `/admin/maintenance`, `/admin/coupons`, `/admin/dashboard`, `/admin/reports/revenue`, `/admin/reports/utilization` |

Use the access token from login as `Authorization: Bearer <token>`. List endpoints accept `page` and `limit`, plus documented filters. A rental quote checks the selected vehicle and dates without creating a booking. Creating a booking requires a completed customer profile and an eligible license.
