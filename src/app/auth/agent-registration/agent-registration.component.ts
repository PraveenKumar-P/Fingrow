import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from "ngx-spinner";
import { BsModalService } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';

import { CommonHelper } from 'src/app/helper/common.helper';
import { LocationService } from 'src/app/sevices/location.service';
import { UserService } from 'src/app/sevices/user.service';

@Component({
  selector: 'app-agent-registration',
  templateUrl: './agent-registration.component.html',
  styleUrls: ['./agent-registration.component.scss']
})

export class AgentRegistrationComponent implements OnInit {
  @ViewChild('imageModal', { static: false }) imageModal: TemplateRef<any>;
  @ViewChild('personalForm', { static: false }) personalForm: NgForm;
  @ViewChild('bankForm', { static: false }) bankForm: NgForm;
  @ViewChild('uploadForm', { static: false }) uploadForm: any;

  public active = 1;
  public userRegisterModel: any = {};
  public userImageModel: any = {};
  public userAcceptModel: any = {};
  public defaultImage = 'assets/images/faces/userimage_placeholder.jpg';
  public profImage = '';
  // Address 1
  public countries: Array<any> = [];
  public states: Array<any> = [];
  public cities: Array<any> = [];
  // Address 2
  public officeCountries: Array<any> = [];
  public officeStates: Array<any> = [];
  public officeCities: Array<any> = [];

  public bankMaster: Array<any> = [];
  public userId: any;
  public isProfileUpdated = false;
  public userCode: any;
  public userOTP: any;
  public responseMessage: any;
  public reAccountNumber: any;
  public usercode: any = "";
  public previousbtn: string = "Back";
  public maxDate: any;
  public showAge: any;
  public preview: string;
  public panImageRemove: boolean = true;
  public idImageRemove: boolean = true;
  public addressImageRemove: boolean = true;
  public canImageRemove: boolean = true;
  public userDocuments: Array<any> = [];
  public genderMaster: any = [
    { id: 'Male', value: 'Male' },
    { id: 'Female', value: 'Female' },
    { id: 'Others', value: 'Others' }
  ];
  public config: any;

  constructor(
    private locationAPI: LocationService,
    private userAPI: UserService,
    private commonHelper: CommonHelper,
    private router: Router,
    private configs: NgbDatepickerConfig,
    private spinner: NgxSpinnerService,
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
    this.getMasters();
  }

  getMasters() {
    this.userAPI.GetAllBankList({ sortBy: 'name', sortValue: 'A' }).subscribe((res) => {
      this.bankMaster = res;
    });
    this.locationAPI.GetAllCountries({ sortBy: 'name', sortValue: 'A' }).subscribe((res) => {
      this.countries = res;
      this.officeCountries = res;
      this.userRegisterModel.countrycode = this.countries[0].countryid;
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
      }
      else {
        this.states = [];
        this.states = res;
        this.userRegisterModel['stateid'] = this.userId ? this.userRegisterModel['stateid'] : null;
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
        this.userRegisterModel.cityid = '';
      }
    });
  }

  uploadPAN(event: any) {
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (events: any) => {
      if (event.target.files[0].size > 500000) {
        /* checking size here - 500KB */
        this.commonHelper.warningMessage("Upload image size Below '500KB'");
      } else {
        this.userImageModel.panImageSrc = events.target.result;
        this.userDocuments.push({
          documentId: 1,
          userId: this.userId ? this.userId : '',
          documentFile: {
            fileextension: '.jpg',
            fileName: event.target.files[0].name,
            binarydata: events.target.result
          }
        });
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
        this.commonHelper.warningMessage("Upload image size Below '500KB'");
      } else {
        this.userImageModel.idImageSrc = events.target.result;
        this.userDocuments.push({
          documentId: 2,
          userId: this.userId ? this.userId : '',
          documentFile: {
            fileextension: '.jpg',
            fileName: event.target.files[0].name,
            binarydata: events.target.result
          }
        });
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
        this.commonHelper.warningMessage("Upload image size Below '500KB'");
      } else {
        this.userImageModel.addressImageSrc = events.target.result;
        this.userDocuments.push({
          documentId: 3,
          userId: this.userId ? this.userId : '',
          documentFile: {
            fileextension: '.jpg',
            fileName: event.target.files[0].name,
            binarydata: events.target.result
          }
        });
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
        this.commonHelper.warningMessage("Upload image size Below '500KB'");
      } else {
        this.userImageModel.canImageSrc = events.target.result;
        this.userDocuments.push({
          documentId: 4,
          userId: this.userId ? this.userId : '',
          documentFile: {
            fileextension: '.jpg',
            fileName: event.target.files[0].name,
            binarydata: events.target.result
          }
        });
        this.canImageRemove = false;
      }
    };
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
        this.userRegisterModel.profilePicture = {
          binarydata: image,
          fileextension: '.' + fileNameExtension, // '.'+image.substring(image.indexOf("image/")+6, image.indexOf(";")),
          fileName: random
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
      this.router.navigate(['/auth/login']);
    }
    this.previousbtn = this.active == 2 ? "Back" : "Previous";
    this.active = this.active > 1 ? this.active - 1 : null;
  }

  onSubmit() {
    this.uploadForm.form.markAllAsTouched();
    if (!this.uploadForm.valid) {
      return false;
    }
    this.spinner.show();
    let viewFormatDateOfBirth = this.userRegisterModel['dateofbirth'];
    if (this.userRegisterModel['dateofbirth'] && 'year' && typeof this.userRegisterModel['dateofbirth'] === 'object') {
      this.userRegisterModel['dateofbirth'] = this.createISODate(this.userRegisterModel['dateofbirth'])
    }
    this.userRegisterModel.sameaddress = (this.userRegisterModel.sameaddress) ? 1 : 0;
    this.userRegisterModel['activationtype'] = 'D';
    this.userRegisterModel['userstatus'] = true;
    this.userRegisterModel['usercode'] = '';
    // temp populate
    this.userRegisterModel['createdby'] = 1;
    if (this.bankForm.valid) {
      this.spinner.show();
      this.userRegisterModel['usertypecode'] = "AG"
      this.userAPI.registerAgent(this.userRegisterModel).subscribe((res) => {
        // Bringing back date view formats
        this.userRegisterModel['dateofbirth'] = viewFormatDateOfBirth;
        if (!res.errorcode) {
          // Assigning user id
          this.userId = res.users.userid;
          this.userCode = res.users.usercode;
          this.userOTP = res.users.userotp;
          localStorage.setItem("userCode", this.userCode);
          localStorage.setItem("userOTP", this.userOTP);
          this.responseMessage = res.stringresult;
          this.userDocuments = this.userDocuments.map(item => {
            item.userId = this.userId
            return item;
          });
          for (let i = 0; i < this.userDocuments.length; i++) {
            this.userAPI.RegisterAgentDocCreation(this.userDocuments[i]).subscribe(res => {
            });
          }
          this.spinner.hide();
          this.successMessage();
        }
        else {
          this.spinner.hide();
          this.successMessage();
          this.commonHelper.errorMessage(res.stringresult);
        }
      }, error => {
        console.log(error);
        this.spinner.hide();
      });
    }
  }

  enableSameAddress(e) {
    this.userRegisterModel.sameaddress = (e) ? e.target.checked : this.userRegisterModel.sameaddress;
    if (this.userRegisterModel.sameaddress) {
      this.loadState(this.userRegisterModel.countryid, true);
      this.loadCity(this.userRegisterModel.stateid, true);
      this.userRegisterModel.officecountryid = this.userRegisterModel.countryid
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

  openImageModal(img: string) {
    const config = {
      keyboard: true,
      ignoreBackdropClick: true,
      class: 'modal-xl modal-dialog-centered scroll',
    };
    this.preview = img;
    this.modalService.show(this.imageModal, config);
  }

  closeModel() {
    this.modalService.hide();
  }

  panRemove(documentId: any) {
    this.userDocuments = this.userDocuments.filter(item => item.documentId !== documentId);
    this.userImageModel.panImageSrc = null;
    this.userImageModel.panImage = null;
    this.panImageRemove = true;
  }

  idRemove(documentId: any) {
    this.userDocuments = this.userDocuments.filter(item => item.documentId !== documentId);
    this.userImageModel.idImageSrc = null;
    this.userImageModel.idImage = null;
    this.idImageRemove = true;
  }

  addressRemove(documentId: any) {
    this.userDocuments = this.userDocuments.filter(item => item.documentId !== documentId);
    this.userImageModel.addressImageSrc = null;
    this.userImageModel.addressImage = null;
    this.addressImageRemove = true;
  }

  canRemove(documentId: any) {
    this.userDocuments = this.userDocuments.filter(item => item.documentId !== documentId);
    this.userImageModel.canImageSrc = null;
    this.userImageModel.canImage = null;
    this.canImageRemove = true;
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
        this.router.navigate(['auth/login']);
      }
    });
  }
}
