import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MdlDirective } from './directives/mdl.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    MdlDirective
  ],
  exports: [
    MdlDirective
  ]
})
export class SharedModule { }
