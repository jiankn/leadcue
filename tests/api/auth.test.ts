import { afterAll, describe, expect, it } from "vitest";
import {
  apiFetch,
  apiJson,
  ensureTestMode,
  extractSessionCookie,
  testCleanup,
  uniqueTestEmail
} from "./helpers/client";

ensureTestMode();

describe("/api/auth/email/register", () => {
  const createdEmails: string[] = [];
  afterAll(async () => {
    for (const email of createdEmails) {
      await testCleanup(email);
    }
  });

  it("creates a new user with a session cookie", async () => {
    const email = uniqueTestEmail("reg_ok");
    createdEmails.push(email);

    const res = await apiFetch("/api/auth/email/register", {
      method: "POST",
      body: { email, password: "GoodPassword!123" }
    });

    expect(res.status).toBe(200);
    const cookie = extractSessionCookie(res);
    expect(cookie).toMatch(/^leadcue_session=/);

    const me = await apiJson<{ authenticated: boolean; user: { email: string } }>("/api/auth/me", {
      headers: { cookie }
    });
    expect(me.status).toBe(200);
    expect(me.body.authenticated).toBe(true);
    expect(me.body.user.email).toBe(email);
  });

  it("rejects weak passwords", async () => {
    const email = uniqueTestEmail("reg_weak");
    createdEmails.push(email);

    const res = await apiFetch("/api/auth/email/register", {
      method: "POST",
      body: { email, password: "short" }
    });
    expect(res.status).toBe(400);
  });

  it("rejects duplicate email", async () => {
    const email = uniqueTestEmail("reg_dup");
    createdEmails.push(email);

    const first = await apiFetch("/api/auth/email/register", {
      method: "POST",
      body: { email, password: "GoodPassword!123" }
    });
    expect(first.status).toBe(200);

    const second = await apiFetch("/api/auth/email/register", {
      method: "POST",
      body: { email, password: "GoodPassword!123" }
    });
    expect(second.status).toBe(409);
  });
});

describe("/api/auth/email/login", () => {
  const createdEmails: string[] = [];
  afterAll(async () => {
    for (const email of createdEmails) {
      await testCleanup(email);
    }
  });

  it("succeeds with correct credentials", async () => {
    const email = uniqueTestEmail("login_ok");
    const password = "GoodPassword!123";
    createdEmails.push(email);

    await apiFetch("/api/auth/email/register", {
      method: "POST",
      body: { email, password }
    });

    const res = await apiFetch("/api/auth/email/login", {
      method: "POST",
      body: { email, password }
    });
    expect(res.status).toBe(200);
    const cookie = extractSessionCookie(res);

    const me = await apiJson<{ authenticated: boolean; user: { email: string } }>("/api/auth/me", {
      headers: { cookie }
    });
    expect(me.body.authenticated).toBe(true);
    expect(me.body.user.email).toBe(email);
  });

  it("fails with wrong password", async () => {
    const email = uniqueTestEmail("login_bad");
    createdEmails.push(email);

    await apiFetch("/api/auth/email/register", {
      method: "POST",
      body: { email, password: "Correct!Password1" }
    });

    const res = await apiFetch("/api/auth/email/login", {
      method: "POST",
      body: { email, password: "Totally-Wrong-9" }
    });
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.status).toBeLessThan(500);
  });
});

describe("/api/auth/logout", () => {
  it("clears the session cookie", async () => {
    const email = uniqueTestEmail("logout");

    const registered = await apiFetch("/api/auth/email/register", {
      method: "POST",
      body: { email, password: "GoodPassword!123" }
    });
    const cookie = extractSessionCookie(registered);

    const logout = await apiFetch("/api/auth/logout", {
      method: "POST",
      headers: { cookie }
    });
    expect(logout.status).toBe(200);
    const setCookieAfter = logout.headers.get("set-cookie") ?? "";
    expect(setCookieAfter).toMatch(/leadcue_session=/);
    expect(setCookieAfter.toLowerCase()).toMatch(/max-age=0|expires=thu, 01 jan 1970/);

    await testCleanup(email);
  });
});

describe("/api/auth/password/request-reset", () => {
  it("returns ok for unknown email (no enumeration)", async () => {
    const email = uniqueTestEmail("reset_unknown");
    const res = await apiJson<{ ok: boolean }>("/api/auth/password/request-reset", {
      method: "POST",
      body: { email }
    });
    expect([200, 202]).toContain(res.status);
    expect(res.body.ok).toBe(true);
  });
});
