import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';

import { CommonHelper } from 'src/app/helper/common.helper';
import { CustomerService } from 'src/app/sevices/customers.service';
import { LoanService } from 'src/app/sevices/loan.service';
import { LocationService } from 'src/app/sevices/location.service';
import { MasterService } from 'src/app/sevices/master.service';
import { UserService } from 'src/app/sevices/user.service';

@Component({
  selector: 'app-co-applicant-create-edit',
  templateUrl: './co-applicant-create-edit.component.html',
  styleUrls: ['./co-applicant-create-edit.component.scss']
})

export class CoApplicantCreateEditComponent implements OnInit {
  @ViewChild("emiModal", { static: false }) emiModal: TemplateRef<any>;
  @ViewChild("coApplicantForm", { static: false }) coApplicantForm: NgForm;
  @ViewChild('imageModal', { static: false }) imageModal: TemplateRef<any>;
  public coApplicantModel: any = {};
  public coApplicantDocModel: any = {};
  public localStorageData: Array<any> = [];
  public coApplicantId: any;
  public preview: string = '';
  public isRemoved: boolean = true;
  public idProofVar = [];
  public panidProofVar = [];
  public addressdocument = [];
  public uploadPhoto = [];
  public masterQueryParams: any = { sortBy: "''", sortValue: 'A' };

  //Masters
  public bankMaster: Array<any> = [];
  public tenureMaster: Array<any> = [];
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
  public maxDate: any;
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
  public coLoanDocuments: Array<any> = [];
  public panImageRemove: boolean = true;
  public idProofImageRemove: boolean = true;
  public addProofImageRemove: boolean = true;
  public profileImageRemove: boolean = true;
  public customerId: any;
  public loanId: any;
  public panChecked: boolean = false;
  public isTrue: boolean = false;
  public view: string;
  public isReadOnly: boolean = false;
  public readOnlyDate: string;
  public type: string;

  constructor(
    private modalService: BsModalService,
    private userService: UserService,
    private customerService: CustomerService,
    private masterService: MasterService,
    private activeRouter: ActivatedRoute,
    private router: Router,
    private locationService: LocationService,
    private commonHelper: CommonHelper,
    private loanService: LoanService,
    private datePipe: DatePipe,
    private spinner: NgxSpinnerService) {
    this.maxDate = new Date();
  }

  async ngOnInit() {
    this.spinner.show();
    await this.getMasters();
    this.customerId = this.activeRouter.snapshot.queryParams.customerId ? this.decryptParams(this.activeRouter.snapshot.queryParams.customerId) : null;
    this.loanId = this.activeRouter.snapshot.queryParams.loanId ? this.decryptParams(this.activeRouter.snapshot.queryParams.loanId) : null;
    this.coApplicantId = this.activeRouter.snapshot.queryParams.coApplicantId ? this.decryptParams(this.activeRouter.snapshot.queryParams.coApplicantId) : null;
    this.view = this.activeRouter.snapshot.queryParams.view ? this.decryptParams(this.activeRouter.snapshot.queryParams.view) : null;
    this.type = this.activeRouter.snapshot.queryParams.type ? this.decryptParams(this.activeRouter.snapshot.queryParams.type) : null;
    if (this.view == 'VW') {
      this.isReadOnly = true;
    }
    if (this.coApplicantId) {
      if (this.coApplicantId > 4) {
        this.loanService.getCoApplicantById({ coapplicantid: this.coApplicantId }).subscribe(async res => {
          this.coApplicantModel = await res.coapplicant ? res.coapplicant : {};
          this.coApplicantDocModel.profileImageSrc = res.profilepicture ? res.profilepicture : '';
          this.profileImageRemove = this.coApplicantDocModel.profileImageSrc ? false : true;
          this.coApplicantModel.ispan = res.ispan ? 'true' : 'false';
          this.coApplicantModel.coapplicantaadharnumber = this.coApplicantModel.ispan == 'true' ? this.coApplicantModel.coapplicantaadharnumber : null;
          this.coApplicantModel.coapplicantpannumber = this.coApplicantModel.ispan == 'false' ? this.coApplicantModel.coapplicantpannumber : null;
          this.coApplicantModel.coapplicantprofilephoto = res.profilepicture ? {
            fileName: res.coapplicant.coapplicantprofilename ? res.coapplicant.coapplicantprofilename : '',
            fileextension: '.jpg',
            binarydata: res.profilepicture ? res.profilepicture : ''
          } : '';
          this.coApplicantModel.dateofbirth = res.coapplicant.dateofbirth ? this.datePipe.transform(res.coapplicant.dateofbirth, 'yyyy-MM-dd') : '';
          this.readOnlyDate = this.datePipe.transform(res.coapplicant.dateofbirth, 'dd-MM-yyyy');
          this.loanId = await res.coapplicant.coapplicantloanapplicationid ? res.coapplicant.coapplicantloanapplicationid : '';
          await this.changeCountry();
          await this.changeState();
          await this.getCoLoanDocs(res.coapplicant.coapplicantcustomerid);
        }, error => {
          console.log(error);
          this.spinner.hide();
        });
      } else {
        await this.getCoApplicantDetails();
        await this.changeCountry();
        await this.changeState();
        this.spinner.hide();
      }
    } else if (this.loanId) {
      this.getCoApplicantDetails();
      this.spinner.hide();
    }
    this.spinner.hide();
  }

  async getMasters() {
    this.userService.GetAllBankList(this.masterQueryParams).subscribe(res => {
      this.bankMaster = res ? res : [];
    });
    this.customerService.getAllTenure(this.masterQueryParams).subscribe(res => {
      this.tenureMaster = res ? res : [];
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
    this.masterService.getAllDocumentType(this.masterQueryParams).subscribe(async res => {
      this.idDocumentsTypes = await res.length > 0 ? res.filter(i => i.documenttypecategory == "ID" ? i : '') : [];
      this.apDocumentsTypes = await res.length > 0 ? res.filter(i => i.documenttypecategory == "AP" ? i : '') : [];
    });
    this.masterService.getAllAreaTypes(this.masterQueryParams).subscribe(res => {
      this.areaTypes = res.length > 0 ? res : [];
    });
    this.locationService.GetAllCountries(this.masterQueryParams).subscribe(res => {
      this.countryList = res.length > 0 ? res : [];
    });
  }

  async changeCountry() {
    if (this.coApplicantModel.coapplicantcountryid) {
      this.locationService.GetAllStates({
        sortBy: "''", sortValue: "A",
        countryId: this.coApplicantModel.coapplicantcountryid
      }).subscribe(async res => {
        this.stateList = await res.length > 0 ? res : [];
      });
    }
  }

  async changeState() {
    if (this.coApplicantModel.coapplicantstateid) {
      this.locationService.GetAllCity({
        sortBy: "''", sortValue: "A",
        countryId: this.coApplicantModel.coapplicantcountryid, stateId: this.coApplicantModel.coapplicantstateid
      }).subscribe(async res => {
        this.cityList = await res.length > 0 ? res : [];
      });
    }
  }

  async getCoLoanDocs(customerId: any) {
    this.loanService.getCoapplicantLoanDocs({
      loanid: this.loanId, customerid: customerId, coapplicantid: this.coApplicantId
    }).subscribe(async coLoanDoc => {
      this.coLoanDocuments = coLoanDoc.data.resultdata.map(i => {
        return {
          coapplicantdocumenttypeid: i.coapplicantdocumenttypeid,
          coapplicantdocumentname: i.coapplicantdocumentname ? i.coapplicantdocumentname : '',
          documentfile: {
            fileextension: '.jpg',
            fileName: i.coapplicantdocumentname,
            binarydata: i.document64string
          }
        }
      });
      await coLoanDoc.data.resultdata.map(item => {
        if (item.coapplicantdocumenttypeid == 1) {
          this.coApplicantDocModel.panDocId = item.coapplicantdocumentid;
          this.coApplicantDocModel.panImageSrc = item.document64string ? item.document64string : '';
          this.panImageRemove = false;
        }
      });
      await this.idDocumentsTypes.find(i => {
        coLoanDoc.data.resultdata.map(item => {
          if (i.documenttypeid == item.coapplicantdocumenttypeid) {
            this.coApplicantDocModel.idDocId = item.coapplicantdocumentid;
            this.coApplicantDocModel.idProof = item.coapplicantdocumenttypeid;
            this.coApplicantDocModel.idProofDocumentNumber = item.coapplicantdocumentname;
            this.coApplicantDocModel.idProofImageSrc = item.document64string ? item.document64string : '';
            this.idProofImageRemove = false;
          }
        });
      });
      await this.apDocumentsTypes.find(i => {
        coLoanDoc.data.resultdata.map(item => {
          if (i.documenttypeid == item.coapplicantdocumenttypeid) {
            this.coApplicantDocModel.addDocId = item.coapplicantdocumentid;
            this.coApplicantDocModel.addProof = item.coapplicantdocumenttypeid;
            this.coApplicantDocModel.addProofDocumentNumber = item.coapplicantdocumentname;
            this.coApplicantDocModel.addProofImageSrc = item.document64string ? item.document64string : '';
            this.addProofImageRemove = false;
          }
        });
      });
      this.spinner.hide();
    }, error => {
      console.log(error);
      this.spinner.hide();
    });
  }

  async getCoApplicantDetails() {
    const result = JSON.parse(localStorage.getItem("Co-applicant")) ? JSON.parse(localStorage.getItem("Co-applicant")) : [];
    if (result.length > 0) {
      this.localStorageData = result.length > 0 ? result : [];
      this.coApplicantModel = result.length > 0 && this.coApplicantId ? result[this.coApplicantId] : {};
      this.coApplicantModel.dateofbirth = this.coApplicantModel.dateofbirth ? this.datePipe.transform(this.coApplicantModel.dateofbirth, 'yyyy-MM-dd') : '';
      this.coApplicantModel.coapplicantpannumber = this.coApplicantModel.ispan == 'false' ? this.coApplicantModel.coapplicantpannumber : null;
      this.coApplicantModel.coapplicantaadharnumber = this.coApplicantModel.ispan == 'true' ? this.coApplicantModel.coapplicantaadharnumber : null;
      this.coLoanDocuments = this.coApplicantModel.coapplicantdocuments ? this.coApplicantModel.coapplicantdocuments : [];
      this.coApplicantModel && this.coApplicantModel.coapplicantdocuments ? this.coApplicantModel.coapplicantdocuments.map(item => {
        if (item.coapplicantdocumenttypeid == 1) {
          this.panImageRemove = false;
          this.coApplicantDocModel.panImageSrc = item.documentfile.binarydata;
        }
      }) : {};
      this.coApplicantDocModel.profileImageSrc = this.coApplicantModel.coapplicantprofilephoto ? this.coApplicantModel.coapplicantprofilephoto.binarydata : '';
      this.profileImageRemove = this.coApplicantDocModel.profileImageSrc ? false : true;
      setTimeout(() => {
        this.idDocumentsTypes.find(i => {
          this.coApplicantModel.coapplicantdocuments ? this.coApplicantModel.coapplicantdocuments.map(item => {
            if (i.documenttypeid == item.coapplicantdocumenttypeid) {
              this.coApplicantDocModel.idProof = item.coapplicantdocumenttypeid;
              this.coApplicantDocModel.idProofDocumentNumber = item.coapplicantdocumentname;
              this.coApplicantDocModel.idProofImageSrc = item.documentfile.binarydata;
              this.idProofImageRemove = false;
            }
          }) : '';
        });
        this.apDocumentsTypes.find(i => {
          this.coApplicantModel.coapplicantdocuments ? this.coApplicantModel.coapplicantdocuments.map(item => {
            if (i.documenttypeid == item.coapplicantdocumenttypeid) {
              this.coApplicantDocModel.addProof = item.coapplicantdocumenttypeid;
              this.coApplicantDocModel.addProofDocumentNumber = item.coapplicantdocumentname;
              this.coApplicantDocModel.addProofImageSrc = item.documentfile.binarydata;
              this.addProofImageRemove = false;
            }
          }) : '';
        });
      }, 1000);
      this.spinner.hide();
    }
  }

  uploadIdProof(event: any, documentTypeId: any, docmentName: any) {
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (events: any) => {
      if (event.target.files[0].size > 500000) {
        /* checking size here - 500KB */
        this.coApplicantDocModel.idProofVar = null;
        this.commonHelper.warningMessage("Upload image size Below '500KB'");
      } else {
        this.coApplicantDocModel.idProofImageSrc = events.target.result;
        this.idProofImageRemove = false;
        const data = {
          coapplicantdocumenttypeid: documentTypeId,
          coapplicantdocumentname: docmentName ? docmentName : '',
          documentfile: {
            fileextension: '.jpg',
            fileName: event.target.files[0].name,
            binarydata: events.target.result
          }
        };
        this.coLoanDocuments.push(data);
      }
    };
  }

  uploadAddressProof(event: any, documentTypeId: any, docmentName: any) {
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (events: any) => {
      if (event.target.files[0].size > 500000) {
        /* checking size here - 500KB */
        this.coApplicantDocModel.addProofVar = null;
        this.commonHelper.warningMessage("Upload image size Below '500KB'");
      } else {
        this.coApplicantDocModel.addProofImageSrc = events.target.result;
        this.addProofImageRemove = false;
        const data = {
          coapplicantdocumenttypeid: documentTypeId,
          coapplicantdocumentname: docmentName ? docmentName : '',
          documentfile: {
            fileextension: '.jpg',
            fileName: event.target.files[0].name,
            binarydata: events.target.result
          }
        };
        this.coLoanDocuments.push(data);
      }
    };
  }

  uploadPAN(event: any) {
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (events: any) => {
      if (event.target.files[0].size > 500000) {
        /* checking size here - 500KB */
        this.coApplicantDocModel.panidProofVar = null;
        this.commonHelper.warningMessage("Upload image size Below '500KB'");
      } else {
        this.coApplicantDocModel.panImageSrc = events.target.result;
        this.panImageRemove = false;
        const data = {
          coapplicantdocumenttypeid: 1,
          coapplicantdocumentname: '',
          documentfile: {
            fileextension: '.jpg',
            fileName: event.target.files[0].name,
            binarydata: events.target.result
          }
        };
        this.coLoanDocuments.push(data);
      }
    };
  }

  uploadProfile(event: any) {
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (events: any) => {
      this.coApplicantDocModel.profileImageSrc = events.target.result;
      this.profileImageRemove = false;
      this.coApplicantModel.coapplicantprofilephoto = {
        fileName: event.target.files[0].name,
        fileextension: '.jpg',
        binarydata: events.target.result
      };
    };
  }

  idProofRemove(documentTypeId: any, documentId: any) {
    if (this.loanId && this.coApplicantId) {
      this.loanService.removeCoapplicantDocument({ coapplicantid: this.coApplicantId, coapplicantdocid: documentId }).subscribe(res => {
        this.coLoanDocuments = this.coLoanDocuments.filter(item => item.coapplicantdocumenttypeid !== documentTypeId);
        this.coApplicantDocModel.idProofImageSrc = null;
        this.idProofImageRemove = true;
        this.coApplicantDocModel.idProof = null;
        this.coApplicantDocModel.idProofDocumentNumber = null;
      });
    } else {
      this.coLoanDocuments = this.coLoanDocuments.filter(item => item.coapplicantdocumenttypeid !== documentTypeId);
      this.coApplicantDocModel.idProofImageSrc = null;
      this.idProofImageRemove = true;
      this.coApplicantDocModel.idProof = null;
      this.coApplicantDocModel.idProofDocumentNumber = null;
    }
  }

  addProofRemove(documentTypeId: any, documentId: any) {
    if (this.loanId && this.coApplicantId) {
      this.loanService.removeCoapplicantDocument({ coapplicantid: this.coApplicantId, coapplicantdocid: documentId }).subscribe(res => {
        this.coLoanDocuments = this.coLoanDocuments.filter(item => item.coapplicantdocumenttypeid !== documentTypeId);
        this.addProofImageRemove = true;
        this.coApplicantDocModel.addProof = null;
        this.coApplicantDocModel.addProofImageSrc = null;
        this.coApplicantDocModel.addProofDocumentNumber = null;
      });
    } else {
      this.coLoanDocuments = this.coLoanDocuments.filter(item => item.coapplicantdocumenttypeid !== documentTypeId);
      this.addProofImageRemove = true;
      this.coApplicantDocModel.addProof = null;
      this.coApplicantDocModel.addProofImageSrc = null;
      this.coApplicantDocModel.addProofDocumentNumber = null;
    }
  }

  panRemove(documentId: any) {
    if (this.loanId && this.coApplicantId) {
      this.loanService.removeCoapplicantDocument({ coapplicantid: this.coApplicantId, coapplicantdocid: documentId }).subscribe(res => {
        this.coLoanDocuments = this.coLoanDocuments.filter(item => item.coapplicantdocumenttypeid !== 1);
        this.panImageRemove = true;
        this.coApplicantModel.ispan = '';
        this.coApplicantDocModel.panImageSrc = null;
        this.coApplicantModel.coapplicantpannumber = null;
        this.coApplicantModel.coapplicantaadharnumber = null;
      });
    } else {
      this.coLoanDocuments = this.coLoanDocuments.filter(item => item.coapplicantdocumenttypeid !== 1);
      this.panImageRemove = true;
      this.coApplicantModel.ispan = '';
      this.coApplicantDocModel.panImageSrc = null;
      this.coApplicantModel.coapplicantpannumber = null;
      this.coApplicantModel.coapplicantaadharnumber = null;
    }
  }

  profileRemove() {
    this.coApplicantModel.coapplicantprofilephoto = '';
    this.coApplicantDocModel.profileImageSrc = null;
    this.profileImageRemove = true;
  }

  setDate(event: string) {
    this.coApplicantModel.dateofbirth = this.datePipe.transform(event, 'yyyy-MM-dd');
  }

  createCoApplicant() {
    if (this.coApplicantId > 4 && this.loanId) {
      this.createDBCoApplicant();
    } else {
      this.createLoacalStorageCoApplicant();
    }
  }

  createLoacalStorageCoApplicant() {
    this.coApplicantForm.form.markAllAsTouched();
    if (!this.coApplicantForm.form.valid) {
      this.commonHelper.errorMessage('Fill all mandatory Fields');
      return;
    }
    this.coApplicantModel.coapplicantdocuments = this.coLoanDocuments;
    this.coApplicantModel = this.coApplicantModelBind();
    this.localStorageData = JSON.parse(localStorage.getItem("Co-applicant")) ? JSON.parse(localStorage.getItem("Co-applicant")) : [];
    if (this.coApplicantId) {
      this.localStorageData.splice(this.coApplicantId, 1);
      if (this.localStorageData.length <= 4) {
        this.localStorageData.push(this.coApplicantModel);
        localStorage.setItem("Co-applicant", JSON.stringify(this.localStorageData));
      }
    } else {
      if (this.localStorageData.length <= 4) {
        this.localStorageData.push(this.coApplicantModel);
        localStorage.setItem("Co-applicant", JSON.stringify(this.localStorageData));
      }
    }
    if (this.customerId && this.coApplicantId < 4) {
      this.router.navigate(['./loan-create-edit'], { queryParams: { customerId: this.encryptParams(this.customerId), type: this.encryptParams(this.type) } });
    } else if (this.customerId) {
      this.router.navigate(['./loan-create-edit'], { queryParams: { customerId: this.encryptParams(this.customerId), type: this.encryptParams(this.type) } });
    } else {
      this.router.navigate(['./loan-create-edit'], { queryParams: { loanId: this.encryptParams(this.loanId), type: this.encryptParams(this.type) } });
    }
  }

  createDBCoApplicant() {
    this.coApplicantForm.form.markAllAsTouched();
    if (!this.coApplicantForm.form.valid) {
      this.commonHelper.errorMessage('Fill all mandatory Fields');
      return;
    }
    this.spinner.show();
    this.coApplicantModel = this.coApplicantModelBind();
    this.coApplicantModel.coapplicantdocuments = this.coLoanDocuments;
    this.coApplicantModel.coapplicantprofilepicture = '';
    this.loanService.createCoapplicant(this.coApplicantModel).subscribe(res => {
      if (!res.errorcode) {
        this.spinner.hide();
        this.router.navigate(['./loan-create-edit'], { queryParams: { loanId: this.encryptParams(this.loanId), type: this.encryptParams(this.type) } });
      } else {
        this.commonHelper.warningMessage(res.stringresult);
        this.spinner.hide();
      }
    }, error => {
      console.log(error);
      this.spinner.hide();
    });
  }

  back() {
    if (this.customerId && this.coApplicantId < 4) {
      const params = this.customerId ? { customerId: this.encryptParams(this.customerId), type: this.encryptParams(this.type) }
        : { loanId: this.encryptParams(this.loanId), type: this.encryptParams(this.type) }

      this.router.navigate(['./loan-create-edit'], { queryParams: params });
    } else if (this.customerId) {
      this.router.navigate(['./loan-create-edit'], { queryParams: { customerId: this.encryptParams(this.customerId), type: this.encryptParams(this.type) } });
    } else {
      const params = this.isReadOnly ? { loanId: this.encryptParams(this.loanId), view: this.encryptParams(this.view), type: this.encryptParams(this.type) }
        : { loanId: this.encryptParams(this.loanId), type: this.encryptParams(this.type) }

      this.router.navigate(['./loan-create-edit'], { queryParams: params });
    }
  }

  // Pop-Model
  openImageModal(img: any) {
    const config = {
      keyboard: true,
      ignoreBackdropClick: true,
      class: 'modal-xl modal-dialog-centered'
    };
    this.preview = img;
    this.modalService.show(this.imageModal, config);
  }

  openEMIModal() {
    const config = {
      keyboard: false,
      ignoreBackdropClick: false,
      class: 'modal-xl modal-dialog-centered'
    };
    this.modalService.show(this.emiModal, config);
  }

  closeModel() {
    this.modalService.hide();
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
    this.coApplicantModel.ispan = event;
    this.coApplicantModel.coapplicantpannumber = '';
    this.coApplicantModel.coapplicantaadharnumber = '';
  }

  encryptParams(params: any) {
    return window.btoa(params);
  }

  decryptParams(params: any) {
    return window.atob(params);
  }

  coApplicantModelBind() {
    return {
      coapplicantid: this.coApplicantId > 4 ? this.coApplicantId : 0,
      coapplicantcustomerid: this.coApplicantModel.coapplicantcustomerid ? this.coApplicantModel.coapplicantcustomerid : this.customerId,
      coapplicantloanapplicationid: this.coApplicantModel.coapplicantloanapplicationid ? this.coApplicantModel.coapplicantloanapplicationid : '',
      coapplicantfirstname: this.coApplicantModel.coapplicantfirstname ? this.coApplicantModel.coapplicantfirstname : '',
      coapplicantmiddlename: this.coApplicantModel.coapplicantmiddlename ? this.coApplicantModel.coapplicantmiddlename : '',
      coapplicantlastname: this.coApplicantModel.coapplicantlastname ? this.coApplicantModel.coapplicantlastname : '',
      dateofbirth: this.coApplicantModel.dateofbirth ? this.coApplicantModel.dateofbirth : '',
      coapplicantgender: this.coApplicantModel.coapplicantgender ? this.coApplicantModel.coapplicantgender : '',
      maritalstatus: this.coApplicantModel.maritalstatus ? this.coApplicantModel.maritalstatus : '',
      coapplicantfathername: this.coApplicantModel.coapplicantfathername ? this.coApplicantModel.coapplicantfathername : '',
      coapplicantmothername: this.coApplicantModel.coapplicantmothername ? this.coApplicantModel.coapplicantmothername : '',
      coapplicantspousename: this.coApplicantModel.coapplicantspousename ? this.coApplicantModel.coapplicantspousename : this.coApplicantModel.coapplicantfathername,
      coapplicantrelationshipid: this.coApplicantModel.coapplicantrelationshipid ? this.coApplicantModel.coapplicantrelationshipid : '',
      mobilenumber: this.coApplicantModel.mobilenumber ? this.coApplicantModel.mobilenumber : '',
      emailid: this.coApplicantModel.emailid ? this.coApplicantModel.emailid : '',
      coapplicanteducationtypeid: this.coApplicantModel.coapplicanteducationtypeid ? this.coApplicantModel.coapplicanteducationtypeid : '',
      coapplicantemployeementtypeid: this.coApplicantModel.coapplicantemployeementtypeid ? this.coApplicantModel.coapplicantemployeementtypeid : '',
      coapplicantyearsofexperienceid: this.coApplicantModel.coapplicantyearsofexperienceid ? this.coApplicantModel.coapplicantyearsofexperienceid : '',
      coapplicantmonthlyincome: this.coApplicantModel.coapplicantmonthlyincome ? this.coApplicantModel.coapplicantmonthlyincome : '',
      coapplicantresidencetypeid: this.coApplicantModel.coapplicantresidencetypeid ? this.coApplicantModel.coapplicantresidencetypeid : '',
      coapplicantareatypeid: this.coApplicantModel.coapplicantareatypeid ? this.coApplicantModel.coapplicantareatypeid : '',
      coapplicantdoornostreet: this.coApplicantModel.coapplicantdoornostreet ? this.coApplicantModel.coapplicantdoornostreet : '',
      coapplicantarea: this.coApplicantModel.coapplicantarea ? this.coApplicantModel.coapplicantarea : '',
      coapplicantcountryid: this.coApplicantModel.coapplicantcountryid ? this.coApplicantModel.coapplicantcountryid : '',
      coapplicantstateid: this.coApplicantModel.coapplicantstateid ? this.coApplicantModel.coapplicantstateid : '',
      coapplicantcityid: this.coApplicantModel.coapplicantcityid ? this.coApplicantModel.coapplicantcityid : '',
      coapplicantpincode: this.coApplicantModel.coapplicantpincode ? this.coApplicantModel.coapplicantpincode : '',
      coapplicantlandmark: this.coApplicantModel.coapplicantlandmark ? this.coApplicantModel.coapplicantlandmark : '',
      coapplicantbankaccountnumber: this.coApplicantModel.coapplicantbankaccountnumber ? this.coApplicantModel.coapplicantbankaccountnumber : '',
      coapplicantbankid: this.coApplicantModel.coapplicantbankid ? this.coApplicantModel.coapplicantbankid : '',
      bankbranchname: this.coApplicantModel.bankbranchname ? this.coApplicantModel.bankbranchname : '',
      coapplicantifsccode: this.coApplicantModel.coapplicantifsccode ? this.coApplicantModel.coapplicantifsccode : '',
      coapplicantbankaccountname: this.coApplicantModel.coapplicantbankaccountname ? this.coApplicantModel.coapplicantbankaccountname : '',
      ispan: this.coApplicantModel.ispan ? this.coApplicantModel.ispan : false,
      coapplicantpannumber: this.coApplicantModel.coapplicantpannumber ? this.coApplicantModel.coapplicantpannumber : '',
      coapplicantprofilename: this.coApplicantModel.coapplicantprofilename ? this.coApplicantModel.coapplicantprofilename : '',
      coapplicantprofilepicture: this.coApplicantModel.coapplicantprofilepicture ? this.coApplicantModel.coapplicantprofilepicture : '',
      coapplicantupdatedby: 1,
      coapplicantaadharnumber: this.coApplicantModel.coapplicantaadharnumber ? this.coApplicantModel.coapplicantaadharnumber : '',
      coapplicantprofilephoto: this.coApplicantModel.coapplicantprofilephoto ? this.coApplicantModel.coapplicantprofilephoto : '',
      coapplicantdocuments: this.coApplicantModel.coapplicantdocuments ? this.coApplicantModel.coapplicantdocuments : '',
    }
  }
}
