import { describe, expect, it } from "vitest";
import { buildRuleBasedProspectCard, extractDomain } from "../../packages/shared/src";

describe("extractDomain", () => {
  it("returns host without www", () => {
    expect(extractDomain("https://www.acme.com")).toBe("acme.com");
    expect(extractDomain("https://acme.com/path?q=1")).toBe("acme.com");
    expect(extractDomain("http://sub.domain.acme.com")).toBe("sub.domain.acme.com");
  });

  it("normalizes non-URL input", () => {
    expect(extractDomain("not a url")).toBe("not a url");
    expect(extractDomain("")).toBe("");
  });
});

describe("buildRuleBasedProspectCard", () => {
  it("produces a deterministic fallback card from a scan request", () => {
    const card = buildRuleBasedProspectCard({
      source: "web",
      page: {
        url: "https://acme.example.com",
        title: "Acme Example",
        metaDescription: "A B2B SaaS platform.",
        h1: "Acme hero",
        text: "Acme helps mid-market companies scale their ops with a modern cloud stack.",
        links: []
      }
    });

    expect(card.companyName).toBeTruthy();
    expect(card.domain).toBe("acme.example.com");
    expect(typeof card.fitScore).toBe("number");
    expect(card.fitScore).toBeGreaterThanOrEqual(0);
    expect(card.fitScore).toBeLessThanOrEqual(100);
    expect(Array.isArray(card.firstLines)).toBe(true);
    expect(card.firstLines.length).toBeGreaterThan(0);
  });
});
