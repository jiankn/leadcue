import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { filterReadyPages, loadLocalizedPageReadiness } from "./localized-page-readiness.mjs";
import { applyLocalizedSeoStrategy, loadLocalizedSeoStrategy } from "./localized-seo-strategy.mjs";
import {
  authNoIndexPaths,
  buildLocalePath,
  escapeHtml,
  generatedDir,
  getSeoImageFilename,
  homeKeywordPath,
  localeMeta,
  ogImageDir,
  publicDir,
  siteUrl
} from "./seo-utils.mjs";

function wrapText(value, maxChars, maxLines) {
  const trimmed = value.replace(/\s+/g, " ").trim();

  if (!trimmed) {
    return [];
  }

  if (!trimmed.includes(" ")) {
    const chars = Array.from(trimmed);
    const lines = [];

    for (let index = 0; index < chars.length && lines.length < maxLines; index += maxChars) {
      const slice = chars.slice(index, index + maxChars).join("");
      lines.push(slice);
    }

    if (chars.length > maxChars * maxLines) {
      lines[lines.length - 1] = `${lines.at(-1)?.slice(0, Math.max(0, maxChars - 1)) ?? ""}…`;
    }

    return lines;
  }

  const words = trimmed.split(" ");
  const lines = [];
  let currentLine = "";

  words.forEach((word) => {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;

    if (nextLine.length <= maxChars) {
      currentLine = nextLine;
      return;
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    currentLine = word;
  });

  if (currentLine && lines.length < maxLines) {
    lines.push(currentLine);
  }

  if (lines.length > maxLines) {
    return lines.slice(0, maxLines);
  }

  if (words.join(" ").length > lines.join(" ").length) {
    lines[lines.length - 1] = `${lines.at(-1)?.slice(0, Math.max(0, maxChars - 1)) ?? ""}…`;
  }

  return lines;
}

function renderTextBlock(lines, x, y, fontSize, lineHeight, fill, weight = 700) {
  return lines
    .map(
      (line, index) =>
        `<text x="${x}" y="${y + index * lineHeight}" fill="${fill}" font-family="'Segoe UI', 'Noto Sans', sans-serif" font-size="${fontSize}" font-weight="${weight}">${escapeHtml(line)}</text>`
    )
    .join("\n");
}

function renderChip(text, x, y, width) {
  return `<g transform="translate(${x}, ${y})">
    <rect width="${width}" height="44" rx="22" fill="#114b45" stroke="#1f6d66" />
    <text x="22" y="29" fill="#dffbf3" font-family="'Segoe UI', 'Noto Sans', sans-serif" font-size="20" font-weight="700">${escapeHtml(text)}</text>
  </g>`;
}

function renderOgCard(route) {
  const titleLines = wrapText(route.title, 26, 3);
  const descriptionLines = wrapText(route.description, 52, 3);
  const keywordChips = route.keywords.slice(0, 3).map((keyword) => (keyword.length > 28 ? `${keyword.slice(0, 27)}…` : keyword));

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title desc">
  <title id="title">${escapeHtml(route.title)}</title>
  <desc id="desc">${escapeHtml(route.description)}</desc>
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
      <stop stop-color="#073733" />
      <stop offset="1" stop-color="#0B504A" />
    </linearGradient>
    <linearGradient id="glow" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#96FF6A" />
      <stop offset="1" stop-color="#D9FF85" />
    </linearGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M48 0H0V48" stroke="#165A54" stroke-width="1" opacity="0.45" />
      <circle cx="24" cy="24" r="2.8" fill="#165A54" opacity="0.72" />
    </pattern>
  </defs>
  <rect width="1200" height="630" rx="32" fill="url(#bg)" />
  <rect width="1200" height="630" rx="32" fill="url(#grid)" />
  <circle cx="1030" cy="92" r="120" fill="#96FF6A" opacity="0.16" />
  <circle cx="1140" cy="510" r="150" fill="#FFFFFF" opacity="0.05" />
  <rect x="62" y="56" width="140" height="140" rx="34" fill="#96FF6A" />
  <path d="M149 105C138 93 120 91 106 100C91 109 85 128 91 145C96 161 111 171 127 171C141 171 153 164 161 152" stroke="#083A36" stroke-width="16" stroke-linecap="round" />
  <path d="M162 153L187 178" stroke="#083A36" stroke-width="16" stroke-linecap="round" />
  <circle cx="118" cy="138" r="12" fill="#083A36" />
  <text x="232" y="126" fill="#F7FFFC" font-family="'Segoe UI', 'Noto Sans', sans-serif" font-size="58" font-weight="800">LeadCue</text>
  <text x="232" y="170" fill="#BFE7DD" font-family="'Segoe UI', 'Noto Sans', sans-serif" font-size="26" font-weight="600">${escapeHtml(route.localeName)}</text>
  <g transform="translate(900, 66)">
    <rect width="238" height="58" rx="29" fill="#0D4540" stroke="#1E6A63" />
    <text x="28" y="38" fill="#DFFBF3" font-family="'Segoe UI', 'Noto Sans', sans-serif" font-size="24" font-weight="700">${escapeHtml(route.label)}</text>
  </g>
  <g transform="translate(78, 236)">
    <rect width="330" height="46" rx="23" fill="#0D4540" stroke="#1E6A63" />
    <text x="22" y="30" fill="#96FF6A" font-family="'Segoe UI', 'Noto Sans', sans-serif" font-size="22" font-weight="700">${escapeHtml(route.eyebrow)}</text>
  </g>
  ${renderTextBlock(titleLines, 78, 336, 72, 84, "#F7FFFC", 800)}
  ${renderTextBlock(descriptionLines, 78, 514, 30, 40, "#D3EEE7", 600)}
  ${keywordChips
    .map((keyword, index) => renderChip(keyword, 78 + index * 286, 548, 262))
    .join("\n  ")}
  <rect x="882" y="246" width="258" height="274" rx="28" fill="#0D4540" stroke="#1E6A63" />
  <text x="914" y="302" fill="#BFE7DD" font-family="'Segoe UI', 'Noto Sans', sans-serif" font-size="24" font-weight="700">Qualified fit</text>
  <text x="914" y="386" fill="url(#glow)" font-family="'Segoe UI', 'Noto Sans', sans-serif" font-size="92" font-weight="800">92</text>
  <text x="914" y="432" fill="#D3EEE7" font-family="'Segoe UI', 'Noto Sans', sans-serif" font-size="24" font-weight="600">${escapeHtml(route.supportLine)}</text>
  <rect x="914" y="458" width="194" height="14" rx="7" fill="#135852" />
  <rect x="914" y="458" width="138" height="14" rx="7" fill="#96FF6A" />
</svg>
`;
}

function loadJson(filePath) {
  return readFile(filePath, "utf8").then((contents) => JSON.parse(contents));
}

function getHomeKeywordList(homeKeywordSet) {
  return [
    homeKeywordSet.primaryKeyword,
    ...(homeKeywordSet.secondaryKeywords ?? []),
    ...(homeKeywordSet.longTailKeywords ?? [])
  ];
}

function buildRoutes(bundles, homeKeywords, pageReadiness) {
  const routes = [];

  for (const locale of localeMeta) {
    const siteUi = bundles.siteUi[locale.code] ?? bundles.siteUi.en;
    const seoPages = filterReadyPages(pageReadiness, "seoPages", bundles.seoPages[locale.code] ?? bundles.seoPages.en, locale.code);
    const productPages = filterReadyPages(pageReadiness, "productPages", bundles.productPages[locale.code] ?? bundles.productPages.en, locale.code);
    const commercialPages = bundles.commercialPages[locale.code] ?? bundles.commercialPages.en;
    const homeKeywordSet = homeKeywords[locale.code] ?? homeKeywords.en;

    routes.push({
      locale: locale.code,
      localeName: locale.nativeName,
      basePath: "/",
      label: siteUi.common.brand,
      eyebrow: siteUi.home.hero.eyebrow,
      title: siteUi.home.seo.title.replace(" | LeadCue", ""),
      description: siteUi.home.seo.description,
      keywords: getHomeKeywordList(homeKeywordSet),
      supportLine: siteUi.home.hero.subhead
    });

    Object.entries(commercialPages).forEach(([slug, page]) => {
      routes.push({
        locale: locale.code,
        localeName: locale.nativeName,
        basePath: `/${slug}`,
        label: siteUi.common.resources,
        eyebrow: page.eyebrow,
        title: page.title,
        description: page.summary,
        keywords: [page.eyebrow, ...page.sections.slice(0, 2).map((section) => section.title)],
        supportLine: page.primaryAction.label
      });
    });

    seoPages.forEach((page) => {
      routes.push({
        locale: locale.code,
        localeName: locale.nativeName,
        basePath: `/${page.slug}`,
        label: page.category,
        eyebrow: page.eyebrow,
        title: page.seoTitle.replace(" | LeadCue", ""),
        description: page.description,
        keywords: [page.primaryKeyword, ...page.secondaryKeywords],
        supportLine: page.intent
      });
    });

    productPages.forEach((page) => {
      routes.push({
        locale: locale.code,
        localeName: locale.nativeName,
        basePath: `/${page.slug}`,
        label: page.category,
        eyebrow: page.eyebrow,
        title: page.seoTitle.replace(" | LeadCue", ""),
        description: page.description,
        keywords: [page.primaryKeyword, ...page.secondaryKeywords],
        supportLine: page.intent
      });
    });
  }

  return routes;
}

function renderRobots() {
  const disallowLines = [
    ...authNoIndexPaths,
    ...localeMeta
      .filter((locale) => locale.code !== "en")
      .flatMap((locale) => authNoIndexPaths.map((pathname) => `/${locale.code}${pathname}`))
  ];

  return `User-agent: *
Allow: /
${disallowLines.map((pathname) => `Disallow: ${pathname}`).join("\n")}

Sitemap: ${siteUrl}/sitemap.xml
`;
}

function renderHeaders() {
  const headerLines = [];
  const localizedPrefixes = localeMeta.filter((locale) => locale.code !== "en").map((locale) => `/${locale.code}`);

  const appendRule = (pathname, allowWildcard = false) => {
    headerLines.push(pathname);
    headerLines.push("  X-Robots-Tag: noindex, nofollow");
    headerLines.push("");

    if (allowWildcard) {
      headerLines.push(`${pathname}/*`);
      headerLines.push("  X-Robots-Tag: noindex, nofollow");
      headerLines.push("");
    }
  };

  authNoIndexPaths.forEach((pathname) => {
    appendRule(pathname, pathname === "/app");
  });

  localizedPrefixes.forEach((prefix) => {
    authNoIndexPaths.forEach((pathname) => {
      appendRule(`${prefix}${pathname}`, pathname === "/app");
    });
  });

  return `${headerLines.join("\n").trim()}\n`;
}

async function main() {
  const rawBundles = {
    siteUi: await loadJson(path.join(generatedDir, "site-ui.locales.json")),
    seoPages: await loadJson(path.join(generatedDir, "seo-pages.locales.json")),
    productPages: await loadJson(path.join(generatedDir, "product-pages.locales.json")),
    commercialPages: await loadJson(path.join(generatedDir, "commercial-pages.locales.json"))
  };
  const localizedSeoStrategy = await loadLocalizedSeoStrategy();
  const localeData = applyLocalizedSeoStrategy(
    Object.fromEntries(
      localeMeta.map((locale) => [
        locale.code,
        {
          siteUi: rawBundles.siteUi[locale.code] ?? rawBundles.siteUi.en,
          seoPages: rawBundles.seoPages[locale.code] ?? rawBundles.seoPages.en,
          productPages: rawBundles.productPages[locale.code] ?? rawBundles.productPages.en,
          commercialPages: rawBundles.commercialPages[locale.code] ?? rawBundles.commercialPages.en
        }
      ])
    ),
    localizedSeoStrategy
  );
  const bundles = {
    siteUi: Object.fromEntries(Object.entries(localeData).map(([locale, bundle]) => [locale, bundle.siteUi])),
    seoPages: Object.fromEntries(Object.entries(localeData).map(([locale, bundle]) => [locale, bundle.seoPages])),
    productPages: Object.fromEntries(Object.entries(localeData).map(([locale, bundle]) => [locale, bundle.productPages])),
    commercialPages: Object.fromEntries(Object.entries(localeData).map(([locale, bundle]) => [locale, bundle.commercialPages]))
  };
  const homeKeywords = await loadJson(homeKeywordPath);
  const pageReadiness = await loadLocalizedPageReadiness();
  const routes = buildRoutes(bundles, homeKeywords, pageReadiness);

  await rm(ogImageDir, { recursive: true, force: true });
  await mkdir(ogImageDir, { recursive: true });

  await Promise.all(
    routes.map((route) =>
      writeFile(path.join(ogImageDir, getSeoImageFilename(route.locale, route.basePath)), renderOgCard(route), "utf8")
    )
  );

  await writeFile(path.join(publicDir, "robots.txt"), renderRobots(), "utf8");
  await writeFile(path.join(publicDir, "_headers"), renderHeaders(), "utf8");

  console.log(`Generated ${routes.length} localized OG images in ${ogImageDir}`);
  console.log(`Refreshed robots.txt and _headers for ${localeMeta.length} locales.`);
}

await main();
