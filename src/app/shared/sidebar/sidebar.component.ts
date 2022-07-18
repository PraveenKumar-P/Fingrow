import { Component, OnInit } from '@angular/core';

import { LoanService } from 'src/app/sevices/loan.service';
import { LoginService } from 'src/app/Sevices/login.service';
import { RoleService } from 'src/app/sevices/role.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})

export class SidebarComponent implements OnInit {
  public adminManagement = false;
  public transactionManagement = false;
  public menuList: Array<any> = [];
  public subMenu: Array<any> = [];

  constructor(
    private roleService: RoleService,
    private loginService: LoginService,
    private loanService: LoanService) { }

  ngOnInit() {
    const body = document.querySelector('body');
    // add class 'hover-open' to sidebar navitem while hover in sidebar-icon-only menu
    document.querySelectorAll('.sidebar .nav-item').forEach(function (el) {
      el.addEventListener('mouseover', function () {
        if (body.classList.contains('sidebar-icon-only')) {
          el.classList.add('hover-open');
        }
      });
      el.addEventListener('mouseout', function () {
        if (body.classList.contains('sidebar-icon-only')) {
          el.classList.remove('hover-open');
        }
      });
    });
    this.getMenuList();
  }

  getMenuList() {
    this.roleService.getMenuPrivilegeInfo({
      userid: this.loginService.getloginDetails().loginDetails['userid'],
      roleid: this.loginService.getloginDetails().loginDetails['userroleid']
    }).subscribe(res => {
      if (!res.errormessage) {
        this.menuList = res.data;
        this.subMenu = this.menuList.filter(item => {
          return item.programparentcode !== '' ? item : '';
        });
      }
    });
  }

  clear() {
    this.loanService.localStorageClear();
  }
}
