import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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

  otp = '';
  name = ''
  loader: any = {
    btn: {
      vef: false, //verify enroll form
      vrf: false, //verify reset form
      ro: false //reset otp
    },
  };
  veriftyEnrollForm!: FormGroup;
  veriftyResetForm!: FormGroup;
  private unsubcribe = new Subject<void>();

  //OTP
  config: NgOtpInputConfig = {
    allowNumbersOnly: true,
    length: 4,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '0'
  };

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private gustSrv: ClientService,
    private genSrv: GeneralService,
  ) {
    this.name = window.location.pathname;
  }

  ngOnInit(): void {
    this.ngOnForms();
  }

  // Get login Form Value
  get vef() {
    return this.veriftyEnrollForm.controls;
  }

  ngOnForms() {
    this.veriftyEnrollForm = this.fb.group({
      customerEmail: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(VALIDEMAILREGEX),
        ]),
      ],
      customerOtp: [""],
      referralCode: ['']
    });
  }

  onOtpChange(otp: any) {
    if (otp.length === 4) {
      this.otp = otp;
    } else {
      this.otp = ''
    }
  }

  verifyEnroll() {
    let payload = {
      customerEmail: this.vef['customerEmail'].value,
      customerOtp: this.otp,
      referralCode: this.vef['referralCode'].value,
    }
    this.loader.btn.vef = true;
    this.gustSrv.completeEnrollment(payload).pipe(takeUntil(this.unsubcribe)).subscribe((data: any) => {
      if (data.responseCode === '00') {
        setTimeout(() => {
          this.genSrv.sweetAlertSuccess(data.responseMessage);
          this.router.navigate(["/"]);
          this.loader.btn.vef = false;
        }, 1000);
      } else {
        let msg = data.responseMessage
        this.genSrv.sweetAlertError(msg);
        this.loader.btn.vef = false;
      }
    }, (err) => {
      console.log(err);
      let msg = err
      this.genSrv.sweetAlertError(msg);
      this.loader.btn.vef = false;
    })
  }

  resendotp() {
    let name = this.vef['customerEmail'].value
    if (!name) {
      this.genSrv.sweetAlertError('Kindly Input Your Email');
    } else {
      this.loader.btn.ro = true;
      let payload = {
        customerEmail: name
      }
      this.gustSrv.resetOtp(payload).pipe(takeUntil(this.unsubcribe)).subscribe((data: any) => {
        console.log(data);
        if (data.responseCode === '00') {
          this.genSrv.sweetAlertSuccess(data.responseMessage);
          this.loader.btn.ro = false;
        } else {
          let msg = data.responseMessage
          this.genSrv.sweetAlertError(msg);
          this.loader.btn.ro = false;
        }
      }, (err) => {
        console.log(err);
        let msg = err
        this.genSrv.sweetAlertError(msg);
        this.loader.btn.ro = false;
      })
    }

  }

  verifyReset() {

  }

  ngOnDestroy() {
    this.unsubcribe.next();
    this.unsubcribe.complete();
  }

}
