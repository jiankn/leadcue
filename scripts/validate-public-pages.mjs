import fs from "node:fs";
import path from "node:path";
import { authNoIndexPaths, getSearchEngineVerifications, localeMeta } from "./seo-utils.mjs";

const distDir = process.argv[2] ? path.resolve(process.argv[2]) : path.resolve("apps/web/dist");

if (!fs.existsSync(distDir)) {
  console.error(`Dist directory not found: ${distDir}`);
  process.exit(1);
}

const htmlFiles = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".html")) {
      htmlFiles.push(fullPath);
    }
  }
}

walk(distDir);

const findings = [];
const verificationEntries = getSearchEngineVerifications();

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  const relativeFile = path.relative(distDir, file) || "index.html";
  const publicPath = relativeFile === "index.html" ? "/" : `/${relativeFile.replace(/\\/g, "/").replace(/\/index\.html$/, "/").replace(/\.html$/, "")}`;

  if (!/<title>[^<]+<\/title>/i.test(html)) {
    findings.push(`${publicPath}: missing <title>`);
  }

  if (!/<html[^>]*\slang="[^"]+"/i.test(html)) {
    findings.push(`${publicPath}: missing html lang`);
  }

  if (!/meta\s+name=["']description["']\s+content=["'][^"']+/i.test(html)) {
    findings.push(`${publicPath}: missing meta description`);
  }

  if (!/link\s+rel=["']canonical["']\s+href=["']https?:\/\//i.test(html)) {
    findings.push(`${publicPath}: missing canonical link`);
  }

  if (!/link\s+rel=["']alternate["']\s+hreflang=["'][^"']+["']\s+href=["']https?:\/\//i.test(html)) {
    findings.push(`${publicPath}: missing hreflang alternates`);
  }

  if (!/meta\s+name=["']robots["']\s+content=["'][^"']+/i.test(html)) {
    findings.push(`${publicPath}: missing robots meta`);
  }

  if (!/script\s+type=["']application\/ld\+json["']/i.test(html)) {
    findings.push(`${publicPath}: missing JSON-LD`);
  }

  if (!/meta\s+property=["']og:image["']\s+content=["']https?:\/\//i.test(html)) {
    findings.push(`${publicPath}: missing og:image`);
  }

  if (!/meta\s+property=["']og:image:alt["']\s+content=["'][^"']+/i.test(html)) {
    findings.push(`${publicPath}: missing og:image:alt`);
  }

  if (!/meta\s+name=["']twitter:image["']\s+content=["']https?:\/\//i.test(html)) {
    findings.push(`${publicPath}: missing twitter:image`);
  }

  if (!/meta\s+name=["']twitter:image:alt["']\s+content=["'][^"']+/i.test(html)) {
    findings.push(`${publicPath}: missing twitter:image:alt`);
  }

  verificationEntries.forEach((entry) => {
    const pattern = new RegExp(`meta\\s+${entry.attribute}=["']${entry.value}["']\\s+content=["'][^"']+`, "i");

    if (!pattern.test(html)) {
      findings.push(`${publicPath}: missing ${entry.value} verification meta`);
    }
  });
}

const sitemapPath = path.join(distDir, "sitemap.xml");
const robotsPath = path.join(distDir, "robots.txt");
const headersPath = path.join(distDir, "_headers");

if (!fs.existsSync(sitemapPath)) {
  findings.push("/sitemap.xml: missing from dist");
}

if (!fs.existsSync(robotsPath)) {
  findings.push("/robots.txt: missing from dist");
} else {
  const robots = fs.readFileSync(robotsPath, "utf8");
  const expectedNoIndexPaths = [
    ...authNoIndexPaths,
    ...localeMeta
      .filter((locale) => locale.code !== "en")
      .flatMap((locale) => authNoIndexPaths.map((pathname) => `/${locale.code}${pathname}`))
  ];

  expectedNoIndexPaths.forEach((pathname) => {
    if (!robots.includes(`Disallow: ${pathname}`)) {
      findings.push(`/robots.txt: missing ${pathname} disallow rule`);
    }
  });
}

if (!fs.existsSync(headersPath)) {
  findings.push("/_headers: missing from dist");
} else {
  const headers = fs.readFileSync(headersPath, "utf8");
  const expectedHeaderPaths = [
    ...authNoIndexPaths,
    ...localeMeta
      .filter((locale) => locale.code !== "en")
      .flatMap((locale) => authNoIndexPaths.map((pathname) => `/${locale.code}${pathname}`))
  ];

  expectedHeaderPaths.forEach((pathname) => {
    if (!headers.includes(pathname)) {
      findings.push(`/_headers: missing ${pathname} noindex header rule`);
    }
  });
}

if (findings.length) {
  console.error("Public page QA failed:");
  for (const finding of findings) {
    console.error(`- ${finding}`);
  }
  process.exit(1);
}

console.log(`Validated ${htmlFiles.length} prerendered HTML files in ${distDir}.`);
