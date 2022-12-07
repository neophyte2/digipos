import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GeneralService } from 'src/app/shared/services/general.service';
import { acctType } from 'src/app/shared/utils/data';
import { VALIDEMAILREGEX } from 'src/app/shared/utils/utils';
import { ClientService } from '../../service/client.service';

@Component({
  selector: 'dp-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpomponent implements OnInit, OnDestroy {
  
  loader: any = {
    btn: {
      login: false,
    },
  };
  hidePassword = true;
  hideCPassword = true;
  loginForm!: FormGroup;
  accountType = acctType;
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
  ) {

  }

  ngOnInit(): void {
    this.ngOnForms();
    this.preferredCountries = [CountryISO.Nigeria];
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

  login() {
    if (this.loginForm.invalid) {
      this.genSrv.sweetAlertError('The username / password field is empty');
    } else {
      this.loader.btn.login = true;
      this.gustSrv.login(this.loginForm.getRawValue()).pipe(takeUntil(this.unsubcribe)).subscribe((data: any) => {
        if (data.status === 200) {
          this.genSrv.storeUser(data.response)
          setTimeout(() => {
            this.router.navigate(["/auth/dashboard"]);
            this.loader.btn.login = false;
          }, 1000);
        }
      }, (err) => {
        let msg = err
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
