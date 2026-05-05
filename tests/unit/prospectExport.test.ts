import { describe, expect, it } from "vitest";
import {
  buildProspectExportCsv,
  isProspectCrmFieldMode,
  isProspectExportPresetKey,
  prospectCardToExportRecord,
  SAMPLE_PROSPECT_CARD,
  formatPipelineStageLabel,
  getProspectExportColumns
} from "../../packages/shared/src";

describe("isProspectExportPresetKey", () => {
  it("accepts known keys", () => {
    expect(isProspectExportPresetKey("crm")).toBe(true);
    expect(isProspectExportPresetKey("email")).toBe(true);
    expect(isProspectExportPresetKey("brief")).toBe(true);
    expect(isProspectExportPresetKey("instantly")).toBe(true);
    expect(isProspectExportPresetKey("smartlead")).toBe(true);
    expect(isProspectExportPresetKey("csv")).toBe(true);
  });

  it("rejects unknown or custom keys", () => {
    expect(isProspectExportPresetKey("custom")).toBe(false);
    expect(isProspectExportPresetKey("")).toBe(false);
    expect(isProspectExportPresetKey(null)).toBe(false);
    expect(isProspectExportPresetKey(undefined)).toBe(false);
    expect(isProspectExportPresetKey("CRM")).toBe(false);
  });
});

describe("isProspectCrmFieldMode", () => {
  it("accepts known CRM modes", () => {
    expect(isProspectCrmFieldMode("hubspot")).toBe(true);
    expect(isProspectCrmFieldMode("salesforce")).toBe(true);
    expect(isProspectCrmFieldMode("pipedrive")).toBe(true);
  });

  it("rejects unknown modes", () => {
    expect(isProspectCrmFieldMode("gmail")).toBe(false);
    expect(isProspectCrmFieldMode("")).toBe(false);
    expect(isProspectCrmFieldMode(null)).toBe(false);
  });
});

describe("getProspectExportColumns", () => {
  it("returns the CRM preset columns", () => {
    const columns = getProspectExportColumns("crm", "hubspot");
    expect(columns.length).toBeGreaterThan(0);
    expect(columns.map((c) => c.key)).toContain("companyName");
  });

  it("returns the email preset columns", () => {
    const columns = getProspectExportColumns("email");
    expect(columns.map((c) => c.key)).toContain("firstLine");
  });

  it("returns the brief preset columns", () => {
    const columns = getProspectExportColumns("brief");
    expect(columns.length).toBeGreaterThan(0);
  });

  it("returns Instantly and Smartlead specific columns", () => {
    const instantly = getProspectExportColumns("instantly");
    const smartlead = getProspectExportColumns("smartlead");
    expect(instantly.map((c) => c.key)).toContain("personalization");
    expect(instantly.map((c) => c.key)).toContain("customFieldFitScore");
    expect(smartlead.map((c) => c.key)).toContain("domain");
    expect(smartlead.map((c) => c.key)).toContain("customFieldSourceNotes");
  });

  it("returns the general LeadCue CSV columns", () => {
    const columns = getProspectExportColumns("csv");
    expect(columns.map((c) => c.key)).toContain("websiteSignals");
    expect(columns.map((c) => c.key)).toContain("pipelineNotes");
  });
});

describe("prospectCardToExportRecord", () => {
  it("returns a record with every CRM column populated", () => {
    const record = prospectCardToExportRecord({ card: SAMPLE_PROSPECT_CARD });
    expect(record.companyName).toBeTruthy();
    expect(record.domain).toBeTruthy();
    expect(typeof record.fitScore).toBe("number");
  });
});

describe("buildProspectExportCsv", () => {
  it("emits a header row and at least one data row", () => {
    const csv = buildProspectExportCsv([{ card: SAMPLE_PROSPECT_CARD }], "crm", "hubspot");
    const rows = csv.split(/\r?\n/).filter(Boolean);
    expect(rows.length).toBeGreaterThanOrEqual(2);
  });

  it("escapes fields that contain commas or quotes", () => {
    const card = {
      ...SAMPLE_PROSPECT_CARD,
      companyName: 'Acme, "Inc."',
      summary: "Line 1\nLine 2"
    };
    const csv = buildProspectExportCsv([{ card }], "crm", "hubspot");
    expect(csv).toMatch(/"Acme, ""Inc\.""";?/);
  });

  it("stays stable across CRM modes", () => {
    const hubspot = buildProspectExportCsv([{ card: SAMPLE_PROSPECT_CARD }], "crm", "hubspot");
    const salesforce = buildProspectExportCsv([{ card: SAMPLE_PROSPECT_CARD }], "crm", "salesforce");
    const pipedrive = buildProspectExportCsv([{ card: SAMPLE_PROSPECT_CARD }], "crm", "pipedrive");
    expect(hubspot.length).toBeGreaterThan(0);
    expect(salesforce.length).toBeGreaterThan(0);
    expect(pipedrive.length).toBeGreaterThan(0);

    // Header rows differ per CRM mode (field name translation)
    const hsHeader = hubspot.split(/\r?\n/)[0];
    const sfHeader = salesforce.split(/\r?\n/)[0];
    expect(hsHeader).not.toBe(sfHeader);
  });

  it("handles an empty input list gracefully", () => {
    const csv = buildProspectExportCsv([], "crm", "hubspot");
    // header only, no body row
    expect(csv.split(/\r?\n/).filter(Boolean).length).toBe(1);
  });

  it("emits Instantly custom fields", () => {
    const csv = buildProspectExportCsv([{ card: SAMPLE_PROSPECT_CARD }], "instantly");
    const header = csv.split(/\r?\n/)[0];
    expect(header).toContain("Personalization");
    expect(header).toContain("LeadCue Fit Score");
    expect(header).toContain("LeadCue Source Notes");
  });

  it("emits Smartlead and LeadCue CSV exports", () => {
    const smartlead = buildProspectExportCsv([{ card: SAMPLE_PROSPECT_CARD }], "smartlead");
    const leadcueCsv = buildProspectExportCsv([{ card: SAMPLE_PROSPECT_CARD }], "csv");
    expect(smartlead.split(/\r?\n/)[0]).toContain("domain");
    expect(leadcueCsv.split(/\r?\n/)[0]).toContain("website_signals");
  });
});

describe("formatPipelineStageLabel", () => {
  it("returns a friendly label for known stages", () => {
    expect(formatPipelineStageLabel("qualified")).toBeTruthy();
    expect(formatPipelineStageLabel("outreach_queued")).not.toContain("_");
  });
});
