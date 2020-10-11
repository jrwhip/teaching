import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JunkComponent } from './junk.component';

const routes: Routes = [{ path: '', component: JunkComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JunkRoutingModule { }
