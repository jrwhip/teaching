import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NextStepWordStudyComponent } from './next-step-word-study.component';

const routes: Routes = [
  { path: ':sectionName', component: NextStepWordStudyComponent },
  { path: '', component: NextStepWordStudyComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NextStepWordStudyRoutingModule {}
