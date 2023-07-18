import { Component, OnDestroy, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/shared/services/general.service';

@Component({
  selector: 'dp-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})

export class LayoutComponent implements OnInit {

  title = 'Profile'

  constructor(
    private genSrv :GeneralService
  ) { };

  ngOnInit(): void {
  }

  tileName(name:any){
    this.title = name;
  }

  _isRouteEnabled = (route: string[]) => this.genSrv.isRouteEnabled(route)

}
