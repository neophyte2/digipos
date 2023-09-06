import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from "rxjs/operators";
import { tableCurrency } from 'src/app/shared/utils/utils';
import { SettlementService } from '../../services/settlement.service';
import { GeneralService } from 'src/app/shared/services/general.service';
import { ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import * as moment from 'moment';
import { paymentMethods, responsesType } from 'src/app/shared/utils/data';

@Component({
  selector: 'dp-view-settlement',
  templateUrl: './view-settlement.component.html',
  styleUrls: ['./view-settlement.component.css']
})
export class ViewSettlementComponent implements OnInit, OnDestroy {


  id: any
  loader: any = {
    btn: {
      download: false,
      pageLoader: false,
    },
  };
  query: any
  isloading = false
  selectedItem: any
  showModal = false;
  settlementList: any
  dropdown = false
  method = paymentMethods
  dateRangeForm!: FormGroup;
  filterList = [
    'Status',
    'Amount',
    'Reference',
    'Terminal ID',
    'Payment Method',
  ]
  responseList = responsesType
  year = new Date().getFullYear()
  month = (new Date().getMonth() + 1).toString().padStart(2, '0');
  day = new Date().getDate();
  private unsubcribe = new Subject<void>();
  filter: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private genSrv: GeneralService,
    private readonly fb: FormBuilder,
    private settleService: SettlementService,
  ) {
    var month = new Date().getMonth() + 1;
    var last_day = new Date(this.year, month, 0).getDate();
    this.dateRangeForm = new FormGroup({
      start: new FormControl(`${this.year}-${this.month}-01`),
      end: new FormControl(`${this.year}-${this.month}-${last_day}`),
      trnResponseCode: new FormControl(null),
      trnChannel: new FormControl(''),
      trnAmount: new FormControl(null),
      trnReference: new FormControl(''),
      trnTerminalId: new FormControl(''),
    });

    this.dateRangeForm.valueChanges.subscribe((data) => {
      if (data?.start && data?.end) {
        this.query = { startDate: moment(data?.start).format("YYYY-MM-DD"), endDate: moment(data?.end).format("YYYY-MM-DD") }
        this.settlementByID(this.id)
      }
    });
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.id = this.route.snapshot.params['id'];
    this.settlementByID(this.id)
  }

  clearData(event: any) {
    if (event.length === 0) {
      this.dateRangeForm.controls['trnReference'].patchValue('')
      this.dateRangeForm.controls['trnChannel'].patchValue('')
      this.dateRangeForm.controls['trnResponseCode'].patchValue('')
      this.dateRangeForm.controls['trnTerminalId'].patchValue('')
      this.dateRangeForm.controls['trnAmount'].patchValue(null)
      this.settlementByID(this.id)
    }
  }

  goBack() {
    this.genSrv.goBack();
  }

  settlementByID(id: any) {
    this.isloading = true
    let payload = {
      settlementId: id,
      trnReference: this.dateRangeForm.value.trnReference,
      trnChannel: this.dateRangeForm.value.trnChannel,
      trnResponseCode: this.dateRangeForm.value.trnResponseCode,
      trnTerminalId: this.dateRangeForm.value.trnTerminalId,
      trnAmount: this.dateRangeForm.value.trnAmount,
      startDate: this.dateRangeForm.value.start,
      endDate: this.dateRangeForm.value.end,
    }
    this.settleService.getSettlementById(payload).pipe(takeUntil(this.unsubcribe)).subscribe((settle: any) => {
      this.settlementList = settle.data;
      this.isloading = false
    })
  }


  getItemId(id: any) {
    this.dropdown = !this.dropdown
    this.selectedItem = id;
  }

  toggleModal(id?: any) {
    this.getItemId(0)
    this.id = id
    this.selectedItem = this.selectedItem
    this.showModal = !this.showModal;
  }

  toggleModal2() {
    this.showModal = !this.showModal;
  }


  formatAmt(val: any) {
    return tableCurrency(val);
  }

  ngOnDestroy() {
    this.unsubcribe.next();
    this.unsubcribe.complete();
  }


  export() {
    this.loader.download = true
    swal.fire({
      icon: 'info',
      title: 'Settlement Download',
      html: 'Loading ...',
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      didOpen: () => {
        swal.showLoading(swal.getDenyButton());
      }
    })
    let payload = {
      settlementId: this.id
    }
    this.settleService.settlementDownload(payload).pipe(takeUntil(this.unsubcribe)).subscribe((trans: any) => {
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

}
