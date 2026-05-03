import { API_URL } from "./config";

type FetchInit = Omit<RequestInit, "body"> & { body?: unknown };

class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(status: number, body: unknown, message?: string) {
    super(message ?? `API ${status}`);
    this.status = status;
    this.body = body;
  }
}

function joinUrl(base: string, path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base.replace(/\/+$/, "")}${normalized}`;
}

export async function apiFetch(path: string, init: FetchInit = {}): Promise<Response> {
  const url = joinUrl(API_URL, path);
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

  return fetch(url, {
    ...init,
    headers,
    body
  });
}

export async function apiJson<T = unknown>(path: string, init: FetchInit = {}): Promise<T> {
  const res = await apiFetch(path, init);
  const text = await res.text();
  let parsed: unknown = null;
  if (text) {
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = text;
    }
  }

  if (!res.ok) {
    throw new ApiError(res.status, parsed, `API ${res.status} for ${path}`);
  }

  return parsed as T;
}

export async function testSignIn(email: string, planId: "free" | "starter" | "pro" | "agency" = "free") {
  return apiJson<{
    ok: true;
    email: string;
    userId: string;
    workspaceId: string;
    next: string;
  }>("/api/auth/test/sign-in", {
    method: "POST",
    body: { email, planId }
  });
}

export async function testCleanup(email: string) {
  return apiJson<{ ok: true }>("/api/auth/test/cleanup", {
    method: "POST",
    body: { email }
  });
}

export { ApiError };
