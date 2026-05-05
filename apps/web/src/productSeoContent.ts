export type ProductSeoToolKind =
  | "workflow"
  | "field-mapping"
  | "first-line"
  | "opportunity-finder"
  | "prospect-score"
  | "tool-hub"
  | "checklist"
  | "integration";

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
    title: "Prospect Card workflow for AI website prospecting",
    seoTitle: "Prospect Card Workflow for AI Website Prospecting | LeadCue",
    description:
      "See how a Prospect Card keeps website evidence, fit score, opportunity signals, first lines, source notes, and export-ready fields together.",
    intent: "Help solo professionals understand the core LeadCue output before they save or export a prospect.",
    updatedAt: "2026-05-03",
    readingTime: "Workflow",
    primaryKeyword: "Prospect Card",
    secondaryKeywords: ["prospect research card", "website evidence card", "outreach context card"],
    tool: "workflow",
    heroBullets: [
      "A Prospect Card is the handoff object between website research and outreach.",
      "It keeps fit score, opportunity signals, source notes, first line, and export fields in one place.",
      "Review the card before a prospect moves into CSV export or an email workflow."
    ],
    sections: [
      {
        title: "What a Prospect Card should contain",
        copy:
          "A useful card is not just a company name and URL. It captures the smallest complete research package you need to decide whether the prospect deserves outreach.",
        items: [
          "Company, website URL, industry, follow-up status, saved status, and export status.",
          "Fit score, confidence score, top opportunity signal, and reason to contact.",
          "First line, short email context, source notes, contact path, and CSV field mapping."
        ]
      },
      {
        title: "Prospect Card field matrix",
        copy:
          "The field set should separate prospect fit, evidence quality, outreach copy, and downstream handoff so you do not treat every scanned website as a qualified lead.",
        items: [
          "Qualification fields: ICP fit, confidence, signal category, and save threshold.",
          "Evidence fields: source page, observed website cue, business implication, and uncertainty note.",
          "Handoff fields: export destination, first line, source notes, and export-ready status."
        ]
      },
      {
        title: "When a card should not be saved",
        copy:
          "The Prospect Card is also a quality gate. If the prospect has no credible reason to contact, the right outcome is to skip or review instead of exporting another weak lead.",
        items: [
          "Skip when the only signal is generic or unrelated to your offer.",
          "Review when fit is strong but the source evidence is thin or uncertain.",
          "Save when the card includes a specific signal, a clear buyer implication, and a first line you can verify."
        ]
      }
    ],
    faqs: [
      {
        question: "Is a Prospect Card the same as an exported row?",
        answer:
          "No. A Prospect Card sits before export. It helps you decide whether a website-backed prospect is worth saving and using in outreach."
      },
      {
        question: "Should every scanned website get a Prospect Card?",
        answer:
          "No. Scanned websites should become saved Prospect Cards only when fit and evidence support a credible outreach reason."
      },
      {
        question: "What makes a Prospect Card useful for cold outreach?",
        answer:
          "It keeps the source observation, buyer implication, first line, and export-ready notes together so you can verify the claim before sending."
      }
    ],
    related: ["tools/free-website-prospecting-tools", "tools/website-opportunity-finder", "templates/csv-field-mapping"]
  },
  {
    slug: "tools/free-website-prospecting-tools",
    eyebrow: "Free tool collection",
    category: "Free website prospecting tools",
    title: "Free website prospecting tools for solo professionals",
    seoTitle: "Free Website Prospecting Tools | LeadCue",
    description:
      "Use free website prospecting tools to score a prospect, find website opportunities, and draft a cold email first line from public website evidence.",
    intent: "Help solo professionals choose the right free website tool before creating a full LeadCue Prospect Card.",
    updatedAt: "2026-05-05",
    readingTime: "Free tools",
    primaryKeyword: "free website prospecting tools",
    secondaryKeywords: ["website prospecting tools", "free prospect research tools", "website research tools for cold email"],
    tool: "tool-hub",
    heroBullets: [
      "Start with a lightweight preview instead of building another weak lead list.",
      "Score fit, inspect opportunity signals, or generate a first line from one website.",
      "Move into LeadCue when a prospect deserves a saved card, source notes, and export-ready fields."
    ],
    sections: [
      {
        title: "Which free tool to use first",
        copy:
          "Each tool answers a different qualification question, so you can avoid turning every website into outreach work.",
        items: [
          "Use the score checker when you need a quick qualify, review, or skip decision.",
          "Use the opportunity finder when you need visible website-backed reasons to contact.",
          "Use the first line generator when you already know the prospect deserves a personalized opener."
        ]
      },
      {
        title: "When to create a full Prospect Card",
        copy:
          "The free tools are previews. Create the full card when the website shows enough fit and evidence to justify outreach.",
        items: [
          "Save the prospect when the score and opportunity signal match your service.",
          "Keep source-backed notes with the first line and short email context.",
          "Export only the prospects that carry a credible reason to contact."
        ]
      }
    ],
    faqs: [
      {
        question: "Are these tools a replacement for LeadCue?",
        answer:
          "No. They are free previews for scoring, opportunity discovery, and first-line drafting. LeadCue keeps the full Prospect Card, notes, status, and export workflow together."
      },
      {
        question: "Which tool should I start with?",
        answer:
          "Start with the score checker if you are unsure whether a prospect is worth time. Use the opportunity finder when you want reasons to contact, and the first line generator when you need opener options."
      },
      {
        question: "Do the tools find verified emails?",
        answer:
          "No. LeadCue focuses on website evidence, prospect fit, opportunity signals, and outreach context rather than contact databases or verified email discovery."
      }
    ],
    related: [
      "tools/website-prospect-score-checker",
      "tools/website-opportunity-finder",
      "templates/cold-email-first-line"
    ]
  },
  {
    slug: "tools/website-opportunity-finder",
    eyebrow: "Free website tool",
    category: "Opportunity finder",
    title: "Website opportunity finder for personal prospecting",
    seoTitle: "Website Opportunity Finder | LeadCue",
    description:
      "Find website improvement opportunities, fit preview, and source-backed outreach angles before you decide whether a prospect deserves a full Prospect Card.",
    intent: "Help solo professionals preview useful website opportunities without replacing the full LeadCue prospecting workflow.",
    updatedAt: "2026-05-05",
    readingTime: "Free tool",
    primaryKeyword: "website opportunity finder",
    secondaryKeywords: [
      "find website improvement opportunities",
      "AI tool to find website redesign opportunities",
      "website opportunity signals"
    ],
    tool: "opportunity-finder",
    heroBullets: [
      "Paste a prospect website and see three visible opportunity signals.",
      "Preview whether the site is worth deeper research before you save it.",
      "Start free to turn the preview into a full Prospect Card and export-ready context."
    ],
    sections: [
      {
        title: "What the finder should reveal",
        copy:
          "A useful opportunity preview should not pretend to be a full audit. It should surface a few visible website signals that can support a relevant, low-pressure outreach angle.",
        items: [
          "Conversion signals such as unclear CTA paths, weak proof, or hidden contact routes.",
          "SEO and content gaps that can support an educational outreach angle.",
          "Source-backed observations that can later become a Prospect Card note."
        ]
      },
      {
        title: "How to use the preview",
        copy:
          "Use the preview as a qualification step. If the opportunities are specific and relevant to your offer, create the full card; if they are generic, skip the prospect before it reaches your outreach list.",
        items: [
          "Check whether the top signal connects to your actual service offer.",
          "Look for enough evidence to justify saving the prospect.",
          "Use the full Prospect Card when you need first lines, short email, status, notes, and CSV export."
        ]
      }
    ],
    faqs: [
      {
        question: "Is this a full website audit?",
        answer:
          "No. It is a free prospecting preview. It highlights visible opportunities but keeps the full fit score, source notes, outreach copy, saving, and export workflow inside LeadCue."
      },
      {
        question: "What should I do with weak opportunities?",
        answer:
          "Skip or review the prospect instead of forcing it into outreach. LeadCue is designed to help solo professionals avoid exporting weak leads."
      },
      {
        question: "Does the tool find contact data?",
        answer:
          "No. It focuses on website evidence and outreach angles. LeadCue does not promise verified email discovery or contact databases."
      }
    ],
    related: ["tools/free-website-prospecting-tools", "website-prospecting", "guides/website-opportunity-signals"]
  },
  {
    slug: "tools/website-prospect-score-checker",
    eyebrow: "Free website tool",
    category: "Prospect scoring",
    title: "Website prospect score checker for personal outreach",
    seoTitle: "Website Prospect Score Checker | LeadCue",
    description:
      "Score a prospect website by commercial fit, website evidence, contact path, and outreach readiness before adding it to your outreach list.",
    intent: "Help solo professionals decide whether a prospect website deserves deeper research and a full Prospect Card.",
    updatedAt: "2026-05-05",
    readingTime: "Free tool",
    primaryKeyword: "website prospect score checker",
    secondaryKeywords: ["score prospect website", "website lead scoring", "prospect fit score checker"],
    tool: "prospect-score",
    heroBullets: [
      "Paste a prospect website and get a fit score with four explainable dimensions.",
      "See the strongest website-backed signal before spending time on outreach.",
      "Start free to turn the score into a full Prospect Card with first lines and export fields."
    ],
    sections: [
      {
        title: "What the score should explain",
        copy:
          "A useful prospect score should not be a naked number. It should show which visible website evidence supports the score and what still needs human review.",
        items: [
          "Commercial fit: whether the website suggests a relevant buyer problem for your offer.",
          "Website evidence: whether the signal is specific enough to cite safely.",
          "Contact path and outreach readiness: whether the prospect can move into a real follow-up workflow."
        ]
      },
      {
        title: "How to use the score",
        copy:
          "Use the score as a lightweight quality gate before saving a lead. Strong scores can become Prospect Cards; weak scores should be skipped or reviewed later.",
        items: [
          "Save prospects when the score and strongest signal align with your service.",
          "Review prospects when the fit is promising but source evidence is thin.",
          "Skip prospects when the site produces only generic or unrelated signals."
        ]
      }
    ],
    faqs: [
      {
        question: "Is the score enough to start outreach?",
        answer:
          "Use it as a preview, not the final card. The full Prospect Card adds source notes, first lines, short email context, saved status, and export-ready fields."
      },
      {
        question: "What does the score measure?",
        answer:
          "The preview combines commercial fit, website evidence, contact path, and outreach readiness so the number is tied to visible reasons."
      },
      {
        question: "Should low-score prospects be exported?",
        answer:
          "Usually no. Low-score prospects create downstream work and weaken outreach quality, so they should be skipped or manually reviewed."
      }
    ],
    related: ["tools/free-website-prospecting-tools", "tools/website-opportunity-finder", "guides/score-prospect-website"]
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
      "Move only reviewed prospects into your dashboard for follow-up and export."
    ],
    sections: [
      {
        title: "Why a browser workflow matters",
        copy:
          "A Chrome extension fits the moment when you are already inspecting a prospect website. Instead of copying notes into a sheet, you can save visible evidence and keep it connected to the prospect.",
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
          "Fit score, confidence, and the service angle that makes the prospect relevant.",
          "A first line or short note you can verify before sending."
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
        question: "When should I use the extension instead of batch import?",
        answer:
          "Use the extension when you are browsing one prospect at a time. Use batch import when you already have a list of domains to review."
      },
      {
        question: "Can extension notes be exported later?",
        answer:
          "Yes. Saved prospects can carry the same fit score, source notes, and first-line context into CSV export workflows."
      }
    ],
    related: ["tools/prospect-card", "website-prospecting", "tools/prospecting-dashboard"]
  },
  {
    slug: "tools/batch-website-review-queue",
    eyebrow: "Product workflow",
    category: "Review queue",
    title: "Batch website review queue for personal prospecting",
    seoTitle: "Batch Website Review Queue for Personal Prospecting | LeadCue",
    description:
      "Import prospect websites into a review queue, prioritize prospects, and keep qualification work moving before outreach.",
    intent: "Help solo professionals review many prospect websites without sending unqualified prospects into outreach.",
    updatedAt: "2026-04-29",
    readingTime: "Workflow",
    primaryKeyword: "batch website review queue",
    secondaryKeywords: ["batch website prospecting", "website review workflow", "personal prospect review queue"],
    tool: "workflow",
    heroBullets: [
      "Import domain lists and review prospects before outreach.",
      "Separate scanned websites from saved, qualified prospects.",
      "Use fit score and confidence to decide which prospects deserve outreach first."
    ],
    sections: [
      {
        title: "The queue job",
        copy:
          "A review queue keeps volume from becoming noise. It gives you a place to move through many websites, compare signals, and save only the prospects with a clear reason to contact.",
        items: [
          "Batch import prospect domains from a spreadsheet or manual research.",
          "Review prospects in a consistent order instead of jumping between tabs.",
          "Keep rejected or low-confidence prospects out of outreach tools."
        ]
      },
      {
        title: "How solo operators use the queue",
        copy:
          "The queue is strongest when you want to prepare a list first, then write outreach only for qualified prospects. The workflow works because each saved prospect includes the evidence behind the recommendation.",
        items: [
          "Prioritize high-fit prospects for same-day outreach.",
          "Set follow-up status before export or email writing.",
          "Export only selected prospects with source notes and first lines attached."
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
          "A spreadsheet stores rows. A review queue stores the research state, fit score, source notes, first-line cues, and export readiness for each prospect."
      },
      {
        question: "Can the queue support manual QA?",
        answer:
          "Yes. Human review is part of the workflow, especially before a prospect is saved, exported, or used in email copy."
      }
    ],
    related: ["website-prospecting", "prospect-qualification", "templates/website-prospecting-checklist"]
  },
  {
    slug: "tools/prospecting-dashboard",
    eyebrow: "Product workflow",
    category: "Prospecting dashboard",
    title: "Prospecting dashboard for website-based outreach",
    seoTitle: "Prospecting Dashboard for Solo Professionals | LeadCue",
    description:
      "Keep website evidence, fit scores, first lines, source notes, and export fields together before launching outreach.",
    intent: "Help solo professionals preserve the reason behind outreach from research through email handoff.",
    updatedAt: "2026-04-29",
    readingTime: "Workflow",
    primaryKeyword: "prospecting dashboard",
    secondaryKeywords: ["qualified outreach workflow", "website research dashboard", "outreach-ready context"],
    tool: "workflow",
    heroBullets: [
      "Keep the website observation, business angle, and first line together.",
      "Keep enough context to verify a claim before sending.",
      "Export fields without losing the source-backed reason to contact."
    ],
    sections: [
      {
        title: "Why outreach context gets lost",
        copy:
          "Many solo operators research prospects in one place, write notes in another, and export leads somewhere else. By the time outreach starts, the reason to contact has often turned into a generic sentence.",
        items: [
          "Source notes disappear when only company name and URL are exported.",
          "First lines get copied without the evidence needed for review.",
          "You cannot explain why a prospect was selected."
        ]
      },
      {
        title: "What the dashboard should preserve",
        copy:
          "A useful prospecting dashboard connects each prospect to a compact evidence chain: website signal, fit reason, first line, source note, follow-up status, and export status.",
        items: [
          "Website evidence and a plain-language business implication.",
          "Fit score and confidence so you can prioritize cleanly.",
          "Export-ready fields that keep context attached during handoff."
        ]
      }
    ],
    faqs: [
      {
        question: "Is a prospecting dashboard the same as an outreach tool?",
        answer:
          "No. The dashboard sits before your outreach workflow. It helps you decide which prospects are worth outreach and what context should be handed off."
      },
      {
        question: "Does this replace an email sending tool?",
        answer:
          "No. LeadCue prepares the research and context before the prospect enters CSV export or email software."
      },
      {
        question: "What context should be reviewed before sending?",
        answer:
          "Review the source observation, fit reason, first line, and any claim that will appear in the outbound message."
      }
    ],
    related: ["tools/prospect-card", "guides/source-backed-prospect-notes", "templates/csv-field-mapping"]
  },
  {
    slug: "templates/csv-field-mapping",
    eyebrow: "Interactive template",
    category: "CSV export",
    title: "CSV field mapping for prospect research",
    seoTitle: "CSV Field Mapping Template for Prospect Research | LeadCue",
    description:
      "Map prospect research fields into HubSpot, Salesforce, Pipedrive, or a custom CSV export while keeping fit score, first line, and source notes intact.",
    intent: "Help solo professionals standardize prospect research CSV exports before using selected leads in outreach.",
    updatedAt: "2026-04-23",
    readingTime: "Tool",
    primaryKeyword: "CSV field mapping",
    secondaryKeywords: ["HubSpot CSV export fields", "Salesforce lead CSV fields", "Pipedrive CSV import fields"],
    tool: "field-mapping",
    heroBullets: [
      "Switch between HubSpot, Salesforce, Pipedrive, and custom field naming.",
      "Copy an export-ready CSV header for selected prospect research fields.",
      "Keep source-backed notes attached to each exported prospect."
    ],
    sections: [
      {
        title: "Why field mapping matters",
        copy:
          "Prospect research loses value when an export only includes company name and website. A useful CSV keeps the reason for outreach visible after handoff.",
        items: [
          "Fit score and confidence help prioritize follow-up.",
          "First line and source notes help you verify the outreach angle.",
          "Follow-up status, saved status, and export status reduce duplicate work."
        ]
      },
      {
        title: "How to use the template",
        copy:
          "Choose the destination naming mode, copy the header, and use the same order when exporting saved prospects from LeadCue.",
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
          "No. Export selected saved prospects so your next workflow only receives companies with evidence-backed outreach potential."
      },
      {
        question: "Can the same export model support multiple tools?",
        answer:
          "Yes. Keep one internal research field model, then rename headers for the destination."
      },
      {
        question: "Should generated email copy be included in the CSV?",
        answer:
          "Include it when you need it, but keep source notes nearby so the copy can be reviewed before sending."
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
    intent: "Give solo operators a reusable pattern for turning website observations into credible cold email openers.",
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
          "No. Use the same structure, but change the website observation and buyer implication for each prospect."
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
    related: ["tools/free-website-prospecting-tools", "tools/website-opportunity-finder", "cold-email-first-lines"]
  },
  {
    slug: "templates/website-prospecting-checklist",
    eyebrow: "Interactive checklist",
    category: "Website prospecting",
    title: "Website prospecting checklist for personal outreach",
    seoTitle: "Website Prospecting Checklist for Personal Outreach | LeadCue",
    description:
      "Use this website prospecting checklist to inspect CTA clarity, proof, SEO, navigation, contact paths, and content freshness before saving a prospect.",
    intent: "Help solo professionals qualify a prospect website before it enters outbound outreach.",
    updatedAt: "2026-04-23",
    readingTime: "Checklist",
    primaryKeyword: "website prospecting checklist",
    secondaryKeywords: ["prospect website checklist", "personal outreach checklist", "website audit checklist"],
    tool: "checklist",
    heroBullets: [
      "Check the website signals that most often support personal outreach.",
      "Turn checked items into a Prospect Card-style summary.",
      "Use the result as a manual QA layer before export."
    ],
    sections: [
      {
        title: "How to inspect the site",
        copy:
          "Start with visible pages and avoid over-auditing. The goal is to decide whether the prospect has a credible outreach reason.",
        items: [
          "Review the homepage, navigation, proof, content hub, and contact path.",
          "Capture only signals that connect to your offer.",
          "Save the prospect when the signal is strong enough to support a first line."
        ]
      },
      {
        title: "What to do with the result",
        copy:
          "A checklist is only useful if it becomes a next action. Convert the strongest checked item into a first line, outreach angle, and export note.",
        items: [
          "Use the strongest signal as the first line.",
          "Use the category as the outreach angle.",
          "Export only if the prospect fits your ICP."
        ]
      }
    ],
    faqs: [
      {
        question: "How many signals should I find before saving a prospect?",
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
          "Usually no. Keep low-confidence or weak-fit prospects out of your export queue."
      }
    ],
    related: ["tools/website-opportunity-finder", "website-prospecting", "guides/score-prospect-website"]
  },
  {
    slug: "integrations/hubspot-csv-export",
    eyebrow: "Integration guide",
    category: "HubSpot",
    title: "HubSpot CSV export for website prospecting research",
    seoTitle: "HubSpot CSV Export for Prospect Research | LeadCue",
    description:
      "Prepare HubSpot-friendly CSV fields for saved prospect research, including company, website, fit score, first line, source notes, and follow-up status.",
    intent: "Help HubSpot users import selected LeadCue-style prospect research without losing outreach context.",
    updatedAt: "2026-04-23",
    readingTime: "Guide",
    primaryKeyword: "HubSpot CSV export fields",
    secondaryKeywords: ["HubSpot CSV import", "HubSpot prospect research import", "HubSpot company CSV fields"],
    tool: "integration",
    platform: "HubSpot",
    heroBullets: [
      "Use human-readable headers for company and prospect list imports.",
      "Keep fit score and source notes as custom properties or notes.",
      "Import selected saved prospects rather than every scanned website."
    ],
    sections: [
      {
        title: "Recommended HubSpot fields",
        copy:
          "HubSpot imports work best when the CSV uses clear labels and preserves the research context you need for follow-up.",
        items: [
          "Company name, Website URL, Industry, Follow-up status.",
          "Fit score, Confidence score, Top website signal.",
          "First line, Short email, Source notes, Contact path."
        ]
      },
      {
        title: "Import workflow",
        copy:
          "Export selected saved prospects, confirm follow-up status, then import into HubSpot as company records, notes, or lists.",
        items: [
          "Use follow-up status to mark research-ready prospects.",
          "Keep source notes visible for review before outreach.",
          "Import only the prospects you have actually qualified."
        ]
      }
    ],
    faqs: [
      {
        question: "Should fit score be a HubSpot custom property?",
        answer:
          "Yes. A numeric custom property makes it easier to sort and segment research-ready prospects."
      },
      {
        question: "Can source notes go into HubSpot notes?",
        answer:
          "Yes. Source notes can be stored as a note or custom long-text property depending on your workflow."
      },
      {
        question: "Should exported prospects become contacts or companies?",
        answer:
          "For website prospecting, companies are usually the safest starting point until a clear contact path is available."
      }
    ],
    related: ["templates/csv-field-mapping", "prospect-research-tool-for-solo-professionals", "prospect-qualification"]
  },
  {
    slug: "integrations/salesforce-csv-export",
    eyebrow: "Integration guide",
    category: "Salesforce",
    title: "Salesforce CSV export for qualified prospect research",
    seoTitle: "Salesforce CSV Export for Qualified Prospect Research | LeadCue",
    description:
      "Map website prospecting research into Salesforce import fields while preserving fit score, source notes, first line, and source context.",
    intent: "Help Salesforce users import qualified prospect research with enough context for personal follow-up.",
    updatedAt: "2026-04-23",
    readingTime: "Guide",
    primaryKeyword: "Salesforce CSV fields",
    secondaryKeywords: ["Salesforce CSV import", "Salesforce prospect research fields", "Salesforce source CSV"],
    tool: "integration",
    platform: "Salesforce",
    heroBullets: [
      "Use source and description fields to preserve research context.",
      "Store fit score and confidence as custom numeric fields.",
      "Import only prospects that pass your save threshold."
    ],
    sections: [
      {
        title: "Recommended Salesforce fields",
        copy:
          "Salesforce imports should make the source, status, and research reason visible immediately.",
        items: [
          "Company, Website, Industry, Source, Status.",
          "Fit Score, Confidence Score, Top Signal, Outreach Angle.",
          "First Line, Email Draft, Source Notes, Contact Path."
        ]
      },
      {
        title: "Import workflow",
        copy:
          "Use a consistent CSV header, map fields during import, and create custom fields for research scores if Salesforce does not already have them.",
        items: [
          "Set Source to LeadCue or Website Prospecting.",
          "Use Description for the source-backed summary.",
          "Set status before outreach handoff."
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
    related: ["templates/csv-field-mapping", "prospect-qualification", "guides/score-prospect-website"]
  },
  {
    slug: "integrations/pipedrive-csv-export",
    eyebrow: "Integration guide",
    category: "Pipedrive",
    title: "Pipedrive CSV export for source-backed prospect notes",
    seoTitle: "Pipedrive CSV Export for Prospect Research Notes | LeadCue",
    description:
      "Prepare Pipedrive CSV imports for website prospecting research with organization fields, follow-up status, fit score, first line, and notes.",
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
      "Map follow-up status before moving prospects into pipeline."
    ],
    sections: [
      {
        title: "Recommended Pipedrive fields",
        copy:
          "Pipedrive works best when the organization record carries the website context and the note carries the research reason.",
        items: [
          "Organization name, Website, Industry, Follow-up status.",
          "Fit score, Confidence score, Top signal, Contact path.",
          "First line, Short email, Source notes, Export status."
        ]
      },
      {
        title: "Import workflow",
        copy:
          "Import selected saved prospects as organizations or leads, then use notes to preserve source-backed outreach context.",
        items: [
          "Use follow-up status to route your next action.",
          "Use stages to separate researching, qualified, and outreach-ready prospects.",
          "Keep the first line and source notes visible before sending."
        ]
      }
    ],
    faqs: [
      {
        question: "Should Pipedrive imports create deals immediately?",
        answer:
          "Usually no. Create organizations or leads first, then create deals after the prospect shows engagement."
      },
      {
        question: "Where should source notes live in Pipedrive?",
        answer:
          "Use notes or a long custom field so you can verify why the prospect was saved."
      },
      {
        question: "Can Pipedrive use fit score for prioritization?",
        answer:
          "Yes. Store fit score as a custom field and use filters to prioritize high-fit prospects."
      }
    ],
    related: ["templates/csv-field-mapping", "prospect-research-tool-for-solo-professionals", "website-prospecting"]
  }
];

export const productSeoPageMap: Partial<Record<string, ProductSeoPage>> = Object.fromEntries(
  productSeoPages.map((page) => [page.slug, page])
);
