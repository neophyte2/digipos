import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClientRoutingModule } from './client-routing.module';
import { SignInomponent } from './components/sign-in/sign-in.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { NgSelectModule } from '@ng-select/ng-select';
import { VerifyComponent } from './components/verify/verify.component';
import { NgOtpInputModule } from 'ng-otp-input';
import { ForgetPasswordComponent } from './components/forgot-password/forgot-password.component';
import { AcceptInviteComponent } from './components/accept-invite/accept-invite.component';

@NgModule({
  declarations: [
    SignInomponent,
    SignUpComponent,
    VerifyComponent,
    ForgetPasswordComponent,
    AcceptInviteComponent,
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
