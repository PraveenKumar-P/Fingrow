import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-e-agreement',
  templateUrl: './e-agreement.component.html',
  styleUrls: ['./e-agreement.component.scss']
})

export class EAgreementComponent implements OnInit {
  @Input() htmlContant: string;

  constructor() { }

  ngOnInit(): void {
  }
}
