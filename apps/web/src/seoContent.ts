export type SeoContentSection = {
  title: string;
  copy: string;
  items: string[];
};

export type SeoContentFaq = {
  question: string;
  answer: string;
};

export type SeoContentPage = {
  slug: string;
  eyebrow: string;
  category: string;
  title: string;
  seoTitle: string;
  description: string;
  intent: string;
  readingTime: string;
  updatedAt: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  heroBullets: string[];
  sections: SeoContentSection[];
  example: {
    title: string;
    copy: string;
    items: string[];
  };
  faqs: SeoContentFaq[];
  related: string[];
};

export const seoContentPages: SeoContentPage[] = [
  {
    slug: "website-prospecting",
    eyebrow: "Core concept",
    category: "Website prospecting",
    title: "Website prospecting: turn company pages into qualified prospects",
    seoTitle: "Website Prospecting Guide for Solo Professionals | LeadCue",
    description:
      "Learn how website prospecting helps solo professionals qualify prospects, find evidence-backed angles, and write better outreach from public company pages.",
    intent: "Explain the category for individual operators searching for a better way to prospect from websites.",
    readingTime: "7 min read",
    updatedAt: "2026-04-23",
    primaryKeyword: "website prospecting",
    secondaryKeywords: ["AI website prospecting tool", "prospect website research", "website research for cold email"],
    heroBullets: [
      "Start from a real company website instead of a generic contact list.",
      "Score fit with visible evidence: CTAs, proof, positioning, content gaps, and contact paths.",
      "Turn each observation into a first line, outreach angle, and export-ready note."
    ],
    sections: [
      {
        title: "What website prospecting means",
        copy:
          "Website prospecting is the process of qualifying a company by reading the public signals on its site before you write outreach. For solo professionals, the website often contains the useful angle: unclear positioning, weak proof, hidden calls to action, stale content, missing service pages, or conversion gaps.",
        items: [
          "It is useful when your offer improves websites, SEO, conversion, demand generation, or messaging.",
          "It creates a reason to contact the prospect that is visible and source-backed.",
          "It keeps you from saving leads just because a company matches an industry filter."
        ]
      },
      {
        title: "Signals worth capturing",
        copy:
          "The best signals are not trivia. They connect a page observation to a business outcome the prospect already cares about. A weak CTA matters because it can reduce demo intent. A missing case study matters because buyers may need proof before booking.",
        items: [
          "Above-the-fold clarity: headline, offer, CTA, and proof placement.",
          "Trust proof: case studies, testimonials, logos, regulated-industry evidence, and before-after outcomes.",
          "Content freshness: blog activity, service page depth, landing page relevance, and internal linking."
        ]
      },
      {
        title: "How to turn evidence into outreach",
        copy:
          "A good prospecting workflow turns one observation into a compact chain: source, signal, business implication, first line, and suggested next step. That chain is what makes the outreach feel researched instead of generated.",
        items: [
          "Write the first line from a specific page observation.",
          "State the likely business implication without overclaiming.",
          "Offer a small next step, such as sending three ideas, not a full redesign pitch."
        ]
      }
    ],
    example: {
      title: "Example website prospecting note",
      copy:
        "Northstar Analytics explains its reporting product clearly, but the demo CTA and finance proof are not visible until after the first scroll.",
      items: [
        "Signal: Demo CTA appears late on the homepage.",
        "Business angle: High-intent visitors may understand the product without knowing why to act now.",
        "Outreach offer: Send three quick ideas for the hero CTA, proof block, and case-study path."
      ]
    },
    faqs: [
      {
        question: "Is website prospecting the same as website scraping?",
        answer:
          "No. Website prospecting uses visible public website information to qualify a prospect and prepare better outreach. It does not require scraping social networks or buying contact databases."
      },
      {
        question: "Who should use website prospecting?",
        answer:
          "It is strongest for web design freelancers, SEO consultants, growth consultants, CRO specialists, and solo founders because their offers can be tied directly to website observations."
      },
      {
        question: "What should be saved before export?",
        answer:
          "Save the company, website URL, fit score, source-backed signals, first line, contact path, and the reason the prospect is worth outreach."
      }
    ],
    related: ["tools/website-prospect-score-checker", "tools/website-opportunity-finder", "ai-website-prospecting-tool"]
  },
  {
    slug: "ai-website-prospecting-tool",
    eyebrow: "Core concept",
    category: "AI website prospecting",
    title: "AI website prospecting tool: qualify prospects before outreach",
    seoTitle: "AI Website Prospecting Tool for Solo Professionals | LeadCue",
    description:
      "Use AI website prospecting to find opportunity signals, score prospect fit, and prepare source-backed first lines before outreach.",
    intent: "Define the LeadCue method for solo professionals who research prospect websites before outreach.",
    readingTime: "8 min read",
    updatedAt: "2026-05-03",
    primaryKeyword: "AI website prospecting tool",
    secondaryKeywords: ["website research before cold outreach", "website prospecting tool", "source-backed outreach context"],
    heroBullets: [
      "Start with what the prospect's website already proves instead of a generic contact record.",
      "Use opportunity signals and fit scoring to decide whether the prospect deserves outreach.",
      "Turn the research into a Prospect Card that carries context into CSV or email workflows."
    ],
    sections: [
      {
        title: "What AI website prospecting changes",
        copy:
          "Traditional outbound often starts with a list and searches for a contact. AI website prospecting starts with the company website and asks whether there is a credible reason to contact the prospect at all.",
        items: [
          "The first decision is qualification, not email discovery.",
          "The research output is a source-backed reason to contact, not a vague personalization line.",
          "The handoff keeps website evidence, fit score, first line, and export fields together."
        ]
      },
      {
        title: "Workflow matrix",
        copy:
          "The workflow should move from public evidence to prospect judgment to outreach preparation without losing context between tools.",
        items: [
          "Review: inspect homepage, proof, CTA, service pages, content freshness, and contact path.",
          "Qualify: score ICP fit, signal strength, confidence, and outreach readiness.",
          "Prepare: save a Prospect Card with source notes, first line, outreach angle, follow-up status, and export status."
        ]
      },
      {
        title: "When it is the right motion",
        copy:
          "Website prospecting is strongest when your offer can be connected to visible website improvements or missed opportunities.",
        items: [
          "Web design freelancers can use CTA, proof, navigation, and conversion signals.",
          "SEO consultants can use thin pages, stale content, weak internal paths, and missing intent pages.",
          "Growth consultants can use positioning, campaign path, lead magnet, and proof gaps."
        ]
      }
    ],
    example: {
      title: "Website-first research example",
      copy:
        "Instead of saving a SaaS company because it matches an industry filter, you save it because the site has a clear product story, hidden finance proof, and no above-the-fold demo CTA.",
      items: [
        "Signal: proof and CTA are not visible when intent is highest.",
        "Fit: your offer is conversion-focused website improvements.",
        "Output: a Prospect Card with a verifiable first line and export-ready note."
      ]
    },
    faqs: [
      {
        question: "Is AI website prospecting the same as scraping?",
        answer:
          "No. The workflow uses visible public website evidence, human review, and source-backed notes. It is not designed to scrape social platforms or build hidden contact intelligence."
      },
      {
        question: "Who should use AI website prospecting?",
        answer:
          "It is strongest for SEO consultants, web design freelancers, CRO specialists, growth consultants, positioning consultants, and solo founders because their offers can be tied to website evidence."
      },
      {
        question: "What should be produced before outreach starts?",
        answer:
          "A saved Prospect Card should include fit score, opportunity signals, source notes, first line, reason to contact, and export status."
      }
    ],
    related: ["website-prospecting", "tools/prospect-card", "ai-prospect-research-tool"]
  },
  {
    slug: "ai-prospect-research-tool",
    eyebrow: "Product category",
    category: "Research layer",
    title: "AI prospect research tool: the step before cold email",
    seoTitle: "AI Prospect Research Tool for Solo Professionals | LeadCue",
    description:
      "Learn why solo professionals need a prospect research tool that qualifies companies, preserves source evidence, and prepares outreach context before sending cold email.",
    intent: "Position LeadCue as the research layer between prospect lists and outreach execution.",
    readingTime: "8 min read",
    updatedAt: "2026-05-03",
    primaryKeyword: "AI prospect research tool",
    secondaryKeywords: ["outreach research layer", "website prospect research workflow", "qualified outreach workflow"],
    heroBullets: [
      "A spreadsheet stores prospects after they are accepted; a research layer decides whether they should be accepted.",
      "An email tool sends messages; a research layer prepares the source-backed reason to send one.",
      "A website research layer keeps Prospect Cards, fit scores, and opportunity signals together."
    ],
    sections: [
      {
        title: "Where the research layer sits",
        copy:
          "Many solo professionals have contact sources, spreadsheets, and email tools, but no dedicated place to decide whether a website-backed prospect is worth outreach.",
        items: [
          "Before export: qualify the website and avoid adding weak prospects.",
          "Before email: prepare first lines and context that can be verified.",
          "Before follow-up: preserve why the prospect was selected, skipped, or reviewed."
        ]
      },
      {
        title: "Decision table for tool boundaries",
        copy:
          "A focused research layer should not pretend to replace every outbound tool. Its value is to improve the quality of prospects and context handed downstream.",
        items: [
          "Contact database: finds people or emails; research layer explains why the company is worth contacting.",
          "Pipeline tool: manages follow-up status; research layer creates the source-backed context before export.",
          "Email sequencer: sends campaigns; research layer prepares claims, first lines, and notes before sending."
        ]
      },
      {
        title: "Signals the layer should preserve",
        copy:
          "The layer becomes useful when every saved prospect carries enough context for you to understand the decision later without repeating the research.",
        items: [
          "Website evidence: page observation, source path, and buyer implication.",
          "Qualification: ICP fit, confidence, save threshold, and opportunity category.",
          "Handoff: first line, short email context, export fields, status, and follow-up notes."
        ]
      }
    ],
    example: {
      title: "Research layer handoff example",
      copy:
          "You review a website, save a Prospect Card, and export only the qualified prospect with fit score, source notes, first line, and a short outreach angle attached.",
      items: [
        "The exported row receives context, not just a URL.",
        "The email writer can verify the claim before sending.",
        "You can review why the prospect was selected."
      ]
    },
    faqs: [
      {
        question: "Does a website research layer replace an outreach tool?",
        answer:
          "No. It sits before your outreach workflow and prepares qualified, source-backed prospect context for export or handoff."
      },
      {
        question: "Does it replace an email finder?",
        answer:
          "No. Email finders help locate contacts. A website research layer helps explain whether the prospect is worth contacting and what the outreach should reference."
      },
      {
        question: "What makes the layer useful for solo professionals?",
        answer:
          "Solo professionals can connect their offer to visible website opportunities, then save that evidence as a reusable Prospect Card."
      }
    ],
    related: ["ai-website-prospecting-tool", "website-prospecting", "tools/prospecting-dashboard"]
  },
  {
    slug: "guides/website-opportunity-signals",
    eyebrow: "Signal guide",
    category: "Opportunity signals",
    title: "Website opportunity signals solo professionals can use before outreach",
    seoTitle: "Website Opportunity Signals for Solo Outreach | LeadCue",
    description:
      "Use website opportunity signals to spot CTA, proof, SEO, content, positioning, and timing cues that can support source-backed personal outreach.",
    intent: "Give solo professionals a signal taxonomy for turning website observations into outreach reasons.",
    readingTime: "9 min read",
    updatedAt: "2026-05-03",
    primaryKeyword: "website opportunity signals",
    secondaryKeywords: ["opportunity signals for outreach", "website sales signals", "website prospecting signals"],
    heroBullets: [
      "Opportunity signals connect a visible page observation to a business-relevant outreach angle.",
      "The best signals are specific enough for a buyer to verify and relevant enough for your offer.",
      "Weak signals should trigger review or skip decisions instead of automatic export."
    ],
    sections: [
      {
        title: "Signal taxonomy",
        copy:
          "A useful taxonomy keeps you from treating subjective design opinions as sales evidence. Each signal should map to a buyer outcome and your offer.",
        items: [
          "Conversion signals: hidden CTA, unclear next step, confusing navigation, weak contact path.",
          "Trust signals: missing case studies, buried proof, no results, weak testimonials, unclear customer segments.",
          "Content signals: stale blog, thin service pages, missing use cases, weak internal linking, outdated resources."
        ]
      },
      {
        title: "How to score signal strength",
        copy:
          "Signal strength depends on visibility, relevance, and confidence. A visible issue that matches your offer is stronger than a broad guess about the business.",
        items: [
          "Strong: the source is visible, the implication is clear, and the offer can help.",
          "Medium: the pattern is plausible but needs another source or manual review.",
          "Weak: the note is subjective, generic, or disconnected from your offer."
        ]
      },
      {
        title: "Turn signals into outreach context",
        copy:
          "Signals become useful when they are converted into a reason to contact, a first line, and a Prospect Card note you can verify later.",
        items: [
          "Observation: what the page shows and where it appears.",
          "Implication: why it may affect conversion, trust, discovery, or buyer confidence.",
          "Next step: a low-pressure suggestion such as sending three ideas or a short teardown."
        ]
      }
    ],
    example: {
      title: "Opportunity signal example",
      copy:
        "The product page is clear, but the strongest customer proof appears below the main CTA and the navigation does not surface industry-specific examples.",
      items: [
        "Category: trust proof and conversion path.",
        "Reason to contact: buyers may need proof earlier before booking.",
        "First line: mention the proof placement and offer a small set of ideas."
      ]
    },
    faqs: [
      {
        question: "How many opportunity signals should a prospect need?",
        answer:
          "One strong signal can be enough for a first touch. Two or three source-backed signals make qualification more reliable."
      },
      {
        question: "Are opportunity signals the same as a full audit?",
        answer:
          "No. They are lightweight sales research cues used before outreach. A full audit can happen after the prospect engages."
      },
      {
        question: "What should happen when the signal is weak?",
        answer:
          "Do not export the prospect automatically. Mark it for review, scan another page, or skip until a stronger reason to contact appears."
      }
    ],
    related: ["tools/website-opportunity-finder", "guides/find-a-reason-to-contact-prospects", "tools/prospect-card"]
  },
  {
    slug: "guides/find-a-reason-to-contact-prospects",
    eyebrow: "Outbound guide",
    category: "Reason to contact",
    title: "How to find a reason to contact a prospect from their website",
    seoTitle: "Find a Reason to Contact Prospects from Website Evidence | LeadCue",
    description:
      "Find a credible reason to contact a prospect by reviewing website signals, qualifying fit, and turning source evidence into a useful first line.",
    intent: "Help solo operators solve the core problem of why this prospect should be contacted now.",
    readingTime: "8 min read",
    updatedAt: "2026-05-03",
    primaryKeyword: "reason to contact prospects",
    secondaryKeywords: ["reason to reach out", "website-based outreach reason", "source-backed cold outreach"],
    heroBullets: [
      "A good reason to contact is specific, visible, relevant to the offer, and easy to verify.",
      "The website should provide evidence, not just a name to personalize around.",
      "If there is no credible reason, the prospect should be skipped or reviewed instead of exported."
    ],
    sections: [
      {
        title: "A simple qualification order",
        copy:
          "Start with prospect fit, then inspect the website for evidence, then decide whether the observation supports a useful first touch.",
        items: [
          "Fit: does the company match your ICP, offer, and target market?",
          "Evidence: does the website show a specific opportunity signal or gap?",
          "Message: can the observation become a first line and next step without overclaiming?"
        ]
      },
      {
        title: "Reason-to-contact checklist",
        copy:
          "Before saving the prospect, you should be able to answer five questions that make the outreach defensible.",
        items: [
          "What did we see on the website, and where did we see it?",
          "Why might it matter to the buyer?",
          "Why is your offer relevant to that observation?"
        ]
      },
      {
        title: "Bad reasons to avoid",
        copy:
          "Weak reasons make outreach feel automated even when a first line is technically personalized. The problem is not word choice; it is lack of relevance.",
        items: [
          "Vague compliments such as liking the website without a specific observation.",
          "Unverified claims about performance, rankings, revenue, or conversion impact.",
          "Signals that do not connect to your offer or buyer outcome."
        ]
      }
    ],
    example: {
      title: "Reason to contact example",
      copy:
        "The website targets finance buyers, but the homepage does not surface finance proof or a clear demo CTA above the first scroll.",
      items: [
        "Observation: proof and CTA placement are visible website details.",
        "Implication: high-intent visitors may not see enough trust before acting.",
        "Next step: offer three hero and proof-section ideas."
      ]
    },
    faqs: [
      {
        question: "What if a website has no obvious issue?",
        answer:
          "Do not force a reason. Scan another important page, review a different offer angle, or skip the prospect until stronger evidence appears."
      },
      {
        question: "Should the first email include every reason?",
        answer:
          "No. Usually one strong reason is enough. Too many observations can make a first touch feel like an unsolicited audit."
      },
      {
        question: "Can a reason to contact be positive?",
        answer:
          "Yes, if it is specific and relevant. The reason can be an opportunity to build on a strength, not only a problem to fix."
      }
    ],
    related: ["tools/website-opportunity-finder", "guides/website-opportunity-signals", "cold-email-first-lines"]
  },
  {
    slug: "guides/source-backed-prospect-notes",
    eyebrow: "Research quality",
    category: "Source-backed notes",
    title: "Source-backed prospect notes for safer personal outreach",
    seoTitle: "Source-Backed Prospect Notes for Personal Outreach | LeadCue",
    description:
      "Create source-backed prospect notes that keep website evidence, uncertainty, first lines, and export context attached to each saved prospect.",
    intent: "Show solo professionals how to preserve evidence so outreach copy can be reviewed before sending.",
    readingTime: "7 min read",
    updatedAt: "2026-05-03",
    primaryKeyword: "source-backed prospect notes",
    secondaryKeywords: ["source-backed notes", "website evidence notes", "outreach context notes"],
    heroBullets: [
      "Source-backed notes help you verify claims before they appear in outreach.",
      "They reduce generic personalization by tying each first line to a visible page observation.",
      "They make export safer because context travels with the prospect."
    ],
    sections: [
      {
        title: "What source-backed means",
        copy:
          "A source-backed note states what was observed, where it was observed, why it may matter, and how confident you should be before using it in outreach.",
        items: [
          "Source: page type, URL path, section, or visible website area.",
          "Observation: the exact cue, not a broad interpretation.",
          "Confidence: whether the evidence is strong, incomplete, or needs manual review."
        ]
      },
      {
        title: "Note structure",
        copy:
          "The best notes are compact enough for export but complete enough that you can understand and verify the outreach angle later.",
        items: [
          "Observed cue: demo CTA appears below the first scroll.",
          "Possible implication: visitors may need a clearer next step when intent is highest.",
          "Outbound use: ask permission to send three hero CTA and proof-section ideas."
        ]
      },
      {
        title: "Review before sending",
        copy:
          "Source-backed notes should improve judgment, not remove it. Review the source and remove any claim that cannot be supported.",
        items: [
          "Avoid revenue, ranking, or conversion claims without evidence.",
          "Keep uncertainty visible when a signal is incomplete.",
          "Use the note as context, not as a final message that must be sent unchanged."
        ]
      }
    ],
    example: {
      title: "Source-backed note example",
      copy:
        "Homepage review: the product story is clear, but the finance proof and demo CTA appear after the first scroll. Possible angle: make buyer trust and next step visible earlier.",
      items: [
        "Specific source: homepage first viewport.",
        "Clear implication: proof and next step visibility.",
        "Safe use: offer ideas without claiming confirmed conversion loss."
      ]
    },
    faqs: [
      {
        question: "Should source notes be exported?",
        answer:
          "Yes. Put short source notes in export fields or notes so you can verify why the prospect was selected."
      },
      {
        question: "Can AI-generated notes be used directly?",
        answer:
          "They should be reviewed first. The note must match visible evidence before it becomes outreach copy."
      },
      {
        question: "How long should a source-backed note be?",
        answer:
          "Long enough to preserve the observation, implication, and source, but short enough to scan during outreach review."
      }
    ],
    related: ["tools/prospect-card", "tools/prospecting-dashboard", "cold-email-first-lines"]
  },
  {
    slug: "guides/icp-fit-score-for-solo-prospecting",
    eyebrow: "Scoring guide",
    category: "Fit scoring",
    title: "ICP fit score for solo website prospecting",
    seoTitle: "ICP Fit Score for Solo Website Prospecting | LeadCue",
    description:
      "Build an ICP fit score that combines prospect fit, website opportunity signals, evidence confidence, and export readiness before personal outreach.",
    intent: "Help solo professionals separate prospect fit from signal confidence and outreach readiness.",
    readingTime: "8 min read",
    updatedAt: "2026-05-03",
    primaryKeyword: "ICP fit score",
    secondaryKeywords: ["prospect fit score", "lead qualification score", "qualified prospect score"],
    heroBullets: [
      "Fit score answers whether the company matches your offer.",
      "Confidence score answers whether the website evidence is strong enough to use.",
      "Export readiness answers whether the prospect can move downstream without rework."
    ],
    sections: [
      {
        title: "Fit score model",
        copy:
          "A practical score should combine the prospect profile with website evidence and handoff readiness instead of treating all signals as equal.",
        items: [
          "40 points: ICP match across industry, region, company type, size, and service fit.",
          "35 points: opportunity signal quality, source specificity, and buyer implication.",
          "25 points: confidence, contact path, first-line readiness, follow-up status, and export fields."
        ]
      },
      {
        title: "Decision thresholds",
        copy:
          "Thresholds help you avoid exporting weak prospects while still preserving companies that deserve manual review.",
        items: [
          "80-100: save and prioritize for outreach after source review.",
          "65-79: review manually or scan another page before export.",
          "Below 65: skip, archive, or revisit when the ICP or offer changes."
        ]
      },
      {
        title: "Common scoring mistakes",
        copy:
          "A high fit score is only useful when the evidence is strong enough to support a real outreach reason.",
        items: [
          "Giving high scores to prospects that match the industry but have no visible reason to contact.",
          "Mixing prospect fit with confidence so weak evidence looks stronger than it is.",
          "Exporting prospects before first line, source notes, and export fields are complete."
        ]
      }
    ],
    example: {
      title: "Fit score example",
      copy:
        "A B2B SaaS company matches your ICP, shows a hidden demo CTA and missing proof path, and has enough source evidence for a first line.",
      items: [
        "ICP fit: 36/40.",
        "Signal quality: 28/35.",
        "Readiness: 21/25. Total: 85, save after review."
      ]
    },
    faqs: [
      {
        question: "Is fit score the same as confidence score?",
        answer:
          "No. Fit score measures prospect relevance. Confidence measures whether the available website evidence is strong enough to trust."
      },
      {
        question: "What score should qualify a lead?",
        answer:
          "Start with 80 for high-priority outreach, then adjust based on reply quality, booked meetings, and manual QA results."
      },
      {
        question: "Should low-score leads be deleted?",
        answer:
          "Not necessarily. Keep them out of outreach, but use their notes to improve ICP rules or review later."
      }
    ],
    related: ["tools/website-prospect-score-checker", "prospect-qualification", "guides/score-prospect-website"]
  },
  {
    slug: "prospect-research-tool-for-solo-professionals",
    eyebrow: "Buying guide",
    category: "Prospecting software",
    title: "How to choose a prospect research tool for solo professionals",
    seoTitle: "Prospect Research Tool for Solo Professionals | LeadCue",
    description:
      "A practical buying guide for solo professionals comparing prospect research tools, fit scoring workflows, source-backed notes, and CSV export paths.",
    intent: "Help buyers evaluate prospect research software for a personal workflow.",
    readingTime: "8 min read",
    updatedAt: "2026-04-23",
    primaryKeyword: "prospect research tool for solo professionals",
    secondaryKeywords: ["AI prospect research tool", "lead research tool", "outbound research workflow"],
    heroBullets: [
      "A research tool should improve lead quality, not just increase lead volume.",
      "The output should explain why a prospect is worth contacting.",
      "Exports should carry source notes into the tools you already use."
    ],
    sections: [
      {
        title: "The job the tool should do",
        copy:
          "A prospect research tool should help you decide whether a company deserves outreach. That means it needs to combine ICP fit, website evidence, outreach angle, and handoff fields instead of only collecting company names.",
        items: [
          "Qualify prospects before they enter outreach.",
          "Show the source behind each sales cue.",
          "Create copy that references a real page observation."
        ]
      },
      {
        title: "Features that matter",
        copy:
          "The most useful features sit between research and outreach. They help the operator move from a website scan to a saved prospect card, then to a CSV row without losing context.",
        items: [
          "Fit score and confidence score for prioritization.",
          "Website cues grouped by web design, SEO, marketing, and timing.",
          "Export fields that map to a spreadsheet, email workflow, or custom template."
        ]
      },
      {
        title: "Tool evaluation matrix",
        copy:
          "When comparing prospect research tools, separate contact discovery from website-backed qualification so you do not buy a list tool for a research-quality problem.",
        items: [
          "Contact discovery: useful when the bottleneck is finding people or emails.",
          "Website research layer: useful when the bottleneck is deciding why the prospect is worth contacting.",
          "Outbound handoff: useful when you need first lines, source notes, fit score, and export-ready fields together."
        ]
      },
      {
        title: "Red flags when comparing tools",
        copy:
          "Avoid tools that create the illusion of volume while hiding why the prospect matters. If every output looks generic, you will still spend time rewriting notes and guessing at relevance.",
        items: [
          "No visible source notes or page references.",
          "No distinction between fit score and data confidence.",
          "No practical handoff into sheets or outreach tools."
        ]
      }
    ],
    example: {
      title: "Evaluation checklist",
      copy:
        "Before adopting a prospect research tool, run five real websites through it and compare whether the output helps you decide who to contact first.",
      items: [
        "Can the tool explain why the prospect fits your ICP?",
        "Can you copy a credible first line without editing from scratch?",
        "Can exported fields preserve the evidence behind the outreach angle?"
      ]
    },
    faqs: [
      {
        question: "Should I use a lead database or a research tool?",
        answer:
          "Use a database when you only need contact discovery. Use a research tool when the bottleneck is knowing which prospects deserve outreach and what to say."
      },
      {
        question: "How many fields should a prospect card include?",
        answer:
          "Enough to preserve context: company, URL, fit score, confidence, signals, first line, contact path, source notes, status, and export status."
      },
      {
        question: "Does AI-generated research need human review?",
        answer:
          "Yes. AI should reduce research time, but you should review source notes before sending outreach or saving a prospect as qualified."
      }
    ],
    related: ["ai-prospect-research-tool", "tools/prospect-card", "prospect-qualification"]
  },
  {
    slug: "cold-email-first-lines",
    eyebrow: "Outbound copy",
    category: "Cold email",
    title: "Cold email first lines that come from real website evidence",
    seoTitle: "Cold Email First Lines from Website Evidence | LeadCue",
    description:
      "Learn how to write personalized cold email first lines from website observations, avoid generic openers, and connect each line to a credible business angle.",
    intent: "Teach solo operators how to create first lines that feel researched.",
    readingTime: "7 min read",
    updatedAt: "2026-04-23",
    primaryKeyword: "cold email first lines",
    secondaryKeywords: ["personalized cold email opener", "cold email first line generator", "website-based outreach"],
    heroBullets: [
      "Good first lines are specific, visible, and relevant to the offer.",
      "The line should create context, not pretend familiarity.",
      "The next sentence should connect the observation to a useful business outcome."
    ],
    sections: [
      {
        title: "What makes a first line work",
        copy:
          "A strong first line proves that the sender looked at the company and noticed something relevant. It should be short enough to scan, specific enough to be credible, and connected to the reason for the email.",
        items: [
          "Reference a visible website detail rather than a vague compliment.",
          "Avoid fake praise such as 'loved your website' without evidence.",
          "Use the first line to set up the problem or opportunity your offer addresses."
        ]
      },
      {
        title: "Use website evidence, not personalization theater",
        copy:
          "Many first lines fail because they mention a podcast, LinkedIn post, or award that has nothing to do with the offer. Website evidence works better for solo outreach because it points directly to marketing, design, SEO, or conversion opportunities.",
        items: [
          "CTA placement can support a conversion angle.",
          "Inactive content can support an SEO or demand generation angle.",
          "Missing proof can support a messaging or redesign angle."
        ]
      },
      {
        title: "A simple formula",
        copy:
          "Use this pattern: 'I noticed [specific website observation], which may affect [buyer outcome].' Then offer a small next step that reduces friction for the recipient.",
        items: [
          "Observation: what you saw and where you saw it.",
          "Implication: why it may matter to the prospect.",
          "Offer: a low-pressure next step, such as sending ideas or a short teardown."
        ]
      },
      {
        title: "Before and after first-line library",
        copy:
          "First lines should improve when the source note becomes more specific. Use examples to separate credible website evidence from generic personalization.",
        items: [
          "Weak: I loved your website. Stronger: I noticed the demo CTA appears after the first scroll.",
          "Weak: Your blog looks interesting. Stronger: I saw the resources section has not published a buyer guide recently.",
          "Weak: You have a great product. Stronger: The product story is clear, but finance proof is not visible near the main CTA."
        ]
      }
    ],
    example: {
      title: "Before and after",
      copy:
        "Weak: 'I loved your website.' Stronger: 'I noticed the product story is clear, but the demo CTA and finance proof show up after the first scroll.'",
      items: [
        "The stronger line is specific.",
        "It names the business context.",
        "It gives the next sentence a natural reason to exist."
      ]
    },
    faqs: [
      {
        question: "Should every cold email include a first line?",
        answer:
          "If the prospect is worth personalized outreach, yes. If you cannot find a relevant observation, the prospect may not be ready for a high-effort touch."
      },
      {
        question: "Can AI write first lines?",
        answer:
          "AI can draft first lines quickly, but the best outputs still need source notes so the rep can verify that the observation is real."
      },
      {
        question: "How long should a first line be?",
        answer:
          "Long enough to be specific, short enough to read on mobile. There is no SEO or email performance magic in a fixed word count."
      }
    ],
    related: ["guides/source-backed-prospect-notes", "guides/find-a-reason-to-contact-prospects", "tools/prospect-card"]
  },
  {
    slug: "prospect-qualification",
    eyebrow: "Qualification",
    category: "Lead qualification",
    title: "Prospect qualification: score fit before saving another prospect",
    seoTitle: "Prospect Qualification Workflow | Fit Score and Website Signals",
    description:
      "Build a personal prospect qualification workflow that uses fit score, confidence, website signals, contact paths, and source-backed notes before outreach.",
    intent: "Help solo professionals define what makes a prospect worth saving and exporting.",
    readingTime: "8 min read",
    updatedAt: "2026-04-23",
    primaryKeyword: "prospect qualification",
    secondaryKeywords: ["lead qualification score", "fit score", "qualified prospect workflow"],
    heroBullets: [
      "Qualification should happen before a prospect enters personal outreach.",
      "A saved prospect needs both ICP fit and a reason to reach out.",
      "Confidence matters because thin page data can make a signal weaker."
    ],
    sections: [
      {
        title: "Separate fit from evidence quality",
        copy:
          "Fit score answers whether the company matches your offer. Confidence answers whether the available website evidence is strong enough to trust the recommendation. Both are needed before you save the prospect.",
        items: [
          "Fit includes industry, company type, service need, and offer relevance.",
          "Confidence includes page depth, source clarity, and signal specificity.",
          "A high-fit prospect with weak evidence may need manual review before outreach."
        ]
      },
      {
        title: "Define your save threshold",
        copy:
          "Set a clear threshold for when a prospect is worth saving. Without one, it is easy to keep too many companies that have no usable outreach angle.",
        items: [
          "Save when fit score is strong and at least two website cues support the angle.",
          "Review when fit is strong but confidence is medium.",
          "Skip when the only available notes are generic or unrelated to your offer."
        ]
      },
      {
        title: "Qualification matrix",
        copy:
          "A clear matrix keeps high-fit prospects with weak evidence out of outreach while preserving companies that deserve manual review.",
        items: [
          "High fit and high confidence: save as a Prospect Card and prioritize outreach.",
          "High fit and low confidence: review another page before export.",
          "Low fit and strong signal: archive the note unless your offer or ICP changes."
        ]
      },
      {
        title: "Carry qualification into export",
        copy:
          "The qualification context should not disappear when a prospect leaves the research tool. Export fields should include fit score, signal summary, first line, source notes, follow-up status, and saved/exported status.",
        items: [
          "Use status fields to prevent duplicate work.",
          "Keep source notes in exports or your own notes for review.",
          "Export only saved prospects when building outreach lists."
        ]
      }
    ],
    example: {
      title: "A practical save rule",
      copy:
        "Save a prospect when it matches the ICP, has at least two source-backed website cues, and has a first line you would be comfortable sending.",
      items: [
        "Fit score: 80 or higher.",
        "Confidence: 70% or higher.",
        "Status: saved, reviewed, and ready for CSV export."
      ]
    },
    faqs: [
      {
        question: "What is a good fit score threshold?",
        answer:
          "Start with 80 for high-priority outreach, then adjust based on reply quality and booked meetings rather than scan volume alone."
      },
      {
        question: "Should weak-fit prospects be deleted?",
        answer:
          "Not always. Keep them out of immediate outreach, but use notes to understand whether the ICP or scoring rules need refinement."
      },
      {
        question: "How should solo professionals review qualification quality?",
        answer:
          "Review saved prospects weekly by fit score, confidence, reply quality, and whether the first line matched a real source note."
      }
    ],
    related: ["guides/icp-fit-score-for-solo-prospecting", "tools/prospect-card", "guides/website-opportunity-signals"]
  },
  {
    slug: "use-cases/web-design-freelancers",
    eyebrow: "Use case",
    category: "Web design freelancers",
    title: "Website prospecting for web design freelancers",
    seoTitle: "Website Prospecting for Web Design Freelancers | LeadCue",
    description:
      "How web design freelancers can find redesign-ready prospects by spotting weak CTAs, buried proof, confusing navigation, and conversion gaps.",
    intent: "Show web design freelancers how LeadCue supports redesign and conversion outreach.",
    readingTime: "6 min read",
    updatedAt: "2026-04-23",
    primaryKeyword: "find web design leads",
    secondaryKeywords: ["prospecting tool for freelancers", "find businesses that need website redesign", "website audit outreach"],
    heroBullets: [
      "Find redesign reasons that are visible on the prospect site.",
      "Prioritize prospects with conversion and proof gaps.",
      "Write outreach around a specific improvement, not a generic redesign pitch."
    ],
    sections: [
      {
        title: "Best signals for web design offers",
        copy:
          "A web design freelancer needs signals that point to conversion, clarity, credibility, or user experience. The strongest signals are easy for the prospect to verify because they are visible on the page.",
        items: [
          "Primary CTA is hidden, vague, or inconsistent across the site.",
          "Proof is buried below product explanations or missing from key pages.",
          "Navigation makes it hard for buyers to find services, pricing, demos, or case studies."
        ]
      },
      {
        title: "How to package the outreach",
        copy:
          "Do not lead with 'your website needs a redesign.' Lead with a helpful observation and a small set of ideas. That gives the buyer value before asking for a meeting.",
        items: [
          "Use a first line based on the page observation.",
          "Offer three conversion ideas or a short homepage teardown.",
          "Mention the specific page section you reviewed."
        ]
      },
      {
        title: "What to save for yourself",
        copy:
          "Every saved prospect should help you understand the redesign angle quickly when you come back later. A Prospect Card should include the signal, the source, and the likely business impact.",
        items: [
          "Fit score and confidence.",
          "Top web design cues.",
          "Recommended first line and source-backed note."
        ]
      }
    ],
    example: {
      title: "Redesign outreach angle",
      copy:
        "The homepage explains the product, but the strongest proof and demo CTA show up after the first scroll.",
      items: [
        "Angle: Improve above-the-fold conversion.",
        "Offer: Send a quick hero and proof-section teardown.",
        "CTA: Ask whether they want the three ideas."
      ]
    },
    faqs: [
      {
        question: "What makes a company redesign-ready?",
        answer:
          "Look for a strong business that has visible friction on its website: unclear CTA, weak proof, outdated layout, confusing navigation, or low-conviction messaging."
      },
      {
        question: "Should redesign outreach mention competitors?",
        answer:
          "Only if it is useful and accurate. A direct observation from the prospect's own website is usually safer and more relevant."
      },
      {
        question: "Can LeadCue replace a full website audit?",
        answer:
          "No. It helps identify and package initial sales angles. A full audit can come later after the prospect engages."
      }
    ],
    related: ["tools/website-opportunity-finder", "guides/website-audit-outreach", "cold-email-first-lines"]
  },
  {
    slug: "use-cases/seo-consultants",
    eyebrow: "Use case",
    category: "SEO consultants",
    title: "Prospect research for SEO consultants using visible website gaps",
    seoTitle: "Prospect Research for SEO Consultants | Website Gaps and Outreach",
    description:
      "How SEO consultants can use website prospecting to find thin pages, stale content, weak metadata, and source-backed reasons to start outreach.",
    intent: "Help SEO consultants use website evidence to prioritize and personalize outbound.",
    readingTime: "6 min read",
    updatedAt: "2026-04-23",
    primaryKeyword: "prospecting tool for consultants",
    secondaryKeywords: ["SEO consultant prospecting", "SEO lead qualification", "website content gaps"],
    heroBullets: [
      "Use visible SEO and content gaps to qualify prospects.",
      "Avoid generic 'we can improve your rankings' outreach.",
      "Export source notes so your outreach keeps the exact angle."
    ],
    sections: [
      {
        title: "SEO signals that support outreach",
        copy:
          "SEO consultants should focus on signals that a business leader can understand without a technical audit. Public pages often show enough evidence to open a useful conversation.",
        items: [
          "Thin or outdated service pages.",
          "Inactive blog or resource hub.",
          "Missing location, industry, comparison, or use-case pages."
        ]
      },
      {
        title: "How to make the angle credible",
        copy:
          "A credible SEO outreach angle starts with what you saw and why it could matter. Avoid promising rankings in the opener. Offer a concrete next step such as a short content gap review.",
        items: [
          "Name the page or section you reviewed.",
          "Connect the gap to buyer discovery, trust, or conversion.",
          "Offer to send a few page ideas or keyword themes."
        ]
      },
      {
        title: "What to export",
        copy:
          "SEO prospect notes should be reusable when you write outreach or follow up. Keep the page source, category, and recommended first line together.",
        items: [
          "Primary website gap.",
          "Recommended content angle.",
          "Source URL and qualification confidence."
        ]
      }
    ],
    example: {
      title: "SEO outreach angle",
      copy:
        "The blog appears inactive and the main navigation does not surface use-case or comparison content for finance buyers.",
      items: [
        "Angle: Content depth for buyer research.",
        "Offer: Send three page ideas tied to high-intent searches.",
        "CTA: Ask if they want the short list."
      ]
    },
    faqs: [
      {
        question: "Should SEO prospecting require a full crawl?",
        answer:
          "Not for the first touch. A light website scan can find enough evidence to decide whether the prospect is worth deeper review."
      },
      {
        question: "What SEO signals are too technical for cold outreach?",
        answer:
          "Avoid leading with obscure technical details unless the buyer is technical. Start with visible business impact such as thin service pages or stale content."
      },
      {
        question: "How can SEO consultants avoid generic first lines?",
        answer:
          "Tie the first line to a specific page gap, content absence, or buyer journey issue rather than a broad claim about rankings."
      }
    ],
    related: ["tools/website-prospect-score-checker", "guides/score-prospect-website", "website-prospecting"]
  },
  {
    slug: "use-cases/marketing-consultants",
    eyebrow: "Use case",
    category: "Marketing consultants",
    title: "Website prospecting for marketing consultants and solo founders",
    seoTitle: "Website Prospecting for Marketing Consultants | Growth Outreach",
    description:
      "Use website prospecting to find unclear positioning, weak campaign paths, missing proof, and lead-generation opportunities for personal outreach.",
    intent: "Show marketing consultants and solo founders how to build evidence-backed outreach from company websites.",
    readingTime: "6 min read",
    updatedAt: "2026-04-23",
    primaryKeyword: "prospecting tool for consultants",
    secondaryKeywords: ["marketing consultant prospecting", "growth prospecting", "campaign angle research"],
    heroBullets: [
      "Find campaign angles before a company enters outreach.",
      "Use positioning and proof gaps to write useful first touches.",
      "Save notes that explain why the prospect is a fit."
    ],
    sections: [
      {
        title: "Signals for marketing offers",
        copy:
          "Marketing consultants need signals that reveal demand generation, conversion, or messaging opportunities. The public website often shows whether a company is ready for better campaigns.",
        items: [
          "Unclear positioning or vague value proposition.",
          "No lead magnet, demo path, webinar, guide, or conversion offer.",
          "Proof and customer outcomes are missing from key buyer pages."
        ]
      },
      {
        title: "Turn gaps into a useful offer",
        copy:
          "The best marketing outreach does not simply say 'we can get you leads.' It points to a visible friction point and offers a small asset or campaign idea the prospect can evaluate.",
        items: [
          "Offer a landing page angle for a specific segment.",
          "Suggest a proof section or lead magnet tied to buyer intent.",
          "Send a short teardown instead of asking for a discovery call immediately."
        ]
      },
      {
        title: "Build a repeatable research motion",
        copy:
          "Solo operators can review more prospects when each saved Prospect Card uses the same fields. Consistency makes it easier to compare opportunities and improve outreach quality.",
        items: [
          "Score fit against your ICP.",
          "Classify signals as positioning, proof, campaign, or conversion.",
          "Export only prospects with a concrete opening angle."
        ]
      }
    ],
    example: {
      title: "Growth outreach angle",
      copy:
        "The website explains the product, but there is no obvious buyer guide, lead magnet, or case-study path for visitors who are not ready to book a demo.",
      items: [
        "Angle: Capture mid-funnel demand.",
        "Offer: Send two lead magnet concepts and a page path.",
        "CTA: Ask whether they want the quick ideas."
      ]
    },
    faqs: [
      {
        question: "What makes website prospecting useful for growth consultants?",
        answer:
          "It turns visible page gaps into campaign ideas, which makes outreach more relevant than a generic promise of more leads."
      },
      {
        question: "Should marketing consultants focus on fit or urgency?",
        answer:
          "Both. Fit tells you the company matches your offer. Website signals help explain why the timing may be right."
      },
      {
        question: "What should be included in a marketing prospect card?",
        answer:
          "Include fit score, campaign angle, proof gap, first line, source notes, and the recommended next step."
      }
    ],
    related: ["cold-email-first-lines", "prospect-qualification", "website-prospecting"]
  },
  {
    slug: "guides/turn-website-into-cold-email-angle",
    eyebrow: "Guide",
    category: "Outbound playbook",
    title: "How to turn a prospect website into a cold email angle",
    seoTitle: "Turn a Prospect Website into a Cold Email Angle | LeadCue Guide",
    description:
      "A step-by-step guide for turning visible website evidence into a cold email angle, first line, and low-pressure CTA.",
    intent: "Give operators a repeatable workflow for building outreach angles from websites.",
    readingTime: "9 min read",
    updatedAt: "2026-04-23",
    primaryKeyword: "cold email angle from website",
    secondaryKeywords: ["website outreach angle", "cold email personalization", "prospect research workflow"],
    heroBullets: [
      "Scan the website for one concrete business-relevant observation.",
      "Connect the observation to a likely buyer outcome.",
      "Offer a small next step that makes replying easy."
    ],
    sections: [
      {
        title: "Step 1: Choose the right page",
        copy:
          "Start with the homepage, pricing page, product page, services page, or main navigation. These pages usually reveal the strongest business signals without needing a full audit.",
        items: [
          "Review headline, CTA, proof, navigation, and conversion path.",
          "Look for buyer friction, not minor design preferences.",
          "Capture the source so the note can be checked later."
        ]
      },
      {
        title: "Step 2: Translate the observation",
        copy:
          "A website observation becomes an outreach angle when it explains a possible business effect. The goal is not to diagnose everything; it is to create a credible reason to start a conversation.",
        items: [
          "Observation: the demo CTA is below the first scroll.",
          "Possible effect: high-intent visitors may not act while attention is highest.",
          "Offer: send three hero section ideas."
        ]
      },
      {
        title: "Step 3: Write the email",
        copy:
          "Keep the email compact. Use the first line to prove relevance, the second sentence to explain the opportunity, and the CTA to ask permission to send ideas.",
        items: [
          "Do not overstate certainty from a light scan.",
          "Do not pitch every service in the first touch.",
          "Make the reply easy: 'Want me to send them over?'"
        ]
      }
    ],
    example: {
      title: "Cold email angle example",
      copy:
        "I noticed the product story is clear, but finance buyer proof and the demo CTA show up after the first scroll. That can cost booked demos from visitors who already understand the product.",
      items: [
        "First line: specific and verifiable.",
        "Opportunity: tied to booked demos.",
        "CTA: send three quick fixes."
      ]
    },
    faqs: [
      {
        question: "How many website signals should one email mention?",
        answer:
          "Usually one strong signal is enough. Mentioning too many signals can make the email feel like an audit dump."
      },
      {
        question: "Should the CTA ask for a meeting?",
        answer:
          "For cold first touches, a lighter CTA often works better. Offer to send ideas, a teardown, or examples before asking for a meeting."
      },
      {
        question: "What if the website has no obvious issue?",
        answer:
          "Do not force it. Either scan another page, save the prospect for later review, or skip it until you have a stronger reason to reach out."
      }
    ],
    related: ["tools/website-opportunity-finder", "cold-email-first-lines", "guides/website-audit-outreach"]
  },
  {
    slug: "guides/score-prospect-website",
    eyebrow: "Guide",
    category: "Qualification",
    title: "How to score a prospect website before adding it to outreach",
    seoTitle: "How to Score a Prospect Website for Outreach | LeadCue Guide",
    description:
      "Use this practical scoring framework to qualify prospect websites by ICP fit, website cues, confidence, contact paths, and outreach readiness.",
    intent: "Give solo operators a scoring method they can use before saving and exporting prospects.",
    readingTime: "8 min read",
    updatedAt: "2026-04-23",
    primaryKeyword: "score prospect website",
    secondaryKeywords: ["prospect fit score", "lead qualification score", "website sales signals"],
    heroBullets: [
      "Fit score tells you whether the prospect matches your offer.",
      "Signal quality tells you whether the outreach reason is strong.",
      "Export readiness tells you whether the prospect is ready for the next step."
    ],
    sections: [
      {
        title: "Score ICP fit first",
        copy:
          "Start with the company itself. If it does not match your offer focus, even a clear website gap may not be worth pursuing.",
        items: [
          "Industry and market fit.",
          "Company size or complexity fit.",
          "Offer relevance for web design, SEO, marketing, or growth services."
        ]
      },
      {
        title: "Score the website cues",
        copy:
          "Website cues should be specific enough to support a first line and meaningful enough to imply a business opportunity. Weak cues are generic, subjective, or unrelated to your offer.",
        items: [
          "Strong cue: demo CTA is not visible above the fold.",
          "Medium cue: blog appears inactive but the source date is unclear.",
          "Weak cue: website could look more modern."
        ]
      },
      {
        title: "Weighted scoring matrix",
        copy:
          "A weighted model gives you the same decision language each time and makes it easier to tune the workflow after outreach runs.",
        items: [
          "ICP fit: 40 points for industry, region, company type, size, and service fit.",
          "Opportunity signal: 35 points for source specificity, business implication, and offer relevance.",
          "Readiness: 25 points for confidence, contact path, first line, follow-up status, and export fields."
        ]
      },
      {
        title: "Score export readiness",
        copy:
          "A prospect is not ready just because it has a high score. The handoff fields need to be complete enough for you to use without redoing the research.",
        items: [
          "First line is copy-ready.",
          "Source notes are attached.",
          "Follow-up status and export fields are set."
        ]
      }
    ],
    example: {
      title: "Simple scoring model",
      copy:
        "Use 40 points for ICP fit, 35 for website cues, 15 for confidence, and 10 for contact path and export readiness.",
      items: [
        "80-100: save and prioritize.",
        "65-79: review manually before outreach.",
        "Below 65: skip or revisit later."
      ]
    },
    faqs: [
      {
        question: "Should scoring be fully automated?",
        answer:
          "Automation should create a recommendation, but you should review edge cases and use reply quality to tune the model."
      },
      {
        question: "What is the difference between fit and confidence?",
        answer:
          "Fit measures prospect relevance. Confidence measures how strong and complete the available evidence is."
      },
      {
        question: "Should low-score leads be exported?",
        answer:
          "Usually no. Exporting weak prospects creates downstream work and lowers outreach quality."
      }
    ],
    related: ["tools/website-prospect-score-checker", "tools/website-opportunity-finder", "guides/icp-fit-score-for-solo-prospecting"]
  },
  {
    slug: "guides/website-audit-outreach",
    eyebrow: "Guide",
    category: "Website audit outreach",
    title: "Website audit outreach: send useful ideas before asking for a call",
    seoTitle: "Website Audit Outreach Guide for Solo Professionals | LeadCue",
    description:
      "Learn how solo professionals can use lightweight website audits to create helpful cold outreach, avoid generic redesign pitches, and earn replies.",
    intent: "Teach solo professionals how to package audit-style observations into better first touches.",
    readingTime: "8 min read",
    updatedAt: "2026-04-23",
    primaryKeyword: "website audit outreach",
    secondaryKeywords: ["website audit cold email", "website outreach ideas", "homepage teardown email"],
    heroBullets: [
      "A lightweight audit should open a conversation, not overwhelm the buyer.",
      "The best first touch gives one useful observation and one clear next step.",
      "Evidence-backed audit notes can become repeatable sales assets."
    ],
    sections: [
      {
        title: "Keep the audit lightweight",
        copy:
          "A first-touch audit should not include every issue you can find. It should identify one or two high-leverage improvements the buyer can understand quickly.",
        items: [
          "Focus on the homepage, navigation, proof, CTA, or key service page.",
          "Avoid long PDFs before the prospect asks for detail.",
          "Use language that connects the issue to pipeline, trust, or conversion."
        ]
      },
      {
        title: "Package the idea clearly",
        copy:
          "The outreach should make the prospect curious enough to reply. A useful structure is: observation, why it may matter, and permission to send ideas.",
        items: [
          "Observation: the case-study path is hard to find.",
          "Implication: buyers may not see proof before deciding whether to book.",
          "CTA: ask if they want three quick improvement ideas."
        ]
      },
      {
        title: "Use audit notes for follow-up",
        copy:
          "If the prospect does not reply, the source notes still help with follow-up. You can reference the same signal from a new angle without inventing a new reason.",
        items: [
          "Follow up with one example, not a generic bump.",
          "Keep the original source note visible in your notes.",
          "Stop when the prospect no longer has a strong reason to reach out."
        ]
      }
    ],
    example: {
      title: "Website audit outreach example",
      copy:
        "I noticed the homepage explains the product clearly, but the proof section sits below the main CTA. I found three ways to make the demo path feel safer for finance buyers.",
      items: [
        "The note is specific.",
        "The buyer outcome is clear.",
        "The CTA is low pressure."
      ]
    },
    faqs: [
      {
        question: "Should a website audit email include screenshots?",
        answer:
          "Screenshots can help in later follow-up, but the first email should stay lightweight unless the screenshot is essential to understanding the point."
      },
      {
        question: "How long should a first website audit email be?",
        answer:
          "Short enough to scan on mobile. The goal is to earn permission to send more detail, not to deliver the full audit immediately."
      },
      {
        question: "What if the website already looks good?",
        answer:
          "Look for messaging, proof, conversion, or content gaps. If there is no meaningful gap, skip the prospect or use a different offer."
      }
    ],
    related: ["tools/website-opportunity-finder", "use-cases/web-design-freelancers", "guides/turn-website-into-cold-email-angle"]
  }
];

export const seoContentPageMap: Partial<Record<string, SeoContentPage>> = Object.fromEntries(
  seoContentPages.map((page) => [page.slug, page])
);
