import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { NgxSpinnerService } from "ngx-spinner";

import { CommonHelper } from 'src/app/helper/common.helper';
import { RoleService } from 'src/app/sevices/role.service';

@Component({
  selector: 'app-role-create-edit',
  templateUrl: './role-create-edit.component.html',
  styleUrls: ['./role-create-edit.component.scss']
})

export class RoleCreateEditComponent implements OnInit {
  @ViewChild('roleForm', { static: false }) roleForm: NgForm;
  public roleModel: any = {
    rolestatus: true,
    rolecreatedby: 1,
    roleupdatedby: 1
  };
  public statusText: any;

  constructor(
    private roleService: RoleService,
    private commonHelper: CommonHelper,
    private activeRouter: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.roleModel.roleid = this.activeRouter.snapshot.queryParams.roleId ? window.atob(this.activeRouter.snapshot.queryParams.roleId) : null;
    if (this.roleModel.roleid) {
      this.spinner.show();
      this.roleService.getRoleDetails({ roleid: this.roleModel.roleid }).subscribe(res => {
        this.roleModel = res;
        this.spinner.hide();
      });
    }
    this.statusText = this.roleModel['rolestatus'] ? "Active" : "InActive";
  }

  onSubmit() {
    this.roleForm.form.markAllAsTouched();
    if (!this.roleForm.valid) {
      return;
    }
    this.spinner.show();
    this.roleService.addEditRoles(this.roleModel).subscribe(res => {
      if (res.errorcode == 409) {
        this.spinner.hide();
        this.commonHelper.warningMessage(res.stringresult);
      } else {
        this.spinner.hide();
        this.commonHelper.successMessage(res.stringresult);
        this.router.navigate(['/role-list']);
      }
    }, err => {
      this.spinner.hide();
      this.commonHelper.errorMessage(err);
    });
  }

  changeText() {
    this.statusText = this.roleModel['rolestatus'] ? "Active" : "InActive";
  }
}
