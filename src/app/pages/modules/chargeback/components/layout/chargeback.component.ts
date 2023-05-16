import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from "rxjs/operators";
import { ChargebackService } from '../../services/chargeback.service';
import { GeneralService } from 'src/app/shared/services/general.service';
import { Router } from '@angular/router';

@Component({
  selector: 'dp-chargeback',
  templateUrl: './chargeback.component.html',
  styleUrls: ['./chargeback.component.css']
})

export class ChargebackComponent implements OnInit, OnDestroy {

  loader: any = {
    btn: {
      create: false,
    },
  };
  selectedItem: any
  showModal = false;
  dropdown = false
  chargebackList: any
  chargebackForm!: FormGroup;
  private unsubcribe = new Subject<void>();

  constructor(
    private router: Router,
    private genSrv: GeneralService,
    private readonly fb: FormBuilder,
    private chargeSrv: ChargebackService,
  ) {
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.ngOnForms()
    this.allChargeback()
  }

  allChargeback() {
    let payload = {
    }
    this.chargeSrv.getAllChargeback(payload).pipe(takeUntil(this.unsubcribe)).subscribe((charge: any) => {
      this.chargebackList = charge.data;
    })
  }

  get cf() {
    return this.chargebackForm.controls;
  }

  toggleModal() {
    this.showModal = !this.showModal;
    if(this.showModal)  this.generateReference()
  }

  viewChargeback(id: any) {
    this.router.navigateByUrl(`/auth/chargeback/${id}`)
  }

  getItemId(id: any) {
    this.dropdown = !this.dropdown
    this.selectedItem = id;
  }

  ngOnForms() {
    this.chargebackForm = this.fb.group({
      chargebackReference: [{ value: '', disabled: true }, Validators.required,],
      chargebackTransactionReference: ['', Validators.required,],
      chargebackAmount: ['', Validators.required,],
      chargebackEvidence: ['', Validators.required,],
    });
  }

  generateReference() {
    const number: number = Math.floor(Math.random() * 9) + 1; // First digit can't be 0
    const restOfDigits: string = Math.random().toString().slice(2, 12); // Generates 10 random digits
    const result: string = number.toString() + restOfDigits;
    this.chargebackForm.controls['chargebackReference'].patchValue(result)
  }

  createTerminal() {
    let payload = {
      chargebackReference: this.cf['chargebackReference'].value,
      chargebackTransactionReference: this.cf['chargebackTransactionReference'].value,
      chargebackAmount: this.cf['chargebackAmount'].value,
      chargebackEvidence: this.cf['chargebackEvidence'].value,
    }
    this.loader.btn.create = true;
    this.chargeSrv.createChargeback(payload).pipe(takeUntil(this.unsubcribe)).subscribe((data: any) => {
      if (data.responseCode === '00') {
        this.genSrv.sweetAlertSuccess(data.responseMessage);
        this.allChargeback()
        this.loader.btn.create = false;
        this.chargebackForm.reset()
        this.toggleModal();
      } else {
        let msg = data.responseMessage
        this.genSrv.sweetAlertError(msg);
        this.loader.btn.create = false;
        this.toggleModal();
      }
    }, (err) => {
      let msg = err
      this.genSrv.sweetAlertError(msg);
      this.loader.btn.create = false;
      this.toggleModal();
    })
  }

  // declined & approve

  confirmStatus(data: any, statusName: string) {
    this.getItemId(0)
    this.genSrv.sweetAlertDecision(statusName, data.chargebackReference).then((result) => {
      if (result.isConfirmed) {
        if (statusName === 'Approve') {
          this.approve(data.chargebackId)
        } else {
          this.declined(data.chargebackId)
        }

      }
    })
  }

  approve(id: any) {
    let payload = {
      chargebackId: id
    }
    this.chargeSrv.approveChargeback(payload).pipe(takeUntil(this.unsubcribe)).subscribe((data: any) => {
      if (data.responseCode === '00') {
        this.genSrv.sweetAlertSuccess(data.responseMessage);
        this.allChargeback()
        this.loader.btn.create = false;
      } else {
        let msg = data.responseMessage
        this.genSrv.sweetAlertError(msg);
        this.loader.btn.create = false;
      }
    }, (err) => {
      let msg = err
      this.genSrv.sweetAlertError(msg);
      this.loader.btn.create = false;
    })
  }

  declined(id: any) {
    let payload = {
      chargebackId: id
    }
    this.chargeSrv.declineChargeback(payload).pipe(takeUntil(this.unsubcribe)).subscribe((data: any) => {
      if (data.responseCode === '00') {
        this.genSrv.sweetAlertSuccess(data.responseMessage);
        this.allChargeback()
        this.loader.btn.create = false;
      } else {
        let msg = data.responseMessage
        this.genSrv.sweetAlertError(msg);
        this.loader.btn.create = false;
      }
    }, (err) => {
      let msg = err
      this.genSrv.sweetAlertError(msg);
      this.loader.btn.create = false;
    })

  }

  ngOnDestroy() {
    this.unsubcribe.next();
    this.unsubcribe.complete();
  }

}