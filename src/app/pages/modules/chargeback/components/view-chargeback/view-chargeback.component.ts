import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from "rxjs/operators";
import { GeneralService } from 'src/app/shared/services/general.service';
import { ActivatedRoute } from '@angular/router';
import { tableCurrency } from 'src/app/shared/utils/utils';
import { ChargebackService } from '../../services/chargeback.service';

@Component({
  selector: 'dp-view-chargeback',
  templateUrl: './view-chargeback.component.html',
  styleUrls: ['./view-chargeback.component.css']
})

export class ViewChargebackComponent implements OnInit, OnDestroy {
  id: any
  chargeback: any
  private unsubcribe = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private genSrv: GeneralService,
    private chargeSrv: ChargebackService
  ) { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
   this.id = this.route.snapshot.params['id'];
    this.getSingleChargeback(this.id)
  }


  getSingleChargeback(id: any) {
    let payload = {
      chargebackId: id
    }
    this.chargeSrv.getSingleChargeback(payload).pipe(takeUntil(this.unsubcribe)).subscribe((data: any) => {
      this.chargeback = data;
    })
  }

  confirmStatus(data: any, statusName: string) {
    this.genSrv.sweetAlertDecision(statusName, data.chargebackReference).then((result) => {
      if (result.isConfirmed) {
        if (statusName === 'Approve') {
          this.approve()
        } else {
          this.declined()
        }

      }
    })
  }

  approve() {
    let payload = {
      chargebackId: this.id
    }
    this.chargeSrv.approveChargeback(payload).pipe(takeUntil(this.unsubcribe)).subscribe((data: any) => {
      if (data.responseCode === '00') {
        this.genSrv.sweetAlertSuccess(data.responseMessage);
        this.getSingleChargeback(this.id)
      } else {
        let msg = data.responseMessage
        this.genSrv.sweetAlertError(msg);
      }
    }, (err) => {
      let msg = err
      this.genSrv.sweetAlertError(msg);
    })
  }

  declined() {
    let payload = {
      chargebackId: this.id
    }
    this.chargeSrv.declineChargeback(payload).pipe(takeUntil(this.unsubcribe)).subscribe((data: any) => {
      if (data.responseCode === '00') {
        this.genSrv.sweetAlertSuccess(data.responseMessage);
        this.getSingleChargeback(this.id)
      } else {
        let msg = data.responseMessage
        this.genSrv.sweetAlertError(msg);
      }
    }, (err) => {
      let msg = err
      this.genSrv.sweetAlertError(msg);
    })

  }

  formatAmt(val: any) {
    return tableCurrency(val);
  }

  goBack() {
    this.genSrv.goBack();
  }


  ngOnDestroy() {
    this.unsubcribe.next();
    this.unsubcribe.complete();
  }

}
