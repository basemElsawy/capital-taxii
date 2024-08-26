import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { DriverDetails, Drivers, DriversMarkers } from '../map/IMap';
import { CommonModule } from '@angular/common';
import { DriversService } from './Services/drivers.service';
import { Coords } from './IDrivers';
import { firstValueFrom } from 'rxjs';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { passwordMatchValidator } from '../classes/password-match.validators';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-Drivers',
  standalone: true,
  imports: [
    NgbPaginationModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './Drivers.component.html',
  styleUrls: ['./Drivers.component.scss'],
})
export class DriversComponent implements OnInit {
  public readonly imgUrl = environment.image;
  // driverMarkers: any;
  driversData: any = {};
  currentLocationAddress: string = '';
  coordsCollection: any[] = [];
  isLoading: any = signal(true);
  addUserForm!: FormGroup;
  nationalities: any[] = [];

  pageNumber: any = 1;
  totalRecords = 0;

  pageSize = 10;

  constructor(
    private driversService: DriversService,
    private fb: FormBuilder,
    private modalService: NgbModal
  ) {}
  ngOnInit(): void {
    this.getAllDrivers();
    this.initAddUserForm();
  }

  initAddUserForm(): void {
    this.addUserForm = this.fb.group(
      {
        email: [null, Validators.required],
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
  }

  getAllDrivers() {
    this.driversService
      .getAllDrivers(this.pageNumber, this.pageSize)
      .subscribe({
        next: (res: any) => {
          if (Array.isArray(res)) {
            this.driversData = res;
          } else {
            this.driversData = res.items;
            this.totalRecords = res.totalRecords;
            // this.driversData = res;
            // console.log(this.driversData);
          }
        },
        complete: () => {
          this.addressExtractor();
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  onPageChange(page: number) {
    this.pageNumber = page;
    this.getAllDrivers();
  }
  addressExtractor() {
    if (this.driversData?.length) {
      this.driversData.forEach((item: any) => {
        let coords: Coords = {
          lat: item.res.locationLatitude,
          lng: item.res.locationLongitude,
        };
        this.driversService.gettingLocationAddress(
          coords,
          this.coordsCollection
        );
      });
      this.isLoading.set(false);
    }
  }
  openAddModal(content: any) {
    this.modalService.open(content, {
      size: 'xl',
      backdrop: 'static',
      centered: true,
    });
    this.getAllNationalities();
  }
  getAllNationalities() {
    this.driversService.getAllNationalities().subscribe({
      next: (res: any) => {
        this.nationalities = res;
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }
  closeModal() {
    this.modalService.dismissAll();
  }

  addDrivers() {
    let requestBody = this.addUserForm.value;

    this.driversService.addNewDriver(requestBody).subscribe({
      next: (res: any) => {
        this.getAllDrivers();
        this.addUserForm.reset();
      },
      complete: () => {
        this.modalService.dismissAll();
      },
      error: (error: any) => {
        console.log(error);
      },
    });
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
    if (this.driversData.items.length) {
      this.driversData.items.forEach((item: any) => {
        item.isChecked = event.target.checked;
      });
    }
  }
}
