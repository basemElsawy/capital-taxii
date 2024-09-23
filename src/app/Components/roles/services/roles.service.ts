import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  baseUrl = environment.base_url;
  constructor(private http: HttpClient) {}

  addRole(body: any) {
    return this.http.post(this.baseUrl + 'Role', body);
  }

  getRoles() {
    return this.http.get(this.baseUrl + 'Role');
  }
  getallPermissions() {
    return this.http.get(this.baseUrl + 'Permission');
  }
  updateRole(role: any) {
    return this.http.put(`${this.baseUrl}Role`, role);
  }
}
