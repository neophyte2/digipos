
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class TransactionService {

    private api = environment.baseApiUrl;

    constructor(private http: HttpClient) { }

    transactionDownload(params: any){
        return this.http.post(`${this.api}/payment/download-transaction`, params);
    }

    transactionList(params: any){
        return this.http.post(`${this.api}/payment/read-transaction`, params);
    }
}
