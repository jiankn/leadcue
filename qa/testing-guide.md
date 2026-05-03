# LeadCue Automated Testing Guide

## Test layers

LeadCue now has three automated test layers:

- **Unit tests**: pure functions in `apps/web/src` and `packages/shared/src`.
- **API integration tests**: live API endpoint tests against `wrangler dev` on `http://localhost:8787`.
- **E2E tests**: Playwright browser tests against Vite web on `http://localhost:5173` and API on `http://localhost:8787`.

## Install dependencies

```bash
npm install
```

If Playwright browsers are missing:

```bash
npm run test:e2e:install
```

## Run unit tests

```bash
npm run test:unit
```

This does not require local web/API servers.

## Run API integration tests

Start the API server first:

```bash
npm run dev:api
```

Then in another terminal:

```bash
npm run test:api
```

Requirements:

- `apps/api/.dev.vars` must include `LEADCUE_TEST_MODE=1`.
- `wrangler dev` must expose the API at `http://localhost:8787` unless overridden with `LEADCUE_API_URL`.
- API tests create users using emails like `test_*@leadcue.test` and clean them up via `/api/auth/test/cleanup`.

Override API URL:

```bash
LEADCUE_API_URL=http://localhost:8787 npm run test:api
```

## Run E2E tests

Start both local servers:

```bash
npm run dev:api
npm run dev:web
```

Then in another terminal:

```bash
npm run test:e2e
```

Requirements:

- Web server available at `http://localhost:5173`.
- API server available at `http://localhost:8787`.
- `apps/api/.dev.vars` includes `LEADCUE_TEST_MODE=1`.

Override URLs:

```bash
LEADCUE_WEB_URL=http://localhost:5173 LEADCUE_API_URL=http://localhost:8787 npm run test:e2e
```

## What is covered

### Unit tests

- Locale path parsing and URL localization.
- Prospect export preset validation, CRM column mappings, CSV generation.
- Domain extraction and fallback prospect card generation.

### API integration tests

- Email registration, login, logout, and password reset request.
- Scan success, validation failure, search-result URL rejection, idempotency behavior.
- Credits reporting.
- CSV exports.
- Billing checkout graceful response when Stripe is not configured.
- Stripe webhook rejects unsigned payloads.

### E2E tests

- Signed-in dashboard load via test-only session.
- Manual scan flow from `/app/queue#scan-console`.
- Lead persistence and credits update.
- CSV export endpoint after a scan.
- Multilingual public pages across `en`, `zh`, `ja`, `ko`, `de`, `nl`, `fr`.
- Email signup, wrong-password login, and password reset request smoke.

## CI behavior

GitHub Actions runs:

```bash
npm run test:ci
npm --workspace @leadcue/web run build
```

`test:ci` currently includes typecheck + unit tests. API and E2E tests are intentionally local/staging smoke tests because they require a live `wrangler dev` API, D1 database bindings, and test-mode secrets.

## Safety note

The test-only endpoints are disabled unless `LEADCUE_TEST_MODE=1` is set:

- `POST /api/auth/test/sign-in`
- `POST /api/auth/test/cleanup`

Do **not** set `LEADCUE_TEST_MODE=1` in production secrets.
