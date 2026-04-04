const fs = require("fs");
const path = require("path");

const nextDir = path.join(__dirname, "..", ".next");
if (fs.existsSync(nextDir)) {
  fs.rmSync(nextDir, { recursive: true, force: true });
  process.stdout.write("Removed .next\n");
} else {
  process.stdout.write("No .next folder (already clean)\n");
}
