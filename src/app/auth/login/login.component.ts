import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { NgForm } from '@angular/forms';

import { NgxSpinnerService } from 'ngx-spinner';

import { LoginService } from 'src/app/Sevices/login.service';
import { CommonHelper } from 'src/app/helper/common.helper';
import { Constants } from 'src/app/helper/constants';
import { UserService } from 'src/app/sevices/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  @ViewChild('loginForm', { static: false }) loginForm: NgForm;
  @ViewChild('EAgreement', { static: false }) eAgreementTemplateRef: TemplateRef<any>;
  public loginModel: any = {};
  public publicIP: any;
  public isLoading: boolean = false;
  public constants = Constants;
  public htmlText: string;
  public userId: any;
  public isClicked: boolean = false;

  constructor(
    private loginService: LoginService,
    private common: CommonHelper,
    private router: Router,
    private modalService: BsModalService,
    private userService: UserService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.loginService.getSystemIP().subscribe(res => this.publicIP = res.ip);
  }

  authenticate() {
    const data = {
      Username: this.loginModel.UserName,
      Password: this.loginModel.Password,
      PublicIP: this.publicIP ? this.publicIP : ''
    };
    this.loginForm.form.markAllAsTouched();
    if (!this.loginForm.valid) {
      return;
    }
    this.spinner.show();
    this.loginService.login(data).subscribe(res => {
      if (!res.errorcode) {
        if (res['userprofile'].useractivationmasterid == this.constants.APPROVED_MASTER_ID) {
          this.loginService.setItem(res['userprofile'], res['token']);
          localStorage.setItem('isLoggedIn', 'active');
          this.spinner.hide();
          this.router.navigate(['/dashboard']);
        } else if (res['userprofile'].useractivationmasterid == this.constants.E_AGREEMENT_MASTER_ID) {
          this.loginService.setItem(res.userprofile, res.token);
          this.userId = res.userprofile.userid;
          this.htmlText = res.stringresult;
          localStorage.setItem('isLoggedIn', 'active');
          this.openModal();
        }
      } else {
        this.spinner.hide();
        this.common.errorMessage(res.stringresult);
        localStorage.clear();
      }
    }, error => {
      this.spinner.hide();
      localStorage.clear();
      console.log(error);
    });
  }

  onSubmit() {
    this.spinner.show();
    const data = {
      userId: this.userId,
      updatedBy: 3,
      signName: "AGSign",
      pdfName: "77791M4321SPKIE",
      htmlString: "",
      actionType: "A",
      signFile: { fileName: "77791M4321SPKIE", fileextension: ".jpg", binarydata: "data:image/png;base64,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" }
    };
    this.isClicked = true;
    this.userService.userEAgreeStatus(data).subscribe(res => {
      if (!res.errorcode) {
        this.spinner.hide();
        this.closeModel();
        this.common.successMessage(res.stringresult);
        this.router.navigate(['/dashboard']);
        this.modalService.hide();
      } else {
        this.spinner.hide();
        this.closeModel();
        this.loginService.logOut();
      }
    }, error => {
      this.spinner.hide();
      console.log(error);
      this.closeModel();
      this.loginService.logOut();
    });
  }

  openModal() {
    const config = {
      keyboard: false,
      ignoreBackdropClick: true,
      class: 'modal-xl'
    };
    this.modalService.show(this.eAgreementTemplateRef, config);
  }

  closeModel() {
    this.modalService.hide();
  }
}
