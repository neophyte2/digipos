import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuditLogsComponent } from './components/layout/audit-log.component';

const routes: Routes = [
  {
    path: '',
    component: AuditLogsComponent
  },
];

@NgModule({
  declarations: [
    AuditLogsComponent
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
export class AuditLogModule { }
