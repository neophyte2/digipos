import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgOtpInputModule } from 'ng-otp-input';
import { NgSelectModule } from '@ng-select/ng-select';
import { LayoutComponent } from './components/layout/layout.component';
import { ProfileComponent } from './components/profile/profile.component';
import { TeamComponent } from './components/teams/teams.component';
import { UsersComponent } from './components/teams/users/users.component';
import { InvitesComponent } from './components/teams/invites/invites.component';
import { ManageRoleComponent } from './components/teams/manage-role/manage-role.component';
import { ViewRoleComponent } from './components/teams/view-role/view-role.component';

const routes: Routes = [
  {
    path: '', component: LayoutComponent,
  },
  {
    path: 'manage-roles', component: ManageRoleComponent,
  },
  {
    path: 'view-role/:id', component: ViewRoleComponent,
  }
];

@NgModule({
  declarations: [
    TeamComponent,
    UsersComponent,
    LayoutComponent,
    InvitesComponent,
    ProfileComponent,
    ViewRoleComponent,
    ManageRoleComponent,
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