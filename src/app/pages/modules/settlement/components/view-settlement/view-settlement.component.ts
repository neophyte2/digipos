import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from "rxjs/operators";
import { exportTableToCSV, tableCurrency } from 'src/app/shared/utils/utils';
import { paymentMethods, responsesType } from 'src/app/shared/utils/data';
import { SettlementService } from '../../services/settlement.service';
import { GeneralService } from 'src/app/shared/services/general.service';
import { ActivatedRoute } from '@angular/router';

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
  year = new Date().getFullYear()
  private unsubcribe = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private genSrv: GeneralService,
    private readonly fb: FormBuilder,
    private settleService: SettlementService,
  ) {

  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.id = this.route.snapshot.params['id'];
    this.settlementByID(this.id)
  }

  goBack() {
    this.genSrv.goBack();
  }

  settlementByID(id: any) {
    this.isloading = true
    let payload = {
      settlementId: id
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
    if (this.settlementList.length > 0) {
      const exportName = "Settlement-Transaction";
      const columns = [
        { title: " ID", value: "trnId" },
        { title: "Currency ", value: "trnCurrency" },
        { title: "Amount", value: "trnAmount" },
        { title: "Service", value: "trnService" },
        { title: "Reference", value: "trnReference" },
        { title: "Account Number", value: "trnCrAccountNumber" },
        { title: "Channel", value: "trnChannel" },
        { title: "Terminal Id", value: "trnTerminalId" },
        { title: "Transaction Msc", value: "trnMsc" },
        { title: "Narration ", value: "trnNarration" },
        { title: "Payable", value: "trnPayable" },
        { title: "FEE ", value: "trnFee" },
        { title: "Status", value: "trnSettlementStatus" },
        { title: "CreatedAt", value: "trnCreatedAt" },
      ];
      exportTableToCSV(this.settlementList, columns, exportName);
    } else {
      this.genSrv.sweetAlertError('No Settlement Transaction Data Available')
    }
  }

}
