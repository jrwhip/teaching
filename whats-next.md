# What's Next - 2026-03-23 19:28

## Summary
v1.2 Code Quality Audit session — completed phases 2-3 fully, phase 4 partially (04-01, 04-02 done, 04-03 remaining). Fixed accent color picker bug. Significant process lessons learned about following the project's Angular guides.

## Next Steps
## Immediate: Complete Plan 04-03 (Word Study Overhaul)

This is the LAST plan in v1.2. The plan file is at `.planning/phases/04-component-modernization/04-03-PLAN.md`.

### Task 1: Rewrite NextStepWordStudyComponent
- File: `src/app/next-step-word-study/next-step-word-study.component.ts`
- Most of the modernization was done in this session (toSignal, computed, linkedSignal, fisherYatesShuffle forEach)
- **Still needed per the plan**: Verify no remaining violations (mergeMap, tap, console.log, Observable usage, misspelled methods)
- The plan includes a full rewrite spec — READ THE PLAN FIRST before touching code

### Task 2: Audit word-study-menu and word-list child components
- Files: `src/app/next-step-word-study/word-study-menu/word-study-menu.component.ts` and `word-list.component.ts`
- Convert `@Input()/@Output()` decorators to `input()/output()` signal functions
- Remove any remaining CommonModule, legacy directives, constructor injection

### Task 3: Human Verification Checkpoint
- Run the full verification checklist in the plan (build, test, grep checks, manual testing)
- Create `.planning/phases/04-component-modernization/04-03-SUMMARY.md` on completion

## After 04-03: v1.2 is DONE
- Update ROADMAP.md to mark Phase 4 complete
- Commit with message style: `feat(v1.2): ...`
- Branch is `feature/amplify-rebuild`, 6 commits ahead of origin (unpushed)

## Context
## CRITICAL: Read the Guides FIRST

Before writing ANY Angular code, read these two documents. They are the absolute authority:
- `/home/jrwhip/Work/AI/teaching/ANGULAR-GUIDE.md`
- `/home/jrwhip/Work/AI/teaching/RXJS-SIGNALS-GUIDE.md`

Also available at `/home/jrwhip/Work/AI/ANGULAR-GUIDE.md` and `/home/jrwhip/Work/AI/RXJS-SIGNALS-GUIDE.md`.

The Angular MCP is configured at `/home/jrwhip/Work/AI/teaching/.mcp.json` — use `get_best_practices` and `search_documentation` tools.

## Key Lessons from This Session (DO NOT REPEAT THESE MISTAKES)

1. **DO NOT make changes without explicit user approval.** Jerry has high standards and a bad experience with prior output. Present findings, wait for approval, then code.

2. **Guide examples illustrate WHERE patterns go, not universal prescriptions.** If the guide shows `service.reload()` in an example, that doesn't mean every service needs a reload method.

3. **Imperative side effects are NEVER good, only sometimes appropriate.** The declarative hierarchy: `computed()` > `linkedSignal()` > `signal()` > `resource()/rxResource()` > `effect()` (last resort).

4. **Observable source → subscribe() for side effects. Signal source → effect() for side effects.** NEVER convert between them to use the other tool. Convert ONCE (one-way door).

5. **Training data is poison for Angular.** Most Angular code online is React patterns in Angular syntax. The guides override training data. ALWAYS.

6. **effect() is for non-signal side effects ONLY** — localStorage, canvas, DOM manipulation, third-party integrations. If you're syncing signals with effect(), use computed() or linkedSignal() instead.

7. **No for loops** — hard rule, no exceptions. Use forEach, map, reduce, filter, etc.

8. **Services return clean Observables** — no tap(), no state management, no navigation.

9. **Direct document/window access is not allowed** — use Angular's DOCUMENT injection token.

## Files Modified This Session

### Committed (26519fc, 25c97fa):
- `src/app/auth/login/login.component.ts` — effect() → share() + subscribe() + takeUntilDestroyed()
- `src/app/auth/confirm/confirm.component.ts` — same pattern
- `src/app/auth/register/register.component.ts` — same pattern (keeps signal import for role)
- `src/app/auth/forgot-password/forgot-password.component.ts` — only resetPw$ pipeline gets subscribe treatment
- `src/app/core/auth/auth.service.ts` — removed map(() => undefined) on signOut, fixed signIn EMPTY bug
- `src/app/next-step-word-study/next-step-word-study.component.ts` — linkedSignal, forEach shuffle
- `src/app/practice/math/shared/math-results.service.ts` — removed DestroyRef from root singleton
- `src/app/core/theme.service.ts` — DOCUMENT injection, color-mix() for accent surfaces
- `src/styles/_typography.scss` — var(--bg-accent, var(--bg-body)) fallback
- Plus all math components, routes, navbar, page-not-found (from stash)

### Untracked (not committed, cleanup candidates):
- `.stash-diff.txt` — temp file from audit, can delete
- `ANGULAR-GUIDE.md` / `RXJS-SIGNALS-GUIDE.md` — copies in teaching dir for agent access
- `BRANCH-VALUE-REFERENCE.md` — reference doc
- `apology.md` — personal note
- `jims-app/` — unrelated
- `notes.json` — MCP notes
- `whats-next.md` — this handoff doc

## Tech Stack
- Angular 21.1.6, Nx 22.6.1, TypeScript 5.9.3, RxJS 7.8
- AWS Amplify Gen 2 (Cognito + AppSync + DynamoDB)
- pnpm, Vitest, ESLint 9, esbuild
- Branch: feature/amplify-rebuild (6 commits ahead of origin, unpushed)
