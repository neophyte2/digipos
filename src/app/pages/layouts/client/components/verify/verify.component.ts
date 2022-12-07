import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgOtpInputConfig } from 'ng-otp-input';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GeneralService } from 'src/app/shared/services/general.service';
import { VALIDEMAILREGEX } from 'src/app/shared/utils/utils';
import { ClientService } from '../../service/client.service';

@Component({
  selector: 'dp-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent implements OnInit, OnDestroy {

  loader: any = {
    btn: {
      login: false,
    },
  };
  otp = '';
  loginForm!: FormGroup;
  private unsubcribe = new Subject<void>();

  //OTP
  config :NgOtpInputConfig = {
    allowNumbersOnly: true,
    length: 4,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '0'
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private gustSrv: ClientService,
    private genSrv: GeneralService,
  ) {
  }

  ngOnInit(): void {
    this.ngOnForms();
  }

  // Get login Form Value
  get lf() {
    return this.loginForm.controls;
  }

  ngOnForms() {
    this.loginForm = this.fb.group({
      username: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(VALIDEMAILREGEX),
        ]),
      ],
      password: ["", Validators.required],
    });
  }

  onOtpChange(otp:any) {
    this.otp = otp;
  }

  ngOnDestroy() {
    this.unsubcribe.next();
    this.unsubcribe.complete();
  }



}
