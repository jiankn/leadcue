import { beforeAll } from "vitest";

const API_URL = process.env.LEADCUE_API_URL ?? "http://localhost:8787";

export const TEST_EMAIL_DOMAIN = "leadcue.test";

export function uniqueTestEmail(prefix = "api"): string {
  const stamp = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 8);
  return `test_${prefix}_${stamp}_${random}@${TEST_EMAIL_DOMAIN}`;
}

function joinUrl(base: string, path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base.replace(/\/+$/, "")}${normalized}`;
}

export type FetchInit = Omit<RequestInit, "body"> & { body?: unknown };

export async function apiFetch(path: string, init: FetchInit = {}): Promise<Response> {
  const headers = new Headers(init.headers ?? {});
  let body: BodyInit | undefined;
  if (init.body !== undefined && init.body !== null) {
    if (typeof init.body === "string" || init.body instanceof URLSearchParams || init.body instanceof FormData) {
      body = init.body as BodyInit;
    } else {
      headers.set("Content-Type", "application/json");
      body = JSON.stringify(init.body);
    }
  }
  return fetch(joinUrl(API_URL, path), { ...init, headers, body });
}

export async function apiJson<T = unknown>(path: string, init: FetchInit = {}): Promise<{ status: number; body: T }> {
  const res = await apiFetch(path, init);
  const text = await res.text();
  let body: unknown = null;
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  }
  return { status: res.status, body: body as T };
}

export function extractSessionCookie(res: Response): string {
  const header = res.headers.get("set-cookie");
  if (!header) {
    throw new Error("Response did not include Set-Cookie");
  }
  const sessionCookie = header
    .split(/,\s*(?=[a-zA-Z_]+=)/)
    .find((entry) => entry.startsWith("leadcue_session="));
  if (!sessionCookie) {
    throw new Error("Set-Cookie header did not contain leadcue_session");
  }
  return sessionCookie.split(";")[0];
}

export async function testSignIn(email: string): Promise<{ cookie: string; workspaceId: string; userId: string }> {
  const res = await apiFetch("/api/auth/test/sign-in", {
    method: "POST",
    body: { email, planId: "free" }
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`testSignIn failed (${res.status}): ${text}`);
  }
  const cookie = extractSessionCookie(res);
  const data = (await res.json()) as { workspaceId: string; userId: string };
  return { cookie, workspaceId: data.workspaceId, userId: data.userId };
}

export async function testCleanup(email: string): Promise<void> {
  const res = await apiFetch("/api/auth/test/cleanup", {
    method: "POST",
    body: { email }
  });
  if (!res.ok) {
    const text = await res.text();
    console.warn(`[api-helper] cleanup failed for ${email} (${res.status}): ${text}`);
  }
}

export function ensureTestMode(): void {
  beforeAll(async () => {
    const res = await apiFetch("/api/auth/test/sign-in", {
      method: "POST",
      body: {}
    });
    if (res.status === 404) {
      throw new Error(
        "API test endpoints disabled. Set LEADCUE_TEST_MODE=1 in apps/api/.dev.vars and restart `wrangler dev`."
      );
    }
  });
}
