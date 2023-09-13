import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./main-menu/main-menu.component').then(c => c.MainMenuComponent),
  },
  {
    path: 'next-step-word-study/:sectionName',
    loadComponent: () => import('./next-step-word-study/next-step-word-study.component').then(c => c.NextStepWordStudyComponent),
  },
  {
    path: 'next-step-word-study',
    loadComponent: () => import('./next-step-word-study/next-step-word-study.component').then(c => c.NextStepWordStudyComponent),
  },
  {
    path: 'math',
    loadComponent: () => import('./math/math.component').then(c => c.MathComponent),
  },
  {
    path: '**',
    loadComponent: () => import('./page-not-found/page-not-found.component').then(c => c.PageNotFoundComponent),
  }
];
