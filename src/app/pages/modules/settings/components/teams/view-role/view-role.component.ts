import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { GeneralService } from 'src/app/shared/services/general.service';
import { SettingsService } from '../../../services/settings.service';

@Component({
  selector: 'dp-view-role',
  templateUrl: './view-role.component.html',
  styleUrls: ['./view-role.component.css']
})

export class ViewRoleComponent implements OnInit, OnDestroy {

  roleList: any
  currentRole: any
  permissionList: any
  private unsubcribe = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private genSrv: GeneralService,
    private setSrv: SettingsService,
  ) { };

  ngOnInit(): void {
    window.scrollTo(0, 0);
    let id = this.route.snapshot.params['id'];
    this.getRoleById(id)

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
        this.roleList = data.role
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