import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CommonHelper } from 'src/app/helper/common.helper';
import { RoleService } from 'src/app/sevices/role.service';

@Component({
  selector: 'app-role-permission',
  templateUrl: './role-permission.component.html',
  styleUrls: ['./role-permission.component.scss']
})

export class RolePermissionComponent implements OnInit {
  public headerNameMaster: any = [];
  public screenList: any = [];
  public roleModel: any = {};
  public togglePermission: any = [];
  public oldPermissions: any = [];
  public finalList: Array<Object> = [];
  
  constructor(
    private roleService: RoleService,
    private activeRouter: ActivatedRoute,
    private commonHelper: CommonHelper,
    private router: Router) {
  }

  async ngOnInit() {
    this.roleModel.roleId = this.activeRouter.snapshot.queryParams.roleId ? window.atob(this.activeRouter.snapshot.queryParams.roleId) : null;
    this.roleModel.roleName = this.activeRouter.snapshot.queryParams.roleName ? window.atob(this.activeRouter.snapshot.queryParams.roleName) : null;

    //ToggleTrue List
    this.roleService.getRolePrivilegeDetail({ sortBy: "''", sortValue: 'A', roleId: this.roleModel.roleId }).subscribe(async (res) => {
      if (res.length > 0) {
        this.oldPermissions = await res.map((item) => {
          return {
            roleprivilegeroleId: item.roleprivilegeroleid,
            roleprivilegeprogramcode: item.roleprivilegeprogramcode,
            roleprivilege: item.roleprivilege,
            roleprivilegecreatedby: 1,
            roleprivilegeupdatedby: 1,
          }
        });
        this.togglePermission = await res.map((item, index) => {
          return {
            index: index,
            roleprivilegeid: item.roleprivilegeid,
            roleprivilege: item.roleprivilege,
            roleprivilegeprogramcode: item.roleprivilegeprogramcode
          }
        });
      }
      await this.getRolePermissionDetails(res);
    });
  }

  async getRolePermissionDetails(toggleres) {
    //Screen name list
    this.roleService.getMenuList({ sortBy: "''", sortValue: "A" }).subscribe(async res => {
      this.screenList = await res.map((element: any) => {
        element.programprivilege = element.programprivilege.split('')
        this.getPermissionList();
        this.GetOnlyScreens(res, toggleres)
        return element;
      });
    });
  }

  getPermissionList() {
    this.roleService.getPermissionDetails({ sortBy: "''", sortValue: "A" }).subscribe(async res => {
      this.headerNameMaster = await res.slice(0, 4);
    });
  }

  // Mapped two master to get only the table data with default static view
  // TODO :: Make actions dynamic with header
  GetOnlyScreens(menuList, toggleres) {
    this.finalList = [];
    let array = [];
    menuList.forEach(element => {
      let val = {
        programname: element.programname,
        programcode: element.programcode,
        programprivilege: element.programprivilege,
        programicon: element.programicon,
        programorder: element.programorder,
        actions: [
          {
            action: 'A',
            value: false
          },
          {
            action: 'M',
            value: false
          },
          {
            action: 'D',
            value: false
          },
          {
            action: 'V',
            value: false
          }
        ],
      }
      array.push(val)
    });
    this.GetFinalList(array, toggleres)
  }

  // Mapped the permission list to actions genrated in functions GetOnlyScreens
  GetFinalList(array, toggleres) {
    array.forEach(screen => {
      toggleres.forEach(toggle => {
        if (screen.programcode == toggle.roleprivilegeprogramcode) {
          screen.actions.filter(item => {
            if (item.action == toggle.roleprivilege)
              item.value = true;
          })
        }
      });
    });
    this.finalList = [...array];
  }

  toggleChange(screenList: any, menuList: any, event) {
    const eventStatus = event.target.checked;
    const recentValue = this.oldPermissions.filter(item => item.roleprivilegeprogramcode == screenList.programcode && item.roleprivilege == menuList.action);
    if (recentValue.length > 0 && !eventStatus) {
      this.oldPermissions = this.oldPermissions.filter(item => item !== recentValue[0])
    } else {
      const result = {
        roleprivilegeroleId: this.roleModel.roleId,
        roleprivilegeprogramcode: screenList.programcode,
        roleprivilege: menuList.action,
        roleprivilegecreatedby: 1,
        roleprivilegeupdatedby: 1,
      }
      this.oldPermissions = this.oldPermissions.concat(result);
    }
  }

  onSubmit() {
    this.roleService.deleteRolePrivileges({ roleid: this.roleModel.roleId }).subscribe(res => {
      for (let i = 0; i < this.oldPermissions.length; i++) {
        this.roleService.rolePrivilegeCreation(this.oldPermissions[i]).subscribe(res => {
        });
      }
      this.commonHelper.successMessage("Role Privilege has been saved successfully.");
      this.router.navigate(['role-list']);
    });
  }
}
