import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { KycComponent } from './components/layout/kyc.component';

const routes: Routes = [
  {
    path: '', component: KycComponent,
  }
];

@NgModule({
  declarations: [
    KycComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class KycModule { }
