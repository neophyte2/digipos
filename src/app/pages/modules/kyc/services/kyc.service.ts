import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class KycService {

    private api = environment.baseApiUrl;

    constructor(private http: HttpClient) { }

    verificatin() {
        let params = { request: "GET_VERIFICATION" };
        return this.http.post(`${this.api}/kyc/get-verification`, params);
    }

    verifyAddresses(param: any) {
        return this.http.post(`${this.api}/kyc/create-address`, param);
    }

    verifyIdCard(param: any) {
        return this.http.post(`${this.api}/kyc/create-id-card`, param);
    }

    verifyCac(param: any){
        return this.http.post(`${this.api}/kyc/create-cac`, param);
    }

    initiateBvn(param: any) {
        return this.http.post(`${this.api}/kyc/initial-bvn-verification`, param);
    }

    completeBvn(param: any) {
        return this.http.post(`${this.api}/kyc/complete-bvn-verification`, param);
    }

    getAllCards() {
        let param = { request: "ID_CARDS_TYPES" };
        return this.http.post(`${this.api}/kyc/id-card-types`, param);
    }

}
