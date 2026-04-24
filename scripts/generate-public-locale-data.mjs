import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const generatedDir = path.join(repoRoot, "apps", "web", "src", "content", "generated");
const sourceDir = path.join(repoRoot, "apps", "web", "src", "content", "source");
const cachePath = path.join(repoRoot, "scripts", ".translation-cache.json");
const publicDir = path.join(repoRoot, "apps", "web", "public");
const siteUrl = "https://leadcue.app";

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

function normalizeForCache(value) {
  return value.replace(/\r\n/g, "\n").trim();
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
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
  const joined = segments.map((segment, index) => `__SEG_${index}__ ${segment}`).join("\n");
  const url =
    "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&dt=t&tl=" +
    encodeURIComponent(targetLocale) +
    "&q=" +
    encodeURIComponent(joined);

  const response = await fetch(url);

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
    restored.push(raw || segments[index]);
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
      results[index] = cached;
      return;
    }

    missingIndexes.push(index);
    missingValues.push(value);
  });

  for (let start = 0; start < missingValues.length; start += batchSize) {
    const batch = missingValues.slice(start, start + batchSize);
    const translatedBatch = await googleTranslate(localeTargets[locale], batch);

    translatedBatch.forEach((translated, offset) => {
      const sourceValue = batch[offset];
      const index = missingIndexes[start + offset];
      const normalized = normalizeForCache(sourceValue);
      cacheBucket[normalized] = translated;
      results[index] = translated;
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
      if (key === "slug" || key === "related" || key === "tool" || key === "platform" || key === "href" || key === "value") {
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
        if (key === "slug" || key === "related" || key === "tool" || key === "platform" || key === "href" || key === "value") {
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

function renderSitemap(localeData) {
  const lastmod = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date());
  const commercialRoutes = Object.keys(localeData.en.commercialPages).map((slug) => `/${slug}`);
  const seoRoutes = localeData.en.seoPages.map((page) => `/${page.slug}`);
  const productRoutes = localeData.en.productPages.map((page) => `/${page.slug}`);
  const basePaths = ["/", ...commercialRoutes, ...seoRoutes, ...productRoutes];

  const urlEntries = [];

  for (const { code } of siteLocales) {
    for (const basePath of basePaths) {
      const localizedPath = buildLocalePath(code, basePath);
      const absoluteHref = `${siteUrl}${localizedPath === "/" ? "/" : localizedPath}`;
      const alternates = siteLocales
        .map((locale) => {
          const alternateHref = `${siteUrl}${buildLocalePath(locale.code, basePath)}`;
          return `    <xhtml:link rel="alternate" hreflang="${locale.hrefLang}" href="${alternateHref}" />`;
        })
        .concat(`    <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}${buildLocalePath("en", basePath)}" />`)
        .join("\n");
      const meta = getRouteMeta(basePath);

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

  await mkdir(generatedDir, { recursive: true });

  await Promise.all([
    writeFile(path.join(generatedDir, "site-ui.locales.json"), JSON.stringify(Object.fromEntries(
      Object.entries(localeData).map(([locale, bundle]) => [locale, bundle.siteUi])
    ), null, 2) + "\n", "utf8"),
    writeFile(path.join(generatedDir, "seo-pages.locales.json"), JSON.stringify(Object.fromEntries(
      Object.entries(localeData).map(([locale, bundle]) => [locale, bundle.seoPages])
    ), null, 2) + "\n", "utf8"),
    writeFile(path.join(generatedDir, "product-pages.locales.json"), JSON.stringify(Object.fromEntries(
      Object.entries(localeData).map(([locale, bundle]) => [locale, bundle.productPages])
    ), null, 2) + "\n", "utf8"),
    writeFile(path.join(generatedDir, "commercial-pages.locales.json"), JSON.stringify(Object.fromEntries(
      Object.entries(localeData).map(([locale, bundle]) => [locale, bundle.commercialPages])
    ), null, 2) + "\n", "utf8")
  ]);

  await writeFile(path.join(publicDir, "sitemap.xml"), renderSitemap(localeData), "utf8");

  await writeCache(cache);
  console.log("Generated localized public content bundles.");
}

await main();
