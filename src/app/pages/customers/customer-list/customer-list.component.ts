import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';

import { BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';

import { UserService } from 'src/app/sevices/user.service';
import { CommonHelper } from 'src/app/helper/common.helper';
import { Constants } from 'src/app/helper/constants';
import { LoginService } from 'src/app/Sevices/login.service';
import { RoleService } from 'src/app/sevices/role.service';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})

export class CustomerListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filter') filter: ElementRef;
  @ViewChild('statusChangeContent', { static: false }) statusChangeContent: TemplateRef<any>;
  @ViewChild('removeUserContent', { static: false }) removeUserContent: TemplateRef<any>;
  
  public customerList: Array<any> = [];
  public searchText: any;
  public statusText: string;
  public userStatus: boolean;
  public userActiveId: any;
  public userId: any;
  public userRoleId: any;
  public displayedColumns: string[] = ['index', 'firstname', 'emailid', 'action'];
  public dataSource = new MatTableDataSource();
  public constant = Constants;
  public userType: string;
  public menuList: Array<any> = [];
  public subMenu: Array<any> = [];
  public isAdd: boolean = false;
  public isEdit: boolean = false;
  public isDelete: boolean = false;
  public isView: boolean = false;
  public isStatus: boolean = false;
  public modalConfig: any = {
    keyboard: false,
    ignoreBackdropClick: false,
    class: 'modal-md modal-dialog-centered'
  }

  constructor(
    private userService: UserService,
    private modalService: BsModalService,
    private spinner: NgxSpinnerService,
    private commonHelper: CommonHelper,
    private loginService: LoginService,
    private roleService: RoleService,
    private router: Router) { }

  ngOnInit(): void {
    this.userType = this.loginService.getloginDetails().loginDetails.usertypecode;
    this.userId = this.loginService.getloginDetails().loginDetails.userid;
    this.userRoleId = this.loginService.getloginDetails().loginDetails.userroleid;
    this.getGridList();
    this.getMenuList();
  }

  getMenuList() {
    this.roleService.getMenuPrivilegeInfo({
      userid: this.userId,
      roleid: this.userRoleId
    }).subscribe(res => {
      if (!res.errormessage) {
        this.menuList = res.data;
        this.subMenu = this.menuList.filter(item => {
          return item.programparentcode !== '' ? item : '';
        });
      }
      this.subMenu.filter(i => {
        if (i.programprivilege == 'A' && i.programcode == "AM007" && i.programparentcode == "AM002") {
          this.isAdd = true;
        }
        else if (i.programprivilege == 'M' && i.programcode == "AM007" && i.programparentcode == "AM002") {
          this.isEdit = true;
          this.isStatus = true;
        }
        else if (i.programprivilege == 'D' && i.programcode == "AM007" && i.programparentcode == "AM002") {
          this.isDelete = true;
        }
        // else if(i.programprivilege == 'V' && i.programcode == "AM007" && i.programparentcode == "AM002"){
        //   this.isView = true;
        // }
      });
    });
  }

  getGridList() {
    this.spinner.show();
    this.userService.getAllUsers({ sortBy: "''", sortValue: 'D', programcode: "AM007", usertypecode: "CU" }).subscribe(res => {
      if (!res.errormessage) {
        this.customerList = res.data.resultData.map(i => i.usr ? i.usr : {});
        this.dataSource = new MatTableDataSource(this.customerList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        let event = new KeyboardEvent('keyup', { 'bubbles': true });
        this.filter.nativeElement.dispatchEvent(event);
        this.spinner.hide();
      }
      this.spinner.hide();
    }, error => {
      console.log(error);
      window.location.reload();
      this.spinner.hide();
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

  openModal(status: any, userId: any) {
    this.userActiveId = userId;
    this.userStatus = status == true ? false : true;
    this.statusText = status ? "deactivate" : "active"
    this.modalService.show(this.statusChangeContent, this.modalConfig);
  }

  customerStatusChange() {
    this.spinner.show();
    this.userService.statusChange({ userStatus: this.userStatus, userId: this.userActiveId, modifiedBy: '1' }).subscribe(res => {
      if (!res.errorcode) {
        this.getGridList();
        this.closeModel();
        this.spinner.hide();
      } else if (res.errorcode == "405") {
        this.closeModel();
        this.commonHelper.errorMessage(res.stringresult);
        this.spinner.hide();
      }
    }, error => {
      console.log(error);
      this.spinner.hide();
    });
  }

  openRemoveModel(userId: any) {
    this.userId = userId;
    this.modalService.show(this.removeUserContent, this.modalConfig);
  }

  removeUser() {
    this.spinner.show();
    this.userService.removeUser({ userId: this.userId }).subscribe(res => {
      if (!res.errorcode) {
        this.getGridList();
        this.closeModel();
        this.commonHelper.successMessage(res.stringresult);
        this.spinner.hide();
      } else {
        this.closeModel();
        this.commonHelper.errorMessage(res.stringresult);
        this.spinner.hide();
      }
    }, error => {
      console.log(error);
      this.closeModel();
      this.spinner.hide();
    });
  }

  closeModel() {
    this.modalService.hide();
  }

  editClick(userId: any) {
    this.router.navigate(['/loan-create-edit'], { queryParams: { customerId: window.btoa(userId), type: window.btoa('CL') } });
  }
}
