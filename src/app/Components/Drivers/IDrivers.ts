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
  totalAmount: number | null;
  totalCount: number | null;
  user: IUser | null;
  userId: number;
  vehicle: IVehicle | null;
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

export interface AllTripRequestData {
  acceptedRequests: number;
  canceledRequests: number;

  driver: IDrivers;
  requestRoutes: IRequestRoutes[];

  totalRequests: number;
  totalRevenue: number;
}
export interface IRequestRoutes {
  acceptanceDateTime: string;
  cancelUserType: string | number | null;
  createdAt: string;
  customer: string | null | number;
  customerFromLocationLatitude: number;
  customerFromLocationLongitude: number;
  customerId: number;
  customerLocationLatitude: number;
  customerLocationLongitude: number;
  customerRate: number | string | null;
  customerToLocationLatitude: number;
  customerToLocationLongitude: number;
  distance: number | string | null;
  driver: number | string | null;
  driverId: number;
  driverRate: number | string | null;
  duration: number | string | null;
  finePrice: number;
  fromLocationName: number | string | null;
  id: number;
  modifiedAt: string;
  paymentDetails: number | string | null;
  price: number;
  requestRouteLogs: number | string | null;
  requestStatus: number | string | null;
  requestStatusId: number;
  timeToArriveToCustomer: number | string | null;
  toLocationName: string;
  tripDistance: number | string | null;
  tripTime: number | string | null;
}

export interface IUserFormModel {
  id: number;
  email: string;
  username: string;
  fullName: string;
  phoneNumber: string;
  genderId: number;
  nationalityId: number;
  password: string;
  confirmPassword: string;
  birthDate: string;
  picture: string;
  rolesDto: {
    roles: [];
  };
  firebaseToken: number | string;
  locationLatitude: number;
  locationLongitude: number;
  isActive: boolean;
  emailConfirmed: boolean;
}
