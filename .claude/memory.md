# Project Memory: Teaching Application

## Project Overview
This is an educational web application for 6th-grade students at Heritage Elementary (Ogden School District). The project is integrating multiple teaching tools into a single, unified Angular application.

## Current Architecture

### Existing Angular Application
- **Framework**: Angular 17.2.4 with TypeScript
- **Build System**: Nx 18.0.7 (monorepo tooling)
- **UI Framework**: Bootstrap 5.3.2
- **Port**: 4200 (development server)

### Existing Features (Already in Angular)
1. **Math Rounding Game** (`/math`)
   - Practice rounding decimal numbers
   - Tracks correct answer streaks
   - Stores history in localStorage
   - Uses AG Grid for data display

2. **Word Study Module** (`/next-step-word-study`)
   - Phonics-based reading instruction
   - 12 progressive lesson sections
   - 800+ words organized by phonetic patterns
   - Shuffle, randomize, and practice features

3. **Landing Page** (`/`)
   - Marketing-focused home page
   - Currently doesn't match actual functionality

### Google Sites Application (To Be Migrated)
Located in `/google-site-code/main-page.html`:
- **5,743 lines** of HTML/CSS/JavaScript
- **45+ math problem types** across 11 categories:
  1. Module 1.1 (16 sequential lessons)
  2. Basics (add, subtract, multiply, divide, round)
  3. Fractions (7 types)
  4. Compare (fractions, decimals, integers)
  5. Percent (convert, percent of number)
  6. Ratios (ratio, table, unit rate)
  7. Equations (8 types including solve for x, exponents)
  8. Numbers (absolute value, opposites, LCM, GCF)
  9. Statistics (mean, median, mode, range, quartiles)
  10. Reveal (step-by-step solutions for 11 problem types)
  11. Color Themes (16 options)

#### Math Quiz Platform Features
- Unlimited randomly generated problems
- Instant feedback (correct/incorrect)
- Score tracking counters
- Font size controls (S/M/L)
- YouTube video tutorials (teaching & example videos)
- Built-in hints
- Visual geometry components (trapezoid/triangle)
- Custom theme selection
- Smart input (conditional buttons for comparison problems)
- Uses math.js library for calculations

## Project Goals
1. **Migrate** Google Sites math quiz platform into Angular
2. **Integrate** existing Angular components (rounding game, word study)
3. **Unify** navigation and user experience
4. **Deploy** functional unified application
5. **Future**: Add user authentication, progress tracking, teacher dashboards (optional)

## Migration Strategy
**Phase 1**: Quick Migration (Recommended)
- Wrap existing JavaScript in Angular component
- Get functional quickly
- Refactor incrementally later

**Phase 2**: Integration
- Unified navigation menu
- Consistent styling
- Route structure

**Phase 3**: Enhancement
- Backend integration (optional)
- Analytics (optional)
- Additional features as needed

## Technical Notes
- No backend currently (all client-side)
- Uses localStorage for data persistence
- No user authentication system yet
- All data is browser-based (not synced across devices)

## Repository Info
- **Git Branch**: main
- **Working Directory**: `/Users/jaredwhipple/Projects/teaching`
- **Google Sites Code**: `/google-site-code/` directory
- **Platform**: macOS (Darwin 24.6.0)

## Project Timeline
- Started: Multiple developers have worked on this
- Current Phase: Analysis and migration planning
- User has not reviewed codebase in a while

## Important Context
- Teachers are currently using the Google Sites version
- Google Sites has become difficult to manage
- Need more maintainable solution
- Teachers may have other Google Sites pages (Krypto C, Quiz 2, Quiz 3, Inequality, Reflection, Area, Plot Points, Backup) - code not yet provided
