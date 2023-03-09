import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SettingsService {

    private api = environment.baseApiUrl;

    constructor(private http: HttpClient) { }

    changePassword(payload: any) {
        return this.http.post(`${this.api}/authentication/change-password`, payload);
    }

    allUsers(payload: any) {
        return this.http.post(`${this.api}/customer/read`, payload);
    }

    allInvite() {
        return this.http.post(`${this.api}/customer/read-invite-by-organisation-id`, {});
    }

    inviteUser(user: any) {
        return this.http.post(`${this.api}/customer/invite`, user)
    }

    getAllRoles() {
        let data = {
            "request": "READ_ROLE"
        }
        return this.http.post(`${this.api}/role/read-by-organization-id`, data);
    }

    getPermissions(data: any) {
        return this.http.post(`${this.api}/role-privilege/read-by-role-id`, data);
    }
    

}