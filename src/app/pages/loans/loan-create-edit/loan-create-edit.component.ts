import { Component, HostListener, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';

import { CommonHelper } from 'src/app/helper/common.helper';
import { Constants } from 'src/app/helper/constants';
import { CustomerService } from 'src/app/sevices/customers.service';
import { LoanService } from 'src/app/sevices/loan.service';
import { LocationService } from 'src/app/sevices/location.service';
import { LoginService } from 'src/app/Sevices/login.service';
import { MasterService } from 'src/app/sevices/master.service';
import { UserService } from 'src/app/sevices/user.service';

@Component({
  selector: 'app-loan-create-edit',
  templateUrl: './loan-create-edit.component.html',
  styleUrls: ['./loan-create-edit.component.scss']
})

export class LoanCreateEditComponent implements OnInit {
  @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
    let result = confirm("Changes you made may not be saved.");
    localStorage.removeItem("Co-applicant");
    if (result) {
      // Do more processing...
    }
    event.returnValue = false; // stay on same page
  }
  @ViewChild('appliantForm', { static: false }) appliantForm: NgForm;
  @ViewChild('approverForm', { static: false }) approverForm: NgForm;
  @ViewChild('removeCoApplicant', { static: false }) removeCoApplicant: TemplateRef<any>;
  @ViewChild('emiModal', { static: false }) emiModal: TemplateRef<any>;
  @ViewChild('imageModal', { static: false }) imageModal: TemplateRef<any>;
  @ViewChild('rejectModal', { static: false }) rejectModal: TemplateRef<any>;
  @ViewChild('approverOpenModel', { static: false }) approverOpenModel: TemplateRef<any>;

  public loanId: any;
  public userModel: any = {};
  public loanModel: any = {};
  public loanLocalDocModel: any = {};
  public loanApplications: any = {};
  public loanDocuments: Array<any> = [];
  public approverModel: any = {};
  public model: any = {};
  public active = 1;
  public previousbtn: 'Back';
  public custoloanLocalDocModelmerModel: any = {};
  public showAge: any;
  public final: Array<any> = [];
  public preview: string;
  public customerId: any;
  public removeIndex: any;
  public removeCoApplicantId: any;
  public userType: any;
  public constant = Constants;
  public isReadOnly: boolean = false;
  public isReject: boolean = false;
  public isClicked: boolean = false;
  public isCustomerList: boolean = false;
  public view: string;
  public isCancel: boolean = false;
  public statusId: any;
  public redirectURL: string;
  public type: string;
  public coApplicantList: Array<any> = [];
  public idProofVar = [];
  public panidProofVar = [];
  public addressdocument = [];
  public uploadPhoto = [];
  public takeSelfie = [];
  public panImageRemove: boolean = true;
  public idProofImageRemove: boolean = true;
  public addProofImageRemove: boolean = true;
  public profileImageRemove: boolean = true;
  public masterQueryParams: any = { sortBy: "name", sortValue: 'A' }
  public message: string = "Message";

  //Masters
  public loanMaster: Array<any> = [];
  public bankMaster: Array<any> = [];
  public tenureMaster: Array<any> = [];
  public durationType: Array<any> = [];
  public educationType: Array<any> = [];
  public relationShipType: Array<any> = [];
  public residenceTypes: Array<any> = [];
  public yearOfExperience: Array<any> = [];
  public employeementTypes: Array<any> = [];
  public idDocumentsTypes: Array<any> = [];
  public apDocumentsTypes: Array<any> = [];
  public areaTypes: Array<any> = [];
  public countryList: Array<any> = [];
  public stateList: Array<any> = [];
  public cityList: Array<any> = [];
  public noOfDependents: Array<any> = [
    { id: 1, value: 1 },
    { id: 2, value: 2 },
    { id: 3, value: 3 },
    { id: 4, value: 4 },
    { id: 5, value: 5 },
    { id: 6, value: 6 },
    { id: 7, value: 7 },
    { id: 8, value: 8 },
    { id: 9, value: 9 },
    { id: 10, value: 10 },
  ];
  public maritalStatus: Array<any> = [
    { id: 'Married', value: 'Married' },
    { id: 'UnMarried', value: 'UnMarried' },
    { id: 'Divorced', value: 'Divorced' },
    { id: 'Widowed', value: 'Widowed' }
  ];
  public genderMaster: any = [
    { id: 'Male', value: 'Male' },
    { id: 'Female', value: 'Female' },
    { id: 'Others', value: 'Others' }
  ];
  public documentTypes: Array<any> = [
    { id: 'true', value: 'Aadhar' },
    { id: 'false', value: 'Pan' }
  ];
  public smallModalConfig: any = {
    keyboard: false,
    ignoreBackdropClick: false,
    class: 'modal-md modal-dialog-centered'
  }
  public largeModalConfig: any = {
    keyboard: false,
    ignoreBackdropClick: false,
    class: 'modal-xl modal-dialog-centered'
  }

  constructor(
    private modalService: BsModalService,
    private userService: UserService,
    private customerService: CustomerService,
    private masterService: MasterService,
    private locationService: LocationService,
    private commonHelper: CommonHelper,
    private loanService: LoanService,
    private router: Router,
    private activeRouter: ActivatedRoute,
    private loginService: LoginService,
    private spinner: NgxSpinnerService) {
  }

  async ngOnInit() {
    this.spinner.show();
    await this.getMasters();
    this.customerId = this.activeRouter.snapshot.queryParams.customerId ? this.decryptParams(this.activeRouter.snapshot.queryParams.customerId) : '';
    this.loanId = this.activeRouter.snapshot.queryParams.loanId ? this.decryptParams(this.activeRouter.snapshot.queryParams.loanId) : '';
    this.view = this.activeRouter.snapshot.queryParams.view ? this.decryptParams(this.activeRouter.snapshot.queryParams.view) : '';
    this.isReject = this.activeRouter.snapshot.queryParams.isReject;
    this.type = this.activeRouter.snapshot.queryParams.type ? this.decryptParams(this.activeRouter.snapshot.queryParams.type) : '';
    if (this.view == 'VW') {
      this.isReadOnly = true;
    }
    if (this.type == 'DB') {
      this.redirectURL = '/dashboard';
    } else if (this.type == 'CL') {
      this.redirectURL = '/customer-list';
    } else if (this.type == 'CLL') {
      this.redirectURL = '/customer-loan-list';
    }
    if (this.customerId) {
      this.userService.getUserDetailsById({ userId: this.customerId }).subscribe(async res => {
        if (!res.errorcode) {
          this.userModel = res.users ? res.users : {};
          this.userType = this.loginService.getloginDetails().loginDetails ? this.loginService.getloginDetails().loginDetails['usertypecode'] : '';
          this.loanModel.customerfirstname = res.users.firstname;
          this.loanModel.customermiddlename = res.users.middlename;
          this.loanModel.customerlastname = res.users.lastname;
          this.loanModel.customeremailid = res.users.emailid;
          this.loanModel.customermobile = res.users.mobilenumber;
          this.loanModel.customeremployeementtypeid = res.users.useremployeementtypeid;
          this.loanModel.customermonthlyincome = res.users.netmonthlyincome;
          this.loanModel.customerdateofbirth = res.users.dateofbirth ? {
            "year": new Date(res.users.dateofbirth).getFullYear(),
            "month": +new Date(res.users.dateofbirth).getMonth() + 1,
            "day": new Date(res.users.dateofbirth).getDate()
          } : null;
        }
        await this.changeCountry();
        await this.changeState();
        await this.getCoApplicant();
      }, error => {
        console.log(error);
        this.spinner.hide();
      });
    } else {
      if (this.loanId) {
        const query = {
          loanid: this.loanId,
          userid: this.loginService.getloginDetails().loginDetails['userid'],
          usertype: this.loginService.getloginDetails().loginDetails['usertypecode']
        }
        this.loanService.getLoanApplication(query).subscribe(async res => {
          this.userModel = res.users ? res.users : {};
          this.statusId = res.statusmaster ? res.statusmaster.statusid : '';
          this.userType = this.loginService.getloginDetails().loginDetails ? this.loginService.getloginDetails().loginDetails['usertypecode'] : '';
          this.loanModel = res.customerdetails ? res.customerdetails : {};
          this.loanApplications = res.loanapplication ? res.loanapplication : {};
          this.loanModel.ispan = res.ispan ? 'true' : 'false';
          this.loanModel.customeraadharnumber = this.loanModel.ispan == 'true' ? this.loanModel.customeraadharnumber : null;
          this.loanModel.customerpannumber = this.loanModel.ispan == 'false' ? this.loanModel.customerpannumber : null;
          this.loanModel.customerfirstname = res.users.firstname;
          this.loanModel.customermiddlename = res.users.middlename;
          this.loanModel.customerlastname = res.users.lastname;
          this.loanModel.customeremailid = res.users.emailid;
          this.loanModel.customermobile = res.users.mobilenumber;
          this.loanModel.customeremployeementtypeid = res.users.useremployeementtypeid;
          this.loanModel.customermonthlyincome = res.users.netmonthlyincome;
          this.loanModel.customergender = res.users.gender;
          this.loanModel.customeryearsofexperiencetypeid = res.customerdetails ? res.customerdetails.customeryearsofexperienceid : '';
          this.loanModel.customerdateofbirth = res.users.dateofbirth ? {
            "year": new Date(res.users.dateofbirth).getFullYear(),
            "month": +new Date(res.users.dateofbirth).getMonth() + 1,
            "day": new Date(res.users.dateofbirth).getDate()
          } : null;
          this.loanLocalDocModel.profileImageSrc = res.profilepicture ? res.profilepicture : '';
          this.profileImageRemove = this.loanLocalDocModel.profileImageSrc ? false : true;
          this.loanModel.customerprofilephoto = {
            fileName: '',
            fileextension: '.jpg',
            binarydata: res.profilepicture
          };
          await this.changeCountry();
          await this.changeState();
          await this.getLoanDocs();
          await this.getCoApplicant();
        }, error => {
          this.spinner.hide();
          console.log(error);
        });
      }
    }
    const data = this.loanService.getLoanApplicant();
    this.loanApplications = data.loanApplications ? data.loanApplications : {};
    this.loanModel = data.loanModel ? data.loanModel : {};
    this.loanLocalDocModel = data.loanLocalDocModel ? data.loanLocalDocModel : {};
    this.loanDocuments = data.loanDocModel ? data.loanDocModel : [];
    if (this.loanLocalDocModel !== null) {
      this.panImageRemove = this.loanLocalDocModel.panidProofVar ? false : true;
      this.idProofImageRemove = this.loanLocalDocModel.idProofImageSrc ? false : true;
      this.addProofImageRemove = this.loanLocalDocModel.addProofImageSrc ? false : true;
      this.profileImageRemove = this.loanLocalDocModel.profileImageSrc ? false : true;
    }
  }

  async getMasters() {
    this.loanService.getAllLoansType(this.masterQueryParams).subscribe(res => {
      this.loanMaster = res.length > 0 ? res : [];
    });
    this.userService.GetAllBankList(this.masterQueryParams).subscribe(res => {
      this.bankMaster = res ? res : [];
    });
    this.customerService.getAllTenure(this.masterQueryParams).subscribe(res => {
      this.tenureMaster = res ? res : [];
    });
    this.masterService.getAllDurationofStayTypes(this.masterQueryParams).subscribe(res => {
      this.durationType = res.length > 0 ? res : [];
    });
    this.masterService.getAllEducationTypes(this.masterQueryParams).subscribe(res => {
      this.educationType = res.length > 0 ? res : [];
    });
    this.masterService.getAllRelationshipTypes(this.masterQueryParams).subscribe(res => {
      this.relationShipType = res.length > 0 ? res : [];
    });
    this.masterService.getAllResidenceTypes(this.masterQueryParams).subscribe(res => {
      this.residenceTypes = res.length > 0 ? res : [];
    });
    this.masterService.getAllYearsofExperience(this.masterQueryParams).subscribe(res => {
      this.yearOfExperience = res.length > 0 ? res : [];
    });
    this.masterService.getAllEmployeementTypes(this.masterQueryParams).subscribe(res => {
      this.employeementTypes = res.length > 0 ? res : [];
    });
    this.masterService.getAllDocumentType(this.masterQueryParams).subscribe(res => {
      this.idDocumentsTypes = res.length > 0 ? res.filter(i => i.documenttypecategory == "ID" ? i : '') : [];
      this.apDocumentsTypes = res.length > 0 ? res.filter(i => i.documenttypecategory == "AP" ? i : '') : [];
    });
    this.masterService.getAllAreaTypes(this.masterQueryParams).subscribe(res => {
      this.areaTypes = res.length > 0 ? res : [];
    });
    this.locationService.GetAllCountries(this.masterQueryParams).subscribe(res => {
      this.countryList = res.length > 0 ? res : [];
    });
  }

  async changeCountry() {
    if (this.loanModel.customercountryid) {
      this.locationService.GetAllStates({ sortBy: "''", sortValue: "A", countryId: this.loanModel.customercountryid }).subscribe(async (res) => {
        this.stateList = await res.length > 0 ? res : [];
      });
    }
  }

  async changeState() {
    if (this.loanModel.customerstateid) {
      this.locationService.GetAllCity({
        sortBy: "''", sortValue: "A",
        countryId: this.loanModel.customercountryid, stateId: this.loanModel.customerstateid
      }).subscribe(async res => {
        this.cityList = await res.length > 0 ? res : [];
      });
    }
  }

  async getLoanDocs() {
    this.loanService.getLoanDocs({ loanid: this.loanId }).subscribe(async loanDoc => {
      this.loanDocuments = loanDoc.docloandetail.map(i => {
        return {
          loandocumenttypeid: i.documenttypeid,
          loandocumentname: i.loandocumentname ? i.loandocumentname : '',
          documentfile: {
            fileextension: '.jpg',
            fileName: i.loandocumentname,
            binarydata: i.base64string
          }
        }
      });
      await loanDoc.docloandetail.map(item => {
        if (item.documenttypeid == 1) {
          this.panImageRemove = false;
          this.loanLocalDocModel.panDocId = item.loandocumentid;
          this.loanLocalDocModel.panImageSrc = item.base64string ? item.base64string : '';
        }
      });
      await this.idDocumentsTypes.find(i => {
        loanDoc.docloandetail.map(item => {
          if (i.documenttypeid == item.documenttypeid) {
            this.loanLocalDocModel.idDocId = item.loandocumentid;
            this.loanLocalDocModel.idProof = item.documenttypeid;
            this.loanLocalDocModel.documentNumber = item.loandocumentname
            this.loanLocalDocModel.idProofImageSrc = item.base64string ? item.base64string : '';
            this.idProofImageRemove = this.loanLocalDocModel.idProofImageSrc ? false : true;
          }
        });
      });
      await this.apDocumentsTypes.find(i => {
        loanDoc.docloandetail.map(item => {
          if (i.documenttypeid == item.documenttypeid) {
            this.loanLocalDocModel.addDocId = item.loandocumentid;
            this.loanLocalDocModel.addProof = item.documenttypeid;
            this.loanLocalDocModel.addressDocumentNumber = item.loandocumentname
            this.loanLocalDocModel.addProofImageSrc = item.base64string ? item.base64string : '';
            this.addProofImageRemove = this.loanLocalDocModel.addProofImageSrc ? false : true;
          }
        });
      });
    });
  }

  async getCoApplicant() {
    if (this.loanId) {
      let localStorageData = JSON.parse(localStorage.getItem("Co-applicant")) ? JSON.parse(localStorage.getItem("Co-applicant")) : [];
      this.loanService.getCoapplicantDetails({
        sortby: "''", sortvalue: 'A',
        loanapplicationid: this.loanId, customerid: this.loanApplications.customerid
      }).subscribe(async res => {
        if (!res.errormessage) {
          if (res.data.length > 0) {
            let resData = await res.data.map(item => item ? item : '');
            if (resData.length == 5) {
              this.coApplicantList = resData;
            } else {
              this.coApplicantList = resData;
              localStorageData.length > 0 ? localStorageData.filter(i => {
                if (this.coApplicantList.length <= 4) {
                  if (!i.coapplicantid) {
                    this.coApplicantList.push(i);
                  }
                }
              }) : this.coApplicantList = resData;
              localStorage.setItem("Co-applicant", JSON.stringify(this.coApplicantList));
            }
            this.spinner.hide();
          } else {
            this.coApplicantList = JSON.parse(localStorage.getItem("Co-applicant")) ? JSON.parse(localStorage.getItem("Co-applicant")) : [];
            this.spinner.hide();
          }
        }
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
    } else {
      this.coApplicantList = JSON.parse(localStorage.getItem("Co-applicant")) ? JSON.parse(localStorage.getItem("Co-applicant")) : [];
      this.spinner.hide();
    }
  }

  async deleteCoApplicant() {
    const deleteId = this.removeIndex == 0 || this.removeIndex > 0 ? this.coApplicantList[this.removeIndex].coapplicantid : '';
    if (deleteId) {
      this.loanService.removeCoapplicant({ coapplicantid: deleteId, loanid: this.loanId }).subscribe(async removeCoApp => {
        if (!removeCoApp.errorcode) {
          this.coApplicantList.splice(this.removeIndex, 1);
          localStorage.setItem("Co-applicant", JSON.stringify(this.coApplicantList));
          this.closeModel();
        }
      }, error => {
        console.log(error);
        this.closeModel();
      });
    } else {
      this.coApplicantList.splice(this.removeIndex, 1);
      localStorage.setItem("Co-applicant", JSON.stringify(this.coApplicantList));
      this.closeModel();
    }
  }

  async createApplicant() {
    this.appliantForm.form.markAllAsTouched();
    if (!this.appliantForm.form.valid) {
      this.commonHelper.errorMessage('Fill all mandatory Fields');
      return;
    }
    if (this.loanModel.customercityid == "0" || this.loanModel.customercityid == '') {
      this.commonHelper.errorMessage('Please Select City');
      return;
    }
    this.spinner.show();
    this.isClicked = true;
    this.loanModel.customerspousename = this.loanModel.customerspousename ? this.loanModel.customerspousename : this.loanModel.customerfathername;
    this.loanModel.customerdetailid = '0';
    this.loanModel.customerdetailcustomerid = this.loanId ? this.loanModel.customerdetailcustomerid : this.customerId;
    this.loanModel.customerrelationshipid = '1';
    this.loanModel.customercreatedby = this.loginService.getloginDetails().loginDetails.userid;
    this.loanModel.customerupdatedby = this.loginService.getloginDetails().loginDetails.userid;
    this.loanApplications.totalnetincome = this.loanModel.customermothlyincome;
    this.loanApplications.customerid = this.loanId ? this.loanApplications.customerid : this.customerId;
    this.loanApplications.customeremployeementid = this.loanModel.customeremployeementid;
    this.loanApplications.employeeposition = '';
    this.loanApplications.companyname = '';
    this.loanApplications.agentid = this.loginService.getloginDetails().loginDetails.userid;
    this.loanApplications.applicationremarks = this.loanModel.remarksCommend ? this.loanModel.remarksCommend : '';
    this.loanApplications.loantype = this.loanApplications.loanmasterid ? this.loanMaster.find(i => i.loanid == this.loanApplications.loanmasterid).loantype : '';
    let status: any;
    let type: any;
    if (this.userType == this.constant.AGENT_TYPE_CODE && !this.loanId) {
      status = 'D';
      type = 'P';
    } else {
      status = 'D';
      type = 'D'
    }
    if (this.loanId) {
      this.loanApplications = this.bindRejectModel();
      this.loanModel = this.bindReinstateModel();
    }
    this.idDocumentsTypes.find(i => {
      this.loanDocuments.map(item => {
        if (i.documenttypeid == item.loandocumenttypeid) {
          item.loandocumentname = this.loanLocalDocModel.documentNumber ? this.loanLocalDocModel.documentNumber : '';
        }
      });
    });
    this.apDocumentsTypes.find(i => {
      this.loanDocuments.map(item => {
        if (i.documenttypeid == item.loandocumenttypeid) {
          item.loandocumentname = this.loanLocalDocModel.addressDocumentNumber ? this.loanLocalDocModel.addressDocumentNumber : '';
        }
      });
    });
    const result = {
      loanapplicationid: this.loanId ? this.loanId : 0,
      loanapplications: this.loanApplications,
      customerdetails: this.loanModel,
      loandocuments: this.loanDocuments,
      iscoapplicant: this.coApplicantList.length > 0 ? true : false,
      modifiedby: this.loginService.getloginDetails().loginDetails.userid,
      status: status,
      type: type
    }
    this.loanService.createLoan(result).subscribe(async res => {
      if (!res.errorcode) {
        this.coApplicantList = this.coApplicantList.filter(i => !i.coapplicantid);
        if (this.coApplicantList.length > 0) {
          await this.createCoApplicant(res.loanapplication.loanapplicationid);
        } else {
          this.loanService.setLoanApplicant({});
          localStorage.removeItem("Co-applicant");
          this.spinner.hide();
          this.router.navigate(['/customer-loan-list']);
          this.commonHelper.successMessage(res.stringresult);
        }
      } else {
        this.isClicked = false;
        this.spinner.hide();
        this.commonHelper.errorMessage(res.stringresult);
      }
    }, error => {
      this.spinner.hide();
      console.log(error);
    });
  }

  async updateApplicant(text: any = '', draftSave: any = '') {
    this.appliantForm.form.markAllAsTouched();
    if (!this.appliantForm.form.valid && draftSave !== 'P') {
      this.commonHelper.errorMessage('Fill all mandatory Fields');
      return;
    }
    let status: any;
    let type: any;
    if (this.userType == this.constant.VALIDATOR_1_TYPE_CODE) {
      status = 'A';
      type = 'VT';
    } else if (this.userType == this.constant.VALIDATOR_2_TYPE_CODE) {
      status = 'A';
      type = 'V2';
    } else if (this.userType == this.constant.APPROVER_TYPE_CODE) {
      status = 'A';
      type = 'AP';
    }
    if (text == 'Reject') {
      status = 'R';
      type = this.userType;
    }
    if (draftSave == 'P') {
      status = 'P';
      type = this.userType;
    }
    if (this.loanId) {
      const data = {
        loanapplicationid: this.loanId,
        loanmasterid: this.loanApplications.loanmasterid ? this.loanApplications.loanmasterid : '',
        customerid: this.loanModel.customerdetailcustomerid ? this.loanModel.customerdetailcustomerid : '',
        loanapplicationnumber: this.loanApplications.loanapplicationnumber ? this.loanApplications.loanapplicationnumber : '',
        customeremployeementid: this.loanModel.customeremployeementtypeid ? this.loanModel.customeremployeementtypeid : '',
        employeeposition: "",
        companyname: "",
        totalnetincome: this.loanApplications.totalnetincome ? this.loanApplications.totalnetincome : '',
        agentid: this.loanApplications.agentid ? this.loanApplications.agentid : this.loginService.getloginDetails().loginDetails.userid, // userId
        validator1id: this.loanApplications.validator1id ? this.loanApplications.validator1id : '0', // userId
        validator2id: this.loanApplications.validator2id ? this.loanApplications.validator2id : '0', // userId
        approverid: this.loanApplications.approverid ? this.loanApplications.approverid : '0', // userId
        applicationremarks: this.loanModel.remarksCommend ? this.loanModel.remarksCommend : '',
        loantype: this.loanApplications.loantype ? this.loanApplications.loantype : '',
        emiamount: this.loanApplications.emiamount ? this.loanApplications.emiamount : 0,
        creditcardamount: this.loanApplications.creditcardamount ? this.loanApplications.creditcardamount : 0,
        loanamount: this.loanApplications.loanamount ? this.loanApplications.loanamount : '',
        tenuremasterid: this.loanApplications.tenuremasterid ? this.loanApplications.tenuremasterid : '',
        status: status,
        type: type,
        customerdetails: this.loanModel,
        iscoapplicant: this.coApplicantList.length > 0 ? true : false,
        modifiedby: this.loginService.getloginDetails().loginDetails.userid // userId
      }
      this.idDocumentsTypes.find(i => {
        this.loanDocuments.map(item => {
          if (i.documenttypeid == item.loandocumenttypeid) {
            item.loandocumentname = this.loanLocalDocModel.documentNumber ? this.loanLocalDocModel.documentNumber : '';
          }
        });
      });
      this.apDocumentsTypes.find(i => {
        this.loanDocuments.map(item => {
          if (i.documenttypeid == item.loandocumenttypeid) {
            item.loandocumentname = this.loanLocalDocModel.addressDocumentNumber ? this.loanLocalDocModel.addressDocumentNumber : '';
          }
        });
      });
      this.loanService.updateLoan(data).subscribe(async res => {
        if (!res.errorcode) {
          this.coApplicantList = this.coApplicantList.filter(i => !i.coapplicantid);
          if (draftSave !== 'P') {
            if (this.coApplicantList.length > 0) {
              await this.createCoApplicant(this.loanId);
            } else {
              this.loanService.setLoanApplicant({});
              localStorage.removeItem("Co-applicant");
              this.commonHelper.successMessage(res.stringresult);
              this.closeModel();
              this.router.navigate(['/customer-loan-list']);
            }
          }
        }
      }, error => {
        console.log(error);
        this.spinner.hide();
      });
    }
  }

  async createCoApplicant(loanId: any) {
    this.coApplicantList.length > 0 ? this.coApplicantList.map(item => {
      item.coapplicantloanapplicationid = loanId;
      item.coapplicantcustomerid = this.loanApplications.customerid ? this.loanApplications.customerid : '';
      item.coapplicantprofilepicture = '';
      return this.bindCoApplicant(item);
    }) : [];
    if (this.coApplicantList.length > 0) {
      this.loanService.createMultipleCoapplicants({ requestCoApplicantModels: this.coApplicantList }).subscribe(async res => {
        if (!res.errorcode) {
          await res;
          this.commonHelper.successMessage(res.stringresult);
          this.loanService.setLoanApplicant({});
          localStorage.removeItem("Co-applicant");
          this.spinner.hide();
          this.closeModel();
          this.router.navigate(['/customer-loan-list']);
        }
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
    }
  }

  redirectModel(msg: any) {
    this.commonHelper.successMessage(msg);
    this.loanService.setLoanApplicant({});
    localStorage.removeItem("Co-applicant");
    this.spinner.hide();
    this.closeModel();
    this.router.navigate(['/customer-loan-list']);
  }

  async approverSubmit() {
    const data = this.bindApproverUpdate();
    this.loanService.updateLoanApplicationDetails(data).subscribe(async res => {
      if (!res.errorcode) {
        await res;
        this.updateApplicant();
        this.closeModel();
        this.commonHelper.successMessage(res.stringresult);
        this.router.navigate(['/customer-loan-list']);
      }
    }, error => {
      console.log(error);
    });
  }

  openImageModal(image: any) {
    const config = {
      keyboard: true,
      ignoreBackdropClick: true,
      class: 'modal-xl modal-dialog-centered'
    };
    this.preview = image;
    this.modalService.show(this.imageModal, config);
  }

  openEMIModal() {
    this.modalService.show(this.emiModal, this.largeModalConfig);
  }

  openCoApplicantRemoveModel(removeIndex: any, removeCoApplicant: any) {
    this.removeIndex = removeIndex;
    this.removeCoApplicantId = removeCoApplicant;
    this.modalService.show(this.removeCoApplicant, this.smallModalConfig);
  }

  openRejectModal() {
    this.appliantForm.form.markAllAsTouched();
    if (!this.appliantForm.form.valid) {
      this.commonHelper.errorMessage('Fill all mandatory Fields');
      return;
    }
    this.modalService.show(this.rejectModal, this.smallModalConfig);
  }

  openApproverAcceptModel() {
    this.appliantForm.form.markAllAsTouched();
    if (!this.appliantForm.form.valid) {
      this.commonHelper.errorMessage('Fill all mandatory Fields');
      return;
    }
    this.modalService.show(this.approverOpenModel, this.largeModalConfig);
  }

  closeModel() {
    this.approverModel = {};
    this.modalService.hide();
  }

  cancel() {
    this.loanService.setLoanApplicant({});
    localStorage.removeItem("Co-applicant");
    if (this.type == 'DB') {
      this.router.navigate([this.redirectURL]);
    } else if (this.type == 'CL') {
      this.router.navigate([this.redirectURL]);
    } else if (this.type == 'CLL') {
      this.router.navigate([this.redirectURL]);
    }
  }

  uploadIdProof(event: any, documentTypeId: any) {
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (events: any) => {
      if (event.target.files[0].size > 500000) {
        /* checking size here - 500KB */
        this.loanLocalDocModel.idProofVar = null;
        this.commonHelper.warningMessage("Upload image size Below '500KB'");
      } else {
        if (this.loanId && this.userType !== this.constant.AGENT_TYPE_CODE) {
          const data = {
            loandocumentid: "0",
            loandocumentapplicationid: this.loanId,
            loanapplicationnumber: this.loanApplications.loanapplicationnumber ? this.loanApplications.loanapplicationnumber : '',
            loandocumentname: this.loanLocalDocModel.documentNumber ? this.loanLocalDocModel.documentNumber : '',
            documentuploadedby: "11",
            loandocumenttypeid: documentTypeId,
            documentFile: {
              fileName: event.target.files[0].name,
              fileextension: ".jpg",
              binarydata: events.target.result
            }
          }
          this.loanService.createLoanDocs(data).subscribe(res => {
            if (!res.errorcode) {
              this.loanLocalDocModel.idDocId = res.loandocument.loandocumentid;
              this.loanLocalDocModel.idProofImageSrc = events.target.result;
              this.idProofImageRemove = false;
            } else {
              this.commonHelper.warningMessage(res.stringresult);
            }
          });
        } else {
          this.loanLocalDocModel.idProofImageSrc = events.target.result;
          this.idProofImageRemove = false;
          this.loanDocuments.push({
            loandocumenttypeid: documentTypeId,
            loandocumentname: this.loanLocalDocModel.documentNumber ? this.loanLocalDocModel.documentNumber : '',
            documentfile: {
              fileextension: '.jpg',
              fileName: event.target.files[0].name,
              binarydata: events.target.result
            }
          });
        }
      }
    };
  }

  uploadAddressProof(event: any, documentTypeId: any) {
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (events: any) => {
      if (event.target.files[0].size > 500000) {
        /* checking size here - 500KB */
        this.loanLocalDocModel.addProofVar = null;
        this.commonHelper.warningMessage("Upload image size Below '500KB'");
      } else {
        if (this.loanId && this.userType !== this.constant.AGENT_TYPE_CODE) {
          const data = {
            loandocumentid: "0",
            loandocumentapplicationid: this.loanId,
            loanapplicationnumber: this.loanApplications.loanapplicationnumber ? this.loanApplications.loanapplicationnumber : '',
            loandocumentname: this.loanLocalDocModel.addressDocumentNumber ? this.loanLocalDocModel.addressDocumentNumber : '',
            documentuploadedby: "11",
            loandocumenttypeid: documentTypeId,
            documentFile: {
              fileName: event.target.files[0].name,
              fileextension: ".jpg",
              binarydata: events.target.result
            }
          }
          this.loanService.createLoanDocs(data).subscribe(res => {
            if (!res.errorcode) {
              this.loanLocalDocModel.addDocId = res.loandocument.loandocumentid;
              this.loanLocalDocModel.addProofImageSrc = events.target.result;
              this.addProofImageRemove = false;
            } else {
              this.commonHelper.warningMessage(res.stringresult);
            }
          });
        } else {
          this.loanLocalDocModel.addProofImageSrc = events.target.result;
          this.addProofImageRemove = false;
          this.loanDocuments.push({
            loandocumenttypeid: documentTypeId,
            loandocumentname: this.loanLocalDocModel.addressDocumentNumber ? this.loanLocalDocModel.addressDocumentNumber : '',
            documentfile: {
              fileextension: '.jpg',
              fileName: event.target.files[0].name,
              binarydata: events.target.result
            }
          });
        }
      }
    };
  }

  uploadPAN(event: any) {
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (events: any) => {
      if (event.target.files[0].size > 500000) {
        /* checking size here - 500KB */
        this.loanLocalDocModel.panidProofVar = null;
        this.commonHelper.warningMessage("Upload image size Below '500KB'");
      } else {
        if (this.loanId && this.userType !== this.constant.AGENT_TYPE_CODE) {
          const data = {
            loandocumentid: "0",
            loandocumentapplicationid: this.loanId,
            loanapplicationnumber: this.loanApplications.loanapplicationnumber ? this.loanApplications.loanapplicationnumber : '',
            loandocumentname: '',
            documentuploadedby: "11",
            loandocumenttypeid: 1,
            documentFile: {
              fileName: event.target.files[0].name,
              fileextension: ".jpg",
              binarydata: events.target.result
            }
          }
          this.loanService.createLoanDocs(data).subscribe(res => {
            if (!res.errorcode) {
              this.loanLocalDocModel.panImageSrc = events.target.result;
              this.panImageRemove = false;
            } else {
              this.commonHelper.warningMessage(res.stringresult);
            }
          });
        } else {
          this.loanLocalDocModel.panImageSrc = events.target.result;
          this.panImageRemove = false;
          this.loanDocuments.push({
            loandocumenttypeid: 1,
            documentfile: {
              fileextension: '.jpg',
              fileName: event.target.files[0].name,
              binarydata: events.target.result
            }
          });
        }
      }
    };
  }

  uploadProfile(event: any) {
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (events: any) => {
      this.loanLocalDocModel.profileImageSrc = events.target.result;
      this.profileImageRemove = false;
      this.loanModel.customerprofilephoto = {
        fileName: event.target.files[0].name,
        fileextension: '.jpg',
        binarydata: events.target.result
      };
    };
  }

  idProofRemove(documentTypeId: any, documentId: any) {
    if (this.loanId && documentId) {
      this.loanService.removeLoanDocument({ loanid: this.loanId, loandocid: documentId }).subscribe(res => {
        this.loanDocuments = this.loanDocuments.filter(item => item.loandocumenttypeid !== documentTypeId);
        this.loanLocalDocModel.idProofImageSrc = null;
        this.idProofImageRemove = true;
        this.loanLocalDocModel.idProof = null;
        this.loanLocalDocModel.documentNumber = null;
      });
    } else {
      this.loanDocuments = this.loanDocuments.filter(item => item.loandocumenttypeid !== documentTypeId);
      this.loanLocalDocModel.idProofImageSrc = null;
      this.idProofImageRemove = true;
      this.loanLocalDocModel.idProof = null;
      this.loanLocalDocModel.documentNumber = null;
    }
  }

  addProofRemove(documentTypeId: any, documentId: any) {
    if (this.loanId && documentId) {
      this.loanService.removeLoanDocument({ loanid: this.loanId, loandocid: documentId }).subscribe(res => {
        this.loanDocuments = this.loanDocuments.filter(item => item.loandocumenttypeid !== documentTypeId);
        this.loanLocalDocModel.addProofImageSrc = null;
        this.addProofImageRemove = true;
        this.loanLocalDocModel.addProof = null;
        this.loanLocalDocModel.addressDocumentNumber = null;
      });
    } else {
      this.loanDocuments = this.loanDocuments.filter(item => item.loandocumenttypeid !== documentTypeId);
      this.loanLocalDocModel.addProofImageSrc = null;
      this.addProofImageRemove = true;
      this.loanLocalDocModel.addProof = null;
      this.loanLocalDocModel.addressDocumentNumber = null;
    }
  }

  panRemove(documentId: any) {
    if (this.loanId && documentId) {
      this.loanService.removeLoanDocument({ loanid: this.loanId, loandocid: documentId }).subscribe(res => {
        this.loanDocuments = this.loanDocuments.filter(item => item.loandocumenttypeid !== 1);
        this.panImageRemove = true;
        this.loanModel.ispan = '';
        this.loanLocalDocModel.panImageSrc = null;
        this.loanModel.customeraadharnumber = null;
        this.loanModel.customerpannumber = null;
      });
    } else {
      this.loanDocuments = this.loanDocuments.filter(item => item.loandocumenttypeid !== 1);
      this.panImageRemove = true;
      this.loanModel.ispan = '';
      this.loanLocalDocModel.panImageSrc = null;
      this.loanModel.customeraadharnumber = null;
      this.loanModel.customerpannumber = null;
    }
  }

  profileRemove() {
    this.loanModel.customerprofilephoto = '';
    this.loanLocalDocModel.profileImageSrc = null;
    this.profileImageRemove = true;
  }

  redirectCoapplicant() {
    if (this.loanId && this.userType != this.constant.AGENT_TYPE_CODE || this.statusId == this.constant.REJECTED_BY_VALIDATOR_1) {
      this.updateApplicant('', 'P');
    }
    const data = {
      loanModel: this.loanModel,
      loanLocalDocModel: this.loanLocalDocModel,
      loanApplications: this.loanApplications,
      loanDocModel: this.loanDocuments,
    }
    this.loanService.setLoanApplicant(data);
    if (this.customerId) {
      this.router.navigate(['/co-applicant'], { queryParams: { customerId: this.encryptParams(this.customerId), type: this.encryptParams(this.type) } });
    } else {
      this.router.navigate(['/co-applicant'], { queryParams: { loanId: this.encryptParams(this.loanId), type: this.encryptParams(this.type) } });
    }
  }

  coApplicantEdit(index: any, coApplicantId: any) {
    if (this.loanId) {
      this.updateApplicant('', 'P');
    }
    if (coApplicantId) {
      this.router.navigate(['/co-applicant'], { queryParams: { coApplicantId: this.encryptParams(coApplicantId), type: this.encryptParams(this.type) } });
    } else {
      const param = this.customerId ? { coApplicantId: this.encryptParams(index), customerId: this.encryptParams(this.customerId), type: this.encryptParams(this.type) }
        : { coApplicantId: this.encryptParams(index), loanId: this.encryptParams(this.loanId), type: this.encryptParams(this.type) };
      this.router.navigate(['/co-applicant'], { queryParams: param });
    }
  }

  coApplicantView(coApplicantId: any) {
    this.router.navigate(['/co-applicant'], {
      queryParams:
        { coApplicantId: this.encryptParams(coApplicantId), loanId: this.encryptParams(this.loanId), view: this.encryptParams('VW'), type: this.encryptParams(this.type) }
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

  isCharacter(event: any) {
    if ((event.keyCode > 64 && event.keyCode < 91) || (event.keyCode > 96 && event.keyCode < 123) || event.keyCode == 8 || event.keyCode == 32)
      return true;
    else {
      return false;
    }
  }

  documentTypeChange(event: any) {
    this.loanModel.ispan = event;
    this.loanModel.customerpannumber = '';
    this.loanModel.customeraadharnumber = '';
  }

  encryptParams(params: any) {
    return window.btoa(params);
  }

  decryptParams(params: any) {
    return window.atob(params);
  }

  bindCoApplicant(item: any) {
    return {
      coapplicantid: item.coapplicantid ? item.coapplicantid : 0,
      coapplicantcustomerid: item.coapplicantcustomerid ? item.coapplicantcustomerid : '',
      coapplicantloanapplicationid: item.coapplicantloanapplicationid ? item.coapplicantloanapplicationid : '',
      coapplicantfirstname: item.coapplicantfirstname ? item.coapplicantfirstname : '',
      coapplicantmiddlename: item.coapplicantmiddlename ? item.coapplicantmiddlename : '',
      coapplicantlastname: item.coapplicantlastname ? item.coapplicantlastname : '',
      dateofbirth: item.dateofbirth ? item.dateofbirth : '',
      coapplicantgender: item.coapplicantgender ? item.coapplicantgender : '',
      maritalstatus: item.maritalstatus ? item.maritalstatus : '',
      coapplicantfathername: item.coapplicantfathername ? item.coapplicantfathername : '',
      coapplicantmothername: item.coapplicantmothername ? item.coapplicantmothername : '',
      coapplicantspousename: item.coapplicantspousename ? item.coapplicantspousename : '',
      coapplicantrelationshipid: item.coapplicantrelationshipid ? item.coapplicantrelationshipid : '',
      mobilenumber: item.mobilenumber ? item.mobilenumber : '',
      emailid: item.emailid ? item.emailid : '',
      coapplicanteducationtypeid: item.coapplicanteducationtypeid ? item.coapplicanteducationtypeid : '',
      coapplicantemployeementtypeid: item.coapplicantemployeementtypeid ? item.coapplicantemployeementtypeid : '',
      coapplicantyearsofexperienceid: item.coapplicantyearsofexperienceid ? item.coapplicantyearsofexperienceid : '',
      coapplicantmonthlyincome: item.coapplicantmonthlyincome ? item.coapplicantmonthlyincome : '',
      coapplicantresidencetypeid: item.coapplicantresidencetypeid ? item.coapplicantresidencetypeid : '',
      coapplicantareatypeid: item.coapplicantareatypeid ? item.coapplicantareatypeid : '',
      coapplicantdoornostreet: item.coapplicantdoornostreet ? item.coapplicantdoornostreet : '',
      coapplicantarea: item.coapplicantarea ? item.coapplicantarea : '',
      coapplicantcountryid: item.coapplicantcountryid ? item.coapplicantcountryid : '',
      coapplicantstateid: item.coapplicantstateid ? item.coapplicantstateid : '',
      coapplicantcityid: item.coapplicantcityid ? item.coapplicantcityid : '',
      coapplicantpincode: item.coapplicantpincode ? item.coapplicantpincode : '',
      coapplicantlandmark: item.coapplicantlandmark ? item.coapplicantlandmark : '',
      coapplicantbankaccountnumber: item.coapplicantbankaccountnumber ? item.coapplicantbankaccountnumber : '',
      coapplicantbankid: item.coapplicantbankid ? item.coapplicantbankid : '',
      bankbranchname: item.bankbranchname ? item.bankbranchname : '',
      coapplicantifsccode: item.coapplicantifsccode ? item.coapplicantifsccode : '',
      coapplicantbankaccountname: item.coapplicantbankaccountname ? item.coapplicantbankaccountname : '',
      ispan: item.ispan ? item.ispan : false,
      coapplicantpannumber: item.coapplicantpannumber ? item.coapplicantpannumber : '',
      coapplicantprofilename: item.coapplicantprofilename ? item.coapplicantprofilename : '',
      coapplicantprofilepicture: item.coapplicantprofilepicture ? item.coapplicantprofilepicture : '',
      coapplicantupdatedby: item.coapplicantupdatedby ? item.coapplicantupdatedby : '',
      coapplicantprofilephoto: item.coapplicantprofilephoto ? item.coapplicantprofilephoto : '',
      coapplicantaadharnumber: item.coapplicantaadharnumber ? item.coapplicantaadharnumber : '',
      coapplicantdocuments: item.coapplicantdocuments ? item.coapplicantdocuments : [],
    }
  }

  bindRejectModel() {
    return {
      loanmasterid: this.loanApplications.loanmasterid ? this.loanApplications.loanmasterid : '',
      customerid: this.loanModel.customerdetailcustomerid ? this.loanModel.customerdetailcustomerid : this.loanApplications.customerid,
      customeremployeementid: this.loanApplications.customeremployeementid ? this.loanApplications.customeremployeementid : '',
      employeeposition: this.loanApplications.employeeposition ? this.loanApplications.employeeposition : '',
      companyname: this.loanApplications.companyname ? this.loanApplications.companyname : '',
      totalnetincome: this.loanApplications.totalnetincome ? this.loanApplications.totalnetincome : '',
      agentid: this.loanApplications.agentid ? this.loanApplications.agentid : '',
      applicationremarks: this.loanApplications.applicationremarks ? this.loanApplications.applicationremarks : '',
      loantype: this.loanApplications.loanmasterid ? this.loanMaster.find(i => i.loanid == this.loanApplications.loanmasterid).loantype : '',
      emiamount: this.loanApplications.emiamount ? this.loanApplications.emiamount : 0,
      creditcardamount: this.loanApplications.creditcardamount ? this.loanApplications.creditcardamount : 0,
      loanamount: this.loanApplications.loanamount ? this.loanApplications.loanamount : '',
      tenuremasterid: this.loanApplications.tenuremasterid ? this.loanApplications.tenuremasterid : '',
    }
  }

  bindApproverUpdate() {
    return {
      loanapplicationid: this.loanId,
      loanapplicationnumber: "",
      loanmasterid: "",
      loanapplieddate: "",
      customerid: "",
      customeremployeementid: "",
      companyname: "",
      totalnetincome: "",
      agentid: "",
      validator1id: "",
      validator1processeddate: "",
      validator2id: "",
      validator2processeddate: "",
      approverid: "",
      approverprocesseddate: "",
      loanbankid: this.approverModel.customerbankid,
      ifsccode: this.approverModel.customerifsccode,
      loannumber: "",
      bankaccountname: "",
      bankaccountnumber: "",
      bankapproveddate: "",
      applicationstatusid: "",
      applicationremarks: this.approverModel.remarksCommend,
      loanapplicationcreatedby: "",
      loanapplicationcreatedon: "",
      loanapplicationupdatedby: "",
      loanapplicationupdatedon: "",
      loantype: "",
      emiamount: "",
      creditcardamount: "",
      loanamount: "",
      tenuremasterid: ""
    };
  }

  bindReinstateModel() {
    return {
      customerdetailid: this.loanModel.customerdetailid ? this.loanModel.customerdetailid : '',
      customerdetailcustomerid: this.loanModel.customerdetailcustomerid ? this.loanModel.customerdetailcustomerid : '',
      customergender: this.loanModel.customergender ? this.loanModel.customergender : '',
      customermaritalstatus: this.loanModel.customermaritalstatus ? this.loanModel.customermaritalstatus : '',
      customerfathername: this.loanModel.customerfathername ? this.loanModel.customerfathername : '',
      customermothername: this.loanModel.customermothername ? this.loanModel.customermothername : '',
      customerspousename: this.loanModel.customerspousename ? this.loanModel.customerspousename : '',
      noofdependents: this.loanModel.noofdependents ? this.loanModel.noofdependents : '',
      customerrelationshipid: this.loanModel.customerrelationshipid ? this.loanModel.customerrelationshipid : '',
      customereducationtypeid: this.loanModel.customereducationtypeid ? this.loanModel.customereducationtypeid : '',
      customeremployeementtypeid: this.loanModel.customeremployeementtypeid ? this.loanModel.customeremployeementtypeid : '',
      customeryearsofexperiencetypeid: this.loanModel.customeryearsofexperiencetypeid ? this.loanModel.customeryearsofexperiencetypeid : '',
      customermonthlyincome: this.loanModel.customermonthlyincome ? this.loanModel.customermonthlyincome : '',
      customerresidencetypeid: this.loanModel.customerresidencetypeid ? this.loanModel.customerresidencetypeid : '',
      customerareatypeid: this.loanModel.customerareatypeid ? this.loanModel.customerareatypeid : '',
      customerdoornostreet: this.loanModel.customerdoornostreet ? this.loanModel.customerdoornostreet : '',
      customerarea: this.loanModel.customerarea ? this.loanModel.customerarea : '',
      customercountryid: this.loanModel.customercountryid ? this.loanModel.customercountryid : '',
      customerstateid: this.loanModel.customerstateid ? this.loanModel.customerstateid : '',
      customercityid: this.loanModel.customercityid ? this.loanModel.customercityid : '',
      customerpincode: this.loanModel.customerpincode ? this.loanModel.customerpincode : '',
      customerlandmark: this.loanModel.customerlandmark ? this.loanModel.customerlandmark : '',
      customerdurationstayid: this.loanModel.customerdurationstayid ? this.loanModel.customerdurationstayid : '',
      customerbankaccountnumber: this.loanModel.customerbankaccountnumber ? this.loanModel.customerbankaccountnumber : '',
      customerbankid: this.loanModel.customerbankid ? this.loanModel.customerbankid : '',
      customerbankbranchname: this.loanModel.customerbankbranchname ? this.loanModel.customerbankbranchname : '',
      customerifsccode: this.loanModel.customerifsccode ? this.loanModel.customerifsccode : '',
      customerbankaccountname: this.loanModel.customerbankaccountname ? this.loanModel.customerbankaccountname : '',
      ispan: this.loanModel.ispan ? this.loanModel.ispan : false,
      customerpannumber: this.loanModel.customerpannumber ? this.loanModel.customerpannumber : '',
      customeraadharnumber: this.loanModel.customeraadharnumber ? this.loanModel.customeraadharnumber : '',
      customercreatedby: this.loanModel.customercreatedby ? this.loanModel.customercreatedby : '',
      customerupdatedby: this.loanModel.customerupdatedby ? this.loanModel.customerupdatedby : '',
      customerprofilephoto: this.loanModel.customerprofilephoto ? this.loanModel.customerprofilephoto : {
        fileName: '',
        fileextension: '',
        binarydata: '',
      }
    }
  }
}