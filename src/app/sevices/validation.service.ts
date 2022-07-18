import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { config } from 'src/assets/configuration/configURL';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  public apiURL: any;
  public token: any;

  constructor(private http: HttpClient) {
    this.apiURL = config.apiUrl;
    this.token = localStorage.getItem("token");
  }

  getUserEligibilityCheck(query: any): Observable<any> {
    return this.http.get(this.apiURL + 'GetUserEligibility', { headers: this.headers(), params: query });
  }

  userEligibilityCreation(item: any): Observable<any> {
    return this.http.post(this.apiURL + 'UserEligibilityCreation', item, { headers: this.headers() });
  }

  getAllLoansType(query: any): Observable<any> {
    return this.http.get(this.apiURL + 'GetAllLoanType', { headers: this.headers(), params: query });
  }

  userEligibilityStatus(item: any): Observable<any> {
    return this.http.post(this.apiURL + 'UserEligibilityStatus', item, { headers: this.headers() });
  }

  headers() {
    return new HttpHeaders({
      Authorization: "Bearer " + this.token
    });
  }
}
