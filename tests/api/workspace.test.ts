import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { apiFetch, apiJson, ensureTestMode, testCleanup, testSignIn, uniqueTestEmail } from "./helpers/client";

ensureTestMode();

type WorkspaceResponse = {
  setup: {
    serviceType: string;
    targetIndustries: string[];
    targetCountries: string[];
    targetCompanySize: string;
    offerDescription: string;
    tone: string;
    avoidedIndustries: string[];
    outputLocale: string;
    firstProspectUrl: string | null;
  };
};

describe("/api/workspace/icp", () => {
  let cookie: string;
  let email: string;

  beforeAll(async () => {
    email = uniqueTestEmail("workspace-icp");
    const session = await testSignIn(email);
    cookie = session.cookie;
  });

  afterAll(async () => {
    await testCleanup(email);
  });

  it("saves and returns the prospecting profile fields", async () => {
    const payload = {
      serviceType: "marketing",
      targetIndustries: ["B2B SaaS", "professional services"],
      targetCountries: ["US", "GB"],
      targetCompanySize: "10-200 employees",
      offerDescription: "We help consultants turn service pages into better qualified calls.",
      tone: "casual",
      avoidedIndustries: ["gambling", "crypto"],
      outputLocale: "zh",
      firstProspectUrl: "https://profile-target.example.com"
    };

    const save = await apiFetch("/api/workspace/icp", {
      method: "PATCH",
      headers: { cookie },
      body: payload
    });

    expect(save.status).toBe(200);
    const saved = (await save.json()) as WorkspaceResponse;
    expect(saved.setup.targetCompanySize).toBe(payload.targetCompanySize);
    expect(saved.setup.avoidedIndustries).toEqual(payload.avoidedIndustries);
    expect(saved.setup.outputLocale).toBe(payload.outputLocale);

    const workspace = await apiJson<WorkspaceResponse>("/api/workspace", { headers: { cookie } });
    expect(workspace.status).toBe(200);
    expect(workspace.body.setup.serviceType).toBe(payload.serviceType);
    expect(workspace.body.setup.targetCompanySize).toBe(payload.targetCompanySize);
    expect(workspace.body.setup.avoidedIndustries).toEqual(payload.avoidedIndustries);
    expect(workspace.body.setup.outputLocale).toBe(payload.outputLocale);
    expect(workspace.body.setup.firstProspectUrl).toBe(`${payload.firstProspectUrl}/`);
  });

  it("applies the saved prospecting profile to new scans", async () => {
    await apiFetch("/api/workspace/icp", {
      method: "PATCH",
      headers: { cookie },
      body: {
        serviceType: "web_design",
        targetIndustries: ["local services"],
        targetCountries: ["US"],
        targetCompanySize: "1-50 employees",
        offerDescription: "We help local service businesses make the next step easier to find.",
        tone: "professional",
        avoidedIndustries: ["gambling"],
        outputLocale: "zh"
      }
    });

    const scan = await apiFetch("/api/scans", {
      method: "POST",
      headers: { cookie },
      body: {
        source: "web",
        page: {
          url: "https://profile-inherited.example.com",
          title: "Profile Inherited Plumbing",
          metaDescription: "Local plumbing service with emergency repairs and seasonal maintenance plans.",
          h1: "Emergency plumbing help when homeowners need it",
          text:
            "Profile Inherited Plumbing helps homeowners book urgent repairs and maintenance plans. The site explains services clearly, but the contact path appears after several sections and customer proof is limited above the fold.",
          links: ["https://profile-inherited.example.com/services", "https://profile-inherited.example.com/contact"]
        },
        idempotencyKey: `profile_inherited_${Date.now()}`
      }
    });

    expect(scan.status).toBe(200);
    const body = (await scan.json()) as {
      ok: true;
      prospect: {
        firstLines: string[];
        shortEmail: string;
      };
    };
    expect(body.ok).toBe(true);
    expect(`${body.prospect.firstLines.join(" ")} ${body.prospect.shortEmail}`).toMatch(/我|网站|你好/);
  });
});
