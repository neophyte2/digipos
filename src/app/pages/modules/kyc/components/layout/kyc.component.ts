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
  govtPhoto: any
  cardList: any
  verifyList: any
  accountType: any
  businessName: any
  bvnForm!: FormGroup;
  idCardForm!: FormGroup;
  visible: boolean = false;
  ClickLinkAccount: boolean = true;
  base64Contents: string | undefined;

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
  }

  ngOnInit(): void {
    this.onInitForm();
    let acctType: any = this.genSrv.userDetails;
    this.accountType = acctType.customerAccountType
    this.businessName = acctType.customerBusinessName
    this.getVerification();
    this.getCards();
  }

  onInitForm() {
    this.bvnForm = new FormGroup({
      bvn: new FormControl('', Validators.maxLength(11))
    });
    this.idCardForm = new FormGroup({
      idCardType: new FormControl('', Validators.required),
      idCardNumber: new FormControl('', Validators.required),
      idCardImageUrl: new FormControl('', Validators.required),
    });
  }

  getVerification() {
    this.kycSrv.verificatin().pipe(takeUntil(this.unsubcribe)).subscribe(data => {
      this.verifyList = data;
      this.bvnForm.controls['bvn'].patchValue(this.verifyList.bvn);
    })
  }

  getCards() {
    this.kycSrv.getAllCards().pipe(takeUntil(this.unsubcribe)).subscribe((data: any) => {
      this.cardList = data.data;
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
    if (value.bvn.trim() != '') {
      this.loader.btn.bvnloader = true;
      this.kycSrv.initiateBvn(value).subscribe((data: any) => {
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

  //form verification 
  //id card verify
  onComplete() {
    if (this.idCardForm.valid && this.base64Contents) {
      this.completeIdCard()
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

  completeIdCard() {
    let data = {
      idCardType: this.idCardForm.controls['idCardType'].value,
      idCardNumber: this.idCardForm.controls['idCardNumber'].value,
      idCardImageUrl: this.base64Contents,
    }
    this.kycSrv.verifyIdCard(data).subscribe((data: any) => {
      if (data.responseCode === '00') {
        this.genSrv.sweetAlertSuccess(data.responseMessage);
        this.loader.btn.bvnloader = false;
        this.getVerification()
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

  //Upload
  browseGovtFile(event: any) {
    const size = 5 * 1024 * 1024;
    if (event.target.files[0].size > size) {
      this.genSrv.sweetAlertSuccess('File is Larger Than 5MB')
    } else {
      this.govtPhoto = event.target.files[0];
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        const contents: string = e.target.result;
        this.base64Contents = contents.replace(/^data:image\/(png|jpg);base64,/, "");
        if (this.base64Contents) {
          this.idCardForm.controls['idCardImageUrl'].patchValue(this.base64Contents);
          this.onComplete()
        }
      };
      reader.readAsDataURL(this.govtPhoto);
    }
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
