import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { config } from 'src/assets/configuration/configURL';

@Injectable({
    providedIn: 'root'
})

export class RoleService {
    public apiURL: any;
    public token: any;

    constructor(private http: HttpClient) {
        this.apiURL = config.apiUrl;
        this.token = localStorage.getItem("token");
    }

    getAllRoles(query: any): Observable<any> {
        return this.http.get(this.apiURL + 'GetAllRoles', { headers: this.headers(), params: query });
    }

    getRoleDetails(query: any): Observable<any> {
        return this.http.get(this.apiURL + 'RolesDetail', { headers: this.headers(), params: query });
    }

    addEditRoles(item: any): Observable<any> {
        if (item.roleid) {
            return this.http.post(this.apiURL + 'EditRoles', item, { headers: this.headers() });
        } else {
            return this.http.post(this.apiURL + 'AddRoles', item, { headers: this.headers() });
        }
    }

    getPermissionDetails(query): Observable<any> {
        return this.http.get(this.apiURL + 'GetPermissonDetails', { headers: this.headers(), params: query });
    }

    getMenuList(query: any): Observable<any> {
        return this.http.get(this.apiURL + 'GetProgramsDetail', { headers: this.headers(), params: query });
    }

    rolePrivilegeCreation(item: any): Observable<any> {
        return this.http.post(this.apiURL + 'RolePrivilegeCreation', item, { headers: this.headers() });
    }

    getRolePrivilegeDetail(query: any): Observable<any> {
        return this.http.get(this.apiURL + 'GetRolePrivilegeDetail', { headers: this.headers(), params: query });
    }

    deleteRolePrivileges(query: any): Observable<any> {
        return this.http.post(this.apiURL + 'DeleteRolePrivileges', {}, { headers: this.headers(), params: query });
    }

    removeRoles(query: any): Observable<any> {
        return this.http.post(this.apiURL + 'DeleteRoles', {}, { headers: this.headers(), params: query });
    }

    roleStatusChange(query: any): Observable<any> {
        return this.http.post(this.apiURL + 'StatusRoles', {}, { headers: this.headers(), params: query });
    }

    getMenuPrivilegeInfo(query: any): Observable<any> {
        return this.http.get(this.apiURL + 'GetMenuPrivilegeInfo', { headers: this.headers(), params: query });
    }

    headers() {
        return new HttpHeaders({
            Authorization: "Bearer " + this.token
        });
    }
}
