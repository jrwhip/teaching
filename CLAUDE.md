# Teaching App

An educational application for K-6 students, starting with math and designed to expand into other subjects.

## Vision

The app should support multiple subjects. Math (6th grade and lower) is the starting point, but the architecture should accommodate adding new subjects without major restructuring.

## Current Features

- **Word Study** — phonics-based word grouping and practice (section-routed)
- **Math** — rounding practice with random number generation, answer tracking, streaks, and ag-Grid history

## Technology Stack

- Angular 21, TypeScript 5.9, RxJS 7.8
- ag-Grid 35, Font Awesome 6
- SCSS, Vitest, ESLint 9, Prettier
- Angular CLI (no Nx), npm
- AWS Amplify (Cognito + AppSync + DynamoDB)

## Commands

```bash
npm start       # Dev server on :4200
npm run build   # Production build
npm test        # Run Vitest
npm run lint    # Run ESLint
```

## Architecture

- Single Angular CLI workspace
- Standalone components
- Lazy-loaded routes: `/`, `/next-step-word-study`, `/math`
- localStorage for persistence (streaks, answer history)
- Build output: `dist/word-list`

## Testing Rules

- **NEVER use fake, made-up, or random email addresses** when testing features that create Cognito accounts (student creation, registration, etc.). Cognito creates real user records. Ask Jerry for an email address to use. No exceptions.
- Always save test credentials (email + password) to the MCP notes immediately after creating or resetting an account.

## Deployment (AWS Amplify)

- **Angular + Amplify works. It is not broken. There is no bug.**
- A vanilla Angular 21 app deploys to Amplify with zero issues. If the teaching app fails to deploy, the problem is in this project's configuration — not in Angular, not in esbuild, not in Amplify.
- **NEVER** treat a build/deploy failure as a framework bug to work around. Read the official Amplify and Angular deployment documentation and follow it.
- **NEVER** use timeout hacks, process killers, wrapper scripts, or any workaround that treats the build process as broken. The build process is fine.
- **NEVER** search GitHub issues for "esbuild hang" or "ng build won't exit" or similar. These are posted by people doing it wrong. Don't join them.
- If deployment fails, the answer is in the documentation or in this project's configuration. Fix the configuration.

## Angular Standards

See `ANGULAR-GUIDE.md` in the workspace root.
