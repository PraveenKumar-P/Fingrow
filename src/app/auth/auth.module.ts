import { NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { NgbDateParserFormatter, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from "ngx-spinner";

import { LoginComponent } from './login/login.component';
import { LoginService } from '../Sevices/login.service';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { CommonHelper } from '../helper/common.helper';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { AuthGuard } from '../sevices/auth.guard';
import { CheckOtpComponent } from './check-otp/check-otp.component';
import { UserAuthorizationComponent } from './user-authorization/user-authorization.component';
import { AgentRegistrationComponent } from './agent-registration/agent-registration.component';
import { EAgreementComponent } from '../pages/e-agreement/e-agreement.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DirectiveModule } from '../directive/directive.module';
import { NgbDateCustomParserFormatter } from '../pages/users/user-create-edit/dateformat';


const routes: Routes = [
  { path: "", redirectTo: "login", pathMatch: 'full' },
  { path: "login", component: LoginComponent },
  { path: "forgot-password", component: ForgotPasswordComponent },
  { path: "change-password", component: ChangePasswordComponent, canActivate: [AuthGuard], },
  { path: "check-otp", component: CheckOtpComponent },
  { path: "user-authorization/:usercode", component: UserAuthorizationComponent },
  { path: "agent-signup", component: AgentRegistrationComponent }
];

@NgModule({
  declarations: [
    LoginComponent,
    ForgotPasswordComponent,
    ChangePasswordComponent,
    CheckOtpComponent,
    UserAuthorizationComponent,
    AgentRegistrationComponent,
    EAgreementComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    NgbModule,
    NgxSpinnerModule,
    DirectiveModule,
    ModalModule.forRoot()
  ],
  providers: [
    LoginService,
    CommonHelper,
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }
  ],
  exports: [
    
    RouterModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class AuthModule { }
