import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StudentComponent } from './student.component';

const routes: Routes = [
  {
    path: '',
    component: StudentComponent,
    children: [
      {
        path: 'math',
        loadComponent: () =>
          import('./math/math.component').then((c) => c.MathComponent),
          children: [
            {
              path: 'basic-math/:operation',
              loadComponent: () =>
                import('./math/basic-math/basic-math.component').then(
                  (c) => c.BasicMathComponent
                ),
            }
          ]
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudentRoutingModule {}
