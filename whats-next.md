# What's Next - 2026-03-25 15:35

<original_task>
Deploy the teaching app (Angular 21 + Amplify Gen 2 backend) to AWS Amplify. The `ng build` completes on Amplify CodeBuild ("✔ Building...") but the Node.js process never exits — no summary line, no file listing, no exit code. 61+ failed builds on the teaching app before this session.

Jerry's explicit instruction: create a bare bones throwaway Angular + Amplify Gen 2 app, deploy it end-to-end, then incrementally add teaching app complexity to isolate the problem. Do NOT touch the teaching app until the throwaway works.
</original_task>

<work_completed>
## Step 1: Bare Bones Throwaway — COMPLETE AND DEPLOYED

### The Root Cause: pnpm causes `ng build` to hang in CodeBuild

**The `ng build` hang is caused by pnpm, not by any project configuration.** Same bare bones `ng new` Angular 21 app, same `@angular/build:application` builder, same CodeBuild environment:
- **pnpm**: `ng build` prints "✔ Building..." then hangs forever. No summary, no exit. Process killed after ~5 min of no output.
- **npm**: `ng build` prints "✔ Building...", prints full bundle summary, exits cleanly. Build succeeds. App deploys.

This was proven on a completely fresh `ng new` Angular 21 app with ZERO custom code — just the default scaffold + `aws-amplify` dependency + Amplify Gen 2 auth backend.

### What Was Done

1. **Fixed the throwaway Amplify app (doslohrxluvd2)**
   - Attached `amplifyconsole-backend-role` (AdministratorAccess, trusts amplify.amazonaws.com) as the IAM service role. Previously had `iamServiceRoleArn: null`.
   - Command: `aws amplify update-app --app-id doslohrxluvd2 --iam-service-role-arn "arn:aws:iam::019918485675:role/amplifyconsole-backend-role"`

2. **Replaced throwaway repo with fresh `ng new` Angular 21 app**
   - Nuked all previous content (teaching app source + 258 asset images that had been dumped in)
   - Created fresh app: `npx @angular/cli@latest new amplify-test --style=scss --package-manager=pnpm --skip-git --skip-tests --ssr=false --zoneless`
   - Added Amplify Gen 2 backend: `amplify/backend.ts` (defineBackend with auth), `amplify/auth/resource.ts` (email login), `amplify/package.json` (type: module), `amplify/tsconfig.json`
   - Added `aws-amplify` dependency + CDK devDependencies (`@aws-amplify/backend`, `@aws-amplify/backend-cli`, `aws-cdk`, `aws-cdk-lib`, `constructs`, `esbuild`, `tsx`)
   - Added `amplify.yml` with backend + frontend phases matching official sample pattern
   - Repo: `/tmp/amplify-test/amplify-test/` → `git@github.com:jrwhip/amplify-test.git`

3. **Tested with pnpm (jobs 11-13) — ALL HUNG**
   - Job 11: Backend deployed successfully (first CDK stack creation — Cognito user pool, identity pool, IAM roles, branch linker). Frontend: "✔ Building..." then nothing.
   - Job 12: Changed to `npx ng build --configuration=production`. Same hang.
   - Job 13: Added `@parcel/watcher`, `lmdb`, `msgpackr-extract` to `onlyBuiltDependencies`. Native modules built. Same hang.

4. **Switched to npm (jobs 14-17)**
   - Job 14: npm ci failed — lockfile mismatch (stale pnpm cache in node_modules).
   - Job 15: Same failure even after removing cache flags.
   - Job 16: Added `rm -rf node_modules` before `npm ci`. Still failed — lockfile itself was out of sync.
   - Job 17: Changed to `npm install` instead of `npm ci`. **SUCCESS.** All 3 steps (BUILD, DEPLOY, VERIFY) passed.

5. **App is live at `https://master.doslohrxluvd2.amplifyapp.com`**
   - Backend: Cognito user pool with email auth
   - Frontend: Default Angular 21 scaffold (213 KB bundle)
   - Full end-to-end deployment working
</work_completed>

<work_remaining>
## Step 2: Get pnpm Working on the Throwaway (or Switch Teaching App to npm)

The teaching app uses pnpm. Two paths forward:

### Option A: Fix pnpm on Amplify
- Investigate why pnpm causes `ng build` to hang in CodeBuild specifically
- The pnpm script runner (`pnpm build` → `ng build`) spawns a child process. Something about pnpm's process management keeps the Node.js process alive after esbuild completes in CodeBuild's non-TTY environment.
- Try: `pnpm exec ng build` vs `pnpm run build` vs calling ng binary directly from pnpm's node_modules/.bin
- Try: Setting `CI=true` environment variable in amplify.yml (Amplify does NOT set this automatically)
- Try: `pnpm build && exit 0` or similar to force exit after build (but this borders on "hack" territory)
- Try: Check if there's a pnpm config option for process management behavior in CI

### Option B: Switch the Teaching App to npm
- Simpler and proven to work
- Remove `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `packageManager` field from package.json
- Generate `package-lock.json` with `npm install`
- Update `amplify.yml` to use `npm install` / `npx ng build`
- Update CLAUDE.md to reflect npm

### After Package Manager is Resolved: Step 3 — Incrementally Add Teaching App Complexity
Once pnpm works OR the teaching app switches to npm:
1. Add the teaching app's dependencies one by one (ag-grid, fontawesome, bootstrap, etc.)
2. Add the teaching app's source code
3. Add the teaching app's full backend schema (data models, lambdas, auth groups)
4. Test deployment after each addition to find what (if anything) breaks beyond the pnpm issue
</work_remaining>

<attempted_approaches>
## Things That Did NOT Fix the pnpm Hang

| Attempt | Result |
|---------|--------|
| `pnpm build` (runs `ng build`) | Hang |
| `npx ng build --configuration=production` (with pnpm-installed node_modules) | Hang |
| Adding `@parcel/watcher`, `lmdb`, `msgpackr-extract` to `onlyBuiltDependencies` | Hang (native modules built but didn't help) |
| Simplifying `amplify.yml` (removing redundant preBuild phase) | Hang (on teaching app, jobs 60-61) |
| Stripping Nx from teaching app | Hang (Nx was already removed before this session) |

## Things That DID Fix It

| Change | Result |
|--------|--------|
| Switch from pnpm to npm (`npm install` + `npx ng build`) | SUCCESS — build exits cleanly |

## npm ci Lockfile Issues
- `npm ci` failed because the lockfile generated on local machine (Node v20.19.6) didn't match CodeBuild's resolution (Node v20.19.4). Packages like `zod`, `fast-xml-parser`, `json-schema-to-ts` resolved differently.
- Stale pnpm `node_modules` cache in Amplify also confused `npm ci` (even after `rm -rf node_modules`).
- `npm install` worked because it resolves fresh and updates the lockfile.
- For production, should regenerate `package-lock.json` on CodeBuild's Node version or use `npm install` on first deploy then switch to `npm ci`.
</attempted_approaches>

<critical_context>
## Key IDs
- Teaching app: `d2pf03dad8637l` (branch: main) — DO NOT TOUCH until package manager issue resolved
- Throwaway app: `doslohrxluvd2` (branch: master) — WORKING with npm
- Throwaway repo: `/tmp/amplify-test/amplify-test/` → `git@github.com:jrwhip/amplify-test.git`
- Teaching repo: `/home/jrwhip/Work/AI/teaching/` → `git@github.com:jrwhip/teaching.git`
- Service role: `arn:aws:iam::019918485675:role/amplifyconsole-backend-role` (on throwaway)
- Teaching service role: `arn:aws:iam::019918485675:role/AmplifyServiceRole-Teaching`

## Official Reference
- `github.com/aws-samples/amplify-angular-template` — uses npm, Angular 17, `@angular-devkit/build-angular:application`
- Our throwaway: npm, Angular 21, `@angular/build:application`
- Both work. The builder package name changed but both exit cleanly with npm.

## The Proven amplify.yml Pattern (npm, working)
```yaml
version: 1
backend:
  phases:
    build:
      commands:
        - rm -rf node_modules
        - npm install
        - npx ampx pipeline-deploy --branch $AWS_BRANCH --app-id $AWS_APP_ID
frontend:
  phases:
    build:
      commands:
        - npx ng build --configuration=production
  artifacts:
    baseDirectory: dist/amplify-test/browser
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

## Amplify Environment Facts
- CodeBuild: Node v20.19.4, npm 10.8.2, 8GiB RAM, 4 vCPUs, 128GB disk
- Amplify does NOT set `CI=true` automatically
- Default build timeout: 30 minutes
- Build artifacts persist between backend and frontend phases (node_modules installed in backend phase is available in frontend phase)
- `ampx pipeline-deploy` generates `amplify_outputs.json` — no need for separate `ampx generate outputs` call

## Rules (from Jerry)
- Angular + Amplify WORKS. It is not a bug. Fix the configuration.
- NEVER use timeout hacks, process killers, or wrapper scripts.
- NEVER search GitHub issues for "esbuild hang" or similar.
- Follow the documentation.
- Use agents for research to save context.

## The Nx Stripping Plan
The plan at `/home/jrwhip/.claude/plans/snug-jumping-sparrow.md` was already executed in a previous session. Nx has been fully removed from the teaching app. `angular.json` exists, no `project.json`, no `nx.json`, no `vite.config.ts`. This is NOT the cause of the hang — the hang occurs on a fresh `ng new` app too.
</critical_context>

<current_state>
## Throwaway App (doslohrxluvd2): DEPLOYED AND WORKING
- Backend: Cognito user pool + identity pool + IAM roles (email auth)
- Frontend: Default Angular 21 scaffold (213 KB)
- URL: https://master.doslohrxluvd2.amplifyapp.com
- Package manager: npm
- Last successful job: #17

## Teaching App (d2pf03dad8637l): NOT TOUCHED THIS SESSION
- Still has 61+ failed builds
- Uses pnpm — which is now identified as the cause of the hang
- Nx was stripped in a previous session
- amplify.yml was simplified in a previous session (removed redundant preBuild)
- Decision needed: fix pnpm or switch to npm

## Key Decision Pending
**Should the teaching app switch from pnpm to npm?**
- Pro: npm is proven to work on Amplify, matches official sample
- Pro: Eliminates the hang immediately
- Con: pnpm is used across the workspace (teaching, Verset, mlmlife)
- Con: Changing package manager mid-project requires lockfile migration
- Alternative: Investigate pnpm's specific behavior that causes the hang and fix it

## Git State
- Throwaway repo (`/tmp/amplify-test/amplify-test/`): Clean, last commit `57caf7e` pushed to master
- Teaching repo (`/home/jrwhip/Work/AI/teaching/`): Has uncommitted changes to `notes.json` and `whats-next.md`
</current_state>
