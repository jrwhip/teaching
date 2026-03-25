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
- Angular CLI (no Nx), pnpm
- AWS Amplify (Cognito + AppSync + DynamoDB)

## Commands

```bash
pnpm start      # Dev server on :4200
pnpm build      # Production build
pnpm test       # Run Vitest
pnpm lint       # Run ESLint
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

## Angular Standards

See `ANGULAR-GUIDE.md` in the workspace root.
