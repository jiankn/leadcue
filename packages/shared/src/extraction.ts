import type {
  ContactPoints,
  ICPProfile,
  OpportunitySignal,
  PageSnapshot,
  ProspectCard,
  ScanRequest
} from "./types";

export const DEFAULT_ICP: ICPProfile = {
  serviceType: "web_design",
  targetIndustries: ["B2B SaaS", "local services", "professional services"],
  targetCountries: ["United States", "United Kingdom", "Canada", "Australia"],
  targetCompanySize: "1-200 employees",
  offerDescription:
    "We help companies turn more website visitors into booked calls with clearer CTAs, proof sections, and conversion-focused page structure.",
  tone: "professional",
  avoidedIndustries: []
};

export const PRICING_PLANS = [
  {
    id: "free",
    name: "Free",
    price: 0,
    monthlyCredits: 20,
    description: "Validate the workflow with a small batch of website scans."
  },
  {
    id: "starter",
    name: "Starter",
    price: 29,
    monthlyCredits: 300,
    description: "Weekly prospecting for founders and small agency teams."
  },
  {
    id: "pro",
    name: "Pro",
    price: 69,
    monthlyCredits: 1500,
    description: "Daily website research with saved history and exports."
  },
  {
    id: "agency",
    name: "Agency",
    price: 149,
    monthlyCredits: 5000,
    description: "Higher-volume prospect research for outbound agency teams."
  }
] as const;

const EMAIL_PATTERN = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const PHONE_PATTERN =
  /(?:\+?\d{1,3}[\s.-]?)?(?:\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}/g;

export function unique<T>(items: T[]): T[] {
  return [...new Set(items.filter(Boolean))];
}

export function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function extractDomain(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return url.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0] ?? url;
  }
}

export function sameDomainLinks(links: string[], baseUrl: string): string[] {
  const domain = extractDomain(baseUrl);
  return unique(
    links
      .map((link) => {
        try {
          return new URL(link, baseUrl).toString();
        } catch {
          return "";
        }
      })
      .filter((link) => link && extractDomain(link) === domain)
  );
}

export function extractEmails(text: string): string[] {
  return unique(text.match(EMAIL_PATTERN) ?? []).slice(0, 8);
}

export function extractPhones(text: string): string[] {
  return unique(text.match(PHONE_PATTERN) ?? []).slice(0, 8);
}

export function classifyContactPoints(page: PageSnapshot): ContactPoints {
  const links = sameDomainLinks(page.links, page.url);
  const socialLinks = unique(
    page.links.filter((link) =>
      /(linkedin\.com|twitter\.com|x\.com|facebook\.com|instagram\.com|youtube\.com)/i.test(link)
    )
  ).slice(0, 8);
  const contactPages = links
    .filter((link) => /(contact|support|book|demo|schedule|consultation)/i.test(link))
    .slice(0, 5);

  return {
    emails: unique([...(page.emails ?? []), ...extractEmails(page.text)]),
    phones: unique([...(page.phones ?? []), ...extractPhones(page.text)]),
    contactPages,
    socialLinks
  };
}

export function discoverRelevantPages(page: PageSnapshot): string[] {
  const links = sameDomainLinks(page.links, page.url);
  const preferred = /(about|contact|pricing|blog|case|customers|careers|services|solutions)/i;
  return links.filter((link) => preferred.test(link)).slice(0, 12);
}

export function inferCompanyName(page: PageSnapshot): string {
  const title = page.title.split(/[|-]/)[0]?.trim();
  const h1 = page.h1?.trim();
  return h1 && h1.length < 60 ? h1 : title || extractDomain(page.url);
}

export function detectOpportunitySignals(
  page: PageSnapshot,
  icp: ICPProfile = DEFAULT_ICP
): OpportunitySignal[] {
  const text = normalizeWhitespace(`${page.title} ${page.metaDescription ?? ""} ${page.h1 ?? ""} ${page.text}`);
  const lower = text.toLowerCase();
  const links = page.links.join(" ").toLowerCase();
  const signals: OpportunitySignal[] = [];

  if (!/(book|demo|contact|call|quote|get started|schedule|consultation)/i.test(page.text.slice(0, 2200))) {
    signals.push({
      category: "web_design",
      signal: "No clear conversion CTA appears early on the page.",
      reason: "LeadCue did not find common booking or demo CTA language in the first screen worth of extracted copy.",
      source: "homepage"
    });
  }

  if (!page.metaDescription || page.metaDescription.length < 70) {
    signals.push({
      category: "seo",
      signal: "Meta description is missing or thin.",
      reason: "The homepage metadata may not explain the offer strongly enough for search snippets.",
      source: "meta description"
    });
  }

  if (!page.h1 || page.h1.length < 8) {
    signals.push({
      category: "seo",
      signal: "Homepage H1 is unclear or unavailable.",
      reason: "A weak H1 can make the page harder for visitors and search engines to understand quickly.",
      source: "homepage h1"
    });
  }

  if (!/(case stud|customer|testimonial|review|proof|results)/i.test(text + links)) {
    signals.push({
      category: "marketing",
      signal: "No obvious proof section or case study path was found.",
      reason: "Prospects with limited proof can be good fits for conversion-focused website or content work.",
      source: "navigation scan"
    });
  }

  if (!/(blog|resources|insights)/i.test(links)) {
    signals.push({
      category: "seo",
      signal: "No blog or resources path was visible in the scanned links.",
      reason: "This can indicate limited content marketing surface area or a navigation gap.",
      source: "navigation scan"
    });
  }

  if (/(hiring|careers|growth|marketing manager|sales manager|demand generation)/i.test(lower + links)) {
    signals.push({
      category: "timing",
      signal: "Hiring or growth language appears on the website.",
      reason: "Growth-related hiring can create timing for website, SEO, or conversion support.",
      source: "homepage/navigation scan"
    });
  }

  const priority = icp.serviceType;
  return signals
    .sort((a, b) => Number(b.category === priority) - Number(a.category === priority))
    .slice(0, 5);
}

export function buildRuleBasedProspectCard(request: ScanRequest): ProspectCard {
  const icp = { ...DEFAULT_ICP, ...request.icp };
  const page = request.page;
  const domain = extractDomain(page.url);
  const contactPoints = classifyContactPoints(page);
  const signals = detectOpportunitySignals(page, icp);
  const companyName = inferCompanyName(page);
  const topSignal = signals[0];
  const firstLine =
    topSignal?.signal ??
    "I noticed your website has useful company information, but the path to the next step could be clearer for new visitors.";

  const fitScore = Math.min(92, Math.max(58, 72 + signals.length * 4));

  return {
    companyName,
    website: page.url,
    domain,
    industry: "unknown",
    summary: `${companyName} appears to be a company website with enough public information for website-based prospect research.`,
    fitScore,
    fitReason: `The site shows ${signals.length || "some"} website signals that can support a ${icp.serviceType.replace("_", " ")} outreach angle.`,
    contactPoints,
    opportunitySignals: signals,
    outreachAngles: [
      `Position the offer around fixing "${topSignal?.signal ?? "the unclear conversion path"}" with a short website improvement sprint.`,
      "Lead with a source-backed observation instead of a generic compliment.",
      "Offer to send 2-3 quick website ideas before pitching a full project."
    ],
    firstLines: [
      `I noticed ${companyName} has useful website content, but ${firstLine.charAt(0).toLowerCase()}${firstLine.slice(1)}`,
      `Your site gives visitors a starting point, but the strongest next step could be easier to spot from the homepage.`,
      `I was looking at ${domain} and noticed a few website signals that could be turned into a clearer conversion path.`
    ],
    shortEmail: `Hi there,\n\nI noticed ${companyName} has useful website content, but ${firstLine.charAt(0).toLowerCase()}${firstLine.slice(1)}\n\nWe help teams improve website conversion with clearer CTAs, proof sections, and page structure.\n\nWorth sending over a few quick ideas?`,
    sourceNotes: signals.map((signal) => ({
      claim: signal.signal,
      source: signal.source
    })),
    confidenceScore: signals.length >= 3 ? 0.78 : 0.62,
    savedStatus: "saved",
    exportStatus: "not_exported"
  };
}

export const SAMPLE_PROSPECT_CARD: ProspectCard = {
  companyName: "Northstar Analytics",
  website: "https://northstaranalytics.example",
  domain: "northstaranalytics.example",
  industry: "B2B SaaS",
  summary: "Northstar Analytics sells reporting software for small finance teams.",
  fitScore: 86,
  fitReason:
    "The website shows conversion and proof gaps that are relevant to a web design or marketing agency offer.",
  contactPoints: {
    emails: ["hello@northstaranalytics.example"],
    phones: [],
    contactPages: ["https://northstaranalytics.example/contact"],
    socialLinks: ["https://www.linkedin.com/company/northstar-analytics"]
  },
  opportunitySignals: [
    {
      category: "web_design",
      signal: "Demo CTA is not visible above the fold.",
      reason: "The homepage explains the product, but the strongest conversion action appears late.",
      source: "homepage"
    },
    {
      category: "seo",
      signal: "Blog appears inactive.",
      reason: "The latest visible article is older than one year in the example scan.",
      source: "/blog"
    },
    {
      category: "marketing",
      signal: "No case studies are visible in the main navigation.",
      reason: "Finance buyers often need proof before booking a demo.",
      source: "navigation scan"
    }
  ],
  outreachAngles: [
    "Offer a conversion-focused homepage refresh that makes the demo path clearer.",
    "Suggest adding proof for finance buyers before the primary CTA.",
    "Package the first touch as a short website teardown rather than a full redesign pitch."
  ],
  firstLines: [
    "I noticed Northstar makes the reporting use case clear, but finance buyers do not see proof or a demo path until after the first scroll.",
    "Your homepage explains the product well; the next lift may be showing finance buyers proof and a clear demo path earlier.",
    "I saw a clear product story, but no obvious case-study path in the main navigation for buyers who need proof first."
  ],
  shortEmail:
    "Hi Alex,\n\nI noticed Northstar makes the reporting use case clear, but finance buyers do not see proof or a demo path until after the first scroll. That can cost booked demos from visitors who already understand the product.\n\nI found three quick fixes for the hero CTA, proof block, and case-study path. Want me to send them over?",
  sourceNotes: [
    { claim: "Demo CTA visibility", source: "homepage" },
    { claim: "Inactive blog", source: "/blog" },
    { claim: "No case studies in nav", source: "navigation scan" }
  ],
  confidenceScore: 0.82,
  savedStatus: "saved",
  exportStatus: "not_exported"
};
