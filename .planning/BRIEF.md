# Teaching App — Math Restyle & Results Tracking

## Current State (Updated: 2026-03-22)

**Shipped:** v1.0 Math Restyle (2026-03-22, commit f7f2df9)
**Status:** Development / Internal testing
**Users:** Jerry + family (K-6 students)
**Feedback:** Math components worked but looked foreign — hardcoded colors, own navbars, no dark mode, per-component color pickers, localStorage-only scoring
**Codebase:**
- Angular 17 standalone components with signals
- AWS Amplify Gen 2 (Cognito + AppSync + DynamoDB)
- Custom CSS design system with light/dark tokens
- pnpm, Nx workspace

**Known Issues:**
- Results tracking needs integration testing with live DynamoDB
- Teacher/parent dashboards need real classroom/enrollment seed data
- Canvas components need visual verification on actual mobile devices

## v1.1 Goals

**Vision:** Integration testing, seed data, and messaging system

**Motivation:**
- v1.0 shipped UI + service layer but needs end-to-end verification
- Dashboards built but need real student data flowing through
- Messaging system requested for teacher-parent-student communication

**Scope (v1.1):**
- Integration testing with live Amplify backend
- Seed data for classrooms, enrollments, parent-student links
- Messaging system (iCloud Mail-inspired 3-pane layout)

**Success Criteria:**
- [ ] Student completes math practice, results appear in DynamoDB
- [ ] Teacher dashboard shows student results from their classroom
- [ ] Parent dashboard shows linked student results
- [ ] Messaging system functional between all three roles

**Out of Scope:**
- Additional subjects beyond math
- Mobile native app
- Public deployment / production hosting

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

- Angular 17 with signals (no RxJS for new code)
- pnpm only
- Must preserve all existing math problem generation logic
- CSS custom properties from _tokens.scss / _tokens-dark.scss

## Out of Scope

- New math problem types
- Real-time collaboration
- Offline-first / PWA
- Subjects beyond math

</details>
