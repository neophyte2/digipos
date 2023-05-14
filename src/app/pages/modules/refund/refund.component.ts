import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ChartDataSets, ChartOptions } from 'chart.js';
import * as moment from 'moment';
import { Label, Color } from 'ng2-charts';
import { Subject } from 'rxjs';
import { takeUntil } from "rxjs/operators";
import { GeneralService } from 'src/app/shared/services/general.service';
import { TransactionSharedService } from 'src/app/shared/services/transShared.service';
import { tableCurrency } from 'src/app/shared/utils/utils';
import { RefundService } from './services/refund.service';

@Component({
  selector: 'dp-refund',
  templateUrl: './refund.component.html',
  styleUrls: ['./refund.component.css']
})
export class RefundComponent implements OnInit, OnDestroy {

  //dates
  query: any
  cardDataList: any
  refundlength: any
  refundList: any
  dateRangeForm!: FormGroup;
  year = new Date().getFullYear()
  month = (new Date().getMonth() + 1).toString().padStart(2, '0');
  day = new Date().getDate();
  private unsubcribe = new Subject<void>();


  constructor(
    private refundSrv: RefundService
  ) {
    this.dateRangeForm = new FormGroup({
      start: new FormControl(`${this.year}-${this.month}-${this.day}`),
      end: new FormControl(`${this.year}-${this.month}-${this.day}`),
    });

    this.dateRangeForm.valueChanges.subscribe((data) => {
      if (data?.start && data?.end) {
        this.query = { startDate: moment(data?.start).format("YYYY-MM-DD"), endDate: moment(data?.end).format("YYYY-MM-DD") }
        this.allTransactionList();
      }
    }
    );
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.allTransactionList();
  }


  allTransactionList() {
    let payload = {
      organisationId: '',
      startDate: this.dateRangeForm.value.start,
      endDate: this.dateRangeForm.value.end,
    }
    this.refundSrv.getAllRefunds(payload).pipe(takeUntil(this.unsubcribe)).subscribe((refund: any) => {
      if (refund.responseCode === '00') {
        this.refundList = refund.data
        // this.refundlength = this.refundList?.length
      }
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
