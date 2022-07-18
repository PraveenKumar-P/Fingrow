import { Component, OnInit } from '@angular/core';
import { BnNgIdleService } from 'bn-ng-idle';

import { CommonHelper } from './helper/common.helper';
import { LoginService } from './Sevices/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent implements OnInit {

  constructor(private bnIdle: BnNgIdleService,
    private loginService: LoginService,
    private commonHelper: CommonHelper) {
  }

  ngOnInit() {
    this.bnIdle.startWatching(900).subscribe((isTimedOut: boolean) => {
      if (isTimedOut) {
        this.commonHelper.warningMessage('Your session expired');
        this.loginService.logOut();
      }
    });
  }
}
