import { buildProspectCardMessages } from "@leadcue/prompts";
import {
  buildRuleBasedProspectCard,
  classifyContactPoints,
  DEFAULT_ICP,
  extractDomain,
  type ContactPoints,
  type ICPProfile,
  type ProspectCard,
  type ScanRequest
} from "@leadcue/shared";
import type { Env } from "./env";

interface OpenAICompatibleResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}

function coerceProspectCard(
  value: Partial<ProspectCard>,
  request: ScanRequest,
  contactPoints: ContactPoints
): ProspectCard {
  const fallback = buildRuleBasedProspectCard(request);
  const domain = extractDomain(request.page.url);

  return {
    ...fallback,
    companyName: value.companyName || fallback.companyName,
    website: request.page.url,
    domain,
    industry: value.industry || fallback.industry,
    summary: value.summary || fallback.summary,
    fitScore: clampNumber(value.fitScore, 0, 100, fallback.fitScore),
    fitReason: value.fitReason || fallback.fitReason,
    contactPoints,
    opportunitySignals: value.opportunitySignals?.length
      ? value.opportunitySignals.slice(0, 6)
      : fallback.opportunitySignals,
    outreachAngles: value.outreachAngles?.length
      ? value.outreachAngles.slice(0, 4)
      : fallback.outreachAngles,
    firstLines: value.firstLines?.length ? value.firstLines.slice(0, 3) : fallback.firstLines,
    shortEmail: value.shortEmail || fallback.shortEmail,
    sourceNotes: value.sourceNotes?.length ? value.sourceNotes.slice(0, 8) : fallback.sourceNotes,
    confidenceScore: clampNumber(value.confidenceScore, 0, 1, fallback.confidenceScore),
    savedStatus: "saved",
    exportStatus: "not_exported"
  };
}

function clampNumber(value: unknown, min: number, max: number, fallback: number): number {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, value));
}

function parseJsonObject(content: string): Partial<ProspectCard> | null {
  try {
    return JSON.parse(content) as Partial<ProspectCard>;
  } catch {
    const match = content.match(/\{[\s\S]*\}/);
    if (!match) {
      return null;
    }

    try {
      return JSON.parse(match[0]) as Partial<ProspectCard>;
    } catch {
      return null;
    }
  }
}

export async function generateProspectCard(env: Env, request: ScanRequest): Promise<ProspectCard> {
  const icp: ICPProfile = { ...DEFAULT_ICP, ...request.icp };
  const contactPoints = classifyContactPoints(request.page);

  if (!env.AI_GATEWAY_URL || !env.AI_PROVIDER_API_KEY) {
    return buildRuleBasedProspectCard({ ...request, icp });
  }

  const messages = buildProspectCardMessages({
    icp,
    website: request.page,
    contactPoints
  });

  try {
    const response = await fetch(env.AI_GATEWAY_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.AI_PROVIDER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: env.AI_MODEL || "gpt-4.1-mini",
        messages,
        temperature: 0.2,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      return buildRuleBasedProspectCard({ ...request, icp });
    }

    const data = (await response.json()) as OpenAICompatibleResponse;
    const content = data.choices?.[0]?.message?.content;
    const parsed = content ? parseJsonObject(content) : null;

    if (!parsed) {
      return buildRuleBasedProspectCard({ ...request, icp });
    }

    return coerceProspectCard(parsed, { ...request, icp }, contactPoints);
  } catch {
    return buildRuleBasedProspectCard({ ...request, icp });
  }
}
