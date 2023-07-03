import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from "rxjs/operators";
import { GeneralService } from 'src/app/shared/services/general.service';
import { ActivatedRoute } from '@angular/router';
import { tableCurrency } from 'src/app/shared/utils/utils';
import { ChargebackService } from '../../services/chargeback.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'dp-view-chargeback',
  templateUrl: './view-chargeback.component.html',
  styleUrls: ['./view-chargeback.component.css']
})

export class ViewChargebackComponent implements OnInit, OnDestroy {

  id: any
  loader: any = {
    btn: {
      create: false,
    },
  };
  evidence: any
  chargeback: any
  showModal = false;
  chargebackForm!: FormGroup;
  base64Contents: string | undefined;
  private unsubcribe = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private genSrv: GeneralService,
    private readonly fb: FormBuilder,
    private chargeSrv: ChargebackService
  ) { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.ngOnForms()
    this.id = this.route.snapshot.params['id'];
    this.getSingleChargeback(this.id)
  }

  get cf() {
    return this.chargebackForm.controls;
  }

  toggleModal() {
    this.showModal = !this.showModal;
  }

  ngOnForms() {
    this.chargebackForm = this.fb.group({
      chargebackEvidence: [''],
    });
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

  //Upload
  browseFile(event: any, type?: any) {
    const fileName = event.target.files[0]
    const size = 5 * 1024 * 1024;
    if (fileName.size > size) {
      this.genSrv.sweetAlertSuccess('File is Larger Than 5MB')
    } else {
      if (type === 'evidence') this.evidence = fileName;
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        const contents: string = e.target.result;
        this.base64Contents = contents.replace(/^data:image\/(png|jpg);base64,/, "");
        if (this.base64Contents) {
          if (type === 'evidence') {
            this.chargebackForm.controls['chargebackEvidence'].patchValue(this.base64Contents);
          }
        }
      };
      reader.readAsDataURL(fileName);
    }
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
      chargebackId: this.id,
      chargeBackRejectEvidence: this.cf['chargebackEvidence'].value,
    }
    this.loader.btn.create = true;

    this.chargeSrv.declineChargeback(payload).pipe(takeUntil(this.unsubcribe)).subscribe((data: any) => {
      if (data.responseCode === '00') {
        this.genSrv.sweetAlertSuccess(data.responseMessage);
        this.getSingleChargeback(this.id)
        this.toggleModal()
        this.loader.btn.create = false;
      } else {
        let msg = data.responseMessage
        this.genSrv.sweetAlertError(msg);
        this.loader.btn.create = false;
      }
    }, (err) => {
      let msg = err
      this.genSrv.sweetAlertError(msg);
      this.loader.btn.create = false;
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
