import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { LoanService } from 'src/app/sevices/loan.service';
import { LoanCreateEditComponent } from '../loans/loan-create-edit/loan-create-edit.component';
// import { Observable } from 'rxjs/Observable';

export interface CanComponentDeactivate {
  confirm(): boolean;
}

@Injectable()
export class DeactivateGuard implements CanDeactivate<LoanCreateEditComponent> {

  constructor(private loanService: LoanService) {
  }

  canDeactivate(component: LoanCreateEditComponent) {
    if (component.appliantForm.dirty && !component.appliantForm.valid && component.active !== 0) {
      localStorage.removeItem("Co-applicant");
      this.loanService.setLoanApplicant({});

      return window.confirm('You have unsaved changes! If you leave, your changes will be lost.')
    }
    return true;
  }
}










