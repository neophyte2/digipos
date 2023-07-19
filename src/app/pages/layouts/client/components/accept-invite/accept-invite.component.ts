import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { get } from 'jquery';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GeneralService } from 'src/app/shared/services/general.service';
import { acctType, verifyType } from 'src/app/shared/utils/data';
import { REMOVESPACESONLY, VALIDEMAILREGEX } from 'src/app/shared/utils/utils';
import { ClientService } from '../../service/client.service';

@Component({
  selector: 'dp-accept-invite',
  templateUrl: './accept-invite.component.html',
  styleUrls: ['./accept-invite.component.css']
})
export class AcceptInviteComponent implements OnInit, OnDestroy {

  loader: any = {
    btn: {
      accept: false,
    },
  };
  hidePassword = true;
  hideCPassword = true;
  inviteForm!: FormGroup;
  private unsubcribe = new Subject<void>();

  //Phone number Internationalization
  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private gustSrv: ClientService,
    private genSrv: GeneralService,
  ) {

  }

  ngOnInit(): void {
    const link = this.route.snapshot.queryParams['q'];
    this.ngOnForms(link);
    this.preferredCountries = [CountryISO.Nigeria];

  }

  // Get login Form Value
  get sf() {
    return this.inviteForm.controls;
  }

  ngOnForms(link: any) {
    this.inviteForm = this.fb.group({
      customerFirstName: ["", Validators.required],
      customerLastName: ["", Validators.required],
      customerLink: [{ value: link, disabled: true }, Validators.required],
      customerCountryCode: [""],
      customerCountry: [""],
      customerPhone: ["", Validators.required],
      customerPassword: ["", Validators.required],
      customerConfirmPassword: ["", Validators.required],
    });
  }

  acceptInvite() {
    const payload = {
      customerFirstName: this.sf['customerFirstName'].value,
      customerLastName: this.sf['customerLastName'].value,
      customerLink: this.sf['customerLink'].value,
      customerCountryCode: this.sf['customerPhone'].value.dialCode,
      customerCountry: this.sf['customerPhone'].value.countryCode,
      customerPhone: this.sf['customerPhone'].value.e164Number,
      customerPassword: this.sf['customerPassword'].value,
      customerConfirmPassword: this.sf['customerConfirmPassword'].value,
    }
    this.loader.btn.accept = true;
    this.gustSrv.acceptInvitation(payload).pipe(takeUntil(this.unsubcribe)).subscribe((data: any) => {
      if (data.responseCode === '00') {
        setTimeout(() => {
          this.genSrv.logout('/')
          this.router.navigate(["/"]);
          this.genSrv.sweetAlertSuccess(data.responseMessage);
          this.loader.btn.accept = false;
        }, 1000);
      } else {
        let msg = data.responseMessage
        this.genSrv.sweetAlertError(msg);
        this.loader.btn.accept = false;
      }
    }, (err) => {
      let msg = err
      this.genSrv.sweetAlertError(msg);
      this.loader.btn.accept = false;
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
