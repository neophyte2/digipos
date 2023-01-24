import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientGuard } from '../client/service/client-guard.service';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    //  canActivate: [ClientGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
