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
  public barChartLabels: Label[] = ['NQR', 'USSD', 'PWBT', 'CARD'];
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
          min: 0,
          callback: (value) => {
            return Number(value);
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
  translength: any
  cardDataPen: any
  cardDataFail: any
  isloading = false
  cardDataSuccess: any
  transactionList: any
  dateRangeForm!: FormGroup;
  year = new Date().getFullYear()
  day = new Date().getDate();
  month = (new Date().getMonth() + 1).toString().padStart(2, '0');

  constructor(
    private adminSrv: AdminService,
    private genSrv: GeneralService,
    private transShrdService: TransactionSharedService
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
        this.cardsDataSuccess();
        this.cardsDataFail()
        this.cardsDataPend()
        this.getChart();
        this.allTransactionList();
      }
    });
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.cardsDataSuccess();
    this.cardsDataFail()
    this.cardsDataPend()
    this.getChart();
    this.allTransactionList();
    this.isVerified = this.genSrv.currentVerifyValue
  }

  cardsDataSuccess() {
    let payload = {
      status: 'success',
      startDate: this.dateRangeForm.value.start,
      endDate: this.dateRangeForm.value.end,
    }
    this.transShrdService.stats(payload).pipe(takeUntil(this.unsubcribe)).subscribe((resp: any) => {
      if (resp.responseCode === '00') {
        this.cardDataSuccess = resp.data
      }
    })
  }

  cardsDataFail() {
    let payload = {
      status: 'failed',
      startDate: this.dateRangeForm.value.start,
      endDate: this.dateRangeForm.value.end,
    }
    this.transShrdService.stats(payload).pipe(takeUntil(this.unsubcribe)).subscribe((resp: any) => {
      if (resp.responseCode === '00') {
        this.cardDataFail = resp.data
      }
    })
  }

  cardsDataPend() {
    let payload = {
      status: 'pending',
      startDate: this.dateRangeForm.value.start,
      endDate: this.dateRangeForm.value.end,
    }
    this.transShrdService.stats(payload).pipe(takeUntil(this.unsubcribe)).subscribe((resp: any) => {
      if (resp.responseCode === '00') {
        this.cardDataPen = resp.data
      }
    })
  }

  allTransactionList() {
    this.isloading = true
    let payload = {
      startDate: this.dateRangeForm.value.start,
      endDate: this.dateRangeForm.value.end,
    }
    this.transShrdService.transactionList(payload).pipe(takeUntil(this.unsubcribe)).subscribe((trans: any) => {
      if (trans.responseCode === '00') {
        this.transactionList = trans.data ? trans.data.slice(0, 10) : []
        this.isloading = false
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
      const statusMap: Map<string, string> = new Map();
      statusMap.set("Successfull", "00")
      statusMap.set("Pending", "09")
      statusMap.set("Failed", "22")
      const channels = ["CARD", "NQR", "PWBT", "USSD"]
      type ResponseCodeCount = {
        responseCode: string;
        count: number;
      };

      type TransactionCount = {
        channel: string;
        respones: ResponseCodeCount[];
      };

      const channelTranstionCount: TransactionCount[] = [];
      const responseData = trans?.data || [];

      responseData.forEach((x: any) => {
        const { trnChannel, trnResponseCode, trnCount } = x;
        let channelInfo = channelTranstionCount.find(x => x.channel == trnChannel)
        if (channelInfo) {
          let responseCount = channelInfo.respones.find(x => x.responseCode == trnResponseCode)
          if (responseCount) {
            responseCount.count += trnCount || 0;
          } else {
            channelInfo.respones.push({
              responseCode: trnResponseCode,
              count: trnCount || 0
            })
          }
        } else {
          channelTranstionCount.push({
            channel: trnChannel,
            respones: [{
              responseCode: trnResponseCode,
              count: trnCount || 0
            }]
          })
        }
      });

      const barChartData = Array.from(statusMap.entries()).map(([status, code]) => {
        const data = channels.map((channel) => {
          const channelData = channelTranstionCount.find(x => x.channel == channel);
          return channelData?.respones.find(x => x.responseCode == code)?.count || 0;
        });
        return { data, label: status };
      });
      this.barChartLabels = channels;
      this.barChartData = barChartData;
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
