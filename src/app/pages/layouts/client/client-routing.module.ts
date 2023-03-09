import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AcceptInviteComponent } from './components/accept-invite/accept-invite.component';
import { ForgetPasswordComponent } from './components/forgot-password/forgot-password.component';
import { SignInomponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { VerifyComponent } from './components/verify/verify.component';

const routes: Routes = [
  {
    path: "",
    component: SignInomponent
  },
  {
    path: "signup",
    component: SignUpComponent
  },
  {
    path: "verify-enroll",
    component: VerifyComponent
  },
  {
    path: "verify-reset",
    component: VerifyComponent
  },
  {
    path: "forget-password",
    component: ForgetPasswordComponent
  },
  {
    path: "accept-invite",
    component: AcceptInviteComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
