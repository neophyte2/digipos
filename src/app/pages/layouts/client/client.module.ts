import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClientRoutingModule } from './client-routing.module';
import { SignInomponent } from './components/sign-in/sign-in.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SignUpomponent } from './components/sign-up/sign-up.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { NgSelectModule } from '@ng-select/ng-select';
import { VerifyComponent } from './components/verify/verify.component';
import { NgOtpInputModule } from 'ng-otp-input';

@NgModule({
  declarations: [
    SignInomponent,
    SignUpomponent,
    VerifyComponent,
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
