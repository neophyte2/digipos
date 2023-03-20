import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from "rxjs/operators";
import { tableCurrency } from 'src/app/shared/utils/utils';
import { paymentMethods, responsesType } from 'src/app/shared/utils/data';
import { SettlementService } from '../../services/settlement.service';
import { GeneralService } from 'src/app/shared/services/general.service';

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
  private unsubcribe = new Subject<void>();

  constructor(
    private readonly fb: FormBuilder,
    private genSrv: GeneralService,
    private transSrvService: SettlementService,
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
        this.allSettlementList();
      }
    });
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.allSettlementList()
  }

  allSettlementList() {
    let payload = {
      startDate: this.dateRangeForm.value.start,
      endDate: this.dateRangeForm.value.end,
    }
    this.transSrvService.getAllSettlement(payload).pipe(takeUntil(this.unsubcribe)).subscribe((settle: any) => {
      console.log(settle);

      this.settlementList = settle.data;
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
