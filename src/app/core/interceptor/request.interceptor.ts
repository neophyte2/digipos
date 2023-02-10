import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { GeneralService } from 'src/app/shared/services/general.service';


@Injectable()
export class RequestInterceptor implements HttpInterceptor {

  currentUser: any
  currentCustomer: any

  constructor(
    private genSer: GeneralService,
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token, url: string

    this.currentUser = this.genSer.userDetails;
    token = this.currentUser && this.currentUser.token ? this.currentUser.token : null;
    url = '/'


    if (this.isValidUrl(req.url) && token) {
      req = req.clone({
        setHeaders: {
          Authorization: `${token}`,
          // 'Access-Control-Allow-Origin': '*'
        },
      });
    }

    return next.handle(req)
      .pipe(catchError(err => {
        let error = err.error?.message || err.error?.error || err.statusText || err.message;
        if (error === "jwt expired") {
          // auto logout if 401 response returned from api
          this.genSer.logout(url);
          return throwError(error);
        } else if (err.status === 401) {
          this.genSer.sweetAlertInfo(error, 'Session');
          this.genSer.logout(url);
          return throwError({ message: "Your license request is pending approval, kindly try again later." });
        }
        return throwError(error);
      }))
  }

  isValidUrl(url: string) {
    if (url.includes('localhost') || url.includes('digipos') || url.includes('https://ys898230m6.execute-api.us-east-1.amazonaws.com/')) {
      return true
    } else {
      return false
    }
  }
}

