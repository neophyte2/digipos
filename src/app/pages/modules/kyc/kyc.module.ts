import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { KycComponent } from './components/layout/kyc.component';
import { NgOtpInputModule } from 'ng-otp-input';
import { NgSelectModule } from '@ng-select/ng-select';
import { HideDataPipe } from 'src/app/shared/utils/hide-data.pipe';

const routes: Routes = [
  {
    path: '', component: KycComponent,
  }
];

@NgModule({
  declarations: [
    KycComponent,
    HideDataPipe
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
export class KycModule { }
