import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: false,
    testTimeout: 30_000,
    hookTimeout: 30_000,
    reporters: process.env.CI ? ["default", "github-actions"] : ["default"],
    environment: "node",
    include: ["tests/**/*.test.ts"]
  }
});
