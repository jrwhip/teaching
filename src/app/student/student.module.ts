import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { StudentComponent } from './student.component';
import { StudentRoutingModule } from './student-routing.module';

import { StudentHeaderComponent } from '../components/student-header/student-header.component';

@NgModule({
  declarations: [StudentComponent],
  imports: [CommonModule, StudentHeaderComponent, StudentRoutingModule],
})
export class StudentModule {}
