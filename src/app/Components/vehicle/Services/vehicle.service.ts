import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { VehiclesApiEndpoints } from '../VehicleApiEndPoints';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VehicleService {
  constructor(private httpClient: HttpClient) {}
  getAllNationalities() {
    return this.httpClient.get(VehiclesApiEndpoints.nationalitiesEndpoint);
  }
  getAllVehicles() {
    return this.httpClient
      .get(VehiclesApiEndpoints.getAllVehiclesEndPoint)
      .pipe(
        map((data: any) => {
          console.log(data);
          return (
            Array.isArray(data) &&
            data.map((res: any) => ({ res, isChecked: false }))
          );
        })
      );
  }

  getAllVehicleSpecification() {
    return this.httpClient.get(
      VehiclesApiEndpoints.vehicleSpecificationEndPoint
    );
  }

  getAllVehicleTypes() {
    return this.httpClient.get(VehiclesApiEndpoints.vehicleTypesEndPoint);
  }

  getAllFuelTypes() {
    return this.httpClient.get(VehiclesApiEndpoints.fuelTypesEndPoint);
  }

  addNewVehicle(body: any) {
    return this.httpClient.post(
      VehiclesApiEndpoints.getAllVehiclesEndPoint,
      body
    );
  }
  updateVehicle(body: any) {
    return this.httpClient.put(
      VehiclesApiEndpoints.getAllVehiclesEndPoint,
      body
    );
  }
  addNewDriverForVehicle(body: any) {
    return this.httpClient.post(VehiclesApiEndpoints.driverVehicle, body);
  }

  getVehicleOwnerShips() {
    return this.httpClient.get(VehiclesApiEndpoints.vehicleOwnerShip);
  }

  getVehicleLifeCycle() {
    return this.httpClient.get(VehiclesApiEndpoints.vehicleLifeCycle);
  }

  getVehicleStatus() {
    return this.httpClient.get(VehiclesApiEndpoints.vehicleStatus);
  }

  getVehicleFinancial() {
    return this.httpClient.get(VehiclesApiEndpoints.vehicleFinancial);
  }

  getVehicleBrand() {
    return this.httpClient.get(VehiclesApiEndpoints.vehicleBrand);
  }

  getVehicleBody() {
    return this.httpClient.get(VehiclesApiEndpoints.vehicleBodyTypeId);
  }

  getAllDrivers() {
    return this.httpClient.get(VehiclesApiEndpoints.drivers);
  }

  getVehicleDetails(id: any) {
    return this.httpClient.get(
      VehiclesApiEndpoints.vehicleDrivers + `vehicleId=${id}`
    );
  }
  getVehicleServiceType() {
    return this.httpClient.get(VehiclesApiEndpoints.vehicleServiceType);
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
