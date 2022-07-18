import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

import { LoginService } from 'src/app/Sevices/login.service';
import { UserService } from 'src/app/sevices/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})

export class UserProfileComponent implements OnInit {
  public userDetails: any = {};
  public userType: any = {};
  public userRole: any = {};
  public userCity: any = {};
  public userStates: any = {};
  public userCountry: any = {};
  public officeCity: any = {};
  public officeStates: any = {};
  public officeCountry: any = {};
  public bankMaster: any = {};
  public suffixMaster: any = {};
  public userActivationMaster: any = {};
  public profilePicture: any;
  public dateofBirth: any;

  constructor(
    private userService: UserService,
    private loginService: LoginService,
    private datePipe: DatePipe,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.getUserDetails();
  }

  getUserDetails() {
    this.spinner.show();
    const userDetails = this.loginService.getloginDetails();
    this.userService.getUserDetailsById({ userId: userDetails.loginDetails.userid }).subscribe(res => {
      this.userDetails = res.users ? res.users : {};
      this.userType = res.usertype ? res.usertype : {};
      this.userRole = res.roles ? res.roles : '';
      this.userCity = res.city ? res.city : '';
      this.userStates = res.states ? res.states : '';
      this.userCountry = res.country ? res.country : '';
      this.officeCity = res.officecity ? res.officecity : {};
      this.officeStates = res.officestates ? res.officestates : {};
      this.officeCountry = res.officecountry ? res.officecountry : {};
      this.bankMaster = res.bankmaster ? res.bankmaster : {};
      this.suffixMaster = res.suffixmaster ? res.suffixmaster : {};
      this.userActivationMaster = res.useractivationmaster ? res.useractivationmaster : {};
      this.profilePicture = res.profilepicture ? res.profilepicture : "/assets/images/faces/userimage_placeholder.jpg";
      this.userDetails.dateofbirth = this.datePipe.transform(this.userDetails.dateofbirth, 'dd-MM-yyyy');
      this.userDetails.dateofregister = this.datePipe.transform(this.userDetails.dateofregister, 'dd-MM-yyyy');
      this.userDetails.dateofjoin = this.datePipe.transform(this.userDetails.dateofjoin, 'dd-MM-yyyy');
      this.spinner.hide();
    }, err => {
      console.log(err);
      this.spinner.hide();
    });
  }
}
