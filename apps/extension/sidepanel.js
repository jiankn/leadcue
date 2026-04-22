const DEFAULT_API_BASE = "http://localhost:8787";
const DEFAULT_DASHBOARD_URL = "http://localhost:5173/app";

const els = {
  settingsToggle: document.querySelector("#settingsToggle"),
  settings: document.querySelector("#settings"),
  apiBase: document.querySelector("#apiBase"),
  dashboardUrl: document.querySelector("#dashboardUrl"),
  saveSettings: document.querySelector("#saveSettings"),
  analyzeButton: document.querySelector("#analyzeButton"),
  status: document.querySelector("#status"),
  pageTitle: document.querySelector("#pageTitle"),
  pageUrl: document.querySelector("#pageUrl"),
  result: document.querySelector("#result"),
  companyName: document.querySelector("#companyName"),
  domain: document.querySelector("#domain"),
  fitScore: document.querySelector("#fitScore"),
  summary: document.querySelector("#summary"),
  signals: document.querySelector("#signals"),
  firstLine: document.querySelector("#firstLine"),
  copyFirstLine: document.querySelector("#copyFirstLine"),
  openDashboard: document.querySelector("#openDashboard")
};

let latestFirstLine = "";
let latestDashboardUrl = DEFAULT_DASHBOARD_URL;

init();

async function init() {
  const settings = await chrome.storage.sync.get(["apiBase", "dashboardUrl"]);
  els.apiBase.value = settings.apiBase || DEFAULT_API_BASE;
  els.dashboardUrl.value = settings.dashboardUrl || DEFAULT_DASHBOARD_URL;
  latestDashboardUrl = els.dashboardUrl.value;

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.title) {
    els.pageTitle.textContent = tab.title;
  }
  if (tab?.url) {
    els.pageUrl.textContent = tab.url;
  }
}

els.settingsToggle.addEventListener("click", () => {
  els.settings.hidden = !els.settings.hidden;
});

els.saveSettings.addEventListener("click", async () => {
  await chrome.storage.sync.set({
    apiBase: els.apiBase.value || DEFAULT_API_BASE,
    dashboardUrl: els.dashboardUrl.value || DEFAULT_DASHBOARD_URL
  });
  latestDashboardUrl = els.dashboardUrl.value || DEFAULT_DASHBOARD_URL;
  setStatus("Settings saved.");
});

els.analyzeButton.addEventListener("click", analyzeActiveTab);

els.copyFirstLine.addEventListener("click", async () => {
  if (!latestFirstLine) {
    return;
  }
  await navigator.clipboard.writeText(latestFirstLine);
  setStatus("First line copied.");
});

els.openDashboard.addEventListener("click", () => {
  chrome.tabs.create({ url: latestDashboardUrl || DEFAULT_DASHBOARD_URL });
});

async function analyzeActiveTab() {
  setLoading(true);
  setStatus("Scanning active tab...");

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id || !tab.url || !/^https?:\/\//.test(tab.url)) {
      throw new Error("Open a public company website before scanning.");
    }

    const [{ result: page }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: collectPageSnapshot
    });

    els.pageTitle.textContent = page.title || tab.title || "Active website";
    els.pageUrl.textContent = page.url || tab.url;

    setStatus("Generating Prospect Card...");
    const prospect = await createScan(page);
    renderProspect(prospect);
    setStatus("Prospect Card ready.");
  } catch (error) {
    setStatus(error instanceof Error ? error.message : "Unable to analyze this page.");
  } finally {
    setLoading(false);
  }
}

async function createScan(page) {
  const apiBase = (els.apiBase.value || DEFAULT_API_BASE).replace(/\/$/, "");
  const response = await fetch(`${apiBase}/api/scans`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Workspace-Id": "ws_demo"
    },
    body: JSON.stringify({
      source: "extension",
      page,
      deepScan: false
    })
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "LeadCue API returned an error.");
  }

  const data = await response.json();
  return data.prospect;
}

function renderProspect(prospect) {
  latestFirstLine = prospect.firstLines?.[0] || "";
  els.result.hidden = false;
  els.companyName.textContent = prospect.companyName || prospect.domain;
  els.domain.textContent = prospect.domain || "";
  els.fitScore.textContent = String(prospect.fitScore ?? 0);
  els.summary.textContent = prospect.summary || "";
  els.firstLine.textContent = latestFirstLine;
  els.signals.replaceChildren(
    ...(prospect.opportunitySignals || []).map((signal) => {
      const item = document.createElement("div");
      item.className = "signal";

      const category = document.createElement("span");
      category.textContent = String(signal.category || "signal").replace("_", " ");

      const title = document.createElement("strong");
      title.textContent = signal.signal || "Website signal";

      const reason = document.createElement("p");
      reason.textContent = signal.reason || "";

      const source = document.createElement("small");
      source.textContent = `Source: ${signal.source || "homepage"}`;

      item.append(category, title, reason, source);
      return item;
    })
  );
}

function setStatus(message) {
  els.status.textContent = message;
}

function setLoading(isLoading) {
  els.analyzeButton.disabled = isLoading;
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
