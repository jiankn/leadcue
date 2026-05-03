import { readFile } from "node:fs/promises";
import { localizedPageReadinessPath } from "./seo-utils.mjs";

export async function loadLocalizedPageReadiness() {
  try {
    return JSON.parse(await readFile(localizedPageReadinessPath, "utf8"));
  } catch {
    return {};
  }
}

export function isPageReady(readiness, kind, slug, locale) {
  const readyLocales = readiness?.[kind]?.[slug];

  if (!Array.isArray(readyLocales)) {
    return true;
  }

  return readyLocales.includes(locale);
}

export function filterReadyPages(readiness, kind, pages, locale) {
  return pages.filter((page) => isPageReady(readiness, kind, page.slug, locale));
}

export function getRouteAlternateLocales(readiness, route, locales) {
  return locales.filter((locale) => isPageReady(readiness, route.kind, route.slug, locale.code));
}
