import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GeneralService } from 'src/app/shared/services/general.service';

@Component({
  selector: 'dp-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.css']
})
export class AsideComponent implements OnInit {

  accountType: any

  constructor(
    public router: Router,
    private genSrv : GeneralService
  ) {
  }

  ngOnInit(): void {
    let acctType: any = this.genSrv.userDetails;
    this.accountType = acctType.customerAccountType
  }

}
