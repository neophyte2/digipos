import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { KycComponent } from '../../modules/kyc/kyc.component';
import { HeaderComponent } from './header/header.component';
import { AsideComponent } from './aside/aside.component';

@NgModule({
  declarations: [
    AdminLayoutComponent,
    DashboardComponent,
    HeaderComponent,
    AsideComponent,
    KycComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    AdminRoutingModule,
  ],
})
export class AdminModule { }
