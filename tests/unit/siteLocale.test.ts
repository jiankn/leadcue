import { describe, expect, it } from "vitest";
import {
  buildLocalePath,
  defaultSiteLocale,
  getLocaleHtmlLang,
  isSiteLocale,
  localizeHref,
  parseSiteLocalePath,
  supportedSiteLocales
} from "../../apps/web/src/siteLocale";

describe("parseSiteLocalePath", () => {
  it("defaults to en for plain paths", () => {
    expect(parseSiteLocalePath("/")).toEqual({ locale: "en", path: "/" });
    expect(parseSiteLocalePath("/app")).toEqual({ locale: "en", path: "/app" });
    expect(parseSiteLocalePath("/templates/crm-csv-field-mapping")).toEqual({
      locale: "en",
      path: "/templates/crm-csv-field-mapping"
    });
  });

  it("recognizes every supported locale prefix", () => {
    for (const code of supportedSiteLocales) {
      if (code === defaultSiteLocale) continue;
      expect(parseSiteLocalePath(`/${code}`)).toEqual({ locale: code, path: "/" });
      expect(parseSiteLocalePath(`/${code}/app`)).toEqual({ locale: code, path: "/app" });
    }
  });

  it("strips trailing slashes", () => {
    expect(parseSiteLocalePath("/zh/app/")).toEqual({ locale: "zh", path: "/app" });
  });

  it("ignores unknown prefixes", () => {
    expect(parseSiteLocalePath("/xx/app")).toEqual({ locale: "en", path: "/xx/app" });
  });
});

describe("buildLocalePath", () => {
  it("returns plain path for default locale", () => {
    expect(buildLocalePath("en", "/app")).toBe("/app");
    expect(buildLocalePath("en", "/")).toBe("/");
  });

  it("adds locale prefix for non-default locales", () => {
    expect(buildLocalePath("zh", "/")).toBe("/zh");
    expect(buildLocalePath("zh", "/app")).toBe("/zh/app");
    expect(buildLocalePath("ja", "/pricing")).toBe("/ja/pricing");
  });

  it("idempotent against already-prefixed paths", () => {
    expect(buildLocalePath("zh", "/zh/app")).toBe("/zh/app");
    expect(buildLocalePath("ja", "/en/app")).toBe("/ja/app");
  });
});

describe("localizeHref", () => {
  it("passes through external and protocol links", () => {
    expect(localizeHref("zh", "https://example.com")).toBe("https://example.com");
    expect(localizeHref("zh", "mailto:a@b.com")).toBe("mailto:a@b.com");
    expect(localizeHref("zh", "#top")).toBe("#top");
  });

  it("preserves query and hash", () => {
    expect(localizeHref("zh", "/app?plan=free#scan-console")).toBe("/zh/app?plan=free#scan-console");
  });

  it("default locale leaves path untouched", () => {
    expect(localizeHref("en", "/app?plan=free#scan-console")).toBe("/app?plan=free#scan-console");
  });
});

describe("isSiteLocale", () => {
  it("accepts supported codes", () => {
    for (const code of supportedSiteLocales) {
      expect(isSiteLocale(code)).toBe(true);
    }
  });

  it("rejects everything else", () => {
    expect(isSiteLocale("xx")).toBe(false);
    expect(isSiteLocale("")).toBe(false);
    expect(isSiteLocale(null)).toBe(false);
    expect(isSiteLocale(undefined)).toBe(false);
  });
});

describe("getLocaleHtmlLang", () => {
  it("maps each locale to a BCP-47 string", () => {
    expect(getLocaleHtmlLang("en")).toBe("en");
    expect(getLocaleHtmlLang("zh")).toBe("zh-CN");
    expect(getLocaleHtmlLang("ja")).toBe("ja");
    expect(getLocaleHtmlLang("ko")).toBe("ko");
    expect(getLocaleHtmlLang("de")).toBe("de");
    expect(getLocaleHtmlLang("nl")).toBe("nl");
    expect(getLocaleHtmlLang("fr")).toBe("fr");
  });
});
