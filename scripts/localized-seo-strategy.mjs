import { readFile } from "node:fs/promises";
import path from "node:path";
import { repoRoot } from "./seo-utils.mjs";

const strategyPath = path.join(
  repoRoot,
  "apps",
  "web",
  "src",
  "content",
  "source",
  "localized-seo-strategy.json"
);
const longCopyPath = path.join(
  repoRoot,
  "apps",
  "web",
  "src",
  "content",
  "source",
  "localized-seo-longcopy.json"
);
const useCaseIntegrationPath = path.join(
  repoRoot,
  "apps",
  "web",
  "src",
  "content",
  "source",
  "localized-seo-usecases-integrations.json"
);
const deepPagesPath = path.join(
  repoRoot,
  "apps",
  "web",
  "src",
  "content",
  "source",
  "localized-seo-deep-pages.json"
);
const coreProductsPath = path.join(
  repoRoot,
  "apps",
  "web",
  "src",
  "content",
  "source",
  "localized-seo-core-products.json"
);
const publicUiPath = path.join(
  repoRoot,
  "apps",
  "web",
  "src",
  "content",
  "source",
  "localized-public-ui.json"
);

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

async function loadJsonIfPresent(filePath) {
  try {
    return JSON.parse(await readFile(filePath, "utf8"));
  } catch {
    return {};
  }
}

export async function loadLocalizedSeoStrategy() {
  return deepMerge(
    deepMerge(
      deepMerge(
        deepMerge(
          deepMerge(await loadJsonIfPresent(strategyPath), await loadJsonIfPresent(longCopyPath)),
          await loadJsonIfPresent(useCaseIntegrationPath)
        ),
        await loadJsonIfPresent(deepPagesPath)
      ),
      await loadJsonIfPresent(coreProductsPath)
    ),
    await loadJsonIfPresent(publicUiPath)
  );
}

export function deepMerge(base, patch) {
  if (patch === undefined) {
    return base;
  }

  if (!isPlainObject(base) || !isPlainObject(patch)) {
    return patch;
  }

  const merged = { ...base };

  Object.entries(patch).forEach(([key, value]) => {
    merged[key] = deepMerge(merged[key], value);
  });

  return merged;
}

function applyPageOverrides(pages, overrides = {}) {
  return pages.map((page) => deepMerge(page, overrides[page.slug]));
}

export function applyLocalizedSeoStrategy(localeData, strategy) {
  return Object.fromEntries(
    Object.entries(localeData).map(([locale, bundle]) => {
      const localeStrategy = strategy?.[locale] ?? {};

      return [
        locale,
        {
          ...bundle,
          siteUi: deepMerge(bundle.siteUi, localeStrategy.siteUi),
          seoPages: applyPageOverrides(bundle.seoPages, localeStrategy.seoPages),
          productPages: applyPageOverrides(bundle.productPages, localeStrategy.productPages)
        }
      ];
    })
  );
}
