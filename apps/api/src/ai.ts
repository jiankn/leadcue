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

interface GeminiGenerateContentResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
}

const DEFAULT_GEMINI_MODEL = "gemini-3.1-pro-preview";

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

async function callGemini(env: Env, prompt: string, options?: { json?: boolean }): Promise<string | null> {
  if (!env.GOOGLE_API_KEY) {
    return null;
  }

  const model = env.AI_MODEL || DEFAULT_GEMINI_MODEL;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": env.GOOGLE_API_KEY
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: 0.2,
        ...(options?.json ? { responseMimeType: "application/json" } : {})
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini API request failed with ${response.status}`);
  }

  const data = (await response.json()) as GeminiGenerateContentResponse;
  return data.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("").trim() || null;
}

function messagesToGeminiPrompt(messages: ReturnType<typeof buildProspectCardMessages>) {
  return messages.map((message) => `${message.role.toUpperCase()}:\n${message.content}`).join("\n\n");
}

export async function generateGeminiText(env: Env, prompt: string): Promise<string> {
  if (!prompt.trim()) {
    throw new Error("Missing prompt.");
  }

  if (!env.GOOGLE_API_KEY) {
    throw new Error("Missing GOOGLE_API_KEY.");
  }

  const text = await callGemini(env, prompt);

  if (!text) {
    throw new Error("Gemini returned an empty response.");
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

  if (env.GOOGLE_API_KEY) {
    try {
      const content = await callGemini(env, messagesToGeminiPrompt(messages), { json: true });
      const parsed = content ? parseJsonObject(content) : null;

      if (parsed) {
        return coerceProspectCard(parsed, { ...request, icp }, contactPoints);
      }
    } catch {
      return buildRuleBasedProspectCard({ ...request, icp });
    }
  }

  if (!env.AI_GATEWAY_URL || !env.AI_PROVIDER_API_KEY) {
    return buildRuleBasedProspectCard({ ...request, icp });
  }

  try {
    const response = await fetch(env.AI_GATEWAY_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.AI_PROVIDER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: env.AI_MODEL || DEFAULT_GEMINI_MODEL,
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
