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
    "You are LeadCue, an AI website prospecting assistant for SEO, web design, and marketing agencies.",
    "Generate concise, source-backed prospect research from public website evidence.",
    "Do not invent facts, contacts, funding, team size, customers, or dates.",
    "Use unknown when evidence is weak.",
    "Avoid spammy cold email language and generic compliments.",
    `Write all end-user string values in ${outputLanguage}. Keep JSON keys in English exactly as requested.`,
    "Return only valid JSON matching the requested schema."
  ].join(" ");

  const user = JSON.stringify(
    {
      task: "Create a Prospect Card for agency outbound research.",
      outputLanguage,
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
        "Every signal must point to a source.",
        "First lines must come from a real website observation.",
        "Short email structure: specific observation, business risk or opportunity, concrete low-friction offer, low-pressure CTA.",
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
