import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { GeneralService } from 'src/app/shared/services/general.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { AuditLogService } from '../../services/audit-log.service';

@Component({
  selector: 'dp-audit-log',
  templateUrl: './audit-log.component.html',
  styleUrls: ['./audit-log.component.css']
})

export class AuditLogsComponent implements OnInit, OnDestroy {

  id
  loader: any = {
    btn: {
      create: false,
    },
  };
  query: any
  auditLogList: any;
  isloading = false;
  dateRangeForm!: FormGroup;

  year = new Date().getFullYear()
  month = (new Date().getMonth() + 1).toString().padStart(2, '0');
  day = new Date().getDate();
  private unsubcribe = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private genSrv: GeneralService,
    private auditSrv: AuditLogService,
  ) {
    this.id = this.route.snapshot.params['id'];
    this.dateRangeForm = new FormGroup({
      start: new FormControl(''),
      end: new FormControl(''),
    });

    this.dateRangeForm.valueChanges.subscribe((data) => {
      if (data?.start && data?.end) {
        this.query = { startDate: moment(data?.start).format("YYYY-MM-DD"), endDate: moment(data?.end).format("YYYY-MM-DD") }
        this.getAllAuditLogs()
      }
    });
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    if (this.id) this.getAllAuditLogs()
    if (!this.id) this.getAllAuditLogsById()
  }

  getAllAuditLogs() {
    this.isloading = true
    let payload = {
      endDate: this.dateRangeForm.value.end,
      startDate: this.dateRangeForm.value.start,
      auditModule: ''
    }
    this.auditSrv.getAllAuditLogs(payload).subscribe((audit: any) => {
      this.auditLogList = audit.data;
      this.isloading = false
    })
  }

  getAllAuditLogsById() {
    this.isloading = true
    let payload = {
      endDate: this.dateRangeForm.value.end,
      startDate: this.dateRangeForm.value.start,
      auditModule: ''
    }
    this.auditSrv.getAuditLogsUserID(payload).subscribe((audit: any) => {
      this.auditLogList = audit.data;
      this.isloading = false
    })
  }

  goBack() {
    this.genSrv.goBack();
  }

  ngOnDestroy() {
    this.unsubcribe.next();
    this.unsubcribe.complete();
  }
}
