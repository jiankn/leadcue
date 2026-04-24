import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const distDir = path.join(repoRoot, "apps", "web", "dist");
const generatedDir = path.join(repoRoot, "apps", "web", "src", "content", "generated");
const siteUrl = "https://leadcue.app";

const localeMeta = [
  { code: "en", hrefLang: "en", htmlLang: "en" },
  { code: "zh", hrefLang: "zh-CN", htmlLang: "zh-CN" },
  { code: "ja", hrefLang: "ja", htmlLang: "ja" },
  { code: "ko", hrefLang: "ko", htmlLang: "ko" },
  { code: "de", hrefLang: "de", htmlLang: "de" },
  { code: "nl", hrefLang: "nl", htmlLang: "nl" },
  { code: "fr", hrefLang: "fr", htmlLang: "fr" }
];

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
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

function localizeHref(locale, href) {
  if (!href || href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:") || href.startsWith("#")) {
    return href;
  }

  const [pathAndSearch, hash = ""] = href.split("#");
  const [pathname = "/", search = ""] = pathAndSearch.split("?");
  const localizedPath = buildLocalePath(locale, pathname);

  return `${localizedPath}${search ? `?${search}` : ""}${hash ? `#${hash}` : ""}`;
}

function canonicalFor(localizedPath) {
  return `${siteUrl}${localizedPath === "/" ? "/" : localizedPath}`;
}

async function loadBundles() {
  const [siteUi, seoPages, productPages, commercialPages] = await Promise.all([
    readFile(path.join(generatedDir, "site-ui.locales.json"), "utf8"),
    readFile(path.join(generatedDir, "seo-pages.locales.json"), "utf8"),
    readFile(path.join(generatedDir, "product-pages.locales.json"), "utf8"),
    readFile(path.join(generatedDir, "commercial-pages.locales.json"), "utf8")
  ]);

  return {
    siteUi: JSON.parse(siteUi),
    seoPages: JSON.parse(seoPages),
    productPages: JSON.parse(productPages),
    commercialPages: JSON.parse(commercialPages)
  };
}

function buildRoutes(bundles) {
  const routes = [];

  for (const locale of localeMeta) {
    const siteUi = bundles.siteUi[locale.code] ?? bundles.siteUi.en;
    const seoPages = bundles.seoPages[locale.code] ?? bundles.seoPages.en;
    const productPages = bundles.productPages[locale.code] ?? bundles.productPages.en;
    const commercialPages = bundles.commercialPages[locale.code] ?? bundles.commercialPages.en;

    routes.push({
      locale: locale.code,
      htmlLang: locale.htmlLang,
      hrefLang: locale.hrefLang,
      basePath: "/",
      localizedPath: buildLocalePath(locale.code, "/"),
      title: siteUi.home.seo.title,
      description: siteUi.home.seo.description,
      sections: [siteUi.home.hero.subhead, siteUi.home.features.copy, siteUi.home.resources.copy],
      siteUi,
      structuredType: "WebSite",
      ogType: "website"
    });

    Object.entries(commercialPages).forEach(([slug, page]) => {
      routes.push({
        locale: locale.code,
        htmlLang: locale.htmlLang,
        hrefLang: locale.hrefLang,
        basePath: `/${slug}`,
        localizedPath: buildLocalePath(locale.code, `/${slug}`),
        title: `${page.title} | ${siteUi.common.brand}`,
        description: page.summary,
        sections: page.sections.map((section) => section.title),
        siteUi,
        structuredType: "WebPage",
        ogType: "website"
      });
    });

    seoPages.forEach((page) => {
      routes.push({
        locale: locale.code,
        htmlLang: locale.htmlLang,
        hrefLang: locale.hrefLang,
        basePath: `/${page.slug}`,
        localizedPath: buildLocalePath(locale.code, `/${page.slug}`),
        title: page.seoTitle,
        description: page.description,
        sections: page.heroBullets,
        siteUi,
        structuredType: "Article",
        ogType: "article"
      });
    });

    productPages.forEach((page) => {
      routes.push({
        locale: locale.code,
        htmlLang: locale.htmlLang,
        hrefLang: locale.hrefLang,
        basePath: `/${page.slug}`,
        localizedPath: buildLocalePath(locale.code, `/${page.slug}`),
        title: page.seoTitle,
        description: page.description,
        sections: page.heroBullets,
        siteUi,
        structuredType: page.slug.startsWith("integrations/") ? "TechArticle" : "WebPage",
        ogType: page.slug.startsWith("integrations/") ? "article" : "website"
      });
    });
  }

  return routes;
}

function renderAlternateLinks(basePath) {
  return localeMeta
    .map((locale) => {
      const href = canonicalFor(buildLocalePath(locale.code, basePath));
      return `<link rel="alternate" hreflang="${locale.hrefLang}" href="${href}" data-leadcue-prerender="alternate" />`;
    })
    .concat(`<link rel="alternate" hreflang="x-default" href="${canonicalFor(buildLocalePath("en", basePath))}" data-leadcue-prerender="alternate" />`)
    .join("\n    ");
}

function renderStaticRoot(route) {
  const homeHref = buildLocalePath(route.locale, "/");
  const resourcesHref = `${buildLocalePath(route.locale, "/")}#resources`;
  const startHref = localizeHref(route.locale, "/signup?plan=free");
  const navTrail =
    route.basePath === "/"
      ? `<a href="${homeHref}">${escapeHtml(route.siteUi.common.brand)}</a>`
      : `<a href="${homeHref}">${escapeHtml(route.siteUi.common.brand)}</a> / <a href="${resourcesHref}">${escapeHtml(route.siteUi.common.resources)}</a>`;

  return `<main class="prerendered-seo" aria-label="${escapeHtml(route.title)}">
    <nav>${navTrail}</nav>
    <h1>${escapeHtml(route.title.replace(" | LeadCue", ""))}</h1>
    <p>${escapeHtml(route.description)}</p>
    <ul>${route.sections.map((section) => `<li>${escapeHtml(section)}</li>`).join("")}</ul>
    <p><a href="${startHref}">${escapeHtml(route.siteUi.common.startFreeScan)}</a></p>
  </main>`;
}

function setHtmlLang(baseHtml, htmlLang) {
  if (/<html[^>]*\slang=/i.test(baseHtml)) {
    return baseHtml.replace(/<html([^>]*)\slang="[^"]*"([^>]*)>/i, `<html$1 lang="${htmlLang}"$2>`);
  }

  return baseHtml.replace(/<html([^>]*)>/i, `<html$1 lang="${htmlLang}">`);
}

function upsertDescriptionMeta(baseHtml, description) {
  const tag = `<meta name="description" content="${escapeHtml(description)}" />`;

  if (/meta\s+name="description"/i.test(baseHtml)) {
    return baseHtml.replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i, tag);
  }

  return baseHtml.replace("</head>", `  ${tag}\n</head>`);
}

function injectHead(baseHtml, route) {
  const canonical = canonicalFor(route.localizedPath);
  const image = canonicalFor("/images/leadcue-og-card.svg");
  const structuredData = JSON.stringify({
    "@context": "https://schema.org",
    "@type": route.structuredType,
    name: route.title,
    description: route.description,
    url: canonical,
    inLanguage: route.htmlLang,
    publisher: {
      "@type": "Organization",
      name: route.siteUi.common.brand,
      url: siteUrl
    }
  });

  let html = setHtmlLang(baseHtml, route.htmlLang).replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(route.title)}</title>`);
  html = upsertDescriptionMeta(html, route.description);
  html = html.replace(
    "</head>",
    `    <link rel="canonical" href="${canonical}" />
    ${renderAlternateLinks(route.basePath)}
    <meta name="robots" content="index,follow" />
    <meta property="og:title" content="${escapeHtml(route.title)}" />
    <meta property="og:description" content="${escapeHtml(route.description)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:type" content="${route.ogType}" />
    <meta property="og:site_name" content="${escapeHtml(route.siteUi.common.brand)}" />
    <meta property="og:locale" content="${route.hrefLang}" />
    <meta property="og:image" content="${image}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(route.title)}" />
    <meta name="twitter:description" content="${escapeHtml(route.description)}" />
    <meta name="twitter:image" content="${image}" />
    <script type="application/ld+json">${structuredData.replace(/</g, "\\u003c")}</script>
  </head>`
  );

  return html.replace('<div id="root"></div>', `<div id="root">${renderStaticRoot(route)}</div>`);
}

const baseHtml = await readFile(path.join(distDir, "index.html"), "utf8");
const bundles = await loadBundles();
const publicRoutes = buildRoutes(bundles);

await Promise.all(
  publicRoutes.map(async (route) => {
    const html = injectHead(baseHtml, route);
    const targetDir = route.localizedPath === "/" ? distDir : path.join(distDir, route.localizedPath.slice(1));
    await mkdir(targetDir, { recursive: true });
    await writeFile(path.join(targetDir, "index.html"), html);
  })
);

console.log(`Prerendered ${publicRoutes.length} localized public pages.`);
