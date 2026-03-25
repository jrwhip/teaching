#!/bin/bash
# Angular CLI esbuild builder hangs after build in some CI environments.
# Run build in background, verify artifacts, kill orphaned process.

echo "[build.sh] Starting ng build in background..."

pnpm exec ng build --no-progress &
BUILD_PID=$!

echo "[build.sh] Build PID: $BUILD_PID"
echo "[build.sh] Waiting 45 seconds for build to complete..."

sleep 45

echo "[build.sh] Checking for artifacts..."
echo "[build.sh] ls dist/:"
ls -la dist/ 2>&1 || echo "[build.sh] dist/ does not exist"
echo "[build.sh] ls dist/word-list/:"
ls -la dist/word-list/ 2>&1 || echo "[build.sh] dist/word-list/ does not exist"
echo "[build.sh] ls dist/word-list/browser/:"
ls -la dist/word-list/browser/ 2>&1 || echo "[build.sh] dist/word-list/browser/ does not exist"

if [ -f dist/word-list/browser/index.html ]; then
  echo "[build.sh] Build artifacts verified. Killing builder process."
  kill -9 $BUILD_PID 2>/dev/null
  wait $BUILD_PID 2>/dev/null
  echo "[build.sh] Done."
  exit 0
else
  echo "[build.sh] ERROR: index.html not found after 45 seconds."
  kill -9 $BUILD_PID 2>/dev/null
  wait $BUILD_PID 2>/dev/null
  exit 1
fi
