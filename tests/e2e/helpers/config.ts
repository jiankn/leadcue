export const WEB_URL = process.env.LEADCUE_WEB_URL ?? "http://localhost:5173";
export const API_URL = process.env.LEADCUE_API_URL ?? "http://localhost:8787";

export const TEST_EMAIL_DOMAIN = "leadcue.test";

export function uniqueTestEmail(prefix = "user"): string {
  const stamp = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 8);
  return `test_${prefix}_${stamp}_${random}@${TEST_EMAIL_DOMAIN}`;
}
