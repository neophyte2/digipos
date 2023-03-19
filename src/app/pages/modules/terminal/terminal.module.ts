import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TerminalComponent } from './components/layout/terminal.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from 'src/app/shared/shared.module';
import { ViewTerminalComponent } from './components/view-terminal/view-terminal.component';

const routes: Routes = [
  {
    path: '', component: TerminalComponent,
  },
  {
    path: ':id', component: ViewTerminalComponent,
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
export class TerminalnModule { }
