import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const distDir = process.argv[2] ? path.resolve(process.argv[2]) : path.join(repoRoot, "apps", "web", "dist");
const generatedDir = path.join(repoRoot, "apps", "web", "src", "content", "generated");
const sourceDir = path.join(repoRoot, "apps", "web", "src", "content", "source");

const locales = ["en", "zh", "ja", "ko", "de", "nl", "fr"];

function normalizePath(pathname) {
  if (!pathname) {
    return "/";
  }

  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return normalized !== "/" ? normalized.replace(/\/+$/, "") || "/" : normalized;
}

function buildLocalePath(locale, pathname) {
  const normalized = normalizePath(pathname);
  return locale === "en" ? normalized : normalized === "/" ? `/${locale}` : `/${locale}${normalized}`;
}

function loadJson(filename) {
  return JSON.parse(fs.readFileSync(path.join(generatedDir, filename), "utf8"));
}

function loadSourceJson(filename, fallback) {
  try {
    return JSON.parse(fs.readFileSync(path.join(sourceDir, filename), "utf8"));
  } catch {
    return fallback;
  }
}

function isPageReady(pageReadiness, kind, slug, locale) {
  const readyLocales = pageReadiness?.[kind]?.[slug];

  if (!Array.isArray(readyLocales)) {
    return true;
  }

  return readyLocales.includes(locale);
}

const commercialPages = loadJson("commercial-pages.locales.json");
const seoPages = loadJson("seo-pages.locales.json");
const productPages = loadJson("product-pages.locales.json");
const pageReadiness = loadSourceJson("localized-page-readiness.json", {});

const expectedHtmlRoutes = locales.map((locale) => buildLocalePath(locale, "/").slice(1) || "index.html")
  .map((value) => (value === "index.html" ? value : `${value}/index.html`));

for (const locale of locales) {
  const basePaths = [
    ...Object.keys(commercialPages[locale] ?? commercialPages.en).map((slug) => `/${slug}`),
    ...(seoPages[locale] ?? seoPages.en).filter((page) => isPageReady(pageReadiness, "seoPages", page.slug, locale)).map((page) => `/${page.slug}`),
    ...(productPages[locale] ?? productPages.en).filter((page) => isPageReady(pageReadiness, "productPages", page.slug, locale)).map((page) => `/${page.slug}`)
  ];

  for (const basePath of basePaths) {
    expectedHtmlRoutes.push(`${buildLocalePath(locale, basePath).slice(1)}/index.html`);
  }
}

const requiredStaticFiles = ["robots.txt", "sitemap.xml", "favicon.svg", "images/leadcue-og-card.svg"];

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

console.log(`Smoke check passed for ${expectedHtmlRoutes.length} localized public routes in ${distDir}.`);
