# Roadmap: Teaching App — Math Restyle & Results Tracking

## Milestones

- ✅ **v1.0 Math Restyle** — Phases 1-7 (shipped 2026-03-22)

## Phases

<details>
<summary>✅ v1.0 Math Restyle (Phases 1-7) — SHIPPED 2026-03-22</summary>

### Phase 1: Foundation
**Goal**: Shared infrastructure all subsequent phases depend on — global fraction styles, ThemeService accent colors, canvas theme utility, MathResultsService, problem taxonomy
**Plans**: 5 plans

Plans:
- [x] 01-01: Global fraction styles (_math-fractions.scss, remove duplicates from quiz components)
- [x] 01-02: ThemeService accent color extension (accentBg signal, pastel palette, navbar picker)
- [x] 01-03: Canvas theme utility (reads CSS custom properties for canvas 2D rendering)
- [x] 01-04: MathResultsService (DynamoDB ProblemAttempt/PerformanceCounter with localStorage fallback)
- [x] 01-05: Problem type taxonomy (maps 80+ problem types to DB metadata)

### Phase 2: Canvas Components
**Goal**: Restyle the 4 canvas-based math components (number-line, inequality, coordinate-grid, area-perimeter)
**Depends on**: Phase 1
**Plans**: 2 plans

Plans:
- [x] 02-01: number-line + inequality (token replacement, card wrappers, canvas theme, results wiring)
- [x] 02-02: coordinate-grid + area-perimeter (token replacement, responsive canvas, results wiring)

### Phase 3: Grid Quizzes
**Goal**: Restyle quiz2 and quiz3 grid-based quiz components
**Depends on**: Phase 1
**Plans**: 2 plans

Plans:
- [x] 03-01: quiz2 (remove color picker, token replacement, global fractions, results wiring)
- [x] 03-02: quiz3 (same treatment as quiz2)

### Phase 4: Main Quiz
**Goal**: Restyle the main quiz component — remove navbar/color picker, restructure with accordion sidebar
**Depends on**: Phase 1
**Plans**: 1 plan

Plans:
- [x] 04-01: Full quiz restyle (remove navbar, accordion sidebar, token replacement, results wiring)

### Phase 5: Student Dashboard
**Goal**: Add query methods to MathResultsService, enhance math-menu with student stats and recent activity
**Depends on**: Phase 1 (MathResultsService)
**Plans**: 1 plan

Plans:
- [x] 05-01: MathResultsService queries + math-menu stats display

### Phase 6: Teacher & Parent Dashboards
**Goal**: Build role-guarded results dashboards for teachers and parents
**Depends on**: Phase 5
**Plans**: 1 plan

Plans:
- [x] 06-01: Teacher results, parent results, role-guarded routes, dashboard nav links

### Phase 7: Audit
**Goal**: Verify dark mode, responsive layout, and token usage across all math components
**Depends on**: Phases 2-6
**Plans**: 1 plan

Plans:
- [x] 07-01: Visual audit — hardcoded colors, inline styles, canvas themes, removed artifacts

</details>

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Foundation | v1.0 | 5/5 | Complete | 2026-03-22 |
| 2. Canvas Components | v1.0 | 2/2 | Complete | 2026-03-22 |
| 3. Grid Quizzes | v1.0 | 2/2 | Complete | 2026-03-22 |
| 4. Main Quiz | v1.0 | 1/1 | Complete | 2026-03-22 |
| 5. Student Dashboard | v1.0 | 1/1 | Complete | 2026-03-22 |
| 6. Teacher & Parent Dashboards | v1.0 | 1/1 | Complete | 2026-03-22 |
| 7. Audit | v1.0 | 1/1 | Complete | 2026-03-22 |
