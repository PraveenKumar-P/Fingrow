import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';

import { CommonHelper } from 'src/app/helper/common.helper';
import { Constants } from 'src/app/helper/constants';
import { UserService } from 'src/app/sevices/user.service';
import { ValidationService } from 'src/app/sevices/validation.service';

@Component({
  selector: 'app-eligibility-check',
  templateUrl: './eligibility-check.component.html',
  styleUrls: ['./eligibility-check.component.scss']
})

export class EligibilityCheckComponent implements OnInit {
  @ViewChild("eligibilityCheckForm", { static: false }) eligibilityCheckForm;
  @ViewChild("rejectContent", { static: false }) rejectContent: TemplateRef<any>;
  @ViewChild('imageModal', { static: false }) imageModal: TemplateRef<any>;
  @ViewChild('bankDetailsModel', { static: false }) bankDetailsModel: TemplateRef<any>;
  public userEligibilityModel = {};
  public userId: any;
  public remarksValue: any = "";
  public loanDropdownSettings: any;
  public fingrowDropdownSettings: any;
  public loanItems: Array<any> = [];
  public loanMasters: any;
  public removeItems: Array<any> = [];
  public finalArray: Array<any> = [];
  public selectedItems: Array<any> = [];
  public selectedQuery = [];
  public radioButtonMasters: Array<any> = [];
  public aboutFingrowMasters: Array<any> = [];
  public addItem: any = {};
  public finSelectedItems: Array<any> = [];
  public constants = Constants;
  public userImageModel: any = {};
  public userProfileModel: any = {};
  public preview: string;
  public user = [];
  public profImage = '';
  public accountName: any;
  public accountNumber: any;
  public ifscCode: any;
  public bankName: any;
  public defaultImage = 'assets/images/no-user.jpg';
  public status: string;
  public remarks: string;
  public userType: string;
  public config = {
    keyboard: true,
    ignoreBackdropClick: true,
    class: 'modal-md modal-dialog-centered',
  };

  constructor(
    private validationService: ValidationService,
    private activateRouter: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private modalService: BsModalService,
    private commonHelper: CommonHelper,
    private router: Router,
    private userAPI: UserService,
    private activeRouter: ActivatedRoute,) {
    this.addItem = {
      eligibilityquestion: "What is the expected business from you",
      remarks: "",
      userquestions: "What is the expected business from you"
    }
  }

  ngOnInit() {
    this.userId = this.activateRouter.snapshot.queryParams.userId ? window.atob(this.activateRouter.snapshot.queryParams.userId) : '';
    this.status = this.activeRouter.snapshot.queryParams.status;
    this.userType = this.activeRouter.snapshot.queryParams.type ? window.atob(this.activeRouter.snapshot.queryParams.type) : '';
    this.getMasters();
    if (this.userId !== null) {
      this.getAllUsers(this.userId);
    }
    this.getUserDocs();
    this.getUserEditData();
    this.loanDropdownSettings = {
      singleSelection: false,
      idField: 'loanid',
      textField: 'loanname',
      enableCheckAll: false,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      searchPlaceholderText: 'Search Loan',
      allowSearchFilter: true,
      limitSelection: -1,
      clearSearchFilter: true,
      maxHeight: 200,
      itemsShowLimit: 2,
      noDataAvailablePlaceholderText: 'No data avaliable',
    };
    this.fingrowDropdownSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'value',
      enableCheckAll: false,
      allowSearchFilter: true,
      limitSelection: -1,
      clearSearchFilter: true,
      maxHeight: 200,
      itemsShowLimit: 2,
      noDataAvailablePlaceholderText: 'No data avaliable',
    }
  }

  getUserDocs() {
    this.spinner.show();
    this.userAPI.GetUserDocs({ userId: this.userId }).subscribe(res => {
      let baseUrl = 'data:image/png;base64,';
      this.userImageModel.panImageSrc = (res.pannumber) ? baseUrl + res.pannumber : null;
      this.userImageModel.addressImageSrc = (res.addressproof) ? baseUrl + res.addressproof : null;
      this.spinner.hide();
    }, (error) => {
      console.log(error);
      this.spinner.hide();
    });
  }

  getAllUsers(userId) {
    this.spinner.show();
    this.userAPI.GetUserDetail({ userId: userId }).subscribe((res) => {
      if ('users' in res && Object.keys(res.users).length !== 0) {
        this.userId = res.users.userid;
        this.profImage = (res.profilepicture) ? res.profilepicture : '';
        this.accountName = res.users.bankaccountname;
        this.accountNumber = res.users.bankaccountnumber;
        this.ifscCode = res.users.ifsccode;
        this.bankName = res.bankmaster.bankname;
      }
      this.spinner.hide();
    });
    (error) => {
      console.log(error);
      this.spinner.hide();
    }
  }

  getMasters() {
    this.spinner.show();
    this.validationService.getAllLoansType({ sortBy: "''", sortValue: 'A' }).subscribe(res => {
      this.loanMasters = res;
      this.spinner.hide();
    });
  }

  getUserEditData() {
    this.spinner.show();
    this.getUserDocs();
    this.validationService.getUserEligibilityCheck({ userId: this.userId }).subscribe(res => {
      this.remarks = res.data.rejectionremarks ? res.data.rejectionremarks : '';
      this.userEligibilityModel = res.status ? res.data : {};
      this.loanItems = this.userEligibilityModel['result2'].length > 0 ? this.userEligibilityModel['result2'].map(item => {
        return {
          Answers: item.Answers,
          ControlType: item.ControlType,
          EQuestions: item.EQuestions,
          EligibilityId: item.EligibilityId,
          loanid: item.LoanMasterId,
          loanname: item.Loanname,
          UQuestions: item.UQuestions,
          remarks: '',
        }
      }) : [];
      this.selectedItems = this.loanItems;
      this.loanItems.forEach(element => {
        this.selectedQuery.push(element.loanid);
      });

      this.userEligibilityModel['result1'].length > 0 ? this.userEligibilityModel['result1'].filter(item => {
        this.loanMasters.filter(loan => {
          item.userquestions == loan.loanname || item.eligibilityquestion == loan.loanname ? this.removeItems.push(item) : null;
        });
      }) : [];

      this.removeItems.forEach(remove => {
        this.userEligibilityModel['result1'] = this.userEligibilityModel['result1'].length > 0 ? this.userEligibilityModel['result1'].filter(item => item !== remove) : [];
      });

      this.radioButtonMasters = this.userEligibilityModel['result3'].length > 0 ? this.userEligibilityModel['result3'][0].AnswerType : this.constants.ANSWER_TYPE;
      this.aboutFingrowMasters = this.userEligibilityModel['result4'].length > 0 ? this.userEligibilityModel['result4'][0].AnswerType.map(item => {
        return {
          id: item,
          value: item
        }
      }) : this.constants.ABOUT_FINGROW_MASTERS;
      this.finSelectedItems = this.userEligibilityModel['result4'].length > 0 && this.userEligibilityModel['result4'][0].Answers ? this.userEligibilityModel['result4'].map((item) => {
        return {
          id: item.Answers,
          value: item.Answers
        }
      }) : [];
      this.margeArray();
    });
    this.spinner.hide();
  }

  margeArray() {
    if (this.userEligibilityModel['result1'].length > 0) {
      let i = 0;
      for (i; i < this.userEligibilityModel['result1'].length; i++) {
        if (i == 3) {
          this.finalArray.push(this.addItem);
          this.finalArray.push(this.userEligibilityModel['result1'][i]);
        } else {
          this.finalArray.push(this.userEligibilityModel['result1'][i]);
        }
      }
    }
  }

  openRejectModel() {
    const config = {
      keyboard: false,
      ignoreBackdropClick: false,
      class: 'modal-md modal-dialog-centered'
    };
    this.modalService.show(this.rejectContent, config);
  }

  closeModel() {
    this.modalService.hide();
  }

  onSubmit(status: any) {
    this.closeModel();
    this.spinner.show();
    let userEligibility = this.finalArray.map(item => {
      return {
        eligibilityId: item.eligibilityid,
        questions: item.eligibilityquestion ? item.eligibilityquestion : item.userquestions,
        answers: item.answers,
        remarks: item.remarks
      };
    });
    this.loanItems.map(item => {
      userEligibility.push({
        eligibilityId: item.EligibilityId,
        questions: item.UQuestions ? item.UQuestions : item.EQuestions,
        answers: item.Answers,
        remarks: item.remarks
      });
    });
    let result = {
      userId: this.userId,
      userEligibilities: userEligibility,
      modifiedBy: 1,
      status: status,
      remarks: this.remarksValue,
      eligibility2array: this.selectedQuery
    }
    const query = {
      userId: this.userId,
      modifiedBy: 1,
      status: status,
      remarks: this.remarksValue
    };
    if (status === 'A') {
      for (let index = 0; index < result.userEligibilities.length; index++) {
        if (result.userEligibilities[index].answers == "" || result.userEligibilities[index].answers == null && index !== 3 ? true : false) {
          this.spinner.hide();
          return this.commonHelper.errorMessage("All fields are Required");
        }
      }
    }
    result.userEligibilities = result.userEligibilities.map(item => {
      return {
        eligibilityId: item.eligibilityId,
        questions: item.questions,
        answers: item.eligibilityId == 2 ? "" : item.answers,
        remarks: item.remarks
      };
    });
    this.validationService.userEligibilityCreation(result).subscribe(res => {
      if (res.errorcode == null) {
        this.validationService.userEligibilityStatus(query).subscribe(res => {
          this.commonHelper.successMessage(res.stringresult);
          this.spinner.hide();
          this.router.navigate(['/user-list']);
          this.closeModel();
        });
      } else {
        this.spinner.hide();
        this.commonHelper.errorMessage(res.stringresult);
      }
    }, err => {
      console.log(err);
      this.spinner.hide();
      this.commonHelper.errorMessage(err);
    });
  }

  onItemSelect(addItem: any, changeItem: any) {
    const eligibilityItem = this.removeItems.find(item => item.eligibilityquestion == addItem.loanname);
    const addLoan = {
      Answers: '',
      ControlType: '',
      EQuestions: addItem.loanname,
      EligibilityId: eligibilityItem.eligibilityid,
      loanid: addItem.loanid,
      loanname: addItem.loanname,
      UQuestions: addItem.loanname,
      remarks: '',
    }
    this.selectedItems.push(addLoan);
    this.loanItems.push(addLoan);
    this.selectedQuery.push(addItem.loanid);

    let result = this.finalArray.find(item => item.eligibilityid == changeItem.eligibilityid);
    result.answers = this.selectedQuery;
    this.finalArray.map(item => item.eligibilityid == result.eligibilityid ? result : item);
  }

  onItemDeSelect(removeItem: any, items: any) {
    this.loanItems = this.loanItems.filter(item => item.loanid !== removeItem.loanid);
    this.selectedQuery = this.selectedQuery.filter(item => item !== removeItem.loanid);

    let result = this.finalArray.find(item => item.eligibilityid == items.eligibilityid);
    result.answers = this.selectedQuery;
    this.finalArray.map(item => item.eligibilityid == result.eligibilityid ? result : item);
  }

  onItemSelectFingrow(addItem: any, changeItem: any) {
    let result = this.finalArray.find(item => item.eligibilityid == changeItem.eligibilityid);
    result.answers = addItem.id;
    this.finalArray.map(item => item.eligibilityid == result.eligibilityid ? result : item);
  }

  onItemDeSelectFingrow(deSelectItem: any) {
    let deSelectValue = this.finalArray.find(item => item.eligibilityid == deSelectItem.eligibilityid);
    deSelectValue.answers = "";
    this.finalArray.map(item => item.eligibilityid == deSelectValue.eligibilityid ? deSelectValue : item);
  }

  radioChange(value: any, items: any) {
    let result = this.finalArray.find(item => item.eligibilityid == items.eligibilityid);
    result.answers = value;
    this.finalArray.map(item => item.eligibilityid == result.eligibilityid ? result : item);
  }

  checkBoxChange(event: any, item: any) {
    const eventStatus = event.target.checked;
    let result = this.finalArray.find(items => items.eligibilityid == item.eligibilityid);
    result.answers = eventStatus;
    this.finalArray.map(item => item.eligibilityid == result.eligibilityid ? result : item);
  }

  openImageModal(img = '') {
    this.preview = img ? img : this.defaultImage;
    this.modalService.show(this.imageModal, this.config);
  }

  openBankModal(img = '') {
    this.preview = img;
    this.modalService.show(this.bankDetailsModel, this.config);
  }
}
