import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';

import { Constants } from 'src/app/helper/constants';
import { LoanService } from 'src/app/sevices/loan.service';
import { LoginService } from 'src/app/Sevices/login.service';
import { UserService } from 'src/app/sevices/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})

export class DashboardComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filter') filter: ElementRef;
  public constant = Constants;
  public loanApplicantCount: any;
  public loanApplicationProcessCount: any;
  public loanApplicationRejectCount: any;
  public loanTotalCount: any;
  public dataSource = new MatTableDataSource();
  public date: Date = new Date();
  public displayedColumns: string[] = ['index', 'loanapplicationnumber', 'loantype', 'statusname', 'action'];
  public userId: any;
  public userTypeCode: any;

  toggleProBanner(event) {
    event.preventDefault();
    document.querySelector('body').classList.toggle('removeProbanner');
  }

  constructor(
    private loginService: LoginService,
    private userService: UserService,
    private spinner: NgxSpinnerService,
    private loanService: LoanService,
    private router: Router) { }

  ngOnInit() {
    this.userId = this.loginService.getloginDetails().loginDetails.userid;
    this.userTypeCode = this.loginService.getloginDetails().loginDetails.usertypecode;
    this.LoanCountByAgent();
    this.gridList();
  }

  LoanCountByAgent() {
    this.userService.LoanCountByAgent({
      userid: this.userId,
      typecode: this.userTypeCode
    }).subscribe(res => {
      this.loanApplicantCount = res.loanapplicationcount
      this.loanApplicationProcessCount = res.loanapplicationprocessingcount;
      this.loanApplicationRejectCount = res.loanapplicationrejectcount;
      this.loanTotalCount = this.loanApplicantCount + this.loanApplicationProcessCount + this.loanApplicationRejectCount;
    }, error => {
      console.log(error);
      window.location.reload();
    });
  }

  gridList() {
    this.spinner.show();
    this.loanService.getAllLoans({
      sortby: "''", sortvalue: 'D',
      usertypecode: this.userTypeCode,
      userid: this.userId
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

  loanView(loanId: any) {
    this.router.navigate(["/loan-create-edit"], { queryParams: { loanId: window.btoa(loanId), view: window.btoa('VW'), type: window.btoa('DB') } });
  }
}
