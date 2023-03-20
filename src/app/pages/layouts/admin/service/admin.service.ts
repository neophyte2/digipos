
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AdminService {

    private api = environment.baseApiUrl;

    constructor(private http: HttpClient) {
    }

    readChart(payload: any) {
        return this.http.post(`${this.api}/dashboard/read-chart`, payload);
    }
    
    recentTransaction(payload: any) {
        return this.http.post(`${this.api}/dashboard/recent-transaction`, payload);
    }

}
