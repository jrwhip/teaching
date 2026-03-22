import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { UserRole } from './auth.types';

export const authGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoading()) {
    await auth.init();
  }

  if (auth.isAuthenticated()) return true;

  router.navigate(['/login']);
  return false;
};

export const guestGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoading()) {
    await auth.init();
  }

  if (!auth.isAuthenticated()) return true;

  router.navigate(['/dashboard']);
  return false;
};

export function roleGuard(...allowedRoles: UserRole[]): CanActivateFn {
  return async () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (auth.isLoading()) {
      await auth.init();
    }

    if (!auth.isAuthenticated()) {
      router.navigate(['/login']);
      return false;
    }

    const role = auth.userRole();
    if (role && allowedRoles.includes(role)) return true;

    router.navigate(['/dashboard']);
    return false;
  };
}
