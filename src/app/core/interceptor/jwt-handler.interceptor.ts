import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { GeneralService } from 'src/app/shared/services/general.service';
import { Injectable } from '@angular/core';

@Injectable()
export class JwtExpiryInterceptor implements HttpInterceptor {
  constructor(
    private genSrv: GeneralService
    ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          const response = event.body;
          if (response && response.responseCode === '115') {
            this.genSrv.logout('/')
            throw new Error(response.responseMessage);
          }
        }
        return event;
      }),
      catchError((error) => {
        console.error(error);
        return throwError(error);
      })
    );
  }
}
