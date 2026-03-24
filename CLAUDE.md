# Teaching App

An educational application for K-6 students, starting with math and designed to expand into other subjects.

## Vision

The app should support multiple subjects. Math (6th grade and lower) is the starting point, but the architecture should accommodate adding new subjects without major restructuring.

## Current Features

- **Word Study** — phonics-based word grouping and practice (section-routed)
- **Math** — rounding practice with random number generation, answer tracking, streaks, and ag-Grid history

## Technology Stack

Currently on Angular 17 / Nx 18. Planned upgrade to latest stable Angular.

**Current:**
- Angular 17, Nx 18, TypeScript 5.3, RxJS 7.8
- Bootstrap 5.3, ag-Grid 30, Font Awesome 6
- SCSS, Jest 29, ESLint + Prettier

**Upgrade targets:**
- Latest stable Angular with zoneless change detection
- Latest Nx
- TypeScript 5.9+
- pnpm (replacing npm, matching Verset)

## Commands

```bash
npm start       # Dev server on :4200
npm run build   # Production build
npm test        # Run Jest tests
npm run lint    # Run ESLint
```

## Architecture

- Single Nx workspace (not a multi-app monorepo currently)
- Standalone components (AppModule is the only remaining traditional module — remove during upgrade)
- Lazy-loaded routes: `/`, `/next-step-word-study`, `/math`
- localStorage for persistence (streaks, answer history)
- Build output: `dist/word-list`

## Testing Rules

- **NEVER use fake, made-up, or random email addresses** when testing features that create Cognito accounts (student creation, registration, etc.). Cognito creates real user records. Ask Jerry for an email address to use. No exceptions.
- Always save test credentials (email + password) to the MCP notes immediately after creating or resetting an account.

## Angular Standards

See `ANGULAR-GUIDE.md` in the workspace root.
