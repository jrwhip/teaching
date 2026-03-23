---
phase: 02-code-standards
plan: 02
type: summary
---

## Summary

Replaced all constructor injection with `inject()` and replaced `@HostListener` decorators with the `host` object in `@Component` metadata.

## Accomplishments

- Converted 5 files from constructor injection to `inject()` field pattern
- Deleted empty constructor in `word.service.ts`
- Kept constructors with initialization logic (quiz components) but removed parameters
- Replaced 2 `@HostListener` decorators in `navbar.component.ts` with `host` property in `@Component` metadata
- Removed `HostListener` import from `@angular/core` in `navbar.component.ts`
- Verified zero `constructor(private` patterns remain
- Verified zero `@HostListener` / `@HostBinding` decorators remain
- Build passes with zero errors

## Files Modified

- `src/app/core/auth/auth.service.ts` — inject() for Router, removed constructor
- `src/app/next-step-word-study/next-step-word-study.component.ts` — inject() for ActivatedRoute + WordService, removed constructor
- `src/app/practice/math/quiz/quiz.component.ts` — inject() for DomSanitizer, constructor retained for init logic
- `src/app/practice/math/quiz2/quiz2.component.ts` — inject() for DomSanitizer, constructor retained for init logic
- `src/app/practice/math/quiz3/quiz3.component.ts` — inject() for DomSanitizer, constructor retained for init logic
- `src/app/word.service.ts` — deleted empty constructor
- `src/app/shared/layout/navbar.component.ts` — replaced @HostListener with host object, removed HostListener import

## Issues Encountered

None.

## Next Step

Ready for 02-03-PLAN.md
