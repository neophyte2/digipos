import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from "rxjs/operators";
import { TransactionSharedService } from 'src/app/shared/services/transShared.service';
import { tableCurrency } from 'src/app/shared/utils/utils';
import { paymentMethods, responsesType } from 'src/app/shared/utils/data';

@Component({
  selector: 'dp-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit, OnDestroy {

  //dates
  query: any
  filter : any[]= [];
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

  formatAmt(val: any) {
    return tableCurrency(val);
  }

  ngOnDestroy() {
    this.unsubcribe.next();
    this.unsubcribe.complete();
  }

}
