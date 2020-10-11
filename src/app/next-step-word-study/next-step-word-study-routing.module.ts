import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NextStepWordStudyComponent } from './next-step-word-study.component';

const routes: Routes = [{ path: '', component: NextStepWordStudyComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NextStepWordStudyRoutingModule { }
