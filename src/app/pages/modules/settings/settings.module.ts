import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgOtpInputModule } from 'ng-otp-input';
import { NgSelectModule } from '@ng-select/ng-select';
import { LayoutComponent } from './components/layout/layout.component';
import { ProfileComponent } from './components/profile/profile.component';
import { TeamComponent } from './components/teams/teams.component';

const routes: Routes = [
  {
    path: '', component: LayoutComponent,
  }
];

@NgModule({
  declarations: [
    LayoutComponent,
    ProfileComponent,
    TeamComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    NgOtpInputModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class SettingsModule { }
