# LeadCue

LeadCue is a website-first outbound research workspace for SEO, web design, and growth agencies.

It helps teams turn a company website into a qualified outreach opportunity before the account hits CRM or email tools, with:

- company summary
- ICP fit score
- visible website evidence
- reason-to-contact cues
- public contact paths
- outreach angles
- first lines
- export-ready notes

## Repository Structure

```text
leadcue/
  apps/
    api/          Cloudflare Workers API with Hono
    extension/    Chrome MV3 side panel extension
    web/          React/Vite landing page and dashboard prototype
  packages/
    prompts/      Prospect Card prompt builder
    shared/       shared types, pricing, extraction rules, fallback analyzer
  migrations/
    0001_initial.sql
  design-system/
    MASTER.md
```

## Stack

- Web: React + Vite
- API: Cloudflare Workers + Hono
- DB: Cloudflare D1
- Storage targets: R2 for exports/snapshots, KV for light config, Queues for deep scans
- Extension: Chrome Manifest V3 + Side Panel
- AI: configurable OpenAI-compatible endpoint through `AI_GATEWAY_URL`

## Local Setup

```powershell
npm install
```

Run the API:

```powershell
npm run dev:api
```

Run the web app:

```powershell
npm run dev:web
```

Open:

- Web: `http://localhost:5173`
- Dashboard prototype: `http://localhost:5173/app`
- API health: `http://localhost:8787/api/health`

## Chrome Extension

1. Open Chrome `chrome://extensions`.
2. Enable Developer mode.
3. Load unpacked extension from `apps/extension`.
4. Open a company website.
5. Click the LeadCue extension action to open the side panel.
6. Keep API base URL as `http://localhost:8787` for local development.

The extension only reads the active tab after the user clicks `Analyze website`.

## D1 Migration

Create the D1 database:

```powershell
npx wrangler d1 create leadcue
```

Copy the database ID into `apps/api/wrangler.toml`, then apply:

```powershell
npx wrangler d1 migrations apply leadcue --local
npx wrangler d1 migrations apply leadcue --remote
```

The API works without D1 bindings in local mock mode, but `/api/scans` will persist leads and credit transactions when `DB` is configured.

## Environment

Copy `apps/api/.dev.vars.example` to `apps/api/.dev.vars` for local Workers development.

AI calls are optional. Without these values, LeadCue uses the rule-based fallback analyzer:

```text
AI_GATEWAY_URL=
AI_PROVIDER_API_KEY=
AI_MODEL=gpt-4.1-mini
```

For multilingual SEO deployment and monitoring, use `qa/multilingual-seo-operations.md`.

## Current MVP Coverage

- Landing page using the website-first research-layer positioning.
- Dashboard prototype with saved leads, Prospect Card, ICP settings, credits, and signal mix.
- Chrome side panel that extracts active page title, meta description, H1, visible text, links, emails, and phones.
- `/api/scans` endpoint that returns a Prospect Card and saves it to D1 when configured.
- `/api/leads`, `/api/credits`, `/api/exports`, `/api/waitlist`, `/api/config`, `/api/health`.
- D1 schema from the architecture document.

## Next Build Steps

1. Implement Google OAuth and session cookies.
2. Replace demo workspace fallback with authenticated workspace lookup.
3. Add deep scan queue worker for about/contact/pricing/blog/careers pages.
4. Add real CSV export storage in R2.
5. Add pricing/billing webhooks and AppSumo license redemption.
6. Create production Chrome icons, screenshots, privacy policy, and store test account.
