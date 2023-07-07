import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from "rxjs/operators";
import { TransactionSharedService } from 'src/app/shared/services/transShared.service';
import { tableCurrency } from 'src/app/shared/utils/utils';
import { paymentMethods, responsesType } from 'src/app/shared/utils/data';
import { TransactionService } from '../../services/transcation.service';
import { GeneralService } from 'src/app/shared/services/general.service';
import swal from 'sweetalert2';

@Component({
  selector: 'dp-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit, OnDestroy {

  loader: any = {
    btn: {
      download: false,
      pageLoader: false,
    },
  };
  query: any
  cardDataList: any
  isloading = false
  filter: any[] = [];
  transactionList: any
  method = paymentMethods
  dateRangeForm!: FormGroup;
  filterList = [
    'Status',
    'Amount',
    'Reference',
    'Terminal ID',
    'Payment Method',
  ]
  responseList = responsesType
  year = new Date().getFullYear()
  month = (new Date().getMonth() + 1).toString().padStart(2, '0');
  day = new Date().getDate();
  private unsubcribe = new Subject<void>();

  constructor(
    private readonly fb: FormBuilder,
    private genSrv: GeneralService,
    private transSrvService: TransactionService,
    private transShrdService: TransactionSharedService
  ) {
    var month = new Date().getMonth() + 1;
    var last_day = new Date(this.year, month, 0).getDate();
    this.dateRangeForm = new FormGroup({
      start: new FormControl(`${this.year}-${this.month}-01`),
      end: new FormControl(`${this.year}-${this.month}-${last_day}`),
      trnResponseCode: new FormControl(null),
      trnChannel: new FormControl(''),
      trnAmount: new FormControl(null),
      trnReference: new FormControl(''),
      trnTerminalId: new FormControl(''),
    });

    this.dateRangeForm.valueChanges.subscribe((data) => {
      if (data?.start && data?.end) {
        this.query = { startDate: moment(data?.start).format("YYYY-MM-DD"), endDate: moment(data?.end).format("YYYY-MM-DD") }
        this.allTransactionList();
      }
    });
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.getCardDetails()
    this.allTransactionList()
  }

  getCardDetails() {
    let payload = {
      startDate: this.dateRangeForm.value.start,
      endDate: this.dateRangeForm.value.end,
    }
    this.transShrdService.stats(payload).pipe(takeUntil(this.unsubcribe)).subscribe((resp: any) => {
      if (resp.responseCode === '00') {
        this.cardDataList = resp.data
      }
    })
  }

  clearData(event: any) {
    if (event.length === 0) {
      this.dateRangeForm.controls['trnReference'].patchValue('')
      this.dateRangeForm.controls['trnChannel'].patchValue('')
      this.dateRangeForm.controls['trnResponseCode'].patchValue('')
      this.dateRangeForm.controls['trnResponseMessage'].patchValue('')
      this.dateRangeForm.controls['trnTerminalId'].patchValue('')
      this.dateRangeForm.controls['trnAmount'].patchValue(null)
      this.allTransactionList()
    }
  }

  allTransactionList() {
      this.isloading = true
      let payload = {
      trnReference: this.dateRangeForm.value.trnReference,
      trnChannel: this.dateRangeForm.value.trnChannel,
      trnResponseCode: this.dateRangeForm.value.trnResponseCode,
      trnResponseMessage: '',
      trnTerminalId: this.dateRangeForm.value.trnTerminalId,
      trnAmount: this.dateRangeForm.value.trnAmount,
      startDate: this.dateRangeForm.value.start,
      endDate: this.dateRangeForm.value.end,
    }
    this.transShrdService.transactionList(payload).pipe(takeUntil(this.unsubcribe)).subscribe((trans: any) => {
      this.transactionList = trans.data;
      this.isloading = false
    })
  }

  download() {
    this.loader.download = true
    swal.fire({
      icon: 'info',
      title: 'Transaction Download',
      html: 'Loading ...',
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      didOpen: () => {
        swal.showLoading(swal.getDenyButton());
      }
    })

    let payload = {
      trnReference: this.dateRangeForm.value.trnReference,
      trnChannel: this.dateRangeForm.value.trnChannel,
      trnResponseCode: this.dateRangeForm.value.trnResponseCode,
      trnResponseMessage: '',
      trnAmount: this.dateRangeForm.value.trnAmount,
    }
    this.transSrvService.transactionDownload(payload).pipe(takeUntil(this.unsubcribe)).subscribe((trans: any) => {
      if (trans.responseCode === '00') {
        swal.close()
        this.genSrv.sweetAlertSuccess(trans.responseMessage);
      } else {
        let msg = trans.responseMessage
        swal.close()
        this.genSrv.sweetAlertError(msg);
        this.loader.btn.download = false;
      }
    }, (err) => {
      let msg = err
      swal.close()
      this.genSrv.sweetAlertError(msg);
      this.loader.btn.download = false;
    })
  }

  formatAmt(val: any) {
    return tableCurrency(val);
  }

  async copyWallet(toCopy: any) {
    try {
      await navigator.clipboard.writeText(toCopy);
      this.genSrv.sweetAlertSuccessCopy('Copied to clipboard')
    } catch (err) {
      this.genSrv.sweetAlertError('Failed to copy')
    }
  }

  ngOnDestroy() {
    this.unsubcribe.next();
    this.unsubcribe.complete();
  }

}
