import { defineConfig, devices } from "@playwright/test";

const WEB_URL = process.env.LEADCUE_WEB_URL ?? "http://localhost:5173";
const API_URL = process.env.LEADCUE_API_URL ?? "http://localhost:8787";

export default defineConfig({
  testDir: "./tests/e2e",
  globalSetup: "./tests/e2e/helpers/globalSetup.ts",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI ? [["github"], ["list"]] : [["list"]],
  use: {
    baseURL: WEB_URL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure"
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    }
  ],
  metadata: {
    apiUrl: API_URL
  }
});
