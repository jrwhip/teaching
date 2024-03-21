import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((c) => c.HomeComponent),
  },
  {
    path: 'student',
    loadChildren: () =>
      import('./pages/student/student.module').then((m) => m.StudentModule),
  },
  {
    path: 'teacher',
    loadChildren: () =>
      import('./pages/teacher/teacher.module').then((m) => m.TeacherModule),
  },
  {
    path: 'next-step-word-study/:sectionName',
    loadComponent: () =>
      import(
        './pages/student/next-step-word-study/next-step-word-study.component'
      ).then((c) => c.NextStepWordStudyComponent),
  },
  {
    path: 'next-step-word-study',
    loadComponent: () =>
      import(
        './pages/student/next-step-word-study/next-step-word-study.component'
      ).then((c) => c.NextStepWordStudyComponent),
  },
  {
    path: 'math',
    loadComponent: () =>
      import('./pages/student/math/math.component').then(
        (c) => c.MathComponent
      ),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/page-not-found/page-not-found.component').then(
        (c) => c.PageNotFoundComponent
      ),
  },
];
