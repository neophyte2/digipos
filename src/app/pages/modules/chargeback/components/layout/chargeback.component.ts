import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from "rxjs/operators";
import { ChargebackService } from '../../services/chargeback.service';
import { GeneralService } from 'src/app/shared/services/general.service';
import { Router } from '@angular/router';
import { exportTableToCSV } from 'src/app/shared/utils/utils';
import { paymentMethods2 } from 'src/app/shared/utils/data';
import * as moment from 'moment';

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
  filterList = [
    'Status',
    'Amount',
    'Reference',
    'Transaction Type',
    'Transaction Reference',
  ]
  query: any
  method = paymentMethods2
  selectedItem: any
  showModal = false;
  dropdown = false
  isloading = false;
  chargebackList: any
  exportLoading = false;
  dateRangeForm!: FormGroup;
  chargebackForm!: FormGroup;
  filter: any[] = [];
  responseList = [
    'PENDING',
    'DECLINED',
    'APPROVED',
  ]
  year = new Date().getFullYear()
  month = (new Date().getMonth() + 1).toString().padStart(2, '0');
  day = new Date().getDate();
  private unsubcribe = new Subject<void>();

  constructor(
    private router: Router,
    private genSrv: GeneralService,
    private readonly fb: FormBuilder,
    private chargeSrv: ChargebackService,
  ) {
    var month = new Date().getMonth() + 1;
    var last_day = new Date(this.year, month, 0).getDate();
    this.dateRangeForm = new FormGroup({
      start: new FormControl(`${this.year}-${this.month}-01`),
      end: new FormControl(`${this.year}-${this.month}-${last_day}`),
      chargebackAmount: new FormControl(null),
      chargebackReference: new FormControl(''),
      chargebackStatus: new FormControl(''),
      chargebackTransactionReference: new FormControl(''),
      chargebackTransactionType: new FormControl(''),
    });

    this.dateRangeForm.valueChanges.subscribe((data) => {
      if (data?.start && data?.end) {
        this.query = { startDate: moment(data?.start).format("YYYY-MM-DD"), endDate: moment(data?.end).format("YYYY-MM-DD") }
        this.allChargeback();
      }
    });
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.ngOnForms()
    this.allChargeback()
  }

  allChargeback() {
    this.isloading = true
    let payload = {
      endDate: this.dateRangeForm.value.end,
      startDate: this.dateRangeForm.value.start,
      chargebackAmount: this.dateRangeForm.value.chargebackAmount,
      chargebackStatus: this.dateRangeForm.value.chargebackStatus,
      chargebackReference: this.dateRangeForm.value.chargebackReference,
      chargebackTransactionType: this.dateRangeForm.value.chargebackTransactionType,
      chargebackTransactionReference: this.dateRangeForm.value.chargebackTransactionReference,
    }
    this.chargeSrv.getAllChargeback(payload).pipe(takeUntil(this.unsubcribe)).subscribe((charge: any) => {
      this.chargebackList = charge.data;
      this.isloading = false
    })
  }

  clearData(event: any) {
    if (event.length === 0) {
      this.dateRangeForm.controls['chargebackAmount'].patchValue(null)
      this.dateRangeForm.controls['chargebackReference'].patchValue('')
      this.dateRangeForm.controls['chargebackStatus'].patchValue('')
      this.dateRangeForm.controls['chargebackStatus'].patchValue('')
      this.dateRangeForm.controls['chargebackTransactionReference'].patchValue('')
      this.dateRangeForm.controls['chargebackTransactionType'].patchValue('')
      this.allChargeback()
    }
  }

  get cf() {
    return this.chargebackForm.controls;
  }

  toggleModal() {
    this.showModal = !this.showModal;
    if (this.showModal) this.generateReference()
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

  export() {
    this.exportLoading = true;
    if (this.chargebackList.length > 0) {
      const exportName = "ChargeBack";
      const columns = [
        { title: "ID ", value: "chargebackId" },
        { title: "Amount", value: "chargebackAmount" },
        { title: "Evidence", value: "chargebackEvidence" },
        { title: "Transaction Reference", value: "chargebackReference" },
        { title: "CBA Reference ", value: "chargebackTransactionReference" },
        { title: "Transaction Type", value: "chargebackTransactionType" },
        { title: "Status", value: "chargebackStatus" },
        { title: "Expiry Date", value: "chargebackExpiryDate" },
        { title: "CreatedAt", value: "chargebackCreatedAt" },
        { title: "Updated At", value: "chargebackUpdatedAt" },
        { title: "Transaction Date ", value: "chargebackTransactionDate" },
      ];
      exportTableToCSV(this.chargebackList, columns, exportName);
      this.exportLoading = false;
    } else {
      this.genSrv.sweetAlertError('No ChargeBack Data Available')
      this.exportLoading = false;

    }
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

  _isRouteEnabled = (route: string[]) => this.genSrv.isRouteEnabled(route)
}
