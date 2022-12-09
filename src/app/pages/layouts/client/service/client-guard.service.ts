
import { Injectable } from "@angular/core";
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { GeneralService } from "src/app/shared/services/general.service";

@Injectable({ providedIn: "root" })

export class ClientGuard implements CanActivate {
  constructor(private router: Router, private genService: GeneralService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.genService.currentUserValue;
    if (currentUser) {
      // authorised so return true
      return true;
    }
    // not logged in so redirect to login page with the return url
    this.router.navigate(["/"], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
