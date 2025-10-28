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
    path: 'plot-points',
    loadComponent: () => import('./plot-points/plot-points.component').then(c => c.PlotPointsComponent),
  },
  {
    path: 'inequality',
    loadComponent: () => import('./inequality/inequality.component').then(c => c.InequalityComponent),
  },
  {
    path: 'area',
    loadComponent: () => import('./area/area.component').then(c => c.AreaComponent),
  },
  {
    path: 'math-quiz',
    loadComponent: () => import('./math-quiz/math-quiz.component').then(c => c.MathQuizComponent),
    children: [
      {
        path: 'addition',
        loadComponent: () => import('./math-quiz/problems/addition.component').then(c => c.AdditionComponent),
      },
      // More problem types will be added here
    ]
  },
  {
    path: '**',
    loadComponent: () => import('./page-not-found/page-not-found.component').then(c => c.PageNotFoundComponent),
  }
];
