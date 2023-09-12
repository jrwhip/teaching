import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule

import { MathComponent } from './math.component';

import { NthPlainPipe } from '../nth-plain.pipe'; // Import NthPlainPipe

import { MathRoutingModule } from './math-routing.module';

@NgModule({
  declarations: [MathComponent],
  imports: [
    NthPlainPipe, // Add NthPlainPipe to the imports array
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MathRoutingModule
  ]
})
export class MathModule { }
