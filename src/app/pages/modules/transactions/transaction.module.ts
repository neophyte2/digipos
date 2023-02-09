import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TransactionComponent } from './components/layout/transaction.component';

const routes: Routes = [
  {
    path: '', component: TransactionComponent,
  }
];

@NgModule({
  declarations: [
    TransactionComponent,
  ],

  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class TransactionModule { }
