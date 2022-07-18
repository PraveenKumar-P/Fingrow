import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { config } from 'src/assets/configuration/configURL';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  public apiURL: any;
  public token: any;

  constructor(private http: HttpClient) {
    this.apiURL = config.apiUrl;
    this.token = localStorage.getItem("token");
  }

  getUserDetailsById(query: any): Observable<any> {
    return this.http.get(this.apiURL + 'GetUserDetail', { headers: this.headers(), params: query });
  }

  getAllUsers(query: any): Observable<any> {
    return this.http.get(this.apiURL + 'GetAllUsers', { headers: this.headers(), params: query });
  }

  removeUser(query: any): Observable<any> {
    return this.http.post(this.apiURL + 'RemoveUser', {}, { headers: this.headers(), params: query });
  }

  statusChange(query: any): Observable<any> {
    return this.http.post(this.apiURL + 'UserStatus', {}, { headers: this.headers(), params: query });
  }

  GetAllDocumentType(query: any): Observable<any> {
    return this.http.get(this.apiURL + 'GetAllDocumentType', { headers: this.headers(), params: query });
  }

  GetAllUserTypes(query: any): Observable<any> {
    return this.http.get(this.apiURL + 'GetAllUserTypes', { headers: this.headers(), params: query });
  }

  userCreation(body: any): Observable<any> {
    return this.http.post(this.apiURL + 'UserCreation', body, { headers: this.headers() });
  }

  registerAgent(body: any): Observable<any> {
    return this.http.post(this.apiURL + 'RegisterAgent', body, { headers: this.headers() });
  }

  UserDocCreation(body: any): Observable<any> {
    return this.http.post(this.apiURL + 'UserDocCreation', body, { headers: this.headers() });
  }

  RegisterAgentDocCreation(body: any): Observable<any> {
    return this.http.post(this.apiURL + 'RegisterAgentDocCreation', body);
  }

  GetUserDocs(query: any): Observable<any> {
    return this.http.get(this.apiURL + 'GetUserDocs', { headers: this.headers(), params: query });
  }

  GetAllSuffix(query: any): Observable<any> {
    return this.http.get(this.apiURL + 'GetAllSuffix', { headers: this.headers(), params: query });
  }

  GetAllBankList(query: any): Observable<any> {
    return this.http.get(this.apiURL + 'GetAllBankList', { headers: this.headers(), params: query });
  }

  DeleteUserDoc(query: any): Observable<any> {
    return this.http.post(this.apiURL + 'RemoveUserDocument', {}, { headers: this.headers(), params: query });
  }

  GetUserDetail(query: any): Observable<any> {
    return this.http.get(this.apiURL + 'GetUserDetail', { headers: this.headers(), params: query });
  }

  UserUpdate(body: any): Observable<any> {
    return this.http.post(this.apiURL + 'UserUpdate', body, { headers: this.headers() });
  }

  UserUpdateProfile(body: any): Observable<any> {
    return this.http.post(this.apiURL + 'UserUpdateProfile', body, { headers: this.headers() });
  }

  userEVerify(item: any): Observable<any> {
    return this.http.post(this.apiURL + 'EVerify', item, { headers: this.headers() });
  }

  userEAgreeStatus(item: any): Observable<any> {
    return this.http.post(this.apiURL + 'UserEAgreeStatus', item, { headers: this.headers() });
  }

  changeRevalidation(item: any): Observable<any> {
    return this.http.post(this.apiURL + 'ChangeRevalidation', item, { headers: this.headers() });
  }

  LoanCountByAgent(query: any): Observable<any> {
    return this.http.post(this.apiURL + 'LoanCountByAgent', {}, { headers: this.headers(), params: query });
  }

  
  headers() {
    return new HttpHeaders({
      Authorization: "Bearer " + this.token
    });
  }
}
