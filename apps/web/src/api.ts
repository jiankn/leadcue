const configuredApiBaseUrl = import.meta.env.VITE_API_URL?.trim() || "";

function getApiBaseUrl() {
  if (configuredApiBaseUrl) {
    if (typeof window !== "undefined") {
      try {
        const apiUrl = new URL(configuredApiBaseUrl);
        const pageHostname = window.location.hostname;
        const loopbackHosts = new Set(["localhost", "127.0.0.1"]);

        if (loopbackHosts.has(apiUrl.hostname) && loopbackHosts.has(pageHostname) && apiUrl.hostname !== pageHostname) {
          apiUrl.hostname = pageHostname;
          return apiUrl.toString().replace(/\/+$/, "");
        }
      } catch {
        return configuredApiBaseUrl;
      }
    }

    return configuredApiBaseUrl;
  }

  if (typeof window !== "undefined" && ["leadcue.app", "www.leadcue.app"].includes(window.location.hostname)) {
    return "https://api.leadcue.app";
  }

  return "";
}

export function apiUrl(path: string) {
  const rawApiBaseUrl = getApiBaseUrl();

  if (!rawApiBaseUrl) {
    return path;
  }

  const normalizedBase = rawApiBaseUrl.replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}
