# Teaching App — Code Quality Audit & Remediation

## Current State (Updated: 2026-03-22)

**Shipped:** v1.1 Angular 21 Upgrade (2026-03-22, commit 560c724)
**Status:** Development / Internal testing
**Users:** Jerry + family (K-6 students)
**Codebase:**
- Angular 21.1.6, Nx 22.6.1, TypeScript 5.9.3
- Zoneless change detection enabled (provideZonelessChangeDetection)
- Vitest 3.2.4, ESLint flat config
- AWS Amplify Gen 2 (Cognito + AppSync + DynamoDB)
- Custom CSS design system with light/dark tokens
- ag-Grid 35, RxJS 7.8

**Problem:**
The codebase has accumulated patterns that violate ANGULAR-GUIDE.md and RXJS-SIGNALS-GUIDE.md. The upgrade to Angular 21 was mechanical — dependencies updated, build works — but the code itself wasn't modernized to match the guides. Legacy patterns from Angular 17, pre-signal idioms, and sloppy typing persist throughout.

## v1.2 Goals

**Vision:** Bring every file in the project into full compliance with ANGULAR-GUIDE.md and RXJS-SIGNALS-GUIDE.md. These documents are the absolute final word.

**Motivation:**
- Code quality doesn't mean "it works" — it means maintainable, extensible, properly patterned
- The guides define the standard. Anything that deviates is wrong.
- Fix it now before building more features on a bad foundation

**Scope (v1.2):**
- Remove all explicit `standalone: true` (Angular 20+ default)
- Replace all constructor injection with `inject()`
- Replace `@HostListener` with `host` object
- Add `ChangeDetectionStrategy.OnPush` to all components
- Replace all `for` loops with functional methods (hard rule, no exceptions)
- Eliminate all `any` types
- Remove `CommonModule` imports, use native control flow
- Convert template-driven forms to reactive forms
- Rewrite services: `defer()` to wrap Amplify Promises, `rxResource` for reads, signals for state
- Remove all `ngOnInit` data loading patterns
- Fix Word Study component (worst offender: `any` types, `tap()` mutation, `mergeMap` instead of `switchMap`, duplicate shuffle, misspelled methods, unused imports)
- Rewrite legacy MathComponent to signals

**Authority:**
- `ANGULAR-GUIDE.md` — The standard for Angular patterns
- `RXJS-SIGNALS-GUIDE.md` — The standard for reactive patterns
- If these guides say to do something, do it. No exceptions. No "but it works."

**Amplify Boundary Decision:**
Amplify SDK returns Promises. Wrap in `defer()` for cold Observable semantics — lazy execution, work doesn't fire until subscription. NOT `from()` (eagerly evaluates). Services use `defer()` internally, expose clean Observables or use `rxResource` for reads.

**Success Criteria:**
- [ ] Zero explicit `standalone: true` in any decorator
- [ ] Zero constructor injection — all `inject()`
- [ ] Zero `@HostListener` or `@HostBinding`
- [ ] All components have `ChangeDetectionStrategy.OnPush`
- [ ] Zero `for` loops — all functional methods
- [ ] Zero `any` types
- [ ] Zero `CommonModule` imports
- [ ] All forms are reactive (no `FormsModule` with `ngModel` for form inputs)
- [ ] All services use `defer()` for Amplify calls, `rxResource` for reads
- [ ] Zero `ngOnInit` for data loading
- [ ] `pnpm build` passes
- [ ] `pnpm test` passes
- [ ] App runs correctly (visual verification)

**Out of Scope:**
- New features
- Additional subjects
- Signal Forms (experimental — wait for stable)
- Test coverage expansion (fix existing tests, don't add new ones unless needed)

---

<details>
<summary>Previous Milestones (Archived)</summary>

### v1.0 Math Restyle (shipped 2026-03-22, commit f7f2df9)
Restyled 7 math practice components, wired results tracking to DynamoDB, built role-based dashboards.

### v1.1 Angular 21 Upgrade (shipped 2026-03-22, commit 560c724)
Angular 17→21, Nx 18→22.6, TypeScript 5.3→5.9, zoneless, Vitest, ESLint 9, ag-Grid 35.

</details>
