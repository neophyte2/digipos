import { Component, OnInit, TemplateRef } from '@angular/core';

@Component({
  selector: 'dp-kyc',
  templateUrl: './kyc.component.html',
  styleUrls: ['./kyc.component.css']
})
export class KycComponent implements OnInit {

  visible:boolean = false;
  ClickLinkAccount:boolean = true; 

  constructor() { }

  ngOnInit(): void {
  }

  onLinkAccount(){
    this.visible= !this.visible;
    this.ClickLinkAccount = !this.ClickLinkAccount;
  }
  
}
