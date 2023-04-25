import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, AbstractControl } from '@angular/forms';
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
  cacPhoto: any
  cardList: any
  govtPhoto: any
  logoPhoto: any
  verifyList: any
  accountType: any
  businessName: any
  maxLength: number = 0;
  visible: boolean = false;
  ClickLinkAccount: boolean = true;
  base64Contents: string | undefined;

  //Form
  bvnForm!: FormGroup;
  cacForm!: FormGroup;
  idCardForm!: FormGroup;
  addressForm!: FormGroup;

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
    private fb: FormBuilder,
    private kycSrv: KycService,
    private genSrv: GeneralService
  ) { }

  ngOnInit(): void {
    this.onInitForm();
    let acctType: any = this.genSrv.userDetails;
    this.accountType = acctType.customerAccountType
    this.businessName = acctType.customerBusinessName
    this.getVerification();
    this.getCards();
  }

  onInitForm() {
    this.addressForm = new FormGroup({
      address: new FormControl('', Validators.maxLength(11))
    })
    this.bvnForm = new FormGroup({
      bvn: new FormControl('', Validators.maxLength(11))
    });
    this.idCardForm = this.fb.group({
      idCardType: [null, Validators.required],
      idCardNumber: ['', [Validators.required]],
      idCardImageUrl: ['', Validators.required],
    });
    this.cacForm = this.fb.group({
      cacNumber: ['', [Validators.required]],
      cacPdfUrl: ['', Validators.required],
    });
  }

  getVerification() {
    this.kycSrv.verificatin().pipe(takeUntil(this.unsubcribe)).subscribe(data => {
      this.verifyList = data;
      this.setValues(data)
    })
  }

  setValues(data: any) {
    this.bvnForm.controls['bvn'].patchValue(data.bvn);
    this.addressForm.controls['address'].patchValue(data.address);
    this.idCardForm.controls['idCardType'].patchValue(data.idCardType);
    this.idCardForm.controls['idCardNumber'].patchValue(data.idCardNumber);
    this.idCardForm.controls['idCardImageUrl'].patchValue(data.idCard);
    this.govtPhoto = { name: data ? data.idCard : ' Choose File' }
    this.validateIdcarNumbers({ name: data.idCardType })
    this.inputval()
    this.cacForm.controls['cacNumber'].patchValue(data.cacNumber);
    this.cacPhoto = { name: data ? data.cac : ' Choose File' }

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
  validateIdcarNumbers(event: any) {
    const data = event ? event.name : ''
    if (data === 'NIN') {
      this.idCardForm.controls['idCardNumber'].setValidators([Validators.required, Validators.pattern(/^\d+(\.\d+)?$/), Validators.minLength(11), Validators.maxLength(11)]);
      return
    }
    if (data === 'INTERNATION_PASSPORT') {
      this.maxLength = 9
      this.idCardForm.controls['idCardNumber'].setValidators([Validators.required, this.validateInput.bind(this), Validators.minLength(this.maxLength),
      Validators.maxLength(this.maxLength)]);
      return
    }
    if (data === 'DRIVERS_LICENSE') {
      this.maxLength = 12
      this.idCardForm.controls['idCardNumber'].setValidators([Validators.required, this.validateInput.bind(this), Validators.minLength(this.maxLength), Validators.maxLength(this.maxLength)]);
      return
    }
    if (data === 'PVC') {
      this.maxLength = 19
      this.idCardForm.controls['idCardNumber'].setValidators([Validators.required, this.validateInput.bind(this), Validators.minLength(this.maxLength), Validators.maxLength(this.maxLength)]);
      return
    }
  }

  inputval() {
    this.maxLength = 10
    this.cacForm.controls['cacNumber'].setValidators([Validators.required, this.validateInput.bind(this), Validators.minLength(this.maxLength),
    Validators.maxLength(this.maxLength)]);
  }

  //Validate passport-drivers license-pvc charaters
  validateInput(control: AbstractControl) {
    const inputValue = control.value;
    const regex = new RegExp(`^[a-zA-Z0-9]{${this.maxLength}}$`);
    if (regex.test(inputValue) && !this.isAllCharactersEqual(inputValue)) {
      return null;
    } else {
      return { invalidInput: true };
    }
  }

  isAllCharactersEqual(inputValue: string): boolean {
    let firstCharacter: string = inputValue.charAt(0);
    for (let i = 1; i < inputValue.length; i++) {
      if (firstCharacter !== inputValue.charAt(i)) {
        return false;
      }
    }
    return true;
  }

  // complete  verification
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
    this.loader.btn.gvtIDloader = true
    let data = {
      idCardType: this.idCardForm.controls['idCardType'].value,
      idCardNumber: this.idCardForm.controls['idCardNumber'].value,
      idCardImageUrl: this.base64Contents || this.idCardForm.controls['idCardImageUrl'].value,
    }
    this.kycSrv.verifyIdCard(data).subscribe((data: any) => {
      if (data.responseCode === '00') {
        this.genSrv.sweetAlertSuccess(data.responseMessage);
        this.loader.btn.gvtIDloader = false;
        this.getVerification()
      } else {
        let msg = data.responseMessage
        this.genSrv.sweetAlertError(msg);
        this.loader.btn.gvtIDloader = false;
      }
    }, (err) => {
      let msg = err
      this.genSrv.sweetAlertError(msg);
      this.loader.btn.gvtIDloader = false;
    })
  }

  completeCac() {
    this.loader.btn.cacloader = true
    let data = {
      cacNumber: this.cacForm.controls['cacNumber'].value,
      cacPdfUrl: this.cacForm.controls['cacPdfUrl'].value
    }
    this.kycSrv.verifyCac(data).subscribe((data: any) => {
      if (data.responseCode === '00') {
        this.genSrv.sweetAlertSuccess(data.responseMessage);
        this.loader.btn.cacloader = false;
        this.getVerification()
      } else {
        let msg = data.responseMessage
        this.genSrv.sweetAlertError(msg);
        this.loader.btn.cacloader = false;
      }
    }, (err) => {
      let msg = err
      this.genSrv.sweetAlertError(msg);
      this.loader.btn.cacloader = false;
    })
  }

  completeBislogo() {
    this.loader.btn.cacloader = true
    let data = {
      cacNumber: this.cacForm.controls['cacNumber'].value,
      cacPdfUrl: this.cacForm.controls['cacPdfUrl'].value
    }
    this.kycSrv.verifyCac(data).subscribe((data: any) => {
      if (data.responseCode === '00') {
        this.genSrv.sweetAlertSuccess(data.responseMessage);
        this.loader.btn.gvtIDloader = false;
        this.getVerification()
      } else {
        let msg = data.responseMessage
        this.genSrv.sweetAlertError(msg);
        this.loader.btn.gvtIDloader = false;
      }
    }, (err) => {
      let msg = err
      this.genSrv.sweetAlertError(msg);
      this.loader.btn.gvtIDloader = false;
    })
  }

  //Upload
  browseFile(event: any, type?: any) {
    console.log(type);
    const fileName = event.target.files[0]
    const size = 5 * 1024 * 1024;
    if (fileName.size > size) {
      this.genSrv.sweetAlertSuccess('File is Larger Than 5MB')
    } else {
      if (type === 'idcard') this.govtPhoto = fileName;
      if (type === 'cac') this.cacPhoto = fileName;
      if (type === 'logo') this.logoPhoto = fileName;
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        const contents: string = e.target.result;
        this.base64Contents = contents.replace(/^data:image\/(png|jpg);base64,/, "");
        if (this.base64Contents) {
          if (type === 'idcard') this.idCardForm.controls['idCardImageUrl'].patchValue(this.base64Contents);
          if (type === 'cac') this.cacForm.controls['cacPdfUrl'].patchValue(this.base64Contents);
          if(type ==='logo') {

          }
        }
      };
      reader.readAsDataURL(fileName);
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
