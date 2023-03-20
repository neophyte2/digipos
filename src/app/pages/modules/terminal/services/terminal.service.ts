
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class TerminalService {

    private api = environment.baseApiUrl;

    constructor(private http: HttpClient) { }

    getAllTerminals(params: any){
        return this.http.post(`${this.api}/terminal/read-by-organization-id`, params);
    }

    createTerminal(payload: any){
        return this.http.post(`${this.api}/terminal/create`, payload);
    }

    deactivateTerminal(payload:any){
        return this.http.post(`${this.api}/terminal/deactivate`, payload);
    }

    activateTerminal(payload:any){
        return this.http.post(`${this.api}/terminal/activate`, payload);
    }

    getTerminalTransition(payload:any){
        return this.http.post(`${this.api}/terminal/read-transactions`, payload);
    }

    getSingleTerminal(payload:any){
        return this.http.post(`${this.api}/terminal/read-single`, payload);
    }

}