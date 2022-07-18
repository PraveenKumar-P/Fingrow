import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';

import { CommonHelper } from 'src/app/helper/common.helper';
import { LoginService } from 'src/app/Sevices/login.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})

export class ForgotPasswordComponent implements OnInit {
  @ViewChild('forgotForm', { static: false }) forgotForm: NgForm;
  public forgotModel: any = {};
  public confirmPassword: any;
  public publicIP: any;

  constructor(
    private loginService: LoginService,
    private common: CommonHelper,
    private router: Router,
    private sipnner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.forgotModel.UserName = localStorage.getItem('userName') ? localStorage.getItem('userName') : '';
    this.loginService.getSystemIP().subscribe(res => this.publicIP = res.ip);
  }

  forgotSubmit() {
    const data = {
      Username: this.forgotModel.UserName ? this.forgotModel.UserName : null,
      Password: this.forgotModel.Password ? this.forgotModel.Password : null,
      PublicIP: this.publicIP ? this.publicIP : ''
    };
    this.forgotForm.form.markAllAsTouched();
    if (!this.forgotForm.valid) {
      return;
    }
    this.sipnner.show();
    this.loginService.forgetPassword(data).subscribe(res => {
      if (!res.errorcode) {
        this.common.successMessage(res.stringresult);
        this.router.navigate(['/auth/login']);
        this.sipnner.hide();
      } else {
        this.common.errorMessage(res.stringresult);
        this.sipnner.hide();
      }
    }, err => {
      console.log(err);
      this.common.errorMessage(err);
      this.sipnner.hide();
    });
  }
}
