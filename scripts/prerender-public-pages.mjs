import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const distDir = path.join(repoRoot, "apps", "web", "dist");
const siteUrl = "https://leadcue.app";

const publicRoutes = [
  {
    path: "/",
    title: "LeadCue - Website Prospecting Assistant for Agencies",
    description:
      "LeadCue turns company websites into qualified prospect cards with fit scores, source-backed sales cues, outreach angles, and cold email first lines.",
    sections: ["Website-first prospecting for agencies.", "Fit scores, source-backed cues, first lines, and CRM-ready exports."]
  },
  {
    path: "/docs",
    title: "Run Website-First Prospecting Without Another List Tool | LeadCue",
    description:
      "Use LeadCue docs to set up a workspace, run website scans, review Prospect Cards, and export clean notes into your outreach system.",
    sections: ["Quick start", "Scan payload", "Operating model"]
  },
  {
    path: "/support",
    title: "LeadCue Support for Account, Billing, Scans, and Exports",
    description: "Get help with account access, billing, scans, CSV exports, and LeadCue workspace setup.",
    sections: ["Common requests", "What to include", "Launch service levels"]
  },
  {
    path: "/contact",
    title: "Contact LeadCue About Agency Prospecting Workflows",
    description: "Talk to LeadCue about plan guidance, launch support, agency workspace setup, and integration questions.",
    sections: ["Sales and setup", "Product questions", "Security and privacy"]
  },
  {
    path: "/privacy",
    title: "LeadCue Privacy Principles for Website-First Prospect Research",
    description:
      "LeadCue privacy principles for user-triggered website analysis, workspace setup data, and saved prospect notes.",
    sections: ["Data we expect to process", "Data boundaries", "Operational controls"]
  },
  {
    path: "/terms",
    title: "LeadCue Commercial Usage Terms",
    description:
      "LeadCue launch terms for website research, prospect qualification, and export-ready notes for agency outbound teams.",
    sections: ["Acceptable use", "Plans and credits", "Product boundary"]
  },
  {
    path: "/website-prospecting",
    title: "Website Prospecting Guide for Agency Outbound | LeadCue",
    description:
      "Learn how website prospecting helps agencies qualify accounts, find evidence-backed sales angles, and write better outreach from public company pages.",
    sections: ["What website prospecting means", "Signals worth capturing", "How to turn evidence into outreach"]
  },
  {
    path: "/prospect-research-tool-for-agencies",
    title: "Prospect Research Tool for Agencies | What to Look For | LeadCue",
    description:
      "A practical buying guide for agencies comparing prospect research tools, fit scoring workflows, source-backed notes, and CRM export paths.",
    sections: ["The job the tool should do", "Features that matter", "Red flags when comparing tools"]
  },
  {
    path: "/cold-email-first-lines",
    title: "Cold Email First Lines from Website Evidence | LeadCue",
    description:
      "Learn how to write personalized cold email first lines from website observations, avoid generic openers, and connect each line to a credible business angle.",
    sections: ["What makes a first line work", "Use website evidence", "A simple formula"]
  },
  {
    path: "/agency-lead-qualification",
    title: "Agency Lead Qualification Workflow | Fit Score and Website Signals",
    description:
      "Build an agency lead qualification workflow that uses fit score, confidence, website signals, contact paths, and source-backed notes before outreach.",
    sections: ["Separate fit from evidence quality", "Define your save threshold", "Carry qualification into export"]
  },
  {
    path: "/use-cases/web-design-agencies",
    title: "Website Prospecting for Web Design Agencies | LeadCue",
    description:
      "How web design agencies can find redesign-ready prospects by spotting weak CTAs, buried proof, confusing navigation, and conversion gaps.",
    sections: ["Best signals for web design offers", "How to package the outreach", "What to save for the team"]
  },
  {
    path: "/use-cases/seo-agencies",
    title: "Prospect Research for SEO Agencies | Website Gaps and Outreach",
    description:
      "How SEO agencies can use website prospecting to find thin pages, stale content, weak metadata, and source-backed reasons to start outreach.",
    sections: ["SEO signals that support outreach", "How to make the angle credible", "What to export"]
  },
  {
    path: "/use-cases/marketing-agencies",
    title: "Website Prospecting for Marketing Agencies | Growth Outreach",
    description:
      "Use website prospecting to find unclear positioning, weak campaign paths, missing proof, and lead-generation opportunities for marketing agency outbound.",
    sections: ["Signals for marketing offers", "Turn gaps into a useful offer", "Build a repeatable research motion"]
  },
  {
    path: "/guides/turn-website-into-cold-email-angle",
    title: "Turn a Prospect Website into a Cold Email Angle | LeadCue Guide",
    description:
      "A step-by-step guide for turning visible website evidence into a cold email angle, first line, and low-pressure CTA.",
    sections: ["Choose the right page", "Translate the observation", "Write the email"]
  },
  {
    path: "/guides/score-prospect-website",
    title: "How to Score a Prospect Website for Outreach | LeadCue Guide",
    description:
      "Use this practical scoring framework to qualify prospect websites by ICP fit, website cues, confidence, contact paths, and outreach readiness.",
    sections: ["Score ICP fit first", "Score the website cues", "Score export readiness"]
  },
  {
    path: "/guides/website-audit-outreach",
    title: "Website Audit Outreach Guide for Agencies | LeadCue",
    description:
      "Learn how agencies can use lightweight website audits to create helpful cold outreach, avoid generic redesign pitches, and earn replies.",
    sections: ["Keep the audit lightweight", "Package the idea clearly", "Use audit notes for follow-up"]
  },
  {
    path: "/templates/crm-csv-field-mapping",
    title: "CRM CSV Field Mapping Template for Prospect Research | LeadCue",
    description:
      "Map prospect research fields into HubSpot, Salesforce, Pipedrive, or a custom CSV export while keeping fit score, first line, and source notes intact.",
    sections: ["Interactive CRM field mapper", "Copy CSV headers", "Download a sample row"]
  },
  {
    path: "/templates/cold-email-first-line",
    title: "Cold Email First Line Template Library | LeadCue",
    description:
      "Copy first line templates based on real website signals such as hidden CTAs, missing proof, stale content, and unclear positioning.",
    sections: ["First line builder", "Signal templates", "Copy-ready email"]
  },
  {
    path: "/templates/website-prospecting-checklist",
    title: "Website Prospecting Checklist for Agency Outbound | LeadCue",
    description:
      "Use this website prospecting checklist to inspect CTA clarity, proof, SEO, navigation, contact paths, and content freshness before saving a lead.",
    sections: ["Interactive checklist", "Prospect Card summary", "Export readiness"]
  },
  {
    path: "/integrations/hubspot-csv-export",
    title: "HubSpot CSV Export for Prospect Research | LeadCue",
    description:
      "Prepare HubSpot-friendly CSV fields for saved prospect research, including company, website, fit score, first line, source notes, and lead status.",
    sections: ["Recommended HubSpot fields", "Import workflow", "Custom properties"]
  },
  {
    path: "/integrations/salesforce-csv-export",
    title: "Salesforce CSV Export for Qualified Prospect Research | LeadCue",
    description:
      "Map website prospecting research into Salesforce lead import fields while preserving fit score, source notes, first line, and lead source.",
    sections: ["Recommended Salesforce fields", "Lead import workflow", "Description and source notes"]
  },
  {
    path: "/integrations/pipedrive-csv-export",
    title: "Pipedrive CSV Export for Prospect Research Notes | LeadCue",
    description:
      "Prepare Pipedrive CSV imports for website prospecting research with organization fields, owner, stage, fit score, first line, and notes.",
    sections: ["Recommended Pipedrive fields", "Organization import workflow", "Notes and custom fields"]
  }
];

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function canonicalFor(routePath) {
  return `${siteUrl}${routePath === "/" ? "/" : routePath}`;
}

function renderStaticRoot(route) {
  return `<main class="prerendered-seo" aria-label="${escapeHtml(route.title)}">
    <nav><a href="/">LeadCue</a> / <a href="/#resources">Resources</a></nav>
    <h1>${escapeHtml(route.title.replace(" | LeadCue", ""))}</h1>
    <p>${escapeHtml(route.description)}</p>
    <ul>${route.sections.map((section) => `<li>${escapeHtml(section)}</li>`).join("")}</ul>
    <p><a href="/signup?plan=free">Start free scan</a></p>
  </main>`;
}

function injectHead(baseHtml, route) {
  const canonical = canonicalFor(route.path);
  const structuredData = JSON.stringify({
    "@context": "https://schema.org",
    "@type": route.path.startsWith("/integrations/") ? "TechArticle" : "WebPage",
    name: route.title,
    description: route.description,
    url: canonical,
    publisher: {
      "@type": "Organization",
      name: "LeadCue",
      url: siteUrl
    }
  });

  let html = baseHtml
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(route.title)}</title>`)
    .replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
      `<meta name="description" content="${escapeHtml(route.description)}" />`
    );

  html = html.replace(
    "</head>",
    `<link rel="canonical" href="${canonical}" />
    <meta name="robots" content="index,follow" />
    <meta property="og:title" content="${escapeHtml(route.title)}" />
    <meta property="og:description" content="${escapeHtml(route.description)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="LeadCue" />
    <meta name="twitter:card" content="summary_large_image" />
    <script type="application/ld+json">${structuredData.replace(/</g, "\\u003c")}</script>
  </head>`
  );

  return html.replace('<div id="root"></div>', `<div id="root">${renderStaticRoot(route)}</div>`);
}

const baseHtml = await readFile(path.join(distDir, "index.html"), "utf8");

await Promise.all(
  publicRoutes.map(async (route) => {
    const html = injectHead(baseHtml, route);
    const targetDir = route.path === "/" ? distDir : path.join(distDir, route.path.slice(1));
    await mkdir(targetDir, { recursive: true });
    await writeFile(path.join(targetDir, "index.html"), html);
  })
);

console.log(`Prerendered ${publicRoutes.length} public pages.`);
