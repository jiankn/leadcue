import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { filterReadyPages, getRouteAlternateLocales, loadLocalizedPageReadiness } from "./localized-page-readiness.mjs";
import { applyLocalizedSeoStrategy, loadLocalizedSeoStrategy } from "./localized-seo-strategy.mjs";
import {
  buildLocalePath,
  escapeHtml,
  generatedDir,
  getSeoImageAlt,
  getSeoImagePath,
  homeKeywordPath,
  localeMeta,
  renderVerificationMetaTags,
  repoRoot,
  siteUrl
} from "./seo-utils.mjs";

const distDir = path.join(repoRoot, "apps", "web", "dist");

function normalizePath(pathname) {
  if (!pathname) {
    return "/";
  }

  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return normalized !== "/" ? normalized.replace(/\/+$/, "") || "/" : normalized;
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

function getHomeKeywordList(homeKeywords) {
  return [
    homeKeywords.primaryKeyword,
    ...(homeKeywords.secondaryKeywords ?? []),
    ...(homeKeywords.longTailKeywords ?? [])
  ];
}

function makeContentAnchor(value) {
  const asciiAnchor = value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (asciiAnchor) {
    return asciiAnchor;
  }

  const unicodeAnchor = Array.from(value.trim())
    .map((char) => char.codePointAt(0)?.toString(16) ?? "")
    .filter(Boolean)
    .join("-");

  return unicodeAnchor ? `section-${unicodeAnchor}` : "section";
}

async function loadBundles() {
  const [siteUi, seoPages, productPages, commercialPages, homeKeywords] = await Promise.all([
    readFile(path.join(generatedDir, "site-ui.locales.json"), "utf8"),
    readFile(path.join(generatedDir, "seo-pages.locales.json"), "utf8"),
    readFile(path.join(generatedDir, "product-pages.locales.json"), "utf8"),
    readFile(path.join(generatedDir, "commercial-pages.locales.json"), "utf8"),
    readFile(homeKeywordPath, "utf8")
  ]);

  return {
    siteUi: JSON.parse(siteUi),
    seoPages: JSON.parse(seoPages),
    productPages: JSON.parse(productPages),
    commercialPages: JSON.parse(commercialPages),
    homeKeywords: JSON.parse(homeKeywords)
  };
}

async function applySeoStrategyToBundles(bundles) {
  const localizedSeoStrategy = await loadLocalizedSeoStrategy();
  const localeData = applyLocalizedSeoStrategy(
    Object.fromEntries(
      localeMeta.map((locale) => [
        locale.code,
        {
          siteUi: bundles.siteUi[locale.code] ?? bundles.siteUi.en,
          seoPages: bundles.seoPages[locale.code] ?? bundles.seoPages.en,
          productPages: bundles.productPages[locale.code] ?? bundles.productPages.en,
          commercialPages: bundles.commercialPages[locale.code] ?? bundles.commercialPages.en
        }
      ])
    ),
    localizedSeoStrategy
  );

  return {
    siteUi: Object.fromEntries(Object.entries(localeData).map(([locale, bundle]) => [locale, bundle.siteUi])),
    seoPages: Object.fromEntries(Object.entries(localeData).map(([locale, bundle]) => [locale, bundle.seoPages])),
    productPages: Object.fromEntries(Object.entries(localeData).map(([locale, bundle]) => [locale, bundle.productPages])),
    commercialPages: Object.fromEntries(Object.entries(localeData).map(([locale, bundle]) => [locale, bundle.commercialPages])),
    homeKeywords: bundles.homeKeywords
  };
}

function buildRelatedLinks(slugs, seoPageMap, productPageMap) {
  return slugs
    .map((slug) => {
      const page = productPageMap[slug] ?? seoPageMap[slug];

      if (!page) {
        return null;
      }

      return {
        href: `/${page.slug}`,
        label: page.title,
        meta: page.category
      };
    })
    .filter(Boolean);
}

function buildRoutes(bundles, pageReadiness) {
  const routes = [];

  for (const locale of localeMeta) {
    const siteUi = bundles.siteUi[locale.code] ?? bundles.siteUi.en;
    const seoPages = filterReadyPages(pageReadiness, "seoPages", bundles.seoPages[locale.code] ?? bundles.seoPages.en, locale.code);
    const productPages = filterReadyPages(pageReadiness, "productPages", bundles.productPages[locale.code] ?? bundles.productPages.en, locale.code);
    const commercialPages = bundles.commercialPages[locale.code] ?? bundles.commercialPages.en;
    const homeKeywords = bundles.homeKeywords[locale.code] ?? bundles.homeKeywords.en;
    const seoPageMap = Object.fromEntries(seoPages.map((page) => [page.slug, page]));
    const productPageMap = Object.fromEntries(productPages.map((page) => [page.slug, page]));
    const homeRoute = { kind: "home", slug: "home" };

    routes.push({
      locale: locale.code,
      htmlLang: locale.htmlLang,
      hrefLang: locale.hrefLang,
      basePath: "/",
      localizedPath: buildLocalePath(locale.code, "/"),
      title: siteUi.home.seo.title,
      heading: `${siteUi.home.hero.titleLead} ${siteUi.home.hero.titleAccent}`,
      description: siteUi.home.seo.description,
      keywords: getHomeKeywordList(homeKeywords),
      sections: [
        {
          title: siteUi.home.features.title,
          copy: siteUi.home.features.copy,
          items: siteUi.home.features.items.map((item) => item.title)
        },
        {
          title: siteUi.home.workflow.title,
          copy: siteUi.home.hero.subhead,
          items: siteUi.home.workflow.steps.map((step) => step.title)
        },
        {
          title: siteUi.home.resources.titleLead,
          copy: siteUi.home.resources.copy,
          items: siteUi.home.resources.items.map((item) => item.title)
        }
      ],
      faqItems: siteUi.home.faqSection.items,
      relatedLinks: [...seoPages.slice(0, 3), ...productPages.slice(0, 3)].map((page) => ({
        href: `/${page.slug}`,
        label: page.title,
        meta: page.category
      })),
      cta: {
        href: "/signup?plan=free",
        label: siteUi.common.startFreeScan
      },
      alternateLocales: getRouteAlternateLocales(pageReadiness, homeRoute, localeMeta),
      siteUi,
      structuredType: "WebSite",
      ogType: "website"
    });

    Object.entries(commercialPages).forEach(([slug, page]) => {
      const routeDescriptor = { kind: "commercialPages", slug };

      routes.push({
        locale: locale.code,
        htmlLang: locale.htmlLang,
        hrefLang: locale.hrefLang,
        basePath: `/${slug}`,
        localizedPath: buildLocalePath(locale.code, `/${slug}`),
        title: `${page.title} | ${siteUi.common.brand}`,
        heading: page.title,
        description: page.summary,
        keywords: [page.eyebrow, ...page.sections.map((section) => section.title)],
        sections: page.sections,
        faqItems: [],
        relatedLinks: [page.primaryAction, page.secondaryAction]
          .filter(Boolean)
          .map((action) => ({
            href: action.href,
            label: action.label,
            meta: page.eyebrow
          })),
        cta: page.primaryAction,
        alternateLocales: getRouteAlternateLocales(pageReadiness, routeDescriptor, localeMeta),
        siteUi,
        structuredType: "WebPage",
        ogType: "website"
      });
    });

    seoPages.forEach((page) => {
      const routeDescriptor = { kind: "seoPages", slug: page.slug };

      routes.push({
        locale: locale.code,
        htmlLang: locale.htmlLang,
        hrefLang: locale.hrefLang,
        basePath: `/${page.slug}`,
        localizedPath: buildLocalePath(locale.code, `/${page.slug}`),
        title: page.seoTitle,
        heading: page.title,
        description: page.description,
        keywords: [page.primaryKeyword, ...page.secondaryKeywords],
        sections: page.sections,
        example: page.example,
        faqItems: page.faqs,
        relatedLinks: buildRelatedLinks(page.related, seoPageMap, productPageMap),
        cta: {
          href: "/signup?plan=free",
          label: siteUi.common.startFreeScan
        },
        alternateLocales: getRouteAlternateLocales(pageReadiness, routeDescriptor, localeMeta),
        siteUi,
        structuredType: "Article",
        ogType: "article"
      });
    });

    productPages.forEach((page) => {
      const routeDescriptor = { kind: "productPages", slug: page.slug };

      routes.push({
        locale: locale.code,
        htmlLang: locale.htmlLang,
        hrefLang: locale.hrefLang,
        basePath: `/${page.slug}`,
        localizedPath: buildLocalePath(locale.code, `/${page.slug}`),
        title: page.seoTitle,
        heading: page.title,
        description: page.description,
        keywords: [page.primaryKeyword, ...page.secondaryKeywords],
        sections: page.sections,
        faqItems: page.faqs,
        relatedLinks: buildRelatedLinks(page.related, seoPageMap, productPageMap),
        cta: {
          href: "/signup?plan=free",
          label: siteUi.common.startFreeScan
        },
        alternateLocales: getRouteAlternateLocales(pageReadiness, routeDescriptor, localeMeta),
        siteUi,
        structuredType: page.slug.startsWith("integrations/") ? "TechArticle" : "WebPage",
        ogType: page.slug.startsWith("integrations/") ? "article" : "website"
      });
    });
  }

  return routes;
}

function renderAlternateLinks(route) {
  return route.alternateLocales
    .map((locale) => {
      const href = canonicalFor(buildLocalePath(locale.code, route.basePath));
      return `<link rel="alternate" hreflang="${locale.hrefLang}" href="${href}" data-leadcue-prerender="alternate" />`;
    })
    .concat(`<link rel="alternate" hreflang="x-default" href="${canonicalFor(buildLocalePath(route.alternateLocales.find((locale) => locale.code === "en")?.code ?? route.alternateLocales[0]?.code ?? route.locale, route.basePath))}" data-leadcue-prerender="alternate" />`)
    .join("\n    ");
}

function renderStaticRoot(route) {
  const breadcrumbItems = [
    `<a href="${buildLocalePath(route.locale, "/")}">${escapeHtml(route.siteUi.common.brand)}</a>`,
    route.basePath === "/" ? "" : `<span>/</span><a href="${buildLocalePath(route.locale, "/")}#resources">${escapeHtml(route.siteUi.common.resources)}</a>`,
    route.basePath === "/" ? "" : `<span>/</span><strong>${escapeHtml(route.heading)}</strong>`
  ]
    .filter(Boolean)
    .join("");
  const keywordList = route.keywords.length
    ? `<div class="prerender-keywords">${route.keywords.map((keyword) => `<span>${escapeHtml(keyword)}</span>`).join("")}</div>`
    : "";
  const sections = route.sections
    .map(
      (section) => `<section class="prerender-section" id="${makeContentAnchor(section.title)}">
        <h2>${escapeHtml(section.title)}</h2>
        <p>${escapeHtml(section.copy)}</p>
        <ul>${section.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </section>`
    )
    .join("");
  const example = route.example
    ? `<section class="prerender-section" id="example">
      <h2>${escapeHtml(route.example.title)}</h2>
      <p>${escapeHtml(route.example.copy)}</p>
      <ul>${route.example.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
    </section>`
    : "";
  const faq = route.faqItems.length
    ? `<section class="prerender-section" id="faq">
      <h2>${escapeHtml(route.siteUi.common.faq)}</h2>
      ${route.faqItems
        .map(
          (item) => `<details><summary>${escapeHtml(item.question)}</summary><p>${escapeHtml(item.answer)}</p></details>`
        )
        .join("")}
    </section>`
    : "";
  const relatedLinks = route.relatedLinks.length
    ? `<section class="prerender-section">
      <h2>${escapeHtml(route.siteUi.common.relatedResources)}</h2>
      <ul>${route.relatedLinks
        .map(
          (item) =>
            `<li><a href="${escapeHtml(localizeHref(route.locale, item.href))}">${escapeHtml(item.label)}</a><span> - ${escapeHtml(item.meta)}</span></li>`
        )
        .join("")}</ul>
    </section>`
    : "";
  const cta = route.cta
    ? `<p class="prerender-cta"><a href="${escapeHtml(localizeHref(route.locale, route.cta.href))}">${escapeHtml(route.cta.label)}</a></p>`
    : "";

  return `<main class="prerendered-seo" aria-label="${escapeHtml(route.heading)}">
    <nav>${breadcrumbItems}</nav>
    <h1>${escapeHtml(route.heading)}</h1>
    <p>${escapeHtml(route.description)}</p>
    ${keywordList}
    ${sections}
    ${example}
    ${faq}
    ${relatedLinks}
    ${cta}
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

function upsertKeywordsMeta(baseHtml, keywords) {
  const keywordContent = keywords.filter(Boolean).join(", ");

  if (!keywordContent) {
    return baseHtml.replace(/<meta\s+name="keywords"\s+content="[^"]*"\s*\/?>\s*/i, "");
  }

  const tag = `<meta name="keywords" content="${escapeHtml(keywordContent)}" />`;

  if (/meta\s+name="keywords"/i.test(baseHtml)) {
    return baseHtml.replace(/<meta\s+name="keywords"\s+content="[^"]*"\s*\/?>/i, tag);
  }

  return baseHtml.replace("</head>", `  ${tag}\n</head>`);
}

function injectHead(baseHtml, route) {
  const canonical = canonicalFor(route.localizedPath);
  const imagePath = getSeoImagePath(route.locale, route.basePath);
  const image = canonicalFor(imagePath);
  const imageAlt = getSeoImageAlt(route.title);
  const verificationMetaTags = renderVerificationMetaTags("    ");
  const structuredData = JSON.stringify({
    "@context": "https://schema.org",
    "@type": route.structuredType,
    name: route.title,
    description: route.description,
    url: canonical,
    inLanguage: route.htmlLang,
    image,
    keywords: route.keywords.join(", "),
    publisher: {
      "@type": "Organization",
      name: route.siteUi.common.brand,
      url: siteUrl
    }
  });

  let html = setHtmlLang(baseHtml, route.htmlLang).replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(route.title)}</title>`);
  html = upsertDescriptionMeta(html, route.description);
  html = upsertKeywordsMeta(html, route.keywords);
  html = html.replace(
    "</head>",
    `    <link rel="canonical" href="${canonical}" />
    ${renderAlternateLinks(route)}
    <meta name="robots" content="index,follow" />
    <meta property="og:title" content="${escapeHtml(route.title)}" />
    <meta property="og:description" content="${escapeHtml(route.description)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:type" content="${route.ogType}" />
    <meta property="og:site_name" content="${escapeHtml(route.siteUi.common.brand)}" />
    <meta property="og:locale" content="${route.hrefLang}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:image:alt" content="${escapeHtml(imageAlt)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(route.title)}" />
    <meta name="twitter:description" content="${escapeHtml(route.description)}" />
    <meta name="twitter:image" content="${image}" />
    <meta name="twitter:image:alt" content="${escapeHtml(imageAlt)}" />
${verificationMetaTags}    <script type="application/ld+json">${structuredData.replace(/</g, "\\u003c")}</script>
  </head>`
  );

  return html.replace('<div id="root"></div>', `<div id="root">${renderStaticRoot(route)}</div>`);
}

const baseHtml = await readFile(path.join(distDir, "index.html"), "utf8");
const bundles = await applySeoStrategyToBundles(await loadBundles());
const pageReadiness = await loadLocalizedPageReadiness();
const publicRoutes = buildRoutes(bundles, pageReadiness);

await Promise.all(
  publicRoutes.map(async (route) => {
    const html = injectHead(baseHtml, route);
    const targetDir = route.localizedPath === "/" ? distDir : path.join(distDir, normalizePath(route.localizedPath).slice(1));
    await mkdir(targetDir, { recursive: true });
    await writeFile(path.join(targetDir, "index.html"), html);
  })
);

console.log(`Prerendered ${publicRoutes.length} localized public pages.`);
