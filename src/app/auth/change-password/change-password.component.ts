import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';

import { CommonHelper } from 'src/app/helper/common.helper';
import { LoginService } from 'src/app/Sevices/login.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})

export class ChangePasswordComponent implements OnInit {
  @ViewChild('changePasswordForm', { static: false }) changePasswordForm: NgForm;
  public changePasswordModel: any = {};

  constructor(
    private loginService: LoginService,
    private commonHelper: CommonHelper,
    private router: Router,
    private sipnner: NgxSpinnerService) { }

  ngOnInit(): void {
  }

  changePassword() {
    this.changePasswordForm.form.markAllAsTouched();
    if (!this.changePasswordForm.valid) {
      return;
    }
    this.sipnner.show();
    this.changePasswordModel.UserId = this.loginService.getloginDetails().loginDetails.userid;
    this.loginService.changePassword(this.changePasswordModel).subscribe(res => {
      if (!res.errorcode) {
        localStorage.clear();
        this.sipnner.hide();
        this.commonHelper.successMessage(res.stringresult);
        this.router.navigate(['/auth/login']);
      }
      else {
        this.sipnner.hide();
        this.commonHelper.warningMessage(res.stringresult);
      }
    }, err => {
      console.log(err);
      this.sipnner.hide();
      this.commonHelper.errorMessage(err);
    });
  }
}
