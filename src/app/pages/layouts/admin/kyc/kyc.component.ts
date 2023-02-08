import { Component, OnInit, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-kyc',
  templateUrl: './kyc.component.html',
  styleUrls: ['./kyc.component.css']
})
export class KycComponent implements OnInit {

  ClickLinkAccount:boolean = true; 
  visible:boolean = false;

  constructor() { }

  ngOnInit(): void {
  }
  onLinkAccount(){
    this.ClickLinkAccount = !this.ClickLinkAccount;
    this.visible= !this.visible;

  }
  
}
