import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JunkRoutingModule } from './junk-routing.module';
import { JunkComponent } from './junk.component';


@NgModule({
  declarations: [JunkComponent],
  imports: [
    CommonModule,
    JunkRoutingModule
  ]
})
export class JunkModule { }
