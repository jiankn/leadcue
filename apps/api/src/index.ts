import { Hono, type Context } from "hono";
import { cors } from "hono/cors";
import {
  DEFAULT_ICP,
  PRICING_PLANS,
  SAMPLE_PROSPECT_CARD,
  buildSampleProspectCard,
  buildProspectExportCsv,
  extractDomain,
  getSampleLocaleContent,
  isProspectCrmFieldMode,
  isProspectExportPresetKey,
  supportedScanLocales,
  type ExportRequest,
  type ExportRun,
  type ExportRunScope,
  type IcpUpdateRequest,
  type LeadHandoffStatus,
  type ProspectContextUpdateRequest,
  type LeadListItem,
  type ProspectCard,
  type QueueImportRequest,
  type QueueSource,
  type ProspectPipelineActivity,
  type ProspectPipelineContext,
  type ProspectPipelineStage,
  type PricingPlan,
  type ScanFailureReason,
  type ScanFailureResponse,
  type ScanHistoryItem,
  type ScanLocale,
  type ScanRequest,
  type ScanResponse,
  type WorkspaceQueueItem,
  type WorkspaceResearchStatus
} from "@leadcue/shared";
import { generateGeminiText, generateProspectCard } from "./ai";
import type { Env } from "./env";

type Variables = {
  requestId: string;
};

type AppContext = Context<{ Bindings: Env; Variables: Variables }>;
type SignupRequest = {
  email?: string;
  password?: string;
  planId?: string;
  agencyFocus?: string;
  agencyWebsite?: string;
  offerDescription?: string;
  targetIndustries?: string;
  firstProspectUrl?: string;
};
type WorkspaceCreateRequest = {
  workspaceName?: string;
  planId?: string;
  agencyFocus?: string;
  offerDescription?: string;
  targetIndustries?: string;
  firstProspectUrl?: string;
};
type EmailLoginRequest = {
  email?: string;
  password?: string;
};
type PasswordResetRequest = {
  email?: string;
};
type PasswordResetSubmitRequest = {
  token?: string;
  password?: string;
};
type PasswordUpdateRequest = {
  currentPassword?: string;
  nextPassword?: string;
};
type ProfileUpdateRequest = {
  name?: string;
  workspaceName?: string;
};
type AnalyticsEventRequest = {
  name?: string;
  page?: string;
  metadata?: Record<string, unknown>;
};
type AnalyticsSummaryCountRow = {
  name: string;
  count: number;
};
type AnalyticsSummaryPageRow = {
  path: string | null;
  count: number;
};
type AnalyticsRecentEventRow = {
  id: string;
  event_name: string;
  page_path: string | null;
  metadata_json: string | null;
  created_at: string;
};
type PasswordCredential = {
  hash: string;
  salt: string;
  iterations: number;
};
type CheckoutRequest = {
  workspaceId?: string;
  planId?: string;
  email?: string;
};
type PortalRequest = {
  workspaceId?: string;
};
type GeminiPromptRequest = {
  prompt?: string;
};
type GoogleOauthMetadata = {
  intent: "login" | "signup";
  planId?: PricingPlan["id"];
  focus?: string;
  returnTo?: string;
};
type PasswordResetTokenRow = {
  id: string;
  user_id: string;
  expires_at: string;
  consumed_at: string | null;
};

const app = new Hono<{ Bindings: Env; Variables: Variables }>();
const ACTIVE_SUBSCRIPTION_STATUSES = new Set(["active", "trialing"]);
const SESSION_COOKIE_NAME = "leadcue_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;
const GOOGLE_AUTH_SCOPES = ["openid", "email", "profile"].join(" ");
const PASSWORD_HASH_ITERATIONS = 120_000;

app.use("*", async (c, next) => {
  c.set("requestId", crypto.randomUUID());
  await next();
});

app.use(
  "/api/*",
  cors({
    origin: (origin) => origin || "*",
    allowHeaders: ["Content-Type", "Authorization", "X-Workspace-Id", "X-LeadCue-Locale"],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true
  })
);

app.get("/api/health", (c) =>
  c.json({
    ok: true,
    service: "leadcue-api",
    requestId: c.get("requestId")
  })
);

app.get("/api/config", (c) =>
  c.json({
    appUrl: c.env.APP_URL || "https://leadcue.app",
    pricing: PRICING_PLANS,
    defaultIcp: DEFAULT_ICP,
    googleAuthEnabled: Boolean(c.env.GOOGLE_CLIENT_ID && c.env.GOOGLE_CLIENT_SECRET && c.env.GOOGLE_REDIRECT_URI)
  })
);

app.post("/api/ai/gemini", async (c) => {
  const body = (await c.req.json<GeminiPromptRequest>().catch(() => ({}))) as GeminiPromptRequest;
  const prompt = body.prompt?.trim();

  if (!prompt) {
    return c.json({ ok: false, error: "Missing prompt." }, 400);
  }

  if (!c.env.GOOGLE_API_KEY) {
    return c.json({ ok: false, error: "Server is missing GOOGLE_API_KEY." }, 500);
  }

  try {
    const text = await generateGeminiText(c.env, prompt);
    return c.json({ ok: true, text });
  } catch (error) {
    console.error("gemini_api_failed", error);
    return c.json({ ok: false, error: "Gemini API request failed." }, 502);
  }
});

app.get("/api/auth/me", async (c) => {
  if (!c.env.DB) {
    return c.json({ authenticated: false });
  }

  const session = await getAuthenticatedSession(c);
  if (!session) {
    return c.json({ authenticated: false });
  }

  return c.json({
    authenticated: true,
    user: {
      id: session.user_id,
      email: session.email,
      name: session.name
    },
    workspace: {
      id: session.workspace_id,
      name: session.workspace_name
    }
  });
});

app.post("/api/auth/logout", async (c) => {
  if (c.env.DB) {
    const token = getSessionToken(c);
    if (token) {
      await c.env.DB.prepare(`DELETE FROM auth_sessions WHERE session_token_hash = ?`)
        .bind(await sha256(token))
        .run();
    }
  }

  clearSessionCookie(c);
  return c.json({ ok: true });
});

app.get("/api/extension/session", async (c) => {
  const baseUrl = appUrl(c.env);
  const links = {
    appUrl: baseUrl,
    dashboardUrl: `${baseUrl}/app`,
    loginUrl: `${baseUrl}/login`,
    signupUrl: `${baseUrl}/login`,
    billingUrl: `${baseUrl}/app/billing`,
    supportUrl: `${baseUrl}/support`
  };

  if (!c.env.DB) {
    return c.json({
      authenticated: false,
      available: false,
      reason: "database_unavailable",
      ...links
    });
  }

  const session = await getAuthenticatedSession(c);
  if (!session?.workspace_id) {
    return c.json({
      authenticated: false,
      available: true,
      reason: "sign_in_required",
      ...links
    });
  }

  const snapshot = await getWorkspaceSnapshot(c.env.DB, session.workspace_id);
  if (!snapshot) {
    return c.json({
      authenticated: false,
      available: true,
      reason: "workspace_not_found",
      ...links
    });
  }

  return c.json({
    authenticated: true,
    available: true,
    user: {
      id: session.user_id,
      email: session.email,
      name: session.name
    },
    workspace: snapshot.workspace,
    onboarding: snapshot.onboarding,
    plan: snapshot.plan,
    subscription: snapshot.subscription,
    credits: snapshot.credits,
    ...links
  });
});

app.post("/api/auth/email/login", async (c) => {
  if (!c.env.DB) {
    return c.json({ ok: false, error: "Email password sign-in is unavailable until the workspace database is ready." }, 503);
  }

  const body = (await c.req.json<EmailLoginRequest>().catch(() => ({}))) as EmailLoginRequest;
  const email = body.email?.trim().toLowerCase();
  const password = body.password || "";

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 8) {
    return c.json({ ok: false, error: "Enter a valid email and password." }, 400);
  }

  const user = await c.env.DB.prepare(
    `SELECT id, email, name, password_hash, password_salt, password_iterations
     FROM users
     WHERE email = ?
     LIMIT 1`
  )
    .bind(email)
    .first<EmailPasswordUserRow>();

  if (!user?.password_hash || !user.password_salt || !user.password_iterations) {
    return c.json({ ok: false, error: "This workspace does not have email password sign-in set up yet." }, 401);
  }

  const isValidPassword = await verifyPassword(password, {
    hash: user.password_hash,
    salt: user.password_salt,
    iterations: user.password_iterations
  });

  if (!isValidPassword) {
    return c.json({ ok: false, error: "Email or password is incorrect." }, 401);
  }

  await c.env.DB.prepare(`UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?`).bind(user.id).run();
  await createUserSession(c, c.env.DB, user.id);

  return c.json({
    ok: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name
    },
    next: "/app"
  });
});

app.post("/api/auth/password/request-reset", async (c) => {
  if (!c.env.DB) {
    return c.json({ ok: false, error: "Password reset is unavailable until the workspace database is ready." }, 503);
  }

  const body = (await c.req.json<PasswordResetRequest>().catch(() => ({}))) as PasswordResetRequest;
  const email = body.email?.trim().toLowerCase();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return c.json({ ok: false, error: "Enter the workspace email address you used to sign in." }, 400);
  }

  const user = await c.env.DB.prepare(
    `SELECT id, email, password_hash, password_salt, password_iterations
     FROM users
     WHERE email = ?
     LIMIT 1`
  )
    .bind(email)
    .first<EmailPasswordUserRow>();

  if (!user?.id || !user.password_hash || !user.password_salt || !user.password_iterations) {
    return c.json({
      ok: true,
      message: "If that email belongs to a workspace, a one-time reset link has been prepared."
    });
  }

  const token = `reset_${crypto.randomUUID()}_${crypto.randomUUID()}`;
  const tokenHash = await sha256(token);
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();

  await c.env.DB.prepare(`DELETE FROM password_reset_tokens WHERE user_id = ? OR expires_at <= ?`)
    .bind(user.id, new Date().toISOString())
    .run()
    .catch(() => null);

  await c.env.DB.prepare(
    `INSERT INTO password_reset_tokens
      (id, user_id, email, token_hash, expires_at, created_at)
     VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`
  )
    .bind(`pwreset_${await shortHash(token)}`, user.id, email, tokenHash, expiresAt)
    .run();

  const resetUrl = `${appUrl(c.env).replace(/\/$/, "")}/reset-password?token=${encodeURIComponent(token)}`;

  return c.json({
    ok: true,
    message: "If that email belongs to a workspace, a one-time reset link has been prepared.",
    resetUrl: isLocalAppUrl(c.env) ? resetUrl : undefined
  });
});

app.post("/api/auth/password/reset", async (c) => {
  if (!c.env.DB) {
    return c.json({ ok: false, error: "Password reset is unavailable until the workspace database is ready." }, 503);
  }

  const body = (await c.req.json<PasswordResetSubmitRequest>().catch(() => ({}))) as PasswordResetSubmitRequest;
  const token = body.token?.trim();
  const password = body.password || "";

  if (!token || password.length < 8) {
    return c.json({ ok: false, error: "A valid reset token and an 8+ character password are required." }, 400);
  }

  const tokenHash = await sha256(token);
  const resetRow = await c.env.DB.prepare(
    `SELECT id, user_id, expires_at, consumed_at
     FROM password_reset_tokens
     WHERE token_hash = ?
     LIMIT 1`
  )
    .bind(tokenHash)
    .first<PasswordResetTokenRow>();

  if (!resetRow || resetRow.consumed_at || Date.parse(resetRow.expires_at) <= Date.now()) {
    return c.json({ ok: false, error: "This reset link has expired. Request a new password reset." }, 400);
  }

  const credential = await createPasswordCredential(password);

  await c.env.DB.batch([
    c.env.DB
      .prepare(
        `UPDATE users
         SET password_hash = ?, password_salt = ?, password_iterations = ?, password_updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`
      )
      .bind(credential.hash, credential.salt, credential.iterations, resetRow.user_id),
    c.env.DB
      .prepare(`UPDATE password_reset_tokens SET consumed_at = CURRENT_TIMESTAMP WHERE id = ?`)
      .bind(resetRow.id)
  ]);

  await createUserSession(c, c.env.DB, resetRow.user_id);

  return c.json({
    ok: true,
    next: "/app?login=1"
  });
});

app.post("/api/auth/password/update", async (c) => {
  if (!c.env.DB) {
    return c.json({ ok: false, error: "Password updates are unavailable until the workspace database is ready." }, 503);
  }

  const session = await getAuthenticatedSession(c);
  if (!session) {
    return c.json({ ok: false, error: "Sign in before changing the workspace password." }, 401);
  }

  const body = (await c.req.json<PasswordUpdateRequest>().catch(() => ({}))) as PasswordUpdateRequest;
  const currentPassword = body.currentPassword || "";
  const nextPassword = body.nextPassword || "";

  if (nextPassword.length < 8) {
    return c.json({ ok: false, error: "Use at least 8 characters for the new password." }, 400);
  }

  const user = await c.env.DB.prepare(
    `SELECT id, password_hash, password_salt, password_iterations
     FROM users
     WHERE id = ?
     LIMIT 1`
  )
    .bind(session.user_id)
    .first<EmailPasswordUserRow>();

  const hasExistingPassword = Boolean(user?.password_hash && user.password_salt && user.password_iterations);
  if (hasExistingPassword) {
    if (!currentPassword) {
      return c.json({ ok: false, error: "Enter the current password before setting a new one." }, 400);
    }

    const isValid = await verifyPassword(currentPassword, {
      hash: user!.password_hash!,
      salt: user!.password_salt!,
      iterations: user!.password_iterations!
    });

    if (!isValid) {
      return c.json({ ok: false, error: "Current password is incorrect." }, 401);
    }
  }

  const credential = await createPasswordCredential(nextPassword);
  await c.env.DB.prepare(
    `UPDATE users
     SET password_hash = ?, password_salt = ?, password_iterations = ?, password_updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`
  )
    .bind(credential.hash, credential.salt, credential.iterations, session.user_id)
    .run();

  return c.json({ ok: true, message: "Password updated." });
});

app.patch("/api/account/profile", async (c) => {
  if (!c.env.DB) {
    return c.json({ ok: false, error: "Profile updates are unavailable until the workspace database is ready." }, 503);
  }

  const session = await getAuthenticatedSession(c);
  if (!session) {
    return c.json({ ok: false, error: "Sign in before updating workspace profile details." }, 401);
  }

  const body = (await c.req.json<ProfileUpdateRequest>().catch(() => ({}))) as ProfileUpdateRequest;
  const name = body.name?.trim();
  const workspaceName = body.workspaceName?.trim();

  if (!name || !workspaceName) {
    return c.json({ ok: false, error: "Owner name and workspace name are both required." }, 400);
  }

  await c.env.DB.batch([
    c.env.DB.prepare(`UPDATE users SET name = ? WHERE id = ?`).bind(name, session.user_id),
    c.env.DB.prepare(`UPDATE workspaces SET name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).bind(workspaceName, session.workspace_id)
  ]);

  return c.json({
    ok: true,
    user: {
      id: session.user_id,
      email: session.email,
      name
    },
    workspace: {
      id: session.workspace_id,
      name: workspaceName
    }
  });
});

app.get("/api/auth/google/start", async (c) => {
  const intent = c.req.query("intent") === "signup" ? "signup" : "login";
  const planId = (c.req.query("planId") as PricingPlan["id"] | null) ?? undefined;
  const focus = c.req.query("focus") ?? undefined;
  const returnTo = safeReturnPath(c.req.query("returnTo"), "/app");
  const errorPath = "/login";

  if (!googleAuthConfigured(c.env)) {
    return c.redirect(`${appUrl(c.env)}${appendPathQuery(errorPath, "auth_error", "google_not_configured")}`);
  }

  if (!c.env.DB) {
    return c.redirect(`${appUrl(c.env)}${appendPathQuery(errorPath, "auth_error", "database_unavailable")}`);
  }

  const state = `oauth_${crypto.randomUUID()}`;
  const codeVerifier = randomBase64Url(48);
  const codeChallenge = await pkceChallenge(codeVerifier);
  const metadata: GoogleOauthMetadata = {
    intent,
    planId: planId && PRICING_PLANS.some((plan) => plan.id === planId) ? planId : undefined,
    focus,
    returnTo
  };

  await c.env.DB.prepare(
    `INSERT INTO oauth_states
      (id, state, code_verifier_hash, code_verifier, redirect_uri, metadata_json, expires_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      `oauth_${crypto.randomUUID()}`,
      state,
      await sha256(codeVerifier),
      codeVerifier,
      returnTo,
      JSON.stringify(metadata),
      new Date(Date.now() + 10 * 60 * 1000).toISOString()
    )
    .run();

  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.set("client_id", c.env.GOOGLE_CLIENT_ID!);
  authUrl.searchParams.set("redirect_uri", c.env.GOOGLE_REDIRECT_URI!);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", GOOGLE_AUTH_SCOPES);
  authUrl.searchParams.set("state", state);
  authUrl.searchParams.set("prompt", "select_account");
  authUrl.searchParams.set("include_granted_scopes", "true");
  authUrl.searchParams.set("code_challenge", codeChallenge);
  authUrl.searchParams.set("code_challenge_method", "S256");

  return c.redirect(authUrl.toString());
});

app.get("/api/auth/google/callback", async (c) => {
  const state = c.req.query("state");
  const code = c.req.query("code");
  const oauthError = c.req.query("error");

  if (!c.env.DB) {
    return c.redirect(`${appUrl(c.env)}/login?auth_error=database_unavailable`);
  }

  if (!state) {
    return c.redirect(`${appUrl(c.env)}/login?auth_error=state_missing`);
  }

  const pending = await c.env.DB.prepare(
    `SELECT id, state, code_verifier, redirect_uri, metadata_json, expires_at
     FROM oauth_states
     WHERE state = ?
     LIMIT 1`
  )
    .bind(state)
    .first<OauthStateRow>();

  if (!pending || new Date(pending.expires_at).getTime() < Date.now()) {
    return c.redirect(`${appUrl(c.env)}/login?auth_error=state_invalid`);
  }

  await c.env.DB.prepare(`DELETE FROM oauth_states WHERE id = ?`).bind(pending.id).run();

  const metadata = parseJson<GoogleOauthMetadata>(pending.metadata_json, {
    intent: "login",
    returnTo: "/app"
  });
  const errorPath = "/login";

  if (oauthError || !code || !pending.code_verifier) {
    return c.redirect(`${appUrl(c.env)}${appendPathQuery(errorPath, "auth_error", oauthError || "oauth_cancelled")}`);
  }

  try {
    const tokenPayload = await exchangeGoogleCode(c.env, code, pending.code_verifier);
    const profile = await fetchGoogleUserProfile(tokenPayload.access_token);
    const authResult = await signInWithGoogleUser(c.env, c.env.DB, {
      profile,
      metadata
    });

    await createUserSession(c, c.env.DB, authResult.userId);

    if (authResult.checkoutUrl) {
      return c.redirect(authResult.checkoutUrl);
    }

    const successPath = appendPathQuery(
      safeReturnPath(metadata.returnTo, "/app"),
      authResult.isNewUser ? "welcome" : "login",
      "1"
    );
    return c.redirect(`${appUrl(c.env)}${successPath}`);
  } catch (error) {
    console.error("google_oauth_callback_failed", error);
    return c.redirect(`${appUrl(c.env)}${appendPathQuery(errorPath, "auth_error", "google_exchange_failed")}`);
  }
});

app.post("/api/signup-intents", async (c) => {
  const body = (await c.req.json<SignupRequest>().catch(() => ({}))) as SignupRequest;
  const email = body.email?.trim().toLowerCase();
  const selectedPlan = PRICING_PLANS.find((plan) => plan.id === body.planId) ?? PRICING_PLANS[0];

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return c.json({ ok: false, error: "A valid work email is required." }, 400);
  }

  if (!body.offerDescription?.trim()) {
    return c.json({ ok: false, error: "Offer description is required." }, 400);
  }

  const password = body.password || "";
  if (password && password.length < 8) {
    return c.json({ ok: false, error: "Password must be at least 8 characters." }, 400);
  }

  const ids = await commercialIdsForEmail(email);
  const signupIntentId = `signup_${crypto.randomUUID()}`;
  const workspaceName = workspaceNameFromSignup(email, body.agencyWebsite);
  const passwordCredential = password ? await createPasswordCredential(password) : null;
  let checkoutUrl: string | undefined;
  let billingStatus: "active" | "pending_checkout" | "configuration_required" = "active";

  if (c.env.DB) {
    try {
      await createCommercialWorkspace(c.env.DB, {
        ...ids,
        email,
        workspaceName,
        selectedPlan,
        passwordCredential,
        agencyFocus: body.agencyFocus,
        offerDescription: body.offerDescription.trim(),
        targetIndustries: body.targetIndustries,
        firstProspectUrl: body.firstProspectUrl
      });
      await createUserSession(c, c.env.DB, ids.userId);
    } catch (error) {
      console.error("commercial_workspace_create_failed", error);
      return c.json({ ok: false, error: "Unable to create workspace. Please try again." }, 500);
    }

    try {
      await persistSignupIntent(c.env.DB, {
        id: signupIntentId,
        userId: ids.userId,
        workspaceId: ids.workspaceId,
        email,
        planId: selectedPlan.id,
        agencyFocus: body.agencyFocus,
        agencyWebsite: body.agencyWebsite,
        offerDescription: body.offerDescription.trim(),
        targetIndustries: body.targetIndustries,
        firstProspectUrl: body.firstProspectUrl
      });
    } catch (error) {
      console.error("signup_intent_persist_failed", error);
    }
  }

  if (selectedPlan.id !== "free") {
    billingStatus = "pending_checkout";
    const checkout = await createStripeCheckoutSession(c.env, {
      workspaceId: ids.workspaceId,
      signupIntentId,
      email,
      plan: selectedPlan
    });

    if (checkout.status === "created") {
      checkoutUrl = checkout.url;
    } else if (checkout.status === "not_configured") {
      billingStatus = "configuration_required";
    } else {
      return c.json({ ok: false, error: checkout.error }, 502);
    }
  }

  return c.json({
    ok: true,
    userId: ids.userId,
    workspaceId: ids.workspaceId,
    signupIntentId,
    plan: selectedPlan,
    next: selectedPlan.id === "free" ? "dashboard" : "checkout",
    billingStatus,
    checkoutUrl
  });
});

app.get("/api/workspace", async (c) => {
  const workspaceId = await resolveWorkspaceId(c);
  const locale = resolveApiLocale(c);

  if (!c.env.DB) {
    return c.json(sampleWorkspaceSnapshot(workspaceId, locale));
  }

  const session = await getAuthenticatedSession(c);
  if (session && !session.workspace_id && workspaceId === "ws_demo") {
    return c.json({ ok: false, error: "Create a workspace before loading workspace data." }, 404);
  }

  try {
    if (workspaceId === "ws_demo") {
      await ensureDemoWorkspace(c.env.DB, workspaceId);
    }

    const snapshot = await getWorkspaceSnapshot(c.env.DB, workspaceId);
    if (!snapshot) {
      return c.json({ ok: false, error: "Workspace not found." }, 404);
    }

    return c.json(snapshot);
  } catch (error) {
    console.error("workspace_snapshot_failed", error);
    return c.json({
      ...sampleWorkspaceSnapshot(workspaceId, locale),
      warning: "D1 is not initialized. Apply migrations to enable workspace persistence."
    });
  }
});

app.post("/api/workspace/create", async (c) => {
  if (!c.env.DB) {
    return c.json({ ok: false, error: "Workspace creation is unavailable until the database is ready." }, 503);
  }

  const session = await getAuthenticatedSession(c);
  if (!session) {
    return c.json({ ok: false, error: "Sign in before creating a workspace." }, 401);
  }

  if (session.workspace_id) {
    const snapshot = await getWorkspaceSnapshot(c.env.DB, session.workspace_id);
    return c.json({ ok: true, existing: true, next: "dashboard", snapshot });
  }

  const body = (await c.req.json<WorkspaceCreateRequest>().catch(() => ({}))) as WorkspaceCreateRequest;
  const selectedPlan = getPlan(body.planId || "free");
  const ids = await commercialIdsForEmail(session.email);
  const workspaceName = body.workspaceName?.trim() || workspaceNameFromSignup(session.email);
  const offerDescription = body.offerDescription?.trim() || DEFAULT_ICP.offerDescription;
  const targetIndustries = body.targetIndustries?.trim() || DEFAULT_ICP.targetIndustries.join(", ");

  try {
    await upsertWorkspaceBundle(c.env.DB, {
      userId: session.user_id,
      workspaceId: ids.workspaceId,
      memberId: ids.memberId,
      icpId: ids.icpId,
      subscriptionId: ids.subscriptionId,
      workspaceName,
      selectedPlan,
      agencyFocus: body.agencyFocus,
      offerDescription,
      targetIndustries
    });

    const signupIntentId = `signup_${crypto.randomUUID()}`;
    await persistSignupIntent(c.env.DB, {
      id: signupIntentId,
      userId: session.user_id,
      workspaceId: ids.workspaceId,
      email: session.email,
      planId: selectedPlan.id,
      agencyFocus: body.agencyFocus,
      agencyWebsite: null,
      offerDescription,
      targetIndustries,
      firstProspectUrl: body.firstProspectUrl
    }).catch((error) => console.error("workspace_create_intent_persist_failed", error));

    if (selectedPlan.id !== "free") {
      const checkout = await createStripeCheckoutSession(c.env, {
        workspaceId: ids.workspaceId,
        signupIntentId,
        email: session.email,
        plan: selectedPlan
      });

      if (checkout.status === "created") {
        return c.json({ ok: true, workspaceId: ids.workspaceId, next: "checkout", checkoutUrl: checkout.url });
      }

      if (checkout.status === "failed") {
        return c.json({ ok: false, error: checkout.error }, 502);
      }
    }

    const snapshot = await getWorkspaceSnapshot(c.env.DB, ids.workspaceId);
    return c.json({ ok: true, workspaceId: ids.workspaceId, next: "dashboard", snapshot });
  } catch (error) {
    console.error("workspace_create_failed", error);
    return c.json({ ok: false, error: "Unable to create workspace. Please try again." }, 500);
  }
});

app.post("/api/workspace/onboarding/complete", async (c) => {
  const workspaceId = await resolveWorkspaceId(c, { allowDemo: false });

  if (!workspaceId) {
    return c.json({ ok: false, error: "Sign in before updating onboarding." }, 401);
  }

  if (!c.env.DB) {
    return c.json({ ok: false, error: "Onboarding state requires a configured database." }, 501);
  }

  const workspace = await getWorkspace(c.env.DB, workspaceId);
  if (!workspace) {
    return c.json({ ok: false, error: "Workspace not found." }, 404);
  }

  const completedAt = new Date().toISOString();
  await c.env.DB.prepare(
    `UPDATE workspaces
     SET onboarding_completed_at = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`
  )
    .bind(completedAt, workspaceId)
    .run();

  return c.json({ ok: true, completedAt });
});

app.patch("/api/workspace/icp", async (c) => {
  const workspaceId = await resolveWorkspaceId(c);
  const locale = resolveApiLocale(c);
  const body = (await c.req.json<IcpUpdateRequest>().catch(() => null)) as IcpUpdateRequest | null;

  if (!body) {
    return c.json({ ok: false, error: "Request body must be valid JSON." }, 400);
  }

  const serviceType = normalizeServiceType(body.serviceType);
  const tone = normalizeTone(body.tone);
  const targetIndustries = normalizeStringList(body.targetIndustries, DEFAULT_ICP.targetIndustries);
  const targetCountries = normalizeStringList(body.targetCountries, DEFAULT_ICP.targetCountries);
  const offerDescription = cleanText(body.offerDescription, DEFAULT_ICP.offerDescription, 600);
  const firstProspectUrl = body.firstProspectUrl ? normalizeAbsoluteUrl(body.firstProspectUrl) : null;

  if (body.firstProspectUrl && !firstProspectUrl) {
    return c.json({ ok: false, error: "First prospect URL must be a valid http(s) URL." }, 400);
  }

  if (!c.env.DB) {
    return c.json({
      ok: true,
      setup: {
        ...sampleWorkspaceSnapshot(workspaceId, locale).setup,
        serviceType,
        agencyFocus: serviceType,
        targetIndustries,
        targetCountries,
        offerDescription,
        tone,
        firstProspectUrl
      },
      source: "sample"
    });
  }

  try {
    await ensureDemoWorkspace(c.env.DB, workspaceId);
    const workspace = await getWorkspace(c.env.DB, workspaceId);
    if (!workspace) {
      return c.json({ ok: false, error: "Workspace not found." }, 404);
    }

    await upsertWorkspaceIcp(c, {
      workspaceId,
      serviceType,
      targetIndustries,
      targetCountries,
      offerDescription,
      tone,
      firstProspectUrl
    });

    return c.json({
      ok: true,
      setup: await getWorkspaceSetup(c.env.DB, workspaceId),
      source: "d1"
    });
  } catch (error) {
    console.error("workspace_icp_update_failed", error);
    return c.json({ ok: false, error: "Unable to save ICP settings." }, 500);
  }
});

app.post("/api/billing/checkout", async (c) => {
  const body = (await c.req.json<CheckoutRequest>().catch(() => ({}))) as CheckoutRequest;
  const workspaceId = body.workspaceId || (await resolveWorkspaceId(c));
  const plan = getPlan(body.planId || "starter");

  if (plan.id === "free") {
    return c.json({ ok: true, next: "dashboard", url: `${appUrl(c.env)}/app?workspace=${workspaceId}` });
  }

  const checkout = await createStripeCheckoutSession(c.env, {
    workspaceId,
    signupIntentId: null,
    email: body.email?.trim().toLowerCase(),
    plan
  });

  if (checkout.status === "not_configured") {
    return c.json({ ok: false, error: "Stripe checkout is not configured for this environment." }, 501);
  }

  if (checkout.status === "failed") {
    return c.json({ ok: false, error: checkout.error }, 502);
  }

  return c.json({ ok: true, next: "checkout", url: checkout.url });
});

app.post("/api/billing/portal", async (c) => {
  const body = (await c.req.json<PortalRequest>().catch(() => ({}))) as PortalRequest;
  const workspaceId = body.workspaceId || (await resolveWorkspaceId(c, { allowDemo: false }));

  if (!workspaceId) {
    return c.json({ ok: false, error: "Sign in before managing billing." }, 401);
  }

  if (!c.env.DB) {
    return c.json({ ok: false, error: "Billing portal requires a configured database." }, 501);
  }

  if (!c.env.STRIPE_SECRET_KEY) {
    return c.json({ ok: false, error: "Stripe portal is not configured for this environment." }, 501);
  }

  const subscription = await getSubscription(c.env.DB, workspaceId);
  if (!subscription?.provider_customer_id) {
    return c.json({ ok: false, error: "No Stripe customer is attached to this workspace yet." }, 404);
  }

  const portal = await createStripePortalSession(c.env, subscription.provider_customer_id);
  if (!portal.ok) {
    return c.json({ ok: false, error: portal.error }, 502);
  }

  return c.json({ ok: true, url: portal.url });
});

app.get("/api/analytics/summary", async (c) => {
  const locale = resolveApiLocale(c);

  if (!c.env.DB) {
    return c.json(sampleAnalyticsSummary(locale));
  }

  const workspaceId = await resolveWorkspaceId(c);

  try {
    const [eventRows, pageRows, recentRows, qualifiedLeadRow, exportedLeadRow, completedScanRow, totalEventsRow] = await Promise.all([
      c.env.DB.prepare(
        `SELECT event_name AS name, COUNT(*) AS count
         FROM analytics_events
         WHERE workspace_id = ?
         GROUP BY event_name
         ORDER BY count DESC
         LIMIT 8`
      )
        .bind(workspaceId)
        .all<AnalyticsSummaryCountRow>(),
      c.env.DB.prepare(
        `SELECT page_path AS path, COUNT(*) AS count
         FROM analytics_events
         WHERE workspace_id = ? AND page_path IS NOT NULL
         GROUP BY page_path
         ORDER BY count DESC
         LIMIT 6`
      )
        .bind(workspaceId)
        .all<AnalyticsSummaryPageRow>(),
      c.env.DB.prepare(
        `SELECT id, event_name, page_path, metadata_json, created_at
         FROM analytics_events
         WHERE workspace_id = ?
         ORDER BY created_at DESC
         LIMIT 12`
      )
        .bind(workspaceId)
        .all<AnalyticsRecentEventRow>(),
      c.env.DB.prepare(
        `SELECT COUNT(*) AS count
         FROM queue_items
         WHERE workspace_id = ? AND research_status = 'qualified'`
      )
        .bind(workspaceId)
        .first<{ count: number }>(),
      c.env.DB.prepare(
        `SELECT COUNT(*) AS count
         FROM queue_items
         WHERE workspace_id = ? AND research_status = 'qualified' AND handoff_status != 'pending'`
      )
        .bind(workspaceId)
        .first<{ count: number }>(),
      c.env.DB.prepare(`SELECT COUNT(*) AS count FROM scans WHERE workspace_id = ? AND status = 'completed'`).bind(workspaceId).first<{ count: number }>(),
      c.env.DB.prepare(`SELECT COUNT(*) AS count FROM analytics_events WHERE workspace_id = ?`).bind(workspaceId).first<{ count: number }>()
    ]);

    const eventCounts = Object.fromEntries(eventRows.results.map((row) => [row.name, row.count])) as Record<string, number>;
    const completedScans = completedScanRow?.count || 0;
    const leadsSaved = qualifiedLeadRow?.count || 0;
    const exportsCompleted = exportedLeadRow?.count || 0;
    const ctaClicks =
      (eventCounts.marketing_cta_click || 0) +
      (eventCounts.product_tool_primary_click || 0) +
      (eventCounts.product_tool_secondary_click || 0) +
      (eventCounts.pricing_plan_click || 0) +
      (eventCounts.auth_signup_cta_click || 0);
    const signupsCompleted = (eventCounts.auth_signup_completed || 0) + (eventCounts.workspace_signup_session_opened || 0);
    const loginsCompleted = (eventCounts.auth_login_email_success || 0) + (eventCounts.auth_login_session_opened || 0);
    const recommendations = buildAnalyticsRecommendations(
      {
        ctaClicks,
        signupsCompleted,
        loginsCompleted,
        scansCompleted: completedScans,
        exportsCompleted,
        topPage: pageRows.results[0]?.path || null
      },
      locale
    );

    return c.json({
      source: "d1",
      totals: {
        events: totalEventsRow?.count || 0,
        scansCompleted: completedScans,
        leadsSaved,
        exportsCompleted
      },
      funnel: {
        ctaClicks,
        signupsCompleted,
        loginsCompleted,
        scansCompleted: completedScans,
        exportsCompleted
      },
      topPages: pageRows.results.map((row) => ({
        path: row.path || "(unknown)",
        count: row.count
      })),
      topEvents: eventRows.results,
      recentEvents: recentRows.results.map((row) => ({
        id: row.id,
        name: row.event_name,
        pagePath: row.page_path,
        createdAt: row.created_at,
        metadataSummary: summarizeEventMetadata(row.metadata_json)
      })),
      recommendations
    });
  } catch (error) {
    console.error("analytics_summary_failed", error);
    return c.json(sampleAnalyticsSummary(locale));
  }
});

app.post("/api/analytics/events", async (c) => {
  const body = (await c.req.json<AnalyticsEventRequest>().catch(() => ({}))) as AnalyticsEventRequest;
  const eventName = body.name?.trim();

  if (!eventName) {
    return c.json({ ok: false, error: "Event name is required." }, 400);
  }

  if (!c.env.DB) {
    return c.json({ ok: true, stored: false });
  }

  const session = await getAuthenticatedSession(c);
  const pagePath = body.page?.trim() || null;
  const metadata = JSON.stringify(body.metadata || {});

  await c.env.DB.prepare(
    `INSERT INTO analytics_events
      (id, user_id, workspace_id, session_id, event_name, page_path, metadata_json, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`
  )
    .bind(
      `evt_${crypto.randomUUID()}`,
      session?.user_id || null,
      session?.workspace_id || null,
      session?.session_id || null,
      eventName,
      pagePath,
      metadata
    )
    .run()
    .catch((error) => console.error("analytics_event_failed", error));

  return c.json({ ok: true, stored: true });
});

app.post("/api/stripe/webhook", async (c) => {
  const rawBody = await c.req.text();
  const signature = c.req.header("Stripe-Signature");

  if (!c.env.STRIPE_WEBHOOK_SECRET) {
    return c.json({ ok: false, error: "Stripe webhook secret is not configured." }, 501);
  }

  const verified = await verifyStripeSignature(rawBody, signature, c.env.STRIPE_WEBHOOK_SECRET);
  if (!verified) {
    return c.json({ ok: false, error: "Invalid Stripe signature." }, 400);
  }

  const event = JSON.parse(rawBody) as StripeEvent;

  if (c.env.DB) {
    await recordBillingEvent(c.env.DB, event, rawBody);
    await processStripeEvent(c.env.DB, c.env, event);
  }

  return c.json({ received: true });
});

app.get("/api/queue", async (c) => {
  const workspaceId = await resolveWorkspaceId(c);

  if (!c.env.DB) {
    return c.json({
      items: [] as WorkspaceQueueItem[],
      source: "sample"
    });
  }

  try {
    if (workspaceId === "ws_demo") {
      await ensureDemoWorkspace(c.env.DB, workspaceId);
    }

    return c.json({
      items: await listQueueItems(c.env.DB, workspaceId),
      source: "d1"
    });
  } catch (error) {
    console.error("queue_list_failed", error);
    return c.json({
      items: [] as WorkspaceQueueItem[],
      source: "sample",
      warning: "D1 is not initialized. Apply migrations to enable queue persistence."
    });
  }
});

app.post("/api/queue/import", async (c) => {
  const workspaceId = await resolveWorkspaceId(c);
  const payload = (await c.req.json<QueueImportRequest>().catch(() => ({ items: [] }))) as QueueImportRequest;
  const normalizedItems = normalizeQueueImportItems(payload.items);

  if (!normalizedItems.length) {
    return c.json({ ok: false, error: "At least one valid website is required." }, 400);
  }

  if (!c.env.DB) {
    const now = new Date().toISOString();
    return c.json({
      ok: true,
      items: normalizedItems.map((item) => ({
        id: `queue_${crypto.randomUUID()}`,
        leadId: null,
        scanId: null,
        companyName: item.companyName || item.domain,
        domain: item.domain,
        websiteUrl: item.url,
        source: item.source,
        note: item.note,
        researchStatus: "queued" as const,
        handoffStatus: "pending" as const,
        createdAt: now,
        updatedAt: null
      })),
      source: "sample"
    });
  }

  try {
    if (workspaceId === "ws_demo") {
      await ensureDemoWorkspace(c.env.DB, workspaceId);
    }

    await upsertQueueImportItems(c.env.DB, workspaceId, normalizedItems);
    return c.json({
      ok: true,
      items: await listQueueItems(c.env.DB, workspaceId),
      source: "d1"
    });
  } catch (error) {
    console.error("queue_import_failed", error);
    return c.json({ ok: false, error: "Unable to save websites into the queue." }, 500);
  }
});

app.delete("/api/queue/:id", async (c) => {
  const workspaceId = await resolveWorkspaceId(c);
  const id = c.req.param("id");

  if (!c.env.DB) {
    return c.json({ ok: true, removed: true, source: "sample" });
  }

  try {
    const result = await archiveOrDeleteQueueItem(c.env.DB, workspaceId, id);
    return c.json({
      ok: result.ok,
      removed: result.removed,
      archived: result.archived,
      source: "d1",
      error: result.ok ? undefined : "Queue item not found."
    }, result.ok ? 200 : 404);
  } catch (error) {
    console.error("queue_delete_failed", error);
    return c.json({ ok: false, error: "Unable to update the queue item." }, 500);
  }
});

app.get("/api/scans", async (c) => {
  const workspaceId = await resolveWorkspaceId(c);
  const locale = resolveApiLocale(c);

  if (!c.env.DB) {
    return c.json({
      scans: sampleScanHistory(locale),
      source: "sample"
    });
  }

  try {
    await ensureDemoWorkspace(c.env.DB, workspaceId);
    await ensureScanIdempotencyStore(c.env.DB);

    const [scanRows, idempotencyRows] = await Promise.all([
      c.env.DB.prepare(
        `SELECT
          s.id,
          s.url,
          s.scan_type,
          s.status,
          s.credits_used,
          s.error_message,
          s.created_at,
          s.completed_at,
          l.id AS lead_id,
          l.company_name,
          l.domain,
          idem.idempotency_key,
          idem.credits_charged,
          idem.error_reason,
          idem.status AS idempotency_status,
          idem.updated_at AS idempotency_updated_at
         FROM scans s
         LEFT JOIN leads l ON l.id = s.lead_id
         LEFT JOIN scan_idempotency_keys idem ON idem.scan_id = s.id
         WHERE s.workspace_id = ?
         ORDER BY s.created_at DESC
         LIMIT 100`
      )
        .bind(workspaceId)
        .all<ScanHistoryDbRow>(),
      c.env.DB.prepare(
        `SELECT
          idem.id,
          idem.idempotency_key,
          idem.status,
          idem.scan_id,
          idem.lead_id,
          idem.credits_charged,
          idem.error_reason,
          idem.error_message,
          idem.response_json,
          idem.created_at,
          idem.updated_at,
          s.url,
          s.scan_type,
          s.credits_used,
          s.completed_at,
          l.company_name,
          l.domain
         FROM scan_idempotency_keys idem
         LEFT JOIN scans s ON s.id = idem.scan_id
         LEFT JOIN leads l ON l.id = idem.lead_id
         WHERE idem.workspace_id = ?
           AND (idem.status IN ('failed', 'replayed', 'processing') OR idem.scan_id IS NULL)
         ORDER BY COALESCE(idem.updated_at, idem.created_at) DESC
         LIMIT 100`
      )
        .bind(workspaceId)
        .all<ScanIdempotencyHistoryRow>()
    ]);

    const scans = [
      ...scanRows.results.map(mapScanHistoryRow),
      ...idempotencyRows.results.map(mapIdempotencyHistoryRow)
    ]
      .sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt))
      .slice(0, 100);

    return c.json({
      scans,
      source: "d1"
    });
  } catch (error) {
    console.error("scan_history_failed", error);
    return c.json({
      scans: sampleScanHistory(locale),
      source: "sample",
      warning: "D1 is not initialized. Apply migrations to enable scan history."
    });
  }
});

app.post("/api/scans", async (c) => {
  let request: ScanRequest;

  try {
    request = await c.req.json<ScanRequest>();
  } catch {
    return c.json(scanFailure("validation_failed", "Request body must be valid JSON.", 0, false), 400);
  }

  const idempotencyKey = normalizeIdempotencyKey(c.req.header("Idempotency-Key") || request.idempotencyKey);
  const validation = validateScanRequest(request);

  if (validation) {
    return c.json(scanFailure("validation_failed", validation, 0, false, undefined, idempotencyKey), 400);
  }

  const extensionClient = request.source === "extension";
  const creditsNeeded = request.deepScan ? 3 : 1;
  const workspaceId = extensionClient ? await resolveWorkspaceId(c, { allowDemo: false }) : await resolveWorkspaceId(c);
  const requestHash = await scanRequestHash(request);
  const idempotencyEnabled = Boolean(c.env.DB && idempotencyKey);
  const requestedQueueItemId = typeof request.queueItemId === "string" && request.queueItemId.trim() ? request.queueItemId.trim() : null;

  async function fail(
    reason: ScanFailureReason,
    error: string,
    statusCode: 400 | 401 | 402 | 409 | 500 | 503,
    retryable: boolean,
    scanId?: string
  ) {
    const response = scanFailure(reason, error, 0, retryable, scanId, idempotencyKey);

    if (c.env.DB && scanId && workspaceId) {
      await recordFailedScan(c.env.DB, workspaceId, scanId, request, reason, error);
    }

    if (c.env.DB && workspaceId && requestedQueueItemId) {
      await resetQueueItemAfterFailedScan(c.env.DB, workspaceId, requestedQueueItemId).catch((queueError) =>
        console.error("queue_scan_failure_reset_failed", queueError)
      );
    }

    if (idempotencyEnabled && workspaceId) {
      await saveScanIdempotencyResult(c.env.DB!, workspaceId, idempotencyKey!, response, statusCode, {
        scanId,
        creditsCharged: 0
      });
    }

    return c.json(response, statusCode);
  }

  if (extensionClient && !c.env.DB) {
    return fail("workspace_unavailable", "Chrome extension sign-in is unavailable until the workspace database is ready.", 503, true);
  }

  if (extensionClient && !workspaceId) {
    return fail("workspace_unavailable", "Sign in to LeadCue before scanning from the Chrome extension.", 401, false);
  }

  const resolvedWorkspaceId = workspaceId ?? "ws_demo";

  if (idempotencyEnabled) {
    try {
      await ensureScanIdempotencyStore(c.env.DB!);
      const existing = await getScanIdempotency(c.env.DB!, resolvedWorkspaceId, idempotencyKey!);

      if (existing) {
        if (existing.request_hash !== requestHash) {
          return c.json(
            scanFailure(
              "idempotency_conflict",
              "This idempotency key was already used with different scan input.",
              0,
              false,
              existing.scan_id || undefined,
              idempotencyKey,
              true
            ),
            409
          );
        }

        const replay = replayScanIdempotency(existing);
        if (replay) {
          await recordScanReplay(c.env.DB!, resolvedWorkspaceId, idempotencyKey!);
          return c.json(replay.body, replay.statusCode);
        }

        return c.json(
          scanFailure(
            "duplicate_in_progress",
            "This scan is already running. Retry with the same idempotency key in a moment.",
            0,
            true,
            existing.scan_id || undefined,
            idempotencyKey
          ),
          409
        );
      }

      const created = await createScanIdempotency(c.env.DB!, resolvedWorkspaceId, idempotencyKey!, requestHash);
      if (!created) {
        const existingAfterRace = await getScanIdempotency(c.env.DB!, resolvedWorkspaceId, idempotencyKey!);
        const replay = existingAfterRace ? replayScanIdempotency(existingAfterRace) : null;

        if (replay) {
          await recordScanReplay(c.env.DB!, resolvedWorkspaceId, idempotencyKey!);
          return c.json(replay.body, replay.statusCode);
        }

        return c.json(
          scanFailure(
            "duplicate_in_progress",
            "This scan is already running. Retry with the same idempotency key in a moment.",
            0,
            true,
            existingAfterRace?.scan_id || undefined,
            idempotencyKey
          ),
          409
        );
      }
    } catch (error) {
      console.error("scan_idempotency_unavailable", error);
    }
  }

  if (c.env.DB) {
    try {
      if (resolvedWorkspaceId === "ws_demo") {
        await ensureDemoWorkspace(c.env.DB, resolvedWorkspaceId);
      }

      const access = await checkScanAccess(c.env.DB, resolvedWorkspaceId, creditsNeeded);
      if (!access.ok) {
        return fail(mapScanAccessReason(access.reason), access.error, 402, false);
      }
    } catch (error) {
      console.error("scan_access_failed", error);
      return fail("workspace_unavailable", "Unable to validate workspace credits.", 500, true);
    }
  }

  if (c.env.DB && requestedQueueItemId) {
    await markQueueItemScanning(c.env.DB, resolvedWorkspaceId, requestedQueueItemId).catch((error) =>
      console.error("queue_scan_mark_failed", error)
    );
  }

  const scanId = `scan_${crypto.randomUUID()}`;
  const leadId = `lead_${await shortHash(`${resolvedWorkspaceId}:${extractDomain(request.page.url) || request.page.url}`)}`;
  const persistence: "d1" | "memory" = c.env.DB ? "d1" : "memory";
  let prospect: ProspectCard;
  let queueItem: WorkspaceQueueItem | null = null;

  try {
    prospect = await generateProspectCard(c.env, request);
  } catch (error) {
    console.error("scan_generation_failed", error);
    return fail("generation_failed", "Unable to generate a Prospect Card from this website snapshot.", 503, true, scanId);
  }

  if (c.env.DB) {
    try {
      queueItem = await persistScanResult(c.env.DB, resolvedWorkspaceId, scanId, leadId, request, prospect, creditsNeeded);
    } catch (error) {
      console.error("scan_persist_failed", error);
      return fail("persistence_failed", "The scan completed but could not be saved. No credit was used.", 500, true, scanId);
    }
  }

  const response: ScanResponse & { persistence: typeof persistence } = {
    ok: true,
    status: "completed",
    scanId,
    leadId,
    creditsUsed: creditsNeeded,
    creditsCharged: creditsNeeded,
    prospect: {
      ...prospect,
      savedStatus: "saved",
      exportStatus: "not_exported",
      pipelineContext: defaultPipelineContext()
    },
    queueItem: queueItem || undefined,
    idempotencyKey,
    persistence
  };

  if (idempotencyEnabled) {
    await saveScanIdempotencyResult(c.env.DB!, resolvedWorkspaceId, idempotencyKey!, response, 200, {
      scanId,
      leadId,
      creditsCharged: creditsNeeded
    });
  }

  return c.json(response);
});

app.get("/api/leads", async (c) => {
  const workspaceId = await resolveWorkspaceId(c);
  const locale = resolveApiLocale(c);

  if (!c.env.DB) {
    return c.json({
      leads: [sampleLeadListItem(locale)],
      source: "sample"
    });
  }

  try {
    await ensureDemoWorkspace(c.env.DB, workspaceId);
    const { results } = await c.env.DB.prepare(
      `SELECT id, company_name, domain, website_url, industry, fit_score, confidence_score, owner, pipeline_stage, pipeline_notes, pipeline_updated_at, created_at
       FROM leads
       WHERE workspace_id = ?
       ORDER BY created_at DESC
       LIMIT 100`
    )
      .bind(workspaceId)
      .all<LeadRow>();

    return c.json({
      leads: results.map(mapLeadListItem),
      source: "d1"
    });
  } catch (error) {
    console.error("lead_list_failed", error);
    return c.json({
      leads: [sampleLeadListItem(locale)],
      source: "sample",
      warning: "D1 is not initialized. Apply migrations to enable persistence."
    });
  }
});

app.get("/api/exports/history", async (c) => {
  const workspaceId = await resolveWorkspaceId(c);

  if (!c.env.DB) {
    return c.json({
      runs: [] as ExportRun[],
      source: "sample"
    });
  }

  try {
    if (workspaceId === "ws_demo") {
      await ensureDemoWorkspace(c.env.DB, workspaceId);
    }

    return c.json({
      runs: await listExportRuns(c.env.DB, workspaceId),
      source: "d1"
    });
  } catch (error) {
    console.error("export_history_failed", error);
    return c.json({
      runs: [] as ExportRun[],
      source: "sample",
      warning: "D1 is not initialized. Apply migrations to enable export history."
    });
  }
});

app.get("/api/leads/:id", async (c) => {
  const id = c.req.param("id");
  const workspaceId = await resolveWorkspaceId(c);
  const locale = resolveApiLocale(c);
  const sampleCard = buildSampleProspectCard(locale);

  if (!c.env.DB) {
    return c.json({
      lead: {
        ...sampleCard,
        pipelineContext: defaultPipelineContext(),
        pipelineActivity: samplePipelineActivity(locale)
      },
      source: "sample"
    });
  }

  let row: LeadDetailRow | null = null;

  try {
    row = await c.env.DB
      .prepare(`SELECT * FROM leads WHERE id = ? AND workspace_id = ?`)
      .bind(id, workspaceId)
      .first<LeadDetailRow>();
  } catch (error) {
    console.error("lead_detail_failed", error);
    return c.json({
      lead: {
        ...sampleCard,
        pipelineContext: defaultPipelineContext(),
        pipelineActivity: samplePipelineActivity(locale)
      },
      source: "sample",
      warning: "D1 is not initialized. Apply migrations to enable persistence."
    });
  }

  if (!row) {
    return c.json({ ok: false, error: "Lead not found." }, 404);
  }

  const queueRow = await c.env.DB
    .prepare(`SELECT handoff_status FROM queue_items WHERE workspace_id = ? AND lead_id = ? LIMIT 1`)
    .bind(workspaceId, id)
    .first<Pick<QueueItemRow, "handoff_status">>()
    .catch((error) => {
      console.error("lead_queue_status_fetch_failed", error);
      return null;
    });
  const lead = mapLeadDetail(
    row,
    queueRow && isLeadHandoffStatus(queueRow.handoff_status) && queueRow.handoff_status !== "pending" ? "exported" : "not_exported"
  );
  lead.pipelineActivity = await getLeadPipelineActivity(c.env.DB, workspaceId, id).catch((error) => {
    console.error("lead_activity_fetch_failed", error);
    return [];
  });

  return c.json({
    lead,
    source: "d1"
  });
});

app.patch("/api/leads/:id/context", async (c) => {
  const id = c.req.param("id");
  const workspaceId = await resolveWorkspaceId(c);
  const locale = resolveApiLocale(c);
  const payload = (await c.req.json().catch(() => ({}))) as ProspectContextUpdateRequest;
  const context = normalizePipelineContext(payload);

  if (!context) {
    return c.json({ ok: false, error: "Invalid owner, pipeline stage, or notes." }, 400);
  }

  if (!c.env.DB) {
    return c.json({
      ok: true,
      context: { ...context, updatedAt: new Date().toISOString() },
      source: "sample"
    });
  }

    try {
      const updatedAt = new Date().toISOString();
      const currentRow = await c.env.DB.prepare(
        `SELECT id, company_name, domain, website_url, owner, pipeline_stage, pipeline_notes, pipeline_updated_at
         FROM leads
         WHERE id = ? AND workspace_id = ?`
      )
        .bind(id, workspaceId)
        .first<Pick<LeadRow, "id" | "company_name" | "domain" | "website_url" | "owner" | "pipeline_stage" | "pipeline_notes" | "pipeline_updated_at">>();

    if (!currentRow) {
      if (workspaceId === "ws_demo" && isDemoLeadId(id)) {
        return c.json({
          ok: true,
          context: { ...context, updatedAt },
          activity: samplePipelineActivity(locale, { currentValues: { ...context, updatedAt } })[0],
          source: "sample"
        });
      }

      return c.json({ ok: false, error: "Lead not found." }, 404);
    }

    const previousContext = mapPipelineContext(currentRow);
    const currentContext = { ...context, updatedAt };
    const changedFields = changedPipelineFields(previousContext, currentContext);
    const result = await c.env.DB
      .prepare(
        `UPDATE leads
         SET owner = ?, pipeline_stage = ?, pipeline_notes = ?, pipeline_updated_at = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ? AND workspace_id = ?`
      )
      .bind(context.owner, context.stage, context.notes, updatedAt, id, workspaceId)
      .run();

    if (!result.meta?.changes) {
      return c.json({ ok: false, error: "Lead not found." }, 404);
    }

    const activity = changedFields.length
      ? await createLeadPipelineActivity(c, {
          workspaceId,
          leadId: id,
          previousValues: previousContext,
          currentValues: currentContext,
          changedFields
        })
      : null;
    const queueItem = await syncQueueItemFromLeadPipeline(c.env.DB, workspaceId, {
      leadId: id,
      domain: currentRow.domain,
      websiteUrl: currentRow.website_url,
      companyName: currentRow.company_name || currentRow.domain,
      note: context.notes,
      stage: context.stage,
      updatedAt
    }).catch((error) => {
      console.error("queue_sync_from_pipeline_failed", error);
      return null;
    });

    return c.json({
      ok: true,
      context: currentContext,
      activity,
      queueItem: queueItem || undefined,
      source: "d1"
    });
  } catch (error) {
    console.error("lead_context_update_failed", error);

    if (workspaceId === "ws_demo" && isDemoLeadId(id)) {
      const updatedAt = new Date().toISOString();
      const currentContext = { ...context, updatedAt };
      return c.json({
        ok: true,
        context: currentContext,
        activity: samplePipelineActivity(locale, { currentValues: currentContext })[0],
        source: "sample"
      });
    }

    return c.json({ ok: false, error: "Unable to save pipeline context." }, 500);
  }
});

app.get("/api/credits", async (c) => {
  const workspaceId = await resolveWorkspaceId(c);

  if (!c.env.DB) {
    const plan = PRICING_PLANS[0];
    return c.json({
      plan,
      used: 4,
      remaining: plan.monthlyCredits - 4,
      reset: nextMonthIso()
    });
  }

  try {
    if (workspaceId === "ws_demo") {
      await ensureDemoWorkspace(c.env.DB, workspaceId);
    }

    const credits = await getWorkspaceCredits(c.env.DB, workspaceId);
    return c.json(credits);
  } catch (error) {
    console.error("credits_failed", error);
    const plan = PRICING_PLANS[0];
    return c.json({
      plan,
      used: 0,
      remaining: plan.monthlyCredits,
      reset: nextMonthIso(),
      warning: "D1 is not initialized. Apply migrations to enable credit tracking."
    });
  }
});

app.post("/api/exports", async (c) => {
  const workspaceId = await resolveWorkspaceId(c);
  const locale = resolveApiLocale(c);
  const payload = (await c.req.json<ExportRequest>().catch(() => ({}))) as ExportRequest;
  const presetQuery = c.req.query("preset");
  const crmModeQuery = c.req.query("crmMode");
  const scopeQuery = c.req.query("scope");
  const preset = isProspectExportPresetKey(payload.preset) ? payload.preset : isProspectExportPresetKey(presetQuery) ? presetQuery : "crm";
  const crmMode = isProspectCrmFieldMode(payload.crmMode) ? payload.crmMode : isProspectCrmFieldMode(crmModeQuery) ? crmModeQuery : "hubspot";
  const scope = isExportRunScope(payload.scope) ? payload.scope : isExportRunScope(scopeQuery) ? scopeQuery : "all_qualified";
  const selectedLeadIds = normalizeLeadIdList(payload.leadIds);
  const fileName = buildExportFileName(preset, crmMode);

  if (!c.env.DB) {
    return c.text(buildProspectExportCsv([{ card: buildSampleProspectCard(locale) }], preset, crmMode), 200, {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename=${fileName}`
    });
  }

  let rows: LeadDetailRow[] = [];

  try {
    if (workspaceId === "ws_demo") {
      await ensureDemoWorkspace(c.env.DB, workspaceId);
    }

    rows = await resolveExportLeadRows(c.env.DB, workspaceId, scope, selectedLeadIds);
  } catch (error) {
    console.error("export_failed", error);
    rows = [];
  }

  const cards = rows.length ? rows.map((row) => mapLeadDetail(row)) : [buildSampleProspectCard(locale)];
  const leadIds = rows.map((row) => row.id);
  const csv = buildProspectExportCsv(cards.map((card) => ({ card, pipelineContext: card.pipelineContext })), preset, crmMode);

  if (rows.length) {
    const session = await getAuthenticatedSession(c).catch(() => null);
    const completedAt = new Date().toISOString();

    await recordExportRun(c.env.DB, {
      id: `exp_${crypto.randomUUID()}`,
      workspaceId,
      leadIds,
      status: "completed",
      leadCount: rows.length,
      preset,
      crmMode,
      scope,
      createdByUserId: session?.user_id || null,
      fileName,
      completedAt
    }).catch((error) => console.error("export_run_record_failed", error));

    await markQueueItemsExported(c.env.DB, workspaceId, leadIds, completedAt).catch((error) =>
      console.error("queue_export_mark_failed", error)
    );
  }

  return c.text(csv, 200, {
    "Content-Type": "text/csv; charset=utf-8",
    "Content-Disposition": `attachment; filename=${fileName}`
  });
});

app.notFound((c) => c.json({ ok: false, error: "Route not found." }, 404));

export default app;

function validateScanRequest(request: ScanRequest): string | null {
  if (!request?.page?.url) {
    return "page.url is required.";
  }

  if (request.locale && !supportedScanLocales.includes(request.locale)) {
    return "locale is invalid.";
  }

  if (looksLikeSearchResultsPage(request.page.url)) {
    return "page.url must be a public company website, not a search results page.";
  }

  if (!request.page.title) {
    return "page.title is required.";
  }

  if (!request.page.text || request.page.text.length < 20) {
    return "page.text must include visible website copy.";
  }

  if (!Array.isArray(request.page.links)) {
    return "page.links must be an array.";
  }

  return null;
}

const searchResultsHostRules = [
  { hostPattern: /(^|\.)google\./i, pathPattern: /^\/search$/i, queryKeys: ["q"] },
  { hostPattern: /(^|\.)bing\.com$/i, pathPattern: /^\/search$/i, queryKeys: ["q"] },
  { hostPattern: /(^|\.)duckduckgo\.com$/i, pathPattern: /^\/(?:|html\/?)$/i, queryKeys: ["q"] },
  { hostPattern: /(^|\.)search\.yahoo\.com$/i, pathPattern: /^\/search$/i, queryKeys: ["p"] },
  { hostPattern: /(^|\.)yahoo\.com$/i, pathPattern: /^\/search$/i, queryKeys: ["p"] },
  { hostPattern: /(^|\.)baidu\.com$/i, pathPattern: /^\/s$/i, queryKeys: ["wd", "word"] },
  { hostPattern: /(^|\.)ecosia\.org$/i, pathPattern: /^\/search$/i, queryKeys: ["q"] },
  { hostPattern: /(^|\.)yandex\./i, pathPattern: /^\/search\/?$/i, queryKeys: ["text"] }
] as const;

function looksLikeSearchResultsPage(url: string): boolean {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();
    const pathname = parsed.pathname.toLowerCase();

    return searchResultsHostRules.some((rule) => {
      if (!rule.hostPattern.test(hostname) || !rule.pathPattern.test(pathname)) {
        return false;
      }

      return rule.queryKeys.some((key) => parsed.searchParams.has(key));
    });
  } catch {
    return false;
  }
}

function normalizeTone(value?: string | null) {
  return value === "direct" || value === "casual" || value === "professional" ? value : DEFAULT_ICP.tone;
}

function normalizeStringList(value: unknown, fallback: string[], limit = 12): string[] {
  const source = Array.isArray(value) ? value : typeof value === "string" ? value.split(",") : fallback;
  const items = source
    .map((item) => String(item).trim())
    .filter(Boolean)
    .slice(0, limit);

  return items.length ? [...new Set(items)] : fallback;
}

function cleanText(value: unknown, fallback: string, limit: number): string {
  const text = typeof value === "string" ? value.trim() : "";
  return (text || fallback).slice(0, limit);
}

function normalizeAbsoluteUrl(value: string): string | null {
  try {
    const parsed = new URL(value.trim());
    return parsed.protocol === "http:" || parsed.protocol === "https:" ? parsed.toString() : null;
  } catch {
    return null;
  }
}

async function upsertWorkspaceIcp(
  c: AppContext,
  input: {
    workspaceId: string;
    serviceType: string;
    targetIndustries: string[];
    targetCountries: string[];
    offerDescription: string;
    tone: string;
    firstProspectUrl: string | null;
  }
) {
  const db = c.env.DB!;
  const session = await getAuthenticatedSession(c);
  const targetIndustries = input.targetIndustries.join(", ");
  const targetCountries = input.targetCountries.join(", ");

  await db
    .prepare(
      `INSERT INTO icp_profiles
        (id, workspace_id, service_type, target_industries, target_countries, target_company_size, offer_description, tone, avoided_industries, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
       ON CONFLICT(workspace_id) DO UPDATE SET
         service_type = excluded.service_type,
         target_industries = excluded.target_industries,
         target_countries = excluded.target_countries,
         offer_description = excluded.offer_description,
         tone = excluded.tone,
         updated_at = CURRENT_TIMESTAMP`
    )
    .bind(
      `icp_${input.workspaceId}`,
      input.workspaceId,
      input.serviceType,
      targetIndustries,
      targetCountries,
      DEFAULT_ICP.targetCompanySize,
      input.offerDescription,
      input.tone,
      DEFAULT_ICP.avoidedIndustries.join(", ")
    )
    .run();

  const existingIntent = await db
    .prepare(
      `SELECT id, email, agency_website, plan_id
       FROM signup_intents
       WHERE workspace_id = ?
       ORDER BY created_at DESC
       LIMIT 1`
    )
    .bind(input.workspaceId)
    .first<{ id: string; email: string | null; agency_website: string | null; plan_id: string | null }>();

  if (existingIntent) {
    await db
      .prepare(
        `UPDATE signup_intents
         SET agency_focus = ?,
             offer_description = ?,
             target_industries = ?,
             first_prospect_url = ?,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`
      )
      .bind(input.serviceType, input.offerDescription, targetIndustries, input.firstProspectUrl, existingIntent.id)
      .run();
    return;
  }

  await db
    .prepare(
      `INSERT INTO signup_intents
        (id, user_id, workspace_id, email, plan_id, agency_focus, offer_description, target_industries, first_prospect_url, source, status, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'icp_settings', 'updated', CURRENT_TIMESTAMP)`
    )
    .bind(
      `intent_icp_${crypto.randomUUID()}`,
      session?.user_id || null,
      input.workspaceId,
      session?.email || `${input.workspaceId}@leadcue.local`,
      "free",
      input.serviceType,
      input.offerDescription,
      targetIndustries,
      input.firstProspectUrl
    )
    .run();
}

function scanFailure(
  reason: ScanFailureReason,
  error: string,
  creditsCharged: 0,
  retryable: boolean,
  scanId?: string,
  idempotencyKey?: string,
  replayed?: boolean
): ScanFailureResponse {
  return {
    ok: false,
    status: "failed",
    reason,
    error,
    creditsCharged,
    retryable,
    scanId,
    idempotencyKey,
    replayed
  };
}

function normalizeIdempotencyKey(value?: string | null): string | undefined {
  const key = value?.trim();

  if (!key) {
    return undefined;
  }

  return key.slice(0, 255);
}

function resolveApiLocale(c: AppContext): ScanLocale {
  const queryLocale = c.req.query("locale");
  const headerLocale = c.req.header("X-LeadCue-Locale");
  const value = (queryLocale || headerLocale || "en").trim();
  return supportedScanLocales.includes(value as ScanLocale) ? (value as ScanLocale) : "en";
}

async function scanRequestHash(request: ScanRequest): Promise<string> {
  const { idempotencyKey: _idempotencyKey, ...hashable } = request;
  return sha256(stableJson(hashable));
}

function stableJson(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map(stableJson).join(",")}]`;
  }

  if (value && typeof value === "object") {
    return `{${Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, item]) => `${JSON.stringify(key)}:${stableJson(item)}`)
      .join(",")}}`;
  }

  return JSON.stringify(value);
}

function mapScanAccessReason(reason: string): ScanFailureReason {
  switch (reason) {
    case "subscription_inactive":
      return "subscription_inactive";
    case "insufficient_credits":
      return "insufficient_credits";
    default:
      return "workspace_unavailable";
  }
}

async function ensureScanIdempotencyStore(db: D1Database) {
  await db
    .prepare(
      `CREATE TABLE IF NOT EXISTS scan_idempotency_keys (
        id TEXT PRIMARY KEY,
        workspace_id TEXT NOT NULL,
        idempotency_key TEXT NOT NULL,
        request_hash TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'processing',
        status_code INTEGER,
        response_json TEXT,
        scan_id TEXT,
        lead_id TEXT,
        credits_charged INTEGER NOT NULL DEFAULT 0,
        error_reason TEXT,
        error_message TEXT,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT,
        UNIQUE(workspace_id, idempotency_key)
      )`
    )
    .run();
  await db.prepare(`CREATE INDEX IF NOT EXISTS idx_scan_idempotency_workspace_id ON scan_idempotency_keys(workspace_id)`).run();
  await db.prepare(`CREATE INDEX IF NOT EXISTS idx_scan_idempotency_created_at ON scan_idempotency_keys(created_at)`).run();
}

async function getScanIdempotency(db: D1Database, workspaceId: string, idempotencyKey: string) {
  return db
    .prepare(
      `SELECT id, workspace_id, idempotency_key, request_hash, status, status_code, response_json,
              scan_id, lead_id, credits_charged, error_reason, error_message, created_at, updated_at
       FROM scan_idempotency_keys
       WHERE workspace_id = ? AND idempotency_key = ?
       LIMIT 1`
    )
    .bind(workspaceId, idempotencyKey)
    .first<ScanIdempotencyRow>();
}

async function createScanIdempotency(
  db: D1Database,
  workspaceId: string,
  idempotencyKey: string,
  requestHash: string
): Promise<boolean> {
  const result = await db
    .prepare(
      `INSERT OR IGNORE INTO scan_idempotency_keys
        (id, workspace_id, idempotency_key, request_hash, status)
       VALUES (?, ?, ?, ?, 'processing')`
    )
    .bind(`scan_idem_${crypto.randomUUID()}`, workspaceId, idempotencyKey, requestHash)
    .run();

  return Boolean(result.meta.changes);
}

async function saveScanIdempotencyResult(
  db: D1Database,
  workspaceId: string,
  idempotencyKey: string,
  response: ScanResponse | ScanFailureResponse,
  statusCode: number,
  metadata: { scanId?: string; leadId?: string; creditsCharged: number }
) {
  try {
    await db
      .prepare(
        `UPDATE scan_idempotency_keys
         SET status = ?,
             status_code = ?,
             response_json = ?,
             scan_id = ?,
             lead_id = ?,
             credits_charged = ?,
             error_reason = ?,
             error_message = ?,
             updated_at = CURRENT_TIMESTAMP
         WHERE workspace_id = ? AND idempotency_key = ?`
      )
      .bind(
        response.status,
        statusCode,
        JSON.stringify(response),
        metadata.scanId || null,
        metadata.leadId || null,
        metadata.creditsCharged,
        response.status === "failed" ? response.reason : null,
        response.status === "failed" ? response.error : null,
        workspaceId,
        idempotencyKey
      )
      .run();
  } catch (error) {
    console.error("scan_idempotency_save_failed", error);
  }
}

async function recordScanReplay(db: D1Database, workspaceId: string, idempotencyKey: string) {
  try {
    await db
      .prepare(
        `UPDATE scan_idempotency_keys
         SET status = 'replayed',
             updated_at = CURRENT_TIMESTAMP
         WHERE workspace_id = ? AND idempotency_key = ?`
      )
      .bind(workspaceId, idempotencyKey)
      .run();
  } catch (error) {
    console.error("scan_replay_record_failed", error);
  }
}

function replayScanIdempotency(
  row: ScanIdempotencyRow
): { body: (ScanResponse | ScanFailureResponse) & { replayed: true }; statusCode: 200 | 400 | 402 | 409 | 500 | 503 } | null {
  if (!row.response_json || !row.status_code || row.status === "processing") {
    return null;
  }

  try {
    const body = parseJson<ScanResponse | ScanFailureResponse | null>(row.response_json, null);
    if (!body) {
      return null;
    }

    const replayedBody =
      body.status === "completed"
        ? {
            ...body,
            replayed: true as const,
            originalCreditsCharged: body.creditsCharged,
            creditsCharged: 0
          }
        : { ...body, replayed: true as const };

    return {
      body: replayedBody,
      statusCode: isScanStatusCode(row.status_code) ? row.status_code : body.status === "completed" ? 200 : 500
    };
  } catch {
    return null;
  }
}

function isScanStatusCode(value: number): value is 200 | 400 | 402 | 409 | 500 | 503 {
  return value === 200 || value === 400 || value === 402 || value === 409 || value === 500 || value === 503;
}

function sampleScanHistory(locale: ScanLocale = "en"): ScanHistoryItem[] {
  const sampleCard = buildSampleProspectCard(locale);
  const now = new Date();
  const completedAt = new Date(now.getTime() - 1000 * 60 * 18).toISOString();
  const failedAt = new Date(now.getTime() - 1000 * 60 * 42).toISOString();
  const replayedAt = new Date(now.getTime() - 1000 * 60 * 54).toISOString();

  return [
    {
      id: "scan_sample_completed",
      url: sampleCard.website,
      domain: sampleCard.domain,
      scanType: "basic",
      status: "completed",
      reason: null,
      creditsUsed: 1,
      creditsCharged: 1,
      leadId: "lead_sample",
      companyName: sampleCard.companyName,
      idempotencyKey: "sample_completed_key",
      replayed: false,
      createdAt: completedAt,
      completedAt
    },
    {
      id: "scan_sample_failed",
      url: "https://missing-content.example",
      domain: "missing-content.example",
      scanType: "basic",
      status: "failed",
      reason: "generation_failed",
      creditsUsed: 0,
      creditsCharged: 0,
      leadId: null,
      companyName: null,
      idempotencyKey: "sample_failed_key",
      replayed: false,
      createdAt: failedAt,
      completedAt: failedAt
    },
    {
      id: "scan_sample_replayed",
      url: sampleCard.website,
      domain: sampleCard.domain,
      scanType: "basic",
      status: "replayed",
      reason: "replayed",
      creditsUsed: 0,
      creditsCharged: 0,
      leadId: "lead_sample",
      companyName: sampleCard.companyName,
      idempotencyKey: "sample_completed_key",
      replayed: true,
      createdAt: replayedAt,
      completedAt: replayedAt
    }
  ];
}

function mapScanHistoryRow(row: ScanHistoryDbRow): ScanHistoryItem {
  const status = row.status === "failed" ? "failed" : row.status === "completed" ? "completed" : "processing";
  const domain = row.domain || extractDomain(row.url) || row.url;

  return {
    id: row.id,
    url: row.url,
    domain,
    scanType: row.scan_type === "deep" ? "deep" : "basic",
    status,
    reason: status === "failed" ? normalizeScanFailureReason(row.error_reason || row.error_message) : null,
    creditsUsed: row.credits_used || 0,
    creditsCharged: status === "completed" ? row.credits_used || 0 : row.credits_charged || 0,
    leadId: row.lead_id,
    companyName: row.company_name,
    idempotencyKey: row.idempotency_key,
    replayed: false,
    createdAt: row.created_at,
    completedAt: row.completed_at
  };
}

function mapIdempotencyHistoryRow(row: ScanIdempotencyHistoryRow): ScanHistoryItem {
  const status =
    row.status === "replayed" ? "replayed" : row.status === "failed" ? "failed" : row.status === "processing" ? "processing" : "completed";
  const url = row.url || "URL unavailable";
  const domain = row.domain || extractDomain(url) || "unavailable";
  const createdAt = row.updated_at || row.created_at;

  return {
    id: `${row.id}_${status}`,
    url,
    domain,
    scanType: row.scan_type === "deep" ? "deep" : "basic",
    status,
    reason:
      status === "replayed"
        ? "replayed"
        : status === "processing"
          ? "processing"
          : status === "failed"
            ? normalizeScanFailureReason(row.error_reason || row.error_message)
            : null,
    creditsUsed: status === "completed" ? row.credits_used || 0 : 0,
    creditsCharged: status === "completed" ? row.credits_charged || row.credits_used || 0 : 0,
    leadId: row.lead_id,
    companyName: row.company_name,
    idempotencyKey: row.idempotency_key,
    replayed: status === "replayed",
    createdAt,
    completedAt: row.completed_at || row.updated_at
  };
}

function normalizeScanFailureReason(value?: string | null): ScanFailureReason | null {
  const reason = value?.split(":", 1)[0]?.trim();

  switch (reason) {
    case "validation_failed":
    case "workspace_unavailable":
    case "subscription_inactive":
    case "insufficient_credits":
    case "idempotency_conflict":
    case "duplicate_in_progress":
    case "generation_failed":
    case "persistence_failed":
      return reason;
    default:
      return null;
  }
}

function resolveWorkspaceId(c: AppContext): Promise<string>;
function resolveWorkspaceId(c: AppContext, options: { allowDemo: false }): Promise<string | null>;
async function resolveWorkspaceId(c: AppContext, options: { allowDemo?: boolean } = {}): Promise<string | null> {
  const explicitWorkspace = c.req.header("X-Workspace-Id") || c.req.query("workspaceId") || c.req.query("workspace");
  if (explicitWorkspace) {
    return explicitWorkspace;
  }

  const session = await getAuthenticatedSession(c);
  if (session?.workspace_id) {
    return session.workspace_id;
  }

  return options.allowDemo === false ? null : "ws_demo";
}

function appUrl(env: Env): string {
  return env.APP_URL || "http://localhost:5173";
}

function isLocalAppUrl(env: Env): boolean {
  const url = appUrl(env);
  return url.includes("localhost") || url.includes("127.0.0.1");
}

function sampleAnalyticsSummary(locale: ScanLocale = "en") {
  const sampleContent = getSampleLocaleContent(locale);
  const analytics = sampleContent.analytics;

  return {
    source: "sample" as const,
    totals: {
      events: 42,
      scansCompleted: 12,
      leadsSaved: 7,
      exportsCompleted: 3
    },
    funnel: {
      ctaClicks: 18,
      signupsCompleted: 5,
      loginsCompleted: 6,
      scansCompleted: 12,
      exportsCompleted: 3
    },
    topPages: [
      { path: "/", count: 14 },
      { path: "/templates/crm-csv-field-mapping", count: 9 },
      { path: "/templates/cold-email-first-line", count: 7 },
      { path: "/integrations/hubspot-csv-export", count: 5 }
    ],
    topEvents: [
      { name: "scan_completed", count: 12 },
      { name: "product_tool_primary_click", count: 8 },
      { name: "export_completed", count: 3 }
    ],
    recentEvents: [
      {
        id: "evt_sample_scan",
        name: "scan_completed",
        pagePath: "/app",
        createdAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
        metadataSummary: analytics.eventMetadata.basicScanOneCredit
      },
      {
        id: "evt_sample_export",
        name: "export_completed",
        pagePath: "/app/leads",
        createdAt: new Date(Date.now() - 1000 * 60 * 21).toISOString(),
        metadataSummary: analytics.eventMetadata.crmHubSpot
      },
      {
        id: "evt_sample_tool",
        name: "product_tool_primary_click",
        pagePath: "/templates/crm-csv-field-mapping",
        createdAt: new Date(Date.now() - 1000 * 60 * 46).toISOString(),
        metadataSummary: analytics.eventMetadata.hubSpotMappingCta
      }
    ],
    recommendations: [
      analytics.recommendations.toolPageCta,
      analytics.recommendations.exportsGap,
      analytics.recommendations.crmTemplateTraffic
    ]
  };
}

function summarizeEventMetadata(value: string | null) {
  const parsed = parseJson<Record<string, unknown>>(value, {});
  const parts = Object.entries(parsed)
    .filter(([, entry]) => entry !== null && entry !== undefined && entry !== "")
    .slice(0, 3)
    .map(([key, entry]) => `${key}: ${String(entry)}`);
  return parts.join(", ") || null;
}

function buildAnalyticsRecommendations(input: {
  ctaClicks: number;
  signupsCompleted: number;
  loginsCompleted: number;
  scansCompleted: number;
  exportsCompleted: number;
  topPage: string | null;
}, locale: ScanLocale = "en") {
  const analytics = getSampleLocaleContent(locale).analytics;
  const recommendations: string[] = [];

  if (input.ctaClicks > 0 && input.signupsCompleted === 0) {
    recommendations.push(analytics.recommendations.ctaSignupGap);
  }

  if ((input.signupsCompleted > 0 || input.loginsCompleted > 0) && input.scansCompleted === 0) {
    recommendations.push(analytics.recommendations.noScans);
  }

  if (input.scansCompleted > 0 && input.exportsCompleted === 0) {
    recommendations.push(analytics.recommendations.scanExportGap);
  }

  if (input.topPage) {
    recommendations.push(analytics.recommendations.topPage.replace("__PAGE__", input.topPage));
  }

  if (!recommendations.length) {
    recommendations.push(analytics.recommendations.steadyFunnel);
  }

  return recommendations.slice(0, 3);
}

function googleAuthConfigured(env: Env): boolean {
  return Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET && env.GOOGLE_REDIRECT_URI);
}

function getPlan(planId?: string | null): PricingPlan {
  return PRICING_PLANS.find((plan) => plan.id === planId) ?? PRICING_PLANS[0];
}

function safeReturnPath(value?: string | null, fallback = "/app"): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }

  return value;
}

function appendPathQuery(path: string, key: string, value: string): string {
  const url = new URL(path, "https://leadcue.local");
  url.searchParams.set(key, value);
  return `${url.pathname}${url.search}`;
}

function buildSignupPath(planId?: PricingPlan["id"], focus?: string) {
  const url = new URL("/signup", "https://leadcue.local");
  if (planId) {
    url.searchParams.set("plan", planId);
  }
  if (focus) {
    url.searchParams.set("focus", focus);
  }
  return `${url.pathname}${url.search}`;
}

async function commercialIdsForEmail(email: string) {
  const digest = await shortHash(email);
  return {
    userId: `user_${digest}`,
    workspaceId: `ws_${digest}`,
    memberId: `member_${digest}`,
    icpId: `icp_${digest}`,
    subscriptionId: `sub_${digest}`
  };
}

function workspaceNameFromSignup(email: string, agencyWebsite?: string | null): string {
  const domain = agencyWebsite ? extractDomain(agencyWebsite) : email.split("@")[1];
  if (!domain) {
    return "Agency Workspace";
  }

  return domain
    .replace(/^www\./, "")
    .split(".")[0]
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ") || "Agency Workspace";
}

async function createUserSession(c: AppContext, db: D1Database, userId: string) {
  const token = `lcs_${crypto.randomUUID()}_${crypto.randomUUID()}`;
  const tokenHash = await sha256(token);
  const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000);
  const sessionId = `sess_${await shortHash(token)}`;

  await db
    .prepare(
      `INSERT INTO auth_sessions
        (id, user_id, session_token_hash, expires_at, last_seen_at)
       VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`
    )
    .bind(sessionId, userId, tokenHash, expiresAt.toISOString())
    .run();

  c.header("Set-Cookie", buildSessionCookie(c, token, expiresAt));
}

async function getAuthenticatedSession(c: AppContext): Promise<AuthSessionRow | null> {
  if (!c.env.DB) {
    return null;
  }

  const token = getSessionToken(c);
  if (!token) {
    return null;
  }

  const tokenHash = await sha256(token);
  const session = await c.env.DB.prepare(
    `SELECT
       s.id as session_id,
       s.user_id,
       u.email,
       u.name,
       wm.workspace_id,
       w.name as workspace_name
     FROM auth_sessions s
     JOIN users u ON u.id = s.user_id
     LEFT JOIN workspace_members wm ON wm.user_id = u.id
     LEFT JOIN workspaces w ON w.id = wm.workspace_id
     WHERE s.session_token_hash = ? AND s.expires_at > ?
     ORDER BY wm.created_at ASC
     LIMIT 1`
  )
    .bind(tokenHash, new Date().toISOString())
    .first<AuthSessionRow>();

  if (!session) {
    return null;
  }

  c.env.DB.prepare(`UPDATE auth_sessions SET last_seen_at = CURRENT_TIMESTAMP WHERE id = ?`)
    .bind(session.session_id)
    .run()
    .catch((error) => console.error("session_touch_failed", error));

  return session;
}

function getSessionToken(c: AppContext): string | null {
  const cookieHeader = c.req.header("Cookie");
  if (!cookieHeader) {
    return null;
  }

  const cookies = cookieHeader.split(";").map((part) => part.trim());
  for (const cookie of cookies) {
    const [name, ...valueParts] = cookie.split("=");
    if (name === SESSION_COOKIE_NAME) {
      return decodeURIComponent(valueParts.join("="));
    }
  }

  return null;
}

function buildSessionCookie(c: AppContext, token: string, expiresAt: Date): string {
  const secure = isSecureRequest(c) ? "; Secure" : "";
  const sameSite = isSecureRequest(c) ? "None" : "Lax";
  return `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=${sameSite}; Max-Age=${SESSION_TTL_SECONDS}; Expires=${expiresAt.toUTCString()}${secure}`;
}

function clearSessionCookie(c: AppContext) {
  const secure = isSecureRequest(c) ? "; Secure" : "";
  const sameSite = isSecureRequest(c) ? "None" : "Lax";
  c.header(
    "Set-Cookie",
    `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=${sameSite}; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT${secure}`
  );
}

function isSecureRequest(c: AppContext): boolean {
  const forwardedProto = c.req.header("X-Forwarded-Proto");
  return forwardedProto === "https" || new URL(c.req.url).protocol === "https:";
}

async function createCommercialWorkspace(
  db: D1Database,
  input: {
    userId: string;
    workspaceId: string;
    memberId: string;
    icpId: string;
    subscriptionId: string;
    email: string;
    workspaceName: string;
    selectedPlan: PricingPlan;
    passwordCredential?: PasswordCredential | null;
    agencyFocus?: string | null;
    offerDescription?: string | null;
    targetIndustries?: string | null;
    firstProspectUrl?: string | null;
  }
) {
  await upsertEmailUser(db, input.userId, input.email, input.workspaceName, input.passwordCredential);
  await upsertWorkspaceBundle(db, {
    userId: input.userId,
    workspaceId: input.workspaceId,
    memberId: input.memberId,
    icpId: input.icpId,
    subscriptionId: input.subscriptionId,
    workspaceName: input.workspaceName,
    selectedPlan: input.selectedPlan,
    agencyFocus: input.agencyFocus,
    offerDescription: input.offerDescription,
    targetIndustries: input.targetIndustries
  });
}

async function upsertEmailUser(
  db: D1Database,
  userId: string,
  email: string,
  workspaceName: string,
  passwordCredential?: PasswordCredential | null
) {
  await db
    .prepare(
      `INSERT INTO users
        (id, email, name, google_sub, auth_provider, last_login_at, password_hash, password_salt, password_iterations, password_updated_at)
       VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?, ?, ?, ?)
       ON CONFLICT(email) DO UPDATE SET
         last_login_at = CURRENT_TIMESTAMP,
         password_hash = COALESCE(excluded.password_hash, users.password_hash),
         password_salt = COALESCE(excluded.password_salt, users.password_salt),
         password_iterations = COALESCE(excluded.password_iterations, users.password_iterations),
         password_updated_at = COALESCE(excluded.password_updated_at, users.password_updated_at)`
    )
    .bind(
      userId,
      email,
      workspaceName,
      `email:${email}`,
      "email",
      passwordCredential?.hash ?? null,
      passwordCredential?.salt ?? null,
      passwordCredential?.iterations ?? null,
      passwordCredential ? new Date().toISOString() : null
    )
    .run();
}

async function upsertWorkspaceBundle(
  db: D1Database,
  input: {
    userId: string;
    workspaceId: string;
    memberId: string;
    icpId: string;
    subscriptionId: string;
    workspaceName: string;
    selectedPlan: PricingPlan;
    agencyFocus?: string | null;
    offerDescription?: string | null;
    targetIndustries?: string | null;
  }
) {
  const serviceType = normalizeServiceType(input.agencyFocus);
  const targetIndustries = input.targetIndustries?.trim() || DEFAULT_ICP.targetIndustries.join(", ");
  const offerDescription = input.offerDescription?.trim() || DEFAULT_ICP.offerDescription;
  const subscriptionStatus = input.selectedPlan.id === "free" ? "active" : "pending_checkout";

  await db.batch([
    db
      .prepare(
        `INSERT INTO workspaces
          (id, owner_user_id, name, plan, monthly_credit_limit, updated_at)
         VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
         ON CONFLICT(id) DO UPDATE SET
           name = excluded.name,
           plan = excluded.plan,
           monthly_credit_limit = excluded.monthly_credit_limit,
           updated_at = CURRENT_TIMESTAMP`
      )
      .bind(
        input.workspaceId,
        input.userId,
        input.workspaceName,
        input.selectedPlan.id,
        input.selectedPlan.monthlyCredits
      ),
    db
      .prepare(
        `INSERT OR IGNORE INTO workspace_members
          (id, workspace_id, user_id, role)
         VALUES (?, ?, ?, ?)`
      )
      .bind(input.memberId, input.workspaceId, input.userId, "owner"),
    db
      .prepare(
        `INSERT INTO icp_profiles
          (id, workspace_id, service_type, target_industries, target_countries, target_company_size, offer_description, tone, avoided_industries, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
         ON CONFLICT(workspace_id) DO UPDATE SET
           service_type = excluded.service_type,
           target_industries = excluded.target_industries,
           offer_description = excluded.offer_description,
           updated_at = CURRENT_TIMESTAMP`
      )
      .bind(
        input.icpId,
        input.workspaceId,
        serviceType,
        targetIndustries,
        DEFAULT_ICP.targetCountries.join(", "),
        DEFAULT_ICP.targetCompanySize,
        offerDescription,
        DEFAULT_ICP.tone,
        DEFAULT_ICP.avoidedIndustries.join(", ")
      ),
    db
      .prepare(
        `INSERT INTO subscriptions
          (id, workspace_id, provider, plan, status, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
         ON CONFLICT(id) DO UPDATE SET
           provider = excluded.provider,
           plan = excluded.plan,
           status = excluded.status,
           updated_at = CURRENT_TIMESTAMP`
      )
      .bind(
        input.subscriptionId,
        input.workspaceId,
        input.selectedPlan.id === "free" ? "leadcue" : "stripe",
        input.selectedPlan.id,
        subscriptionStatus
      )
  ]);
}

async function signInWithGoogleUser(
  env: Env,
  db: D1Database,
  input: {
    profile: GoogleUserProfile;
    metadata: GoogleOauthMetadata;
  }
): Promise<{ userId: string; checkoutUrl?: string; isNewUser: boolean }> {
  const existingUser = await findUserForGoogleProfile(db, input.profile);
  const userId = existingUser?.id || `user_${await shortHash(input.profile.sub)}`;
  const workspaceName = workspaceNameFromSignup(input.profile.email);

  await upsertGoogleUser(db, {
    userId,
    existingUserId: existingUser?.id,
    email: input.profile.email,
    googleSub: input.profile.sub,
    name: input.profile.name || workspaceName,
    avatarUrl: input.profile.picture
  });

  const isNewUser = !existingUser;
  return { userId, isNewUser };
}

async function findUserForGoogleProfile(db: D1Database, profile: GoogleUserProfile) {
  return db
    .prepare(
      `SELECT id, email, name, google_sub, auth_provider
       FROM users
       WHERE google_sub = ? OR email = ?
       ORDER BY CASE WHEN google_sub = ? THEN 0 ELSE 1 END
       LIMIT 1`
    )
    .bind(profile.sub, profile.email, profile.sub)
    .first<ExistingUserRow>();
}

async function upsertGoogleUser(
  db: D1Database,
  input: {
    userId: string;
    existingUserId?: string;
    email: string;
    googleSub: string;
    name: string;
    avatarUrl?: string;
  }
) {
  const userId = input.existingUserId || input.userId;

  await db
    .prepare(
      `INSERT INTO users
        (id, email, name, google_sub, avatar_url, auth_provider, last_login_at)
       VALUES (?, ?, ?, ?, ?, 'google', CURRENT_TIMESTAMP)
       ON CONFLICT(id) DO UPDATE SET
         email = excluded.email,
         name = excluded.name,
         google_sub = excluded.google_sub,
         avatar_url = excluded.avatar_url,
         auth_provider = 'google',
         last_login_at = CURRENT_TIMESTAMP`
    )
    .bind(userId, input.email, input.name, input.googleSub, input.avatarUrl ?? null)
    .run();
}

async function getPrimaryWorkspaceMembership(db: D1Database, userId: string) {
  return db
    .prepare(
      `SELECT wm.workspace_id, w.name
       FROM workspace_members wm
       JOIN workspaces w ON w.id = wm.workspace_id
       WHERE wm.user_id = ?
       ORDER BY wm.created_at ASC
       LIMIT 1`
    )
    .bind(userId)
    .first<{ workspace_id: string; name: string }>();
}

async function exchangeGoogleCode(env: Env, code: string, codeVerifier: string) {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: env.GOOGLE_CLIENT_ID!,
      client_secret: env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: env.GOOGLE_REDIRECT_URI!,
      grant_type: "authorization_code",
      code_verifier: codeVerifier
    })
  });

  const payload = (await response.json().catch(() => ({}))) as GoogleTokenResponse & {
    error?: string;
    error_description?: string;
  };

  if (!response.ok || !payload.access_token) {
    throw new Error(payload.error_description || payload.error || "Google token exchange failed.");
  }

  return payload;
}

async function fetchGoogleUserProfile(accessToken: string) {
  const response = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  const payload = (await response.json().catch(() => ({}))) as GoogleUserProfile;

  if (!response.ok || !payload.sub || !payload.email) {
    throw new Error("Google user profile is unavailable.");
  }

  if (payload.email_verified !== true) {
    throw new Error("Google email address must be verified.");
  }

  return payload;
}

function randomBase64Url(bytes: number) {
  return bytesToBase64Url(crypto.getRandomValues(new Uint8Array(bytes)));
}

async function pkceChallenge(codeVerifier: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(codeVerifier));
  return bytesToBase64Url(new Uint8Array(digest));
}

function bytesToBase64Url(bytes: Uint8Array) {
  const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join("");
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function createPasswordCredential(password: string): Promise<PasswordCredential> {
  const salt = randomBase64Url(24);
  return {
    hash: await derivePasswordHash(password, salt, PASSWORD_HASH_ITERATIONS),
    salt,
    iterations: PASSWORD_HASH_ITERATIONS
  };
}

async function verifyPassword(
  password: string,
  credential: { hash: string; salt: string; iterations: number }
): Promise<boolean> {
  const hash = await derivePasswordHash(password, credential.salt, credential.iterations);
  return timingSafeEqual(hash, credential.hash);
}

async function derivePasswordHash(password: string, salt: string, iterations: number): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: encoder.encode(salt),
      iterations,
      hash: "SHA-256"
    },
    key,
    256
  );

  return bytesToBase64Url(new Uint8Array(bits));
}

async function persistSignupIntent(
  db: D1Database,
  input: {
    id: string;
    userId: string;
    workspaceId: string;
    email: string;
    planId: string;
    agencyFocus?: string | null;
    agencyWebsite?: string | null;
    offerDescription: string;
    targetIndustries?: string | null;
    firstProspectUrl?: string | null;
  }
) {
  await db
    .prepare(
      `INSERT INTO signup_intents
        (id, user_id, workspace_id, email, plan_id, agency_focus, agency_website, offer_description, target_industries, first_prospect_url, source)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      input.id,
      input.userId,
      input.workspaceId,
      input.email,
      input.planId,
      input.agencyFocus ?? null,
      input.agencyWebsite ?? null,
      input.offerDescription,
      input.targetIndustries ?? null,
      input.firstProspectUrl ?? null,
      "commercial_signup"
    )
    .run();
}

function normalizeServiceType(value?: string | null): "seo" | "web_design" | "marketing" | "custom" {
  if (value === "seo" || value === "web_design" || value === "marketing" || value === "custom") {
    return value;
  }

  return DEFAULT_ICP.serviceType;
}

async function getWorkspaceSnapshot(db: D1Database, workspaceId: string) {
  const workspace = await getWorkspace(db, workspaceId);
  if (!workspace) {
    return null;
  }

  const subscription = await getSubscription(db, workspaceId);
  const setup = await getWorkspaceSetup(db, workspaceId);
  const credits = await getWorkspaceCredits(db, workspaceId, workspace);
  const leadCountRow = await db
    .prepare(`SELECT COUNT(*) as count FROM leads WHERE workspace_id = ?`)
    .bind(workspaceId)
    .first<{ count: number }>();
  const leadCount = leadCountRow?.count ?? 0;

  return {
    workspace: {
      id: workspace.id,
      name: workspace.name,
      createdAt: workspace.created_at
    },
    setup,
    onboarding: {
      completedAt: workspace.onboarding_completed_at || null,
      isComplete: Boolean(workspace.onboarding_completed_at)
    },
    plan: credits.plan,
    subscription: {
      provider: subscription?.provider || (workspace.plan === "free" ? "leadcue" : "stripe"),
      status: subscription?.status || "active",
      customerId: subscription?.provider_customer_id || null,
      currentPeriodEnd: subscription?.current_period_end || null
    },
    credits: {
      used: credits.used,
      remaining: credits.remaining,
      reset: credits.reset
    },
    leadCount,
    source: "d1"
  };
}

function sampleWorkspaceSnapshot(workspaceId: string, locale: ScanLocale = "en") {
  const plan = PRICING_PLANS[0];
  const sampleContent = getSampleLocaleContent(locale);
  const sampleCard = buildSampleProspectCard(locale);

  return {
    workspace: {
      id: workspaceId,
      name: sampleContent.workspaceName,
      createdAt: new Date().toISOString()
    },
    setup: {
      serviceType: DEFAULT_ICP.serviceType,
      agencyFocus: "web_design",
      targetIndustries: sampleContent.targetIndustries,
      targetCountries: sampleContent.targetCountries,
      offerDescription: sampleContent.offerDescription,
      tone: DEFAULT_ICP.tone,
      agencyWebsite: "https://leadcue.app",
      firstProspectUrl: sampleCard.website
    },
    onboarding: {
      completedAt: new Date().toISOString(),
      isComplete: true
    },
    plan,
    subscription: {
      provider: "leadcue",
      status: "active",
      customerId: null,
      currentPeriodEnd: null
    },
    credits: {
      used: 4,
      remaining: plan.monthlyCredits - 4,
      reset: nextMonthIso()
    },
    leadCount: 1,
    source: "sample"
  };
}

async function getWorkspaceSetup(db: D1Database, workspaceId: string) {
  const [profile, signupContext] = await Promise.all([
    db
      .prepare(
        `SELECT service_type, target_industries, target_countries, offer_description, tone
         FROM icp_profiles
         WHERE workspace_id = ?
         LIMIT 1`
      )
      .bind(workspaceId)
      .first<IcpProfileRow>(),
    db
      .prepare(
        `SELECT agency_focus, agency_website, first_prospect_url, target_industries
         FROM signup_intents
         WHERE workspace_id = ?
         ORDER BY created_at DESC
         LIMIT 1`
      )
      .bind(workspaceId)
      .first<SignupContextRow>()
  ]);

  return {
    serviceType: profile?.service_type || DEFAULT_ICP.serviceType,
    agencyFocus: profile?.service_type || signupContext?.agency_focus || null,
    targetIndustries: splitCsv(profile?.target_industries ?? signupContext?.target_industries, DEFAULT_ICP.targetIndustries),
    targetCountries: splitCsv(profile?.target_countries, DEFAULT_ICP.targetCountries),
    offerDescription: profile?.offer_description || DEFAULT_ICP.offerDescription,
    tone: profile?.tone || DEFAULT_ICP.tone,
    agencyWebsite: signupContext?.agency_website || null,
    firstProspectUrl: signupContext?.first_prospect_url || null
  };
}

function splitCsv(value: string | null | undefined, fallback: string[] = []) {
  const items = value
    ?.split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  return items?.length ? items : fallback;
}

async function getWorkspaceCredits(db: D1Database, workspaceId: string, workspaceRow?: WorkspaceRow) {
  const workspace = workspaceRow ?? (await getWorkspace(db, workspaceId));
  const plan = getPlan(workspace?.plan || "free");
  const limit = workspace?.monthly_credit_limit || plan.monthlyCredits;
  const used = await getMonthlyCreditsUsed(db, workspaceId);

  return {
    plan: {
      ...plan,
      monthlyCredits: limit
    },
    used,
    remaining: Math.max(0, limit - used),
    reset: nextMonthIso()
  };
}

async function getMonthlyCreditsUsed(db: D1Database, workspaceId: string): Promise<number> {
  const monthStart = new Date();
  monthStart.setUTCDate(1);
  monthStart.setUTCHours(0, 0, 0, 0);

  const row = await db
    .prepare(
      `SELECT COALESCE(SUM(ABS(amount)), 0) as used
       FROM credit_transactions
       WHERE workspace_id = ? AND type = 'debit' AND created_at >= ?`
    )
    .bind(workspaceId, monthStart.toISOString())
    .first<{ used: number }>();

  return row?.used ?? 0;
}

async function checkScanAccess(db: D1Database, workspaceId: string, creditsNeeded: number) {
  const workspace = await getWorkspace(db, workspaceId);
  if (!workspace) {
    return { ok: false as const, reason: "workspace_not_found", error: "Workspace not found." };
  }

  const subscription = await getSubscription(db, workspaceId);
  if (workspace.plan !== "free" && !ACTIVE_SUBSCRIPTION_STATUSES.has(subscription?.status || "")) {
    return {
      ok: false as const,
      reason: "subscription_inactive",
      error: "Your subscription is not active. Update billing before scanning more websites."
    };
  }

  const credits = await getWorkspaceCredits(db, workspaceId, workspace);
  if (credits.remaining < creditsNeeded) {
    return {
      ok: false as const,
      reason: "insufficient_credits",
      error: "This workspace does not have enough scan credits for this request."
    };
  }

  return { ok: true as const };
}

async function getWorkspace(db: D1Database, workspaceId: string) {
  return db
    .prepare(
      `SELECT id, owner_user_id, name, plan, monthly_credit_limit, created_at, onboarding_completed_at
       FROM workspaces
       WHERE id = ?`
    )
    .bind(workspaceId)
    .first<WorkspaceRow>();
}

async function getSubscription(db: D1Database, workspaceId: string) {
  return db
    .prepare(
      `SELECT id, workspace_id, provider, provider_customer_id, provider_subscription_id, plan, status, current_period_start, current_period_end
       FROM subscriptions
       WHERE workspace_id = ?
       ORDER BY created_at DESC
       LIMIT 1`
    )
    .bind(workspaceId)
    .first<SubscriptionRow>();
}

async function createStripeCheckoutSession(
  env: Env,
  input: {
    workspaceId: string;
    signupIntentId: string | null;
    email?: string;
    plan: PricingPlan;
  }
): Promise<{ status: "created"; url: string } | { status: "not_configured" } | { status: "failed"; error: string }> {
  const priceId = stripePriceId(env, input.plan.id);
  if (!env.STRIPE_SECRET_KEY || !priceId) {
    return { status: "not_configured" };
  }

  const baseUrl = appUrl(env);
  const params = new URLSearchParams({
    mode: "subscription",
    "line_items[0][price]": priceId,
    "line_items[0][quantity]": "1",
    success_url: `${baseUrl}/app?workspace=${input.workspaceId}&checkout=success`,
    cancel_url: `${baseUrl}/app/billing?plan=${input.plan.id}&checkout=cancelled`,
    "metadata[workspaceId]": input.workspaceId,
    "metadata[planId]": input.plan.id,
    "subscription_data[metadata][workspaceId]": input.workspaceId,
    "subscription_data[metadata][planId]": input.plan.id
  });

  if (input.email) {
    params.set("customer_email", input.email);
  }

  if (input.signupIntentId) {
    params.set("metadata[signupIntentId]", input.signupIntentId);
  }

  const response = await stripePost(env, "/v1/checkout/sessions", params);
  const payload = (await response.json().catch(() => ({}))) as { url?: string; error?: { message?: string } };

  if (!response.ok || !payload.url) {
    return { status: "failed", error: payload.error?.message || "Unable to create Stripe Checkout session." };
  }

  return { status: "created", url: payload.url };
}

async function createStripePortalSession(env: Env, customerId: string): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  const returnUrl = env.STRIPE_PORTAL_RETURN_URL || `${appUrl(env)}/app/billing`;
  const response = await stripePost(
    env,
    "/v1/billing_portal/sessions",
    new URLSearchParams({
      customer: customerId,
      return_url: returnUrl
    })
  );
  const payload = (await response.json().catch(() => ({}))) as { url?: string; error?: { message?: string } };

  if (!response.ok || !payload.url) {
    return { ok: false, error: payload.error?.message || "Unable to create Stripe portal session." };
  }

  return { ok: true, url: payload.url };
}

async function stripePost(env: Env, path: string, body: URLSearchParams) {
  return fetch(`https://api.stripe.com${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body
  });
}

function stripePriceId(env: Env, planId: PricingPlan["id"]): string | null {
  if (planId === "starter") {
    return cleanStripeValue(env.STRIPE_PRICE_STARTER);
  }

  if (planId === "pro") {
    return cleanStripeValue(env.STRIPE_PRICE_PRO);
  }

  if (planId === "agency") {
    return cleanStripeValue(env.STRIPE_PRICE_AGENCY);
  }

  return null;
}

function cleanStripeValue(value?: string): string | null {
  if (!value || value.startsWith("price_replace")) {
    return null;
  }

  return value;
}

async function verifyStripeSignature(rawBody: string, header: string | undefined, secret: string): Promise<boolean> {
  if (!header) {
    return false;
  }

  const parts = Object.fromEntries(
    header.split(",").map((part) => {
      const [key, value] = part.split("=", 2);
      return [key, value];
    })
  );
  const timestamp = parts.t;
  const signature = parts.v1;

  if (!timestamp || !signature) {
    return false;
  }

  const signedPayload = `${timestamp}.${rawBody}`;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const digest = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(signedPayload));
  const expected = [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");

  return timingSafeEqual(expected, signature);
}

function timingSafeEqual(left: string, right: string): boolean {
  if (left.length !== right.length) {
    return false;
  }

  let result = 0;
  for (let index = 0; index < left.length; index += 1) {
    result |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }

  return result === 0;
}

async function recordBillingEvent(db: D1Database, event: StripeEvent, rawBody: string) {
  await db
    .prepare(
      `INSERT OR IGNORE INTO billing_events
        (id, provider, provider_event_id, event_type, workspace_id, payload_json, processed_at)
       VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`
    )
    .bind(
      `billing_${event.id}`,
      "stripe",
      event.id,
      event.type,
      stripeObjectWorkspaceId(event.data.object) ?? null,
      rawBody
    )
    .run();
}

async function processStripeEvent(db: D1Database, env: Env, event: StripeEvent) {
  const object = event.data.object;

  if (event.type === "checkout.session.completed") {
    const workspaceId = stripeObjectWorkspaceId(object);
    const plan = getPlan(object.metadata?.planId);

    if (workspaceId) {
      await updateSubscriptionFromStripe(db, workspaceId, {
        plan,
        status: "active",
        customerId: asStripeString(object.customer),
        subscriptionId: asStripeString(object.subscription),
        currentPeriodStart: null,
        currentPeriodEnd: null
      });
    }

    return;
  }

  if (event.type.startsWith("customer.subscription.")) {
    const subscriptionId = asStripeString(object.id);
    const workspaceId = stripeObjectWorkspaceId(object) || (subscriptionId ? await workspaceIdForStripeSubscription(db, subscriptionId) : null);
    const priceId = object.items?.data?.[0]?.price?.id;
    const plan = planFromStripePrice(env, priceId) ?? getPlan(object.metadata?.planId);
    const status = event.type === "customer.subscription.deleted" ? "canceled" : object.status || "unknown";

    if (workspaceId) {
      await updateSubscriptionFromStripe(db, workspaceId, {
        plan,
        status,
        customerId: asStripeString(object.customer),
        subscriptionId,
        currentPeriodStart: stripeUnixToIso(object.current_period_start),
        currentPeriodEnd: stripeUnixToIso(object.current_period_end)
      });
    }

    return;
  }

  if (event.type === "invoice.payment_failed") {
    const subscriptionId = asStripeString(object.subscription);
    const workspaceId = subscriptionId ? await workspaceIdForStripeSubscription(db, subscriptionId) : null;

    if (workspaceId) {
      await markSubscriptionStatus(db, workspaceId, "past_due");
    }
  }
}

async function updateSubscriptionFromStripe(
  db: D1Database,
  workspaceId: string,
  input: {
    plan: PricingPlan;
    status: string;
    customerId: string | null;
    subscriptionId: string | null;
    currentPeriodStart: string | null;
    currentPeriodEnd: string | null;
  }
) {
  const effectivePlan = ACTIVE_SUBSCRIPTION_STATUSES.has(input.status) ? input.plan : PRICING_PLANS[0];

  await db.batch([
    db
      .prepare(
        `UPDATE workspaces
         SET plan = ?, monthly_credit_limit = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`
      )
      .bind(effectivePlan.id, effectivePlan.monthlyCredits, workspaceId),
    db
      .prepare(
        `INSERT INTO subscriptions
          (id, workspace_id, provider, provider_customer_id, provider_subscription_id, plan, status, current_period_start, current_period_end, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
         ON CONFLICT(id) DO UPDATE SET
           provider_customer_id = excluded.provider_customer_id,
           provider_subscription_id = excluded.provider_subscription_id,
           plan = excluded.plan,
           status = excluded.status,
           current_period_start = excluded.current_period_start,
           current_period_end = excluded.current_period_end,
           updated_at = CURRENT_TIMESTAMP`
      )
      .bind(
        `sub_${workspaceId.replace(/^ws_/, "")}`,
        workspaceId,
        "stripe",
        input.customerId,
        input.subscriptionId,
        input.plan.id,
        input.status,
        input.currentPeriodStart,
        input.currentPeriodEnd
      )
  ]);
}

async function markSubscriptionStatus(db: D1Database, workspaceId: string, status: string) {
  await db
    .prepare(
      `UPDATE subscriptions
       SET status = ?, updated_at = CURRENT_TIMESTAMP
       WHERE workspace_id = ?`
    )
    .bind(status, workspaceId)
    .run();
}

async function workspaceIdForStripeSubscription(db: D1Database, subscriptionId: string) {
  const row = await db
    .prepare(`SELECT workspace_id FROM subscriptions WHERE provider_subscription_id = ? LIMIT 1`)
    .bind(subscriptionId)
    .first<{ workspace_id: string }>();

  return row?.workspace_id ?? null;
}

function planFromStripePrice(env: Env, priceId?: string): PricingPlan | null {
  if (!priceId) {
    return null;
  }

  if (priceId === env.STRIPE_PRICE_STARTER) {
    return getPlan("starter");
  }

  if (priceId === env.STRIPE_PRICE_PRO) {
    return getPlan("pro");
  }

  if (priceId === env.STRIPE_PRICE_AGENCY) {
    return getPlan("agency");
  }

  return null;
}

function stripeObjectWorkspaceId(object: StripeObject): string | null {
  return object.metadata?.workspaceId || null;
}

function asStripeString(value: string | number | null | undefined): string | null {
  if (typeof value === "string") {
    return value;
  }

  return null;
}

function stripeUnixToIso(value: number | undefined): string | null {
  return value ? new Date(value * 1000).toISOString() : null;
}

async function ensureDemoWorkspace(db: D1Database, workspaceId: string) {
  const userId = "user_demo";
  const sampleContent = getSampleLocaleContent("en");

  await db.batch([
    db
      .prepare(
        `INSERT OR IGNORE INTO users
          (id, email, name, google_sub, auth_provider)
         VALUES (?, ?, ?, ?, ?)`
      )
      .bind(userId, "demo@leadcue.app", sampleContent.pipelineActorName, "demo-google-sub", "google"),
    db
      .prepare(
        `INSERT OR IGNORE INTO workspaces
          (id, owner_user_id, name, plan, monthly_credit_limit)
         VALUES (?, ?, ?, ?, ?)`
      )
      .bind(workspaceId, userId, sampleContent.workspaceName, "free", 20),
    db
      .prepare(
        `INSERT OR IGNORE INTO workspace_members
          (id, workspace_id, user_id, role)
         VALUES (?, ?, ?, ?)`
      )
      .bind("member_demo", workspaceId, userId, "owner"),
    db
      .prepare(
        `INSERT OR IGNORE INTO icp_profiles
          (id, workspace_id, service_type, target_industries, target_countries, target_company_size, offer_description, tone, avoided_industries)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        "icp_demo",
        workspaceId,
        DEFAULT_ICP.serviceType,
        DEFAULT_ICP.targetIndustries.join(", "),
        DEFAULT_ICP.targetCountries.join(", "),
        DEFAULT_ICP.targetCompanySize,
        DEFAULT_ICP.offerDescription,
        DEFAULT_ICP.tone,
        DEFAULT_ICP.avoidedIndustries.join(", ")
      )
  ]);
}

async function persistScanResult(
  db: D1Database,
  workspaceId: string,
  scanId: string,
  leadId: string,
  request: ScanRequest,
  prospect: ProspectCard,
  creditsUsed: number
): Promise<WorkspaceQueueItem> {
  await db.batch([
    db
      .prepare(
        `INSERT INTO leads
          (id, workspace_id, company_name, domain, website_url, industry, summary, fit_score, fit_reason,
           contact_points_json, opportunity_signals_json, outreach_angles_json, first_lines_json, short_email,
           source_notes_json, confidence_score, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
         ON CONFLICT(workspace_id, domain) DO UPDATE SET
           company_name = excluded.company_name,
           website_url = excluded.website_url,
           industry = excluded.industry,
           summary = excluded.summary,
           fit_score = excluded.fit_score,
           fit_reason = excluded.fit_reason,
           contact_points_json = excluded.contact_points_json,
           opportunity_signals_json = excluded.opportunity_signals_json,
           outreach_angles_json = excluded.outreach_angles_json,
           first_lines_json = excluded.first_lines_json,
           short_email = excluded.short_email,
           source_notes_json = excluded.source_notes_json,
           confidence_score = excluded.confidence_score,
           updated_at = CURRENT_TIMESTAMP`
      )
      .bind(
        leadId,
        workspaceId,
        prospect.companyName,
        prospect.domain,
        prospect.website,
        prospect.industry,
        prospect.summary,
        prospect.fitScore,
        prospect.fitReason,
        JSON.stringify(prospect.contactPoints),
        JSON.stringify(prospect.opportunitySignals),
        JSON.stringify(prospect.outreachAngles),
        JSON.stringify(prospect.firstLines),
        prospect.shortEmail,
        JSON.stringify(prospect.sourceNotes),
        prospect.confidenceScore
      ),
    db
      .prepare(
        `INSERT INTO scans
          (id, workspace_id, lead_id, url, scan_type, status, credits_used, raw_extracted_text_hash, completed_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`
      )
      .bind(
        scanId,
        workspaceId,
        leadId,
        request.page.url,
        request.deepScan ? "deep" : "basic",
        "completed",
        creditsUsed,
        await sha256(request.page.text)
      ),
    db
      .prepare(
        `INSERT INTO credit_transactions
          (id, workspace_id, type, amount, reason, scan_id)
         VALUES (?, ?, ?, ?, ?, ?)`
      )
      .bind(`credit_${crypto.randomUUID()}`, workspaceId, "debit", -creditsUsed, "website_scan", scanId)
  ]);

  return upsertQueueItemFromScan(db, workspaceId, scanId, leadId, request, prospect);
}

async function recordFailedScan(
  db: D1Database,
  workspaceId: string,
  scanId: string,
  request: ScanRequest,
  reason: ScanFailureReason,
  error: string
) {
  try {
    await db
      .prepare(
        `INSERT OR IGNORE INTO scans
          (id, workspace_id, lead_id, url, scan_type, status, credits_used, raw_extracted_text_hash, error_message, completed_at)
         VALUES (?, ?, NULL, ?, ?, 'failed', 0, ?, ?, CURRENT_TIMESTAMP)`
      )
      .bind(
        scanId,
        workspaceId,
        request.page.url,
        request.deepScan ? "deep" : "basic",
        await sha256(request.page.text || request.page.url),
        `${reason}: ${error}`
      )
      .run();
  } catch (recordError) {
    console.error("failed_scan_record_failed", recordError);
  }
}

async function sha256(value: string): Promise<string> {
  const buffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function shortHash(value: string): Promise<string> {
  return (await sha256(value)).slice(0, 16);
}

function nextMonthIso(): string {
  const date = new Date();
  date.setUTCMonth(date.getUTCMonth() + 1, 1);
  date.setUTCHours(0, 0, 0, 0);
  return date.toISOString();
}

function isQueueSource(value: unknown): value is QueueSource {
  return value === "manual" || value === "csv" || value === "apollo" || value === "clay" || value === "directory" || value === "workspace";
}

function isWorkspaceResearchStatus(value: unknown): value is WorkspaceResearchStatus {
  return value === "queued" || value === "scanning" || value === "reviewing" || value === "qualified" || value === "archived";
}

function isLeadHandoffStatus(value: unknown): value is LeadHandoffStatus {
  return value === "pending" || value === "exported" || value === "outreach_queued" || value === "contacted" || value === "won";
}

function isExportRunScope(value: unknown): value is ExportRunScope {
  return value === "all_qualified" || value === "selected";
}

function normalizeQueueSource(value: unknown, fallback: QueueSource = "manual"): QueueSource {
  return isQueueSource(value) ? value : fallback;
}

function normalizeLeadIdList(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return [...new Set(value.filter((item): item is string => typeof item === "string" && item.trim().length > 0).map((item) => item.trim()))];
}

function buildExportFileName(
  preset: Extract<ExportRun["preset"], "crm" | "email" | "brief">,
  crmMode: Extract<ExportRun["crmMode"], "hubspot" | "salesforce" | "pipedrive">
) {
  const datePart = new Date().toISOString().slice(0, 10);
  return preset === "crm" ? `leadcue-${preset}-${crmMode}-${datePart}.csv` : `leadcue-${preset}-${datePart}.csv`;
}

function normalizeQueueWebsiteUrl(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const url = new URL(candidate);
    if (!/^https?:$/.test(url.protocol)) {
      return null;
    }
    url.hash = "";
    return url.toString();
  } catch {
    return null;
  }
}

function queueCompanyNameFromDomain(domain: string) {
  return domain
    .replace(/^www\./i, "")
    .split(".")[0]
    .split(/[-_]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function normalizeQueueImportItems(items: QueueImportRequest["items"] | undefined) {
  if (!Array.isArray(items)) {
    return [] as Array<{
      url: string;
      domain: string;
      companyName: string;
      source: QueueSource;
      note: string;
    }>;
  }

  const seenDomains = new Set<string>();

  return items.flatMap((item) => {
    const url = normalizeQueueWebsiteUrl(typeof item?.url === "string" ? item.url : "");
    const domain = (typeof item?.domain === "string" && item.domain.trim() ? item.domain.trim().toLowerCase() : extractDomain(url || "") || "").replace(/^www\./i, "");

    if (!url || !domain || seenDomains.has(domain)) {
      return [];
    }

    seenDomains.add(domain);
    return [
      {
        url,
        domain,
        companyName:
          (typeof item?.companyName === "string" && item.companyName.trim().slice(0, 160)) ||
          queueCompanyNameFromDomain(domain) ||
          domain,
        source: normalizeQueueSource(item?.source, "manual"),
        note: typeof item?.note === "string" ? item.note.trim().slice(0, 1000) : ""
      }
    ];
  });
}

function researchStatusFromPipelineStage(stage: ProspectPipelineStage): WorkspaceResearchStatus {
  if (stage === "archived") {
    return "archived";
  }

  if (stage === "qualified" || stage === "outreach_queued" || stage === "contacted" || stage === "won") {
    return "qualified";
  }

  return "reviewing";
}

function handoffStatusFromPipelineStage(stage: ProspectPipelineStage): LeadHandoffStatus {
  if (stage === "outreach_queued") {
    return "outreach_queued";
  }

  if (stage === "contacted") {
    return "contacted";
  }

  if (stage === "won") {
    return "won";
  }

  return "pending";
}

function mapQueueItem(row: QueueItemRow): WorkspaceQueueItem {
  return {
    id: row.id,
    leadId: row.lead_id || null,
    scanId: row.last_scan_id || null,
    companyName: row.company_name || row.domain,
    domain: row.domain,
    websiteUrl: row.website_url,
    source: normalizeQueueSource(row.source, "manual"),
    note: row.note || "",
    researchStatus: isWorkspaceResearchStatus(row.research_status) ? row.research_status : "queued",
    handoffStatus: isLeadHandoffStatus(row.handoff_status) ? row.handoff_status : "pending",
    createdAt: row.created_at,
    updatedAt: row.updated_at || null
  };
}

function mapExportRun(row: ExportRunRow): ExportRun {
  return {
    id: row.id,
    status: row.status === "failed" ? "failed" : row.status === "pending" ? "pending" : "completed",
    leadCount: row.lead_count || 0,
    preset: row.preset === "email" || row.preset === "brief" ? row.preset : "crm",
    crmMode: row.crm_mode === "salesforce" || row.crm_mode === "pipedrive" ? row.crm_mode : "hubspot",
    scope: isExportRunScope(row.export_scope) ? row.export_scope : "all_qualified",
    fileName: row.file_name || null,
    leadIds: parseJson(row.lead_ids_json, []),
    createdAt: row.created_at,
    completedAt: row.completed_at || null,
    createdByUserId: row.created_by_user_id || null
  };
}

async function getQueueItemRowById(db: D1Database, workspaceId: string, id: string) {
  return db
    .prepare(`SELECT * FROM queue_items WHERE id = ? AND workspace_id = ?`)
    .bind(id, workspaceId)
    .first<QueueItemRow>();
}

async function getQueueItemRowByDomain(db: D1Database, workspaceId: string, domain: string) {
  return db
    .prepare(`SELECT * FROM queue_items WHERE workspace_id = ? AND domain = ?`)
    .bind(workspaceId, domain)
    .first<QueueItemRow>();
}

async function listQueueItems(db: D1Database, workspaceId: string): Promise<WorkspaceQueueItem[]> {
  const query = await db
    .prepare(
      `SELECT *
       FROM queue_items
       WHERE workspace_id = ?
       ORDER BY created_at DESC
       LIMIT 200`
    )
    .bind(workspaceId)
    .all<QueueItemRow>();

  return query.results.map(mapQueueItem);
}

async function upsertQueueImportItems(
  db: D1Database,
  workspaceId: string,
  items: Array<{
    url: string;
    domain: string;
    companyName: string;
    source: QueueSource;
    note: string;
  }>
) {
  const updatedAt = new Date().toISOString();
  await db.batch(
    items.map((item) =>
      db
        .prepare(
          `INSERT INTO queue_items
            (id, workspace_id, lead_id, last_scan_id, domain, website_url, company_name, source, note, research_status, handoff_status, created_at, updated_at)
           VALUES (?, ?, NULL, NULL, ?, ?, ?, ?, ?, 'queued', 'pending', CURRENT_TIMESTAMP, ?)
           ON CONFLICT(workspace_id, domain) DO UPDATE SET
             website_url = excluded.website_url,
             company_name = CASE WHEN excluded.company_name != '' THEN excluded.company_name ELSE queue_items.company_name END,
             source = excluded.source,
             note = CASE WHEN excluded.note != '' THEN excluded.note ELSE queue_items.note END,
             updated_at = excluded.updated_at`
        )
        .bind(`queue_${crypto.randomUUID()}`, workspaceId, item.domain, item.url, item.companyName, item.source, item.note, updatedAt)
    )
  );
}

async function archiveOrDeleteQueueItem(db: D1Database, workspaceId: string, id: string) {
  const row = await getQueueItemRowById(db, workspaceId, id);
  if (!row) {
    return { ok: false, removed: false, archived: false };
  }

  if (row.lead_id) {
    const updatedAt = new Date().toISOString();
    await db
      .prepare(
        `UPDATE queue_items
         SET research_status = 'archived', updated_at = ?
         WHERE id = ? AND workspace_id = ?`
      )
      .bind(updatedAt, id, workspaceId)
      .run();
    return { ok: true, removed: false, archived: true };
  }

  await db.prepare(`DELETE FROM queue_items WHERE id = ? AND workspace_id = ?`).bind(id, workspaceId).run();
  return { ok: true, removed: true, archived: false };
}

async function markQueueItemScanning(db: D1Database, workspaceId: string, id: string) {
  await db
    .prepare(
      `UPDATE queue_items
       SET research_status = CASE
         WHEN research_status IN ('qualified', 'archived') THEN research_status
         ELSE 'scanning'
       END,
       updated_at = ?
       WHERE id = ? AND workspace_id = ?`
    )
    .bind(new Date().toISOString(), id, workspaceId)
    .run();
}

async function resetQueueItemAfterFailedScan(db: D1Database, workspaceId: string, id: string) {
  await db
    .prepare(
      `UPDATE queue_items
       SET research_status = CASE
         WHEN research_status = 'scanning' THEN 'queued'
         ELSE research_status
       END,
       updated_at = ?
       WHERE id = ? AND workspace_id = ?`
    )
    .bind(new Date().toISOString(), id, workspaceId)
    .run();
}

async function upsertQueueItemFromScan(
  db: D1Database,
  workspaceId: string,
  scanId: string,
  leadId: string,
  request: ScanRequest,
  prospect: ProspectCard
): Promise<WorkspaceQueueItem> {
  const domain = (prospect.domain || extractDomain(request.page.url) || request.page.url).replace(/^www\./i, "");
  const websiteUrl = prospect.website || request.page.url;
  const note = typeof request.queueNote === "string" ? request.queueNote.trim().slice(0, 1000) : "";
  const requestedId = typeof request.queueItemId === "string" && request.queueItemId.trim() ? request.queueItemId.trim() : null;
  const requestedRow = requestedId ? await getQueueItemRowById(db, workspaceId, requestedId) : null;
  const domainRow = requestedRow?.domain === domain ? requestedRow : await getQueueItemRowByDomain(db, workspaceId, domain);
  const currentRow = domainRow || requestedRow;
  const updatedAt = new Date().toISOString();
  const researchStatus =
    currentRow?.research_status === "qualified" || currentRow?.research_status === "archived"
      ? (currentRow.research_status as WorkspaceResearchStatus)
      : "reviewing";
  const handoffStatus =
    currentRow && isLeadHandoffStatus(currentRow.handoff_status) && currentRow.handoff_status !== "pending"
      ? currentRow.handoff_status
      : "pending";
  const source = normalizeQueueSource(request.queueSource, normalizeQueueSource(currentRow?.source, "workspace"));
  const queueId = currentRow?.id || requestedId || `queue_${crypto.randomUUID()}`;
  const queueNote = note || currentRow?.note || "";

  await db
    .prepare(
      `INSERT INTO queue_items
        (id, workspace_id, lead_id, last_scan_id, domain, website_url, company_name, source, note, research_status, handoff_status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)
       ON CONFLICT(id) DO UPDATE SET
         lead_id = excluded.lead_id,
         last_scan_id = excluded.last_scan_id,
         domain = excluded.domain,
         website_url = excluded.website_url,
         company_name = excluded.company_name,
         source = excluded.source,
         note = excluded.note,
         research_status = excluded.research_status,
         handoff_status = excluded.handoff_status,
         updated_at = excluded.updated_at`
    )
    .bind(queueId, workspaceId, leadId, scanId, domain, websiteUrl, prospect.companyName || domain, source, queueNote, researchStatus, handoffStatus, updatedAt)
    .run();

  const queueRow = await getQueueItemRowById(db, workspaceId, queueId);
  if (!queueRow) {
    throw new Error("Queue item could not be loaded after scan persistence.");
  }

  return mapQueueItem(queueRow);
}

async function syncQueueItemFromLeadPipeline(
  db: D1Database,
  workspaceId: string,
  input: {
    leadId: string;
    domain: string;
    websiteUrl: string;
    companyName: string;
    note: string;
    stage: ProspectPipelineStage;
    updatedAt: string;
  }
): Promise<WorkspaceQueueItem> {
  const existingRow =
    (await db
      .prepare(`SELECT * FROM queue_items WHERE workspace_id = ? AND lead_id = ?`)
      .bind(workspaceId, input.leadId)
      .first<QueueItemRow>()) ||
    (await getQueueItemRowByDomain(db, workspaceId, input.domain));
  const queueId = existingRow?.id || `queue_${crypto.randomUUID()}`;

  await db
    .prepare(
      `INSERT INTO queue_items
        (id, workspace_id, lead_id, last_scan_id, domain, website_url, company_name, source, note, research_status, handoff_status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)
       ON CONFLICT(id) DO UPDATE SET
         lead_id = excluded.lead_id,
         domain = excluded.domain,
         website_url = excluded.website_url,
         company_name = excluded.company_name,
         source = excluded.source,
         note = excluded.note,
         research_status = excluded.research_status,
         handoff_status = excluded.handoff_status,
         updated_at = excluded.updated_at`
    )
    .bind(
      queueId,
      workspaceId,
      input.leadId,
      existingRow?.last_scan_id || null,
      input.domain,
      input.websiteUrl,
      input.companyName,
      normalizeQueueSource(existingRow?.source, "workspace"),
      input.note.trim().slice(0, 1000),
      researchStatusFromPipelineStage(input.stage),
      handoffStatusFromPipelineStage(input.stage),
      input.updatedAt
    )
    .run();

  const queueRow = await getQueueItemRowById(db, workspaceId, queueId);
  if (!queueRow) {
    throw new Error("Queue item could not be loaded after pipeline update.");
  }

  return mapQueueItem(queueRow);
}

async function resolveExportLeadRows(
  db: D1Database,
  workspaceId: string,
  scope: ExportRunScope,
  selectedLeadIds: string[]
) {
  const baseQuery = `
    SELECT l.*
    FROM leads l
    INNER JOIN queue_items q
      ON q.workspace_id = l.workspace_id
     AND q.lead_id = l.id
    WHERE l.workspace_id = ?
      AND q.research_status = 'qualified'`;

  if (scope === "selected") {
    if (!selectedLeadIds.length) {
      return [] as LeadDetailRow[];
    }

    const placeholders = selectedLeadIds.map(() => "?").join(", ");
    const query = await db
      .prepare(`${baseQuery} AND l.id IN (${placeholders}) ORDER BY l.created_at DESC`)
      .bind(workspaceId, ...selectedLeadIds)
      .all<LeadDetailRow>();
    return query.results;
  }

  const query = await db
    .prepare(`${baseQuery} ORDER BY l.created_at DESC`)
    .bind(workspaceId)
    .all<LeadDetailRow>();
  return query.results;
}

async function recordExportRun(
  db: D1Database,
  input: {
    id: string;
    workspaceId: string;
    leadIds: string[];
    status: ExportRun["status"];
    leadCount: number;
    preset: ExportRun["preset"];
    crmMode: ExportRun["crmMode"];
    scope: ExportRun["scope"];
    createdByUserId: string | null;
    fileName: string;
    completedAt: string;
  }
) {
  await db
    .prepare(
      `INSERT INTO exports
        (id, workspace_id, status, r2_key, lead_count, created_at, completed_at, preset, crm_mode, export_scope, lead_ids_json, created_by_user_id, file_name, updated_at)
       VALUES (?, ?, ?, NULL, ?, CURRENT_TIMESTAMP, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      input.id,
      input.workspaceId,
      input.status,
      input.leadCount,
      input.completedAt,
      input.preset,
      input.crmMode,
      input.scope,
      JSON.stringify(input.leadIds),
      input.createdByUserId,
      input.fileName,
      input.completedAt
    )
    .run();
}

async function markQueueItemsExported(db: D1Database, workspaceId: string, leadIds: string[], updatedAt: string) {
  if (!leadIds.length) {
    return;
  }

  const placeholders = leadIds.map(() => "?").join(", ");
  await db
    .prepare(
      `UPDATE queue_items
       SET handoff_status = CASE
         WHEN handoff_status IN ('outreach_queued', 'contacted', 'won') THEN handoff_status
         ELSE 'exported'
       END,
       updated_at = ?
       WHERE workspace_id = ?
         AND lead_id IN (${placeholders})`
    )
    .bind(updatedAt, workspaceId, ...leadIds)
    .run();
}

async function listExportRuns(db: D1Database, workspaceId: string): Promise<ExportRun[]> {
  const query = await db
    .prepare(
      `SELECT *
       FROM exports
       WHERE workspace_id = ?
       ORDER BY created_at DESC
       LIMIT 50`
    )
    .bind(workspaceId)
    .all<ExportRunRow>();

  return query.results.map(mapExportRun);
}

interface LeadRow {
  id: string;
  company_name: string | null;
  domain: string;
  website_url: string;
  industry: string | null;
  fit_score: number | null;
  confidence_score: number | null;
  owner: string | null;
  pipeline_stage: string | null;
  pipeline_notes: string | null;
  pipeline_updated_at: string | null;
  created_at: string;
}

interface QueueItemRow {
  id: string;
  workspace_id: string;
  lead_id: string | null;
  last_scan_id: string | null;
  domain: string;
  website_url: string;
  company_name: string | null;
  source: string | null;
  note: string | null;
  research_status: string | null;
  handoff_status: string | null;
  created_at: string;
  updated_at: string | null;
}

interface ExportRunRow {
  id: string;
  status: string;
  lead_count: number | null;
  completed_at: string | null;
  preset: string | null;
  crm_mode: string | null;
  export_scope: string | null;
  lead_ids_json: string | null;
  created_by_user_id: string | null;
  file_name: string | null;
  created_at: string;
}

interface ScanHistoryDbRow {
  id: string;
  url: string;
  scan_type: string;
  status: string;
  credits_used: number | null;
  error_message: string | null;
  created_at: string;
  completed_at: string | null;
  lead_id: string | null;
  company_name: string | null;
  domain: string | null;
  idempotency_key: string | null;
  credits_charged: number | null;
  error_reason: string | null;
  idempotency_status: string | null;
  idempotency_updated_at: string | null;
}

interface ScanIdempotencyHistoryRow {
  id: string;
  idempotency_key: string;
  status: "processing" | "completed" | "failed" | "replayed";
  scan_id: string | null;
  lead_id: string | null;
  credits_charged: number | null;
  error_reason: string | null;
  error_message: string | null;
  response_json: string | null;
  created_at: string;
  updated_at: string | null;
  url: string | null;
  scan_type: string | null;
  credits_used: number | null;
  completed_at: string | null;
  company_name: string | null;
  domain: string | null;
}

interface ScanIdempotencyRow {
  id: string;
  workspace_id: string;
  idempotency_key: string;
  request_hash: string;
  status: "processing" | "completed" | "failed" | "replayed";
  status_code: number | null;
  response_json: string | null;
  scan_id: string | null;
  lead_id: string | null;
  credits_charged: number;
  error_reason: string | null;
  error_message: string | null;
  created_at: string;
  updated_at: string | null;
}

interface WorkspaceRow {
  id: string;
  owner_user_id: string;
  name: string;
  plan: string;
  monthly_credit_limit: number;
  created_at: string;
  onboarding_completed_at: string | null;
}

interface IcpProfileRow {
  service_type: string | null;
  target_industries: string | null;
  target_countries: string | null;
  offer_description: string | null;
  tone: string | null;
}

interface SignupContextRow {
  agency_focus: string | null;
  agency_website: string | null;
  first_prospect_url: string | null;
  target_industries: string | null;
}

interface SubscriptionRow {
  id: string;
  workspace_id: string;
  provider: string;
  provider_customer_id: string | null;
  provider_subscription_id: string | null;
  plan: string;
  status: string;
  current_period_start: string | null;
  current_period_end: string | null;
}

interface AuthSessionRow {
  session_id: string;
  user_id: string;
  email: string;
  name: string | null;
  workspace_id: string | null;
  workspace_name: string | null;
}

interface ExistingUserRow {
  id: string;
  email: string;
  name: string | null;
  google_sub: string;
  auth_provider: string;
}

interface EmailPasswordUserRow {
  id: string;
  email: string;
  name: string | null;
  password_hash: string | null;
  password_salt: string | null;
  password_iterations: number | null;
}

interface OauthStateRow {
  id: string;
  state: string;
  code_verifier: string | null;
  redirect_uri: string | null;
  metadata_json: string | null;
  expires_at: string;
}

interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  id_token?: string;
  refresh_token?: string;
  scope?: string;
  token_type?: string;
}

interface GoogleUserProfile {
  sub: string;
  email: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
}

interface StripeEvent {
  id: string;
  type: string;
  data: {
    object: StripeObject;
  };
}

interface StripeObject {
  id?: string;
  customer?: string | number | null;
  subscription?: string | number | null;
  status?: string;
  current_period_start?: number;
  current_period_end?: number;
  metadata?: Record<string, string | undefined>;
  items?: {
    data?: Array<{
      price?: {
        id?: string;
      };
    }>;
  };
}

interface LeadDetailRow extends LeadRow {
  summary: string | null;
  fit_reason: string | null;
  contact_points_json: string | null;
  opportunity_signals_json: string | null;
  outreach_angles_json: string | null;
  first_lines_json: string | null;
  short_email: string | null;
  source_notes_json: string | null;
}

interface LeadActivityLogRow {
  id: string;
  actor_name: string | null;
  actor_email: string | null;
  action: "pipeline_context_updated";
  changed_fields_json: string;
  previous_values_json: string;
  current_values_json: string;
  created_at: string;
}

function sampleLeadListItem(locale: ScanLocale = "en"): LeadListItem {
  const sampleCard = buildSampleProspectCard(locale);
  return {
    id: "lead_sample",
    companyName: sampleCard.companyName,
    domain: sampleCard.domain,
    websiteUrl: sampleCard.website,
    industry: sampleCard.industry,
    fitScore: sampleCard.fitScore,
    confidenceScore: sampleCard.confidenceScore,
    createdAt: new Date().toISOString(),
    pipelineContext: defaultPipelineContext()
  };
}

function mapLeadListItem(row: LeadRow): LeadListItem {
  return {
    id: row.id,
    companyName: row.company_name || row.domain,
    domain: row.domain,
    websiteUrl: row.website_url,
    industry: row.industry || "unknown",
    fitScore: row.fit_score ?? 0,
    confidenceScore: row.confidence_score ?? 0,
    createdAt: row.created_at,
    pipelineContext: mapPipelineContext(row)
  };
}

function mapLeadDetail(row: LeadDetailRow, exportStatus: "not_exported" | "exported" = "not_exported"): ProspectCard {
  return {
    companyName: row.company_name || row.domain,
    website: row.website_url,
    domain: row.domain,
    industry: row.industry || "unknown",
    summary: row.summary || "",
    fitScore: row.fit_score ?? 0,
    fitReason: row.fit_reason || "",
    contactPoints: parseJson(row.contact_points_json, SAMPLE_PROSPECT_CARD.contactPoints),
    opportunitySignals: parseJson(row.opportunity_signals_json, []),
    outreachAngles: parseJson(row.outreach_angles_json, []),
    firstLines: parseJson(row.first_lines_json, []),
    shortEmail: row.short_email || "",
    sourceNotes: parseJson(row.source_notes_json, []),
    confidenceScore: row.confidence_score ?? 0,
    savedStatus: "saved",
    exportStatus,
    pipelineContext: mapPipelineContext(row)
  };
}

function defaultPipelineContext(): ProspectPipelineContext {
  return {
    owner: "",
    stage: "researching",
    notes: "",
    updatedAt: null
  };
}

function samplePipelineActivity(
  locale: ScanLocale = "en",
  options: { currentValues?: ProspectPipelineContext } = {}
): ProspectPipelineActivity[] {
  const sampleContent = getSampleLocaleContent(locale);
  const currentValues = options.currentValues || {
    owner: sampleContent.pipelineOwner,
    stage: "qualified",
    notes: sampleContent.pipelineNotes,
    updatedAt: new Date(Date.now() - 1000 * 60 * 12).toISOString()
  };

  return [
    {
      id: "activity_demo_pipeline",
      actorName: sampleContent.pipelineActorName,
      actorEmail: null,
      action: "pipeline_context_updated",
      changedFields: ["owner", "stage", "notes"],
      previousValues: defaultPipelineContext(),
      currentValues,
      createdAt: currentValues.updatedAt || new Date().toISOString()
    }
  ];
}

function isDemoLeadId(value: string) {
  return value === "lead_sample" || /^lead_demo_\d+$/.test(value);
}

function changedPipelineFields(
  previousValues: ProspectPipelineContext,
  currentValues: ProspectPipelineContext
): Array<"owner" | "stage" | "notes"> {
  const fields: Array<"owner" | "stage" | "notes"> = [];

  if (previousValues.owner !== currentValues.owner) {
    fields.push("owner");
  }

  if (previousValues.stage !== currentValues.stage) {
    fields.push("stage");
  }

  if (previousValues.notes !== currentValues.notes) {
    fields.push("notes");
  }

  return fields;
}

async function getLeadPipelineActivity(
  db: D1Database,
  workspaceId: string,
  leadId: string
): Promise<ProspectPipelineActivity[]> {
  const { results } = await db
    .prepare(
      `SELECT id, actor_name, actor_email, action, changed_fields_json, previous_values_json, current_values_json, created_at
       FROM lead_activity_logs
       WHERE workspace_id = ? AND lead_id = ?
       ORDER BY created_at DESC
       LIMIT 10`
    )
    .bind(workspaceId, leadId)
    .all<LeadActivityLogRow>();

  return results.map(mapLeadActivityLog);
}

function mapLeadActivityLog(row: LeadActivityLogRow): ProspectPipelineActivity {
  return {
    id: row.id,
    actorName: row.actor_name || "Unknown user",
    actorEmail: row.actor_email || null,
    action: "pipeline_context_updated",
    changedFields: parseJson<Array<"owner" | "stage" | "notes">>(row.changed_fields_json, []),
    previousValues: parseJson(row.previous_values_json, defaultPipelineContext()),
    currentValues: parseJson(row.current_values_json, defaultPipelineContext()),
    createdAt: row.created_at
  };
}

async function createLeadPipelineActivity(
  c: AppContext,
  input: {
    workspaceId: string;
    leadId: string;
    previousValues: ProspectPipelineContext;
    currentValues: ProspectPipelineContext;
    changedFields: Array<"owner" | "stage" | "notes">;
  }
): Promise<ProspectPipelineActivity | null> {
  const db = c.env.DB;

  if (!db) {
    return null;
  }

  const actor = await getAuthenticatedSession(c).catch(() => null);
  const activityId = `act_${crypto.randomUUID()}`;
  const createdAt = input.currentValues.updatedAt || new Date().toISOString();

  try {
    await db
      .prepare(
        `INSERT INTO lead_activity_logs
          (id, workspace_id, lead_id, actor_user_id, actor_name, actor_email, action, changed_fields_json, previous_values_json, current_values_json, created_at)
         VALUES (?, ?, ?, ?, ?, ?, 'pipeline_context_updated', ?, ?, ?, ?)`
      )
      .bind(
        activityId,
        input.workspaceId,
        input.leadId,
        actor?.user_id || null,
        actor?.name || actor?.email || "Workspace user",
        actor?.email || null,
        JSON.stringify(input.changedFields),
        JSON.stringify(input.previousValues),
        JSON.stringify(input.currentValues),
        createdAt
      )
      .run();

    return {
      id: activityId,
      actorName: actor?.name || actor?.email || "Workspace user",
      actorEmail: actor?.email || null,
      action: "pipeline_context_updated",
      changedFields: input.changedFields,
      previousValues: input.previousValues,
      currentValues: input.currentValues,
      createdAt
    };
  } catch (error) {
    console.error("lead_activity_log_insert_failed", error);
    return null;
  }
}

function isPipelineStage(value: unknown): value is ProspectPipelineStage {
  return (
    value === "researching" ||
    value === "qualified" ||
    value === "outreach_queued" ||
    value === "contacted" ||
    value === "won" ||
    value === "archived"
  );
}

function mapPipelineContext(row: {
  owner?: string | null;
  pipeline_stage?: string | null;
  pipeline_notes?: string | null;
  pipeline_updated_at?: string | null;
}): ProspectPipelineContext {
  return {
    owner: row.owner?.trim() || "",
    stage: isPipelineStage(row.pipeline_stage) ? row.pipeline_stage : "researching",
    notes: row.pipeline_notes?.trim() || "",
    updatedAt: row.pipeline_updated_at || null
  };
}

function normalizePipelineContext(input: ProspectContextUpdateRequest): ProspectPipelineContext | null {
  const owner = typeof input.owner === "string" ? input.owner.trim().slice(0, 120) : "";
  const notes = typeof input.notes === "string" ? input.notes.trim().slice(0, 5000) : "";
  const stage = isPipelineStage(input.stage) ? input.stage : null;

  if (!stage) {
    return null;
  }

  return {
    owner,
    stage,
    notes,
    updatedAt: null
  };
}

function parseJson<T>(value: string | null, fallback: T): T {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}
