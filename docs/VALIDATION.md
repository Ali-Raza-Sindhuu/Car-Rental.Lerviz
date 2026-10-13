# Validation record — 13 October 2026

## Shared development database stack

| Check | Result |
| --- | --- |
| Docker client/server connectivity | Passed; both reported 29.7.2 |
| Shared Compose configuration validation | Passed with `config --quiet` |
| Image startup | `mysql:8.4` and `phpmyadmin:5.2.3-apache` started successfully |
| MySQL readiness | Container healthy; health check authenticates as the project user and executes `SELECT 1` against `lerviz` |
| MySQL application connection | Passed; `SELECT DATABASE(), VERSION()` returned `lerviz`, `8.4.11` |
| Project privileges | `SHOW GRANTS` returned global `USAGE` and `ALL PRIVILEGES` on `lerviz` only; no global application privileges |
| MySQL published endpoint | `127.0.0.1:3306` |
| phpMyAdmin published endpoint | `127.0.0.1:8080`; HTTP request returned 200 |
| Local credential generation | Created `infra/shared/.env`; values were not displayed |
| Repeated setup | Preserved existing `.env` and did not rotate credentials |
| Credential Git exclusion | `git check-ignore infra/shared/.env` confirmed ignored |
| Setup JavaScript syntax | `node --check infra/shared/setup.mjs` passed |
| Existing tracked-file whitespace | `git diff --check` passed |

Containers were left running. MySQL storage is configured as the named volume `shared-dev-mysql-data`; a data-loss/recovery drill was not performed. Another project's database was not created solely for testing. Schema-scoped grants were inspected, but full cross-project isolation and cross-stack API connectivity remain acceptance checks when the next application is connected.

phpMyAdmin was checked at the HTTP endpoint; an interactive browser login was not exercised. Credentials and login instructions are in [the shared-stack guide](../infra/shared/README.md). The `lerviz` database has no application business tables yet; the ERD is a proposed model for the Node.js migration.

An initial inline SQL verification command encountered a PowerShell/native-command quoting error. The corrected verification sent SQL via standard input and succeeded. No database changes were made by either verification query.

## Existing application

| Check | Result |
| --- | --- |
| Current frontend build | Blocked: local `vite` executable missing (`npm run build` exited 1) |
| Legacy Compose syntax | Validation completed; application containers not launched for this audit |
| Backend business functionality | No rental domain models, migrations, authentication, booking or payments found in source |
| Production pipeline | Missing referenced production Dockerfiles and production Compose file identified by source inspection |
| Existing frontend changes | Preserved; no requested rebuild was represented as implemented |

Not performed: clean dependency reinstall, Python dependency resolution, existing backend runtime test, full website/browser visual QA, Lighthouse, provider sandbox payment, backup restore, application load testing, or Mermaid renderer validation. These are not reported as passing. Diagrams are supplied as editable Mermaid source embedded in Markdown.
