import { Component, OnInit } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';

import { Constants } from 'src/app/helper/constants';
import { LoanService } from 'src/app/sevices/loan.service';
import { LoginService } from 'src/app/Sevices/login.service';
import { UserService } from 'src/app/sevices/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  providers: [NgbDropdownConfig]
})

export class NavbarComponent implements OnInit {
  public iconOnlyToggled = false;
  public sidebarToggled = false;
  public profilePicture: any;
  public userName: any;
  public usersType: string
  public constant = Constants;
  public userType: string;

  constructor(
    private config: NgbDropdownConfig,
    private loginService: LoginService,
    private userService: UserService,
    private loanService: LoanService) {
    config.placement = 'bottom-right';
  }

  ngOnInit() {
    this.usersType = this.loginService.getloginDetails().loginDetails['usertypecode'];
    this.userType = this.constant.USER_TYPE.find(i => i.usertypecode == this.usersType).usertypename;
    const data = this.loginService.getloginDetails();
    this.userService.getUserDetailsById({ userId: data.loginDetails.userid }).subscribe(res => {
      this.profilePicture = res['profilepicture'] ? res['profilepicture'] : "assets/images/faces/userimage_placeholder.jpg";
      this.userName = res.users['firstname'];
    }, err => {
      console.log(err);
    });
  }

  // toggle sidebar in small devices
  toggleOffcanvas() {
    document.querySelector('.sidebar-offcanvas').classList.toggle('active');
  }

  // toggle sidebar
  toggleSidebar() {
    let body = document.querySelector('body');
    if ((!body.classList.contains('sidebar-toggle-display')) && (!body.classList.contains('sidebar-absolute'))) {
      this.iconOnlyToggled = !this.iconOnlyToggled;
      if (this.iconOnlyToggled) {
        body.classList.add('sidebar-icon-only');
      } else {
        body.classList.remove('sidebar-icon-only');
      }
    } else {
      this.sidebarToggled = !this.sidebarToggled;
      if (this.sidebarToggled) {
        body.classList.add('sidebar-hidden');
      } else {
        body.classList.remove('sidebar-hidden');
      }
    }
  }

  // toggle right sidebar
  // toggleRightSidebar() {
  //   document.querySelector('#right-sidebar').classList.toggle('open');
  // }

  logOut() {
    this.loginService.logOut();
  }

  clear() {
    this.loanService.localStorageClear();
  }
}
