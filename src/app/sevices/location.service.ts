import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { config } from "../../assets/configuration/configURL";

@Injectable({
  providedIn: 'root'
})

export class LocationService {
  public apiURL: any;
  public headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.apiURL = config.apiUrl;
    this.headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  }

  GetAllCountries(query: any): Observable<any> {
    return this.http.get(this.apiURL + 'GetAllCountries', { headers: this.headers, params: query });
  }

  GetAllStates(query: any): Observable<any> {
    return this.http.get(this.apiURL + 'GetAllStates', { headers: this.headers, params: query });
  }

  GetAllCity(query: any): Observable<any> {
    return this.http.get(this.apiURL + 'GetAllCity', { headers: this.headers, params: query });
  }
}
