import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from "rxjs/operators";
import { TerminalService } from '../../services/terminal.service';
import { GeneralService } from 'src/app/shared/services/general.service';
import { ActivatedRoute } from '@angular/router';
import { tableCurrency } from 'src/app/shared/utils/utils';

@Component({
  selector: 'dp-view-terminal',
  templateUrl: './view-terminal.component.html',
  styleUrls: ['./view-terminal.component.css']
})

export class ViewTerminalComponent implements OnInit, OnDestroy {


  terminal :any
  terminalList: any
  private unsubcribe = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private genSrv: GeneralService,
    private terminSrv: TerminalService,
  ) {
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    let id = this.route.snapshot.params['id'];
    this.getTerminalTransactions(id)
    this.getSingleTerminal(id)
  }

  getTerminalTransactions(id: any) {
    let payload = {
      terminalId: id
    }
    this.terminSrv.getTerminalTransition(payload).pipe(takeUntil(this.unsubcribe)).subscribe((trans: any) => {
      this.terminalList = trans.data;
    })
  }

  getSingleTerminal(id: any) {
    let payload = {
      terminalId: id
    }
    this.terminSrv.getSingleTerminal(payload).pipe(takeUntil(this.unsubcribe)).subscribe((data: any) => {
      this.terminal = data;
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
