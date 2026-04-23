import fs from "node:fs";
import path from "node:path";

const distDir = process.argv[2] ? path.resolve(process.argv[2]) : path.resolve("apps/web/dist");

const expectedHtmlRoutes = [
  "index.html",
  "docs/index.html",
  "support/index.html",
  "contact/index.html",
  "privacy/index.html",
  "terms/index.html",
  "website-prospecting/index.html",
  "prospect-research-tool-for-agencies/index.html",
  "cold-email-first-lines/index.html",
  "agency-lead-qualification/index.html",
  "use-cases/web-design-agencies/index.html",
  "use-cases/seo-agencies/index.html",
  "use-cases/marketing-agencies/index.html",
  "guides/turn-website-into-cold-email-angle/index.html",
  "guides/score-prospect-website/index.html",
  "guides/website-audit-outreach/index.html",
  "templates/crm-csv-field-mapping/index.html",
  "templates/cold-email-first-line/index.html",
  "templates/website-prospecting-checklist/index.html",
  "integrations/hubspot-csv-export/index.html",
  "integrations/salesforce-csv-export/index.html",
  "integrations/pipedrive-csv-export/index.html"
];

const requiredStaticFiles = ["robots.txt", "sitemap.xml", "favicon.svg"];

const failures = [];

if (!fs.existsSync(distDir)) {
  failures.push(`Dist directory not found: ${distDir}`);
} else {
  for (const route of expectedHtmlRoutes) {
    const fullPath = path.join(distDir, route);
    if (!fs.existsSync(fullPath)) {
      failures.push(`Missing prerendered route: ${route}`);
    }
  }

  for (const asset of requiredStaticFiles) {
    const fullPath = path.join(distDir, asset);
    if (!fs.existsSync(fullPath)) {
      failures.push(`Missing static asset: ${asset}`);
    }
  }
}

if (failures.length) {
  console.error("Smoke check failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`Smoke check passed for ${expectedHtmlRoutes.length} public routes in ${distDir}.`);
