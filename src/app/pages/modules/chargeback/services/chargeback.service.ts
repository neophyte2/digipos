
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ChargebackService {

    private api = environment.baseApiUrl;

    constructor(private http: HttpClient) { }

    getAllChargeback(params: any){
        return this.http.post(`${this.api}/chargeback/read-by-organisation-id`, params);
    }

    createChargeback(payload: any){
        return this.http.post(`${this.api}/chargeback/create`, payload);
    }

    declineChargeback(payload:any){
        return this.http.post(`${this.api}/chargeback/decline`, payload);
    }

    approveChargeback(payload:any){
        return this.http.post(`${this.api}/chargeback/approve`, payload);
    }

    getSingleChargeback(payload:any){
        return this.http.post(`${this.api}/chargeback/read-by-id`, payload);
    }

}
