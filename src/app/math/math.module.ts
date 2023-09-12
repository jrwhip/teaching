import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule

import { MathComponent } from './math.component';

import { MathRoutingModule } from './math-routing.module';

@NgModule({
  declarations: [MathComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MathRoutingModule
  ]
})
export class MathModule { }
