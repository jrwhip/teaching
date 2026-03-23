import { Routes } from '@angular/router';
import { AppShellComponent } from '../shared/layout/app-shell.component';
import { dashboardRedirectGuard, roleGuard } from '../core/auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: AppShellComponent,
    children: [
      {
        path: '',
        canActivate: [dashboardRedirectGuard],
        children: [],
      },
      {
        path: 'teacher',
        canActivate: [roleGuard('TEACHER')],
        loadComponent: () => import('./teacher/teacher-home.component'),
      },
      {
        path: 'parent',
        canActivate: [roleGuard('PARENT')],
        loadComponent: () => import('./parent/parent-home.component'),
      },
      {
        path: 'student',
        canActivate: [roleGuard('STUDENT')],
        loadComponent: () => import('./student/student-home.component'),
      },
    ],
  },
];

export default routes;
