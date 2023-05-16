
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class TransactionSharedService {

    private api = environment.baseApiUrl;

    constructor(private http: HttpClient) { }

    stats(payload: any) {
        return this.http.post(`${this.api}/dashboard/read-stats-by-organisation-id`, payload);
    }

    transactionList(params: any){
        return this.http.post(`${this.api}/payment/read-transaction-by-organisation-id`, params);
    }
}
