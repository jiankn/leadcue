import appUiJson from "./content/generated/app-ui.locales.json";
import { appUiExtraByLocale, type AppUiExtra, type AppUiExtraOverride } from "./appExtraContent";
import { type SiteLocaleCode, defaultSiteLocale } from "./siteLocale";

type LocaleMap<T> = Record<SiteLocaleCode, T>;

/** Dashboard 页面的本地化 UI 文案类型，从英文 JSON 推断 */
type BaseAppUi = (typeof appUiJson)["en"];
export type AppUi = BaseAppUi & AppUiExtra;

const appUiByLocale = appUiJson as LocaleMap<BaseAppUi>;

function mergeExtra(base: AppUiExtra, override: AppUiExtraOverride): AppUiExtra {
  const result = { ...base } as Record<string, unknown>;

  Object.entries(override).forEach(([key, value]) => {
    if (value === undefined) {
      return;
    }

    const current = result[key];

    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      current &&
      typeof current === "object" &&
      !Array.isArray(current)
    ) {
      result[key] = mergeExtra(current as AppUiExtra, value as AppUiExtraOverride);
      return;
    }

    result[key] = value;
  });

  return result as AppUiExtra;
}

export function getAppUi(locale: SiteLocaleCode): AppUi {
  const resolvedLocale = locale in appUiByLocale ? locale : defaultSiteLocale;
  const extra = mergeExtra(appUiExtraByLocale.en as AppUiExtra, appUiExtraByLocale[resolvedLocale]);
  return {
    ...appUiByLocale[resolvedLocale],
    ...extra
  };
}
