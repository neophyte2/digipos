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

@Component({
  selector: 'dp-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  // public lineChartData: ChartDataSets[] = [
  //   { data: [65, 59, 80, 81, 56, 55, 40, 770, 90, 1000, 270, 400], label: 'SuccessFul' },
  //   { data: [28, 48, 40, 19, 86, 27, 90, 180, 480, 770, 90, 1000,], label: 'Pending' },
  //   { data: [180, 480, 770, 90, 1000, 270, 400, 28, 48, 40, 19, 86,], label: 'Failed' },
  // ];
  // public lineChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  // public lineChartOptions: ChartOptions = {
  //   responsive: true,
  //   tooltips: {
  //     callbacks: {
  //       label: function (tooltipItem, data) {
  //         return tableCurrency(tooltipItem.yLabel);
  //       }
  //     }
  //   },
  //   scales: {
  //     yAxes: [{
  //       scaleLabel: {
  //         display: true,
  //         labelString: 'Amount (In Naira)'
  //       },
  //       ticks: {
  //         callback: (value, index) => {
  //           return Number(value).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  //         }
  //       }
  //     }]
  //   }
  // };
  // public lineChartColors: Color[] = [
  //   {
  //     borderColor: 'rgba(53, 177, 114, 1)',
  //     backgroundColor: 'transparent'
  //   },
  //   {
  //     borderColor: 'rgba(255, 138, 0, 1)',
  //     backgroundColor: 'transparent'
  //   },
  //   {
  //     borderColor: 'rgba(255, 0, 0, 1)',
  //     backgroundColor: 'transparent'
  //   },
  // ];
  // public lineChartLegend = true;
  // public lineChartType: string = 'bar';
  // public lineChartPlugins = [];

  public barChartData: ChartDataSets[] = [
    { data: [180, 480, 770, 90, 1000, 270, 400, 770, 90, 1000, 270, 400], label: 'SuccessFul' },
    { data: [28, 48, 40, 19, 86, 27, 90, 180, 480, 770, 90, 1000,], label: 'Pending' },
    { data: [65, 59, 80, 81, 56, 55, 40, 28, 48, 40, 19, 86,], label: 'Failed' },
  ];
  public barChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
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
  translength: any
  transactionList: any
  dateRangeForm!: FormGroup;
  year = new Date().getFullYear()

  constructor(
    private readonly fb: FormBuilder,
    private genService: GeneralService,
    private transShrdService: TransactionSharedService
  ) {
    this.dateRangeForm = new FormGroup({
      start: new FormControl(`${this.year}-01-01`),
      end: new FormControl(`${this.year}-12-31`),
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
    this.allTransactionList()
  }

  allTransactionList() {
    let payload = {
      trnReference: "",
      trnService: '',
      trnResponseCode: '',
      trnResponseMessage: '',
      trnAmount: '',
      startDate: this.dateRangeForm.value.start,
      endDate: this.dateRangeForm.value.end,
    }
    this.transShrdService.transactionList(payload).pipe(takeUntil(this.unsubcribe)).subscribe((trans: any) => {
      if (trans.responseCode === '00') {
        this.translength = trans.data ? trans.data.length : 0
        this.transactionList = trans.data ? trans.data.slice(0, 10) : []
      }
    }, (err) => {
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
