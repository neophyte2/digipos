import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from "rxjs/operators";

@Component({
  selector: 'dp-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  private unsubcribe = new Subject<void>();

  constructor(
  ) { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
  }


  ngOnDestroy() {
    this.unsubcribe.next();
    this.unsubcribe.complete();
  }

}
