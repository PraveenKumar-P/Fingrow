import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { CommonHelper } from 'src/app/helper/common.helper';
import { LoginService } from 'src/app/Sevices/login.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-check-otp',
  templateUrl: './check-otp.component.html',
  styleUrls: ['./check-otp.component.scss']
})

export class CheckOtpComponent implements OnInit {
  @ViewChild('otpForm', { static: false }) otpForm: NgForm;
  public otpModel: any = {};
  public sendOTP: boolean = true;
  public checkOTP: boolean = false;
  public otp: any;
  public isReadonly: boolean = false;
  public publicIP: string;

  constructor(
    private loginService: LoginService,
    private commonHelper: CommonHelper,
    private router: Router,
    private sipnner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.loginService.getSystemIP().subscribe(res => this.publicIP = res.ip);
  }

  checkOTPSubmit(email = "") {
    this.otpForm.form.markAllAsTouched();
    if (!this.otpForm.valid) {
      return;
    }
    this.sipnner.show();
    this.loginService.userOTP(email ? email : this.otpModel).subscribe(res => {
      if (res['errorcode'] == null && this.otpModel.OTP == undefined) {
        this.otp = res['stringresult'].slice(-5);
        this.checkOTP = true;
        this.sendOTP = false;
        this.isReadonly = true;
        this.sipnner.hide();
      } else if (res['errorcode'] == null && this.otpModel.OTP) {
        localStorage.setItem('userName', this.otpModel.UserName);
        this.router.navigate(['/auth/forgot-password']);
        this.sipnner.hide();
      } else {
        this.commonHelper.errorMessage(res['stringresult']);
        this.sipnner.hide();
      }
    }, error => {
      console.log(error);
      this.sipnner.hide();
    });
  }

  reSendOtp(userName: any) {
    const data = {
      UserName: userName,
      PublicIP: this.publicIP,
    }
    this.sipnner.show();
    this.loginService.userOTP(data).subscribe(res => {
      if (!res['errorcode']) {
        this.otp = res['stringresult'].slice(-5);
        this.sipnner.hide();
      }
    }, error => {
      this.sipnner.hide();
      console.log(error);
    });
  }

  isNumber(num: any, isdecimal = false) {
    num = (num) ? num : window.event;
    var charCode = (num.which) ? num.which : num.keyCode;
    if (charCode == 46 && isdecimal)
      return true
    else if (charCode > 31 && (charCode < 48 || charCode > 57))
      return false;
    return true;
  }
}
