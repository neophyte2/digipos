import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClientRoutingModule } from './client-routing.module';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { NgSelectModule } from '@ng-select/ng-select';
import { VerifyComponent } from './components/verify/verify.component';
import { NgOtpInputModule } from 'ng-otp-input';
import { ForgetPasswordComponent } from './components/forgot-password/forgot-password.component';
import { AcceptInviteComponent } from './components/accept-invite/accept-invite.component';
import { ResponseComponent } from './components/response/response.component';
import { TermsConditionComponent } from './components/terms-condition/terms-condition.component';

@NgModule({
  declarations: [
    SignInComponent,
    SignUpComponent,
    VerifyComponent,
    ResponseComponent,
    AcceptInviteComponent,
    TermsConditionComponent,
    ForgetPasswordComponent,
  ],
  imports: [
    FormsModule,
    SharedModule,
    CommonModule,
    NgSelectModule,
    NgOtpInputModule,
    ReactiveFormsModule,
    ClientRoutingModule,
    NgxIntlTelInputModule,
  ],
})
export class ClientModule { }
