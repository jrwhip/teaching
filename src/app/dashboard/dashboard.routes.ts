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
        loadComponent: () => import('./dashboard-redirect.component'),
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
