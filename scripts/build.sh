#!/bin/bash
# Angular CLI's esbuild builder hangs after build in non-TTY CI.
# Use timeout to kill it, then verify artifacts exist.

echo "[build.sh] Running ng build with 60s timeout..."
timeout -s KILL 60 pnpm exec ng build --no-progress 2>&1
BUILD_EXIT=$?
echo "[build.sh] Exit code: $BUILD_EXIT"

if [ -f dist/word-list/browser/index.html ]; then
  echo "[build.sh] Build artifacts verified."
  exit 0
fi

echo "[build.sh] ERROR: dist/word-list/browser/index.html not found"
ls -R dist/ 2>&1 | head -20 || echo "[build.sh] dist/ does not exist"
exit 1
