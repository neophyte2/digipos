import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { SettingsService } from '../../../services/settings.service';

@Component({
  selector: 'dp-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})

export class UsersComponent implements OnInit, OnDestroy {

  userList: any
  loader: any = {
    btn: {
      download: false,
      pageLoader: false,
    },
  };

  private unsubcribe = new Subject<void>();

  constructor(
    private setSrv: SettingsService,
    private readonly fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.users()
  }

  users() {
    let payload = {
      customerPhone: "",
      customerFirstName: "",
      customerLastName: "",
      customerCountryCode: "",
      customerCountry: "",
      customerPassword: "",
      customerConfirmPassword: "",
      customerLink: ""
    }
    this.setSrv.allUsers(payload).pipe(takeUntil(this.unsubcribe)).subscribe((user: any) => {
      this.userList = user.data;
    })
  }

  ngOnDestroy() {
    this.unsubcribe.next();
    this.unsubcribe.complete();
  }

}
