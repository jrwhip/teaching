# Teaching App — Code Quality, Styling, Features & Deployment

## Current State (Updated: 2026-03-24)

**Shipped:** v1.1 Angular 21 Upgrade (2026-03-22, commit 560c724)
**Status:** Development / Internal testing
**Users:** Jerry + family (K-6 students)
**Codebase:**
- Angular 21.1.6, Nx 22.6.1, TypeScript 5.9.3
- Zoneless change detection enabled (provideZonelessChangeDetection)
- Vitest 3.2.4 (zero test files currently), ESLint flat config
- AWS Amplify Gen 2 (Cognito + AppSync + DynamoDB)
- Custom CSS design system with light/dark tokens
- ag-Grid 35, RxJS 7.8

**What happened since v1.1:**
Code quality audit (phases 2-4) modernized all TypeScript: signals, inject(), OnPush, reactive forms, defer() services. Then three major feature commits landed outside the plan:
- Student/classroom management (13+ components, 3 services, Amplify Lambdas)
- Lambda/auth bug fixes (GSI naming, IAM grants, EMPTY bug)
- Error analysis engine + adaptive Smart Quiz

**Current problems:**
1. Word Study component styling is completely destroyed — all 3 SCSS files are empty/gutted. The TS was modernized but nobody looked at whether the component renders. It's unusable.
2. Smart quiz code has 2 `for` loops and 1 `console.error` — guide violations.
3. App has never been deployed. Frontend runs on localhost only.

## v1.2 Goals

**Vision:** Finish the code quality audit, fix the broken Word Study styling to match the design system, clean up remaining violations, and deploy the app to production on AWS Amplify Hosting with a custom domain.

**Scope (v1.2 — updated):**

### Already complete (phases 2-4, plans 01-02):
- ✅ Remove all explicit `standalone: true`
- ✅ Replace all constructor injection with `inject()`
- ✅ Replace `@HostListener` with `host` object
- ✅ Add `ChangeDetectionStrategy.OnPush` to all 37 components
- ✅ Eliminate all `any` types
- ✅ Remove `CommonModule` imports, use native control flow
- ✅ Convert template-driven forms to reactive forms
- ✅ Rewrite services: `defer()` for Amplify calls, signals for state
- ✅ Remove all `ngOnInit` data loading patterns
- ✅ Word Study TypeScript modernized (signals, computed, linkedSignal, correct Fisher-Yates)
- ✅ Legacy MathComponent rewritten to signals

### Still to do:
- Fix Word Study styling — 3 empty SCSS files need full design-system-compliant styles (section menu, word group buttons, word list grid)
- Fix 2 `for` loops in error-analyzer.ts and weakness-analyzer.ts
- Remove `console.error` from math-results.service.ts
- Deploy frontend to AWS Amplify Hosting
- Configure custom domain

**Authority:**
- `ANGULAR-GUIDE.md` — The standard for Angular patterns
- `RXJS-SIGNALS-GUIDE.md` — The standard for reactive patterns
- Design system tokens in `src/styles/_tokens.scss` — The standard for all styling

**Amplify Boundary Decision:**
Amplify SDK returns Promises. Wrap in `defer()` for cold Observable semantics. Services use `defer()` internally, expose clean Observables or use `rxResource` for reads.

**Success Criteria:**
- [x] Zero explicit `standalone: true` in any decorator
- [x] Zero constructor injection — all `inject()`
- [x] Zero `@HostListener` or `@HostBinding`
- [x] All components have `ChangeDetectionStrategy.OnPush`
- [ ] Zero `for` loops — all functional methods
- [x] Zero `any` types
- [x] Zero `CommonModule` imports
- [x] All forms are reactive (no `FormsModule` with `ngModel`)
- [x] All services use `defer()` for Amplify calls
- [x] Zero `ngOnInit` for data loading
- [ ] Word Study renders correctly with design system styling
- [ ] Zero `console.log/error` in production code
- [x] `pnpm build` passes
- [ ] App deployed to Amplify Hosting with custom domain
- [ ] All features functional (visual verification)

---

<details>
<summary>Previous Milestones (Archived)</summary>

### v1.0 Math Restyle (shipped 2026-03-22, commit f7f2df9)
Restyled 7 math practice components, wired results tracking to DynamoDB, built role-based dashboards.

### v1.1 Angular 21 Upgrade (shipped 2026-03-22, commit 560c724)
Angular 17→21, Nx 18→22.6, TypeScript 5.3→5.9, zoneless, Vitest, ESLint 9, ag-Grid 35.

</details>
