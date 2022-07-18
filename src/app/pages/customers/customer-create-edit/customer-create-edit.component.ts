import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DatePipe } from '@angular/common';

import { BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';

import { CustomerService } from 'src/app/sevices/customers.service';
import { CommonHelper } from 'src/app/helper/common.helper';
import { UserService } from 'src/app/sevices/user.service';
import { LoginService } from 'src/app/Sevices/login.service';

@Component({
  selector: 'app-customer-create-edit',
  templateUrl: './customer-create-edit.component.html',
  styleUrls: ['./customer-create-edit.component.scss']
})

export class CustomerCreateEditComponent implements OnInit {
  @ViewChild('customerForm', { static: false }) customerForm: any;
  @ViewChild('otpForm', { static: false }) otpForm: NgForm;
  @ViewChild('loanProceedForm', { static: false }) loanProceedForm: any;
  @ViewChild('otpContant', { static: false }) otpContant: TemplateRef<any>;

  public customerModel: any = {};
  public employeementMaster: Array<any> = [];
  public tenureMaster: Array<any> = [];
  public otp: any;
  public isOTPPopup: boolean = true;
  public minDate: any;
  public maxDate: any;
  public model: any = {};
  public userCode: any;
  public publicIP: any;
  public otpValue: any;
  public userId: any;
  public type: any;
  public routerLink: any;
  public config: any = {
    keyboard: false,
    ignoreBackdropClick: true,
    class: 'modal-md modal-dialog-centered'
  }

  constructor(
    private customerService: CustomerService,
    private modalService: BsModalService,
    private commonHelper: CommonHelper,
    private spinner: NgxSpinnerService,
    private router: Router,
    private userService: UserService,
    private loginService: LoginService,
    private datePipe: DatePipe,
    private activeRouter: ActivatedRoute) {
    this.maxDate = new Date();
  }

  ngOnInit(): void {
    const type = this.activeRouter.snapshot.queryParams.type;
    this.routerLink = type == 'CLL' ? '/customer-loan-list' : '/customer-list'
    this.loginService.getSystemIP().subscribe(res => this.publicIP = res.ip);
    this.getAllMasters();
  }

  getAllMasters() {
    this.customerService.getAllEmployeementType({ sortBy: "''", sortValue: "A" }).subscribe(res => {
      this.employeementMaster = res ? res : [];
    });
    this.customerService.getAllTenure({ sortBy: "''", sortValue: "A" }).subscribe(res => {
      this.tenureMaster = res ? res : [];
    });
  }

  submitOTP() {
    const data = {
      userCode: this.userCode,
      Password: 'Fingrow@123',
      PublicIP: this.publicIP,
      OTP: this.otpValue,
    }
    this.spinner.show();
    this.userService.userEVerify(data).subscribe(res => {
      if (!res.errorcode) {
        this.spinner.hide();
        this.isOTPPopup = false;
      }
      else if (res.errorcode == "405") {
        this.spinner.hide();
        this.commonHelper.warningMessage(res.stringresult);
      }
    });
  }

  setDate(event: string) {
    this.customerModel.dateOfBirth = this.datePipe.transform(event, 'yyyy-MM-dd');
  }

  onSumbit() {
    this.customerForm.form.markAllAsTouched();
    if (!this.customerForm.valid) {
      return false;
    }
    this.spinner.show();
    this.customerModel.userTypeCode = "CU";
    this.customerService.customerCreation(this.customerModel).subscribe(res => {
      if (!res.errorcode) {
        this.spinner.hide();
        this.otp = res.userotp;
        this.userCode = res.users ? res.users.usercode : '';
        this.userId = res.users ? res.users.userid : '';
        this.modalService.show(this.otpContant, this.config);
      } else if (res.errorcode == "404" || res.errorcode == "409") {
        this.spinner.hide();
        this.commonHelper.warningMessage(res.stringresult);
      }
    }, error => {
      console.log(error);
      this.spinner.hide();
    });
  }

  closeModal() {
    this.modalService.hide();
  }

  reSendOtp(userName: any) {
    this.spinner.show();
    const data = {
      UserName: userName,
      PublicIP: this.publicIP,
    }
    this.loginService.userOTP(data).subscribe(res => {
      if (!res['errorcode']) {
        this.otp = res['stringresult'].slice(-5);
        this.spinner.hide();
      }
    }, error => {
      this.spinner.hide();
      console.log(error);
    });
  }

  isNumber(num) {
    num = (num) ? num : window.event;
    var charCode = (num.which) ? num.which : num.keyCode;
    if (charCode == 46)
      return true
    else if (charCode > 31 && (charCode < 48 || charCode > 57))
      return false;
    return true;
  }

  proceedLoan() {
    this.closeModal();
    this.router.navigate(['/loan-create-edit'], { queryParams: { customerId: window.btoa(this.userId), type: window.btoa('CL') } });
  }

  isCharacter(event: any) {
    if ((event.keyCode > 64 && event.keyCode < 91) || (event.keyCode > 96 && event.keyCode < 123) || event.keyCode == 8 || event.keyCode == 32)
      return true;
    else {
      return false;
    }
  }
}
