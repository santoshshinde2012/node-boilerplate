<h1 align="center"><a href="https://blog.santoshshinde.com/skeleton-for-node-js-apps-written-in-typescript-444fa1695b30" target="_blank">Node-Typescript-Boilerplate</a></h1>

<p align="center">Production-ready skeleton for Node.js + TypeScript services with hardened security defaults.</p>

<p align="center">
  <a href="https://sonarcloud.io/project/overview?id=santoshshinde2012_node-boilerplate">
     <img src="https://sonarcloud.io/api/project_badges/measure?project=santoshshinde2012_node-boilerplate&metric=alert_status" alt="Quality Gate Status" />
  </a>
  <a href="https://github.com/santoshshinde2012/node-boilerplate/actions/workflows/ci.yml" target="_blank">
     <img src="https://github.com/santoshshinde2012/node-boilerplate/actions/workflows/ci.yml/badge.svg?branch=master" alt="Github action workflow status" />
  </a>
  <a href="https://codeclimate.com/github/santoshshinde2012/node-boilerplate/maintainability" target="_blank">
    <img src="https://api.codeclimate.com/v1/badges/ad13a11cffa2421a8220/maintainability" alt="maintainability" />
  </a>
  <a href="https://codeclimate.com/github/santoshshinde2012/node-boilerplate/test_coverage" target="_blank">
    <img src="https://api.codeclimate.com/v1/badges/ad13a11cffa2421a8220/test_coverage" alt="test_coverage" />
  </a>
   <a href="https://snyk.io/test/github/santoshshinde2012/node-boilerplate" target="_blank">
     <img src="https://snyk.io/test/github/santoshshinde2012/node-boilerplate/badge.svg?style=flat-square" alt="" />
  </a>
  <a href="https://libraries.io/github/santoshshinde2012/node-boilerplate" target="_blank">
     <img src="https://img.shields.io/librariesio/github/santoshshinde2012/node-boilerplate" alt="" />
  </a>
</p>

![Introductions](https://i.ibb.co/VHTZKB6/introductions.png)

## Purpose

A batteries-included starting point for production Node.js services. Out of the box you get a hardened Express setup, structured JSON logging, encrypted-response support, Docker hardening, request tracing, graceful shutdown and a CI pipeline wired for SonarCloud / Snyk / CodeQL / njsscan / Code Climate.

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=santoshshinde2012/node-boilerplate&type=Date)](https://star-history.com/#santoshshinde2012/node-boilerplate&Date)

## Highlights

- **Quick start** – TypeScript, ESLint flat config, Prettier, Husky, Jest with coverage.
- **Hardened security defaults**
    - Helmet (HSTS in prod), `x-powered-by` disabled, `x-request-id` propagation.
    - Allow-list driven CORS via `CORS_ORIGINS`.
    - Global rate limiter (`express-rate-limit`, draft-7 standard headers).
    - Body size capped at 1 MB by default (configurable via `BODY_LIMIT`).
    - PBKDF2-HMAC-SHA512 key derivation at OWASP-2023 strength (600 000 iters) + AES-256-GCM with per-message salt + IV embedded in the ciphertext.
    - Production-mode filtering of system endpoints (no `process.env`, network interfaces or OS user info on the wire).
    - Centralized config validation – the app refuses to boot with bad/missing values.
- **Production runtime**
    - Multi-stage Dockerfile on `node:22-bookworm-slim`, runs as non-root with `tini` as PID 1, healthcheck baked in.
    - `docker-compose.yml` with `read_only`, `cap_drop: ALL`, `no-new-privileges` and resource limits.
    - Graceful shutdown on `SIGINT` / `SIGTERM` with a 10 s drain window.
    - Structured Winston logging (separate `error.log`, JSON format, level via `LOG_LEVEL`).
    - HTTP server timeouts (`keepAlive`, `headersTimeout`, `requestTimeout`) tuned for behind-LB deployments.
- **Observability**
    - `/healthz` and `/readyz` liveness/readiness endpoints (skipped from rate-limit).
    - Per-request id middleware (echoes/forwards `x-request-id`, falls back to `crypto.randomUUID()`).
    - Access log with status, duration, IP, user agent and request id.
- **Continuous integration**
    - GitHub Actions matrix (Node 20.x / 22.x).
    - SonarCloud, Snyk monitor, CodeQL, njsscan SARIF upload, Code Climate.
- **Documentation**
    - Swagger UI mounted at `/docs` in non-production.
    - Postman collection in [`wiki/postman`](wiki/postman/node-boilerplate.postman_collection.json).

## Core Runtime Modules

| Package | Purpose |
| --- | --- |
| `express` | HTTP framework |
| `helmet` | Secure HTTP headers |
| `cors` | Cross-origin allow-list |
| `compression` | gzip / brotli compression |
| `express-rate-limit` | Per-IP rate limiting |
| `winston` | Structured JSON logging |
| `dotenv` | `.env` loading |
| `swagger-ui-express` | API docs in non-prod |
| `http-status-codes` | Symbolic HTTP status codes |

## Requirements

- Node.js **>= 20.x** (tested on 20 and 22)
- npm >= 10

## Start the application in development mode

```bash
git clone https://github.com/santoshshinde2012/node-boilerplate.git
cd node-boilerplate
cp .env.example .env
npm install
npm run dev
```

## Start the application in production mode

```bash
npm ci --omit=dev   # or `npm install` for full local dev
npm run build
NODE_ENV=production npm run start
```

Always populate `.env` from `.env.example` before going to production. The boot will fail-fast if `APPLY_ENCRYPTION=true` is set without a valid `SECRET_KEY` (>= 16 chars).

## Run inside Docker

```bash
docker compose up --build
# or
docker build -t node-boilerplate .
docker run --rm -p 8080:8080 --env-file .env node-boilerplate
```

The runtime image is multi-stage, runs as user `nodeuser` (`uid 1001`), drops all Linux capabilities and exposes a `HEALTHCHECK` against `/healthz`.

## Configuration

All configuration lives in environment variables (see [`.env.example`](.env.example)).

| Variable | Default | Notes |
| --- | --- | --- |
| `NODE_ENV` | `development` | One of `development`, `test`, `staging`, `production`. Legacy `prod` aliased to `production`. |
| `PORT` | `8080` | TCP port. |
| `LOG_LEVEL` | `info` (prod) / `debug` | Winston level. |
| `APPLY_ENCRYPTION` | `false` | Encrypt response payloads on the wire. |
| `SECRET_KEY` | _none_ | Required when encryption is enabled. Min 16 chars. |
| `ENCRYPTION_SALT` | _none_ | Optional fixed salt; otherwise a per-message salt is embedded in the ciphertext. |
| `CORS_ORIGINS` | _empty_ | Comma-separated allow-list. Use `*` for any (dev only). |
| `BODY_LIMIT` | `1mb` | Max JSON / urlencoded body size. |
| `RATE_LIMIT_WINDOW_MS` | `60000` | Rate-limiter window. |
| `RATE_LIMIT_MAX` | `120` | Max requests per IP per window. |
| `TRUST_PROXY` | `false` | Set to `true` when running behind a trusted reverse proxy (nginx/ELB/Cloudflare). |
| `EXPOSE_SYSTEM_ROUTES` | `true` (non-prod) | Disable diagnostic `/v1/system/*` endpoints. |

## Project structure

| Path | Description |
| --- | --- |
| `src/App.ts` | Express app composition (middleware + routes + error handler). |
| `src/server.ts` | HTTP server bootstrap and graceful shutdown. |
| `src/config/` | Centralized, validated environment config. |
| `src/abstractions/` | Shared abstract classes and interfaces (e.g. `ApiError`). |
| `src/components/` | Feature controllers grouped by domain. |
| `src/lib/` | Reusable utilities (logger, crypto). |
| `src/middleware/` | Cross-cutting middleware (request id, request logger, error handler). |
| `src/types/` | Shared TypeScript types. |
| `src/utils/` | Pure helper functions. |
| `tests/unit-tests/` | Jest unit tests. |
| `tests/integration-tests/` | Supertest integration tests. |
| `wiki/` | Diagrams, instructions, Postman collection. |
| `Dockerfile` / `docker-compose.yml` | Hardened container build. |

## Workflow

![Workflow](https://github.com/santoshshinde2012/node-boilerplate/blob/master/wiki/boilerplate-components.jpg?raw=true)

## Default routes

| Method | Path | Notes |
| --- | --- | --- |
| `GET` | `/` | Liveness ping (returns `{ "message": "base path" }`). |
| `GET` | `/healthz` | Health probe (uptime + timestamp). |
| `GET` | `/readyz` | Readiness probe. |
| `GET` | `/web` | Demo of header-based auth (requires `x-internal-authorization` and `Authorization`). |
| `GET` | `/docs` | Swagger UI (non-production only). |
| `GET` | `/v1/system/info` | System info (filtered in production). |
| `GET` | `/v1/system/time` | Server time. |
| `GET` | `/v1/system/usage` | Process + system memory and CPU usage. |
| `GET` | `/v1/system/process` | Process info (filtered in production). |
| `GET` | `/v1/system/error` | Sample error path. |

Every response includes the `x-request-id` header (echoed if the client supplied one and it matches `^[A-Za-z0-9._-]{1,128}$`, otherwise a freshly minted UUID).

## Encryption

Set `APPLY_ENCRYPTION=true` and provide `SECRET_KEY`. Responses produced via `BaseController#send` are then base64 AES-256-GCM ciphertexts of the form:

```
salt(16) || ciphertext || iv(12) || tag(16)
```

The salt is randomized per-message and embedded so decrypt() works across processes/hosts without shared in-memory state. PBKDF2 derivation uses 600 000 iterations of HMAC-SHA512 (OWASP 2023 guidance).

## Swagger / Postman

- Swagger UI: `${host}/docs` (only mounted when `NODE_ENV !== 'production'`).
- Postman collection: [`wiki/postman/node-boilerplate.postman_collection.json`](wiki/postman/node-boilerplate.postman_collection.json) – import and set `BASE_URL`.

![Swagger API Documentation](https://github.com/santoshshinde2012/node-boilerplate/blob/master/wiki/swagger-api-documentation.jpg?raw=true)

## Quality gates

```bash
npm run typecheck     # tsc --noEmit
npm run lint          # eslint
npm run format        # prettier
npm test              # jest with coverage
npm run audit:prod    # npm audit --omit=dev --audit-level=high
```

CI runs all of the above plus SonarCloud / Snyk / CodeQL / njsscan / Code Climate.

## Security disclosure

See [SECURITY.md](SECURITY.md) for how to responsibly report a vulnerability.

## References

- [Skeleton for Node.js Apps written in TypeScript](https://javascript.plainenglish.io/skeleton-for-node-js-apps-written-in-typescript-444fa1695b30)
- [Setup Eslint Prettier and Husky in Node JS Typescript Project](https://gist.github.com/santoshshinde2012/e1433327e5f7a58f98fe3e6651c4d5de)
- [Express production best practices: security](https://expressjs.com/en/advanced/best-practice-security.html)
- [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [Node.js secure coding](https://nodejs.org/en/learn/getting-started/security-best-practices)

## Notes

### Husky pre-commit hook is not executable by default

```bash
chmod ug+x .husky/*
chmod ug+x .git/hooks/*
```

### Tutorials

- [Skeleton for Node.js Apps written in TypeScript (with Setup Instructions for ESLint, Prettier, and Husky)](https://blog.santoshshinde.com/skeleton-for-node-js-apps-written-in-typescript-444fa1695b30)
- [Global Error and Response Handler in Node JS with Express and Typescript](https://blog.santoshshinde.com/global-error-and-response-handler-in-node-js-with-express-and-typescript-913ec06d74b3)
- [Testing with Jest in TypeScript and Node.js for Beginners](https://blog.santoshshinde.com/beginners-guide-to-testing-jest-with-node-typescript-1f46a1b87dad)
- [Static Code Analysis for Node.js and TypeScript Project using SonarQube](https://blog.santoshshinde.com/static-code-analysis-for-node-js-and-typescript-project-using-sonarqube-8f90799add06)
- [Visualization of Node.js Event Emitter](https://blog.santoshshinde.com/visualization-of-node-js-event-emitter-4f7c9fe3a477)

<hr/>

### Connect with me on
<div id="badges">
  <a href="https://twitter.com/shindesan2012">
    <img src="https://img.shields.io/badge/shindesan2012-black?style=for-the-badge&logo=twitter&logoColor=white" alt="Twitter Badge"/>
  </a>
  <a href="https://www.linkedin.com/in/shindesantosh/">
    <img src="https://img.shields.io/badge/shindesantosh-blue?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn Badge"/>
  </a>
   <a href="https://blog.santoshshinde.com/">
    <img src="https://img.shields.io/badge/Blog-black?style=for-the-badge&logo=medium&logoColor=white" alt="Medium Badge"/>
  </a>
  <a href="https://www.buymeacoffee.com/santoshshin" target="_blank">
    <img src="https://cdn.buymeacoffee.com/buttons/default-black.png" alt="Buy Me A Coffee" height="28" width="100">
    </a>
</div>
