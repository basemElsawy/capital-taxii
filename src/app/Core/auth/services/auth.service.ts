import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = environment.base_url;
  constructor(private router: Router, private http: HttpClient) {}

  makeLogin(body: any) {
    return this.http.post(this.baseUrl + 'User/login', body);
  }
  makeLogout() {
    localStorage.clear();
    this.router.navigateByUrl('/auth/login');
  }

  makeRegisterNewUser(body: any) {
    return this.http.post(this.baseUrl + 'User/register', body);
  }

  tokenDecode(token: any): any {
    let decodedToken = jwtDecode(token);
    return decodedToken;
  }
}
