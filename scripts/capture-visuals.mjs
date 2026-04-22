import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));
const outputDir = join(rootDir, ".codex-screenshots");
const baseUrl = process.env.VISUAL_URL ?? "http://127.0.0.1:5173";

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch();

async function openPage(viewport) {
  const page = await browser.newPage({ viewport });
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.waitForTimeout(700);
  return page;
}

const desktop = await openPage({ width: 1440, height: 1000 });
await desktop.screenshot({ path: join(outputDir, "hero-after-desktop.png") });
await desktop.locator(".feature-section").screenshot({ path: join(outputDir, "features-after-desktop.png") });
await desktop.locator("#pricing").screenshot({ path: join(outputDir, "pricing-after-desktop.png") });
await desktop.locator("#faq").screenshot({ path: join(outputDir, "faq-after-desktop.png") });
await desktop.locator("#resources").screenshot({ path: join(outputDir, "resources-after-desktop.png") });
await desktop.locator("#start").screenshot({ path: join(outputDir, "start-after-desktop.png") });
await desktop.goto(`${baseUrl}/signup?plan=pro`, { waitUntil: "networkidle" });
await desktop.waitForTimeout(700);
await desktop.screenshot({ path: join(outputDir, "signup-after-desktop.png") });
await desktop.getByLabel("Work email").fill("visual-check@agency.com");
await desktop.getByLabel("Agency focus").selectOption("seo");
await desktop.getByLabel("Agency website").fill("https://northstar.agency");
await desktop.getByRole("button", { name: "Continue" }).click();
await desktop.waitForTimeout(400);
await desktop.screenshot({ path: join(outputDir, "signup-step-two-after-desktop.png") });
await desktop.goto(`${baseUrl}/login`, { waitUntil: "networkidle" });
await desktop.waitForTimeout(700);
await desktop.screenshot({ path: join(outputDir, "login-after-desktop.png") });
await desktop.goto(`${baseUrl}/docs`, { waitUntil: "networkidle" });
await desktop.waitForTimeout(700);
await desktop.screenshot({ path: join(outputDir, "docs-after-desktop.png") });
await desktop.goto(`${baseUrl}/contact`, { waitUntil: "networkidle" });
await desktop.waitForTimeout(700);
await desktop.screenshot({ path: join(outputDir, "contact-after-desktop.png") });
await desktop.goto(`${baseUrl}/support`, { waitUntil: "networkidle" });
await desktop.waitForTimeout(700);
await desktop.screenshot({ path: join(outputDir, "support-after-desktop.png") });
await desktop.goto(`${baseUrl}/app`, { waitUntil: "networkidle" });
await desktop.waitForTimeout(900);
await desktop.screenshot({ path: join(outputDir, "dashboard-after-desktop.png") });
await desktop.locator("#scan-console").screenshot({ path: join(outputDir, "scan-console-after-desktop.png") });
await desktop.goto(`${baseUrl}/app/leads`, { waitUntil: "networkidle" });
await desktop.waitForTimeout(700);
await desktop.screenshot({ path: join(outputDir, "app-leads-after-desktop.png") });
await desktop.goto(`${baseUrl}/app/settings/icp`, { waitUntil: "networkidle" });
await desktop.waitForTimeout(700);
await desktop.screenshot({ path: join(outputDir, "app-icp-after-desktop.png") });
await desktop.goto(`${baseUrl}/app/billing`, { waitUntil: "networkidle" });
await desktop.waitForTimeout(700);
await desktop.screenshot({ path: join(outputDir, "app-billing-after-desktop.png") });
await desktop.close();

const mobile = await openPage({ width: 390, height: 900 });
await mobile.screenshot({ path: join(outputDir, "hero-after-mobile.png") });
await mobile.locator("#faq").screenshot({ path: join(outputDir, "faq-after-mobile.png") });
await mobile.locator("#resources").screenshot({ path: join(outputDir, "resources-after-mobile.png") });
await mobile.locator("#start").screenshot({ path: join(outputDir, "start-after-mobile.png") });
await mobile.goto(`${baseUrl}/signup?plan=pro`, { waitUntil: "networkidle" });
await mobile.waitForTimeout(700);
await mobile.screenshot({ path: join(outputDir, "signup-after-mobile.png") });
await mobile.getByLabel("Work email").fill("visual-check@agency.com");
await mobile.getByLabel("Agency focus").selectOption("seo");
await mobile.getByLabel("Agency website").fill("https://northstar.agency");
await mobile.getByRole("button", { name: "Continue" }).click();
await mobile.waitForTimeout(400);
await mobile.screenshot({ path: join(outputDir, "signup-step-two-after-mobile.png") });
await mobile.goto(`${baseUrl}/login`, { waitUntil: "networkidle" });
await mobile.waitForTimeout(700);
await mobile.screenshot({ path: join(outputDir, "login-after-mobile.png") });
await mobile.goto(`${baseUrl}/docs`, { waitUntil: "networkidle" });
await mobile.waitForTimeout(700);
await mobile.screenshot({ path: join(outputDir, "docs-after-mobile.png") });
await mobile.goto(`${baseUrl}/support`, { waitUntil: "networkidle" });
await mobile.waitForTimeout(700);
await mobile.screenshot({ path: join(outputDir, "support-after-mobile.png") });
await mobile.goto(`${baseUrl}/app`, { waitUntil: "networkidle" });
await mobile.waitForTimeout(900);
await mobile.screenshot({ path: join(outputDir, "dashboard-after-mobile.png") });
await mobile.locator("#scan-console").screenshot({ path: join(outputDir, "scan-console-after-mobile.png") });
await mobile.goto(`${baseUrl}/app/leads`, { waitUntil: "networkidle" });
await mobile.waitForTimeout(700);
await mobile.screenshot({ path: join(outputDir, "app-leads-after-mobile.png") });
await mobile.goto(`${baseUrl}/app/billing`, { waitUntil: "networkidle" });
await mobile.waitForTimeout(700);
await mobile.screenshot({ path: join(outputDir, "app-billing-after-mobile.png") });
await mobile.close();

await browser.close();

console.log(`Visual screenshots saved to ${outputDir}`);
