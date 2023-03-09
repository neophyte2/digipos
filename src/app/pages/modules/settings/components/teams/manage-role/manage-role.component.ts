import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { GeneralService } from 'src/app/shared/services/general.service';
import { SettingsService } from '../../../services/settings.service';

@Component({
  selector: 'dp-manage-role',
  templateUrl: './manage-role.component.html',
  styleUrls: ['./manage-role.component.css']
})

export class ManageRoleComponent implements OnInit, OnDestroy {

  roleList: any
  currentRole: any
  permissionList: any
  private unsubcribe = new Subject<void>();

  constructor(
    private genSrv: GeneralService,
    private setSrv: SettingsService,
  ) { };

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.allRoles()
  }

  allRoles() {
    this.setSrv.getAllRoles().pipe(takeUntil(this.unsubcribe)).subscribe((data: any) => {
      if (data.responseCode === '00') {
        this.roleList = data.data
        this.currentRole = data.data[0].roleName
        this.getRoleById(data.data[0].roleId)
      }
    })
  }

  onClick(event: any) {
    this.currentRole = event.roleName
    this.getRoleById(event.roleId)
  }

  getRoleById(id: any) {
    this.permissionList = ''
    let payload = {
      rolePrivilegeRoleId: id
    }
    this.setSrv.getPermissions(payload).pipe(takeUntil(this.unsubcribe)).subscribe((data: any) => {
      if (data.responseCode === '00') {
        this.permissionList = data.data
      }
    })
  }

  goBack() {
    this.genSrv.goBack();
  }

  ngOnDestroy() {
    this.unsubcribe.next();
    this.unsubcribe.complete();
  }

}