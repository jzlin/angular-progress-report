import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { CourseComponent } from './course/course.component';
import { CourseAddComponent } from './course-add/course-add.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    AdminRoutingModule
  ],
  declarations: [CourseComponent, CourseAddComponent]
})
export class AdminModule { }
