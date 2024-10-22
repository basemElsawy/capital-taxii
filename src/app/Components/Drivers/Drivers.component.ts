import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { DriverDetails, Drivers, DriversMarkers } from '../map/IMap';
import { CommonModule, DatePipe } from '@angular/common';
import { DriversService } from './Services/drivers.service';
import {
  AllTripRequestData,
  Coords,
  IDrivers,
  IUserFormModel,
} from './IDrivers';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RatingModule } from 'primeng/rating';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { passwordMatchValidator } from '../classes/password-match.validators';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../environments/environment.development';
import { SpinnerComponent } from '../../shared-ui/spinner/spinner.component';
import { CalendarModule } from 'primeng/calendar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslationService } from '../../Core/Services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { SearchFilterPipe } from '../../shared-ui/pipes/search-filter.pipe';
import { ErrorHandlerService } from '../clients/services/error-handler.service';
@Component({
  selector: 'app-Drivers',
  standalone: true,
  imports: [
    NgbPaginationModule,
    CommonModule,
    FormsModule,
    SpinnerComponent,
    CalendarModule,
    FormsModule,
    ReactiveFormsModule,
    RatingModule,
    TranslateModule,
    SearchFilterPipe,
    FormsModule,
  ],
  templateUrl: './Drivers.component.html',
  styleUrls: ['./Drivers.component.scss'],
  providers: [DatePipe],
})
export class DriversComponent implements OnInit {
  errorMessages: string[] = [];
  public readonly imgUrl = environment.image;
  searchInput: string = '';
  dateRangeForm!: FormGroup;
  updateDriverForm!: FormGroup;
  driversData: WritableSignal<any> = signal([]);
  modifiedData: WritableSignal<any> = signal([]);
  currentLocationAddress: string = '';
  coordsCollection: any[] = [];
  isLoading: boolean = false;
  addUserForm!: FormGroup;
  nationalities: any[] = [];
  lang!: string;
  pageNumber: any = 1;
  totalRecords = 0;
  singleDriver!: any;
  pageSize = 10;
  totalRouteTrips: AllTripRequestData[] = [];
  tripDataToDisplay: any = signal([]);
  constructor(
    private driversService: DriversService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private translate: TranslateService,
    private trannslation: TranslationService,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    private errorHandlerService: ErrorHandlerService
  ) {}
  ngOnInit(): void {
    this.getAllDrivers();
    this.initAddUserForm();
    this.dateFormInitializer();
    this.langSetterHandler();
  }

  dateFormatter(dateToFormat: string | Date) {
    return this.driversService.verbalDateFormatter(dateToFormat);
  }

  dateFormInitializer() {
    this.dateRangeForm = new FormGroup({
      startDate: new FormControl('', Validators.required),
      endDate: new FormControl('', Validators.required),
    });
  }

  initAddUserForm(): void {
    this.addUserForm = this.fb.group(
      {
        email: [null],
        username: [null, Validators.required],
        fullName: [null, Validators.required],
        phoneNumber: [null, Validators.required],
        genderId: [null, Validators.required],
        nationalityId: [null, Validators.required],
        password: [null, Validators.required],
        confirmPassword: [null, Validators.required],
        birthDate: [null, Validators.required],
        picture: [null, Validators.required],
      },
      { validators: passwordMatchValidator() }
    );
    this.updateDriverForm = this.fb.group(
      {
        id: [null, Validators.required],
        email: [null],
        username: [null, Validators.required],
        fullName: [null, Validators.required],
        phoneNumber: [null, Validators.required],
        genderId: [null, Validators.required],
        nationalityId: [null, Validators.required],
        password: [null],
        confirmPassword: [null],
        birthDate: [null, Validators.required],
        picture: [null, Validators.required],
      },
      { validators: passwordMatchValidator() }
    );
  }

  langSetterHandler() {
    if (!this.lang) {
      this.lang = this.translate.currentLang;
    }
    this.trannslation.getLanguage.subscribe((val) => {
      this.lang = val;
    });
  }

  getAllDrivers() {
    this.isLoading = true;
    this.driversService
      .getAllDrivers(this.pageNumber, this.pageSize)
      .subscribe({
        next: (res: any) => {
          if (Array.isArray(res)) {
            this.driversData.set(res);
            this.modifiedData.set(res);
            console.log(res);
          } else {
            console.log(res);
            this.driversData.set(res.items);
            this.modifiedData.set(res.items);

            this.totalRecords = res.totalRecords;
            // this.driversData = res;
            // console.log(this.driversData);
          }
          this.isLoading = false;
        },
        complete: () => {
          this.addressExtractor();
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          console.log(err);
        },
      });
  }
  deleteDriver(driverId: number) {
    this.driversService.deleteDriverById(driverId).subscribe({
      next: () => {
        this.toastr.success('Driver Deleted Successfully');
        this.getAllDrivers();
      },
      error: (error: any) => {
        this.errorMessages = this.errorHandlerService.getErrors(
          error,
          this.lang == 'en' ? 'en' : 'ar'
        );
        if (this.errorMessages.length) {
          for (let error of this.errorMessages) {
            this.toastr.error(error);
            this.errorHandlerService.getErrors(error, this.lang);
          }
        }
      },
    });
  }

  onPageChange(page: number) {
    this.pageNumber = page;
    this.getAllDrivers();
  }
  addressExtractor() {
    if (this.driversData()?.length) {
      this.driversData().forEach((item: any) => {
        let coords: Coords = {
          lat: item.res.locationLatitude,
          lng: item.res.locationLongitude,
        };
        this.driversService.gettingLocationAddress(
          coords,
          this.coordsCollection
        );
      });
      // this.isLoading.set(false);
    }
  }
  openAddModal(content: any, driver?: IDrivers) {
    this.modalService.open(content, {
      size: 'xl',
      backdrop: 'static',
      centered: true,
    });

    if (driver) {
      this.singleDriver = driver;

      return;
    }
    this.getAllNationalities();
  }
  openUpdateModal(content: any, selectedDriver: any) {
    this.getAllNationalities();

    this.setDriverDataInUpdateForm(selectedDriver);
    this.modalService.open(content, {
      size: 'xl',
      backdrop: 'static',
      centered: true,
      scrollable: true,
    });
  }
  setDriverDataInUpdateForm(selectedDriver: any) {
    this.singleDriver = selectedDriver;
    this.updateDriverForm.patchValue({
      id: selectedDriver?.id,
      email: selectedDriver?.email,
      username: selectedDriver?.userName,
      fullName: selectedDriver?.fullName,
      phoneNumber: selectedDriver?.phoneNumber,
      genderId: selectedDriver?.genderId,
      nationalityId: selectedDriver?.nationalityId,
      password: selectedDriver?.password,
      confirmPassword: selectedDriver?.confirmPassword,
      birthDate: this.datePipe.transform(
        selectedDriver?.birthdate,
        'yyyy-MM-dd'
      ),
      picture: selectedDriver?.picture,
    });
  }
  getAllNationalities() {
    this.isLoading = true;
    this.driversService.getAllNationalities().subscribe({
      next: (res: any) => {
        this.nationalities = res;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.isLoading = false;
        console.log(error);
      },
    });
  }
  closeModal() {
    this.modalService.dismissAll();
    this.tripDataToDisplay.set([]);
    this.dateRangeForm.reset();
  }

  addDrivers() {
    this.isLoading = true;
    let requestBody = this.addUserForm.value;
    this.driversService.addNewDriver(requestBody).subscribe({
      next: (res: any) => {
        this.getAllDrivers();

        this.addUserForm.reset();
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
        this.modalService.dismissAll();
        this.toastr.success(
          this.lang == 'en'
            ? 'A new driver added successfully'
            : 'تمت اضافة سائق جديد بنجاح',
          'Success'
        );
      },
      error: (error: any) => {
        this.errorMessages = this.errorHandlerService.getErrors(
          error,
          this.lang == 'en' ? 'en' : 'ar'
        );
        if (this.errorMessages.length) {
          for (let error of this.errorMessages) {
            this.toastr.error(error);
            this.errorHandlerService.getErrors(error, this.lang);
          }
        }
      },
    });
  }

  updateDriver() {
    let body: IUserFormModel = {
      id: JSON.parse(<string>localStorage.getItem('user')).id,
      ...this.updateDriverForm.value,
      rolesDto: {
        roles: [],
      },
    };
    let requestBody: any = {};
    for (let [key, value] of Object.entries(body)) {
      if (body[key] != null && body[key] != undefined && body[key] != '') {
        requestBody[key] = value;
      }
    }

    this.driversService.updateDriver(requestBody).subscribe({
      next: () => {
        this.modalService.dismissAll();
        this.updateDriverForm.reset();
        this.getAllDrivers();
      },
      error: (error: any) => {
        this.errorMessages = this.errorHandlerService.getErrors(
          error,
          this.lang == 'en' ? 'en' : 'ar'
        );
        if (this.errorMessages.length) {
          for (let error of this.errorMessages) {
            this.toastr.error(error);
            this.errorHandlerService.getErrors(error, this.lang);
          }
        }
      },
    });
  }

  updateUserImage(event: any) {
    this.driversService
      .convertFileToBase64(event.target.files[0])
      .then((res) => {
        this.updateDriverForm.controls['picture'].setValue(res);
        let cleanedBase64Image = this.driversService.processImage(
          this.updateDriverForm.controls['picture'].value
        );

        this.updateDriverForm.controls['picture'].setValue(cleanedBase64Image);
      })
      .finally(() => {});
  }

  uploadPhoto(event: any) {
    this.driversService
      .convertFileToBase64(event.target.files[0])
      .then((res) => {
        this.addUserForm.controls['picture'].setValue(res);
        let cleanedBase64Image = this.driversService.processImage(
          this.addUserForm.controls['picture'].value
        );

        this.addUserForm.controls['picture'].setValue(cleanedBase64Image);
      })
      .finally(() => {});
  }

  checkboxEvent(event: any) {
    if (this.driversData().items.length) {
      this.driversData().items.forEach((item: any) => {
        item.isChecked = event.target.checked;
      });
    }
  }
  searchInDrivers(event: any) {
    let searchLength = event.target.value.length;
    if (searchLength > 0) {
      this.modifiedData.update((data: any[]) =>
        this.driversData().filter((filteredData: any) => {
          let name = filteredData.res.user.fullName;
          console.log();
          return (<string>event.target.value)
            .toLowerCase()
            .includes(name != null ? name.toLowerCase() : name);
        })
      );
      if (!this.modifiedData().length) {
        this.toastr.error('User Not Found');
        this.modifiedData.set(this.driversData());
        return;
      }
      this.toastr.success('User Found');
    } else {
      this.toastr.error('No data found');
      this.modifiedData.set(this.driversData());
    }
  }

  sendDateRange() {
    this.driversService
      .getAllDriverTripsWithinDateRange(
        this.singleDriver.userId,
        this.dateRangeForm.value
      )
      .subscribe({
        next: (res: any) => {
          this.tripDataToDisplay.set(
            (res.data.requestRoutes as any[]).map(
              ({
                request: {
                  toLocationName,
                  fromLocationName,
                  createdAt,
                  acceptanceDateTime,
                  price,
                  tripDistance,
                  customerRate,
                  tripTime,
                  finePrice,
                  paymentDetails: {
                    distancePrice,
                    gatesCount,
                    gatesFees,
                    tax,
                    totalPrice,
                    negativeCredit,
                  },
                  customer: { fullName, phoneNumber, genderId, picture },
                },
              }) => ({
                request: {
                  toLocationName,
                  fromLocationName,
                  createdAt,
                  acceptanceDateTime,
                  price,
                  finePrice,
                  tripDistance,
                  customerRate,
                  tripTime,
                  paymentDetails: {
                    distancePrice,
                    gatesCount,
                    gatesFees,
                    tax,
                    totalPrice,
                    negativeCredit,
                  },
                  customer: {
                    fullName,
                    phoneNumber,
                    genderId,
                    picture,
                  },
                },
              })
            )
          );
          console.log(this.tripDataToDisplay());
        },
        complete: () => {},
        error: (err) => {
          console.log(err);
        },
      });
  }

  get getTripDataToDisplay() {
    return this.tripDataToDisplay();
  }
  get driversDetails() {
    return this.modifiedData();
  }

  getTripTimeFormate(tripTime: number): string {
    if (tripTime < 60) {
      return `${tripTime} Min`;
    } else if (tripTime % 60 === 0) {
      return `${tripTime / 60} Hr`;
    } else {
      const hours = Math.floor(tripTime / 60);
      const minutes = tripTime % 60;
      return `${hours} Hr  ${minutes} Min`;
    }
  }

  getFullImageUrl(): string {
    if (this.singleDriver?.user?.picture) {
      return `${this.imgUrl}${this.singleDriver.user.picture}`;
    } else if (this.singleDriver) {
      return `${this.imgUrl}${this.singleDriver.picture}`;
    }
    return '../../../assets/unknown.png'; // Return an empty string or a default image URL if picture is not available
  }
  get userImage() {
    return this.getFullImageUrl();
  }
}
