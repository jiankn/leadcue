import type { BrowserContext, Page } from "@playwright/test";
import { API_URL, WEB_URL, uniqueTestEmail } from "./config";
import { apiFetch, testCleanup, testSignIn } from "./apiClient";

export type TestUser = {
  email: string;
  userId: string;
  workspaceId: string;
  cookieHeader: string;
};

function extractSetCookie(res: Response): string {
  const header = res.headers.get("set-cookie");
  if (!header) {
    throw new Error("No Set-Cookie returned from test sign-in. Confirm LEADCUE_TEST_MODE=1.");
  }
  const sessionCookie = header
    .split(/,\s*(?=[a-zA-Z_]+=)/)
    .find((entry) => entry.startsWith("leadcue_session="));
  if (!sessionCookie) {
    throw new Error("Set-Cookie did not include leadcue_session.");
  }
  return sessionCookie.split(";")[0];
}

export async function createTestUser(prefix = "user"): Promise<TestUser> {
  const email = uniqueTestEmail(prefix);
  const res = await apiFetch("/api/auth/test/sign-in", {
    method: "POST",
    body: { email, planId: "free" }
  });

  if (!res.ok) {
    let detail = "";
    try {
      detail = await res.text();
    } catch {
      detail = "";
    }
    throw new Error(`Test sign-in failed (${res.status}): ${detail}`);
  }

  const cookieHeader = extractSetCookie(res);
  const data = (await res.json()) as { email: string; userId: string; workspaceId: string };

  return {
    email: data.email,
    userId: data.userId,
    workspaceId: data.workspaceId,
    cookieHeader
  };
}

export async function destroyTestUser(user: TestUser): Promise<void> {
  try {
    await testCleanup(user.email);
  } catch (error) {
    console.warn(`[testUser] cleanup failed for ${user.email}`, error);
  }
}

function parseCookieKeyValue(cookie: string): { name: string; value: string } {
  const [name, ...rest] = cookie.split("=");
  return { name: name.trim(), value: rest.join("=") };
}

function originHosts(): { web: URL; api: URL } {
  return { web: new URL(WEB_URL), api: new URL(API_URL) };
}

export async function attachUserToContext(context: BrowserContext, user: TestUser): Promise<void> {
  const { name, value } = parseCookieKeyValue(user.cookieHeader);
  const { web, api } = originHosts();
  const cookies = [
    {
      name,
      value,
      domain: web.hostname,
      path: "/",
      httpOnly: true,
      secure: web.protocol === "https:",
      sameSite: web.protocol === "https:" ? ("None" as const) : ("Lax" as const)
    }
  ];

  if (api.hostname !== web.hostname) {
    cookies.push({
      name,
      value,
      domain: api.hostname,
      path: "/",
      httpOnly: true,
      secure: api.protocol === "https:",
      sameSite: api.protocol === "https:" ? ("None" as const) : ("Lax" as const)
    });
  }

  await context.addCookies(cookies);
}

export async function signInAndOpenApp(page: Page, user: TestUser, locale?: string): Promise<void> {
  await attachUserToContext(page.context(), user);
  const path = locale && locale !== "en" ? `/${locale}/app` : "/app";
  await page.goto(path);
}
