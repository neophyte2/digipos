import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { GeneralService } from 'src/app/shared/services/general.service';
import { KycService } from '../../services/kyc.service';
import * as $ from 'jquery';
import { NgOtpInputConfig } from 'ng-otp-input';

@Component({
  selector: 'dp-kyc',
  templateUrl: './kyc.component.html',
  styleUrls: ['./kyc.component.css']
})
export class KycComponent implements OnInit {

  otp = ''
  cardList:any
  verifyList: any
  accountType: any
  bvnForm: FormGroup;
  visible: boolean = false;
  ClickLinkAccount: boolean = true;

  //Verification
  verifyCac: boolean = false;
  verifyBvn: boolean = false;
  verifGvtID: boolean = false;
  verifyAddress: boolean = false;
  verifyPicture: boolean = false;
  verifyBusinessLogo: boolean = false;

  //Loader
  loader: any = {
    btn: {
      addressloader: false,
      bvnloader: false,
      gvtIDloader: false,
      cacloader: false,
      picloader: false,
      bislogoloader: false,
    },
  };

  //OTP
  config: NgOtpInputConfig = {
    allowNumbersOnly: true,
    length: 4,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '0'
  };

  private unsubcribe = new Subject<void>();


  constructor(
    private kycSrv: KycService,
    private genSrv: GeneralService
  ) {
    this.bvnForm = new FormGroup({
      bvn: new FormControl('', Validators.maxLength(11))
    });
  }

  ngOnInit(): void {
    let acctType: any = this.genSrv.userDetails;
    this.accountType = acctType.customerAccountType
    this.getVerification();
    this.getCards();
  }

  getVerification() {
    this.kycSrv.verificatin().pipe(takeUntil(this.unsubcribe)).subscribe(data => {
      console.log(data);
      this.verifyList = data;
      this.bvnForm.controls['bvn'].patchValue(this.verifyList.bvn);
    })
  }

  getCards() {
    this.kycSrv.getAllCards().pipe(takeUntil(this.unsubcribe)).subscribe(data => {
      console.log(data);
      this.cardList = data;
    })
  }

  //verify Address
  onFocusLost(event: any) {
    let value = { address: event.target.value }
    if (value.address.trim() != '') {
      this.loader.btn.addressloader = true;
      this.kycSrv.verifyAddresses(value).subscribe((data: any) => {
        if (data.responseCode === '00') {
          this.genSrv.sweetAlertSuccess(data.responseMessage);
          this.loader.btn.addressloader = false;
          this.verifyAddress = true
          this.getVerification()
        } else {
          let msg = data.responseMessage
          this.genSrv.sweetAlertError(msg);
          this.loader.btn.addressloader = false;
          this.verifyAddress = false
        }
      }, (err) => {
        let msg = err
        this.genSrv.sweetAlertError(msg);
        this.verifyAddress = false
        this.loader.btn.addressloader = false;
      })
    }
  }

  //verify Bvn
  onFocusLostBvn(event: any) {
    let value = { bvn: event.target.value }
    console.log(value.bvn);
    if (value.bvn.trim() != '') {
      this.loader.btn.bvnloader = true;
      this.kycSrv.initiateBvn(value).subscribe((data: any) => {
        console.log(data);
        if (data.responseCode === '00') {
          $(`#bvn`).click();
          this.genSrv.sweetAlertSuccess("An OTP was sent to your mail for Verification");
        } else {
          let msg = data.responseMessage
          this.genSrv.sweetAlertError(msg);
          this.loader.btn.bvnloader = false;
        }
      }, (err) => {
        let msg = err
        this.genSrv.sweetAlertError(msg);
        this.loader.btn.bvnloader = false;
      })
    }
  }

  onOtpChange(otp: any) {
    if (otp.length === 4) {
      this.otp = otp;
    } else {
      this.otp = ''
    }
  }

  // complete verification
  completeBvnOtp() {
    let otp = { otp: this.otp }
    this.kycSrv.completeBvn(otp).subscribe((data: any) => {
      if (data.map.responseCode === '00') {
        this.genSrv.sweetAlertSuccess(data.map.responseMessage);
        this.loader.btn.bvnloader = false;
        this.getVerification()
      } else {
        let msg = data.map.responseMessage
        this.genSrv.sweetAlertError(msg);
        this.loader.btn.bvnloader = false;
      }
    }, (err) => {
      let msg = err
      this.genSrv.sweetAlertError(msg);
      this.loader.btn.bvnloader = false;
    })
  }

  onLinkAccount() {
    this.visible = !this.visible;
    this.ClickLinkAccount = !this.ClickLinkAccount;
  }

  ngOnDestroy() {
    this.unsubcribe.next();
    this.unsubcribe.complete();
  }

}
