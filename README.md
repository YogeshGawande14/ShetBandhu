# AgroConnect

AgroConnect is a Java 21 / Spring Boot 3.2 full-stack local app for farmer product discovery, nearby Krishi Seva Kendras, mandi rates, profit estimates, and order processing.

## Included

- Layered Spring MVC controllers, services, Spring Data JPA repositories, PostgreSQL entities, Java record request/response DTOs, and MapStruct mapping.
- Stateless Spring Security JWT login and registration; BCrypt password hashing; role checks and resource ownership checks.
- Shop owners manage products; only SUPER_ADMIN accounts may create, update, or delete mandi rates. Listings are pageable, sortable, and searchable.
- The legacy coordinate-based nearby endpoint uses Haversine distance within 10 km or 25 km; the frontend finder searches verified Kendra addresses by area or PIN.
- Mandi net-profit estimates ranked across current crop rates after per-quintal transport cost.
- Transactional purchase orders with stock checks, optimistic version fields, voice audio URL/transcript fields, and controlled status changes.
- Flyway `V1__init_schema.sql`, OpenAPI/Swagger UI, structured API errors, profiles, and JUnit/Mockito service tests.

This local build covers the core marketplace, mandi rates, nearby shop discovery, profit ranking, and transactional ordering flows described in the AgroConnect brief.

## Requirements and configuration

- JDK 21 (the installed JDK 26 can also run the Java 21 target)
- IntelliJ IDEA with its bundled Maven
- MySQL Server 8.0+ for the default local profile

The default `mysql` profile connects to `jdbc:mysql://localhost:3306/agroconnect_db`. It creates the database if the MySQL account is permitted to create schemas, then Flyway creates the tables. In IntelliJ's Run Configuration, set active profile `mysql`, `DATABASE_USERNAME=root`, and `DATABASE_PASSWORD` to your local MySQL password. For live Government of India AGMARKNET prices, also set `DATA_GOV_IN_API_KEY` in the private Run Configuration environment; without it, the app uses saved admin-reported prices and then clearly labelled demo samples. `JWT_SECRET` must be at least 32 UTF-8 bytes; replace the development fallback before any shared or production use.

Profiles are `mysql` (default), `dev` and `prod` (PostgreSQL), and `local` (ephemeral H2 for a no-database demo). JPA schema generation is `validate`; Flyway owns schema changes and runs on startup.

## Run

From this directory:

```shell
node frontend/server.mjs
```

In IntelliJ, open `D:\UpdateAgree` as a Maven project, set the Spring Boot Run Configuration's active profile to `mysql`, and add `DATABASE_USERNAME=root` plus `DATABASE_PASSWORD` in the Run Configuration environment (keep the password out of source files). Run `AgroConnectApplication`; Spring Boot listens on `http://localhost:8081`. From the project folder run `node frontend/server.mjs`; the web app is at `http://localhost:5174` and its same-origin `/api` proxy forwards to port 8081. Swagger UI is at `http://localhost:8081/swagger-ui.html`.

The compact English-first frontend uses readable, restrained type, a Marathi/English switch, responsive product cards with photos, mandi rates and net-profit estimates, crop symptom guidance, nearby-shop search by area or PIN (no coordinate entry), guest checkout with a required delivery address for doorstep orders, and login/registration. The market page calls the server-side AGMARKNET adapter when `DATA_GOV_IN_API_KEY` is configured; saved database reports are used when the external feed is unavailable, and demo samples appear only when no reported rates match. Official records retain the source date and market. Voice audio is accepted as URL/transcript metadata; this build does not record audio. It does not include live chat, SMS notifications, or AI image diagnosis. Super-admins can review and approve registered Kendras through the admin API. The optional `local` H2 profile is for a quick demo only; its data is discarded when the backend stops.

The compact marketplace UI includes a Marathi/English switch and product images. Product photographs in the QA catalogue are illustrative remote images; replace them with licensed, shop-owned product photos before production deployment.

### Local Maharashtra QA catalogue

After starting the MySQL-profile app once so Flyway creates the schema, run `scripts/seed_maharashtra_qa_market.sql` against `agroconnect_db` using MySQL Workbench or the MySQL CLI. It adds 36 clearly named QA centres across Maharashtra and 10 QA products per centre (360 total), and is safe to rerun. These fixtures are marked verified so they appear in public search/catalogue, have synthetic contact numbers, and their owner accounts cannot log in. Do not run this QA seed against production data. To remove only these fixtures, first delete QA product rows, then QA centres, then the matching QA owner rows using their `QA` names/phone numbers.

## Main endpoints

| Method | Path | Access |
| --- | --- | --- |
| POST | `/api/auth/register`, `/api/auth/login` | Public |
| GET | `/api/products` | Public; `page`, `size`, `sort`, `q`, `category` supported |
| POST / PUT / DELETE | `/api/products` | Shop owner; owner checks apply to update/delete |
| GET | `/api/mandi-rates` | Public; pagination, sort, crop and district filters |
| GET | `/api/mandi-rates/live?city=Akola` | Public; optional server-side AGMARKNET lookup (requires `DATA_GOV_IN_API_KEY`) |
| POST / PUT / DELETE | `/api/mandi-rates` | Super admin only |
| GET | `/api/kendras/search?q=area-or-pin` | Public; searches verified Kendra addresses; PIN codes must be included in the registered address |
| GET | `/api/kendras/nearby?latitude=…&longitude=…` | Public compatibility endpoint; 10 km or 25 km |
| POST | `/api/kendras` | Shop owner; new Kendras require review |
| GET | `/api/admin/kendras/pending` | Super admin |
| PATCH | `/api/admin/kendras/{id}/verify` | Super admin |
| POST | `/api/profit/calculate` | Authenticated |
| POST | `/api/orders` | Farmer |
| GET | `/api/orders/{id}` | Order farmer or shop owner |
| PATCH | `/api/orders/{id}/status` | Farmer may cancel a pending order; shop owner confirms, dispatches, or delivers |

After login, pass the returned access token as `Authorization: Bearer <token>`. Registration returns a token immediately. Voice audio is represented by a client-provided URL plus transcript; the service does not upload or transcode media.

## Notes for deployment

Use a managed database, set a strong secret through a secret manager, terminate TLS at a trusted ingress, and configure rate limiting and operational monitoring at the deployment boundary. SUPER_ADMIN accounts can review pending Kendra registrations; create such an account through a controlled administrator process, not public registration. Kendra review here is a manual approval step; no external license, GST, or identity check is integrated. Mandi rate write access is limited to authenticated SUPER_ADMIN users. Audio URL fields are metadata only and should point to storage with access controls.

## Project layout

```text
src/main/java/com/agroconnect/
  api/              REST controllers, current-user helper, error handler, DTOs, mapper
  config/            JPA audit configuration
  domain/            JPA entities and enums
  repository/        Spring Data repositories
  security/          JWT service/filter, user lookup, security configuration
  service/           Business logic and application exceptions
src/main/resources/
  application.yml
  db/migration/V1__init_schema.sql
src/test/java/       JUnit 5 / Mockito service tests
```








## IntelliJ local run

1. Open `D:\UpdateAgree` in IntelliJ IDEA as a Maven project and set Project SDK to Java 21 (or a newer JDK capable of compiling with `--release 21`).
2. Start the local MySQL server and make sure `agroconnect_db` is reachable on port 3306.
3. Select the shared run configuration **AgroConnect API - MySQL**. In its Environment variables, set `DATABASE_PASSWORD` to the local MySQL password. To create the first Super Admin, set `ADMIN_PHONE`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` (at least 12 characters). Set `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`, and `MAIL_FROM` for an SMTP provider. Keep all account and SMTP secrets in IntelliJ's private run configuration, not in source files.
4. Run the Spring Boot configuration. Flyway applies pending MySQL migrations, including V7 account controls; the API listens at `http://localhost:8081`.
5. Start the frontend from IntelliJ's terminal with `node frontend/server.mjs`. Open `http://localhost:5174`.
6. On the sign-in screen, choose **Super Admin sign-in**. The bootstrap account uses `ADMIN_PHONE` and `ADMIN_PASSWORD`; `ADMIN_EMAIL` is the verified recovery address.

New accounts require an email address and verify it with a four-digit code before sign-in. Password recovery is shared by customer, owner, and Super Admin logins: request with email only, verify the code within five minutes, then set a new 12+ character password. Codes are hashed, limited to five attempts, and sending is throttled. Existing accounts without an email can sign in and use the account menu's **Set / verify recovery email** action. Email delivery requires SMTP environment settings; recovery responses do not disclose whether an account exists.

The dedicated Admin panel provides centre approval/rejection, mandi-rate control, and privacy-safe account search with suspend/restore. The **Super Admins** panel lets an active Super Admin add a backup admin and reset another admin's phone/password after confirming their own password; credential changes revoke old sessions. If every admin is locked out on a local setup, configure a new, unused `ADMIN_PHONE`, `ADMIN_EMAIL` and 12+ character `ADMIN_PASSWORD` in IntelliJ's private MySQL run configuration and restart the backend. The bootstrap creates a replacement admin without deleting existing account or business data.
