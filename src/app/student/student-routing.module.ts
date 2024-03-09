import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentComponent } from './student.component';

const routes: Routes = [
  { path: '', component: StudentComponent },
  { path: 'math', loadComponent: () => import('./math/math.component').then(c => c.MathComponent) },
  { path: 'next-step-word-study', loadComponent: () => import('./next-step-word-study/next-step-word-study.component').then(c => c.NextStepWordStudyComponent) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }
