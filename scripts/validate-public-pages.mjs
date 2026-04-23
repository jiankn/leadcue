import fs from "node:fs";
import path from "node:path";

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

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  const relativeFile = path.relative(distDir, file) || "index.html";
  const publicPath = relativeFile === "index.html" ? "/" : `/${relativeFile.replace(/\\/g, "/").replace(/\/index\.html$/, "/").replace(/\.html$/, "")}`;

  if (!/<title>[^<]+<\/title>/i.test(html)) {
    findings.push(`${publicPath}: missing <title>`);
  }

  if (!/meta\s+name=["']description["']\s+content=["'][^"']+/i.test(html)) {
    findings.push(`${publicPath}: missing meta description`);
  }

  if (!/link\s+rel=["']canonical["']\s+href=["']https?:\/\//i.test(html)) {
    findings.push(`${publicPath}: missing canonical link`);
  }

  if (!/meta\s+name=["']robots["']\s+content=["'][^"']+/i.test(html)) {
    findings.push(`${publicPath}: missing robots meta`);
  }

  if (!/script\s+type=["']application\/ld\+json["']/i.test(html)) {
    findings.push(`${publicPath}: missing JSON-LD`);
  }
}

const sitemapPath = path.join(distDir, "sitemap.xml");
const robotsPath = path.join(distDir, "robots.txt");

if (!fs.existsSync(sitemapPath)) {
  findings.push("/sitemap.xml: missing from dist");
}

if (!fs.existsSync(robotsPath)) {
  findings.push("/robots.txt: missing from dist");
}

if (findings.length) {
  console.error("Public page QA failed:");
  for (const finding of findings) {
    console.error(`- ${finding}`);
  }
  process.exit(1);
}

console.log(`Validated ${htmlFiles.length} prerendered HTML files in ${distDir}.`);
