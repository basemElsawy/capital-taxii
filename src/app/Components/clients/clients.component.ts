import { Component, inject, OnInit, signal } from '@angular/core';
import { ClientsService } from './services/clients.service';
import { CommonModule } from '@angular/common';
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
@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    CommonModule,
    RatingModule,
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
  addUserForm!: FormGroup;
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
    private translate: TranslateService
  ) {}
  ngOnInit() {
    this.getAllClients();
    this.dateFormInitializer();
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
        console.log(error);
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
          this.toastr.info('There is no credit details');
        }
      });
  }
  getAllNationalities() {
    this.clientsService.getAllNationalities().subscribe({
      next: (res: any) => {
        this.nationalities = res;
      },
      error: (error: any) => {
        console.log(error);
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
  getFullImageUrl(): string {
    if (this.singleClient?.user?.picture) {
      return `${this.imgUrl}${this.singleClient.user.picture}`;
    }
    return '../../../assets/unknown.png'; // Return an empty string or a default image URL if picture is not available
  }
  get userImage() {
    return this.getFullImageUrl();
  }
}
