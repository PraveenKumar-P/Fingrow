import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomInputTextboxComponent } from './custom-input-textbox/custom-input-textbox.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    CustomInputTextboxComponent
  ],
  exports: [
    CustomInputTextboxComponent
  ]
})

export class CustomModule { }
