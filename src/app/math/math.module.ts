import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MathComponent } from './math.component';

import { MathRoutingModule } from './math-routing.module';


@NgModule({
  declarations: [MathComponent],
  imports: [
    CommonModule,
    MathRoutingModule
  ]
})
export class MathModule { }
