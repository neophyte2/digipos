import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/shared/services/general.service';
import { initFlowbite } from 'flowbite'

@Component({
  selector: 'dp-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {


  constructor(
    public genSrv: GeneralService
  ) { }

  ngOnInit(): void {
    initFlowbite()
  }


}
