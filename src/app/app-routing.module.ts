import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ErrorComponent } from './error/error.component';

const routes: Routes = [
  { path: 'junk', loadChildren: () => import('./junk/junk.module').then(m => m.JunkModule) },
  { path: 'next-step-word-study', loadChildren: () => import('./next-step-word-study/next-step-word-study.module').then(m => m.NextStepWordStudyModule) },
  { path: '**', component: ErrorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
