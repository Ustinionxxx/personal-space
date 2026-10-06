import { spawnSync } from 'node:child_process';
import fs from 'node:fs/promises';
// Fail closed: an old dist cannot be mistaken for a new successful build.
await fs.rm('dist', { recursive: true, force: true });
for (const [command, args] of [
  [process.execPath, ['scripts/prepare.mjs', ...process.argv.slice(2)]],
  [process.execPath, ['node_modules/astro/astro.js', 'check']],
  [process.execPath, ['node_modules/astro/astro.js', 'build']],
  [process.execPath, ['scripts/audit-dist.mjs']],
]) {
  const run = spawnSync(command, args, { stdio: 'inherit', env: process.env });
  if (run.status !== 0) {
    await fs.rm('dist', { recursive: true, force: true });
    process.exit(run.status || 1);
  }
}
