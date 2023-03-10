import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})

export class GeneralService {

  public currentUser: Observable<any>;
  private storageKey = "AdminCurrentUser";
  private currentUserSubject: BehaviorSubject<any>;

  constructor(private route: Router,
    private location: Location,
  ) {
    this.currentUserSubject = new BehaviorSubject<any>(this.userDetails);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): Observable<any> {
    return this.currentUserSubject.value;
  }

  /**
   * geting user details in the local storage
   */
  get userDetails(): Observable<any> {
    let storage: any = localStorage.getItem(this.storageKey)
    return JSON.parse(storage);
  }

  /**
   * this is used to store data 
   * into local storage
   * @param data 
   * @returns 
   */
  storeUser(data: any) {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
    return this.currentUserSubject.next(data);
  }

  /**
   * this is use for clearing the data 
   * stored in the loacl storage
   */
  logout(value: any) {
    // remove user from local storage to log user out
    localStorage.removeItem(this.storageKey);
    this.currentUserSubject.next(null);
    this.route.navigate([value])
  }

  /**
   * Delete alert
   * ask if your are sure to delete the data or not
   * @param type 
   * @param name 
   * @returns 
   */
  sweetAlertDecision(type: any, name: any) {
    return Swal.fire({
      title: 'Are you sure?',
      text: `You want to ${type} ${name}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `Yes, ${type} it!`
    })
  }

  /**
  * Delete alert For Application
  * ask if your are sure to delete the data or not
  * @param type 
  * @param name 
  * @returns 
  */
  sweetAlertAppDecision(type: any, value: any) {
    return Swal.fire({
      title: 'Are you sure?',
      text: `${value}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `Yes, ${type} it!`
    })
  }

  /**
   * success alert 
   * for creation , update
   * @param msg 
   * @returns 
   */
  sweetAlertSuccess(msg: any) {
    return Swal.fire("Submitted", msg, "success");
  }

  /**
   * INFO alert 
   * for creation , update
   * @param msg 
   * @returns 
   */
  sweetAlertInfo(msg: any, infoName?: any) {
    const info = `${infoName} Info`
    return Swal.fire(info, msg, "info");
  }

  /**
   * error alert 
   * for Errors 
   * @param msg 
   * @returns 
   */
  sweetAlertError(msg: any) {
    return Swal.fire("Failed", msg, "error");
  }

  /**
  * warning alert 
  * for warning 
  * @param msg 
  * @returns 
  */
  sweetAlertWarning(msg: any) {
    return Swal.fire("Warning", msg, "warning");
  }

  goBack() {
    this.location.back();
  }
}
