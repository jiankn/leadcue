import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  authNoIndexPaths,
  generatedDir,
  getSearchEngineVerifications,
  getSeoImageFilename,
  homeKeywordPath,
  localeMeta,
  ogImageDir,
  publicDir,
  repoRoot,
  siteUrl
} from "./seo-utils.mjs";

async function loadJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

function buildOgExpectations(bundles) {
  const expected = [];

  for (const locale of localeMeta) {
    const seoPages = bundles.seoPages[locale.code] ?? bundles.seoPages.en;
    const productPages = bundles.productPages[locale.code] ?? bundles.productPages.en;
    const commercialPages = bundles.commercialPages[locale.code] ?? bundles.commercialPages.en;

    expected.push(getSeoImageFilename(locale.code, "/"));
    Object.keys(commercialPages).forEach((slug) => expected.push(getSeoImageFilename(locale.code, `/${slug}`)));
    seoPages.forEach((page) => expected.push(getSeoImageFilename(locale.code, `/${page.slug}`)));
    productPages.forEach((page) => expected.push(getSeoImageFilename(locale.code, `/${page.slug}`)));
  }

  return expected;
}

async function fileExists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const outputDir = path.join(repoRoot, "tmp", "locale-audit");
  const markdownPath = path.join(outputDir, "seo-readiness.md");
  const jsonPath = path.join(outputDir, "seo-readiness.json");
  const bundles = {
    siteUi: await loadJson(path.join(generatedDir, "site-ui.locales.json")),
    seoPages: await loadJson(path.join(generatedDir, "seo-pages.locales.json")),
    productPages: await loadJson(path.join(generatedDir, "product-pages.locales.json")),
    commercialPages: await loadJson(path.join(generatedDir, "commercial-pages.locales.json"))
  };
  const homeKeywords = await loadJson(homeKeywordPath);
  const robotsText = await readFile(path.join(publicDir, "robots.txt"), "utf8");
  const headersText = await readFile(path.join(publicDir, "_headers"), "utf8");
  const sitemapText = await readFile(path.join(publicDir, "sitemap.xml"), "utf8");
  const expectedOgFiles = buildOgExpectations(bundles);
  const missingOgFiles = [];

  for (const filename of expectedOgFiles) {
    if (!(await fileExists(path.join(ogImageDir, filename)))) {
      missingOgFiles.push(filename);
    }
  }

  const authPaths = [
    ...authNoIndexPaths,
    ...localeMeta
      .filter((locale) => locale.code !== "en")
      .flatMap((locale) => authNoIndexPaths.map((pathname) => `/${locale.code}${pathname}`))
  ];
  const robotsCoverage = authPaths.map((pathname) => ({
    pathname,
    inRobots: robotsText.includes(`Disallow: ${pathname}`),
    inHeaders: headersText.includes(pathname)
  }));
  const verificationEntries = getSearchEngineVerifications();
  const readiness = {
    siteUrl,
    verificationEntries,
    ogImages: {
      expected: expectedOgFiles.length,
      missing: missingOgFiles
    },
    robotsCoverage,
    sitemapHasXDefault: sitemapText.includes('hreflang="x-default"'),
    keywordMatrix: Object.fromEntries(
      localeMeta.map((locale) => {
        const seoPages = bundles.seoPages[locale.code] ?? bundles.seoPages.en;
        const productPages = bundles.productPages[locale.code] ?? bundles.productPages.en;
        return [
          locale.code,
          {
            home: homeKeywords[locale.code] ?? homeKeywords.en,
            sampleSeo: seoPages.slice(0, 2).map((page) => ({ title: page.title, keyword: page.primaryKeyword })),
            sampleProduct: productPages.slice(0, 2).map((page) => ({ title: page.title, keyword: page.primaryKeyword }))
          }
        ];
      })
    )
  };

  await mkdir(outputDir, { recursive: true });
  await writeFile(jsonPath, JSON.stringify(readiness, null, 2) + "\n", "utf8");

  const markdown = `# LeadCue SEO Readiness

## Site URL

- Active site URL: \`${siteUrl}\`
- Google verification configured: ${verificationEntries.some((entry) => entry.value === "google-site-verification") ? "yes" : "no"}
- Bing verification configured: ${verificationEntries.some((entry) => entry.value === "msvalidate.01") ? "yes" : "no"}

## Technical Coverage

- Generated OG images: ${expectedOgFiles.length - missingOgFiles.length} / ${expectedOgFiles.length}
- Missing OG images: ${missingOgFiles.length === 0 ? "none" : missingOgFiles.join(", ")}
- Sitemap includes x-default: ${readiness.sitemapHasXDefault ? "yes" : "no"}

## Auth Noindex Coverage

${robotsCoverage
  .map((entry) => `- \`${entry.pathname}\`: robots=${entry.inRobots ? "yes" : "no"}, _headers=${entry.inHeaders ? "yes" : "no"}`)
  .join("\n")}

## Locale Keyword Matrix

${localeMeta
  .map((locale) => {
    const localeReadiness = readiness.keywordMatrix[locale.code];
    return `### ${locale.nativeName} (${locale.code})

- Home primary: ${localeReadiness.home.primaryKeyword}
- Home secondary: ${localeReadiness.home.secondaryKeywords.join(", ")}
- Sample SEO keywords: ${localeReadiness.sampleSeo.map((entry) => `${entry.title} -> ${entry.keyword}`).join(" | ")}
- Sample product keywords: ${localeReadiness.sampleProduct.map((entry) => `${entry.title} -> ${entry.keyword}`).join(" | ")}`;
  })
  .join("\n\n")}
`;

  await writeFile(markdownPath, markdown + "\n", "utf8");
  console.log(`SEO readiness report written to ${markdownPath}`);
}

await main();
