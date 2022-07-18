import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';

import { config } from "../../assets/configuration/configURL";

@Injectable({
  providedIn: 'root'
})

export class CustomerService {
  public apiURL: any;
  public token: any;

  constructor(private http: HttpClient) {
    this.apiURL = config.apiUrl;
    this.token = localStorage.getItem("token");
  }

  getAllEmployeementType(query: any): Observable<any> {
    return this.http.get(this.apiURL + 'GetAllEmployeementType', { headers: this.headers(), params: query });
  }

  getAllTenure(query: any): Observable<any> {
    return this.http.get(this.apiURL + 'GetAllTenure', { headers: this.headers(), params: query });
  }

  customerCreation(body: any): Observable<any> {
    return this.http.post(this.apiURL + 'CustomerCreation', body, { headers: this.headers() });
  }

  headers() {
    return new HttpHeaders({
      Authorization: "Bearer " + this.token
    });
  }
}
