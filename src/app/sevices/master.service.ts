import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { config } from 'src/assets/configuration/configURL';

@Injectable({
  providedIn: 'root'
})

export class MasterService {
  public apiURL: any;
  public headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.apiURL = config.apiUrl;
    this.headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  }

  getAllEducationTypes(query: any): Observable<any> {
    return this.http.get(this.apiURL + 'GetAllEducationTypes', { headers: this.headers, params: query });
  }

  getAllDurationofStayTypes(query: any): Observable<any> {
    return this.http.get(this.apiURL + 'GetAllDurationofStayTypes', { headers: this.headers, params: query });
  }

  getAllRelationshipTypes(query: any): Observable<any> {
    return this.http.get(this.apiURL + 'GetAllRelationshipTypes', { headers: this.headers, params: query });
  }

  getAllResidenceTypes(query: any): Observable<any> {
    return this.http.get(this.apiURL + 'GetAllResidenceTypes', { headers: this.headers, params: query });
  }

  getAllYearsofExperience(query: any): Observable<any> {
    return this.http.get(this.apiURL + 'GetAllYearsofExperience', { headers: this.headers, params: query });
  }

  getAllEmployeementTypes(query: any): Observable<any> {
    return this.http.get(this.apiURL + 'GetAllEmployeementType', { headers: this.headers, params: query });
  }

  getAllDocumentType(query: any): Observable<any> {
    return this.http.get(this.apiURL + 'GetAllDocumentType', { headers: this.headers, params: query });
  }

  getAllAreaTypes(query: any): Observable<any> {
    return this.http.get(this.apiURL + 'GetAllAreaTypes', { headers: this.headers, params: query });
  }
}
