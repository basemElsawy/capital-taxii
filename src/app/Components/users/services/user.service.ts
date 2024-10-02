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
  // updateRole(roles: any, userId: any) {
  //   return this.http.put(this.baseUrl + `User/update-roles/${userId}`, roles);
  // }
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
  deleteUserById(userId: number) {
    return this.http.put(`${this.baseUrl}User/delete-user-async/${userId}`, '');
  }
  convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = (error) => {
        reject('Error converting file to base64: ' + error);
      };
    });
  }

  processImage(base64Image: string) {
    const cleanBase64Image = base64Image.replace(
      /^data:image\/[a-z]+;base64,/,
      ''
    );

    return cleanBase64Image;
  }
}
