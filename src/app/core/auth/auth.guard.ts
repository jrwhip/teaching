import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take } from 'rxjs';
import { AuthService } from './auth.service';
import { UserRole } from './auth.types';

/**
 * Waits for the profile resource to finish loading, then evaluates the check.
 * If already loaded, returns synchronously to avoid unnecessary Observable overhead.
 */
function waitForAuth(check: (auth: AuthService, router: Router) => boolean | UrlTree) {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoading()) {
    return check(auth, router);
  }

  return toObservable(auth.isLoading).pipe(
    filter(loading => !loading),
    take(1),
    map(() => check(auth, router)),
  );
}

export const authGuard: CanActivateFn = () =>
  waitForAuth((auth, router) => {
    if (auth.isAuthenticated()) return true;
    return router.createUrlTree(['/login']);
  });

export const guestGuard: CanActivateFn = () =>
  waitForAuth((auth, router) => {
    if (!auth.isAuthenticated()) return true;
    return router.createUrlTree(['/dashboard']);
  });

export function roleGuard(...allowedRoles: UserRole[]): CanActivateFn {
  return () =>
    waitForAuth((auth, router) => {
      if (!auth.isAuthenticated()) {
        return router.createUrlTree(['/login']);
      }

      const role = auth.userRole();
      if (role && allowedRoles.includes(role)) return true;

      return router.createUrlTree(['/dashboard']);
    });
}

/**
 * Redirects to the appropriate role-based dashboard.
 * Replaces DashboardRedirectComponent — no component needed for pure navigation.
 */
export const dashboardRedirectGuard: CanActivateFn = () =>
  waitForAuth((auth, router) => {
    const role = auth.userRole();
    switch (role) {
      case 'TEACHER':
        return router.createUrlTree(['/dashboard/teacher']);
      case 'PARENT':
        return router.createUrlTree(['/dashboard/parent']);
      case 'STUDENT':
        return router.createUrlTree(['/dashboard/student']);
      default:
        return router.createUrlTree(['/login']);
    }
  });
