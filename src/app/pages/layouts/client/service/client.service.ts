
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ClientService {

    private api = environment.baseApiUrl;

    constructor(private http: HttpClient) { }

    /**
     * Login api call
     * @param payload
     * @returns
     */
    login(payload: any) {
        return this.http.post(`${this.api}/authentication/login`, payload);
    }

    /**
     * signup
     * @param payload
     * @returns data
     */
    signup(payload: any) {
        return this.http.post(`${this.api}/authentication/initiate-enrollment`, payload);
    }

    acceptInvitation(payload: any) {
        return this.http.post(`${this.api}/customer/accept-invite`, payload);
    }

    /**
    * resetOtp
    * @param payload
    * @returns data
    */
    resetOtp(payload: any) {
        return this.http.post(`${this.api}/authentication/resend-otp`, payload);
    }

    /**
     * initiate password reset
     * @param payload 
     * @returns data
     */
    initiateReset(payload: any){
        return this.http.post(`${this.api}/authentication/initiate-password-reset`, payload);
    }

    /**
     * forget password reset
     * @param payload 
     * @returns data
     */
    confirmPasswordReset(payload: any){
        return this.http.post(`${this.api}/authentication/complete-password-reset`, payload);
    }

    /**
    * completeEnrollment
    * @param payload
    * @returns data
    */
    completeEnrollment(payload: any) {
        return this.http.post(`${this.api}/authentication/complete-enrollment`, payload);
    }
    
    /**
     * 
     * @returns datas for geo location, ip address and country code
     */
    getLocation() {
        let apiKey = '15e8830cb9d0c089ef30c4bde7d9cffd927ddac568b33f98df3b065f';
        return this.http.get('https://api.ipdata.co?api-key=' + apiKey);
    }

    
}
