import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./parent-home.component'),
  },
  {
    path: 'students/new',
    loadComponent: () => import('./students/student-create.component'),
  },
  {
    path: 'students/link',
    loadComponent: () => import('./students/student-link.component'),
  },
  {
    path: 'classrooms/join',
    loadComponent: () => import('./classrooms/join-classroom.component'),
  },
];

export default routes;
