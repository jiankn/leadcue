import { expect, test } from "@playwright/test";
import { apiFetch, apiJson } from "./helpers/apiClient";
import { createTestUser, destroyTestUser, signInAndOpenApp, type TestUser } from "./helpers/testUser";

test.describe("Signup → Scan → Lead → Export end-to-end", () => {
  let user: TestUser;

  test.beforeAll(async () => {
    user = await createTestUser("e2e_main");
  });

  test.afterAll(async () => {
    if (user) {
      await destroyTestUser(user);
    }
  });

  test("dashboard loads after sign-in", async ({ page }) => {
    await signInAndOpenApp(page, user);

    await expect(page).toHaveURL(/\/app/);
    await expect(page.locator("nav.side-nav")).toBeVisible();
  });

  test("workspace API confirms session is healthy", async () => {
    const res = await apiFetch("/api/auth/me", {
      headers: { cookie: user.cookieHeader }
    });
    expect(res.ok).toBeTruthy();
    const body = (await res.json()) as { authenticated: boolean; user?: { email?: string } };
    expect(body.authenticated).toBe(true);
    expect(body.user?.email).toBe(user.email);
  });

  test("manual scan completes and persists a lead", async ({ page }) => {
    await signInAndOpenApp(page, user);
    await page.goto("/app/queue#scan-console");

    const scanConsole = page.locator("section.scan-console");
    const scanForm = scanConsole.locator("form.scan-form");
    const urlInput = scanForm.locator('input[name="url"]');
    const companyNameInput = scanForm.locator('input[name="companyName"]');
    const notesInput = scanForm.locator('textarea[name="notes"]');
    await expect(scanForm).toBeVisible();
    await expect(urlInput).toBeEditable();

    await urlInput.fill("https://acme.example.com");
    await expect(companyNameInput).toBeEditable();
    await companyNameInput.fill("Acme Example");
    await notesInput.fill("Visible CTA gap above the fold; pricing CTA missing on the homepage hero.");
    await scanForm.locator('button[type="submit"]').first().click();

    const status = scanForm.locator('[role="status"]');
    await expect(status).not.toHaveText("", { timeout: 30_000 });

    // Once the scan is done, the section should expose the saved prospect summary
    await expect(scanConsole.locator(".scan-preview")).toBeVisible({ timeout: 30_000 });

    // Verify the lead lands in /api/leads via the API as well
    const leads = await apiJson<{ leads: Array<{ companyName: string; domain: string }> }>(
      "/api/leads",
      { headers: { cookie: user.cookieHeader } }
    );
    expect(leads.leads.length).toBeGreaterThan(0);
    expect(leads.leads.some((lead) => lead.domain.includes("acme.example.com"))).toBe(true);
  });

  test("credits ledger reflects the scan", async () => {
    const credits = await apiJson<{ remaining: number; used: number; plan: { monthlyCredits: number } }>(
      "/api/credits",
      { headers: { cookie: user.cookieHeader } }
    );
    expect(credits.used).toBeGreaterThan(0);
    expect(credits.remaining).toBeLessThan(credits.plan.monthlyCredits);
  });

  test("CSV export endpoint returns a non-empty file", async () => {
    const exportResponse = await apiFetch("/api/exports", {
      method: "POST",
      headers: { cookie: user.cookieHeader },
      body: { preset: "crm", crmMode: "hubspot", scope: "all_qualified" }
    });
    expect(exportResponse.ok).toBeTruthy();
    expect(exportResponse.headers.get("content-type") ?? "").toContain("text/csv");

    const csv = await exportResponse.text();
    const lines = csv.split(/\r?\n/).filter(Boolean);
    expect(lines.length).toBeGreaterThan(1);
    expect(lines[0]).toMatch(/(^|,)name(,|$)/i);
  });
});
