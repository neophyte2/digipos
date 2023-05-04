import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GeneralService } from 'src/app/shared/services/general.service';
import { VALIDEMAILREGEX } from 'src/app/shared/utils/utils';
import { ClientService } from '../../service/client.service';

@Component({
  selector: 'dp-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgetPasswordComponent implements OnInit, OnDestroy {

  loader: any = {
    btn: {
      reset: false,
    },
  };
  resetEmailForm!: FormGroup;
  private unsubcribe = new Subject<void>();

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
    return this.resetEmailForm.controls;
  }

  ngOnForms() {
    this.resetEmailForm = this.fb.group({
      customerEmail: [
        "",
        Validators.compose([
          Validators.pattern(VALIDEMAILREGEX), Validators.required
        ]),
      ],
    });
  }

  reset() {
    let payload = {
      ...this.resetEmailForm.getRawValue()
    }
    this.loader.btn.reset = true;
    this.gustSrv.initiateReset(payload).pipe(takeUntil(this.unsubcribe)).subscribe((data: any) => {
      if (data.responseCode === '00') {
        setTimeout(() => {
          this.router.navigate(["/verify-reset"], { queryParams: { email: this.lf['customerEmail'].value, } });
          this.genSrv.sweetAlertSuccess(data.responseMessage);
          this.loader.btn.reset = false;
        }, 1000);
      } else {
        let msg = data.responseMessage
        this.genSrv.sweetAlertError(msg);
        this.loader.btn.reset = false;
      }
    }, (err) => {
      let msg = err.responseMessage
      this.genSrv.sweetAlertError(msg);
      this.loader.btn.reset = false;
    })
  }

  ngOnDestroy() {
    this.unsubcribe.next();
    this.unsubcribe.complete();
  }

}
