
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuditLogService {

    private api = environment.baseApiUrl;

    constructor(private http: HttpClient) { }

    getAllAuditLogs(params: any){
        return this.http.post(`${this.api}/audit-log/read-by-organisation-id`, params);
    }

    getAuditLogsUserID(params: any){
        return this.http.post(`${this.api}/audit-log/read-by-organisation-id`, params);
    }
}
