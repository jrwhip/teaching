import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StudentComponent } from './student.component';

const routes: Routes = [
  {
    path: '',
    component: StudentComponent,
    children: [
      {
        path: 'math/:category/:operation',
        loadComponent: () =>
          import('./math/math.component').then((c) => c.MathComponent),
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'basics/addition',
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudentRoutingModule {}
