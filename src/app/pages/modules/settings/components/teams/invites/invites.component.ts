import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { GeneralService } from 'src/app/shared/services/general.service';
import { acctType } from 'src/app/shared/utils/data';
import { VALIDEMAILREGEX } from 'src/app/shared/utils/utils';
import { SettingsService } from '../../../services/settings.service';

@Component({
  selector: 'dp-invites',
  templateUrl: './invites.component.html',
  styleUrls: ['./invites.component.css']
})

export class InvitesComponent implements OnInit, OnDestroy {

  accountType = acctType;
  inviteList: any
  roleList: any
  loader: any = {
    btn: {
      invite: false,
      update: false,
    },
  };
  selectedItem: any
  dropdown = false
  showModal = false;
  updateModal = false
  inviteForm!: FormGroup;
  updateInviteForm!: FormGroup;
  private unsubcribe = new Subject<void>();

  constructor(
    private router: Router,
    private genSrv: GeneralService,
    private setSrv: SettingsService,
    private readonly fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.allRoles()
    this.users()
    this.ngOnForms()
  }

  // Get login Form Value
  get lf() {
    return this.inviteForm.controls;
  }

  get ulf() {
    return this.updateInviteForm.controls;
  }

  ngOnForms(data?: any) {
    this.inviteForm = this.fb.group({
      customerEmail: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(VALIDEMAILREGEX),
        ]),
      ],
      customerRole: [null, Validators.required],
    });
    this.updateInviteForm = this.fb.group({
      inviteId: [
        { value: data?.inviteCustomerEmail, disabled: true },
        Validators.compose([
          Validators.required,
          Validators.pattern(VALIDEMAILREGEX),
        ]),
      ],
      roleId: [Number(data?.inviteCustomerRole), Validators.required],
    });
  }

  toggleModal() {
    this.showModal = !this.showModal;
  }

  changeRoleModal(item?: any) {
    console.log(item);
    if (item) {
      this.ngOnForms(item)
    }
    this.updateModal = !this.updateModal;
    this.getItemId(0)
  }

  users() {
    this.setSrv.allInvite().pipe(takeUntil(this.unsubcribe)).subscribe((invite: any) => {
      this.inviteList = invite.data;
    })
  }

  getItemId(id: any) {
    this.dropdown = !this.dropdown
    this.selectedItem = id;
  }

  allRoles() {
    this.setSrv.getAllRoles().pipe(takeUntil(this.unsubcribe)).subscribe((data: any) => {
      if (data.responseCode === '00') {
        this.roleList = data.data
      }
    })
  }

  invite() {
    let payload = {
      customerEmail: this.lf['customerEmail'].value,
      customerRole: this.lf['customerRole'].value,
    }
    this.loader.btn.invite = true;
    this.setSrv.inviteUser(payload).pipe(takeUntil(this.unsubcribe)).subscribe((data: any) => {
      if (data.responseCode === '00') {
        this.genSrv.sweetAlertSuccess(data.responseMessage);
        this.users()
        this.loader.btn.invite = false;
        this.inviteForm.reset()
        this.toggleModal();
      } else {
        let msg = data.responseMessage
        this.genSrv.sweetAlertError(msg);
        this.loader.btn.invite = false;
      }
    }, (err) => {
      let msg = err
      this.genSrv.sweetAlertError(msg);
      this.loader.btn.invite = false;
    })
  }

  updateInvite() {
    let payload = {
      inviteId: this.ulf['inviteId'].value,
      roleId: this.ulf['roleId'].value,
    }
    this.loader.btn.update = true;
    this.setSrv.changeInviteRole(payload).pipe(takeUntil(this.unsubcribe)).subscribe((data: any) => {
      if (data.responseCode === '00') {
        this.genSrv.sweetAlertSuccess(data.responseMessage);
        this.users()
        this.loader.btn.update = false;
        this.inviteForm.reset()
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

  getRoleById(id: any) {
    let role = this.roleList ? this.roleList.filter((r: any) => r.roleId == id) : '';
    return role ? role[0].roleName : ''
  }

  confirmStatus(data: any, statusName: string) {
    this.getItemId(0)
    this.selectedItem = this.selectedItem
    this.genSrv.sweetAlertDecision(statusName, data.inviteCustomerEmail).then((result) => {
      if (result.isConfirmed) {
        this.delete(data.inviteCustomerEmail)
      }
    })
  }

  delete(id: any) {
    let payload = {
      inviteCustomerEmail: id
    }
    this.setSrv.deleteInvite(payload).pipe(takeUntil(this.unsubcribe)).subscribe((data: any) => {
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

  goToManageRole() {
    this.router.navigateByUrl('/auth/settings/manage-roles')
  }

  viewRole(id: any) {
    this.router.navigateByUrl(`/auth/settings/view-role/${id}`)
  }

  ngOnDestroy() {
    this.unsubcribe.next();
    this.unsubcribe.complete();
  }

}
