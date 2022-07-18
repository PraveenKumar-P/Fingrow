import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { CommonHelper } from 'src/app/helper/common.helper';
import { LoginService } from 'src/app/Sevices/login.service';
import { UserService } from 'src/app/sevices/user.service';

@Component({
  selector: 'app-user-authorization',
  templateUrl: './user-authorization.component.html',
  styleUrls: ['./user-authorization.component.scss']
})

export class UserAuthorizationComponent implements OnInit {
  @ViewChild("authorizationForm", { static: true }) authorizationForm: NgForm;
  public authorizationModel: any = {};
  public confirmPassword: any;
  public publicIP: any;
  public userCode: any;

  constructor(
    private userService: UserService,
    private commonHelper: CommonHelper,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private loginService: LoginService) { }

  ngOnInit(): void {
    this.userCode = this.activateRoute.params['value'].usercode;
    this.loginService.getSystemIP().subscribe(res => this.publicIP = res.ip);
  }

  authorizationSubmit() {
    this.authorizationForm.form.markAllAsTouched();
    if (!this.authorizationForm.valid) {
      return;
    }
    const result = {
      userCode: this.authorizationModel.userCode ? this.authorizationModel.userCode : this.userCode,
      Password: this.authorizationModel.Password,
      PublicIP: this.publicIP ? this.publicIP : '',
      OTP: this.authorizationModel.OTP
    };
    this.userService.userEVerify(result).subscribe(res => {
      if (!res.errorcode) {
        this.commonHelper.successMessage(res.stringresult);
        this.router.navigate(['auth/login']);
      } else if (res.errorcode == "405") {
        this.commonHelper.successMessage(res.stringresult);
        this.router.navigate(['auth/login']);
      }
      else {
        this.commonHelper.errorMessage(res.stringresult);
      }
    }, error => {
      console.log(error);
    });
  }
}
