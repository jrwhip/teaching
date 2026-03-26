# What's Next - 2026-03-25 19:47

## Summary
Eliminated the dual package manager hack in the teaching app's Amplify deployment. The fix was `pnpm exec` (no shell wrapper) instead of `pnpm run` or `npx`. Build #70 succeeded with a single pnpm install and `pnpm exec ng build`. Cleaned up all artifacts of the dual-PM workaround.

## Next Steps
- The teaching app deploys cleanly with pnpm only. No further build/deploy work needed.
- Monitor next few deploys to confirm caching (`node_modules/.pnpm`) works correctly and speeds up builds.
- The throwaway app (`doslohrxluvd2` at `/tmp/amplify-test/amplify-test/`) can be deleted when no longer needed for reference.

## Context
## What Changed (build 70)
- `amplify.yml`: Removed frontend preBuild phase (no more `rm -rf node_modules` + `npm install`). Frontend build uses `pnpm exec ng build` instead of `npx ng build`. Removed stale `package-lock.json` from backend rm command. Enabled pnpm cache.
- `package.json`: Removed `overrides` block (was for npm, pnpm doesn't use it).
- `DEPLOYING-ANGULAR-TO-AMPLIFY.md`: Fully rewritten with the resolution. Documents `pnpm exec` vs `pnpm run` as the root cause distinction. Added Phase 5 (the fix) to the mistake history. Updated checklist.

## The Fix
`pnpm exec` runs binaries WITHOUT a shell wrapper. `pnpm run` ALWAYS wraps in a shell. The shell wrapper prevents esbuild's `unref()` from letting Node exit in non-TTY (CI) environments. This was never tested across 69 builds.
