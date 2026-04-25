import type { SiteLocaleCode } from "./siteLocale";

const DEFAULT_SITE_URL = "https://leadcue.app";

type SearchEngineVerification = {
  attribute: "name";
  value: string;
  content: string;
};

function normalizeSiteUrl(value: string) {
  return value.trim().replace(/\/+$/, "");
}

function readConfiguredSiteUrl() {
  const configured = import.meta.env.VITE_SITE_URL?.trim();

  if (configured) {
    return normalizeSiteUrl(configured);
  }

  if (typeof window !== "undefined" && window.location.origin) {
    return normalizeSiteUrl(window.location.origin);
  }

  return DEFAULT_SITE_URL;
}

function normalizeSeoAssetPath(pathname: string) {
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

export const SITE_URL = readConfiguredSiteUrl();

export function getSearchEngineVerifications(): SearchEngineVerification[] {
  const verificationValues = [
    {
      attribute: "name" as const,
      value: "google-site-verification",
      content: import.meta.env.VITE_GOOGLE_SITE_VERIFICATION?.trim() ?? ""
    },
    {
      attribute: "name" as const,
      value: "msvalidate.01",
      content: import.meta.env.VITE_BING_SITE_VERIFICATION?.trim() ?? ""
    }
  ];

  return verificationValues.filter((entry) => Boolean(entry.content));
}

export function getSeoImagePath(locale: SiteLocaleCode, pathname: string) {
  return `/images/og/${locale}-${normalizeSeoAssetPath(pathname)}.svg`;
}

export function getSeoImageAlt(title: string) {
  return `${title} - LeadCue preview image`;
}
