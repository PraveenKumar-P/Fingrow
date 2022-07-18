import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';
import { NgbDatepicker, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { BsModalService } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';

import { CommonHelper } from 'src/app/helper/common.helper';
import { LocationService } from 'src/app/sevices/location.service';
import { UserService } from 'src/app/sevices/user.service';
import { RoleService } from 'src/app/sevices/role.service';
import { Constants } from 'src/app/helper/constants';

@Component({
  selector: 'app-user-create-edit',
  templateUrl: './user-create-edit.component.html',
  styleUrls: ['./user-create-edit.component.scss']
})

export class UserCreateEdiComponent implements OnInit {
  @ViewChild('imageModal', { static: false }) imageModal: TemplateRef<any>;
  @ViewChild('personalForm', { static: false }) personalForm: any;
  @ViewChild('uploadForm', { static: false }) uploadForm: any;
  @ViewChild('bankForm', { static: false }) bankForm: any;
  @ViewChild("dateOfBirth") dateOfBirth: NgbDatepicker;

  public active = 1;
  public userRegisterModel: any = {};
  public userImageModel: any = {};
  public defaultImage = 'assets/images/no-user.jpg';
  public profImage = '';
  // Address 1
  public countries: Array<any> = [];
  public states: Array<any> = [];
  public cities: Array<any> = [];
  // Address 2
  public officeCountries: Array<any> = [];
  public officeStates: Array<any> = [];
  public officeCities: Array<any> = [];

  public masterRoles: Array<any> = [];
  public masterUserTypes: Array<any> = [];
  public userDocuments: Array<any> = [];
  public bankMaster: Array<any> = [];
  public userId: any;
  public isProfileUpdated = false;
  public userCode: any;
  public userOTP: any;
  public responseMessage: any;
  public previousbtn: string = "Back";
  public isCreate: boolean = true;
  public constants = Constants;
  public maxDate: any;
  public showAge: any;
  public isEqual: boolean = false;
  public isDateCreate: boolean = false;
  public isDocument: boolean = true;
  public isPan: boolean = true;
  public isUsertype: boolean = true;
  public isPanView: boolean = false;
  public genderMaster: any = [
    { id: 'Male', value: 'Male' },
    { id: 'Female', value: 'Female' },
    { id: 'Others', value: 'Others' }
  ];
  public panImageRemove: boolean = true;
  public idImageRemove: boolean = true;
  public addressImageRemove: boolean = true;
  public canImageRemove: boolean = true;
  public preview: string;
  public userEditDocuments: Array<any> = [];
  public userLocalModel: any = {};

  constructor(
    private locationAPI: LocationService,
    private userAPI: UserService,
    private roleService: RoleService,
    private activeRouter: ActivatedRoute,
    private commonHelper: CommonHelper,
    private router: Router,
    private spinner: NgxSpinnerService,
    private configs: NgbDatepickerConfig,
    private modalService: BsModalService) {
    this.configs.minDate = {
      year: 1900,
      month: 1,
      day: 1,
    };
    this.configs.maxDate = { year: 2099, month: 12, day: 31 };
    this.configs.outsideDays = "visible";
    const current = new Date();
    this.maxDate = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate()
    }
  }

  ngOnInit(): void {
    let userId = this.activeRouter.snapshot.queryParams.userId ? window.atob(this.activeRouter.snapshot.queryParams.userId) : null;
    this.getMasters();
    if (userId !== null) {
      this.getEditDetails(userId);
    }
  }

  getEditDetails(userId: any) {
    this.spinner.show();
    this.userAPI.GetUserDetail({ userId: userId }).subscribe((res) => {
      if ('users' in res && Object.keys(res.users).length !== 0) {
        this.userId = res.users.userid;
        this.userRegisterModel.countryid = res.users.usercountryid;
        this.userRegisterModel.officecountryid = res.users.userofficecountryid
        this.loadState(res.users.usercountryid);
        this.loadCity(res.users.userstateid);
        this.loadState(res.users.usercountryid, true);
        this.loadCity(res.users.userstateid, true);
        this.profImage = (res.profilepicture) ? res.profilepicture : '';
        this.isCreate = false;
        this.userRegisterModel = res.users;
        this.userRegisterModel.email = res.users.emailid;
        this.userRegisterModel.countryid = res.users.usercountryid;
        this.userRegisterModel.stateid = res.users.userstateid;
        this.userRegisterModel.cityid = res.users.usercityid;
        this.userRegisterModel.officecountryid = res.users.userofficecountryid;
        this.userRegisterModel.officestateid = res.users.userofficestateid;
        this.userRegisterModel.officecityid = res.users.userofficecityid;
        this.userRegisterModel.bankid = res.users.userbankid;
        this.userRegisterModel.accountname = res.users.bankaccountname;
        this.userRegisterModel.accountnumber = res.users.bankaccountnumber;
        this.userRegisterModel.reaccountnumber = res.users.bankaccountnumber;
        this.userRegisterModel.roleid = res.users.userroleid;
        this.userRegisterModel = res.users;
        this.userRegisterModel.dateofbirth = (res.users.dateofbirth) ? {
          "year": new Date(res.users.dateofbirth).getFullYear(),
          "month": +new Date(res.users.dateofbirth).getMonth() + 1,
          "day": new Date(res.users.dateofbirth).getDate()
        } : null;
        this.userRegisterModel.dateofregistration = (res.users.dateofregister) ? {
          "year": new Date(res.users.dateofregister).getFullYear(),
          "month": +new Date(res.users.dateofregister).getMonth() + 1,
          "day": new Date(res.users.dateofregister).getDate()
        } : null;
        this.userRegisterModel.dateofjoin = (res.users.dateofjoin) ? {
          "year": new Date(res.users.dateofjoin).getFullYear(),
          "month": +new Date(res.users.dateofjoin).getMonth() + 1,
          "day": new Date(res.users.dateofjoin).getDate()
        } : null;
        this.userRegisterModel.countrycode = this.countries.length > 0 ? this.countries[0].countryid : '';
        if (this.userRegisterModel.officeaddress == this.userRegisterModel.address && this.userRegisterModel.officestreet == this.userRegisterModel.street &&
          this.userRegisterModel.officestateid == this.userRegisterModel.stateid && this.userRegisterModel.officecountryid == this.userRegisterModel.countryid &&
          this.userRegisterModel.officecityid == this.userRegisterModel.cityid) {
          this.isEqual = true;
        }
        this.isDateCreate = true;
        this.isDocument = false;
        this.isPan = false;
        this.isUsertype = false;
        this.isPanView = true;
        this.userAPI.GetUserDocs({ userId: this.userId }).subscribe(res => {
          this.userEditDocuments = res ? res.userdocumentation : [];
          let baseUrl = 'data:image/png;base64,';
          this.userImageModel.panImageSrc = (res.pannumber) ? baseUrl + res.pannumber : null;
          this.userImageModel.idImageSrc = (res.identityproof) ? baseUrl + res.identityproof : null;
          this.userImageModel.addressImageSrc = (res.addressproof) ? baseUrl + res.addressproof : null;
          this.userImageModel.canImageSrc = (res.cancellationcheck) ? baseUrl + res.cancellationcheck : null;
          this.userLocalModel.panImage = this.userImageModel.panImageSrc ? this.userImageModel.panImageSrc : null;
          this.userLocalModel.idImage = this.userImageModel.idImageSrc ? this.userImageModel.idImageSrc : null
          this.userLocalModel.addressImage = this.userImageModel.addressImageSrc ? this.userImageModel.addressImageSrc : null;
          this.userLocalModel.canImage = this.userImageModel.canImageSrc ? this.userImageModel.canImageSrc : null;
          if (res.userdocumentation.length > 0) {
            this.userImageModel.panImageId = res.userdocumentation.find(i => i.userdocumentationtypeid == 1) ? res.userdocumentation.find(i => i.userdocumentationtypeid == 1).userdocumentationid : '';
            this.userImageModel.idImageId = res.userdocumentation.find(i => i.userdocumentationtypeid == 2) ? res.userdocumentation.find(i => i.userdocumentationtypeid == 2).userdocumentationid : '';
            this.userImageModel.addressImageId = res.userdocumentation.find(i => i.userdocumentationtypeid == 3) ? res.userdocumentation.find(i => i.userdocumentationtypeid == 3).userdocumentationid : '';
            this.userImageModel.canImageId = res.userdocumentation.find(i => i.userdocumentationtypeid == 4) ? res.userdocumentation.find(i => i.userdocumentationtypeid == 4).userdocumentationid : '';
          }
          this.panImageRemove = this.userImageModel.panImageSrc ? false : true;
          this.idImageRemove = this.userImageModel.idImageSrc ? false : true;
          this.addressImageRemove = this.userImageModel.addressImageSrc ? false : true;
          this.canImageRemove = this.userImageModel.canImageSrc ? false : true;
          this.spinner.hide();
        }, (error) => {
          console.log(error);
          this.spinner.hide();
        });
      }
    }, (error) => {
      console.log(error);
      this.spinner.hide();
    });
  }

  getMasters() {
    this.userAPI.GetAllBankList({ sortBy: 'name', sortValue: 'A' }).subscribe((res) => {
      this.bankMaster = res;
    });
    this.locationAPI.GetAllCountries({ sortBy: 'name', sortValue: 'A' }).subscribe((res) => {
      this.countries = res;
      this.officeCountries = res;
      this.userRegisterModel.countrycode = this.countries.length > 0 ? this.countries[0].countryid : '';
    });
    this.userAPI.GetAllUserTypes({ sortBy: 'name', sortValue: 'A' }).subscribe((res) => {
      this.masterUserTypes = res;
    });
    this.roleService.getAllRoles({ sortBy: 'name', sortValue: 'A', roleid: this.constants.ACTIVE_ROLES, }).subscribe((res) => {
      this.masterRoles = res;
    });
  }

  changeCountry(countryId: any, isOffice = false) {
    if (isOffice) {
      this.loadState(countryId, true);
    }
    else {
      this.loadState(countryId);
    }
  }

  changeState(stateId: any, isOffice = false) {
    if (isOffice) {
      this.loadCity(stateId, true);
    }
    else {
      this.loadCity(stateId);
    }
  }

  loadState(countryId: any, isOffice = false) {
    this.locationAPI.GetAllStates({ sortBy: 'name', sortValue: 'A', countryId: countryId }).subscribe((res) => {
      if (isOffice) {
        this.officeStates = [];
        this.officeStates = res;
        // this.userRegisterModel['officestateid'] = this.userId ? this.userRegisterModel['officestateid'] : null;
      }
      else {
        this.states = [];
        this.states = res;
        this.userRegisterModel.stateid = this.userId ? this.userRegisterModel.stateid : null;
      }
    });
  }

  loadCity(stateId: any, isOffice = false) {
    this.locationAPI.GetAllCity({
      sortBy: 'name', sortValue: 'A',
      countryId: this.userRegisterModel.countryid ? this.userRegisterModel.countryid : this.userRegisterModel.officecountryid,
      stateId: stateId
    }).subscribe((res) => {
      if (isOffice) {
        this.officeCities = [];
        this.officeCities = res;
      }
      else {
        this.cities = [];
        this.cities = res;
        this.userRegisterModel.cityid = this.userId ? this.userRegisterModel.cityid : null;
      }
    });
  }

  uploadPAN(event: any) {
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (events: any) => {
      if (event.target.files[0].size > 500000) {
        /* checking size here - 500KB */
        this.userImageModel.panImageSrc = null;
        this.commonHelper.warningMessage("Upload image size Below '500KB'");
      } else {
        this.userImageModel.panImageSrc = events.target.result;
        this.userLocalModel.panImage = events.target.result;
        if (!this.userId) {
          this.userDocuments.push({
            documentId: 1,
            userId: this.userId ? this.userId : '',
            documentFile: {
              fileextension: '.jpg',
              fileName: event.target.files[0].name,
              binarydata: events.target.result
            }
          });
        } else {
          this.editDocUpload(1, 'PAN', events.target.result);
        }
        this.panImageRemove = false;
      }
    };
  }

  uploadIdProof(event: any) {
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (events: any) => {
      if (event.target.files[0].size > 500000) {
        /* checking size here - 500KB */
        this.userImageModel.idImageSrc = null;
        this.commonHelper.warningMessage("Upload image size Below '500KB'");
      } else {
        this.userImageModel.idImageSrc = events.target.result;
        this.userLocalModel.idImage = events.target.result;
        if (!this.userId) {
          this.userDocuments.push({
            documentId: 2,
            userId: this.userId ? this.userId : '',
            documentFile: {
              fileextension: '.jpg',
              fileName: event.target.files[0].name,
              binarydata: events.target.result
            }
          });
        } else {
          this.editDocUpload(2, 'Id', events.target.result);
        }
        this.idImageRemove = false;
      }
    };
  }

  uploadAddressProof(event: any) {
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (events: any) => {
      if (event.target.files[0].size > 500000) {
        /* checking size here - 500KB */
        this.userImageModel.addressImageSrc = null;
        this.commonHelper.warningMessage("Upload image size Below '500KB'");
      } else {
        this.userImageModel.addressImageSrc = events.target.result;
        this.userLocalModel.addressImage = events.target.result;
        if (!this.userId) {
          this.userDocuments.push({
            documentId: 3,
            userId: this.userId ? this.userId : '',
            documentFile: {
              fileextension: '.jpg',
              fileName: event.target.files[0].name,
              binarydata: events.target.result
            }
          });
        } else {
          this.editDocUpload(3, 'Address', events.target.result);
        }
        this.addressImageRemove = false;
      }
    };
  }

  uploadcancellationProof(event: any) {
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (events: any) => {
      if (event.target.files[0].size > 500000) {
        /* checking size here - 500KB */
        this.userImageModel.canImageSrc = null;
        this.commonHelper.warningMessage("Upload image size Below '500KB'");
      } else {
        this.userImageModel.canImageSrc = events.target.result;
        this.userLocalModel.canImage = events.target.result;
        if (!this.userId) {
          this.userDocuments.push({
            documentId: 4,
            userId: this.userId ? this.userId : '',
            documentFile: {
              fileextension: '.jpg',
              fileName: event.target.files[0].name,
              binarydata: events.target.result
            }
          });
        } else {
          this.editDocUpload(4, 'Cancel', events.target.result);
        }
        this.canImageRemove = false;
      }
    };
  }

  editDocUpload(documentId: any, documentName: any, binaryData: any) {
    const data = {
      userId: this.userId,
      documentId: documentId,
      documentPath: "",
      createdBy: "1",
      updatedBy: "1",
      documentName: documentName,
      documentFile: {
        fileName: documentName,
        fileextension: ".jpg",
        binarydata: binaryData
      }
    }
    this.userAPI.UserDocCreation(data).subscribe(res => {
      if (!res.errorcode) {
        this.userImageModel.panImageId = res.userdocumentation.documentname == "PAN" ? res.userdocumentation.userdocumentationid : this.userImageModel.panImageId;
        this.userImageModel.idImageId = res.userdocumentation.documentname == "Id" ? res.userdocumentation.userdocumentationid : this.userImageModel.idImageId;
        this.userImageModel.addressImageId = res.userdocumentation.documentname == "Address" ? res.userdocumentation.userdocumentationid : this.userImageModel.addressImageId;
        this.userImageModel.canImageId = res.userdocumentation.documentname == "Cancel" ? res.userdocumentation.userdocumentationid : this.userImageModel.canImageId;
      }
    });
  }

  panRemove() {
    this.userImageModel.panImageSrc = null;
    this.userLocalModel.panImage = null;
    this.panImageRemove = true;
  }

  idRemove() {
    this.userImageModel.idImageSrc = null;
    this.userLocalModel.idImage = null;
    this.idImageRemove = true;
  }

  addressRemove() {
    this.userImageModel.addressImageSrc = null;
    this.userLocalModel.addressImage = null;
    this.addressImageRemove = true;
  }

  canRemove() {
    this.userImageModel.canImageSrc = null;
    this.userLocalModel.canImage = null;
    this.canImageRemove = true;
  }

  openImageModal(img: any) {
    const config = {
      keyboard: true,
      ignoreBackdropClick: true,
      class: 'modal-xl modal-dialog-centered',
    };

    this.preview = img;
    this.modalService.show(this.imageModal, config);
  }

  closeModel() {
    this.modalService.hide();
  }

  profileChangeListener(event: any, profile: any): void {
    this.isProfileUpdated = true;
    let fileNameExtension = profile.value.split('.').pop();
    this.readThisProfile(event.target, fileNameExtension);
  }

  readThisProfile(inputValue: any, fileNameExtension: any): void {
    let file: File = inputValue.files[0];
    let myReader: FileReader = new FileReader();
    myReader.onloadend = (e) => {
      let image = myReader.result.toString();
      if (image.indexOf("image/")) {
        this.profImage = image;
        let random = Math.random().toString(36).substr(2, 5);
        this.userRegisterModel.profilepicture = {
          binarydata: image,
          fileextension: '.' + fileNameExtension, // '.'+image.substring(image.indexOf("image/")+6, image.indexOf(";")),
          filename: random
        }
      }
    }
    myReader.readAsDataURL(file);
  }

  next() {
    // this.active = this.active < 3 ? this.active + 1 : null; 
    this.personalForm.form.markAllAsTouched();
    if (this.active == 2) {
      this.bankForm.form.markAllAsTouched();
      if (!this.bankForm.valid) {
        this.commonHelper.errorMessage('Fill all mandatory Fields');
        return;
      } else {
        this.active = this.active < 3 ? this.active + 1 : null;
      }
    } else {
      if (!this.personalForm.form.valid) {
        this.commonHelper.errorMessage('Fill all mandatory Fields');
        return;
      }
      if (this.personalForm.valid && this.active == 1) {
        if (this.userRegisterModel.cityid == "0" || this.userRegisterModel.cityid == '') {
          this.commonHelper.errorMessage('Please Select City');
          return;
        }
        if (this.userRegisterModel.officecityid == "0" || this.userRegisterModel.officecityid == '') {
          this.commonHelper.errorMessage('Please Select Office City');
          return;
        }
        this.active = this.active < 3 ? this.active + 1 : null;
        this.previousbtn = "Previous";
      }
    }
  }

  createISODate(date: any) {
    return new Date(date.year + '-' + date.month + '-' + date.day).toISOString()
  }

  previous() {
    if (this.active == 1) {
      this.router.navigate(['/user-list']);
    }
    this.previousbtn = this.active == 2 ? "Back" : "Previous";
    this.active = this.active > 1 ? this.active - 1 : null;
  }

  submit() {
    this.personalForm.form.markAllAsTouched();
    this.uploadForm.form.markAllAsTouched();
    if (!this.personalForm.valid || !this.uploadForm.valid || this.userRegisterModel == "") {
      return false;
    }
    this.spinner.show();
    let viewFormatDateOfBirth = this.userRegisterModel.dateofbirth;
    if (this.userRegisterModel.dateofbirth && 'year' && typeof this.userRegisterModel.dateofbirth === 'object') {
      this.userRegisterModel.dateofbirth = this.createISODate(this.userRegisterModel.dateofbirth)
    }
    let viewFormatDateOfRegistration = this.userRegisterModel.dateofregistration;
    if (this.userRegisterModel.dateofregistration && typeof this.userRegisterModel.dateofregistration === 'object') {
      this.userRegisterModel.dateofregistration = this.createISODate(this.userRegisterModel.dateofregistration)
    }
    let viewFormatDateOfJoin = this.userRegisterModel.dateofjoin;
    if (this.userRegisterModel.dateofjoin && typeof this.userRegisterModel.dateofjoin === 'object') {
      this.userRegisterModel.dateofjoin = this.createISODate(this.userRegisterModel.dateofjoin)
    }
    this.userRegisterModel.sameaddress = (this.userRegisterModel.sameaddress) ? 1 : 0;
    this.userRegisterModel.activationtype = 'D';
    this.userRegisterModel.usercode = '';
    this.userRegisterModel.createdby = 1;
    if (!this.userId) {
      this.spinner.show();
      this.userRegisterModel.userstatus = true;
      this.userAPI.userCreation(this.userRegisterModel).subscribe((res) => {
        // Bringing back date view formats
        this.userRegisterModel.dateofbirth = viewFormatDateOfBirth;
        this.userRegisterModel.dateofregistration = viewFormatDateOfRegistration;
        this.userRegisterModel.dateofjoin = viewFormatDateOfJoin;
        if (!res.errorcode) {
          // Assigning user id
          this.userId = res.users.userid;
          this.userCode = res.users.usercode;
          this.userOTP = res.users.userotp;
          localStorage.setItem("userCode", this.userCode);
          localStorage.setItem("userOTP", this.userOTP);
          this.responseMessage = res.stringresult;
          this.userDocsUpload();
          this.userDocuments = this.userDocuments.map(item => {
            item.userId = this.userId
            return item;
          });
          for (let i = 0; i < this.userDocuments.length; i++) {
            this.userAPI.UserDocCreation(this.userDocuments[i]).subscribe(res => {
            });
          }
          this.spinner.hide();
        }
        else {
          this.commonHelper.errorMessage(res.stringresult);
          this.spinner.hide();
        }
      });
    }
    else {
      this.spinner.show();
      this.userRegisterModel.userid = this.userId;
      this.userAPI.UserUpdate(this.userRegisterModel).subscribe((res) => {
        // Bringing back date view formats
        this.userRegisterModel.dateofbirth = viewFormatDateOfBirth;
        this.userRegisterModel.dateofregistration = viewFormatDateOfRegistration;
        this.userRegisterModel.dateofjoin = viewFormatDateOfJoin;
        this.responseMessage = res.stringresult;
        this.userOTP = res.users.userotp;
        localStorage.setItem("userOTP", this.userOTP);
        if (!res.errorcode) {
          if (this.isProfileUpdated) {
            this.userAPI.UserUpdateProfile({
              userId: this.userId, updatedBy: 1, profileName: this.userRegisterModel.userprofilename,
              actionType: "S", profileFile: this.userRegisterModel.profilepicture
            }).subscribe((res) => {
              if (!res.errorcode) {
                this.isProfileUpdated = false
              }
            });
          }
        }
        this.successMessage();
        this.spinner.hide();
      });
      this.spinner.hide();
    }
  }

  userDocsUpload() {
    this.userDocuments = this.userDocuments.map(item => {
      item.userId = this.userId;
      return item;
    });
    this.userDocuments = this.userDocuments.filter(i => i.documentId);
    if (this.userDocuments.length > 0) {
      for (let i = 0; i < this.userDocuments.length; i++) {
        this.userAPI.UserDocCreation(this.userDocuments[i]).subscribe(res => { });
        this.successMessage();
        this.spinner.hide();
      }
    }
    else {
      this.successMessage();
      this.spinner.hide();
    }
    this.spinner.hide();
  }

  enableSameAddress(e) {
    this.userRegisterModel.sameaddress = (e) ? e.target.checked : this.userRegisterModel.sameaddress;
    if (this.userRegisterModel.sameaddress) {
      this.loadState(this.userRegisterModel.countryid, true);
      this.loadCity(this.userRegisterModel.stateid, true);
      this.userRegisterModel.officecountryid = this.userRegisterModel.countryid;
      this.userRegisterModel.officestateid = this.userRegisterModel.stateid;
      this.userRegisterModel.officecityid = this.userRegisterModel.cityid;
      this.userRegisterModel.officestreet = this.userRegisterModel.street;
      this.userRegisterModel.officeaddress = this.userRegisterModel.address;
    }
    else {
      this.officeStates = [];
      this.officeCities = [];
      this.userRegisterModel.officecountryid = '';
      this.userRegisterModel.officestateid = '';
      this.userRegisterModel.officecityid = '';
      this.userRegisterModel.officestreet = '';
      this.userRegisterModel.officeaddress = '';
    }
  }

  deleteDoc(docId: any) {
    if (docId) {
      this.userAPI.DeleteUserDoc({ userId: this.userId, userDocId: docId }).subscribe(res => {
        if (!res.errorcode) {
          // PanImageRemove
          this.userImageModel.panImageSrc = this.userImageModel.panImageId == docId ? null : this.userImageModel.panImageSrc;
          this.userLocalModel.panImage = this.userImageModel.panImageId == docId ? null : this.userImageModel.panImageSrc;
          this.panImageRemove = this.userImageModel.panImageId == docId ? true : false;
          // IdImageRemove
          this.userImageModel.idImageSrc = this.userImageModel.idImageId == docId ? null : this.userImageModel.idImageSrc;
          this.userLocalModel.idImage = this.userImageModel.idImageId == docId ? null : this.userImageModel.idImageSrc;
          this.idImageRemove = this.userImageModel.idImageId == docId ? true : false;
          // AddressImageRemove
          this.userImageModel.addressImageSrc = this.userImageModel.addressImageId == docId ? null : this.userImageModel.addressImageSrc;
          this.userLocalModel.addressImage = this.userImageModel.addressImageId == docId ? null : this.userImageModel.addressImageSrc;
          this.addressImageRemove = this.userImageModel.addressImageId == docId ? true : false;
          // CanImageRemove
          this.userImageModel.canImageSrc = this.userImageModel.canImageId == docId ? null : this.userImageModel.canImageSrc;
          this.userLocalModel.canImage = this.userImageModel.canImageId == docId ? null : this.userImageModel.canImageSrc;
          this.canImageRemove = this.userImageModel.canImageId == docId ? true : false;
        }
      });
    }
  }

  ageCalculator(event: any) {
    const date = event.year + '-' + event.month + '-' + event.day;
    if (date) {
      const convertAge = new Date(date);
      const timeDiff = Math.abs(Date.now() - convertAge.getTime());
      this.showAge = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
    }
  }

  isCharacter(event: any) {
    if ((event.keyCode > 64 && event.keyCode < 91) || (event.keyCode > 96 && event.keyCode < 123) || event.keyCode == 8 || event.keyCode == 32)
      return true;
    else {
      return false;
    }
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

  successMessage() {
    Swal.fire({
      title: this.responseMessage,
      text: '',
      icon: 'success',
      showCancelButton: false,
      confirmButtonText: 'Ok',
      showCloseButton: false
    }).then((willDelete) => {
      if (willDelete.value) {
        this.router.navigate(['/user-list']);
      }
    });
  }
}
