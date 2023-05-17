import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from "rxjs/operators";
import { tableCurrency } from 'src/app/shared/utils/utils';
import { paymentMethods, responsesType } from 'src/app/shared/utils/data';
import { SettlementService } from '../../services/settlement.service';

@Component({
  selector: 'dp-settlement',
  templateUrl: './settlement.component.html',
  styleUrls: ['./settlement.component.css']
})
export class SettlementComponent implements OnInit, OnDestroy {

  loader: any = {
    btn: {
      download: false,
      pageLoader: false,
    },
  };
  query: any
  cardDataList: any
  filter: any[] = [];
  settlementList: any
  isloading = false
  method = paymentMethods
  dateRangeForm!: FormGroup;
  filterList = [
    'Status',
    'Amount',
    'Reference',
    'Payment Method',
  ]
  responseList = responsesType
  year = new Date().getFullYear()
  month = (new Date().getMonth() + 1).toString().padStart(2, '0');
  day = new Date().getDate();
  private unsubcribe = new Subject<void>();

  constructor(
    private transSrvService: SettlementService,
  ) {
    var month = new Date().getMonth() + 1;
    var last_day = new Date(this.year, month, 0).getDate();
    this.dateRangeForm = new FormGroup({
      start: new FormControl(`${this.year}-${this.month}-01`),
      end: new FormControl(`${this.year}-${this.month}-${last_day}`),
    });
    this.dateRangeForm.valueChanges.subscribe((data) => {
      if (data?.start && data?.end) {
        this.query = { startDate: moment(data?.start).format("YYYY-MM-DD"), endDate: moment(data?.end).format("YYYY-MM-DD") }
        this.allSettlementList();
      }
    });
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.allSettlementList()
  }

  allSettlementList() {
    this.isloading = true
    let payload = {
      startDate: this.dateRangeForm.value.start,
      endDate: this.dateRangeForm.value.end,
    }
    this.transSrvService.getAllSettlement(payload).pipe(takeUntil(this.unsubcribe)).subscribe((settle: any) => {
      this.settlementList = settle.data;
      this.isloading = false
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
