import { map } from 'rxjs';
import { Component } from '@angular/core';
import { DriversService } from '../Drivers/Services/drivers.service';
import { VehicleService } from './Services/vehicle.service';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../environments/environment.development';
import { SpinnerComponent } from '../../shared-ui/spinner/spinner.component';
import { TooltipModule } from 'primeng/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslationService } from '../../Core/Services/translation.service';
import { DropdownModule } from 'primeng/dropdown';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-vehicle',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SpinnerComponent,
    TooltipModule,
    TranslateModule,
    DropdownModule,
  ],
  templateUrl: './vehicle.component.html',
  styleUrl: './vehicle.component.scss',
})
export class VehicleComponent {
  selectedDriverVehicle: any;
  public readonly imgUrl = environment.image;
  driversData: any[] = [];
  addVehicleForm!: FormGroup;
  updateVehicleForm!: FormGroup;
  addDriverVehicleForm!: FormGroup;
  updateDriverVehicleForm!: FormGroup;
  nationalities: any[] = [];
  vehicleSpecifications: any[] = [];
  vehicleTypes: any[] = [];
  fuelTypes: any[] = [];
  vehicleOwnerShips: any[] = [];
  vehicleStatus: any[] = [];
  vehicleBrands: any[] = [];
  vehicleBody: any[] = [];
  Drivers: any[] = [];
  vehicleDrivers: any[] = [];
  vehicleServiceTypes: any[] = [];
  choosedVehicle: any;
  isLoading: boolean = false;
  base64Image: string | undefined;
  singleSelectedVehicle: any;
  lang!: string;
  zones: any[] = [];
  selectedDriver: any;
  constructor(
    private vehilcesService: VehicleService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private translate: TranslateService,
    private translation: TranslationService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getAllVehicles();
    this.getAllVehicleSpecifications();
    this.initialiseVehicleForm();
    this.getAllVehiclesTypes();
    this.getAllFuelTypes();
    this.getAllVehiclesOwner();
    this.getAllVehicleStatus();
    this.getAllVehicleBrand();
    this.getAllVehicleBody();
    this.getAllDrivers();
    this.getAllVehicleServiceType();
    this.languageSetter();
    this.getAllZones();
  }

  languageSetter() {
    if (!this.lang) {
      this.lang = this.translate.currentLang;
    }
    this.translation.getLanguage.subscribe((val: string) => {
      this.lang = val;
    });
  }

  initialiseVehicleForm() {
    this.addVehicleForm = this.fb.group({
      vehicleName: [null, Validators.required],
      year: [null, Validators.required],
      photo: ['', Validators.required],
      vehicleColor: ['#FF7B00', Validators.required],
      vehicleTypeId: [null, Validators.required],
      fuelTypeId: [null, Validators.required],
      vehicleOwnershipId: [null, Validators.required],
      // vehicleLifeCycleId: [null, Validators.required],
      vehicleStatusId: [null, Validators.required],
      // vehicleFinancialId: [null, Validators.required],
      vehicleBrandId: [null, Validators.required],
      vehicleBodyTypeId: [null, Validators.required],
      vehicleServiceTypeId: [null, Validators.required],
      zoneId: [null, Validators.required],
    });
    this.updateVehicleForm = this.fb.group({
      id: [null, Validators.required],
      vehicleName: [null, Validators.required],
      year: [null, Validators.required],
      photo: ['', Validators.required],
      vehicleColor: ['#FF7B00', Validators.required],
      // vehicleSpecificationId: [null, Validators.required],
      vehicleTypeId: [null, Validators.required],
      fuelTypeId: [null, Validators.required],
      vehicleOwnershipId: [null, Validators.required],
      // vehicleLifeCycleId: [null, Validators.required],
      vehicleStatusId: [null, Validators.required],
      // vehicleFinancialId: [null, Validators.required],
      vehicleBrandId: [null, Validators.required],
      vehicleBodyTypeId: [null, Validators.required],
      vehicleServiceTypeId: [null, Validators.required],
      zoneId: [null, Validators.required],
    });
    this.addDriverVehicleForm = this.fb.group({
      startDate: [null, Validators.required],
      expiryDate: [null, Validators.required],
      driverId: [null, Validators.required],
      vehicleId: [null, Validators.required],
    });
    this.updateDriverVehicleForm = this.fb.group({
      id: [null, Validators.required],
      startDate: [null, Validators.required],
      expiryDate: [null, Validators.required],
      driverId: [null, Validators.required],
      vehicleId: [null, Validators.required],
    });
  }

  getAllVehicles() {
    this.isLoading = true;
    this.vehilcesService.getAllVehicles().subscribe({
      next: (res: any) => {
        this.driversData = res;
        this.isLoading = false;
        console.log(res);
      },
      complete: () => {},
      error: (err) => {
        this.isLoading = false;
        console.log(err);
      },
    });
  }

  getAllDrivers() {
    this.isLoading = true;
    this.vehilcesService.getAllDrivers().subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.Drivers = res;
      },
      error: (error: any) => {
        this.isLoading = false;
        console.log(error);
      },
    });
  }
  getAllVehicleBrand() {
    this.isLoading = true;
    this.vehilcesService.getVehicleBrand().subscribe({
      next: (res: any) => {
        this.vehicleBrands = res;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.isLoading = false;

        console.log(error);
      },
    });
  }
  getAllVehicleServiceType() {
    this.isLoading = true;
    this.vehilcesService.getVehicleServiceType().subscribe({
      next: (res: any) => {
        this.vehicleServiceTypes = res;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.isLoading = false;

        console.log(error);
      },
    });
  }
  getAllVehicleBody() {
    this.isLoading = true;

    this.vehilcesService.getVehicleBody().subscribe({
      next: (res: any) => {
        this.vehicleBody = res;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.isLoading = false;

        console.log(error);
      },
    });
  }
  getAllVehicleStatus() {
    this.isLoading = true;
    this.vehilcesService.getVehicleStatus().subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.vehicleStatus = res;
      },
      error: (error: any) => {
        this.isLoading = false;
        console.log(error);
      },
    });
  }

  openDriverModal(content: any, selectedVehicle: any) {
    this.choosedVehicle = selectedVehicle;
    this.modalService.open(content, {
      size: 'xl',
      backdrop: 'static',
      centered: true,
      scrollable: true,
    });
  }
  openUpdateVehcleModal(content: any, selectedVehicle: any) {
    this.choosedVehicle = selectedVehicle;
    this.setVehcleDataInUpdateForm(selectedVehicle.res);
    this.modalService.open(content, {
      size: 'xl',
      backdrop: 'static',
      centered: true,
      scrollable: true,
    });
  }

  setVehcleDataInUpdateForm(selectedVehicle: any) {
    this.updateVehicleForm.patchValue({
      id: selectedVehicle.id,
      vehicleName: selectedVehicle.vehicleName,
      year: selectedVehicle.year,
      photo: selectedVehicle.photo,
      vehicleColor: selectedVehicle.vehicleColor,
      vehicleTypeId: selectedVehicle.vehicleType?.id,
      fuelTypeId: selectedVehicle.fuelType?.id,
      vehicleOwnershipId: selectedVehicle.vehicleOwnership?.id,
      vehicleStatusId: selectedVehicle.vehicleStatus?.id,
      vehicleBrandId: selectedVehicle.vehicleBrand?.id,
      vehicleBodyTypeId: selectedVehicle.vehicleBodyType?.id,
      vehicleServiceTypeId: selectedVehicle.vehicleServiceType?.id || 1,
      zoneId: selectedVehicle.zone.id,
    });
  }

  convertImageToBase64(imageUrl: string): void {
    this.vehilcesService
      .getImageAsBase64(imageUrl)
      .then((base64) => {
        this.base64Image = base64; // Store base64 image
        console.log(this.base64Image); // For debugging
        // Now you can send `this.base64Image` to your backend
      })
      .catch((error) =>
        console.error('Error converting image to base64:', error)
      );
  }
  //here is the function needed to get all added drivers on the selected vehicle
  getAllVehicleDrivers(selectedVehicleId: any) {
    this.vehilcesService.getVehicleDetails(selectedVehicleId).subscribe({
      next: (res: any) => {
        this.vehicleDrivers = res.data.drivers;
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  getAllVehiclesOwner() {
    this.vehilcesService.getVehicleOwnerShips().subscribe({
      next: (res: any) => {
        this.vehicleOwnerShips = res;
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  openAddModal(content: any) {
    this.modalService.open(content, {
      size: 'xl',
      backdrop: 'static',
      centered: true,
      scrollable: true,
    });
    this.getAllNationalities();
  }
  getAllNationalities() {
    this.vehilcesService.getAllNationalities().subscribe({
      next: (res: any) => {
        this.nationalities = res;
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  getAllVehicleSpecifications() {
    this.isLoading = true;
    this.vehilcesService.getAllVehicleSpecification().subscribe({
      next: (res: any) => {
        this.vehicleSpecifications = res;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.isLoading = false;

        console.log(error);
      },
    });
  }

  getAllVehiclesTypes() {
    this.vehilcesService.getAllVehicleTypes().subscribe({
      next: (res: any) => {
        this.vehicleTypes = res;
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  getAllFuelTypes() {
    this.vehilcesService.getAllFuelTypes().subscribe({
      next: (res: any) => {
        this.fuelTypes = res;
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  showVehicleDrivers(selectedVehicle: any, content: any) {
    this.addDriverVehicleForm.reset();
    this.getAllVehicleDrivers(selectedVehicle.res.id);
    this.modalService.open(content, {
      size: 'xl',
      backdrop: 'static',
      centered: true,
      scrollable: true,
    });
  }
  uploadPhoto(event: any) {
    this.vehilcesService
      .convertFileToBase64(event.target.files[0])
      .then((res) => {
        this.addVehicleForm.controls['photo'].setValue(res);
        let cleanedBase64Image = this.vehilcesService.processImage(
          this.addVehicleForm.controls['photo'].value
        );

        this.addVehicleForm.controls['photo'].setValue(cleanedBase64Image);
      })
      .finally(() => {});
  }
  uploadPhotoOnUpdate(event: any) {
    this.vehilcesService
      .convertFileToBase64(event.target.files[0])
      .then((res) => {
        this.updateVehicleForm.controls['photo'].setValue(res);
        let cleanedBase64Image = this.vehilcesService.processImage(
          this.updateVehicleForm.controls['photo'].value
        );

        this.updateVehicleForm.controls['photo'].setValue(cleanedBase64Image);
      })
      .finally(() => {});
  }
  addVehicle() {
    let addNewVehicleBody = this.addVehicleForm.value;
    this.vehilcesService.addNewVehicle(addNewVehicleBody).subscribe({
      next: (res: any) => {
        this.getAllVehicles();
        this.modalService.dismissAll();
        this.addVehicleForm.reset();
        this.toastr.success('Vehicle added successfully!', 'Success'); // Show success message
      },
      error: (error: any) => {
        console.error('Error adding vehicle:', error);
        debugger;
        // Prepare error message based on the selected language
        let errorMessage = '';
        if (this.lang === 'En') {
          console.log(error);
          errorMessage = error.error.error.errors[0].errorEn;
        } else if (this.lang === 'Ar') {
          errorMessage = error.errorerror.errors[0].errorAr;
        }

        // Show error message in toastr
        this.toastr.error(errorMessage, 'Error');
      },
    });
  }

  getFullImageUrl(): string {
    debugger;
    if (this.choosedVehicle) {
      return `${this.imgUrl}${this.choosedVehicle?.res?.photo}`;
    }

    // if (this.choosedVehicle?.user) {
    //   return `${this.imgUrl}${this.singleClient.user.picture}`;
    // } else if (this.singleClient) {
    //   return `${this.imgUrl}${this.singleClient}`;
    // }
    return '../../../assets/unknown.png';
  }

  updateVehicle() {
    let updateVehicleBody = this.updateVehicleForm.value;
    this.vehilcesService.updateVehicle(updateVehicleBody).subscribe({
      next: (res: any) => {
        this.getAllVehicles();
        this.modalService.dismissAll();
        this.updateVehicleForm.reset();
        this.toastr.success('Vehicle updated successfully!', 'Success'); // Show success message
      },
      error: (error: any) => {
        console.error('Error updating vehicle:', error);

        // Prepare error message based on the selected language
        let errorMessage = '';
        if (this.lang === 'En') {
          errorMessage = errorMessage =
            error.error.error.errors[0].errorEn ||
            'An error occurred while updating the vehicle.';
        } else if (this.lang === 'Ar') {
          errorMessage = errorMessage =
            error.error.error.errors[0].errorAr ||
            'حدث خطأ أثناء تحديث المركبة.';
        }

        // Show error message in toastr
        this.toastr.error(errorMessage, 'Error');
      },
    });
  }

  addDriver() {
    this.addDriverVehicleForm.patchValue({
      vehicleId: this.choosedVehicle.res.id,
    });
    let driverVehicleBody = this.addDriverVehicleForm.value;
    this.vehilcesService.addNewDriverForVehicle(driverVehicleBody).subscribe({
      next: (res: any) => {
        this.modalService.dismissAll();
        this.getAllVehicles();
        this.addDriverVehicleForm.reset();
        this.toastr.success('Driver added successfully!', 'Success'); // Show success message
      },
      error: (error: any) => {
        console.error('Error adding driver:', error);

        // Prepare error message based on the selected language
        let errorMessage = '';
        if (this.lang === 'En') {
          errorMessage = errorMessage =
            error.error.error.errors[0].errorEn ||
            'An error occurred while adding the driver.';
        } else if (this.lang === 'Ar') {
          errorMessage = errorMessage =
            error.error.error.errors[0].errorAr ||
            'حدث خطأ أثناء إضافة السائق.';
        }

        // Show error message in toastr
        this.toastr.error(errorMessage, 'Error');
      },
    });
  }

  getAllZones() {
    this.vehilcesService.getAllZones().subscribe((res: any) => {
      this.zones = res;
    });
  }
  checkboxEvent(event: any) {}

  openUpdateModal(updateDriverContent: any, vehicleDriver: any) {
    debugger;
    this.selectedDriverVehicle = vehicleDriver;
    this.modalService.open(updateDriverContent, {
      size: 'xl',
      backdrop: 'static',
      keyboard: false,
    });
    this.setDriverVehicleUpdateForm(vehicleDriver);
  }

  setDriverVehicleUpdateForm(selectedDriver: any) {
    debugger;
    this.updateDriverVehicleForm.patchValue({
      id: selectedDriver.id,
    });
  }

  confirmUpdateDriverVehicle() {
    const body = {};
    this.vehilcesService.updateDriverOnVehicle(body).subscribe({
      next: (res: any) => {},
      error: (error: any) => {
        //error logic goes here
      },
    });
  }
}
