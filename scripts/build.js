const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ARTIFACT = path.join('dist', 'word-list', 'browser', 'index.html');
const POLL_MS = 2000;
const TIMEOUT_MS = 120000;

function log(msg) {
  const ts = new Date().toISOString();
  process.stderr.write(`[build.js ${ts}] ${msg}\n`);
}

log(`CWD: ${process.cwd()}`);
log(`Artifact path: ${path.resolve(ARTIFACT)}`);
log('Spawning ng build...');

const child = spawn('pnpm', ['exec', 'ng', 'build', '--no-progress'], {
  stdio: 'inherit'
});

child.on('exit', (code, signal) => {
  log(`Child exited: code=${code} signal=${signal}`);
  process.exit(code || 0);
});

child.on('error', (err) => {
  log(`Child error: ${err.message}`);
  process.exit(1);
});

const poll = setInterval(() => {
  const distExists = fs.existsSync('dist/word-list');
  const browserExists = fs.existsSync('dist/word-list/browser');
  const artifactExists = fs.existsSync(ARTIFACT);
  log(`Poll: dist=${distExists} browser=${browserExists} index=${artifactExists}`);

  if (artifactExists) {
    clearInterval(poll);
    clearTimeout(safety);
    log('Artifact found. Sending SIGKILL.');
    child.kill('SIGKILL');
    setTimeout(() => {
      log('Exiting.');
      process.exit(0);
    }, 500);
  }
}, POLL_MS);

const safety = setTimeout(() => {
  clearInterval(poll);
  const exists = fs.existsSync(ARTIFACT);
  log(`Safety timeout. Artifact exists: ${exists}`);
  child.kill('SIGKILL');
  process.exit(exists ? 0 : 1);
}, TIMEOUT_MS);
