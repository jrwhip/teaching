import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ErrorComponent } from './error/error.component';
import { MainMenuComponent } from './main-menu/main-menu.component';

const routes: Routes = [
  { path: 'next-step-word-study', loadChildren: () => import('./next-step-word-study/next-step-word-study.module').then(m => m.NextStepWordStudyModule) },
  { path: 'math', loadChildren: () => import('./math/math.module').then(m => m.MathModule) },
  { path: '', component: MainMenuComponent },
  { path: '**', component: ErrorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
