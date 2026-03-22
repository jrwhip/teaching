import { Routes } from '@angular/router';
import { AppShellComponent } from '../shared/layout/app-shell.component';

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
        loadComponent: () => import('../math/math.component').then(c => c.MathComponent),
      },
      {
        path: 'word-study',
        loadComponent: () => import('../next-step-word-study/next-step-word-study.component').then(c => c.NextStepWordStudyComponent),
      },
      {
        path: 'word-study/:sectionName',
        loadComponent: () => import('../next-step-word-study/next-step-word-study.component').then(c => c.NextStepWordStudyComponent),
      },
    ],
  },
];

export default routes;
