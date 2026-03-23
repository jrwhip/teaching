# Teaching App — Math Restyle & Results Tracking

## Current State (Updated: 2026-03-22)

**Shipped:** v1.0 Math Restyle (2026-03-22, commit f7f2df9)
**Status:** Development / Internal testing
**Users:** Jerry + family (K-6 students)
**Feedback:** Math components worked but looked foreign — hardcoded colors, own navbars, no dark mode, per-component color pickers, localStorage-only scoring
**Codebase:**
- Angular 17.2.4 standalone components with signals
- Nx 18.0.7, TypeScript 5.3.3
- AWS Amplify Gen 2 (Cognito + AppSync + DynamoDB)
- Custom CSS design system with light/dark tokens
- ag-Grid 30, Jest 29, ESLint 8
- pnpm, zone.js still in dependency tree

**Known Issues:**
- Results tracking needs integration testing with live DynamoDB
- Teacher/parent dashboards need real classroom/enrollment seed data
- Canvas components need visual verification on actual mobile devices
- Angular 17 is 4 major versions behind current (21.2.5)
- Jest deprecated in Angular 21, Vitest is now recommended
- zone.js still present despite app being signal-based

## v1.1 Goals

**Vision:** Upgrade to Angular 21 + Nx 22.3, go zoneless, modernize tooling

**Motivation:**
- Angular 17 is end-of-life, missing 4 major versions of improvements
- Zoneless change detection is stable since Angular 20.2 — app already uses signals
- Jest deprecated in Angular 21, Vitest is the future
- ESLint 8 → 9 flat config needed for modern tooling

**Scope (v1.1):**
- Angular 17 → 21 upgrade via Nx migrate
- Nx 18 → 22.3 (required for Angular 21 support)
- TypeScript 5.3 → 5.8+
- Zoneless change detection (remove zone.js)
- Jest → Vitest migration
- ESLint 8 → 9 flat config
- ag-Grid 30 → 35

**Success Criteria:**
- [ ] pnpm build passes on Angular 21 + Nx 22.3
- [ ] All components render correctly (no regressions)
- [ ] zone.js fully removed, app runs zoneless
- [ ] Vitest runs all existing tests
- [ ] ESLint 9 flat config with no lint errors
- [ ] ag-Grid 35 renders data grid correctly

**Out of Scope:**
- Signal Forms (experimental in Angular 21 — wait for stable)
- Angular Aria adoption
- Additional subjects beyond math
- Messaging system (deferred to v1.2)
- Mobile native app

---

<details>
<summary>Original Vision (v1.0 - Archived for reference)</summary>

**One-liner**: Restyle 7 math practice components to use the app's design system, wire results tracking to DynamoDB, and build role-based dashboards.

## Problem

Seven math practice components translated from standalone HTML/JS pages looked foreign in the Angular app — hardcoded colors, own navbars, no dark mode, per-component color pickers, localStorage-only scoring. The Amplify backend had ProblemAttempt and PerformanceCounter models defined but unwired.

## Success Criteria

- [x] All 7 math components use CSS custom properties instead of hardcoded colors
- [x] Dark mode works across all components including canvas rendering
- [x] Per-component color pickers removed, accent color managed globally via ThemeService
- [x] MathResultsService records attempts to DynamoDB when authenticated
- [x] Student math-menu shows personal stats and recent activity
- [x] Teacher and parent dashboards show student results
- [x] All components responsive at mobile widths

## Constraints

- Angular 17 with signals (no RxJS for new code) — upgrading to 21 in v1.1
- pnpm only
- Must preserve all existing math problem generation logic
- CSS custom properties from _tokens.scss / _tokens-dark.scss

## Out of Scope

- New math problem types
- Real-time collaboration
- Offline-first / PWA
- Subjects beyond math

</details>
