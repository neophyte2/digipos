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
  hidePassword = true;
  hideCPassword = true;
  hideOPassword = true
  profileForm!: FormGroup;
  private unsubcribe = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private genSrv: GeneralService,
    private setSrv: SettingsService,
  ) {
    let data = this.genSrv.currentUserValue
    this.ngForm(data)
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
  }

  ngForm(data: any) {
    this.profileForm = this.fb.group({
      firstName: [{ value: data.customerFirstName, disabled: true }],
      lastName: [{ value: data.customerLastName, disabled: true }],
      email: [{ value: data.customerEmail, disabled: true }],
      phone: [{ value: data.customerPhone, disabled: true }],
      customerOldPassword: ["", Validators.required],
      customerPassword: ["", Validators.required],
      customerPasswordConfirmation: ["", Validators.required],
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
    this.setSrv.chnagePassword(payload).pipe(takeUntil(this.unsubcribe)).subscribe((data: any) => {
      if (data.responseCode === '00') {
        this.genSrv.sweetAlertSuccess(data.responseMessage);
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
