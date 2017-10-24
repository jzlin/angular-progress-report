import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { CourseComponent } from './course/course.component';
import { CourseAddComponent } from './course-add/course-add.component';
import { CourseEditComponent } from './course-edit/course-edit.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    AdminRoutingModule
  ],
  declarations: [CourseComponent, CourseAddComponent, CourseEditComponent]
})
export class AdminModule { }
