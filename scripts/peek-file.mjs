import fs from "node:fs";
import path from "node:path";

const [, , filePath, startArg = "1", endArg = "120"] = process.argv;

if (!filePath) {
  console.error("Usage: node scripts/peek-file.mjs <file> [start] [end]");
  process.exit(1);
}

const absolutePath = path.resolve(process.cwd(), filePath);
const content = fs.readFileSync(absolutePath, "utf8").split(/\r?\n/);
const start = Math.max(1, Number(startArg));
const end = Math.min(content.length, Number(endArg));

for (let index = start; index <= end; index += 1) {
  const lineNumber = String(index).padStart(5, " ");
  console.log(`${lineNumber}: ${content[index - 1] ?? ""}`);
}
