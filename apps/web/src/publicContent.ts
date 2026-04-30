import type { CommercialPageDefinition, CommercialPageSlug } from "./commercialContent";
import type { ProductSeoPage } from "./productSeoContent";
import type { SeoContentPage } from "./seoContent";
import commercialPagesJson from "./content/generated/commercial-pages.locales.json";
import localizedSeoCoreProductsJson from "./content/source/localized-seo-core-products.json";
import localizedSeoDeepPagesJson from "./content/source/localized-seo-deep-pages.json";
import localizedSeoLongCopyJson from "./content/source/localized-seo-longcopy.json";
import localizedPublicUiJson from "./content/source/localized-public-ui.json";
import localizedSeoStrategyJson from "./content/source/localized-seo-strategy.json";
import localizedSeoUseCasesIntegrationsJson from "./content/source/localized-seo-usecases-integrations.json";
import productPagesJson from "./content/generated/product-pages.locales.json";
import seoPagesJson from "./content/generated/seo-pages.locales.json";
import siteUiJson from "./content/generated/site-ui.locales.json";
import { type SiteLocaleCode, defaultSiteLocale } from "./siteLocale";

type LocaleMap<T> = Record<SiteLocaleCode, T>;
type DeepPartial<T> = T extends Array<infer Item>
  ? Array<DeepPartial<Item>>
  : T extends object
    ? { [Key in keyof T]?: DeepPartial<T[Key]> }
    : T;
type LocalizedSeoStrategy = Partial<
  Record<
    SiteLocaleCode,
    {
      siteUi?: DeepPartial<SiteUi>;
      seoPages?: Record<string, DeepPartial<SeoContentPage>>;
      productPages?: Record<string, DeepPartial<ProductSeoPage>>;
    }
  >
>;

export type SiteUi = (typeof siteUiJson)["en"];

const siteUiByLocale = siteUiJson as LocaleMap<SiteUi>;
const seoPagesByLocale = seoPagesJson as LocaleMap<SeoContentPage[]>;
const productPagesByLocale = productPagesJson as LocaleMap<ProductSeoPage[]>;
const commercialPagesByLocale = commercialPagesJson as LocaleMap<Record<CommercialPageSlug, CommercialPageDefinition>>;
const localizedSeoStrategy = deepMergeValue(
  deepMergeValue(
    deepMergeValue(
      deepMergeValue(
        deepMergeValue(localizedSeoStrategyJson as unknown as LocalizedSeoStrategy, localizedSeoLongCopyJson),
        localizedSeoUseCasesIntegrationsJson
      ),
      localizedSeoDeepPagesJson
    ),
    localizedSeoCoreProductsJson
  ),
  localizedPublicUiJson
);

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function deepMergeValue<T>(base: T, patch: unknown): T {
  if (patch === undefined) {
    return base;
  }

  if (!isPlainObject(base) || !isPlainObject(patch)) {
    return patch as T;
  }

  const merged: Record<string, unknown> = { ...base };

  Object.entries(patch).forEach(([key, value]) => {
    merged[key] = deepMergeValue(merged[key], value);
  });

  return merged as T;
}

function applyPageOverrides<T extends { slug: string }>(pages: T[], overrides?: Record<string, DeepPartial<T>>) {
  if (!overrides) {
    return pages;
  }

  return pages.map((page) => deepMergeValue(page, overrides[page.slug]));
}

function getLocaleValue<T>(bundle: Partial<LocaleMap<T>>, locale: SiteLocaleCode) {
  const resolved = bundle[locale] ?? bundle[defaultSiteLocale];

  if (resolved === undefined) {
    throw new Error(`Missing public locale content for ${locale}.`);
  }

  return resolved;
}

export function getSiteUi(locale: SiteLocaleCode) {
  return deepMergeValue(getLocaleValue(siteUiByLocale, locale), localizedSeoStrategy[locale]?.siteUi);
}

export function getSeoPages(locale: SiteLocaleCode) {
  return applyPageOverrides(getLocaleValue(seoPagesByLocale, locale), localizedSeoStrategy[locale]?.seoPages);
}

export function getProductPages(locale: SiteLocaleCode) {
  return applyPageOverrides(getLocaleValue(productPagesByLocale, locale), localizedSeoStrategy[locale]?.productPages);
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
