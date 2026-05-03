import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { applyLocalizedSeoStrategy, loadLocalizedSeoStrategy } from "./localized-seo-strategy.mjs";
import { isPageReady, loadLocalizedPageReadiness } from "./localized-page-readiness.mjs";
import { curateLocalizedString, protectedTerms } from "./public-locale-curation.mjs";
import { siteUrl } from "./seo-utils.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const generatedDir = path.join(repoRoot, "apps", "web", "src", "content", "generated");
const sourceDir = path.join(repoRoot, "apps", "web", "src", "content", "source");
const cachePath = path.join(repoRoot, "scripts", ".translation-cache.json");
const publicDir = path.join(repoRoot, "apps", "web", "public");

const localeTargets = {
  en: "en",
  zh: "zh-CN",
  ja: "ja",
  ko: "ko",
  de: "de",
  nl: "nl",
  fr: "fr"
};

const siteLocales = [
  { code: "en", hrefLang: "en" },
  { code: "zh", hrefLang: "zh-CN" },
  { code: "ja", hrefLang: "ja" },
  { code: "ko", hrefLang: "ko" },
  { code: "de", hrefLang: "de" },
  { code: "nl", hrefLang: "nl" },
  { code: "fr", hrefLang: "fr" }
];

const batchSize = 24;
const translateRetryCount = 3;
const shouldTranslateMissing = process.env.LEADCUE_TRANSLATE_MISSING === "1";

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function protectTermsInString(value) {
  const protectedEntries = [];
  let output = value;

  protectedTerms.forEach((term, index) => {
    const placeholder = `__KEEP_${index}__`;
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(escaped, "g");

    if (!pattern.test(output)) {
      return;
    }

    output = output.replace(pattern, placeholder);
    protectedEntries.push([placeholder, term]);
  });

  return { output, protectedEntries };
}

function restoreProtectedTerms(value, protectedEntries) {
  return protectedEntries.reduce((current, [placeholder, term]) => current.replaceAll(placeholder, term), value);
}

function normalizeForCache(value) {
  return value.replace(/\r\n/g, "\n").trim();
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function shouldSkipObjectKey(key, item) {
  if (key === "related" || key === "platform" || key === "href" || key === "value") {
    return true;
  }

  if (key === "slug") {
    return true;
  }

  if (key === "tool" && typeof item === "string" && /^[a-z-]+$/.test(item)) {
    return true;
  }

  return false;
}

function shouldKeepString(value) {
  return (
    !value ||
    /^https?:\/\//.test(value) ||
    value.startsWith("/") ||
    value.startsWith("#") ||
    value.startsWith("mailto:") ||
    /^\d{4}-\d{2}-\d{2}$/.test(value) ||
    /^__\w+__$/.test(value)
  );
}

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

function stripExportedTypes(source) {
  const lines = source.split("\n");
  const output = [];
  let skipping = false;
  let braceDepth = 0;

  for (const line of lines) {
    if (!skipping && /^\s*export type\b/.test(line)) {
      skipping = true;
      braceDepth += (line.match(/{/g) ?? []).length;
      braceDepth -= (line.match(/}/g) ?? []).length;

      if (braceDepth <= 0 && line.trim().endsWith(";")) {
        skipping = false;
        braceDepth = 0;
      }

      continue;
    }

    if (skipping) {
      braceDepth += (line.match(/{/g) ?? []).length;
      braceDepth -= (line.match(/}/g) ?? []).length;

      if (braceDepth <= 0 && line.trim().endsWith(";")) {
        skipping = false;
        braceDepth = 0;
      }

      continue;
    }

    output.push(line);
  }

  return output.join("\n");
}

function transformTsModule(source, exportNames) {
  return stripExportedTypes(source)
    .replace(/^\s*import[^\n]+\n/gm, "")
    .replace(/export const (\w+): [^=]+ =/g, "const $1 =")
    .replace(/ as const/g, "")
    .replace(/export const/g, "const")
    .concat(`\nreturn { ${exportNames.join(", ")} };`);
}

async function loadStructuredData() {
  const seoSource = await readFile(path.join(repoRoot, "apps", "web", "src", "seoContent.ts"), "utf8");
  const productSource = await readFile(path.join(repoRoot, "apps", "web", "src", "productSeoContent.ts"), "utf8");
  const commercialSource = await readFile(path.join(repoRoot, "apps", "web", "src", "commercialContent.ts"), "utf8");
  const siteUiSource = await readFile(path.join(sourceDir, "site-ui.en.json"), "utf8");

  const seoLoader = new Function(transformTsModule(seoSource, ["seoContentPages"]));
  const productLoader = new Function(transformTsModule(productSource, ["productSeoPages"]));
  const commercialLoader = new Function(transformTsModule(commercialSource, ["commercialPages"]));

  return {
    siteUi: JSON.parse(siteUiSource),
    seoPages: seoLoader().seoContentPages,
    productPages: productLoader().productSeoPages,
    commercialPages: commercialLoader().commercialPages
  };
}

async function readCache() {
  try {
    return JSON.parse(await readFile(cachePath, "utf8"));
  } catch {
    return {};
  }
}

async function writeCache(cache) {
  await writeFile(cachePath, JSON.stringify(cache, null, 2) + "\n", "utf8");
}

async function googleTranslate(targetLocale, segments) {
  const protectedSegments = segments.map((segment) => protectTermsInString(segment));
  const joined = protectedSegments.map((segment, index) => `__SEG_${index}__ ${segment.output}`).join("\n");
  const url =
    "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&dt=t&tl=" +
    encodeURIComponent(targetLocale) +
    "&q=" +
    encodeURIComponent(joined);

  let response;
  let lastError;

  for (let attempt = 1; attempt <= translateRetryCount; attempt += 1) {
    try {
      response = await fetch(url);
      break;
    } catch (error) {
      lastError = error;

      if (attempt < translateRetryCount) {
        await wait(attempt * 1500);
      }
    }
  }

  if (!response) {
    throw lastError ?? new Error("Translate request failed before receiving a response");
  }

  if (!response.ok) {
    throw new Error(`Translate request failed with ${response.status}`);
  }

  const payload = await response.json();
  const translated = payload?.[0]?.map((item) => item[0]).join("") ?? "";
  const restored = [];

  for (let index = 0; index < segments.length; index += 1) {
    const marker = `__SEG_${index}__`;
    const nextMarker = `__SEG_${index + 1}__`;
    const start = translated.indexOf(marker);
    const end = index === segments.length - 1 ? translated.length : translated.indexOf(nextMarker);

    if (start === -1) {
      restored.push(segments[index]);
      continue;
    }

    const raw = translated.slice(start + marker.length, end === -1 ? translated.length : end).trim();
      restored.push(restoreProtectedTerms(raw || protectedSegments[index].output, protectedSegments[index].protectedEntries));
    }

  return restored;
}

async function translateStrings(strings, locale, cache) {
  if (locale === "en") {
    return strings;
  }

  const cacheBucket = (cache[locale] ??= {});
  const results = [...strings];
  const missingIndexes = [];
  const missingValues = [];

  strings.forEach((value, index) => {
    const normalized = normalizeForCache(value);
    const cached = cacheBucket[normalized];

    if (cached) {
      results[index] = curateLocalizedString(locale, value, cached);
      return;
    }

    missingIndexes.push(index);
    missingValues.push(value);
  });

  if (!shouldTranslateMissing && missingValues.length > 0) {
    console.warn(`Skipping machine translation for ${locale}; keeping ${missingValues.length} uncached source strings.`);
    return results;
  }

  for (let start = 0; start < missingValues.length; start += batchSize) {
    const batch = missingValues.slice(start, start + batchSize);
    let translatedBatch;

    try {
      translatedBatch = await googleTranslate(localeTargets[locale], batch);
    } catch (error) {
      console.warn(`Translate failed for ${locale}; keeping ${batch.length} source strings for this batch.`);
      console.warn(error instanceof Error ? error.message : String(error));
      translatedBatch = batch;
    }

    translatedBatch.forEach((translated, offset) => {
      const sourceValue = batch[offset];
      const index = missingIndexes[start + offset];
      const normalized = normalizeForCache(sourceValue);
      const curated = curateLocalizedString(locale, sourceValue, translated);
      cacheBucket[normalized] = curated;
      results[index] = curated;
    });
  }

  return results;
}

function collectStrings(value, strings = []) {
  if (Array.isArray(value)) {
    value.forEach((item) => collectStrings(item, strings));
    return strings;
  }

  if (isPlainObject(value)) {
    Object.entries(value).forEach(([key, item]) => {
      if (shouldSkipObjectKey(key, item)) {
        return;
      }

      collectStrings(item, strings);
    });
    return strings;
  }

  if (typeof value === "string" && !shouldKeepString(value)) {
    strings.push(value);
  }

  return strings;
}

function applyTranslations(value, iterator) {
  if (Array.isArray(value)) {
    return value.map((item) => applyTranslations(item, iterator));
  }

  if (isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => {
        if (shouldSkipObjectKey(key, item)) {
          return [key, item];
        }

        return [key, applyTranslations(item, iterator)];
      })
    );
  }

  if (typeof value === "string" && !shouldKeepString(value)) {
    return iterator.next().value ?? value;
  }

  return value;
}

async function buildLocaleBundle(sourceData, locale, cache) {
  if (locale === "en") {
    return sourceData;
  }

  const strings = collectStrings(sourceData);
  const translatedStrings = await translateStrings(strings, locale, cache);
  const iterator = translatedStrings[Symbol.iterator]();

  return applyTranslations(sourceData, iterator);
}

function getRouteMeta(basePath) {
  if (basePath === "/") {
    return { changefreq: "weekly", priority: "1.0" };
  }

  if (basePath === "/docs") {
    return { changefreq: "monthly", priority: "0.7" };
  }

  if (basePath === "/support" || basePath === "/contact") {
    return { changefreq: "monthly", priority: "0.5" };
  }

  if (basePath === "/privacy" || basePath === "/terms") {
    return { changefreq: "yearly", priority: "0.4" };
  }

  if (basePath.startsWith("/use-cases/")) {
    return { changefreq: "monthly", priority: "0.8" };
  }

  if (basePath.startsWith("/guides/") || basePath.startsWith("/templates/")) {
    return { changefreq: "monthly", priority: "0.85" };
  }

  if (basePath.startsWith("/integrations/")) {
    return { changefreq: "monthly", priority: "0.78" };
  }

  if (basePath === "/agency-lead-qualification") {
    return { changefreq: "monthly", priority: "0.85" };
  }

  return { changefreq: "monthly", priority: "0.9" };
}

function getRouteDescriptors(localeData) {
  const commercialRoutes = Object.keys(localeData.en.commercialPages).map((slug) => ({
    basePath: `/${slug}`,
    kind: "commercialPages",
    slug
  }));
  const seoRoutes = localeData.en.seoPages.map((page) => ({
    basePath: `/${page.slug}`,
    kind: "seoPages",
    slug: page.slug
  }));
  const productRoutes = localeData.en.productPages.map((page) => ({
    basePath: `/${page.slug}`,
    kind: "productPages",
    slug: page.slug
  }));

  return [{ basePath: "/", kind: "home", slug: "home" }, ...commercialRoutes, ...seoRoutes, ...productRoutes];
}

function renderSitemap(localeData, pageReadiness) {
  const lastmod = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date());
  const routes = getRouteDescriptors(localeData);

  const urlEntries = [];

  for (const route of routes) {
    const readyLocales = siteLocales.filter((locale) => isPageReady(pageReadiness, route.kind, route.slug, locale.code));
    const defaultLocale = readyLocales.find((locale) => locale.code === "en") ?? readyLocales[0];

    if (!defaultLocale) {
      continue;
    }

    for (const { code } of readyLocales) {
      const localizedPath = buildLocalePath(code, route.basePath);
      const absoluteHref = `${siteUrl}${localizedPath === "/" ? "/" : localizedPath}`;
      const alternates = readyLocales
        .map((locale) => {
          const alternateHref = `${siteUrl}${buildLocalePath(locale.code, route.basePath)}`;
          return `    <xhtml:link rel="alternate" hreflang="${locale.hrefLang}" href="${alternateHref}" />`;
        })
        .concat(`    <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}${buildLocalePath(defaultLocale.code, route.basePath)}" />`)
        .join("\n");
      const meta = getRouteMeta(route.basePath);

      urlEntries.push(`  <url>
    <loc>${absoluteHref}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${meta.changefreq}</changefreq>
    <priority>${meta.priority}</priority>
${alternates}
  </url>`);
    }
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlEntries.join("\n")}
</urlset>
`;
}

async function main() {
  const sourceData = await loadStructuredData();
  const cache = await readCache();
  const pageReadiness = await loadLocalizedPageReadiness();
  const localeData = {};

  for (const locale of Object.keys(localeTargets)) {
    localeData[locale] = {
      siteUi: await buildLocaleBundle(sourceData.siteUi, locale, cache),
      seoPages: await buildLocaleBundle(sourceData.seoPages, locale, cache),
      productPages: await buildLocaleBundle(sourceData.productPages, locale, cache),
      commercialPages: await buildLocaleBundle(sourceData.commercialPages, locale, cache)
    };
    console.log(`Prepared public locale data for ${locale}.`);
  }

  const localizedSeoStrategy = await loadLocalizedSeoStrategy();
  const finalLocaleData = applyLocalizedSeoStrategy(localeData, localizedSeoStrategy);

  await mkdir(generatedDir, { recursive: true });

  await Promise.all([
    writeFile(path.join(generatedDir, "site-ui.locales.json"), JSON.stringify(Object.fromEntries(
      Object.entries(finalLocaleData).map(([locale, bundle]) => [locale, bundle.siteUi])
    ), null, 2) + "\n", "utf8"),
    writeFile(path.join(generatedDir, "seo-pages.locales.json"), JSON.stringify(Object.fromEntries(
      Object.entries(finalLocaleData).map(([locale, bundle]) => [locale, bundle.seoPages])
    ), null, 2) + "\n", "utf8"),
    writeFile(path.join(generatedDir, "product-pages.locales.json"), JSON.stringify(Object.fromEntries(
      Object.entries(finalLocaleData).map(([locale, bundle]) => [locale, bundle.productPages])
    ), null, 2) + "\n", "utf8"),
    writeFile(path.join(generatedDir, "commercial-pages.locales.json"), JSON.stringify(Object.fromEntries(
      Object.entries(finalLocaleData).map(([locale, bundle]) => [locale, bundle.commercialPages])
    ), null, 2) + "\n", "utf8")
  ]);

  await writeFile(path.join(publicDir, "sitemap.xml"), renderSitemap(finalLocaleData, pageReadiness), "utf8");

  await writeCache(cache);
  console.log("Generated localized public content bundles.");
}

await main();
