import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TerminalComponent } from './components/layout/terminal.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from 'src/app/shared/shared.module';
import { ViewTerminalComponent } from './components/view-terminal/view-terminal.component';
import { AppRoleGuard } from '../../layouts/admin/service/app-role.guard';

const routes: Routes = [
  {
    path: '', component: TerminalComponent,
    canActivate:[AppRoleGuard],
    data: {
      appPermission: 'TERMINAL|READ'
    }
  },
  {
    path: ':id', component: ViewTerminalComponent,
    canActivate:[AppRoleGuard],
    data: {
      appPermission: 'TERMINAL|READ'
    }
  }
];

@NgModule({
  declarations: [
    TerminalComponent,
    ViewTerminalComponent,
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
export class TerminalModule { }
