const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ARTIFACT = path.join('dist', 'word-list', 'browser', 'index.html');
const POLL_MS = 2000;
const TIMEOUT_MS = 120000;

console.log('Starting Angular build...');

const child = spawn('pnpm', ['exec', 'ng', 'build', '--no-progress'], {
  stdio: 'inherit',
  env: { ...process.env, CI: 'true', NG_CLI_ANALYTICS: 'false' }
});

child.on('exit', (code) => {
  console.log(`ng build exited with code ${code}`);
  process.exit(code || 0);
});

// Poll for artifacts — ng build hangs after writing files in some environments
const poll = setInterval(() => {
  if (fs.existsSync(ARTIFACT)) {
    clearInterval(poll);
    clearTimeout(safety);
    console.log('Build artifacts verified. Killing hung process.');
    child.kill();
    setTimeout(() => process.exit(0), 1000);
  }
}, POLL_MS);

const safety = setTimeout(() => {
  clearInterval(poll);
  if (fs.existsSync(ARTIFACT)) {
    console.log('Timeout but artifacts exist. Forcing exit.');
    child.kill();
    process.exit(0);
  } else {
    console.error('Build timed out with no artifacts.');
    child.kill();
    process.exit(1);
  }
}, TIMEOUT_MS);
