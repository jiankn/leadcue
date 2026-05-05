import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  apiFetch,
  apiJson,
  ensureTestMode,
  testCleanup,
  testSignIn,
  uniqueTestEmail
} from "./helpers/client";

ensureTestMode();

type ScanResponse = {
  ok: boolean;
  status: string;
  scanId: string;
  leadId: string;
  creditsUsed: number;
  creditsCharged: number;
  prospect: {
    companyName: string;
    domain: string;
    fitScore: number;
  };
};

type CreditsResponse = {
  used: number;
  remaining: number;
  limit?: number;
  reset?: string | null;
  plan?: { id: string };
};

function buildScanRequest(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    page: {
      url: "https://northstar.example.com",
      title: "Northstar Studio",
      metaDescription: "Independent consultant helping DTC brands scale paid search.",
      h1: "Turn every visitor into a qualified lead",
      text: "We help mid-market DTC brands unlock 3x paid search efficiency with predictable reporting and a senior-only pod model. Trusted by 40+ brands.",
      links: [
        { text: "Pricing", href: "https://northstar.example.com/pricing" },
        { text: "Case studies", href: "https://northstar.example.com/work" }
      ]
    },
    icp: {
      serviceType: "seo",
      tone: "direct",
      targetIndustries: ["dtc", "consumer brands"],
      targetCountries: ["US", "CA"],
      offerDescription: "Senior paid search pod"
    },
    notes: "Missing pricing CTA above the fold.",
    ...overrides
  };
}

describe("/api/scans (authenticated)", () => {
  let cookie: string;
  let email: string;

  beforeAll(async () => {
    email = uniqueTestEmail("scan");
    const session = await testSignIn(email);
    cookie = session.cookie;
  });

  afterAll(async () => {
    await testCleanup(email);
  });

  it("completes a scan and records a lead", async () => {
    const res = await apiFetch("/api/scans", {
      method: "POST",
      headers: { cookie },
      body: buildScanRequest()
    });

    expect(res.status).toBe(200);
    const body = (await res.json()) as ScanResponse;
    expect(body.ok).toBe(true);
    expect(body.status).toBe("completed");
    expect(body.scanId).toMatch(/^scan_/);
    expect(body.leadId).toMatch(/^lead_/);
    expect(body.creditsCharged).toBe(1);
    expect(body.prospect.domain).toContain("northstar.example.com");

    const leads = await apiJson<{ leads: Array<{ id: string; domain: string }> }>("/api/leads", {
      headers: { cookie }
    });
    expect(leads.status).toBe(200);
    expect(leads.body.leads.some((lead) => lead.domain.includes("northstar.example.com"))).toBe(true);
  });

  it("rejects a scan with missing page.url (validation_failed)", async () => {
    const payload = buildScanRequest();
    (payload as { page: Partial<{ url: string }> }).page.url = "";

    const res = await apiFetch("/api/scans", {
      method: "POST",
      headers: { cookie },
      body: payload
    });
    expect(res.status).toBe(400);
    const body = (await res.json()) as { reason: string };
    expect(body.reason).toBe("validation_failed");
  });

  it("rejects search-results pages", async () => {
    const payload = buildScanRequest({
      page: {
        url: "https://www.google.com/search?q=agencies",
        title: "google search",
        metaDescription: "",
        h1: "search",
        text: "google search page for agencies in various cities with many results",
        links: []
      }
    });

    const res = await apiFetch("/api/scans", {
      method: "POST",
      headers: { cookie },
      body: payload
    });
    expect(res.status).toBe(400);
  });

  it("replays the same Idempotency-Key without consuming extra credits", async () => {
    const idempotencyKey = `idem_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const payload = buildScanRequest({
      page: {
        url: "https://idempotent-brand.example.com",
        title: "Idempotent Brand",
        metaDescription: "Same payload on every call.",
        h1: "Brand homepage",
        text: "This brand is selected specifically for idempotency replay testing with enough text to pass validation.",
        links: []
      }
    });

    const before = await apiJson<CreditsResponse>("/api/credits", { headers: { cookie } });
    const usedBefore = before.body.used;

    const first = await apiFetch("/api/scans", {
      method: "POST",
      headers: { cookie, "Idempotency-Key": idempotencyKey },
      body: payload
    });
    expect(first.status).toBe(200);

    const second = await apiFetch("/api/scans", {
      method: "POST",
      headers: { cookie, "Idempotency-Key": idempotencyKey },
      body: payload
    });
    expect(second.status).toBe(200);
    const secondBody = (await second.json()) as ScanResponse & { replay?: boolean };

    const after = await apiJson<CreditsResponse>("/api/credits", { headers: { cookie } });
    expect(after.body.used - usedBefore).toBe(1); // only one scan should have been charged
    expect(secondBody.scanId).toBeTruthy();
  });
});

describe("/api/credits", () => {
  it("reports a budget for a fresh workspace", async () => {
    const email = uniqueTestEmail("credits");
    const { cookie } = await testSignIn(email);

    const credits = await apiJson<CreditsResponse>("/api/credits", {
      headers: { cookie }
    });
    expect(credits.status).toBe(200);
    expect(typeof credits.body.remaining).toBe("number");
    expect(typeof credits.body.used).toBe("number");
    expect(credits.body.remaining).toBeGreaterThan(0);

    await testCleanup(email);
  });
});
