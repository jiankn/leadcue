export type ServiceType = "seo" | "web_design" | "marketing" | "custom";

export type Tone = "direct" | "casual" | "professional";

export const supportedScanLocales = ["en", "zh", "ja", "ko", "de", "nl", "fr"] as const;
export type ScanLocale = (typeof supportedScanLocales)[number];

export interface ICPProfile {
  serviceType: ServiceType;
  targetIndustries: string[];
  targetCountries: string[];
  targetCompanySize?: string;
  offerDescription: string;
  tone: Tone;
  avoidedIndustries: string[];
  outputLocale?: ScanLocale;
}

export interface PageSnapshot {
  url: string;
  title: string;
  metaDescription?: string;
  h1?: string;
  text: string;
  links: string[];
  emails?: string[];
  phones?: string[];
}

export interface ContactPoints {
  emails: string[];
  phones: string[];
  contactPages: string[];
  socialLinks: string[];
}

export type OpportunityCategory = "web_design" | "seo" | "marketing" | "timing";

export interface OpportunitySignal {
  category: OpportunityCategory;
  signal: string;
  reason: string;
  source: string;
}

export interface SourceNote {
  claim: string;
  source: string;
}

export interface ProspectCard {
  companyName: string;
  website: string;
  domain: string;
  industry: string;
  summary: string;
  fitScore: number;
  fitReason: string;
  contactPoints: ContactPoints;
  opportunitySignals: OpportunitySignal[];
  outreachAngles: string[];
  firstLines: string[];
  shortEmail: string;
  sourceNotes: SourceNote[];
  confidenceScore: number;
  savedStatus?: "saved" | "unsaved";
  exportStatus?: "not_exported" | "exported";
  pipelineContext?: ProspectPipelineContext;
  pipelineActivity?: ProspectPipelineActivity[];
}

export type ProspectPipelineStage = "researching" | "qualified" | "outreach_queued" | "contacted" | "won" | "archived";

export interface ProspectPipelineContext {
  owner: string;
  stage: ProspectPipelineStage;
  notes: string;
  updatedAt: string | null;
}

export interface ProspectContextUpdateRequest {
  owner?: string;
  stage?: ProspectPipelineStage;
  notes?: string;
}

export interface ProspectPipelineActivity {
  id: string;
  actorName: string;
  actorEmail: string | null;
  action: "pipeline_context_updated";
  changedFields: Array<"owner" | "stage" | "notes">;
  previousValues: ProspectPipelineContext;
  currentValues: ProspectPipelineContext;
  createdAt: string;
}

export type QueueSource = "manual" | "csv" | "apollo" | "clay" | "directory" | "workspace";
export type WorkspaceResearchStatus = "queued" | "scanning" | "reviewing" | "qualified" | "archived";
export type LeadHandoffStatus = "pending" | "exported" | "outreach_queued" | "contacted" | "won";

export interface WorkspaceQueueItem {
  id: string;
  leadId: string | null;
  scanId: string | null;
  companyName: string;
  domain: string;
  websiteUrl: string;
  source: QueueSource;
  note: string;
  researchStatus: WorkspaceResearchStatus;
  handoffStatus: LeadHandoffStatus;
  createdAt: string;
  updatedAt: string | null;
}

export interface QueueImportItemInput {
  url: string;
  domain?: string;
  companyName?: string;
  source?: QueueSource;
  note?: string;
}

export interface QueueImportRequest {
  items: QueueImportItemInput[];
}

export type ExportRunStatus = "pending" | "completed" | "failed";
export type ExportRunScope = "all_qualified" | "selected";

export interface ExportRun {
  id: string;
  status: ExportRunStatus;
  leadCount: number;
  preset: "crm" | "email" | "brief" | "instantly" | "smartlead" | "csv";
  crmMode: "hubspot" | "salesforce" | "pipedrive";
  scope: ExportRunScope;
  fileName: string | null;
  leadIds: string[];
  createdAt: string;
  completedAt: string | null;
  createdByUserId: string | null;
}

export interface ExportRequest {
  preset?: "crm" | "email" | "brief" | "instantly" | "smartlead" | "csv";
  crmMode?: "hubspot" | "salesforce" | "pipedrive";
  leadIds?: string[];
  scope?: ExportRunScope;
}

export interface ScanRequest {
  source: "extension" | "web" | "api";
  locale?: ScanLocale;
  page: PageSnapshot;
  icp?: Partial<ICPProfile>;
  deepScan?: boolean;
  idempotencyKey?: string;
  companyName?: string;
  queueNote?: string;
  queueItemId?: string;
  queueSource?: QueueSource;
}

export interface FirstLineToolRequest {
  websiteUrl?: string;
  offerType?: ServiceType;
  tone?: Tone;
  locale?: ScanLocale;
  turnstileToken?: string;
}

export interface FirstLineToolSuccessResponse {
  ok: true;
  observation: string;
  firstLines: string[];
  fitPreview: string;
  sourceUrl: string;
  domain: string;
  lockedFields: string[];
  generatedWith: "ai" | "rule_based";
  rateLimit?: {
    remaining: number;
    resetAt: string;
  };
}

export interface FirstLineToolFailureResponse {
  ok: false;
  error: string;
  reason:
    | "validation_failed"
    | "turnstile_failed"
    | "rate_limited"
    | "fetch_failed"
    | "generation_failed";
  rateLimit?: {
    remaining: number;
    resetAt: string;
  };
}

export type FirstLineToolResponse = FirstLineToolSuccessResponse | FirstLineToolFailureResponse;

export interface OpportunityFinderToolRequest {
  websiteUrl?: string;
  offerType?: ServiceType;
  locale?: ScanLocale;
  turnstileToken?: string;
}

export interface OpportunityFinderFitPreview {
  label: string;
  score: number;
  reason: string;
  confidence: number;
}

export interface OpportunityFinderToolSuccessResponse {
  ok: true;
  opportunities: OpportunitySignal[];
  fitPreview: OpportunityFinderFitPreview;
  sourceUrl: string;
  domain: string;
  lockedFields: string[];
  generatedWith: "ai" | "rule_based";
  rateLimit?: {
    remaining: number;
    resetAt: string;
  };
}

export interface OpportunityFinderToolFailureResponse {
  ok: false;
  error: string;
  reason:
    | "validation_failed"
    | "turnstile_failed"
    | "rate_limited"
    | "fetch_failed"
    | "generation_failed";
  rateLimit?: {
    remaining: number;
    resetAt: string;
  };
}

export type OpportunityFinderToolResponse = OpportunityFinderToolSuccessResponse | OpportunityFinderToolFailureResponse;

export interface ProspectScoreToolRequest {
  websiteUrl?: string;
  offerType?: ServiceType;
  locale?: ScanLocale;
  turnstileToken?: string;
}

export interface ProspectScoreDimension {
  label: string;
  score: number;
  reason: string;
  evidence: string;
}

export interface ProspectScoreToolSuccessResponse {
  ok: true;
  score: number;
  label: string;
  summary: string;
  dimensions: ProspectScoreDimension[];
  strongestSignal: OpportunitySignal;
  sourceUrl: string;
  domain: string;
  lockedFields: string[];
  generatedWith: "ai" | "rule_based";
  rateLimit?: {
    remaining: number;
    resetAt: string;
  };
}

export interface ProspectScoreToolFailureResponse {
  ok: false;
  error: string;
  reason:
    | "validation_failed"
    | "turnstile_failed"
    | "rate_limited"
    | "fetch_failed"
    | "generation_failed";
  rateLimit?: {
    remaining: number;
    resetAt: string;
  };
}

export type ProspectScoreToolResponse = ProspectScoreToolSuccessResponse | ProspectScoreToolFailureResponse;

export type ScanFailureReason =
  | "validation_failed"
  | "workspace_unavailable"
  | "subscription_inactive"
  | "insufficient_credits"
  | "idempotency_conflict"
  | "duplicate_in_progress"
  | "generation_failed"
  | "persistence_failed";

export interface ScanResponse {
  ok: true;
  status: "completed";
  scanId: string;
  leadId: string;
  creditsUsed: number;
  creditsCharged: number;
  prospect: ProspectCard;
  queueItem?: WorkspaceQueueItem;
  idempotencyKey?: string;
  replayed?: boolean;
  originalCreditsCharged?: number;
}

export interface ScanFailureResponse {
  ok: false;
  status: "failed";
  reason: ScanFailureReason;
  error: string;
  creditsCharged: 0;
  retryable: boolean;
  scanId?: string;
  idempotencyKey?: string;
  replayed?: boolean;
}

export type ScanHistoryStatus = "completed" | "failed" | "replayed" | "processing";
export type ScanHistoryType = "basic" | "deep";

export interface ScanHistoryItem {
  id: string;
  url: string;
  domain: string;
  scanType: ScanHistoryType;
  status: ScanHistoryStatus;
  reason?: ScanFailureReason | "replayed" | "processing" | null;
  creditsUsed: number;
  creditsCharged: number;
  leadId?: string | null;
  companyName?: string | null;
  idempotencyKey?: string | null;
  replayed: boolean;
  createdAt: string;
  completedAt?: string | null;
}

export interface IcpUpdateRequest {
  serviceType?: ServiceType;
  targetIndustries?: string[];
  targetCountries?: string[];
  targetCompanySize?: string;
  offerDescription?: string;
  tone?: Tone;
  avoidedIndustries?: string[];
  outputLocale?: ScanLocale;
  firstProspectUrl?: string | null;
}

export interface LeadListItem {
  id: string;
  companyName: string;
  domain: string;
  websiteUrl: string;
  industry: string;
  fitScore: number;
  confidenceScore: number;
  createdAt: string;
  pipelineContext?: ProspectPipelineContext;
}

export interface PricingPlan {
  id: "free" | "pro" | "power";
  name: string;
  price: number;
  monthlyCredits: number;
  description: string;
}
