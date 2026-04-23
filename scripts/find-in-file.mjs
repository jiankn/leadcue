import fs from "node:fs";
import path from "node:path";

const [, , filePath, ...patterns] = process.argv;

if (!filePath || !patterns.length) {
  console.error("Usage: node scripts/find-in-file.mjs <file> <pattern...>");
  process.exit(1);
}

const absolutePath = path.resolve(process.cwd(), filePath);
const lines = fs.readFileSync(absolutePath, "utf8").split(/\r?\n/);

for (let index = 0; index < lines.length; index += 1) {
  const line = lines[index];
  if (patterns.some((pattern) => line.includes(pattern))) {
    const lineNumber = String(index + 1).padStart(5, " ");
    console.log(`${lineNumber}: ${line}`);
  }
}
