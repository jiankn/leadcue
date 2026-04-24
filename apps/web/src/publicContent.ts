import type { CommercialPageDefinition, CommercialPageSlug } from "./commercialContent";
import type { ProductSeoPage } from "./productSeoContent";
import type { SeoContentPage } from "./seoContent";
import commercialPagesJson from "./content/generated/commercial-pages.locales.json";
import productPagesJson from "./content/generated/product-pages.locales.json";
import seoPagesJson from "./content/generated/seo-pages.locales.json";
import siteUiJson from "./content/generated/site-ui.locales.json";
import { type SiteLocaleCode, defaultSiteLocale } from "./siteLocale";

type LocaleMap<T> = Record<SiteLocaleCode, T>;

export type SiteUi = (typeof siteUiJson)["en"];

const siteUiByLocale = siteUiJson as LocaleMap<SiteUi>;
const seoPagesByLocale = seoPagesJson as LocaleMap<SeoContentPage[]>;
const productPagesByLocale = productPagesJson as LocaleMap<ProductSeoPage[]>;
const commercialPagesByLocale = commercialPagesJson as LocaleMap<Record<CommercialPageSlug, CommercialPageDefinition>>;

function getLocaleValue<T>(bundle: Partial<LocaleMap<T>>, locale: SiteLocaleCode) {
  const resolved = bundle[locale] ?? bundle[defaultSiteLocale];

  if (resolved === undefined) {
    throw new Error(`Missing public locale content for ${locale}.`);
  }

  return resolved;
}

export function getSiteUi(locale: SiteLocaleCode) {
  return getLocaleValue(siteUiByLocale, locale);
}

export function getSeoPages(locale: SiteLocaleCode) {
  return getLocaleValue(seoPagesByLocale, locale);
}

export function getProductPages(locale: SiteLocaleCode) {
  return getLocaleValue(productPagesByLocale, locale);
}

export function getCommercialPages(locale: SiteLocaleCode) {
  return getLocaleValue(commercialPagesByLocale, locale);
}

export function getSeoPageMap(locale: SiteLocaleCode) {
  return Object.fromEntries(getSeoPages(locale).map((page) => [page.slug, page])) as Partial<Record<string, SeoContentPage>>;
}

export function getProductPageMap(locale: SiteLocaleCode) {
  return Object.fromEntries(getProductPages(locale).map((page) => [page.slug, page])) as Partial<Record<string, ProductSeoPage>>;
}

export function getPublicRoutePaths(locale: SiteLocaleCode) {
  const commercialRoutes = Object.keys(getCommercialPages(locale)).map((slug) => `/${slug}`);
  const seoRoutes = getSeoPages(locale).map((page) => `/${page.slug}`);
  const productRoutes = getProductPages(locale).map((page) => `/${page.slug}`);

  return ["/", ...commercialRoutes, ...seoRoutes, ...productRoutes];
}
