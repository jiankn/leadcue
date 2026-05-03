import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { apiFetch, ensureTestMode, testCleanup, testSignIn, uniqueTestEmail } from "./helpers/client";

ensureTestMode();

describe("/api/exports", () => {
  let cookie: string;
  let email: string;

  beforeAll(async () => {
    email = uniqueTestEmail("exp");
    const session = await testSignIn(email);
    cookie = session.cookie;

    // Run a scan so the export has a lead to emit
    await apiFetch("/api/scans", {
      method: "POST",
      headers: { cookie },
      body: {
        page: {
          url: "https://bright-export.example.com",
          title: "Bright Export Co",
          metaDescription: "B2B SaaS export demo.",
          h1: "Bright home",
          text: "This is a b2b SaaS landing page with enough visible copy to pass the scan validation threshold.",
          links: []
        }
      }
    });
  });

  afterAll(async () => {
    await testCleanup(email);
  });

  it("returns CSV with header + at least one row for CRM preset", async () => {
    const res = await apiFetch("/api/exports", {
      method: "POST",
      headers: { cookie },
      body: { preset: "crm", crmMode: "hubspot", scope: "all_qualified" }
    });
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type") ?? "").toContain("text/csv");

    const csv = await res.text();
    const lines = csv.split(/\r?\n/).filter(Boolean);
    expect(lines.length).toBeGreaterThanOrEqual(2);
    expect(lines[0]).toMatch(/(^|,)name(,|$)/i);
  });

  it("returns CSV for email preset", async () => {
    const res = await apiFetch("/api/exports", {
      method: "POST",
      headers: { cookie },
      body: { preset: "email" }
    });
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type") ?? "").toContain("text/csv");

    const csv = await res.text();
    const lines = csv.split(/\r?\n/).filter(Boolean);
    expect(lines.length).toBeGreaterThanOrEqual(2);
  });

  it("serves a Content-Disposition attachment header", async () => {
    const res = await apiFetch("/api/exports", {
      method: "POST",
      headers: { cookie },
      body: { preset: "crm" }
    });
    expect(res.headers.get("content-disposition") ?? "").toMatch(/attachment; filename=.*\.csv/i);
    await res.text();
  });
});

describe("/api/billing/checkout", () => {
  it("returns 503 or 400 gracefully when Stripe is not configured", async () => {
    const email = uniqueTestEmail("bill");
    const { cookie } = await testSignIn(email);

    const res = await apiFetch("/api/billing/checkout", {
      method: "POST",
      headers: { cookie },
      body: { planId: "starter" }
    });
    // Without STRIPE_SECRET_KEY + price ids, the endpoint must not 500
    expect([200, 400, 402, 503]).toContain(res.status);
    if (res.status === 200) {
      const body = (await res.json()) as { url?: string };
      expect(body.url).toBeTruthy();
    }

    await testCleanup(email);
  });
});

describe("/api/stripe/webhook", () => {
  it("rejects an unsigned webhook payload", async () => {
    const res = await apiFetch("/api/stripe/webhook", {
      method: "POST",
      body: "raw-not-a-valid-stripe-body"
    });
    // If signed secret missing -> 400; if secret present -> 400 invalid signature
    expect([400, 401, 503]).toContain(res.status);
  });
});
