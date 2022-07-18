import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { config } from "../../assets/configuration/configURL";

@Injectable({
  providedIn: 'root'
})

export class LoginService {
  public apiURL: any;

  constructor(
    private http: HttpClient,
    private router: Router) {
    this.apiURL = config.apiUrl;
  }

  getSystemIP(): Observable<any> {
    return this.http.get('https://api.ipify.org/?format=json').pipe();
  }

  login(item: any): Observable<any> {
    return this.http.post(this.apiURL + 'login', item, this.headers());
  }

  logOut() {
    localStorage.clear();
    this.router.navigate(['auth/login']);
  }

  forgetPassword(item: any): Observable<any> {
    return this.http.post(this.apiURL + 'SetNewPassword', item, this.headers());
  }

  changePassword(item: any): Observable<any> {
    return this.http.post(this.apiURL + 'ChangePassword', item, this.headers());
  }

  userOTP(item: any) {
    if (item.OTP) {
      return this.http.post(this.apiURL + 'CheckOTP', item, this.headers());
    } else {
      return this.http.post(this.apiURL + 'SendOTP', item, this.headers());
    }
  }

  setItem(item: any, token: any) {
    localStorage.setItem('loginDetails', JSON.stringify(item));
    localStorage.setItem('token', token);
  }

  getloginDetails() {
    var loginDetails = localStorage.getItem('loginDetails')
    return { loginDetails: JSON.parse(loginDetails), token: localStorage.getItem('token') };
  }

  headers() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return { headers }
  }
}
