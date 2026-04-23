# LeadCue Release Smoke Checklist

## 1. Public marketing and SEO pages
- Open `/` and confirm hero CTA, pricing CTA, and resources render correctly.
- Open `/templates/crm-csv-field-mapping`, `/templates/cold-email-first-line`, and `/templates/website-prospecting-checklist`.
- Open `/integrations/hubspot-csv-export`, `/integrations/salesforce-csv-export`, and `/integrations/pipedrive-csv-export`.
- Confirm every public page shows a real title, CTA, and related links.

## 2. Auth flows
- `/signup?plan=free`: create a workspace with email + password.
- `/login`: sign in with email + password.
- Forgot-password flow: request reset, open reset link, set new password, return to `/app`.
- Confirm Google sign-in button and fallback copy still render correctly.

## 3. Workspace flows
- `/app`: run a basic scan and confirm a Prospect Card is saved.
- `/app/leads`: select leads, review bulk export template, export CSV.
- `/app/settings/icp`: change ICP values and save.
- `/app/account`: change profile name/workspace name, then update password.

## 4. Billing and credits
- `/app/billing`: confirm status label, summary copy, next-step copy, plan cards, and billing portal CTA.
- Start a paid-plan checkout from the billing page.
- Confirm credits meter, reset date, and export CTA still behave correctly.

## 5. Analytics
- `/app/analytics`: confirm KPI cards, funnel, top pages, top events, recent events, and recommendations render.
- Trigger at least one tool CTA, one signup/login, one scan, and one export.
- Refresh analytics and confirm those events appear.

## 6. SEO and build artifacts
- Run `npm run build` in `apps/web`.
- Confirm output includes prerender + public-page validation.
- Run `npm run qa:smoke` in `apps/web`.
- Confirm `dist` contains `robots.txt`, `sitemap.xml`, and `favicon.svg`.

## 7. Final go / no-go
- No blocking console errors in auth, billing, tool pages, or analytics.
- All critical CTAs lead to the correct page.
- Copy on billing and tool pages matches actual product behavior.
- If any item above fails, hold release until fixed.
