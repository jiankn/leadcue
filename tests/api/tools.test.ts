import { describe, expect, it } from "vitest";
import { apiFetch, ensureTestMode } from "./helpers/client";

ensureTestMode();

type FirstLineToolResponse =
  | {
      ok: true;
      observation: string;
      firstLines: string[];
      fitPreview: string;
      sourceUrl: string;
      domain: string;
      generatedWith: "ai" | "rule_based";
      rateLimit?: { remaining: number; resetAt: string };
    }
  | {
      ok: false;
      reason: string;
      error: string;
    };

type OpportunityFinderToolResponse =
  | {
      ok: true;
      opportunities: Array<{
        category: string;
        signal: string;
        reason: string;
        source: string;
      }>;
      fitPreview: {
        label: string;
        score: number;
        reason: string;
        confidence: number;
      };
      sourceUrl: string;
      domain: string;
      generatedWith: "ai" | "rule_based";
      rateLimit?: { remaining: number; resetAt: string };
    }
  | {
      ok: false;
      reason: string;
      error: string;
    };

type ProspectScoreToolResponse =
  | {
      ok: true;
      score: number;
      label: string;
      summary: string;
      dimensions: Array<{
        label: string;
        score: number;
        reason: string;
        evidence: string;
      }>;
      strongestSignal: {
        category: string;
        signal: string;
        reason: string;
        source: string;
      };
      sourceUrl: string;
      domain: string;
      generatedWith: "ai" | "rule_based";
      rateLimit?: { remaining: number; resetAt: string };
    }
  | {
      ok: false;
      reason: string;
      error: string;
    };

describe("/api/tools/first-line", () => {
  it("generates recipient-safe first lines for a public website", async () => {
    const res = await apiFetch("/api/tools/first-line", {
      method: "POST",
      body: {
        websiteUrl: "https://northstar.example.com",
        offerType: "web_design",
        tone: "professional",
        locale: "en"
      }
    });

    expect(res.status).toBe(200);
    const body = (await res.json()) as FirstLineToolResponse;
    expect(body.ok).toBe(true);

    if (!body.ok) {
      return;
    }

    expect(body.domain).toBe("northstar.example.com");
    expect(body.generatedWith).toBe("rule_based");
    expect(body.observation.length).toBeGreaterThan(10);
    expect(body.firstLines.length).toBeGreaterThanOrEqual(1);
    expect(body.firstLines.length).toBeLessThanOrEqual(3);
    expect(body.firstLines.join(" ")).not.toMatch(/scan|crawl|audit|LeadCue|AI/i);
    expect(body.rateLimit?.remaining).toBeGreaterThanOrEqual(0);
  });

  it("rejects a missing website URL", async () => {
    const res = await apiFetch("/api/tools/first-line", {
      method: "POST",
      body: { websiteUrl: "" }
    });

    expect(res.status).toBe(400);
    const body = (await res.json()) as FirstLineToolResponse;
    expect(body.ok).toBe(false);
    if (!body.ok) {
      expect(body.reason).toBe("validation_failed");
    }
  });

  it("rejects private or local URLs", async () => {
    const res = await apiFetch("/api/tools/first-line", {
      method: "POST",
      body: { websiteUrl: "http://localhost:3000" }
    });

    expect(res.status).toBe(400);
    const body = (await res.json()) as FirstLineToolResponse;
    expect(body.ok).toBe(false);
    if (!body.ok) {
      expect(body.reason).toBe("validation_failed");
    }
  });
});

describe("/api/tools/opportunity-finder", () => {
  it("returns three opportunity signals and a fit preview", async () => {
    const res = await apiFetch("/api/tools/opportunity-finder", {
      method: "POST",
      body: {
        websiteUrl: "https://northstar.example.com",
        offerType: "web_design",
        locale: "en"
      }
    });

    expect(res.status).toBe(200);
    const body = (await res.json()) as OpportunityFinderToolResponse;
    expect(body.ok).toBe(true);

    if (!body.ok) {
      return;
    }

    expect(body.domain).toBe("northstar.example.com");
    expect(body.generatedWith).toBe("rule_based");
    expect(body.opportunities).toHaveLength(3);
    expect(body.opportunities[0].signal.length).toBeGreaterThan(10);
    expect(body.opportunities[0].reason.length).toBeGreaterThan(10);
    expect(body.opportunities[0].source.length).toBeGreaterThan(3);
    expect(body.fitPreview.score).toBeGreaterThanOrEqual(0);
    expect(body.fitPreview.score).toBeLessThanOrEqual(100);
    expect(body.rateLimit?.remaining).toBeGreaterThanOrEqual(0);
  });

  it("rejects private or local URLs", async () => {
    const res = await apiFetch("/api/tools/opportunity-finder", {
      method: "POST",
      body: { websiteUrl: "http://localhost:3000" }
    });

    expect(res.status).toBe(400);
    const body = (await res.json()) as OpportunityFinderToolResponse;
    expect(body.ok).toBe(false);
    if (!body.ok) {
      expect(body.reason).toBe("validation_failed");
    }
  });
});
describe("/api/tools/prospect-score", () => {
  it("returns a bounded prospect score with explainable dimensions", async () => {
    const res = await apiFetch("/api/tools/prospect-score", {
      method: "POST",
      body: {
        websiteUrl: "https://northstar.example.com",
        offerType: "web_design",
        locale: "en"
      }
    });

    expect(res.status).toBe(200);
    const body = (await res.json()) as ProspectScoreToolResponse;
    expect(body.ok).toBe(true);

    if (!body.ok) {
      return;
    }

    expect(body.domain).toBe("northstar.example.com");
    expect(body.generatedWith).toBe("rule_based");
    expect(body.score).toBeGreaterThanOrEqual(0);
    expect(body.score).toBeLessThanOrEqual(100);
    expect(body.label.length).toBeGreaterThan(5);
    expect(body.summary.length).toBeGreaterThan(10);
    expect(body.dimensions).toHaveLength(4);
    expect(body.dimensions[0].score).toBeGreaterThanOrEqual(0);
    expect(body.dimensions[0].score).toBeLessThanOrEqual(100);
    expect(body.dimensions[0].reason.length).toBeGreaterThan(10);
    expect(body.dimensions[0].evidence.length).toBeGreaterThan(3);
    expect(body.strongestSignal.signal.length).toBeGreaterThan(10);
    expect(body.rateLimit?.remaining).toBeGreaterThanOrEqual(0);
  });

  it("rejects private or local URLs", async () => {
    const res = await apiFetch("/api/tools/prospect-score", {
      method: "POST",
      body: { websiteUrl: "http://localhost:3000" }
    });

    expect(res.status).toBe(400);
    const body = (await res.json()) as ProspectScoreToolResponse;
    expect(body.ok).toBe(false);
    if (!body.ok) {
      expect(body.reason).toBe("validation_failed");
    }
  });
});