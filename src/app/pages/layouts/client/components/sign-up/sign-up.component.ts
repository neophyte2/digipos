import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GeneralService } from 'src/app/shared/services/general.service';
import { acctType, verifyType } from 'src/app/shared/utils/data';
import { REMOVESPACESONLY, VALIDEMAILREGEX } from 'src/app/shared/utils/utils';
import { ClientService } from '../../service/client.service';

@Component({
  selector: 'dp-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpomponent implements OnInit, OnDestroy {

  loader: any = {
    btn: {
      signup: false,
    },
  };
  hidePassword = true;
  hideCPassword = true;
  signupForm!: FormGroup;
  accountType = acctType;
  verificationType = verifyType;
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
  get sf() {
    return this.signupForm.controls;
  }

  ngOnForms() {
    this.signupForm = this.fb.group({
      customerEmail: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(VALIDEMAILREGEX),
        ]),
      ],
      customerFullName: ["", Validators.required],
      customerBusinessName: ["", REMOVESPACESONLY],
      customerAccountType: ["", Validators.required],
      customerVerificationType: ["", Validators.required],
      customerPhone: ["", Validators.required],
      customerPassword: ["", Validators.required],
      customerConfirmPassword: ["", Validators.required],
    });
  }

  onChangeAcctType(event: any) {
    if (event?.value === 'BUSINESS') {
      this.signupForm.controls['customerBusinessName'].setValidators([Validators.required]);
    } else if (event?.value === 'MERCHANT' || event === undefined) {
      this.signupForm.controls['customerBusinessName'].setValidators([]);
      this.signupForm.controls['customerBusinessName'].setValue('');
    }
  }

  signup() {
    const payload = {
      customerEmail: this.sf['customerEmail'].value,
      customerFullName: this.sf['customerFullName'].value,
      customerBusinessName: this.sf['customerBusinessName'].value,
      customerAccountType: this.sf['customerAccountType'].value,
      customerVerificationType: this.sf['customerVerificationType'].value,
      customerPhone: this.sf['customerPhone'].value.e164Number,
      customerPassword: this.sf['customerPassword'].value,
      customerConfirmPassword: this.sf['customerConfirmPassword'].value,
    }
    this.loader.btn.signup = true;
    this.gustSrv.signup(payload).pipe(takeUntil(this.unsubcribe)).subscribe((data: any) => {
      console.log(data);
      if (data.responseCode === '00') {
        this.genSrv.storeUser(data.response)
        setTimeout(() => {
          this.router.navigate(["/verify/enroll"]);
          this.loader.btn.signup = false;
        }, 1000);
      }else{
        let msg = data.responseMessage
        this.genSrv.sweetAlertError(msg);
        this.loader.btn.signup = false;
      }
    }, (err) => {
      console.log(err);
      let msg = err
      this.genSrv.sweetAlertError(msg);
      this.loader.btn.signup = false;
    })
  }

  /**
  * password match validations
  */
  get matchPassword() {
    const vaildPasswordInput = this.sf['customerPassword'].value !== this.sf['customerConfirmPassword'].value;
    return vaildPasswordInput && this.sf['customerPassword'].value && this.sf['customerConfirmPassword'].value;
  }

  /**
   * disble button for submission
   */
  get disableBtn() {
    const validState = this.sf['customerPassword'].value && this.sf['customerConfirmPassword'].value;
    const vaildMatchPassword = this.sf['customerPassword'].value === this.sf['customerConfirmPassword'].value;
    return !(vaildMatchPassword && validState);
  }

  ngOnDestroy() {
    this.unsubcribe.next();
    this.unsubcribe.complete();
  }

}
