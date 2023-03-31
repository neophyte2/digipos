import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from "rxjs/operators";
import { tableCurrency, VALIDEMAILREGEX } from 'src/app/shared/utils/utils';
import { TerminalService } from '../../services/terminal.service';
import { GeneralService } from 'src/app/shared/services/general.service';
import { UserSharedService } from 'src/app/shared/services/userShared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'dp-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.css']
})

export class TerminalComponent implements OnInit, OnDestroy {

  loader: any = {
    btn: {
      create: false,
    },
  };
  selectedItem: any
  userList: any
  query: any
  showModal = false;
  dropdown = false
  terminalList: any
  dateRangeForm!: FormGroup;
  terminalForm!: FormGroup;
  year = new Date().getFullYear()
  private unsubcribe = new Subject<void>();

  constructor(
    private router: Router,
    private genSrv: GeneralService,
    private readonly fb: FormBuilder,
    private terminSrv: TerminalService,
    private userShdSrv: UserSharedService,
  ) {
    this.dateRangeForm = new FormGroup({
      start: new FormControl(`${this.year}-01-01`),
      end: new FormControl(`${this.year}-12-31`),
    });

    this.dateRangeForm.valueChanges.subscribe((data) => {
      if (data?.start && data?.end) {
        this.query = { startDate: moment(data?.start).format("YYYY-MM-DD"), endDate: moment(data?.end).format("YYYY-MM-DD") }
        this.allTerminals();
      }
    });
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.ngOnForms()
    this.allTerminals()
    this.users()
  }

  users() {
    this.userShdSrv.getUserByOrg().pipe(takeUntil(this.unsubcribe)).subscribe((user: any) => {
      const userMap = user.data.map((data: any) => ({
        ...data,
        fullname: `${data.customerFirstName} ${data.customerLastName}`,
      }))
      this.userList = userMap.filter((data: any) => {
        if (data.customerStatus === 'ACTIVE') {
          return data
        }
      })
    })
  }

  allTerminals() {
    let payload = {
      startDate: this.dateRangeForm.value.start,
      endDate: this.dateRangeForm.value.end,
    }
    this.terminSrv.getAllTerminals(payload).pipe(takeUntil(this.unsubcribe)).subscribe((trans: any) => {
      this.terminalList = trans.data;
    })
  }

  get tf() {
    return this.terminalForm.controls;
  }

  toggleModal() {
    this.showModal = !this.showModal;
    if(this.showModal)  this.generateReference()
  }

  viewTerminal(id: any) {
    this.router.navigateByUrl(`/auth/terminal/${id}`)
  }

  getItemId(id: any) {
    this.dropdown = !this.dropdown
    this.selectedItem = id;
  }

  ngOnForms() {
    this.terminalForm = this.fb.group({
      terminalCustomerId: [null, Validators.required,],
      terminalSerial: [{ value: '', disabled: true },  Validators.required],
    });
  }

  createTerminal() {
    let payload = {
      terminalCustomerId: this.tf['terminalCustomerId'].value,
      terminalSerial: this.tf['terminalSerial'].value,
    }
    this.loader.btn.create = true;
    this.terminSrv.createTerminal(payload).pipe(takeUntil(this.unsubcribe)).subscribe((data: any) => {
      if (data.responseCode === '00') {
        this.genSrv.sweetAlertSuccess(data.responseMessage);
        this.allTerminals()
        this.loader.btn.create = false;
        this.terminalForm.reset()
        this.toggleModal();
      } else {
        let msg = data.responseMessage
        this.genSrv.sweetAlertError(msg);
        this.loader.btn.create = false;
        this.toggleModal();
      }
    }, (err) => {
      let msg = err
      this.genSrv.sweetAlertError(msg);
      this.loader.btn.create = false;
      this.toggleModal();
    })
  }

  generateReference() {
    const number: number = Math.floor(Math.random() * 9) + 1; // First digit can't be 0
    const restOfDigits: string = Math.random().toString().slice(2, 12); // Generates 10 random digits
    const result: string = number.toString() + restOfDigits;
    this.terminalForm.controls['terminalSerial'].patchValue(result)
  }

  // Deactivate & Activate

  confirmStatus(data: any, statusName: string) {
    this.getItemId(0)
    this.selectedItem = this.selectedItem
    this.genSrv.sweetAlertDecision(statusName, data.terminalId).then((result) => {
      if (result.isConfirmed) {
        if (statusName === 'Activate') {
          this.activate(data.terminalId)
        } else {
          this.deactivate(data.terminalId)
        }
      }
    })
  }

  activate(id: any) {
    let payload = {
      terminalId: id
    }
    this.terminSrv.activateTerminal(payload).pipe(takeUntil(this.unsubcribe)).subscribe((data: any) => {
      if (data.responseCode === '00') {
        this.genSrv.sweetAlertSuccess(data.responseMessage);
        this.allTerminals()
      } else {
        let msg = data.responseMessage
        this.genSrv.sweetAlertError(msg);
      }
    }, (err) => {
      let msg = err
      this.genSrv.sweetAlertError(msg);
    })
  }

  deactivate(id: any) {
    let payload = {
      terminalId: id
    }
    this.terminSrv.deactivateTerminal(payload).pipe(takeUntil(this.unsubcribe)).subscribe((data: any) => {
      if (data.responseCode === '00') {
        this.genSrv.sweetAlertSuccess(data.responseMessage);
        this.allTerminals()
      } else {
        let msg = data.responseMessage
        this.genSrv.sweetAlertError(msg);
      }
    }, (err) => {
      let msg = err
      this.genSrv.sweetAlertError(msg);
    })

  }

  ngOnDestroy() {
    this.unsubcribe.next();
    this.unsubcribe.complete();
  }

}
