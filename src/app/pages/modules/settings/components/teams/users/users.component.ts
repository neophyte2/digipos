import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { GeneralService } from 'src/app/shared/services/general.service';
import { UserSharedService } from 'src/app/shared/services/userShared.service';
import { SettingsService } from '../../../services/settings.service';
import { ActivatedRoute, Router } from '@angular/router';

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
  roleList: any
  updateModal = false
  roleForm!: FormGroup;
  private unsubcribe = new Subject<void>();

  constructor(
    private router: Router,
    private genSrv: GeneralService,
    private setSrv: SettingsService,
    private readonly fb: FormBuilder,
    private userShdSrv: UserSharedService,
  ) { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.users()
  }

  ngOnForms(data?: any) {
    this.roleForm = this.fb.group({
      customerRole: [null, Validators.required],
      customerId: [Number(data?.customerId), Validators.required],
    });
  }

  users() {
    this.isloading = true
    this.userShdSrv.getUserByOrg().pipe(takeUntil(this.unsubcribe)).subscribe((user: any) => {
      this.userList = user.data;
      this.isloading = false
    })
  }

  getItemId(id: any) {
    this.dropdown = !this.dropdown
    this.selectedItem = id;
  }

  allRoles(item?: any) {
    this.setSrv.getAllRoles().pipe(takeUntil(this.unsubcribe)).subscribe((data: any) => {
      if (data.responseCode === '00') {
        this.roleList = data.data.filter((role:any) => role.roleName != item.customerOrganisationRole)
      }
    })
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

  changeRoleModal(item?: any) {
    if (item) {
      this.ngOnForms(item)
      this.allRoles(item)
    }
    this.updateModal = !this.updateModal;
    this.getItemId(0)
  }

  get ulf() {
    return this.roleForm.controls;
  }

  changeRole() {
    let payload = {
      customerRole: this.ulf['customerRole'].value,
      customerId: this.ulf['customerId'].value,
    }
    this.loader.btn.update = true;
    this.setSrv.changeUserRole(payload).pipe(takeUntil(this.unsubcribe)).subscribe((data: any) => {
      if (data.responseCode === '00') {
        this.genSrv.sweetAlertSuccess(data.responseMessage);
        this.users()
        this.loader.btn.update = false;
        this.roleForm.reset()
        this.changeRoleModal();
      } else {
        let msg = data.responseMessage
        this.genSrv.sweetAlertError(msg);
        this.loader.btn.update = false;
      }
    }, (err) => {
      let msg = err
      this.genSrv.sweetAlertError(msg);
      this.loader.btn.update = false;
    })
  }

  goTo(id: any) {
    this.router.navigate(["/auth//settings/user-log/" + id]);
  }

  _isRouteEnabled = (route: string[]) => this.genSrv.isRouteEnabled(route)
}
