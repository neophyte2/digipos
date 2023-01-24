
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AdminService {

    private api = environment.baseApiUrl;

    constructor(private http: HttpClient) { }

    dashboard() {
        return this.http.get(`${this.api}/card-request/dashboard`);
    }
}
