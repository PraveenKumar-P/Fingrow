import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';

import { Constants } from 'src/app/helper/constants';
import { LoanService } from 'src/app/sevices/loan.service';
import { LoginService } from 'src/app/Sevices/login.service';
import { RoleService } from 'src/app/sevices/role.service';

@Component({
  selector: 'app-customer-loan-list',
  templateUrl: './customer-loan-list.component.html',
  styleUrls: ['./customer-loan-list.component.scss']
})

export class CustomerLoanListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filter') filter: ElementRef;
  @ViewChild("createModel", { static: false }) createModel: TemplateRef<any>;
  public customerLoanList: any = [];
  public config: any = {
    keyboard: false,
    ignoreBackdropClick: false,
    class: 'modal-sm modal-dialog-centered'
  }
  public userType: any;
  public constant = Constants;
  public displayedColumns: string[] = ['index', 'loanapplicationnumber', 'loantype', 'firstname', 'mobilenumber', 'statusname', 'action'];
  public dataSource = new MatTableDataSource();
  public menuList: Array<any> = [];
  public subMenu: Array<any> = [];
  public isAdd: boolean = false;
  public isEdit: boolean = false;
  public isDelete: boolean = false;
  public isView: boolean = false;
  public userId: any;
  public roleId: any;

  constructor(
    private modalService: BsModalService,
    private loanService: LoanService,
    private router: Router,
    private loginService: LoginService,
    private spinner: NgxSpinnerService,
    private roleService: RoleService,
  ) { }

  ngOnInit(): void {
    this.userType = this.loginService.getloginDetails().loginDetails.usertypecode;
    this.userId = this.loginService.getloginDetails().loginDetails.userid;
    this.roleId = this.loginService.getloginDetails().loginDetails.userroleid;
    this.gridList();
    this.getMenuList();
  }

  getMenuList() {
    this.roleService.getMenuPrivilegeInfo({ userid: this.userId, roleid: this.roleId }).subscribe(res => {
      if (!res.errormessage) {
        this.menuList = res.data;
        this.subMenu = this.menuList.filter(item => {
          return item.programparentcode !== '' ? item : '';
        });
      }
      this.subMenu.filter(i => {
        if (i.programprivilege == 'A' && i.programcode == "AM006" && i.programparentcode == "AM005") {
          this.isAdd = true;
        }
        else if (i.programprivilege == 'M' && i.programcode == "AM006" && i.programparentcode == "AM005") {
          this.isEdit = true;
        }
        else if (i.programprivilege == 'D' && i.programcode == "AM006" && i.programparentcode == "AM005") {
          this.isDelete = true;
        }
        // else if(i.programprivilege == 'V' && i.programcode == "AM006" && i.programparentcode == "AM005"){
        //   this.isView = true;
        // }
      });
    });
  }

  gridList() {
    this.spinner.show();
    const usertypeCode = this.userType == this.constant.AGENT_TYPE_CODE ? this.constant.AGENT_TYPE_CODE : this.constant.SUPER_ADMIN_TYPE_CODE
    this.loanService.getAllLoans({
      sortby: "''", sortvalue: 'D', usertypecode: usertypeCode,
      userid: this.loginService.getloginDetails().loginDetails.userid
    }).subscribe(res => {
      if (!res.errormessage) {
        this.dataSource = new MatTableDataSource(res && res.data ? res.data : []);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        let event = new KeyboardEvent('keyup', { 'bubbles': true });
        this.filter.nativeElement.dispatchEvent(event);
        this.spinner.hide();
      }
      this.spinner.hide();
    }, error => {
      console.log(error);
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

  closeModel() {
    this.modalService.hide();
  }

  openModel() {
    this.modalService.show(this.createModel, this.config);
  }

  newCustomer() {
    this.router.navigate(["/customer-create-edit"]);
    this.closeModel();
  }

  loanEdit(loanId: any, isReject: any) {
    const type = this.encryptParams('CLL');
    const params = isReject ? { loanId: this.encryptParams(loanId), isReject: true, type: type } : { loanId: this.encryptParams(loanId), type: type }
    this.router.navigate(["/loan-create-edit"], { queryParams: params });
  }

  loanView(loanId: any) {
    this.router.navigate(["/loan-create-edit"], { queryParams: { loanId: this.encryptParams(loanId), view: this.encryptParams('VW'), type: this.encryptParams('CLL') } });
  }

  encryptParams(params: any) {
    return window.btoa(params);
  }
}
