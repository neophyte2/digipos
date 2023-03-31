import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'dp-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})

export class LayoutComponent implements OnInit {

  title = 'Profile'

  constructor() { };

  ngOnInit(): void {
  }

  tileName(name:any){
    this.title = name;
  }

}
