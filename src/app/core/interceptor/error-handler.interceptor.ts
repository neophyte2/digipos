import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';


import { GeneralService } from 'src/app/shared/services/general.service';
import { environment } from 'src/environments/environment';



/**
 * Adds a default error handler to all requests.
 */
@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerInterceptor implements HttpInterceptor {
  message: any;
  constructor(private router: Router, private credService: GeneralService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(error =>
       this.errorHandler(error)));
  }

  // Customize the default error handler here if needed
  private errorHandler(response: HttpEvent<any>): Observable<HttpEvent<any>> {
    console.log({response});
    
    if (!environment.production) {
      // Do something with the error
    }
    this.message = response;
    if (this.message.responseCode == 401 || this.message.responseCode == 0 || this.message.responseCode === '115') {
      this.credService.logout('/');
      // this.credService.setCredentials();
      // this.router.navigate(['/auth/login']);
    }
    throw response;
  }
}
