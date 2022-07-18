import { AfterViewInit, Component } from '@angular/core';

import { Options, LabelType } from 'ng5-slider';

@Component({
  selector: 'app-emi-calculator',
  templateUrl: './emi-calculator.component.html',
  styleUrls: ['./emi-calculator.component.scss']
})

export class EmiCalculatorComponent implements AfterViewInit {
  public filters: any;
  public pemi = { value: "25" }
  public remi = { value: "8.5" }
  public temi = { value: "20" }
  public memi = { value: "240" }
  public query = {
    amount: "",
    interest: "",
    tenureYr: "",
    tenureMo: ""
  }
  public result = {
    emi: "",
    interest: "",
    total: ""
  }
  public yrToggel: boolean;
  public poptions: Options = {
    floor: 1,
    ceil: 200,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return value + '<b>L</b>';
        case LabelType.High:
          return value + '<b>L</b>';
        default:
          return value + '<b>L</b>';
      }
    }
  };
  public roptions: Options = {
    floor: 3,
    ceil: 30,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return value + '<b>%</b>';
        case LabelType.High:
          return value + '<b>%</b>';
        default:
          return value + '<b>%</b>';
      }
    }
  };
  public toptions: Options = {
    floor: 1,
    ceil: 30,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return value + '<b>Yr</b>';
        case LabelType.High:
          return value + '<b>Yr</b>';
        default:
          return value + '<b>Yr</b>';
      }
    }
  };
  public moptions: Options = {
    floor: 1,
    ceil: 360,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return value + '<b>Mo</b>';
        case LabelType.High:
          return value + '<b>Mo</b>';
        default:
          return value + '<b>Mo</b>';
      }
    }
  };

  constructor() {
    this.yrToggel = true;
  }

  ngAfterViewInit() {
    this.update();
  }

  tbupdate(id) {
    if (id == 0) {
      this.pemi.value = (Number(this.query.amount) / 50000).toString();
    }
    else if (id == 1) {
      this.remi.value = this.query.interest;
    }
    else if (id == 2) {
      this.temi.value = this.query.tenureYr;
    }
    else if (id == 3) {
      this.memi.value = this.query.tenureMo;
    }
    this.update();
  }

  update() {
    const loanAmount = Number(this.pemi.value) * 50000;
    const numberOfMonths = (this.yrToggel) ? (Number(this.temi.value) * 12) : Number(this.memi.value);
    const rateOfInterest = Number(this.remi.value);
    const monthlyInterestRatio = (rateOfInterest / 100) / 12;
    this.query.amount = loanAmount.toString();
    this.query.interest = rateOfInterest.toString();
    if (this.yrToggel) {
      this.query.tenureYr = this.temi.value.toString();
    }
    else {
      this.query.tenureMo = this.memi.value.toString();
    }
    const top = Math.pow((1 + monthlyInterestRatio), numberOfMonths);
    const bottom = top - 1;
    const sp = top / bottom;
    const emi = ((loanAmount * monthlyInterestRatio) * sp);
    const full = numberOfMonths * emi;
    const interest = full - loanAmount;
    const int_pge = (interest / full) * 100;
    this.result.emi = emi.toFixed(0).toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    const loanAmount_str = loanAmount.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    this.result.total = full.toFixed(0).toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    this.result.interest = interest.toFixed(0).toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  isNumber(num, isdecimal = false) {
    num = (num) ? num : window.event;
    var charCode = (num.which) ? num.which : num.keyCode;
    if (charCode == 46 && isdecimal)
      return true
    else if (charCode > 31 && (charCode < 48 || charCode > 57))
      return false;
    return true;
  }

}
