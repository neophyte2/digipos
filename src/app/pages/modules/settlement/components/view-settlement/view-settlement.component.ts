import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from "rxjs/operators";
import { tableCurrency } from 'src/app/shared/utils/utils';
import { SettlementService } from '../../services/settlement.service';
import { GeneralService } from 'src/app/shared/services/general.service';
import { ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';

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
