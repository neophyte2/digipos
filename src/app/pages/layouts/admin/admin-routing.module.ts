import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientGuard } from '../client/service/client-guard.service';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [ClientGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      // {
      //   path: 'kyc',
      //   loadChildren: () => import('../../modules/kyc/kyc.module').then(m => m.KycModule)
      // },
      {
        path: 'transactions',
        // canActivate: [KycCompleteGuard],
        loadChildren: () => import('../../modules/transactions/transaction.module').then(m => m.TransactionModule)
      },
      {
        path: 'refund',
        // canActivate: [KycCompleteGuard],
        loadChildren: () => import('../../modules/refund/refund.module').then(m => m.RefundModule)
      },
      {
        path: 'chargeback',
        // canActivate: [KycCompleteGuard],
        loadChildren: () => import('../../modules/chargeback/chargeback.module').then(m => m.ChargenModule)
      },
      {
        path: 'settlement',
        // canActivate: [KycCompleteGuard],
        loadChildren: () => import('../../modules/settlement/settlement.module').then(m => m.SettlementModule)
      },
      {
        path: 'terminal',
        // canActivate: [KycCompleteGuard],
        loadChildren: () => import('../../modules/terminal/terminal.module').then(m => m.TerminalModule)
      },
      {
        path: 'settings',
        // canActivate: [KycCompleteGuard],
        loadChildren: () => import('../../modules/settings/settings.module').then(m => m.SettingsModule)
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
