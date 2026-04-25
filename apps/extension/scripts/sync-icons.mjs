import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..", "..", "..");
const sourceSvg = path.join(repoRoot, "apps", "web", "public", "favicon.svg");
const outputDir = path.join(repoRoot, "apps", "extension", "icons");
const sizes = [16, 32, 48, 128];

const svgBuffer = await fs.readFile(sourceSvg);
await fs.mkdir(outputDir, { recursive: true });

for (const size of sizes) {
  await sharp(svgBuffer).resize(size, size).png().toFile(path.join(outputDir, `icon-${size}.png`));
}
