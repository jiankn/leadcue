import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  getExpectedOverride,
  localeReplacementRules,
  suspiciousLocalePatterns
} from "./public-locale-curation.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const generatedDir = path.join(repoRoot, "apps", "web", "src", "content", "generated");
const outputDir = path.join(repoRoot, "tmp", "locale-audit");

const locales = ["zh", "ja", "ko", "de", "nl", "fr"];
const allowedEnglishTokens = new Set([
  "LeadCue",
  "Google",
  "HubSpot",
  "Salesforce",
  "Pipedrive",
  "LinkedIn",
  "CRM",
  "CSV",
  "CTA",
  "OAuth",
  "ICP",
  "API"
]);
const cjkLocales = new Set(["zh", "ja", "ko"]);

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function shouldAuditPath(bundleName, pathKey) {
  if (bundleName === "siteUi") {
    return (
      pathKey.startsWith("common.") ||
      pathKey.startsWith("nav.") ||
      pathKey.startsWith("auth.login.") ||
      pathKey.startsWith("auth.reset.") ||
      pathKey.startsWith("auth.signup.") ||
      pathKey.startsWith("home.seo.") ||
      pathKey.startsWith("home.hero.") ||
      pathKey.startsWith("content.seoNav.") ||
      pathKey.startsWith("content.productNav.") ||
      pathKey.startsWith("content.commercialNav.") ||
      pathKey.startsWith("content.breadcrumbs.") ||
      pathKey === "content.faqTitle" ||
      pathKey === "content.ctaTitleSeo" ||
      pathKey === "content.ctaTitleProduct" ||
      pathKey.startsWith("content.toolBand.")
    );
  }

  if (bundleName === "seoPages" || bundleName === "productPages") {
    return /^\[\d+\]\.(title|seoTitle)$/.test(pathKey);
  }

  return false;
}

function collectStringPairs(bundleName, englishValue, localeValue, pathPrefix = "", entries = []) {
  if (Array.isArray(englishValue) && Array.isArray(localeValue)) {
    englishValue.forEach((item, index) => {
      collectStringPairs(bundleName, item, localeValue[index], `${pathPrefix}[${index}]`, entries);
    });
    return entries;
  }

  if (isPlainObject(englishValue) && isPlainObject(localeValue)) {
    Object.keys(englishValue).forEach((key) => {
      const nextPath = pathPrefix ? `${pathPrefix}.${key}` : key;
      collectStringPairs(bundleName, englishValue[key], localeValue[key], nextPath, entries);
    });
    return entries;
  }

  if (typeof englishValue === "string" && typeof localeValue === "string" && shouldAuditPath(bundleName, pathPrefix)) {
    entries.push({ bundleName, path: pathPrefix, source: englishValue, localized: localeValue });
  }

  return entries;
}

function englishLeakScore(value) {
  const tokens = value.match(/[A-Za-z][A-Za-z'-]+/g) ?? [];
  const suspicious = tokens.filter((token) => !allowedEnglishTokens.has(token));
  return suspicious.length;
}

function ctaLengthThreshold(entry) {
  if (/content\.ctaTitle/i.test(entry.path)) {
    return 52;
  }

  if (/Cta|button|signIn|startFree|openSampleCard|reviewPlans/i.test(entry.path)) {
    return 32;
  }

  if (/seoTitle/i.test(entry.path)) {
    return 84;
  }

  if (/\.title$/i.test(entry.path)) {
    return 84;
  }

  return 0;
}

function applyReplacementRules(locale, value) {
  return (localeReplacementRules[locale] ?? []).reduce((current, [pattern, replacement]) => current.replace(pattern, replacement), value);
}

function collectIssuesForLocale(locale, entries) {
  const issues = [];
  const seenSourceVariants = new Map();

  for (const entry of entries) {
    const expected = getExpectedOverride(locale, entry.source);

    if (expected && entry.localized !== expected) {
      issues.push({
        severity: "P0",
        type: "override_mismatch",
        path: `${entry.bundleName}.${entry.path}`,
        source: entry.source,
        current: entry.localized,
        expected,
        reason: "Curated high-value translation is not applied"
      });
    }

    for (const rule of suspiciousLocalePatterns[locale] ?? []) {
      rule.pattern.lastIndex = 0;
      if (rule.pattern.test(entry.localized)) {
        issues.push({
          severity: "P1",
          type: "suspicious_phrase",
          path: `${entry.bundleName}.${entry.path}`,
          source: entry.source,
          current: entry.localized,
          expected: applyReplacementRules(locale, entry.localized),
          reason: rule.reason
        });
      }
    }

    const threshold = ctaLengthThreshold(entry);
    if (threshold && entry.localized.length > threshold) {
      issues.push({
        severity: "P2",
        type: "length_risk",
        path: `${entry.bundleName}.${entry.path}`,
        source: entry.source,
        current: entry.localized,
        expected: null,
        reason: `Localized string length ${entry.localized.length} exceeds threshold ${threshold}`
      });
    }

    const leakCount = cjkLocales.has(locale) ? englishLeakScore(entry.localized) : 0;
    if (leakCount >= 4 && !entry.localized.includes("LeadCue")) {
      issues.push({
        severity: "P2",
        type: "english_leak",
        path: `${entry.bundleName}.${entry.path}`,
        source: entry.source,
        current: entry.localized,
        expected: null,
        reason: "Localized string still contains a large amount of English text"
      });
    }

    const variants = seenSourceVariants.get(entry.source) ?? new Set();
    variants.add(entry.localized);
    seenSourceVariants.set(entry.source, variants);
  }

  for (const [source, variants] of seenSourceVariants) {
    if (variants.size > 1) {
      issues.push({
        severity: "P2",
        type: "inconsistent_translation",
        path: "(multiple)",
        source,
        current: Array.from(variants).join(" | "),
        expected: null,
        reason: "Same source string appears with multiple translations in high-value UI/content"
      });
    }
  }

  const severityOrder = { P0: 0, P1: 1, P2: 2 };
  issues.sort((left, right) => severityOrder[left.severity] - severityOrder[right.severity] || left.path.localeCompare(right.path));
  return issues;
}

function renderMarkdown(report) {
  const lines = ["# Public Locale Audit", ""];

  for (const locale of locales) {
    const localeReport = report[locale];
    lines.push(`## ${locale}`);
    lines.push("");
    lines.push(`- audited strings: ${localeReport.auditedCount}`);
    lines.push(`- issues: ${localeReport.issues.length}`);
    lines.push(`- P0: ${localeReport.issues.filter((issue) => issue.severity === "P0").length}`);
    lines.push(`- P1: ${localeReport.issues.filter((issue) => issue.severity === "P1").length}`);
    lines.push(`- P2: ${localeReport.issues.filter((issue) => issue.severity === "P2").length}`);
    lines.push("");

    if (!localeReport.issues.length) {
      lines.push("- No issues found in audited high-value fields.");
      lines.push("");
      continue;
    }

    localeReport.issues.slice(0, 60).forEach((issue) => {
      lines.push(`- [${issue.severity}] ${issue.path}: ${issue.reason}`);
      lines.push(`  source: ${issue.source}`);
      lines.push(`  current: ${issue.current}`);
      if (issue.expected) {
        lines.push(`  expected: ${issue.expected}`);
      }
    });
    lines.push("");
  }

  return lines.join("\n");
}

async function main() {
  const siteUi = JSON.parse(await readFile(path.join(generatedDir, "site-ui.locales.json"), "utf8"));
  const seoPages = JSON.parse(await readFile(path.join(generatedDir, "seo-pages.locales.json"), "utf8"));
  const productPages = JSON.parse(await readFile(path.join(generatedDir, "product-pages.locales.json"), "utf8"));

  const bundles = { siteUi, seoPages, productPages };
  const report = {};

  for (const locale of locales) {
    const entries = Object.entries(bundles).flatMap(([bundleName, bundle]) =>
      collectStringPairs(bundleName, bundle.en, bundle[locale], "", [])
    );
    const issues = collectIssuesForLocale(locale, entries);
    report[locale] = {
      auditedCount: entries.length,
      issues
    };
  }

  await mkdir(outputDir, { recursive: true });
  await writeFile(path.join(outputDir, "public-locale-audit.json"), JSON.stringify(report, null, 2) + "\n", "utf8");
  await writeFile(path.join(outputDir, "public-locale-audit.md"), renderMarkdown(report), "utf8");

  console.log(JSON.stringify(Object.fromEntries(locales.map((locale) => [locale, {
    auditedCount: report[locale].auditedCount,
    issueCount: report[locale].issues.length,
    p0: report[locale].issues.filter((issue) => issue.severity === "P0").length,
    p1: report[locale].issues.filter((issue) => issue.severity === "P1").length,
    p2: report[locale].issues.filter((issue) => issue.severity === "P2").length
  }])), null, 2));
  console.log(`Audit reports saved to ${outputDir}`);
}

await main();
