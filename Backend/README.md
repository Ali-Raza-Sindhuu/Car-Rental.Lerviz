# Lerviz API — first backend milestone

Node.js 24, NestJS 11, strict TypeScript, Prisma 6 and MySQL 8.4. The Node API implements the public fleet catalog. The old `app/` Python scaffold and `Dockerfile.dev` remain available through the legacy root Compose file.

## Run locally

Start the [shared database](../infra/shared/README.md), then from `Backend`:

```powershell
Copy-Item .env.example .env
# Edit .env: set DATABASE_URL with the URL-encoded lerviz_app password.
npm.cmd ci
npm.cmd run db:generate
npm.cmd run db:migrate
npm.cmd run db:seed
npm.cmd run dev
```

Seeding is optional, requires `NODE_ENV=development`, and preserves existing records. The single demo vehicle, branch and USD rate are illustrative data, not business policy. Migrations run explicitly; API startup never changes the schema. `db:migrate` uses committed SQL and does not require a shadow database.

For Docker, use `shared-mysql` instead of `127.0.0.1` in `Backend/.env`. From the repository root:

```powershell
docker compose -f compose.node.yml build
docker compose -f compose.node.yml run --rm backend npm run db:migrate
docker compose -f compose.node.yml run --rm backend npm run db:seed
docker compose -f compose.node.yml up -d --wait
```

Start the shared database first. The Node stack uses port 8000; stop the legacy API if that port is occupied. Rebuild after source changes. `Backend/Dockerfile` builds a non-root runtime image; apply migrations separately before deploying it.

## HTTP contract

| Method / path | Response |
| --- | --- |
| `GET /health/live` | Process liveness |
| `GET /health/ready` | Database and catalog table readiness; sanitized 503 on failure |
| `GET /api/v1/branches` | Active branches |
| `GET /api/v1/categories` | Catalog categories |
| `GET /api/v1/vehicles` | `{ data, pagination: { page, limit, total } }` |
| `GET /api/v1/vehicles/:slug` | Public vehicle details or 404 |

Fleet filters: `branch` and `category` slugs, `transmission` (`AUTOMATIC`, `MANUAL`), `fuelType` (`PETROL`, `DIESEL`, `HYBRID`, `ELECTRIC`), minimum `seats`, `page` (default 1, maximum 10000), `limit` (default 20, maximum 100). Unknown or invalid query parameters return 400. Ordering is make, model, then ID. Only active vehicles at active branches are public. VINs and registration numbers are never selected for public responses.

`baseDailyMinor` is an exact decimal **string** of currency minor units, avoiding JavaScript integer precision loss. It is a base catalog rate, not a booking quote. Date availability, taxes, deposits, authentication, staff mutations, bookings and payments are not implemented in this milestone. Unknown date filters are rejected rather than implying availability.

## Validation

```powershell
npm.cmd test
```

HTTP/config tests use an injected database double. The MySQL integration test is skipped unless `TEST_DATABASE_URL` is set. Run it against the disposable test server (port 3307, no shared volume):

```powershell
docker compose -f compose.test.yml up -d --wait
$env:DATABASE_URL='mysql://lerviz_test:ephemeral-test-only@127.0.0.1:3307/lerviz_api_test'
$env:TEST_DATABASE_URL=$env:DATABASE_URL
npm.cmd run db:migrate
npm.cmd test
docker compose -f compose.test.yml down
Remove-Item Env:DATABASE_URL, Env:TEST_DATABASE_URL
```

The test refuses database names other than `lerviz_api_test`, creates uniquely named fixtures, and removes only those fixtures. The test server's data is ephemeral.

Implementation references: [NestJS validation](https://docs.nestjs.com/techniques/validation), [Prisma 6 MySQL connector](https://www.prisma.io/docs/orm/v6/overview/databases/mysql).

The package override pins Prisma's `deepmerge-ts` tooling dependency to 8.0.0 to address [GHSA-ggr8-5vv4-36mx](https://github.com/advisories/GHSA-ggr8-5vv4-36mx). Recheck the override when upgrading Prisma. Client generation, migration deployment and integration tests are verified with this override.

## Verified milestone

Validated on 13 October 2026: TypeScript compilation; all seven HTTP/configuration/MySQL tests; initial migration on disposable MySQL 8.4; demo seed run twice; dependency audit with zero reported vulnerabilities; production Docker build and non-root runtime checks for readiness and fleet responses. The test container was removed afterward. Shared development data was not modified.

The dedicated `backend.yml` CI workflow repeats migration, test, image build and runtime checks. The React frontend now consumes these APIs and `frontend.yml` adds browser and real-MySQL end-to-end checks. The original deployment workflow is manual-only and still needs production assets before deployment. See [manual review](../docs/MANUAL_REVIEW.md).
