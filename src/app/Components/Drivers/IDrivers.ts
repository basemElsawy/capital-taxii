export interface Coords {
  lat: number;
  lng: number;
}

export interface IDrivers {
  avgRate: number | null;
  createdAt: string;
  id: number;
  locationLatitude: number;
  locationLongitude: number;
  modifiedAt: number;
  rateCount: number;
  status: boolean;
  totalAmount: number;
  totalCount: number;
  user: IUser;
  userId: number;
  vehicle: IVehicle;
}

export interface IUser {
  avgCustomerRate: number | null;
  birthDate: string;
  createdAt: string;
  credit: number;
  customerRateCount: number | null;
  email: string;
  fullName: string;
  gender: IGender;
  genderId: number;
  nationality: number | string | null;
  nationalityId: number;
  phoneNumber: string;
  picture: string;
}

export interface IGender {
  id: number;
  nameEn: string;
  nameAr: string;
}
export interface IVehicle {
  fuelType: number | string | null;
  id: number;
  photo: string;
  vehicleBodyType: number | string | null;
  vehicleBrand: number | string | null;
  vehicleColor: string;
  vehicleFinancial: string | number | null;
  vehicleLifeCycle: string | number | null;
  vehicleName: 'BM  - ح م ع 1245';
  vehicleOwnership: string | number | null;
  vehicleServiceType: string | number | null;
  vehicleSpecification: string | number | null;
  vehicleStatus: boolean | string | null;
  vehicleType: number | string | null;
  year: number;
}
