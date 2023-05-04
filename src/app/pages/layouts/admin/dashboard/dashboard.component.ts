import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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
    { data: [], label: 'SuccessFul' },
    { data: [], label: 'Pending' },
    { data: [], label: 'Failed' },
  ];
  public barChartLabels: Label[] = ['NQR', 'USSD', 'PWBT', 'CARD', 'WALLET'];
  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      xAxes: [{
        // stacked:true,
      }],
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Counts'
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
  isVerified: any
  cardDataList: any
  translength: any
  transactionList: any
  dateRangeForm!: FormGroup;
  year = new Date().getFullYear()

  constructor(
    private adminSrv: AdminService,
    private genSrv: GeneralService,
    private transShrdService: TransactionSharedService
  ) {
    this.dateRangeForm = new FormGroup({
      start: new FormControl(`${this.year}-01-01`),
      end: new FormControl(`${this.year}-12-31`),
    });

    this.dateRangeForm.valueChanges.subscribe((data) => {
      if (data?.start && data?.end) {
        this.query = { startDate: moment(data?.start).format("YYYY-MM-DD"), endDate: moment(data?.end).format("YYYY-MM-DD") }
        this.cardsData();
        this.getChart();
        this.allTransactionList();
      }
    });
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.cardsData();
    this.getChart();
    this.allTransactionList();
    this.isVerified = this.genSrv.currentVerifyValue
  }

  cardsData() {
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

  getChart() {
    let payload = {
      organisationId: '',
      startDate: this.dateRangeForm.value.start,
      endDate: this.dateRangeForm.value.end,
    }
    this.adminSrv.readChart(payload).pipe(takeUntil(this.unsubcribe)).subscribe((trans: any) => {
      if (trans.responseCode === '00') {
        const list = trans.data
        const rawLabel = list.map((x: any) => x.trnChannel)
        const label: any = [...new Set(rawLabel)].sort();
        //cards
        const c_sucess = trans.data ? trans.data.filter((x: any) => x.trnChannel === 'CARD' && x.trnResponseCode === '00').map((x: any) => x.trnCount) : 0
        const c_pen = trans.data ? trans.data.filter((x: any) => x.trnChannel === 'CARD' && x.trnResponseCode === '09').map((x: any) => x.trnCount) : 0
        const c_fail = trans.data ? trans.data.filter((x: any) => x.trnChannel === 'CARD' && x.trnResponseCode === '22').map((x: any) => x.trnCount) : 0
        //nqr
        const n_sucess = trans.data ? trans.data.filter((x: any) => x.trnChannel === 'NQR' && x.trnResponseCode === '00').map((x: any) => x.trnCount) : 0
        const n_pen = trans.data ? trans.data.filter((x: any) => x.trnChannel === 'NQR' && x.trnResponseCode === '09').map((x: any) => x.trnCount) : 0
        const n_fail = trans.data ? trans.data.filter((x: any) => x.trnChannel === 'NQR' && x.trnResponseCode === '22').map((x: any) => x.trnCount) : 0
        //pwbt
        const p_sucess = trans.data ? trans.data.filter((x: any) => x.trnChannel === 'PWBT' && x.trnResponseCode === '00').map((x: any) => x.trnCount) : 0
        const p_pen = trans.data ? trans.data.filter((x: any) => x.trnChannel === 'PWBT' && x.trnResponseCode === '09').map((x: any) => x.trnCount) : 0
        const p_fail = trans.data ? trans.data.filter((x: any) => x.trnChannel === 'PWBT' && x.trnResponseCode === '22').map((x: any) => x.trnCount) : 0
        //wallet
        const W_sucess = trans.data ? trans.data.filter((x: any) => x.trnChannel === 'USSD' && x.trnResponseCode === '00').map((x: any) => x.trnCount) : 0
        const W_pen = trans.data ? trans.data.filter((x: any) => x.trnChannel === 'USSD' && x.trnResponseCode === '09').map((x: any) => x.trnCount) : 0
        const W_fail = trans.data ? trans.data.filter((x: any) => x.trnChannel === 'USSD' && x.trnResponseCode === '22').map((x: any) => x.trnCount) : 0
        //ussd
        const U_sucess = trans.data ? trans.data.filter((x: any) => x.trnChannel === 'WALLET' && x.trnResponseCode === '00').map((x: any) => x.trnCount) : 0
        const U_pen = trans.data ? trans.data.filter((x: any) => x.trnChannel === 'WALLET' && x.trnResponseCode === '00').map((x: any) => x.trnCount) : 0
        const U_fail = trans.data ? trans.data.filter((x: any) => x.trnChannel === 'WALLET' && x.trnResponseCode === '00').map((x: any) => x.trnCount) : 0
        this.barChartLabels = label
        this.barChartData = [
          {
            data: [c_sucess[0], n_sucess[0], p_sucess[0], U_sucess[0], W_sucess[0]],
            label: 'Successfull',
          },
          {
            data: [c_pen[0], n_pen[0], p_pen[0], U_pen[0], W_pen[0]],
            label: 'Pending',
          },
          {
            data: [c_fail[0], n_fail[0], p_fail[0], U_fail[0], W_fail[0]],
            label: 'Failed',
          },
        ]
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
