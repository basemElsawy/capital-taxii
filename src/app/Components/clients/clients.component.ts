import { Component, inject, OnInit, signal } from '@angular/core';
import { ClientsService } from './services/clients.service';
import { CommonModule, DatePipe } from '@angular/common';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { passwordMatchValidator } from '../classes/password-match.validators';
import { environment } from '../../../environments/environment.development';
import { ToastrService } from 'ngx-toastr';
import { CalendarModule } from 'primeng/calendar';
import { RatingModule } from 'primeng/rating';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslationService } from '../../Core/Services/translation.service';
import { UserService } from '../users/services/user.service';
import { MultiSelectModule } from 'primeng/multiselect';
import { ErrorHandlerService } from './services/error-handler.service';

@Component({
  selector: 'app-clients',
  standalone: true,
  providers: [DatePipe],
  imports: [
    CommonModule,
    RatingModule,
    MultiSelectModule,
    CalendarModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss'],
})
export class ClientsComponent implements OnInit {
  clients: any[] = [];
  nationalities: any[] = [];
  errorMessages: string[] = [];
  selectedRoles: any;
  addUserForm!: FormGroup;
  roles: any[] = [];
  updateUserForm!: FormGroup;
  singleClient: any;
  lang!: string;
  public readonly imgUrl = environment.image;
  singleCredit!: any;
  dateRangeForm!: FormGroup;
  tripDataToDisplay: any = signal([]);

  constructor(
    private fb: FormBuilder,
    private clientsService: ClientsService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private translationService: TranslationService,
    private translate: TranslateService,
    private userService: UserService,
    private datePipe: DatePipe,
    private errorHandlerService: ErrorHandlerService
  ) {}
  ngOnInit() {
    this.getAllClients();
    this.dateFormInitializer();
    this.getAllRoles();
    this.languageSetter();
  }
  languageSetter() {
    if (!this.lang) {
      this.lang = this.translate.currentLang;
    }
    this.translationService.getLanguage.subscribe((val: string) => {
      this.lang = val;
    });
  }
  getAllClients(): void {
    this.clientsService.getAllClients().subscribe({
      next: (res: any) => {
        this.clients = res;
      },
      error: (error: any) => {
        this.errorMessages = this.errorHandlerService.getErrors(
          error,
          this.lang == 'en' ? 'en' : 'ar'
        );
        if (this.errorMessages.length) {
          for (let error of this.errorMessages) {
            this.toastr.error(error);
          }
        }
      },
    });
  }
  dateFormatter(dateToFormat: string | Date) {
    return this.clientsService.verbalDateFormatter(dateToFormat);
  }

  dateFormInitializer() {
    this.dateRangeForm = new FormGroup({
      startDate: new FormControl('', Validators.required),
      endDate: new FormControl('', Validators.required),
    });
    this.updateUserForm = this.fb.group({
      id: [null],
      userName: [null, Validators.required],
      fullName: [null, [Validators.required]],
      phoneNumber: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      birthDate: [null, Validators.required],
      genderId: [null, Validators.required],
      nationalityId: [null, Validators.required],
      picture: [null, Validators.required],
    });
  }

  openTripsModal(content: any, user?: any) {
    this.modalService.open(content, {
      size: 'xl',
      backdrop: 'static',
      centered: true,
    });

    if (user) {
      this.singleClient = user;

      return;
    }
    this.getAllNationalities();
  }
  closeModal() {
    this.modalService.dismissAll();
    this.tripDataToDisplay.set([]);
    this.dateRangeForm.reset();
    this.updateUserForm.reset();
  }

  checkboxEvent(ev: any) {}

  // openAddModal(content: any) {
  //   this.modalService.open(content, {
  //     size: 'xl',
  //     backdrop: 'static',
  //     centered: true,
  //   });
  //   this.getAllNationalities();
  // }
  openAddModal(content: any, userId: number) {
    this.getCreditDetailsByUserId(content, userId);
  }

  getCreditDetailsByUserId(content: any, userId: number) {
    this.clientsService
      .getCreditDetailsByUserId(userId)
      .subscribe((creditData: any) => {
        this.singleCredit = creditData.groupCreditTransactions;
        if (creditData.groupCreditTransactions.length) {
          this.modalService.open(content, {
            size: 'xl',
            backdrop: 'static',
            centered: true,
          });
        } else {
          let errorMessage =
            this.lang === 'En'
              ? 'There is no credit details'
              : 'لا توجد بيانات';
          this.toastr.info(errorMessage);
        }
      });
  }
  getAllNationalities() {
    this.clientsService.getAllNationalities().subscribe({
      next: (res: any) => {
        this.nationalities = res;
      },
      error: (error: any) => {
        this.errorMessages = this.errorHandlerService.getErrors(
          error,
          this.lang == 'en' ? 'en' : 'ar'
        );
        if (this.errorMessages.length) {
          for (let error of this.errorMessages) {
            this.toastr.error(error);
          }
        }
      },
    });
  }
  get getTripDataToDisplay() {
    return this.tripDataToDisplay();
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
  sendDateRange() {
    console.log(this.singleClient);
    this.clientsService
      .getAllClientsTripsWithinDateRange(
        this.singleClient.id,
        this.dateRangeForm?.value
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

  getAllRoles(): void {
    this.userService.getRoles().subscribe({
      next: (res: any) => {
        this.roles = res;
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  updateUserData(updateModal: any, selectedUser: any) {
    this.modalService.open(updateModal, {
      size: 'xl',
      backdrop: 'static',
      keyboard: false,
      centered: true,
      scrollable: true,
    });
    this.getAllNationalities();
    this.setDataForUpdateModal(selectedUser);
  }

  formatDateToInputValue(dateTime: string): string {
    const date = new Date(dateTime);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-indexed
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  //here is the function needed to set all values needed for update
  setDataForUpdateModal(selectedUser: any) {
    let birthDate = this.formatDateToInputValue(selectedUser.birthdate);
    this.singleClient = selectedUser.picture;
    this.updateUserForm.patchValue({
      id: selectedUser.id,
      fullName: selectedUser.fullName,
      userName: selectedUser.userName,
      phoneNumber: selectedUser.phoneNumber,
      email: selectedUser.email,
      genderId: selectedUser.gender.id,
      nationalityId: +selectedUser.nationality.id,
      picture: selectedUser.picture,
      birthDate: birthDate,
    });
  }

  getFullImageUrl(): string {
    if (this.singleClient?.user) {
      return `${this.imgUrl}${this.singleClient.user.picture}`;
    } else if (this.singleClient) {
      return `${this.imgUrl}${this.singleClient}`;
    }
    return '../../../assets/unknown.png'; // Return an empty string or a default image URL if picture is not available
  }
  get userImage() {
    return this.getFullImageUrl();
  }

  uploadPhoto(event: any) {
    this.userService
      .convertFileToBase64(event.target.files[0])
      .then((res) => {
        this.addUserForm.controls['picture'].setValue(res);
        let cleanedBase64Image = this.userService.processImage(
          this.addUserForm.controls['picture'].value
        );

        this.addUserForm.controls['picture'].setValue(cleanedBase64Image);
      })
      .finally(() => {});
  }
  uploadPhotoOnUpdate(event: any) {
    this.userService
      .convertFileToBase64(event.target.files[0])
      .then((res) => {
        this.updateUserForm.controls['picture'].setValue(res);
        let cleanedBase64Image = this.userService.processImage(
          this.updateUserForm.controls['picture'].value
        );

        this.updateUserForm.controls['picture'].setValue(cleanedBase64Image);
      })
      .finally(() => {});
  }

  updateUser() {
    let body = {
      id: JSON.parse(<string>localStorage.getItem('user')).id,
      ...this.updateUserForm.value,
      rolesDto: {
        roles: [],
      },
    };
    let requestBody: any = {};
    for (let [key, value] of Object.entries(body)) {
      if (body[key] != null && body[key] != undefined && body[key] != '') {
        if (key === 'nationalityId') {
          requestBody[key] = Number(value);
        }

        requestBody[key] = value;
      }
    }
    this.clientsService.updateClient(requestBody).subscribe({
      next: (res: any) => {
        this.getAllClients();
        this.toastr.success('Client Updated successfully');
        this.modalService.dismissAll();
      },
      error: (error: any) => {
        this.errorMessages = this.errorHandlerService.getErrors(
          error,
          this.lang == 'en' ? 'en' : 'ar'
        );
        if (this.errorMessages.length) {
          for (let error of this.errorMessages) {
            this.toastr.error(error);
          }
        }
      },
    });
  }
}
