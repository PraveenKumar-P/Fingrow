import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { config } from 'src/assets/configuration/configURL';

@Injectable({
  providedIn: 'root'
})

export class LoanService {
  public apiURL: any;
  public headers: HttpHeaders;
  public token: any;
  public loanApplicant: any = {};

  constructor(private http: HttpClient) {
    this.apiURL = config.apiUrl;
    this.token = localStorage.getItem("token");
    this.headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  }

  setLoanApplicant(loan) {
    this.loanApplicant = loan;
  }

  getLoanApplicant() {
    return this.loanApplicant;
  }
  
  localStorageClear() {
    this.setLoanApplicant({});
    localStorage.removeItem("Co-applicant");
  }

  getAllLoans(query: any): Observable<any> {
    return this.http.get(this.apiURL + 'GetAllLoans', { headers: this.postHeaders(), params: query });
  }

  getAllLoansType(query: any): Observable<any> {
    return this.http.get(this.apiURL + 'GetAllLoanType', { headers: this.postHeaders(), params: query });
  }

  getLoanApplication(query: any): Observable<any> {
    return this.http.get(this.apiURL + 'GetLoanApplication', { headers: this.postHeaders(), params: query });
  }

  getLoanDocs(query: any): Observable<any> {
    return this.http.get(this.apiURL + 'GetLoanDocs', { headers: this.postHeaders(), params: query });
  }

  getCoapplicantDetails(query: any): Observable<any> {
    return this.http.get(this.apiURL + 'GetCoapplicantDetails', { headers: this.postHeaders(), params: query });
  }

  getCoApplicantById(query: any): Observable<any> {
    return this.http.get(this.apiURL + 'GetCoApplicantById', { headers: this.postHeaders(), params: query });
  }

  getCoapplicantLoanDocs(query: any): Observable<any> {
    return this.http.get(this.apiURL + 'GetCoapplicantLoanDocs', { headers: this.postHeaders(), params: query });
  }

  createLoan(query: any): Observable<any> {
    return this.http.post(this.apiURL + 'CreateLoan', query, { headers: this.postHeaders() });
  }

  createCoapplicant(query: any): Observable<any> {
    return this.http.post(this.apiURL + 'CreateCoapplicant', query, { headers: this.postHeaders() });
  }

  createMultipleCoapplicants(query: any): Observable<any> {
    return this.http.post(this.apiURL + 'CreateCoapplicants', query, { headers: this.postHeaders() });
  }

  removeLoanDocument(query: any): Observable<any> {
    return this.http.post(this.apiURL + 'RemoveLoanDocument', {}, { headers: this.postHeaders(), params: query });
  }

  createLoanDocs(query: any): Observable<any> {
    return this.http.post(this.apiURL + 'CreateLoanDocs', query, { headers: this.postHeaders() });
  }

  updateLoan(query: any): Observable<any> {
    return this.http.post(this.apiURL + 'UpdateLoan', query, { headers: this.postHeaders() });
  }

  removeCoapplicant(query: any): Observable<any> {
    return this.http.post(this.apiURL + 'RemoveCoapplicant', {}, { headers: this.postHeaders(), params: query });
  }

  removeCoapplicantDocument(query: any): Observable<any> {
    return this.http.post(this.apiURL + 'RemoveCoapplicantDocument', {}, { headers: this.postHeaders(), params: query });
  }

  updateLoanApplicationDetails(query: any): Observable<any> {
    return this.http.post(this.apiURL + 'UpdateLoanApplicationDetails', query, { headers: this.postHeaders() });
  }

  postHeaders() {
    return new HttpHeaders({
      Authorization: "Bearer " + this.token
    });
  }
}
