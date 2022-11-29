import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInomponent } from './components/sign-in/sign-in.component';

const routes: Routes = [
  {
    path: "sign-in",
    component: SignInomponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
