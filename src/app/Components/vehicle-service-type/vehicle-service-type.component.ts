import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
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
import { VehicleServiceTypeService } from './Services/vehicle-service-type.service';
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
  ],
  templateUrl: './vehicle-service-type.component.html',
  styleUrl: './vehicle-service-type.component.scss',
})
export class VehicleServiceTypeComponent {
  public readonly imgUrl = environment.image;

  addVehicleServiceTypeForm!: FormGroup;
  updateVehicleServiceTypeForm!: FormGroup;

  vehicleServiceTypes: any[] = [];
  choosedVehicle: any;
  isLoading: boolean = false;
  base64Image: string | undefined;
  lang!: string;

  constructor(
    private vehicleServiceTypeService: VehicleServiceTypeService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private translate: TranslateService,
    private translation: TranslationService
  ) {}

  ngOnInit(): void {
    this.initialiseVehicleServiceTypeForm();
    this.getAllVehicleServiceType();
    this.languageSetter();
  }

  languageSetter() {
    if (!this.lang) {
      this.lang = this.translate.currentLang;
    }
    this.translation.getLanguage.subscribe((val: string) => {
      this.lang = val;
    });
  }

  initialiseVehicleServiceTypeForm() {
    this.addVehicleServiceTypeForm = this.fb.group({
      nameEn: [null, Validators.required],
      nameAr: [null, Validators.required],
      image: ['', Validators.required],
      status: [null, Validators.required],
    });
    this.updateVehicleServiceTypeForm = this.fb.group({
      id: [null, Validators.required],
      nameEn: [null, Validators.required],
      nameAr: [null, Validators.required],
      image: ['', Validators.required],
      status: [null, Validators.required],
    });
  }

  getAllVehicleServiceType() {
    this.isLoading = true;
    this.vehicleServiceTypeService.getAllVehicleServiceTypes().subscribe({
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

  openUpdateVehcleModal(content: any, selectedVehicleServiceType: any) {
    this.choosedVehicle = selectedVehicleServiceType;
    this.setVehicleServiceTypeDataInUpdateForm(selectedVehicleServiceType);
    this.modalService.open(content, {
      size: 'xl',
      backdrop: 'static',
      centered: true,
      scrollable: true,
    });
  }
  setVehicleServiceTypeDataInUpdateForm(selectedVehicleServiceType: any) {
    this.updateVehicleServiceTypeForm.patchValue({
      id: selectedVehicleServiceType?.id,
      nameEn: selectedVehicleServiceType?.nameEn,
      nameAr: selectedVehicleServiceType?.nameAr,
      status: selectedVehicleServiceType?.status,
      image: this.updateVehicleServiceTypeForm.controls['image'].value
        ? this.updateVehicleServiceTypeForm.controls['image'].value
        : '',
    });
  }
  convertImageToBase64(imageUrl: string): void {
    this.vehicleServiceTypeService
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

  openAddModal(content: any) {
    this.modalService.open(content, {
      size: 'xl',
      backdrop: 'static',
      centered: true,
      scrollable: true,
    });
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  uploadPhoto(event: any) {
    this.vehicleServiceTypeService
      .convertFileToBase64(event.target.files[0])
      .then((res) => {
        this.addVehicleServiceTypeForm.controls['image'].setValue(res);
        let cleanedBase64Image = this.vehicleServiceTypeService.processImage(
          this.addVehicleServiceTypeForm.controls['image'].value
        );

        this.addVehicleServiceTypeForm.controls['image'].setValue(
          cleanedBase64Image
        );
      })
      .finally(() => {});
  }
  uploadPhotoOnUpdate(event: any) {
    this.vehicleServiceTypeService
      .convertFileToBase64(event.target.files[0])
      .then((res) => {
        this.updateVehicleServiceTypeForm.controls['image'].setValue(res);
        let cleanedBase64Image = this.vehicleServiceTypeService.processImage(
          this.updateVehicleServiceTypeForm.controls['image'].value
        );

        this.updateVehicleServiceTypeForm.controls['image'].setValue(
          cleanedBase64Image
        );
      })
      .finally(() => {});
  }
  addVehicleServiceType() {
    let addNewVehicleBody = {
      ...this.addVehicleServiceTypeForm.value,
      status: this.addVehicleServiceTypeForm.value.status === 'true',
    };
    this.vehicleServiceTypeService
      .addVehicleServiceType(addNewVehicleBody)
      .subscribe({
        next: (res: any) => {
          this.getAllVehicleServiceType();
          this.modalService.dismissAll();
          this.addVehicleServiceTypeForm.reset();
        },
        error: (error: any) => {
          console.log(error);
        },
      });
  }
  updateVehicleServiceType() {
    let updateVehicleBody = {
      ...this.updateVehicleServiceTypeForm.value,
      status: this.updateVehicleServiceTypeForm.value.status === 'true',
    };
    this.vehicleServiceTypeService
      .updateVehicleServiceType(updateVehicleBody)
      .subscribe({
        next: (res: any) => {
          this.getAllVehicleServiceType();
          this.modalService.dismissAll();
          this.updateVehicleServiceTypeForm.reset();
        },
        error: (error: any) => {
          console.log(error);
        },
      });
  }

  checkboxEvent(event: any) {}
}
