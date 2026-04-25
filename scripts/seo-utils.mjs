import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const repoRoot = path.resolve(__dirname, "..");
export const generatedDir = path.join(repoRoot, "apps", "web", "src", "content", "generated");
export const publicDir = path.join(repoRoot, "apps", "web", "public");
export const ogImageDir = path.join(publicDir, "images", "og");
export const homeKeywordPath = path.join(repoRoot, "apps", "web", "src", "content", "source", "home-seo-keywords.json");

export const localeMeta = [
  { code: "en", hrefLang: "en", htmlLang: "en", nativeName: "English" },
  { code: "zh", hrefLang: "zh-CN", htmlLang: "zh-CN", nativeName: "简体中文" },
  { code: "ja", hrefLang: "ja", htmlLang: "ja", nativeName: "日本語" },
  { code: "ko", hrefLang: "ko", htmlLang: "ko", nativeName: "한국어" },
  { code: "de", hrefLang: "de", htmlLang: "de", nativeName: "Deutsch" },
  { code: "nl", hrefLang: "nl", htmlLang: "nl", nativeName: "Nederlands" },
  { code: "fr", hrefLang: "fr", htmlLang: "fr", nativeName: "Français" }
];

export const authNoIndexPaths = ["/app", "/login", "/signup", "/reset-password"];
export const defaultSiteUrl = "https://leadcue.app";

function normalizeSiteUrl(value) {
  return value.trim().replace(/\/+$/, "");
}

export const siteUrl = normalizeSiteUrl(process.env.VITE_SITE_URL || process.env.SITE_URL || defaultSiteUrl);

export function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function normalizePath(pathname) {
  if (!pathname) {
    return "/";
  }

  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return normalized !== "/" ? normalized.replace(/\/+$/, "") || "/" : normalized;
}

export function buildLocalePath(locale, pathname) {
  const normalized = normalizePath(pathname);
  return locale === "en" ? normalized : normalized === "/" ? `/${locale}` : `/${locale}${normalized}`;
}

function normalizeSeoAssetPath(pathname) {
  if (!pathname || pathname === "/") {
    return "home";
  }

  return (
    pathname
      .replace(/^\/+/, "")
      .replace(/[/?#=&]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "") || "home"
  );
}

export function getSeoImageFilename(locale, pathname) {
  return `${locale}-${normalizeSeoAssetPath(pathname)}.svg`;
}

export function getSeoImagePath(locale, pathname) {
  return `/images/og/${getSeoImageFilename(locale, pathname)}`;
}

export function getSeoImageAlt(title) {
  return `${title} - LeadCue preview image`;
}

export function getSearchEngineVerifications() {
  return [
    {
      attribute: "name",
      value: "google-site-verification",
      content: process.env.VITE_GOOGLE_SITE_VERIFICATION?.trim() ?? ""
    },
    {
      attribute: "name",
      value: "msvalidate.01",
      content: process.env.VITE_BING_SITE_VERIFICATION?.trim() ?? ""
    }
  ].filter((entry) => Boolean(entry.content));
}

export function renderVerificationMetaTags(indent = "    ") {
  const tags = getSearchEngineVerifications().map(
    (entry) => `${indent}<meta ${entry.attribute}="${entry.value}" content="${escapeHtml(entry.content)}" />`
  );

  return tags.length ? `${tags.join("\n")}\n` : "";
}
