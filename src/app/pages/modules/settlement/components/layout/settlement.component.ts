import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from "rxjs/operators";
import { exportTableToCSV, tableCurrency } from 'src/app/shared/utils/utils';
import { paymentMethods, responsesType } from 'src/app/shared/utils/data';
import { SettlementService } from '../../services/settlement.service';
import { Router } from '@angular/router';
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
  filterList = [
    // 'Status',
    'Amount',
  ]
  responseList = [
    'PENDING',
    'REJECTED',
    'AUTHORIZED',
  ]
  query: any
  cardDataList: any
  filter: any[] = [];
  settlementList: any
  isloading = false
  method = paymentMethods
  dateRangeForm!: FormGroup;
  exportLoading = false;
  year = new Date().getFullYear()
  month = (new Date().getMonth() + 1).toString().padStart(2, '0');
  day = new Date().getDate();
  private unsubcribe = new Subject<void>();

  constructor(
    private router: Router,
    private genSrv: GeneralService,
    private transSrvService: SettlementService,
  ) {
    var month = new Date().getMonth() + 1;
    var last_day = new Date(this.year, month, 0).getDate();
    this.dateRangeForm = new FormGroup({
      start: new FormControl(`${this.year}-${this.month}-01`),
      end: new FormControl(`${this.year}-${this.month}-${last_day}`),
      settlementAmount: new FormControl(null),
      // settlementStatus: new FormControl(''),
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

  clearData(event: any) {
    if (event.length === 0) {
      // this.dateRangeForm.controls['settlementStatus'].patchValue('')
      this.dateRangeForm.controls['settlementAmount'].patchValue(null)
      this.allSettlementList()
    }
  }

  allSettlementList() {
    this.isloading = true
    let payload = {
      startDate: this.dateRangeForm.value.start,
      endDate: this.dateRangeForm.value.end,
      settlementAmount: this.dateRangeForm.value.settlementAmount,
      // settlementStatus: this.dateRangeForm.value.settlementStatus,
    }
    this.transSrvService.getAllSettlement(payload).pipe(takeUntil(this.unsubcribe)).subscribe((settle: any) => {
      this.settlementList = settle.data;
      this.isloading = false
    })
  }

  viewSettlement(id: any) {
    this.router.navigateByUrl(`/auth/settlement/${id}`)
  }

  formatAmt(val: any) {
    return tableCurrency(val);
  }

  ngOnDestroy() {
    this.unsubcribe.next();
    this.unsubcribe.complete();
  }

  export() {
    if (this.settlementList.length > 0) {
      const exportName = "Settlement";
      const columns = [
        { title: " ID", value: "settlementId" },
        { title: "Currency ", value: "settlementCurrency" },
        { title: "Amount", value: "settlementAmount" },
        { title: "settlement Msc", value: "settlementMsc" },
        { title: "Payable", value: "settlementPayable" },
        { title: "VAT ", value: "settlementVat" },
        { title: "Status", value: "settlementStatus" },
        { title: "CreatedAt", value: "settlementCreatedAt" },
        { title: "Transaction Date ", value: "settlementTransactionDate" },
      ];
      exportTableToCSV(this.settlementList, columns, exportName);
    } else {
      this.genSrv.sweetAlertError('No Settlement Data Available')
    }
  }


}
