export type ProductSeoToolKind = "workflow" | "crm-mapping" | "first-line" | "checklist" | "integration";

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
    slug: "tools/prospect-card",
    eyebrow: "Core product object",
    category: "Prospect Card",
    title: "Prospect Card workflow for website-first outbound research",
    seoTitle: "Prospect Card Workflow for Website-First Outbound Research | LeadCue",
    description:
      "See how a Prospect Card keeps website evidence, fit score, opportunity signals, first lines, source notes, and CRM-ready fields together.",
    intent: "Help agencies understand the core LeadCue output before they save or export a prospect.",
    updatedAt: "2026-05-03",
    readingTime: "Workflow",
    primaryKeyword: "Prospect Card",
    secondaryKeywords: ["prospect research card", "website evidence card", "outreach context card"],
    tool: "workflow",
    heroBullets: [
      "A Prospect Card is the handoff object between website research and outreach.",
      "It keeps fit score, opportunity signals, source notes, first line, and export fields in one place.",
      "Teams can review the card before a prospect moves into CRM, CSV, or an email workflow."
    ],
    sections: [
      {
        title: "What a Prospect Card should contain",
        copy:
          "A useful card is not just a company name and URL. It captures the smallest complete research package a rep needs to decide whether the account deserves outreach.",
        items: [
          "Company, website URL, industry, owner, stage, saved status, and export status.",
          "Fit score, confidence score, top opportunity signal, and reason to contact.",
          "First line, short email context, source notes, contact path, and CRM field mapping."
        ]
      },
      {
        title: "Prospect Card field matrix",
        copy:
          "The field set should separate account fit, evidence quality, outreach copy, and downstream handoff so teams do not treat every scanned website as a qualified lead.",
        items: [
          "Qualification fields: ICP fit, confidence, signal category, and save threshold.",
          "Evidence fields: source page, observed website cue, business implication, and uncertainty note.",
          "Handoff fields: owner, CRM destination, first line, source notes, and export-ready status."
        ]
      },
      {
        title: "When a card should not be saved",
        copy:
          "The Prospect Card is also a quality gate. If the account has no credible reason to contact, the right outcome is to skip or review instead of exporting another weak lead.",
        items: [
          "Skip when the only signal is generic or unrelated to the agency offer.",
          "Review when fit is strong but the source evidence is thin or uncertain.",
          "Save when the card includes a specific signal, a clear buyer implication, and a first line the team can verify."
        ]
      }
    ],
    faqs: [
      {
        question: "Is a Prospect Card the same as a CRM record?",
        answer:
          "No. A Prospect Card sits before the CRM. It helps teams decide whether a website-backed prospect is worth saving, assigning, and exporting."
      },
      {
        question: "Should every scanned website get a Prospect Card?",
        answer:
          "No. Scanned websites should become saved Prospect Cards only when fit and evidence support a credible outreach reason."
      },
      {
        question: "What makes a Prospect Card useful for cold outreach?",
        answer:
          "It keeps the source observation, buyer implication, first line, and CRM-ready notes together so a rep can verify the claim before sending."
      }
    ],
    related: ["website-first-outbound-research", "guides/website-opportunity-signals", "templates/crm-csv-field-mapping"]
  },
  {
    slug: "tools/prospect-research-chrome-extension",
    eyebrow: "Product workflow",
    category: "Chrome extension",
    title: "Prospect research Chrome extension for website review",
    seoTitle: "Prospect Research Chrome Extension | LeadCue",
    description:
      "Review a prospect website from Chrome, capture visible evidence, and save a qualified outreach card without leaving the page.",
    intent: "Help operators research a prospect while they are already looking at the company website.",
    updatedAt: "2026-04-29",
    readingTime: "Workflow",
    primaryKeyword: "prospect research Chrome extension",
    secondaryKeywords: ["website prospecting Chrome extension", "outreach research extension", "prospect website review"],
    tool: "workflow",
    heroBullets: [
      "Capture website evidence while the page is still in view.",
      "Save fit notes, first-line cues, and source context to the same Prospect Card.",
      "Move only reviewed accounts into the web workspace for follow-up and export."
    ],
    sections: [
      {
        title: "Why a browser workflow matters",
        copy:
          "A Chrome extension fits the moment when a researcher is already inspecting a prospect website. Instead of copying notes into a sheet, the team can save visible evidence and keep it connected to the account.",
        items: [
          "Review the homepage, proof, content, and contact path in the same session.",
          "Capture the reason to contact before it gets lost in a tab or spreadsheet.",
          "Keep manual judgment in the workflow instead of turning every website into a lead automatically."
        ]
      },
      {
        title: "What should be saved",
        copy:
          "The extension should not only save a URL. It should preserve the smallest useful research package: source observation, fit reason, outreach angle, first line, and next step.",
        items: [
          "Website signal and the page context behind it.",
          "Fit score, confidence, and the service angle that makes the account relevant.",
          "A first line or short note the rep can verify before sending."
        ]
      }
    ],
    faqs: [
      {
        question: "Is this a scraping extension?",
        answer:
          "No. The workflow is designed around visible public website review, human judgment, and saving source-backed outreach context."
      },
      {
        question: "When should an agency use the extension instead of batch import?",
        answer:
          "Use the extension when a researcher is browsing one account at a time. Use batch import when the team already has a list of domains to review."
      },
      {
        question: "Can extension notes be exported later?",
        answer:
          "Yes. Saved accounts can carry the same fit score, source notes, and first-line context into CSV or CRM export workflows."
      }
    ],
    related: ["tools/prospect-card", "website-prospecting", "tools/outreach-context-workspace"]
  },
  {
    slug: "tools/batch-website-review-queue",
    eyebrow: "Product workflow",
    category: "Review queue",
    title: "Batch website review queue for agency prospecting",
    seoTitle: "Batch Website Review Queue for Agency Prospecting | LeadCue",
    description:
      "Import prospect websites into a review queue, prioritize accounts, and keep qualification work moving before outreach.",
    intent: "Help agencies review many prospect websites without sending unqualified accounts into campaigns.",
    updatedAt: "2026-04-29",
    readingTime: "Workflow",
    primaryKeyword: "batch website review queue",
    secondaryKeywords: ["batch website prospecting", "website review workflow", "agency prospect review queue"],
    tool: "workflow",
    heroBullets: [
      "Import domain lists and review accounts before campaign handoff.",
      "Separate scanned websites from saved, qualified prospects.",
      "Use fit score and confidence to decide which accounts deserve outreach first."
    ],
    sections: [
      {
        title: "The queue job",
        copy:
          "A review queue keeps volume from becoming noise. It gives researchers a place to move through many websites, compare signals, and save only the accounts with a clear reason to contact.",
        items: [
          "Batch import prospect domains from a spreadsheet, CRM list, or manual research.",
          "Review accounts in a consistent order instead of jumping between tabs.",
          "Keep rejected or low-confidence accounts out of outbound tools."
        ]
      },
      {
        title: "How teams use the queue",
        copy:
          "The queue is strongest when one person prepares accounts and another person writes or approves outreach. The handoff works because each saved account includes the evidence behind the recommendation.",
        items: [
          "Prioritize high-fit accounts for same-day outreach.",
          "Assign owners before export or sequence creation.",
          "Export only selected accounts with source notes and first lines attached."
        ]
      }
    ],
    faqs: [
      {
        question: "Should every imported website become a lead?",
        answer:
          "No. The point of a review queue is to filter. Imported websites should become saved prospects only when the evidence supports outreach."
      },
      {
        question: "What makes a batch review queue different from a spreadsheet?",
        answer:
          "A spreadsheet stores rows. A review queue stores the research state, fit score, source notes, first-line cues, and export readiness for each account."
      },
      {
        question: "Can the queue support manual QA?",
        answer:
          "Yes. Human review is part of the workflow, especially before a prospect is saved, assigned, exported, or used in email copy."
      }
    ],
    related: ["website-prospecting", "agency-lead-qualification", "templates/website-prospecting-checklist"]
  },
  {
    slug: "tools/outreach-context-workspace",
    eyebrow: "Product workflow",
    category: "Outreach workspace",
    title: "Outreach context workspace for website-based prospecting",
    seoTitle: "Outreach Context Workspace for Agencies | LeadCue",
    description:
      "Keep website evidence, fit scores, first lines, source notes, and CRM export fields together before launching outreach.",
    intent: "Help teams preserve the reason behind outreach from research through CRM or email handoff.",
    updatedAt: "2026-04-29",
    readingTime: "Workflow",
    primaryKeyword: "outreach context workspace",
    secondaryKeywords: ["qualified outreach workflow", "website research workspace", "outreach-ready context"],
    tool: "workflow",
    heroBullets: [
      "Keep the website observation, business angle, and first line together.",
      "Give reps enough context to verify a claim before sending.",
      "Export CRM fields without losing the source-backed reason to contact."
    ],
    sections: [
      {
        title: "Why outreach context gets lost",
        copy:
          "Many teams research accounts in one place, write notes in another, and export leads somewhere else. By the time outreach starts, the reason to contact has often turned into a generic sentence.",
        items: [
          "Source notes disappear when only company name and URL are exported.",
          "First lines get copied without the evidence needed for review.",
          "Reps cannot explain why a prospect was selected."
        ]
      },
      {
        title: "What the workspace should preserve",
        copy:
          "A useful outreach workspace connects each account to a compact evidence chain: website signal, fit reason, first line, source note, owner, stage, and export status.",
        items: [
          "Website evidence and a plain-language business implication.",
          "Fit score and confidence so teams can prioritize cleanly.",
          "CRM-ready fields that keep context attached during handoff."
        ]
      }
    ],
    faqs: [
      {
        question: "Is an outreach context workspace the same as a CRM?",
        answer:
          "No. The workspace sits before the CRM. It helps teams decide which accounts are worth outreach and what context should be handed off."
      },
      {
        question: "Does this replace an email sending tool?",
        answer:
          "No. LeadCue prepares the research and context before the account enters tools such as CRM, CSV, or email sequencing software."
      },
      {
        question: "What context should be reviewed before sending?",
        answer:
          "Review the source observation, fit reason, first line, and any claim that will appear in the outbound message."
      }
    ],
    related: ["tools/prospect-card", "guides/source-backed-prospect-notes", "templates/crm-csv-field-mapping"]
  },
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
