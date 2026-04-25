# LeadCue Multilingual SEO Operations

## What is now automated

- `canonical`, `hreflang`, `x-default`, OG, Twitter, and JSON-LD are injected at runtime and in prerendered HTML.
- Localized OG cards are generated per locale and route into `apps/web/public/images/og`.
- `robots.txt` and `_headers` are generated so `/app`, `/login`, `/signup`, and `/reset-password` stay noindex.
- `sitemap.xml` is generated for all public localized routes.
- `npm run audit:seo` writes a readiness report to `tmp/locale-audit/seo-readiness.md`.

## Required environment variables

- `VITE_SITE_URL`
- `VITE_GOOGLE_SITE_VERIFICATION`
- `VITE_BING_SITE_VERIFICATION`

Use the same production domain in `APP_URL` and `VITE_SITE_URL`.

## Build and audit commands

```powershell
npm --workspace @leadcue/web run content:generate
npm --workspace @leadcue/web run build
npm run audit:seo
npm run visual:audit:locales
```

## Cloudflare checklist

1. Set the production environment variable `VITE_SITE_URL` to the final canonical origin.
2. Add `VITE_GOOGLE_SITE_VERIFICATION` after Search Console gives the token.
3. Add `VITE_BING_SITE_VERIFICATION` after Bing Webmaster Tools gives the token.
4. Force HTTPS at the platform level.
5. Keep a single canonical hostname. Redirect all secondary hostnames to the canonical one with a 301.
6. Keep one trailing-slash policy. LeadCue currently normalizes to no trailing slash except `/`.
7. Do not force locale redirects from `Accept-Language`. Let crawlers and deep links stay on the requested URL.
8. Submit `https://your-domain/sitemap.xml` to Search Console and Bing Webmaster Tools.

## Monitoring by locale

Create Search Console filters or dashboards for:

- `/`
- `/zh/`
- `/ja/`
- `/ko/`
- `/de/`
- `/nl/`
- `/fr/`

Track these per locale:

- indexed pages
- top queries
- clicks
- impressions
- CTR
- average position
- hreflang errors

## URL strategy

- Current localized URLs use locale prefixes with English canonical slugs.
- This is intentional for now to avoid breaking live/internal links during the multilingual rollout.
- If localized slugs are introduced later, ship them with a full 301 mapping plan, regenerated sitemap, refreshed OG assets, and Search Console revalidation.

## Release gate

Do not ship a multilingual SEO release until all items below are true:

- `npm --workspace @leadcue/web run build` passes
- `npm run audit:seo` reports zero missing OG assets
- `npm run visual:audit:locales` shows no obvious overflow or broken headers
- Search Console verification token is present in the environment
- Bing verification token is present in the environment
- Cloudflare canonical-host redirect is active
