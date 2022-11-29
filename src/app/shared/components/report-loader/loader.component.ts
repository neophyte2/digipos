import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {

  //spinnerStatus: string;
  @Input() spinnerType: string;
  @Input() spinnerStyle: any = {};
  @Input() dataless: any = {
    title: "No data available.",
    subTitle: "No data available.",
    action: "Create"
  };
  @Input() spinnerStatus: string;
  @Output() reloadSpinner = new EventEmitter();
  @Output() actionState = new EventEmitter();

  constructor() {
    this.spinnerType = "chase";
    this.spinnerStatus = "Loading...";
  }

  ngOnInit() { }

  retry(spinnerType: any) {
    this.reloadSpinner.emit(spinnerType);
  }

  action(spinnerType: any) {
    this.actionState.emit(spinnerType);
  }


}
