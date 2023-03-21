import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChargebackComponent } from './components/layout/chargeback.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from 'src/app/shared/shared.module';
import { ViewChargebackComponent } from './components/view-chargeback/view-chargeback.component';

const routes: Routes = [
  {
    path: '', component: ChargebackComponent,
  },
  {
    path: ':id', component: ViewChargebackComponent,
  }
];

@NgModule({
  declarations: [
    ChargebackComponent,
    ViewChargebackComponent,
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
export class ChargenModule { }
