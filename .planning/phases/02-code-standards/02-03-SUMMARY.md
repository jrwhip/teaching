---
phase: 02-code-standards
plan: 03
status: complete
---

# 02-03 Summary: Eliminate `any` Types and `for` Loops

Removed all `any` types and replaced all `for` loops with functional methods across the entire codebase.

## Accomplishments

### Task 1: Eliminate all `any` types

- **word.service.ts** -- Defined `WordSection` (`Record<string, string[]>`) and `WordData` (`Record<string, WordSection>`) types. Typed `_allWords` as `WordData` (also made `readonly`). Changed `getAllWords()` return to `Observable<WordData>`.
- **next-step-word-study.component.ts** -- Removed unused `AnyCatcher` import. Changed `wordGroups$` from `Observable<any>` to `Observable<WordSection>`. Changed `suffleWords` parameter from `string[] | any` to `string[]`.
- **word-list/word-list.component.ts** -- Changed `@Input() words: any` to `@Input() words: string[] = []`.
- **auth.service.ts** -- Changed all five `catch (err: any)` blocks to `catch (err: unknown)` with `instanceof Error` type narrowing.
- **amplify.init.ts** -- Replaced `as any` with `as unknown as ResourcesConfig`, imported `ResourcesConfig` from `aws-amplify`, added comment explaining why the cast is necessary (Amplify Gen 2 outputs JSON vs. ResourcesConfig type mismatch).
- **quiz3.component.ts** -- Widened `fracHtml()` signature to accept `string | number` for numerator parameter. Removed both `'n' as any` casts.

### Task 2: Replace all `for` loops with functional methods

- **number-line.component.ts** -- Replaced `for` loop in `markers` computed with `Array.from()`.
- **inequality.component.ts** -- Replaced `for` loop in `ticks` computed with `Array.from()`.
- **coordinate-grid.component.ts** -- Replaced `for` loop in `gridLines` computed with `Array.from()`.
- **teacher-results.component.ts** -- Replaced three `for...of` loops with `Promise.all(classrooms.map(...))` for parallel enrollment fetches, `forEach` + `filter` for student ID collection, and `Promise.all([...studentIds].map(...))` for parallel counter/profile fetches. Also removed unused `studentNames` Map.
- **parent-results.component.ts** -- Replaced `for...of` loop with `Promise.all(links.map(...))` for parallel student data fetches.
- **quiz/generators/equations.ts** -- Replaced multiplication sequence `for` loop with `Array.from().join()`. Replaced decimal exponent `for` loop with `Array.from().reduce()`.
- **quiz/generators/numbers-stats-geometry.ts** -- Replaced `for...in` loop over frequency object with `Object.entries().filter().map()`.
- **quiz/generators/helpers.ts** -- Replaced `for` loop in `fractionPower()` with `Array.from().reduce()`.

## Files Modified

1. `src/app/word.service.ts`
2. `src/app/next-step-word-study/next-step-word-study.component.ts`
3. `src/app/next-step-word-study/word-list/word-list.component.ts`
4. `src/app/core/auth/auth.service.ts`
5. `src/app/core/amplify.init.ts`
6. `src/app/practice/math/quiz3/quiz3.component.ts`
7. `src/app/practice/math/number-line/number-line.component.ts`
8. `src/app/practice/math/inequality/inequality.component.ts`
9. `src/app/practice/math/coordinate-grid/coordinate-grid.component.ts`
10. `src/app/practice/math/results/teacher-results.component.ts`
11. `src/app/practice/math/results/parent-results.component.ts`
12. `src/app/practice/math/quiz/generators/equations.ts`
13. `src/app/practice/math/quiz/generators/numbers-stats-geometry.ts`
14. `src/app/practice/math/quiz/generators/helpers.ts`

## Issues Encountered

None.

## Verification

- `pnpm build`: PASS (zero errors)
- Zero `any` types in source files: CONFIRMED
- Zero `for` loops in source files: CONFIRMED (only Angular `@for` template syntax remains, which is correct)
- Zero `AnyCatcher` imports: CONFIRMED

## Next Step

Ready for 02-04-PLAN.md
