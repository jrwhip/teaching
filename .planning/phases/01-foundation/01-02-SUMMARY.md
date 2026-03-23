# Phase 1 Plan 2: ThemeService Accent Colors Summary

**App-wide accent background color system with 16 pastel swatches in navbar, dark mode aware, replacing per-component color pickers**

## Accomplishments
- Extended ThemeService with accentBg signal persisted to localStorage
- Added ACCENT_COLORS constant with 16 pastel options
- effectiveAccent computed signal returns empty string in dark mode
- Applied as --bg-accent CSS variable on documentElement via effect()
- Added color picker dropdown to navbar component

## Files Created/Modified
- `src/app/core/theme.service.ts` — accentBg signal, ACCENT_COLORS, effectiveAccent computed, effect applying --bg-accent
- `src/app/shared/layout/navbar.component.ts` — Color picker dropdown with swatch grid

## Decisions Made
- Used effectiveAccent returning empty in dark mode rather than reducing opacity — cleaner approach, pastels just don't work on dark backgrounds.

## Deviations from Plan
None — plan executed exactly as written.

## Issues Encountered
None.

## Next Step
Ready for 01-03-PLAN.md (canvas theme utility).

---
*Phase: 01-foundation*
*Completed: 2026-03-22*
