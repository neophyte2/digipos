import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'dp-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})

export class TeamComponent implements OnInit {


  title = 'Invites'

  constructor() { };

  ngOnInit(): void {
  }

  tileName(name: any) {
    this.title = name;
  }

}