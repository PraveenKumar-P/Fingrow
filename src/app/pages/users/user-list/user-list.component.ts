import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

import { BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';

import { CommonHelper } from 'src/app/helper/common.helper';
import { Constants } from 'src/app/helper/constants';
import { LoginService } from 'src/app/Sevices/login.service';
import { RoleService } from 'src/app/sevices/role.service';
import { UserService } from 'src/app/sevices/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})

export class UserListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filter') filter: ElementRef;
  @ViewChild('statusChangeContent', { static: false }) statusChangeContent: TemplateRef<any>;
  @ViewChild('removeUserContent', { static: false }) removeUserContent: TemplateRef<any>;
  public userList: Array<any> = [];
  public searchText: any;
  public statusText: string;
  public constants = Constants;
  public modalConfig: any = {
    keyboard: false,
    ignoreBackdropClick: false,
    class: 'modal-md modal-dialog-centered'
  }
  public userId: any;
  public userStatus: boolean;
  public displayedColumns: string[] = ['index', 'firstname', 'usertypename', 'mobilenumber', 'emailid', 'useractivationname', 'eligibilityCheck', 'action'];
  public dataSource = new MatTableDataSource();
  public usertype: Array<any> = [];
  public user: Array<any> = [];
  public userActivationStatus: Array<any> = [];
  public menuList: Array<any> = [];
  public subMenu: Array<any> = [];
  public isAdd: boolean = false;
  public isEdit: boolean = false;
  public isDelete: boolean = false;
  public isView: boolean = false;
  public isStatus: boolean = false;
  public isEligibility: boolean = false;
  public userTypeCode: string;

  constructor(
    private userService: UserService,
    private modalService: BsModalService,
    private commonHelper: CommonHelper,
    private spinner: NgxSpinnerService,
    private roleService: RoleService,
    private loginService: LoginService,
    private router: Router) {
  }

  ngOnInit(): void {
    this.userTypeCode = this.loginService.getloginDetails().loginDetails.usertypecode;
    this.getAllUsers();
    this.getMenuList();
  }

  getMenuList() {
    this.roleService.getMenuPrivilegeInfo({
      userid: this.loginService.getloginDetails().loginDetails.userid,
      roleid: this.loginService.getloginDetails().loginDetails.userroleid
    }).subscribe(res => {
      if (!res.errormessage) {
        this.menuList = res.data;
        this.subMenu = this.menuList.filter(item => {
          return item.programparentcode !== '' ? item : '';
        });
      }
      this.subMenu.filter(i => {
        if (i.programprivilege == 'A' && i.programcode == "AM004" && i.programparentcode == "AM002") {
          this.isAdd = true;
        } else if (i.programprivilege == 'M' && i.programcode == "AM004" && i.programparentcode == "AM002") {
          this.isEdit = true;
          this.isStatus = true;
          this.isEligibility = true;
        }
        else if (i.programprivilege == 'D' && i.programcode == "AM004" && i.programparentcode == "AM002") {
          this.isDelete = true;
        }
        // else if(i.programprivilege == 'V' && i.programcode == "AM004" && i.programparentcode == "AM002"){
        //   this.isView = true;
        // }
      })
    });
  }

  getAllUsers() {
    this.spinner.show();
    this.userService.getAllUsers({ sortBy: "''", sortValue: 'D', programcode: "AM004", usertypecode: this.constants.CUSTOMER_TYPE_CODE }).subscribe(res => {
      this.user = res.data.resultData.map(i => i.usr ? i.usr : {});
      this.usertype = res.data.resultData.map(i => i.usrtype ? i.usrtype : {});
      this.userActivationStatus = res.data.userActivity;
      this.user.map(item => {
        this.usertype.filter(it => {
          this.userActivationStatus.filter(sta => {
            if (it.usertypecode == item.usertypecode && sta.useractivationid == item.useractivationmasterid) {
              item.usertypename = it.usertypename;
              item.useractivationname = sta.useractivationname;
              return item;
            }
          });
        });
      });
      this.dataSource = new MatTableDataSource(this.user);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      let event = new KeyboardEvent('keyup', { 'bubbles': true });
      this.filter.nativeElement.dispatchEvent(event);
      this.spinner.hide();
    }, error => {
      console.log(error);
      window.location.reload();
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  eligibilityEdit(userId: any, status: any = '') {
    const queryParams = status ? { userId: window.btoa(userId), type: window.btoa(this.userTypeCode), status: status }
      : { userId: window.btoa(userId), type: window.btoa(this.userTypeCode) }
    this.router.navigate(['/eligibility-check'], { queryParams: queryParams });
  }

  userEdit(userId: any) {
    this.router.navigate(['/user-create-edit'], { queryParams: { userId: window.btoa(userId) } });
  }

  removeUser() {
    this.spinner.show();
    this.userService.removeUser({ userId: this.userId }).subscribe(res => {
      if (!res.errorcode) {
        this.getAllUsers();
        this.closeModel();
        this.commonHelper.successMessage(res.stringresult);
        this.spinner.hide();
      }
      else {
        this.closeModel();
        this.commonHelper.errorMessage(res.stringresult);
        this.spinner.hide();
      }
    }, err => {
      this.closeModel();
      this.commonHelper.errorMessage(err);
      this.spinner.hide();
    });
  }

  userStatusChange() {
    this.spinner.show();
    this.userService.statusChange({ userStatus: this.userStatus, userId: this.userId, modifiedBy: '1' }).subscribe(res => {
      if (!res.errorcode) {
        this.getAllUsers();
        this.closeModel();
        this.spinner.hide();
      }
    });
  }

  openModal(status: any, userId: any) {
    this.userId = userId;
    this.userStatus = status == true ? false : true;
    this.statusText = status ? "deactivate" : "active"
    this.modalService.show(this.statusChangeContent, this.modalConfig);
  }

  openRemoveModel(userId: any) {
    this.userId = userId;
    this.modalService.show(this.removeUserContent, this.modalConfig);
  }

  reValidation(userId: any) {
    this.userService.changeRevalidation({ userId: userId, modifiedBy: 1, status: "P", remarks: '' }).subscribe(res => {
      if (res.errorcode) {
        this.commonHelper.errorMessage(res.stringresult);
        this.getAllUsers();
      } else {
        this.commonHelper.successMessage(res.stringresult);
        this.getAllUsers();
      }
    }, error => {
      console.log(error);
    });
  }

  closeModel() {
    this.modalService.hide();
  }

  isNumber(num, isdecimal = false) {
    num = (num) ? num : window.event;
    var charCode = (num.which) ? num.which : num.keyCode;
    if (charCode == 46 && isdecimal)
      return true
    else if (charCode > 31 && (charCode < 48 || charCode > 57))
      return false;
    return true;
  }
}