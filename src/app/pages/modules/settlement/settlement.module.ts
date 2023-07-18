import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from 'src/app/shared/shared.module';
import { SettlementComponent } from './components/layout/settlement.component';
import { ViewSettlementComponent } from './components/view-settlement/view-settlement.component';
import { AppRoleGuard } from '../../layouts/admin/service/app-role.guard';

const routes: Routes = [
  {
    path: '', component: SettlementComponent,
    canActivate:[AppRoleGuard],
    data: {
      appPermission: 'SETTLEMENT|READ'
    }
  },
  {
    path: ':id', component: ViewSettlementComponent,
    canActivate:[AppRoleGuard],
    data: {
      appPermission: 'SETTLEMENT|READ'
    }
  }
];

@NgModule({
  declarations: [
    SettlementComponent,
    ViewSettlementComponent
  ],

  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    NgSelectModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class SettlementModule { }
