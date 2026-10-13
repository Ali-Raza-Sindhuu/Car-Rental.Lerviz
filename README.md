# Lerviz car rental

The current application is a React showroom prototype with a Python/FastAPI backend scaffold. The planned completion architecture is Node.js/TypeScript + MySQL with Docker. The application migration itself has not yet been implemented.

- [Project audit, specifications and completion plan](docs/PROJECT_REPORT.md)
- [Proposed MySQL ERD and booking/payment/authentication flows](docs/DATABASE_AND_FLOWS.md)
- [Shared MySQL and phpMyAdmin setup](infra/shared/README.md)
- [Blank integration-key template](docs/integrations.env.example)
- [Validation results and limitations](docs/VALIDATION.md)

## Shared local database

Run from the repository root with Node.js and Docker Desktop available:

```powershell
node ./infra/shared/setup.mjs
docker compose --env-file ./infra/shared/.env -f ./infra/shared/compose.yml up -d --wait
```

phpMyAdmin: **http://localhost:8080**. MySQL: **127.0.0.1:3306**. The initial database is `lerviz`, with application user `lerviz_app`. Open the ignored `infra/shared/.env` locally for the generated passwords. All future project databases can share this same MySQL port with separate users.

The root `docker-compose.yml` still describes the legacy Python/PostgreSQL application. The shared stack above runs independently and does not migrate that application automatically.
