#!/usr/bin/env node
/**
 * Start Postgres (Docker), backend (:3000), and frontend (:5173).
 * Usage: pnpm dev   |   node scripts/dev.mjs
 */
import { spawn, spawnSync } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const isWin = process.platform === 'win32';

function run(cmd, args, opts = {}) {
  const result = spawnSync(cmd, args, {
    cwd: root,
    stdio: 'inherit',
    shell: isWin,
    env: process.env,
    ...opts,
  });
  if (result.status !== 0 && result.status !== null) {
    process.exit(result.status);
  }
  return result;
}

async function waitForPostgres(maxAttempts = 40) {
  for (let i = 1; i <= maxAttempts; i++) {
    const result = spawnSync(
      'docker',
      ['inspect', '-f', '{{.State.Health.Status}}', 'swt-postgres'],
      { encoding: 'utf8', shell: isWin },
    );
    const status = (result.stdout || '').trim();
    process.stdout.write(`\rWaiting for Postgres... (${i}/${maxAttempts}) ${status || 'pending'}   `);
    if (status === 'healthy') {
      process.stdout.write('\n');
      return;
    }
    await delay(1500);
  }
  console.error('\nPostgres did not become healthy in time.');
  process.exit(1);
}

function startLongRunning(label, cmd, args, color) {
  const child = spawn(cmd, args, {
    cwd: root,
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: isWin,
    env: process.env,
  });

  const prefix = (line) => `${color}[${label}]\x1b[0m ${line}`;

  const pipe = (stream) => {
    let buffer = '';
    stream.on('data', (chunk) => {
      buffer += chunk.toString();
      const lines = buffer.split(/\r?\n/);
      buffer = lines.pop() ?? '';
      for (const line of lines) {
        if (line.length) console.log(prefix(line));
      }
    });
  };

  pipe(child.stdout);
  pipe(child.stderr);

  child.on('exit', (code, signal) => {
    console.log(prefix(`exited code=${code} signal=${signal ?? ''}`));
  });

  return child;
}

async function main() {
  console.log('Starting database (Docker Compose)...');
  run('docker', [
    'compose',
    '-f',
    'database/docker/docker-compose.yml',
    '--env-file',
    'database/docker/.env',
    'up',
    '-d',
  ]);

  await waitForPostgres();
  console.log('Postgres is healthy.');
  console.log('Starting backend (:3000) and frontend (:5173)...');
  console.log('Press Ctrl+C to stop app servers (Postgres keeps running).');
  console.log('  Stop DB later with: pnpm db:down\n');

  const backend = startLongRunning(
    'backend',
    'pnpm',
    ['--filter', '@smart-work-tracking/backend', 'dev:server'],
    '\x1b[36m',
  );
  const frontend = startLongRunning(
    'frontend',
    'pnpm',
    ['--filter', '@smart-work-tracking/frontend', 'dev'],
    '\x1b[35m',
  );

  const shutdown = () => {
    console.log('\nStopping backend and frontend...');
    backend.kill('SIGTERM');
    frontend.kill('SIGTERM');
    setTimeout(() => process.exit(0), 500);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  await Promise.race([
    new Promise((resolve) => backend.on('exit', resolve)),
    new Promise((resolve) => frontend.on('exit', resolve)),
  ]);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
