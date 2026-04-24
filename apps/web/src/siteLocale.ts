export const siteLocaleLabels = {
  en: { nativeName: "English", htmlLang: "en" },
  zh: { nativeName: "简体中文", htmlLang: "zh-CN" },
  ja: { nativeName: "日本語", htmlLang: "ja" },
  ko: { nativeName: "한국어", htmlLang: "ko" },
  de: { nativeName: "Deutsch", htmlLang: "de" },
  nl: { nativeName: "Nederlands", htmlLang: "nl" },
  fr: { nativeName: "Français", htmlLang: "fr" }
} as const;

export type SiteLocaleCode = keyof typeof siteLocaleLabels;

export const defaultSiteLocale: SiteLocaleCode = "en";
export const supportedSiteLocales = Object.keys(siteLocaleLabels) as SiteLocaleCode[];

function normalizePath(pathname: string) {
  if (!pathname) {
    return "/";
  }

  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return normalized !== "/" ? normalized.replace(/\/+$/, "") || "/" : normalized;
}

export function isSiteLocale(value?: string | null): value is SiteLocaleCode {
  return Boolean(value) && supportedSiteLocales.includes(value as SiteLocaleCode);
}

export function parseSiteLocalePath(pathname: string): { locale: SiteLocaleCode; path: string } {
  const normalized = normalizePath(pathname);
  const segments = normalized.split("/");
  const candidate = segments[1];

  if (isSiteLocale(candidate)) {
    const rest = `/${segments.slice(2).join("/")}`;
    return {
      locale: candidate,
      path: normalizePath(rest)
    };
  }

  return {
    locale: defaultSiteLocale,
    path: normalized
  };
}

export function buildLocalePath(locale: SiteLocaleCode, pathname: string) {
  const normalized = parseSiteLocalePath(pathname).path;

  if (locale === defaultSiteLocale) {
    return normalized;
  }

  return normalized === "/" ? `/${locale}` : `/${locale}${normalized}`;
}

export function localizeHref(locale: SiteLocaleCode, href: string) {
  if (!href || href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:") || href.startsWith("#")) {
    return href;
  }

  const [pathAndSearch, hash = ""] = href.split("#");
  const [pathname = "/", search = ""] = pathAndSearch.split("?");
  const localizedPath = buildLocalePath(locale, pathname);

  return `${localizedPath}${search ? `?${search}` : ""}${hash ? `#${hash}` : ""}`;
}

export function getLocaleSwitchHref(currentHref: string, locale: SiteLocaleCode) {
  const url = new URL(currentHref, window.location.origin);
  const localizedPath = buildLocalePath(locale, url.pathname);
  return `${localizedPath}${url.search}${url.hash}`;
}

export function getLocaleHtmlLang(locale: SiteLocaleCode) {
  return siteLocaleLabels[locale].htmlLang;
}
