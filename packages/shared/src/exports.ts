import { extractDomain } from "./extraction";
import type { ProspectCard, ProspectPipelineContext, ProspectPipelineStage } from "./types";

export type ProspectExportFieldKey =
  | "identity"
  | "fit"
  | "signals"
  | "contacts"
  | "angles"
  | "firstLine"
  | "email"
  | "sources";

export type ProspectExportPresetKey = "crm" | "email" | "brief" | "custom";
export type ProspectCrmFieldMode = "hubspot" | "salesforce" | "pipedrive";

export type ProspectExportColumnKey =
  | "companyName"
  | "domain"
  | "websiteUrl"
  | "industry"
  | "fitScore"
  | "confidenceScore"
  | "owner"
  | "pipelineStage"
  | "pipelineNotes"
  | "primaryEmail"
  | "contactPage"
  | "linkedinUrl"
  | "sourceNotes"
  | "subject"
  | "firstLine"
  | "emailBody"
  | "outreachAngles"
  | "summary"
  | "fitReason"
  | "websiteSignals";

export interface ProspectExportColumnDefinition {
  key: ProspectExportColumnKey;
  label: string;
  crmLabels?: Record<ProspectCrmFieldMode, string>;
}

export interface ProspectExportPresetDefinition {
  key: Exclude<ProspectExportPresetKey, "custom">;
  label: string;
  description: string;
  fields: ProspectExportFieldKey[];
  columns: ProspectExportColumnKey[];
}

export interface ProspectExportRowInput {
  card: ProspectCard;
  pipelineContext?: ProspectPipelineContext | null;
}

export const prospectExportFields: Array<{ key: ProspectExportFieldKey; label: string }> = [
  { key: "identity", label: "Company fields" },
  { key: "fit", label: "Fit evidence" },
  { key: "signals", label: "Website signals" },
  { key: "contacts", label: "Contact paths" },
  { key: "angles", label: "Outreach angles" },
  { key: "firstLine", label: "First line" },
  { key: "email", label: "Short email" },
  { key: "sources", label: "Source notes" }
];

export const prospectCrmFieldModes: Array<{
  value: ProspectCrmFieldMode;
  label: string;
  description: string;
}> = [
  {
    value: "hubspot",
    label: "HubSpot",
    description: "Internal property names for company imports."
  },
  {
    value: "salesforce",
    label: "Salesforce",
    description: "Account-style API field names with custom LeadCue fields."
  },
  {
    value: "pipedrive",
    label: "Pipedrive",
    description: "Readable organization import labels."
  }
];

export const defaultProspectExportSelection: Record<ProspectExportFieldKey, boolean> = {
  identity: true,
  fit: true,
  signals: true,
  contacts: false,
  angles: true,
  firstLine: false,
  email: false,
  sources: true
};

export const prospectExportColumns: Record<ProspectExportColumnKey, ProspectExportColumnDefinition> = {
  companyName: {
    key: "companyName",
    label: "company_name",
    crmLabels: {
      hubspot: "name",
      salesforce: "Name",
      pipedrive: "Organization"
    }
  },
  domain: {
    key: "domain",
    label: "domain",
    crmLabels: {
      hubspot: "domain",
      salesforce: "Account_Domain__c",
      pipedrive: "Domain"
    }
  },
  websiteUrl: {
    key: "websiteUrl",
    label: "website_url",
    crmLabels: {
      hubspot: "website",
      salesforce: "Website",
      pipedrive: "Website"
    }
  },
  industry: {
    key: "industry",
    label: "industry",
    crmLabels: {
      hubspot: "industry",
      salesforce: "Industry",
      pipedrive: "Industry"
    }
  },
  fitScore: {
    key: "fitScore",
    label: "fit_score",
    crmLabels: {
      hubspot: "leadcue_fit_score",
      salesforce: "LeadCue_Fit_Score__c",
      pipedrive: "LeadCue Fit Score"
    }
  },
  confidenceScore: {
    key: "confidenceScore",
    label: "confidence_score",
    crmLabels: {
      hubspot: "leadcue_confidence_score",
      salesforce: "LeadCue_Confidence__c",
      pipedrive: "LeadCue Confidence"
    }
  },
  owner: {
    key: "owner",
    label: "owner",
    crmLabels: {
      hubspot: "hubspot_owner_id",
      salesforce: "OwnerId",
      pipedrive: "Owner"
    }
  },
  pipelineStage: {
    key: "pipelineStage",
    label: "pipeline_stage",
    crmLabels: {
      hubspot: "hs_lead_status",
      salesforce: "Status",
      pipedrive: "Pipeline Stage"
    }
  },
  pipelineNotes: {
    key: "pipelineNotes",
    label: "pipeline_notes",
    crmLabels: {
      hubspot: "leadcue_notes",
      salesforce: "Description",
      pipedrive: "Notes"
    }
  },
  primaryEmail: {
    key: "primaryEmail",
    label: "primary_email",
    crmLabels: {
      hubspot: "email",
      salesforce: "Email",
      pipedrive: "Primary Email"
    }
  },
  contactPage: {
    key: "contactPage",
    label: "contact_page",
    crmLabels: {
      hubspot: "leadcue_contact_page",
      salesforce: "Contact_Page__c",
      pipedrive: "Contact Page"
    }
  },
  linkedinUrl: {
    key: "linkedinUrl",
    label: "linkedin_url",
    crmLabels: {
      hubspot: "linkedin_company_page",
      salesforce: "LinkedIn_URL__c",
      pipedrive: "LinkedIn URL"
    }
  },
  sourceNotes: {
    key: "sourceNotes",
    label: "source_notes",
    crmLabels: {
      hubspot: "leadcue_source_notes",
      salesforce: "LeadSource",
      pipedrive: "Source Notes"
    }
  },
  subject: { key: "subject", label: "subject" },
  firstLine: { key: "firstLine", label: "first_line" },
  emailBody: { key: "emailBody", label: "email_body" },
  outreachAngles: { key: "outreachAngles", label: "outreach_angles" },
  summary: { key: "summary", label: "summary" },
  fitReason: { key: "fitReason", label: "fit_reason" },
  websiteSignals: { key: "websiteSignals", label: "website_signals" }
};

export const prospectExportPresets: ProspectExportPresetDefinition[] = [
  {
    key: "crm",
    label: "CRM export",
    description: "Company, fit, contacts, owner, stage, and source proof.",
    fields: ["identity", "fit", "contacts", "sources"],
    columns: [
      "companyName",
      "domain",
      "websiteUrl",
      "industry",
      "fitScore",
      "confidenceScore",
      "owner",
      "pipelineStage",
      "pipelineNotes",
      "primaryEmail",
      "contactPage",
      "linkedinUrl",
      "sourceNotes"
    ]
  },
  {
    key: "email",
    label: "Email draft",
    description: "The first line, outreach angles, and short email only.",
    fields: ["firstLine", "angles", "email"],
    columns: ["companyName", "domain", "subject", "firstLine", "emailBody", "outreachAngles", "owner", "pipelineStage"]
  },
  {
    key: "brief",
    label: "Research brief",
    description: "A compact account brief with evidence, signals, and sources.",
    fields: ["identity", "fit", "signals", "angles", "sources"],
    columns: ["companyName", "websiteUrl", "summary", "fitReason", "websiteSignals", "outreachAngles", "sourceNotes", "confidenceScore"]
  }
];

const stageLabels: Record<ProspectPipelineStage, string> = {
  researching: "Researching",
  qualified: "Qualified",
  outreach_queued: "Outreach queued",
  contacted: "Contacted",
  won: "Won",
  archived: "Archived"
};

export function isProspectExportPresetKey(value: unknown): value is Exclude<ProspectExportPresetKey, "custom"> {
  return value === "crm" || value === "email" || value === "brief";
}

export function isProspectCrmFieldMode(value: unknown): value is ProspectCrmFieldMode {
  return value === "hubspot" || value === "salesforce" || value === "pipedrive";
}

export function formatPipelineStageLabel(value: ProspectPipelineStage) {
  return stageLabels[value] || value.replace(/_/g, " ");
}

export function getProspectExportColumns(
  presetKey: Exclude<ProspectExportPresetKey, "custom">,
  crmMode: ProspectCrmFieldMode = "hubspot"
): ProspectExportColumnDefinition[] {
  const preset = prospectExportPresets.find((item) => item.key === presetKey) || prospectExportPresets[0];

  return preset.columns.map((columnKey) => {
    const column = prospectExportColumns[columnKey];
    const label = presetKey === "crm" ? column.crmLabels?.[crmMode] || column.label : column.label;
    return { ...column, label };
  });
}

export function prospectCardToExportRecord({
  card,
  pipelineContext
}: ProspectExportRowInput): Record<ProspectExportColumnKey, string | number> {
  const context = normalizeExportContext(pipelineContext || card.pipelineContext);
  const firstLine = card.firstLines[0] || "";

  return {
    companyName: card.companyName,
    domain: card.domain || extractDomain(card.website) || "",
    websiteUrl: card.website,
    industry: card.industry,
    fitScore: card.fitScore,
    confidenceScore: `${Math.round(card.confidenceScore * 100)}%`,
    owner: context.owner,
    pipelineStage: context.stage,
    pipelineNotes: context.notes,
    primaryEmail: card.contactPoints.emails[0] || "",
    contactPage: card.contactPoints.contactPages[0] || "",
    linkedinUrl: card.contactPoints.socialLinks.find((link) => link.toLowerCase().includes("linkedin")) || "",
    sourceNotes: card.sourceNotes.map((note) => `${note.claim} (${note.source})`).join(" | "),
    subject: `Quick idea for ${card.companyName}`,
    firstLine,
    emailBody: card.shortEmail,
    outreachAngles: card.outreachAngles.join(" | "),
    summary: card.summary,
    fitReason: card.fitReason,
    websiteSignals: card.opportunitySignals
      .map((signal) => `${signal.category.replace("_", " ")}: ${signal.signal}`)
      .join(" | ")
  };
}

export function buildProspectExportCsv(
  rows: ProspectExportRowInput[],
  presetKey: Exclude<ProspectExportPresetKey, "custom"> = "crm",
  crmMode: ProspectCrmFieldMode = "hubspot"
): string {
  const columns = getProspectExportColumns(presetKey, crmMode);
  const header = columns.map((column) => column.label);
  const body = rows.map((row) => {
    const values = prospectCardToExportRecord(row);
    return columns.map((column) => values[column.key]);
  });

  return [header, ...body].map((row) => row.map(csvCell).join(",")).join("\n");
}

function normalizeExportContext(value?: ProspectPipelineContext | null): ProspectPipelineContext {
  return {
    owner: typeof value?.owner === "string" ? value.owner : "",
    stage: isPipelineStage(value?.stage) ? value.stage : "researching",
    notes: typeof value?.notes === "string" ? value.notes : "",
    updatedAt: typeof value?.updatedAt === "string" ? value.updatedAt : null
  };
}

function isPipelineStage(value: unknown): value is ProspectPipelineStage {
  return (
    value === "researching" ||
    value === "qualified" ||
    value === "outreach_queued" ||
    value === "contacted" ||
    value === "won" ||
    value === "archived"
  );
}

function csvCell(value: string | number | null | undefined): string {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}
