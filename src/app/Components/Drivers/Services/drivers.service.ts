import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DriversApiEndpoints } from '../DriversApiEndPoints';
import { map, Observable } from 'rxjs';
import { Coords } from '../IDrivers';
import { AutoFocusModule } from 'primeng/autofocus';
import { UrlSegment } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class DriversService {
  constructor(private httpClient: HttpClient) {}
  getAllNationalities() {
    return this.httpClient.get(DriversApiEndpoints.nationalitiesEndpoint);
  }
  gettingLocationAddress(coords: Coords, locationCollection: any[]) {
    // const geoCoder = new google.maps.Geocoder();
    // geoCoder.geocode({ location: coords }, (results: any, status: any) => {
    //   console.log(location);
    //   if (status === google.maps.GeocoderStatus.OK) {
    //     if (results[0]) {
    //       locationCollection.push(results[0].formatted_address);
    //     } else {
    //       console.log('No results found');
    //     }
    //   } else {
    //     console.error('Geocoder failed due to:', status);
    //   }
    // });
  }
  getAllDriverTripsWithinDateRange(id: number, dateObject: any) {
    dateObject = {
      startDate: this.formatDate(dateObject.startDate),
      endDate: this.formatDate(dateObject.endDate),
    };
    let newRequestUrl = new URLSearchParams(dateObject);
    let requestUrl: string = `${DriversApiEndpoints.getTripDetails}${id}?`;
    requestUrl = requestUrl + newRequestUrl;

    return this.httpClient.get(requestUrl);
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
  getAllDrivers(pageNumber: any, pageSize: any) {
    return this.httpClient
      .get(
        DriversApiEndpoints.getAllDriversEndpoint +
          `?pageNumber=${pageNumber}&pageSize=${pageSize}`
      )
      .pipe(
        map((data: any) => {
          return Array.isArray(data)
            ? data.map((res: any) => ({ res, isChecked: false }))
            : {
                items: data.items.map((res: any) => ({
                  res,
                  isChecked: false,
                })),
                pageSize: data.pageSize,
                pageNumber: data.pageNumber,
                totalRecords: data.totalRecords,
              };
        })
      );
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

  getOrdinalSuffix(day: number) {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  }

  verbalDateFormatter(dateToFormat: string | Date) {
    let date = new Date(dateToFormat);
    let month = date.toLocaleString('en-US', { month: 'short' });
    let day = date.toLocaleString('en-US', { day: 'numeric' });
    let numericDate = date.getDate();
    return `${month} ${day}${this.getOrdinalSuffix(numericDate)}`;
  }

  addNewDriver(body: any) {
    return this.httpClient.post(DriversApiEndpoints.addDriverUser, body);
  }
}
