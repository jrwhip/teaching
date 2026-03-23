import { Route } from '@angular/router';
import { authGuard, guestGuard } from './core/auth/auth.guard';

export const appRoutes: Route[] = [
  // Public
  {
    path: '',
    loadComponent: () => import('./landing/landing.component'),
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./auth/login/login.component'),
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () => import('./auth/register/register.component'),
  },
  {
    path: 'confirm',
    loadComponent: () => import('./auth/confirm/confirm.component'),
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./auth/forgot-password/forgot-password.component'),
  },

  // Authenticated
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadChildren: () => import('./dashboard/dashboard.routes'),
  },
  {
    path: 'practice',
    canActivate: [authGuard],
    loadChildren: () => import('./practice/practice.routes'),
  },

  // Legacy redirects
  { path: 'math', redirectTo: 'practice/math' },
  { path: 'next-step-word-study', redirectTo: 'practice/word-study' },

  // 404
  {
    path: '**',
    loadComponent: () => import('./page-not-found/page-not-found.component'),
  },
];
