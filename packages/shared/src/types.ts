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

export interface ScanRequest {
  source: "extension" | "web" | "api";
  locale?: ScanLocale;
  page: PageSnapshot;
  icp?: Partial<ICPProfile>;
  deepScan?: boolean;
  idempotencyKey?: string;
}

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
  offerDescription?: string;
  tone?: Tone;
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
  id: "free" | "starter" | "pro" | "agency";
  name: string;
  price: number;
  monthlyCredits: number;
  description: string;
}
