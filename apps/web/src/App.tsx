import { type ChangeEvent, type FormEvent, type KeyboardEvent, type ReactElement, useEffect, useMemo, useRef, useState } from "react";
import {
  DEFAULT_ICP,
  PRICING_PLANS,
  SAMPLE_PROSPECT_CARD,
  buildProspectExportCsv,
  defaultProspectExportSelection,
  formatPipelineStageLabel,
  getProspectExportColumns,
  prospectCrmFieldModes,
  prospectExportFields,
  prospectExportPresets,
  type IcpUpdateRequest,
  type LeadListItem,
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
  type ScanFailureResponse,
  type ScanHistoryItem,
  type ScanRequest,
  type ScanResponse,
  type ServiceType,
  type Tone
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
import "./upgrades.css";

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
type PipelineContextSaveResult = {
  context: ProspectPipelineContext;
  activity?: ProspectPipelineActivity | null;
};

const scanHistoryFilters: Array<{ value: ScanHistoryFilter; label: string }> = [
  { value: "all", label: "All" },
  { value: "completed", label: "Completed" },
  { value: "failed", label: "Failed" },
  { value: "replayed", label: "Replayed" },
  { value: "processing", label: "Processing" }
];

const historyDateFilters: Array<{ value: HistoryDateFilter; label: string }> = [
  { value: "all", label: "All dates" },
  { value: "today", label: "Today" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" }
];

const leadSortOptions: Array<{ value: LeadSortOption; label: string }> = [
  { value: "newest", label: "Newest saved" },
  { value: "fit_desc", label: "Fit score" },
  { value: "confidence_desc", label: "Confidence" },
  { value: "company_asc", label: "Company A-Z" }
];

const prospectCardTabs: Array<{ value: ProspectCardTab; label: string }> = [
  { value: "overview", label: "Overview" },
  { value: "signals", label: "Signals" },
  { value: "contacts", label: "Contacts" },
  { value: "outreach", label: "Outreach" },
  { value: "email", label: "Email" },
  { value: "sources", label: "Sources" },
  { value: "export", label: "Export" }
];

const pipelineStageOptions: Array<{ value: ProspectPipelineStage; label: string }> = [
  { value: "researching", label: "Researching" },
  { value: "qualified", label: "Qualified" },
  { value: "outreach_queued", label: "Outreach queued" },
  { value: "contacted", label: "Contacted" },
  { value: "won", label: "Won" },
  { value: "archived", label: "Archived" }
];

const activityFieldFilters: Array<{ value: ActivityFieldFilter; label: string }> = [
  { value: "all", label: "All" },
  { value: "owner", label: "Owner" },
  { value: "stage", label: "Stage" },
  { value: "notes", label: "Notes" }
];

const defaultProspectMeta: ProspectPipelineContext = {
  owner: "",
  stage: "researching",
  notes: "",
  updatedAt: null
};

const useCases = [
  {
    title: "Web design agencies",
    copy: "Find weak CTAs, buried demo paths, thin proof, confusing navigation, and redesign reasons you can mention in outreach.",
    cta: "Start with redesign angles",
    focus: "web_design"
  },
  {
    title: "SEO agencies",
    copy: "Spot thin metadata, stale blogs, weak service pages, and content gaps before writing a tailored first line.",
    cta: "Start with SEO gaps",
    focus: "seo"
  },
  {
    title: "Marketing agencies",
    copy: "Identify unclear positioning, missing lead magnets, weak landing pages, and campaign angles worth pitching.",
    cta: "Start with growth angles",
    focus: "marketing"
  }
];

const workflow = [
  {
    title: "Open a prospect website",
    copy: "Start from the company site your team is already reviewing, not a scraped contact list."
  },
  {
    title: "Click LeadCue",
    copy: "Scan visible pages, metadata, CTAs, links, contact paths, and content signals."
  },
  {
    title: "Get a Prospect Card",
    copy: "Get fit score, website-backed cues, outreach angles, first lines, and export-ready notes."
  }
];

const featureHighlights: Array<{ icon: IconName; title: string; copy: string; meta: string }> = [
  {
    icon: "chart",
    title: "Prospect analytics that show intent",
    copy: "Track websites scanned, save rate, fit scores, and copied first lines so your team sees which research turns into outreach.",
    meta: "Live pipeline"
  },
  {
    icon: "target",
    title: "ICP scoring for agency offers",
    copy: "Score each website against your service type, industries, regions, company size, and offer before saving it.",
    meta: "Fit scoring"
  },
  {
    icon: "layers",
    title: "Website evidence in every card",
    copy: "Keep the page observation, sales cue, outreach angle, and first line together so reps know why the prospect matters.",
    meta: "Source backed"
  },
  {
    icon: "database",
    title: "Exports for your outreach stack",
    copy: "Move qualified prospects into Sheets, Smartlead, Instantly, Lemlist, or your CRM without carrying unqualified lists.",
    meta: "Clean handoff"
  }
];

const trustBadges: Array<{ icon: IconName; label: string }> = [
  { icon: "lock", label: "No LinkedIn scraping" },
  { icon: "shield", label: "Permission-light Chrome MV3" },
  { icon: "database", label: "CSV export ready" },
  { icon: "check", label: "Source-backed notes" }
];

const homepageContentLinks: Array<{ href: string; eyebrow: string; title: string; copy: string; icon: IconName }> = [
  {
    href: "#features",
    eyebrow: "Features",
    title: "Everything around the website scan",
    copy: "Fit scoring, signals, exports, and team context stay in one card.",
    icon: "layers"
  },
  {
    href: "#how",
    eyebrow: "How it works",
    title: "A three-step research workflow",
    copy: "Start from the company site, capture evidence, then save a Prospect Card.",
    icon: "scan"
  },
  {
    href: "#card",
    eyebrow: "Sample card",
    title: "Inspect the output before signup",
    copy: "See the fit score, website cues, first line, and short email together.",
    icon: "clipboard"
  },
  {
    href: "#pricing",
    eyebrow: "Pricing",
    title: "Credits built for weekly prospecting",
    copy: "Start free, then scale scan volume as the workflow proves itself.",
    icon: "chart"
  },
  {
    href: "#resources",
    eyebrow: "Resources",
    title: "Sharpen outbound quality",
    copy: "Use guides for evidence-led prospecting and better account qualification.",
    icon: "mail"
  }
];

const planBenefits: Record<string, string[]> = {
  free: ["20 website scans/month", "Sample Prospect Cards", "Basic first-line copy"],
  starter: ["300 website scans/month", "Saved prospect list", "CSV export"],
  pro: ["1,500 website scans/month", "Custom ICP settings", "Priority analytics"],
  agency: ["5,000 website scans/month", "3 agency workspaces", "Shared scan credits"]
};

const planUseCases: Record<PricingPlan["id"], string> = {
  free: "Validate the workflow with real websites before a paid rollout.",
  starter: "Best for one operator building a weekly outbound habit.",
  pro: "Best for agencies turning prospect research into a repeatable pipeline.",
  agency: "Best for teams sharing scan credits across multiple client offers."
};

const faqItems = [
  {
    question: "Is LeadCue an email finder?",
    answer:
      "No. LeadCue can surface public contact paths from a website, but its main job is to find sales cues, fit signals, outreach angles, and first lines grounded in the pages you choose to analyze."
  },
  {
    question: "Does LeadCue scrape LinkedIn or browse in the background?",
    answer:
      "No. The Chrome extension is designed around user-triggered website analysis. It does not scrape LinkedIn, collect browsing history, or run background prospecting jobs."
  },
  {
    question: "Can I send campaigns from LeadCue?",
    answer:
      "No. LeadCue prepares the research layer before outreach. Save Prospect Cards, copy first lines, or export qualified prospects into your existing tools."
  },
  {
    question: "Who is LeadCue built for first?",
    answer:
      "LeadCue is built first for small SEO, web design, redesign, and growth agencies that do outbound and need specific website-backed reasons to contact prospects."
  }
];

const resourceArticles = [
  {
    title: "How to turn a prospect website into a cold email angle",
    copy: "A practical workflow for moving from visible page evidence to credible outreach.",
    image: "/images/leadcue-outreach-playbook.png",
    label: "Outbound playbook",
    href: "/guides/turn-website-into-cold-email-angle"
  },
  {
    title: "What agencies should score before saving a prospect",
    copy: "Use fit, urgency, proof gaps, and contact paths to avoid list-building noise.",
    image: "/images/leadcue-agency-research.png",
    label: "Qualification",
    href: "/guides/score-prospect-website"
  },
  {
    title: "Why website-first prospecting beats generic lead lists",
    copy: "LeadCue keeps every saved account tied to a reason your team can actually use.",
    image: "/images/leadcue-hero-prospecting.png",
    label: "Strategy",
    href: "/website-prospecting"
  }
];

const demoLeads = [
  SAMPLE_PROSPECT_CARD,
  {
    ...SAMPLE_PROSPECT_CARD,
    companyName: "Beacon Dental Group",
    domain: "beacondental.example",
    website: "https://beacondental.example",
    industry: "Local healthcare",
    fitScore: 82,
    confidenceScore: 0.76
  },
  {
    ...SAMPLE_PROSPECT_CARD,
    companyName: "Lumen Logistics",
    domain: "lumenlogistics.example",
    website: "https://lumenlogistics.example",
    industry: "B2B services",
    fitScore: 74,
    confidenceScore: 0.69
  }
];

const demoLeadRows: LeadListItem[] = demoLeads.map((lead, index) => ({
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

const demoScanHistory: ScanHistoryItem[] = [
  {
    id: "scan_demo_completed",
    url: SAMPLE_PROSPECT_CARD.website,
    domain: SAMPLE_PROSPECT_CARD.domain,
    scanType: "basic",
    status: "completed",
    reason: null,
    creditsUsed: 1,
    creditsCharged: 1,
    leadId: "lead_sample",
    companyName: SAMPLE_PROSPECT_CARD.companyName,
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
    url: SAMPLE_PROSPECT_CARD.website,
    domain: SAMPLE_PROSPECT_CARD.domain,
    scanType: "basic",
    status: "replayed",
    reason: "replayed",
    creditsUsed: 0,
    creditsCharged: 0,
    leadId: "lead_sample",
    companyName: SAMPLE_PROSPECT_CARD.companyName,
    idempotencyKey: "demo_completed_key",
    replayed: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 54).toISOString(),
    completedAt: new Date(Date.now() - 1000 * 60 * 54).toISOString()
  }
];

type SignupResponse = {
  ok: boolean;
  userId?: string;
  workspaceId?: string;
  checkoutUrl?: string;
  next?: "dashboard" | "checkout";
  billingStatus?: "active" | "pending_checkout" | "configuration_required";
  error?: string;
};

type EmailLoginResponse = {
  ok: boolean;
  next?: string;
  error?: string;
};

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
};

type IcpFormState = {
  serviceType: string;
  targetIndustries: string;
  targetCountries: string;
  offerDescription: string;
  tone: string;
  firstProspectUrl: string;
};

type AppSection = "dashboard" | "leads" | "icp" | "billing" | "analytics" | "account";

const sampleWorkspace: WorkspaceSnapshot = {
  workspace: {
    id: "ws_demo",
    name: "LeadCue Demo Workspace",
    createdAt: new Date().toISOString()
  },
  setup: {
    serviceType: DEFAULT_ICP.serviceType,
    agencyFocus: "web_design",
    targetIndustries: DEFAULT_ICP.targetIndustries,
    targetCountries: DEFAULT_ICP.targetCountries,
    offerDescription: DEFAULT_ICP.offerDescription,
    tone: DEFAULT_ICP.tone,
    agencyWebsite: "https://leadcue.app",
    firstProspectUrl: SAMPLE_PROSPECT_CARD.website
  },
  onboarding: {
    completedAt: new Date().toISOString(),
    isComplete: true
  },
  plan: PRICING_PLANS[0],
  subscription: {
    provider: "leadcue",
    status: "active",
    customerId: null,
    currentPeriodEnd: null
  },
  credits: {
    used: 4,
    remaining: PRICING_PLANS[0].monthlyCredits - 4,
    reset: new Date().toISOString()
  },
  leadCount: demoLeadRows.length,
  source: "sample"
};

const sampleAnalyticsSummary: AnalyticsSummary = {
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
      metadataSummary: "basic scan, 1 credit"
    },
    {
      id: "evt_sample_export",
      name: "export_completed",
      pagePath: "/app/leads",
      createdAt: new Date(Date.now() - 1000 * 60 * 26).toISOString(),
      metadataSummary: "CRM / HubSpot"
    },
    {
      id: "evt_sample_tool",
      name: "product_tool_primary_click",
      pagePath: "/templates/crm-csv-field-mapping",
      createdAt: new Date(Date.now() - 1000 * 60 * 44).toISOString(),
      metadataSummary: "HubSpot mapping CTA"
    }
  ],
  recommendations: [
    "Tool-page CTA clicks are healthy. Keep routing those users into signup with the same field template context.",
    "Exports are lower than scans, so the next bottleneck is likely qualification confidence or CRM handoff timing.",
    "The CRM mapping template is pulling the most product-led traffic right now."
  ]
};

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

export default function App() {
  const { locale, path: pathname } = parseSiteLocalePath(window.location.pathname);
  const siteUi = getSiteUi(locale);
  const publicSiteContext = useMemo(() => createPublicSiteContextValue(locale, pathname, siteUi), [locale, pathname, siteUi]);
  const isAppRoute = pathname.startsWith("/app");
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

  if (isAppRoute) {
    return (
      <PublicSiteContext.Provider value={publicSiteContext}>
        <>
          <SeoHead
            title="LeadCue App - Prospect Research Workspace"
            description="LeadCue app workspace for signed-in teams."
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
          <LoginPage />
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
          <SignupPage />
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
  const searchEngineVerifications = useMemo(() => getSearchEngineVerifications(), []);

  useEffect(() => {
    document.title = title;
    setMetaTag("name", "description", description);
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
  }, [canonicalUrl, description, imageUrl, noIndex, path, resolvedImageAlt, searchEngineVerifications, structuredDataJson, title, type]);

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
        keywords: [homeKeywordSet.primaryKeyword, ...homeKeywordSet.secondaryKeywords].join(", ")
      },
      {
        "@type": "SoftwareApplication",
        name: siteUi.common.brand,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: absoluteUrl("/", locale),
        inLanguage: getLocaleHtmlLang(locale),
        image: absoluteUrl(getSeoImagePath(locale, "/")),
        keywords: [homeKeywordSet.primaryKeyword, ...homeKeywordSet.secondaryKeywords].join(", "),
        offers: PRICING_PLANS.map((plan) => ({
          "@type": "Offer",
          name: plan.name,
          price: plan.price,
          priceCurrency: "USD",
          url: `${SITE_URL}${localizeHref(`/signup?plan=${plan.id}`)}`
        }))
      }
    ]
  };

  return (
    <div className="site-shell">
      <SeoHead
        title={home.seo.title}
        description={home.seo.description}
        path="/"
        locale={locale}
        structuredData={homeStructuredData}
      />
      <header className={`topbar topbar-marketing topbar-locale-${locale}`}>
        <a className="brand" href={localizeHref("/")} aria-label={`${siteUi.common.brand} ${siteUi.common.home}`}>
          <BrandMark />
          <span>{siteUi.common.brand}</span>
        </a>
        <nav className="nav-links" aria-label="Main navigation">
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
          <a className="button button-small button-primary" href={localizeHref("/signup?plan=free")}>
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
              <a className="button button-primary" href={localizeHref("/signup?plan=free")}>
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
                  <div className="analytics-meta" aria-label="Data freshness">
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
                <a className="button button-primary" href={localizeHref("/signup?plan=free&first=https%3A%2F%2Fnorthstaranalytics.example")}>
                  <Icon name="scan" />
                  {home.sampleCard.primaryCta}
                </a>
                <a className="button button-secondary" href={localizeHref("/docs")}>
                  <Icon name="clipboard" />
                  {home.sampleCard.secondaryCta}
                </a>
              </div>
            </div>
            <HomeProspectPreview card={SAMPLE_PROSPECT_CARD} />
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
                  <a href={localizeHref(`/signup?focus=${(["web_design", "seo", "marketing"] as const)[index]}&plan=free`)}>
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
            <div className="comparison-table" role="table" aria-label="LeadCue comparison">
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
                    href={localizeHref(`/signup?plan=${plan.id}`)}
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
              <form className="quick-scan-form" action={localizeHref("/signup")} method="get">
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
              <a className="button button-primary" href={localizeHref("/signup?plan=free")}>
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
            <a href={localizeHref("/signup?plan=free")}>{home.launch.startFree}</a>
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
        <nav className="content-nav" aria-label="LeadCue content navigation">
          <a href={localizeHref("/website-prospecting")}>{siteUi.content.seoNav.strategy}</a>
          <a href={localizeHref("/use-cases/web-design-agencies")}>{siteUi.content.seoNav.useCases}</a>
          <a href={localizeHref("/guides/turn-website-into-cold-email-angle")}>{siteUi.content.seoNav.guides}</a>
          <a href={localizeHref("/agency-lead-qualification")}>{siteUi.content.seoNav.qualification}</a>
        </nav>
        <LanguageSwitcher />
        <a className="button button-small button-primary topbar-back" href={localizeHref("/signup?plan=free")}>
          {siteUi.common.startFree}
        </a>
      </header>

      <main className="content-page seo-page">
        <section className="content-hero seo-hero">
          <nav className="seo-breadcrumb" aria-label="Breadcrumb">
            <a href={localizeHref("/")}>{siteUi.content.breadcrumbs.home}</a>
            <span>/</span>
            <a href={localizeHref("/#resources")}>{siteUi.content.breadcrumbs.resources}</a>
            <span>/</span>
            <strong>{page.category}</strong>
          </nav>
          <p className="eyebrow glass-pill">{page.eyebrow}</p>
          <h1>{page.title}</h1>
          <p>{page.description}</p>
          <div className="seo-meta-row" aria-label="Article metadata">
            <span>{page.category}</span>
            <span>{page.readingTime}</span>
            <span>{`${siteUi.common.updatedLabel} ${page.updatedAt}`}</span>
          </div>
          <div className="seo-keywords" aria-label="Target search intent">
            <span>{page.primaryKeyword}</span>
            {page.secondaryKeywords.map((keyword) => (
              <span key={keyword}>{keyword}</span>
            ))}
          </div>
        </section>

        <section className="seo-layout" aria-label={`${page.title} article`}>
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

            <section className="seo-related" aria-label="Related LeadCue resources">
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
          <a className="button button-primary" href={localizeHref("/signup?plan=free")}>
            <Icon name="scan" />
            {siteUi.common.startFreeScan}
          </a>
        </section>
      </main>
    </div>
  );
}

type CrmMappingMode = "hubspot" | "salesforce" | "pipedrive" | "custom";

const crmMappingModes: Array<{ value: CrmMappingMode; label: string; copy: string }> = [
  { value: "hubspot", label: "HubSpot", copy: "Human-readable labels for company and list imports." },
  { value: "salesforce", label: "Salesforce", copy: "Lead import labels for source, owner, and description." },
  { value: "pipedrive", label: "Pipedrive", copy: "Organization, owner, stage, and note handoff fields." },
  { value: "custom", label: "Custom", copy: "LeadCue's neutral export field naming." }
];

const crmMappingRows = [
  {
    key: "company",
    group: "Identity",
    labels: { hubspot: "Company name", salesforce: "Company", pipedrive: "Organization name", custom: "company_name" },
    sample: "Northstar Analytics",
    description: "The account or organization name."
  },
  {
    key: "website",
    group: "Identity",
    labels: { hubspot: "Website URL", salesforce: "Website", pipedrive: "Website", custom: "website_url" },
    sample: "https://northstaranalytics.example",
    description: "The prospect website used for research."
  },
  {
    key: "fit",
    group: "Qualification",
    labels: { hubspot: "Fit score", salesforce: "Fit Score", pipedrive: "Fit score", custom: "fit_score" },
    sample: "86",
    description: "Prioritization score for the account."
  },
  {
    key: "confidence",
    group: "Qualification",
    labels: {
      hubspot: "Confidence score",
      salesforce: "Confidence Score",
      pipedrive: "Confidence score",
      custom: "confidence_score"
    },
    sample: "82%",
    description: "How strong the website evidence is."
  },
  {
    key: "signal",
    group: "Website evidence",
    labels: { hubspot: "Top website signal", salesforce: "Top Signal", pipedrive: "Top signal", custom: "top_signal" },
    sample: "Demo CTA is not visible above the fold",
    description: "The strongest source-backed reason to reach out."
  },
  {
    key: "firstLine",
    group: "Outreach",
    labels: {
      hubspot: "Cold email first line",
      salesforce: "First Line",
      pipedrive: "First line",
      custom: "first_line"
    },
    sample: "I noticed Northstar explains the product clearly, but the demo path starts after the first scroll.",
    description: "Copy-ready opener based on website evidence."
  },
  {
    key: "sourceNotes",
    group: "Website evidence",
    labels: { hubspot: "Source notes", salesforce: "Description", pipedrive: "Notes", custom: "source_notes" },
    sample: "Homepage: demo CTA appears below the first scroll; navigation scan: no case studies.",
    description: "Evidence that lets reps verify the claim."
  },
  {
    key: "owner",
    group: "Workflow",
    labels: { hubspot: "HubSpot owner", salesforce: "Lead Owner", pipedrive: "Owner", custom: "owner" },
    sample: "Alex Rivera",
    description: "The teammate responsible for follow-up."
  },
  {
    key: "stage",
    group: "Workflow",
    labels: { hubspot: "Lead status", salesforce: "Lead Status", pipedrive: "Stage", custom: "stage" },
    sample: "Researching",
    description: "Where the account sits before outreach."
  },
  {
    key: "exported",
    group: "Workflow",
    labels: { hubspot: "Export status", salesforce: "Export Status", pipedrive: "Export status", custom: "export_status" },
    sample: "Not exported",
    description: "Prevents duplicate CRM handoff."
  }
] as const;

const requiredCrmFieldKeys = new Set(["company", "website", "owner", "stage"]);
const recommendedCrmFieldKeys = new Set(["fit", "confidence", "signal", "firstLine", "sourceNotes", "exported"]);

const agencyToolModes = [
  { value: "web_design", label: "Web design" },
  { value: "seo", label: "SEO" },
  { value: "marketing", label: "Marketing" }
] as const;

type AgencyToolMode = (typeof agencyToolModes)[number]["value"];

const firstLineTemplates = [
  {
    signal: "Hidden demo CTA",
    category: "Conversion",
    firstLine:
      "I noticed the product story is clear, but the main demo path does not show up until after the first scroll.",
    nextSentence: "That can cost booked demos from visitors who already understand what you do.",
    cta: "Want me to send over three above-the-fold ideas?"
  },
  {
    signal: "Missing proof",
    category: "Trust",
    firstLine: "I saw a strong product explanation, but buyer proof and case studies are hard to find from the main navigation.",
    nextSentence: "For higher-consideration buyers, that can make the demo decision feel riskier than it needs to be.",
    cta: "Want me to send a quick proof-section outline?"
  },
  {
    signal: "Inactive content",
    category: "SEO",
    firstLine: "I noticed the blog appears inactive, even though the product seems to serve buyers who research before booking a demo.",
    nextSentence: "That may leave high-intent educational searches uncovered.",
    cta: "Want me to send a few content angles I would test first?"
  },
  {
    signal: "Unclear positioning",
    category: "Messaging",
    firstLine: "I noticed the homepage names the product category, but the buyer-specific outcome takes a few sections to become clear.",
    nextSentence: "Tightening that message can help visitors understand why the product is relevant faster.",
    cta: "Want me to send two headline directions?"
  }
] as const;

const checklistModeRecommendations: Record<AgencyToolMode, string[]> = {
  web_design: ["cta", "proof", "caseStudies", "positioning", "contactPath", "sourceNotes"],
  seo: ["contentFreshness", "serviceDepth", "positioning", "contactPath", "sourceNotes"],
  marketing: ["cta", "proof", "contentFreshness", "positioning", "contactPath", "sourceNotes"]
};

const integrationPlaybooks = {
  HubSpot: {
    recordType: "Company import first",
    quickWins: [
      "Map Fit score and Confidence score into custom company properties.",
      "Keep First line and Source notes visible to SDRs as soon as the record lands.",
      "Import only selected saved leads so list hygiene stays clean."
    ],
    mistakes: [
      "Importing every scanned account instead of only saved leads.",
      "Dropping source notes so reps lose the proof behind the opener.",
      "Using contact import too early before a verified contact path exists."
    ]
  },
  Salesforce: {
    recordType: "Lead import with research fields",
    quickWins: [
      "Set Lead Source to Website Prospecting or LeadCue for cleaner reporting.",
      "Use Description or a long-text custom field for source-backed summary.",
      "Route owner and lead status before the campaign handoff."
    ],
    mistakes: [
      "Over-mapping every research field into a rigid schema.",
      "Skipping custom numeric fields for fit and confidence scores.",
      "Moving accounts into sequences before the owner verifies the reason to reach out."
    ]
  },
  Pipedrive: {
    recordType: "Organization or lead import",
    quickWins: [
      "Use Organization fields for website identity and note fields for the research reason.",
      "Map Stage to researching or qualified before the account is touched by outreach.",
      "Keep owner attached so handoff stays accountable."
    ],
    mistakes: [
      "Creating deals before the account has shown any engagement.",
      "Burying source notes in a place reps never review.",
      "Losing export status and re-importing the same account twice."
    ]
  }
} as const;

const checklistItems = [
  { key: "cta", category: "Conversion", label: "Primary CTA is visible above the fold." },
  { key: "proof", category: "Trust", label: "Relevant customer proof appears before the buyer must hunt for it." },
  { key: "caseStudies", category: "Trust", label: "Case studies or outcomes are accessible from navigation." },
  { key: "contentFreshness", category: "SEO", label: "Blog, resources, or service content looks current." },
  { key: "serviceDepth", category: "SEO", label: "Service or use-case pages answer specific buyer questions." },
  { key: "positioning", category: "Messaging", label: "The headline explains the target buyer and outcome clearly." },
  { key: "contactPath", category: "Contact path", label: "Contact, demo, or booking path is easy to find." },
  { key: "sourceNotes", category: "Evidence", label: "The strongest observation can be tied to a page source." }
] as const;

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
        <nav className="content-nav" aria-label="Product-led SEO navigation">
          <a href={localizeHref("/templates/crm-csv-field-mapping")}>{siteUi.content.productNav.csvTool}</a>
          <a href={localizeHref("/templates/cold-email-first-line")}>{siteUi.content.productNav.firstLines}</a>
          <a href={localizeHref("/templates/website-prospecting-checklist")}>{siteUi.content.productNav.checklist}</a>
          <a href={localizeHref("/integrations/hubspot-csv-export")}>{siteUi.content.productNav.integrations}</a>
        </nav>
        <LanguageSwitcher />
        <a className="button button-small button-primary topbar-back" href={localizeHref("/signup?plan=free")}>
          {siteUi.common.startFree}
        </a>
      </header>

      <main className="content-page seo-page product-seo-page">
        <section className="content-hero seo-hero">
          <nav className="seo-breadcrumb" aria-label="Breadcrumb">
            <a href={localizeHref("/")}>{siteUi.content.breadcrumbs.home}</a>
            <span>/</span>
            <a href={localizeHref("/#resources")}>{siteUi.content.breadcrumbs.resources}</a>
            <span>/</span>
            <strong>{page.category}</strong>
          </nav>
          <p className="eyebrow glass-pill">{page.eyebrow}</p>
          <h1>{page.title}</h1>
          <p>{page.description}</p>
          <div className="seo-meta-row" aria-label="Page metadata">
            <span>{page.category}</span>
            <span>{page.readingTime}</span>
            <span>{`${siteUi.common.updatedLabel} ${page.updatedAt}`}</span>
          </div>
          <div className="seo-keywords" aria-label="Target search intent">
            <span>{page.primaryKeyword}</span>
            {page.secondaryKeywords.map((keyword) => (
              <span key={keyword}>{keyword}</span>
            ))}
          </div>
        </section>

        <section className="seo-layout" aria-label={`${page.title} tool and guide`}>
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

            <section className="tool-conversion-band" aria-label="Use this workflow inside LeadCue">
              <div className="tool-conversion-copy">
                <p className="eyebrow">{siteUi.content.toolBand.eyebrow}</p>
                <h2>{siteUi.content.toolBand.title}</h2>
                <p>{siteUi.content.toolBand.copy}</p>
              </div>
              <div className="tool-conversion-actions">
                <a
                  className="button button-primary"
                  href={localizeHref(`/signup?plan=free${page.tool === "integration" ? "&focus=marketing" : page.tool === "first-line" ? "&focus=web_design" : ""}`)}
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

            <section className="seo-related" aria-label="Related LeadCue resources">
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
            href={localizeHref("/signup?plan=free")}
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
          <h2>{`${activeMode.label} prospect research export`}</h2>
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

      <div className="tool-segmented" role="tablist" aria-label="CRM field naming mode">
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

      <div className="tool-segmented tool-segmented-secondary" role="tablist" aria-label="CRM field scope">
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
        <div className="field-picker" aria-label="Fields to include">
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

        <div className="mapping-table" aria-label={`${activeMode.label} field mapping table`}>
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

      <div className="tool-segmented tool-segmented-secondary" role="tablist" aria-label="Agency offer mode">
        {agencyToolModes.map((mode) => (
          <button
            className={agencyMode === mode.value ? "is-active" : ""}
            type="button"
            key={mode.value}
            onClick={() => setAgencyMode(mode.value)}
          >
            {firstLineCopy.modeLabels[mode.value]}
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
          href={localizeHref(`/signup?plan=free&focus=${agencyMode}`)}
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
  const resolvedMode = agencyToolModes.some((mode) => mode.value === initialMode)
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
  const summaryText = `Website prospecting summary\n${checklistCopy.summaryMode}: ${agencyMode}\n${checklistCopy.summaryCoverage}: ${score}%\n${checklistCopy.summarySignals}:\n${checkedItems
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

      <div className="tool-segmented tool-segmented-secondary" role="tablist" aria-label="Agency checklist mode">
        {agencyToolModes.map((mode) => (
          <button
            className={agencyMode === mode.value ? "is-active" : ""}
            type="button"
            key={mode.value}
            onClick={() => {
              setAgencyMode(mode.value);
              setCheckedKeys(checklistModeRecommendations[mode.value]);
            }}
          >
            {siteUi.tools.firstLine.modeLabels[mode.value]}
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
          href={localizeHref(`/signup?plan=free&focus=${agencyMode}`)}
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
        path={path}
        locale={locale}
        structuredData={getCommercialStructuredData(page, slug, locale)}
      />
      <header className="topbar topbar-minimal content-topbar">
        <a className="brand" href={localizeHref("/")} aria-label={`${siteUi.common.brand} ${siteUi.common.home}`}>
          <BrandMark />
          <span>{siteUi.common.brand}</span>
        </a>
        <nav className="content-nav" aria-label="Commercial pages">
          <a href={localizeHref("/docs")}>{siteUi.content.commercialNav.docs}</a>
          <a href={localizeHref("/support")}>{siteUi.content.commercialNav.support}</a>
          <a href={localizeHref("/contact")}>{siteUi.content.commercialNav.contact}</a>
        </nav>
        <LanguageSwitcher />
        <a className="button button-small button-primary topbar-back" href={localizeHref("/signup?plan=free")}>
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
          <section className="help-center-shell" aria-label="LeadCue help center">
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

        <section className="content-grid" aria-label={`${page.title} details`}>
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
          <a className="button button-primary" href={localizeHref("/signup?plan=free")}>
            <Icon name="scan" />
            {siteUi.common.startFreeScan}
          </a>
        </section>
      </main>
    </div>
  );
}

function getSelectedPlan() {
  const params = new URLSearchParams(window.location.search);
  const planId = params.get("plan") || "free";
  return PRICING_PLANS.find((plan) => plan.id === planId) ?? PRICING_PLANS[0];
}

function getInitialFocus() {
  const params = new URLSearchParams(window.location.search);
  const focus = params.get("focus");
  return ["web_design", "seo", "marketing", "founder"].includes(focus ?? "") ? focus ?? "web_design" : "web_design";
}

function getInitialFirstProspectUrl() {
  const first = new URLSearchParams(window.location.search).get("first");
  return first?.trim() || "";
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

function formatSubscriptionStatus(status: string) {
  return status
    .split("_")
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

function getSubscriptionStatusDetails(status: string) {
  switch (status) {
    case "active":
      return {
        label: "Active",
        tone: "is-success",
        summary: "Scans and exports are available on the current plan.",
        nextStep: "Keep qualifying accounts, then upgrade only when scan volume is the real bottleneck."
      };
    case "trialing":
      return {
        label: "Trialing",
        tone: "is-success",
        summary: "The workspace has access right now, but the trial period will need a billing decision soon.",
        nextStep: "Use this window to validate scan quality, save rate, and export handoff."
      };
    case "pending_checkout":
      return {
        label: "Checkout pending",
        tone: "is-warning",
        summary: "The plan change has started, but checkout still needs to be completed.",
        nextStep: "Finish the Stripe checkout to unlock the paid credit allowance."
      };
    case "configuration_required":
      return {
        label: "Billing setup required",
        tone: "is-warning",
        summary: "The workspace selected a paid plan before billing was fully configured in this environment.",
        nextStep: "Contact support or finish the Stripe configuration before relying on paid-plan access."
      };
    case "past_due":
      return {
        label: "Past due",
        tone: "is-warning",
        summary: "Billing needs attention before the workspace can rely on uninterrupted paid access.",
        nextStep: "Open the billing portal and update the payment method or invoice status."
      };
    case "canceled":
      return {
        label: "Canceled",
        tone: "is-danger",
        summary: "The paid subscription is no longer active for future periods.",
        nextStep: "Restart checkout if the team still needs higher monthly scan volume."
      };
    default:
      return {
        label: formatSubscriptionStatus(status),
        tone: "",
        summary: "This subscription state needs review before rollout.",
        nextStep: "Open billing details or contact support if the status does not match the expected plan."
      };
  }
}

function formatAnalyticsEventName(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function percentage(numerator: number, denominator: number) {
  if (!denominator) {
    return "0%";
  }

  return `${Math.round((numerator / denominator) * 100)}%`;
}

function formatAgencyFocus(value?: string | null) {
  switch (value) {
    case "web_design":
      return "Web design / redesign";
    case "seo":
      return "SEO agency";
    case "marketing":
      return "Growth / marketing";
    case "founder":
      return "Founder-led outbound";
    case "custom":
      return "Custom";
    default:
      return value ? value.replace(/_/g, " ") : "Not set";
  }
}

function formatCompactUrl(value?: string | null) {
  if (!value) {
    return "Not set";
  }

  return value.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

function previewList(values: string[], maxItems = 3) {
  const items = values.map((value) => value.trim()).filter(Boolean);
  if (!items.length) {
    return "Not set";
  }

  return items.length > maxItems
    ? `${items.slice(0, maxItems).join(", ")} +${items.length - maxItems}`
    : items.join(", ");
}

function formatHistoryTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Unknown time";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function formatHistoryReason(value?: ScanHistoryItem["reason"]) {
  if (!value) {
    return "usable card saved";
  }

  return value.replace(/_/g, " ");
}

function leadDetailHref(leadId?: string | null) {
  return leadId ? `/app/leads?lead=${encodeURIComponent(leadId)}` : null;
}

function bulkExportLabel(presetKey: Exclude<ProspectExportPresetKey, "custom">, crmMode: ProspectCrmFieldMode) {
  const preset = prospectExportPresets.find((item) => item.key === presetKey);
  const mode = prospectCrmFieldModes.find((item) => item.value === crmMode);

  return presetKey === "crm" && mode ? `${preset?.label || "CRM export"} / ${mode.label}` : preset?.label || "CSV";
}

function formatActivityFieldLabel(field: ActivityChangedField) {
  const labels: Record<ActivityChangedField, string> = {
    owner: "Owner",
    stage: "Stage",
    notes: "Notes"
  };

  return labels[field];
}

function formatActivityContextValue(context: ProspectPipelineContext, field: ActivityChangedField) {
  if (field === "stage") {
    return formatPipelineStageLabel(context.stage);
  }

  const value = context[field]?.trim();
  if (value) {
    return value;
  }

  return field === "owner" ? "Unassigned" : "Empty";
}

function formatCardList(values: string[]) {
  return values.map((value) => value.trim()).filter(Boolean).join(", ") || "None found";
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
  const stage = pipelineStageOptions.some((option) => option.value === value?.stage)
    ? value!.stage
    : defaultProspectMeta.stage;

  return {
    owner: typeof value?.owner === "string" ? value.owner : "",
    stage,
    notes: typeof value?.notes === "string" ? value.notes : "",
    updatedAt: typeof value?.updatedAt === "string" ? value.updatedAt : null
  };
}

function leadPreviewProspect(lead: LeadListItem): ProspectCardType {
  return {
    ...SAMPLE_PROSPECT_CARD,
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
  return prospectCardTabs.some((tab) => tab.value === value) ? (value as ProspectCardTab) : "overview";
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
  url.pathname = "/app/leads";
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
  if (pathname.startsWith("/app/leads")) {
    return "leads";
  }

  if (pathname.startsWith("/app/settings/icp")) {
    return "icp";
  }

  if (pathname.startsWith("/app/analytics")) {
    return "analytics";
  }

  if (pathname.startsWith("/app/account")) {
    return "account";
  }

  if (pathname.startsWith("/app/billing")) {
    return "billing";
  }

  return "dashboard";
}

function appPageCopy(section: AppSection) {
  switch (section) {
    case "leads":
      return {
        eyebrow: "Lead library",
        title: "Saved prospects",
        copy: "Review qualified accounts, fit scores, confidence, and the Prospect Card your team can export."
      };
    case "icp":
      return {
        eyebrow: "ICP settings",
        title: "Scoring profile",
        copy: "Tune the agency offer, industries, countries, and tone LeadCue uses when ranking websites."
      };
    case "billing":
      return {
        eyebrow: "Credits and billing",
        title: "Plan usage",
        copy: "Track remaining scan credits, subscription state, and the plan path for your outbound volume."
      };
    case "analytics":
      return {
        eyebrow: "Analytics",
        title: "Research funnel",
        copy: "See which actions actually move from product interest to saved scans, exports, and CRM handoff."
      };
    case "account":
      return {
        eyebrow: "Account",
        title: "Profile and access",
        copy: "Manage workspace identity, password access, and the secure session your team uses to enter LeadCue."
      };
    default:
      return {
        eyebrow: "Workspace",
        title: "Prospect research dashboard",
        copy: "Run website scans, review Prospect Cards, and keep outbound research connected to credits."
      };
  }
}

function buildGoogleAuthHref(options: {
  intent: "login" | "signup";
  planId?: PricingPlan["id"];
  focus?: string;
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

  return apiUrl(`/api/auth/google/start?${params.toString()}`);
}

function formatCalendarDate(value: string | null | undefined) {
  if (!value) {
    return "Not scheduled";
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

function LoginPage() {
  const { locale, siteUi, localizeHref } = usePublicSite();
  const authCopy = siteUi.auth.login;
  const authMessage = getAuthErrorMessage(siteUi);
  const [loginForm, setLoginForm] = useState<LoginFormState>({ email: "", password: "" });
  const [loginState, setLoginState] = useState<"idle" | "loading" | "error">("idle");
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showResetPanel, setShowResetPanel] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetState, setResetState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [resetMessage, setResetMessage] = useState("");
  const [resetLink, setResetLink] = useState("");

  function updateLoginField<Key extends keyof LoginFormState>(field: Key) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      setLoginForm((current) => ({ ...current, [field]: event.target.value }));
      if (loginState === "error") {
        setLoginState("idle");
        setLoginError("");
      }
    };
  }

  async function submitEmailLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = loginForm.email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || loginForm.password.length < 8) {
      setLoginState("error");
      setLoginError(authCopy.validation.invalidLogin);
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
        setLoginState("error");
        setLoginError(result.error || authCopy.validation.emailLoginFailed);
        return;
      }

      void trackEvent({
        name: "auth_login_email_success",
        metadata: {
          method: "email"
        }
      });
      window.location.href = localizeHref(result.next || "/app?login=1");
    } catch (error) {
      console.error("email_login_failed", error);
      setLoginState("error");
      setLoginError(authCopy.validation.emailLoginUnavailable);
    }
  }

  async function submitPasswordResetRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = resetEmail.trim().toLowerCase() || loginForm.email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setResetState("error");
      setResetMessage(authCopy.validation.invalidResetEmail);
      setResetLink("");
      return;
    }

    setResetState("loading");
    setResetMessage("");
    setResetLink("");

    try {
      const response = await fetch(apiUrl("/api/auth/password/request-reset"), {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });
      const result = (await response.json().catch(() => ({}))) as { ok?: boolean; message?: string; resetUrl?: string; error?: string };

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Password reset is unavailable right now.");
      }

      setResetState("success");
      setResetMessage(result.message || authCopy.validation.resetPrepared);
      setResetLink(result.resetUrl || "");
      void trackEvent({
        name: "auth_password_reset_requested",
        metadata: {
          emailDomain: email.split("@")[1] || "unknown"
        }
      });
    } catch (error) {
      setResetState("error");
      setResetMessage(error instanceof Error ? error.message : authCopy.validation.resetUnavailable);
      setResetLink("");
    }
  }

  return (
    <div className="site-shell">
      <header className="topbar topbar-minimal">
        <a className="brand" href={localizeHref("/")} aria-label={`${siteUi.common.brand} ${siteUi.common.home}`}>
          <BrandMark />
          <span>{siteUi.common.brand}</span>
        </a>
        <div className="topbar-control-dock" aria-label={`${siteUi.common.languageLabel} and ${siteUi.common.home}`}>
          <LanguageSwitcher />
          <a className="button button-small button-secondary topbar-back" href={localizeHref("/")}>
            <Icon name="arrow" />
            <span className="topbar-back-label">{siteUi.common.backHome}</span>
          </a>
        </div>
      </header>

      <main className="auth-page login-page">
        <section className="login-showcase" aria-label="LeadCue prospect research preview">
          <LoginWorkspaceIllustration
            locale={locale}
            copy={{
              eyebrow: authCopy.heroEyebrow,
              title: authCopy.heroTitle,
              copy: authCopy.heroCopy,
              proofItems: authCopy.proofItems
            }}
          />
          <div className="login-showcase-overlay" />
        </section>

        <section className="auth-card login-card glass-card">
          <p className="eyebrow">{authCopy.cardEyebrow}</p>
          <h1>{authCopy.cardTitle}</h1>
          <p className="auth-copy">{authCopy.cardCopy}</p>
          <a
            className="button button-primary auth-google-button"
            href={buildGoogleAuthHref({ intent: "login", returnTo: buildLocalePath(locale, "/app") })}
            onClick={() => {
              void trackEvent({ name: "auth_login_google_click", metadata: { method: "google" } });
            }}
          >
            {authCopy.googleCta}
          </a>
          <div className="oauth-divider" aria-hidden="true">
            <span>{authCopy.divider}</span>
          </div>
          <form className="login-form" onSubmit={submitEmailLogin}>
            <label className="auth-field">
              <span>{authCopy.emailLabel}</span>
              <input
                type="email"
                name="email"
                value={loginForm.email}
                onChange={updateLoginField("email")}
                autoComplete="email"
                placeholder={authCopy.emailPlaceholder}
                required
              />
            </label>
            <label className="auth-field">
              <span>{authCopy.passwordLabel}</span>
              <div className="password-input-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={loginForm.password}
                  onChange={updateLoginField("password")}
                  autoComplete="current-password"
                  minLength={8}
                  placeholder={authCopy.passwordPlaceholder}
                  required
                />
                <button
                  className="password-toggle"
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-pressed={showPassword}
                >
                  {showPassword ? authCopy.hide : authCopy.show}
                </button>
              </div>
            </label>
            <button className="button button-secondary auth-email-button" type="submit" disabled={loginState === "loading"}>
              <Icon name="mail" />
              {loginState === "loading" ? authCopy.emailLoading : authCopy.emailCta}
            </button>
          </form>
          <div className="auth-inline-links">
            <button
              className="auth-text-link"
              type="button"
              onClick={() => {
                setShowResetPanel((current) => !current);
                setResetEmail((current) => current || loginForm.email);
                setResetState("idle");
                setResetMessage("");
                setResetLink("");
              }}
            >
              {showResetPanel ? authCopy.hideReset : authCopy.forgotPassword}
            </button>
            <a className="auth-text-link" href={localizeHref("/support")}>
              {authCopy.needHelp}
            </a>
          </div>
          {showResetPanel ? (
            <form className="auth-support-card" onSubmit={submitPasswordResetRequest}>
              <div>
                <strong>{authCopy.resetTitle}</strong>
                <p>{authCopy.resetCopy}</p>
              </div>
              <label className="auth-field">
                <span>{authCopy.resetEmailLabel}</span>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(event) => setResetEmail(event.currentTarget.value)}
                  placeholder={authCopy.emailPlaceholder}
                  autoComplete="email"
                  required
                />
              </label>
              <button className="button button-secondary" type="submit" disabled={resetState === "loading"}>
                {resetState === "loading" ? authCopy.resetLoading : authCopy.resetCta}
              </button>
              <p
                className={`form-status ${
                  resetState === "error" ? "is-error" : resetState === "success" ? "is-success" : ""
                }`}
                role="status"
              >
                {resetMessage || " "}
              </p>
              {resetLink ? (
                <a className="button button-secondary auth-dev-link" href={resetLink}>
                  {authCopy.resetOpenLink}
                </a>
              ) : null}
              <small className="auth-compact-note">{authCopy.resetDevNote}</small>
            </form>
          ) : null}
          {authMessage ? (
            <p className="form-status is-error auth-message" role="alert">
              {authMessage}
            </p>
          ) : null}
          {loginError ? (
            <p className="form-status is-error auth-message" role="alert">
              {loginError}
            </p>
          ) : null}
          <p className="auth-note">{authCopy.sessionNote}</p>
          <div className="auth-signup-row">
            <div>
              <span>{authCopy.signupLead}</span>
              <p>{authCopy.signupCopy}</p>
            </div>
            <a
              className="button button-secondary auth-signup-button"
              href={localizeHref("/signup?plan=free")}
              onClick={() => {
                void trackEvent({ name: "auth_signup_cta_click", metadata: { source: "login_page" } });
              }}
            >
              {authCopy.signupCta}
            </a>
          </div>
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
        throw new Error(result.error || resetCopy.invalidLink);
      }

      setResetState("success");
      setStatusMessage(resetCopy.success);
      void trackEvent({ name: "auth_password_reset_completed" });
      window.setTimeout(() => {
        window.location.assign(localizeHref(result.next || "/app?login=1"));
      }, 600);
    } catch (error) {
      setResetState("error");
      setStatusMessage(error instanceof Error ? error.message : resetCopy.genericError);
    }
  }

  return (
    <div className="site-shell">
      <header className="topbar topbar-minimal">
        <a className="brand" href={localizeHref("/")} aria-label={`${siteUi.common.brand} ${siteUi.common.home}`}>
          <BrandMark />
          <span>{siteUi.common.brand}</span>
        </a>
        <div className="topbar-control-dock" aria-label={`${siteUi.common.languageLabel} and ${siteUi.common.backToSignIn}`}>
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
        throw new Error(result.error || signupCopy.validation.setupFailed);
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
      setStatusMessage(error instanceof Error ? error.message : signupCopy.validation.setupFailed);
    }
  }

  return (
    <div className="site-shell">
      <header className="topbar topbar-minimal">
        <a className="brand" href={localizeHref("/")} aria-label={`${siteUi.common.brand} ${siteUi.common.home}`}>
          <BrandMark />
          <span>{siteUi.common.brand}</span>
        </a>
        <div className="topbar-control-dock" aria-label={`${siteUi.common.languageLabel} and ${siteUi.common.home}`}>
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

function DashboardApp() {
  const appQuery = useMemo(() => new URLSearchParams(window.location.search), []);
  const appSection = getAppSection(window.location.pathname);
  const pageCopy = appPageCopy(appSection);
  const welcomeFlow = appQuery.get("welcome") === "1";
  const loginFlow = appQuery.get("login") === "1";
  const checkoutSuccess = appQuery.get("checkout") === "success";
  const [snapshot, setSnapshot] = useState<WorkspaceSnapshot>(sampleWorkspace);
  const [leads, setLeads] = useState<LeadListItem[]>(demoLeadRows);
  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>(demoScanHistory);
  const [historyState, setHistoryState] = useState<"loading" | "ready" | "sample" | "error">("loading");
  const [historyFilter, setHistoryFilter] = useState<ScanHistoryFilter>("all");
  const [historyDateFilter, setHistoryDateFilter] = useState<HistoryDateFilter>("all");
  const [historyReasonFilter, setHistoryReasonFilter] = useState("all");
  const [expandedScanId, setExpandedScanId] = useState<string | null>(null);
  const [analyticsSummary, setAnalyticsSummary] = useState<AnalyticsSummary>(sampleAnalyticsSummary);
  const [analyticsState, setAnalyticsState] = useState<"loading" | "ready" | "sample" | "error">("loading");
  const [leadSearch, setLeadSearch] = useState("");
  const [leadSort, setLeadSort] = useState<LeadSortOption>("newest");
  const [leadMinFit, setLeadMinFit] = useState(0);
  const [leadMinConfidence, setLeadMinConfidence] = useState(0);
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [bulkExportPreset, setBulkExportPreset] = useState<Exclude<ProspectExportPresetKey, "custom">>("crm");
  const [bulkCrmFieldMode, setBulkCrmFieldMode] = useState<ProspectCrmFieldMode>("hubspot");
  const [bulkExportState, setBulkExportState] = useState<"idle" | "loading" | "error">("idle");
  const [dashboardState, setDashboardState] = useState<"loading" | "ready" | "sample">("loading");
  const [dashboardMessage, setDashboardMessage] = useState("");
  const [auth, setAuth] = useState<AuthMeResponse>({ authenticated: false });
  const [profileForm, setProfileForm] = useState<AccountProfileFormState>({
    name: "",
    workspaceName: sampleWorkspace.workspace.name
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
  const [icpForm, setIcpForm] = useState<IcpFormState>(() => icpFormFromSetup(sampleWorkspace.setup));
  const [icpSaveState, setIcpSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [icpMessage, setIcpMessage] = useState("");
  const [scanForm, setScanForm] = useState<ScanFormState>(() => ({
    url: sampleWorkspace.setup.firstProspectUrl || "",
    companyName: SAMPLE_PROSPECT_CARD.companyName,
    notes: "Homepage shows the demo CTA below the fold and does not show visible case studies in the main navigation.",
    deepScan: false
  }));
  const [scanState, setScanState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [scanMessage, setScanMessage] = useState("");
  const [activeProspect, setActiveProspect] = useState<ProspectCardType>({
    ...SAMPLE_PROSPECT_CARD,
    savedStatus: "saved" as const,
    exportStatus: "not_exported" as const,
    pipelineContext: { ...defaultProspectMeta }
  });
  const [lastScanError, setLastScanError] = useState<ScanFailureResponse | null>(null);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(demoLeadRows[0]?.id || null);
  const [selectedLead, setSelectedLead] = useState<ProspectCardType | null>({
    ...SAMPLE_PROSPECT_CARD,
    savedStatus: "saved" as const,
    exportStatus: "not_exported" as const,
    pipelineContext: { ...defaultProspectMeta }
  });
  const [selectedLeadState, setSelectedLeadState] = useState<"idle" | "loading" | "ready" | "error">("ready");
  const [isLeadDrawerOpen, setLeadDrawerOpen] = useState(false);
  const topSignals = useMemo(
    () =>
      SAMPLE_PROSPECT_CARD.opportunitySignals.reduce<Record<string, number>>((acc, signal) => {
        acc[signal.category] = (acc[signal.category] ?? 0) + 1;
        return acc;
      }, {}),
    []
  );

  useEffect(() => {
    let cancelled = false;
    const requestedLeadId = appQuery.get("lead") || appQuery.get("leadId");

    async function loadDashboard() {
      try {
        const [authResponse, workspaceResponse, leadsResponse, scansResponse, analyticsResponse] = await Promise.all([
          fetch(apiUrl("/api/auth/me"), { credentials: "include" }),
          fetch(apiUrl("/api/workspace"), { credentials: "include" }),
          fetch(apiUrl("/api/leads"), { credentials: "include" }),
          fetch(apiUrl("/api/scans"), { credentials: "include" }),
          fetch(apiUrl("/api/analytics/summary"), { credentials: "include" })
        ]);

        if (!workspaceResponse.ok) {
          throw new Error("Workspace data is not available yet.");
        }

        const authData = authResponse.ok
          ? ((await authResponse.json()) as AuthMeResponse)
          : ({ authenticated: false } as AuthMeResponse);
        const workspaceData = (await workspaceResponse.json()) as WorkspaceSnapshot;
        const leadsData = leadsResponse.ok
          ? ((await leadsResponse.json()) as { leads?: LeadListItem[] })
          : { leads: demoLeadRows };
        const scansData = scansResponse.ok
          ? ((await scansResponse.json()) as { scans?: ScanHistoryItem[]; source?: "d1" | "sample" })
          : { scans: demoScanHistory, source: "sample" as const };
        const analyticsData = analyticsResponse.ok
          ? ((await analyticsResponse.json()) as AnalyticsSummary)
          : sampleAnalyticsSummary;
        const loadedLeads = leadsData.leads?.length ? leadsData.leads : [];
        const initialLeadRow =
          requestedLeadId && loadedLeads.length
            ? loadedLeads.find((lead) => lead.id === requestedLeadId) || loadedLeads[0]
            : loadedLeads[0];
        let initialLeadDetail: ProspectCardType | null = null;

        if (initialLeadRow) {
          const detailResponse = await fetch(apiUrl(`/api/leads/${encodeURIComponent(initialLeadRow.id)}`), {
            credentials: "include"
          }).catch(() => null);

          if (detailResponse?.ok) {
            const detailData = (await detailResponse.json().catch(() => ({}))) as { lead?: ProspectCardType };
            initialLeadDetail = detailData.lead || null;
          }
        }

        if (!cancelled) {
          const fallbackLeadDetail = initialLeadRow ? leadPreviewProspect(initialLeadRow) : null;
          const resolvedLeadDetail =
            initialLeadDetail || fallbackLeadDetail || (workspaceData.source === "sample" ? activeProspect : null);
          const resolvedLeadId = initialLeadRow?.id || (workspaceData.source === "sample" ? demoLeadRows[0]?.id || null : null);
          const routeMessage = checkoutSuccess
            ? "Billing is active. Finish the first setup below."
            : welcomeFlow
              ? "Workspace created. Finish the first setup below."
              : loginFlow
                ? "Signed in."
                : "";
          setAuth(authData);
          setSnapshot(workspaceData);
          setLeads(loadedLeads);
          setSelectedLeadId(resolvedLeadDetail ? resolvedLeadId : null);
          setSelectedLead(resolvedLeadDetail);
          setSelectedLeadState(initialLeadDetail || workspaceData.source === "sample" ? "ready" : fallbackLeadDetail ? "error" : "idle");
          setLeadDrawerOpen(Boolean(requestedLeadId && resolvedLeadDetail && appSection === "leads"));
          if (initialLeadDetail) {
            setActiveProspect(initialLeadDetail);
          }
          setScanHistory(scansData.scans?.length ? scansData.scans : workspaceData.source === "sample" ? demoScanHistory : []);
          setHistoryState(scansData.source === "sample" ? "sample" : "ready");
          setAnalyticsSummary(analyticsData);
          setAnalyticsState(analyticsData.source === "sample" ? "sample" : "ready");
          setDashboardState(workspaceData.source === "sample" ? "sample" : "ready");
          setDashboardMessage(
            authData.authenticated
              ? workspaceData.warning || routeMessage
              : "Demo preview. Create a workspace to save prospects and track credits with a secure session."
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
          setAuth({ authenticated: false });
          setSnapshot(sampleWorkspace);
          setLeads(demoLeadRows);
          setScanHistory(demoScanHistory);
          setHistoryState("sample");
          setAnalyticsSummary(sampleAnalyticsSummary);
          setAnalyticsState("sample");
          setSelectedLeadId(demoLeadRows[0]?.id || null);
          setSelectedLead({
            ...SAMPLE_PROSPECT_CARD,
            savedStatus: "saved",
            exportStatus: "not_exported",
            pipelineContext: { ...defaultProspectMeta }
          });
          setSelectedLeadState("ready");
          setDashboardState("sample");
          setDashboardMessage(
            error instanceof Error
              ? `${error.message} Showing sample workspace data.`
              : "Showing sample workspace data."
          );
        }
      }
    }

    void loadDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setScanForm((current) =>
      current.url
        ? current
        : {
            ...current,
            url: snapshot.setup.firstProspectUrl || snapshot.setup.agencyWebsite || "",
            companyName: snapshot.workspace.name.replace(/\s*workspace$/i, "") || current.companyName
          }
    );
  }, [snapshot.setup.agencyWebsite, snapshot.setup.firstProspectUrl, snapshot.workspace.name]);

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

  function prepareFirstScan() {
    void trackEvent({
      name: "workspace_prepare_first_scan",
      metadata: {
        hasSeedUrl: Boolean(snapshot.setup.firstProspectUrl)
      }
    });
    setScanForm((current) => ({
      ...current,
      url: snapshot.setup.firstProspectUrl || current.url,
      companyName: snapshot.workspace.name.replace(/\s*workspace$/i, "") || current.companyName
    }));
    setDashboardMessage(
      snapshot.setup.firstProspectUrl
        ? `${formatCompactUrl(snapshot.setup.firstProspectUrl)} is loaded in the scan desk. Review the notes, then run the scan.`
        : "Add a prospect website in the scan desk to create the first saved Prospect Card."
    );
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
      const response = await fetch(apiUrl("/api/workspace/icp"), {
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
      setIcpMessage("ICP saved. New scans will use this scoring profile.");
    } catch (error) {
      setIcpSaveState("error");
      setIcpMessage(error instanceof Error ? error.message : "Unable to save ICP settings.");
    }
  }

  async function submitProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!auth.authenticated) {
      setProfileSaveState("error");
      setProfileMessage("Sign in to update workspace profile details.");
      return;
    }

    const payload = {
      name: profileForm.name.trim(),
      workspaceName: profileForm.workspaceName.trim()
    };

    if (!payload.name || !payload.workspaceName) {
      setProfileSaveState("error");
      setProfileMessage("Owner name and workspace name are both required.");
      return;
    }

    setProfileSaveState("saving");
    setProfileMessage("");

    try {
      const response = await fetch(apiUrl("/api/account/profile"), {
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
        throw new Error(result.error || "Unable to update workspace profile.");
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
      setProfileMessage("Workspace profile saved.");
      void trackEvent({
        name: "account_profile_updated",
        metadata: {
          workspaceNameLength: payload.workspaceName.length
        }
      });
    } catch (error) {
      setProfileSaveState("error");
      setProfileMessage(error instanceof Error ? error.message : "Unable to update workspace profile.");
    }
  }

  async function submitPasswordChange(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!auth.authenticated) {
      setAccountPasswordState("error");
      setAccountPasswordMessage("Sign in to change the workspace password.");
      return;
    }

    if (accountPasswordForm.nextPassword.length < 8) {
      setAccountPasswordState("error");
      setAccountPasswordMessage("Use at least 8 characters for the new password.");
      return;
    }

    if (accountPasswordForm.nextPassword !== accountPasswordForm.confirmPassword) {
      setAccountPasswordState("error");
      setAccountPasswordMessage("The new password and confirmation need to match.");
      return;
    }

    setAccountPasswordState("saving");
    setAccountPasswordMessage("");

    try {
      const response = await fetch(apiUrl("/api/auth/password/update"), {
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
        throw new Error(result.error || "Unable to update the password.");
      }

      setAccountPasswordForm({
        currentPassword: "",
        nextPassword: "",
        confirmPassword: ""
      });
      setAccountPasswordState("saved");
      setAccountPasswordMessage(result.message || "Password updated.");
      void trackEvent({ name: "account_password_updated" });
    } catch (error) {
      setAccountPasswordState("error");
      setAccountPasswordMessage(error instanceof Error ? error.message : "Unable to update the password.");
    }
  }

  async function startPlanCheckout(planId: PricingPlan["id"]) {
    if (!auth.authenticated) {
      window.location.assign(`/signup?plan=${planId}`);
      return;
    }

    if (snapshot.plan.id === planId) {
      setDashboardMessage(`You are already on the ${snapshot.plan.name} plan.`);
      return;
    }

    setDashboardMessage("");

    try {
      const response = await fetch(apiUrl("/api/billing/checkout"), {
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
        throw new Error(result.error || "Checkout is not available for that plan right now.");
      }

      void trackEvent({
        name: "billing_checkout_started",
        metadata: {
          planId
        }
      });
      window.location.assign(checkoutUrl);
    } catch (error) {
      setDashboardMessage(error instanceof Error ? error.message : "Checkout is not available for that plan right now.");
    }
  }

  function applySavedPipelineContext(result: PipelineContextSaveResult) {
    const { context, activity } = result;
    const normalized = normalizeProspectMeta(context);

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
      selectedLead && current.domain === selectedLead.domain
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
      const response = await fetch(apiUrl(`/api/leads/${encodeURIComponent(lead.id)}`), {
        credentials: "include"
      });
      const result = (await response.json().catch(() => ({}))) as { lead?: ProspectCardType; error?: string };

      if (!response.ok || !result.lead) {
        throw new Error(result.error || "Lead detail is not available.");
      }

      setSelectedLead(result.lead);
      setActiveProspect(result.lead);
      setSelectedLeadState("ready");
    } catch (error) {
      setSelectedLead(leadPreviewProspect(lead));
      setSelectedLeadState("error");
      setDashboardMessage(error instanceof Error ? error.message : "Unable to load lead detail.");
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
        error: "Enter a valid prospect website URL.",
        creditsCharged: 0,
        retryable: false
      });
      setScanMessage("Enter a valid prospect website URL. No credit was used. Fix the URL and try again.");
      return;
    }

    setScanState("loading");
    setScanMessage("");
    setLastScanError(null);
    setDashboardMessage("");

    const companyName = scanForm.companyName.trim() || companyNameFromUrl(normalizedUrl);
    const domain = hostnameFromUrl(normalizedUrl);
    const scanPayload: ScanRequest = {
      source: "web",
      deepScan: scanForm.deepScan,
      page: {
        url: normalizedUrl,
        title: `${companyName} website`,
        metaDescription: `${companyName} public website reviewed from the LeadCue dashboard scan desk.`,
        h1: companyName,
        text:
          scanForm.notes.trim() ||
          `${companyName} has a public website with service pages, calls to action, proof, navigation, and contact paths that LeadCue should evaluate for agency outbound fit.`,
        links: [normalizedUrl, `${normalizedUrl.replace(/\/$/, "")}/services`, `${normalizedUrl.replace(/\/$/, "")}/contact`]
      },
      icp: {
        serviceType: serviceTypeForFocus(snapshot.setup.agencyFocus || snapshot.setup.serviceType),
        targetIndustries: snapshot.setup.targetIndustries,
        targetCountries: snapshot.setup.targetCountries,
        offerDescription: snapshot.setup.offerDescription,
        tone: toneForWorkspace(snapshot.setup.tone)
      },
      idempotencyKey: `web_scan_${crypto.randomUUID()}`
    };
    let pendingFailure: ScanFailureResponse | null = null;

    try {
      const response = await fetch(apiUrl("/api/scans"), {
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
                error: "Scan failed. Try again with a fuller website snapshot.",
                creditsCharged: 0,
                retryable: true
              } satisfies ScanFailureResponse);
        pendingFailure = failure;
        setLastScanError(failure);
        throw new Error(`${failure.error} No credit was used. Fix the URL and try again.`);
      }

      setActiveProspect(result.prospect);
      setSelectedLeadId(result.leadId);
      setSelectedLead(result.prospect);
      setSelectedLeadState("ready");
      setLeadDrawerOpen(true);
      replaceLeadDeepLink(result.leadId, "overview");
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
        `${result.prospect.companyName} is saved as a Prospect Card. ${result.creditsCharged} credit${result.creditsCharged === 1 ? "" : "s"} used.`
      );
      setDashboardMessage("Scan complete. Review the Prospect Card before exporting or writing outreach.");
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
      setScanMessage(
        error instanceof Error
          ? error.message
          : "Scan failed. No credit was used. Fix the URL and try again."
      );
    }
  }

  async function completeOnboarding() {
    setOnboardingState("saving");

    try {
      const response = await fetch(apiUrl("/api/workspace/onboarding/complete"), {
        method: "POST",
        credentials: "include"
      });
      const result = (await response.json().catch(() => ({}))) as { completedAt?: string; error?: string };

      if (!response.ok) {
        throw new Error(result.error || "Unable to update onboarding.");
      }

      setSnapshot((current) => ({
        ...current,
        onboarding: {
          isComplete: true,
          completedAt: result.completedAt || new Date().toISOString()
        }
      }));
      void trackEvent({ name: "workspace_onboarding_completed" });
      setDashboardMessage("Setup guide dismissed.");
    } catch (error) {
      setDashboardMessage(error instanceof Error ? error.message : "Unable to update onboarding.");
    } finally {
      setOnboardingState("idle");
    }
  }

  async function downloadCsv() {
    setDashboardMessage("");

    try {
      const query = new URLSearchParams({
        preset: bulkExportPreset,
        crmMode: bulkCrmFieldMode
      });
      const response = await fetch(apiUrl(`/api/exports?${query.toString()}`), {
        method: "POST",
        credentials: "include"
      });

      if (!response.ok) {
        throw new Error("CSV export is not available for this workspace.");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "leadcue-export.csv";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setActiveProspect((current) => ({ ...current, exportStatus: "exported" }));
      void trackEvent({
        name: "export_completed",
        metadata: {
          preset: bulkExportPreset,
          crmMode: bulkCrmFieldMode
        }
      });
      setDashboardMessage(
        `CSV export prepared with ${bulkExportLabel(bulkExportPreset, bulkCrmFieldMode)} fields.`
      );
    } catch (error) {
      setDashboardMessage(error instanceof Error ? error.message : "CSV export failed.");
    }
  }

  async function openBillingPortal() {
    setDashboardMessage("");

    try {
      const response = await fetch(apiUrl("/api/billing/portal"), {
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
      setDashboardMessage(error instanceof Error ? error.message : "Billing portal is not available yet.");
    }
  }

  async function signOut() {
    void trackEvent({ name: "auth_sign_out" });
    await fetch(apiUrl("/api/auth/logout"), { method: "POST", credentials: "include" }).catch(() => null);
    setAuth({ authenticated: false });
    setDashboardState("sample");
    setSnapshot(sampleWorkspace);
    setLeads(demoLeadRows);
    setScanHistory(demoScanHistory);
    setHistoryState("sample");
    setAnalyticsSummary(sampleAnalyticsSummary);
    setAnalyticsState("sample");
    setHistoryDateFilter("all");
    setHistoryReasonFilter("all");
    setSelectedLeadIds([]);
    setSelectedLeadId(demoLeadRows[0]?.id || null);
    setSelectedLead({
      ...SAMPLE_PROSPECT_CARD,
      savedStatus: "saved",
      exportStatus: "not_exported",
      pipelineContext: { ...defaultProspectMeta }
    });
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
    setDashboardMessage("Signed out. Showing the demo preview.");
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

  async function loadLeadExportCard(lead: LeadListItem): Promise<ProspectCardType> {
    if (selectedLeadId === lead.id && selectedLead) {
      return selectedLead;
    }

    if (dashboardState === "sample") {
      return leadPreviewProspect(lead);
    }

    try {
      const response = await fetch(apiUrl(`/api/leads/${encodeURIComponent(lead.id)}`), {
        credentials: "include"
      });
      const result = (await response.json().catch(() => ({}))) as { lead?: ProspectCardType };

      if (response.ok && result.lead) {
        return result.lead;
      }
    } catch {
      // Fall back to the list preview when detail fetch is unavailable.
    }

    return leadPreviewProspect(lead);
  }

  async function exportSelectedLeads() {
    const selectedRows = sourceLeads.filter((lead) => selectedLeadIds.includes(lead.id));
    if (!selectedRows.length) {
      setDashboardMessage("Select at least one lead before exporting.");
      return;
    }

    setBulkExportState("loading");

    try {
      const cards = await Promise.all(selectedRows.map(loadLeadExportCard));
      const csv = buildProspectExportCsv(
        cards.map((card) => ({ card, pipelineContext: card.pipelineContext })),
        bulkExportPreset,
        bulkCrmFieldMode
      );
      const modePart = bulkExportPreset === "crm" ? `-${bulkCrmFieldMode}` : "";
      downloadTextFile(`leadcue-selected-${selectedRows.length}-${bulkExportPreset}${modePart}.csv`, csv);
      setBulkExportState("idle");
      setDashboardMessage(
        `${selectedRows.length} selected lead${selectedRows.length === 1 ? "" : "s"} exported with ${bulkExportLabel(
          bulkExportPreset,
          bulkCrmFieldMode
        )} fields.`
      );
    } catch (error) {
      setBulkExportState("error");
      setDashboardMessage(error instanceof Error ? error.message : "Selected lead export failed.");
    }
  }

  function resetHistorySecondaryFilters() {
    setHistoryDateFilter("all");
    setHistoryReasonFilter("all");
    setExpandedScanId(null);
  }

  const metricRows = [
    ["Saved prospects", String(snapshot.leadCount || leads.length)],
    ["Current plan", snapshot.plan.name],
    ["Credits left", snapshot.credits.remaining.toLocaleString()],
    ["Subscription", formatSubscriptionStatus(snapshot.subscription.status)]
  ];
  const isSampleDashboard = dashboardState === "sample";
  const sourceLeads = leads.length ? leads : isSampleDashboard ? demoLeadRows : [];
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
          const reason = formatHistoryReason(scan.reason || "generation_failed");
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
          (scan.status === "failed" && formatHistoryReason(scan.reason || "generation_failed") === historyReasonFilter);

        return dateMatches && statusMatches && reasonMatches;
      });
    },
    [historyDateFilter, historyFilter, historyReasonFilter, scanHistory]
  );
  const historySecondaryFiltersActive = historyDateFilter !== "all" || historyReasonFilter !== "all";
  const onboardingTasks = [
    {
      label: "Targeting profile saved",
      description: snapshot.setup.offerDescription
        ? `Scoring is tuned for ${previewList(snapshot.setup.targetIndustries)}.`
        : "Define the offer and industries you want LeadCue to score against.",
      done: Boolean(snapshot.setup.offerDescription.trim() && snapshot.setup.targetIndustries.length)
    },
    {
      label: "First website queued",
      description: snapshot.setup.firstProspectUrl
        ? `Ready to scan: ${formatCompactUrl(snapshot.setup.firstProspectUrl)}`
        : snapshot.setup.agencyWebsite
          ? `Agency site saved: ${formatCompactUrl(snapshot.setup.agencyWebsite)}`
          : "Add the first target website when your team is ready to scan.",
      done: Boolean(snapshot.setup.firstProspectUrl)
    },
    {
      label: "First Prospect Card",
      description: snapshot.leadCount
        ? `${snapshot.leadCount} saved prospect${snapshot.leadCount === 1 ? "" : "s"} already in the workspace.`
        : "Run the first website scan to create a saved Prospect Card and export-ready notes.",
      done: snapshot.leadCount > 0
    }
  ];
  const onboardingProgress = onboardingTasks.filter((task) => task.done).length;
  const welcomeName = auth.authenticated ? firstName(auth.user.name) || snapshot.workspace.name : snapshot.workspace.name;
  const subscriptionStatusDetails = getSubscriptionStatusDetails(snapshot.subscription.status);
  const shouldShowOnboarding =
    auth.authenticated &&
    dashboardState === "ready" &&
    !snapshot.onboarding.isComplete &&
    snapshot.leadCount === 0;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="/" aria-label="LeadCue home">
          <BrandMark />
          <span>LeadCue</span>
        </a>
        <nav className="side-nav" aria-label="Dashboard navigation">
          <a className={appSection === "dashboard" ? "active" : ""} href="/app">
            <Icon name="browser" />
            Dashboard
          </a>
          <a className={appSection === "leads" ? "active" : ""} href="/app/leads">
            <Icon name="filter" />
            Leads
          </a>
          <a className={appSection === "icp" ? "active" : ""} href="/app/settings/icp">
            <Icon name="scan" />
            ICP
          </a>
          <a className={appSection === "billing" ? "active" : ""} href="/app/billing">
            <Icon name="shield" />
            Credits
          </a>
          <a className={appSection === "analytics" ? "active" : ""} href="/app/analytics">
            <Icon name="chart" />
            Analytics
          </a>
          <a className={appSection === "account" ? "active" : ""} href="/app/account">
            <Icon name="lock" />
            Account
          </a>
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <p className="eyebrow">{pageCopy.eyebrow}</p>
            <h1>{pageCopy.title}</h1>
            <p className="dashboard-page-copy">{pageCopy.copy}</p>
            <div className="workspace-status-row">
              <span>{snapshot.workspace.name}</span>
              <span className="status-pill">{snapshot.plan.name} plan</span>
              <span className={`status-pill ${subscriptionStatusDetails.tone}`}>{subscriptionStatusDetails.label}</span>
              <span className="status-pill">{auth.authenticated ? "Signed in" : "Demo preview"}</span>
            </div>
          </div>
          <div className="dashboard-actions">
            {auth.authenticated ? (
              <button className="button button-secondary" type="button" onClick={signOut}>
                <Icon name="lock" />
                Sign out
              </button>
            ) : (
              <a className="button button-secondary" href="/login">
                Continue with Google
              </a>
            )}
            <button className="button button-secondary" type="button" onClick={openBillingPortal}>
              <Icon name="shield" />
              Manage billing
            </button>
            <button className="button button-secondary" type="button" onClick={downloadCsv}>
              <Icon name="download" />
              Export CSV
            </button>
            <a className="button button-primary" href={appSection === "dashboard" ? "#scan-console" : "/app#scan-console"}>
              <Icon name="scan" />
              New scan
            </a>
          </div>
        </header>

        <div className="workspace-alert" role="status" aria-live="polite">
          {dashboardState === "loading" ? "Loading workspace data..." : dashboardMessage || " "}
        </div>

        {appSection === "dashboard" ? (
          <>
        <section className={`panel scan-console ${scanState === "loading" ? "is-loading" : ""}`} id="scan-console" aria-labelledby="scan-console-title">
          <div className="scan-console-copy">
            <p className="eyebrow">Scan desk</p>
            <h2 id="scan-console-title">Turn one website into a saved Prospect Card</h2>
            <p>
              Enter a real prospect URL, add what your team already noticed, and LeadCue will create
              fit scoring, evidence, first lines, and export-ready notes in the same workspace.
            </p>
            <div className="scan-flow-steps" aria-label="Scan workflow">
              {["Website", "Evidence", "Prospect Card"].map((step, index) => (
                <span className={index === 0 || scanState === "done" ? "is-active" : ""} key={step}>
                  {index + 1}. {step}
                </span>
              ))}
            </div>
          </div>

          <form className="scan-form" onSubmit={submitScan}>
            <label>
              Prospect website
              <input
                name="url"
                type="url"
                required
                placeholder="https://prospect.example.com"
                value={scanForm.url}
                onChange={updateScanField("url")}
              />
            </label>
            <label>
              Company name
              <input
                name="companyName"
                placeholder="Northstar Analytics"
                value={scanForm.companyName}
                onChange={updateScanField("companyName")}
              />
            </label>
            <label className="scan-form-wide">
              Website notes
              <textarea
                name="notes"
                rows={4}
                placeholder="Add visible proof gaps, CTA issues, SEO clues, or contact-path notes."
                value={scanForm.notes}
                onChange={updateScanField("notes")}
              />
            </label>
            <label className="scan-depth-toggle">
              <input type="checkbox" checked={scanForm.deepScan} onChange={updateScanField("deepScan")} />
              <span>
                Deep scan
                <small>Uses 3 credits for richer context.</small>
              </span>
            </label>
            <button className="button button-primary" type="submit" disabled={scanState === "loading"}>
              <Icon name="scan" />
              {scanState === "loading" ? "Scanning website..." : "Run scan"}
            </button>
            <p className={`form-status ${scanState === "error" ? "is-error" : scanState === "done" ? "is-success" : ""}`} role="status" aria-live="polite">
              {scanMessage || " "}
            </p>
            {scanState === "error" && lastScanError ? (
              <div className="scan-error-box" role="alert">
                <strong>No credit was used. Fix the URL and try again.</strong>
                <span>Reason: {lastScanError.reason.replace(/_/g, " ")}</span>
                <button className="button button-secondary" type="submit">
                  Retry scan
                </button>
              </div>
            ) : null}
          </form>

          <div className="scan-preview" aria-label="Scan output preview">
            <span className="side-label">Output preview</span>
            {scanState === "loading" ? (
              <div className="scan-skeleton" aria-label="Scan result loading">
                <i />
                <i />
                <i />
                <i />
              </div>
            ) : (
              <>
                <div className="scan-status-row">
                  <span className="status-pill">{activeProspect.savedStatus === "saved" ? "Saved" : "Unsaved"}</span>
                  <span className="status-pill">
                    {activeProspect.exportStatus === "exported" ? "Exported" : "Not exported"}
                  </span>
                </div>
                <div className="scan-preview-row">
                  <strong>{activeProspect.companyName}</strong>
                  <span>{activeProspect.domain}</span>
                  <em>{activeProspect.fitScore} fit</em>
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
                  <span>First line</span>
                  <p>{activeProspect.firstLines[0]}</p>
                </div>
              </>
            )}
          </div>
        </section>

        {shouldShowOnboarding ? (
          <section className="panel dashboard-onboarding" aria-labelledby="dashboard-onboarding-title">
            <div className="dashboard-onboarding-head">
              <div className="dashboard-onboarding-copy">
                <p className="eyebrow">First run</p>
                <h2 id="dashboard-onboarding-title">
                  {welcomeFlow || checkoutSuccess ? `Welcome, ${welcomeName}.` : `Workspace ready, ${welcomeName}.`}
                </h2>
                <p>
                  LeadCue already has your plan and scoring defaults. Finish one scan to start saving
                  Prospect Cards, first lines, and export-ready notes.
                </p>
              </div>
              <div className="dashboard-onboarding-meta">
                <span className="status-pill">{onboardingProgress}/3 ready</span>
                <button
                  className="button button-small button-secondary"
                  type="button"
                  onClick={completeOnboarding}
                  disabled={onboardingState === "saving"}
                >
                  {onboardingState === "saving" ? "Saving..." : "Mark complete"}
                </button>
              </div>
            </div>

            <div className="dashboard-onboarding-layout">
              <div className="onboarding-checklist" role="list" aria-label="Workspace onboarding checklist">
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
                <span className="side-label">Setup snapshot</span>
                <div className="onboarding-field">
                  <span>Service</span>
                  <strong>{formatAgencyFocus(snapshot.setup.agencyFocus || snapshot.setup.serviceType)}</strong>
                </div>
                <div className="onboarding-field">
                  <span>Industries</span>
                  <strong>{previewList(snapshot.setup.targetIndustries, 4)}</strong>
                </div>
                <div className="onboarding-field">
                  <span>First target</span>
                  <strong>{formatCompactUrl(snapshot.setup.firstProspectUrl || snapshot.setup.agencyWebsite)}</strong>
                </div>
              </div>
            </div>

            <div className="dashboard-onboarding-footer">
              <button className="button button-primary" type="button" onClick={prepareFirstScan}>
                <Icon name="scan" />
                {snapshot.setup.firstProspectUrl ? "Prepare first scan" : "Run first scan"}
              </button>
              <a className="button button-secondary" href="#icp-panel">
                <Icon name="target" />
                Review ICP
              </a>
              {snapshot.plan.id !== "free" || snapshot.subscription.status !== "active" ? (
                <button className="button button-secondary" type="button" onClick={openBillingPortal}>
                  <Icon name="shield" />
                  Manage billing
                </button>
              ) : null}
            </div>
          </section>
        ) : null}

        <section className="metric-grid" aria-label="Workspace metrics">
          {metricRows.map(([label, value]) => (
            <article className="metric-card" key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
              {label === "Credits left" ? <small>{snapshot.credits.used.toLocaleString()} used this month</small> : null}
            </article>
          ))}
        </section>

        <section className="dashboard-grid">
          <div className="panel leads-panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Lead list</p>
                <h2>Saved prospects</h2>
              </div>
              <button className="icon-button" type="button" aria-label="Filter leads">
                <Icon name="filter" />
              </button>
            </div>
            <div className="lead-table" role="table" aria-label="Saved leads">
              <div className="lead-row lead-head" role="row">
                <span>Company</span>
                <span>Industry</span>
                <span>Fit</span>
                <span>Confidence</span>
              </div>
              {sourceLeads.length ? (
                sourceLeads.map((lead) => (
                  <div className="lead-row" role="row" key={lead.id || lead.domain}>
                    <strong>{lead.companyName}</strong>
                    <span>{lead.industry}</span>
                    <span>{lead.fitScore}</span>
                    <span>{Math.round(lead.confidenceScore * 100)}%</span>
                  </div>
                ))
              ) : (
                <div className="empty-table-state">
                  <strong>No saved prospects yet.</strong>
                  <span>Run a website scan from the extension or API, then saved Prospect Cards will appear here.</span>
                </div>
              )}
            </div>
          </div>

          {sourceLeads.length || isSampleDashboard ? (
            <ProspectCard card={activeProspect} compact />
          ) : (
            <div className="panel empty-prospect-panel">
              <p className="eyebrow">Prospect Card</p>
              <h2>Your first saved card will appear here</h2>
              <p>
                LeadCue saves fit score, website evidence, outreach angles, first lines, and export
                notes after a completed scan.
              </p>
              <button
                className="button button-primary"
                type="button"
                onClick={() => setDashboardMessage("Use the Chrome extension or POST /api/scans while signed in to create the first saved card.")}
              >
                <Icon name="scan" />
                Prepare first scan
              </button>
            </div>
          )}

          <div className="panel icp-panel" id="icp-panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">ICP settings</p>
                <h2>Agency mode</h2>
              </div>
            </div>
            <div className="settings-list">
              <Setting label="Service type" value={formatAgencyFocus(snapshot.setup.agencyFocus || snapshot.setup.serviceType)} />
              <Setting label="Target industries" value={previewList(snapshot.setup.targetIndustries, 4)} />
              <Setting label="Countries" value={previewList(snapshot.setup.targetCountries, 4)} />
              <Setting label="Tone" value={snapshot.setup.tone} />
              <Setting label="First target" value={formatCompactUrl(snapshot.setup.firstProspectUrl || snapshot.setup.agencyWebsite)} />
            </div>
          </div>

          <div className="panel signal-panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Signals</p>
                <h2>Current scan mix</h2>
              </div>
            </div>
            <div className="signal-bars">
              {Object.entries(topSignals).map(([name, count]) => (
                <div className="signal-bar" key={name}>
                  <span>{name.replace("_", " ")}</span>
                  <div>
                    <i style={{ width: `${Math.min(100, count * 34)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
          </>
        ) : null}

        {appSection === "leads" ? (
          <section className="app-page-grid leads-page-grid">
            <div className="panel leads-panel leads-page-panel">
              <div className="panel-header">
                <div>
                  <p className="eyebrow">Saved accounts</p>
                  <h2>Prospect library</h2>
                </div>
                <div className="panel-actions">
                  <button className="button button-secondary" type="button" onClick={downloadCsv}>
                    <Icon name="download" />
                    Export CSV
                  </button>
                  <a className="button button-primary" href="/app#scan-console">
                    <Icon name="scan" />
                    New scan
                  </a>
                </div>
              </div>
              <div className="lead-controls" aria-label="Prospect library controls">
                <label className="lead-search-field">
                  Search
                  <input
                    type="search"
                    value={leadSearch}
                    onChange={(event) => setLeadSearch(event.currentTarget.value)}
                    placeholder="Company, domain, or industry"
                  />
                </label>
                <label>
                  Sort
                  <select value={leadSort} onChange={(event) => setLeadSort(event.currentTarget.value as LeadSortOption)}>
                    {leadSortOptions.map((option) => (
                      <option value={option.value} key={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Min fit
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
                  Min confidence
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
                  Clear filters
                </button>
              </div>
              <div className="lead-result-meta" aria-live="polite">
                <span>
                  Showing {visibleLeads.length} of {sourceLeads.length} prospects
                </span>
                <span>{leadSortOptions.find((option) => option.value === leadSort)?.label || "Newest saved"}</span>
              </div>
              <div className="lead-bulk-toolbar" aria-label="Bulk prospect actions">
                <div>
                  <strong>{selectedSourceLeads.length} selected</strong>
                  <span>
                    {selectedSourceLeads.length
                      ? "Export only the accounts your team is ready to work."
                      : "Select prospects to export a focused CSV."}
                  </span>
                </div>
                <div className="lead-bulk-template" aria-label="Bulk CSV field template">
                  <label>
                    Template
                    <select
                      value={bulkExportPreset}
                      onChange={(event) => setBulkExportPreset(event.currentTarget.value as Exclude<ProspectExportPresetKey, "custom">)}
                    >
                      {prospectExportPresets.map((preset) => (
                        <option value={preset.key} key={preset.key}>
                          {preset.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  {bulkExportPreset === "crm" ? (
                    <label>
                      CRM fields
                      <select
                        value={bulkCrmFieldMode}
                        onChange={(event) => setBulkCrmFieldMode(event.currentTarget.value as ProspectCrmFieldMode)}
                      >
                        {prospectCrmFieldModes.map((mode) => (
                          <option value={mode.value} key={mode.value}>
                            {mode.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  ) : null}
                </div>
                <div className="lead-bulk-actions">
                  <button
                    className="button button-secondary button-small"
                    type="button"
                    onClick={toggleAllVisibleLeads}
                    disabled={!visibleLeads.length}
                  >
                    {allVisibleLeadsSelected ? "Clear visible" : "Select visible"}
                  </button>
                  <button
                    className="button button-secondary button-small"
                    type="button"
                    onClick={clearLeadSelection}
                    disabled={!selectedSourceLeads.length}
                  >
                    Clear selection
                  </button>
                  <button
                    className="button button-primary button-small"
                    type="button"
                    onClick={() => void exportSelectedLeads()}
                    disabled={!selectedSourceLeads.length || bulkExportState === "loading"}
                  >
                    <Icon name="download" />
                    {bulkExportState === "loading" ? "Exporting..." : "Export selected"}
                  </button>
                </div>
              </div>
              <div className="lead-table lead-table-expanded" role="table" aria-label="Saved prospects">
                <div className="lead-row lead-head" role="row">
                  <span className="lead-select-cell lead-select-heading">
                    <input
                      type="checkbox"
                      aria-label={allVisibleLeadsSelected ? "Clear all visible prospects" : "Select all visible prospects"}
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
                  <span>Company</span>
                  <span>Industry</span>
                  <span>Fit</span>
                  <span>Confidence</span>
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
                          aria-label={`Select ${lead.companyName}`}
                        />
                      </label>
                      <button
                        className="lead-row-open"
                        type="button"
                        onClick={() => void openLeadDetail(lead)}
                        aria-label={`Open Prospect Card for ${lead.companyName}`}
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
                    <strong>{sourceLeads.length ? "No matching prospects." : "No saved prospects yet."}</strong>
                    <span>
                      {sourceLeads.length
                        ? "Relax the search or score filters to bring more accounts back into view."
                        : "Run a website scan to create the first saved Prospect Card."}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <button
              className={`lead-detail-backdrop ${isLeadDrawerOpen ? "is-open" : ""}`}
              type="button"
              aria-label="Close Prospect Card"
              aria-hidden={!isLeadDrawerOpen}
              tabIndex={isLeadDrawerOpen ? 0 : -1}
              onClick={() => setLeadDrawerOpen(false)}
            />
            <aside
              className={`lead-detail-drawer ${isLeadDrawerOpen ? "is-open" : ""}`}
              role="dialog"
              aria-label="Selected lead Prospect Card"
              aria-live="polite"
            >
              <div className="panel-header">
                <div>
                  <p className="eyebrow">Selected lead</p>
                  <h2>Full Prospect Card</h2>
                </div>
                <div className="lead-detail-actions">
                  <span className="status-pill">
                    {selectedLeadState === "loading" ? "Loading" : selectedLead ? `${selectedLead.fitScore} fit` : "No selection"}
                  </span>
                  <button
                    className="icon-button lead-detail-close"
                    type="button"
                    aria-label="Close Prospect Card"
                    onClick={() => setLeadDrawerOpen(false)}
                  >
                    <span aria-hidden="true">X</span>
                  </button>
                </div>
              </div>
              {selectedLeadState === "loading" ? (
                <div className="lead-detail-skeleton" aria-label="Loading prospect card">
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
                      Showing the list preview because full detail could not load.
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
                  <strong>Select a lead</strong>
                  <span>Click any saved account to review the complete Prospect Card, including source-backed signals and email copy.</span>
                </div>
              )}
            </aside>
          </section>
        ) : null}

        {appSection === "icp" ? (
          <section className="app-page-grid">
            <div className="panel icp-editor-panel">
              <div className="panel-header">
                <div>
                  <p className="eyebrow">Scoring inputs</p>
                  <h2>Agency ICP</h2>
                </div>
                <span className="status-pill">
                  {icpSaveState === "saving" ? "Saving" : icpSaveState === "saved" ? "Saved" : "Applied to new scans"}
                </span>
              </div>
              <form className="icp-edit-form" onSubmit={submitIcpSettings}>
                <div className="icp-form-grid">
                  <label>
                    Service type
                    <select value={icpForm.serviceType} onChange={updateIcpField("serviceType")}>
                      <option value="web_design">Web design</option>
                      <option value="seo">SEO</option>
                      <option value="marketing">Marketing</option>
                      <option value="custom">Custom</option>
                    </select>
                  </label>
                  <label>
                    Tone
                    <select value={icpForm.tone} onChange={updateIcpField("tone")}>
                      <option value="professional">Professional</option>
                      <option value="direct">Direct</option>
                      <option value="casual">Casual</option>
                    </select>
                  </label>
                  <label>
                    Target industries
                    <input value={icpForm.targetIndustries} onChange={updateIcpField("targetIndustries")} />
                    <small>Comma separated. Used for fit scoring and outreach angle quality.</small>
                  </label>
                  <label>
                    Countries
                    <input value={icpForm.targetCountries} onChange={updateIcpField("targetCountries")} />
                    <small>Comma separated. Leave broad if your team sells internationally.</small>
                  </label>
                  <label className="icp-form-wide">
                    Offer
                    <textarea rows={4} value={icpForm.offerDescription} onChange={updateIcpField("offerDescription")} />
                  </label>
                  <label className="icp-form-wide">
                    First target URL
                    <input type="url" value={icpForm.firstProspectUrl} onChange={updateIcpField("firstProspectUrl")} />
                  </label>
                </div>
                <div className="icp-form-actions">
                  <button className="button button-primary" type="submit" disabled={icpSaveState === "saving"}>
                    <Icon name="check" />
                    {icpSaveState === "saving" ? "Saving ICP" : "Save ICP"}
                  </button>
                  <button
                    className="button button-secondary"
                    type="button"
                    onClick={() => setIcpForm(icpFormFromSetup(snapshot.setup))}
                    disabled={icpSaveState === "saving"}
                  >
                    Reset
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
              <p className="eyebrow">How scoring works</p>
              <h2>LeadCue ranks visible website evidence</h2>
              <div className="rule-list">
                {[
                  ["Fit", "Matches the agency focus, industry, country, and offer."],
                  ["Urgency", "Shows weak CTA paths, proof gaps, stale pages, or thin service positioning."],
                  ["Evidence", "Keeps source notes tied to the website observation."],
                  ["Actionability", "Produces a first line and angle a rep can actually use."]
                ].map(([label, copy]) => (
                  <div className="rule-item" key={label}>
                    <strong>{label}</strong>
                    <span>{copy}</span>
                  </div>
                ))}
              </div>
              <a className="button button-primary" href="/app#scan-console">
                <Icon name="scan" />
                Test this ICP
              </a>
            </div>
          </section>
        ) : null}

        {appSection === "analytics" ? (
          <section className="app-page-grid analytics-page-grid">
            <div className="panel analytics-overview-panel">
              <div className="panel-header">
                <div>
                  <p className="eyebrow">Last 30 days</p>
                  <h2>What the workspace is actually doing</h2>
                </div>
                <span className="status-pill">
                  {analyticsState === "loading" ? "Loading" : analyticsState === "sample" ? "Sample" : "Live"}
                </span>
              </div>
              <div className="analytics-kpi-grid">
                {[
                  ["Tracked events", analyticsSummary.totals.events.toLocaleString()],
                  ["Scans completed", analyticsSummary.totals.scansCompleted.toLocaleString()],
                  ["Leads saved", analyticsSummary.totals.leadsSaved.toLocaleString()],
                  ["Exports completed", analyticsSummary.totals.exportsCompleted.toLocaleString()]
                ].map(([label, value]) => (
                  <div key={label}>
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel analytics-funnel-panel">
              <p className="eyebrow">Research funnel</p>
              <h2>From click to CRM handoff</h2>
              <div className="analytics-funnel">
                {[
                  ["CTA clicks", analyticsSummary.funnel.ctaClicks, "Start free, tool CTA, pricing clicks"],
                  ["Signups", analyticsSummary.funnel.signupsCompleted, `${percentage(analyticsSummary.funnel.signupsCompleted, analyticsSummary.funnel.ctaClicks)} of CTA clicks`],
                  ["Scans", analyticsSummary.funnel.scansCompleted, `${percentage(analyticsSummary.funnel.scansCompleted, analyticsSummary.funnel.signupsCompleted || analyticsSummary.funnel.loginsCompleted)} of active users`],
                  ["Exports", analyticsSummary.funnel.exportsCompleted, `${percentage(analyticsSummary.funnel.exportsCompleted, analyticsSummary.funnel.scansCompleted)} of completed scans`]
                ].map(([label, value, meta]) => (
                  <div className="analytics-funnel-step" key={label}>
                    <span>{label}</span>
                    <strong>{value}</strong>
                    <small>{meta}</small>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel analytics-list-panel">
              <p className="eyebrow">Top pages</p>
              <h2>Where product-led traffic is concentrating</h2>
              <div className="analytics-simple-list">
                {analyticsSummary.topPages.map((page) => (
                  <div key={page.path}>
                    <strong>{page.path}</strong>
                    <span>{page.count} events</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel analytics-list-panel">
              <p className="eyebrow">Top events</p>
              <h2>What users are doing most</h2>
              <div className="analytics-simple-list">
                {analyticsSummary.topEvents.map((event) => (
                  <div key={event.name}>
                    <strong>{formatAnalyticsEventName(event.name)}</strong>
                    <span>{event.count} events</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel analytics-events-panel">
              <p className="eyebrow">Recent events</p>
              <h2>Latest tracked activity</h2>
              <div className="analytics-event-list">
                {analyticsSummary.recentEvents.map((event) => (
                  <article key={event.id}>
                    <div>
                      <strong>{formatAnalyticsEventName(event.name)}</strong>
                      <span>{event.pagePath || "page unavailable"}</span>
                    </div>
                    <small>{event.metadataSummary || formatHistoryTime(event.createdAt)}</small>
                  </article>
                ))}
              </div>
            </div>

            <div className="panel analytics-recommendations-panel">
              <p className="eyebrow">What to do next</p>
              <h2>Operator recommendations</h2>
              <div className="policy-list">
                {analyticsSummary.recommendations.map((item) => (
                  <span key={item}>
                    <Icon name="check" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {appSection === "account" ? (
          <section className="app-page-grid account-page-grid">
            <div className="panel">
              <div className="panel-header">
                <div>
                  <p className="eyebrow">Workspace profile</p>
                  <h2>Identity and ownership</h2>
                </div>
                <span className="status-pill">
                  {profileSaveState === "saving" ? "Saving" : profileSaveState === "saved" ? "Saved" : "Editable"}
                </span>
              </div>
              <form className="icp-edit-form" onSubmit={submitProfile}>
                <div className="account-form-grid">
                  <label>
                    Owner name
                    <input value={profileForm.name} onChange={updateProfileField("name")} placeholder="Alex Rivera" />
                    <small>Shown in the workspace header and used for internal ownership context.</small>
                  </label>
                  <label>
                    Workspace name
                    <input
                      value={profileForm.workspaceName}
                      onChange={updateProfileField("workspaceName")}
                      placeholder="Northstar Outbound"
                    />
                    <small>Used across the dashboard, billing, and account entry points.</small>
                  </label>
                </div>
                <div className="icp-form-actions">
                  <button className="button button-primary" type="submit" disabled={profileSaveState === "saving"}>
                    <Icon name="check" />
                    {profileSaveState === "saving" ? "Saving profile" : "Save profile"}
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

            <div className="panel">
              <div className="panel-header">
                <div>
                  <p className="eyebrow">Password access</p>
                  <h2>Secure email sign-in</h2>
                </div>
                <span className="status-pill">
                  {accountPasswordState === "saving"
                    ? "Updating"
                    : accountPasswordState === "saved"
                      ? "Updated"
                      : "Enabled"}
                </span>
              </div>
              <form className="icp-edit-form" onSubmit={submitPasswordChange}>
                <div className="account-form-grid">
                  <label>
                    Current password
                    <input
                      type={showAccountPassword ? "text" : "password"}
                      value={accountPasswordForm.currentPassword}
                      onChange={updateAccountPasswordField("currentPassword")}
                      autoComplete="current-password"
                      placeholder="Required for existing passwords"
                    />
                    <small>Leave blank only if this workspace has never set an email password before.</small>
                  </label>
                  <label>
                    New password
                    <input
                      type={showAccountPassword ? "text" : "password"}
                      value={accountPasswordForm.nextPassword}
                      onChange={updateAccountPasswordField("nextPassword")}
                      autoComplete="new-password"
                      minLength={8}
                      placeholder="8+ characters"
                    />
                    <small>Use a workspace password your team can recover through the reset flow.</small>
                  </label>
                  <label className="account-form-wide">
                    Confirm new password
                    <input
                      type={showAccountPassword ? "text" : "password"}
                      value={accountPasswordForm.confirmPassword}
                      onChange={updateAccountPasswordField("confirmPassword")}
                      autoComplete="new-password"
                      minLength={8}
                      placeholder="Repeat the new password"
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
                      Show password fields
                      <small>Useful when the workspace owner is updating access for the first time.</small>
                    </span>
                  </label>
                  <button className="button button-primary" type="submit" disabled={accountPasswordState === "saving"}>
                    <Icon name="lock" />
                    {accountPasswordState === "saving" ? "Updating password" : "Update password"}
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

            <div className="panel account-summary-panel">
              <p className="eyebrow">Session summary</p>
              <h2>What this workspace is using</h2>
              <div className="account-card-list">
                <div>
                  <span>Signed-in email</span>
                  <strong>{auth.authenticated ? auth.user.email : "Demo preview"}</strong>
                </div>
                <div>
                  <span>Workspace</span>
                  <strong>{snapshot.workspace.name}</strong>
                </div>
                <div>
                  <span>Plan</span>
                  <strong>{snapshot.plan.name}</strong>
                </div>
                <div>
                  <span>Next credit reset</span>
                  <strong>{formatCalendarDate(snapshot.credits.reset)}</strong>
                </div>
              </div>
              <div className="billing-actions">
                <button className="button button-secondary" type="button" onClick={openBillingPortal}>
                  <Icon name="shield" />
                  Manage billing
                </button>
                <button className="button button-secondary" type="button" onClick={signOut}>
                  <Icon name="lock" />
                  Sign out
                </button>
              </div>
            </div>
          </section>
        ) : null}

        {appSection === "billing" ? (
          <section className="app-page-grid billing-page-grid">
            <div className="panel billing-usage-panel">
              <p className="eyebrow">Credit balance</p>
              <h2>{snapshot.credits.remaining.toLocaleString()} scans left</h2>
              <p>
                {snapshot.credits.used.toLocaleString()} credits used this month on the {snapshot.plan.name} plan.
                Credits are charged only when a scan creates and saves a usable Prospect Card.
              </p>
              <div className="billing-kpis">
                <div>
                  <span>Subscription</span>
                  <strong>{formatSubscriptionStatus(snapshot.subscription.status)}</strong>
                </div>
                <div>
                  <span>Credit reset</span>
                  <strong>{formatCalendarDate(snapshot.credits.reset)}</strong>
                </div>
                <div>
                  <span>Billing period end</span>
                  <strong>{formatCalendarDate(snapshot.subscription.currentPeriodEnd)}</strong>
                </div>
              </div>
              <div className="credit-meter" aria-label="Monthly credit usage">
                <i
                  style={{
                    width: `${Math.min(
                      100,
                      (snapshot.credits.used / Math.max(1, snapshot.credits.used + snapshot.credits.remaining)) * 100
                    )}%`
                  }}
                />
              </div>
              <div className="billing-actions">
                <button className="button button-primary" type="button" onClick={openBillingPortal}>
                  <Icon name="shield" />
                  Manage billing
                </button>
                <button className="button button-secondary" type="button" onClick={downloadCsv}>
                  <Icon name="download" />
                  Export CSV
                </button>
              </div>
            </div>
            <div className="panel billing-plan-panel">
              <p className="eyebrow">Plan path</p>
              <h2>Scale credits without changing the workflow</h2>
              <div className="billing-plan-list">
                {PRICING_PLANS.map((plan) => {
                  const isCurrent = plan.id === snapshot.plan.id;
                  const isFree = plan.id === "free";

                  return (
                    <article className={`billing-plan-card ${isCurrent ? "is-current" : ""}`} key={plan.id}>
                      <div>
                        <strong>{plan.name}</strong>
                        <span>{plan.monthlyCredits.toLocaleString()} scans / month</span>
                      </div>
                      <p>{planUseCases[plan.id]}</p>
                      <button
                        className={`button ${isCurrent ? "button-secondary" : "button-primary"}`}
                        type="button"
                        onClick={() => {
                          if (isCurrent) {
                            return;
                          }

                          if (isFree) {
                            window.location.assign("/support");
                            return;
                          }

                          void startPlanCheckout(plan.id);
                        }}
                        disabled={isCurrent}
                      >
                        {isCurrent ? "Current plan" : `Choose ${plan.name}`}
                      </button>
                    </article>
                  );
                })}
              </div>
            </div>
            <div className="panel billing-policy-panel">
              <p className="eyebrow">Credit policy</p>
              <h2>No charge on failed scans</h2>
              <div className="policy-list">
                {[
                  "Validation errors use 0 credits.",
                  "Website access or generation failures use 0 credits.",
                  "Duplicate retries use an idempotency key to prevent double charging.",
                  "Basic scans charge 1 credit only after a Prospect Card is saved.",
                  "Deep scans charge 3 credits only after a Prospect Card is saved."
                ].map((item) => (
                  <span key={item}>
                    <Icon name="check" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="panel billing-status-panel">
              <p className="eyebrow">Account status</p>
              <h2>Know why the workspace can or cannot scan</h2>
              <p className="billing-status-copy">{subscriptionStatusDetails.summary}</p>
              <div className="account-card-list">
                <div>
                  <span>Workspace status</span>
                  <strong>{auth.authenticated ? "Authenticated" : "Demo preview"}</strong>
                </div>
                <div>
                  <span>Subscription state</span>
                  <strong>{subscriptionStatusDetails.label}</strong>
                </div>
                <div>
                  <span>Remaining credits</span>
                  <strong>{snapshot.credits.remaining.toLocaleString()}</strong>
                </div>
                <div>
                  <span>Export mode</span>
                  <strong>{bulkExportLabel(bulkExportPreset, bulkCrmFieldMode)}</strong>
                </div>
              </div>
              <div className="billing-status-next-step">
                <span>Next step</span>
                <strong>{subscriptionStatusDetails.nextStep}</strong>
              </div>
              <div className="billing-actions">
                <button className="button button-secondary" type="button" onClick={downloadCsv}>
                  <Icon name="download" />
                  Export current fields
                </button>
                <a className="button button-secondary" href="/support">
                  Billing FAQ
                </a>
              </div>
            </div>
            <div className="panel scan-history-panel">
              <div className="panel-header">
                <div>
                  <p className="eyebrow">Scan audit</p>
                  <h2>History</h2>
                </div>
                <span className="status-pill">
                  {historyState === "loading" ? "Loading" : historyState === "sample" ? "Sample" : `${scanHistory.length} records`}
                </span>
              </div>
              <div className="scan-history-toolbar" aria-label="Scan history filters">
                {scanHistoryFilters.map((filter) => (
                  <button
                    className={`history-filter ${historyFilter === filter.value ? "is-active" : ""}`}
                    type="button"
                    key={filter.value}
                    onClick={() => {
                      setHistoryFilter(filter.value);
                      setExpandedScanId(null);
                    }}
                    aria-pressed={historyFilter === filter.value}
                  >
                    <span>{filter.label}</span>
                    <strong>{historyCounts[filter.value]}</strong>
                  </button>
                ))}
              </div>
              <div className="history-secondary-filters" aria-label="Scan history secondary filters">
                <label>
                  Date range
                  <select
                    value={historyDateFilter}
                    onChange={(event) => {
                      setHistoryDateFilter(event.currentTarget.value as HistoryDateFilter);
                      setExpandedScanId(null);
                    }}
                  >
                    {historyDateFilters.map((filter) => (
                      <option value={filter.value} key={filter.value}>
                        {filter.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Failure reason
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
                    <option value="all">All failure reasons</option>
                    {failureReasonEntries.map(([reason]) => (
                      <option value={reason} key={reason}>
                        {reason}
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
                  Clear date/reason
                </button>
                <span aria-live="polite">{filteredScanHistory.length} matching records</span>
              </div>
              <div className="failure-reason-summary" aria-label="Failed scan reason breakdown">
                <div>
                  <span>Failed scans</span>
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
                        <span>{reason}</span>
                        <strong>{count}</strong>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p>No failed scans in this audit window.</p>
                )}
              </div>
              <div className="scan-history-list" role="list" aria-label="Scan history audit records">
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
                            {scan.status}
                          </span>
                          <strong>{scan.companyName || scan.domain}</strong>
                          <small>{scan.url}</small>
                        </div>
                        <div>
                          <span>{scan.scanType}</span>
                          <span>{formatHistoryReason(scan.reason)}</span>
                        </div>
                        <div>
                          <strong>{scan.creditsCharged}</strong>
                          <span>credits charged</span>
                        </div>
                        <time dateTime={scan.createdAt}>{formatHistoryTime(scan.createdAt)}</time>
                        <span className="history-expand-cue">{expandedScanId === scan.id ? "Hide" : "Details"}</span>
                      </button>
                      {expandedScanId === scan.id ? (
                        <div className="scan-history-details">
                          <div>
                            <span>Scan ID</span>
                            <code>{scan.id}</code>
                          </div>
                          <div>
                            <span>Idempotency key</span>
                            <code>{scan.idempotencyKey || "Not recorded"}</code>
                          </div>
                          <div>
                            <span>Lead ID</span>
                            <code>{scan.leadId || "No lead saved"}</code>
                          </div>
                          <div>
                            <span>Completed</span>
                            <code>{scan.completedAt ? formatHistoryTime(scan.completedAt) : "Not completed"}</code>
                          </div>
                          <div className="scan-history-detail-action">
                            <span>Prospect Card</span>
                            {scan.leadId ? (
                              <a href={leadDetailHref(scan.leadId) || "/app/leads"}>Open lead detail</a>
                            ) : (
                              <code>No lead saved</code>
                            )}
                          </div>
                          <p className={scan.status === "failed" ? "history-detail-note is-error" : "history-detail-note"}>
                            {scan.status === "failed"
                              ? "No credit was used. Fix the URL and try again."
                              : scan.status === "replayed"
                                ? "Network retry returned the saved scan result without another credit charge."
                                : "Credit was charged only after a usable Prospect Card was saved."}
                          </p>
                        </div>
                      ) : null}
                    </article>
                  ))
                ) : (
                  <div className="detail-empty-state">
                    <strong>{scanHistory.length ? "No matching scans." : "No scan history yet."}</strong>
                    <span>
                      {scanHistory.length
                        ? "Change the filter to review the rest of the audit trail."
                        : "Completed, failed, and replayed scan records will appear here as an audit trail."}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </section>
        ) : null}
      </main>
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

      <div className="home-preview-footer" aria-label="Export-ready fields">
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
  const firstLine = card.firstLines[0] || "No first line generated yet.";
  const stageLabel =
    pipelineStageOptions.find((option) => option.value === metaFields.stage)?.label ||
    pipelineStageOptions[0].label;
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
    { label: "Emails", value: formatCardList(card.contactPoints.emails) },
    { label: "Phones", value: formatCardList(card.contactPoints.phones) },
    { label: "Contact pages", value: formatCardList(card.contactPoints.contactPages) },
    { label: "Social links", value: formatCardList(card.contactPoints.socialLinks) }
  ];
  const topSignals = card.opportunitySignals.slice(0, 3);
  const pipelineActivity = card.pipelineActivity || [];
  const fullCardText = [
    `${card.companyName} - ${card.website}`,
    `Fit score: ${card.fitScore}`,
    `Confidence: ${Math.round(card.confidenceScore * 100)}%`,
    `Industry: ${card.industry}`,
    `Owner: ${metaFields.owner || "Unassigned"}`,
    `Pipeline stage: ${stageLabel}`,
    `Notes: ${metaFields.notes || "None"}`,
    `Summary: ${card.summary}`,
    `Fit reason: ${card.fitReason}`,
    `Signals: ${card.opportunitySignals.map((signal) => `${signal.category}: ${signal.signal}`).join("; ")}`,
    `First line: ${firstLine}`,
    `Short email:\n${card.shortEmail}`
  ].join("\n");
  const emailDraftText = [`Subject: Quick idea for ${card.companyName}`, "", card.shortEmail].join("\n");
  const exportSections: Record<ProspectExportFieldKey, string> = {
    identity: [
      `Company: ${card.companyName}`,
      `Website: ${card.website}`,
      `Domain: ${card.domain}`,
      `Industry: ${card.industry}`,
      `Confidence: ${Math.round(card.confidenceScore * 100)}%`,
      `Owner: ${metaFields.owner || "Unassigned"}`,
      `Pipeline stage: ${stageLabel}`,
      `Notes: ${metaFields.notes || "None"}`
    ].join("\n"),
    fit: [`Fit score: ${card.fitScore}`, `Summary: ${card.summary}`, `Fit reason: ${card.fitReason}`].join("\n"),
    signals: card.opportunitySignals
      .map((signal) => `- ${signal.category.replace("_", " ")}: ${signal.signal} (Source: ${signal.source})`)
      .join("\n"),
    contacts: contactGroups.map((group) => `${group.label}: ${group.value}`).join("\n"),
    angles: card.outreachAngles.map((angle) => `- ${angle}`).join("\n"),
    firstLine,
    email: card.shortEmail,
    sources: card.sourceNotes.map((note) => `- ${note.claim} (Source: ${note.source})`).join("\n")
  };
  const activePreset = exportPreset === "custom" ? null : prospectExportPresets.find((preset) => preset.key === exportPreset) || null;
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
  const selectedExportFields = prospectExportFields.filter((field) => exportSelection[field.key]);
  const customExportText = selectedExportFields
    .map((field) => `${field.label}\n${exportSections[field.key] || "No data"}`)
    .join("\n\n");
  const selectedExportText = activePreset ? presetExportText : customExportText;
  const selectedExportCopyLabel = activePreset ? "Copy CSV row" : "Copy selected";
  const selectedExportDownloadLabel = activePreset ? "Download CSV" : "Download fields";
  const selectedExportFilename = activePreset
    ? `${slugifyFilePart(card.companyName)}-${activePreset.key}${activePreset.key === "crm" ? `-${crmFieldMode}` : ""}-export.csv`
    : `${slugifyFilePart(card.companyName)}-prospect-fields.txt`;
  const shareUrl = currentLeadDeepLink(leadId, activeTab);
  const copyMenuItems = [
    { key: "full-card", label: "Copy full card", value: fullCardText },
    { key: "website", label: "Copy URL", value: card.website },
    { key: "share-link", label: "Copy card link", value: shareUrl },
    { key: "first-line", label: "Copy first line", value: firstLine },
    {
      key: "signals",
      label: "Copy signals",
      value: card.opportunitySignals.map((signal) => `${signal.category}: ${signal.signal} Source: ${signal.source}`).join("\n")
    },
    {
      key: "contact-paths",
      label: "Copy contact paths",
      value: contactGroups.map((group) => `${group.label}: ${group.value}`).join("\n")
    },
    {
      key: "source-notes",
      label: "Copy source notes",
      value: card.sourceNotes.map((note) => `${note.claim} Source: ${note.source}`).join("\n")
    },
    { key: "selected-fields", label: activePreset ? `Copy ${activePreset.label}` : "Copy selected fields", value: selectedExportText }
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
      <section className="prospect-activity-log" aria-label="Pipeline activity log">
        <div className="prospect-section-head">
          <span>Activity log</span>
          <strong>{pipelineActivity.length ? `${pipelineActivity.length} recent` : "No changes yet"}</strong>
        </div>
        <div className="activity-log-toolbar" role="group" aria-label="Filter activity log by changed field">
          {activityFieldFilters.map((filter) => (
            <button
              className={activityFieldFilter === filter.value ? "is-active" : ""}
              type="button"
              aria-pressed={activityFieldFilter === filter.value}
              onClick={() => {
                setActivityFieldFilter(filter.value);
                setExpandedActivityId(null);
              }}
              key={filter.value}
            >
              <span>{filter.label}</span>
              <strong>{activityFieldCounts[filter.value]}</strong>
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
                      changed {activity.changedFields.map(formatActivityFieldLabel).join(", ")} ·{" "}
                      {formatHistoryTime(activity.createdAt)}
                    </span>
                    <span className="activity-log-expand-cue">{isExpanded ? "Hide diff" : "Show diff"}</span>
                  </button>
                  {isExpanded ? (
                    <div className="activity-diff-grid" aria-label="Previous and current pipeline values">
                      {activity.changedFields.map((field) => (
                        <div className="activity-diff-row" key={`${activity.id}-${field}`}>
                          <span>{formatActivityFieldLabel(field)}</span>
                          <div>
                            <strong>Previous</strong>
                            <code>{formatActivityContextValue(activity.previousValues, field)}</code>
                          </div>
                          <div>
                            <strong>Current</strong>
                            <code>{formatActivityContextValue(activity.currentValues, field)}</code>
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
              ? "No activity matches this field filter."
              : "Owner, stage, and notes changes will appear here after the first save."}
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
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      const result = (await response.json().catch(() => ({}))) as {
        context?: ProspectPipelineContext;
        activity?: ProspectPipelineActivity | null;
        error?: string;
      };

      if (!response.ok || !result.context) {
        throw new Error(result.error || "Unable to save pipeline context.");
      }

      const next = normalizeProspectMeta(result.context);
      setMetaFields(next);
      setMetaSaveState("saved");
      onContextSaved?.({ context: next, activity: result.activity || null });
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
    const currentIndex = prospectCardTabs.findIndex((item) => item.value === tab);
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
    const nextTab = prospectCardTabs[nextIndex].value;
    selectProspectTab(nextTab);
    window.requestAnimationFrame(() => document.getElementById(tabButtonId(nextTab))?.focus());
  }

  function renderExportPanel() {
    return (
      <section className="prospect-export-panel" aria-label="Export selected Prospect Card fields">
        <div className="prospect-section-head">
          <span>Export selected fields</span>
          <strong>
            {selectedExportFields.length}/{prospectExportFields.length} selected
          </strong>
        </div>
        <div className="export-preset-grid" role="group" aria-label="Export field presets">
          {prospectExportPresets.map((preset) => (
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
          <div className="crm-field-mode-grid" role="group" aria-label="CRM field naming mode">
            {prospectCrmFieldModes.map((mode) => (
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
          <div className="export-column-map" aria-label={`${activePreset.label} CSV columns`}>
            <span>{activePreset.key === "crm" ? `${bulkExportLabel(activePreset.key, crmFieldMode)} columns` : "CSV columns"}</span>
            <code>{activePresetColumns.map((column) => column.label).join(", ")}</code>
          </div>
        ) : null}
        <div className="export-field-grid">
          {prospectExportFields.map((field) => (
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
                ? "Downloaded"
                : "Failed"
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
            <span>Website signals</span>
            <strong>{card.opportunitySignals.length} findings</strong>
          </div>
          <SignalList signals={card.opportunitySignals} />
        </section>
      );
    }

    if (activeTab === "contacts") {
      return (
        <section className="prospect-card-section">
          <div className="prospect-section-head">
            <span>Contact paths</span>
            <strong>{contactGroups.filter((group) => group.value !== "None found").length} found</strong>
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
              <span>Best first line</span>
              <strong>Ready to paste</strong>
            </div>
            <p>{firstLine}</p>
          </div>
          <section className="prospect-card-section">
            <div className="prospect-section-head">
              <span>Outreach angles</span>
              <strong>{card.outreachAngles.length} angles</strong>
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
            <span>Short email</span>
            <CopyButton copyKey="short-email" label="Copy email" state={copyState} value={card.shortEmail} onCopy={copyCardValue} />
          </div>
          <pre>{card.shortEmail}</pre>
        </div>
      );
    }

    if (activeTab === "sources") {
      return (
        <section className="prospect-card-section">
          <div className="prospect-section-head">
            <span>Source notes</span>
            <strong>{card.sourceNotes.length} sources</strong>
          </div>
          <div className="source-note-list">
            {card.sourceNotes.map((note) => (
              <div key={`${note.claim}-${note.source}`}>
                <strong>{note.claim}</strong>
                <small>Source: {note.source}</small>
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
            <span>Fit evidence</span>
            <strong>{Math.round(card.confidenceScore * 100)}% confidence</strong>
          </div>
          <p>{card.summary}</p>
          {!compact ? <small>{card.fitReason}</small> : null}
        </section>
        <section className="prospect-card-section">
          <div className="prospect-section-head">
            <span>Top website signals</span>
            <strong>{topSignals.length} shown</strong>
          </div>
          <SignalList signals={topSignals} />
        </section>
        <div className="first-line-box">
          <div className="prospect-section-head">
            <span>Best first line</span>
            <strong>Highest leverage</strong>
          </div>
          <p>{firstLine}</p>
        </div>
        {!compact ? (
          <div className="email-box email-preview-box">
            <div className="prospect-section-head">
              <span>Short email preview</span>
              <button className="copy-chip" type="button" onClick={() => selectProspectTab("email")}>
                Open email
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
          <p className="eyebrow">Prospect Card</p>
          <h3>{card.companyName}</h3>
          <span>{card.domain}</span>
        </div>
        <div className="score-badge">
          <strong>{card.fitScore}</strong>
          <span>Fit</span>
        </div>
      </div>
      <div className="prospect-summary-strip" aria-label="Prospect summary">
        <div>
          <span>Website</span>
          <strong>{card.domain}</strong>
        </div>
        <div>
          <span>Industry</span>
          <strong>{card.industry}</strong>
        </div>
        <div>
          <span>Confidence</span>
          <strong>{Math.round(card.confidenceScore * 100)}%</strong>
        </div>
        <div>
          <span>Status</span>
          <strong>{`${card.savedStatus || "saved"} / ${card.exportStatus || "not_exported"}`.replace(/_/g, " ")}</strong>
        </div>
        {workspaceControls ? (
          <>
            <div>
              <span>Owner</span>
              <strong>{metaFields.owner || "Unassigned"}</strong>
            </div>
            <div>
              <span>Stage</span>
              <strong>{stageLabel}</strong>
            </div>
          </>
        ) : null}
      </div>
      <div className="prospect-card-actions prospect-card-primary-actions">
        <CopyButton
          copyKey="email-draft"
          label="Copy email"
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
          Export
        </button>
        {workspaceControls && leadId ? (
          <CopyButton copyKey="share-link" label="Copy link" state={copyState} value={shareUrl} onCopy={copyCardValue} />
        ) : null}
        <details className="copy-menu">
          <summary>
            <Icon name="clipboard" />
            More copy actions
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
        <details className="prospect-meta-panel prospect-meta-panel-compact" aria-label="Prospect owner, stage, and notes">
          <summary>
            <span>Pipeline context</span>
            <strong>
              {metaSaveState === "saving"
                ? "Saving"
                : metaSaveState === "saved"
                ? "Saved"
                : metaFields.updatedAt
                  ? `Updated ${formatHistoryTime(metaFields.updatedAt)}`
                  : "Not saved yet"}
            </strong>
          </summary>
          <div className="prospect-meta-grid">
            <label>
              Owner
              <input
                value={metaFields.owner}
                onChange={(event) => updateProspectMeta("owner", event.currentTarget.value)}
                placeholder="Assign a teammate"
              />
            </label>
            <label>
              Pipeline stage
              <select
                value={metaFields.stage}
                onChange={(event) => updateProspectStage(event.currentTarget.value as ProspectPipelineStage)}
              >
                {pipelineStageOptions.map((option) => (
                  <option value={option.value} key={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="prospect-meta-notes">
              Notes
              <textarea
                value={metaFields.notes}
                onChange={(event) => updateProspectMeta("notes", event.currentTarget.value)}
                placeholder="Add the account angle, blocker, or next action."
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
              {metaSaveState === "saving" ? "Saving..." : "Save context"}
            </button>
            <span className={`meta-save-state ${metaSaveState === "error" ? "is-error" : ""}`} role="status">
              {metaSaveState === "error"
                ? "Could not save to workspace."
                : metaSaveState === "saving"
                  ? "Saving owner, stage, and notes..."
                : metaSaveState === "saved"
                  ? "Owner, stage, and notes are saved."
                : "Save changes to the workspace."}
            </span>
          </div>
        </details>
      ) : null}
      {workspaceControls && !compact ? renderActivityLog() : null}
      {!compact && (
        <div className="prospect-tabs" role="tablist" aria-label="Prospect Card sections">
          {prospectCardTabs.map((tab) => (
            <button
              id={tabButtonId(tab.value)}
              className={activeTab === tab.value ? "is-active" : ""}
              role="tab"
              type="button"
              key={tab.value}
              aria-selected={activeTab === tab.value}
              aria-controls={tabPanelId(tab.value)}
              tabIndex={activeTab === tab.value ? 0 : -1}
              onClick={() => selectProspectTab(tab.value)}
              onKeyDown={(event) => handleTabKeyDown(event, tab.value)}
            >
              {tab.label}
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
        <div className="prospect-mobile-sticky-actions" aria-label="Mobile Prospect Card actions">
          <CopyButton copyKey="mobile-email" label="Copy email" state={copyState} value={emailDraftText} onCopy={copyCardValue} />
          <button className="copy-chip" type="button" onClick={downloadSelectedFields} disabled={!selectedExportFields.length}>
            <Icon name="download" />
            Export
          </button>
          <button
            className="copy-chip"
            type="button"
            onClick={() => void saveProspectMeta()}
            disabled={metaSaveState === "saving"}
          >
            <Icon name="check" />
            {metaSaveState === "saving" ? "Saving" : "Save"}
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
  label = "Copy"
}: {
  copyKey: string;
  value: string;
  state: { key: string; status: "copied" | "error" } | null;
  onCopy: (key: string, value: string) => Promise<void>;
  label?: string;
}) {
  const isCurrent = state?.key === copyKey;
  const statusLabel = isCurrent ? (state.status === "copied" ? "Copied" : "Failed") : label;

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
  return (
    <div className="signal-list">
      {signals.map((signal) => (
        <div className="signal-item" key={signal.signal}>
          <span>{signal.category.replace("_", " ")}</span>
          <p>{signal.signal}</p>
          <small>Source: {signal.source}</small>
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
