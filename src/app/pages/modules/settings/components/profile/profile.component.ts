import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { GeneralService } from 'src/app/shared/services/general.service';
import { SettingsService } from '../../services/settings.service';
@Component({
  selector: 'dp-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {

  loader: any = {
    btn: {
      pass: false,
    },
  };
  acctType: any
  hidePassword = true;
  hideCPassword = true;
  hideOPassword = true
  profileForm!: FormGroup;
  private unsubcribe = new Subject<void>();
  private passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>?])[a-zA-Z\d!@#$%^&*()_+[\]{};':"\\|,.<>?]{8,}$/;

  constructor(
    private fb: FormBuilder,
    private genSrv: GeneralService,
    private setSrv: SettingsService,
  ) {
    let data: any = this.genSrv.currentUserValue
    this.ngForm(data)
    this.acctType = data.customerAccountType

  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
  }

  ngForm(data: any) {
    this.profileForm = this.fb.group({
      firstName: [{ value: data.customerFirstName, disabled: true }],
      lastName: [{ value: data.customerLastName, disabled: true }],
      customerBusinessName: [{ value: data?.customerBusinessName, disabled: true }],
      email: [{ value: data.customerEmail, disabled: true }],
      phone: [{ value: data.customerPhone, disabled: true }],
      customerOldPassword: ["", Validators.required],
      customerPassword: ["", [Validators.required, Validators.pattern(this.passwordPattern)]],
      customerPasswordConfirmation: ["", [Validators.required, Validators.pattern(this.passwordPattern)]],
    });
  }

  // Get login Form Value
  get pf() {
    return this.profileForm.controls;
  }

  /**
   * password match validations
   */
  get matchPassword() {
    const vaildPasswordInput = this.pf['customerPassword'].value !== this.pf['customerPasswordConfirmation'].value;
    return vaildPasswordInput && this.pf['customerPassword'].value && this.pf['customerPasswordConfirmation'].value;
  }

  /**
   * disble button for submission
   */
  get disableBtn() {
    const validState = this.pf['customerPassword'].value && this.pf['customerPasswordConfirmation'].value;
    const vaildMatchPassword = this.pf['customerPassword'].value === this.pf['customerPasswordConfirmation'].value;
    return !(vaildMatchPassword && validState);
  }

  changePassword() {
    let payload = {
      customerEmail: this.pf['email'].value,
      customerOldPassword: this.pf['customerOldPassword'].value,
      customerPassword: this.pf['customerPassword'].value,
      customerPasswordConfirmation: this.pf['customerPasswordConfirmation'].value,
    }
    this.loader.btn.pass = true;
    this.setSrv.changePassword(payload).pipe(takeUntil(this.unsubcribe)).subscribe((data: any) => {
      if (data.responseCode === '00') {
        this.genSrv.sweetAlertSuccess(data.responseMessage);
        this.genSrv.logout('/')
        this.loader.btn.pass = false;
      } else {
        let msg = data.responseMessage
        this.genSrv.sweetAlertError(msg);
        this.loader.btn.pass = false;
      }
    }, (err) => {
      let msg = err
      this.genSrv.sweetAlertError(msg);
      this.loader.btn.pass = false;
    })
  }


  ngOnDestroy() {
    this.unsubcribe.next();
    this.unsubcribe.complete();
  }

}
