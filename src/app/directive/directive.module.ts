import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UppercaseInputDirective } from './uppercase-input.directive';
import { FormsModule } from '@angular/forms';
import { SpecialCharacterDirective } from './special-character.directive';


@NgModule({
  declarations: [
    UppercaseInputDirective,
    SpecialCharacterDirective
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    UppercaseInputDirective,
    SpecialCharacterDirective
  ]
})
export class DirectiveModule { }
