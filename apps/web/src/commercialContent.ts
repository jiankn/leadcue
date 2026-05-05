export type CommercialPageSlug = "docs" | "support" | "contact" | "privacy" | "terms";

export type CommercialPageDefinition = {
  eyebrow: string;
  title: string;
  summary: string;
  primaryAction: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
  sections: Array<{ title: string; copy: string; items: string[] }>;
};

export const commercialPages: Record<CommercialPageSlug, CommercialPageDefinition> = {
  docs: {
    eyebrow: "Documentation",
    title: "Run AI website prospecting without building another list tool.",
    summary:
      "Use these docs to set up your profile, run scans, interpret Prospect Cards, manage credits, and export qualified research for outreach.",
    primaryAction: { label: "Open dashboard", href: "/app" },
    secondaryAction: { label: "Contact support", href: "/support" },
    sections: [
      {
        title: "Quick start",
        copy: "LeadCue works best when each scan starts from a real company website, a defined offer, and a clear reason why the prospect matters.",
        items: [
          "Sign in with Google or email and complete the scoring profile.",
          "Choose the monthly scan volume that matches how often you review websites.",
          "Load one real prospect URL, add visible website notes, and run the first scan.",
          "Review the Prospect Card before copying first lines or exporting the prospect."
        ]
      },
      {
        title: "How to read a Prospect Card",
        copy: "Every saved card is meant to answer three questions fast: why this prospect fits, what the website proves, and what you should say next.",
        items: [
          "Fit score combines your offer, industry, geography, and signal quality.",
          "Signals and source notes keep claims attached to visible website evidence.",
          "First line and short email stay grounded in the saved evidence instead of generic personalization.",
          "Export fields keep source-backed context tied to the same prospect record."
        ]
      },
      {
        title: "Operating model",
        copy: "LeadCue is the research layer before outreach. It should sharpen qualification, not replace human review or compliance checks.",
        items: [
          "Run scans only on prospects you actually want to evaluate.",
          "Save prospects when the website evidence is specific enough to justify contact.",
          "Use CSV exports to move only qualified research downstream.",
          "Refresh ICP settings any time your offer, regions, or target industries change."
        ]
      }
    ]
  },
  support: {
    eyebrow: "Support",
    title: "Get help with login access, billing, scans, exports, and setup questions.",
    summary:
      "Support is structured around the actual personal prospecting workflow: signing in, configuring your profile, scanning websites, exporting prospects, and staying within plan limits.",
    primaryAction: { label: "Email support", href: "mailto:support@leadcue.app" },
    secondaryAction: { label: "Read docs", href: "/docs" },
    sections: [
      {
        title: "Login access",
        copy: "Most login issues are recoverable in-product before they become a support ticket.",
        items: [
          "Use Google sign-in if the profile was created with OAuth.",
          "Use the email password flow if you created an email login.",
          "Reset password from the login page when the work email is correct but the password is unknown.",
          "Include the login email and any auth_error message if support is still needed."
        ]
      },
      {
        title: "Scanning, credits, and exports",
        copy: "The fastest support turnaround comes from a clear explanation of what was scanned, what you expected, and whether the issue affected credits or exports.",
        items: [
          "Share the prospect URL or scan ID when a Prospect Card looks weak or incomplete.",
          "Mention whether the scan was basic or deep and whether credits were charged.",
          "Include the export preset or destination naming mode when CSV output looks wrong.",
          "Attach the expected outcome and the actual result so support can reproduce it."
        ]
      },
      {
        title: "Billing and launch service levels",
        copy: "LeadCue currently prioritizes billing blockers, login access, and scan-quality issues that stop personal prospecting work week to week.",
        items: [
          "Billing portal and subscription state issues are prioritized first.",
          "Plan-fit questions should include expected monthly scan volume.",
          "Security or privacy concerns should be sent directly to support@leadcue.app.",
          "Feature requests should describe the outbound workflow they would unlock."
        ]
      }
    ]
  },
  contact: {
    eyebrow: "Contact",
    title: "Talk to LeadCue about personal prospecting workflows, plan fit, and setup.",
    summary:
      "Use contact when you need help deciding if the product matches your workflow, how to map fields into CSV, or how to use AI website prospecting in your weekly outreach.",
    primaryAction: { label: "Email LeadCue", href: "mailto:support@leadcue.app" },
    secondaryAction: { label: "Start free", href: "/signup" },
    sections: [
      {
        title: "Who LeadCue is for",
        copy: "LeadCue is strongest for solo professionals selling web design, SEO, CRO, positioning, or related services where visible website evidence creates a credible outreach angle.",
        items: [
          "Solo founders building a weekly outbound habit.",
          "Web design freelancers who need better qualification before list export.",
          "Independent consultants who want export-ready research instead of generic leads.",
          "Individual sales operators who need a clear path from research to outreach."
        ]
      },
      {
        title: "What to discuss before rollout",
        copy: "A good rollout conversation starts from one real workflow and one real offer, not from abstract tool comparisons.",
        items: [
          "What a qualified prospect looks like for your offer.",
          "Where saved Prospect Cards should go after review.",
          "Which website signals matter most for your offer.",
          "How much monthly scan volume you will realistically use."
        ]
      },
      {
        title: "What LeadCue does not replace",
        copy: "The product fits best when expectations are crisp: it improves research quality and transfer to downstream tools, but it is not your full outbound stack.",
        items: [
          "LeadCue does not send campaigns.",
          "LeadCue does not scrape LinkedIn or build contact databases.",
          "LeadCue does not replace legal review.",
          "LeadCue does not remove the need for human judgment before contact."
        ]
      }
    ]
  },
  privacy: {
    eyebrow: "Privacy",
    title: "Privacy principles for website-first prospect research.",
    summary:
      "LeadCue is built around user-triggered website analysis, profile setup data, secure login sessions, and saved research needed for personal outreach.",
    primaryAction: { label: "Contact privacy support", href: "mailto:support@leadcue.app" },
    secondaryAction: { label: "Back home", href: "/" },
    sections: [
      {
        title: "Data we process",
        copy: "Profile data is intentionally narrow and tied to the product workflow rather than passive collection.",
        items: [
          "Login identity from Google OAuth or email signup.",
          "Plan, subscription state, and scan-credit usage.",
          "ICP settings used to score prospect websites.",
          "Prospect website snapshots, generated notes, activity log changes, and saved Prospect Cards."
        ]
      },
      {
        title: "Boundaries and prohibited collection",
        copy: "LeadCue is not designed to silently observe user browsing or build hidden contact intelligence.",
        items: [
          "Scans are user-triggered or sent through the API by the customer.",
          "LinkedIn scraping and background browsing collection are outside the product boundary.",
          "Contact details are limited to public website paths when visible on scanned pages.",
          "Exports contain saved research and mapped fields, not purchased data."
        ]
      },
      {
        title: "Security and retention controls",
        copy: "Users should be able to understand what was stored, why it was stored, and how it will leave the product.",
        items: [
          "Login sessions use server-side cookies instead of exposing tokens in the client.",
          "Password resets use short-lived, one-time tokens.",
          "Billing operations are routed through Stripe when payment is configured.",
          "Users can contact support for privacy questions or deletion requests."
        ]
      }
    ]
  },
  terms: {
    eyebrow: "Terms",
    title: "Commercial usage terms for LeadCue users.",
    summary:
      "These terms describe the intended product boundary: website research, prospect qualification, secure login access, and export-ready notes for solo professionals.",
    primaryAction: { label: "Start free", href: "/signup" },
    secondaryAction: { label: "Ask a question", href: "/contact" },
    sections: [
      {
        title: "Acceptable use",
        copy: "Use LeadCue to analyze public company websites and prepare better outbound research. Customers remain responsible for lawful use and message compliance.",
        items: [
          "Run scans only for lawful business prospecting workflows.",
          "Respect website, platform, and outreach-tool policies.",
          "Do not use LeadCue to automate spam or build unwanted contact lists.",
          "Review generated copy before it is sent anywhere."
        ]
      },
      {
        title: "Plans, credits, and subscriptions",
        copy: "Plans are organized around monthly website-scan capacity, with deeper analysis using more credits when configured.",
        items: [
          "The Free plan includes limited monthly scan volume.",
          "Deep scans can consume additional credits based on the published plan rules.",
          "Paid subscriptions use Stripe when billing is configured.",
          "Customers are responsible for monitoring plan fit, credits, and usage."
        ]
      },
      {
        title: "Product boundary and responsibility",
        copy: "LeadCue is the research layer before outreach. It does not guarantee sales outcomes and should be treated as decision support plus structured export.",
        items: [
          "LeadCue does not send campaigns.",
          "LeadCue does not replace compliance review.",
          "Generated Prospect Cards are informational and should be reviewed by the customer.",
          "Customers remain responsible for how exported data and outreach copy are used."
        ]
      }
    ]
  }
};
