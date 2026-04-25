const configuredApiBaseUrl = import.meta.env.VITE_API_URL?.trim() || "";

function getApiBaseUrl() {
  if (configuredApiBaseUrl) {
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
