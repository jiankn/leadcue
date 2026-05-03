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

type OpenAICompatibleMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

const DEFAULT_AI_GATEWAY_URL = "https://api.deepseek.com/chat/completions";
const DEFAULT_DEEPSEEK_MODEL = "deepseek-v4-pro";

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

function getAiProviderApiKey(env: Env) {
  return env.DEEPSEEK_API_KEY || env.AI_PROVIDER_API_KEY;
}

function getAiGatewayUrl(env: Env) {
  const value = (env.AI_GATEWAY_URL || DEFAULT_AI_GATEWAY_URL).trim().replace(/\/+$/, "");

  if (value.endsWith("/chat/completions")) {
    return value;
  }

  return `${value}/chat/completions`;
}

function getAiModel(env: Env) {
  return env.AI_MODEL || DEFAULT_DEEPSEEK_MODEL;
}

export function hasAiProviderConfig(env: Env) {
  return Boolean(getAiProviderApiKey(env));
}

async function callAiProvider(env: Env, messages: OpenAICompatibleMessage[], options?: { json?: boolean }): Promise<string | null> {
  const apiKey = getAiProviderApiKey(env);

  if (!apiKey) {
    return null;
  }

  const body: Record<string, unknown> = {
    model: getAiModel(env),
    messages,
    temperature: 0.2,
    stream: false
  };

  if (options?.json) {
    body.response_format = { type: "json_object" };
  }

  const response = await fetch(getAiGatewayUrl(env), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error(`AI provider request failed with ${response.status}`);
  }

  const data = (await response.json()) as OpenAICompatibleResponse;
  return data.choices?.[0]?.message?.content?.trim() || null;
}

export async function generateAiText(env: Env, prompt: string): Promise<string> {
  if (!prompt.trim()) {
    throw new Error("Missing prompt.");
  }

  if (!hasAiProviderConfig(env)) {
    throw new Error("Missing AI_PROVIDER_API_KEY.");
  }

  const text = await callAiProvider(env, [{ role: "user", content: prompt }]);

  if (!text) {
    throw new Error("AI provider returned an empty response.");
  }

  return text;
}

export async function generateProspectCard(env: Env, request: ScanRequest): Promise<ProspectCard> {
  const icp: ICPProfile = { ...DEFAULT_ICP, ...request.icp };
  const contactPoints = classifyContactPoints(request.page);

  const messages = buildProspectCardMessages({
    icp,
    website: request.page,
    contactPoints,
    locale: request.locale
  });

  if (!hasAiProviderConfig(env)) {
    return buildRuleBasedProspectCard({ ...request, icp });
  }

  try {
    const content = await callAiProvider(env, messages, { json: true });
    const parsed = content ? parseJsonObject(content) : null;

    if (!parsed) {
      return buildRuleBasedProspectCard({ ...request, icp });
    }

    return coerceProspectCard(parsed, { ...request, icp }, contactPoints);
  } catch {
    return buildRuleBasedProspectCard({ ...request, icp });
  }
}
