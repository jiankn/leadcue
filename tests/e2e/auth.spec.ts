import { expect, test } from "@playwright/test";
import { apiFetch, testCleanup } from "./helpers/apiClient";
import { uniqueTestEmail } from "./helpers/config";

test.describe("Email + password auth", () => {
  test("register a new account and land on /app", async ({ page }) => {
    const email = uniqueTestEmail("signup");
    const password = "LeadCueTest!2026";

    await page.goto("/signup?plan=free");

    // Robust selectors: only these two inputs are email+password on signup
    await page.locator('input[type="email"]').first().fill(email);
    await page.locator('input[type="password"]').first().fill(password);

    const submit = page.locator('form button[type="submit"]').first();
    await submit.click();

    await page.waitForURL(/\/app(\/|$|\?)/, { timeout: 15_000 });

    // After signup, /api/auth/me should confirm the session
    const cookies = await page.context().cookies();
    const cookieHeader = cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join("; ");
    const meResponse = await apiFetch("/api/auth/me", {
      headers: { cookie: cookieHeader }
    });
    expect(meResponse.ok).toBeTruthy();
    const me = (await meResponse.json()) as { authenticated: boolean; user?: { email?: string } };
    expect(me.authenticated).toBe(true);
    expect(me.user?.email).toBe(email);

    await testCleanup(email);
  });

  test("login with wrong password shows an error", async ({ page }) => {
    const email = uniqueTestEmail("badpass");

    // Pre-register via real signup API (NOT the test sign-in) so the password
    // credential is real, then try to log in with the wrong password.
    const registerResponse = await apiFetch("/api/auth/email/register", {
      method: "POST",
      body: { email, password: "CorrectHorseBattery!9" }
    });
    expect(registerResponse.ok).toBeTruthy();

    await page.goto("/login");
    await page.locator('input[type="email"]').first().fill(email);
    await page.locator('input[type="password"]').first().fill("definitely-wrong");
    await page.locator('form button[type="submit"]').first().click();

    // URL must remain on the login page; an error should be visible
    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator('[role="alert"]')).toContainText(/invalid|incorrect|unavailable|failed|error|wrong|错误|密码/i);

    await testCleanup(email);
  });

  test("password reset request returns ok for unknown email", async () => {
    const email = uniqueTestEmail("reset");
    const response = await apiFetch("/api/auth/password/request-reset", {
      method: "POST",
      body: { email }
    });
    // Should respond ok to avoid user enumeration
    expect([200, 202]).toContain(response.status);
    const body = (await response.json()) as { ok: boolean };
    expect(body.ok).toBe(true);
  });
});
