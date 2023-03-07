import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SettingsService {

    private api = environment.baseApiUrl;

    constructor(private http: HttpClient) { }

    chnagePassword(payload: any) {
        return this.http.post(`${this.api}/authentication/change-password`, payload);
    }

    allUsers(payload: any) {
        return this.http.post(`${this.api}/customer/read`, payload);
    }


}