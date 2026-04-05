/**
 * Windows: stop whatever is listening on a TCP port (e.g. stale next dev on 3000).
 * Usage: node scripts/free-port.cjs 3000
 */
const { execSync } = require("child_process");

const port = process.argv[2] || "3000";

const ps = `$c = Get-NetTCPConnection -LocalPort ${port} -State Listen -ErrorAction SilentlyContinue; if ($c) { $c | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }; Write-Host "Freed port ${port}" } else { Write-Host "Port ${port} already free" }`;

try {
  execSync(`powershell -NoProfile -Command ${JSON.stringify(ps)}`, {
    stdio: "inherit",
    windowsHide: true,
  });
} catch {
  process.stdout.write(`(free-port ${port}: could not run PowerShell)\n`);
}
