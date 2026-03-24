import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./teacher-home.component'),
  },
  {
    path: 'classrooms',
    loadComponent: () => import('./classrooms/classroom-list.component'),
  },
  {
    path: 'classrooms/new',
    loadComponent: () => import('./classrooms/classroom-create.component'),
  },
  {
    path: 'classrooms/:id',
    loadComponent: () => import('./classrooms/classroom-detail.component'),
  },
  {
    path: 'students/new',
    loadComponent: () => import('./students/student-create.component'),
  },
];

export default routes;
