import { Routes } from '@angular/router';
import { AppShellComponent } from '../shared/layout/app-shell.component';
import { roleGuard } from '../core/auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: AppShellComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./practice-menu.component'),
      },
      {
        path: 'math',
        loadComponent: () => import('./math/math-menu.component'),
      },
      {
        path: 'math/rounding',
        loadComponent: () => import('../math/math.component'),
      },
      {
        path: 'math/number-line',
        loadComponent: () => import('./math/number-line/number-line.component'),
      },
      {
        path: 'math/inequality',
        loadComponent: () => import('./math/inequality/inequality.component'),
      },
      {
        path: 'math/coordinate-grid',
        loadComponent: () => import('./math/coordinate-grid/coordinate-grid.component'),
      },
      {
        path: 'math/area-perimeter',
        loadComponent: () => import('./math/area-perimeter/area-perimeter.component'),
      },
      {
        path: 'math/quiz3',
        loadComponent: () => import('./math/quiz3/quiz3.component'),
      },
      {
        path: 'math/quiz2',
        loadComponent: () => import('./math/quiz2/quiz2.component'),
      },
      {
        path: 'math/quiz',
        loadComponent: () => import('./math/quiz/quiz.component'),
      },
      {
        path: 'math/smart-quiz',
        loadComponent: () => import('./math/smart-quiz/smart-quiz.component'),
      },
      {
        path: 'math/results/teacher',
        canActivate: [roleGuard('TEACHER')],
        loadComponent: () => import('./math/results/teacher-results.component'),
      },
      {
        path: 'math/results/parent',
        canActivate: [roleGuard('PARENT')],
        loadComponent: () => import('./math/results/parent-results.component'),
      },
      {
        path: 'word-study',
        loadComponent: () => import('../next-step-word-study/next-step-word-study.component'),
      },
      {
        path: 'word-study/:sectionName',
        loadComponent: () => import('../next-step-word-study/next-step-word-study.component'),
      },
    ],
  },
];

export default routes;
