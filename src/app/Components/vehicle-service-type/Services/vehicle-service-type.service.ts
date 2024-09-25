import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class VehicleServiceTypeService {
  base_url = environment.base_url;

  constructor(private httpClient: HttpClient) {}

  getAllVehicleServiceTypes() {
    return this.httpClient.get(`${this.base_url}VehicleServiceType`);
  }

  addVehicleServiceType(body: any) {
    return this.httpClient.post(`${this.base_url}VehicleServiceType`, body);
  }
  updateVehicleServiceType(body: any) {
    return this.httpClient.put(`${this.base_url}VehicleServiceType`, body);
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
  getImageAsBase64(url: string): Promise<string> {
    return fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.blob();
      })
      .then((blob) => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string); // Read as data URL
          reader.onerror = () => reject(new Error('Failed to read file'));
          reader.readAsDataURL(blob); // Start reading the image blob
        });
      });
  }
}
