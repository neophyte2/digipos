import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { GeneralService } from 'src/app/shared/services/general.service';

@Injectable({
  providedIn: 'root'
})
export class AppRoleGuard implements CanActivate {

  constructor(
    private appRoleSrv: GeneralService,
    private router: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const appPermission = next.data['appPermission'];
    if (this.appRoleSrv.isRouteEnabled(appPermission)) {
      return true;
    } else {
      this.router.navigate(['/auth/dashboard'], { queryParams: { redirect: state.url }, replaceUrl: true });
      return false;
    }
  }
}
