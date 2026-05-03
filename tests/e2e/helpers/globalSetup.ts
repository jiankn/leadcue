import { API_URL, WEB_URL } from "./config";

async function probe(url: string, label: string, attempts = 30, delayMs = 1000): Promise<void> {
  for (let i = 0; i < attempts; i += 1) {
    try {
      const res = await fetch(url, { method: "GET" });
      if (res.ok || res.status < 500) {
        return;
      }
    } catch {
      // not yet ready
    }
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
  throw new Error(`[globalSetup] ${label} not reachable at ${url} after ${attempts} attempts`);
}

async function ensureTestModeEnabled(): Promise<void> {
  const res = await fetch(`${API_URL}/api/auth/test/sign-in`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({})
  });

  if (res.status === 404) {
    throw new Error(
      "[globalSetup] /api/auth/test/sign-in returned 404. Set LEADCUE_TEST_MODE=1 in apps/api/.dev.vars and restart wrangler."
    );
  }
}

export default async function globalSetup(): Promise<void> {
  await probe(`${WEB_URL}/`, "web (vite)");
  await probe(`${API_URL}/api/health`, "api (wrangler)");
  await ensureTestModeEnabled();
  console.log(`[globalSetup] web=${WEB_URL} api=${API_URL} ready`);
}
