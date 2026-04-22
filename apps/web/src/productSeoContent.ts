export type ProductSeoToolKind = "crm-mapping" | "first-line" | "checklist" | "integration";

export type ProductSeoPage = {
  slug: string;
  eyebrow: string;
  category: string;
  title: string;
  seoTitle: string;
  description: string;
  intent: string;
  updatedAt: string;
  readingTime: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  tool: ProductSeoToolKind;
  platform?: "HubSpot" | "Salesforce" | "Pipedrive";
  heroBullets: string[];
  sections: Array<{
    title: string;
    copy: string;
    items: string[];
  }>;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  related: string[];
};

export const productSeoPages: ProductSeoPage[] = [
  {
    slug: "templates/crm-csv-field-mapping",
    eyebrow: "Interactive template",
    category: "CRM export",
    title: "CRM CSV field mapping for prospect research",
    seoTitle: "CRM CSV Field Mapping Template for Prospect Research | LeadCue",
    description:
      "Map prospect research fields into HubSpot, Salesforce, Pipedrive, or a custom CSV export while keeping fit score, first line, and source notes intact.",
    intent: "Help teams standardize prospect research CSV exports before importing selected leads into a CRM.",
    updatedAt: "2026-04-23",
    readingTime: "Tool",
    primaryKeyword: "CRM CSV field mapping",
    secondaryKeywords: ["HubSpot CSV export fields", "Salesforce lead CSV fields", "Pipedrive CSV import fields"],
    tool: "crm-mapping",
    heroBullets: [
      "Switch between HubSpot, Salesforce, Pipedrive, and custom field naming.",
      "Copy a CRM-ready CSV header for selected prospect research fields.",
      "Keep source-backed notes attached to each exported account."
    ],
    sections: [
      {
        title: "Why field mapping matters",
        copy:
          "Prospect research loses value when the CRM import only includes company name and website. A useful CSV keeps the reason for outreach visible after handoff.",
        items: [
          "Fit score and confidence help prioritize follow-up.",
          "First line and source notes help reps verify the outreach angle.",
          "Owner, stage, saved status, and export status reduce duplicate work."
        ]
      },
      {
        title: "How to use the template",
        copy:
          "Choose the CRM naming mode, copy the header, and use the same order when exporting saved leads from LeadCue.",
        items: [
          "Use HubSpot labels for list imports and contact/company properties.",
          "Use Salesforce labels for lead import and description fields.",
          "Use Pipedrive labels for organization, person, and note handoff."
        ]
      }
    ],
    faqs: [
      {
        question: "Should every scanned website be exported?",
        answer:
          "No. Export selected saved leads so your CRM only receives accounts with evidence-backed outreach potential."
      },
      {
        question: "Can the same export model support multiple CRMs?",
        answer:
          "Yes. Keep one internal research field model, then rename headers for the CRM destination."
      },
      {
        question: "Should generated email copy be included in the CSV?",
        answer:
          "Include it when campaign builders need it, but keep source notes nearby so the copy can be reviewed before sending."
      }
    ],
    related: [
      "integrations/hubspot-csv-export",
      "integrations/salesforce-csv-export",
      "integrations/pipedrive-csv-export"
    ]
  },
  {
    slug: "templates/cold-email-first-line",
    eyebrow: "Template library",
    category: "Cold email",
    title: "Cold email first line templates from website signals",
    seoTitle: "Cold Email First Line Template Library | LeadCue",
    description:
      "Copy first line templates based on real website signals such as hidden CTAs, missing proof, stale content, and unclear positioning.",
    intent: "Give outbound teams a reusable pattern for turning website observations into credible cold email openers.",
    updatedAt: "2026-04-23",
    readingTime: "Template",
    primaryKeyword: "cold email first line template",
    secondaryKeywords: ["cold email opener template", "personalized first line template", "website signal outreach"],
    tool: "first-line",
    heroBullets: [
      "Choose a website signal and get a copy-ready first line.",
      "Pair each opener with the next sentence and a low-pressure CTA.",
      "Avoid generic compliments that do not connect to your offer."
    ],
    sections: [
      {
        title: "What the template should do",
        copy:
          "A first line should create context for the rest of the email. It should be specific enough to prove research and relevant enough to support the offer.",
        items: [
          "Mention what you saw on the website.",
          "Connect the observation to a likely buyer outcome.",
          "Keep the next step small enough to reply to."
        ]
      },
      {
        title: "When to customize",
        copy:
          "Templates are starting points. Replace the bracketed details with the exact company, page, buyer type, or offer angle before sending.",
        items: [
          "Swap in the prospect's product, service, or audience.",
          "Name the page when the source matters.",
          "Remove any claim you cannot verify from the website."
        ]
      }
    ],
    faqs: [
      {
        question: "Can I use the same first line for every prospect?",
        answer:
          "No. Use the same structure, but change the website observation and buyer implication for each account."
      },
      {
        question: "How long should a first line be?",
        answer:
          "Short enough to scan on mobile, but specific enough that the recipient can tell it came from their website."
      },
      {
        question: "Should first lines praise the company?",
        answer:
          "Only when the praise is specific and relevant. A useful observation beats vague flattery."
      }
    ],
    related: ["cold-email-first-lines", "guides/turn-website-into-cold-email-angle", "website-prospecting"]
  },
  {
    slug: "templates/website-prospecting-checklist",
    eyebrow: "Interactive checklist",
    category: "Website prospecting",
    title: "Website prospecting checklist for agency outbound",
    seoTitle: "Website Prospecting Checklist for Agency Outbound | LeadCue",
    description:
      "Use this website prospecting checklist to inspect CTA clarity, proof, SEO, navigation, contact paths, and content freshness before saving a lead.",
    intent: "Help teams qualify a prospect website before it enters an outbound campaign.",
    updatedAt: "2026-04-23",
    readingTime: "Checklist",
    primaryKeyword: "website prospecting checklist",
    secondaryKeywords: ["prospect website checklist", "agency outbound checklist", "website audit checklist"],
    tool: "checklist",
    heroBullets: [
      "Check the website signals that most often support agency outreach.",
      "Turn checked items into a Prospect Card-style summary.",
      "Use the result as a manual QA layer before export."
    ],
    sections: [
      {
        title: "How to inspect the site",
        copy:
          "Start with visible pages and avoid over-auditing. The goal is to decide whether the account has a credible outreach reason.",
        items: [
          "Review the homepage, navigation, proof, content hub, and contact path.",
          "Capture only signals that connect to your offer.",
          "Save the lead when the signal is strong enough to support a first line."
        ]
      },
      {
        title: "What to do with the result",
        copy:
          "A checklist is only useful if it becomes a next action. Convert the strongest checked item into a first line, outreach angle, and CRM note.",
        items: [
          "Use the strongest signal as the first line.",
          "Use the category as the outreach angle.",
          "Export only if the account fits your ICP."
        ]
      }
    ],
    faqs: [
      {
        question: "How many signals should I find before saving a lead?",
        answer:
          "One strong signal can be enough, but two or three source-backed signals make qualification more reliable."
      },
      {
        question: "Is this a full website audit?",
        answer:
          "No. It is a prospecting checklist for outbound qualification. A full audit can happen after the prospect engages."
      },
      {
        question: "Should low-score sites be exported?",
        answer:
          "Usually no. Keep low-confidence or weak-fit accounts out of your CRM import queue."
      }
    ],
    related: ["website-prospecting", "guides/score-prospect-website", "guides/website-audit-outreach"]
  },
  {
    slug: "integrations/hubspot-csv-export",
    eyebrow: "Integration guide",
    category: "HubSpot",
    title: "HubSpot CSV export for website prospecting research",
    seoTitle: "HubSpot CSV Export for Prospect Research | LeadCue",
    description:
      "Prepare HubSpot-friendly CSV fields for saved prospect research, including company, website, fit score, first line, source notes, and lead status.",
    intent: "Help HubSpot users import selected LeadCue-style prospect research without losing outreach context.",
    updatedAt: "2026-04-23",
    readingTime: "Guide",
    primaryKeyword: "HubSpot CSV export fields",
    secondaryKeywords: ["HubSpot lead import CSV", "HubSpot prospect research import", "HubSpot company CSV fields"],
    tool: "integration",
    platform: "HubSpot",
    heroBullets: [
      "Use human-readable headers for company and contact list imports.",
      "Keep fit score and source notes as custom properties or notes.",
      "Import selected saved leads rather than every scanned website."
    ],
    sections: [
      {
        title: "Recommended HubSpot fields",
        copy:
          "HubSpot imports work best when the CSV uses clear labels and preserves the research context in fields sales reps can see.",
        items: [
          "Company name, Website URL, Industry, Lead status, Owner.",
          "Fit score, Confidence score, Top website signal.",
          "First line, Short email, Source notes, Contact path."
        ]
      },
      {
        title: "Import workflow",
        copy:
          "Export selected saved leads, confirm owner and lifecycle stage, then import into HubSpot as company records, contact records, or campaign lists.",
        items: [
          "Map LeadCue owner to HubSpot owner when available.",
          "Use Lead status or Lifecycle stage to mark research-ready accounts.",
          "Keep source notes visible for QA and reply coaching."
        ]
      }
    ],
    faqs: [
      {
        question: "Should fit score be a HubSpot custom property?",
        answer:
          "Yes. A numeric custom property makes it easier to sort and segment research-ready accounts."
      },
      {
        question: "Can source notes go into HubSpot notes?",
        answer:
          "Yes. Source notes can be stored as a note or custom long-text property depending on your workflow."
      },
      {
        question: "Should exported leads become contacts or companies?",
        answer:
          "For website-first prospecting, companies are usually the safest starting point until a verified contact path is available."
      }
    ],
    related: ["templates/crm-csv-field-mapping", "prospect-research-tool-for-agencies", "agency-lead-qualification"]
  },
  {
    slug: "integrations/salesforce-csv-export",
    eyebrow: "Integration guide",
    category: "Salesforce",
    title: "Salesforce CSV export for qualified prospect research",
    seoTitle: "Salesforce CSV Export for Qualified Prospect Research | LeadCue",
    description:
      "Map website prospecting research into Salesforce lead import fields while preserving fit score, source notes, first line, and lead source.",
    intent: "Help Salesforce teams import qualified prospect research with enough context for sales follow-up.",
    updatedAt: "2026-04-23",
    readingTime: "Guide",
    primaryKeyword: "Salesforce lead CSV fields",
    secondaryKeywords: ["Salesforce CSV import leads", "Salesforce prospect research fields", "Salesforce lead source CSV"],
    tool: "integration",
    platform: "Salesforce",
    heroBullets: [
      "Use Lead Source and Description to preserve research context.",
      "Store fit score and confidence as custom numeric fields.",
      "Import only leads that pass your save threshold."
    ],
    sections: [
      {
        title: "Recommended Salesforce fields",
        copy:
          "Salesforce imports should make the lead owner, source, status, and research reason visible immediately.",
        items: [
          "Company, Website, Industry, Lead Source, Lead Status, Owner.",
          "Fit Score, Confidence Score, Top Signal, Outreach Angle.",
          "First Line, Email Draft, Source Notes, Contact Path."
        ]
      },
      {
        title: "Import workflow",
        copy:
          "Use a consistent CSV header, map fields during import, and create custom fields for research scores if Salesforce does not already have them.",
        items: [
          "Set Lead Source to LeadCue or Website Prospecting.",
          "Use Description for the source-backed summary.",
          "Assign owner and status before campaign handoff."
        ]
      }
    ],
    faqs: [
      {
        question: "Where should first lines go in Salesforce?",
        answer:
          "Use a custom text field or include the first line in Description with the source notes."
      },
      {
        question: "Should every LeadCue field become a Salesforce field?",
        answer:
          "No. Keep core fields structured and put longer context into Description or notes."
      },
      {
        question: "Can Salesforce import source notes?",
        answer:
          "Yes, source notes can be mapped to a long text field, Description, or a related note depending on your setup."
      }
    ],
    related: ["templates/crm-csv-field-mapping", "agency-lead-qualification", "guides/score-prospect-website"]
  },
  {
    slug: "integrations/pipedrive-csv-export",
    eyebrow: "Integration guide",
    category: "Pipedrive",
    title: "Pipedrive CSV export for source-backed prospect notes",
    seoTitle: "Pipedrive CSV Export for Prospect Research Notes | LeadCue",
    description:
      "Prepare Pipedrive CSV imports for website prospecting research with organization fields, owner, stage, fit score, first line, and notes.",
    intent: "Help Pipedrive users move selected prospect research into organizations, people, deals, or notes.",
    updatedAt: "2026-04-23",
    readingTime: "Guide",
    primaryKeyword: "Pipedrive CSV import fields",
    secondaryKeywords: ["Pipedrive organization CSV", "Pipedrive prospect notes", "Pipedrive lead import"],
    tool: "integration",
    platform: "Pipedrive",
    heroBullets: [
      "Use organization fields for company and website context.",
      "Keep research details in notes or custom fields.",
      "Map owner and stage before moving prospects into pipeline."
    ],
    sections: [
      {
        title: "Recommended Pipedrive fields",
        copy:
          "Pipedrive works best when the organization record carries the website context and the note carries the research reason.",
        items: [
          "Organization name, Website, Industry, Owner, Stage.",
          "Fit score, Confidence score, Top signal, Contact path.",
          "First line, Short email, Source notes, Export status."
        ]
      },
      {
        title: "Import workflow",
        copy:
          "Import selected saved leads as organizations or leads, then use notes to preserve source-backed outreach context.",
        items: [
          "Use Owner to route follow-up.",
          "Use Stage to separate researching, qualified, and outreach-ready accounts.",
          "Keep the first line and source notes visible before sending."
        ]
      }
    ],
    faqs: [
      {
        question: "Should Pipedrive imports create deals immediately?",
        answer:
          "Usually no. Create organizations or leads first, then create deals after the account shows engagement."
      },
      {
        question: "Where should source notes live in Pipedrive?",
        answer:
          "Use notes or a long custom field so reps can verify why the account was saved."
      },
      {
        question: "Can Pipedrive use fit score for prioritization?",
        answer:
          "Yes. Store fit score as a custom field and use filters to prioritize high-fit accounts."
      }
    ],
    related: ["templates/crm-csv-field-mapping", "prospect-research-tool-for-agencies", "website-prospecting"]
  }
];

export const productSeoPageMap: Partial<Record<string, ProductSeoPage>> = Object.fromEntries(
  productSeoPages.map((page) => [page.slug, page])
);
