# Roadmap: Teaching App

## Milestones

- ✅ **v1.0 Math Restyle** - Phases 1-7 (shipped 2026-03-22, commit f7f2df9)
- ✅ **v1.1 Angular 21 Upgrade** - Phase 1 (shipped 2026-03-22, commit 560c724)
- 🚧 **v1.2 Code Quality Audit** - Phases 2-4 (in progress)

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

### 🚧 v1.2 Code Quality Audit

**Milestone Goal:** Bring every file into full compliance with ANGULAR-GUIDE.md and RXJS-SIGNALS-GUIDE.md. Zero violations.

#### Phase 2: Mechanical Code Standards
**Goal**: Fix all pattern violations that are find-and-replace or simple refactoring — decorator cleanup, injection patterns, typing, control flow
**Depends on**: v1.1 complete
**Plans**: 4 plans

Plans:
- [x] 02-01: Decorator cleanup (remove standalone:true, remove CommonModule, add OnPush to all components)
- [x] 02-02: Injection & host patterns (constructor injection → inject(), @HostListener → host object)
- [x] 02-03: TypeScript standards (eliminate all `any` types, replace all `for` loops with functional methods)
- [x] 02-04: Reactive forms (convert all template-driven auth forms to reactive forms)

#### Phase 3: Service Layer Modernization
**Goal**: Rewrite all services to use `defer()` for Amplify calls, `rxResource` for reads, proper signal patterns — zero `async ngOnInit`, zero manual signal stuffing
**Depends on**: Phase 2
**Plans**: 3 plans

Plans:
- [x] 03-01: AuthService rewrite (defer() + rxResource + proper signal state)
- [x] 03-02: MathResultsService rewrite (defer() + rxResource for reads, proper mutation pattern)
- [x] 03-03: WordService + DataService modernization (typed data, signal-based)

#### Phase 4: Component Modernization
**Goal**: Remove all ngOnInit data loading, rewrite legacy components to modern patterns, fix Word Study
**Depends on**: Phase 3
**Plans**: 3 plans

Plans:
- [x] 04-01: Dashboard & results components (remove ngOnInit, use rxResource/signals for data loading)
- [ ] 04-02: Legacy MathComponent rewrite (full signals + OnPush + modern patterns)
- [ ] 04-03: Word Study overhaul (fix everything: switchMap, typing, dedup shuffle, remove tap mutation)

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Angular 21 Upgrade | v1.1 | 3/3 | Complete | 2026-03-22 |
| 2. Mechanical Code Standards | v1.2 | 4/4 | Complete | 2026-03-23 |
| 3. Service Layer Modernization | v1.2 | 3/3 | Complete | 2026-03-23 |
| 4. Component Modernization | v1.2 | 1/3 | In progress | - |
