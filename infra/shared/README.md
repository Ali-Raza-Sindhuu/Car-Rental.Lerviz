# Shared MySQL and phpMyAdmin

This is an independent **local development** Docker stack. One MySQL server hosts multiple project databases. Each project gets its own database and user; there is no need for another MySQL host port.

| Use | Address |
| --- | --- |
| phpMyAdmin in your browser | http://localhost:8080 |
| MySQL from a host application | 127.0.0.1:3306 |
| MySQL from a container on `shared-dev-data` | shared-mysql:3306 |
| Initial project database / user | lerviz / lerviz_app |
| Persistent Docker volume | shared-dev-mysql-data |

phpMyAdmin is the browser administration tool; Node.js connects directly to MySQL. The browser UI uses port 8080, while **all databases share MySQL port 3306**. Ports are bound to the local computer.

## Start

From the repository root in PowerShell, with Docker Desktop running:

```powershell
node ./infra/shared/setup.mjs
docker compose --env-file ./infra/shared/.env -f ./infra/shared/compose.yml config --quiet
docker compose --env-file ./infra/shared/.env -f ./infra/shared/compose.yml up -d --wait
docker compose --env-file ./infra/shared/.env -f ./infra/shared/compose.yml ps
```

Open http://localhost:8080. For all-database administration, log in as `root` using `MYSQL_ROOT_PASSWORD` from **infra/shared/.env**. For only this project, use `lerviz_app` and `LERVIZ_DB_PASSWORD`. Passwords are generated locally, never embedded in this guide. The root login is for local administration, never application connections.

`setup.mjs` preserves an existing `.env`. Docker initializes the database and users only on an empty data volume. Editing the environment file later **does not change existing MySQL passwords**; change the account password through MySQL and update the local file together.

## Connect this or another Docker project

The following is a fragment for the **future Node.js application Compose file**, not a replacement for the current Python application:

```yaml
services:
  api:
    # build / command / other app settings go here
    environment:
      DB_HOST: shared-mysql
      DB_PORT: 3306
      DB_NAME: lerviz
      DB_USER: lerviz_app
      DB_PASSWORD: ${DB_PASSWORD:?Set this in the project environment}
    networks:
      - default
      - shared-data

networks:
  shared-data:
    external: true
    name: shared-dev-data
```

Start the shared stack first. Cross-project `depends_on` is unavailable; the application needs a bounded connection retry and a readiness check. Containers use `shared-mysql`, not `localhost`. A program running directly on Windows uses `127.0.0.1`. Copy only the project's password into its ignored environment file. If the selected ORM needs `DATABASE_URL`, construct `mysql://lerviz_app:<URL-encoded-password>@shared-mysql:3306/lerviz` on the server.

## Add another project without another port

Log in to phpMyAdmin as the local administrator. In **User accounts → Add user account**, give the project a unique username and a strong generated password. Use host `%` for Docker clients, select **Create database with same name and grant all privileges**, and leave global privileges unchecked. For example, a user/database called `next_project` can use the same `shared-mysql:3306` address.

This grants schema management privileges to that project's development account. For production, separate the migration account from the application account; the latter normally receives only required data privileges. Verify that the new user can access its own database but cannot read `lerviz`.

## Stop and preserve data

```powershell
docker compose --env-file ./infra/shared/.env -f ./infra/shared/compose.yml stop
```

Stopping a project should not stop this shared stack. Do not remove `shared-dev-mysql-data` or run a volume-removal command: it contains every project database. Named volumes survive normal container replacement but are not backups. Export individual databases through phpMyAdmin and test imports into a separate restore database before upgrades. Large databases need a scheduled `mysqldump`/restore process outside the browser.

If 3306 or 8080 is already occupied, change the corresponding port in the shared `.env` before startup; all host applications should use the single selected MySQL port. Container connections remain `shared-mysql:3306`.

The root repository `docker-compose.yml` remains the **legacy Python/PostgreSQL application**. It does not connect to this MySQL stack. The backend migration and new full-application Compose stack are specified in [the project report](../../docs/PROJECT_REPORT.md).

Production should use a private database network, managed secrets, tested backups, and restricted administration access. Sharing a development database server does not require sharing one production failure boundary.

References: [phpMyAdmin image configuration](https://hub.docker.com/_/phpmyadmin), [Docker Compose networking](https://docs.docker.com/compose/how-tos/networking/).
