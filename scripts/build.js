const { execSync } = require('child_process');

console.log('Starting Angular build...');
try {
  // Set environment variables to help prevent hangs
  const env = {
    ...process.env,
    CI: 'true',
    NG_CLI_ANALYTICS: 'false',
    NG_BUILD_MAX_WORKERS: '1'
  };

  execSync('pnpm exec ng build --no-progress', { 
    stdio: 'inherit',
    env 
  });
  
  console.log('Build command finished successfully.');
  // Force process exit to clean up any hung child processes/worker pools
  process.exit(0);
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}
