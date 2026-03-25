# Roadmap: Teaching App

## Milestones

- ✅ **v1.0 Math Restyle** - Phases 1-7 (shipped 2026-03-22, commit f7f2df9)
- ✅ **v1.1 Angular 21 Upgrade** - Phase 1 (shipped 2026-03-22, commit 560c724)
- 🚧 **v1.2 Code Quality, Styling & Deploy** - Phases 2-7 (in progress)

## Phases

<details>
<summary>✅ v1.0 Math Restyle (Phases 1-7) - SHIPPED 2026-03-22</summary>

Restyled 7 math practice components to use the app's design system, wired results tracking to DynamoDB, and built role-based dashboards. All work committed at or before f7f2df9.

</details>

<details>
<summary>✅ v1.1 Angular 21 Upgrade (Phase 1) - SHIPPED 2026-03-22</summary>

#### Phase 1: Angular 21 Upgrade
**Goal**: Angular 17→21, Nx 18→22.6, TypeScript 5.3→5.9, zoneless, Vitest, ESLint 9, ag-Grid 35
**Plans**: 3 plans

Plans:
- [x] 01-01: Nx + Angular core migration
- [x] 01-02: Zoneless migration
- [x] 01-03: Tooling modernization

</details>

### 🚧 v1.2 Code Quality, Styling & Deploy

**Milestone Goal:** Full code quality compliance, fix broken Word Study styling, deploy to production.

<details>
<summary>✅ Phase 2: Mechanical Code Standards - COMPLETE 2026-03-23</summary>

**Goal**: Fix all pattern violations — decorator cleanup, injection patterns, typing, control flow
**Plans**: 4 plans

Plans:
- [x] 02-01: Decorator cleanup
- [x] 02-02: Injection & host patterns
- [x] 02-03: TypeScript standards
- [x] 02-04: Reactive forms

</details>

<details>
<summary>✅ Phase 3: Service Layer Modernization - COMPLETE 2026-03-23</summary>

**Goal**: Rewrite all services to use `defer()` for Amplify calls, proper signal patterns
**Plans**: 3 plans

Plans:
- [x] 03-01: AuthService rewrite
- [x] 03-02: MathResultsService rewrite
- [x] 03-03: WordService + DataService modernization

</details>

<details>
<summary>✅ Phase 4: Component Modernization - COMPLETE 2026-03-24</summary>

**Goal**: Remove all ngOnInit data loading, rewrite legacy components to modern patterns
**Plans**: 3 plans

Plans:
- [x] 04-01: Dashboard & results components
- [x] 04-02: Legacy MathComponent rewrite
- [x] 04-03: Word Study TypeScript modernization (signals, computed, linkedSignal, Fisher-Yates — TS done in commit 25c97fa, styling NOT addressed)

</details>

<details>
<summary>✅ Phase 5: Word Study Styling - COMPLETE 2026-03-24</summary>

**Goal**: Restyle all 3 Word Study components to match the app's design system. The styling was destroyed — all SCSS files are empty/gutted. The component is visually unusable.
**Depends on**: Phase 4
**Plans**: 1 plan

Plans:
- [x] 05-01: Restyle section menu, word group buttons, and word list grid using design system tokens and patterns

</details>

<details>
<summary>✅ Phase 6: Final Code Cleanup - COMPLETE 2026-03-24</summary>

**Goal**: Fix remaining guide violations introduced by post-plan feature work (smart quiz, error analyzer)
**Depends on**: Phase 5
**Plans**: 1 plan

Plans:
- [x] 06-01: Replace 2 `for` loops with functional methods, remove `console.error` from production code

</details>

#### Phase 7: Deployment
**Goal**: Deploy frontend to AWS Amplify Hosting with custom domain. Backend is already deployed via Amplify Gen 2.
**Depends on**: Phase 6
**Plans**: 2 plans

Plans:
- [ ] 07-01: Amplify Hosting setup (build spec, connect repo, verify default URL)
- [ ] 07-02: Custom domain configuration and production verification

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Angular 21 Upgrade | v1.1 | 3/3 | Complete | 2026-03-22 |
| 2. Mechanical Code Standards | v1.2 | 4/4 | Complete | 2026-03-23 |
| 3. Service Layer Modernization | v1.2 | 3/3 | Complete | 2026-03-23 |
| 4. Component Modernization | v1.2 | 3/3 | Complete | 2026-03-24 |
| 5. Word Study Styling | v1.2 | 1/1 | Complete | 2026-03-24 |
| 6. Final Code Cleanup | v1.2 | 1/1 | Complete | 2026-03-24 |
| 7. Deployment | v1.2 | 0/2 | Pending | - |
