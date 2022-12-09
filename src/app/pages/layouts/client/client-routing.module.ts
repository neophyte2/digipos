import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInomponent } from './components/sign-in/sign-in.component';
import { SignUpomponent } from './components/sign-up/sign-up.component';
import { VerifyComponent } from './components/verify/verify.component';

const routes: Routes = [
  {
    path: "",
    component: SignInomponent
  },
  {
    path: "signup",
    component: SignUpomponent
  },
  {
    path: "verify/:name",
    component: VerifyComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
