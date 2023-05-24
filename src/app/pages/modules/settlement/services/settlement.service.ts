
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SettlementService {

    private api = environment.baseApiUrl;

    constructor(private http: HttpClient) { }

    getAllSettlement(params: any){
        return this.http.post(`${this.api}/settlement/read-by-organisation-id`, params);
    }
}
