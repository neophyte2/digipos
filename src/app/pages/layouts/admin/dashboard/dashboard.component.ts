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
import { AdminService } from '../service/admin.service';

@Component({
  selector: 'dp-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  public barChartData: ChartDataSets[] = [
    { data: [180, 480, 770, 90,], label: 'SuccessFul' },
    { data: [28, 48, 40, 19,], label: 'Pending' },
    { data: [65, 59, 80, 81,], label: 'Failed' },
  ];
  public barChartLabels: Label[] = ['NQR', 'USSD', 'PWBT', 'CARD'];
  public barChartOptions: ChartOptions = {
    responsive: true,
    tooltips: {
      callbacks: {
        label: function (tooltipItem, data) {
          return tableCurrency(tooltipItem.yLabel);
        }
      }
    },
    scales: {
      xAxes: [{
        // stacked:true,
      }],
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Amount (In Naira)'
        },
        ticks: {
          callback: (value, index) => {
            return Number(value).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          }
        }
      }]
    }
  };
  public barChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(53, 177, 114, 1)',
    },
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255, 138, 0, 1)',
    },
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255, 0, 0, 1)',
    },
  ];

  public barChartLegend = true;
  public barChartType = 'bar';
  public barChartPlugins = [];
  private unsubcribe = new Subject<void>();

  //dates
  query: any
  cardDataList: any
  translength: any
  transactionList: any
  dateRangeForm!: FormGroup;
  year = new Date().getFullYear()

  constructor(
    private adminSrv: AdminService,
    private fb: FormBuilder,
    private transShrdService: TransactionSharedService
  ) {
    this.dateRangeForm = new FormGroup({
      start: new FormControl(`${this.year}-01-01`),
      end: new FormControl(`${this.year}-12-31`),
    });

    this.dateRangeForm.valueChanges.subscribe((data) => {
      if (data?.start && data?.end) {
        this.query = { startDate: moment(data?.start).format("YYYY-MM-DD"), endDate: moment(data?.end).format("YYYY-MM-DD") }
        this.cardsData()
        this.allTransactionList();
      }
    }
    );
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.cardsData()
    this.allTransactionList()
  }

  cardsData() {
    let payload = {
      startDate: this.dateRangeForm.value.start,
      endDate: this.dateRangeForm.value.end,
    }
    this.adminSrv.stats(payload).pipe(takeUntil(this.unsubcribe)).subscribe((resp: any) => {
      if (resp.responseCode === '00') {
        this.cardDataList = resp.data
      }
    })
  }

  allTransactionList() {
    let payload = {
      organisationId: '',
      startDate: this.dateRangeForm.value.start,
      endDate: this.dateRangeForm.value.end,
    }
    this.adminSrv.recentTransaction(payload).pipe(takeUntil(this.unsubcribe)).subscribe((trans: any) => {
      if (trans.responseCode === '00') {
        this.transactionList = trans.data ? trans.data.slice(0, 10) : []
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
