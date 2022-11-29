import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClientRoutingModule } from './client-routing.module';
import { SignInomponent } from './components/sign-in/sign-in.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    SignInomponent,
  ],
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ClientRoutingModule,
  ],
})
export class ClientModule { }
