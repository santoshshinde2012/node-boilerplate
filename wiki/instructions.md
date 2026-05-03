# Operator & Contributor Notes

These are the runbook-style notes that don't fit in the `README`. They cover
common gotchas you will hit when running this boilerplate in production or
extending it locally.

## 1. Husky hooks aren't executable

Files are not executable by default after a fresh clone. Fix the bit once:

```bash
chmod ug+x .husky/*
chmod ug+x .git/hooks/*
```

The hooks installed by this repo:

| Hook         | Command         | Purpose                                          |
|--------------|-----------------|--------------------------------------------------|
| `pre-commit` | `npm run precommit` | `eslint --fix` + `prettier --write`           |
| `pre-push`   | `npm run prepush`   | `eslint` (fail-fast on lint errors)           |

## 2. Production security checklist

Each item below is enforced or surfaced by the boilerplate. If you fork it,
keep this list in sync with reality.

- [x] **Use TLS in front of the app.** Terminate at the LB / reverse proxy and
      set `TRUST_PROXY=true` so `req.ip` and the rate limiter respect the
      `X-Forwarded-For` header.
- [x] **Helmet** is enabled with HSTS in production and CSP off by default
      (override in `App.ts` once your asset hosts are decided).
- [x] **CORS allow-list** via `CORS_ORIGINS` (comma separated). `*` is
      accepted only for dev — never use it in production with credentials.
- [x] **Rate limiting** via `express-rate-limit` (`RATE_LIMIT_*`). Health
      endpoints are exempt. Add a stricter limit on auth endpoints once you
      add them.
- [x] **Body size capped** at `BODY_LIMIT` (default `1mb`). Bumping this is
      a denial-of-service risk — only do it for routes that actually need it.
- [x] **PBKDF2-HMAC-SHA512 @ 600 000 iters + AES-256-GCM** in
      [`src/lib/crypto.ts`](../src/lib/crypto.ts). The per-message salt is
      embedded in the ciphertext, so cyphertexts roundtrip across processes.
- [x] **No env / network leak.** `/v1/system/process` and `/v1/system/info`
      strip `process.env`, network interfaces and OS user info when
      `NODE_ENV=production`. Set `EXPOSE_SYSTEM_ROUTES=false` to disable
      them entirely.
- [x] **`x-powered-by` header** is disabled.
- [x] **`x-request-id`** is forwarded if the client supplies it
      (validated against `^[A-Za-z0-9._-]{1,128}$`), otherwise minted with
      `crypto.randomUUID()`.
- [x] **Graceful shutdown** on `SIGINT` / `SIGTERM` with a 10 s drain.
- [x] **HTTP server timeouts**: `keepAliveTimeout`, `headersTimeout`,
      `requestTimeout` are set in `server.ts` to defeat slow-loris attacks.
- [x] **Production dependencies** are kept at `0` known vulnerabilities by
      `npm audit --omit=dev` (CI gate).

## 3. Configuration

All configuration is environment-driven. See [`.env.example`](../.env.example)
for the full list. The config module
[`src/config/index.ts`](../src/config/index.ts) **fails fast** on:

- invalid `NODE_ENV`
- non-numeric / out-of-range `PORT`, `RATE_LIMIT_*`
- `APPLY_ENCRYPTION=true` without a `SECRET_KEY` of at least 16 characters

Never commit `.env` — it is `gitignore`d and `dockerignore`d. CI/CD must pass
secrets via the platform's secret manager or `--env-file`.

## 4. Logging

Winston is configured in [`src/lib/logger.ts`](../src/lib/logger.ts) with three
transports: stdout (always), `logs/combined.log`, and `logs/error.log` (only
when the directory is writable, which it isn't in `read_only` containers).

- `LOG_LEVEL` controls verbosity (defaults to `info` in prod, `debug` elsewhere).
- Logs are JSON with `service`, `env`, `requestId`, `timestamp` defaults.
- The transport list is a no-op in tests (`NODE_ENV=test`) so Jest output stays
  clean.

## 5. Adding a new controller

1. Create `src/components/<feature>/<Feature>Controller.ts` extending
   [`BaseController`](../src/components/BaseController.ts).
2. Implement `routes(): RouteDefinition[]` and add a `basePath` field.
3. Register it in [`src/routes.ts`](../src/routes.ts) inside the
   `controllers` array.
4. Add Jest unit tests under `tests/unit-tests/components/`.
5. Add a Supertest integration test under `tests/integration-tests/`.
6. Update [`swagger.json`](../swagger.json) and the Postman collection.

## 6. Useful references

- [Express production best practices: security](https://expressjs.com/en/advanced/best-practice-security.html)
- [Node.js security best practices](https://nodejs.org/en/learn/getting-started/security-best-practices)
- [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [12-Factor App](https://12factor.net/)
- [NodeJS globals and TypeScript](https://marcinbiernat.pl/2020/03/nodejs-globals/)
