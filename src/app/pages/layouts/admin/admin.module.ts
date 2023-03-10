import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from './header/header.component';
import { AsideComponent } from './aside/aside.component';
import { ChartsModule } from 'ng2-charts';
import { KycComponent } from '../../modules/kyc/components/layout/kyc.component';
import { TransactionComponent } from '../../modules/transactions/components/layout/transaction.component';

@NgModule({
  declarations: [
    AdminLayoutComponent,
    DashboardComponent,
    HeaderComponent,
    AsideComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    ChartsModule,
    ReactiveFormsModule,
    AdminRoutingModule,
  ],
})
export class AdminModule { }
