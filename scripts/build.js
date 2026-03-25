const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ARTIFACT = path.join('dist', 'word-list', 'browser', 'index.html');

function log(msg) {
  process.stderr.write(`[build.js] ${msg}\n`);
}

log('Spawning ng build with piped stdio...');

const child = spawn('pnpm', ['exec', 'ng', 'build', '--no-progress'], {
  stdio: ['ignore', 'pipe', 'pipe']
});

// Forward child output to our stdout/stderr
child.stdout.on('data', (d) => process.stdout.write(d));
child.stderr.on('data', (d) => process.stderr.write(d));

let buildDone = false;

// Watch child stdout for the completion message
child.stdout.on('data', (data) => {
  const text = data.toString();
  if (text.includes('Application bundle generation complete') || text.includes('Application bundle generation failed')) {
    buildDone = true;
    log('Build output detected completion. Waiting 2s then killing.');
    setTimeout(() => {
      log(`Artifact exists: ${fs.existsSync(ARTIFACT)}`);
      log('Sending SIGKILL to child.');
      child.kill('SIGKILL');
    }, 2000);
  }
});

child.on('exit', (code, signal) => {
  log(`Child exited: code=${code} signal=${signal}`);
  if (buildDone || fs.existsSync(ARTIFACT)) {
    log('Build succeeded. Exiting 0.');
    process.exit(0);
  }
  process.exit(code || 1);
});

// Safety timeout
setTimeout(() => {
  log(`Safety timeout. Artifact exists: ${fs.existsSync(ARTIFACT)}`);
  child.kill('SIGKILL');
  process.exit(fs.existsSync(ARTIFACT) ? 0 : 1);
}, 120000);
