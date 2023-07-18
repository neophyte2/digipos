import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { GeneralService } from 'src/app/shared/services/general.service';
import { UserSharedService } from 'src/app/shared/services/userShared.service';
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
  isloading = false
  selectedItem: any
  dropdown = false

  private unsubcribe = new Subject<void>();

  constructor(
    private setSrv: SettingsService,
    private genSrv: GeneralService,
    private userShdSrv: UserSharedService,
  ) { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.users()
  }

  users() {
    this.isloading = true
    this.userShdSrv.getUserByOrg().pipe(takeUntil(this.unsubcribe)).subscribe((user: any) => {
      this.userList = user.data;
      this.isloading =false
    })
  }

  getItemId(id: any) {
    this.dropdown = !this.dropdown
    this.selectedItem = id;
  }

  confirmStatus(data: any, statusName: string) {
    this.getItemId(0)
    this.selectedItem = this.selectedItem
    const name = data.customerFirstName + ' ' + data.customerLastName
    this.genSrv.sweetAlertDecision(statusName, name).then((result) => {
      if (result.isConfirmed) {
        if (statusName === 'Activate') {
          this.activate(data.customerId)
        } else {
          this.deactivate(data.customerId)
        }
      }
    })
  }

  deactivate(id: any) {
    let payload = {
      customerId: id
    }
    this.setSrv.deactivateUser(payload).pipe(takeUntil(this.unsubcribe)).subscribe((data: any) => {
      if (data.responseCode === '00') {
        this.genSrv.sweetAlertSuccess(data.responseMessage);
        this.users()
      } else {
        let msg = data.responseMessage
        this.genSrv.sweetAlertError(msg);
      }
    }, (err) => {
      let msg = err
      this.genSrv.sweetAlertError(msg);
    })

  }

  activate(id: any) {
    let payload = {
      customerId: id
    }
    this.setSrv.activateUser(payload).pipe(takeUntil(this.unsubcribe)).subscribe((data: any) => {
      if (data.responseCode === '00') {
        this.genSrv.sweetAlertSuccess(data.responseMessage);
        this.users()
      } else {
        let msg = data.responseMessage
        this.genSrv.sweetAlertError(msg);
      }
    }, (err) => {
      let msg = err
      this.genSrv.sweetAlertError(msg);
    })

  }

  ngOnDestroy() {
    this.unsubcribe.next();
    this.unsubcribe.complete();
  }

  _isRouteEnabled = (route: string[]) => this.genSrv.isRouteEnabled(route)
}
