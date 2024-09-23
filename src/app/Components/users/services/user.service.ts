import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl = environment.base_url;
  constructor(private http: HttpClient) {}

  addUser(body: any) {
    return this.http.post(this.baseUrl + 'User/register', body);
  }

  updateUser(body: any) {
    return this.http.put(this.baseUrl + 'User/update', body);
  }
  updateRole(roles: any, userId: any) {
    return this.http.put(this.baseUrl + `User/update-roles/${userId}`, roles);
  }
  getAllUsers() {
    return this.http.get(this.baseUrl + 'User/admins');
  }
  getUserById(userId: number) {
    return this.http.get(this.baseUrl + `User/${userId}`);
  }
  getRoles() {
    return this.http.get(this.baseUrl + 'Role');
  }
  getAllNationalities() {
    return this.http.get(this.baseUrl + 'Nationality');
  }
}
