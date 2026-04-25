const PROD_API_BASE = "https://api.leadcue.app";
const FALLBACK_API_BASE = "https://leadcue-api.jiankn.workers.dev";
const PROD_DASHBOARD_URL = "https://leadcue.app/app";
const SETTINGS_KEYS = ["locale"];
const LEGACY_SETTINGS_KEYS = ["apiBase", "dashboardUrl"];
const APP_LOCALE_QUERY_KEY = "lc_locale";
const FALLBACK_LOCALE = "en";
const SUPPORTED_LOCALES = Array.isArray(window.LEADCUE_EXTENSION_SUPPORTED_LOCALES)
  ? window.LEADCUE_EXTENSION_SUPPORTED_LOCALES
  : [FALLBACK_LOCALE];
const ACTIVE_SUBSCRIPTION_STATUSES = new Set(["active", "trialing"]);

const els = {
  settingsToggle: document.querySelector("#settingsToggle"),
  settingsToggleLabel: document.querySelector("#settingsToggleLabel"),
  settings: document.querySelector("#settings"),
  brandTagline: document.querySelector("#brandTagline"),
  permissionNote: document.querySelector("#permissionNote"),
  localeSelect: document.querySelector("#localeSelect"),
  refreshSession: document.querySelector("#refreshSession"),
  authEyebrow: document.querySelector("#authEyebrow"),
  authTitle: document.querySelector("#authTitle"),
  authCopy: document.querySelector("#authCopy"),
  authBadge: document.querySelector("#authBadge"),
  workspaceSummary: document.querySelector("#workspaceSummary"),
  workspaceName: document.querySelector("#workspaceName"),
  workspaceUser: document.querySelector("#workspaceUser"),
  planStats: document.querySelector("#planStats"),
  planName: document.querySelector("#planName"),
  creditsRemaining: document.querySelector("#creditsRemaining"),
  creditsUsed: document.querySelector("#creditsUsed"),
  creditsReset: document.querySelector("#creditsReset"),
  loginButton: document.querySelector("#loginButton"),
  signupButton: document.querySelector("#signupButton"),
  billingButton: document.querySelector("#billingButton"),
  logoutButton: document.querySelector("#logoutButton"),
  deepScanLabel: document.querySelector("#deepScanLabel"),
  deepScanHint: document.querySelector("#deepScanHint"),
  refreshTabLabel: document.querySelector("#refreshTabLabel"),
  refreshTabButton: document.querySelector("#refreshTabButton"),
  deepScan: document.querySelector("#deepScan"),
  scanNote: document.querySelector("#scanNote"),
  analyzeButton: document.querySelector("#analyzeButton"),
  analyzeLabel: document.querySelector("#analyzeLabel"),
  status: document.querySelector("#status"),
  pageTitle: document.querySelector("#pageTitle"),
  pageUrl: document.querySelector("#pageUrl"),
  result: document.querySelector("#result"),
  companyName: document.querySelector("#companyName"),
  domain: document.querySelector("#domain"),
  fitScore: document.querySelector("#fitScore"),
  summary: document.querySelector("#summary"),
  primaryEmail: document.querySelector("#primaryEmail"),
  phoneCount: document.querySelector("#phoneCount"),
  contactPathCount: document.querySelector("#contactPathCount"),
  signals: document.querySelector("#signals"),
  firstLine: document.querySelector("#firstLine"),
  copyFirstLine: document.querySelector("#copyFirstLine"),
  copyEmail: document.querySelector("#copyEmail"),
  openLead: document.querySelector("#openLead"),
  openBilling: document.querySelector("#openBilling")
};

const state = {
  locale: FALLBACK_LOCALE,
  apiBase: PROD_API_BASE,
  dashboardUrl: PROD_DASHBOARD_URL,
  session: null,
  sessionLoading: true,
  tab: null,
  scan: null,
  primaryAction: "none",
  loading: false,
  status: {
    text: "",
    tone: "neutral"
  }
};

init().catch((error) => {
  console.error("extension_init_failed", error);
  setStatus(t("status.initFailed"), "danger");
});

async function init() {
  await loadSettings();
  setStatus(t("status.initializing"), "neutral");
  bindEvents();
  localizeStaticContent();
  render();
  await Promise.all([refreshActiveTab(), refreshSession({ quiet: true })]);
}

function bindEvents() {
  els.settingsToggle.addEventListener("click", () => {
    setSettingsExpanded(els.settings.hidden);
  });

  els.localeSelect.addEventListener("change", () => {
    void updateLocalePreference(els.localeSelect.value);
  });

  els.refreshSession.addEventListener("click", () => void refreshSession());
  els.refreshTabButton.addEventListener("click", () => void refreshActiveTab(true));
  els.analyzeButton.addEventListener("click", () => void handlePrimaryAction());
  els.loginButton.addEventListener("click", openLogin);
  els.signupButton.addEventListener("click", openSignup);
  els.billingButton.addEventListener("click", () => void openBillingDestination());
  els.logoutButton.addEventListener("click", () => void logout());
  els.copyFirstLine.addEventListener("click", () => void copyBestFirstLine());
  els.copyEmail.addEventListener("click", () => void copyPrimaryEmail());
  els.openLead.addEventListener("click", openSavedLead);
  els.openBilling.addEventListener("click", () => void openBillingDestination());

  window.addEventListener("focus", () => void refreshSession({ quiet: true }));
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      void refreshSession({ quiet: true });
    }
  });
}

async function loadSettings() {
  const settings = await chrome.storage.sync.get(SETTINGS_KEYS);
  await chrome.storage.sync.remove(LEGACY_SETTINGS_KEYS);
  state.locale = normalizeLocale(settings.locale || detectPreferredLocale());
  state.apiBase = PROD_API_BASE;
  state.dashboardUrl = PROD_DASHBOARD_URL;
  syncSettingsInputs();
}

async function updateLocalePreference(nextLocale) {
  state.locale = normalizeLocale(nextLocale);
  localizeStaticContent();
  render();
  await chrome.storage.sync.set({ locale: state.locale });
}

function syncSettingsInputs() {
  renderLocaleOptions();
  els.localeSelect.value = state.locale;
}

function renderLocaleOptions() {
  const bundle = getBundle();
  const options = SUPPORTED_LOCALES.map((locale) => {
    const option = document.createElement("option");
    option.value = locale;
    option.textContent = bundle.localeNames?.[locale] || locale.toUpperCase();
    return option;
  });
  els.localeSelect.replaceChildren(...options);
}

async function refreshSession(options = {}) {
  state.sessionLoading = true;
  render();

  await resolveServiceBase();

  try {
    const session = await fetchJson("/api/extension/session", {
      credentials: "include"
    });
    state.session = session;

    if (session?.dashboardUrl) {
      state.dashboardUrl = normalizeUrl(session.dashboardUrl) || state.dashboardUrl;
    }

    if (!options.quiet) {
      if (session?.authenticated) {
        setStatus(
          t("status.connected", {
            workspace: session.workspace?.name || t("labels.workspaceFallback")
          }),
          "success"
        );
      } else if (session?.available === false) {
        setStatus(t("status.apiNotReady"), "warning");
      } else {
        setStatus(t("status.signInReturn"), "neutral");
      }
    }
  } catch (error) {
    console.error("extension_session_failed", error);
    state.session = {
      authenticated: false,
      available: false,
      reason: "api_unreachable",
      appUrl: deriveAppBaseUrl(state.dashboardUrl),
      dashboardUrl: state.dashboardUrl,
      loginUrl: buildAppLink("/login"),
      signupUrl: buildAppLink("/signup?plan=free"),
      billingUrl: buildAppLink("/app/billing"),
      supportUrl: buildAppLink("/support")
    };

    if (!options.quiet) {
      setStatus(t("status.apiUnreachable"), "danger");
    }
  } finally {
    state.sessionLoading = false;
    render();
  }
}

async function resolveServiceBase() {
  const candidates = Array.from(
    new Set(
      [state.apiBase, PROD_API_BASE, FALLBACK_API_BASE]
        .map((value) => normalizeUrl(value))
        .filter(Boolean)
    )
  );

  for (const candidate of candidates) {
    try {
      const response = await fetch(`${candidate}/api/config`, { credentials: "include" });
      if (!response.ok) {
        continue;
      }

      const payload = await response.json().catch(() => ({}));
      state.apiBase = candidate;

      if (payload?.appUrl) {
        state.dashboardUrl = buildDashboardUrl(payload.appUrl);
      }
      return payload;
    } catch {
      // Try the next configured base.
    }
  }

  return null;
}

async function refreshActiveTab(showStatus = false) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  state.tab = tab
    ? {
        id: tab.id || null,
        title: tab.title || t("labels.activeWebsite"),
        url: tab.url || "",
        canScan: Boolean(tab.url && /^https?:\/\//.test(tab.url))
      }
    : null;

  if (showStatus) {
    setStatus(state.tab?.canScan ? t("status.activeTabRefreshed") : t("status.openSiteBeforeScan"), "neutral");
  }

  render();
}

async function analyzeActiveTab() {
  if (state.loading) {
    return;
  }

  if (!state.session?.authenticated) {
    setStatus(t("status.signInBeforeScan"), "warning");
    return;
  }

  const subscriptionStatus = state.session.subscription?.status || "active";
  if (!isSubscriptionActive(subscriptionStatus)) {
    setStatus(
      t("status.billingNeedsAttention", {
        status: formatSubscriptionStatus(subscriptionStatus)
      }),
      "warning"
    );
    return;
  }

  const remainingCredits = Number(state.session.credits?.remaining || 0);
  if (remainingCredits < currentScanCost()) {
    setStatus(
      t("status.insufficientCredits", {
        mode: currentScanModeLabel(),
        credits: formatCreditCount(currentScanCost()),
        remaining: remainingCredits
      }),
      "warning"
    );
    return;
  }

  if (!state.tab?.id || !state.tab.canScan) {
    setStatus(t("status.openSiteBeforeScan"), "warning");
    return;
  }

  state.loading = true;
  render();
  setStatus(
    t("notes.loading", {
      mode: currentScanModeLabel()
    }),
    "neutral"
  );

  try {
    const [{ result: page }] = await chrome.scripting.executeScript({
      target: { tabId: state.tab.id },
      func: collectPageSnapshot
    });

    const result = await fetchJson("/api/scans", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        source: "extension",
        page,
        deepScan: els.deepScan.checked,
        idempotencyKey: `ext_${crypto.randomUUID()}`
      })
    });

    state.scan = {
      leadId: result.leadId,
      scanId: result.scanId,
      creditsCharged: result.creditsCharged,
      prospect: result.prospect
    };

    if (state.session?.authenticated && state.session.credits) {
      state.session.credits = {
        ...state.session.credits,
        used: Number(state.session.credits.used || 0) + Number(result.creditsCharged || 0),
        remaining: Math.max(0, Number(state.session.credits.remaining || 0) - Number(result.creditsCharged || 0))
      };
    }

    setStatus(
      t("formats.scanSaved", {
        company: result.prospect.companyName || result.prospect.domain || t("labels.companyFallback"),
        workspace: state.session.workspace?.name || t("labels.workspaceFallback")
      }),
      "success"
    );
  } catch (error) {
    const reason = error?.payload?.reason;

    if (reason === "workspace_unavailable" || error?.status === 401) {
      await refreshSession({ quiet: true });
    }

    if (reason === "insufficient_credits") {
      setStatus(t("status.insufficientCreditsGeneric"), "warning");
    } else if (reason === "subscription_inactive") {
      setStatus(t("status.subscriptionInactiveGeneric"), "warning");
    } else if (reason === "workspace_unavailable" || error?.status === 401) {
      setStatus(t("status.workspaceUnavailable"), "warning");
    } else {
      setStatus(resolveErrorMessage(error, "status.analyzeFailed"), "danger");
    }
  } finally {
    state.loading = false;
    render();
  }
}

async function handlePrimaryAction() {
  switch (state.primaryAction) {
    case "scan":
      await analyzeActiveTab();
      return;
    case "login":
      openLogin();
      return;
    case "billing":
      await openBillingDestination();
      return;
    default:
      return;
  }
}

async function logout() {
  try {
    await fetchJson("/api/auth/logout", {
      method: "POST",
      credentials: "include"
    });
    state.scan = null;
    setStatus(t("status.signedOut"), "neutral");
  } catch (error) {
    setStatus(resolveErrorMessage(error, "status.signOutFailed"), "danger");
  }

  await refreshSession({ quiet: true });
}

async function openBillingDestination() {
  if (!state.session?.authenticated) {
    openLogin();
    return;
  }

  try {
    const payload = await fetchJson("/api/billing/portal", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({})
    });

    if (payload?.url) {
      chrome.tabs.create({ url: payload.url });
      return;
    }
  } catch (error) {
    console.warn("extension_billing_portal_failed", error);
    setStatus(t("status.billingPortalUnavailable"), "warning");
  }

  chrome.tabs.create({ url: buildAppLink("/app/billing") });
}

async function copyBestFirstLine() {
  const value = state.scan?.prospect?.firstLines?.[0] || "";
  if (!value) {
    setStatus(t("status.noFirstLine"), "warning");
    return;
  }

  try {
    await navigator.clipboard.writeText(value);
    setStatus(t("status.firstLineCopied"), "success");
  } catch (error) {
    console.warn("extension_copy_first_line_failed", error);
    setStatus(t("status.clipboardFailed"), "danger");
  }
}

async function copyPrimaryEmail() {
  const email = state.scan?.prospect?.contactPoints?.emails?.[0] || "";
  if (!email) {
    setStatus(t("status.noPublicEmail"), "warning");
    return;
  }

  try {
    await navigator.clipboard.writeText(email);
    setStatus(t("status.emailCopied"), "success");
  } catch (error) {
    console.warn("extension_copy_email_failed", error);
    setStatus(t("status.clipboardFailed"), "danger");
  }
}

function openSavedLead() {
  if (!state.scan?.leadId) {
    setStatus(t("status.scanBeforeOpenLead"), "warning");
    return;
  }

  const url = new URL(buildAppLink("/app/leads"));
  url.searchParams.set("lead", state.scan.leadId);
  chrome.tabs.create({ url: url.toString() });
}

function openLogin() {
  chrome.tabs.create({ url: buildAppLink("/login") });
  setStatus(t("status.finishSignIn"), "neutral");
}

function openSignup() {
  chrome.tabs.create({ url: buildAppLink("/signup?plan=free") });
  setStatus(t("status.finishSignup"), "neutral");
}

function render() {
  localizeStaticContent();
  renderSessionCard();
  renderScanPanel();
  renderResult();
  renderStatus();
}

function localizeStaticContent() {
  document.documentElement.lang = htmlLangFor(state.locale);
  const sidePanelTitle = t("meta.sidePanelTitle");
  document.title = sidePanelTitle === "meta.sidePanelTitle" ? t("meta.manifestName") : sidePanelTitle;
  els.brandTagline.textContent = t("meta.tagline");
  els.permissionNote.textContent = t("notes.permission");
  els.deepScanHint.textContent = t("labels.deepScanHint");
  renderLocaleOptions();
  els.localeSelect.value = state.locale;
  syncSettingsToggle();

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });

  document.querySelectorAll("[data-i18n-aria-label]").forEach((node) => {
    node.setAttribute("aria-label", t(node.dataset.i18nAriaLabel));
  });
}

function setSettingsExpanded(expanded) {
  els.settings.hidden = !expanded;
  syncSettingsToggle();
}

function syncSettingsToggle() {
  const expanded = !els.settings.hidden;
  const labelKey = expanded ? "buttons.hideSettings" : "buttons.showSettings";
  const ariaKey = expanded ? "aria.hideSettings" : "aria.showSettings";
  els.settingsToggle.setAttribute("aria-expanded", expanded ? "true" : "false");
  els.settingsToggle.setAttribute("aria-label", t(ariaKey));
  els.settingsToggleLabel.textContent = t(labelKey);
}

function renderSessionCard() {
  const session = state.session;

  if (state.sessionLoading) {
    setBadge(t("badges.checking"), "is-muted");
    els.authEyebrow.textContent = t("labels.workspaceAccess");
    els.authTitle.textContent = t("buttons.checkingAccess");
    els.authCopy.textContent = t("notes.checking");
    els.workspaceSummary.hidden = true;
    els.planStats.hidden = true;
    els.loginButton.hidden = true;
    els.signupButton.hidden = true;
    els.billingButton.hidden = true;
    els.logoutButton.hidden = true;
    els.refreshSession.disabled = true;
    return;
  }

  els.refreshSession.disabled = false;

  if (!session?.available) {
    setBadge(t("badges.unavailable"), "is-danger");
    els.authEyebrow.textContent = t("labels.setupNeeded");
    els.authTitle.textContent = t("badges.unavailable");
    els.authCopy.textContent = session?.reason === "database_unavailable" ? t("status.apiNotReady") : t("notes.apiUnavailable");
    els.workspaceSummary.hidden = true;
    els.planStats.hidden = true;
    els.loginButton.hidden = true;
    els.signupButton.hidden = session?.reason === "api_unreachable";
    els.billingButton.hidden = true;
    els.logoutButton.hidden = true;
    return;
  }

  if (!session.authenticated) {
    setBadge(t("badges.signIn"), "is-warning");
    els.authEyebrow.textContent = t("labels.workspaceAccess");
    els.authTitle.textContent = t("buttons.signInToScan");
    els.authCopy.textContent = t("notes.initialSignIn");
    els.workspaceSummary.hidden = true;
    els.planStats.hidden = true;
    els.loginButton.hidden = true;
    els.signupButton.hidden = false;
    els.billingButton.hidden = true;
    els.logoutButton.hidden = true;
    return;
  }

  const subscriptionStatus = session.subscription?.status || "active";
  const remainingCredits = Number(session.credits?.remaining || 0);
  const activeSubscription = isSubscriptionActive(subscriptionStatus);

  setBadge(activeSubscription ? t("badges.signedIn") : t("badges.billing"), activeSubscription ? "is-success" : "is-warning");
  els.authEyebrow.textContent = t("labels.connectedWorkspace");
  els.authTitle.textContent = session.workspace?.name || t("labels.workspaceFallback");
  els.authCopy.textContent = activeSubscription
    ? `${session.plan?.name || t("labels.planUnknown")} · ${formatCreditCount(remainingCredits)}`
    : t("notes.subscriptionInactive", {
        status: formatSubscriptionStatus(subscriptionStatus)
      });

  els.workspaceSummary.hidden = false;
  els.workspaceName.textContent = session.workspace?.name || t("labels.workspaceFallback");
  els.workspaceUser.textContent = session.user?.email || t("labels.signedInWorkspace");

  els.planStats.hidden = false;
  els.planName.textContent = session.plan?.name || t("labels.planUnknown");
  els.creditsRemaining.textContent = `${remainingCredits}`;
  els.creditsUsed.textContent = `${Number(session.credits?.used || 0)}`;
  els.creditsReset.textContent = formatDateLabel(session.credits?.reset);

  els.loginButton.hidden = true;
  els.signupButton.hidden = true;
  els.billingButton.hidden = false;
  els.logoutButton.hidden = false;
}

function renderScanPanel() {
  const tab = state.tab;
  const session = state.session;
  const canScanTab = Boolean(tab?.canScan);
  const scanCost = currentScanCost();
  const remainingCredits = Number(session?.credits?.remaining || 0);
  const subscriptionStatus = session?.subscription?.status || "active";
  const activeSubscription = isSubscriptionActive(subscriptionStatus);

  els.pageTitle.textContent = tab?.title || t("labels.readyToScan");
  els.pageUrl.textContent = tab?.url || t("notes.openPublicSite");

  let note = t("notes.initialSignIn");
  let label = t("buttons.analyzeWebsite");
  let disabled = state.loading;
  let primaryAction = "none";

  if (state.loading) {
    note = t("notes.loading", { mode: currentScanModeLabel() });
    label = t("buttons.scanning");
    disabled = true;
    primaryAction = "none";
  } else if (state.sessionLoading) {
    note = t("notes.checking");
    label = t("buttons.checkingAccess");
    disabled = true;
    primaryAction = "none";
  } else if (!session?.available) {
    note = t("notes.apiUnavailable");
    label = t("badges.unavailable");
    disabled = true;
    primaryAction = "none";
  } else if (!session.authenticated) {
    note = t("notes.signIn");
    label = t("buttons.signIn");
    disabled = false;
    primaryAction = "login";
  } else if (!activeSubscription) {
    note = t("notes.subscriptionInactive", {
      status: formatSubscriptionStatus(subscriptionStatus)
    });
    label = t("buttons.manageBilling");
    disabled = false;
    primaryAction = "billing";
  } else if (!canScanTab) {
    note = t("notes.openPublicSite");
    label = t("buttons.openPublicSite");
    disabled = true;
    primaryAction = "none";
  } else if (remainingCredits < scanCost) {
    note = t("status.insufficientCredits", {
      mode: currentScanModeLabel(),
      credits: formatCreditCount(scanCost),
      remaining: remainingCredits
    });
    label = t("buttons.manageBilling");
    disabled = false;
    primaryAction = "billing";
  } else {
    note = t("formats.creditsCharging", {
      credits: formatCreditCount(scanCost),
      mode: currentScanModeLabel()
    });
    label = t("buttons.analyzeWebsite");
    disabled = false;
    primaryAction = "scan";
  }

  state.primaryAction = primaryAction;
  els.scanNote.textContent = note;
  els.analyzeLabel.textContent = label;
  els.analyzeButton.disabled = disabled;
  els.deepScan.disabled = state.loading;
  els.refreshTabButton.disabled = state.loading;
}

function renderResult() {
  if (!state.scan?.prospect) {
    els.result.hidden = true;
    return;
  }

  const prospect = state.scan.prospect;
  const emails = Array.isArray(prospect.contactPoints?.emails) ? prospect.contactPoints.emails : [];
  const phones = Array.isArray(prospect.contactPoints?.phones) ? prospect.contactPoints.phones : [];
  const contactPages = Array.isArray(prospect.contactPoints?.contactPages) ? prospect.contactPoints.contactPages : [];
  const firstLine = prospect.firstLines?.[0] || "";
  const signals = Array.isArray(prospect.opportunitySignals) ? prospect.opportunitySignals.slice(0, 2) : [];

  els.result.hidden = false;
  els.companyName.textContent = prospect.companyName || prospect.domain || t("labels.companyFallback");
  els.domain.textContent = prospect.website || prospect.domain || "";
  els.fitScore.textContent = `${prospect.fitScore ?? 0}`;
  els.summary.textContent = prospect.summary || t("result.summaryFallback");
  els.primaryEmail.textContent = emails[0] || t("labels.noEmailFound");
  els.phoneCount.textContent = `${phones.length}`;
  els.contactPathCount.textContent = `${contactPages.length}`;
  els.firstLine.textContent = firstLine || t("result.firstLineFallback");
  els.copyFirstLine.disabled = !firstLine;
  els.copyEmail.disabled = !emails[0];
  els.openLead.disabled = !state.scan.leadId;
  els.openBilling.disabled = !state.session?.authenticated;

  if (!signals.length) {
    const item = document.createElement("div");
    item.className = "signal";
    item.textContent = t("result.noSignals");
    els.signals.replaceChildren(item);
    return;
  }

  els.signals.replaceChildren(...signals.map(createSignalNode));
}

function renderStatus() {
  els.status.textContent = state.status.text;
  els.status.className = `status is-${state.status.tone}`;
}

function setBadge(text, toneClass) {
  els.authBadge.textContent = text;
  els.authBadge.className = `status-badge ${toneClass}`;
}

function setStatus(text, tone = "neutral") {
  state.status = {
    text,
    tone
  };
  renderStatus();
}

function createSignalNode(signal) {
  const item = document.createElement("div");
  item.className = "signal";

  const category = document.createElement("span");
  category.textContent = formatSignalCategory(signal.category);

  const title = document.createElement("strong");
  title.textContent = signal.signal || t("result.signalTitleFallback");

  const reason = document.createElement("p");
  reason.textContent = signal.reason || t("result.signalReasonFallback");

  const source = document.createElement("small");
  source.textContent = t("formats.sourcePrefix", {
    label: t("labels.source"),
    value: signal.source || t("labels.homepage")
  });

  item.append(category, title, reason, source);
  return item;
}

async function fetchJson(path, init = {}) {
  const response = await fetch(`${state.apiBase.replace(/\/+$/, "")}${path}`, init);
  const contentType = response.headers.get("Content-Type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json().catch(() => null)
    : await response.text().catch(() => null);

  if (!response.ok) {
    const error = new Error(
      t("formats.apiResponse", {
        status: response.status
      })
    );
    error.status = response.status;
    error.payload = payload && typeof payload === "object" ? payload : null;
    throw error;
  }

  return payload;
}

function resolveErrorMessage(error, fallbackKey) {
  const reason = error?.payload?.reason;

  if (reason === "insufficient_credits") {
    return t("status.insufficientCreditsGeneric");
  }

  if (reason === "subscription_inactive") {
    return t("status.subscriptionInactiveGeneric");
  }

  if (reason === "workspace_unavailable") {
    return t("status.workspaceUnavailable");
  }

  return t(fallbackKey);
}

function currentScanCost() {
  return els.deepScan.checked ? 3 : 1;
}

function currentScanModeLabel() {
  return els.deepScan.checked ? t("scanModes.deep") : t("scanModes.basic");
}

function formatCreditCount(count) {
  const key = Number(count) === 1 ? "formats.creditOne" : "formats.creditOther";
  return t(key, { count });
}

function isSubscriptionActive(status) {
  return ACTIVE_SUBSCRIPTION_STATUSES.has(status || "active");
}

function formatSubscriptionStatus(status) {
  const translated = getValue(getBundle(), ["subscriptionStatuses", status]);
  return typeof translated === "string" ? translated : humanizeLabel(status || t("labels.unknown"));
}

function formatSignalCategory(category) {
  const translated = getValue(getBundle(), ["signalCategories", category]);
  return typeof translated === "string" ? translated : humanizeLabel(category || t("labels.unknown"));
}

function formatDateLabel(value) {
  if (!value) {
    return t("labels.notSet");
  }

  try {
    return new Intl.DateTimeFormat(localeForIntl(state.locale), {
      month: "short",
      day: "numeric"
    }).format(new Date(value));
  } catch {
    return t("labels.notSet");
  }
}

function humanizeLabel(value) {
  const normalized = String(value || "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!normalized) {
    return t("labels.unknown");
  }

  if (/^[\x00-\x7F]+$/.test(normalized)) {
    return normalized.replace(/\b\w/g, (char) => char.toUpperCase());
  }

  return normalized;
}

function normalizeLocale(value) {
  const normalized = String(value || "")
    .trim()
    .toLowerCase()
    .replace("_", "-");

  if (!normalized) {
    return FALLBACK_LOCALE;
  }

  const directMatch = SUPPORTED_LOCALES.find((locale) => locale === normalized);
  if (directMatch) {
    return directMatch;
  }

  if (normalized.startsWith("zh")) {
    return "zh";
  }

  const base = normalized.split("-")[0];
  return SUPPORTED_LOCALES.includes(base) ? base : FALLBACK_LOCALE;
}

function detectPreferredLocale() {
  const browserLocale = typeof chrome.i18n?.getUILanguage === "function" ? chrome.i18n.getUILanguage() : navigator.language;
  return normalizeLocale(browserLocale);
}

function localeForIntl(locale) {
  return locale === "zh" ? "zh-CN" : locale;
}

function htmlLangFor(locale) {
  return locale === "zh" ? "zh-CN" : locale;
}

function getBundle() {
  return window.LEADCUE_EXTENSION_LOCALES?.[state.locale] || window.LEADCUE_EXTENSION_LOCALES?.[FALLBACK_LOCALE] || {};
}

function getValue(target, pathParts) {
  return pathParts.reduce((current, key) => current?.[key], target);
}

function t(key, variables = {}) {
  const path = String(key || "").split(".");
  const value = pickLocaleValue(path);
  if (typeof value !== "string") {
    return key;
  }

  return value.replace(/__([A-Z0-9_]+)__/g, (_, token) => {
    const lowerKey = token.toLowerCase();
    if (variables[token] !== undefined) {
      return `${variables[token]}`;
    }
    if (variables[lowerKey] !== undefined) {
      return `${variables[lowerKey]}`;
    }
    return `__${token}__`;
  });
}

function pickLocaleValue(pathParts) {
  const bundle = getBundle();
  const bundleValue = getValue(bundle, pathParts);
  if (bundleValue !== undefined) {
    return bundleValue;
  }
  return getValue(window.LEADCUE_EXTENSION_LOCALES?.[FALLBACK_LOCALE] || {}, pathParts);
}

function normalizeUrl(value) {
  const trimmed = String(value || "").trim();

  if (!trimmed) {
    return "";
  }

  try {
    return new URL(trimmed).toString().replace(/\/+$/, "");
  } catch {
    return "";
  }
}

function buildDashboardUrl(appUrl) {
  const normalized = normalizeUrl(appUrl);
  return normalized ? `${normalized}/app` : PROD_DASHBOARD_URL;
}

function deriveAppBaseUrl(dashboardUrl) {
  const normalized = normalizeUrl(dashboardUrl);
  if (!normalized) {
    return normalizeUrl(PROD_DASHBOARD_URL).replace(/\/app$/, "");
  }

  try {
    const url = new URL(normalized);
    const pathname = url.pathname.replace(/\/+$/, "");
    return pathname.endsWith("/app") ? `${url.origin}${pathname.slice(0, -4) || ""}` : url.origin;
  } catch {
    return normalizeUrl(PROD_DASHBOARD_URL).replace(/\/app$/, "");
  }
}

function buildAppLink(path) {
  const base = deriveAppBaseUrl(state.session?.dashboardUrl || state.dashboardUrl);
  return new URL(buildLocalizedAppPath(path), `${base}/`).toString();
}

function buildLocalizedAppPath(path) {
  const [pathAndHash = "/", hash = ""] = String(path || "/").split("#");
  const [rawPathname = "/", rawSearch = ""] = pathAndHash.split("?");
  const pathname = rawPathname.startsWith("/") ? rawPathname : `/${rawPathname}`;
  const localizedPath =
    state.locale === FALLBACK_LOCALE ? pathname : pathname === "/" ? `/${state.locale}` : `/${state.locale}${pathname}`;
  const url = new URL(`https://leadcue.local${localizedPath}${rawSearch ? `?${rawSearch}` : ""}${hash ? `#${hash}` : ""}`);

  if (pathname.startsWith("/app")) {
    url.searchParams.set(APP_LOCALE_QUERY_KEY, state.locale);
  }

  return `${url.pathname}${url.search}${url.hash}`;
}

function collectPageSnapshot() {
  const normalize = (value) => String(value || "").replace(/\s+/g, " ").trim();
  const absoluteUrl = (href) => {
    try {
      return new URL(href, location.href).toString();
    } catch {
      return "";
    }
  };

  const text = normalize(document.body?.innerText || "").slice(0, 18000);
  const links = [...document.links]
    .map((link) => absoluteUrl(link.getAttribute("href")))
    .filter(Boolean)
    .slice(0, 220);
  const emails = [...new Set((text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || []).slice(0, 8))];
  const phones = [
    ...new Set(
      (text.match(/(?:\+?\d{1,3}[\s.-]?)?(?:\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}/g) || []).slice(0, 8)
    )
  ];

  return {
    url: location.href,
    title: document.title || location.hostname,
    metaDescription: document.querySelector('meta[name="description"]')?.getAttribute("content") || "",
    h1: document.querySelector("h1")?.innerText || "",
    text,
    links,
    emails,
    phones
  };
}
