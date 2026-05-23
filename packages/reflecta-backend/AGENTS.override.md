# AGENTS.override.md

## Scope

This package contains the Reflecta Node.js / TypeScript / Express backend.

## Architecture

- Entrypoint: `src/app.ts` configures Express, CORS, Helmet, Morgan, JSON parsing, cookie parsing, `/api` middleware, 404 handling, server startup, and a startup DB connection check.
- `src/middleware/index.ts` mounts API routers under `/api`; `src/middleware/api/index.ts` aggregates route modules.
- Route files in `src/middleware/api/routes/*` own Express validation, rate limiting, authentication middleware, request body/query typing, and HTTP status responses.
- Controllers in `src/controllers/*` hold workflow/business logic and model/service orchestration.
- Models in `src/models/*` are thin SQL data access classes over the shared `mysql2/promise` pool from `src/db.ts`.
- Services in `src/services/*` wrap external providers: OpenAI, Google Maps, and SendGrid.
- Shared utilities live in `src/utils/*`; errors should flow through `CustomError` and `errorResponseHandler`.
- Path aliases are configured in `tsconfig.json` (`@controllers`, `@middleware`, `@models`, `@services`, `@utils`, `@types`, `@constants`).

## Working preferences

- Preserve existing backend patterns before introducing new ones.
- Infer routing, middleware, controller, service, validation, error handling, and logging conventions from nearby code.
- Keep route handlers and service flows direct unless abstraction materially improves reuse, testability, or understanding.
- Prefer shared/imported/derived types over redefining backend-local copies of contracts used by the UI.
- Prefer `type` aliases over `interface` for new TypeScript shapes. Use `interface` only when declaration merging, extending an existing interface, or an established local pattern makes it the clearer choice.
- Keep request and response boundaries explicit and typed.
- Reuse existing config and environment-loading utilities where they exist.
- Follow the existing flow for new endpoints: route constants/validation and middleware in a route file, orchestration in a controller, SQL in a model, then add the route module to `middleware/api/index.ts`.
- Keep SQL parameterized via `pool.query(query, values)`. If a template literal is unavoidable, ensure interpolated fragments are hard-coded choices, as in existing keyword search code.
- Preserve the existing snake_case database schema to camelCase API response mapping in controllers.

## Operational caution

- Be conservative around deployment-adjacent behavior.
- Do not change PM2 process names, startup commands, ports, health checks, environment-variable contracts, or build output paths unless the task requires it.
- If a task genuinely requires changing runtime or deployment behavior, explain the impact clearly.
- Do not run live Lightsail, AWS, SSH, database, or production-changing commands unless explicitly approved.
- If a schema change or migration is needed, call it out clearly rather than silently forcing it through.
- Runtime configuration comes from `.env`, nodemon's `-r dotenv/config`, and the PM2 ecosystem file. Avoid printing secret values.
- Important env families include server/app URLs, MySQL credentials, cookie/JWT settings, rate limiter settings, salt rounds, SendGrid settings, OpenAI prompts/model/key, and Google Maps settings.
- The PM2 ecosystem file expects process name `reflecta-backend`, `SERVER_PORT`, and script `/var/www/api/src/app.js`.

## Type and contract rules

- If a backend response shape is consumed by `reflecta-ui`, keep the producer and consumer aligned.
- Avoid parallel copies of request/response shapes when a shared or exported type is the correct source of truth.
- Prefer explicit validation at the API boundary when accepting external input.
- Do not silently broaden or narrow auth/session behavior.
- Auth uses a split JWT: the cookie stores header+payload and the client sends the signature as a bearer token. The backend recombines both pieces in `middleware/Authentication.ts`.
- Authenticated routes read `response.locals.authenticationTokenPayload`; preserve that local shape when refactoring auth.
- Journal entry API responses are camelCase (`entryID`, `occurredAt`, `updatedAt`, etc.) while database rows are snake_case.
- Journal entry creates/updates may call OpenAI analysis depending on body word count and keyword state; avoid adding unnecessary provider calls on hot paths.

## Verification

Use best judgment, but for backend-local work prefer:
- relevant lint and typecheck,
- targeted backend tests when available,
- API contract checks against impacted UI consumers when response shapes change,
- explicit callouts for contract, migration, deploy, or runtime risk.

Useful commands:
- `npm run lint -w reflecta-backend`
- `npm run build -w reflecta-backend`
- `npm start -w reflecta-backend`
