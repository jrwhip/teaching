import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NextStepWordStudyRoutingModule } from './next-step-word-study-routing.module';
import { NextStepWordStudyComponent } from './next-step-word-study.component';
import { MainMenuComponent } from './main-menu/main-menu.component';


@NgModule({
  declarations: [NextStepWordStudyComponent, MainMenuComponent],
  imports: [
    CommonModule,
    NextStepWordStudyRoutingModule
  ]
})
export class NextStepWordStudyModule { }
