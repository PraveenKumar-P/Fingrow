import { Injectable } from '@angular/core';
import {
  CanActivate, CanActivateChild, CanDeactivate, CanLoad, Route,
  UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { LoanCreateEditComponent } from '../pages/loans/loan-create-edit/loan-create-edit.component';
import { LoanService } from './loan.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate, CanActivateChild, CanLoad, CanDeactivate<LoanCreateEditComponent> {

  constructor(private router: Router, private loanService: LoanService) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.isLoggedIn();
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.isLoggedIn();
  }

  // canDeactivate(
  //   component: unknown,
  //   currentRoute: ActivatedRouteSnapshot,
  //   currentState: RouterStateSnapshot,
  //   nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   return this.isLoggedIn();
  // }

  canDeactivate(component: LoanCreateEditComponent) {
    if ((component.appliantForm.dirty && !component.appliantForm.valid) && component.active !== 0 || component.coApplicantList.length > 0) {
      localStorage.removeItem("Co-applicant");
      this.loanService.setLoanApplicant({});
      return window.confirm('You have unsaved changes! If you leave, your changes will be lost.')
    }
    return true;
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.isLoggedIn();
  }

  isLoggedIn() {
    if (localStorage.getItem('isLoggedIn') === 'active') {
      // debugger;
      // const userDetails =this.loginService.getloginDetails();
      // console.log(userDetails.loginDetails);
      // this.userService.getUserDetailsById(userDetails.loginDetails.userid).subscribe(res => {
      //   console.log(res);
      //   debugger;
      // });
      return true;
    } else {
      localStorage.clear();
      this.router.navigate(['auth/login']);
      return false;
    }
  }
}
