# Roadmap: Teaching App v1.1

## Milestones

- ✅ **v1.0 Math Restyle** - Phases 1-7 (shipped 2026-03-22, commit f7f2df9)
- 🚧 **v1.1 Angular 21 Upgrade** - Phase 1 (in progress)

## Phases

<details>
<summary>✅ v1.0 Math Restyle (Phases 1-7) - SHIPPED 2026-03-22</summary>

Restyled 7 math practice components to use the app's design system, wired results tracking to DynamoDB, and built role-based dashboards. All work committed at or before f7f2df9.

</details>

### 🚧 v1.1 Angular 21 Upgrade

**Milestone Goal:** Upgrade from Angular 17 / Nx 18 to Angular 21 / Nx 22.3, go zoneless, modernize tooling.

#### Phase 1: Angular 21 Upgrade
**Goal**: Upgrade Angular 17 → 21, Nx 18 → 22.3, remove zone.js, modernize test runner and linting
**Depends on**: v1.0 complete
**Plans**: 3 plans

Plans:
- [ ] 01-01: Nx + Angular core migration (Nx 18→22.3, Angular 17→21, TypeScript 5.3→5.8+)
- [ ] 01-02: Zoneless migration (provideZonelessChangeDetection, remove zone.js)
- [ ] 01-03: Tooling modernization (ESLint 8→9, Jest→Vitest, ag-Grid 30→35)

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Angular 21 Upgrade | v1.1 | 0/3 | Not started | - |
