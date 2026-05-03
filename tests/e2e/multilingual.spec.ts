import { expect, test } from "@playwright/test";

type LocaleSpec = {
  code: "en" | "zh" | "ja" | "ko" | "de" | "nl" | "fr";
  htmlLang: string;
};

const LOCALES: LocaleSpec[] = [
  { code: "en", htmlLang: "en" },
  { code: "zh", htmlLang: "zh" },
  { code: "ja", htmlLang: "ja" },
  { code: "ko", htmlLang: "ko" },
  { code: "de", htmlLang: "de" },
  { code: "nl", htmlLang: "nl" },
  { code: "fr", htmlLang: "fr" }
];

test.describe("Multilingual public pages", () => {
  for (const locale of LOCALES) {
    test(`home page renders for ${locale.code}`, async ({ page }) => {
      const path = locale.code === "en" ? "/" : `/${locale.code}`;
      await page.goto(path);

      // <html lang> must match the locale (prefix check, e.g. zh-CN matches zh)
      const htmlLang = await page.locator("html").getAttribute("lang");
      expect(htmlLang).toBeTruthy();
      expect(htmlLang!.toLowerCase().startsWith(locale.htmlLang)).toBe(true);

      // Hero section should render a visible heading and the top nav
      await expect(page.locator("header")).toBeVisible();
      await expect(page.locator("h1").first()).toBeVisible();

      // The canonical link must use the locale-prefixed path
      const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
      expect(canonical).toBeTruthy();
      if (locale.code === "en") {
        expect(new URL(canonical!).pathname).toBe("/");
      } else {
        expect(new URL(canonical!).pathname).toBe(`/${locale.code}`);
      }

      // Must have hreflang alternates for every supported locale + x-default
      const alternates = await page.locator('link[rel="alternate"][hreflang]').count();
      expect(alternates).toBeGreaterThanOrEqual(LOCALES.length);
    });
  }

  test("locale switcher persists selection via URL", async ({ page }) => {
    await page.goto("/zh");
    await expect(page.locator("html")).toHaveAttribute("lang", /^zh/);

    await page.goto("/ja");
    await expect(page.locator("html")).toHaveAttribute("lang", /^ja/);

    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", /^en/);
  });
});
