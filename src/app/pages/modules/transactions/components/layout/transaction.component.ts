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
  filter: any[] = [];
  transactionList: any
  dateRangeForm!: FormGroup;
  method = paymentMethods
  filterList = [
    'Status',
    'Amount',
    'Reference',
    'Payment Method',
  ]
  responseList = responsesType
  year = new Date().getFullYear()
  private unsubcribe = new Subject<void>();

  constructor(
    private readonly fb: FormBuilder,
    private genSrv: GeneralService,
    private transSrvService: TransactionService,
    private transShrdService: TransactionSharedService
  ) {
    this.dateRangeForm = new FormGroup({
      start: new FormControl(`${this.year}-01-01`),
      end: new FormControl(`${this.year}-12-31`),
      trnResponseCode: new FormControl(null),
      trnService: new FormControl(null),
      trnAmount: new FormControl(''),
      trnReference: new FormControl(''),
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
    this.allTransactionList()
  }

  allTransactionList() {
    let payload = {
      trnReference: this.dateRangeForm.value.trnReference,
      trnService: this.dateRangeForm.value.trnService,
      trnResponseCode: this.dateRangeForm.value.trnResponseCode,
      trnResponseMessage: '',
      trnAmount: this.dateRangeForm.value.trnAmount,
      startDate: this.dateRangeForm.value.start,
      endDate: this.dateRangeForm.value.end,
    }
    this.transShrdService.transactionList(payload).pipe(takeUntil(this.unsubcribe)).subscribe((trans: any) => {
      this.transactionList = trans.data;
    })
  }

  download() {
    this.loader.download = true
    swal.fire({
      icon: 'info',
      title: 'Transaction Download',
      html: 'Processing Datatable Download to Excel',
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
      trnService: this.dateRangeForm.value.trnService,
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

  ngOnDestroy() {
    this.unsubcribe.next();
    this.unsubcribe.complete();
  }

}
