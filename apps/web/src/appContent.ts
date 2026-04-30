import appUiJson from "./content/generated/app-ui.locales.json";
import { appUiExtraByLocale, type AppUiExtra, type AppUiExtraOverride } from "./appExtraContent";
import { appPageLocaleOverrides } from "./appPageLocaleOverrides";
import { type SiteLocaleCode, defaultSiteLocale } from "./siteLocale";

type LocaleMap<T> = Record<SiteLocaleCode, T>;

/** Dashboard 页面的本地化 UI 文案类型，从英文 JSON 推断 */
type BaseAppUi = (typeof appUiJson)["en"];
export type AppUi = BaseAppUi & AppUiExtra;

const appUiByLocale = appUiJson as LocaleMap<BaseAppUi>;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function mergeExtra<T extends Record<string, unknown>>(base: T, override: AppUiExtraOverride): T {
  const result = { ...base };

  Object.entries(override).forEach(([key, value]) => {
    if (value === undefined) {
      return;
    }

    const current = result[key];

    if (isPlainObject(value) && isPlainObject(current)) {
      result[key as keyof T] = mergeExtra(current, value as AppUiExtraOverride) as T[keyof T];
      return;
    }

    result[key as keyof T] = value as T[keyof T];
  });

  return result;
}

function fillMissing<T extends Record<string, unknown>>(base: T, defaults: AppUiExtraOverride): T {
  const result = { ...base };

  Object.entries(defaults).forEach(([key, value]) => {
    if (value === undefined) {
      return;
    }

    const current = result[key];

    if (current === undefined) {
      result[key as keyof T] = value as T[keyof T];
      return;
    }

    if (isPlainObject(value) && isPlainObject(current)) {
      result[key as keyof T] = fillMissing(current, value as AppUiExtraOverride) as T[keyof T];
    }
  });

  return result;
}

export function getAppUi(locale: SiteLocaleCode): AppUi {
  const resolvedLocale = locale in appUiByLocale ? locale : defaultSiteLocale;
  const baseUi = appUiByLocale[resolvedLocale] as unknown as Record<string, unknown>;
  const withDefaultExtra = fillMissing(baseUi, appUiExtraByLocale.en);
  const withLocaleExtra = mergeExtra(withDefaultExtra, appUiExtraByLocale[resolvedLocale]);
  return mergeExtra(withLocaleExtra, appPageLocaleOverrides[resolvedLocale] ?? {}) as AppUi;
}
