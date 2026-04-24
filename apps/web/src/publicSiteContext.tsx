import { createContext, useContext } from "react";
import { type SiteUi } from "./publicContent";
import { getLocaleSwitchHref, localizeHref, type SiteLocaleCode } from "./siteLocale";

type TemplateValues = Record<string, string | number>;

export type PublicSiteContextValue = {
  locale: SiteLocaleCode;
  path: string;
  siteUi: SiteUi;
  localizeHref: (href: string) => string;
  getSwitchHref: (locale: SiteLocaleCode) => string;
  formatMessage: (template: string, values?: TemplateValues) => string;
};

export const PublicSiteContext = createContext<PublicSiteContextValue | null>(null);

export function usePublicSite() {
  const context = useContext(PublicSiteContext);

  if (!context) {
    throw new Error("Public site context is unavailable.");
  }

  return context;
}

export function formatTemplate(template: string, values: TemplateValues = {}) {
  return Object.entries(values).reduce((result, [key, value]) => result.replaceAll(`__${key.toUpperCase()}__`, String(value)), template);
}

export function createPublicSiteContextValue(locale: SiteLocaleCode, path: string, siteUi: SiteUi): PublicSiteContextValue {
  return {
    locale,
    path,
    siteUi,
    localizeHref: (href: string) => localizeHref(locale, href),
    getSwitchHref: (nextLocale: SiteLocaleCode) => getLocaleSwitchHref(`${window.location.pathname}${window.location.search}${window.location.hash}`, nextLocale),
    formatMessage: (template: string, values?: TemplateValues) => formatTemplate(template, values)
  };
}
