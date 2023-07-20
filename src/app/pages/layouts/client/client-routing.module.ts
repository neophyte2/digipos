import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AcceptInviteComponent } from './components/accept-invite/accept-invite.component';
import { ForgetPasswordComponent } from './components/forgot-password/forgot-password.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { VerifyComponent } from './components/verify/verify.component';
import { LivenessComponent } from './components/liveness/liveness.component';

const routes: Routes = [
  {
    path: "",
    component: SignInComponent
  },
  // {
  //   path: "signup",
  //   component: SignUpComponent
  // },
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
  {
    path: "check",
    component: LivenessComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
