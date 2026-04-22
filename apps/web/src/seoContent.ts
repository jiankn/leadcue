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
    title: "Website prospecting: turn company pages into qualified outbound accounts",
    seoTitle: "Website Prospecting Guide for Agency Outbound | LeadCue",
    description:
      "Learn how website prospecting helps agencies qualify accounts, find evidence-backed sales angles, and write better outreach from public company pages.",
    intent: "Explain the category for teams searching for a better way to prospect from websites.",
    readingTime: "7 min read",
    updatedAt: "2026-04-23",
    primaryKeyword: "website prospecting",
    secondaryKeywords: ["website-first prospecting", "prospect website research", "agency outbound research"],
    heroBullets: [
      "Start from a real company website instead of a generic contact list.",
      "Score fit with visible evidence: CTAs, proof, positioning, content gaps, and contact paths.",
      "Turn each observation into a first line, outreach angle, and CRM-ready note."
    ],
    sections: [
      {
        title: "What website prospecting means",
        copy:
          "Website prospecting is the process of qualifying a company by reading the public signals on its site before you write outreach. For agencies, the website usually contains the pain: unclear positioning, weak proof, hidden calls to action, stale content, missing service pages, or conversion gaps.",
        items: [
          "It is useful when your offer improves websites, SEO, conversion, demand generation, or messaging.",
          "It creates a reason to contact the account that is visible and source-backed.",
          "It keeps reps from saving leads just because a company matches an industry filter."
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
        "Northstar Analytics explains its reporting product clearly, but the demo CTA and finance-team proof are not visible until after the first scroll.",
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
          "No. Website prospecting uses visible public website information to qualify an account and prepare better outreach. It does not require scraping social networks or buying contact databases."
      },
      {
        question: "Who should use website prospecting?",
        answer:
          "It is strongest for web design, SEO, growth, CRO, and marketing agencies because their offers can be tied directly to website observations."
      },
      {
        question: "What should be saved in the CRM?",
        answer:
          "Save the company, website URL, fit score, source-backed signals, first line, contact path, and the reason the account is worth outreach."
      }
    ],
    related: ["prospect-research-tool-for-agencies", "guides/score-prospect-website", "cold-email-first-lines"]
  },
  {
    slug: "prospect-research-tool-for-agencies",
    eyebrow: "Buying guide",
    category: "Agency software",
    title: "How to choose a prospect research tool for agency outbound",
    seoTitle: "Prospect Research Tool for Agencies | What to Look For | LeadCue",
    description:
      "A practical buying guide for agencies comparing prospect research tools, fit scoring workflows, source-backed notes, and CRM export paths.",
    intent: "Help buyers evaluate prospect research software for an agency workflow.",
    readingTime: "8 min read",
    updatedAt: "2026-04-23",
    primaryKeyword: "prospect research tool for agencies",
    secondaryKeywords: ["agency prospecting software", "lead research tool", "outbound research workflow"],
    heroBullets: [
      "A research tool should improve lead quality, not just increase lead volume.",
      "The output should explain why a prospect is worth contacting.",
      "Exports should carry source notes into the tools your team already uses."
    ],
    sections: [
      {
        title: "The job the tool should do",
        copy:
          "An agency prospect research tool should help a team decide whether an account deserves outreach. That means it needs to combine ICP fit, website evidence, outreach angle, and handoff fields instead of only collecting company names.",
        items: [
          "Qualify accounts before they enter a campaign.",
          "Show the source behind each sales cue.",
          "Create copy that references a real page observation."
        ]
      },
      {
        title: "Features that matter",
        copy:
          "The most useful features sit between research and outreach. They help the operator move from a website scan to a saved prospect card, then to a CSV or CRM row without losing context.",
        items: [
          "Fit score and confidence score for prioritization.",
          "Website cues grouped by web design, SEO, marketing, and timing.",
          "CRM export fields that map to HubSpot, Salesforce, Pipedrive, or a custom template."
        ]
      },
      {
        title: "Red flags when comparing tools",
        copy:
          "Avoid tools that create the illusion of volume while hiding why the account matters. If every output looks generic, your team will still spend time rewriting notes and guessing at relevance.",
        items: [
          "No visible source notes or page references.",
          "No distinction between fit score and data confidence.",
          "No practical handoff into sheets, CRM, or outreach tools."
        ]
      }
    ],
    example: {
      title: "Evaluation checklist",
      copy:
        "Before adopting a prospect research tool, run five real websites through it and compare whether the output helps your team decide who to contact first.",
      items: [
        "Can the tool explain why the account fits your ICP?",
        "Can the rep copy a credible first line without editing from scratch?",
        "Can exported fields preserve the evidence behind the outreach angle?"
      ]
    },
    faqs: [
      {
        question: "Should an agency use a lead database or a research tool?",
        answer:
          "Use a database when you only need contact discovery. Use a research tool when the bottleneck is knowing which accounts deserve outreach and what to say."
      },
      {
        question: "How many fields should a prospect card include?",
        answer:
          "Enough to preserve context: company, URL, fit score, confidence, signals, first line, contact path, source notes, owner, stage, and export status."
      },
      {
        question: "Does AI-generated research need human review?",
        answer:
          "Yes. AI should reduce research time, but reps should review source notes before sending outreach or saving an account as qualified."
      }
    ],
    related: ["website-prospecting", "agency-lead-qualification", "guides/score-prospect-website"]
  },
  {
    slug: "cold-email-first-lines",
    eyebrow: "Outbound copy",
    category: "Cold email",
    title: "Cold email first lines that come from real website evidence",
    seoTitle: "Cold Email First Lines from Website Evidence | LeadCue",
    description:
      "Learn how to write personalized cold email first lines from website observations, avoid generic openers, and connect each line to a credible business angle.",
    intent: "Teach outbound teams how to create first lines that feel researched.",
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
          "Many first lines fail because they mention a podcast, LinkedIn post, or award that has nothing to do with the offer. Website evidence works better for agencies because it points directly to marketing, design, SEO, or conversion opportunities.",
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
      }
    ],
    example: {
      title: "Before and after",
      copy:
        "Weak: 'I loved your website.' Stronger: 'I noticed the product story is clear, but the demo CTA and finance-team proof show up after the first scroll.'",
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
          "If the account is worth personalized outreach, yes. If you cannot find a relevant observation, the account may not be ready for a high-effort touch."
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
    related: ["guides/turn-website-into-cold-email-angle", "website-prospecting", "use-cases/marketing-agencies"]
  },
  {
    slug: "agency-lead-qualification",
    eyebrow: "Qualification",
    category: "Lead qualification",
    title: "Agency lead qualification: score fit before saving another prospect",
    seoTitle: "Agency Lead Qualification Workflow | Fit Score and Website Signals",
    description:
      "Build an agency lead qualification workflow that uses fit score, confidence, website signals, contact paths, and source-backed notes before outreach.",
    intent: "Help agencies define what makes a prospect worth saving and exporting.",
    readingTime: "8 min read",
    updatedAt: "2026-04-23",
    primaryKeyword: "agency lead qualification",
    secondaryKeywords: ["lead qualification for agencies", "fit score", "qualified prospect workflow"],
    heroBullets: [
      "Qualification should happen before a prospect enters a campaign.",
      "A saved lead needs both ICP fit and a reason to reach out.",
      "Confidence matters because thin page data can make a signal weaker."
    ],
    sections: [
      {
        title: "Separate fit from evidence quality",
        copy:
          "Fit score answers whether the company matches your offer. Confidence answers whether the available website evidence is strong enough to trust the recommendation. Both are needed before a rep saves the account.",
        items: [
          "Fit includes industry, company type, service need, and offer relevance.",
          "Confidence includes page depth, source clarity, and signal specificity.",
          "A high-fit account with weak evidence may need manual review before outreach."
        ]
      },
      {
        title: "Define your save threshold",
        copy:
          "Teams should agree on when a prospect is worth saving. Without a threshold, reps save too many accounts and the CRM fills with leads that have no usable outreach angle.",
        items: [
          "Save when fit score is strong and at least two website cues support the angle.",
          "Review when fit is strong but confidence is medium.",
          "Skip when the only available notes are generic or unrelated to your offer."
        ]
      },
      {
        title: "Carry qualification into export",
        copy:
          "The qualification context should not disappear when a lead leaves the research tool. Export fields should include fit score, signal summary, first line, source notes, owner, stage, and saved/exported status.",
        items: [
          "Use owner and stage fields to prevent duplicate work.",
          "Keep source notes in the CRM for review and coaching.",
          "Export only saved leads when building campaign lists."
        ]
      }
    ],
    example: {
      title: "A practical save rule",
      copy:
        "Save an account when it matches the ICP, has at least two source-backed website cues, and has a first line your team would be comfortable sending.",
      items: [
        "Fit score: 80 or higher.",
        "Confidence: 70% or higher.",
        "Status: saved, assigned, and ready for CRM export."
      ]
    },
    faqs: [
      {
        question: "What is a good fit score threshold?",
        answer:
          "Start with 80 for high-priority outreach, then adjust based on reply quality and booked meetings rather than scan volume alone."
      },
      {
        question: "Should weak-fit accounts be deleted?",
        answer:
          "Not always. Keep them out of immediate campaigns, but use notes to understand whether the ICP or scoring rules need refinement."
      },
      {
        question: "How should agencies review qualification quality?",
        answer:
          "Review saved leads weekly by fit score, confidence, reply rate, and whether the first line matched a real source note."
      }
    ],
    related: ["prospect-research-tool-for-agencies", "guides/score-prospect-website", "website-prospecting"]
  },
  {
    slug: "use-cases/web-design-agencies",
    eyebrow: "Use case",
    category: "Web design agencies",
    title: "Website prospecting for web design agencies",
    seoTitle: "Website Prospecting for Web Design Agencies | LeadCue",
    description:
      "How web design agencies can find redesign-ready prospects by spotting weak CTAs, buried proof, confusing navigation, and conversion gaps.",
    intent: "Show web design agencies how LeadCue supports redesign and conversion outreach.",
    readingTime: "6 min read",
    updatedAt: "2026-04-23",
    primaryKeyword: "website prospecting for web design agencies",
    secondaryKeywords: ["web design agency lead generation", "redesign prospecting", "website audit outreach"],
    heroBullets: [
      "Find redesign reasons that are visible on the prospect site.",
      "Prioritize accounts with conversion and proof gaps.",
      "Write outreach around a specific improvement, not a generic redesign pitch."
    ],
    sections: [
      {
        title: "Best signals for web design offers",
        copy:
          "A web design agency needs signals that point to conversion, clarity, credibility, or user experience. The strongest signals are easy for the prospect to verify because they are visible on the page.",
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
        title: "What to save for the team",
        copy:
          "Every saved lead should help the next person understand the redesign angle quickly. A Prospect Card should include the signal, the source, and the likely business impact.",
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
    related: ["guides/website-audit-outreach", "website-prospecting", "cold-email-first-lines"]
  },
  {
    slug: "use-cases/seo-agencies",
    eyebrow: "Use case",
    category: "SEO agencies",
    title: "Prospect research for SEO agencies using visible website gaps",
    seoTitle: "Prospect Research for SEO Agencies | Website Gaps and Outreach",
    description:
      "How SEO agencies can use website prospecting to find thin pages, stale content, weak metadata, and source-backed reasons to start outreach.",
    intent: "Help SEO agencies use website evidence to prioritize and personalize outbound.",
    readingTime: "6 min read",
    updatedAt: "2026-04-23",
    primaryKeyword: "prospect research for SEO agencies",
    secondaryKeywords: ["SEO agency prospecting", "SEO lead qualification", "website content gaps"],
    heroBullets: [
      "Use visible SEO and content gaps to qualify accounts.",
      "Avoid generic 'we can improve your rankings' outreach.",
      "Export source notes so campaign writers know the exact angle."
    ],
    sections: [
      {
        title: "SEO signals that support outreach",
        copy:
          "SEO agencies should focus on signals that a business owner or marketing leader can understand without a technical audit. Public pages often show enough evidence to open a useful conversation.",
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
          "SEO prospect notes should be reusable by campaign builders and sales reps. Keep the page source, category, and recommended first line together.",
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
          "Not for the first touch. A light website scan can find enough evidence to decide whether the account is worth deeper review."
      },
      {
        question: "What SEO signals are too technical for cold outreach?",
        answer:
          "Avoid leading with obscure technical details unless the buyer is technical. Start with visible business impact such as thin service pages or stale content."
      },
      {
        question: "How can SEO agencies avoid generic first lines?",
        answer:
          "Tie the first line to a specific page gap, content absence, or buyer journey issue rather than a broad claim about rankings."
      }
    ],
    related: ["guides/score-prospect-website", "cold-email-first-lines", "website-prospecting"]
  },
  {
    slug: "use-cases/marketing-agencies",
    eyebrow: "Use case",
    category: "Marketing agencies",
    title: "Website prospecting for marketing agencies and growth teams",
    seoTitle: "Website Prospecting for Marketing Agencies | Growth Outreach",
    description:
      "Use website prospecting to find unclear positioning, weak campaign paths, missing proof, and lead-generation opportunities for marketing agency outbound.",
    intent: "Show growth and marketing agencies how to build evidence-backed outreach from company websites.",
    readingTime: "6 min read",
    updatedAt: "2026-04-23",
    primaryKeyword: "website prospecting for marketing agencies",
    secondaryKeywords: ["marketing agency prospecting", "growth agency lead generation", "campaign angle research"],
    heroBullets: [
      "Find campaign angles before a company enters outreach.",
      "Use positioning and proof gaps to write useful first touches.",
      "Save notes that explain why the account is a fit."
    ],
    sections: [
      {
        title: "Signals for marketing offers",
        copy:
          "Marketing agencies need signals that reveal demand generation, conversion, or messaging opportunities. The public website often shows whether a company is ready for better campaigns.",
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
          "Marketing teams can review more accounts when each saved prospect uses the same fields. Consistency makes it easier to compare accounts and coach outreach quality.",
        items: [
          "Score fit against the agency's ICP.",
          "Classify signals as positioning, proof, campaign, or conversion.",
          "Export only accounts with a concrete opening angle."
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
        question: "What makes website prospecting useful for growth agencies?",
        answer:
          "It turns visible page gaps into campaign ideas, which makes outreach more relevant than a generic promise of more leads."
      },
      {
        question: "Should marketing agencies focus on fit or urgency?",
        answer:
          "Both. Fit tells you the company matches your offer. Website signals help explain why the timing may be right."
      },
      {
        question: "What should be included in a marketing prospect card?",
        answer:
          "Include fit score, campaign angle, proof gap, first line, source notes, and the recommended next step."
      }
    ],
    related: ["cold-email-first-lines", "agency-lead-qualification", "website-prospecting"]
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
          "Do not force it. Either scan another page, save the account for later review, or skip it until you have a stronger reason to reach out."
      }
    ],
    related: ["cold-email-first-lines", "guides/website-audit-outreach", "website-prospecting"]
  },
  {
    slug: "guides/score-prospect-website",
    eyebrow: "Guide",
    category: "Qualification",
    title: "How to score a prospect website before adding it to outreach",
    seoTitle: "How to Score a Prospect Website for Outreach | LeadCue Guide",
    description:
      "Use this practical scoring framework to qualify prospect websites by ICP fit, website cues, confidence, contact paths, and outreach readiness.",
    intent: "Give teams a scoring method they can use before saving and exporting leads.",
    readingTime: "8 min read",
    updatedAt: "2026-04-23",
    primaryKeyword: "score prospect website",
    secondaryKeywords: ["prospect fit score", "lead qualification score", "website sales signals"],
    heroBullets: [
      "Fit score tells you whether the account matches your offer.",
      "Signal quality tells you whether the outreach reason is strong.",
      "Export readiness tells you whether the lead is ready for the next tool."
    ],
    sections: [
      {
        title: "Score ICP fit first",
        copy:
          "Start with the account itself. If the company does not match your agency focus, even a clear website gap may not be worth pursuing.",
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
        title: "Score export readiness",
        copy:
          "A lead is not ready just because it has a high score. The handoff fields need to be complete enough for a rep or campaign builder to use without redoing the research.",
        items: [
          "First line is copy-ready.",
          "Source notes are attached.",
          "Owner, stage, and CRM export fields are set."
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
          "Automation should create a recommendation, but teams should review edge cases and use reply quality to tune the model."
      },
      {
        question: "What is the difference between fit and confidence?",
        answer:
          "Fit measures account relevance. Confidence measures how strong and complete the available evidence is."
      },
      {
        question: "Should low-score leads be exported?",
        answer:
          "Usually no. Exporting weak leads creates downstream work and lowers campaign quality."
      }
    ],
    related: ["agency-lead-qualification", "prospect-research-tool-for-agencies", "use-cases/seo-agencies"]
  },
  {
    slug: "guides/website-audit-outreach",
    eyebrow: "Guide",
    category: "Website audit outreach",
    title: "Website audit outreach: send useful ideas before asking for a call",
    seoTitle: "Website Audit Outreach Guide for Agencies | LeadCue",
    description:
      "Learn how agencies can use lightweight website audits to create helpful cold outreach, avoid generic redesign pitches, and earn replies.",
    intent: "Teach agencies how to package audit-style observations into better first touches.",
    readingTime: "8 min read",
    updatedAt: "2026-04-23",
    primaryKeyword: "website audit outreach",
    secondaryKeywords: ["website audit cold email", "agency outreach ideas", "homepage teardown email"],
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
          "If the prospect does not reply, the source notes still help with follow-up. A rep can reference the same signal from a new angle without inventing a new reason.",
        items: [
          "Follow up with one example, not a generic bump.",
          "Keep the original source note visible in the CRM.",
          "Stop when the account no longer has a strong reason to reach out."
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
          "Look for messaging, proof, conversion, or content gaps. If there is no meaningful gap, skip the account or use a different offer."
      }
    ],
    related: ["use-cases/web-design-agencies", "guides/turn-website-into-cold-email-angle", "cold-email-first-lines"]
  }
];

export const seoContentPageMap: Partial<Record<string, SeoContentPage>> = Object.fromEntries(
  seoContentPages.map((page) => [page.slug, page])
);
