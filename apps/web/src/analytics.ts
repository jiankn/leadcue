type AnalyticsPayload = {
  name: string;
  page?: string;
  metadata?: Record<string, unknown>;
};

export async function trackEvent(payload: AnalyticsPayload) {
  if (typeof window === "undefined" || !payload.name) {
    return;
  }

  const body = JSON.stringify({
    name: payload.name,
    page: payload.page || `${window.location.pathname}${window.location.search}`,
    metadata: payload.metadata || {}
  });

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon("/api/analytics/events", blob);
      return;
    }

    await fetch("/api/analytics/events", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body
    });
  } catch {
    // Best-effort analytics. Ignore network failures.
  }
}
