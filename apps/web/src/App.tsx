import { type ChangeEvent, type FormEvent, type KeyboardEvent, type ReactElement, useEffect, useMemo, useState } from "react";
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
import { productSeoPageMap, productSeoPages, type ProductSeoPage } from "./productSeoContent";
import { seoContentPageMap, seoContentPages, type SeoContentPage } from "./seoContent";

type IconName =
  | "arrow"
  | "browser"
  | "chart"
  | "check"
  | "clipboard"
  | "cursor"
  | "database"
  | "download"
  | "filter"
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

const SITE_URL = "https://leadcue.app";

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

type CommercialPageSlug = "docs" | "support" | "contact" | "privacy" | "terms";

const commercialPages: Record<
  CommercialPageSlug,
  {
    eyebrow: string;
    title: string;
    summary: string;
    primaryAction: { label: string; href: string };
    secondaryAction?: { label: string; href: string };
    sections: Array<{ title: string; copy: string; items: string[] }>;
  }
> = {
  docs: {
    eyebrow: "Documentation",
    title: "Run website-first prospecting without building another list tool.",
    summary:
      "Use these launch docs to set up a workspace, run website scans, review Prospect Cards, and export clean notes into your outreach system.",
    primaryAction: { label: "Open dashboard", href: "/app" },
    secondaryAction: { label: "Contact support", href: "/support" },
    sections: [
      {
        title: "Quick start",
        copy: "LeadCue works best when each scan starts from a real company website and a clear agency offer.",
        items: [
          "Create a workspace with Google or work email.",
          "Choose the plan that matches monthly scan volume.",
          "Add agency focus, target industries, and your first prospect URL.",
          "Run the scan and review the saved Prospect Card before exporting."
        ]
      },
      {
        title: "Scan payload",
        copy: "The web app and API both send a page snapshot plus optional ICP context to the scan endpoint.",
        items: [
          "Endpoint: POST /api/scans.",
          "Required page fields: url, title, text, and links.",
          "Optional fields: meta description, H1, emails, phones, and deepScan.",
          "Each deep scan uses more credits and should be reserved for high-intent accounts."
        ]
      },
      {
        title: "Operating model",
        copy: "LeadCue is the research layer before your outreach tool, not a sender or contact database.",
        items: [
          "Review website evidence before saving a lead.",
          "Copy first lines only when the fit score and signal quality are strong.",
          "Export saved prospects into Sheets, CRM, or campaign tools.",
          "Keep ICP settings updated as your agency offer changes."
        ]
      }
    ]
  },
  support: {
    eyebrow: "Support",
    title: "Get help with account access, billing, scans, and exports.",
    summary:
      "Support is focused on keeping agencies moving from first workspace setup to repeatable weekly prospect research.",
    primaryAction: { label: "Email support", href: "mailto:support@leadcue.app" },
    secondaryAction: { label: "Read docs", href: "/docs" },
    sections: [
      {
        title: "Common requests",
        copy: "Most issues are account, billing, scan-credit, or export questions.",
        items: [
          "Google sign-in is unavailable or returns to the wrong workspace.",
          "Billing portal does not open after a plan change.",
          "A scan produced weak context because the page snapshot was thin.",
          "CSV export is missing a saved Prospect Card."
        ]
      },
      {
        title: "What to include",
        copy: "A clear support request lets the team reproduce the issue quickly.",
        items: [
          "Workspace email and plan.",
          "The prospect URL or scan ID if available.",
          "Expected outcome and actual outcome.",
          "Browser, extension version, or API client if relevant."
        ]
      },
      {
        title: "Launch service levels",
        copy: "LeadCue is currently optimized for fast product support during early commercial rollout.",
        items: [
          "Account and billing issues are prioritized first.",
          "Scan quality reports help improve prompt and extraction behavior.",
          "Feature requests should include the outbound workflow they would unlock.",
          "Security or privacy concerns should be sent directly to support@leadcue.app."
        ]
      }
    ]
  },
  contact: {
    eyebrow: "Contact",
    title: "Talk to LeadCue about agency prospecting workflows.",
    summary:
      "Use contact when you need plan guidance, launch support, agency workspace setup, or integration questions before rollout.",
    primaryAction: { label: "Email LeadCue", href: "mailto:support@leadcue.app" },
    secondaryAction: { label: "Start free", href: "/signup?plan=free" },
    sections: [
      {
        title: "Sales and setup",
        copy: "LeadCue is designed for teams that already sell SEO, web design, redesign, or growth services.",
        items: [
          "Plan fit for monthly scan volume.",
          "Agency workspace and ICP setup.",
          "Outbound process mapping.",
          "CSV and CRM handoff planning."
        ]
      },
      {
        title: "Product questions",
        copy: "The fastest product conversations start with one real prospecting workflow.",
        items: [
          "Which websites your team reviews today.",
          "What counts as a qualified account.",
          "Where saved prospects go after research.",
          "Which proof gaps or timing signals matter most."
        ]
      },
      {
        title: "Security and privacy",
        copy: "LeadCue should not be treated as a contact scraper or background browsing collector.",
        items: [
          "No LinkedIn scraping workflow.",
          "No campaign sending inside LeadCue.",
          "Website-first scans triggered by the user or API.",
          "Source-backed notes attached to saved prospects."
        ]
      }
    ]
  },
  privacy: {
    eyebrow: "Privacy",
    title: "Privacy principles for website-first prospect research.",
    summary:
      "LeadCue is built around user-triggered website analysis, workspace setup data, and saved prospect notes needed for agency outbound operations.",
    primaryAction: { label: "Contact privacy support", href: "mailto:support@leadcue.app" },
    secondaryAction: { label: "Back home", href: "/" },
    sections: [
      {
        title: "Data we expect to process",
        copy: "Commercial launch data is intentionally narrow and tied to the workspace workflow.",
        items: [
          "Account identity from Google OAuth or work email signup.",
          "Workspace plan, billing status, and scan-credit usage.",
          "Agency ICP settings used to score websites.",
          "Prospect website snapshots, generated notes, and saved Prospect Cards."
        ]
      },
      {
        title: "Data boundaries",
        copy: "LeadCue is not designed to silently collect browsing history or scrape social networks.",
        items: [
          "Scans must be user-triggered or sent through the API.",
          "LinkedIn scraping is outside the product boundary.",
          "Contact details are limited to public website contact paths when present.",
          "Exports contain saved prospect research, not a purchased contact database."
        ]
      },
      {
        title: "Operational controls",
        copy: "Teams should be able to understand what was saved and why.",
        items: [
          "Prospect Cards keep source notes attached to claims.",
          "Workspace sessions use server-side cookies.",
          "Billing operations are routed through Stripe when configured.",
          "Support requests can be sent to support@leadcue.app."
        ]
      }
    ]
  },
  terms: {
    eyebrow: "Terms",
    title: "Commercial usage terms for LeadCue workspaces.",
    summary:
      "These launch terms clarify the intended product boundary: website research, prospect qualification, and export-ready notes for agency outbound teams.",
    primaryAction: { label: "Start free", href: "/signup?plan=free" },
    secondaryAction: { label: "Ask a question", href: "/contact" },
    sections: [
      {
        title: "Acceptable use",
        copy: "Use LeadCue to analyze public company websites and prepare better outreach research.",
        items: [
          "Run scans only for lawful business prospecting workflows.",
          "Respect website, platform, and outreach-tool policies.",
          "Do not use LeadCue to build spam lists or automate unwanted contact.",
          "Review generated copy before sending it anywhere."
        ]
      },
      {
        title: "Plans and credits",
        copy: "Plans are organized around monthly website scan credits.",
        items: [
          "Free workspaces include a limited monthly scan volume.",
          "Deep scans can consume additional credits.",
          "Paid plan billing uses Stripe when payment is configured.",
          "Credit limits and plan names can change as the commercial product matures."
        ]
      },
      {
        title: "Product boundary",
        copy: "LeadCue is the research layer before outreach, not the entire sales stack.",
        items: [
          "LeadCue does not send email campaigns.",
          "LeadCue does not replace CRM ownership or compliance review.",
          "Generated Prospect Cards should be treated as decision support.",
          "Customers remain responsible for how exported data is used."
        ]
      }
    ]
  }
};

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

type AppSection = "dashboard" | "leads" | "icp" | "billing";

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
  const pathname = window.location.pathname;
  const isAppRoute = pathname.startsWith("/app");
  const isLoginRoute = pathname.startsWith("/login");
  const isSignupRoute = pathname.startsWith("/signup");
  const commercialPageSlug = getCommercialPageSlug(pathname);
  const seoContentPage = getSeoContentPage(pathname);
  const productSeoPage = getProductSeoPage(pathname);

  if (isAppRoute) {
    return (
      <>
        <SeoHead
          title="LeadCue App - Prospect Research Workspace"
          description="LeadCue app workspace for signed-in teams."
          path="/app"
          noIndex
        />
        <DashboardApp />
      </>
    );
  }

  if (isLoginRoute) {
    return (
      <>
        <SeoHead
          title="Sign in to LeadCue"
          description="Sign in to your LeadCue prospect research workspace."
          path="/login"
          noIndex
        />
        <LoginPage />
      </>
    );
  }

  if (isSignupRoute) {
    return (
      <>
        <SeoHead
          title="Create a LeadCue Workspace"
          description="Create a LeadCue workspace and start turning prospect websites into source-backed Prospect Cards."
          path="/signup"
          noIndex
        />
        <SignupPage />
      </>
    );
  }

  if (seoContentPage) {
    return <SeoContentPageView page={seoContentPage} />;
  }

  if (productSeoPage) {
    return <ProductSeoPageView page={productSeoPage} />;
  }

  if (commercialPageSlug) {
    return <CommercialPage slug={commercialPageSlug} />;
  }

  return <MarketingSite />;
}

function getCommercialPageSlug(pathname: string): CommercialPageSlug | null {
  const slug = pathname.replace(/^\/+/, "").replace(/\/+$/, "");
  return slug in commercialPages ? (slug as CommercialPageSlug) : null;
}

function getSeoContentPage(pathname: string): SeoContentPage | null {
  const slug = pathname.replace(/^\/+/, "").replace(/\/+$/, "");
  return seoContentPageMap[slug] ?? null;
}

function getProductSeoPage(pathname: string): ProductSeoPage | null {
  const slug = pathname.replace(/^\/+/, "").replace(/\/+$/, "");
  return productSeoPageMap[slug] ?? null;
}

type SeoHeadProps = {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
  type?: "website" | "article";
  image?: string;
  structuredData?: unknown;
};

function absoluteUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
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

function SeoHead({
  title,
  description,
  path,
  noIndex = false,
  type = "website",
  image = "/images/leadcue-hero-prospecting.png",
  structuredData
}: SeoHeadProps) {
  const canonicalUrl = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);
  const structuredDataJson = structuredData ? JSON.stringify(structuredData) : "";

  useEffect(() => {
    document.title = title;
    setMetaTag("name", "description", description);
    setMetaTag("name", "robots", noIndex ? "noindex,nofollow" : "index,follow");
    setMetaTag("property", "og:title", title);
    setMetaTag("property", "og:description", description);
    setMetaTag("property", "og:type", type);
    setMetaTag("property", "og:url", canonicalUrl);
    setMetaTag("property", "og:image", imageUrl);
    setMetaTag("property", "og:site_name", "LeadCue");
    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:title", title);
    setMetaTag("name", "twitter:description", description);
    setMetaTag("name", "twitter:image", imageUrl);
    setCanonicalLink(canonicalUrl);

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
  }, [canonicalUrl, description, imageUrl, noIndex, structuredDataJson, title, type]);

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

function MarketingSite() {
  const homeStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "LeadCue",
        url: SITE_URL,
        email: "support@leadcue.app"
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: "LeadCue",
        url: SITE_URL,
        publisher: { "@id": `${SITE_URL}/#organization` },
        description:
          "LeadCue turns company websites into qualified prospect cards with fit scores, source-backed sales cues, outreach angles, and cold email first lines."
      },
      {
        "@type": "SoftwareApplication",
        name: "LeadCue",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: SITE_URL,
        offers: PRICING_PLANS.map((plan) => ({
          "@type": "Offer",
          name: plan.name,
          price: plan.price,
          priceCurrency: "USD",
          url: `${SITE_URL}/signup?plan=${plan.id}`
        }))
      }
    ]
  };

  return (
    <div className="site-shell">
      <SeoHead
        title="LeadCue - Website Prospecting Assistant for Agencies"
        description="LeadCue turns company websites into qualified prospect cards with fit scores, source-backed sales cues, outreach angles, and cold email first lines."
        path="/"
        structuredData={homeStructuredData}
      />
      <header className="topbar topbar-marketing">
        <a className="brand" href="/" aria-label="LeadCue home">
          <BrandMark />
          <span>LeadCue</span>
        </a>
        <nav className="nav-links" aria-label="Main navigation">
          <a href="#features">Features</a>
          <a href="#how">How it works</a>
          <a href="#card">Sample card</a>
          <a href="#pricing">Pricing</a>
          <a href="#resources">Resources</a>
        </nav>
        <div className="topbar-actions">
          <a className="button button-small button-secondary" href="/login">
            Sign in
          </a>
        <a className="button button-small button-primary" href="/signup?plan=free">
          <Icon name="mail" />
          Start free
        </a>
        </div>
      </header>

      <main>
        <section className="hero-band">
          <div className="hero-copy">
            <p className="eyebrow glass-pill">LeadCue for agency outbound teams</p>
            <h1>
              Turn websites into <span className="accent-text">qualified prospects</span>
            </h1>
            <p className="hero-subhead">
              Score fit, capture website evidence, and write first lines before your team saves
              another generic lead.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="/signup?plan=free">
                <Icon name="mail" />
                Start free scan
              </a>
              <a className="button button-secondary" href="#card">
                <Icon name="clipboard" />
                View sample card
              </a>
            </div>
            <p className="microcopy">
              20 free scans. Google sign-in. No LinkedIn scraping or contact database dependency.
            </p>
            <div className="hero-stage">
              <div className="hero-visual-card" aria-label="LeadCue product visual">
                <img
                  src="/images/leadcue-hero-prospecting.png"
                  alt="A laptop with abstract prospect analytics cards on a dark green SaaS background"
                  loading="eager"
                />
                <span className="hero-visual-note">
                  <Icon name="spark" />
                  Website evidence, ICP fit, and first-line cues in one workspace
                </span>
              </div>

              <div className="hero-analytics glass-card" aria-label="LeadCue live prospecting analytics preview">
                <div className="hero-analytics-top">
                  <div>
                    <span className="analytics-kicker">Website prospecting live</span>
                    <strong>Agency pipeline snapshot</strong>
                  </div>
                  <div className="analytics-meta" aria-label="Data freshness">
                    <span className="live-dot">Live</span>
                    <span className="live-timeframe">Last 24h</span>
                  </div>
                </div>
                <div className="live-metric-grid">
                  {([
                    { icon: "scan", label: "Websites scanned", value: "214", delta: "+18%" },
                    { icon: "target", label: "Qualified", value: "42%", delta: "+7 pts" },
                    { icon: "chart", label: "Avg fit", value: "86", delta: "High" },
                    { icon: "clipboard", label: "First lines copied", value: "64", delta: "+31%" }
                  ] as const).map((metric) => (
                    <div className="live-metric" key={metric.label}>
                      <span className="metric-icon">
                        <Icon name={metric.icon} />
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
                        <span>Qualified prospects</span>
                        <strong>Website scan to saved prospect</strong>
                      </div>
                      <span className="chart-badge">+24 saved</span>
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
                      <span className="side-label">Opportunity mix</span>
                      {([
                        { label: "Web design", value: 48, tone: "primary" },
                        { label: "SEO", value: 31, tone: "amber" },
                        { label: "Growth", value: 21, tone: "coral" }
                      ] as const).map((signal) => (
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
                      <span className="side-label">High-fit websites</span>
                      {([
                        { company: "Northstar Analytics", cue: "CTA below fold", fit: 86 },
                        { company: "Beacon Dental", cue: "No visible proof", fit: 82 },
                        { company: "Lumen Logistics", cue: "Thin service pages", fit: 74 }
                      ] as const).map((scan) => (
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
                    <Icon name="check" />3 prospects ready for outreach
                  </span>
                  <span>12 / 300 scans used</span>
                </div>
              </div>
            </div>
            <div className="hero-trust-badges" aria-label="LeadCue trust signals">
              {trustBadges.map((badge) => (
                <span className="glass-badge" key={badge.label}>
                  <Icon name={badge.icon} />
                  {badge.label}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="section trust-band">
          <div className="section-inner trust-band-inner">
            <span>Built for agency outbound teams that need a reason to reach out</span>
            {trustBadges.map((badge) => (
              <strong key={badge.label}>
                <Icon name={badge.icon} />
                {badge.label}
              </strong>
            ))}
          </div>
        </section>

        <section className="section homepage-map-section" aria-labelledby="homepage-map-title">
          <div className="section-inner">
            <div className="section-heading section-heading-split">
              <div>
                <p className="eyebrow">Product tour</p>
                <h2 id="homepage-map-title">Everything a buyer needs before starting a scan</h2>
              </div>
              <p className="section-copy">
                Jump into the parts that matter: what LeadCue does, how the scan works, what the
                Prospect Card contains, and how pricing scales.
              </p>
            </div>
            <div className="homepage-map-grid">
              {homepageContentLinks.map((item) => (
                <a className="homepage-map-card" href={item.href} key={item.href}>
                  <span className="feature-icon">
                    <Icon name={item.icon} />
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
              <p className="eyebrow">Outbound is not a list problem</p>
              <h2>You do not need more random leads. You need a reason to reach out.</h2>
            </div>
            <div className="problem-list">
              {["Is this company a fit for our offer?", "What did their website reveal?", "Which problem can we credibly pitch?", "What should the first line say?"].map(
                (item) => (
                  <div className="problem-row" key={item}>
                    <Icon name="check" />
                    <span>{item}</span>
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        <section className="section feature-section" id="features">
          <div className="section-inner">
            <div className="section-heading">
              <p className="eyebrow">Website-first workflow</p>
              <h2>Research, qualify, and export from one prospecting desk</h2>
              <p className="section-copy">
                LeadCue turns website observations into pipeline data, so agencies can see which
                prospects are worth saving, personalizing, and moving into outreach.
              </p>
            </div>
            <div className="feature-grid">
              {featureHighlights.map((feature) => (
                <article className="feature-card glass-card" key={feature.title}>
                  <span className="feature-icon">
                    <Icon name={feature.icon} />
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
              <p className="eyebrow">How it works</p>
              <h2>From company website to outreach angle in minutes</h2>
            </div>
            <div className="step-grid">
              {workflow.map((step, index) => (
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
              <p className="eyebrow">Agency research method</p>
              <h2>
                Replace guesswork with <span className="accent-text">website-backed evidence</span>
              </h2>
              <p className="section-copy">
                LeadCue keeps sales cues attached to the exact website observations that created
                them, so teams can qualify prospects before writing a sequence.
              </p>
              <div className="method-checklist">
                {[
                  "Score fit against your agency offer",
                  "Capture CTA, proof, SEO, and positioning gaps",
                  "Export only accounts with a credible outreach reason"
                ].map((item) => (
                  <span key={item}>
                    <Icon name="check" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <figure className="media-frame">
              <img
                src="/images/leadcue-agency-research.png"
                alt="Agency operators reviewing website research and analytics together"
                loading="lazy"
              />
              <figcaption>
                <strong>Research desk</strong>
                <span>ICP fit, website observations, and outreach notes stay connected.</span>
              </figcaption>
            </figure>
          </div>
        </section>

        <section className="section section-muted" id="card">
          <div className="section-inner two-column card-showcase">
            <div className="sample-card-copy">
              <p className="eyebrow">Sample output</p>
              <h2>The Prospect Card gives every lead a reason</h2>
              <p className="section-copy">
                Each card connects fit, website evidence, contact paths, outreach angles, and
                copy-ready first lines so your team knows what to say and why.
              </p>
              <div className="sample-proof-grid" aria-label="Sample Prospect Card outcomes">
                {[
                  ["3", "website cues"],
                  ["86", "fit score"],
                  ["1", "ready opener"]
                ].map(([value, label]) => (
                  <div className="sample-proof-item" key={label}>
                    <strong>{value}</strong>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
              <div className="sample-card-actions">
                <a className="button button-primary" href="/signup?plan=free&first=https%3A%2F%2Fnorthstaranalytics.example">
                  <Icon name="scan" />
                  Run this workflow
                </a>
                <a className="button button-secondary" href="/docs">
                  <Icon name="clipboard" />
                  Read scan docs
                </a>
              </div>
            </div>
            <HomeProspectPreview card={SAMPLE_PROSPECT_CARD} />
          </div>
        </section>

        <section className="section">
          <div className="section-inner">
            <div className="section-heading">
              <p className="eyebrow">Use cases</p>
              <h2>Use LeadCue when outreach needs proof, not placeholders</h2>
            </div>
            <div className="use-case-grid">
              {useCases.map((item) => (
                <article className="use-case-card" key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                  <a href={`/signup?focus=${item.focus}&plan=free`}>
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
              <p className="eyebrow">Positioning</p>
              <h2>LeadCue is not another email finder</h2>
              <p className="section-copy">
                Email finders help you locate contacts. LeadCue helps you decide why the company is
                worth contacting before the first message.
              </p>
            </div>
            <div className="comparison-table" role="table" aria-label="LeadCue comparison">
              {[
                ["Email finder", "Email addresses", "Why this company should care"],
                ["Sales database", "Company and contact lists", "Which accounts deserve research"],
                ["CRM", "Pipeline tracking", "Website insight before outreach"],
                ["LeadCue", "Qualified Prospect Cards", "Sending sequences in your outreach tool"]
              ].map(([type, gives, missing]) => (
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
              <p className="eyebrow">Pricing</p>
              <h2>Credits that match weekly prospecting</h2>
              <p className="section-copy">
                Start with a small batch of website scans, then scale when LeadCue becomes part of
                your agency's outbound research rhythm.
              </p>
            </div>
            <div className="pricing-grid">
              {PRICING_PLANS.map((plan) => (
                <article className={`pricing-card glass-card ${plan.id === "pro" ? "featured-plan" : ""}`} key={plan.id}>
                  <div className="pricing-card-top">
                    {plan.id === "pro" ? <span className="plan-ribbon">Most useful</span> : <span />}
                    <span className="plan-credit-pill">{plan.monthlyCredits.toLocaleString()} scans</span>
                  </div>
                  <h3>{plan.name}</h3>
                  <div className="price-row">
                    <p className="price">{plan.price === 0 ? "$0" : `$${plan.price}`}</p>
                    <span>/mo</span>
                  </div>
                  <span className="plan-description">{plan.description}</span>
                  <span className="plan-use-case">{planUseCases[plan.id]}</span>
                  <ul>
                    {planBenefits[plan.id].map((benefit) => (
                      <li key={benefit}>
                        <Icon name="check" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  <a
                    className="plan-cta"
                    href={`/signup?plan=${plan.id}`}
                    aria-label={`${plan.id === "free" ? "Start free" : "Subscribe"} with the ${plan.name} plan`}
                  >
                    <Icon name="mail" />
                    {plan.id === "free" ? "Start free scan" : plan.id === "agency" ? "Start agency setup" : `Start ${plan.name}`}
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section faq-section" id="faq">
          <div className="section-inner faq-layout">
            <div>
              <p className="eyebrow">FAQ</p>
              <h2>Built around website research, not another contact database</h2>
              <p className="section-copy">
                LeadCue is intentionally narrow: analyze the prospect site, qualify the opportunity,
                and move better notes into the outreach workflow you already use.
              </p>
            </div>
            <div className="faq-list">
              {faqItems.map((item) => (
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
                <p className="eyebrow">Outbound resources</p>
                <h2>
                  Build a sharper prospecting system with <span className="accent-text">better signals</span>
                </h2>
              </div>
              <p className="section-copy">
                Practical articles for teams that want every saved account to carry evidence,
                timing, and a credible reason to start a conversation.
              </p>
            </div>
            <div className="resource-grid">
              {resourceArticles.map((article) => (
                <article className="resource-card" key={article.title}>
                  <img src={article.image} alt="" loading="lazy" />
                  <span>{article.label}</span>
                  <h3>{article.title}</h3>
                  <p>{article.copy}</p>
                  <a href={article.href}>
                    Read the guide
                    <Icon name="arrow" />
                  </a>
                </article>
              ))}
            </div>
            <div className="resource-index" aria-label="LeadCue SEO resource library">
              <div>
                <span>Browse the content library</span>
                <strong>16 search-intent pages, tools, and CRM guides</strong>
              </div>
              <div className="resource-index-links">
                {seoContentPages.map((page) => (
                  <a href={`/${page.slug}`} key={page.slug}>
                    {page.category}
                  </a>
                ))}
                {productSeoPages.map((page) => (
                  <a href={`/${page.slug}`} key={page.slug}>
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
              <p className="eyebrow">Start scanning</p>
              <h2>Create your agency workspace and run your first prospect scan</h2>
              <p className="section-copy">
                Start with the free plan, connect your agency offer, and use LeadCue to turn
                company websites into source-backed Prospect Cards.
              </p>
              <div className="signup-points">
                <span>
                  <Icon name="check" />
                  20 scans included on Free
                </span>
                <span>
                  <Icon name="shield" />
                  No LinkedIn scraping
                </span>
                <span>
                  <Icon name="database" />
                  CSV export path
                </span>
              </div>
            </div>
            <div className="signup-card">
              <span className="signup-card-kicker">Commercial launch path</span>
              <h3>Free plan starts with 20 website scans/month.</h3>
              <p>
                Paid plans unlock higher monthly scan volume, saved prospect workflow, and priority
                analytics for outbound teams.
              </p>
              <form className="quick-scan-form" action="/signup" method="get">
                <input type="hidden" name="plan" value="free" />
                <label htmlFor="quick-scan-url">First prospect website</label>
                <div>
                  <input
                    id="quick-scan-url"
                    name="first"
                    type="url"
                    placeholder="https://prospect.example.com"
                    aria-label="First prospect website"
                  />
                  <button className="button button-primary" type="submit">
                    <Icon name="scan" />
                    Queue scan
                  </button>
                </div>
              </form>
              <a className="button button-primary" href="/signup?plan=free">
                <Icon name="mail" />
                Start free
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="section-inner footer-inner">
          <div className="footer-brand">
            <a className="brand" href="/" aria-label="LeadCue home">
              <BrandMark />
              <span>LeadCue</span>
            </a>
            <p>Website-first prospecting for agencies that need stronger reasons to reach out.</p>
          </div>
          <div className="footer-column">
            <strong>Product</strong>
            <a href="#features">Features</a>
            <a href="#card">Sample card</a>
            <a href="#pricing">Pricing</a>
            <a href="/app">Dashboard</a>
          </div>
          <div className="footer-column">
            <strong>Resources</strong>
            <a href="/website-prospecting">Website prospecting</a>
            <a href="/cold-email-first-lines">Cold email first lines</a>
            <a href="/agency-lead-qualification">Lead qualification</a>
            <a href="#faq">FAQ</a>
          </div>
          <div className="footer-column">
            <strong>Legal</strong>
            <a href="/docs">Docs</a>
            <a href="/contact">Contact</a>
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
            <a href="/support">Support</a>
          </div>
        </div>
        <div className="section-inner footer-bottom">
          <span>Copyright © 2026 LeadCue. All rights reserved.</span>
          <div>
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms & Conditions</a>
            <a href="/signup?plan=free">Start free</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function makeContentAnchor(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getSeoContentStructuredData(page: SeoContentPage) {
  const path = `/${page.slug}`;
  const url = absoluteUrl(path);

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
            name: "Resources",
            item: `${SITE_URL}/#resources`
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
  const path = `/${page.slug}`;
  const relatedPages = page.related
    .map((slug) => seoContentPageMap[slug])
    .filter((relatedPage): relatedPage is SeoContentPage => Boolean(relatedPage));

  return (
    <div className="site-shell">
      <SeoHead
        title={page.seoTitle}
        description={page.description}
        path={path}
        type="article"
        structuredData={getSeoContentStructuredData(page)}
      />
      <header className="topbar topbar-minimal content-topbar">
        <a className="brand" href="/" aria-label="LeadCue home">
          <BrandMark />
          <span>LeadCue</span>
        </a>
        <nav className="content-nav" aria-label="LeadCue content navigation">
          <a href="/website-prospecting">Strategy</a>
          <a href="/use-cases/web-design-agencies">Use cases</a>
          <a href="/guides/turn-website-into-cold-email-angle">Guides</a>
          <a href="/agency-lead-qualification">Qualification</a>
        </nav>
        <a className="button button-small button-primary topbar-back" href="/signup?plan=free">
          Start free
        </a>
      </header>

      <main className="content-page seo-page">
        <section className="content-hero seo-hero">
          <nav className="seo-breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span>/</span>
            <a href="/#resources">Resources</a>
            <span>/</span>
            <strong>{page.category}</strong>
          </nav>
          <p className="eyebrow glass-pill">{page.eyebrow}</p>
          <h1>{page.title}</h1>
          <p>{page.description}</p>
          <div className="seo-meta-row" aria-label="Article metadata">
            <span>{page.category}</span>
            <span>{page.readingTime}</span>
            <span>Updated {page.updatedAt}</span>
          </div>
          <div className="seo-keywords" aria-label="Target search intent">
            <span>{page.primaryKeyword}</span>
            {page.secondaryKeywords.map((keyword) => (
              <span key={keyword}>{keyword}</span>
            ))}
          </div>
        </section>

        <section className="seo-layout" aria-label={`${page.title} article`}>
          <aside className="seo-toc" aria-label="On this page">
            <strong>On this page</strong>
            {page.sections.map((section) => (
              <a href={`#${makeContentAnchor(section.title)}`} key={section.title}>
                {section.title}
              </a>
            ))}
            <a href="#example">Example</a>
            <a href="#faq">FAQ</a>
          </aside>

          <article className="seo-article">
            <section className="seo-summary-panel">
              <div>
                <p className="eyebrow">Search intent</p>
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
              <p className="eyebrow">Example</p>
              <h2>{page.example.title}</h2>
              <p>{page.example.copy}</p>
              <div className="seo-example-grid">
                {page.example.items.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </section>

            <section className="seo-faq" id="faq">
              <p className="eyebrow">FAQ</p>
              <h2>Common questions</h2>
              {page.faqs.map((faq) => (
                <details className="seo-faq-item" key={faq.question}>
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </section>

            <section className="seo-related" aria-label="Related LeadCue resources">
              <div>
                <p className="eyebrow">Related resources</p>
                <h2>Keep building the workflow</h2>
              </div>
              <div className="seo-related-grid">
                {relatedPages.map((relatedPage) => (
                  <a href={`/${relatedPage.slug}`} key={relatedPage.slug}>
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
            <p className="eyebrow">Use it on a real account</p>
            <h2>Turn one prospect website into a source-backed Prospect Card.</h2>
          </div>
          <a className="button button-primary" href="/signup?plan=free">
            <Icon name="scan" />
            Start free scan
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
  void navigator.clipboard?.writeText(value);
}

function escapeCsvValue(value: string) {
  return `"${value.replace(/"/g, '""')}"`;
}

function getProductSeoStructuredData(page: ProductSeoPage) {
  const path = `/${page.slug}`;
  const url = absoluteUrl(path);

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
        author: { "@type": "Organization", name: "LeadCue" },
        publisher: { "@type": "Organization", name: "LeadCue", url: SITE_URL },
        mainEntityOfPage: url,
        keywords: [page.primaryKeyword, ...page.secondaryKeywords].join(", ")
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Resources", item: `${SITE_URL}/#resources` },
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

function ProductSeoPageView({ page }: { page: ProductSeoPage }) {
  const path = `/${page.slug}`;
  const relatedPages = page.related
    .map((slug) => productSeoPageMap[slug] ?? seoContentPageMap[slug])
    .filter((relatedPage): relatedPage is ProductSeoPage | SeoContentPage => Boolean(relatedPage));

  return (
    <div className="site-shell">
      <SeoHead
        title={page.seoTitle}
        description={page.description}
        path={path}
        type="article"
        structuredData={getProductSeoStructuredData(page)}
      />
      <header className="topbar topbar-minimal content-topbar">
        <a className="brand" href="/" aria-label="LeadCue home">
          <BrandMark />
          <span>LeadCue</span>
        </a>
        <nav className="content-nav" aria-label="Product-led SEO navigation">
          <a href="/templates/crm-csv-field-mapping">CSV tool</a>
          <a href="/templates/cold-email-first-line">First lines</a>
          <a href="/templates/website-prospecting-checklist">Checklist</a>
          <a href="/integrations/hubspot-csv-export">Integrations</a>
        </nav>
        <a className="button button-small button-primary topbar-back" href="/signup?plan=free">
          Start free
        </a>
      </header>

      <main className="content-page seo-page product-seo-page">
        <section className="content-hero seo-hero">
          <nav className="seo-breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span>/</span>
            <a href="/#resources">Resources</a>
            <span>/</span>
            <strong>{page.category}</strong>
          </nav>
          <p className="eyebrow glass-pill">{page.eyebrow}</p>
          <h1>{page.title}</h1>
          <p>{page.description}</p>
          <div className="seo-meta-row" aria-label="Page metadata">
            <span>{page.category}</span>
            <span>{page.readingTime}</span>
            <span>Updated {page.updatedAt}</span>
          </div>
          <div className="seo-keywords" aria-label="Target search intent">
            <span>{page.primaryKeyword}</span>
            {page.secondaryKeywords.map((keyword) => (
              <span key={keyword}>{keyword}</span>
            ))}
          </div>
        </section>

        <section className="seo-layout" aria-label={`${page.title} tool and guide`}>
          <aside className="seo-toc" aria-label="On this page">
            <strong>On this page</strong>
            <a href="#tool">Tool</a>
            {page.sections.map((section) => (
              <a href={`#${makeContentAnchor(section.title)}`} key={section.title}>
                {section.title}
              </a>
            ))}
            <a href="#faq">FAQ</a>
          </aside>

          <article className="seo-article">
            <section className="seo-summary-panel">
              <div>
                <p className="eyebrow">Search intent</p>
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
              <p className="eyebrow">FAQ</p>
              <h2>Common questions</h2>
              {page.faqs.map((faq) => (
                <details className="seo-faq-item" key={faq.question}>
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </section>

            <section className="seo-related" aria-label="Related LeadCue resources">
              <div>
                <p className="eyebrow">Related resources</p>
                <h2>Keep building the workflow</h2>
              </div>
              <div className="seo-related-grid">
                {relatedPages.map((relatedPage) => (
                  <a href={`/${relatedPage.slug}`} key={relatedPage.slug}>
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
            <p className="eyebrow">Use it on a real account</p>
            <h2>Run the workflow inside LeadCue and export selected prospects.</h2>
          </div>
          <a className="button button-primary" href="/signup?plan=free">
            <Icon name="scan" />
            Start free scan
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
  const [mode, setMode] = useState<CrmMappingMode>("hubspot");
  const [selectedKeys, setSelectedKeys] = useState<string[]>(crmMappingRows.map((row) => row.key));
  const selectedRows = crmMappingRows.filter((row) => selectedKeys.includes(row.key));
  const csvHeader = selectedRows.map((row) => row.labels[mode]).join(",");
  const csvSample = selectedRows.map((row) => escapeCsvValue(row.sample)).join(",");
  const csvText = `${csvHeader}\n${csvSample}`;
  const activeMode = crmMappingModes.find((item) => item.value === mode) ?? crmMappingModes[0];

  return (
    <div className="product-tool">
      <div className="product-tool-head">
        <div>
          <p className="eyebrow">CSV field mapper</p>
          <h2>{activeMode.label} prospect research export</h2>
          <p>{activeMode.copy}</p>
        </div>
        <div className="tool-actions">
          <button className="button button-secondary" type="button" onClick={() => copyText(csvHeader)}>
            <Icon name="clipboard" />
            Copy header
          </button>
          <a
            className="button button-primary"
            href={`data:text/csv;charset=utf-8,${encodeURIComponent(csvText)}`}
            download={`${mode}-leadcue-sample.csv`}
          >
            <Icon name="download" />
            Sample CSV
          </a>
        </div>
      </div>

      <div className="tool-segmented" role="tablist" aria-label="CRM field naming mode">
        {crmMappingModes.map((item) => (
          <button
            className={mode === item.value ? "is-active" : ""}
            type="button"
            role="tab"
            aria-selected={mode === item.value}
            key={item.value}
            onClick={() => setMode(item.value)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="field-mapping-grid">
        <div className="field-picker" aria-label="Fields to include">
          <strong>Included fields</strong>
          {crmMappingRows.map((row) => (
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
              <span>{row.labels[mode]}</span>
            </label>
          ))}
        </div>

        <div className="mapping-table" aria-label={`${activeMode.label} field mapping table`}>
          <div className="mapping-table-row mapping-table-head">
            <span>Field</span>
            <span>Group</span>
            <span>Purpose</span>
          </div>
          {selectedRows.map((row) => (
            <div className="mapping-table-row" key={row.key}>
              <strong>{row.labels[mode]}</strong>
              <span>{row.group}</span>
              <p>{row.description}</p>
            </div>
          ))}
        </div>
      </div>

      <pre className="csv-preview">{csvText}</pre>
    </div>
  );
}

function FirstLineTemplateTool() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = firstLineTemplates[selectedIndex] ?? firstLineTemplates[0];
  const email = `Hi Alex,\n\n${selected.firstLine}\n\n${selected.nextSentence}\n\n${selected.cta}`;

  return (
    <div className="product-tool first-line-tool">
      <div className="product-tool-head">
        <div>
          <p className="eyebrow">First line builder</p>
          <h2>{selected.signal}</h2>
          <p>Pick a website signal and copy a short opener that leads into a useful next step.</p>
        </div>
        <button className="button button-primary" type="button" onClick={() => copyText(email)}>
          <Icon name="clipboard" />
          Copy email
        </button>
      </div>

      <div className="template-signal-grid">
        {firstLineTemplates.map((template, index) => (
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
          <span>First line</span>
          <p>{selected.firstLine}</p>
        </div>
        <div>
          <span>Bridge</span>
          <p>{selected.nextSentence}</p>
        </div>
        <div>
          <span>CTA</span>
          <p>{selected.cta}</p>
        </div>
      </div>
    </div>
  );
}

function WebsiteProspectingChecklistTool() {
  const [checkedKeys, setCheckedKeys] = useState<string[]>(["cta", "proof", "sourceNotes"]);
  const checkedItems = checklistItems.filter((item) => checkedKeys.includes(item.key));
  const score = Math.round((checkedItems.length / checklistItems.length) * 100);
  const strongestSignal = checkedItems[0]?.label ?? "No signal selected yet.";

  return (
    <div className="product-tool checklist-tool">
      <div className="product-tool-head">
        <div>
          <p className="eyebrow">Website prospecting checklist</p>
          <h2>{score}% evidence coverage</h2>
          <p>Check the signals you can verify on a prospect website before saving or exporting the account.</p>
        </div>
        <button
          className="button button-primary"
          type="button"
          onClick={() =>
            copyText(
              `Website prospecting summary\nCoverage: ${score}%\nSignals:\n${checkedItems
                .map((item) => `- ${item.category}: ${item.label}`)
                .join("\n")}`
            )
          }
        >
          <Icon name="clipboard" />
          Copy summary
        </button>
      </div>

      <div className="checklist-grid">
        {checklistItems.map((item) => (
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
        <span>Prospect Card-style summary</span>
        <p>{strongestSignal}</p>
        <strong>
          {checkedItems.length} of {checklistItems.length} signals verified
        </strong>
      </div>
    </div>
  );
}

function IntegrationExportTool({ platform }: { platform: "HubSpot" | "Salesforce" | "Pipedrive" }) {
  const mode: CrmMappingMode =
    platform === "HubSpot" ? "hubspot" : platform === "Salesforce" ? "salesforce" : "pipedrive";
  const csvHeader = crmMappingRows.map((row) => row.labels[mode]).join(",");
  const csvSample = crmMappingRows.map((row) => escapeCsvValue(row.sample)).join(",");

  return (
    <div className="product-tool integration-tool">
      <div className="product-tool-head">
        <div>
          <p className="eyebrow">{platform} import kit</p>
          <h2>{platform} CSV header and sample row</h2>
          <p>Use these headers as a starting point for selected saved leads from a website-first research workflow.</p>
        </div>
        <button className="button button-primary" type="button" onClick={() => copyText(csvHeader)}>
          <Icon name="clipboard" />
          Copy {platform} header
        </button>
      </div>

      <div className="integration-field-list">
        {crmMappingRows.map((row) => (
          <div key={row.key}>
            <span>{row.group}</span>
            <strong>{row.labels[mode]}</strong>
            <p>{row.description}</p>
          </div>
        ))}
      </div>

      <pre className="csv-preview">{`${csvHeader}\n${csvSample}`}</pre>
    </div>
  );
}

function CommercialPage({ slug }: { slug: CommercialPageSlug }) {
  const page = commercialPages[slug];
  const path = `/${slug}`;

  return (
    <div className="site-shell">
      <SeoHead
        title={`${page.title} | LeadCue`}
        description={page.summary}
        path={path}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: page.title,
          description: page.summary,
          url: absoluteUrl(path),
          isPartOf: { "@id": `${SITE_URL}/#website` }
        }}
      />
      <header className="topbar topbar-minimal content-topbar">
        <a className="brand" href="/" aria-label="LeadCue home">
          <BrandMark />
          <span>LeadCue</span>
        </a>
        <nav className="content-nav" aria-label="Commercial pages">
          <a href="/docs">Docs</a>
          <a href="/support">Support</a>
          <a href="/contact">Contact</a>
        </nav>
        <a className="button button-small button-primary topbar-back" href="/signup?plan=free">
          Start free
        </a>
      </header>

      <main className="content-page">
        <section className="content-hero">
          <p className="eyebrow glass-pill">{page.eyebrow}</p>
          <h1>{page.title}</h1>
          <p>{page.summary}</p>
          <div className="content-actions">
            <a className="button button-primary" href={page.primaryAction.href}>
              <Icon name="arrow" />
              {page.primaryAction.label}
            </a>
            {page.secondaryAction ? (
              <a className="button button-secondary" href={page.secondaryAction.href}>
                {page.secondaryAction.label}
              </a>
            ) : null}
          </div>
        </section>

        {slug === "docs" || slug === "support" || slug === "contact" ? (
          <section className="help-center-shell" aria-label="LeadCue help center">
            <div className="help-center-head">
              <div>
                <p className="eyebrow">Help center</p>
                <h2>Find the right answer by workflow</h2>
              </div>
              <label className="help-search">
                <span>Search help</span>
                <input type="search" placeholder="Search scans, credits, OAuth, exports..." />
              </label>
            </div>
            <div className="help-category-grid">
              {[
                ["Workspace setup", "Create an account, choose a plan, and finish onboarding.", "/docs"],
                ["Scanning and credits", "Understand scan inputs, failures, retries, and credit charging.", "/docs"],
                ["Billing and plans", "Manage Stripe billing, scan limits, and plan upgrades.", "/support"],
                ["Security and privacy", "Review data boundaries, OAuth, and website-first processing.", "/privacy"]
              ].map(([title, copy, href]) => (
                <a className="help-category-card" href={href} key={title}>
                  <Icon name="arrow" />
                  <strong>{title}</strong>
                  <span>{copy}</span>
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
            <p className="eyebrow">Next step</p>
            <h2>Turn one real website into your first Prospect Card.</h2>
          </div>
          <a className="button button-primary" href="/signup?plan=free">
            <Icon name="scan" />
            Start free scan
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

function formatSubscriptionStatus(status: string) {
  return status
    .split("_")
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ");
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

  return `/api/auth/google/start?${params.toString()}`;
}

function getAuthErrorMessage() {
  const authError = new URLSearchParams(window.location.search).get("auth_error");

  switch (authError) {
    case "google_not_configured":
      return "Google sign-in is not configured for this environment yet.";
    case "database_unavailable":
      return "Authentication is unavailable until the workspace database is ready.";
    case "state_missing":
    case "state_invalid":
      return "Your sign-in session expired. Start the Google flow again.";
    case "access_denied":
    case "oauth_cancelled":
      return "Google sign-in was canceled before completion.";
    case "google_exchange_failed":
      return "Google could not complete sign-in. Try again or use your work email setup.";
    default:
      return "";
  }
}

function LoginPage() {
  const authMessage = getAuthErrorMessage();
  const [loginForm, setLoginForm] = useState<LoginFormState>({ email: "", password: "" });
  const [loginState, setLoginState] = useState<"idle" | "loading" | "error">("idle");
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
      setLoginError("Enter a valid work email and an 8+ character password.");
      return;
    }

    setLoginState("loading");
    setLoginError("");

    try {
      const response = await fetch("/api/auth/email/login", {
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
        setLoginError(result.error || "Email password sign-in failed. Try again.");
        return;
      }

      window.location.href = result.next || "/app?login=1";
    } catch (error) {
      console.error("email_login_failed", error);
      setLoginState("error");
      setLoginError("Email password sign-in is unavailable. Try Google or come back in a moment.");
    }
  }

  return (
    <div className="site-shell">
      <header className="topbar topbar-minimal">
        <a className="brand" href="/" aria-label="LeadCue home">
          <BrandMark />
          <span>LeadCue</span>
        </a>
        <a className="button button-small button-secondary topbar-back" href="/">
          <Icon name="arrow" />
          Home
        </a>
      </header>

      <main className="auth-page login-page">
        <section className="login-showcase" aria-label="LeadCue prospect research preview">
          <img
            src="/images/leadcue-login-pipeline.png"
            alt="LeadCue turns website research into ranked prospect cards and export-ready opportunities."
          />
          <div className="login-showcase-overlay" />
          <div className="login-showcase-copy">
            <p className="eyebrow">AI prospect research</p>
            <h1>Turn website research into ranked accounts.</h1>
            <p>
              Source-backed signals, fit scores, and outreach context in one workspace.
            </p>
          </div>
          <div className="login-proof-stack" aria-label="LeadCue outcomes">
            <div>
              <span>Qualified fit</span>
              <strong>92</strong>
            </div>
            <div>
              <span>Website cues</span>
              <strong>3+</strong>
            </div>
            <div>
              <span>CRM ready</span>
              <strong>CSV</strong>
            </div>
          </div>
        </section>

        <section className="auth-card login-card glass-card">
          <p className="eyebrow">Welcome back</p>
          <h1>Sign in</h1>
          <p className="auth-copy">Use Google or your work email to reopen your prospect research workspace.</p>
          <a className="button button-primary auth-google-button" href={buildGoogleAuthHref({ intent: "login" })}>
            Continue with Google
          </a>
          <div className="oauth-divider" aria-hidden="true">
            <span>or sign in with email</span>
          </div>
          <form className="login-form" onSubmit={submitEmailLogin}>
            <label className="auth-field">
              <span>Email</span>
              <input
                type="email"
                name="email"
                value={loginForm.email}
                onChange={updateLoginField("email")}
                autoComplete="email"
                placeholder="you@agency.com"
                required
              />
            </label>
            <label className="auth-field">
              <span>Password</span>
              <div className="password-input-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={loginForm.password}
                  onChange={updateLoginField("password")}
                  autoComplete="current-password"
                  minLength={8}
                  placeholder="8+ characters"
                  required
                />
                <button
                  className="password-toggle"
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-pressed={showPassword}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>
            <button className="button button-secondary auth-email-button" type="submit" disabled={loginState === "loading"}>
              <Icon name="mail" />
              {loginState === "loading" ? "Signing in..." : "Sign in with email"}
            </button>
          </form>
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
          <p className="auth-note">Password sign-in uses the same secure workspace session as Google OAuth.</p>
          <div className="auth-signup-row">
            <div>
              <span>New to LeadCue?</span>
              <p>Create a free workspace and run your first prospect scan.</p>
            </div>
            <a className="button button-secondary auth-signup-button" href="/signup?plan=free">
              Create free workspace
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}

function SignupPage() {
  const selectedPlan = getSelectedPlan();
  const initialFocus = getInitialFocus();
  const initialFirstProspectUrl = getInitialFirstProspectUrl();
  const authMessage = getAuthErrorMessage();
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
    returnTo: "/app"
  });
  const selectedPlanPrice = selectedPlan.price === 0 ? "$0/mo" : `$${selectedPlan.price}/mo`;
  const selectedPlanCopy =
    selectedPlan.id === "free"
      ? "20 scans/month to validate the workflow."
      : `${selectedPlanPrice} · ${selectedPlan.monthlyCredits.toLocaleString()} scans/month.`;
  const submitCopy = selectedPlan.id === "free" ? "Create workspace" : "Continue to billing";
  const [signupState, setSignupState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const stepSummaries = [
    { step: 1 as const, label: "Basics" },
    { step: 2 as const, label: "Scoring" }
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
      setStatusMessage("A valid work email is required.");
      return;
    }

    if (signupForm.password.length < 8) {
      setSignupState("error");
      setStatusMessage("Use at least 8 characters so email sign-in can be enabled.");
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
      const response = await fetch("/api/signup-intents", {
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
        throw new Error(result.error || "Unable to create workspace setup.");
      }

      const result = (await response.json()) as SignupResponse;
      if (result.checkoutUrl) {
        window.location.assign(result.checkoutUrl);
        return;
      }

      if (result.next === "dashboard") {
        window.location.assign("/app?welcome=1");
        return;
      }

      setSignupState("done");
      setStatusMessage(
        result.next === "checkout"
          ? "Workspace setup saved. Billing is pending, and you can review the workspace now."
          : "Workspace setup saved. You can continue into the dashboard."
      );
    } catch (error) {
      setSignupState("error");
      setStatusMessage(error instanceof Error ? error.message : "Unable to create workspace setup.");
    }
  }

  return (
    <div className="site-shell">
      <header className="topbar topbar-minimal">
        <a className="brand" href="/" aria-label="LeadCue home">
          <BrandMark />
          <span>LeadCue</span>
        </a>
        <a className="button button-small button-secondary topbar-back" href="/">
          <Icon name="arrow" />
          Home
        </a>
      </header>

      <main className="signup-page">
        <section className="signup-hero">
          <div className="signup-copy">
            <p className="eyebrow glass-pill">Get started</p>
            <h1>Create workspace</h1>
            <p>Pick a plan and add the agency context LeadCue should score against.</p>
            <div className="signup-summary">
              <span>
                <Icon name="check" />
                {selectedPlan.monthlyCredits.toLocaleString()} scans/month
              </span>
              <span>
                <Icon name="database" />
                Prospect Cards + CSV
              </span>
            </div>
          </div>

          <div className="signup-form-shell glass-card">
            <div className="selected-plan">
              <span>Plan</span>
              <strong>{selectedPlan.name}</strong>
              <p>{selectedPlanCopy}</p>
            </div>
            <div className="signup-steps" aria-label="Signup progress">
              {stepSummaries.map((item) => (
                <div
                  className={`signup-step-pill ${signupStep === item.step ? "is-current" : ""} ${signupStep > item.step ? "is-done" : ""}`}
                  key={item.step}
                >
                  <span>{signupStep > item.step ? "Done" : item.step}</span>
                  <strong>{item.label}</strong>
                </div>
              ))}
            </div>
            <div className="oauth-entry">
              <a className="button button-secondary auth-google-button" href={googleSignupHref}>
                Continue with Google
              </a>
              <p>Google creates a workspace or signs you back in.</p>
            </div>
            <div className="oauth-divider" aria-hidden="true">
              <span>or use work email</span>
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
                <h2>Workspace setup saved.</h2>
                <p>{statusMessage}</p>
                <div className="signup-actions">
                  <a className="button button-primary" href="/app">
                    <Icon name="browser" />
                    Open dashboard
                  </a>
                  <a className="button button-secondary" href="/#pricing">
                    <Icon name="chart" />
                    Review plans
                  </a>
                </div>
              </div>
            ) : (
              <form className="signup-form" onSubmit={submitSignup}>
                {signupStep === 1 ? (
                  <div className="signup-step-panel">
                    <div className="signup-step-header">
                      <span>Step 1 of 2</span>
                      <h2>Workspace basics</h2>
                      <p>Start with the account and agency details LeadCue needs for the first setup.</p>
                    </div>
                    <label>
                      Work email
                      <input
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        placeholder="you@agency.com"
                        value={signupForm.email}
                        onChange={updateSignupField("email")}
                      />
                    </label>
                    <label>
                      Password
                      <input
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        minLength={8}
                        required
                        placeholder="8+ characters"
                        value={signupForm.password}
                        onChange={updateSignupField("password")}
                      />
                    </label>
                    <label>
                      Agency focus
                      <select name="agencyFocus" value={signupForm.agencyFocus} onChange={updateSignupField("agencyFocus")}>
                        <option value="web_design">Web design / redesign</option>
                        <option value="seo">SEO agency</option>
                        <option value="marketing">Growth / marketing agency</option>
                        <option value="founder">Founder-led outbound</option>
                      </select>
                    </label>
                    <label>
                      Agency website
                      <input
                        name="agencyWebsite"
                        type="url"
                        autoComplete="url"
                        placeholder="https://youragency.com"
                        value={signupForm.agencyWebsite}
                        onChange={updateSignupField("agencyWebsite")}
                      />
                    </label>
                    <div className="signup-actions-row">
                      <button className="button button-primary" type="button" onClick={continueSignup}>
                        Continue
                      </button>
                    </div>
                    <p className={`form-status ${signupState === "error" ? "is-error" : ""}`} role="status" aria-live="polite">
                      {statusMessage || " "}
                    </p>
                  </div>
                ) : (
                  <div className="signup-step-panel">
                    <div className="signup-step-header">
                      <span>Step 2 of 2</span>
                      <h2>Scoring context</h2>
                      <p>Define the offer and target profile so the first Prospect Cards start with useful fit signals.</p>
                    </div>
                    <div className="signup-draft">
                      <span>{signupForm.email}</span>
                      <span>{formatAgencyFocus(signupForm.agencyFocus)}</span>
                      {signupForm.agencyWebsite ? <span>{formatCompactUrl(signupForm.agencyWebsite)}</span> : null}
                    </div>
                    <label>
                      Offer description
                      <textarea
                        name="offerDescription"
                        required
                        rows={4}
                        value={signupForm.offerDescription}
                        onChange={updateSignupField("offerDescription")}
                      />
                    </label>
                    <label>
                      Target industries
                      <input
                        name="targetIndustries"
                        required
                        value={signupForm.targetIndustries}
                        onChange={updateSignupField("targetIndustries")}
                      />
                    </label>
                    <label>
                      First prospect website
                      <input
                        name="firstProspectUrl"
                        type="url"
                        placeholder="https://prospect.example.com"
                        value={signupForm.firstProspectUrl}
                        onChange={updateSignupField("firstProspectUrl")}
                      />
                    </label>
                    <p className="form-note">
                      <Icon name="lock" />
                      This creates your commercial workspace setup and prepares plan-based credits.
                    </p>
                    <div className="signup-actions-row">
                      <button
                        className="button button-secondary signup-back"
                        type="button"
                        onClick={() => setSignupStep(1)}
                        disabled={signupState === "loading"}
                      >
                        Back
                      </button>
                      <button className="button button-primary" type="submit" disabled={signupState === "loading"}>
                        <Icon name="mail" />
                        {signupState === "loading" ? "Creating workspace..." : submitCopy}
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
        const [authResponse, workspaceResponse, leadsResponse, scansResponse] = await Promise.all([
          fetch("/api/auth/me", { credentials: "include" }),
          fetch("/api/workspace", { credentials: "include" }),
          fetch("/api/leads", { credentials: "include" }),
          fetch("/api/scans", { credentials: "include" })
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
        const loadedLeads = leadsData.leads?.length ? leadsData.leads : [];
        const initialLeadRow =
          requestedLeadId && loadedLeads.length
            ? loadedLeads.find((lead) => lead.id === requestedLeadId) || loadedLeads[0]
            : loadedLeads[0];
        let initialLeadDetail: ProspectCardType | null = null;

        if (initialLeadRow) {
          const detailResponse = await fetch(`/api/leads/${encodeURIComponent(initialLeadRow.id)}`, {
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
          setDashboardState(workspaceData.source === "sample" ? "sample" : "ready");
          setDashboardMessage(
            authData.authenticated
              ? workspaceData.warning || routeMessage
              : "Demo preview. Create a workspace to save prospects and track credits with a secure session."
          );
        }
      } catch (error) {
        if (!cancelled) {
          setAuth({ authenticated: false });
          setSnapshot(sampleWorkspace);
          setLeads(demoLeadRows);
          setScanHistory(demoScanHistory);
          setHistoryState("sample");
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

  function prepareFirstScan() {
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
      const response = await fetch("/api/workspace/icp", {
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
      const response = await fetch(`/api/leads/${encodeURIComponent(lead.id)}`, {
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
      const response = await fetch("/api/scans", {
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
      const response = await fetch("/api/workspace/onboarding/complete", {
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
      const response = await fetch(`/api/exports?${query.toString()}`, {
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
      const response = await fetch("/api/billing/portal", {
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

      window.location.assign(result.url);
    } catch (error) {
      setDashboardMessage(error instanceof Error ? error.message : "Billing portal is not available yet.");
    }
  }

  async function signOut() {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" }).catch(() => null);
    setAuth({ authenticated: false });
    setDashboardState("sample");
    setSnapshot(sampleWorkspace);
    setLeads(demoLeadRows);
    setScanHistory(demoScanHistory);
    setHistoryState("sample");
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
      const response = await fetch(`/api/leads/${encodeURIComponent(lead.id)}`, {
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
              <span className="status-pill">{formatSubscriptionStatus(snapshot.subscription.status)}</span>
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

        {appSection === "billing" ? (
          <section className="app-page-grid billing-page-grid">
            <div className="panel billing-usage-panel">
              <p className="eyebrow">Credit balance</p>
              <h2>{snapshot.credits.remaining.toLocaleString()} scans left</h2>
              <p>
                {snapshot.credits.used.toLocaleString()} credits used this month on the {snapshot.plan.name} plan.
                Credits are charged only when a scan creates and saves a usable Prospect Card.
              </p>
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
  const firstLine = card.firstLines[0] || "No first line generated yet.";
  const topSignals = card.opportunitySignals.slice(0, 3);
  const shortEmailLines = card.shortEmail.split(/\n+/).filter(Boolean);
  const contactCount =
    card.contactPoints.emails.length +
    card.contactPoints.phones.length +
    card.contactPoints.contactPages.length +
    card.contactPoints.socialLinks.length;

  return (
    <article className="home-prospect-preview" aria-label="Compact sample Prospect Card">
      <div className="home-preview-header">
        <div>
          <p className="eyebrow">Prospect Card</p>
          <h3>{card.companyName}</h3>
          <span>{card.domain}</span>
        </div>
        <div className="home-preview-score">
          <strong>{card.fitScore}</strong>
          <span>Fit</span>
        </div>
      </div>

      <div className="home-preview-meta" aria-label="Sample prospect summary">
        <div>
          <span>Confidence</span>
          <strong>{Math.round(card.confidenceScore * 100)}%</strong>
        </div>
        <div>
          <span>Signals</span>
          <strong>{card.opportunitySignals.length}</strong>
        </div>
        <div>
          <span>Contact paths</span>
          <strong>{contactCount || "None"}</strong>
        </div>
      </div>

      <div className="home-preview-panels">
        <section className="home-preview-panel home-preview-signals">
          <div className="home-preview-panel-head">
            <span>Website evidence</span>
            <strong>{topSignals.length} cues</strong>
          </div>
          <div className="home-signal-stack">
            {topSignals.map((signal) => (
              <div className="home-signal-row" key={`${signal.category}-${signal.signal}`}>
                <span>{signal.category.replace("_", " ")}</span>
                <strong>{signal.signal}</strong>
                <small>Source: {signal.source}</small>
              </div>
            ))}
          </div>
        </section>

        <section className="home-preview-panel home-preview-outcome">
          <div className="home-preview-panel-head">
            <span>Best first line</span>
            <strong>Copy-ready</strong>
          </div>
          <p>{firstLine}</p>
        </section>

        <section className="home-preview-panel home-preview-email">
          <div className="home-preview-panel-head">
            <span>Short email</span>
            <strong>Reply-ready</strong>
          </div>
          <pre>{shortEmailLines.join("\n\n")}</pre>
        </section>
      </div>

      <div className="home-preview-footer" aria-label="Export-ready fields">
        {["CRM CSV", "First line", "Source notes"].map((item) => (
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
      const response = await fetch(`/api/leads/${encodeURIComponent(leadId)}/context`, {
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
    check: <path d="m5 12 4 4L19 6" />,
    clipboard: <path d="M9 5h6M9 3h6v4H9zM7 5H5v16h14V5h-2" />,
    cursor: <path d="m5 4 14 7-6 2-2 6z" />,
    database: <path d="M5 6c0 1.7 3.1 3 7 3s7-1.3 7-3-3.1-3-7-3-7 1.3-7 3zM5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />,
    download: <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />,
    filter: <path d="M4 6h16M7 12h10M10 18h4" />,
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
