import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { GeneralService } from 'src/app/shared/services/general.service';

@Injectable({ providedIn: 'root' })
export class KycCompleteGuard implements CanActivate {
  constructor(private genSrv: GeneralService,
    private router: Router
  ) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const authToken: any = this.genSrv.currentVerifyValue;
    if (authToken && authToken.allVerified === 'NO') {
      this.router.navigate(['/auth/kyc']);
      return false
    } else if (authToken && authToken.allVerified === 'YES') {
      return true
    }
    return false
  }

}
