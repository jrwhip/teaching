---
phase: 03-service-layer
plan: 01
status: complete
---

# 03-01 Summary: AuthService Reactive Rewrite

Rewrote AuthService from async/await Promises to fully reactive pattern using `defer()` for all Amplify SDK calls, `rxResource` for profile loading, and Observable returns for all mutations.

## Accomplishments

- **AuthService** (`src/app/core/auth/auth.service.ts`): Complete rewrite
  - All Amplify SDK calls wrapped in `defer()` (lazy, cold Observables)
  - Profile loading via `rxResource` with automatic loading state, error handling, and reactive reload
  - Mutation methods (`signIn`, `signUp`, `confirmSignUp`, `signOut`, `resetPassword`, `confirmResetPassword`) return `Observable<void>`
  - `ensureProfileExists` (formerly `createUserProfileIfMissing`) rewritten as private Observable pipeline
  - Removed `init()` method — rxResource auto-loads on construction
  - Removed `currentUser` signal — profile resource handles everything
  - Zero `async`, zero `await`, zero `from()`, zero try/catch

- **Auth Guard** (`src/app/core/auth/auth.guard.ts`): Converted from async/await to signal-based
  - `waitForAuth` helper uses `toObservable(auth.isLoading)` to wait for profile resource
  - Synchronous fast-path when profile is already loaded
  - Returns `UrlTree` for redirects (cleaner than imperative `router.navigate()`)

- **Auth Components** (4 files): Converted from async/await to Observable subscriptions
  - `loading` converted from plain boolean to `signal<boolean>` in all components
  - Template bindings updated to `loading()` signal reads
  - `finalize()` operator handles loading state reset (replaces try/finally)
  - One-shot `.subscribe()` without cleanup (Amplify calls complete after single emission)

- **Navbar Component** (`src/app/shared/layout/navbar.component.ts`): `onSignOut()` converted from async/await to `.subscribe()`

## Files Modified

1. `src/app/core/auth/auth.service.ts` — Full rewrite (defer + rxResource)
2. `src/app/core/auth/auth.guard.ts` — Signal-based with toObservable wait
3. `src/app/auth/login/login.component.ts` — Observable subscribe + signal loading
4. `src/app/auth/register/register.component.ts` — Observable subscribe + signal loading
5. `src/app/auth/confirm/confirm.component.ts` — Observable subscribe + signal loading
6. `src/app/auth/forgot-password/forgot-password.component.ts` — Observable subscribe + signal loading
7. `src/app/shared/layout/navbar.component.ts` — signOut subscribe

## Verification Results

- `pnpm build`: Pass (zero errors)
- `grep -n "async " auth.service.ts`: Zero results
- `grep -n "await " auth.service.ts`: Zero results
- `grep -n "from(" auth.service.ts`: Zero results
- `grep -rn "await.*auth\." src/app`: Zero results
- `grep -rn "from(" src/app/core/auth`: Zero results

## Issues Encountered

None.

## Next Step

Ready for 03-02-PLAN.md
