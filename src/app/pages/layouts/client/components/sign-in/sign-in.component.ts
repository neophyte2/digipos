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
  selector: 'dp-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInomponent implements OnInit, OnDestroy {

  location: any
  deviceInfo: any
  loader: any = {
    btn: {
      login: false,
    },
  };
  loginType = 'email'
  hidePassword = true;
  loginForm!: FormGroup;
  private unsubcribe = new Subject<void>();

  //Phone number Internationalization
  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private gustSrv: ClientService,
    private genSrv: GeneralService,
    private deviceService: DeviceDetectorService
  ) {
    // redirect to home if already logged in
    if (this.genSrv.currentUserValue) {
      this.router.navigate(["/auth/dashboard"]);
    }
  }

  ngOnInit(): void {
    this.getGeoLocation()
    this.preferredCountries = [CountryISO.Nigeria];
    this.deviceInfo = this.deviceService.getDeviceInfo();
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
          Validators.pattern(VALIDEMAILREGEX),
        ]),
      ],
      username2: [""],
      password: ["", Validators.required],
    });
  }

  getGeoLocation() {
    this.gustSrv.getLocation().pipe(takeUntil(this.unsubcribe)).subscribe((data: any) => {
      this.location = data
    })
  }

  changeLoginType() {
    if (this.loginType === 'phone') {
      this.loginForm.controls['username2'].setValidators([Validators.required]);
      this.loginForm.controls['username'].setValidators([]);
      this.loginForm.controls['username'].setValue('');
    } else if (this.loginType === 'email') {
      this.loginForm.controls['username'].setValidators([Validators.required]);
      this.loginForm.controls['username2'].setValidators([]);
      this.loginForm.controls['username2'].setValue('');
    }
  }

  result(): any {
    let payload
    payload = {
      password: this.lf['password'].value,
      username: this.lf['username'].value,
      appVersion: '',
      customerPushId: '',
      countryCode: this.location?.calling_code,
      latitude: this.location?.latitude,
      ipAddress: this.location.ip,
      source: 'Web',
      devicePlatform: this.deviceInfo.deviceType,
      deviceId: '',
      deviceName: this.deviceInfo.device,
      longitude: this.location.longitude,
    }
    return payload
  }

  login() {
    this.loader.btn.login = true;
    let payload = this.result()
    if (this.loginForm.invalid) {
      this.genSrv.sweetAlertError('The username / password field is empty');
    } else {
      this.loader.btn.login = true;
      this.gustSrv.login(payload).pipe(takeUntil(this.unsubcribe)).subscribe((data: any) => {
        if (data.responseCode === '00') {
          this.genSrv.storeUser(data)
          this.genSrv.storeVerification(data.verifications)
          setTimeout(() => {
            this.router.navigate(["/auth/dashboard"]);
            this.loader.btn.login = false;
          }, 1000);
        } else {
          let msg = data.responseMessage
          this.genSrv.sweetAlertError(msg);
          this.loader.btn.login = false;
        }
      }, (err) => {
        let msg = err.responseMessage
        this.genSrv.sweetAlertError(msg);
        this.loader.btn.login = false;
      })
    }
  }

  ngOnDestroy() {
    this.unsubcribe.next();
    this.unsubcribe.complete();
  }

}
