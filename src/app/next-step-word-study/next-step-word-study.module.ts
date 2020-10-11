import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NextStepWordStudyRoutingModule } from './next-step-word-study-routing.module';
import { NextStepWordStudyComponent } from './next-step-word-study.component';
import { WordStudyMenuComponent } from './word-study-menu/word-study-menu.component';


@NgModule({
  declarations: [NextStepWordStudyComponent, WordStudyMenuComponent],
  imports: [
    CommonModule,
    NextStepWordStudyRoutingModule
  ]
})
export class NextStepWordStudyModule { }
