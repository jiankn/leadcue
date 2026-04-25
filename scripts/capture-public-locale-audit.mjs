import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const outputDir = path.join(repoRoot, "tmp", "locale-audit", "screenshots");
const outputJsonPath = path.join(repoRoot, "tmp", "locale-audit", "screenshot-summary.json");
const baseUrl = process.env.VISUAL_URL ?? "http://127.0.0.1:5173";
const locales = ["en", "zh", "ja", "ko", "de", "nl", "fr"];
const routes = [
  { key: "home", path: "/" },
  { key: "login", path: "/login" },
  { key: "seo", path: "/website-prospecting" },
  { key: "product", path: "/templates/cold-email-first-line" }
];

function buildLocalizedPath(locale, pathname) {
  if (locale === "en") {
    return pathname;
  }

  return pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;
}

function resolveUrl(locale, pathname) {
  return `${baseUrl}${buildLocalizedPath(locale, pathname)}`;
}

async function readVisibleTexts(locator, maxCount = 4) {
  const texts = [];
  const count = await locator.count();

  for (let index = 0; index < count && texts.length < maxCount; index += 1) {
    const text = (await locator.nth(index).innerText()).replace(/\s+/g, " ").trim();

    if (text) {
      texts.push(text);
    }
  }

  return texts;
}

async function capturePage(page, locale, route) {
  const url = resolveUrl(locale, route.path);
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(700);

  const title = await page.title();
  const h1 = ((await page.locator("h1").first().textContent()) ?? "").replace(/\s+/g, " ").trim();
  const primaryCtas = await readVisibleTexts(page.locator("main a, main button"));
  const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  const headerHeight = await page.locator("header").first().evaluate((node) => Math.round(node.getBoundingClientRect().height));
  const screenshotPath = path.join(outputDir, `${locale}-${route.key}.png`);

  await page.screenshot({ path: screenshotPath });

  return {
    locale,
    route: route.key,
    url,
    title,
    h1,
    primaryCtas,
    horizontalOverflow,
    headerHeight,
    screenshotPath
  };
}

async function main() {
  await mkdir(outputDir, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1366, height: 980 },
    deviceScaleFactor: 1
  });
  const summary = [];

  try {
    for (const locale of locales) {
      for (const route of routes) {
        summary.push(await capturePage(page, locale, route));
      }
    }
  } finally {
    await page.close();
    await browser.close();
  }

  await writeFile(outputJsonPath, JSON.stringify(summary, null, 2) + "\n", "utf8");

  console.log(`Locale audit screenshots saved to ${outputDir}`);
  console.log(`Locale audit summary saved to ${outputJsonPath}`);
}

await main();
