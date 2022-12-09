
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
        return this.http.post(`${this.api}/user/login`, payload);
    }

    /**
     * signup
     * @param payload
     * @returns data
     */
     signup(payload: any) {
        return this.http.post(`${this.api}/authentication/initiate-enrollment`, payload);
    }
}
