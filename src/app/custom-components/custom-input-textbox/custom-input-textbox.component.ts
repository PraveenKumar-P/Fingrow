import { Component, OnInit, Input, Output } from '@angular/core';

@Component({
  selector: 'app-custom-input-textbox',
  templateUrl: './custom-input-textbox.component.html',
  styleUrls: ['./custom-input-textbox.component.scss']
})

export class CustomInputTextboxComponent implements OnInit {
  @Input() name: string;
  @Input() placeholder: string;
  // @Input() minlength: string;
  @Input() type: string;
  @Input() required: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
