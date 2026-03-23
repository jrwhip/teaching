---
phase: 02-code-standards
plan: 01
status: complete
---

# 02-01 Summary: Decorator Cleanup & OnPush

Removed all `standalone: true` from decorators, removed `CommonModule` imports (replaced with specific pipe imports), and added `ChangeDetectionStrategy.OnPush` to every component.

## Accomplishments

- Removed `standalone: true` from 8 decorators (7 @Component, 1 @Pipe)
- Removed `CommonModule` from 2 component imports arrays
- Added specific pipe imports to replace CommonModule functionality:
  - `DecimalPipe` in math.component.ts (for `| number`)
  - `AsyncPipe` and `KeyValuePipe` in next-step-word-study.component.ts (for `| async` and `| keyvalue`)
- Added `ChangeDetectionStrategy.OnPush` to all 30 components
- Merged `ChangeDetectionStrategy` into existing `@angular/core` import lines

## Files Modified

1. `src/app/shared/components/streak-display.component.ts` - removed standalone, added OnPush
2. `src/app/shared/components/stat-card.component.ts` - removed standalone, added OnPush
3. `src/app/dashboard/dashboard-redirect.component.ts` - removed standalone, added OnPush
4. `src/app/practice/math/inequality/inequality.component.ts` - removed standalone, added OnPush
5. `src/app/practice/math/coordinate-grid/coordinate-grid.component.ts` - removed standalone, added OnPush
6. `src/app/practice/math/results/teacher-results.component.ts` - removed standalone, added OnPush
7. `src/app/practice/math/results/parent-results.component.ts` - removed standalone, added OnPush
8. `src/app/nth-plain-text.pipe.ts` - removed standalone
9. `src/app/math/math.component.ts` - removed CommonModule, added DecimalPipe, added OnPush
10. `src/app/next-step-word-study/next-step-word-study.component.ts` - removed CommonModule, added AsyncPipe + KeyValuePipe, added OnPush
11. `src/app/auth/login/login.component.ts` - added OnPush
12. `src/app/auth/register/register.component.ts` - added OnPush
13. `src/app/auth/confirm/confirm.component.ts` - added OnPush
14. `src/app/auth/forgot-password/forgot-password.component.ts` - added OnPush
15. `src/app/landing/landing.component.ts` - added OnPush
16. `src/app/app.component.ts` - added OnPush
17. `src/app/dashboard/teacher/teacher-home.component.ts` - added OnPush
18. `src/app/dashboard/parent/parent-home.component.ts` - added OnPush
19. `src/app/dashboard/student/student-home.component.ts` - added OnPush
20. `src/app/shared/layout/app-shell.component.ts` - added OnPush
21. `src/app/shared/layout/navbar.component.ts` - added OnPush
22. `src/app/practice/math/math-menu.component.ts` - added OnPush
23. `src/app/practice/practice-menu.component.ts` - added OnPush
24. `src/app/practice/math/number-line/number-line.component.ts` - added OnPush
25. `src/app/practice/math/area-perimeter/area-perimeter.component.ts` - added OnPush
26. `src/app/practice/math/quiz3/quiz3.component.ts` - added OnPush
27. `src/app/practice/math/quiz2/quiz2.component.ts` - added OnPush
28. `src/app/practice/math/quiz/quiz.component.ts` - added OnPush
29. `src/app/next-step-word-study/word-list/word-list.component.ts` - added OnPush
30. `src/app/next-step-word-study/word-study-menu/word-study-menu.component.ts` - added OnPush
31. `src/app/page-not-found/page-not-found.component.ts` - added OnPush

## Issues Encountered

- **Blocker (auto-fixed):** Removing `CommonModule` broke the build because templates used pipes provided by it (`| number` in math.component.html, `| async` and `| keyvalue` in next-step-word-study.component.html). Fixed by importing the specific pipes (`DecimalPipe`, `AsyncPipe`, `KeyValuePipe`) directly into the component imports arrays. This is the correct Angular 21 pattern -- import only what you use.

## Verification

- `pnpm build` passes with zero errors
- `grep -r "standalone: true" src/app --include="*.ts"` returns zero results
- `grep -r "CommonModule" src/app --include="*.ts"` returns zero results
- `grep -rL "ChangeDetectionStrategy" src/app --include="*.component.ts"` returns zero results

## Next Step

Ready for 02-02-PLAN.md
