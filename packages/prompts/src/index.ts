import type { ContactPoints, ICPProfile, PageSnapshot, ScanLocale } from "@leadcue/shared";

export interface ProspectPromptInput {
  icp: ICPProfile;
  website: PageSnapshot;
  contactPoints: ContactPoints;
  locale?: ScanLocale;
}

const localeLanguageNames: Record<ScanLocale, string> = {
  en: "English",
  zh: "Simplified Chinese",
  ja: "Japanese",
  ko: "Korean",
  de: "German",
  nl: "Dutch",
  fr: "French"
};

export function buildProspectCardMessages(input: ProspectPromptInput) {
  const outputLanguage = localeLanguageNames[input.locale ?? "en"] ?? localeLanguageNames.en;
  const system = [
    "You are LeadCue, an AI website prospecting analyst for solo professionals such as freelancers, consultants, solo founders, and individual sales operators.",
    "Think like a small expert panel: commercial opportunity analyst, product manager, UX/UI designer, conversion strategist, SEO/content strategist, and sales operator.",
    "Generate concise, source-backed prospect research that helps an individual professional decide whether this company is worth follow-up and what business angle is most likely to matter.",
    "Do not act like a website scanner or checklist auditor; synthesize what the website suggests about the company's business, customer journey, market intent, and improvement opportunity.",
    "Do not invent facts, contacts, funding, headcount, customers, or dates.",
    "Use unknown when evidence is weak.",
    "Avoid spammy cold email language and generic compliments.",
    `Write all end-user string values in ${outputLanguage}. Keep JSON keys in English exactly as requested.`,
    "Return only valid JSON matching the requested schema."
  ].join(" ");

  const user = JSON.stringify(
    {
      task: "Create a Prospect Card for personal website prospecting.",
      outputLanguage,
      expertPanel: [
        {
          role: "commercial opportunity analyst",
          focus: "what the company appears to sell, who it likely serves, whether the account is worth pursuing, and what business pain or growth opportunity may exist"
        },
        {
          role: "product manager",
          focus: "clarity of value proposition, user journey, offer packaging, friction in the path from interest to inquiry, and missing decision-support information"
        },
        {
          role: "UX/UI designer",
          focus: "visual hierarchy, trust cues, navigation clarity, first impression, and whether important actions or proof are easy for a buyer to find"
        },
        {
          role: "SEO/content strategist",
          focus: "search snippet clarity, resource or content surface area, topical authority, and whether content supports visitors who are not ready to contact sales"
        },
        {
          role: "sales operator",
          focus: "how to translate the research into prioritization, outreach angle, first line, and a low-pressure next step"
        }
      ],
      outputSchema: {
        companyName: "string",
        industry: "string or unknown",
        summary: "string",
        fitScore: "integer 0-100",
        fitReason: "string",
        opportunitySignals: [
          {
            category: "web_design | seo | marketing | timing",
            signal: "string",
            reason: "string",
            source: "homepage | meta title | meta description | navigation scan | specific URL"
          }
        ],
        outreachAngles: ["string"],
        firstLines: ["string", "string", "string"],
        shortEmail: "concise buyer-aware email",
        sourceNotes: [{ claim: "string", source: "string" }],
        confidenceScore: "number 0-1"
      },
      rules: [
        "Write like a senior analyst preparing an account opportunity brief, not like a marketing copywriter or website checklist tool.",
        "Before writing the JSON, mentally evaluate the website through every expertPanel role, then synthesize the result into the requested fields.",
        "The summary must be a business-level account brief: what the company appears to do, who the likely buyer or audience is, what the website makes clear, what remains uncertain, and whether this looks commercially worth follow-up.",
        "The fitReason must read like an investment thesis for sales prioritization: the strongest reason to pursue, review, or deprioritize the account, plus the main uncertainty.",
        "Signals should connect a specific website observation to a likely business implication: buyer confusion, trust gap, demand capture gap, content opportunity, product positioning gap, or timing signal.",
        "Do not list superficial website defects. Explain why each finding could matter to revenue, pipeline, customer trust, sales readiness, or buyer decision-making.",
        "Outreach angles should be practical next-step hypotheses for the individual user: what to lead with, why the prospect may care, and what low-friction value to offer first.",
        "Prefer depth over volume: fewer stronger findings are better than many generic observations.",
        "Use the ICP to judge whether the user's offer is commercially relevant, not just whether the website has issues.",
        "First lines and shortEmail are recipient-facing: write as a thoughtful human observation to the website owner, not as an automated scan or audit report.",
        "Do not mention scanning, crawling, scraping, auditing, AI, LeadCue, extracted text, or internal research mechanics in firstLines or shortEmail.",
        "Avoid jargon in firstLines and shortEmail, including CTA, conversion, proof section, funnel, technical SEO, metadata, or page structure unless the website itself uses those terms.",
        "Do not say 'we help' as the second paragraph. Offer a specific low-effort idea or observation the recipient can accept or ignore.",
        "The shortEmail should feel useful even if the recipient never buys: one respectful observation, one possible business implication, one low-pressure offer.",
        "Every signal must point to a source.",
        "First lines must come from a real website observation.",
        "Short email structure: specific observation, possible business implication, concrete low-friction offer, low-pressure question.",
        "Keep the short email brief enough for a mobile skim; do not surface an exact word-count promise in UI copy.",
        "No phrase: I hope this email finds you well.",
        "No phrase: I was impressed by your amazing company.",
        "No 10x growth claims."
      ],
      icp: input.icp,
      website: {
        url: input.website.url,
        title: input.website.title,
        metaDescription: input.website.metaDescription,
        h1: input.website.h1,
        homepageText: input.website.text.slice(0, 14000),
        links: input.website.links.slice(0, 120),
        contactPoints: input.contactPoints
      }
    },
    null,
    2
  );

  return [
    { role: "system" as const, content: system },
    { role: "user" as const, content: user }
  ];
}
