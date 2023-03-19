
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UserSharedService {

    private api = environment.baseApiUrl;

    constructor(private http: HttpClient) { }

    getUserByOrg() {
        return this.http.post(`${this.api}/organisation/read-users-by-organisation-id`, {});
    }
}
