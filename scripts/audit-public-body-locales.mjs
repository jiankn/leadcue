import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { applyReplacementRules, suspiciousLocalePatterns } from "./public-locale-curation.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const generatedDir = path.join(repoRoot, "apps", "web", "src", "content", "generated");
const outputDir = path.join(repoRoot, "tmp", "locale-audit");
const locales = ["zh", "ja", "ko", "de", "nl", "fr"];

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function shouldSkipPath(pathKey) {
  return (
    /\.slug$/.test(pathKey) ||
    /\.href$/.test(pathKey) ||
    /\.related(\.|$)/.test(pathKey) ||
    /\.updatedAt$/.test(pathKey) ||
    /\.platform$/.test(pathKey) ||
    /\.value$/.test(pathKey)
  );
}

function shouldSkipString(value) {
  return (
    !value ||
    /^https?:\/\//.test(value) ||
    value.startsWith("/") ||
    value.startsWith("#") ||
    value.startsWith("mailto:") ||
    /^\d{4}-\d{2}-\d{2}$/.test(value)
  );
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

  if (
    typeof englishValue === "string" &&
    typeof localeValue === "string" &&
    !shouldSkipPath(pathPrefix) &&
    !shouldSkipString(localeValue)
  ) {
    entries.push({ bundleName, path: pathPrefix, source: englishValue, localized: localeValue });
  }

  return entries;
}

function collectIssuesForLocale(locale, entries) {
  const issues = [];

  for (const entry of entries) {
    for (const rule of suspiciousLocalePatterns[locale] ?? []) {
      rule.pattern.lastIndex = 0;

      if (!rule.pattern.test(entry.localized)) {
        continue;
      }

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

  issues.sort((left, right) => left.path.localeCompare(right.path));
  return issues;
}

function renderMarkdown(report) {
  const lines = ["# Public Body Locale Audit", ""];

  for (const locale of locales) {
    const localeReport = report[locale];
    lines.push(`## ${locale}`);
    lines.push("");
    lines.push(`- audited strings: ${localeReport.auditedCount}`);
    lines.push(`- issues: ${localeReport.issues.length}`);
    lines.push("");

    if (!localeReport.issues.length) {
      lines.push("- No suspicious body-copy phrases found.");
      lines.push("");
      continue;
    }

    localeReport.issues.slice(0, 120).forEach((issue) => {
      lines.push(`- [${issue.severity}] ${issue.path}: ${issue.reason}`);
      lines.push(`  source: ${issue.source}`);
      lines.push(`  current: ${issue.current}`);
      lines.push(`  expected: ${issue.expected}`);
    });
    lines.push("");
  }

  return lines.join("\n");
}

async function main() {
  const siteUi = JSON.parse(await readFile(path.join(generatedDir, "site-ui.locales.json"), "utf8"));
  const seoPages = JSON.parse(await readFile(path.join(generatedDir, "seo-pages.locales.json"), "utf8"));
  const productPages = JSON.parse(await readFile(path.join(generatedDir, "product-pages.locales.json"), "utf8"));
  const commercialPages = JSON.parse(await readFile(path.join(generatedDir, "commercial-pages.locales.json"), "utf8"));
  const bundles = { siteUi, seoPages, productPages, commercialPages };
  const report = {};

  for (const locale of locales) {
    const entries = Object.entries(bundles).flatMap(([bundleName, bundle]) =>
      collectStringPairs(bundleName, bundle.en, bundle[locale], "", [])
    );

    report[locale] = {
      auditedCount: entries.length,
      issues: collectIssuesForLocale(locale, entries)
    };
  }

  await mkdir(outputDir, { recursive: true });
  await writeFile(path.join(outputDir, "public-body-locale-audit.json"), JSON.stringify(report, null, 2) + "\n", "utf8");
  await writeFile(path.join(outputDir, "public-body-locale-audit.md"), renderMarkdown(report), "utf8");

  console.log(
    JSON.stringify(
      Object.fromEntries(
        locales.map((locale) => [
          locale,
          {
            auditedCount: report[locale].auditedCount,
            issueCount: report[locale].issues.length
          }
        ])
      ),
      null,
      2
    )
  );
  console.log(`Body audit reports saved to ${outputDir}`);
}

await main();
