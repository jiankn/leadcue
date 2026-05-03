import { type ChangeEvent, type FormEvent, type KeyboardEvent, type ReactElement, useEffect, useMemo, useRef, useState } from "react";
import {
  DEFAULT_ICP,
  PRICING_PLANS,
  SAMPLE_PROSPECT_CARD,
  buildRuleBasedProspectCard,
  buildProspectExportCsv,
  buildSampleProspectCard,
  defaultProspectExportSelection,
  getSampleLocaleContent,
  getProspectExportColumns,
  prospectCrmFieldModes,
  prospectExportFields,
  prospectExportPresets,
  type ExportRequest,
  type ExportRun,
  type IcpUpdateRequest,
  type LeadListItem,
  type LeadHandoffStatus,
  type ProspectContextUpdateRequest,
  type ProspectCrmFieldMode,
  type ProspectExportFieldKey,
  type ProspectExportPresetKey,
  type OpportunitySignal,
  type PricingPlan,
  type ProspectCard as ProspectCardType,
  type ProspectPipelineActivity,
  type ProspectPipelineContext,
  type ProspectPipelineStage,
  type QueueImportRequest,
  type QueueSource,
  type ScanFailureResponse,
  type ScanHistoryItem,
  type ScanRequest,
  type ScanResponse,
  type ServiceType,
  type Tone,
  type WorkspaceQueueItem,
  type WorkspaceResearchStatus
} from "@leadcue/shared";
import { trackEvent } from "./analytics";
import { apiUrl } from "./api";
import type { CommercialPageDefinition, CommercialPageSlug } from "./commercialContent";
import homeSeoKeywords from "./content/source/home-seo-keywords.json";
import type { ProductSeoPage } from "./productSeoContent";
import type { SeoContentPage } from "./seoContent";
import i18n from "./i18n";
import { HeroVisualIllustration, LoginWorkspaceIllustration, ResearchDeskIllustration, ResourceIllustration } from "./localizedIllustrations";
import { getCommercialPages, getProductPageMap, getProductPages, getSeoPageMap, getSeoPages, getSiteUi, type SiteUi } from "./publicContent";
import { PublicSiteContext, createPublicSiteContextValue, usePublicSite } from "./publicSiteContext";
import { getSearchEngineVerifications, getSeoImageAlt, getSeoImagePath, SITE_URL } from "./seoConfig";
import { buildLocalePath, getLocaleHtmlLang, localizeHref, parseSiteLocalePath, siteLocaleLabels, supportedSiteLocales, type SiteLocaleCode } from "./siteLocale";
import { getAppUi, type AppUi } from "./appContent";
import "./upgrades.css";
import "./dashboard-shell.css";

type IconName =
  | "arrow"
  | "browser"
  | "chart"
  | "chevron_down"
  | "check"
  | "clipboard"
  | "cursor"
  | "database"
  | "download"
  | "filter"
  | "globe"
  | "layers"
  | "lock"
  | "mail"
  | "scan"
  | "shield"
  | "spark"
  | "target";

type ScanHistoryFilter = "all" | ScanHistoryItem["status"];
type HistoryDateFilter = "all" | "today" | "7d" | "30d";
type LeadSortOption = "newest" | "fit_desc" | "confidence_desc" | "company_asc";
type ActivityChangedField = ProspectPipelineActivity["changedFields"][number];
type ActivityFieldFilter = "all" | ActivityChangedField;
type ProspectCardTab = "overview" | "signals" | "contacts" | "outreach" | "email" | "sources" | "export";
type AppSection = "dashboard" | "queue" | "qualified" | "exports" | "settings" | "analytics";
type BatchSourceOption = "manual" | "csv" | "apollo" | "clay" | "directory";
type ReviewQueueFilter = "all" | "ready" | "researching";
type PipelineContextSaveResult = {
  context: ProspectPipelineContext;
  activity?: ProspectPipelineActivity | null;
  queueItem?: WorkspaceQueueItem | null;
};
type ImportedWebsiteRecord = {
  id: string;
  url: string;
  domain: string;
  companyName: string;
  source: BatchSourceOption;
  note: string;
  createdAt: string;
};
type ReviewQueueRow = {
  id: string;
  kind: "import" | "lead";
  companyName: string;
  domain: string;
  websiteUrl: string;
  source: QueueSource;
  status: "ready" | "researching" | "qualified";
  fitScore: number | null;
  confidencePercent: number | null;
  leadId: string | null;
  note: string;
  createdAt: string;
};

const scanHistoryFilters: ScanHistoryFilter[] = ["all", "completed", "failed", "replayed", "processing"];

const historyDateFilters: HistoryDateFilter[] = ["all", "today", "7d", "30d"];

const leadSortOptions: LeadSortOption[] = ["newest", "fit_desc", "confidence_desc", "company_asc"];
const batchSourceOptions: BatchSourceOption[] = ["manual", "csv", "apollo", "clay", "directory"];

const prospectCardTabs: ProspectCardTab[] = ["overview", "signals", "contacts", "outreach", "email", "sources", "export"];

const pipelineStageOptions: ProspectPipelineStage[] = ["researching", "qualified", "outreach_queued", "contacted", "won", "archived"];

const activityFieldFilters: ActivityFieldFilter[] = ["all", "owner", "stage", "notes"];
const fallbackAppUi = getAppUi("en");

const defaultProspectMeta: ProspectPipelineContext = {
  owner: "",
  stage: "researching",
  notes: "",
  updatedAt: null
};

const IMPORT_QUEUE_STORAGE_PREFIX = "leadcue_import_queue_v1";
const SCAN_DRAFT_STORAGE_PREFIX = "leadcue_scan_draft_v1";

function buildDemoLeads(locale: SiteLocaleCode): ProspectCardType[] {
  const sampleContent = getSampleLocaleContent(locale);
  const sharedIcp = {
    serviceType: "web_design" as const,
    targetIndustries: sampleContent.targetIndustries,
    targetCountries: sampleContent.targetCountries,
    offerDescription: sampleContent.offerDescription,
    tone: "professional" as const
  };
  const northstar = buildSampleProspectCard(locale);
  const { beacon: beaconPage, lumen: lumenPage } = sampleContent.demoPages;
  const beacon = {
    ...buildRuleBasedProspectCard({
      source: "web",
      locale,
      page: {
        url: "https://beacondental.example",
        title: beaconPage.title,
        metaDescription: beaconPage.metaDescription,
        h1: beaconPage.h1,
        text: beaconPage.text,
        links: [
          "https://beacondental.example",
          "https://beacondental.example/services",
          "https://beacondental.example/insurance",
          "https://beacondental.example/reviews",
          "https://beacondental.example/careers",
          "https://beacondental.example/contact",
          "https://www.facebook.com/beacondental"
        ],
        emails: ["hello@beacondental.example"],
        phones: ["(415) 555-0142"]
      },
      icp: sharedIcp
    }),
    industry: sampleContent.industryLabels.beacon,
    fitScore: 82,
    confidenceScore: 0.76,
    savedStatus: "saved" as const,
    exportStatus: "not_exported" as const
  };
  const lumen = {
    ...buildRuleBasedProspectCard({
      source: "web",
      locale,
      page: {
        url: "https://lumenlogistics.example",
        title: lumenPage.title,
        metaDescription: lumenPage.metaDescription,
        h1: lumenPage.h1,
        text: lumenPage.text,
        links: [
          "https://lumenlogistics.example",
          "https://lumenlogistics.example/solutions",
          "https://lumenlogistics.example/coverage",
          "https://lumenlogistics.example/team",
          "https://lumenlogistics.example/careers",
          "https://lumenlogistics.example/contact",
          "https://www.linkedin.com/company/lumen-logistics"
        ],
        emails: ["ops@lumenlogistics.example"],
        phones: ["+1 312-555-0188"]
      },
      icp: sharedIcp
    }),
    industry: sampleContent.industryLabels.lumen,
    fitScore: 74,
    confidenceScore: 0.69,
    savedStatus: "saved" as const,
    exportStatus: "not_exported" as const
  };

  return [northstar, beacon, lumen];
}

function buildDemoLeadRows(locale: SiteLocaleCode): LeadListItem[] {
  return buildDemoLeads(locale).map((lead, index) => ({
    id: index === 0 ? "lead_sample" : `lead_demo_${index}`,
    companyName: lead.companyName,
    domain: lead.domain,
    websiteUrl: lead.website,
    industry: lead.industry,
    fitScore: lead.fitScore,
    confidenceScore: lead.confidenceScore,
    pipelineContext: { ...defaultProspectMeta },
    createdAt: new Date().toISOString()
  }));
}

function buildDemoScanHistory(locale: SiteLocaleCode): ScanHistoryItem[] {
  const [sampleLead] = buildDemoLeads(locale);

  return [
    {
      id: "scan_demo_completed",
      url: sampleLead.website,
      domain: sampleLead.domain,
      scanType: "basic",
      status: "completed",
      reason: null,
      creditsUsed: 1,
      creditsCharged: 1,
      leadId: "lead_sample",
      companyName: sampleLead.companyName,
      idempotencyKey: "demo_completed_key",
      replayed: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
      completedAt: new Date(Date.now() - 1000 * 60 * 18).toISOString()
    },
    {
      id: "scan_demo_failed",
      url: "https://missing-content.example",
      domain: "missing-content.example",
      scanType: "basic",
      status: "failed",
      reason: "generation_failed",
      creditsUsed: 0,
      creditsCharged: 0,
      leadId: null,
      companyName: null,
      idempotencyKey: "demo_failed_key",
      replayed: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
      completedAt: new Date(Date.now() - 1000 * 60 * 42).toISOString()
    },
    {
      id: "scan_demo_replayed",
      url: sampleLead.website,
      domain: sampleLead.domain,
      scanType: "basic",
      status: "replayed",
      reason: "replayed",
      creditsUsed: 0,
      creditsCharged: 0,
      leadId: "lead_sample",
      companyName: sampleLead.companyName,
      idempotencyKey: "demo_completed_key",
      replayed: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 54).toISOString(),
      completedAt: new Date(Date.now() - 1000 * 60 * 54).toISOString()
    }
  ];
}

type SignupResponse = {
  ok: boolean;
  userId?: string;
  workspaceId?: string;
  checkoutUrl?: string;
  next?: "dashboard" | "checkout";
  billingStatus?: "active" | "pending_checkout" | "configuration_required";
  error?: string;
};

type WorkspaceCreateResponse = {
  ok: boolean;
  existing?: boolean;
  workspaceId?: string;
  next?: "dashboard" | "checkout";
  checkoutUrl?: string;
  snapshot?: WorkspaceSnapshot;
  error?: string;
};

type EmailLoginResponse = {
  ok: boolean;
  next?: string;
  error?: string;
  reason?: string;
};

type EmailRegisterResponse = {
  ok: boolean;
  next?: string;
  error?: string;
  reason?: string;
};

type AuthRecoveryReason = "google_sign_in_required" | "password_setup_required";

type AuthRecoveryState = {
  reason: AuthRecoveryReason;
  email: string;
};

type PasswordResetRequestVariant = "reset" | "setup";

type AuthMeResponse =
  | {
      authenticated: true;
      user: {
        id: string;
        email: string;
        name: string | null;
      };
      workspace: {
        id: string | null;
        name: string | null;
      };
    }
  | {
      authenticated: false;
    };

type WorkspaceSnapshot = {
  workspace: {
    id: string;
    name: string;
    createdAt: string;
  };
  setup: {
    serviceType: string;
    agencyFocus: string | null;
    targetIndustries: string[];
    targetCountries: string[];
    offerDescription: string;
    tone: string;
    agencyWebsite: string | null;
    firstProspectUrl: string | null;
  };
  onboarding: {
    completedAt: string | null;
    isComplete: boolean;
  };
  plan: PricingPlan;
  subscription: {
    provider: string;
    status: string;
    customerId: string | null;
    currentPeriodEnd: string | null;
  };
  credits: {
    used: number;
    remaining: number;
    reset: string;
  };
  leadCount: number;
  source: "d1" | "sample";
  warning?: string;
};

type AnalyticsSummary = {
  source: "d1" | "sample";
  totals: {
    events: number;
    scansCompleted: number;
    leadsSaved: number;
    exportsCompleted: number;
  };
  funnel: {
    ctaClicks: number;
    signupsCompleted: number;
    loginsCompleted: number;
    scansCompleted: number;
    exportsCompleted: number;
  };
  topPages: Array<{
    path: string;
    count: number;
  }>;
  topEvents: Array<{
    name: string;
    count: number;
  }>;
  recentEvents: Array<{
    id: string;
    name: string;
    pagePath: string | null;
    createdAt: string;
    metadataSummary?: string | null;
  }>;
  recommendations: string[];
};

type SignupFormState = {
  email: string;
  password: string;
  agencyFocus: string;
  agencyWebsite: string;
  offerDescription: string;
  targetIndustries: string;
  firstProspectUrl: string;
};

type LoginFormState = {
  email: string;
  password: string;
};

type AuthMode = "login" | "signup";

type AuthIntent = {
  selectedPlan: PricingPlan;
  focus: string;
  firstProspectUrl: string;
  hasPlanIntent: boolean;
  hasFocusIntent: boolean;
  hasFirstIntent: boolean;
  hasIntent: boolean;
};

type PasswordResetFormState = {
  password: string;
  confirmPassword: string;
};

type AccountProfileFormState = {
  name: string;
  workspaceName: string;
};

type AccountPasswordFormState = {
  currentPassword: string;
  nextPassword: string;
  confirmPassword: string;
};

type ScanFormState = {
  url: string;
  companyName: string;
  notes: string;
  deepScan: boolean;
  queueItemId: string | null;
  queueSource: QueueSource | null;
};

type IcpFormState = {
  serviceType: string;
  targetIndustries: string;
  targetCountries: string;
  offerDescription: string;
  tone: string;
  firstProspectUrl: string;
};

function buildSampleWorkspace(locale: SiteLocaleCode, leadCount: number, firstProspectUrl: string): WorkspaceSnapshot {
  const plan = PRICING_PLANS[0];
  const sampleContent = getSampleLocaleContent(locale);

  return {
    workspace: {
      id: "ws_demo",
      name: sampleContent.workspaceName,
      createdAt: new Date().toISOString()
    },
    setup: {
      serviceType: DEFAULT_ICP.serviceType,
      agencyFocus: "web_design",
      targetIndustries: sampleContent.targetIndustries,
      targetCountries: sampleContent.targetCountries,
      offerDescription: sampleContent.offerDescription,
      tone: DEFAULT_ICP.tone,
      agencyWebsite: "https://leadcue.app",
      firstProspectUrl
    },
    onboarding: {
      completedAt: new Date().toISOString(),
      isComplete: true
    },
    plan,
    subscription: {
      provider: "leadcue",
      status: "active",
      customerId: null,
      currentPeriodEnd: null
    },
    credits: {
      used: 4,
      remaining: plan.monthlyCredits - 4,
      reset: new Date().toISOString()
    },
    leadCount,
    source: "sample"
  };
}

function buildSampleAnalyticsSummary(locale: SiteLocaleCode): AnalyticsSummary {
  const sampleContent = getSampleLocaleContent(locale);
  const analytics = sampleContent.analytics;

  return {
    source: "sample",
    totals: {
      events: 42,
      scansCompleted: 12,
      leadsSaved: 7,
      exportsCompleted: 3
    },
    funnel: {
      ctaClicks: 18,
      signupsCompleted: 5,
      loginsCompleted: 6,
      scansCompleted: 12,
      exportsCompleted: 3
    },
    topPages: [
      { path: "/", count: 14 },
      { path: "/templates/crm-csv-field-mapping", count: 9 },
      { path: "/templates/cold-email-first-line", count: 7 },
      { path: "/integrations/hubspot-csv-export", count: 5 }
    ],
    topEvents: [
      { name: "scan_completed", count: 12 },
      { name: "product_tool_primary_click", count: 8 },
      { name: "export_completed", count: 3 },
      { name: "auth_signup_completed", count: 2 }
    ],
    recentEvents: [
      {
        id: "evt_sample_scan",
        name: "scan_completed",
        pagePath: "/app",
        createdAt: new Date(Date.now() - 1000 * 60 * 9).toISOString(),
        metadataSummary: analytics.eventMetadata.basicScanOneCredit
      },
      {
        id: "evt_sample_export",
        name: "export_completed",
        pagePath: "/app/exports",
        createdAt: new Date(Date.now() - 1000 * 60 * 26).toISOString(),
        metadataSummary: analytics.eventMetadata.crmHubSpot
      },
      {
        id: "evt_sample_tool",
        name: "product_tool_primary_click",
        pagePath: "/templates/crm-csv-field-mapping",
        createdAt: new Date(Date.now() - 1000 * 60 * 44).toISOString(),
        metadataSummary: analytics.eventMetadata.hubSpotMappingCta
      }
    ],
    recommendations: [
      analytics.recommendations.toolPageCta,
      analytics.recommendations.exportsGap,
      analytics.recommendations.crmTemplateTraffic
    ]
  };
}

function icpFormFromSetup(setup: WorkspaceSnapshot["setup"]): IcpFormState {
  return {
    serviceType: serviceTypeForFocus(setup.agencyFocus || setup.serviceType),
    targetIndustries: setup.targetIndustries.join(", "),
    targetCountries: setup.targetCountries.join(", "),
    offerDescription: setup.offerDescription,
    tone: toneForWorkspace(setup.tone),
    firstProspectUrl: setup.firstProspectUrl || ""
  };
}

const APP_LOCALE_KEY = "leadcue_app_locale";
const APP_LOCALE_QUERY_KEY = "lc_locale";

function RedirectTo({ href }: { href: string }) {
  useEffect(() => {
    window.location.replace(href);
  }, [href]);

  return null;
}

function readAppLocale(): SiteLocaleCode | null {
  try {
    const stored = localStorage.getItem(APP_LOCALE_KEY);
    if (stored && supportedSiteLocales.includes(stored as SiteLocaleCode)) {
      return stored as SiteLocaleCode;
    }
  } catch {
    // localStorage 不可用
  }
  return null;
}

function readRequestedAppLocale(): SiteLocaleCode | null {
  try {
    const requested = new URLSearchParams(window.location.search).get(APP_LOCALE_QUERY_KEY);
    if (requested && supportedSiteLocales.includes(requested as SiteLocaleCode)) {
      return requested as SiteLocaleCode;
    }
  } catch {
    // URLSearchParams 不可用
  }
  return null;
}

function saveAppLocale(locale: SiteLocaleCode) {
  try {
    localStorage.setItem(APP_LOCALE_KEY, locale);
  } catch {
    // localStorage 不可用
  }
}

export default function App() {
  const { locale: urlLocale, path: pathname } = parseSiteLocalePath(window.location.pathname);
  const isAppRoute = pathname.startsWith("/app");
  const requestedAppLocale = readRequestedAppLocale();
  const locale = isAppRoute ? (requestedAppLocale ?? readAppLocale() ?? urlLocale) : urlLocale;
  const siteUi = getSiteUi(locale);
  const publicSiteContext = useMemo(() => createPublicSiteContextValue(locale, pathname, siteUi), [locale, pathname, siteUi]);

  const isLoginRoute = pathname.startsWith("/login");
  const isResetPasswordRoute = pathname.startsWith("/reset-password");
  const isSignupRoute = pathname.startsWith("/signup");
  const commercialPageSlug = getCommercialPageSlug(pathname, locale);
  const seoContentPage = getSeoContentPage(pathname, locale);
  const productSeoPage = getProductSeoPage(pathname, locale);

  useEffect(() => {
    document.documentElement.lang = getLocaleHtmlLang(locale);

    if (i18n.resolvedLanguage !== locale) {
      void i18n.changeLanguage(locale);
    }
  }, [locale]);

  useEffect(() => {
    if (isLoginRoute || isSignupRoute || isResetPasswordRoute || (isAppRoute && requestedAppLocale)) {
      saveAppLocale(locale);
    }
  }, [isAppRoute, isLoginRoute, isResetPasswordRoute, isSignupRoute, locale, requestedAppLocale]);

  if (isAppRoute) {
    const appUi = getAppUi(locale);

    return (
      <PublicSiteContext.Provider value={publicSiteContext}>
        <>
          <SeoHead
            title={`${siteUi.common.brand} ${appUi.pages.dashboard.title}`}
            description={appUi.pages.dashboard.copy}
            path="/app"
            locale={locale}
            noIndex
          />
          <DashboardApp />
        </>
      </PublicSiteContext.Provider>
    );
  }

  if (isLoginRoute) {
    return (
      <PublicSiteContext.Provider value={publicSiteContext}>
        <>
          <SeoHead
            title={siteUi.auth.login.cardTitle}
            description={siteUi.auth.login.cardCopy}
            path="/login"
            locale={locale}
            noIndex
          />
          <LoginPage initialMode="login" />
        </>
      </PublicSiteContext.Provider>
    );
  }

  if (isResetPasswordRoute) {
    return (
      <PublicSiteContext.Provider value={publicSiteContext}>
        <>
          <SeoHead
            title={siteUi.auth.reset.title}
            description={siteUi.auth.reset.copy}
            path="/reset-password"
            locale={locale}
            noIndex
          />
          <ResetPasswordPage />
        </>
      </PublicSiteContext.Provider>
    );
  }

  if (isSignupRoute) {
    return (
      <PublicSiteContext.Provider value={publicSiteContext}>
        <>
          <SeoHead
            title={siteUi.auth.signup.heroTitle}
            description={siteUi.auth.signup.heroCopy}
            path="/signup"
            locale={locale}
            noIndex
          />
          <LoginPage initialMode="signup" />
        </>
      </PublicSiteContext.Provider>
    );
  }

  if (seoContentPage) {
    return (
      <PublicSiteContext.Provider value={publicSiteContext}>
        <SeoContentPageView page={seoContentPage} />
      </PublicSiteContext.Provider>
    );
  }

  if (productSeoPage) {
    return (
      <PublicSiteContext.Provider value={publicSiteContext}>
        <ProductSeoPageView page={productSeoPage} />
      </PublicSiteContext.Provider>
    );
  }

  if (commercialPageSlug) {
    return (
      <PublicSiteContext.Provider value={publicSiteContext}>
        <CommercialPage slug={commercialPageSlug} />
      </PublicSiteContext.Provider>
    );
  }

  return (
    <PublicSiteContext.Provider value={publicSiteContext}>
      <MarketingSite />
    </PublicSiteContext.Provider>
  );
}

function getCommercialPageSlug(pathname: string, locale: SiteLocaleCode): CommercialPageSlug | null {
  const slug = pathname.replace(/^\/+/, "").replace(/\/+$/, "");
  const pages = getCommercialPages(locale);
  return slug in pages ? (slug as CommercialPageSlug) : null;
}

function getSeoContentPage(pathname: string, locale: SiteLocaleCode): SeoContentPage | null {
  const slug = pathname.replace(/^\/+/, "").replace(/\/+$/, "");
  return getSeoPageMap(locale)[slug] ?? null;
}

function getProductSeoPage(pathname: string, locale: SiteLocaleCode): ProductSeoPage | null {
  const slug = pathname.replace(/^\/+/, "").replace(/\/+$/, "");
  return getProductPageMap(locale)[slug] ?? null;
}

type SeoHeadProps = {
  title: string;
  description: string;
  keywords?: string[];
  path: string;
  locale: SiteLocaleCode;
  noIndex?: boolean;
  type?: "website" | "article";
  image?: string;
  imageAlt?: string;
  structuredData?: unknown;
};

function absoluteUrl(path: string, locale: SiteLocaleCode = "en") {
  const localizedPath = buildLocalePath(locale, path);
  const normalizedPath = localizedPath.startsWith("/") ? localizedPath : `/${localizedPath}`;
  return `${SITE_URL}${normalizedPath === "/" ? "/" : normalizedPath.replace(/\/$/, "")}`;
}

function setMetaTag(attribute: "name" | "property", value: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${value}"]`);

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, value);
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
}

function removeMetaTag(attribute: "name" | "property", value: string) {
  document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${value}"]`)?.remove();
}

function setCanonicalLink(href: string) {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", "canonical");
    document.head.appendChild(element);
  }

  element.setAttribute("href", href);
}

function setAlternateLinks(path: string, noIndex: boolean) {
  document.head.querySelectorAll('link[data-leadcue-alternate="true"]').forEach((element) => element.remove());

  if (noIndex) {
    return;
  }

  const locales = [
    ...supportedSiteLocales.map((locale) => ({
      hrefLang: getLocaleHtmlLang(locale),
      href: absoluteUrl(path, locale)
    })),
    {
      hrefLang: "x-default",
      href: absoluteUrl(path, "en")
    }
  ];

  locales.forEach((entry) => {
    const element = document.createElement("link");
    element.setAttribute("rel", "alternate");
    element.setAttribute("hreflang", entry.hrefLang);
    element.setAttribute("href", entry.href);
    element.setAttribute("data-leadcue-alternate", "true");
    document.head.appendChild(element);
  });
}

function SeoHead({
  title,
  description,
  keywords = [],
  path,
  locale,
  noIndex = false,
  type = "website",
  image,
  imageAlt,
  structuredData
}: SeoHeadProps) {
  const canonicalUrl = absoluteUrl(path, locale);
  const resolvedImage = image ?? getSeoImagePath(locale, noIndex ? "/" : path);
  const imageUrl = absoluteUrl(resolvedImage);
  const resolvedImageAlt = imageAlt ?? getSeoImageAlt(title);
  const structuredDataJson = structuredData ? JSON.stringify(structuredData) : "";
  const keywordContent = keywords.filter(Boolean).join(", ");
  const searchEngineVerifications = useMemo(() => getSearchEngineVerifications(), []);

  useEffect(() => {
    document.title = title;
    setMetaTag("name", "description", description);
    if (!noIndex && keywordContent) {
      setMetaTag("name", "keywords", keywordContent);
    } else {
      removeMetaTag("name", "keywords");
    }
    setMetaTag("name", "robots", noIndex ? "noindex,nofollow" : "index,follow");
    setMetaTag("property", "og:title", title);
    setMetaTag("property", "og:description", description);
    setMetaTag("property", "og:type", type);
    setMetaTag("property", "og:url", canonicalUrl);
    setMetaTag("property", "og:image", imageUrl);
    setMetaTag("property", "og:image:alt", resolvedImageAlt);
    setMetaTag("property", "og:image:width", "1200");
    setMetaTag("property", "og:image:height", "630");
    setMetaTag("property", "og:site_name", "LeadCue");
    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:title", title);
    setMetaTag("name", "twitter:description", description);
    setMetaTag("name", "twitter:image", imageUrl);
    setMetaTag("name", "twitter:image:alt", resolvedImageAlt);
    setCanonicalLink(canonicalUrl);
    setAlternateLinks(path, noIndex);

    document.head.querySelectorAll('meta[data-leadcue-verification="true"]').forEach((element) => element.remove());
    searchEngineVerifications.forEach((entry) => {
      const element = document.createElement("meta");
      element.setAttribute(entry.attribute, entry.value);
      element.setAttribute("content", entry.content);
      element.setAttribute("data-leadcue-verification", "true");
      document.head.appendChild(element);
    });

    const scriptId = "leadcue-structured-data";
    const existingScript = document.getElementById(scriptId);

    if (!structuredDataJson) {
      existingScript?.remove();
      return;
    }

    const script =
      existingScript instanceof HTMLScriptElement ? existingScript : document.createElement("script");

    script.id = scriptId;
    script.type = "application/ld+json";
    script.text = structuredDataJson;

    if (!existingScript) {
      document.head.appendChild(script);
    }
  }, [canonicalUrl, description, imageUrl, keywordContent, noIndex, path, resolvedImageAlt, searchEngineVerifications, structuredDataJson, title, type]);

  return null;
}

function BrandMark() {
  return (
    <svg className="brand-mark" viewBox="0 0 44 44" aria-hidden="true" focusable="false">
      <rect className="brand-mark-surface" x="1" y="1" width="42" height="42" rx="10" />
      <path className="brand-mark-lens" d="M28.5 16.2a10 10 0 1 0 0 15.6" />
      <path className="brand-mark-lens" d="M28.6 31.8 36 39" />
      <circle className="brand-mark-cue" cx="17.4" cy="24" r="3.6" />
    </svg>
  );
}

function LanguageSwitcher() {
  const { locale, getSwitchHref, siteUi } = usePublicSite();
  const [isOpen, setIsOpen] = useState(false);
  const switcherRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: globalThis.PointerEvent) {
      if (!switcherRef.current || !(event.target instanceof Node) || switcherRef.current.contains(event.target)) {
        return;
      }

      setIsOpen(false);
    }

    function handleEscape(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [locale]);

  function handleLocaleSelect(nextLocale: SiteLocaleCode) {
    if (nextLocale === locale) {
      setIsOpen(false);
      return;
    }

    // 对于 /app 路由，将语言偏好保存到 localStorage 后刷新页面
    if (window.location.pathname.startsWith("/app")) {
      saveAppLocale(nextLocale);
      window.location.reload();
      return;
    }

    window.location.assign(getSwitchHref(nextLocale));
  }

  return (
    <div className={`lang-switcher${isOpen ? " is-open" : ""}`} ref={switcherRef}>
      <button
        type="button"
        className="lang-switcher-trigger"
        aria-label={siteUi.common.languageLabel}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        title={siteLocaleLabels[locale].nativeName}
        onClick={() => {
          setIsOpen((current) => !current);
        }}
      >
        <span className="lang-switcher-trigger-icon" aria-hidden="true">
          <Icon name="globe" />
        </span>
        <span className="lang-switcher-trigger-label">{siteLocaleLabels[locale].switcherLabel}</span>
        <span className="lang-switcher-trigger-caret" aria-hidden="true">
          <Icon name="chevron_down" />
        </span>
      </button>
      {isOpen ? (
        <div className="lang-switcher-menu" role="listbox" aria-label={siteUi.common.languageLabel}>
          {supportedSiteLocales.map((code) => {
            const language = siteLocaleLabels[code];
            const isActive = code === locale;

            return (
              <button
                key={code}
                type="button"
                role="option"
                aria-selected={isActive}
                className={`lang-switcher-option${isActive ? " is-active" : ""}`}
                onClick={() => {
                  handleLocaleSelect(code);
                }}
              >
                <span className="lang-switcher-option-indicator" aria-hidden="true">
                  {isActive ? <Icon name="check" /> : null}
                </span>
                <span className="lang-switcher-option-text" lang={language.htmlLang}>
                  {language.nativeName}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function MarketingSite() {
  const { locale, siteUi, localizeHref, formatMessage } = usePublicSite();
  const home = siteUi.home;
  const seoPages = getSeoPages(locale);
  const productPages = getProductPages(locale);
  const homeKeywordSet = homeSeoKeywords[locale] ?? homeSeoKeywords.en;
  const homeKeywordsForStructuredData = [
    homeKeywordSet.primaryKeyword,
    ...homeKeywordSet.secondaryKeywords,
    ...(homeKeywordSet.longTailKeywords ?? [])
  ];
  const homeStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: siteUi.common.brand,
        url: absoluteUrl("/", locale),
        email: "support@leadcue.app"
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: siteUi.common.brand,
        url: absoluteUrl("/", locale),
        publisher: { "@id": `${SITE_URL}/#organization` },
        description: home.seo.structuredDescription,
        inLanguage: getLocaleHtmlLang(locale),
        image: absoluteUrl(getSeoImagePath(locale, "/")),
        keywords: homeKeywordsForStructuredData.join(", ")
      },
      {
        "@type": "SoftwareApplication",
        name: siteUi.common.brand,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: absoluteUrl("/", locale),
        inLanguage: getLocaleHtmlLang(locale),
        image: absoluteUrl(getSeoImagePath(locale, "/")),
        keywords: homeKeywordsForStructuredData.join(", "),
        offers: PRICING_PLANS.map((plan) => ({
          "@type": "Offer",
          name: plan.name,
          price: plan.price,
          priceCurrency: "USD",
          url: `${SITE_URL}${localizeHref("/login")}`
        }))
      }
    ]
  };

  return (
    <div className="site-shell">
      <SeoHead
        title={home.seo.title}
        description={home.seo.description}
        keywords={homeKeywordsForStructuredData}
        path="/"
        locale={locale}
        structuredData={homeStructuredData}
      />
      <header className={`topbar topbar-marketing topbar-locale-${locale}`}>
        <a className="brand" href={localizeHref("/")} aria-label={`${siteUi.common.brand} ${siteUi.common.home}`}>
          <BrandMark />
          <span>{siteUi.common.brand}</span>
        </a>
        <nav className="nav-links" aria-label={`${siteUi.common.brand} ${siteUi.nav.resources}`}>
          <a href="#features">{siteUi.nav.features}</a>
          <a href="#how">{siteUi.nav.howItWorks}</a>
          <a href="#card">{siteUi.nav.sampleCard}</a>
          <a href="#pricing">{siteUi.nav.pricing}</a>
          <a href="#resources">{siteUi.nav.resources}</a>
        </nav>
        <div className="topbar-actions">
          <LanguageSwitcher />
          <a className="button button-small button-secondary" href={localizeHref("/login")}>
            {siteUi.nav.signIn}
          </a>
          <a className="button button-small button-primary" href={localizeHref("/login")}>
            <Icon name="mail" />
            {siteUi.nav.startFree}
          </a>
        </div>
      </header>

      <main>
        <section className="hero-band">
          <div className="hero-copy">
            <p className="eyebrow glass-pill">{home.hero.eyebrow}</p>
            <h1>
              {home.hero.titleLead} <span className="accent-text">{home.hero.titleAccent}</span>
            </h1>
            <p className="hero-subhead">{home.hero.subhead}</p>
            <div className="hero-actions">
              <a className="button button-primary" href={localizeHref("/login")}>
                <Icon name="mail" />
                {home.hero.primaryCta}
              </a>
              <a className="button button-secondary" href="#card">
                <Icon name="clipboard" />
                {home.hero.secondaryCta}
              </a>
            </div>
            <p className="microcopy">{home.hero.microcopy}</p>
            <div className="hero-stage">
              <div className="hero-visual-card" aria-label={home.hero.visualNote}>
                <HeroVisualIllustration copy={home.heroVisual} />
                <span className="hero-visual-note">
                  <Icon name="spark" />
                  {home.hero.visualNote}
                </span>
              </div>

              <div className="hero-analytics glass-card" aria-label={home.analytics.title}>
                <div className="hero-analytics-top">
                  <div>
                    <span className="analytics-kicker">{home.analytics.kicker}</span>
                    <strong>{home.analytics.title}</strong>
                  </div>
                  <div className="analytics-meta" aria-label={`${home.analytics.live} ${home.analytics.timeframe}`}>
                    <span className="live-dot">{home.analytics.live}</span>
                    <span className="live-timeframe">{home.analytics.timeframe}</span>
                  </div>
                </div>
                <div className="live-metric-grid">
                  {home.analytics.metrics.map((metric, index) => (
                    <div className="live-metric" key={metric.label}>
                      <span className="metric-icon">
                        <Icon name={(["scan", "target", "chart", "clipboard"] as const)[index]} />
                      </span>
                      <span className="metric-label">{metric.label}</span>
                      <strong>{metric.value}</strong>
                      <small>{metric.delta}</small>
                    </div>
                  ))}
                </div>
                <div className="analytics-body">
                  <div className="analytics-chart-card">
                    <div className="chart-header">
                      <div>
                        <span>{home.analytics.chartLabel}</span>
                        <strong>{home.analytics.chartTitle}</strong>
                      </div>
                      <span className="chart-badge">{home.analytics.chartBadge}</span>
                    </div>
                    <div className="live-chart" aria-hidden="true">
                      {[38, 54, 48, 66, 62, 74, 69, 84, 78, 92, 86, 96].map((height, index) => (
                        <i style={{ height: `${height}%` }} key={index} />
                      ))}
                      <svg className="chart-line" viewBox="0 0 320 120" focusable="false" aria-hidden="true">
                        <polyline points="2,98 32,78 62,86 92,58 122,64 152,42 182,50 212,28 242,34 272,16 318,24" />
                      </svg>
                    </div>
                  </div>
                  <div className="analytics-side">
                    <div className="signal-mix">
                      <span className="side-label">{home.analytics.mixLabel}</span>
                      {home.analytics.mix.map((signal) => (
                        <div className={`signal-row ${signal.tone}`} key={signal.label}>
                          <div className="signal-row-top">
                            <span>{signal.label}</span>
                            <strong>{signal.value}%</strong>
                          </div>
                          <div className="signal-track">
                            <i style={{ width: `${signal.value}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="recent-scans">
                      <span className="side-label">{home.analytics.highFitLabel}</span>
                      {home.analytics.highFitSites.map((scan) => (
                        <div className="scan-row" key={scan.company}>
                          <div>
                            <strong>{scan.company}</strong>
                            <span>{scan.cue}</span>
                          </div>
                          <span className="scan-fit">{scan.fit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="analytics-footer">
                  <span>
                    <Icon name="check" />
                    {home.analytics.footerReady}
                  </span>
                  <span>{home.analytics.footerUsage}</span>
                </div>
              </div>
            </div>
            <div className="hero-trust-badges" aria-label={home.trustBandLead}>
              {home.trustBadges.map((badge, index) => (
                <span className="glass-badge" key={badge}>
                  <Icon name={(["lock", "shield", "database", "check"] as const)[index]} />
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="section trust-band">
          <div className="section-inner trust-band-inner">
            <span>{home.trustBandLead}</span>
            {home.trustBadges.map((badge, index) => (
              <strong key={badge}>
                <Icon name={(["lock", "shield", "database", "check"] as const)[index]} />
                {badge}
              </strong>
            ))}
          </div>
        </section>

        <section className="section homepage-map-section" aria-labelledby="homepage-map-title">
          <div className="section-inner">
            <div className="section-heading section-heading-split">
              <div>
                <p className="eyebrow">{home.map.eyebrow}</p>
                <h2 id="homepage-map-title">{home.map.title}</h2>
              </div>
              <p className="section-copy">{home.map.copy}</p>
            </div>
            <div className="homepage-map-grid">
              {home.map.items.map((item, index) => (
                <a className="homepage-map-card" href={item.href} key={item.href}>
                  <span className="feature-icon">
                    <Icon name={(["layers", "scan", "clipboard", "chart", "mail"] as const)[index]} />
                  </span>
                  <small>{item.eyebrow}</small>
                  <strong>{item.title}</strong>
                  <p>{item.copy}</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="section problem-section">
          <div className="section-inner two-column">
            <div>
              <p className="eyebrow">{home.problem.eyebrow}</p>
              <h2>{home.problem.title}</h2>
            </div>
            <div className="problem-list">
              {home.problem.questions.map((item) => (
                <div className="problem-row" key={item}>
                  <Icon name="check" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section feature-section" id="features">
          <div className="section-inner">
            <div className="section-heading">
              <p className="eyebrow">{home.features.eyebrow}</p>
              <h2>{home.features.title}</h2>
              <p className="section-copy">{home.features.copy}</p>
            </div>
            <div className="feature-grid">
              {home.features.items.map((feature, index) => (
                <article className="feature-card glass-card" key={feature.title}>
                  <span className="feature-icon">
                    <Icon name={(["chart", "target", "layers", "database"] as const)[index]} />
                  </span>
                  <span className="feature-tag">{feature.meta}</span>
                  <h3>{feature.title}</h3>
                  <p>{feature.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="how">
          <div className="section-inner">
            <div className="section-heading">
              <p className="eyebrow">{home.workflow.eyebrow}</p>
              <h2>{home.workflow.title}</h2>
            </div>
            <div className="step-grid">
              {home.workflow.steps.map((step, index) => (
                <article className="step-card" key={step.title}>
                  <span className="step-number">{index + 1}</span>
                  <h3>{step.title}</h3>
                  <p>{step.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section method-section">
          <div className="section-inner two-column media-story">
            <div className="media-copy">
              <p className="eyebrow">{home.method.eyebrow}</p>
              <h2>
                {home.method.titleLead} <span className="accent-text">{home.method.titleAccent}</span>
              </h2>
              <p className="section-copy">{home.method.copy}</p>
              <div className="method-checklist">
                {home.method.checklist.map((item) => (
                  <span key={item}>
                    <Icon name="check" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <figure className="media-frame">
              <ResearchDeskIllustration copy={home.researchVisual} />
              <figcaption>
                <strong>{home.method.frameTitle}</strong>
                <span>{home.method.frameCopy}</span>
              </figcaption>
            </figure>
          </div>
        </section>

        <section className="section section-muted" id="card">
          <div className="section-inner two-column card-showcase">
            <div className="sample-card-copy">
              <p className="eyebrow">{home.sampleCard.eyebrow}</p>
              <h2>{home.sampleCard.title}</h2>
              <p className="section-copy">{home.sampleCard.copy}</p>
              <div className="sample-proof-grid" aria-label={home.sampleCard.proofAriaLabel}>
                {home.sampleCard.stats.map((item) => (
                  <div className="sample-proof-item" key={item.label}>
                    <strong>{item.value}</strong>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
              <div className="sample-card-actions">
                <a className="button button-primary" href={localizeHref("/login")}>
                  <Icon name="scan" />
                  {home.sampleCard.primaryCta}
                </a>
                <a className="button button-secondary" href={localizeHref("/docs")}>
                  <Icon name="clipboard" />
                  {home.sampleCard.secondaryCta}
                </a>
              </div>
            </div>
            <HomeProspectPreview card={buildSampleProspectCard(locale)} />
          </div>
        </section>

        <section className="section">
          <div className="section-inner">
            <div className="section-heading">
              <p className="eyebrow">{home.useCases.eyebrow}</p>
              <h2>{home.useCases.title}</h2>
            </div>
            <div className="use-case-grid">
              {home.useCases.items.map((item, index) => (
                <article className="use-case-card" key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                  <a href={localizeHref("/login")}>
                    {item.cta}
                    <Icon name="arrow" />
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section comparison-section">
          <div className="section-inner two-column">
            <div>
              <p className="eyebrow">{home.comparison.eyebrow}</p>
              <h2>{home.comparison.title}</h2>
              <p className="section-copy">{home.comparison.copy}</p>
            </div>
            <div className="comparison-table" role="table" aria-label={home.comparison.title}>
              {home.comparison.rows.map(([type, gives, missing]) => (
                <div className="comparison-row" role="row" key={type}>
                  <strong>{type}</strong>
                  <span>{gives}</span>
                  <span>{missing}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-muted" id="pricing">
          <div className="section-inner">
            <div className="section-heading">
              <p className="eyebrow">{home.pricing.eyebrow}</p>
              <h2>{home.pricing.title}</h2>
              <p className="section-copy">{home.pricing.copy}</p>
            </div>
            <div className="pricing-grid">
              {PRICING_PLANS.map((plan) => (
                <article className={`pricing-card glass-card ${plan.id === "pro" ? "featured-plan" : ""}`} key={plan.id}>
                  <div className="pricing-card-top">
                    {plan.id === "pro" ? <span className="plan-ribbon">{home.pricing.mostUseful}</span> : <span />}
                    <span className="plan-credit-pill">{`${plan.monthlyCredits.toLocaleString()} ${home.pricing.scansSuffix}`}</span>
                  </div>
                  <h3>{plan.name}</h3>
                  <div className="price-row">
                    <p className="price">{plan.price === 0 ? "$0" : `$${plan.price}`}</p>
                    <span>{home.pricing.perMonth}</span>
                  </div>
                  <span className="plan-description">{home.pricing.planBenefits[plan.id][0]}</span>
                  <span className="plan-use-case">{home.pricing.planUseCases[plan.id]}</span>
                  <ul>
                    {home.pricing.planBenefits[plan.id].map((benefit) => (
                      <li key={benefit}>
                        <Icon name="check" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  <a
                    className="plan-cta"
                    href={localizeHref("/login")}
                    aria-label={
                      plan.id === "free"
                        ? formatMessage(home.pricing.ariaStartFree, { plan: plan.name })
                        : formatMessage(home.pricing.ariaSubscribe, { plan: plan.name })
                    }
                    onClick={() => {
                      void trackEvent({
                        name: "pricing_plan_click",
                        metadata: {
                          planId: plan.id
                        }
                      });
                    }}
                  >
                    <Icon name="mail" />
                    {plan.id === "free"
                      ? home.pricing.startFreeScan
                      : plan.id === "agency"
                        ? home.pricing.startAgencySetup
                        : formatMessage(home.pricing.startPlan, { plan: plan.name })}
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section faq-section" id="faq">
          <div className="section-inner faq-layout">
            <div>
              <p className="eyebrow">{home.faqSection.eyebrow}</p>
              <h2>{home.faqSection.title}</h2>
              <p className="section-copy">{home.faqSection.copy}</p>
            </div>
            <div className="faq-list">
              {home.faqSection.items.map((item) => (
                <details className="faq-card glass-card" key={item.question}>
                  <summary>
                    <span>{item.question}</span>
                    <Icon name="arrow" />
                  </summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="section resources-section" id="resources">
          <div className="section-inner">
            <div className="section-heading section-heading-split">
              <div>
                <p className="eyebrow">{home.resources.eyebrow}</p>
                <h2>
                  {home.resources.titleLead} <span className="accent-text">{home.resources.titleAccent}</span>
                </h2>
              </div>
              <p className="section-copy">{home.resources.copy}</p>
            </div>
            <div className="resource-grid">
              {home.resources.items.map((article, index) => (
                <article className="resource-card" key={article.title}>
                  <div className="resource-card-visual">
                    <ResourceIllustration
                      copy={index === 0 ? home.resourceVisuals.playbook : index === 1 ? home.resourceVisuals.qualification : home.resourceVisuals.strategy}
                    />
                  </div>
                  <span>{article.label}</span>
                  <h3>{article.title}</h3>
                  <p>{article.copy}</p>
                  <a href={localizeHref(article.href)}>
                    {home.resources.readGuide}
                    <Icon name="arrow" />
                  </a>
                </article>
              ))}
            </div>
            <div className="resource-index" aria-label={home.resources.titleLead}>
              <div>
                <span>{home.resources.browseLead}</span>
                <strong>{home.resources.browseTitle}</strong>
              </div>
              <div className="resource-index-links">
                {seoPages.map((page) => (
                  <a href={localizeHref(`/${page.slug}`)} key={page.slug}>
                    {page.category}
                  </a>
                ))}
                {productPages.map((page) => (
                  <a href={localizeHref(`/${page.slug}`)} key={page.slug}>
                    {page.category}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section signup-section" id="start">
          <div className="section-inner signup-layout">
            <div>
              <p className="eyebrow">{home.launch.eyebrow}</p>
              <h2>{home.launch.title}</h2>
              <p className="section-copy">{home.launch.copy}</p>
              <div className="signup-points">
                <span>
                  <Icon name="check" />
                  {home.launch.points[0]}
                </span>
                <span>
                  <Icon name="shield" />
                  {home.launch.points[1]}
                </span>
                <span>
                  <Icon name="database" />
                  {home.launch.points[2]}
                </span>
              </div>
            </div>
            <div className="signup-card">
              <span className="signup-card-kicker">{home.launch.cardKicker}</span>
              <h3>{home.launch.cardTitle}</h3>
              <p>{home.launch.cardCopy}</p>
              <form className="quick-scan-form" action={localizeHref("/login")} method="get">
                <input type="hidden" name="plan" value="free" />
                <label htmlFor="quick-scan-url">{home.launch.quickScanLabel}</label>
                <div>
                  <input
                    id="quick-scan-url"
                    name="first"
                    type="url"
                    placeholder={home.launch.quickScanPlaceholder}
                    aria-label={home.launch.quickScanAria}
                  />
                  <button className="button button-primary" type="submit">
                    <Icon name="scan" />
                    {home.launch.queueScan}
                  </button>
                </div>
              </form>
              <a className="button button-primary" href={localizeHref("/login")}>
                <Icon name="mail" />
                {home.launch.startFree}
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="section-inner footer-inner">
          <div className="footer-brand">
            <a className="brand" href={localizeHref("/")} aria-label={`${siteUi.common.brand} ${siteUi.common.home}`}>
              <BrandMark />
              <span>{siteUi.common.brand}</span>
            </a>
            <p>{home.footer.brandCopy}</p>
          </div>
          <div className="footer-column">
            <strong>{home.footer.productTitle}</strong>
            <a href="#features">{siteUi.nav.features}</a>
            <a href="#card">{siteUi.nav.sampleCard}</a>
            <a href="#pricing">{siteUi.nav.pricing}</a>
            <a href={localizeHref("/app")}>{home.footer.dashboard}</a>
          </div>
          <div className="footer-column">
            <strong>{home.footer.resourcesTitle}</strong>
            <a href={localizeHref("/website-prospecting")}>{seoPages[0]?.category ?? "Website prospecting"}</a>
            <a href={localizeHref("/cold-email-first-lines")}>{seoPages[2]?.category ?? "Cold email"}</a>
            <a href={localizeHref("/agency-lead-qualification")}>{seoPages[3]?.category ?? "Lead qualification"}</a>
            <a href="#faq">{siteUi.common.faq}</a>
          </div>
          <div className="footer-column">
            <strong>{home.footer.legalTitle}</strong>
            <a href={localizeHref("/docs")}>{home.footer.docs}</a>
            <a href={localizeHref("/contact")}>{home.footer.contact}</a>
            <a href={localizeHref("/privacy")}>{home.footer.privacy}</a>
            <a href={localizeHref("/terms")}>{home.footer.terms}</a>
            <a href={localizeHref("/support")}>{home.footer.support}</a>
          </div>
        </div>
        <div className="section-inner footer-bottom">
          <span>{home.footer.copyright}</span>
          <div>
            <a href={localizeHref("/privacy")}>{home.footer.privacyPolicy}</a>
            <a href={localizeHref("/terms")}>{home.footer.termsAndConditions}</a>
            <a href={localizeHref("/login")}>{home.launch.startFree}</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function makeContentAnchor(value: string) {
  const asciiAnchor = value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (asciiAnchor) {
    return asciiAnchor;
  }

  const unicodeAnchor = Array.from(value.trim())
    .map((char) => char.codePointAt(0)?.toString(16) ?? "")
    .filter(Boolean)
    .join("-");

  return unicodeAnchor ? `section-${unicodeAnchor}` : "section";
}

function getSeoContentStructuredData(page: SeoContentPage, locale: SiteLocaleCode) {
  const path = `/${page.slug}`;
  const url = absoluteUrl(path, locale);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: page.title,
        description: page.description,
        datePublished: page.updatedAt,
        dateModified: page.updatedAt,
        image: absoluteUrl(getSeoImagePath(locale, path)),
        inLanguage: getLocaleHtmlLang(locale),
        author: {
          "@type": "Organization",
          name: "LeadCue"
        },
        publisher: {
          "@type": "Organization",
          name: "LeadCue",
          url: SITE_URL
        },
        mainEntityOfPage: url,
        keywords: [page.primaryKeyword, ...page.secondaryKeywords].join(", ")
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: getSiteUi(locale).common.resources,
            item: `${absoluteUrl("/", locale)}#resources`
          },
          {
            "@type": "ListItem",
            position: 2,
            name: page.category,
            item: url
          }
        ]
      },
      {
        "@type": "FAQPage",
        mainEntity: page.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer
          }
        }))
      }
    ]
  };
}

function SeoContentPageView({ page }: { page: SeoContentPage }) {
  const { locale, localizeHref, siteUi } = usePublicSite();
  const path = `/${page.slug}`;
  const seoPageMap = getSeoPageMap(locale);
  const relatedPages = page.related
    .map((slug) => seoPageMap[slug])
    .filter((relatedPage): relatedPage is SeoContentPage => Boolean(relatedPage));

  return (
    <div className="site-shell">
      <SeoHead
        title={page.seoTitle}
        description={page.description}
        keywords={[page.primaryKeyword, ...page.secondaryKeywords]}
        path={path}
        locale={locale}
        type="article"
        structuredData={getSeoContentStructuredData(page, locale)}
      />
      <header className="topbar topbar-minimal content-topbar">
        <a className="brand" href={localizeHref("/")} aria-label={`${siteUi.common.brand} ${siteUi.common.home}`}>
          <BrandMark />
          <span>{siteUi.common.brand}</span>
        </a>
        <nav className="content-nav" aria-label={siteUi.home.footer.resourcesTitle}>
          <a href={localizeHref("/website-prospecting")}>{siteUi.content.seoNav.strategy}</a>
          <a href={localizeHref("/use-cases/web-design-agencies")}>{siteUi.content.seoNav.useCases}</a>
          <a href={localizeHref("/guides/turn-website-into-cold-email-angle")}>{siteUi.content.seoNav.guides}</a>
          <a href={localizeHref("/agency-lead-qualification")}>{siteUi.content.seoNav.qualification}</a>
        </nav>
        <LanguageSwitcher />
        <a className="button button-small button-primary topbar-back" href={localizeHref("/login")}>
          {siteUi.common.startFree}
        </a>
      </header>

      <main className="content-page seo-page">
        <section className="content-hero seo-hero">
          <nav className="seo-breadcrumb" aria-label={siteUi.content.breadcrumbs.resources}>
            <a href={localizeHref("/")}>{siteUi.content.breadcrumbs.home}</a>
            <span>/</span>
            <a href={localizeHref("/#resources")}>{siteUi.content.breadcrumbs.resources}</a>
            <span>/</span>
            <strong>{page.category}</strong>
          </nav>
          <p className="eyebrow glass-pill">{page.eyebrow}</p>
          <h1>{page.title}</h1>
          <p>{page.description}</p>
          <div className="seo-meta-row" aria-label={`${page.category} ${siteUi.common.updatedLabel}`}>
            <span>{page.category}</span>
            <span>{page.readingTime}</span>
            <span>{`${siteUi.common.updatedLabel} ${page.updatedAt}`}</span>
          </div>
          <div className="seo-keywords" aria-label={siteUi.common.searchIntent}>
            <span>{page.primaryKeyword}</span>
            {page.secondaryKeywords.map((keyword) => (
              <span key={keyword}>{keyword}</span>
            ))}
          </div>
        </section>

        <section className="seo-layout" aria-label={page.title}>
          <aside className="seo-toc" aria-label={siteUi.common.onThisPage}>
            <strong>{siteUi.common.onThisPage}</strong>
            {page.sections.map((section) => (
              <a href={`#${makeContentAnchor(section.title)}`} key={section.title}>
                {section.title}
              </a>
            ))}
            <a href="#example">{siteUi.common.example}</a>
            <a href="#faq">{siteUi.common.faq}</a>
          </aside>

          <article className="seo-article">
            <section className="seo-summary-panel">
              <div>
                <p className="eyebrow">{siteUi.common.searchIntent}</p>
                <h2>{page.intent}</h2>
              </div>
              <ul>
                {page.heroBullets.map((item) => (
                  <li key={item}>
                    <Icon name="check" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {page.sections.map((section) => (
              <section className="seo-section" id={makeContentAnchor(section.title)} key={section.title}>
                <h2>{section.title}</h2>
                <p>{section.copy}</p>
                <ul>
                  {section.items.map((item) => (
                    <li key={item}>
                      <Icon name="check" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}

            <section className="seo-example" id="example">
              <p className="eyebrow">{siteUi.common.example}</p>
              <h2>{page.example.title}</h2>
              <p>{page.example.copy}</p>
              <div className="seo-example-grid">
                {page.example.items.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </section>

            <section className="seo-faq" id="faq">
              <p className="eyebrow">{siteUi.common.faq}</p>
              <h2>{siteUi.content.faqTitle}</h2>
              {page.faqs.map((faq) => (
                <details className="seo-faq-item" key={faq.question}>
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </section>

            <section className="seo-related" aria-label={siteUi.common.relatedResources}>
              <div>
                <p className="eyebrow">{siteUi.common.relatedResources}</p>
                <h2>{siteUi.common.keepBuilding}</h2>
              </div>
              <div className="seo-related-grid">
                {relatedPages.map((relatedPage) => (
                  <a href={localizeHref(`/${relatedPage.slug}`)} key={relatedPage.slug}>
                    <span>{relatedPage.category}</span>
                    <strong>{relatedPage.title}</strong>
                  </a>
                ))}
              </div>
            </section>
          </article>
        </section>

        <section className="content-cta">
          <div>
            <p className="eyebrow">{siteUi.common.useOnRealAccount}</p>
            <h2>{siteUi.content.ctaTitleSeo}</h2>
          </div>
          <a className="button button-primary" href={localizeHref("/login")}>
            <Icon name="scan" />
            {siteUi.common.startFreeScan}
          </a>
        </section>
      </main>
    </div>
  );
}

type CrmMappingMode = "hubspot" | "salesforce" | "pipedrive" | "custom";

const requiredCrmFieldKeys = new Set(["company", "website", "owner", "stage"]);
const recommendedCrmFieldKeys = new Set(["fit", "confidence", "signal", "firstLine", "sourceNotes", "exported"]);

const agencyToolModes = ["web_design", "seo", "marketing"] as const;

type AgencyToolMode = (typeof agencyToolModes)[number];

const checklistModeRecommendations: Record<AgencyToolMode, string[]> = {
  web_design: ["cta", "proof", "caseStudies", "positioning", "contactPath", "sourceNotes"],
  seo: ["contentFreshness", "serviceDepth", "positioning", "contactPath", "sourceNotes"],
  marketing: ["cta", "proof", "contentFreshness", "positioning", "contactPath", "sourceNotes"]
};

function copyText(value: string) {
  void copyToClipboard(value);
}

function escapeCsvValue(value: string) {
  return `"${value.replace(/"/g, '""')}"`;
}

function getProductSeoStructuredData(page: ProductSeoPage, locale: SiteLocaleCode) {
  const path = `/${page.slug}`;
  const url = absoluteUrl(path, locale);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": page.tool === "integration" ? "TechArticle" : "Article",
        "@id": `${url}#article`,
        headline: page.title,
        description: page.description,
        datePublished: page.updatedAt,
        dateModified: page.updatedAt,
        image: absoluteUrl(getSeoImagePath(locale, path)),
        inLanguage: getLocaleHtmlLang(locale),
        author: { "@type": "Organization", name: "LeadCue" },
        publisher: { "@type": "Organization", name: "LeadCue", url: SITE_URL },
        mainEntityOfPage: url,
        keywords: [page.primaryKeyword, ...page.secondaryKeywords].join(", ")
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: getSiteUi(locale).common.resources, item: `${absoluteUrl("/", locale)}#resources` },
          { "@type": "ListItem", position: 2, name: page.category, item: url }
        ]
      },
      {
        "@type": "FAQPage",
        mainEntity: page.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer }
        }))
      }
    ]
  };
}

function getCommercialStructuredData(page: CommercialPageDefinition, slug: CommercialPageSlug, locale: SiteLocaleCode) {
  const path = `/${slug}`;
  const url = absoluteUrl(path, locale);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#page`,
        name: page.title,
        description: page.summary,
        url,
        image: absoluteUrl(getSeoImagePath(locale, path)),
        inLanguage: getLocaleHtmlLang(locale),
        keywords: [page.eyebrow, ...page.sections.map((section) => section.title)].join(", "),
        isPartOf: { "@id": `${SITE_URL}/#website` }
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: getSiteUi(locale).common.home, item: absoluteUrl("/", locale) },
          { "@type": "ListItem", position: 2, name: page.title, item: url }
        ]
      }
    ]
  };
}

function ProductSeoPageView({ page }: { page: ProductSeoPage }) {
  const { locale, localizeHref, siteUi } = usePublicSite();
  const path = `/${page.slug}`;
  const productPageMap = getProductPageMap(locale);
  const seoPageMap = getSeoPageMap(locale);
  const relatedPages = page.related
    .map((slug) => productPageMap[slug] ?? seoPageMap[slug])
    .filter((relatedPage): relatedPage is ProductSeoPage | SeoContentPage => Boolean(relatedPage));

  return (
    <div className="site-shell">
      <SeoHead
        title={page.seoTitle}
        description={page.description}
        keywords={[page.primaryKeyword, ...page.secondaryKeywords]}
        path={path}
        locale={locale}
        type="article"
        structuredData={getProductSeoStructuredData(page, locale)}
      />
      <header className="topbar topbar-minimal content-topbar">
        <a className="brand" href={localizeHref("/")} aria-label={`${siteUi.common.brand} ${siteUi.common.home}`}>
          <BrandMark />
          <span>{siteUi.common.brand}</span>
        </a>
        <nav className="content-nav" aria-label={siteUi.home.footer.resourcesTitle}>
          <a href={localizeHref("/tools/prospect-research-chrome-extension")}>{siteUi.content.productNav.extension}</a>
          <a href={localizeHref("/tools/batch-website-review-queue")}>{siteUi.content.productNav.reviewQueue}</a>
          <a href={localizeHref("/tools/outreach-context-workspace")}>{siteUi.content.productNav.workspace}</a>
          <a href={localizeHref("/templates/crm-csv-field-mapping")}>{siteUi.content.productNav.csvTool}</a>
          <a href={localizeHref("/templates/cold-email-first-line")}>{siteUi.content.productNav.firstLines}</a>
          <a href={localizeHref("/templates/website-prospecting-checklist")}>{siteUi.content.productNav.checklist}</a>
          <a href={localizeHref("/integrations/hubspot-csv-export")}>{siteUi.content.productNav.integrations}</a>
        </nav>
        <LanguageSwitcher />
        <a className="button button-small button-primary topbar-back" href={localizeHref("/login")}>
          {siteUi.common.startFree}
        </a>
      </header>

      <main className="content-page seo-page product-seo-page">
        <section className="content-hero seo-hero">
          <nav className="seo-breadcrumb" aria-label={siteUi.content.breadcrumbs.resources}>
            <a href={localizeHref("/")}>{siteUi.content.breadcrumbs.home}</a>
            <span>/</span>
            <a href={localizeHref("/#resources")}>{siteUi.content.breadcrumbs.resources}</a>
            <span>/</span>
            <strong>{page.category}</strong>
          </nav>
          <p className="eyebrow glass-pill">{page.eyebrow}</p>
          <h1>{page.title}</h1>
          <p>{page.description}</p>
          <div className="seo-meta-row" aria-label={`${page.category} ${siteUi.common.updatedLabel}`}>
            <span>{page.category}</span>
            <span>{page.readingTime}</span>
            <span>{`${siteUi.common.updatedLabel} ${page.updatedAt}`}</span>
          </div>
          <div className="seo-keywords" aria-label={siteUi.common.searchIntent}>
            <span>{page.primaryKeyword}</span>
            {page.secondaryKeywords.map((keyword) => (
              <span key={keyword}>{keyword}</span>
            ))}
          </div>
        </section>

        <section className="seo-layout" aria-label={`${page.title} ${siteUi.common.tool}`}>
          <aside className="seo-toc" aria-label={siteUi.common.onThisPage}>
            <strong>{siteUi.common.onThisPage}</strong>
            <a href="#tool">{siteUi.common.tool}</a>
            {page.sections.map((section) => (
              <a href={`#${makeContentAnchor(section.title)}`} key={section.title}>
                {section.title}
              </a>
            ))}
            <a href="#faq">{siteUi.common.faq}</a>
          </aside>

          <article className="seo-article">
            <section className="seo-summary-panel">
              <div>
                <p className="eyebrow">{siteUi.common.searchIntent}</p>
                <h2>{page.intent}</h2>
              </div>
              <ul>
                {page.heroBullets.map((item) => (
                  <li key={item}>
                    <Icon name="check" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="product-tool-shell" id="tool">
              <ProductToolSurface page={page} />
            </section>

            <section className="tool-conversion-band" aria-label={siteUi.content.toolBand.title}>
              <div className="tool-conversion-copy">
                <p className="eyebrow">{siteUi.content.toolBand.eyebrow}</p>
                <h2>{siteUi.content.toolBand.title}</h2>
                <p>{siteUi.content.toolBand.copy}</p>
              </div>
              <div className="tool-conversion-actions">
                <a
                  className="button button-primary"
                  href={localizeHref("/login")}
                  onClick={() => {
                    void trackEvent({
                      name: "product_tool_primary_click",
                      metadata: {
                        slug: page.slug,
                        tool: page.tool
                      }
                    });
                  }}
                >
                  <Icon name="scan" />
                  {siteUi.content.toolBand.primaryCta}
                </a>
                <a
                  className="button button-secondary"
                  href={localizeHref("/app/leads?lead=lead_sample")}
                  onClick={() => {
                    void trackEvent({
                      name: "product_tool_secondary_click",
                      metadata: {
                        slug: page.slug,
                        target: "sample_card"
                      }
                    });
                  }}
                >
                  <Icon name="clipboard" />
                  {siteUi.content.toolBand.secondaryCta}
                </a>
              </div>
              <div className="tool-conversion-points">
                {siteUi.content.toolBand.points.map((item) => (
                  <span key={item}>
                    <Icon name="check" />
                    {item}
                  </span>
                ))}
              </div>
            </section>

            {page.sections.map((section) => (
              <section className="seo-section" id={makeContentAnchor(section.title)} key={section.title}>
                <h2>{section.title}</h2>
                <p>{section.copy}</p>
                <ul>
                  {section.items.map((item) => (
                    <li key={item}>
                      <Icon name="check" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}

            <section className="seo-faq" id="faq">
              <p className="eyebrow">{siteUi.common.faq}</p>
              <h2>{siteUi.content.faqTitle}</h2>
              {page.faqs.map((faq) => (
                <details className="seo-faq-item" key={faq.question}>
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </section>

            <section className="seo-related" aria-label={siteUi.common.relatedResources}>
              <div>
                <p className="eyebrow">{siteUi.common.relatedResources}</p>
                <h2>{siteUi.common.keepBuilding}</h2>
              </div>
              <div className="seo-related-grid">
                {relatedPages.map((relatedPage) => (
                  <a href={localizeHref(`/${relatedPage.slug}`)} key={relatedPage.slug}>
                    <span>{relatedPage.category}</span>
                    <strong>{relatedPage.title}</strong>
                  </a>
                ))}
              </div>
            </section>
          </article>
        </section>

        <section className="content-cta">
          <div>
            <p className="eyebrow">{siteUi.common.useOnRealAccount}</p>
            <h2>{siteUi.content.ctaTitleProduct}</h2>
          </div>
          <a
            className="button button-primary"
            href={localizeHref("/login")}
            onClick={() => {
              void trackEvent({
                name: "product_tool_primary_click",
                metadata: {
                  slug: page.slug,
                  tool: page.tool,
                  source: "page_footer_cta"
                }
              });
            }}
          >
            <Icon name="scan" />
            {siteUi.common.startFreeScan}
          </a>
        </section>
      </main>
    </div>
  );
}

function ProductToolSurface({ page }: { page: ProductSeoPage }) {
  if (page.tool === "workflow") {
    return <ProductWorkflowTool page={page} />;
  }

  if (page.tool === "crm-mapping") {
    return <CrmFieldMappingTool />;
  }

  if (page.tool === "first-line") {
    return <FirstLineTemplateTool />;
  }

  if (page.tool === "checklist") {
    return <WebsiteProspectingChecklistTool />;
  }

  return <IntegrationExportTool platform={page.platform ?? "HubSpot"} />;
}

function ProductWorkflowTool({ page }: { page: ProductSeoPage }) {
  const { localizeHref, siteUi } = usePublicSite();
  const workflowSections = page.sections.slice(0, 2);

  return (
    <div className="product-tool">
      <div className="product-tool-head">
        <div>
          <p className="eyebrow">{page.category}</p>
          <h2>{page.intent}</h2>
          <p>{page.description}</p>
        </div>
        <div className="tool-actions">
          <a className="button button-secondary" href={localizeHref("/templates/website-prospecting-checklist")}>
            <Icon name="clipboard" />
            {siteUi.content.productNav.checklist}
          </a>
          <a className="button button-primary" href={localizeHref("/login")}>
            <Icon name="scan" />
            {siteUi.common.startFreeScan}
          </a>
        </div>
      </div>

      <div className="tool-kpi-strip">
        <div>
          <span>{page.secondaryKeywords[0]}</span>
          <strong>{page.primaryKeyword}</strong>
        </div>
        <div>
          <span>{siteUi.common.searchIntent}</span>
          <strong>{page.readingTime}</strong>
        </div>
        <div>
          <span>{siteUi.content.productNav.workspace}</span>
          <strong>{siteUi.common.relatedResources}</strong>
        </div>
      </div>

      <div className="tool-advice-grid">
        {workflowSections.map((section) => (
          <article className="tool-advice-card" key={section.title}>
            <span>{page.category}</span>
            <h3>{section.title}</h3>
            <p>{section.copy}</p>
            <ul>
              {section.items.slice(0, 3).map((item) => (
                <li key={item}>
                  <Icon name="check" />
                  {item}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}

function CrmFieldMappingTool() {
  const { siteUi, formatMessage } = usePublicSite();
  const crmCopy = siteUi.tools.crmMapping;
  const crmModes = crmCopy.modes;
  const crmRows = crmCopy.rows;
  const [mode, setMode] = useState<CrmMappingMode>("hubspot");
  const [scope, setScope] = useState<"all" | "required" | "recommended">("all");
  const [customPrefix, setCustomPrefix] = useState("lc_");
  const [selectedKeys, setSelectedKeys] = useState<string[]>(crmRows.map((row) => row.key));
  const visibleRows = crmRows.filter((row) => {
    if (scope === "required") {
      return requiredCrmFieldKeys.has(row.key);
    }

    if (scope === "recommended") {
      return recommendedCrmFieldKeys.has(row.key) || requiredCrmFieldKeys.has(row.key);
    }

    return true;
  });
  const selectedRows = crmRows.filter((row) => selectedKeys.includes(row.key));
  const missingRequired = Array.from(requiredCrmFieldKeys).filter((key) => !selectedKeys.includes(key));
  const labelForRow = (row: (typeof crmRows)[number]) =>
    mode === "custom" && customPrefix.trim() ? `${customPrefix.trim()}${row.labels.custom}` : row.labels[mode];
  const csvHeader = selectedRows.map((row) => labelForRow(row)).join(",");
  const csvSample = selectedRows.map((row) => escapeCsvValue(row.sample)).join(",");
  const csvText = `${csvHeader}\n${csvSample}`;
  const activeMode = crmModes.find((item) => item.value === mode) ?? crmModes[0];

  return (
    <div className="product-tool">
      <div className="product-tool-head">
        <div>
          <p className="eyebrow">{crmCopy.eyebrow}</p>
          <h2>{formatMessage(crmCopy.importPrep, { mode: activeMode.label })}</h2>
          <p>{activeMode.copy}</p>
        </div>
        <div className="tool-actions">
          <button
            className="button button-secondary"
            type="button"
            onClick={() => {
              copyText(csvHeader);
              void trackEvent({ name: "product_tool_copy", metadata: { tool: "crm-mapping", asset: "header", mode } });
            }}
          >
            <Icon name="clipboard" />
            {crmCopy.copyHeader}
          </button>
          <button
            className="button button-primary"
            type="button"
            onClick={() => {
              downloadTextFile(`${mode}-leadcue-sample.csv`, csvText);
              void trackEvent({ name: "product_tool_download", metadata: { tool: "crm-mapping", asset: "sample_csv", mode } });
            }}
          >
            <Icon name="download" />
            {crmCopy.sampleCsv}
          </button>
        </div>
      </div>

      <div className="tool-kpi-strip">
        <div>
          <span>{crmCopy.includedFields}</span>
          <strong>{selectedRows.length}</strong>
        </div>
        <div>
          <span>{crmCopy.requiredFields}</span>
          <strong>{requiredCrmFieldKeys.size - missingRequired.length}/{requiredCrmFieldKeys.size}</strong>
        </div>
        <div>
          <span>{crmCopy.bestFor}</span>
          <strong>{formatMessage(crmCopy.importPrep, { mode: activeMode.label })}</strong>
        </div>
      </div>

      <div className="tool-segmented" role="tablist" aria-label={crmCopy.eyebrow}>
        {crmModes.map((item) => (
          <button
            className={mode === item.value ? "is-active" : ""}
            type="button"
            role="tab"
            aria-selected={mode === item.value}
            key={item.value}
            onClick={() => setMode(item.value as CrmMappingMode)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="tool-segmented tool-segmented-secondary" role="tablist" aria-label={crmCopy.readyChecklist}>
        {[
          ["all", crmCopy.scopeAll],
          ["required", crmCopy.scopeRequired],
          ["recommended", crmCopy.scopeRecommended]
        ].map(([value, label]) => (
          <button
            className={scope === value ? "is-active" : ""}
            type="button"
            role="tab"
            aria-selected={scope === value}
            key={value}
            onClick={() => setScope(value as "all" | "required" | "recommended")}
          >
            {label}
          </button>
        ))}
      </div>

      {mode === "custom" ? (
        <label className="tool-inline-field">
          <span>{crmCopy.customPrefix}</span>
          <input value={customPrefix} onChange={(event) => setCustomPrefix(event.currentTarget.value)} placeholder="lc_" />
        </label>
      ) : null}

      <div className="field-mapping-grid">
        <div className="field-picker" aria-label={crmCopy.includedFields}>
          <strong>{crmCopy.includedFields}</strong>
          {visibleRows.map((row) => (
            <label key={row.key}>
              <input
                type="checkbox"
                checked={selectedKeys.includes(row.key)}
                onChange={(event) => {
                  setSelectedKeys((current) =>
                    event.target.checked ? [...current, row.key] : current.filter((key) => key !== row.key)
                  );
                }}
              />
              <span>{labelForRow(row)}</span>
            </label>
          ))}
        </div>

        <div className="mapping-table" aria-label={formatMessage(crmCopy.importPrep, { mode: activeMode.label })}>
          <div className="mapping-table-row mapping-table-head">
            <span>{crmCopy.mappingField}</span>
            <span>{crmCopy.mappingGroup}</span>
            <span>{crmCopy.mappingPurpose}</span>
          </div>
          {selectedRows.map((row) => (
            <div className="mapping-table-row" key={row.key}>
              <strong>{labelForRow(row)}</strong>
              <span>{row.group}</span>
              <p>{row.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="tool-advice-grid">
        <article className="tool-advice-card">
          <span>{crmCopy.readyChecklist}</span>
          <strong>{missingRequired.length ? crmCopy.readyMissing : crmCopy.readyComplete}</strong>
          <p>
            {missingRequired.length
              ? formatMessage(crmCopy.readyMissingCopy, { missing: missingRequired.join(", ") })
              : crmCopy.readyCompleteCopy}
          </p>
        </article>
        <article className="tool-advice-card">
          <span>{crmCopy.bestPractice}</span>
          <strong>{crmCopy.bestPracticeTitle}</strong>
          <p>{crmCopy.bestPracticeCopy}</p>
        </article>
      </div>

      <pre className="csv-preview">{csvText}</pre>
    </div>
  );
}

function FirstLineTemplateTool() {
  const { siteUi, localizeHref } = usePublicSite();
  const firstLineCopy = siteUi.tools.firstLine;
  const localizedTemplates = firstLineCopy.templates;
  const [agencyMode, setAgencyMode] = useState<AgencyToolMode>("web_design");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = localizedTemplates[selectedIndex] ?? localizedTemplates[0];
  const selectedVariant = buildFirstLineVariant(selected, agencyMode, selectedIndex, siteUi);
  const email = `Hi Alex,\n\n${selected.firstLine}\n\n${selectedVariant.nextSentence}\n\n${selectedVariant.cta}`;

  return (
    <div className="product-tool first-line-tool">
      <div className="product-tool-head">
        <div>
          <p className="eyebrow">{firstLineCopy.eyebrow}</p>
          <h2>{selected.signal}</h2>
          <p>{firstLineCopy.pickerCopy}</p>
        </div>
        <button
          className="button button-primary"
          type="button"
          onClick={() => {
            copyText(email);
            void trackEvent({
              name: "product_tool_copy",
              metadata: { tool: "first-line", asset: "email", signal: selected.signal, agencyMode }
            });
          }}
        >
          <Icon name="clipboard" />
          {firstLineCopy.copyEmail}
        </button>
      </div>

      <div className="tool-segmented tool-segmented-secondary" role="tablist" aria-label={firstLineCopy.eyebrow}>
        {agencyToolModes.map((mode) => (
          <button
            className={agencyMode === mode ? "is-active" : ""}
            type="button"
            key={mode}
            onClick={() => setAgencyMode(mode)}
          >
            {firstLineCopy.modeLabels[mode]}
          </button>
        ))}
      </div>

      <div className="template-signal-grid">
        {localizedTemplates.map((template, index) => (
          <button
            className={selectedIndex === index ? "is-active" : ""}
            type="button"
            key={template.signal}
            onClick={() => setSelectedIndex(index)}
          >
            <span>{template.category}</span>
            <strong>{template.signal}</strong>
          </button>
        ))}
      </div>

      <div className="template-output">
        <div>
          <span>{firstLineCopy.firstLineLabel}</span>
          <p>{selected.firstLine}</p>
        </div>
        <div>
          <span>{firstLineCopy.bridgeLabel}</span>
          <p>{selectedVariant.nextSentence}</p>
        </div>
        <div>
          <span>{firstLineCopy.ctaLabel}</span>
          <p>{selectedVariant.cta}</p>
        </div>
      </div>

      <div className="tool-advice-grid">
        <article className="tool-advice-card">
          <span>{firstLineCopy.whyLabel}</span>
          <strong>{selectedVariant.whyItWorks}</strong>
          <p>{firstLineCopy.whyCopy}</p>
        </article>
        <article className="tool-advice-card tool-advice-card-contrast">
          <span>{firstLineCopy.avoidLabel}</span>
          <strong>{selectedVariant.badExample}</strong>
          <p>{firstLineCopy.avoidCopy}</p>
        </article>
      </div>

      <div className="tool-micro-actions">
        <button
          className="button button-secondary"
          type="button"
          onClick={() => {
            copyText(selected.firstLine);
            void trackEvent({
              name: "product_tool_copy",
              metadata: { tool: "first-line", asset: "first_line", signal: selected.signal, agencyMode }
            });
          }}
        >
          <Icon name="clipboard" />
          {firstLineCopy.copyFirstLine}
        </button>
        <a
          className="button button-secondary"
          href={localizeHref("/login")}
          onClick={() => {
            void trackEvent({
              name: "product_tool_primary_click",
              metadata: { tool: "first-line", signal: selected.signal, agencyMode }
            });
          }}
        >
          <Icon name="scan" />
          {firstLineCopy.runInLeadCue}
        </a>
      </div>
    </div>
  );
}

function WebsiteProspectingChecklistTool() {
  const { siteUi, localizeHref, formatMessage } = usePublicSite();
  const checklistCopy = siteUi.tools.checklist;
  const localizedChecklistItems = checklistCopy.items;
  const checklistQuery = useMemo(() => new URLSearchParams(window.location.search), []);
  const initialMode = checklistQuery.get("mode");
  const resolvedMode = agencyToolModes.some((mode) => mode === initialMode)
    ? (initialMode as AgencyToolMode)
    : "web_design";
  const initialChecks = checklistQuery
    .get("checks")
    ?.split(",")
    .map((item) => item.trim())
    .filter((item) => localizedChecklistItems.some((check) => check.key === item));
  const [agencyMode, setAgencyMode] = useState<AgencyToolMode>(resolvedMode);
  const [checkedKeys, setCheckedKeys] = useState<string[]>(initialChecks?.length ? initialChecks : checklistModeRecommendations[resolvedMode]);
  const checkedItems = localizedChecklistItems.filter((item) => checkedKeys.includes(item.key));
  const score = Math.round((checkedItems.length / localizedChecklistItems.length) * 100);
  const strongestSignal = checkedItems[0]?.label ?? checklistCopy.summaryEmpty;
  const summaryText = `${checklistCopy.summaryTitle}\n${checklistCopy.summaryMode}: ${siteUi.tools.firstLine.modeLabels[agencyMode]}\n${checklistCopy.summaryCoverage}: ${score}%\n${checklistCopy.summarySignals}:\n${checkedItems
    .map((item) => `- ${item.category}: ${item.label}`)
    .join("\n")}`;
  const shareUrl = `${window.location.origin}${window.location.pathname}?mode=${agencyMode}&checks=${checkedKeys.join(",")}`;

  return (
    <div className="product-tool checklist-tool">
      <div className="product-tool-head">
        <div>
          <p className="eyebrow">{checklistCopy.eyebrow}</p>
          <h2>{formatMessage(checklistCopy.coverage, { score })}</h2>
          <p>{checklistCopy.copy}</p>
        </div>
        <button
          className="button button-primary"
          type="button"
          onClick={() => {
            copyText(summaryText);
            void trackEvent({ name: "product_tool_copy", metadata: { tool: "checklist", asset: "summary", agencyMode } });
          }}
        >
          <Icon name="clipboard" />
          {checklistCopy.copySummary}
        </button>
      </div>

      <div className="tool-segmented tool-segmented-secondary" role="tablist" aria-label={checklistCopy.eyebrow}>
        {agencyToolModes.map((mode) => (
          <button
            className={agencyMode === mode ? "is-active" : ""}
            type="button"
            key={mode}
            onClick={() => {
              setAgencyMode(mode);
              setCheckedKeys(checklistModeRecommendations[mode]);
            }}
          >
            {siteUi.tools.firstLine.modeLabels[mode]}
          </button>
        ))}
      </div>

      <div className="checklist-grid">
        {localizedChecklistItems.map((item) => (
          <label className={checkedKeys.includes(item.key) ? "is-checked" : ""} key={item.key}>
            <input
              type="checkbox"
              checked={checkedKeys.includes(item.key)}
              onChange={(event) => {
                setCheckedKeys((current) =>
                  event.target.checked ? [...current, item.key] : current.filter((key) => key !== item.key)
                );
              }}
            />
            <span>{item.category}</span>
            <strong>{item.label}</strong>
          </label>
        ))}
      </div>

      <div className="checklist-summary">
        <span>{checklistCopy.summaryTitle}</span>
        <p>{strongestSignal}</p>
        <strong>
          {formatMessage(checklistCopy.summaryCount, { count: checkedItems.length, total: localizedChecklistItems.length })}
        </strong>
        <small>
          {`${checklistCopy.nextStepLead} ${score >= 60 ? checklistCopy.nextStepReady : checklistCopy.nextStepMore}`}
        </small>
      </div>

      <div className="tool-micro-actions">
        <button
          className="button button-secondary"
          type="button"
          onClick={() => {
            copyText(shareUrl);
            void trackEvent({ name: "product_tool_copy", metadata: { tool: "checklist", asset: "share_link", agencyMode } });
          }}
        >
          <Icon name="clipboard" />
          {checklistCopy.copyShareLink}
        </button>
        <a
          className="button button-secondary"
          href={localizeHref("/login")}
          onClick={() => {
            void trackEvent({ name: "product_tool_primary_click", metadata: { tool: "checklist", agencyMode } });
          }}
        >
          <Icon name="scan" />
          {checklistCopy.runChecklist}
        </a>
      </div>
    </div>
  );
}

function IntegrationExportTool({ platform }: { platform: "HubSpot" | "Salesforce" | "Pipedrive" }) {
  const { siteUi, localizeHref, formatMessage } = usePublicSite();
  const integrationCopy = siteUi.tools.integration;
  const crmRows = siteUi.tools.crmMapping.rows;
  const mode: CrmMappingMode =
    platform === "HubSpot" ? "hubspot" : platform === "Salesforce" ? "salesforce" : "pipedrive";
  const csvHeader = crmRows.map((row) => row.labels[mode]).join(",");
  const csvSample = crmRows.map((row) => escapeCsvValue(row.sample)).join(",");
  const playbook = integrationCopy.playbooks[platform];

  return (
    <div className="product-tool integration-tool">
      <div className="product-tool-head">
        <div>
          <p className="eyebrow">{formatMessage(integrationCopy.eyebrow, { platform })}</p>
          <h2>{formatMessage(integrationCopy.title, { platform })}</h2>
          <p>{integrationCopy.copy}</p>
        </div>
        <button
          className="button button-primary"
          type="button"
          onClick={() => {
            copyText(csvHeader);
            void trackEvent({ name: "product_tool_copy", metadata: { tool: "integration", asset: "header", platform } });
          }}
        >
          <Icon name="clipboard" />
          {formatMessage(integrationCopy.copyHeader, { platform })}
        </button>
      </div>

      <div className="tool-kpi-strip">
        <div>
          <span>{integrationCopy.recommendedRecord}</span>
          <strong>{playbook.recordType}</strong>
        </div>
        <div>
          <span>{integrationCopy.includedColumns}</span>
          <strong>{crmRows.length}</strong>
        </div>
        <div>
          <span>{integrationCopy.bestHandoff}</span>
          <strong>{integrationCopy.selectedSavedLeads}</strong>
        </div>
      </div>

      <div className="integration-field-list">
        {crmRows.map((row) => (
          <div key={row.key}>
            <span>{row.group}</span>
            <strong>{row.labels[mode]}</strong>
            <p>{row.description}</p>
          </div>
        ))}
      </div>

      <div className="tool-advice-grid">
        <article className="tool-advice-card">
          <span>{integrationCopy.quickWins}</span>
          <strong>{integrationCopy.quickWinsTitle}</strong>
          <ul className="tool-advice-list">
            {playbook.quickWins.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article className="tool-advice-card tool-advice-card-contrast">
          <span>{integrationCopy.mistakes}</span>
          <strong>{integrationCopy.mistakesTitle}</strong>
          <ul className="tool-advice-list">
            {playbook.mistakes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>

      <pre className="csv-preview">{`${csvHeader}\n${csvSample}`}</pre>

      <div className="tool-micro-actions">
        <button
          className="button button-secondary"
          type="button"
          onClick={() => {
            downloadTextFile(`${platform.toLowerCase()}-leadcue-import.csv`, `${csvHeader}\n${csvSample}`);
            void trackEvent({ name: "product_tool_download", metadata: { tool: "integration", asset: "sample_csv", platform } });
          }}
        >
          <Icon name="download" />
          {integrationCopy.downloadSample}
        </button>
        <a
          className="button button-secondary"
          href={localizeHref("/templates/crm-csv-field-mapping")}
          onClick={() => {
            void trackEvent({ name: "product_tool_secondary_click", metadata: { tool: "integration", platform, target: "mapping_template" } });
          }}
        >
          <Icon name="arrow" />
          {integrationCopy.openTemplate}
        </a>
      </div>
    </div>
  );
}

function CommercialPage({ slug }: { slug: CommercialPageSlug }) {
  const { locale, localizeHref, siteUi } = usePublicSite();
  const page = getCommercialPages(locale)[slug];
  const path = `/${slug}`;

  return (
    <div className="site-shell">
      <SeoHead
        title={`${page.title} | LeadCue`}
        description={page.summary}
        keywords={[page.eyebrow, ...page.sections.map((section) => section.title)]}
        path={path}
        locale={locale}
        structuredData={getCommercialStructuredData(page, slug, locale)}
      />
      <header className="topbar topbar-minimal content-topbar">
        <a className="brand" href={localizeHref("/")} aria-label={`${siteUi.common.brand} ${siteUi.common.home}`}>
          <BrandMark />
          <span>{siteUi.common.brand}</span>
        </a>
        <nav className="content-nav" aria-label={siteUi.home.footer.resourcesTitle}>
          <a href={localizeHref("/docs")}>{siteUi.content.commercialNav.docs}</a>
          <a href={localizeHref("/support")}>{siteUi.content.commercialNav.support}</a>
          <a href={localizeHref("/contact")}>{siteUi.content.commercialNav.contact}</a>
        </nav>
        <LanguageSwitcher />
        <a className="button button-small button-primary topbar-back" href={localizeHref("/login")}>
          {siteUi.common.startFree}
        </a>
      </header>

      <main className="content-page">
        <section className="content-hero">
          <p className="eyebrow glass-pill">{page.eyebrow}</p>
          <h1>{page.title}</h1>
          <p>{page.summary}</p>
          <div className="content-actions">
            <a className="button button-primary" href={localizeHref(page.primaryAction.href)}>
              <Icon name="arrow" />
              {page.primaryAction.label}
            </a>
            {page.secondaryAction ? (
              <a className="button button-secondary" href={localizeHref(page.secondaryAction.href)}>
                {page.secondaryAction.label}
              </a>
            ) : null}
          </div>
        </section>

        {slug === "docs" || slug === "support" || slug === "contact" ? (
          <section className="help-center-shell" aria-label={siteUi.commercial.helpCenter.title}>
            <div className="help-center-head">
              <div>
                <p className="eyebrow">{siteUi.commercial.helpCenter.eyebrow}</p>
                <h2>{siteUi.commercial.helpCenter.title}</h2>
              </div>
              <label className="help-search">
                <span>{siteUi.commercial.helpCenter.searchLabel}</span>
                <input type="search" placeholder={siteUi.commercial.helpCenter.searchPlaceholder} />
              </label>
            </div>
            <div className="help-category-grid">
              {siteUi.commercial.helpCenter.cards.map((item) => (
                <a className="help-category-card" href={localizeHref(item.href)} key={item.title}>
                  <Icon name="arrow" />
                  <strong>{item.title}</strong>
                  <span>{item.copy}</span>
                </a>
              ))}
            </div>
          </section>
        ) : null}

        <section className="content-grid" aria-label={page.title}>
          {page.sections.map((section, index) => (
            <article className={`content-panel ${index === 1 ? "content-panel-dark" : ""}`} key={section.title}>
              <span className="content-panel-index">{String(index + 1).padStart(2, "0")}</span>
              <h2>{section.title}</h2>
              <p>{section.copy}</p>
              <ul>
                {section.items.map((item) => (
                  <li key={item}>
                    <Icon name="check" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section className="content-cta">
          <div>
            <p className="eyebrow">{siteUi.commercial.nextStepEyebrow}</p>
            <h2>{siteUi.commercial.nextStepTitle}</h2>
          </div>
          <a className="button button-primary" href={localizeHref("/login")}>
            <Icon name="scan" />
            {siteUi.common.startFreeScan}
          </a>
        </section>
      </main>
    </div>
  );
}

function getAuthIntent(params = new URLSearchParams(window.location.search)): AuthIntent {
  const requestedPlanId = params.get("plan");
  const selectedPlan = PRICING_PLANS.find((plan) => plan.id === requestedPlanId) ?? PRICING_PLANS[0];
  const requestedFocus = params.get("focus");
  const focus = ["web_design", "seo", "marketing", "founder"].includes(requestedFocus ?? "")
    ? requestedFocus ?? "web_design"
    : "web_design";
  const firstProspectUrl = params.get("first")?.trim() || "";
  const hasPlanIntent = Boolean(requestedPlanId && selectedPlan.id === requestedPlanId);
  const hasFocusIntent = Boolean(requestedFocus && focus === requestedFocus);
  const hasFirstIntent = Boolean(firstProspectUrl);

  return {
    selectedPlan,
    focus,
    firstProspectUrl,
    hasPlanIntent,
    hasFocusIntent,
    hasFirstIntent,
    hasIntent: hasPlanIntent || hasFocusIntent || hasFirstIntent
  };
}

function getSelectedPlan(params = new URLSearchParams(window.location.search)) {
  return getAuthIntent(params).selectedPlan;
}

function getInitialFocus(params = new URLSearchParams(window.location.search)) {
  return getAuthIntent(params).focus;
}

function getInitialFirstProspectUrl(params = new URLSearchParams(window.location.search)) {
  return getAuthIntent(params).firstProspectUrl;
}

function buildAuthAppPath(locale: SiteLocaleCode, intent: AuthIntent, flow?: "login" | "welcome") {
  const target = new URL(buildLocalePath(locale, "/app"), "https://leadcue.local");

  if (intent.hasPlanIntent) {
    target.searchParams.set("plan", intent.selectedPlan.id);
  }
  if (intent.hasFocusIntent) {
    target.searchParams.set("focus", intent.focus);
  }
  if (intent.hasFirstIntent) {
    target.searchParams.set("first", intent.firstProspectUrl);
  }
  if (flow) {
    target.searchParams.set(flow, "1");
  }

  return `${target.pathname}${target.search}`;
}

function buildFirstLineVariant(
  template: { nextSentence: string; cta: string },
  mode: AgencyToolMode,
  selectedIndex: number,
  siteUi: SiteUi
): { nextSentence: string; cta: string; whyItWorks: string; badExample: string } {
  const firstLineCopy = siteUi.tools.firstLine;
  const baseBadExample = firstLineCopy.badExample;

  switch (mode) {
    case "seo":
      return {
        nextSentence:
          selectedIndex === 2
            ? firstLineCopy.modeOverrides.seo.seoNextSentence
            : firstLineCopy.modeOverrides.seo.defaultNextSentence,
        cta:
          selectedIndex === 2
            ? firstLineCopy.modeOverrides.seo.seoCta
            : firstLineCopy.modeOverrides.seo.defaultCta,
        whyItWorks: firstLineCopy.modeOverrides.seo.why,
        badExample: baseBadExample
      };
    case "marketing":
      return {
        nextSentence:
          selectedIndex === 1
            ? firstLineCopy.modeOverrides.marketing.trustNextSentence
            : firstLineCopy.modeOverrides.marketing.defaultNextSentence,
        cta: firstLineCopy.modeOverrides.marketing.cta,
        whyItWorks: firstLineCopy.modeOverrides.marketing.why,
        badExample: baseBadExample
      };
    default:
      return {
        nextSentence: template.nextSentence,
        cta: template.cta,
        whyItWorks: firstLineCopy.modeOverrides.web_design.why,
        badExample: baseBadExample
      };
  }
}

function humanizeEnumLabel(value?: string | null) {
  return (value || "")
    .split("_")
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

function formatSubscriptionStatus(status: string, appUi?: AppUi) {
  return (
    appUi?.options.subscriptionStatuses[status as keyof AppUi["options"]["subscriptionStatuses"]] ||
    fallbackAppUi.options.subscriptionStatuses[status as keyof AppUi["options"]["subscriptionStatuses"]] ||
    humanizeEnumLabel(status)
  );
}

function getSubscriptionStatusDetails(status: string, appUi: AppUi) {
  switch (status) {
    case "active":
      return {
        label: formatSubscriptionStatus(status, appUi),
        tone: "is-success",
        summary: appUi.billing.subscriptionDetails.active.summary,
        nextStep: appUi.billing.subscriptionDetails.active.nextStep
      };
    case "trialing":
      return {
        label: formatSubscriptionStatus(status, appUi),
        tone: "is-success",
        summary: appUi.billing.subscriptionDetails.trialing.summary,
        nextStep: appUi.billing.subscriptionDetails.trialing.nextStep
      };
    case "pending_checkout":
      return {
        label: formatSubscriptionStatus(status, appUi),
        tone: "is-warning",
        summary: appUi.billing.subscriptionDetails.pendingCheckout.summary,
        nextStep: appUi.billing.subscriptionDetails.pendingCheckout.nextStep
      };
    case "configuration_required":
      return {
        label: formatSubscriptionStatus(status, appUi),
        tone: "is-warning",
        summary: appUi.billing.subscriptionDetails.configurationRequired.summary,
        nextStep: appUi.billing.subscriptionDetails.configurationRequired.nextStep
      };
    case "past_due":
      return {
        label: formatSubscriptionStatus(status, appUi),
        tone: "is-warning",
        summary: appUi.billing.subscriptionDetails.pastDue.summary,
        nextStep: appUi.billing.subscriptionDetails.pastDue.nextStep
      };
    case "canceled":
      return {
        label: formatSubscriptionStatus(status, appUi),
        tone: "is-danger",
        summary: appUi.billing.subscriptionDetails.canceled.summary,
        nextStep: appUi.billing.subscriptionDetails.canceled.nextStep
      };
    default:
      return {
        label: formatSubscriptionStatus(status, appUi),
        tone: "",
        summary: appUi.billing.subscriptionDetails.fallbackSummary,
        nextStep: appUi.billing.subscriptionDetails.fallbackNextStep
      };
  }
}

function formatAnalyticsEventName(value: string, appUi: AppUi) {
  return appUi.analytics.eventNames[value as keyof AppUi["analytics"]["eventNames"]] || humanizeEnumLabel(value);
}

function formatAnalyticsMetadataSummary(value: string | null | undefined, appUi: AppUi) {
  const analytics = getSampleLocaleContent("en").analytics;

  switch (value) {
    case analytics.eventMetadata.basicScanOneCredit:
      return appUi.analytics.eventMetadata.basicScanOneCredit;
    case analytics.eventMetadata.crmHubSpot:
      return appUi.analytics.eventMetadata.crmHubSpot;
    case analytics.eventMetadata.hubSpotMappingCta:
      return appUi.analytics.eventMetadata.hubSpotMappingCta;
    default:
      return value || null;
  }
}

function formatAnalyticsRecommendation(value: string, appUi: AppUi) {
  const analytics = getSampleLocaleContent("en").analytics;

  switch (value) {
    case analytics.recommendations.toolPageCta:
      return appUi.analytics.recommendations.toolPageCta;
    case analytics.recommendations.exportsGap:
      return appUi.analytics.recommendations.exportsGap;
    case analytics.recommendations.crmTemplateTraffic:
      return appUi.analytics.recommendations.crmTemplateTraffic;
    default:
      return value;
  }
}

function formatScanTypeLabel(value: "basic" | "deep", appUi: AppUi) {
  return appUi.billing.scanHistory.scanTypes[value];
}

function isGenericNetworkErrorMessage(message: string) {
  return [
    "Failed to fetch",
    "Load failed",
    "NetworkError when attempting to fetch resource.",
    "The network connection was lost."
  ].includes(message);
}

function translateAppErrorMessage(message: string, appUi: AppUi) {
  switch (message) {
    case "D1 is not initialized. Apply migrations to enable workspace persistence.":
    case "D1 is not initialized. Apply migrations to enable scan history.":
    case "D1 is not initialized. Apply migrations to enable persistence.":
    case "D1 is not initialized. Apply migrations to enable credit tracking.":
      return appUi.common.messages.workspaceDataUnavailable;
    case "Sign in before managing billing.":
      return appUi.common.messages.signInRequired;
    case "Workspace not found.":
    case "Workspace data is not available yet.":
      return appUi.common.messages.workspaceNotFound;
    case "Your subscription is not active. Update billing before scanning more websites.":
      return appUi.common.messages.subscriptionInactive;
    case "This workspace does not have enough scan credits for this request.":
      return appUi.common.messages.insufficientCredits;
    case "First prospect URL must be a valid http(s) URL.":
      return appUi.icp.messages.invalidFirstTargetUrl;
    case "Sign in before updating workspace profile details.":
      return appUi.account.messages.signInProfile;
    case "Owner name and workspace name are both required.":
      return appUi.account.messages.namesRequired;
    case "Profile updates are unavailable until the workspace database is ready.":
      return appUi.account.messages.profileSaveFailed;
    case "Sign in before changing the workspace password.":
      return appUi.account.messages.signInPassword;
    case "Use at least 8 characters for the new password.":
      return appUi.account.messages.passwordMin;
    case "The new password and confirmation need to match.":
      return appUi.account.messages.passwordMismatch;
    case "Enter the current password before setting a new one.":
      return appUi.account.messages.currentPasswordRequired;
    case "Current password is incorrect.":
      return appUi.account.messages.currentPasswordIncorrect;
    case "Password updates are unavailable until the workspace database is ready.":
      return appUi.account.messages.passwordUpdateFailed;
    case "Lead detail is not available.":
    case "Lead not found.":
      return appUi.common.messages.leadDetailUnavailable;
    case "Scan failed. Try again with a fuller website snapshot.":
      return appUi.common.messages.scanFailed;
    case "Unable to save ICP settings.":
    case "Request body must be valid JSON.":
      return appUi.icp.messages.saveFailed;
    case "Sign in before updating onboarding.":
    case "Onboarding state requires a configured database.":
    case "Unable to update onboarding.":
      return appUi.common.messages.onboardingUpdateFailed;
    case "CSV export is not available for this workspace.":
      return appUi.common.messages.csvExportFailed;
    case "Billing portal requires a configured database.":
    case "Stripe portal is not configured for this environment.":
    case "No Stripe customer is attached to this workspace yet.":
    case "Billing portal is not available yet.":
      return appUi.common.messages.billingPortalUnavailable;
    case "Stripe checkout is not configured for this environment.":
      return appUi.common.messages.checkoutUnavailable;
    case "Invalid owner, pipeline stage, or notes.":
    case "Unable to save pipeline context.":
      return appUi.prospectCard.pipeline.saveStateError;
    default:
      return message;
  }
}

function resolveAppErrorMessage(error: unknown, fallback: string, appUi: AppUi) {
  if (!(error instanceof Error)) {
    return fallback;
  }

  return isGenericNetworkErrorMessage(error.message) ? fallback : translateAppErrorMessage(error.message, appUi);
}

function percentage(numerator: number, denominator: number) {
  if (!denominator) {
    return "0%";
  }

  return `${Math.round((numerator / denominator) * 100)}%`;
}

function formatAgencyFocus(value?: string | null, appUi?: AppUi) {
  switch (value) {
    case "web_design":
      return appUi?.options.serviceTypes.web_design || fallbackAppUi.options.serviceTypes.web_design;
    case "seo":
      return appUi?.options.serviceTypes.seo || fallbackAppUi.options.serviceTypes.seo;
    case "marketing":
      return appUi?.options.serviceTypes.marketing || fallbackAppUi.options.serviceTypes.marketing;
    case "founder":
      return appUi?.options.serviceTypes.founder || fallbackAppUi.options.serviceTypes.founder;
    case "custom":
      return appUi?.options.serviceTypes.custom || fallbackAppUi.options.serviceTypes.custom;
    default:
      return value ? humanizeEnumLabel(value) : appUi?.options.serviceTypes.unknown || fallbackAppUi.options.serviceTypes.unknown;
  }
}

function formatToneLabel(value?: string | null, appUi?: AppUi) {
  if (!value) {
    return appUi?.options.tones.unknown || fallbackAppUi.options.tones.unknown;
  }

  return (
    appUi?.options.tones[value as keyof AppUi["options"]["tones"]] ||
    fallbackAppUi.options.tones[value as keyof AppUi["options"]["tones"]] ||
    humanizeEnumLabel(value)
  );
}

function formatPipelineStage(value: ProspectPipelineStage, appUi?: AppUi) {
  return appUi?.options.pipelineStages[value] || fallbackAppUi.options.pipelineStages[value] || humanizeEnumLabel(value);
}

function formatSignalCategory(value: OpportunitySignal["category"], appUi?: AppUi) {
  return appUi?.options.signalCategories[value] || fallbackAppUi.options.signalCategories[value] || humanizeEnumLabel(value);
}

function formatCompactUrl(value?: string | null, emptyLabel = fallbackAppUi.common.notSet) {
  if (!value) {
    return emptyLabel;
  }

  return value.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

function previewList(values: string[], maxItems = 3, emptyLabel = fallbackAppUi.common.notSet) {
  const items = values.map((value) => value.trim()).filter(Boolean);
  if (!items.length) {
    return emptyLabel;
  }

  return items.length > maxItems
    ? `${items.slice(0, maxItems).join(", ")} +${items.length - maxItems}`
    : items.join(", ");
}

function formatHistoryTime(value: string, locale = "en", unknownLabel = fallbackAppUi.common.unknownTime) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return unknownLabel;
  }

  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function formatHistoryReason(value?: string | null, appUi?: AppUi) {
  if (!value) {
    return appUi?.preview.saved || fallbackAppUi.preview.saved;
  }

  return (
    appUi?.options.historyReasons[value as keyof AppUi["options"]["historyReasons"]] ||
    fallbackAppUi.options.historyReasons[value as keyof AppUi["options"]["historyReasons"]] ||
    humanizeEnumLabel(value)
  );
}

function withAppLocaleHeader(locale: SiteLocaleCode, headers?: HeadersInit) {
  const nextHeaders = new Headers(headers);
  nextHeaders.set("X-LeadCue-Locale", locale);
  return nextHeaders;
}

function leadDetailHref(leadId?: string | null) {
  if (!leadId) {
    return null;
  }

  const { locale } = parseSiteLocalePath(window.location.pathname);
  return `${buildLocalePath(locale, "/app/qualified")}?lead=${encodeURIComponent(leadId)}`;
}

function bulkExportLabel(presetKey: Exclude<ProspectExportPresetKey, "custom">, crmMode: ProspectCrmFieldMode, appUi?: AppUi) {
  const preset = prospectExportPresets.find((item) => item.key === presetKey);
  const mode = prospectCrmFieldModes.find((item) => item.value === crmMode);
  const presetLabel = preset
    ? appUi?.prospectCard.export.presets[preset.key].label || preset.label
    : appUi?.prospectCard.export.csvColumns || fallbackAppUi.prospectCard.export.csvColumns;
  const modeLabel = mode ? appUi?.prospectCard.export.crmModes[mode.value].label || mode.label : "";

  return presetKey === "crm" && modeLabel ? `${presetLabel} / ${modeLabel}` : presetLabel;
}

function formatActivityFieldLabel(field: ActivityChangedField, appUi?: AppUi) {
  const labels: Record<ActivityChangedField, string> = {
    owner: "Owner",
    stage: "Stage",
    notes: "Notes"
  };

  return appUi?.options.activityFields[field] || labels[field];
}

function formatActivityContextValue(context: ProspectPipelineContext, field: ActivityChangedField, appUi?: AppUi) {
  if (field === "stage") {
    return appUi?.options.pipelineStages[context.stage] || humanizeEnumLabel(context.stage);
  }

  const value = context[field]?.trim();
  if (value) {
    return value;
  }

  return field === "owner" ? appUi?.common.unassigned || "Unassigned" : appUi?.common.empty || "Empty";
}

function formatCardList(values: string[], emptyLabel = "None found") {
  return values.map((value) => value.trim()).filter(Boolean).join(", ") || emptyLabel;
}

function slugifyFilePart(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80) || "prospect";
}

function downloadTextFile(filename: string, value: string) {
  const type = filename.endsWith(".csv") ? "text/csv;charset=utf-8" : "text/plain;charset=utf-8";
  const blob = new Blob([value], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function normalizeProspectMeta(value?: ProspectPipelineContext | null): ProspectPipelineContext {
  const stage = value?.stage && pipelineStageOptions.includes(value.stage)
    ? value.stage
    : defaultProspectMeta.stage;

  return {
    owner: typeof value?.owner === "string" ? value.owner : "",
    stage,
    notes: typeof value?.notes === "string" ? value.notes : "",
    updatedAt: typeof value?.updatedAt === "string" ? value.updatedAt : null
  };
}

function leadPreviewProspect(lead: LeadListItem, sampleCard: ProspectCardType = SAMPLE_PROSPECT_CARD): ProspectCardType {
  return {
    ...sampleCard,
    companyName: lead.companyName,
    domain: lead.domain,
    website: lead.websiteUrl,
    industry: lead.industry,
    fitScore: lead.fitScore,
    confidenceScore: lead.confidenceScore,
    savedStatus: "saved",
    exportStatus: "not_exported",
    pipelineContext: normalizeProspectMeta(lead.pipelineContext)
  };
}

function parseProspectCardTab(value?: string | null): ProspectCardTab {
  return value && prospectCardTabs.includes(value as ProspectCardTab) ? (value as ProspectCardTab) : "overview";
}

function getProspectTabFromLocation() {
  const params = new URLSearchParams(window.location.search);
  const queryTab = params.get("tab");

  if (queryTab) {
    return parseProspectCardTab(queryTab);
  }

  const hash = window.location.hash.replace(/^#/, "");
  return hash.startsWith("tab=") ? parseProspectCardTab(hash.slice(4)) : "overview";
}

function replaceLeadDeepLink(leadId: string | null | undefined, tab: ProspectCardTab) {
  if (!leadId) {
    return;
  }

  const url = new URL(window.location.href);
  url.searchParams.set("lead", leadId);
  url.searchParams.set("tab", tab);
  window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
}

function currentLeadDeepLink(leadId: string | null | undefined, tab: ProspectCardTab) {
  if (!leadId) {
    return "";
  }

  const url = new URL(window.location.href);
  const { locale } = parseSiteLocalePath(url.pathname);
  url.pathname = buildLocalePath(locale, "/app/qualified");
  url.search = "";
  url.hash = "";
  url.searchParams.set("lead", leadId);
  url.searchParams.set("tab", tab);
  return url.toString();
}

async function copyToClipboard(value: string) {
  const text = value.trim();
  if (!text) {
    return false;
  }

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall through to the textarea fallback for browsers that block Clipboard API.
  }

  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.setAttribute("readonly", "true");
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.appendChild(textArea);
  textArea.select();
  const copied = document.execCommand("copy");
  textArea.remove();
  return copied;
}

function firstName(value?: string | null) {
  if (!value) {
    return null;
  }

  return value.trim().split(/\s+/)[0] || null;
}

function normalizeWebsiteUrl(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  try {
    const url = new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`);
    return url.toString();
  } catch {
    return null;
  }
}

function hostnameFromUrl(value: string) {
  try {
    return new URL(value).hostname.replace(/^www\./, "");
  } catch {
    return value.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0] || "prospect.example";
  }
}

function companyNameFromUrl(value: string) {
  const base = hostnameFromUrl(value).split(".")[0] || "Prospect";
  return base
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

function getLeadPipelineStage(lead: LeadListItem) {
  return normalizeProspectMeta(lead.pipelineContext).stage;
}

function isQueueSource(value: unknown): value is QueueSource {
  return value === "manual" || value === "csv" || value === "apollo" || value === "clay" || value === "directory" || value === "workspace";
}

function isWorkspaceResearchStatus(value: unknown): value is WorkspaceResearchStatus {
  return value === "queued" || value === "scanning" || value === "reviewing" || value === "qualified" || value === "archived";
}

function isLeadHandoffStatus(value: unknown): value is LeadHandoffStatus {
  return value === "pending" || value === "exported" || value === "outreach_queued" || value === "contacted" || value === "won";
}

function queueSourceLabel(source: QueueSource, appUi: AppUi) {
  return source === "workspace" ? appUi.reviewQueue.workspaceSource : appUi.importer.sourceOptions[source];
}

function queueItemReviewStatus(value: WorkspaceResearchStatus): "ready" | "researching" | "qualified" {
  if (value === "qualified") {
    return "qualified";
  }

  return value === "queued" ? "ready" : "researching";
}

function queueItemResearchStatus(item?: Pick<WorkspaceQueueItem, "researchStatus"> | null): WorkspaceResearchStatus {
  return item && isWorkspaceResearchStatus(item.researchStatus) ? item.researchStatus : "queued";
}

function queueItemHandoffStatus(item?: Pick<WorkspaceQueueItem, "handoffStatus"> | null): LeadHandoffStatus {
  return item && isLeadHandoffStatus(item.handoffStatus) ? item.handoffStatus : "pending";
}

function queueItemToImportedWebsiteRecord(item: WorkspaceQueueItem): ImportedWebsiteRecord {
  return {
    id: item.id,
    url: item.websiteUrl,
    domain: item.domain,
    companyName: item.companyName,
    source: item.source === "workspace" ? "manual" : item.source,
    note: item.note,
    createdAt: item.createdAt
  };
}

function importQueueStorageKey(workspaceId?: string | null) {
  return `${IMPORT_QUEUE_STORAGE_PREFIX}:${workspaceId || "default"}`;
}

function scanDraftStorageKey(workspaceId?: string | null) {
  return `${SCAN_DRAFT_STORAGE_PREFIX}:${workspaceId || "default"}`;
}

function normalizeBatchWebsiteCandidate(value: string) {
  const trimmed = value.trim().replace(/^["']|["']$/g, "");
  if (!trimmed || trimmed.includes("@")) {
    return null;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return normalizeWebsiteUrl(trimmed);
  }

  if (/^[a-z0-9.-]+\.[a-z]{2,}(?:\/.*)?$/i.test(trimmed)) {
    return normalizeWebsiteUrl(`https://${trimmed}`);
  }

  return null;
}

function parseImportedWebsiteText(
  value: string,
  source: BatchSourceOption,
  note: string,
  existingDomains: Set<string>
) {
  const seenDomains = new Set(existingDomains);
  const items: ImportedWebsiteRecord[] = [];
  let skipped = 0;

  value
    .split(/\r?\n/)
    .flatMap((line) => line.split(/[,\t;]+/))
    .map((part) => part.trim())
    .filter(Boolean)
    .forEach((candidate) => {
      const normalizedUrl = normalizeBatchWebsiteCandidate(candidate);
      if (!normalizedUrl) {
        skipped += 1;
        return;
      }

      const domain = hostnameFromUrl(normalizedUrl);
      if (!domain || seenDomains.has(domain)) {
        skipped += 1;
        return;
      }

      seenDomains.add(domain);
      items.push({
        id: `import_${crypto.randomUUID()}`,
        url: normalizedUrl,
        domain,
        companyName: companyNameFromUrl(normalizedUrl),
        source,
        note: note.trim(),
        createdAt: new Date().toISOString()
      });
    });

  return { items, skipped };
}

function readStoredImportQueue(workspaceId?: string | null) {
  if (typeof window === "undefined") {
    return [] as ImportedWebsiteRecord[];
  }

  try {
    const raw = localStorage.getItem(importQueueStorageKey(workspaceId));
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter((item): item is ImportedWebsiteRecord => Boolean(item && typeof item === "object"))
      .map((item) => ({
        id: typeof item.id === "string" ? item.id : `import_${crypto.randomUUID()}`,
        url: typeof item.url === "string" ? item.url : "",
        domain: typeof item.domain === "string" ? item.domain : hostnameFromUrl(item.url || ""),
        companyName:
          typeof item.companyName === "string" && item.companyName.trim()
            ? item.companyName
            : companyNameFromUrl(item.url || item.domain || ""),
        source: batchSourceOptions.includes(item.source as BatchSourceOption)
          ? (item.source as BatchSourceOption)
          : "manual",
        note: typeof item.note === "string" ? item.note : "",
        createdAt: typeof item.createdAt === "string" ? item.createdAt : new Date().toISOString()
      }))
      .filter((item) => item.url && item.domain);
  } catch {
    return [];
  }
}

function serviceTypeForFocus(value?: string | null): ServiceType {
  return value === "seo" || value === "web_design" || value === "marketing" || value === "custom"
    ? value
    : DEFAULT_ICP.serviceType;
}

function toneForWorkspace(value?: string | null): Tone {
  return value === "direct" || value === "casual" || value === "professional" ? value : DEFAULT_ICP.tone;
}

function parseEditableList(value: string, fallback: string[]): string[] {
  const items = value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 12);

  return items.length ? [...new Set(items)] : fallback;
}

function getAppSection(pathname: string): AppSection {
  const normalizedPath = parseSiteLocalePath(pathname).path;

  if (
    normalizedPath.startsWith("/app/queue") ||
    normalizedPath.startsWith("/app/import") ||
    normalizedPath.startsWith("/app/leads")
  ) {
    return "queue";
  }
  if (normalizedPath.startsWith("/app/qualified") || normalizedPath.startsWith("/app/accounts")) {
    return "qualified";
  }
  if (normalizedPath.startsWith("/app/exports")) {
    return "exports";
  }
  if (
    normalizedPath.startsWith("/app/settings") ||
    normalizedPath.startsWith("/app/account") ||
    normalizedPath.startsWith("/app/billing")
  ) {
    return "settings";
  }
  if (normalizedPath.startsWith("/app/analytics")) {
    return "analytics";
  }
  return "dashboard";
}

function buildGoogleAuthHref(options: {
  intent: "login" | "signup";
  planId?: PricingPlan["id"];
  focus?: string;
  firstProspectUrl?: string;
  returnTo?: string;
}) {
  const params = new URLSearchParams({
    intent: options.intent,
    returnTo: options.returnTo || "/app"
  });
  if (options.planId) {
    params.set("planId", options.planId);
  }
  if (options.focus) {
    params.set("focus", options.focus);
  }
  if (options.firstProspectUrl) {
    params.set("first", options.firstProspectUrl);
  }
  return apiUrl(`/api/auth/google/start?${params.toString()}`);
}

function formatCalendarDate(value: string | null | undefined) {
  if (!value) {
    return fallbackAppUi.common.notSet;
  }

  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) {
    return value;
  }

  return new Date(parsed).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

function getAuthErrorMessage(siteUi: SiteUi) {
  const authError = new URLSearchParams(window.location.search).get("auth_error");
  const authErrors = siteUi.auth.errors;

  switch (authError) {
    case "google_not_configured":
      return authErrors.google_not_configured;
    case "database_unavailable":
      return authErrors.database_unavailable;
    case "state_missing":
    case "state_invalid":
      return authErrors.state_missing;
    case "access_denied":
    case "oauth_cancelled":
      return authErrors.access_denied;
    case "google_exchange_failed":
      return authErrors.google_exchange_failed;
    default:
      return "";
  }
}

function translatePublicAuthErrorMessage(message: string, siteUi: SiteUi) {
  const { login, reset, signup, errors } = siteUi.auth;

  switch (message) {
    case "Authentication is unavailable until the workspace database is ready.":
    case "Email password sign-in is unavailable until the workspace database is ready.":
      return errors.database_unavailable || login.validation.emailLoginUnavailable;
    case "This account uses Google sign-in right now. Continue with Google or request a reset link to add an email password.":
      return login.validation.googleSignInRequired;
    case "This account does not have email password sign-in yet. Request a reset link first.":
      return login.validation.passwordSetupRequired;
    case "Enter a valid email and password.":
      return login.validation.invalidLogin;
    case "Email or password is incorrect.":
      return login.validation.emailLoginFailed;
    case "Password reset is unavailable until the workspace database is ready.":
    case "Password reset is unavailable right now.":
      return login.validation.resetUnavailable;
    case "Enter the workspace email address you used to sign in.":
      return login.validation.invalidResetEmail;
    case "If that email belongs to a workspace, a one-time reset link has been prepared.":
    case "If that email belongs to a workspace, a reset link has been prepared.":
      return login.validation.resetPrepared;
    case "A valid reset token and an 8+ character password are required.":
      return reset.genericError;
    case "This reset link has expired. Request a new password reset.":
      return reset.invalidLink;
    case "A valid work email is required.":
      return signup.validation.emailRequired;
    case "An account with this email already exists. Sign in instead.":
      return signup.validation.accountExists;
    case "This email already has a Google sign-in account. Switch to sign in and continue with Google.":
      return signup.validation.googleAccountExists;
    case "This email already has an account, but email password sign-in is not ready yet. Switch to sign in and request a reset link.":
      return signup.validation.passwordSetupRequired;
    case "Unable to create account. Please try again.":
      return signup.validation.accountCreateFailed;
    case "Offer description is required.":
    case "Unable to create workspace. Please try again.":
      return signup.validation.setupFailed;
    case "Password must be at least 8 characters.":
      return signup.validation.passwordRequired;
    default:
      return message;
  }
}

function getAuthRecoveryReasonFromResponse(response: { reason?: string; error?: string }): AuthRecoveryReason | null {
  if (response.reason === "google_sign_in_required" || response.reason === "password_setup_required") {
    return response.reason;
  }

  if (
    response.error ===
    "This account uses Google sign-in right now. Continue with Google or request a reset link to add an email password."
  ) {
    return "google_sign_in_required";
  }

  if (response.error === "This account does not have email password sign-in yet. Request a reset link first.") {
    return "password_setup_required";
  }

  return null;
}

function getSignupRedirectReason(response: { reason?: string; error?: string }): AuthRecoveryReason | "account_exists" | null {
  if (
    response.reason === "google_account_exists" ||
    response.reason === "password_setup_required" ||
    response.reason === "account_exists"
  ) {
    return response.reason === "google_account_exists" ? "google_sign_in_required" : response.reason;
  }

  if (
    response.error === "This email already has a Google sign-in account. Switch to sign in and continue with Google."
  ) {
    return "google_sign_in_required";
  }

  if (
    response.error ===
    "This email already has an account, but email password sign-in is not ready yet. Switch to sign in and request a reset link."
  ) {
    return "password_setup_required";
  }

  if (response.error === "An account with this email already exists. Sign in instead.") {
    return "account_exists";
  }

  return null;
}

function LoginPage({ initialMode = "login" }: { initialMode?: AuthMode }) {
  const { locale, siteUi, localizeHref, formatMessage } = usePublicSite();
  const loginCopy = siteUi.auth.login as typeof siteUi.auth.login & {
    recoveryGoogleTitle: string;
    recoveryGoogleCopy: string;
    recoveryPasswordTitle: string;
    recoveryPasswordCopy: string;
    recoveryLinkCta: string;
    recoveryLinkLoading: string;
    recoveryPrepared?: string;
    recoveryOpenLink?: string;
  };
  const signupCopy = siteUi.auth.signup;
  const authMessage = getAuthErrorMessage(siteUi);
  const authIntent = useMemo(() => getAuthIntent(), []);
  const appReturnPath = useMemo(() => buildAuthAppPath(locale, authIntent), [authIntent, locale]);
  const [authMode, setAuthMode] = useState<AuthMode>(initialMode);
  const [loginForm, setLoginForm] = useState<LoginFormState>({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState<LoginFormState>({ email: "", password: "" });
  const [loginState, setLoginState] = useState<"idle" | "loading" | "error">("idle");
  const [registerState, setRegisterState] = useState<"idle" | "loading" | "error">("idle");
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [authRecovery, setAuthRecovery] = useState<AuthRecoveryState | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showCreatePassword, setShowCreatePassword] = useState(false);
  const [showResetPanel, setShowResetPanel] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetState, setResetState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [resetMessage, setResetMessage] = useState("");
  const [resetVariant, setResetVariant] = useState<PasswordResetRequestVariant>("reset");
  const isCreateMode = authMode === "signup";
  const selectedPlanPrice =
    authIntent.selectedPlan.price === 0 ? "$0/mo" : `$${authIntent.selectedPlan.price}/mo`;
  const selectedPlanCopy =
    authIntent.selectedPlan.id === "free"
      ? signupCopy.selectedPlanFree
      : formatMessage(signupCopy.selectedPlanPaid, {
          price: selectedPlanPrice,
          credits: authIntent.selectedPlan.monthlyCredits.toLocaleString()
        });

  function decorateAppRedirect(nextPath: string, flow: "login" | "welcome") {
    const target = new URL(nextPath, "https://leadcue.local");

    if (authIntent.hasPlanIntent) {
      target.searchParams.set("plan", authIntent.selectedPlan.id);
    }
    if (authIntent.hasFocusIntent) {
      target.searchParams.set("focus", authIntent.focus);
    }
    if (authIntent.hasFirstIntent) {
      target.searchParams.set("first", authIntent.firstProspectUrl);
    }
    target.searchParams.set(flow, "1");

    return localizeHref(`${target.pathname}${target.search}`);
  }

  function clearRecoveryState() {
    setAuthRecovery(null);
    setResetState("idle");
    setResetMessage("");
    setResetVariant("reset");
  }

  function switchAuthMode(nextMode: AuthMode) {
    setAuthMode(nextMode);
    setAuthRecovery(null);
    setShowResetPanel(false);
    setResetState("idle");
    setResetMessage("");
    setResetVariant("reset");

    if (nextMode === "signup") {
      setRegisterForm((current) => ({
        email: current.email || loginForm.email,
        password: current.password
      }));
      setRegisterState("idle");
      setRegisterError("");
    } else {
      setLoginForm((current) => ({
        email: current.email || registerForm.email,
        password: current.password
      }));
      setLoginState("idle");
      setLoginError("");
    }

    const routePath = nextMode === "signup" ? localizeHref("/signup") : localizeHref("/login");
    window.history.replaceState(null, "", `${routePath}${window.location.search}`);
  }

  function updateLoginField<Key extends keyof LoginFormState>(field: Key) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      setLoginForm((current) => ({ ...current, [field]: event.target.value }));
      if (authRecovery) {
        clearRecoveryState();
      }
      if (loginState === "error") {
        setLoginState("idle");
        setLoginError("");
      }
    };
  }

  function updateRegisterField<Key extends keyof LoginFormState>(field: Key) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      setRegisterForm((current) => ({ ...current, [field]: event.target.value }));
      if (authRecovery) {
        clearRecoveryState();
      }
      if (registerState === "error") {
        setRegisterState("idle");
        setRegisterError("");
      }
    };
  }

  async function requestPasswordReset(emailInput: string, variant: PasswordResetRequestVariant = "reset") {
    const email = emailInput.trim().toLowerCase() || loginForm.email.trim().toLowerCase();
    const successMessage =
      variant === "setup" ? loginCopy.recoveryPrepared || loginCopy.validation.resetPrepared : loginCopy.validation.resetPrepared;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setResetVariant(variant);
      setResetState("error");
      setResetMessage(loginCopy.validation.invalidResetEmail);
      return false;
    }

    setResetEmail(email);
    setResetVariant(variant);
    setResetState("loading");
    setResetMessage("");

    try {
      const response = await fetch(apiUrl("/api/auth/password/request-reset"), {
        method: "POST",
        credentials: "include",
        headers: withAppLocaleHeader(locale, {
          "Content-Type": "application/json"
        }),
        body: JSON.stringify({ email })
      });
      const result = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        message?: string;
        error?: string;
      };

      if (!response.ok || !result.ok) {
        throw new Error(translatePublicAuthErrorMessage(result.error || loginCopy.validation.resetUnavailable, siteUi));
      }

      setResetState("success");
      setResetMessage(successMessage);
      void trackEvent({
        name: "auth_password_reset_requested",
        metadata: {
          emailDomain: email.split("@")[1] || "unknown"
        }
      });
      return true;
    } catch (error) {
      setResetState("error");
      setResetMessage(
        error instanceof Error ? translatePublicAuthErrorMessage(error.message, siteUi) : loginCopy.validation.resetUnavailable
      );
      return false;
    }
  }

  async function submitEmailLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = loginForm.email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || loginForm.password.length < 8) {
      setLoginState("error");
      setLoginError(loginCopy.validation.invalidLogin);
      return;
    }

    setLoginState("loading");
    setLoginError("");

    try {
      const response = await fetch(apiUrl("/api/auth/email/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email,
          password: loginForm.password
        })
      });
      const result = (await response.json().catch(() => ({}))) as EmailLoginResponse;

      if (!response.ok || !result.ok) {
        const recoveryReason = getAuthRecoveryReasonFromResponse(result);
        if (recoveryReason) {
          setAuthRecovery({ reason: recoveryReason, email });
          setLoginError("");
          setShowResetPanel(false);
          setResetEmail(email);
          setResetState("idle");
          setResetMessage("");
        } else {
          setAuthRecovery(null);
          setLoginError(translatePublicAuthErrorMessage(result.error || loginCopy.validation.emailLoginFailed, siteUi));
        }
        setLoginState("error");
        return;
      }

      clearRecoveryState();
      void trackEvent({
        name: "auth_login_email_success",
        metadata: {
          method: "email"
        }
      });
      window.location.href = decorateAppRedirect(result.next || "/app", "login");
    } catch (error) {
      console.error("email_login_failed", error);
      setLoginState("error");
      setLoginError(loginCopy.validation.emailLoginUnavailable);
    }
  }

  async function submitEmailRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = registerForm.email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || registerForm.password.length < 8) {
      setRegisterState("error");
      setRegisterError(loginCopy.validation.invalidLogin);
      return;
    }

    setRegisterState("loading");
    setRegisterError("");

    try {
      const response = await fetch(apiUrl("/api/auth/email/register"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email,
          password: registerForm.password
        })
      });
      const result = (await response.json().catch(() => ({}))) as EmailRegisterResponse;

      if (!response.ok || !result.ok) {
        const redirectReason = getSignupRedirectReason(result);
        if (redirectReason) {
          switchAuthMode("login");
          setLoginForm({
            email,
            password: registerForm.password
          });
          if (redirectReason === "account_exists") {
            setAuthRecovery(null);
            setLoginState("error");
            setLoginError(translatePublicAuthErrorMessage(result.error || signupCopy.validation.accountExists, siteUi));
          } else {
            setAuthRecovery({ reason: redirectReason, email });
            setLoginState("error");
            setLoginError("");
            setShowResetPanel(false);
            setResetEmail(email);
            setResetState("idle");
            setResetMessage("");
          }
          return;
        }

        setRegisterState("error");
        setRegisterError(
          translatePublicAuthErrorMessage(result.error || signupCopy.validation.accountCreateFailed, siteUi)
        );
        return;
      }

      void trackEvent({
        name: "auth_signup_completed",
        metadata: {
          method: "email",
          planId: authIntent.selectedPlan.id
        }
      });
      window.location.href = decorateAppRedirect(result.next || "/app", "welcome");
    } catch (error) {
      console.error("email_register_failed", error);
      setRegisterState("error");
      setRegisterError(signupCopy.validation.accountCreateFailed);
    }
  }

  async function submitPasswordResetRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await requestPasswordReset(resetEmail);
  }

  return (
    <div className="site-shell">
      <header className="topbar topbar-minimal">
        <a className="brand" href={localizeHref("/")} aria-label={`${siteUi.common.brand} ${siteUi.common.home}`}>
          <BrandMark />
          <span>{siteUi.common.brand}</span>
        </a>
        <div className="topbar-control-dock" aria-label={`${siteUi.common.languageLabel} · ${siteUi.common.home}`}>
          <LanguageSwitcher />
          <a className="button button-small button-secondary topbar-back" href={localizeHref("/")}>
            <Icon name="arrow" />
            <span className="topbar-back-label">{siteUi.common.backHome}</span>
          </a>
        </div>
      </header>

      <main className="auth-page login-page">
        <section className="login-showcase" aria-label={isCreateMode ? signupCopy.heroTitle : loginCopy.heroTitle}>
          <LoginWorkspaceIllustration
            locale={locale}
            copy={{
              eyebrow: isCreateMode ? signupCopy.heroEyebrow : loginCopy.heroEyebrow,
              title: isCreateMode ? signupCopy.heroTitle : loginCopy.heroTitle,
              copy: isCreateMode ? signupCopy.heroCopy : loginCopy.heroCopy,
              proofItems: loginCopy.proofItems
            }}
          />
          <div className="login-showcase-overlay" />
        </section>

        <section className="auth-card login-card glass-card">
          <div className="auth-mode-switch" role="tablist" aria-label={`${loginCopy.cardTitle} / ${signupCopy.heroTitle}`}>
            <button
              className={`auth-mode-button${!isCreateMode ? " is-active" : ""}`}
              type="button"
              role="tab"
              aria-selected={!isCreateMode}
              onClick={() => switchAuthMode("login")}
            >
              {loginCopy.cardTitle}
            </button>
            <button
              className={`auth-mode-button${isCreateMode ? " is-active" : ""}`}
              type="button"
              role="tab"
              aria-selected={isCreateMode}
              onClick={() => switchAuthMode("signup")}
            >
              {signupCopy.heroTitle}
            </button>
          </div>
          <p className="eyebrow">{isCreateMode ? signupCopy.heroEyebrow : loginCopy.cardEyebrow}</p>
          <h1>{isCreateMode ? signupCopy.heroTitle : loginCopy.cardTitle}</h1>
          <p className="auth-copy">{isCreateMode ? signupCopy.heroCopy : loginCopy.cardCopy}</p>
          {isCreateMode && authIntent.hasIntent ? (
            <div className="selected-plan auth-intent-card">
              <span>{signupCopy.planLabel}</span>
              <strong>{authIntent.selectedPlan.name}</strong>
              <p>{selectedPlanCopy}</p>
              <div className="auth-intent-meta" aria-label={signupCopy.progressAria}>
                {authIntent.hasFocusIntent ? (
                  <span>{signupCopy.focusOptions[authIntent.focus as keyof typeof signupCopy.focusOptions]}</span>
                ) : null}
                {authIntent.hasFirstIntent ? <span>{formatCompactUrl(authIntent.firstProspectUrl)}</span> : null}
              </div>
            </div>
          ) : null}
          <a
            className="button button-primary auth-google-button"
            href={
              isCreateMode
                ? buildGoogleAuthHref({
                    intent: "signup",
                    planId: authIntent.hasPlanIntent ? authIntent.selectedPlan.id : undefined,
                    focus: authIntent.hasFocusIntent ? authIntent.focus : undefined,
                    firstProspectUrl: authIntent.hasFirstIntent ? authIntent.firstProspectUrl : undefined,
                    returnTo: appReturnPath
                  })
                : buildGoogleAuthHref({ intent: "login", returnTo: appReturnPath })
            }
            onClick={() => {
              void trackEvent({
                name: isCreateMode ? "auth_signup_google_click" : "auth_login_google_click",
                metadata: {
                  method: "google",
                  planId: authIntent.selectedPlan.id
                }
              });
            }}
          >
            {isCreateMode ? signupCopy.oauthCta : loginCopy.googleCta}
          </a>
          <div className="oauth-divider" aria-hidden="true">
            <span>{isCreateMode ? signupCopy.divider : loginCopy.divider}</span>
          </div>
          {authMessage ? (
            <p className="form-status is-error auth-message" role="alert">
              {authMessage}
            </p>
          ) : null}
          {isCreateMode ? (
            <>
              <form className="login-form" onSubmit={submitEmailRegister}>
                <label className="auth-field">
                  <span>{signupCopy.workEmail}</span>
                  <input
                    type="email"
                    name="email"
                    value={registerForm.email}
                    onChange={updateRegisterField("email")}
                    autoComplete="email"
                    placeholder={loginCopy.emailPlaceholder}
                    required
                  />
                </label>
                <label className="auth-field">
                  <span>{signupCopy.password}</span>
                  <div className="password-input-wrap">
                    <input
                      type={showCreatePassword ? "text" : "password"}
                      name="password"
                      value={registerForm.password}
                      onChange={updateRegisterField("password")}
                      autoComplete="new-password"
                      minLength={8}
                      placeholder={loginCopy.passwordPlaceholder}
                      required
                    />
                    <button
                      className="password-toggle"
                      type="button"
                      onClick={() => setShowCreatePassword((current) => !current)}
                      aria-pressed={showCreatePassword}
                    >
                      {showCreatePassword ? loginCopy.hide : loginCopy.show}
                    </button>
                  </div>
                </label>
                <button className="button button-secondary auth-email-button" type="submit" disabled={registerState === "loading"}>
                  <Icon name="mail" />
                  {registerState === "loading" ? signupCopy.emailLoading : signupCopy.emailCta}
                </button>
                <p className="auth-note auth-setup-note">
                  <Icon name="lock" />
                  <span>{signupCopy.setupNote}</span>
                </p>
              </form>
              {registerError ? (
                <p className="form-status is-error auth-message" role="alert">
                  {registerError}
                </p>
              ) : null}
              <div className="auth-inline-links">
                <a className="auth-text-link" href={localizeHref("/support")}>
                  {loginCopy.needHelp}
                </a>
              </div>
            </>
          ) : (
            <>
              <form className="login-form" onSubmit={submitEmailLogin}>
                <label className="auth-field">
                  <span>{loginCopy.emailLabel}</span>
                  <input
                    type="email"
                    name="email"
                    value={loginForm.email}
                    onChange={updateLoginField("email")}
                    autoComplete="email"
                    placeholder={loginCopy.emailPlaceholder}
                    required
                  />
                </label>
                <label className="auth-field">
                  <span>{loginCopy.passwordLabel}</span>
                  <div className="password-input-wrap">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={loginForm.password}
                      onChange={updateLoginField("password")}
                      autoComplete="current-password"
                      minLength={8}
                      placeholder={loginCopy.passwordPlaceholder}
                      required
                    />
                    <button
                      className="password-toggle"
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      aria-pressed={showPassword}
                    >
                      {showPassword ? loginCopy.hide : loginCopy.show}
                    </button>
                  </div>
                </label>
                <button className="button button-secondary auth-email-button" type="submit" disabled={loginState === "loading"}>
                  <Icon name="mail" />
                  {loginState === "loading" ? loginCopy.emailLoading : loginCopy.emailCta}
                </button>
              </form>
              {authRecovery ? (
                <div className="auth-recovery-card" role="alert">
                  <div className="auth-recovery-copy">
                    <strong>
                      {authRecovery.reason === "google_sign_in_required"
                        ? loginCopy.recoveryGoogleTitle
                        : loginCopy.recoveryPasswordTitle}
                    </strong>
                    <p>
                      {authRecovery.reason === "google_sign_in_required"
                        ? loginCopy.recoveryGoogleCopy
                        : loginCopy.recoveryPasswordCopy}
                    </p>
                  </div>
                  <div className="auth-recovery-actions">
                    <a
                      className="button button-primary auth-recovery-button"
                      href={buildGoogleAuthHref({ intent: "login", returnTo: appReturnPath })}
                    >
                      {loginCopy.googleCta}
                    </a>
                    <button
                      className="button button-secondary auth-recovery-button"
                      type="button"
                      disabled={resetState === "loading"}
                      onClick={() => {
                        void requestPasswordReset(authRecovery.email, "setup");
                      }}
                    >
                      {resetState === "loading" ? loginCopy.recoveryLinkLoading : loginCopy.recoveryLinkCta}
                    </button>
                  </div>
                  {resetMessage ? (
                    <p
                      className={`form-status ${
                        resetState === "error" ? "is-error" : resetState === "success" ? "is-success" : ""
                      }`}
                      role="status"
                  >
                    {resetMessage}
                  </p>
                  ) : null}
                </div>
              ) : null}
              <div className="auth-inline-links">
                <button
                  className="auth-text-link"
                  type="button"
                  onClick={() => {
                    setShowResetPanel((current) => !current);
                    setResetEmail((current) => current || loginForm.email);
                    setResetState("idle");
                    setResetMessage("");
                    setResetVariant("reset");
                  }}
                >
                  {showResetPanel ? loginCopy.hideReset : loginCopy.forgotPassword}
                </button>
                <a className="auth-text-link" href={localizeHref("/support")}>
                  {loginCopy.needHelp}
                </a>
              </div>
              {showResetPanel ? (
                <form className="auth-support-card" onSubmit={submitPasswordResetRequest}>
                  <div>
                    <strong>{loginCopy.resetTitle}</strong>
                    <p>{loginCopy.resetCopy}</p>
                  </div>
                  <label className="auth-field">
                    <span>{loginCopy.resetEmailLabel}</span>
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(event) => setResetEmail(event.currentTarget.value)}
                      placeholder={loginCopy.emailPlaceholder}
                      autoComplete="email"
                      required
                    />
                  </label>
                  <button className="button button-secondary" type="submit" disabled={resetState === "loading"}>
                    {resetState === "loading" ? loginCopy.resetLoading : loginCopy.resetCta}
                  </button>
                  <p
                    className={`form-status ${
                      resetState === "error" ? "is-error" : resetState === "success" ? "is-success" : ""
                    }`}
                    role="status"
                  >
                    {resetMessage || " "}
                  </p>
                </form>
              ) : null}
              {loginError ? (
                <p className="form-status is-error auth-message" role="alert">
                  {loginError}
                </p>
              ) : null}
              <p className="auth-note">{loginCopy.sessionNote}</p>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

function ResetPasswordPage() {
  const { locale, siteUi, localizeHref } = usePublicSite();
  const resetCopy = siteUi.auth.reset;
  const resetToken = useMemo(() => new URLSearchParams(window.location.search).get("token") || "", []);
  const [form, setForm] = useState<PasswordResetFormState>({ password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [resetState, setResetState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  function updateField<Key extends keyof PasswordResetFormState>(field: Key) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      setForm((current) => ({ ...current, [field]: event.currentTarget.value }));
      if (resetState !== "idle") {
        setResetState("idle");
        setStatusMessage("");
      }
    };
  }

  async function submitPasswordReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!resetToken) {
      setResetState("error");
      setStatusMessage(resetCopy.missingToken);
      return;
    }

    if (form.password.length < 8) {
      setResetState("error");
      setStatusMessage(resetCopy.shortPassword);
      return;
    }

    if (form.password !== form.confirmPassword) {
      setResetState("error");
      setStatusMessage(resetCopy.mismatch);
      return;
    }

    setResetState("loading");
    setStatusMessage("");

    try {
      const response = await fetch(apiUrl("/api/auth/password/reset"), {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          token: resetToken,
          password: form.password
        })
      });
      const result = (await response.json().catch(() => ({}))) as { ok?: boolean; next?: string; error?: string };

      if (!response.ok || !result.ok) {
        throw new Error(translatePublicAuthErrorMessage(result.error || resetCopy.invalidLink, siteUi));
      }

      setResetState("success");
      setStatusMessage(resetCopy.success);
      void trackEvent({ name: "auth_password_reset_completed" });
      window.setTimeout(() => {
        window.location.assign(localizeHref(result.next || "/app?login=1"));
      }, 600);
    } catch (error) {
      setResetState("error");
      setStatusMessage(error instanceof Error ? translatePublicAuthErrorMessage(error.message, siteUi) : resetCopy.genericError);
    }
  }

  return (
    <div className="site-shell">
      <header className="topbar topbar-minimal">
        <a className="brand" href={localizeHref("/")} aria-label={`${siteUi.common.brand} ${siteUi.common.home}`}>
          <BrandMark />
          <span>{siteUi.common.brand}</span>
        </a>
        <div className="topbar-control-dock" aria-label={`${siteUi.common.languageLabel} · ${siteUi.common.backToSignIn}`}>
          <LanguageSwitcher />
          <a className="button button-small button-secondary topbar-back" href={localizeHref("/login")}>
            <Icon name="arrow" />
            <span className="topbar-back-label">{siteUi.common.backToSignIn}</span>
          </a>
        </div>
      </header>

      <main className="auth-page auth-reset-page">
        <section className="auth-card glass-card reset-password-card">
          <p className="eyebrow">{resetCopy.eyebrow}</p>
          <h1>{resetCopy.title}</h1>
          <p className="auth-copy">{resetCopy.copy}</p>
          <form className="login-form" onSubmit={submitPasswordReset}>
            <label className="auth-field">
              <span>{resetCopy.passwordLabel}</span>
              <div className="password-input-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={updateField("password")}
                  autoComplete="new-password"
                  minLength={8}
                  placeholder={siteUi.auth.login.passwordPlaceholder}
                  required
                />
                <button
                  className="password-toggle"
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-pressed={showPassword}
                >
                  {showPassword ? siteUi.auth.login.hide : siteUi.auth.login.show}
                </button>
              </div>
            </label>
            <label className="auth-field">
              <span>{resetCopy.confirmLabel}</span>
              <input
                type={showPassword ? "text" : "password"}
                value={form.confirmPassword}
                onChange={updateField("confirmPassword")}
                autoComplete="new-password"
                minLength={8}
                placeholder={resetCopy.confirmPlaceholder}
                required
              />
            </label>
            <button className="button button-primary auth-email-button" type="submit" disabled={resetState === "loading"}>
              <Icon name="lock" />
              {resetState === "loading" ? resetCopy.loading : resetCopy.submit}
            </button>
            <p
              className={`form-status ${
                resetState === "error" ? "is-error" : resetState === "success" ? "is-success" : ""
              }`}
              role="status"
            >
              {statusMessage || " "}
            </p>
          </form>
          <div className="auth-inline-links">
            <a className="auth-text-link" href={localizeHref("/login")}>
              {siteUi.common.backToSignIn}
            </a>
            <a className="auth-text-link" href={localizeHref("/support")}>
              {siteUi.common.contactSupport}
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}

function SignupPage() {
  const { locale, siteUi, localizeHref, formatMessage } = usePublicSite();
  const signupCopy = siteUi.auth.signup;
  const selectedPlan = getSelectedPlan();
  const initialFocus = getInitialFocus();
  const initialFirstProspectUrl = getInitialFirstProspectUrl();
  const authMessage = getAuthErrorMessage(siteUi);
  const [signupStep, setSignupStep] = useState<1 | 2>(1);
  const [signupForm, setSignupForm] = useState<SignupFormState>(() => ({
    email: "",
    password: "",
    agencyFocus: initialFocus,
    agencyWebsite: "",
    offerDescription: DEFAULT_ICP.offerDescription,
    targetIndustries: DEFAULT_ICP.targetIndustries.join(", "),
    firstProspectUrl: initialFirstProspectUrl
  }));
  const googleSignupHref = buildGoogleAuthHref({
    intent: "signup",
    planId: selectedPlan.id,
    focus: signupForm.agencyFocus === "founder" ? "marketing" : signupForm.agencyFocus,
    returnTo: buildLocalePath(locale, "/app")
  });
  const selectedPlanPrice = selectedPlan.price === 0 ? "$0/mo" : `$${selectedPlan.price}/mo`;
  const selectedPlanCopy =
    selectedPlan.id === "free"
      ? signupCopy.selectedPlanFree
      : formatMessage(signupCopy.selectedPlanPaid, { price: selectedPlanPrice, credits: selectedPlan.monthlyCredits.toLocaleString() });
  const submitCopy = selectedPlan.id === "free" ? signupCopy.createWorkspace : signupCopy.continueToBilling;
  const [signupState, setSignupState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const stepSummaries = [
    { step: 1 as const, label: signupCopy.stepBasics },
    { step: 2 as const, label: signupCopy.stepScoring }
  ];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("plan") !== "free") {
      return;
    }

    params.delete("plan");
    const nextHref = `${buildLocalePath(locale, "/signup")}${params.toString() ? `?${params.toString()}` : ""}`;
    window.history.replaceState(null, "", nextHref);
  }, [locale]);

  function updateSignupField<Key extends keyof SignupFormState>(field: Key) {
    return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = event.currentTarget.value;
      setSignupForm((current) => ({ ...current, [field]: value }));

      if (signupState === "error") {
        setSignupState("idle");
        setStatusMessage("");
      }
    };
  }

  function continueSignup() {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupForm.email.trim().toLowerCase())) {
      setSignupState("error");
      setStatusMessage(signupCopy.validation.emailRequired);
      return;
    }

    if (signupForm.password.length < 8) {
      setSignupState("error");
      setStatusMessage(signupCopy.validation.passwordRequired);
      return;
    }

    setSignupState("idle");
    setStatusMessage("");
    setSignupStep(2);
  }

  async function submitSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSignupState("loading");
    setStatusMessage("");

    try {
      const response = await fetch(apiUrl("/api/signup-intents"), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: signupForm.email.trim(),
          password: signupForm.password,
          planId: selectedPlan.id,
          agencyFocus: signupForm.agencyFocus,
          agencyWebsite: signupForm.agencyWebsite.trim(),
          offerDescription: signupForm.offerDescription.trim(),
          targetIndustries: signupForm.targetIndustries.trim(),
          firstProspectUrl: signupForm.firstProspectUrl.trim()
        })
      });

      if (!response.ok) {
        const result = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(translatePublicAuthErrorMessage(result.error || signupCopy.validation.setupFailed, siteUi));
      }

      const result = (await response.json()) as SignupResponse;
      void trackEvent({
        name: "auth_signup_completed",
        metadata: {
          planId: selectedPlan.id,
          billingStatus: result.billingStatus || "unknown"
        }
      });
      if (result.checkoutUrl) {
        window.location.assign(result.checkoutUrl);
        return;
      }

      if (result.next === "dashboard") {
        window.location.assign(localizeHref("/app?welcome=1"));
        return;
      }

      setSignupState("done");
      setStatusMessage(
        result.next === "checkout"
          ? signupCopy.validation.billingPending
          : signupCopy.validation.dashboardReady
      );
    } catch (error) {
      setSignupState("error");
      setStatusMessage(error instanceof Error ? translatePublicAuthErrorMessage(error.message, siteUi) : signupCopy.validation.setupFailed);
    }
  }

  return (
    <div className="site-shell">
      <header className="topbar topbar-minimal">
        <a className="brand" href={localizeHref("/")} aria-label={`${siteUi.common.brand} ${siteUi.common.home}`}>
          <BrandMark />
          <span>{siteUi.common.brand}</span>
        </a>
        <div className="topbar-control-dock" aria-label={`${siteUi.common.languageLabel} · ${siteUi.common.home}`}>
          <LanguageSwitcher />
          <a className="button button-small button-secondary topbar-back" href={localizeHref("/")}>
            <Icon name="arrow" />
            <span className="topbar-back-label">{siteUi.common.backHome}</span>
          </a>
        </div>
      </header>

      <main className="signup-page">
        <section className="signup-hero">
          <div className="signup-copy">
            <p className="eyebrow glass-pill">{signupCopy.heroEyebrow}</p>
            <h1>{signupCopy.heroTitle}</h1>
            <p>{signupCopy.heroCopy}</p>
            <div className="signup-summary">
              <span>
                <Icon name="check" />
                {`${selectedPlan.monthlyCredits.toLocaleString()} ${siteUi.home.pricing.scansSuffix}`}
              </span>
              <span>
                <Icon name="database" />
                {signupCopy.summaryProspects}
              </span>
            </div>
          </div>

          <div className="signup-form-shell glass-card">
            <div className="selected-plan">
              <span>{signupCopy.planLabel}</span>
              <strong>{selectedPlan.name}</strong>
              <p>{selectedPlanCopy}</p>
            </div>
            <div className="signup-steps" aria-label={signupCopy.progressAria}>
              {stepSummaries.map((item) => (
                <div
                  className={`signup-step-pill ${signupStep === item.step ? "is-current" : ""} ${signupStep > item.step ? "is-done" : ""}`}
                  key={item.step}
                >
                  <span>{signupStep > item.step ? "✓" : item.step}</span>
                  <strong>{item.label}</strong>
                </div>
              ))}
            </div>
            <div className="oauth-entry">
              <a className="button button-secondary auth-google-button" href={googleSignupHref}>
                {signupCopy.oauthCta}
              </a>
              <p>{signupCopy.oauthCopy}</p>
            </div>
            <div className="oauth-divider" aria-hidden="true">
              <span>{signupCopy.divider}</span>
            </div>
            {authMessage ? (
              <p className="form-status is-error auth-message" role="alert">
                {authMessage}
              </p>
            ) : null}

            {signupState === "done" ? (
              <div className="signup-success" role="status" aria-live="polite">
                <span className="success-icon">
                  <Icon name="check" />
                </span>
                <h2>{signupCopy.successTitle}</h2>
                <p>{statusMessage}</p>
                <div className="signup-actions">
                  <a className="button button-primary" href={localizeHref("/app")}>
                    <Icon name="browser" />
                    {siteUi.common.openDashboard}
                  </a>
                  <a className="button button-secondary" href={localizeHref("/#pricing")}>
                    <Icon name="chart" />
                    {siteUi.common.reviewPlans}
                  </a>
                </div>
              </div>
            ) : (
              <form className="signup-form" onSubmit={submitSignup}>
                {signupStep === 1 ? (
                  <div className="signup-step-panel">
                    <div className="signup-step-header">
                      <span>{signupCopy.step1Lead}</span>
                      <h2>{signupCopy.step1Title}</h2>
                      <p>{signupCopy.step1Copy}</p>
                    </div>
                    <label>
                      {signupCopy.workEmail}
                      <input
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        placeholder={siteUi.auth.login.emailPlaceholder}
                        value={signupForm.email}
                        onChange={updateSignupField("email")}
                      />
                    </label>
                    <label>
                      {signupCopy.password}
                      <input
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        minLength={8}
                        required
                        placeholder={siteUi.auth.login.passwordPlaceholder}
                        value={signupForm.password}
                        onChange={updateSignupField("password")}
                      />
                    </label>
                    <label>
                      {signupCopy.agencyFocus}
                      <select name="agencyFocus" value={signupForm.agencyFocus} onChange={updateSignupField("agencyFocus")}>
                        <option value="web_design">{signupCopy.focusOptions.web_design}</option>
                        <option value="seo">{signupCopy.focusOptions.seo}</option>
                        <option value="marketing">{signupCopy.focusOptions.marketing}</option>
                        <option value="founder">{signupCopy.focusOptions.founder}</option>
                      </select>
                    </label>
                    <label>
                      {signupCopy.agencyWebsite}
                      <input
                        name="agencyWebsite"
                        type="url"
                        autoComplete="url"
                        placeholder={signupCopy.agencyWebsitePlaceholder}
                        value={signupForm.agencyWebsite}
                        onChange={updateSignupField("agencyWebsite")}
                      />
                    </label>
                    <div className="signup-actions-row">
                      <button className="button button-primary" type="button" onClick={continueSignup}>
                        {signupCopy.continue}
                      </button>
                    </div>
                    <p className={`form-status ${signupState === "error" ? "is-error" : ""}`} role="status" aria-live="polite">
                      {statusMessage || " "}
                    </p>
                  </div>
                ) : (
                  <div className="signup-step-panel">
                    <div className="signup-step-header">
                      <span>{signupCopy.step2Lead}</span>
                      <h2>{signupCopy.step2Title}</h2>
                      <p>{signupCopy.step2Copy}</p>
                    </div>
                    <div className="signup-draft">
                      <span>{signupForm.email}</span>
                      <span>{signupCopy.focusOptions[signupForm.agencyFocus as keyof typeof signupCopy.focusOptions]}</span>
                      {signupForm.agencyWebsite ? <span>{formatCompactUrl(signupForm.agencyWebsite)}</span> : null}
                    </div>
                    <label>
                      {signupCopy.offerDescription}
                      <textarea
                        name="offerDescription"
                        required
                        rows={4}
                        value={signupForm.offerDescription}
                        onChange={updateSignupField("offerDescription")}
                      />
                    </label>
                    <label>
                      {signupCopy.targetIndustries}
                      <input
                        name="targetIndustries"
                        required
                        value={signupForm.targetIndustries}
                        onChange={updateSignupField("targetIndustries")}
                      />
                    </label>
                    <label>
                      {signupCopy.firstProspectUrl}
                      <input
                        name="firstProspectUrl"
                        type="url"
                        placeholder={siteUi.home.launch.quickScanPlaceholder}
                        value={signupForm.firstProspectUrl}
                        onChange={updateSignupField("firstProspectUrl")}
                      />
                    </label>
                    <p className="form-note">
                      <Icon name="lock" />
                      {signupCopy.setupNote}
                    </p>
                    <div className="signup-actions-row">
                      <button
                        className="button button-secondary signup-back"
                        type="button"
                        onClick={() => setSignupStep(1)}
                        disabled={signupState === "loading"}
                      >
                        {signupCopy.back}
                      </button>
                      <button className="button button-primary" type="submit" disabled={signupState === "loading"}>
                        <Icon name="mail" />
                        {submitCopy}
                      </button>
                    </div>
                    <p className={`form-status ${signupState === "error" ? "is-error" : ""}`} role="status" aria-live="polite">
                      {statusMessage || " "}
                    </p>
                  </div>
                )}
              </form>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function UserMenu({ appUi, auth, signOut }: { appUi: AppUi; auth: AuthMeResponse; signOut: () => void }) {
  const { locale } = usePublicSite();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: globalThis.PointerEvent) {
      if (!menuRef.current || !(event.target instanceof Node) || menuRef.current.contains(event.target)) {
        return;
      }

      setIsOpen(false);
    }

    function handleEscape(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const userEmail = auth.authenticated ? auth.user.email : "";
  const userInitial = auth.authenticated
    ? (auth.user.name?.[0] || auth.user.email?.[0] || "U").toUpperCase()
    : "?";

  return (
    <div className={`user-menu${isOpen ? " is-open" : ""}`} ref={menuRef}>
      <button
        type="button"
        className="user-menu-trigger"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span className="user-menu-avatar" aria-hidden="true">{userInitial}</span>
        <span className="user-menu-caret" aria-hidden="true">
          <Icon name="chevron_down" />
        </span>
      </button>
      {isOpen ? (
        <div className="user-menu-dropdown" role="menu">
          {userEmail ? (
            <div className="user-menu-email">{userEmail}</div>
          ) : null}
          <a className="user-menu-item" href={buildLocalePath(locale, "/app/settings")} role="menuitem" onClick={() => setIsOpen(false)}>
            <Icon name="lock" />
            {appUi.userMenu.accountSettings}
          </a>
          <a className="user-menu-item" href={`${buildLocalePath(locale, "/app/settings")}#billing-plan-compare`} role="menuitem" onClick={() => setIsOpen(false)}>
            <Icon name="shield" />
            {appUi.userMenu.manageBilling}
          </a>
          <div className="user-menu-divider" />
          {auth.authenticated ? (
            <button
              className="user-menu-item user-menu-signout"
              type="button"
              role="menuitem"
              onClick={() => {
                setIsOpen(false);
                signOut();
              }}
            >
              <Icon name="arrow" />
              {appUi.userMenu.signOut}
            </button>
          ) : (
            <a className="user-menu-item" href={buildLocalePath(locale, "/login")} role="menuitem">
              <Icon name="mail" />
              {appUi.actions.signIn}
            </a>
          )}
        </div>
      ) : null}
    </div>
  );
}

function DashboardApp() {
  const { locale, siteUi, formatMessage } = usePublicSite();
  const appUi = getAppUi(locale);
  const appQuery = useMemo(() => new URLSearchParams(window.location.search), []);
  const authIntent = useMemo(() => getAuthIntent(appQuery), [appQuery]);
  const appSection = getAppSection(window.location.pathname);
  const appRoutes = useMemo(
    () => ({
      today: buildLocalePath(locale, "/app"),
      queue: buildLocalePath(locale, "/app/queue"),
      qualified: buildLocalePath(locale, "/app/qualified"),
      exports: buildLocalePath(locale, "/app/exports"),
      settings: buildLocalePath(locale, "/app/settings"),
      analytics: buildLocalePath(locale, "/app/analytics")
    }),
    [locale]
  );
  const queueScanRoute = `${appRoutes.queue}#scan-console`;
  const isQueueSection = appSection === "queue";
  const isQualifiedSection = appSection === "qualified";
  const isExportsSection = appSection === "exports";
  const isSettingsSection = appSection === "settings";
  const pageCopy =
    (appUi.pages as Record<string, { eyebrow: string; title: string; copy: string }>)[appSection] || appUi.pages.dashboard;
  const sampleProspectCard = useMemo(() => buildSampleProspectCard(locale), [locale]);
  const demoLeadRows = useMemo(() => buildDemoLeadRows(locale), [locale]);
  const demoScanHistory = useMemo(() => buildDemoScanHistory(locale), [locale]);
  const sampleWorkspace = useMemo(
    () => buildSampleWorkspace(locale, demoLeadRows.length, sampleProspectCard.website),
    [demoLeadRows.length, locale, sampleProspectCard.website]
  );
  const sampleAnalyticsSummary = useMemo(() => buildSampleAnalyticsSummary(locale), [locale]);
  const sampleDashboardProspect = useMemo(
    () => ({
      ...sampleProspectCard,
      savedStatus: "saved" as const,
      exportStatus: "not_exported" as const,
      pipelineContext: { ...defaultProspectMeta }
    }),
    [sampleProspectCard]
  );
  const initialWorkspace = useMemo<WorkspaceSnapshot>(
    () => ({
      ...sampleWorkspace,
      source: "d1",
      workspace: {
        ...sampleWorkspace.workspace,
        name: siteUi.common.brand
      },
      setup: {
        ...sampleWorkspace.setup,
        serviceType: serviceTypeForFocus(authIntent.focus),
        agencyFocus: authIntent.focus,
        targetIndustries: [],
        targetCountries: [],
        offerDescription: "",
        agencyWebsite: null,
        firstProspectUrl: authIntent.hasFirstIntent ? authIntent.firstProspectUrl : null
      },
      onboarding: {
        completedAt: null,
        isComplete: false
      },
      plan: authIntent.hasPlanIntent ? authIntent.selectedPlan : sampleWorkspace.plan,
      subscription: {
        ...sampleWorkspace.subscription,
        status: authIntent.hasPlanIntent && authIntent.selectedPlan.id !== "free" ? "pending_checkout" : "active"
      },
      credits: {
        ...sampleWorkspace.credits,
        used: 0,
        remaining: (authIntent.hasPlanIntent ? authIntent.selectedPlan : sampleWorkspace.plan).monthlyCredits
      },
      leadCount: 0
    }),
    [authIntent, sampleWorkspace, siteUi.common.brand]
  );
  const initialAnalyticsSummary = useMemo<AnalyticsSummary>(
    () => ({
      source: "d1",
      totals: {
        events: 0,
        scansCompleted: 0,
        leadsSaved: 0,
        exportsCompleted: 0
      },
      funnel: {
        ctaClicks: 0,
        signupsCompleted: 0,
        loginsCompleted: 0,
        scansCompleted: 0,
        exportsCompleted: 0
      },
      topPages: [],
      topEvents: [],
      recentEvents: [],
      recommendations: []
    }),
    []
  );
  const welcomeFlow = appQuery.get("welcome") === "1";
  const loginFlow = appQuery.get("login") === "1";
  const checkoutSuccess = appQuery.get("checkout") === "success";
  const [snapshot, setSnapshot] = useState<WorkspaceSnapshot>(initialWorkspace);
  const [leads, setLeads] = useState<LeadListItem[]>([]);
  const [queueItems, setQueueItems] = useState<WorkspaceQueueItem[]>([]);
  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>([]);
  const [exportRuns, setExportRuns] = useState<ExportRun[]>([]);
  const [historyState, setHistoryState] = useState<"loading" | "ready" | "sample" | "error">("loading");
  const [historyFilter, setHistoryFilter] = useState<ScanHistoryFilter>("all");
  const [historyDateFilter, setHistoryDateFilter] = useState<HistoryDateFilter>("all");
  const [historyReasonFilter, setHistoryReasonFilter] = useState("all");
  const [expandedScanId, setExpandedScanId] = useState<string | null>(null);
  const [analyticsSummary, setAnalyticsSummary] = useState<AnalyticsSummary>(initialAnalyticsSummary);
  const [analyticsState, setAnalyticsState] = useState<"loading" | "ready" | "sample" | "error">("loading");
  const [leadSearch, setLeadSearch] = useState("");
  const [leadSort, setLeadSort] = useState<LeadSortOption>("newest");
  const [leadMinFit, setLeadMinFit] = useState(0);
  const [leadMinConfidence, setLeadMinConfidence] = useState(0);
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [bulkExportPreset, setBulkExportPreset] = useState<Exclude<ProspectExportPresetKey, "custom">>("crm");
  const [bulkCrmFieldMode, setBulkCrmFieldMode] = useState<ProspectCrmFieldMode>("hubspot");
  const [bulkExportState, setBulkExportState] = useState<"idle" | "loading" | "error">("idle");
  const [dashboardState, setDashboardState] = useState<"loading" | "ready" | "sample" | "needs_workspace" | "error">("loading");
  const [dashboardMessage, setDashboardMessage] = useState("");
  const [workspaceCreateState, setWorkspaceCreateState] = useState<"idle" | "loading" | "error">("idle");
  const [workspaceCreateMessage, setWorkspaceCreateMessage] = useState("");
  const hasAttemptedIntentWorkspaceCreate = useRef(false);
  const [auth, setAuth] = useState<AuthMeResponse>({ authenticated: false });
  const [profileForm, setProfileForm] = useState<AccountProfileFormState>({
    name: "",
    workspaceName: initialWorkspace.workspace.name
  });
  const [profileSaveState, setProfileSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [profileMessage, setProfileMessage] = useState("");
  const [accountPasswordForm, setAccountPasswordForm] = useState<AccountPasswordFormState>({
    currentPassword: "",
    nextPassword: "",
    confirmPassword: ""
  });
  const [accountPasswordState, setAccountPasswordState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [accountPasswordMessage, setAccountPasswordMessage] = useState("");
  const [showAccountPassword, setShowAccountPassword] = useState(false);
  const [onboardingState, setOnboardingState] = useState<"idle" | "saving">("idle");
  const [icpForm, setIcpForm] = useState<IcpFormState>(() => icpFormFromSetup(initialWorkspace.setup));
  const [icpSaveState, setIcpSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [icpMessage, setIcpMessage] = useState("");
  const [scanForm, setScanForm] = useState<ScanFormState>(() => ({
    url: "",
    companyName: "",
    notes: "",
    deepScan: false,
    queueItemId: null,
    queueSource: null
  }));
  const [scanState, setScanState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [scanMessage, setScanMessage] = useState("");
  const [activeProspect, setActiveProspect] = useState<ProspectCardType | null>(null);
  const [lastScanError, setLastScanError] = useState<ScanFailureResponse | null>(null);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<ProspectCardType | null>(null);
  const [selectedLeadState, setSelectedLeadState] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [isLeadDrawerOpen, setLeadDrawerOpen] = useState(false);
  const importFileInputRef = useRef<HTMLInputElement | null>(null);
  const [importDraft, setImportDraft] = useState("");
  const [importSource, setImportSource] = useState<BatchSourceOption>("manual");
  const [importNote, setImportNote] = useState("");
  const [importMessage, setImportMessage] = useState("");
  const [importState, setImportState] = useState<"idle" | "saving" | "error" | "saved">("idle");
  const [reviewSearch, setReviewSearch] = useState("");
  const [reviewFilter, setReviewFilter] = useState<ReviewQueueFilter>("all");
  const [reviewSourceFilter, setReviewSourceFilter] = useState<"all" | "import" | "workspace">("all");
  const [overviewManualModeOpen, setOverviewManualModeOpen] = useState(
    () => typeof window !== "undefined" && window.location.hash === "#scan-console"
  );
  const topSignals = useMemo(
    () =>
      (activeProspect?.opportunitySignals ?? []).reduce<Record<string, number>>((acc, signal) => {
        acc[signal.category] = (acc[signal.category] ?? 0) + 1;
        return acc;
      }, {}),
    [activeProspect]
  );

  function fetchAppApi(path: string, init?: RequestInit) {
    return fetch(apiUrl(path), {
      ...init,
      headers: withAppLocaleHeader(locale, init?.headers)
    });
  }

  function mergeQueueItemState(item: WorkspaceQueueItem) {
    setQueueItems((current) =>
      [item, ...current.filter((entry) => entry.id !== item.id && entry.domain !== item.domain)].sort(
        (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
      )
    );
  }

  async function fetchQueueSnapshot() {
    const response = await fetchAppApi("/api/queue", { credentials: "include" });
    const result = (await response.json().catch(() => ({}))) as {
      items?: WorkspaceQueueItem[];
      source?: "d1" | "sample";
    };

    if (!response.ok) {
      throw new Error(appUi.common.messages.workspaceDataUnavailable);
    }

    return {
      items: result.items?.filter((item): item is WorkspaceQueueItem => Boolean(item && typeof item === "object")) || [],
      source: result.source || "d1"
    };
  }

  async function fetchExportRunSnapshot() {
    const response = await fetchAppApi("/api/exports/history", { credentials: "include" });
    const result = (await response.json().catch(() => ({}))) as {
      runs?: ExportRun[];
      source?: "d1" | "sample";
    };

    if (!response.ok) {
      throw new Error(appUi.common.messages.workspaceDataUnavailable);
    }

    return {
      runs: result.runs?.filter((item): item is ExportRun => Boolean(item && typeof item === "object")) || [],
      source: result.source || "d1"
    };
  }

  async function fetchAnalyticsSnapshot() {
    const response = await fetchAppApi("/api/analytics/summary", { credentials: "include" });
    const result = response.ok
      ? ((await response.json().catch(() => initialAnalyticsSummary)) as AnalyticsSummary)
      : initialAnalyticsSummary;
    return {
      analytics: result,
      source: response.ok ? result.source : ("sample" as const)
    };
  }

  async function refreshWorkflowData() {
    const [queueData, exportData, analyticsData] = await Promise.all([
      fetchQueueSnapshot().catch(() => ({ items: [] as WorkspaceQueueItem[], source: "sample" as const })),
      fetchExportRunSnapshot().catch(() => ({ runs: [] as ExportRun[], source: "sample" as const })),
      fetchAnalyticsSnapshot().catch(() => ({ analytics: initialAnalyticsSummary, source: "sample" as const }))
    ]);

    setQueueItems(queueData.items);
    setExportRuns(exportData.runs);
    setAnalyticsSummary(analyticsData.analytics);
    setAnalyticsState(analyticsData.source === "sample" ? "error" : "ready");
  }

  useEffect(() => {
    let cancelled = false;
    const requestedLeadId = appQuery.get("lead") || appQuery.get("leadId");

    async function loadDashboard() {
      let authData: AuthMeResponse = { authenticated: false };

      try {
        const authResponse = await fetchAppApi("/api/auth/me", { credentials: "include" });

        authData = authResponse.ok
          ? ((await authResponse.json()) as AuthMeResponse)
          : ({ authenticated: false } as AuthMeResponse);

        if (authData.authenticated && !authData.workspace.id) {
          if (!cancelled) {
            setAuth(authData);
            setSnapshot(initialWorkspace);
            setLeads([]);
            setQueueItems([]);
            setScanHistory([]);
            setExportRuns([]);
            setHistoryState("ready");
            setAnalyticsSummary(initialAnalyticsSummary);
            setAnalyticsState("ready");
            setSelectedLeadId(null);
            setSelectedLead(null);
            setActiveProspect(null);
            setSelectedLeadState("idle");
            setLeadDrawerOpen(false);
            setDashboardState("needs_workspace");
            setDashboardMessage(appUi.common.messages.createWorkspaceRequired);
          }
          return;
        }

        const [workspaceResponse, leadsResponse, scansResponse, analyticsResponse, queueResponse, exportHistoryResponse] = await Promise.all([
          fetchAppApi("/api/workspace", { credentials: "include" }),
          fetchAppApi("/api/leads", { credentials: "include" }),
          fetchAppApi("/api/scans", { credentials: "include" }),
          fetchAppApi("/api/analytics/summary", { credentials: "include" }),
          fetchAppApi("/api/queue", { credentials: "include" }),
          fetchAppApi("/api/exports/history", { credentials: "include" })
        ]);

        if (!workspaceResponse.ok) {
          const result = (await workspaceResponse.json().catch(() => ({}))) as { error?: string };
          throw new Error(result.error || appUi.common.messages.workspaceNotFound);
        }

        const workspaceData = (await workspaceResponse.json()) as WorkspaceSnapshot;
        const allowSampleMode = !authData.authenticated;

        if (authData.authenticated && workspaceData.source === "sample") {
          throw new Error("Workspace data is not available yet.");
        }

        const leadsData = leadsResponse.ok
          ? ((await leadsResponse.json()) as { leads?: LeadListItem[] })
          : { leads: allowSampleMode ? demoLeadRows : [] };
        const scansData = scansResponse.ok
          ? ((await scansResponse.json()) as { scans?: ScanHistoryItem[]; source?: "d1" | "sample" })
          : {
              scans: allowSampleMode ? demoScanHistory : [],
              source: allowSampleMode ? ("sample" as const) : ("d1" as const)
            };
        const analyticsData = analyticsResponse.ok
          ? ((await analyticsResponse.json()) as AnalyticsSummary)
          : allowSampleMode
            ? sampleAnalyticsSummary
            : initialAnalyticsSummary;
        let queueData = queueResponse.ok
          ? ((await queueResponse.json()) as { items?: WorkspaceQueueItem[]; source?: "d1" | "sample" })
          : {
              items: [] as WorkspaceQueueItem[],
              source: allowSampleMode ? ("sample" as const) : ("d1" as const)
            };
        const exportHistoryData = exportHistoryResponse.ok
          ? ((await exportHistoryResponse.json()) as { runs?: ExportRun[]; source?: "d1" | "sample" })
          : {
              runs: [] as ExportRun[],
              source: allowSampleMode ? ("sample" as const) : ("d1" as const)
            };

        if (authData.authenticated && queueResponse.ok && queueData.source !== "sample" && !(queueData.items?.length)) {
          const storedQueue = readStoredImportQueue(workspaceData.workspace.id);

          if (storedQueue.length) {
            const migrationPayload: QueueImportRequest = {
              items: storedQueue.map((item) => ({
                url: item.url,
                domain: item.domain,
                companyName: item.companyName,
                source: item.source,
                note: item.note
              }))
            };
            const migrateResponse = await fetchAppApi("/api/queue/import", {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(migrationPayload)
            }).catch(() => null);

            if (migrateResponse?.ok) {
              queueData = ((await migrateResponse.json().catch(() => queueData)) as { items?: WorkspaceQueueItem[]; source?: "d1" | "sample" });

              try {
                localStorage.removeItem(importQueueStorageKey(workspaceData.workspace.id));
              } catch {
                // Ignore storage cleanup failures during queue migration.
              }
            }
          }
        }

        const scanHistoryIsUnavailable = authData.authenticated && (!scansResponse.ok || scansData.source === "sample");
        const analyticsIsUnavailable =
          authData.authenticated && (!analyticsResponse.ok || analyticsData.source === "sample");
        const leadsAreUnavailable = authData.authenticated && !leadsResponse.ok;
        const queueIsUnavailable = authData.authenticated && (!queueResponse.ok || queueData.source === "sample");
        const hasPartialWorkspaceDataIssue =
          authData.authenticated && (leadsAreUnavailable || queueIsUnavailable || scanHistoryIsUnavailable || analyticsIsUnavailable);
        const loadedLeads = leadsData.leads?.length ? leadsData.leads : [];
        const initialLeadRow =
          requestedLeadId && loadedLeads.length
            ? loadedLeads.find((lead) => lead.id === requestedLeadId) || loadedLeads[0]
            : loadedLeads[0];
        let initialLeadDetail: ProspectCardType | null = null;

        if (initialLeadRow) {
          const detailResponse = await fetchAppApi(`/api/leads/${encodeURIComponent(initialLeadRow.id)}`, {
            credentials: "include"
          }).catch(() => null);

          if (detailResponse?.ok) {
            const detailData = (await detailResponse.json().catch(() => ({}))) as { lead?: ProspectCardType };
            initialLeadDetail = detailData.lead || null;
          }
        }

        if (!cancelled) {
          const fallbackLeadDetail = initialLeadRow ? leadPreviewProspect(initialLeadRow, sampleProspectCard) : null;
          const resolvedLeadDetail =
            initialLeadDetail || fallbackLeadDetail || (workspaceData.source === "sample" ? sampleDashboardProspect : null);
          const resolvedLeadId =
            initialLeadRow?.id || (workspaceData.source === "sample" ? demoLeadRows[0]?.id || null : null);
          const routeMessage = checkoutSuccess
            ? appUi.common.messages.billingActiveSetup
            : welcomeFlow
              ? appUi.common.messages.workspaceCreatedSetup
              : loginFlow
                ? appUi.common.messages.signedIn
                : "";
          setAuth(authData);
          setSnapshot(workspaceData);
          setLeads(loadedLeads);
          setQueueItems(queueIsUnavailable ? [] : queueData.items?.length ? queueData.items : []);
          setExportRuns(exportHistoryData.runs?.length ? exportHistoryData.runs : []);
          setSelectedLeadId(resolvedLeadDetail ? resolvedLeadId : null);
          setSelectedLead(resolvedLeadDetail);
          setSelectedLeadState(
            workspaceData.source === "sample" || initialLeadDetail ? "ready" : fallbackLeadDetail ? "error" : "idle"
          );
          setLeadDrawerOpen(
            Boolean(requestedLeadId && resolvedLeadDetail && (appSection === "queue" || appSection === "qualified" || appSection === "exports"))
          );
          setActiveProspect(resolvedLeadDetail);
          setScanHistory(
            scanHistoryIsUnavailable ? [] : scansData.scans?.length ? scansData.scans : workspaceData.source === "sample" ? demoScanHistory : []
          );
          setHistoryState(scanHistoryIsUnavailable ? "error" : scansData.source === "sample" ? "sample" : "ready");
          setAnalyticsSummary(analyticsIsUnavailable ? initialAnalyticsSummary : analyticsData);
          setAnalyticsState(analyticsIsUnavailable ? "error" : analyticsData.source === "sample" ? "sample" : "ready");
          setDashboardState(workspaceData.source === "sample" ? "sample" : "ready");
          setDashboardMessage(
            authData.authenticated
              ? workspaceData.warning
                ? translateAppErrorMessage(workspaceData.warning, appUi)
                : routeMessage || (hasPartialWorkspaceDataIssue ? appUi.common.messages.workspaceDataUnavailable : "")
              : appUi.common.messages.demoPreviewIntro
          );

          if (authData.authenticated && loginFlow) {
            void trackEvent({ name: "auth_login_session_opened", metadata: { source: "workspace" } });
          }

          if (authData.authenticated && welcomeFlow) {
            void trackEvent({ name: "workspace_signup_session_opened", metadata: { source: "workspace" } });
          }
        }
      } catch (error) {
        if (!cancelled) {
          setAuth(authData);
          setSnapshot(initialWorkspace);
          setLeads([]);
          setQueueItems([]);
          setScanHistory([]);
          setExportRuns([]);
          setHistoryState("error");
          setAnalyticsSummary(initialAnalyticsSummary);
          setAnalyticsState("error");
          setSelectedLeadId(null);
          setSelectedLead(null);
          setActiveProspect(null);
          setSelectedLeadState("idle");
          setLeadDrawerOpen(false);
          setDashboardState("error");
          setDashboardMessage(resolveAppErrorMessage(error, appUi.common.messages.workspaceDataUnavailable, appUi));
        }
      }
    }

    void loadDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!auth.authenticated) {
      hasAttemptedIntentWorkspaceCreate.current = false;
      return;
    }

    if (dashboardState !== "needs_workspace" || workspaceCreateState !== "idle") {
      return;
    }

    if (!welcomeFlow && !authIntent.hasIntent) {
      return;
    }

    if (hasAttemptedIntentWorkspaceCreate.current) {
      return;
    }

    hasAttemptedIntentWorkspaceCreate.current = true;
    void createWorkspaceAfterLogin();
  }, [auth.authenticated, authIntent, dashboardState, welcomeFlow, workspaceCreateState]);

  useEffect(() => {
    setScanForm((current) =>
      current.url
        ? current
        : {
            ...current,
            url: snapshot.setup.firstProspectUrl || snapshot.setup.agencyWebsite || "",
            companyName: snapshot.setup.firstProspectUrl ? companyNameFromUrl(snapshot.setup.firstProspectUrl) : current.companyName
          }
    );
  }, [snapshot.setup.agencyWebsite, snapshot.setup.firstProspectUrl]);

  useEffect(() => {
    function syncOverviewManualMode() {
      if (typeof window === "undefined") {
        return;
      }
      setOverviewManualModeOpen(window.location.hash === "#scan-console");
    }

    syncOverviewManualMode();
    window.addEventListener("hashchange", syncOverviewManualMode);
    return () => window.removeEventListener("hashchange", syncOverviewManualMode);
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(scanDraftStorageKey(snapshot.workspace.id));
      if (!raw) {
        return;
      }

      const parsed = JSON.parse(raw) as { url?: string; companyName?: string; notes?: string; queueItemId?: string; queueSource?: QueueSource };
      const normalizedUrl = normalizeWebsiteUrl(parsed.url || "");
      if (!normalizedUrl) {
        localStorage.removeItem(scanDraftStorageKey(snapshot.workspace.id));
        return;
      }

      setScanForm({
        url: normalizedUrl,
        companyName: parsed.companyName?.trim() || companyNameFromUrl(normalizedUrl),
        notes: parsed.notes?.trim() || "",
        deepScan: false,
        queueItemId: typeof parsed.queueItemId === "string" && parsed.queueItemId.trim() ? parsed.queueItemId.trim() : null,
        queueSource: isQueueSource(parsed.queueSource) ? parsed.queueSource : null
      });
      localStorage.removeItem(scanDraftStorageKey(snapshot.workspace.id));
      setDashboardMessage(
        formatMessage(appUi.common.messages.scanDeskLoaded, {
          url: formatCompactUrl(normalizedUrl, normalizedUrl)
        })
      );
    } catch {
      // Ignore malformed stored scan drafts.
    }
  }, [appUi, formatMessage, snapshot.workspace.id]);

  useEffect(() => {
    setIcpForm(icpFormFromSetup(snapshot.setup));
    setIcpSaveState("idle");
    setIcpMessage("");
  }, [
    snapshot.setup.agencyFocus,
    snapshot.setup.serviceType,
    snapshot.setup.targetIndustries,
    snapshot.setup.targetCountries,
    snapshot.setup.offerDescription,
    snapshot.setup.tone,
    snapshot.setup.firstProspectUrl
  ]);

  useEffect(() => {
    setProfileForm({
      name: auth.authenticated ? auth.user.name || "" : "",
      workspaceName: snapshot.workspace.name
    });
    setProfileSaveState("idle");
    setProfileMessage("");
  }, [auth.authenticated, auth.authenticated ? auth.user.name : "", snapshot.workspace.name]);

  function openImportFilePicker() {
    importFileInputRef.current?.click();
  }

  function queueWebsiteForScanDesk(target: {
    url: string;
    companyName: string;
    notes?: string;
    queueItemId?: string | null;
    queueSource?: QueueSource | null;
  }) {
    const normalizedUrl = normalizeWebsiteUrl(target.url);
    if (!normalizedUrl) {
      return;
    }

    try {
      localStorage.setItem(
        scanDraftStorageKey(snapshot.workspace.id),
        JSON.stringify({
          url: normalizedUrl,
          companyName: target.companyName || companyNameFromUrl(normalizedUrl),
          notes: target.notes || "",
          queueItemId: target.queueItemId || null,
          queueSource: target.queueSource || null
        })
      );
    } catch {
      // Ignore storage failures and still navigate to the scan desk.
    }

    window.location.assign(queueScanRoute);
  }

  async function addImportedWebsites(rawValue: string, source: BatchSourceOption) {
    const existingDomains = new Set([
      ...importedWebsites.map((item) => item.domain),
      ...leads.map((lead) => lead.domain)
    ]);
    const result = parseImportedWebsiteText(rawValue, source, importNote, existingDomains);

    if (!result.items.length) {
      setImportState("error");
      setImportMessage(appUi.importer.messages.noWebsitesAdded);
      return;
    }

    const payload: QueueImportRequest = {
      items: result.items.map((item) => ({
        url: item.url,
        domain: item.domain,
        companyName: item.companyName,
        source,
        note: item.note
      }))
    };

    try {
      const response = await fetchAppApi("/api/queue/import", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      const queueResult = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        items?: WorkspaceQueueItem[];
        error?: string;
      };

      if (!response.ok || queueResult.ok === false) {
        throw new Error(queueResult.error || appUi.importer.messages.noWebsitesAdded);
      }

      setQueueItems(queueResult.items?.length ? queueResult.items : []);
      setImportState("saved");
      setImportMessage(
        formatMessage(appUi.importer.messages.added, {
          count: result.items.length,
          skipped: result.skipped
        })
      );
      setImportDraft("");
      setDashboardMessage(appUi.importer.messages.queueUpdated);
      void trackEvent({
        name: "workspace_batch_import_added",
        metadata: {
          count: result.items.length,
          source,
          skipped: result.skipped
        }
      });
    } catch (error) {
      setImportState("error");
      setImportMessage(resolveAppErrorMessage(error, appUi.importer.messages.noWebsitesAdded, appUi));
    }
  }

  async function submitImportedWebsites(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setImportState("saving");
    setImportMessage("");
    await addImportedWebsites(importDraft, importSource);
  }

  async function handleImportFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    if (!file) {
      return;
    }

    try {
      const content = await file.text();
      setImportState("saving");
      setImportMessage("");
      await addImportedWebsites(content, importSource === "manual" ? "csv" : importSource);
    } catch {
      setImportState("error");
      setImportMessage(appUi.importer.messages.fileReadFailed);
    } finally {
      event.currentTarget.value = "";
    }
  }

  async function removeImportedWebsite(recordId: string) {
    try {
      const response = await fetchAppApi(`/api/queue/${encodeURIComponent(recordId)}`, {
        method: "DELETE",
        credentials: "include"
      });
      const result = (await response.json().catch(() => ({}))) as { ok?: boolean; archived?: boolean; removed?: boolean; error?: string };

      if (!response.ok || result.ok === false) {
        throw new Error(result.error || appUi.importer.messages.queueUpdated);
      }

      if (result.archived) {
        setQueueItems((current) =>
          current.map((item) => (item.id === recordId ? { ...item, researchStatus: "archived", updatedAt: new Date().toISOString() } : item))
        );
      } else {
        setQueueItems((current) => current.filter((item) => item.id !== recordId));
      }
      setDashboardMessage(appUi.importer.messages.queueUpdated);
    } catch (error) {
      setDashboardMessage(resolveAppErrorMessage(error, appUi.common.messages.workspaceDataUnavailable, appUi));
    }
  }

  function updateScanField<Key extends keyof ScanFormState>(field: Key) {
    return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = field === "deepScan" ? (event.currentTarget as HTMLInputElement).checked : event.currentTarget.value;
      setScanForm((current) => ({ ...current, [field]: value }));

      if (scanState === "error") {
        setScanState("idle");
        setScanMessage("");
      }
    };
  }

  function updateIcpField<Key extends keyof IcpFormState>(field: Key) {
    return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setIcpForm((current) => ({ ...current, [field]: event.currentTarget.value }));

      if (icpSaveState !== "idle") {
        setIcpSaveState("idle");
        setIcpMessage("");
      }
    };
  }

  function updateProfileField<Key extends keyof AccountProfileFormState>(field: Key) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      setProfileForm((current) => ({ ...current, [field]: event.currentTarget.value }));

      if (profileSaveState !== "idle") {
        setProfileSaveState("idle");
        setProfileMessage("");
      }
    };
  }

  function updateAccountPasswordField<Key extends keyof AccountPasswordFormState>(field: Key) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      setAccountPasswordForm((current) => ({ ...current, [field]: event.currentTarget.value }));

      if (accountPasswordState !== "idle") {
        setAccountPasswordState("idle");
        setAccountPasswordMessage("");
      }
    };
  }

  async function submitIcpSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIcpSaveState("saving");
    setIcpMessage("");

    const payload: IcpUpdateRequest = {
      serviceType: serviceTypeForFocus(icpForm.serviceType),
      targetIndustries: parseEditableList(icpForm.targetIndustries, DEFAULT_ICP.targetIndustries),
      targetCountries: parseEditableList(icpForm.targetCountries, DEFAULT_ICP.targetCountries),
      offerDescription: icpForm.offerDescription.trim() || DEFAULT_ICP.offerDescription,
      tone: toneForWorkspace(icpForm.tone),
      firstProspectUrl: icpForm.firstProspectUrl.trim() || null
    };

    try {
      const response = await fetchAppApi("/api/workspace/icp", {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      const result = (await response.json().catch(() => ({}))) as {
        setup?: WorkspaceSnapshot["setup"];
        error?: string;
      };

      if (!response.ok || !result.setup) {
        throw new Error(result.error || "Unable to save ICP settings.");
      }

      setSnapshot((current) => ({
        ...current,
        setup: result.setup!
      }));
      setIcpSaveState("saved");
      setIcpMessage(appUi.icp.messages.saved);
    } catch (error) {
      setIcpSaveState("error");
      setIcpMessage(resolveAppErrorMessage(error, appUi.icp.messages.saveFailed, appUi));
    }
  }

  async function submitProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!auth.authenticated) {
      setProfileSaveState("error");
      setProfileMessage(appUi.account.messages.signInProfile);
      return;
    }

    const payload = {
      name: profileForm.name.trim(),
      workspaceName: profileForm.workspaceName.trim()
    };

    if (!payload.name || !payload.workspaceName) {
      setProfileSaveState("error");
      setProfileMessage(appUi.account.messages.namesRequired);
      return;
    }

    setProfileSaveState("saving");
    setProfileMessage("");

    try {
      const response = await fetchAppApi("/api/account/profile", {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      const result = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        user?: { name: string | null };
        workspace?: { name: string | null };
        error?: string;
      };

      if (!response.ok || !result.ok) {
        throw new Error(result.error || appUi.account.messages.profileSaveFailed);
      }

      setAuth((current) =>
        current.authenticated
          ? {
              ...current,
              user: {
                ...current.user,
                name: result.user?.name ?? payload.name
              },
              workspace: {
                ...current.workspace,
                name: result.workspace?.name ?? payload.workspaceName
              }
            }
          : current
      );
      setSnapshot((current) => ({
        ...current,
        workspace: {
          ...current.workspace,
          name: result.workspace?.name ?? payload.workspaceName
        }
      }));
      setProfileSaveState("saved");
      setProfileMessage(appUi.account.messages.profileSaved);
      void trackEvent({
        name: "account_profile_updated",
        metadata: {
          workspaceNameLength: payload.workspaceName.length
        }
      });
    } catch (error) {
      setProfileSaveState("error");
      setProfileMessage(resolveAppErrorMessage(error, appUi.account.messages.profileSaveFailed, appUi));
    }
  }

  async function submitPasswordChange(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!auth.authenticated) {
      setAccountPasswordState("error");
      setAccountPasswordMessage(appUi.account.messages.signInPassword);
      return;
    }

    if (accountPasswordForm.nextPassword.length < 8) {
      setAccountPasswordState("error");
      setAccountPasswordMessage(appUi.account.messages.passwordMin);
      return;
    }

    if (accountPasswordForm.nextPassword !== accountPasswordForm.confirmPassword) {
      setAccountPasswordState("error");
      setAccountPasswordMessage(appUi.account.messages.passwordMismatch);
      return;
    }

    setAccountPasswordState("saving");
    setAccountPasswordMessage("");

    try {
      const response = await fetchAppApi("/api/auth/password/update", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          currentPassword: accountPasswordForm.currentPassword,
          nextPassword: accountPasswordForm.nextPassword
        })
      });
      const result = (await response.json().catch(() => ({}))) as { ok?: boolean; message?: string; error?: string };

      if (!response.ok || !result.ok) {
        throw new Error(result.error || appUi.account.messages.passwordUpdateFailed);
      }

      setAccountPasswordForm({
        currentPassword: "",
        nextPassword: "",
        confirmPassword: ""
      });
      setAccountPasswordState("saved");
      setAccountPasswordMessage(appUi.account.messages.passwordUpdated);
      void trackEvent({ name: "account_password_updated" });
    } catch (error) {
      setAccountPasswordState("error");
      setAccountPasswordMessage(resolveAppErrorMessage(error, appUi.account.messages.passwordUpdateFailed, appUi));
    }
  }

  async function startPlanCheckout(planId: PricingPlan["id"]) {
    if (!auth.authenticated) {
      window.location.assign(buildLocalePath(locale, "/login"));
      return;
    }

    if (snapshot.plan.id === planId) {
      setDashboardMessage(formatMessage(appUi.common.messages.samePlan, { plan: snapshot.plan.name }));
      return;
    }

    setDashboardMessage("");

    try {
      const response = await fetchAppApi("/api/billing/checkout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          planId
        })
      });
      const result = (await response.json().catch(() => ({}))) as { url?: string; checkoutUrl?: string; error?: string };
      const checkoutUrl = result.url || result.checkoutUrl;

      if (!response.ok || !checkoutUrl) {
        throw new Error(result.error || appUi.common.messages.checkoutUnavailable);
      }

      void trackEvent({
        name: "billing_checkout_started",
        metadata: {
          planId
        }
      });
      window.location.assign(checkoutUrl);
    } catch (error) {
      setDashboardMessage(resolveAppErrorMessage(error, appUi.common.messages.checkoutUnavailable, appUi));
    }
  }

  function applySavedPipelineContext(result: PipelineContextSaveResult) {
    const { context, activity, queueItem } = result;
    const normalized = normalizeProspectMeta(context);

    if (queueItem) {
      mergeQueueItemState(queueItem);
    }

    if (selectedLeadId) {
      setLeads((current) =>
        current.map((lead) => (lead.id === selectedLeadId ? { ...lead, pipelineContext: normalized } : lead))
      );
    }

    setSelectedLead((current) =>
      current
        ? {
            ...current,
            pipelineContext: normalized,
            pipelineActivity: activity ? [activity, ...(current.pipelineActivity || [])].slice(0, 10) : current.pipelineActivity
          }
        : current
    );
    setActiveProspect((current) =>
      current && selectedLead && current.domain === selectedLead.domain
        ? {
            ...current,
            pipelineContext: normalized,
            pipelineActivity: activity ? [activity, ...(current.pipelineActivity || [])].slice(0, 10) : current.pipelineActivity
          }
        : current
    );
  }

  async function openLeadDetail(lead: LeadListItem) {
    setSelectedLeadId(lead.id);
    setSelectedLeadState("loading");
    setLeadDrawerOpen(true);
    setDashboardMessage("");
    replaceLeadDeepLink(lead.id, getProspectTabFromLocation());

    try {
      const response = await fetchAppApi(`/api/leads/${encodeURIComponent(lead.id)}`, {
        credentials: "include"
      });
      const result = (await response.json().catch(() => ({}))) as { lead?: ProspectCardType; error?: string };

      if (!response.ok || !result.lead) {
        throw new Error(result.error || appUi.common.messages.leadDetailUnavailable);
      }

      setSelectedLead(result.lead);
      setActiveProspect(result.lead);
      setSelectedLeadState("ready");
    } catch (error) {
      const fallbackLead = leadPreviewProspect(lead, sampleProspectCard);
      setSelectedLead(fallbackLead);
      setActiveProspect(fallbackLead);
      setSelectedLeadState("error");
      setDashboardMessage(resolveAppErrorMessage(error, appUi.common.messages.leadDetailUnavailable, appUi));
    }
  }

  async function submitScan(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedUrl = normalizeWebsiteUrl(scanForm.url);

    if (!normalizedUrl) {
      setScanState("error");
      setLastScanError({
        ok: false,
        status: "failed",
        reason: "validation_failed",
        error: appUi.common.messages.scanInvalidUrl,
        creditsCharged: 0,
        retryable: false
      });
      setScanMessage(appUi.common.messages.scanInvalidUrl);
      return;
    }

    setScanState("loading");
    setScanMessage("");
    setLastScanError(null);
    setDashboardMessage("");

    const companyName = scanForm.companyName.trim() || companyNameFromUrl(normalizedUrl);
    const domain = hostnameFromUrl(normalizedUrl);
    const scanSeedCopy = scanForm.notes.trim() || snapshot.setup.offerDescription || DEFAULT_ICP.offerDescription;
    const scanPayload: ScanRequest = {
      source: "web",
      locale,
      deepScan: scanForm.deepScan,
      page: {
        url: normalizedUrl,
        title: `${companyName} · ${appUi.scan.prospectWebsite}`,
        metaDescription: scanSeedCopy,
        h1: companyName,
        text: scanSeedCopy,
        links: [normalizedUrl, `${normalizedUrl.replace(/\/$/, "")}/services`, `${normalizedUrl.replace(/\/$/, "")}/contact`]
      },
      icp: {
        serviceType: serviceTypeForFocus(snapshot.setup.agencyFocus || snapshot.setup.serviceType),
        targetIndustries: snapshot.setup.targetIndustries,
        targetCountries: snapshot.setup.targetCountries,
        offerDescription: snapshot.setup.offerDescription,
        tone: toneForWorkspace(snapshot.setup.tone)
      },
      companyName,
      queueNote: scanForm.notes.trim(),
      queueItemId: scanForm.queueItemId || undefined,
      queueSource: scanForm.queueSource || undefined,
      idempotencyKey: `web_scan_${crypto.randomUUID()}`
    };
    let pendingFailure: ScanFailureResponse | null = null;

    try {
      const response = await fetchAppApi("/api/scans", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": scanPayload.idempotencyKey!
        },
        body: JSON.stringify(scanPayload)
      });
      const result = (await response.json().catch(() => ({}))) as Partial<ScanResponse> | ScanFailureResponse;

      if (!response.ok || result.status === "failed" || !("prospect" in result) || !result.prospect || !result.scanId || !result.leadId) {
        const failure =
          result.status === "failed"
            ? result
            : ({
                ok: false,
                status: "failed",
                reason: "generation_failed",
                error: appUi.common.messages.scanFailed,
                creditsCharged: 0,
                retryable: true
              } satisfies ScanFailureResponse);
        pendingFailure = failure;
        setLastScanError(failure);
        throw new Error(failure.error || appUi.common.messages.scanFailed);
      }

      setActiveProspect(result.prospect);
      setSelectedLeadId(result.leadId);
      setSelectedLead(result.prospect);
      setSelectedLeadState("ready");
      setLeadDrawerOpen(true);
      replaceLeadDeepLink(result.leadId, "overview");
      if (result.queueItem) {
        mergeQueueItemState(result.queueItem);
      }
      setLeads((current) => [
        {
          id: result.leadId!,
          companyName: result.prospect!.companyName,
          domain: result.prospect!.domain,
          websiteUrl: result.prospect!.website,
          industry: result.prospect!.industry,
          fitScore: result.prospect!.fitScore,
          confidenceScore: result.prospect!.confidenceScore,
          pipelineContext: normalizeProspectMeta(result.prospect!.pipelineContext),
          createdAt: new Date().toISOString()
        },
        ...current.filter((lead) => lead.id !== result.leadId)
      ]);
      setScanHistory((current) => [
        ({
          id: result.scanId!,
          url: result.prospect!.website,
          domain: result.prospect!.domain,
          scanType: scanForm.deepScan ? "deep" : "basic",
          status: result.replayed ? "replayed" : "completed",
          reason: result.replayed ? "replayed" : null,
          creditsUsed: scanForm.deepScan ? 3 : 1,
          creditsCharged: result.creditsCharged || 0,
          leadId: result.leadId!,
          companyName: result.prospect!.companyName,
          idempotencyKey: result.idempotencyKey,
          replayed: Boolean(result.replayed),
          createdAt: new Date().toISOString(),
          completedAt: new Date().toISOString()
        } satisfies ScanHistoryItem),
        ...current
      ].slice(0, 100));
      setHistoryState("ready");
      setHistoryFilter("all");
      setExpandedScanId(result.scanId!);
      setScanForm((current) => ({
        ...current,
        queueItemId: result.queueItem?.id || null,
        queueSource: result.queueItem?.source || null
      }));
      setSnapshot((current) => ({
        ...current,
        leadCount: Math.max(current.leadCount + 1, leads.length + 1),
        credits: {
          ...current.credits,
          used: current.credits.used + (result.creditsCharged || 0),
          remaining: Math.max(0, current.credits.remaining - (result.creditsCharged || 0))
        }
      }));
      setScanState("done");
      void trackEvent({
        name: "scan_completed",
        metadata: {
          deepScan: scanForm.deepScan,
          creditsCharged: result.creditsCharged || 0,
          replayed: Boolean(result.replayed)
        }
      });
      setScanMessage(
        formatMessage(appUi.common.messages.scanSaved, {
          company: result.prospect.companyName,
          count: result.creditsCharged ?? 0
        })
      );
      setDashboardMessage(appUi.common.messages.scanComplete);
    } catch (error) {
      const failedHistoryId = `failed_${Date.now()}`;
      setScanState("error");
      setScanHistory((current) => [
        ({
          id: failedHistoryId,
          url: normalizedUrl,
          domain,
          scanType: scanForm.deepScan ? "deep" : "basic",
          status: "failed",
          reason: pendingFailure?.reason || "generation_failed",
          creditsUsed: 0,
          creditsCharged: 0,
          leadId: null,
          companyName,
          idempotencyKey: scanPayload.idempotencyKey,
          replayed: false,
          createdAt: new Date().toISOString(),
          completedAt: new Date().toISOString()
        } satisfies ScanHistoryItem),
        ...current
      ].slice(0, 100));
      setHistoryFilter("all");
      setExpandedScanId(failedHistoryId);
      void trackEvent({
        name: "scan_failed",
        metadata: {
          deepScan: scanForm.deepScan,
          reason: pendingFailure?.reason || "generation_failed"
        }
      });
      setScanMessage(resolveAppErrorMessage(error, appUi.common.messages.scanFailed, appUi));
    }
  }

  async function completeOnboarding() {
    setOnboardingState("saving");

    try {
      const response = await fetchAppApi("/api/workspace/onboarding/complete", {
        method: "POST",
        credentials: "include"
      });
      const result = (await response.json().catch(() => ({}))) as { completedAt?: string; error?: string };

      if (!response.ok) {
        throw new Error(result.error || appUi.common.messages.onboardingUpdateFailed);
      }

      setSnapshot((current) => ({
        ...current,
        onboarding: {
          isComplete: true,
          completedAt: result.completedAt || new Date().toISOString()
        }
      }));
      void trackEvent({ name: "workspace_onboarding_completed" });
      setDashboardMessage(appUi.common.messages.onboardingDismissed);
    } catch (error) {
      setDashboardMessage(resolveAppErrorMessage(error, appUi.common.messages.onboardingUpdateFailed, appUi));
    } finally {
      setOnboardingState("idle");
    }
  }

  async function downloadCsv() {
    setDashboardMessage("");

    try {
      const payload: ExportRequest = {
        preset: bulkExportPreset,
        crmMode: bulkCrmFieldMode,
        scope: "all_qualified"
      };
      const response = await fetchAppApi("/api/exports", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(appUi.common.messages.csvExportFailed);
      }

      const blob = await response.blob();
      const contentDisposition = response.headers.get("Content-Disposition");
      const fileName = contentDisposition?.match(/filename=([^;]+)/i)?.[1]?.replace(/^["']|["']$/g, "") || "leadcue-export.csv";
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setActiveProspect((current) => (current ? { ...current, exportStatus: "exported" } : current));
      setSelectedLead((current) => (current ? { ...current, exportStatus: "exported" } : current));
      await refreshWorkflowData();
      void trackEvent({
        name: "export_completed",
        metadata: {
          preset: bulkExportPreset,
          crmMode: bulkCrmFieldMode,
          scope: "all_qualified"
        }
      });
      setDashboardMessage(
        formatMessage(appUi.common.messages.csvExportPrepared, {
          label: bulkExportLabel(bulkExportPreset, bulkCrmFieldMode, appUi)
        })
      );
    } catch (error) {
      setDashboardMessage(resolveAppErrorMessage(error, appUi.common.messages.csvExportFailed, appUi));
    }
  }

  async function openBillingPortal() {
    setDashboardMessage("");

    try {
      const response = await fetchAppApi("/api/billing/portal", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      });
      const result = (await response.json().catch(() => ({}))) as { url?: string; error?: string };

      if (!response.ok || !result.url) {
        throw new Error(result.error || "Billing portal is not available yet.");
      }

      void trackEvent({
        name: "billing_portal_opened",
        metadata: {
          planId: snapshot.plan.id
        }
      });
      window.location.assign(result.url);
    } catch (error) {
      setDashboardMessage(resolveAppErrorMessage(error, appUi.common.messages.billingPortalUnavailable, appUi));
    }
  }

  async function signOut() {
    void trackEvent({ name: "auth_sign_out" });
    await fetchAppApi("/api/auth/logout", { method: "POST", credentials: "include" }).catch(() => null);
    setAuth({ authenticated: false });
    setDashboardState("sample");
    setSnapshot(sampleWorkspace);
    setLeads(demoLeadRows);
    setQueueItems([]);
    setScanHistory(demoScanHistory);
    setExportRuns([]);
    setHistoryState("sample");
    setAnalyticsSummary(sampleAnalyticsSummary);
    setAnalyticsState("sample");
    setHistoryDateFilter("all");
    setHistoryReasonFilter("all");
    setSelectedLeadIds([]);
    setSelectedLeadId(demoLeadRows[0]?.id || null);
    setSelectedLead(sampleDashboardProspect);
    setActiveProspect(sampleDashboardProspect);
    setSelectedLeadState("ready");
    setLeadDrawerOpen(false);
    setProfileSaveState("idle");
    setProfileMessage("");
    setAccountPasswordState("idle");
    setAccountPasswordMessage("");
    setAccountPasswordForm({
      currentPassword: "",
      nextPassword: "",
      confirmPassword: ""
    });
    setDashboardMessage(appUi.common.messages.signedOutDemo);
  }

  async function createWorkspaceAfterLogin() {
    if (!auth.authenticated) {
      setDashboardMessage(appUi.common.messages.signInRequired);
      return;
    }

    setWorkspaceCreateState("loading");
    setWorkspaceCreateMessage("");
    setDashboardMessage("");

    try {
      const response = await fetchAppApi("/api/workspace/create", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          planId: snapshot.plan.id,
          workspaceName: snapshot.workspace.name || siteUi.common.brand,
          agencyFocus: snapshot.setup.agencyFocus || snapshot.setup.serviceType,
          offerDescription: snapshot.setup.offerDescription || DEFAULT_ICP.offerDescription,
          targetIndustries: snapshot.setup.targetIndustries.length
            ? snapshot.setup.targetIndustries.join(", ")
            : DEFAULT_ICP.targetIndustries.join(", "),
          firstProspectUrl: snapshot.setup.firstProspectUrl
        })
      });
      const result = (await response.json().catch(() => ({}))) as WorkspaceCreateResponse;

      if (!response.ok || !result.ok) {
        throw new Error(result.error || appUi.common.messages.workspaceCreateFailed);
      }

      if (result.checkoutUrl) {
        window.location.assign(result.checkoutUrl);
        return;
      }

      if (!result.snapshot) {
        window.location.assign(buildAuthAppPath(locale, authIntent, "welcome"));
        return;
      }

      setSnapshot(result.snapshot);
      setAuth((current) =>
        current.authenticated
          ? {
              ...current,
              workspace: {
                id: result.snapshot!.workspace.id,
                name: result.snapshot!.workspace.name
              }
            }
          : current
      );
      setWorkspaceCreateState("idle");
      setDashboardState("ready");
      setDashboardMessage(appUi.common.messages.workspaceCreatedSetup);
      void trackEvent({ name: "workspace_created_in_app", metadata: { planId: snapshot.plan.id } });
    } catch (error) {
      setWorkspaceCreateState("error");
      setWorkspaceCreateMessage(resolveAppErrorMessage(error, appUi.common.messages.workspaceCreateFailed, appUi));
    }
  }

  function resetLeadControls() {
    setLeadSearch("");
    setLeadSort("newest");
    setLeadMinFit(0);
    setLeadMinConfidence(0);
  }

  function toggleLeadSelection(leadId: string) {
    setSelectedLeadIds((current) =>
      current.includes(leadId) ? current.filter((id) => id !== leadId) : [...current, leadId]
    );
  }

  function toggleAllVisibleLeads() {
    const visibleIds = visibleLeads.map((lead) => lead.id);
    if (!visibleIds.length) {
      return;
    }

    setSelectedLeadIds((current) => {
      const visibleSet = new Set(visibleIds);
      const allVisibleSelected = visibleIds.every((id) => current.includes(id));

      if (allVisibleSelected) {
        return current.filter((id) => !visibleSet.has(id));
      }

      return [...new Set([...current, ...visibleIds])];
    });
  }

  function clearLeadSelection() {
    setSelectedLeadIds([]);
  }

  async function exportSelectedLeads() {
    const selectedRows = sourceLeads.filter((lead) => selectedLeadIds.includes(lead.id));
    if (!selectedRows.length) {
      setDashboardMessage(appUi.common.messages.selectLeadBeforeExport);
      return;
    }

    setBulkExportState("loading");

    try {
      const payload: ExportRequest = {
        preset: bulkExportPreset,
        crmMode: bulkCrmFieldMode,
        scope: "selected",
        leadIds: selectedRows.map((lead) => lead.id)
      };
      const response = await fetchAppApi("/api/exports", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(appUi.common.messages.selectedLeadExportFailed);
      }

      const blob = await response.blob();
      const contentDisposition = response.headers.get("Content-Disposition");
      const fileName = contentDisposition?.match(/filename=([^;]+)/i)?.[1]?.replace(/^["']|["']$/g, "") || "leadcue-export.csv";
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      await refreshWorkflowData();
      setActiveProspect((current) =>
        current && selectedRows.some((lead) => lead.id === selectedLeadId) ? { ...current, exportStatus: "exported" } : current
      );
      setSelectedLead((current) =>
        current && selectedRows.some((lead) => lead.id === selectedLeadId) ? { ...current, exportStatus: "exported" } : current
      );
      setBulkExportState("idle");
      setDashboardMessage(
        formatMessage(appUi.common.messages.selectedLeadExported, {
          count: selectedRows.length,
          label: bulkExportLabel(bulkExportPreset, bulkCrmFieldMode, appUi)
        })
      );
      void trackEvent({
        name: "export_completed",
        metadata: {
          preset: bulkExportPreset,
          crmMode: bulkCrmFieldMode,
          scope: "selected",
          count: selectedRows.length
        }
      });
    } catch (error) {
      setBulkExportState("error");
      setDashboardMessage(resolveAppErrorMessage(error, appUi.common.messages.selectedLeadExportFailed, appUi));
    }
  }

  function resetHistorySecondaryFilters() {
    setHistoryDateFilter("all");
    setHistoryReasonFilter("all");
    setExpandedScanId(null);
  }

  const isSampleDashboard = dashboardState === "sample";
  const workspaceLeads = leads.length ? leads : isSampleDashboard ? demoLeadRows : [];
  const leadByDomain = useMemo(() => new Map(workspaceLeads.map((lead) => [lead.domain, lead] as const)), [workspaceLeads]);
  const workflowQueueItems = useMemo(
    () => queueItems.filter((item) => queueItemResearchStatus(item) !== "archived"),
    [queueItems]
  );
  const queueItemByLeadId = useMemo(
    () => new Map(queueItems.filter((item) => item.leadId).map((item) => [item.leadId!, item] as const)),
    [queueItems]
  );
  const queueItemByDomain = useMemo(() => new Map(queueItems.map((item) => [item.domain, item] as const)), [queueItems]);
  const importedWebsites = useMemo(
    () => workflowQueueItems.filter((item) => item.source !== "workspace").map(queueItemToImportedWebsiteRecord),
    [workflowQueueItems]
  );
  const importedQueueRows = useMemo<ReviewQueueRow[]>(
    () =>
      workflowQueueItems.map((item) => {
        const matchedLead = leadByDomain.get(item.domain);

        return {
          id: item.id,
          kind: item.source === "workspace" ? "lead" : "import",
          companyName: matchedLead?.companyName || item.companyName,
          domain: item.domain,
          websiteUrl: matchedLead?.websiteUrl || item.websiteUrl,
          source: item.source,
          status: queueItemReviewStatus(queueItemResearchStatus(item)),
          fitScore: matchedLead?.fitScore ?? null,
          confidencePercent: matchedLead ? Math.round(matchedLead.confidenceScore * 100) : null,
          leadId: item.leadId || matchedLead?.id || null,
          note: item.note,
          createdAt: item.createdAt
        };
      }),
    [leadByDomain, workflowQueueItems]
  );
  const savedSourceLeads = useMemo(
    () =>
      workspaceLeads.filter((lead) => {
        const queueItem = queueItemByLeadId.get(lead.id) || queueItemByDomain.get(lead.domain);
        return queueItemResearchStatus(queueItem) === "qualified";
      }),
    [queueItemByDomain, queueItemByLeadId, workspaceLeads]
  );
  const sourceLeads = savedSourceLeads;
  const reviewQueueRows = useMemo(
    () =>
      importedQueueRows
        .filter((row) => row.status === "ready" || row.status === "researching")
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [importedQueueRows]
  );
  const visibleReviewRows = useMemo(() => {
    const query = reviewSearch.trim().toLowerCase();
    return reviewQueueRows.filter((row) => {
      const haystack = [row.companyName, row.domain, row.websiteUrl, row.note].join(" ").toLowerCase();
      const statusMatches = reviewFilter === "all" || row.status === reviewFilter;
      const sourceMatches =
        reviewSourceFilter === "all" ||
        (reviewSourceFilter === "import" ? row.kind === "import" : row.kind === "lead");
      return (!query || haystack.includes(query)) && statusMatches && sourceMatches;
    });
  }, [reviewFilter, reviewQueueRows, reviewSearch, reviewSourceFilter]);
  const visibleLeads = useMemo(() => {
    const query = leadSearch.trim().toLowerCase();
    const filtered = sourceLeads.filter((lead) => {
      const confidencePercent = Math.round(lead.confidenceScore * 100);
      const haystack = [lead.companyName, lead.domain, lead.websiteUrl, lead.industry].join(" ").toLowerCase();
      return (
        (!query || haystack.includes(query)) &&
        lead.fitScore >= leadMinFit &&
        confidencePercent >= leadMinConfidence
      );
    });

    return [...filtered].sort((a, b) => {
      if (leadSort === "fit_desc") {
        return b.fitScore - a.fitScore || b.confidenceScore - a.confidenceScore;
      }

      if (leadSort === "confidence_desc") {
        return b.confidenceScore - a.confidenceScore || b.fitScore - a.fitScore;
      }

      if (leadSort === "company_asc") {
        return a.companyName.localeCompare(b.companyName);
      }

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [leadMinConfidence, leadMinFit, leadSearch, leadSort, sourceLeads]);
  const leadFiltersActive =
    Boolean(leadSearch.trim()) || leadSort !== "newest" || leadMinFit > 0 || leadMinConfidence > 0;
  const reviewFiltersActive = Boolean(reviewSearch.trim()) || reviewFilter !== "all" || reviewSourceFilter !== "all";
  const selectedSourceLeads = useMemo(
    () => sourceLeads.filter((lead) => selectedLeadIds.includes(lead.id)),
    [selectedLeadIds, sourceLeads]
  );
  const allVisibleLeadsSelected =
    visibleLeads.length > 0 && visibleLeads.every((lead) => selectedLeadIds.includes(lead.id));
  const someVisibleLeadsSelected = visibleLeads.some((lead) => selectedLeadIds.includes(lead.id));
  const historyCounts = useMemo(
    () =>
      scanHistory.reduce<Record<ScanHistoryFilter, number>>(
        (counts, scan) => {
          counts.all += 1;
          counts[scan.status] += 1;
          return counts;
        },
        { all: 0, completed: 0, failed: 0, replayed: 0, processing: 0 }
    ),
    [scanHistory]
  );
  const failureReasonCounts = useMemo(
    () =>
      scanHistory
        .filter((scan) => scan.status === "failed")
        .reduce<Record<string, number>>((counts, scan) => {
          const reason = formatHistoryReason(scan.reason || "generation_failed", appUi);
          counts[reason] = (counts[reason] ?? 0) + 1;
          return counts;
        }, {}),
    [scanHistory]
  );
  const failureReasonEntries = Object.entries(failureReasonCounts).sort((a, b) => b[1] - a[1]);
  const filteredScanHistory = useMemo(
    () => {
      const now = Date.now();
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return scanHistory.filter((scan) => {
        const createdAt = new Date(scan.createdAt).getTime();
        const dateMatches =
          historyDateFilter === "all" ||
          (historyDateFilter === "today" && createdAt >= today.getTime()) ||
          (historyDateFilter === "7d" && createdAt >= now - 7 * 24 * 60 * 60 * 1000) ||
          (historyDateFilter === "30d" && createdAt >= now - 30 * 24 * 60 * 60 * 1000);
        const statusMatches = historyFilter === "all" || scan.status === historyFilter;
        const reasonMatches =
          historyReasonFilter === "all" ||
          (scan.status === "failed" && formatHistoryReason(scan.reason || "generation_failed", appUi) === historyReasonFilter);

        return dateMatches && statusMatches && reasonMatches;
      });
    },
    [historyDateFilter, historyFilter, historyReasonFilter, scanHistory]
  );
  const historySecondaryFiltersActive = historyDateFilter !== "all" || historyReasonFilter !== "all";
  const onboardingTasks = [
    {
      label: appUi.dashboard.onboarding.tasks.profileSaved,
      description: snapshot.setup.offerDescription
        ? formatMessage(appUi.dashboard.onboarding.descriptions.profileSaved, {
            industries: previewList(snapshot.setup.targetIndustries, 3, appUi.common.notSet)
          })
        : appUi.dashboard.onboarding.descriptions.profileTodo,
      done: Boolean(snapshot.setup.offerDescription.trim() && snapshot.setup.targetIndustries.length)
    },
    {
      label: appUi.dashboard.onboarding.tasks.firstWebsiteQueued,
      description: snapshot.setup.firstProspectUrl
        ? formatMessage(appUi.dashboard.onboarding.descriptions.websiteQueued, {
            url: formatCompactUrl(snapshot.setup.firstProspectUrl, appUi.common.notSet)
          })
        : snapshot.setup.agencyWebsite
          ? formatMessage(appUi.dashboard.onboarding.descriptions.agencySaved, {
              url: formatCompactUrl(snapshot.setup.agencyWebsite, appUi.common.notSet)
            })
          : appUi.dashboard.onboarding.descriptions.websiteTodo,
      done: Boolean(snapshot.setup.firstProspectUrl)
    },
    {
      label: appUi.dashboard.onboarding.tasks.firstProspectCard,
      description: snapshot.leadCount
        ? formatMessage(appUi.dashboard.onboarding.descriptions.firstCardDone, {
            count: snapshot.leadCount
          })
        : appUi.dashboard.onboarding.descriptions.firstCardTodo,
      done: snapshot.leadCount > 0
    }
  ];
  const onboardingProgress = onboardingTasks.filter((task) => task.done).length;
  const welcomeName = auth.authenticated ? firstName(auth.user.name) || snapshot.workspace.name : snapshot.workspace.name;
  const subscriptionStatusDetails = getSubscriptionStatusDetails(snapshot.subscription.status, appUi);
  const subscriptionStatusLabel = formatSubscriptionStatus(snapshot.subscription.status, appUi);
  const currentPlanIndex = Math.max(
    0,
    PRICING_PLANS.findIndex((plan) => plan.id === snapshot.plan.id)
  );
  const currentPlan = PRICING_PLANS[currentPlanIndex] ?? PRICING_PLANS[0];
  const featuredPlan =
    currentPlanIndex >= PRICING_PLANS.length - 1 ? currentPlan : PRICING_PLANS[currentPlanIndex + 1] ?? currentPlan;
  const totalMonthlyCredits = Math.max(1, snapshot.credits.used + snapshot.credits.remaining);
  const creditUsagePercent = Math.min(100, Math.round((snapshot.credits.used / totalMonthlyCredits) * 100));
  const billingPeriodEndLabel = snapshot.subscription.currentPeriodEnd
    ? formatCalendarDate(snapshot.subscription.currentPeriodEnd)
    : appUi.billing.kpis.noPaidCycle;
  const workspaceStatusLabel = auth.authenticated ? appUi.billing.status.authenticated : appUi.billing.status.demoPreview;
  const featuredPlanIsCurrent = featuredPlan.id === currentPlan.id;
  const featuredPlanDelta = Math.max(0, featuredPlan.monthlyCredits - currentPlan.monthlyCredits);
  const billingSummaryCards = [
    [appUi.billing.summary.currentPlan, currentPlan.name],
    [appUi.billing.summary.scansLeft, snapshot.credits.remaining.toLocaleString()],
    [appUi.billing.summary.resetDate, formatCalendarDate(snapshot.credits.reset)],
    [appUi.billing.summary.workspaceStatus, workspaceStatusLabel]
  ] as const;
  const shouldShowOnboarding =
    auth.authenticated &&
    dashboardState === "ready" &&
    !snapshot.onboarding.isComplete &&
    snapshot.leadCount === 0;
  const dashboardTitle = auth.authenticated && appSection === "dashboard" ? snapshot.workspace.name : pageCopy.title;
  const dashboardIntro = pageCopy.copy;
  const needsIcpReview = shouldShowOnboarding && (!onboardingTasks[0].done || !onboardingTasks[1].done);
  const reviewReadyCount = reviewQueueRows.filter((row) => row.status === "ready").length;
  const reviewResearchingCount = reviewQueueRows.filter((row) => row.status === "researching").length;
  const exportRunCount = exportRuns.length;
  const topSavedAccounts = useMemo(
    () =>
      [...savedSourceLeads]
        .sort((a, b) => b.fitScore - a.fitScore || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5),
    [savedSourceLeads]
  );
  const workflowStageCounts = useMemo(
    () =>
      queueItems.reduce<Record<ProspectPipelineStage, number>>(
        (counts, lead) => {
          const researchStatus = queueItemResearchStatus(lead);
          const handoffStatus = queueItemHandoffStatus(lead);

          if (researchStatus === "archived") {
            counts.archived += 1;
            return counts;
          }

          if (researchStatus !== "qualified") {
            counts.researching += 1;
            return counts;
          }

          if (handoffStatus === "won") {
            counts.won += 1;
          } else if (handoffStatus === "contacted") {
            counts.contacted += 1;
          } else if (handoffStatus === "outreach_queued") {
            counts.outreach_queued += 1;
          } else {
            counts.qualified += 1;
          }
          return counts;
        },
        {
          researching: 0,
          qualified: 0,
          outreach_queued: 0,
          contacted: 0,
          won: 0,
          archived: 0
        }
      ),
    [queueItems]
  );
  const queueSourceCounts = useMemo(
    () =>
      importedWebsites.reduce<Record<BatchSourceOption, number>>(
        (counts, item) => {
          counts[item.source] += 1;
          return counts;
        },
        {
          manual: 0,
          csv: 0,
          apollo: 0,
          clay: 0,
          directory: 0
        }
      ),
    [importedWebsites]
  );
  const workflowRecommendations = useMemo(() => {
    const items: string[] = [];

    if (reviewReadyCount > reviewResearchingCount) {
      items.push(appUi.analytics.recommendations.reviewBacklog);
    }
    if (reviewResearchingCount > savedSourceLeads.length) {
      items.push(appUi.analytics.recommendations.qualificationGap);
    }
    if (savedSourceLeads.length > 0 && analyticsSummary.totals.exportsCompleted < savedSourceLeads.length) {
      items.push(appUi.analytics.recommendations.exportGap);
    }

    return items.length ? items : [appUi.analytics.recommendations.keepMoving];
  }, [analyticsSummary.totals.exportsCompleted, appUi.analytics.recommendations, reviewReadyCount, reviewResearchingCount, savedSourceLeads.length]);
  const qualifiedCount = savedSourceLeads.length;
  const overviewHasQueueData = reviewQueueRows.length > 0;
  const reviewQueueIsEmpty = reviewQueueRows.length === 0;
  const showReviewQueueEmptyState = reviewQueueIsEmpty && !reviewFiltersActive;
  const savedAccountsIsEmpty = sourceLeads.length === 0;
  const showSavedAccountsEmptyState = savedAccountsIsEmpty && !leadFiltersActive;
  const importHistoryIsEmpty = importedQueueRows.length === 0;
  const overviewHasSavedData =
    topSavedAccounts.length > 0 ||
    workflowStageCounts.qualified > 0 ||
    workflowStageCounts.outreach_queued > 0 ||
    analyticsSummary.totals.exportsCompleted > 0;
  const overviewHasWorkflowData = overviewHasQueueData || overviewHasSavedData;
  const analyticsHasWorkflowData =
    importedWebsites.length > 0 ||
    reviewQueueRows.length > 0 ||
    qualifiedCount > 0 ||
    exportRunCount > 0 ||
    failureReasonEntries.length > 0 ||
    scanHistory.length > 0 ||
    (auth.authenticated &&
      (analyticsSummary.totals.exportsCompleted > 0 || analyticsSummary.recentEvents.length > 0));
  const workspaceStateBlocked = dashboardState === "error" || dashboardState === "needs_workspace";
  const isDemoPreviewWorkspace = !auth.authenticated && (dashboardState === "ready" || dashboardState === "sample");
  const showsFormalWorkspaceState = workspaceStateBlocked;
  const overviewPrimaryAction =
    dashboardState === "needs_workspace"
      ? {
          kind: "create" as const,
          icon: "database" as const,
          label: appUi.dashboard.nextAction.createWorkspace
        }
      : workspaceStateBlocked && dashboardState === "error"
      ? {
          kind: "refresh" as const,
          icon: "browser" as const,
          label: appUi.dashboard.nextAction.retryWorkspace
        }
      : workspaceStateBlocked && dashboardState === "sample"
        ? {
            kind: "link" as const,
            href: buildLocalePath(locale, "/login"),
            icon: "mail" as const,
            label: appUi.actions.signIn
          }
        : !auth.authenticated
          ? {
              kind: "link" as const,
              href: buildLocalePath(locale, "/login"),
              icon: "mail" as const,
              label: appUi.dashboard.nextAction.startWorkspace
            }
          : needsIcpReview
            ? {
                kind: "link" as const,
                href: `${appRoutes.settings}#settings-icp`,
                icon: "target" as const,
                label: appUi.dashboard.onboarding.reviewIcp
              }
            : overviewHasQueueData
              ? {
                  kind: "link" as const,
                  href: appRoutes.queue,
                  icon: "filter" as const,
                  label: appUi.dashboard.nextAction.openQueue
                }
              : {
                  kind: "link" as const,
                  href: appRoutes.queue,
                  icon: "database" as const,
                  label: appUi.dashboard.nextAction.importWebsites
                };
  const overviewSecondaryAction =
    dashboardState === "needs_workspace"
      ? {
          href: buildLocalePath(locale, "/login"),
          icon: "mail" as const,
          label: appUi.actions.signIn
        }
      : dashboardState === "error"
      ? {
          href: buildLocalePath(locale, "/login"),
          icon: "mail" as const,
          label: appUi.actions.signIn
        }
      : dashboardState === "sample"
        ? {
            href: buildLocalePath(locale, "/login"),
            icon: "mail" as const,
            label: appUi.dashboard.nextAction.startWorkspace
          }
        : {
            href: queueScanRoute,
            icon: "scan" as const,
            label: appUi.dashboard.nextAction.manualScan
          };
  const pagePrimaryAction =
    appSection === "dashboard"
      ? null
      : workspaceStateBlocked
        ? dashboardState === "needs_workspace"
          ? {
              kind: "button" as const,
              icon: "database" as const,
              label: appUi.dashboard.nextAction.createWorkspace,
              onClick: () => {
                void createWorkspaceAfterLogin();
              }
            }
          : dashboardState === "error"
          ? {
              kind: "button" as const,
              icon: "browser" as const,
              label: appUi.dashboard.nextAction.retryWorkspace,
              onClick: () => window.location.reload()
            }
          : {
              kind: "link" as const,
              href: buildLocalePath(locale, "/login"),
              icon: "mail" as const,
              label: appUi.actions.signIn
            }
        : isQueueSection
          ? {
              kind: "button" as const,
              icon: "download" as const,
              label: appUi.importer.upload,
              onClick: openImportFilePicker
            }
          : isQualifiedSection
            ? {
                kind: savedAccountsIsEmpty ? ("link" as const) : ("link" as const),
                href: savedAccountsIsEmpty ? appRoutes.queue : appRoutes.exports,
                icon: savedAccountsIsEmpty ? ("filter" as const) : ("download" as const),
                label: savedAccountsIsEmpty ? appUi.dashboard.nextAction.openQueue : appUi.actions.exportCsv
              }
            : isExportsSection
              ? qualifiedCount === 0
                ? {
                    kind: "link" as const,
                    href: appRoutes.queue,
                    icon: "filter" as const,
                    label: appUi.dashboard.nextAction.openQueue
                  }
                : {
                    kind: "button" as const,
                    icon: "download" as const,
                    label: appUi.actions.exportCsv,
                    onClick: downloadCsv
                  }
              : isSettingsSection
                ? auth.authenticated
                  ? {
                      kind: "button" as const,
                      icon: "shield" as const,
                      label: appUi.billing.actions.manageBilling,
                      onClick: () => {
                        void openBillingPortal();
                      }
                    }
                  : null
                : overviewHasQueueData
                  ? {
                      kind: "link" as const,
                      href: appRoutes.queue,
                      icon: "filter" as const,
                      label: appUi.dashboard.nextAction.openQueue
                    }
                  : {
                      kind: "link" as const,
                      href: appRoutes.queue,
                      icon: "database" as const,
                      label: appUi.dashboard.nextAction.importWebsites
                    };
  const overviewShowsStatePanel = appSection === "dashboard" && showsFormalWorkspaceState;
  const pageShowsWorkspaceStatePanel = appSection !== "dashboard" && showsFormalWorkspaceState;
  const defaultDashboardStateMessage =
    dashboardState === "loading"
      ? appUi.status.loading
      : dashboardState === "needs_workspace"
        ? appUi.common.messages.createWorkspaceRequired
      : dashboardState === "error"
        ? appUi.common.messages.workspaceDataUnavailable
        : "";
  const workspaceAlertMessage =
    dashboardState === "loading"
      ? appUi.status.loading
      : showsFormalWorkspaceState &&
          (dashboardMessage === defaultDashboardStateMessage ||
            dashboardMessage === "")
        ? ""
        : isDemoPreviewWorkspace &&
            (dashboardMessage === appUi.common.messages.demoPreviewIntro ||
              dashboardMessage === "")
          ? ""
          : dashboardMessage;
  const workspaceStatePanel = showsFormalWorkspaceState ? (
    <section
      className={`panel overview-state-panel ${dashboardState === "needs_workspace" ? "is-setup" : "is-error"}`}
      aria-labelledby="overview-state-title"
    >
      <div className="overview-state-copy">
        <span className="status-pill">
          {dashboardState === "needs_workspace" ? appUi.dashboard.nextAction.setupRequired : appUi.common.failed}
        </span>
        <h2 id="overview-state-title">
          {dashboardState === "needs_workspace" ? appUi.dashboard.nextAction.createWorkspaceTitle : appUi.dashboard.nextAction.loadErrorTitle}
        </h2>
        <p>
          {dashboardState === "needs_workspace" ? appUi.dashboard.nextAction.createWorkspaceCopy : appUi.dashboard.nextAction.loadErrorCopy}
        </p>
        {dashboardState === "needs_workspace" ? (
          <>
            <button
              className="button button-primary"
              type="button"
              onClick={() => void createWorkspaceAfterLogin()}
              disabled={workspaceCreateState === "loading"}
            >
              <Icon name="database" />
              {workspaceCreateState === "loading" ? appUi.common.saving : appUi.dashboard.nextAction.createWorkspace}
            </button>
            <p className={`form-status ${workspaceCreateState === "error" ? "is-error" : ""}`} role="status">
              {workspaceCreateMessage || " "}
            </p>
          </>
        ) : null}
      </div>
    </section>
  ) : null;
  const accountShowsWorkspaceAlertPanel = appSection === "settings" && auth.authenticated && dashboardState === "error";
  const accountSectionCopy = {
    alert: {
      eyebrow: appUi.common.failed,
      title: appUi.common.messages.workspaceDataUnavailable,
      note: appUi.dashboard.nextAction.sampleCopy
    },
    utility: {
      eyebrow: appUi.account.summary.eyebrow,
      title: appUi.account.summary.title,
      copy: appUi.pages.settings.copy
    }
  };
  const workflowExportedCount = auth.authenticated || qualifiedCount > 0 ? analyticsSummary.totals.exportsCompleted : 0;
  const workflowFunnelSteps = [
    [appUi.analytics.workflowFunnel.imported, importedWebsites.length, appUi.analytics.workflowFunnel.importedMeta],
    [
      appUi.analytics.workflowFunnel.reviewing,
      reviewResearchingCount,
      formatMessage(appUi.analytics.workflowFunnel.reviewingMeta, {
        percent: percentage(reviewResearchingCount, Math.max(1, importedWebsites.length))
      })
    ],
    [
      appUi.analytics.workflowFunnel.qualified,
      qualifiedCount,
      formatMessage(appUi.analytics.workflowFunnel.qualifiedMeta, {
        percent: percentage(qualifiedCount, Math.max(1, reviewResearchingCount || importedWebsites.length))
      })
    ],
    [
      appUi.analytics.workflowFunnel.exported,
      workflowExportedCount,
      formatMessage(appUi.analytics.workflowFunnel.exportedMeta, {
        percent: percentage(workflowExportedCount, Math.max(1, qualifiedCount))
      })
    ]
  ] as const;
  const scanOutcomeCards = [
    [appUi.analytics.scanOutcomes.completed, historyCounts.completed + historyCounts.replayed],
    [appUi.analytics.scanOutcomes.failed, historyCounts.failed],
    [appUi.analytics.scanOutcomes.processing, historyCounts.processing]
  ] as const;
  const hasActivePreview = Boolean(activeProspect && (workspaceLeads.length > 0 || isSampleDashboard || scanState === "done"));
  const scanWorkspacePanel = overviewManualModeOpen ? (
    <section className={`panel scan-console ${scanState === "loading" ? "is-loading" : ""}`} id="scan-console" aria-labelledby="scan-console-title">
      <div className="scan-console-head">
        <div className="scan-console-copy">
          <p className="eyebrow">{appUi.scan.eyebrow}</p>
          <h2 id="scan-console-title">{appUi.scan.title}</h2>
          <p>{appUi.scan.copy}</p>
        </div>
        <div className="scan-flow-steps" aria-label={appUi.scan.title}>
          {appUi.scan.steps.map((step, index) => (
            <span className={index === 0 || scanState === "done" ? "is-active" : ""} key={step}>
              {index + 1}. {step}
            </span>
          ))}
        </div>
      </div>

      <div className="scan-console-body">
        <form className="scan-form" onSubmit={submitScan}>
          <label>
            {appUi.scan.prospectWebsite}
            <input
              name="url"
              type="url"
              required
              placeholder={appUi.common.placeholders.prospectUrl}
              value={scanForm.url}
              onChange={updateScanField("url")}
            />
          </label>
          <label>
            {appUi.scan.companyName}
            <input
              name="companyName"
              placeholder={appUi.common.placeholders.companyName}
              value={scanForm.companyName}
              onChange={updateScanField("companyName")}
            />
          </label>
          <label className="scan-form-wide">
            {appUi.scan.websiteNotes}
            <textarea
              name="notes"
              rows={4}
              placeholder={appUi.scan.notesPlaceholder}
              value={scanForm.notes}
              onChange={updateScanField("notes")}
            />
          </label>
          <label className="scan-depth-toggle">
            <input type="checkbox" checked={scanForm.deepScan} onChange={updateScanField("deepScan")} />
            <span>
              {appUi.scan.deepScan}
              <small>{appUi.scan.deepScanHint}</small>
            </span>
          </label>
          <button className="button button-primary" type="submit" disabled={scanState === "loading"}>
            <Icon name="scan" />
            {scanState === "loading" ? appUi.scan.scanning : appUi.scan.runScan}
          </button>
          <p className={`form-status ${scanState === "error" ? "is-error" : scanState === "done" ? "is-success" : ""}`} role="status" aria-live="polite">
            {scanMessage || " "}
          </p>
          {scanState === "error" && lastScanError ? (
            <div className="scan-error-box" role="alert">
              <strong>{appUi.scan.noCredit}</strong>
              <span>{appUi.preview.reason}: {formatHistoryReason(lastScanError.reason, appUi)}</span>
              <button className="button button-secondary" type="submit">
                {appUi.scan.retryScan}
              </button>
            </div>
          ) : null}
        </form>

        <div className="scan-preview" aria-label={appUi.preview.outputPreview}>
          <span className="side-label">{appUi.preview.outputPreview}</span>
          {scanState === "loading" ? (
            <div className="scan-skeleton" aria-label={appUi.status.loading}>
              <i />
              <i />
              <i />
              <i />
            </div>
          ) : hasActivePreview && activeProspect ? (
            <>
              <div className="scan-status-row">
                <span className="status-pill">{activeProspect.savedStatus === "saved" ? appUi.preview.saved : appUi.preview.unsaved}</span>
                <span className="status-pill">
                  {activeProspect.exportStatus === "exported" ? appUi.preview.exported : appUi.preview.notExported}
                </span>
              </div>
              <div className="scan-preview-row">
                <strong>{activeProspect.companyName}</strong>
                <span>{activeProspect.domain}</span>
                <em>{activeProspect.fitScore} {appUi.preview.fit}</em>
              </div>
              <div className="scan-preview-evidence">
                {activeProspect.opportunitySignals.slice(0, 3).map((signal) => (
                  <span key={signal.signal}>
                    <Icon name="check" />
                    {signal.signal}
                  </span>
                ))}
              </div>
              <div className="scan-preview-first-line">
                <span>{appUi.preview.firstLine}</span>
                <p>{activeProspect.firstLines[0]}</p>
              </div>
            </>
          ) : (
            <div className="scan-preview-empty">
              <strong>{appUi.dashboard.emptyProspect.title}</strong>
              <p>{shouldShowOnboarding ? appUi.dashboard.onboarding.descriptions.firstCardTodo : appUi.dashboard.emptyProspect.copy}</p>
              <div className="scan-preview-empty-steps">
                {appUi.scan.steps.map((step) => (
                  <span key={step}>{step}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  ) : (
    <section className="panel overview-manual-panel" id="scan-console" aria-labelledby="overview-manual-title">
      <div className="overview-manual-copy">
        <p className="eyebrow">{appUi.dashboard.nextAction.manualEyebrow}</p>
        <h2 id="overview-manual-title">{appUi.dashboard.nextAction.manualTitle}</h2>
        <p>{appUi.dashboard.nextAction.manualCopy}</p>
      </div>
      <a className="button button-secondary" href={queueScanRoute} onClick={() => setOverviewManualModeOpen(true)}>
        <Icon name="scan" />
        {appUi.dashboard.nextAction.openManual}
      </a>
    </section>
  );
  const heroMetrics = [
    [appUi.dashboard.metrics.currentPlan, snapshot.plan.name],
    [appUi.dashboard.metrics.creditsLeft, snapshot.credits.remaining.toLocaleString()],
    [appUi.dashboard.metrics.savedProspects, String(savedSourceLeads.length)]
  ];
  const handleBillingPlanAction = (plan: PricingPlan, isCurrent: boolean) => {
    if (isCurrent) {
      if (auth.authenticated) {
        void openBillingPortal();
      } else {
        window.location.assign(buildLocalePath(locale, "/login"));
      }
      return;
    }

    if (!auth.authenticated) {
      window.location.assign(buildLocalePath(locale, "/login"));
      return;
    }

    if (plan.id === "free") {
      setDashboardMessage(appUi.common.messages.checkoutUnavailable);
      return;
    }

    void startPlanCheckout(plan.id);
  };
  return (
    <div className="app-shell">
      <header className="dashboard-topbar">
        <a className="brand" href="/" aria-label={`${siteUi.common.brand} ${siteUi.common.home}`}>
          <BrandMark />
          <span>LeadCue</span>
        </a>
        <div className="dashboard-topbar-actions">
          <LanguageSwitcher />
          <UserMenu appUi={appUi} auth={auth} signOut={signOut} />
        </div>
      </header>

      <div className="app-shell-body">
        <aside className="sidebar">
          <nav className="side-nav" aria-label={appUi.pages.dashboard.title}>
            <a className={appSection === "dashboard" ? "active" : ""} href={appRoutes.today}>
              <Icon name="browser" />
              {appUi.nav.today}
            </a>
            <a className={isQueueSection ? "active" : ""} href={appRoutes.queue}>
              <Icon name="database" />
              {appUi.nav.queue}
            </a>
            <a className={isQualifiedSection ? "active" : ""} href={appRoutes.qualified}>
              <Icon name="layers" />
              {appUi.nav.qualified}
            </a>
            <a className={isExportsSection ? "active" : ""} href={appRoutes.exports}>
              <Icon name="download" />
              {appUi.nav.exports}
            </a>
            <a className={isSettingsSection ? "active" : ""} href={appRoutes.settings}>
              <Icon name="shield" />
              {appUi.nav.settings}
            </a>
            <a className={appSection === "analytics" ? "active" : ""} href={appRoutes.analytics}>
              <Icon name="chart" />
              {appUi.nav.analytics}
            </a>
          </nav>
        </aside>

        <main className="dashboard-main">
          <header className={appSection === "dashboard" ? "panel dashboard-header dashboard-hero" : "dashboard-header"}>
            <div className="dashboard-hero-copy">
              <p className="eyebrow">{pageCopy.eyebrow}</p>
              <h1>{dashboardTitle}</h1>
              <p className="dashboard-page-copy">{dashboardIntro}</p>
            </div>
            {appSection === "dashboard" ? (
              <div className="dashboard-hero-aside">
                <div className="dashboard-hero-metrics" aria-label={appUi.dashboard.metrics.ariaLabel}>
                  {heroMetrics.map(([label, value]) => (
                    <div className="dashboard-hero-metric" key={label}>
                      <span>{label}</span>
                      <strong>{value}</strong>
                    </div>
                  ))}
                </div>
                <div className="dashboard-actions">
                  {overviewPrimaryAction.kind === "refresh" ? (
                    <button className="button button-primary" type="button" onClick={() => window.location.reload()}>
                      <Icon name={overviewPrimaryAction.icon} />
                      {overviewPrimaryAction.label}
                    </button>
                  ) : overviewPrimaryAction.kind === "create" ? (
                    <button
                      className="button button-primary"
                      type="button"
                      onClick={() => void createWorkspaceAfterLogin()}
                      disabled={workspaceCreateState === "loading"}
                    >
                      <Icon name={overviewPrimaryAction.icon} />
                      {workspaceCreateState === "loading" ? appUi.common.saving : overviewPrimaryAction.label}
                    </button>
                  ) : (
                    <a className="button button-primary" href={overviewPrimaryAction.href}>
                      <Icon name={overviewPrimaryAction.icon} />
                      {overviewPrimaryAction.label}
                    </a>
                  )}
                  <a
                    className="button button-secondary"
                    href={overviewSecondaryAction.href}
                    onClick={overviewSecondaryAction.href === "#scan-console" ? () => setOverviewManualModeOpen(true) : undefined}
                  >
                    <Icon name={overviewSecondaryAction.icon} />
                    {overviewSecondaryAction.label}
                  </a>
                </div>
              </div>
            ) : (
              <div className="dashboard-actions">
                {pagePrimaryAction?.kind === "button" ? (
                  <button className="button button-primary" type="button" onClick={pagePrimaryAction.onClick}>
                    <Icon name={pagePrimaryAction.icon} />
                    {pagePrimaryAction.label}
                  </button>
                ) : pagePrimaryAction ? (
                  <a className="button button-primary" href={pagePrimaryAction.href}>
                    <Icon name={pagePrimaryAction.icon} />
                    {pagePrimaryAction.label}
                  </a>
                ) : null}
              </div>
            )}
          </header>

          <div
            className={`workspace-alert ${!accountShowsWorkspaceAlertPanel && workspaceAlertMessage ? "" : "is-empty"}`}
            role="status"
            aria-live="polite"
          >
            {!accountShowsWorkspaceAlertPanel ? workspaceAlertMessage || " " : " "}
          </div>

          {isDemoPreviewWorkspace ? (
            <div className="workspace-info-bar" role="status">
              <span>{appUi.dashboard.nextAction.sampleCopy}</span>
              <div className="workspace-info-bar-actions">
                <a className="button button-small button-secondary" href={buildLocalePath(locale, "/login")}>
                  <Icon name="mail" />
                  {appUi.actions.signIn}
                </a>
                <a className="button button-small button-primary" href={buildLocalePath(locale, "/login")}>
                  <Icon name="mail" />
                  {appUi.dashboard.nextAction.startWorkspace}
                </a>
              </div>
            </div>
          ) : null}

          {pageShowsWorkspaceStatePanel ? workspaceStatePanel : null}

        {appSection === "dashboard" && !workspaceStateBlocked ? (
          <>
            {overviewShowsStatePanel ? workspaceStatePanel : null}

            {shouldShowOnboarding ? (
              <section className="panel dashboard-onboarding" aria-labelledby="dashboard-onboarding-title">
                <div className="dashboard-onboarding-head">
                  <div className="dashboard-onboarding-copy">
                    <p className="eyebrow">{appUi.dashboard.onboarding.eyebrow}</p>
                    <h2 id="dashboard-onboarding-title">
                      {welcomeFlow || checkoutSuccess
                        ? formatMessage(appUi.dashboard.onboarding.welcomeTitle, { name: welcomeName })
                        : formatMessage(appUi.dashboard.onboarding.workspaceReadyTitle, { name: welcomeName })}
                    </h2>
                  </div>
                  <div className="dashboard-onboarding-meta">
                    <span className="status-pill">{formatMessage(appUi.dashboard.onboarding.progress, { count: onboardingProgress })}</span>
                    <button
                      className="button button-small button-secondary"
                      type="button"
                      onClick={completeOnboarding}
                      disabled={onboardingState === "saving"}
                    >
                      {onboardingState === "saving" ? appUi.common.saving : appUi.dashboard.onboarding.markComplete}
                    </button>
                  </div>
                </div>

                <div className="dashboard-onboarding-layout">
                  <div className="onboarding-checklist" role="list" aria-label={appUi.dashboard.onboarding.checklistLabel}>
                    {onboardingTasks.map((task, index) => (
                      <div className={`onboarding-item ${task.done ? "is-done" : ""}`} key={task.label} role="listitem">
                        <span className="onboarding-item-state">
                          {task.done ? <Icon name="check" /> : index + 1}
                        </span>
                        <div>
                          <strong>{task.label}</strong>
                          <p>{task.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="onboarding-setup">
                    <span className="side-label">{appUi.dashboard.onboarding.setupSnapshot}</span>
                    <div className="onboarding-field">
                      <span>{appUi.dashboard.onboarding.service}</span>
                      <strong>{formatAgencyFocus(snapshot.setup.agencyFocus || snapshot.setup.serviceType, appUi)}</strong>
                    </div>
                    <div className="onboarding-field">
                      <span>{appUi.dashboard.onboarding.industries}</span>
                      <strong>{previewList(snapshot.setup.targetIndustries, 4, appUi.common.notSet)}</strong>
                    </div>
                    <div className="onboarding-field">
                      <span>{appUi.dashboard.onboarding.firstTarget}</span>
                      <strong>{formatCompactUrl(snapshot.setup.firstProspectUrl || snapshot.setup.agencyWebsite, appUi.common.notSet)}</strong>
                    </div>
                  </div>
                </div>
              </section>
            ) : null}

            {overviewHasWorkflowData ? (
              <section className={`overview-main-grid ${overviewHasSavedData ? "" : "is-single"}`}>
                <div className="panel overview-queue-panel">
                  <div className="panel-header">
                    <div>
                      <p className="eyebrow">{appUi.dashboard.queuePanel.eyebrow}</p>
                      <h2>{appUi.dashboard.queuePanel.title}</h2>
                    </div>
                    <a className="button button-secondary button-small" href={appRoutes.queue}>
                      {appUi.common.open}
                    </a>
                  </div>
                  <div className="overview-kpi-row">
                    <div>
                      <span>{appUi.dashboard.queuePanel.ready}</span>
                      <strong>{reviewReadyCount}</strong>
                    </div>
                    <div>
                      <span>{appUi.dashboard.queuePanel.researching}</span>
                      <strong>{reviewResearchingCount}</strong>
                    </div>
                    <div>
                      <span>{appUi.dashboard.queuePanel.imported}</span>
                      <strong>{importedWebsites.length}</strong>
                    </div>
                  </div>
                  <div className="overview-queue-list">
                    {reviewQueueRows.length ? (
                      reviewQueueRows.slice(0, 5).map((row) => {
                        const rowLead = row.leadId ? leadByDomain.get(row.domain) : null;
                        return (
                          <article key={row.id}>
                            <div>
                              <strong>{row.companyName}</strong>
                              <span>{row.domain}</span>
                            </div>
                            <div className="overview-queue-meta">
                              <span className="status-pill">{row.status === "ready" ? appUi.dashboard.queuePanel.ready : appUi.dashboard.queuePanel.researching}</span>
                              <small>
                                {queueSourceLabel(row.source, appUi)}
                              </small>
                            </div>
                            <div className="overview-inline-actions">
                              <a className="button button-secondary button-small" href={row.websiteUrl} target="_blank" rel="noreferrer">
                                {appUi.dashboard.queuePanel.openSite}
                              </a>
                              {rowLead ? (
                                <button className="button button-primary button-small" type="button" onClick={() => void openLeadDetail(rowLead)}>
                                  {appUi.dashboard.queuePanel.reviewCard}
                                </button>
                              ) : (
                                <button
                                  className="button button-primary button-small"
                                  type="button"
                                  onClick={() =>
                                    queueWebsiteForScanDesk({
                                      url: row.websiteUrl,
                                      companyName: row.companyName,
                                      notes: row.note,
                                      queueItemId: row.id,
                                      queueSource: row.source
                                    })
                                  }
                                >
                                  {appUi.dashboard.queuePanel.moveToScanDesk}
                                </button>
                              )}
                            </div>
                          </article>
                        );
                      })
                    ) : (
                      <div className="empty-panel-copy">
                        <strong>{appUi.dashboard.queuePanel.emptyTitle}</strong>
                        <span>{appUi.dashboard.queuePanel.emptyCopy}</span>
                      </div>
                    )}
                  </div>
                </div>

                {overviewHasSavedData ? (
                  <div className="panel overview-saved-panel">
                    <div className="panel-header">
                      <div>
                        <p className="eyebrow">{appUi.dashboard.savedPanel.eyebrow}</p>
                        <h2>{appUi.dashboard.savedPanel.title}</h2>
                      </div>
                      <a className="button button-secondary button-small" href={appRoutes.qualified}>
                        {appUi.common.open}
                      </a>
                    </div>
                    <div className="overview-kpi-row">
                      <div>
                        <span>{appUi.dashboard.savedPanel.qualified}</span>
                        <strong>{workflowStageCounts.qualified}</strong>
                      </div>
                      <div>
                        <span>{appUi.dashboard.savedPanel.outreachQueued}</span>
                        <strong>{workflowStageCounts.outreach_queued}</strong>
                      </div>
                      <div>
                        <span>{appUi.dashboard.savedPanel.exported}</span>
                        <strong>{analyticsSummary.totals.exportsCompleted}</strong>
                      </div>
                    </div>
                    <div className="overview-saved-list">
                      {topSavedAccounts.length ? (
                        topSavedAccounts.map((lead) => (
                          <article key={lead.id}>
                            <div>
                              <strong>{lead.companyName}</strong>
                              <span>{lead.domain}</span>
                            </div>
                            <div className="overview-queue-meta">
                              <span className="status-pill">{formatPipelineStage(getLeadPipelineStage(lead), appUi)}</span>
                              <small>{lead.fitScore} {appUi.preview.fit}</small>
                            </div>
                            <div className="overview-inline-actions">
                              <button className="button button-primary button-small" type="button" onClick={() => void openLeadDetail(lead)}>
                                {appUi.dashboard.savedPanel.openCard}
                              </button>
                            </div>
                          </article>
                        ))
                      ) : (
                        <div className="empty-panel-copy">
                          <strong>{appUi.dashboard.savedPanel.emptyTitle}</strong>
                          <span>{appUi.dashboard.savedPanel.emptyCopy}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : null}
              </section>
            ) : (
              <section className="panel overview-step-grid" aria-label={appUi.dashboard.workbench.title}>
                <article className="overview-step-card">
                  <span className="side-label">{appUi.dashboard.workbench.import.eyebrow}</span>
                  <strong>{appUi.dashboard.workbench.import.title}</strong>
                  <p>{appUi.dashboard.workbench.import.copy}</p>
                </article>
                <article className="overview-step-card">
                  <span className="side-label">{appUi.dashboard.workbench.queue.eyebrow}</span>
                  <strong>{appUi.dashboard.workbench.queue.title}</strong>
                  <p>{appUi.dashboard.workbench.queue.copy}</p>
                </article>
                <article className="overview-step-card">
                  <span className="side-label">{appUi.dashboard.workbench.saved.eyebrow}</span>
                  <strong>{appUi.dashboard.workbench.saved.title}</strong>
                  <p>{appUi.dashboard.workbench.saved.copy}</p>
                </article>
              </section>
            )}

            {scanWorkspacePanel}
          </>
        ) : null}

        {appSection === "queue" && !workspaceStateBlocked ? (
          <>
            <section className="app-page-grid import-page-grid" id="queue-intake">
              <div className="panel import-form-panel" id="import-form-panel">
                <div className="panel-header">
                  <div>
                    <p className="eyebrow">{appUi.importer.eyebrow}</p>
                    <h2>{appUi.importer.title}</h2>
                  </div>
                  <a className="button button-secondary" href="#queue-review">
                    <Icon name="filter" />
                    {appUi.importer.openQueue}
                  </a>
                </div>
                <p className="panel-copy">{appUi.importer.copy}</p>
                <form className="import-form" onSubmit={submitImportedWebsites}>
                  <label className="import-form-wide import-form-field">
                    {appUi.importer.textareaLabel}
                    <textarea
                      rows={12}
                      value={importDraft}
                      onChange={(event) => setImportDraft(event.currentTarget.value)}
                      placeholder={appUi.importer.textareaPlaceholder}
                    />
                  </label>
                  <div className="import-form-meta-grid">
                    <fieldset className="import-meta-card import-source-card">
                      <legend>{appUi.importer.sourceLabel}</legend>
                      <div className="import-source-grid" aria-label={appUi.importer.sourceLabel}>
                        {batchSourceOptions.map((option) => {
                          const isSelected = importSource === option;
                          return (
                            <button
                              key={option}
                              type="button"
                              className={`import-source-option${isSelected ? " is-selected" : ""}`}
                              onClick={() => setImportSource(option)}
                              aria-pressed={isSelected}
                            >
                              <span className="import-source-option-copy">{appUi.importer.sourceOptions[option]}</span>
                              <span className="import-source-option-mark" aria-hidden="true">
                                <Icon name="check" />
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </fieldset>
                    <label className="import-meta-card import-note-card">
                      <span>{appUi.importer.notesLabel}</span>
                      <textarea rows={5} value={importNote} onChange={(event) => setImportNote(event.currentTarget.value)} />
                    </label>
                  </div>
                  <div className="import-form-actions">
                    <button className="button button-primary" type="submit" disabled={!importDraft.trim()}>
                      <Icon name="database" />
                      {appUi.importer.submit}
                    </button>
                    <button className="button button-secondary" type="button" onClick={openImportFilePicker}>
                      <Icon name="download" />
                      {appUi.importer.upload}
                    </button>
                    <button
                      className="button button-secondary"
                      type="button"
                      onClick={() => {
                        setImportDraft("");
                        setImportNote("");
                        setImportMessage("");
                        setImportState("idle");
                      }}
                    >
                      {appUi.common.reset}
                    </button>
                    <input
                      ref={importFileInputRef}
                      type="file"
                      accept=".csv,.txt,.tsv"
                      hidden
                      onChange={handleImportFileChange}
                    />
                  </div>
                  <p className={`form-status ${importState === "error" ? "is-error" : importState === "saved" ? "is-success" : ""}`} role="status">
                    {importMessage || " "}
                  </p>
                </form>
              </div>

              <div className="panel import-summary-panel">
                <p className="eyebrow">{appUi.importer.summaryEyebrow}</p>
                <h2>{appUi.importer.summaryTitle}</h2>
                <div className="overview-kpi-row">
                  <div>
                    <span>{appUi.importer.summaryImported}</span>
                    <strong>{importedWebsites.length}</strong>
                  </div>
                  <div>
                    <span>{appUi.importer.summaryReady}</span>
                    <strong>{reviewReadyCount}</strong>
                  </div>
                  <div>
                    <span>{appUi.importer.summaryResearching}</span>
                    <strong>{reviewResearchingCount}</strong>
                  </div>
                </div>
                <div className="policy-list">
                  {workflowRecommendations.map((item) => (
                    <span key={item}>
                      <Icon name="check" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            <section className="panel import-history-panel">
              <div className="panel-header">
                <div>
                  <p className="eyebrow">{appUi.importer.historyEyebrow}</p>
                  <h2>{appUi.importer.historyTitle}</h2>
                </div>
                <span className="status-pill">{formatMessage(appUi.importer.historyCount, { count: importedWebsites.length })}</span>
              </div>
              {importHistoryIsEmpty ? (
                <div className="page-empty-state is-compact">
                  <strong>{appUi.importer.emptyTitle}</strong>
                  <p>{appUi.importer.emptyCopy}</p>
                </div>
              ) : (
                <div className="review-table" role="table" aria-label={appUi.importer.historyTitle}>
                  <div className="review-row review-head" role="row">
                    <span>{appUi.dashboard.leadsPanel.company}</span>
                    <span>{appUi.importer.sourceLabel}</span>
                    <span>{appUi.importer.statusLabel}</span>
                    <span>{appUi.importer.nextStepLabel}</span>
                  </div>
                  {importedQueueRows.map((row) => {
                    const rowLead = row.leadId ? leadByDomain.get(row.domain) : null;
                    const statusLabel =
                      row.status === "qualified"
                        ? appUi.savedAccounts.statusQualified
                        : row.status === "researching"
                          ? appUi.reviewQueue.statusResearching
                          : appUi.reviewQueue.statusReady;
                    return (
                      <article className="review-row" role="row" key={row.id}>
                        <div className="review-row-company">
                          <strong>{row.companyName}</strong>
                          <span>{row.domain}</span>
                          {row.note ? <small>{row.note}</small> : null}
                        </div>
                        <span>{queueSourceLabel(row.source, appUi)}</span>
                        <span><span className="status-pill">{statusLabel}</span></span>
                        <div className="review-row-actions">
                          <a className="button button-secondary button-small" href={row.websiteUrl} target="_blank" rel="noreferrer">
                            {appUi.reviewQueue.openSite}
                          </a>
                          {rowLead ? (
                            <button className="button button-primary button-small" type="button" onClick={() => void openLeadDetail(rowLead)}>
                              {appUi.reviewQueue.openCard}
                            </button>
                          ) : (
                            <button
                              className="button button-primary button-small"
                              type="button"
                              onClick={() =>
                                queueWebsiteForScanDesk({
                                  url: row.websiteUrl,
                                  companyName: row.companyName,
                                  notes: row.note,
                                  queueItemId: row.id,
                                  queueSource: row.source
                                })
                              }
                            >
                              {appUi.reviewQueue.moveToScanDesk}
                            </button>
                          )}
                          <button className="button button-secondary button-small" type="button" onClick={() => void removeImportedWebsite(row.id)}>
                            {appUi.importer.remove}
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
            {scanWorkspacePanel}
          </>
        ) : null}

        {appSection === "queue" && !workspaceStateBlocked ? (
          <section className={`app-page-grid review-page-grid ${showReviewQueueEmptyState ? "is-empty" : ""}`} id="queue-review">
            <div className="panel review-queue-panel">
              <div className="panel-header">
                <div>
                  <p className="eyebrow">{appUi.reviewQueue.eyebrow}</p>
                  <h2>{appUi.reviewQueue.title}</h2>
                </div>
              </div>
              {showReviewQueueEmptyState ? (
                <div className="page-empty-state">
                  <strong>{appUi.reviewQueue.emptyTitle}</strong>
                  <p>{appUi.reviewQueue.emptyCopy}</p>
                  <div className="page-empty-actions">
                    <a className="button button-primary" href="#queue-intake">
                      <Icon name="database" />
                      {appUi.dashboard.nextAction.importWebsites}
                    </a>
                    <a className="button button-secondary" href={queueScanRoute}>
                      <Icon name="scan" />
                      {appUi.actions.newScan}
                    </a>
                  </div>
                </div>
              ) : (
                <>
                  <div className="review-controls" aria-label={appUi.reviewQueue.controlsLabel}>
                    <label className="lead-search-field">
                      {appUi.reviewQueue.searchLabel}
                      <input
                        type="search"
                        value={reviewSearch}
                        onChange={(event) => setReviewSearch(event.currentTarget.value)}
                        placeholder={appUi.common.placeholders.leadSearch}
                      />
                    </label>
                    <label>
                      {appUi.reviewQueue.statusLabel}
                      <select value={reviewFilter} onChange={(event) => setReviewFilter(event.currentTarget.value as ReviewQueueFilter)}>
                        <option value="all">{appUi.reviewQueue.statusAll}</option>
                        <option value="ready">{appUi.reviewQueue.statusReady}</option>
                        <option value="researching">{appUi.reviewQueue.statusResearching}</option>
                      </select>
                    </label>
                    <label>
                      {appUi.reviewQueue.sourceLabel}
                      <select value={reviewSourceFilter} onChange={(event) => setReviewSourceFilter(event.currentTarget.value as "all" | "import" | "workspace")}>
                        <option value="all">{appUi.reviewQueue.sourceAll}</option>
                        <option value="import">{appUi.reviewQueue.sourceImported}</option>
                        <option value="workspace">{appUi.reviewQueue.workspaceSource}</option>
                      </select>
                    </label>
                    <button className="button button-secondary button-small" type="button" onClick={() => {
                      setReviewSearch("");
                      setReviewFilter("all");
                      setReviewSourceFilter("all");
                    }} disabled={!reviewFiltersActive}>
                      {appUi.common.clearFilters}
                    </button>
                  </div>
                  <div className="lead-result-meta" aria-live="polite">
                    <span>{formatMessage(appUi.reviewQueue.resultsSummary, { visible: visibleReviewRows.length, total: reviewQueueRows.length })}</span>
                    <span>{formatMessage(appUi.reviewQueue.readySummary, { count: reviewReadyCount })}</span>
                  </div>
                  <div className="review-table" role="table" aria-label={appUi.reviewQueue.tableLabel}>
                    <div className="review-row review-head" role="row">
                      <span>{appUi.dashboard.leadsPanel.company}</span>
                      <span>{appUi.reviewQueue.sourceLabel}</span>
                      <span>{appUi.reviewQueue.statusLabel}</span>
                      <span>{appUi.reviewQueue.nextStepLabel}</span>
                    </div>
                    {visibleReviewRows.length ? (
                      visibleReviewRows.map((row) => {
                        const rowLead = row.leadId ? leadByDomain.get(row.domain) : null;
                        return (
                          <article className="review-row" role="row" key={row.id}>
                            <div className="review-row-company">
                              <strong>{row.companyName}</strong>
                              <span>{row.domain}</span>
                              {row.note ? <small>{row.note}</small> : null}
                            </div>
                            <span>{queueSourceLabel(row.source, appUi)}</span>
                            <span>
                              <span className="status-pill">
                                {row.status === "ready" ? appUi.reviewQueue.statusReady : appUi.reviewQueue.statusResearching}
                              </span>
                            </span>
                            <div className="review-row-actions">
                              <a className="button button-secondary button-small" href={row.websiteUrl} target="_blank" rel="noreferrer">
                                {appUi.reviewQueue.openSite}
                              </a>
                              {rowLead ? (
                                <button className="button button-primary button-small" type="button" onClick={() => void openLeadDetail(rowLead)}>
                                  {appUi.reviewQueue.openCard}
                                </button>
                              ) : (
                                <button
                                  className="button button-primary button-small"
                                  type="button"
                                  onClick={() =>
                                    queueWebsiteForScanDesk({
                                      url: row.websiteUrl,
                                      companyName: row.companyName,
                                      notes: row.note,
                                      queueItemId: row.id,
                                      queueSource: row.source
                                    })
                                  }
                                >
                                  {appUi.reviewQueue.moveToScanDesk}
                                </button>
                              )}
                            </div>
                          </article>
                        );
                      })
                    ) : (
                      <div className="empty-table-state">
                        <strong>{reviewQueueRows.length ? appUi.reviewQueue.emptyFilteredTitle : appUi.reviewQueue.emptyTitle}</strong>
                        <span>{reviewQueueRows.length ? appUi.reviewQueue.emptyFilteredCopy : appUi.reviewQueue.emptyCopy}</span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
            {!showReviewQueueEmptyState ? (
            <div className="panel review-side-panel">
              <p className="eyebrow">{appUi.reviewQueue.sideEyebrow}</p>
              <h2>{appUi.reviewQueue.sideTitle}</h2>
              <p className="panel-copy">{appUi.reviewQueue.sideCopy}</p>
              <div className="overview-kpi-row">
                <div>
                  <span>{appUi.reviewQueue.statusReady}</span>
                  <strong>{reviewReadyCount}</strong>
                </div>
                <div>
                  <span>{appUi.reviewQueue.statusResearching}</span>
                  <strong>{reviewResearchingCount}</strong>
                </div>
                <div>
                  <span>{appUi.reviewQueue.importedCountLabel}</span>
                  <strong>{importedWebsites.length}</strong>
                </div>
              </div>
              <div className="policy-list">
                {workflowRecommendations.map((item) => (
                  <span key={item}>
                    <Icon name="check" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
            ) : null}
          </section>
        ) : null}

        {(appSection === "qualified" || appSection === "exports") && !workspaceStateBlocked ? (
          <section className={`app-page-grid leads-page-grid ${showSavedAccountsEmptyState ? "is-empty" : ""}`}>
            <div className="panel leads-panel leads-page-panel">
              <div className="panel-header">
                <div>
                  <p className="eyebrow">{isExportsSection ? appUi.pages.exports.eyebrow : appUi.savedAccounts.eyebrow}</p>
                  <h2>{isExportsSection ? appUi.pages.exports.title : appUi.savedAccounts.title}</h2>
                </div>
              </div>
              {isExportsSection ? <p className="panel-copy">{appUi.pages.exports.copy}</p> : null}
              {isExportsSection && !showSavedAccountsEmptyState ? (
                <div className="billing-summary-strip" aria-label={appUi.pages.exports.title}>
                  <div className="billing-summary-card">
                    <span>{appUi.analytics.kpis.qualifiedAccounts}</span>
                    <strong>{qualifiedCount.toLocaleString()}</strong>
                  </div>
                  <div className="billing-summary-card">
                    <span>{appUi.leads.selectedCount.replace("__COUNT__", String(selectedSourceLeads.length))}</span>
                    <strong>{selectedSourceLeads.length.toLocaleString()}</strong>
                  </div>
                  <div className="billing-summary-card">
                    <span>{appUi.analytics.kpis.exportsCompleted}</span>
                    <strong>{analyticsSummary.totals.exportsCompleted.toLocaleString()}</strong>
                  </div>
                </div>
              ) : null}
              {showSavedAccountsEmptyState ? (
                <div className="page-empty-state">
                  <strong>{appUi.savedAccounts.emptyTitle}</strong>
                  <p>{appUi.savedAccounts.emptyCopy}</p>
                  <div className="page-empty-actions">
                    <a className="button button-primary" href={appRoutes.queue}>
                      <Icon name="filter" />
                      {appUi.dashboard.nextAction.openQueue}
                    </a>
                    <a className="button button-secondary" href={appRoutes.queue}>
                      <Icon name="database" />
                      {appUi.dashboard.nextAction.importWebsites}
                    </a>
                  </div>
                </div>
              ) : (
                <>
                  <div className="lead-controls" aria-label={appUi.leads.controlsLabel}>
                    <label className="lead-search-field">
                      {appUi.leads.searchLabel}
                      <input
                        type="search"
                        value={leadSearch}
                        onChange={(event) => setLeadSearch(event.currentTarget.value)}
                        placeholder={appUi.common.placeholders.leadSearch}
                      />
                    </label>
                    <label>
                      {appUi.leads.sortLabel}
                      <select value={leadSort} onChange={(event) => setLeadSort(event.currentTarget.value as LeadSortOption)}>
                        {leadSortOptions.map((option) => (
                          <option value={option} key={option}>
                            {appUi.options.leadSort[option]}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      {appUi.leads.minFit}
                      <span className="range-value">{leadMinFit}+</span>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={leadMinFit}
                        onChange={(event) => setLeadMinFit(Number(event.currentTarget.value))}
                      />
                    </label>
                    <label>
                      {appUi.leads.minConfidence}
                      <span className="range-value">{leadMinConfidence}%+</span>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={leadMinConfidence}
                        onChange={(event) => setLeadMinConfidence(Number(event.currentTarget.value))}
                      />
                    </label>
                    <button className="button button-secondary button-small" type="button" onClick={resetLeadControls} disabled={!leadFiltersActive}>
                      {appUi.common.clearFilters}
                    </button>
                  </div>
                  <div className="lead-result-meta" aria-live="polite">
                    <span>{formatMessage(appUi.savedAccounts.resultsSummary, { visible: visibleLeads.length, total: sourceLeads.length })}</span>
                    <span>{appUi.options.leadSort[leadSort]}</span>
                  </div>
                  <div className="lead-bulk-toolbar" aria-label={appUi.savedAccounts.title}>
                    <div>
                      <strong>{formatMessage(appUi.leads.selectedCount, { count: selectedSourceLeads.length })}</strong>
                      <span>{selectedSourceLeads.length ? appUi.leads.selectedReadyCopy : appUi.leads.selectedEmptyCopy}</span>
                    </div>
                    <div className="lead-bulk-template" aria-label={appUi.leads.templateLabel}>
                      <label>
                        {appUi.leads.templateLabel}
                        <select
                          value={bulkExportPreset}
                          onChange={(event) => setBulkExportPreset(event.currentTarget.value as Exclude<ProspectExportPresetKey, "custom">)}
                        >
                          {prospectExportPresets.map((preset) => (
                            <option value={preset.key} key={preset.key}>
                              {appUi.prospectCard.export.presets[preset.key].label}
                            </option>
                          ))}
                        </select>
                      </label>
                      {bulkExportPreset === "crm" ? (
                        <label>
                          {appUi.leads.crmFieldsLabel}
                          <select
                            value={bulkCrmFieldMode}
                            onChange={(event) => setBulkCrmFieldMode(event.currentTarget.value as ProspectCrmFieldMode)}
                          >
                            {prospectCrmFieldModes.map((mode) => (
                              <option value={mode.value} key={mode.value}>
                                {appUi.prospectCard.export.crmModes[mode.value].label}
                              </option>
                            ))}
                          </select>
                        </label>
                      ) : null}
                    </div>
                    <div className="lead-bulk-actions">
                      {isExportsSection ? (
                        <button
                          className="button button-secondary button-small"
                          type="button"
                          onClick={() => void downloadCsv()}
                          disabled={!sourceLeads.length}
                        >
                          <Icon name="download" />
                          {appUi.actions.exportCsv}
                        </button>
                      ) : null}
                      <button
                        className="button button-secondary button-small"
                        type="button"
                        onClick={toggleAllVisibleLeads}
                        disabled={!visibleLeads.length}
                      >
                        {allVisibleLeadsSelected ? appUi.common.clearVisible : appUi.common.selectVisible}
                      </button>
                      <button
                        className="button button-secondary button-small"
                        type="button"
                        onClick={clearLeadSelection}
                        disabled={!selectedSourceLeads.length}
                      >
                        {appUi.common.clearSelection}
                      </button>
                      <button
                        className="button button-primary button-small"
                        type="button"
                        onClick={() => void exportSelectedLeads()}
                        disabled={!selectedSourceLeads.length || bulkExportState === "loading"}
                      >
                        <Icon name="download" />
                        {bulkExportState === "loading" ? appUi.common.exporting : appUi.common.exportSelected}
                      </button>
                    </div>
                  </div>
                  <div className="lead-table lead-table-expanded" role="table" aria-label={appUi.savedAccounts.tableLabel}>
                    <div className="lead-row lead-head" role="row">
                      <span className="lead-select-cell lead-select-heading">
                        <input
                          type="checkbox"
                          aria-label={allVisibleLeadsSelected ? appUi.leads.clearAllVisible : appUi.leads.selectAllVisible}
                          checked={allVisibleLeadsSelected}
                          ref={(element) => {
                            if (element) {
                              element.indeterminate = !allVisibleLeadsSelected && someVisibleLeadsSelected;
                            }
                          }}
                          onChange={toggleAllVisibleLeads}
                          disabled={!visibleLeads.length}
                        />
                      </span>
                      <span>{appUi.dashboard.leadsPanel.company}</span>
                      <span>{appUi.dashboard.leadsPanel.industry}</span>
                      <span>{appUi.dashboard.leadsPanel.fit}</span>
                      <span>{appUi.dashboard.leadsPanel.confidence}</span>
                    </div>
                    {visibleLeads.length ? (
                      visibleLeads.map((lead) => (
                        <div
                          className={`lead-row lead-row-record ${selectedLeadId === lead.id ? "is-selected" : ""} ${
                            selectedLeadIds.includes(lead.id) ? "is-checked" : ""
                          }`}
                          role="row"
                          key={lead.id || lead.domain}
                        >
                          <label className="lead-select-cell">
                            <input
                              type="checkbox"
                              checked={selectedLeadIds.includes(lead.id)}
                              onChange={() => toggleLeadSelection(lead.id)}
                              aria-label={formatMessage(appUi.leads.selectLead, { company: lead.companyName })}
                            />
                          </label>
                          <button
                            className="lead-row-open"
                            type="button"
                            onClick={() => void openLeadDetail(lead)}
                            aria-label={formatMessage(appUi.leads.openProspectCard, { company: lead.companyName })}
                          >
                            <strong>{lead.companyName}</strong>
                            <span>{lead.industry}</span>
                            <span>{lead.fitScore}</span>
                            <span>{Math.round(lead.confidenceScore * 100)}%</span>
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="empty-table-state">
                        <strong>{sourceLeads.length ? appUi.savedAccounts.emptyFilteredTitle : appUi.savedAccounts.emptyTitle}</strong>
                        <span>{sourceLeads.length ? appUi.savedAccounts.emptyFilteredCopy : appUi.savedAccounts.emptyCopy}</span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
            {!showSavedAccountsEmptyState ? (
            <>
            <button
              className={`lead-detail-backdrop ${isLeadDrawerOpen ? "is-open" : ""}`}
              type="button"
              aria-label={appUi.leads.drawerCloseLabel}
              aria-hidden={!isLeadDrawerOpen}
              tabIndex={isLeadDrawerOpen ? 0 : -1}
              onClick={() => setLeadDrawerOpen(false)}
            />
            <aside
              className={`lead-detail-drawer ${isLeadDrawerOpen ? "is-open" : ""}`}
              role="dialog"
              aria-label={appUi.leads.drawerLabel}
              aria-live="polite"
            >
              <div className="panel-header">
                <div>
                  <p className="eyebrow">{appUi.leads.drawerEyebrow}</p>
                  <h2>{appUi.leads.drawerTitle}</h2>
                </div>
                <div className="lead-detail-actions">
                  <span className="status-pill">
                    {selectedLeadState === "loading"
                      ? appUi.common.loading
                      : selectedLead
                        ? formatMessage(appUi.leads.drawerFitLabel, { score: selectedLead.fitScore })
                        : appUi.leads.drawerNoSelection}
                  </span>
                  <button
                    className="icon-button lead-detail-close"
                    type="button"
                    aria-label={appUi.leads.drawerCloseLabel}
                    onClick={() => setLeadDrawerOpen(false)}
                  >
                    <span aria-hidden="true">X</span>
                  </button>
                </div>
              </div>
              {selectedLeadState === "loading" ? (
                <div className="lead-detail-skeleton" aria-label={appUi.leads.drawerLoadingLabel}>
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                </div>
              ) : selectedLead ? (
                <>
                  {selectedLeadState === "error" ? (
                    <p className="form-status is-error" role="status">
                      {appUi.leads.errorShowingPreview}
                    </p>
                  ) : null}
                  <ProspectCard
                    card={selectedLead}
                    workspaceControls
                    leadId={selectedLeadId}
                    enableDeepLink
                    onContextSaved={applySavedPipelineContext}
                  />
                </>
              ) : (
                <div className="detail-empty-state">
                  <strong>{appUi.leads.detailEmptyTitle}</strong>
                  <span>{appUi.leads.detailEmptyCopy}</span>
                </div>
              )}
            </aside>
            </>
            ) : null}
          </section>
        ) : null}

        {appSection === "settings" && !workspaceStateBlocked ? (
          <section className="app-page-grid">
            <div className="panel icp-editor-panel" id="settings-icp">
              <div className="panel-header">
                <div>
                  <p className="eyebrow">{appUi.icp.editorEyebrow}</p>
                  <h2>{appUi.icp.editorTitle}</h2>
                </div>
                <span className="status-pill">
                  {icpSaveState === "saving"
                    ? appUi.icp.statusSaving
                    : icpSaveState === "saved"
                      ? appUi.icp.statusSaved
                      : appUi.icp.statusApplied}
                </span>
              </div>
              <form className="icp-edit-form" onSubmit={submitIcpSettings}>
                <div className="icp-form-grid">
                  <label>
                    {appUi.icp.fields.serviceType}
                    <select value={icpForm.serviceType} onChange={updateIcpField("serviceType")}>
                      <option value="web_design">{appUi.icp.serviceOptions.web_design}</option>
                      <option value="seo">{appUi.icp.serviceOptions.seo}</option>
                      <option value="marketing">{appUi.icp.serviceOptions.marketing}</option>
                      <option value="custom">{appUi.icp.serviceOptions.custom}</option>
                    </select>
                  </label>
                  <label>
                    {appUi.icp.fields.tone}
                    <select value={icpForm.tone} onChange={updateIcpField("tone")}>
                      <option value="professional">{appUi.icp.toneOptions.professional}</option>
                      <option value="direct">{appUi.icp.toneOptions.direct}</option>
                      <option value="casual">{appUi.icp.toneOptions.casual}</option>
                    </select>
                  </label>
                  <label>
                    {appUi.icp.fields.targetIndustries}
                    <input value={icpForm.targetIndustries} onChange={updateIcpField("targetIndustries")} />
                    <small>{appUi.icp.fields.targetIndustriesHelp}</small>
                  </label>
                  <label>
                    {appUi.icp.fields.countries}
                    <input value={icpForm.targetCountries} onChange={updateIcpField("targetCountries")} />
                    <small>{appUi.icp.fields.countriesHelp}</small>
                  </label>
                  <label className="icp-form-wide">
                    {appUi.icp.fields.offer}
                    <textarea rows={4} value={icpForm.offerDescription} onChange={updateIcpField("offerDescription")} />
                  </label>
                  <label className="icp-form-wide">
                    {appUi.icp.fields.firstTargetUrl}
                    <input type="url" value={icpForm.firstProspectUrl} onChange={updateIcpField("firstProspectUrl")} />
                  </label>
                </div>
                <div className="icp-form-actions">
                  <button className="button button-primary" type="submit" disabled={icpSaveState === "saving"}>
                    <Icon name="check" />
                    {icpSaveState === "saving" ? appUi.icp.actions.saving : appUi.icp.actions.save}
                  </button>
                  <button
                    className="button button-secondary"
                    type="button"
                    onClick={() => setIcpForm(icpFormFromSetup(snapshot.setup))}
                    disabled={icpSaveState === "saving"}
                  >
                    {appUi.icp.actions.reset}
                  </button>
                </div>
                <p
                  className={`form-status ${icpSaveState === "error" ? "is-error" : icpSaveState === "saved" ? "is-success" : ""}`}
                  role="status"
                  aria-live="polite"
                >
                  {icpMessage || " "}
                </p>
              </form>
            </div>
            <div className="panel scoring-rules-panel">
              <p className="eyebrow">{appUi.icp.rules.eyebrow}</p>
              <h2>{appUi.icp.rules.title}</h2>
              <div className="rule-list">
                {[
                  appUi.icp.rules.items.fit,
                  appUi.icp.rules.items.urgency,
                  appUi.icp.rules.items.evidence,
                  appUi.icp.rules.items.actionability
                ].map((item) => (
                  <div className="rule-item" key={item.label}>
                    <strong>{item.label}</strong>
                    <span>{item.copy}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {appSection === "analytics" && !workspaceStateBlocked ? (
          !analyticsHasWorkflowData ? (
            <section className="app-page-grid analytics-page-grid is-empty">
              <div className="panel analytics-overview-panel">
                <p className="eyebrow">{appUi.analytics.overviewEyebrow}</p>
                <h2>{appUi.analytics.emptyTitle}</h2>
                <p className="panel-copy">{appUi.analytics.emptyCopy}</p>
                <div className="page-empty-actions">
                  <a className="button button-primary" href={appRoutes.queue}>
                    <Icon name="database" />
                    {appUi.dashboard.nextAction.importWebsites}
                  </a>
                  <a className="button button-secondary" href={queueScanRoute}>
                    <Icon name="scan" />
                    {appUi.actions.newScan}
                  </a>
                </div>
                <div className="overview-step-grid">
                  {workflowFunnelSteps.map(([label, _value, meta]) => (
                    <article className="overview-step-card" key={label}>
                      <span className="side-label">{label}</span>
                      <strong>{label}</strong>
                      <p>{meta}</p>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          ) : (
          <section className="app-page-grid analytics-page-grid">
            <div className="panel analytics-overview-panel">
              <div className="panel-header">
                <div>
                  <p className="eyebrow">{appUi.analytics.overviewEyebrow}</p>
                  <h2>{appUi.analytics.overviewTitle}</h2>
                </div>
                <span className="status-pill">
                  {analyticsState === "loading"
                    ? appUi.common.loading
                    : analyticsState === "error"
                      ? appUi.common.failed
                    : analyticsState === "sample"
                      ? appUi.common.sample
                      : appUi.common.live}
                </span>
              </div>
              <div className="analytics-kpi-grid">
                {[
                  [appUi.analytics.kpis.importedWebsites, importedWebsites.length.toLocaleString()],
                  [appUi.analytics.kpis.reviewQueueReady, reviewReadyCount.toLocaleString()],
                  [appUi.analytics.kpis.qualifiedAccounts, qualifiedCount.toLocaleString()],
                  [appUi.analytics.kpis.exportsCompleted, analyticsSummary.totals.exportsCompleted.toLocaleString()]
                ].map(([label, value]) => (
                  <div key={label}>
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel analytics-funnel-panel">
              <p className="eyebrow">{appUi.analytics.workflowFunnel.eyebrow}</p>
              <h2>{appUi.analytics.workflowFunnel.title}</h2>
              <div className="analytics-funnel">
                {workflowFunnelSteps.map(([label, value, meta]) => (
                  <div className="analytics-funnel-step" key={label}>
                    <span>{label}</span>
                    <strong>{value}</strong>
                    <small>{meta}</small>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel analytics-list-panel">
              <p className="eyebrow">{appUi.analytics.stageMix.eyebrow}</p>
              <h2>{appUi.analytics.stageMix.title}</h2>
              <div className="analytics-simple-list">
                {pipelineStageOptions
                  .filter((stage) => workflowStageCounts[stage] > 0)
                  .map((stage) => (
                  <div key={stage}>
                    <strong>{formatPipelineStage(stage, appUi)}</strong>
                    <span>{formatMessage(appUi.analytics.stageMix.accountsSuffix, { count: workflowStageCounts[stage] })}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel analytics-list-panel">
              <p className="eyebrow">{appUi.analytics.queueSources.eyebrow}</p>
              <h2>{appUi.analytics.queueSources.title}</h2>
              <div className="analytics-simple-list">
                {batchSourceOptions
                  .filter((source) => queueSourceCounts[source] > 0)
                  .map((source) => (
                  <div key={source}>
                    <strong>{appUi.importer.sourceOptions[source]}</strong>
                    <span>{formatMessage(appUi.analytics.queueSources.accountsSuffix, { count: queueSourceCounts[source] })}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel analytics-events-panel">
              <p className="eyebrow">{appUi.analytics.scanOutcomes.eyebrow}</p>
              <h2>{appUi.analytics.scanOutcomes.title}</h2>
              <div className="analytics-kpi-grid analytics-kpi-grid-compact">
                {scanOutcomeCards.map(([label, value]) => (
                  <div key={label}>
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>
              <div className="analytics-simple-list">
                {failureReasonEntries.length ? (
                  failureReasonEntries.slice(0, 4).map(([reason, count]) => (
                    <div key={reason}>
                      <strong>{reason}</strong>
                      <span>{formatMessage(appUi.analytics.scanOutcomes.failureSuffix, { count })}</span>
                    </div>
                  ))
                ) : (
                  <div>
                    <strong>{appUi.analytics.scanOutcomes.noFailures}</strong>
                    <span>{appUi.analytics.scanOutcomes.noFailuresCopy}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="panel analytics-events-panel">
              <p className="eyebrow">{appUi.analytics.recentEvents.eyebrow}</p>
              <h2>{appUi.analytics.recentEvents.title}</h2>
              <div className="analytics-event-list">
                {analyticsSummary.recentEvents.slice(0, 6).map((event) => (
                  <article key={event.id}>
                    <div>
                      <strong>{formatAnalyticsEventName(event.name, appUi)}</strong>
                      <span>{event.pagePath || appUi.analytics.recentEvents.pageUnavailable}</span>
                    </div>
                    <small>
                      {formatAnalyticsMetadataSummary(event.metadataSummary, appUi) ||
                        formatHistoryTime(event.createdAt, locale, appUi.common.unknownTime)}
                    </small>
                  </article>
                ))}
              </div>
            </div>

            <div className="panel analytics-recommendations-panel">
              <p className="eyebrow">{appUi.analytics.recommendations.eyebrow}</p>
              <h2>{appUi.analytics.recommendations.title}</h2>
              <div className="policy-list">
                {workflowRecommendations.map((item) => (
                  <span key={item}>
                    <Icon name="check" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </section>
          )
        ) : null}

        {appSection === "settings" && !workspaceStateBlocked ? (
          <section className="app-page-grid account-page-grid">
            <div className="account-main-stack">
              {auth.authenticated ? (
                <>
                  {accountShowsWorkspaceAlertPanel ? (
                    <section className="panel account-alert-panel" aria-labelledby="account-alert-title">
                      <div className="account-alert-copy">
                        <p className="eyebrow">{accountSectionCopy.alert.eyebrow}</p>
                        <h2 id="account-alert-title">{accountSectionCopy.alert.title}</h2>
                        <p className="account-alert-message">{workspaceAlertMessage}</p>
                        <p className="panel-copy">{accountSectionCopy.alert.note}</p>
                      </div>
                      <div className="account-alert-actions">
                        <button className="button button-primary" type="button" onClick={() => window.location.reload()}>
                          <Icon name="browser" />
                          {appUi.dashboard.nextAction.retryWorkspace}
                        </button>
                      </div>
                    </section>
                  ) : null}

                  <div className="panel account-profile-panel">
                    <div className="panel-header">
                      <div>
                        <p className="eyebrow">{appUi.account.profile.eyebrow}</p>
                        <h2>{appUi.account.profile.title}</h2>
                      </div>
                      {profileSaveState === "saving" || profileSaveState === "saved" ? (
                        <span className="status-pill">
                          {profileSaveState === "saving" ? appUi.account.profile.statusSaving : appUi.account.profile.statusSaved}
                        </span>
                      ) : null}
                    </div>
                    <form className="icp-edit-form" onSubmit={submitProfile}>
                      <div className="account-form-grid">
                        <label>
                          {appUi.account.profile.ownerName}
                          <input
                            value={profileForm.name}
                            onChange={updateProfileField("name")}
                            placeholder={appUi.account.profile.ownerPlaceholder}
                          />
                          <small>{appUi.account.profile.ownerHelp}</small>
                        </label>
                        <label>
                          {appUi.account.profile.workspaceName}
                          <input
                            value={profileForm.workspaceName}
                            onChange={updateProfileField("workspaceName")}
                            placeholder={appUi.account.profile.workspacePlaceholder}
                          />
                          <small>{appUi.account.profile.workspaceHelp}</small>
                        </label>
                      </div>
                      <div className="icp-form-actions">
                        <button className="button button-primary" type="submit" disabled={profileSaveState === "saving"}>
                          <Icon name="check" />
                          {profileSaveState === "saving" ? appUi.account.profile.saving : appUi.account.profile.save}
                        </button>
                      </div>
                      <p
                        className={`form-status ${
                          profileSaveState === "error" ? "is-error" : profileSaveState === "saved" ? "is-success" : ""
                        }`}
                        role="status"
                      >
                        {profileMessage || " "}
                      </p>
                    </form>
                  </div>

                  <div className="panel account-password-panel">
                    <div className="panel-header">
                      <div>
                        <p className="eyebrow">{appUi.account.password.eyebrow}</p>
                        <h2>{appUi.account.password.title}</h2>
                      </div>
                      {accountPasswordState === "saving" || accountPasswordState === "saved" ? (
                        <span className="status-pill">
                          {accountPasswordState === "saving"
                            ? appUi.account.password.statusUpdating
                            : appUi.account.password.statusUpdated}
                        </span>
                      ) : null}
                    </div>
                    <form className="icp-edit-form" onSubmit={submitPasswordChange}>
                      <div className="account-password-form-grid">
                        <label>
                          {appUi.account.password.currentPassword}
                          <input
                            type={showAccountPassword ? "text" : "password"}
                            value={accountPasswordForm.currentPassword}
                            onChange={updateAccountPasswordField("currentPassword")}
                            autoComplete="current-password"
                            placeholder={appUi.account.password.currentPlaceholder}
                          />
                          <small>{appUi.account.password.currentHelp}</small>
                        </label>
                        <label>
                          {appUi.account.password.newPassword}
                          <input
                            type={showAccountPassword ? "text" : "password"}
                            value={accountPasswordForm.nextPassword}
                            onChange={updateAccountPasswordField("nextPassword")}
                            autoComplete="new-password"
                            minLength={8}
                            placeholder={appUi.account.password.newPlaceholder}
                          />
                          <small>{appUi.account.password.newHelp}</small>
                        </label>
                        <label>
                          {appUi.account.password.confirmPassword}
                          <input
                            type={showAccountPassword ? "text" : "password"}
                            value={accountPasswordForm.confirmPassword}
                            onChange={updateAccountPasswordField("confirmPassword")}
                            autoComplete="new-password"
                            minLength={8}
                            placeholder={appUi.account.password.confirmPlaceholder}
                          />
                        </label>
                      </div>
                      <div className="account-password-actions">
                        <label className="scan-depth-toggle account-password-visibility">
                          <input
                            type="checkbox"
                            checked={showAccountPassword}
                            onChange={() => setShowAccountPassword((current) => !current)}
                          />
                          <span>
                            {appUi.account.password.showFields}
                            <small>{appUi.account.password.showFieldsHelp}</small>
                          </span>
                        </label>
                        <button className="button button-primary" type="submit" disabled={accountPasswordState === "saving"}>
                          <Icon name="lock" />
                          {accountPasswordState === "saving" ? appUi.account.password.updating : appUi.account.password.update}
                        </button>
                      </div>
                      <p
                        className={`form-status ${
                          accountPasswordState === "error" ? "is-error" : accountPasswordState === "saved" ? "is-success" : ""
                        }`}
                        role="status"
                      >
                        {accountPasswordMessage || " "}
                      </p>
                    </form>
                  </div>
                </>
              ) : (
                <div className="panel account-preview-panel">
                  <p className="eyebrow">{appUi.account.profile.eyebrow}</p>
                  <h2>{appUi.account.profile.title}</h2>
                  <p className="panel-copy">{appUi.dashboard.nextAction.sampleCopy}</p>
                  <div className="page-empty-actions">
                    <a className="button button-secondary" href={buildLocalePath(locale, "/login")}>
                      <Icon name="mail" />
                      {appUi.actions.signIn}
                    </a>
                    <a className="button button-primary" href={buildLocalePath(locale, "/login")}>
                      <Icon name="mail" />
                      {appUi.dashboard.nextAction.startWorkspace}
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div className="account-side-stack">
              <div className="panel account-summary-panel">
                <p className="eyebrow">{appUi.account.summary.eyebrow}</p>
                <h2>{appUi.account.summary.title}</h2>
                <div className="account-card-list">
                  <div>
                    <span>{appUi.account.summary.signedInEmail}</span>
                    <strong>{auth.authenticated ? auth.user.email : appUi.common.notSet}</strong>
                  </div>
                  <div>
                    <span>{appUi.account.summary.workspace}</span>
                    <strong>{snapshot.workspace.name}</strong>
                  </div>
                  <div>
                    <span>{appUi.account.summary.plan}</span>
                    <strong>{snapshot.plan.name}</strong>
                  </div>
                  <div>
                    <span>{appUi.account.summary.nextCreditReset}</span>
                    <strong>{formatCalendarDate(snapshot.credits.reset)}</strong>
                  </div>
                </div>
              </div>

              {auth.authenticated ? (
                <div className="panel account-utility-panel">
                  <p className="eyebrow">{accountSectionCopy.utility.eyebrow}</p>
                  <h2>{accountSectionCopy.utility.title}</h2>
                  <p className="panel-copy">{accountSectionCopy.utility.copy}</p>
                  <div className="billing-actions">
                    <button
                      className="button button-secondary"
                      type="button"
                      onClick={() => {
                        void openBillingPortal();
                      }}
                    >
                      <Icon name="shield" />
                      {appUi.account.summary.manageBilling}
                    </button>
                    <button className="button button-secondary" type="button" onClick={signOut}>
                      <Icon name="lock" />
                      {appUi.account.summary.signOut}
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </section>
        ) : null}

        {appSection === "settings" && !workspaceStateBlocked ? (
          <section className="app-page-grid billing-page-grid">
            <div className="billing-summary-strip" aria-label={appUi.billing.meterLabel}>
              {billingSummaryCards.map(([label, value]) => (
                <div className="billing-summary-card" key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>

            <div className="billing-main-grid">
              <div className="panel billing-usage-panel">
                <div className="billing-panel-header">
                  <div>
                    <p className="eyebrow">{appUi.billing.usage.eyebrow}</p>
                    <h2>{formatMessage(appUi.billing.usage.title, { count: snapshot.credits.remaining.toLocaleString() })}</h2>
                  </div>
                  <span className={`status-pill ${subscriptionStatusDetails.tone}`}>{subscriptionStatusLabel}</span>
                </div>
                <p className="billing-usage-copy">
                  {formatMessage(appUi.billing.usage.summary, {
                    used: snapshot.credits.used.toLocaleString(),
                    plan: currentPlan.name
                  })}
                </p>
                <div className="credit-meter" aria-label={appUi.billing.meterLabel}>
                  <i
                    style={{
                      width: `${Math.min(100, (snapshot.credits.used / totalMonthlyCredits) * 100)}%`
                    }}
                  />
                </div>
                <div className="billing-meter-meta">
                  <span>
                    {appUi.billing.usage.usedLabel} · {snapshot.credits.used.toLocaleString()} · {formatMessage(appUi.billing.usage.usagePercent, {
                      count: creditUsagePercent.toLocaleString()
                    })}
                  </span>
                  <strong>
                    {appUi.billing.usage.totalLabel} · {totalMonthlyCredits.toLocaleString()}
                  </strong>
                </div>
                <div className="billing-kpis">
                  <div>
                    <span>{appUi.billing.kpis.subscription}</span>
                    <strong>{subscriptionStatusLabel}</strong>
                  </div>
                  <div>
                    <span>{appUi.billing.kpis.creditReset}</span>
                    <strong>{formatCalendarDate(snapshot.credits.reset)}</strong>
                  </div>
                  <div>
                    <span>{appUi.billing.kpis.billingPeriodEnd}</span>
                    <strong>{billingPeriodEndLabel}</strong>
                  </div>
                </div>
                <div className="billing-usage-points">
                  {[appUi.billing.policy.validation, appUi.billing.policy.access, appUi.billing.policy.basic].map((item) => (
                    <span key={item}>
                      <Icon name="check" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="panel billing-featured-plan-panel">
                <p className="eyebrow">{appUi.billing.plans.eyebrow}</p>
                <h2>{appUi.billing.plans.title}</h2>
                <p className="panel-copy">{subscriptionStatusDetails.nextStep}</p>
                <article className={`billing-featured-plan-card ${featuredPlanIsCurrent ? "is-current" : "is-recommended"}`}>
                  <div className="billing-featured-plan-top">
                    <div className="billing-plan-heading">
                      <span className={`plan-status-badge ${featuredPlanIsCurrent ? "is-current" : "is-recommended"}`}>
                        {featuredPlanIsCurrent ? appUi.billing.plans.currentPlanBadge : appUi.billing.plans.recommendedBadge}
                      </span>
                      <strong>{featuredPlan.name}</strong>
                      <small>{appUi.billing.plans.useCases[featuredPlan.id]}</small>
                    </div>
                    <div className="billing-plan-price">
                      <strong>{formatMessage(appUi.billing.plans.monthlyPrice, { price: featuredPlan.price.toLocaleString() })}</strong>
                      <span>{formatMessage(appUi.billing.plans.scansPerMonth, { count: featuredPlan.monthlyCredits.toLocaleString() })}</span>
                    </div>
                  </div>
                  <div className="billing-featured-meta">
                    <div>
                      <span>{appUi.billing.summary.currentPlan}</span>
                      <strong>{currentPlan.name}</strong>
                    </div>
                    <div>
                      <span>{appUi.billing.plans.includedCredits}</span>
                      <strong>{featuredPlan.monthlyCredits.toLocaleString()}</strong>
                    </div>
                    <div>
                      <span>{featuredPlanIsCurrent ? appUi.billing.status.subscriptionState : appUi.billing.plans.creditLift}</span>
                      <strong>
                        {featuredPlanIsCurrent
                          ? subscriptionStatusLabel
                          : formatMessage(appUi.billing.plans.additionalCredits, { count: featuredPlanDelta.toLocaleString() })}
                      </strong>
                    </div>
                  </div>
                  <div className="billing-actions">
                    <button
                      className={`button ${featuredPlanIsCurrent ? "button-secondary" : "button-primary"}`}
                      type="button"
                      onClick={() => handleBillingPlanAction(featuredPlan, featuredPlanIsCurrent)}
                    >
                      {featuredPlanIsCurrent
                        ? appUi.billing.plans.manageCurrent
                        : formatMessage(appUi.billing.plans.choosePlan, { plan: featuredPlan.name })}
                    </button>
                    <a className="button button-secondary" href="#billing-plan-compare">
                      {appUi.billing.actions.comparePlans}
                    </a>
                  </div>
                </article>
              </div>
            </div>

            <div className="panel billing-plan-panel" id="billing-plan-compare">
              <div className="panel-header">
                <div>
                  <p className="eyebrow">{appUi.billing.plans.compareEyebrow}</p>
                  <h2>{appUi.billing.plans.compareTitle}</h2>
                </div>
                <span className={`status-pill ${subscriptionStatusDetails.tone}`}>{subscriptionStatusLabel}</span>
              </div>
              <p className="panel-copy">{appUi.billing.plans.compareCopy}</p>
              <div className="billing-plan-list">
                {PRICING_PLANS.map((plan) => {
                  const isCurrent = plan.id === currentPlan.id;
                  const isRecommended = !featuredPlanIsCurrent && plan.id === featuredPlan.id;

                  return (
                    <article
                      className={`billing-plan-card ${isCurrent ? "is-current" : ""} ${isRecommended ? "is-recommended" : ""}`.trim()}
                      key={plan.id}
                    >
                      <div className="billing-plan-card-header">
                        <div className="billing-plan-heading">
                          <div className="billing-plan-tags">
                            {isCurrent ? <span className="plan-status-badge is-current">{appUi.billing.plans.currentPlanBadge}</span> : null}
                            {isRecommended ? <span className="plan-status-badge is-recommended">{appUi.billing.plans.recommendedBadge}</span> : null}
                          </div>
                          <strong>{plan.name}</strong>
                          <small>{appUi.billing.plans.useCases[plan.id]}</small>
                        </div>
                        <div className="billing-plan-price">
                          <strong>{formatMessage(appUi.billing.plans.monthlyPrice, { price: plan.price.toLocaleString() })}</strong>
                          <span>{formatMessage(appUi.billing.plans.scansPerMonth, { count: plan.monthlyCredits.toLocaleString() })}</span>
                        </div>
                      </div>
                      <div className="billing-plan-card-meta">
                        <span>{appUi.billing.plans.includedCredits}</span>
                        <strong>{plan.monthlyCredits.toLocaleString()}</strong>
                      </div>
                      <p>{appUi.billing.plans.useCases[plan.id]}</p>
                      <button
                        className={`button ${isCurrent ? "button-secondary" : isRecommended ? "button-primary" : "button-secondary"}`}
                        type="button"
                        onClick={() => handleBillingPlanAction(plan, isCurrent)}
                      >
                        {isCurrent
                          ? auth.authenticated
                            ? appUi.billing.plans.manageCurrent
                            : appUi.actions.signIn
                          : formatMessage(appUi.billing.plans.choosePlan, { plan: plan.name })}
                      </button>
                    </article>
                  );
                })}
              </div>
            </div>

            <div className="billing-secondary-grid">
              <div className="panel billing-policy-panel">
                <p className="eyebrow">{appUi.billing.policy.eyebrow}</p>
                <h2>{appUi.billing.policy.title}</h2>
                <p className="panel-copy">{appUi.billing.policy.basic}</p>
                <div className="policy-list">
                  {[
                    appUi.billing.policy.validation,
                    appUi.billing.policy.access,
                    appUi.billing.policy.duplicate,
                    appUi.billing.policy.basic,
                    appUi.billing.policy.deep
                  ].map((item) => (
                    <span key={item}>
                      <Icon name="check" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="panel billing-status-panel">
                <div className="panel-header">
                  <div>
                    <p className="eyebrow">{appUi.billing.status.eyebrow}</p>
                    <h2>{appUi.billing.status.title}</h2>
                  </div>
                  <span className={`status-pill ${subscriptionStatusDetails.tone}`}>{subscriptionStatusLabel}</span>
                </div>
                <p className="billing-status-copy">
                  {auth.authenticated ? subscriptionStatusDetails.summary : appUi.billing.status.unauthenticatedHint}
                </p>
                <div className="account-card-list">
                  <div>
                    <span>{appUi.billing.status.workspaceStatus}</span>
                    <strong>{workspaceStatusLabel}</strong>
                  </div>
                  <div>
                    <span>{appUi.billing.status.subscriptionState}</span>
                    <strong>{subscriptionStatusLabel}</strong>
                  </div>
                  <div>
                    <span>{appUi.billing.status.remainingCredits}</span>
                    <strong>{snapshot.credits.remaining.toLocaleString()}</strong>
                  </div>
                  <div>
                    <span>{appUi.billing.status.exportMode}</span>
                    <strong>{bulkExportLabel(bulkExportPreset, bulkCrmFieldMode, appUi)}</strong>
                  </div>
                </div>
                <div className="billing-status-next-step">
                  <span>{appUi.billing.status.nextStep}</span>
                  <strong>{auth.authenticated ? subscriptionStatusDetails.nextStep : appUi.billing.status.unauthenticatedHint}</strong>
                </div>
                <div className="billing-actions">
                  <a className="button button-secondary" href="/support">
                    {appUi.billing.actions.faq}
                  </a>
                </div>
              </div>
            </div>
            {auth.authenticated ? (
            <div className="panel scan-history-panel">
              <div className="panel-header">
                <div>
                  <p className="eyebrow">{appUi.billing.scanHistory.eyebrow}</p>
                  <h2>{appUi.billing.scanHistory.title}</h2>
                </div>
                <span className="status-pill">
                  {historyState === "loading"
                    ? appUi.common.loading
                    : historyState === "error"
                      ? appUi.common.failed
                    : historyState === "sample"
                      ? appUi.common.sample
                      : formatMessage(appUi.billing.scanHistory.records, { count: scanHistory.length })}
                </span>
              </div>
              <div className="scan-history-toolbar" aria-label={appUi.billing.scanHistory.filtersLabel}>
                {scanHistoryFilters.map((filter) => (
                  <button
                    className={`history-filter ${historyFilter === filter ? "is-active" : ""}`}
                    type="button"
                    key={filter}
                    onClick={() => {
                      setHistoryFilter(filter);
                      setExpandedScanId(null);
                    }}
                    aria-pressed={historyFilter === filter}
                  >
                    <span>{appUi.options.scanHistoryFilters[filter]}</span>
                    <strong>{historyCounts[filter]}</strong>
                  </button>
                ))}
              </div>
              <div className="history-secondary-filters" aria-label={appUi.billing.scanHistory.secondaryFiltersLabel}>
                <label>
                  {appUi.billing.scanHistory.dateRange}
                  <select
                    value={historyDateFilter}
                    onChange={(event) => {
                      setHistoryDateFilter(event.currentTarget.value as HistoryDateFilter);
                      setExpandedScanId(null);
                    }}
                  >
                    {historyDateFilters.map((filter) => (
                      <option value={filter} key={filter}>
                        {appUi.options.historyDateFilters[filter]}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  {appUi.billing.scanHistory.failureReason}
                  <select
                    value={historyReasonFilter}
                    onChange={(event) => {
                      setHistoryReasonFilter(event.currentTarget.value);
                      if (event.currentTarget.value !== "all") {
                        setHistoryFilter("failed");
                      }
                      setExpandedScanId(null);
                    }}
                  >
                    <option value="all">{appUi.billing.scanHistory.allFailureReasons}</option>
                    {failureReasonEntries.map(([reason]) => (
                      <option value={reason} key={reason}>
                        {formatHistoryReason(reason, appUi)}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  className="button button-secondary button-small"
                  type="button"
                  onClick={resetHistorySecondaryFilters}
                  disabled={!historySecondaryFiltersActive}
                >
                  {appUi.billing.scanHistory.clearSecondaryFilters}
                </button>
                <span aria-live="polite">
                  {formatMessage(appUi.billing.scanHistory.matchingRecords, { count: filteredScanHistory.length })}
                </span>
              </div>
              <div className="failure-reason-summary" aria-label={appUi.billing.scanHistory.failureBreakdownLabel}>
                <div>
                  <span>{appUi.billing.scanHistory.failedScans}</span>
                  <strong>{historyCounts.failed}</strong>
                </div>
                {failureReasonEntries.length ? (
                  <div className="failure-reason-chips">
                    {failureReasonEntries.map(([reason, count]) => (
                      <button
                        type="button"
                        key={reason}
                        onClick={() => {
                          setHistoryFilter("failed");
                          setHistoryReasonFilter(reason);
                          setExpandedScanId(null);
                        }}
                      >
                        <span>{formatHistoryReason(reason, appUi)}</span>
                        <strong>{count}</strong>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p>{appUi.billing.scanHistory.noFailedScans}</p>
                )}
              </div>
              <div className="scan-history-list" role="list" aria-label={appUi.billing.scanHistory.listLabel}>
                {filteredScanHistory.length ? (
                  filteredScanHistory.map((scan) => (
                    <article
                      className={`scan-history-row ${expandedScanId === scan.id ? "is-expanded" : ""}`}
                      role="listitem"
                      key={scan.id}
                    >
                      <button
                        className="scan-history-summary"
                        type="button"
                        onClick={() => setExpandedScanId((current) => (current === scan.id ? null : scan.id))}
                        aria-expanded={expandedScanId === scan.id}
                      >
                        <div>
                          <span className={`history-status history-status-${scan.status}`}>
                            {appUi.options.scanHistoryFilters[scan.status]}
                          </span>
                          <strong>{scan.companyName || scan.domain}</strong>
                          <small>{scan.url}</small>
                        </div>
                        <div>
                          <span>{formatScanTypeLabel(scan.scanType, appUi)}</span>
                          <span>{formatHistoryReason(scan.reason, appUi)}</span>
                        </div>
                        <div>
                          <strong>{scan.creditsCharged}</strong>
                          <span>{appUi.billing.scanHistory.creditsCharged}</span>
                        </div>
                        <time dateTime={scan.createdAt}>{formatHistoryTime(scan.createdAt, locale, appUi.common.unknownTime)}</time>
                        <span className="history-expand-cue">
                          {expandedScanId === scan.id ? appUi.billing.scanHistory.hide : appUi.billing.scanHistory.details}
                        </span>
                      </button>
                      {expandedScanId === scan.id ? (
                        <div className="scan-history-details">
                          <div>
                            <span>{appUi.billing.scanHistory.scanId}</span>
                            <code>{scan.id}</code>
                          </div>
                          <div>
                            <span>{appUi.billing.scanHistory.idempotencyKey}</span>
                            <code>{scan.idempotencyKey || appUi.billing.scanHistory.notRecorded}</code>
                          </div>
                          <div>
                            <span>{appUi.billing.scanHistory.leadId}</span>
                            <code>{scan.leadId || appUi.billing.scanHistory.noLeadSaved}</code>
                          </div>
                          <div>
                            <span>{appUi.billing.scanHistory.completed}</span>
                            <code>
                              {scan.completedAt
                                ? formatHistoryTime(scan.completedAt, locale, appUi.common.unknownTime)
                                : appUi.billing.scanHistory.notCompleted}
                            </code>
                          </div>
                          <div className="scan-history-detail-action">
                            <span>{appUi.billing.scanHistory.prospectCard}</span>
                            {scan.leadId ? (
                              <a href={leadDetailHref(scan.leadId) || "/app/leads"}>{appUi.billing.scanHistory.openLeadDetail}</a>
                            ) : (
                              <code>{appUi.billing.scanHistory.noLeadSaved}</code>
                            )}
                          </div>
                          <p className={scan.status === "failed" ? "history-detail-note is-error" : "history-detail-note"}>
                            {scan.status === "failed"
                              ? appUi.billing.scanHistory.failedNote
                              : scan.status === "replayed"
                                ? appUi.billing.scanHistory.replayedNote
                                : appUi.billing.scanHistory.successNote}
                          </p>
                        </div>
                      ) : null}
                    </article>
                  ))
                ) : (
                  <div className="detail-empty-state">
                    <strong>
                      {scanHistory.length
                        ? appUi.billing.scanHistory.emptyFilteredTitle
                        : appUi.billing.scanHistory.emptyTitle}
                    </strong>
                    <span>
                      {scanHistory.length
                        ? appUi.billing.scanHistory.emptyFilteredCopy
                        : appUi.billing.scanHistory.emptyCopy}
                    </span>
                  </div>
                )}
              </div>
            </div>
            ) : null}
          </section>
        ) : null}
      </main>
      </div>
    </div>
  );
}

function HomeProspectPreview({ card }: { card: ProspectCardType }) {
  const { siteUi } = usePublicSite();
  const previewCopy = siteUi.home.sampleCard;
  const firstLine = card.firstLines[0] || previewCopy.noFirstLineLabel;
  const topSignals = card.opportunitySignals.slice(0, 3);
  const shortEmailLines = card.shortEmail.split(/\n+/).filter(Boolean);
  const contactCount =
    card.contactPoints.emails.length +
    card.contactPoints.phones.length +
    card.contactPoints.contactPages.length +
    card.contactPoints.socialLinks.length;

  return (
    <article className="home-prospect-preview" aria-label={previewCopy.previewAriaLabel}>
      <div className="home-preview-header">
        <div>
          <p className="eyebrow">{previewCopy.previewEyebrow}</p>
          <h3>{card.companyName}</h3>
          <span>{card.domain}</span>
        </div>
        <div className="home-preview-score">
          <strong>{card.fitScore}</strong>
          <span>{previewCopy.fitLabel}</span>
        </div>
      </div>

      <div className="home-preview-meta" aria-label={previewCopy.summaryAriaLabel}>
        <div>
          <span>{previewCopy.confidenceLabel}</span>
          <strong>{Math.round(card.confidenceScore * 100)}%</strong>
        </div>
        <div>
          <span>{previewCopy.signalsLabel}</span>
          <strong>{card.opportunitySignals.length}</strong>
        </div>
        <div>
          <span>{previewCopy.contactPathsLabel}</span>
          <strong>{contactCount || previewCopy.noneLabel}</strong>
        </div>
      </div>

      <div className="home-preview-panels">
        <section className="home-preview-panel home-preview-signals">
          <div className="home-preview-panel-head">
            <span>{previewCopy.websiteEvidenceLabel}</span>
            <strong>{`${topSignals.length} ${previewCopy.cuesSuffix}`}</strong>
          </div>
          <div className="home-signal-stack">
            {topSignals.map((signal) => (
              <div className="home-signal-row" key={`${signal.category}-${signal.signal}`}>
                <span>{signal.category.replace("_", " ")}</span>
                <strong>{signal.signal}</strong>
                <small>{`${previewCopy.sourceLabel}: ${signal.source}`}</small>
              </div>
            ))}
          </div>
        </section>

        <section className="home-preview-panel home-preview-outcome">
          <div className="home-preview-panel-head">
            <span>{previewCopy.bestFirstLineLabel}</span>
            <strong>{previewCopy.copyReadyLabel}</strong>
          </div>
          <p>{firstLine}</p>
        </section>

        <section className="home-preview-panel home-preview-email">
          <div className="home-preview-panel-head">
            <span>{previewCopy.shortEmailLabel}</span>
            <strong>{previewCopy.replyReadyLabel}</strong>
          </div>
          <pre>{shortEmailLines.join("\n\n")}</pre>
        </section>
      </div>

      <div className="home-preview-footer" aria-label={previewCopy.proofAriaLabel}>
        {previewCopy.exportFields.map((item) => (
          <span key={item}>
            <Icon name="check" />
            {item}
          </span>
        ))}
      </div>
    </article>
  );
}

function ProspectCard({
  card,
  compact = false,
  workspaceControls = false,
  leadId = null,
  enableDeepLink = false,
  onContextSaved
}: {
  card: ProspectCardType;
  compact?: boolean;
  workspaceControls?: boolean;
  leadId?: string | null;
  enableDeepLink?: boolean;
  onContextSaved?: (result: PipelineContextSaveResult) => void;
}) {
  const { locale, formatMessage, siteUi } = usePublicSite();
  const appUi = getAppUi(locale);
  const [copyState, setCopyState] = useState<{ key: string; status: "copied" | "error" } | null>(null);
  const [exportSelection, setExportSelection] = useState<Record<ProspectExportFieldKey, boolean>>(
    defaultProspectExportSelection
  );
  const [exportPreset, setExportPreset] = useState<ProspectExportPresetKey>("brief");
  const [crmFieldMode, setCrmFieldMode] = useState<ProspectCrmFieldMode>("hubspot");
  const [metaFields, setMetaFields] = useState<ProspectPipelineContext>(() => ({
    ...normalizeProspectMeta(card.pipelineContext)
  }));
  const [metaSaveState, setMetaSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [activeTab, setActiveTab] = useState<ProspectCardTab>(() =>
    enableDeepLink ? getProspectTabFromLocation() : "overview"
  );
  const [activityFieldFilter, setActivityFieldFilter] = useState<ActivityFieldFilter>("all");
  const [expandedActivityId, setExpandedActivityId] = useState<string | null>(null);
  const firstLine = card.firstLines[0] || siteUi.home.sampleCard.noFirstLineLabel;
  const stageLabel = appUi.options.pipelineStages[metaFields.stage] || appUi.options.pipelineStages.researching;
  const tabIdPrefix = `prospect-${slugifyFilePart(card.domain)}`;

  useEffect(() => {
    const nextTab = enableDeepLink ? getProspectTabFromLocation() : "overview";
    setMetaFields({ ...normalizeProspectMeta(card.pipelineContext) });
    setMetaSaveState("idle");
    setActiveTab(nextTab);
    setActivityFieldFilter("all");
    setExpandedActivityId(null);

    if (enableDeepLink) {
      replaceLeadDeepLink(leadId, nextTab);
    }
  }, [card.domain, enableDeepLink, leadId]);

  useEffect(() => {
    setMetaFields({ ...normalizeProspectMeta(card.pipelineContext) });
  }, [card.pipelineContext?.owner, card.pipelineContext?.stage, card.pipelineContext?.notes, card.pipelineContext?.updatedAt]);

  const contactGroups = [
    {
      label: appUi.prospectCard.contactLabels.emails,
      value: formatCardList(card.contactPoints.emails, appUi.common.noneFound)
    },
    {
      label: appUi.prospectCard.contactLabels.phones,
      value: formatCardList(card.contactPoints.phones, appUi.common.noneFound)
    },
    {
      label: appUi.prospectCard.contactLabels.contactPages,
      value: formatCardList(card.contactPoints.contactPages, appUi.common.noneFound)
    },
    {
      label: appUi.prospectCard.contactLabels.socialLinks,
      value: formatCardList(card.contactPoints.socialLinks, appUi.common.noneFound)
    }
  ];
  const topSignals = card.opportunitySignals.slice(0, 3);
  const contactFoundCount = [
    card.contactPoints.emails,
    card.contactPoints.phones,
    card.contactPoints.contactPages,
    card.contactPoints.socialLinks
  ].filter((group) => group.length).length;
  const pipelineActivity = card.pipelineActivity || [];
  const localizedExportFields = prospectExportFields.map((field) => ({
    ...field,
    label: appUi.prospectCard.export.fields[field.key]
  }));
  const localizedExportPresets = prospectExportPresets.map((preset) => ({
    ...preset,
    label: appUi.prospectCard.export.presets[preset.key].label,
    description: appUi.prospectCard.export.presets[preset.key].description
  }));
  const localizedCrmFieldModes = prospectCrmFieldModes.map((mode) => ({
    ...mode,
    label: appUi.prospectCard.export.crmModes[mode.value].label,
    description: appUi.prospectCard.export.crmModes[mode.value].description
  }));
  const copyLabels = appUi.prospectCard.copyLabels;
  const fullCardText = [
    `${card.companyName} - ${card.website}`,
    `${copyLabels.fitScore}: ${card.fitScore}`,
    `${copyLabels.confidence}: ${Math.round(card.confidenceScore * 100)}%`,
    `${copyLabels.industry}: ${card.industry}`,
    `${copyLabels.owner}: ${metaFields.owner || appUi.common.unassigned}`,
    `${copyLabels.pipelineStage}: ${stageLabel}`,
    `${copyLabels.notes}: ${metaFields.notes || appUi.common.none}`,
    `${copyLabels.summary}: ${card.summary}`,
    `${copyLabels.fitReason}: ${card.fitReason}`,
    `${copyLabels.signals}: ${card.opportunitySignals.map((signal) => `${formatSignalCategory(signal.category, appUi)}: ${signal.signal}`).join("; ")}`,
    `${copyLabels.firstLine}: ${firstLine}`,
    `${copyLabels.shortEmail}:\n${card.shortEmail}`
  ].join("\n");
  const emailDraftText = [formatMessage(copyLabels.subjectLine, { company: card.companyName }), "", card.shortEmail].join("\n");
  const exportSections: Record<ProspectExportFieldKey, string> = {
    identity: [
      `${copyLabels.company}: ${card.companyName}`,
      `${appUi.prospectCard.website}: ${card.website}`,
      `${copyLabels.domain}: ${card.domain}`,
      `${copyLabels.industry}: ${card.industry}`,
      `${copyLabels.confidence}: ${Math.round(card.confidenceScore * 100)}%`,
      `${copyLabels.owner}: ${metaFields.owner || appUi.common.unassigned}`,
      `${copyLabels.pipelineStage}: ${stageLabel}`,
      `${copyLabels.notes}: ${metaFields.notes || appUi.common.none}`
    ].join("\n"),
    fit: [
      `${copyLabels.fitScore}: ${card.fitScore}`,
      `${copyLabels.summary}: ${card.summary}`,
      `${copyLabels.fitReason}: ${card.fitReason}`
    ].join("\n"),
    signals: card.opportunitySignals
      .map(
        (signal) =>
          `- ${formatSignalCategory(signal.category, appUi)}: ${signal.signal} (${copyLabels.source}: ${signal.source})`
      )
      .join("\n"),
    contacts: contactGroups.map((group) => `${group.label}: ${group.value}`).join("\n"),
    angles: card.outreachAngles.map((angle) => `- ${angle}`).join("\n"),
    firstLine,
    email: card.shortEmail,
    sources: card.sourceNotes.map((note) => `- ${note.claim} (${copyLabels.source}: ${note.source})`).join("\n")
  };
  const activePreset = exportPreset === "custom" ? null : localizedExportPresets.find((preset) => preset.key === exportPreset) || null;
  const activityFieldCounts = useMemo(
    () =>
      pipelineActivity.reduce<Record<ActivityFieldFilter, number>>(
        (counts, activity) => {
          counts.all += 1;
          activity.changedFields.forEach((field) => {
            counts[field] += 1;
          });
          return counts;
        },
        { all: 0, owner: 0, stage: 0, notes: 0 }
      ),
    [pipelineActivity]
  );
  const filteredPipelineActivity = useMemo(
    () =>
      activityFieldFilter === "all"
        ? pipelineActivity
        : pipelineActivity.filter((activity) => activity.changedFields.includes(activityFieldFilter)),
    [activityFieldFilter, pipelineActivity]
  );
  const activePresetColumns = activePreset ? getProspectExportColumns(activePreset.key, crmFieldMode) : [];
  const presetExportText = activePreset
    ? buildProspectExportCsv([{ card, pipelineContext: metaFields }], activePreset.key, crmFieldMode)
    : "";
  const selectedExportFields = localizedExportFields.filter((field) => exportSelection[field.key]);
  const customExportText = selectedExportFields
    .map((field) => `${field.label}\n${exportSections[field.key] || appUi.common.noData}`)
    .join("\n\n");
  const selectedExportText = activePreset ? presetExportText : customExportText;
  const selectedExportCopyLabel = activePreset ? appUi.prospectCard.export.copyCsvRow : appUi.prospectCard.export.copySelected;
  const selectedExportDownloadLabel = activePreset ? appUi.prospectCard.export.downloadCsv : appUi.prospectCard.export.downloadFields;
  const selectedExportFilename = activePreset
    ? `${slugifyFilePart(card.companyName)}-${activePreset.key}${activePreset.key === "crm" ? `-${crmFieldMode}` : ""}-export.csv`
    : `${slugifyFilePart(card.companyName)}-prospect-fields.txt`;
  const shareUrl = currentLeadDeepLink(leadId, activeTab);
  const copyMenuItems = [
    { key: "full-card", label: appUi.prospectCard.copyMenu.fullCard, value: fullCardText },
    { key: "website", label: appUi.prospectCard.copyMenu.website, value: card.website },
    { key: "share-link", label: appUi.prospectCard.copyMenu.cardLink, value: shareUrl },
    { key: "first-line", label: appUi.prospectCard.copyMenu.firstLine, value: firstLine },
    {
      key: "signals",
      label: appUi.prospectCard.copyMenu.signals,
      value: card.opportunitySignals
        .map(
          (signal) =>
            `${formatSignalCategory(signal.category, appUi)}: ${signal.signal} ${copyLabels.source}: ${signal.source}`
        )
        .join("\n")
    },
    {
      key: "contact-paths",
      label: appUi.prospectCard.copyMenu.contactPaths,
      value: contactGroups.map((group) => `${group.label}: ${group.value}`).join("\n")
    },
    {
      key: "source-notes",
      label: appUi.prospectCard.copyMenu.sourceNotes,
      value: card.sourceNotes.map((note) => `${note.claim} ${copyLabels.source}: ${note.source}`).join("\n")
    },
    {
      key: "selected-fields",
      label: activePreset ? `${appUi.common.copy} ${activePreset.label}` : appUi.prospectCard.copyMenu.selectedFields,
      value: selectedExportText
    }
  ];

  async function copyCardValue(key: string, value: string) {
    const copied = await copyToClipboard(value);
    setCopyState({ key, status: copied ? "copied" : "error" });
    window.setTimeout(() => {
      setCopyState((current) => (current?.key === key ? null : current));
    }, 1600);
  }

  function toggleExportField(field: ProspectExportFieldKey) {
    setExportPreset("custom");
    setExportSelection((current) => ({
      ...current,
      [field]: !current[field]
    }));
  }

  function applyExportPreset(presetKey: Exclude<ProspectExportPresetKey, "custom">) {
    const preset = prospectExportPresets.find((item) => item.key === presetKey);

    if (!preset) {
      return;
    }

    const fields = new Set(preset.fields);
    setExportPreset(preset.key);
    setExportSelection(
      prospectExportFields.reduce<Record<ProspectExportFieldKey, boolean>>((next, field) => {
        next[field.key] = fields.has(field.key);
        return next;
      }, { ...defaultProspectExportSelection })
    );
  }

  function downloadSelectedFields() {
    if (!selectedExportText.trim()) {
      setCopyState({ key: "download-selected", status: "error" });
      return;
    }

    downloadTextFile(selectedExportFilename, selectedExportText);
    setCopyState({ key: "download-selected", status: "copied" });
    window.setTimeout(() => {
      setCopyState((current) => (current?.key === "download-selected" ? null : current));
    }, 1600);
  }

  function renderActivityLog() {
    return (
      <section className="prospect-activity-log" aria-label={appUi.prospectCard.activity.panelLabel}>
        <div className="prospect-section-head">
          <span>{appUi.prospectCard.activity.title}</span>
          <strong>
            {pipelineActivity.length
              ? formatMessage(appUi.prospectCard.activity.recent, { count: pipelineActivity.length })
              : appUi.prospectCard.activity.noChangesYet}
          </strong>
        </div>
        <div className="activity-log-toolbar" role="group" aria-label={appUi.prospectCard.activity.filterLabel}>
          {activityFieldFilters.map((filter) => (
            <button
              className={activityFieldFilter === filter ? "is-active" : ""}
              type="button"
              aria-pressed={activityFieldFilter === filter}
              onClick={() => {
                setActivityFieldFilter(filter);
                setExpandedActivityId(null);
              }}
              key={filter}
            >
              <span>{appUi.options.activityFields[filter]}</span>
              <strong>{activityFieldCounts[filter]}</strong>
            </button>
          ))}
        </div>
        {filteredPipelineActivity.length ? (
          <div className="activity-log-list">
            {filteredPipelineActivity.slice(0, 8).map((activity) => {
              const isExpanded = expandedActivityId === activity.id;

              return (
                <article className={`activity-log-item ${isExpanded ? "is-expanded" : ""}`} key={activity.id}>
                  <button
                    className="activity-log-summary"
                    type="button"
                    aria-expanded={isExpanded}
                    onClick={() => setExpandedActivityId((current) => (current === activity.id ? null : activity.id))}
                  >
                    <span className="activity-log-actor">
                      <strong>{activity.actorName}</strong>
                      {activity.actorEmail ? <small>{activity.actorEmail}</small> : null}
                    </span>
                    <span>
                      {formatMessage(appUi.prospectCard.activity.changed, {
                        fields: activity.changedFields.map((field) => formatActivityFieldLabel(field, appUi)).join(", "),
                        time: formatHistoryTime(activity.createdAt, locale, appUi.common.unknownTime)
                      })}
                    </span>
                    <span className="activity-log-expand-cue">
                      {isExpanded ? appUi.prospectCard.activity.hideDiff : appUi.prospectCard.activity.showDiff}
                    </span>
                  </button>
                  {isExpanded ? (
                    <div className="activity-diff-grid" aria-label={appUi.prospectCard.activity.diffLabel}>
                      {activity.changedFields.map((field) => (
                        <div className="activity-diff-row" key={`${activity.id}-${field}`}>
                          <span>{formatActivityFieldLabel(field, appUi)}</span>
                          <div>
                            <strong>{appUi.common.previous}</strong>
                            <code>{formatActivityContextValue(activity.previousValues, field, appUi)}</code>
                          </div>
                          <div>
                            <strong>{appUi.common.current}</strong>
                            <code>{formatActivityContextValue(activity.currentValues, field, appUi)}</code>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        ) : (
          <p>
            {pipelineActivity.length
              ? appUi.prospectCard.activity.noMatch
              : appUi.prospectCard.activity.empty}
          </p>
        )}
      </section>
    );
  }

  function updateProspectMeta(field: "owner" | "notes", value: string) {
    setMetaFields((current) => ({ ...current, [field]: value }));
    setMetaSaveState("idle");
  }

  function updateProspectStage(value: ProspectPipelineStage) {
    setMetaFields((current) => ({ ...current, stage: value }));
    setMetaSaveState("idle");
  }

  async function saveProspectMeta() {
    if (!leadId) {
      setMetaSaveState("error");
      return;
    }

    const payload: ProspectContextUpdateRequest = {
      owner: metaFields.owner.trim(),
      stage: metaFields.stage,
      notes: metaFields.notes.trim()
    };

    setMetaSaveState("saving");

    try {
      const response = await fetch(apiUrl(`/api/leads/${encodeURIComponent(leadId)}/context`), {
        method: "PATCH",
        credentials: "include",
        headers: withAppLocaleHeader(locale, {
          "Content-Type": "application/json"
        }),
        body: JSON.stringify(payload)
      });
      const result = (await response.json().catch(() => ({}))) as {
        context?: ProspectPipelineContext;
        activity?: ProspectPipelineActivity | null;
        queueItem?: WorkspaceQueueItem | null;
        error?: string;
      };

      if (!response.ok || !result.context) {
        throw new Error(result.error || "Unable to save pipeline context.");
      }

      const next = normalizeProspectMeta(result.context);
      setMetaFields(next);
      setMetaSaveState("saved");
      onContextSaved?.({ context: next, activity: result.activity || null, queueItem: result.queueItem || null });
    } catch {
      setMetaSaveState("error");
    }
  }

  function selectProspectTab(tab: ProspectCardTab) {
    setActiveTab(tab);

    if (enableDeepLink) {
      replaceLeadDeepLink(leadId, tab);
    }
  }

  function tabButtonId(tab: ProspectCardTab) {
    return `${tabIdPrefix}-tab-${tab}`;
  }

  function tabPanelId(tab: ProspectCardTab) {
    return `${tabIdPrefix}-panel-${tab}`;
  }

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, tab: ProspectCardTab) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft" && event.key !== "Home" && event.key !== "End") {
      return;
    }

    event.preventDefault();
    const currentIndex = prospectCardTabs.findIndex((item) => item === tab);
    const lastIndex = prospectCardTabs.length - 1;
    const nextIndex =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? lastIndex
          : event.key === "ArrowRight"
            ? currentIndex === lastIndex
              ? 0
              : currentIndex + 1
            : currentIndex === 0
              ? lastIndex
              : currentIndex - 1;
    const nextTab = prospectCardTabs[nextIndex];
    selectProspectTab(nextTab);
    window.requestAnimationFrame(() => document.getElementById(tabButtonId(nextTab))?.focus());
  }

  function renderExportPanel() {
    return (
      <section className="prospect-export-panel" aria-label={appUi.prospectCard.export.panelLabel}>
        <div className="prospect-section-head">
          <span>{appUi.prospectCard.export.title}</span>
          <strong>
            {formatMessage(appUi.prospectCard.export.selected, {
              selected: selectedExportFields.length,
              total: localizedExportFields.length
            })}
          </strong>
        </div>
        <div className="export-preset-grid" role="group" aria-label={appUi.prospectCard.export.presetsLabel}>
          {localizedExportPresets.map((preset) => (
            <button
              className={exportPreset === preset.key ? "is-active" : ""}
              type="button"
              aria-pressed={exportPreset === preset.key}
              onClick={() => applyExportPreset(preset.key)}
              key={preset.key}
            >
              <strong>{preset.label}</strong>
              <span>{preset.description}</span>
            </button>
          ))}
        </div>
        {activePreset?.key === "crm" ? (
          <div className="crm-field-mode-grid" role="group" aria-label={appUi.prospectCard.export.crmModesLabel}>
            {localizedCrmFieldModes.map((mode) => (
              <button
                className={crmFieldMode === mode.value ? "is-active" : ""}
                type="button"
                aria-pressed={crmFieldMode === mode.value}
                onClick={() => setCrmFieldMode(mode.value)}
                key={mode.value}
              >
                <strong>{mode.label}</strong>
                <span>{mode.description}</span>
              </button>
            ))}
          </div>
        ) : null}
        {activePreset ? (
          <div className="export-column-map" aria-label={formatMessage(appUi.prospectCard.export.columns, { label: activePreset.label })}>
            <span>
              {activePreset.key === "crm"
                ? formatMessage(appUi.prospectCard.export.columns, {
                    label: bulkExportLabel(activePreset.key, crmFieldMode, appUi)
                  })
                : appUi.prospectCard.export.csvColumns}
            </span>
            <code>{activePresetColumns.map((column) => column.label).join(", ")}</code>
          </div>
        ) : null}
        <div className="export-field-grid">
          {localizedExportFields.map((field) => (
            <label key={field.key}>
              <input
                type="checkbox"
                checked={exportSelection[field.key]}
                onChange={() => toggleExportField(field.key)}
              />
              <span>{field.label}</span>
            </label>
          ))}
        </div>
        <div className="export-field-actions">
          <CopyButton
            copyKey="selected-fields"
            label={selectedExportCopyLabel}
            state={copyState}
            value={selectedExportText}
            onCopy={copyCardValue}
          />
          <button
            className={`copy-chip ${copyState?.key === "download-selected" ? `is-${copyState.status}` : ""}`}
            type="button"
            onClick={downloadSelectedFields}
            disabled={!selectedExportFields.length}
          >
            <Icon name="download" />
            {copyState?.key === "download-selected"
              ? copyState.status === "copied"
                ? appUi.common.downloaded
                : appUi.common.failed
              : selectedExportDownloadLabel}
          </button>
        </div>
      </section>
    );
  }

  function renderTabPanel() {
    if (activeTab === "signals") {
      return (
        <section className="prospect-card-section">
          <div className="prospect-section-head">
            <span>{appUi.prospectCard.signals.title}</span>
            <strong>{formatMessage(appUi.prospectCard.signals.findings, { count: card.opportunitySignals.length })}</strong>
          </div>
          <SignalList signals={card.opportunitySignals} />
        </section>
      );
    }

    if (activeTab === "contacts") {
      return (
        <section className="prospect-card-section">
          <div className="prospect-section-head">
            <span>{appUi.prospectCard.contacts.title}</span>
            <strong>{formatMessage(appUi.prospectCard.contacts.found, { count: contactFoundCount })}</strong>
          </div>
          <div className="contact-field-grid">
            {contactGroups.map((group) => (
              <div className="contact-field" key={group.label}>
                <span>{group.label}</span>
                <strong>{group.value}</strong>
              </div>
            ))}
          </div>
        </section>
      );
    }

    if (activeTab === "outreach") {
      return (
        <div className="prospect-tab-stack">
          <div className="first-line-box">
            <div className="prospect-section-head">
              <span>{appUi.prospectCard.outreach.bestFirstLine}</span>
              <strong>{appUi.prospectCard.outreach.readyToPaste}</strong>
            </div>
            <p>{firstLine}</p>
          </div>
          <section className="prospect-card-section">
            <div className="prospect-section-head">
              <span>{appUi.prospectCard.outreach.angles}</span>
              <strong>{formatMessage(appUi.prospectCard.outreach.count, { count: card.outreachAngles.length })}</strong>
            </div>
            <div className="angle-list">
              {card.outreachAngles.map((angle) => (
                <span key={angle}>{angle}</span>
              ))}
            </div>
          </section>
        </div>
      );
    }

    if (activeTab === "email") {
      return (
        <div className="email-box">
          <div className="prospect-section-head">
            <span>{appUi.prospectCard.email.title}</span>
            <CopyButton
              copyKey="short-email"
              label={appUi.prospectCard.actions.copyEmail}
              state={copyState}
              value={card.shortEmail}
              onCopy={copyCardValue}
            />
          </div>
          <pre>{card.shortEmail}</pre>
        </div>
      );
    }

    if (activeTab === "sources") {
      return (
        <section className="prospect-card-section">
          <div className="prospect-section-head">
            <span>{appUi.prospectCard.sources.title}</span>
            <strong>{formatMessage(appUi.prospectCard.sources.count, { count: card.sourceNotes.length })}</strong>
          </div>
          <div className="source-note-list">
            {card.sourceNotes.map((note) => (
              <div key={`${note.claim}-${note.source}`}>
                <strong>{note.claim}</strong>
                <small>{appUi.prospectCard.sources.sourceLabel}: {note.source}</small>
              </div>
            ))}
          </div>
        </section>
      );
    }

    if (activeTab === "export") {
      return renderExportPanel();
    }

    return (
      <div className="prospect-overview-grid">
        <section className="prospect-card-section">
          <div className="prospect-section-head">
            <span>{appUi.prospectCard.overview.fitEvidence}</span>
            <strong>{formatMessage(appUi.prospectCard.overview.confidence, { count: Math.round(card.confidenceScore * 100) })}</strong>
          </div>
          <p>{card.summary}</p>
          {!compact ? <small>{card.fitReason}</small> : null}
        </section>
        <section className="prospect-card-section">
          <div className="prospect-section-head">
            <span>{appUi.prospectCard.overview.topSignals}</span>
            <strong>{formatMessage(appUi.prospectCard.overview.shown, { count: topSignals.length })}</strong>
          </div>
          <SignalList signals={topSignals} />
        </section>
        <div className="first-line-box">
          <div className="prospect-section-head">
            <span>{appUi.prospectCard.overview.bestFirstLine}</span>
            <strong>{appUi.prospectCard.overview.highestLeverage}</strong>
          </div>
          <p>{firstLine}</p>
        </div>
        {!compact ? (
          <div className="email-box email-preview-box">
            <div className="prospect-section-head">
              <span>{appUi.prospectCard.overview.shortEmailPreview}</span>
              <button className="copy-chip" type="button" onClick={() => selectProspectTab("email")}>
                {appUi.prospectCard.overview.openEmail}
              </button>
            </div>
            <pre>{card.shortEmail}</pre>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <article className={`prospect-card ${compact ? "panel" : ""} ${workspaceControls ? "has-workspace-controls" : ""}`}>
      <div className="prospect-card-header">
        <div>
          <p className="eyebrow">{appUi.prospectCard.eyebrow}</p>
          <h3>{card.companyName}</h3>
          <span>{card.domain}</span>
        </div>
        <div className="score-badge">
          <strong>{card.fitScore}</strong>
          <span>{appUi.prospectCard.fitLabel}</span>
        </div>
      </div>
      <div className="prospect-summary-strip" aria-label={appUi.prospectCard.summaryLabel}>
        <div>
          <span>{appUi.prospectCard.website}</span>
          <strong>{card.domain}</strong>
        </div>
        <div>
          <span>{appUi.prospectCard.industry}</span>
          <strong>{card.industry}</strong>
        </div>
        <div>
          <span>{appUi.prospectCard.confidence}</span>
          <strong>{Math.round(card.confidenceScore * 100)}%</strong>
        </div>
        <div>
          <span>{appUi.prospectCard.status}</span>
          <strong>
            {(card.savedStatus || "saved") === "saved" ? appUi.preview.saved : appUi.preview.unsaved} /{" "}
            {(card.exportStatus || "not_exported") === "exported" ? appUi.preview.exported : appUi.preview.notExported}
          </strong>
        </div>
        {workspaceControls ? (
          <>
            <div>
              <span>{appUi.prospectCard.owner}</span>
              <strong>{metaFields.owner || appUi.common.unassigned}</strong>
            </div>
            <div>
              <span>{appUi.prospectCard.stage}</span>
              <strong>{stageLabel}</strong>
            </div>
          </>
        ) : null}
      </div>
      <div className="prospect-card-actions prospect-card-primary-actions">
        <CopyButton
          copyKey="email-draft"
          label={appUi.prospectCard.actions.copyEmail}
          state={copyState}
          value={emailDraftText}
          onCopy={copyCardValue}
        />
        <button
          className={`copy-chip ${copyState?.key === "download-selected" ? `is-${copyState.status}` : ""}`}
          type="button"
          onClick={downloadSelectedFields}
          disabled={!selectedExportFields.length}
        >
          <Icon name="download" />
          {appUi.prospectCard.actions.export}
        </button>
        {workspaceControls && leadId ? (
          <CopyButton
            copyKey="share-link"
            label={appUi.prospectCard.actions.copyLink}
            state={copyState}
            value={shareUrl}
            onCopy={copyCardValue}
          />
        ) : null}
        <details className="copy-menu">
          <summary>
            <Icon name="clipboard" />
            {appUi.prospectCard.actions.moreCopyActions}
          </summary>
          <div className="copy-menu-panel">
            {copyMenuItems.map((item) => (
              <CopyButton
                copyKey={item.key}
                label={item.label}
                state={copyState}
                value={item.value}
                onCopy={copyCardValue}
                key={item.key}
              />
            ))}
          </div>
        </details>
      </div>
      {workspaceControls && !compact ? (
        <details className="prospect-meta-panel prospect-meta-panel-compact" aria-label={appUi.prospectCard.pipeline.panelLabel}>
          <summary>
            <span>{appUi.prospectCard.pipeline.title}</span>
            <strong>
              {metaSaveState === "saving"
                ? appUi.common.saving
                : metaSaveState === "saved"
                ? appUi.common.saved
                : metaFields.updatedAt
                  ? formatMessage(appUi.prospectCard.pipeline.updated, {
                      time: formatHistoryTime(metaFields.updatedAt, locale, appUi.common.unknownTime)
                    })
                  : appUi.prospectCard.pipeline.notSavedYet}
            </strong>
          </summary>
          <div className="prospect-meta-grid">
            <label>
              {appUi.prospectCard.owner}
              <input
                value={metaFields.owner}
                onChange={(event) => updateProspectMeta("owner", event.currentTarget.value)}
                placeholder={appUi.common.placeholders.assignTeammate}
              />
            </label>
            <label>
              {appUi.prospectCard.stage}
              <select
                value={metaFields.stage}
                onChange={(event) => updateProspectStage(event.currentTarget.value as ProspectPipelineStage)}
              >
                {pipelineStageOptions.map((option) => (
                  <option value={option} key={option}>
                    {appUi.options.pipelineStages[option]}
                  </option>
                ))}
              </select>
            </label>
            <label className="prospect-meta-notes">
              {appUi.prospectCard.pipeline.notes}
              <textarea
                value={metaFields.notes}
                onChange={(event) => updateProspectMeta("notes", event.currentTarget.value)}
                placeholder={appUi.common.placeholders.nextAction}
                rows={4}
              />
            </label>
          </div>
          <div className="prospect-meta-actions">
            <button
              className="button button-primary button-small"
              type="button"
              onClick={() => void saveProspectMeta()}
              disabled={metaSaveState === "saving"}
            >
              {metaSaveState === "saving" ? appUi.common.saving : appUi.prospectCard.pipeline.saveContext}
            </button>
            <span className={`meta-save-state ${metaSaveState === "error" ? "is-error" : ""}`} role="status">
              {metaSaveState === "error"
                ? appUi.prospectCard.pipeline.saveStateError
                : metaSaveState === "saving"
                  ? appUi.prospectCard.pipeline.saveStateSaving
                : metaSaveState === "saved"
                  ? appUi.prospectCard.pipeline.saveStateSaved
                : appUi.prospectCard.pipeline.saveStateIdle}
            </span>
          </div>
        </details>
      ) : null}
      {workspaceControls && !compact ? renderActivityLog() : null}
      {!compact && (
        <div className="prospect-tabs" role="tablist" aria-label={appUi.prospectCard.sectionsLabel}>
          {prospectCardTabs.map((tab) => (
            <button
              id={tabButtonId(tab)}
              className={activeTab === tab ? "is-active" : ""}
              role="tab"
              type="button"
              key={tab}
              aria-selected={activeTab === tab}
              aria-controls={tabPanelId(tab)}
              tabIndex={activeTab === tab ? 0 : -1}
              onClick={() => selectProspectTab(tab)}
              onKeyDown={(event) => handleTabKeyDown(event, tab)}
            >
              {appUi.options.prospectCardTabs[tab]}
            </button>
          ))}
        </div>
      )}
      <div
        className="prospect-tab-panel"
        id={tabPanelId(activeTab)}
        role={!compact ? "tabpanel" : undefined}
        aria-labelledby={!compact ? tabButtonId(activeTab) : undefined}
      >
        {renderTabPanel()}
      </div>
      {workspaceControls && !compact ? (
        <div className="prospect-mobile-sticky-actions" aria-label={appUi.prospectCard.mobileActionsLabel}>
          <CopyButton
            copyKey="mobile-email"
            label={appUi.prospectCard.actions.copyEmail}
            state={copyState}
            value={emailDraftText}
            onCopy={copyCardValue}
          />
          <button className="copy-chip" type="button" onClick={downloadSelectedFields} disabled={!selectedExportFields.length}>
            <Icon name="download" />
            {appUi.prospectCard.actions.export}
          </button>
          <button
            className="copy-chip"
            type="button"
            onClick={() => void saveProspectMeta()}
            disabled={metaSaveState === "saving"}
          >
            <Icon name="check" />
            {metaSaveState === "saving" ? appUi.prospectCard.actions.saving : appUi.prospectCard.actions.save}
          </button>
        </div>
      ) : null}
    </article>
  );
}

function ProspectField({
  label,
  value,
  copyKey,
  state,
  onCopy
}: {
  label: string;
  value: string;
  copyKey: string;
  state: { key: string; status: "copied" | "error" } | null;
  onCopy: (key: string, value: string) => Promise<void>;
}) {
  return (
    <div className="prospect-field">
      <span>{label}</span>
      <strong>{value}</strong>
      <CopyButton copyKey={copyKey} state={state} value={value} onCopy={onCopy} />
    </div>
  );
}

function CopyButton({
  copyKey,
  value,
  state,
  onCopy,
  label
}: {
  copyKey: string;
  value: string;
  state: { key: string; status: "copied" | "error" } | null;
  onCopy: (key: string, value: string) => Promise<void>;
  label?: string;
}) {
  const { locale } = usePublicSite();
  const appUi = getAppUi(locale);
  const isCurrent = state?.key === copyKey;
  const statusLabel = isCurrent
    ? state.status === "copied"
      ? appUi.common.copied
      : appUi.common.failed
    : label || appUi.common.copy;

  return (
    <button
      className={`copy-chip ${isCurrent ? `is-${state.status}` : ""}`}
      type="button"
      onClick={() => void onCopy(copyKey, value)}
      disabled={!value.trim()}
    >
      <Icon name="clipboard" />
      {statusLabel}
    </button>
  );
}

function SignalList({ signals }: { signals: OpportunitySignal[] }) {
  const { locale } = usePublicSite();
  const appUi = getAppUi(locale);
  return (
    <div className="signal-list">
      {signals.map((signal) => (
        <div className="signal-item" key={signal.signal}>
          <span>{formatSignalCategory(signal.category, appUi)}</span>
          <p>{signal.signal}</p>
          <small>{appUi.prospectCard.sources.sourceLabel}: {signal.source}</small>
        </div>
      ))}
    </div>
  );
}

function Setting({ label, value }: { label: string; value: string }) {
  return (
    <div className="setting-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, ReactElement> = {
    arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
    browser: <path d="M3 6h18v12H3zM3 9h18M7 6v3" />,
    chart: <path d="M4 19V5M4 19h16M8 16v-5M12 16V8M16 16v-7M20 16v-3" />,
    chevron_down: <path d="m6 9 6 6 6-6" />,
    check: <path d="m5 12 4 4L19 6" />,
    clipboard: <path d="M9 5h6M9 3h6v4H9zM7 5H5v16h14V5h-2" />,
    cursor: <path d="m5 4 14 7-6 2-2 6z" />,
    database: <path d="M5 6c0 1.7 3.1 3 7 3s7-1.3 7-3-3.1-3-7-3-7 1.3-7 3zM5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />,
    download: <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />,
    filter: <path d="M4 6h16M7 12h10M10 18h4" />,
    globe: <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm0 0c2.3 2.1 3.6 5.1 3.6 9S14.3 18.9 12 21m0-18c-2.3 2.1-3.6 5.1-3.6 9S9.7 18.9 12 21M4 12h16M5.4 7.5h13.2M5.4 16.5h13.2" />,
    layers: <path d="m12 3 9 5-9 5-9-5zM3 12l9 5 9-5M3 16l9 5 9-5" />,
    lock: <path d="M7 11V8a5 5 0 0 1 10 0v3M6 11h12v10H6z" />,
    mail: <path d="M4 6h16v12H4zM4 7l8 6 8-6" />,
    scan: <path d="M5 7V5h4M15 5h4v4M19 15v4h-4M9 19H5v-4M8 12h8" />,
    shield: <path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6z" />,
    spark: <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />,
    target: <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
  };

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="icon">
      {paths[name]}
    </svg>
  );
}
