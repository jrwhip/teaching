---
phase: 03-service-layer
plan: 03
status: complete
---

# 03-03 Summary: WordService Modernization & Service Layer Audit

Rewrote WordService to remove unnecessary Observable wrapping of static data, updated the consumer to use synchronous API, and audited all core services for guide compliance.

## Accomplishments

- **WordService** (`src/app/word.service.ts`): Removed Observable wrapper
  - Removed `getAllWords(): Observable<WordData>` method that wrapped static data in `of()`
  - Added `getSection(sectionName: string): WordSection | undefined` for direct synchronous access
  - Added `getAllSections(): WordData` for full data access
  - Removed `Observable` and `of` imports — zero RxJS dependencies
  - Types `WordSection` and `WordData` were already properly defined (plan 02-03)
  - Collapsed `@Injectable` decorator to single-line format

- **NextStepWordStudyComponent** (`src/app/next-step-word-study/next-step-word-study.component.ts`): Simplified consumer
  - Replaced `mergeMap` + inner Observable pipeline with simple `map()` on route params
  - Removed `mergeMap` import (no longer needed)
  - Removed `console.log` debug statement from pipeline
  - Updated `wordGroups$` type to `Observable<WordSection | undefined>` to match `getSection()` return type

- **DataService** (`src/app/core/data/data.service.ts`): Minor fix
  - Changed `private client` to `private readonly client` — the Amplify client is assigned once and never reassigned
  - Service is otherwise compliant: thin wrapper around `generateClient<Schema>()`, no `any` types, no constructor injection, no async methods

- **ThemeService** (`src/app/core/theme.service.ts`): Compliant, no changes needed
  - Uses `signal()`, `computed()`, `effect()` correctly per guides
  - `effect()` usage is legitimate: syncing to DOM attributes, localStorage, CSS custom properties
  - No constructor injection, no `any` types, no async methods, no `@HostListener`/`@HostBinding`

## Files Modified

- `src/app/word.service.ts`
- `src/app/next-step-word-study/next-step-word-study.component.ts`
- `src/app/core/data/data.service.ts`

## Verification

- `pnpm build` passes with zero errors
- `grep "constructor(private" src/app/core` — zero results
- `grep ": any\b" src/app/core` — zero results
- `grep "Observable" src/app/word.service.ts` — zero results
- `grep ": any" src/app/word.service.ts` — zero results

## Deviations

- **Pre-existing `tap()` for state mutation in consumer**: The `NextStepWordStudyComponent` uses `tap(() => this.words = [])` to clear the word list on route change. This violates the guide rule that `tap()` is for logging/debugging only. Left in place because the component is scheduled for full rewrite in Phase 4 (plan 04-03), and restructuring the state management properly would exceed the scope of this plan.

## Next Step

Phase 3 complete. Ready for Phase 4: 04-01-PLAN.md
