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

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss']
})

export class RoleListComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort
  @ViewChild('statusChangeContent', { static: false }) statusChangeContent: TemplateRef<any>;
  @ViewChild('removeRoleContent', { static: false }) removeRoleContent: TemplateRef<any>;
  @ViewChild('filter') filter: ElementRef;
  @ViewChild('createEditModel', { static: false }) createEditModel: TemplateRef<any>;
  public roleList = [];
  public searchText: any;
  public statusText: string;
  public constants = Constants;
  public roleStatus: boolean;
  public modalConfig: any = {
    keyboard: false,
    ignoreBackdropClick: false,
    class: 'modal-md modal-dialog-centered'
  }
  roleId: any;
  displayedColumns: string[] = ['index', 'rolename', 'rolecreatedon', 'roleupdatedon', 'action', 'permission'];
  dataSource = new MatTableDataSource();
  public menuList: Array<any> = [];
  public subMenu: Array<any> = [];
  public isAdd: boolean = false;
  public isEdit: boolean = false;
  public isDelete: boolean = false;
  public isView: boolean = false;
  public isStatus: boolean = false;
  public isPermission: boolean = false;

  constructor(
    private roleService: RoleService,
    private modalService: BsModalService,
    private commonHelper: CommonHelper,
    private spinner: NgxSpinnerService,
    private loginService: LoginService,
    private router: Router) { }

  ngOnInit(): void {
    this.getAllRoles();
    this.getMenuList()
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
        if (i.programprivilege == 'A' && i.programcode == "AM003" && i.programparentcode == "AM002") {
          this.isAdd = true;
        }
        else if (i.programprivilege == 'M' && i.programcode == "AM003" && i.programparentcode == "AM002") {
          this.isEdit = true;
          this.isStatus = true;
          this.isPermission = true;
        }
        else if (i.programprivilege == 'D' && i.programcode == "AM003" && i.programparentcode == "AM002") {
          this.isDelete = true;
        }
        // else if(i.programprivilege == 'V' && i.programcode == "AM003" && i.programparentcode == "AM002"){
        //   this.isView = true;
        // }
      })
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getAllRoles() {
    this.spinner.show();
    this.roleService.getAllRoles({ sortBy: "''", sortValue: 'D', roleid: this.constants.ACTIVE_INACTIVE_ROLES }).subscribe(res => {
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      let event = new KeyboardEvent('keyup', { 'bubbles': true });
      this.filter.nativeElement.dispatchEvent(event);
      this.spinner.hide();
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  removeRoles() {
    this.spinner.show();
    this.roleService.removeRoles({ roleId: this.roleId }).subscribe(res => {
      if (!res.errorcode) {
        this.getAllRoles();
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

  openRemoveModel(roleId: any) {
    this.roleId = roleId;
    this.modalService.show(this.removeRoleContent, this.modalConfig);
  }

  openStatusModel(status: any, roleId: any) {
    this.roleId = roleId;
    this.roleStatus = status == true ? false : true;
    this.statusText = status ? "deactivate" : "active"
    this.modalService.show(this.statusChangeContent, this.modalConfig);
  }

  roleStatusChange() {
    this.spinner.show();
    this.roleService.roleStatusChange({ roleStatus: this.roleStatus, roleId: this.roleId, modifiedBy: '1' }).subscribe(res => {
      if (!res.errorcode) {
        this.getAllRoles();
        this.closeModel();
        this.spinner.hide();
      } else if (res.errorcode == "405") {
        this.closeModel();
        this.commonHelper.errorMessage(res.stringresult);
        this.spinner.hide();
      }
    }, error => {
      this.spinner.hide();
      console.log(error);
    });
  }

  openCreateEdit() {
    this.modalService.show(this.createEditModel, this.modalConfig);
  }

  closeModel() {
    this.modalService.hide();
  }

  roleEdit(roleId: any) {
    this.router.navigate(['/role-create-edit'], { queryParams: { roleId: this.encryptParams(roleId) } });
  }

  rolePermission(roleId: any, roleName: any) {
    this.router.navigate(['/role-permission'], { queryParams: { roleId: this.encryptParams(roleId), roleName: this.encryptParams(roleName) } });
  }

  encryptParams(params: any) {
    return window.btoa(params);
  }

  decryptParams(params: any) {
    return window.atob(params);
  }
}
