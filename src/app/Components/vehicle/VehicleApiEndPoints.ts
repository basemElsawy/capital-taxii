import { environment } from '../../../environments/environment.development';

export class VehiclesApiEndpoints {
  static baseUrl: string = environment.base_url;

  static getAllVehiclesEndPoint: string = this.baseUrl + 'Vehicle';
  static nationalitiesEndpoint: string = this.baseUrl + 'Nationality';
  static vehicleSpecificationEndPoint: string =
    this.baseUrl + 'VehicleSpecification';
  static vehicleTypesEndPoint: string = this.baseUrl + 'VehicleType';
  static fuelTypesEndPoint: string = this.baseUrl + 'FuelType';

  static vehicleOwnerShip: string = this.baseUrl + 'VehicleOwnership';
  static vehicleLifeCycle: string = this.baseUrl + 'VehicleLifeCycle';
  static vehicleStatus: string = this.baseUrl + 'VehicleStatus';
  static vehicleFinancial: string = this.baseUrl + 'VehicleFinancial';
  static vehicleBrand: string = this.baseUrl + 'VehicleBrand';
  static vehicleBodyTypeId: string = this.baseUrl + 'VehicleBodyType';
  static driverVehicle: string = this.baseUrl + 'DriverVehicle';
  static drivers: string = this.baseUrl + 'Driver/get-all-drivers-only';
  static vehicleDrivers: string = this.baseUrl + 'Driver/get-vehicle-details?';
  static vehicleServiceType: string = this.baseUrl + 'VehicleServiceType';
}
