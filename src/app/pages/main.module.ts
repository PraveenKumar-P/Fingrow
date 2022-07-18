import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { NgbDateParserFormatter, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { Ng5SliderModule } from 'ng5-slider';
import { NgxTypeaheadModule } from "ngx-typeahead";

import { UserCreateEdiComponent } from './users/user-create-edit/user-create-edit.component';
import { UserProfileComponent } from './users/user-profile/user-profile.component';
import { RoleListComponent } from './roles/role-list/role-list.component';
import { RoleCreateEditComponent } from './roles/role-create-edit/role-create-edit.component';
import { RolePermissionComponent } from './roles/role-permission/role-permission.component';
import { CommonHelper } from '../helper/common.helper';
import { UserListComponent } from './users/user-list/user-list.component';
import { NgbDateCustomParserFormatter } from './users/user-create-edit/dateformat';
import { EligibilityCheckComponent } from './eligibility-check/eligibility-check.component';
import { CustomerCreateEditComponent } from './customers/customer-create-edit/customer-create-edit.component';
import { CustomerListComponent } from './customers/customer-list/customer-list.component';
import { CustomerLoanListComponent } from './loans/customer-loan-list/customer-loan-list.component';
import { LoanCreateEditComponent } from './loans/loan-create-edit/loan-create-edit.component';
import { EmiCalculatorComponent } from './loans/emi-calculator/emi-calculator.component';
import { CoApplicantCreateEditComponent } from './loans/co-applicant-create-edit/co-applicant-create-edit.component';
import { DirectiveModule } from '../directive/directive.module';

const routes: Routes = [
  { path: "user-create-edit", component: UserCreateEdiComponent },
  { path: "user-profile", component: UserProfileComponent },
  { path: "user-list", component: UserListComponent },

  { path: "role-list", component: RoleListComponent },
  { path: "role-create-edit", component: RoleCreateEditComponent },
  { path: "role-permission", component: RolePermissionComponent },

  { path: "eligibility-check", component: EligibilityCheckComponent },

  { path: "customer-create-edit", component: CustomerCreateEditComponent },
  { path: "customer-list", component: CustomerListComponent },

  { path: "customer-loan-list", component: CustomerLoanListComponent },
  { path: "loan-create-edit", component: LoanCreateEditComponent },
  { path: "emi-calculator", component: EmiCalculatorComponent },
  { path: "co-applicant", component: CoApplicantCreateEditComponent }
];

@NgModule({
  declarations: [
    UserCreateEdiComponent,
    UserProfileComponent,
    RoleListComponent,
    RoleCreateEditComponent,
    RolePermissionComponent,
    UserListComponent,
    EligibilityCheckComponent,
    CustomerCreateEditComponent,
    CustomerListComponent,
    CustomerLoanListComponent,
    LoanCreateEditComponent,
    EmiCalculatorComponent,
    CoApplicantCreateEditComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    NgbModule,
    FormsModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    NgxSpinnerModule,
    NgMultiSelectDropDownModule,
    ModalModule.forRoot(),
    Ng5SliderModule,
    DirectiveModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    NgxTypeaheadModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [
    DatePipe,
    CommonHelper,
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter },
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})

export class MainModule { }