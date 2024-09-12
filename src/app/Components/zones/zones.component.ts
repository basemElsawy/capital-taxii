import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SpinnerComponent } from '../../shared-ui/spinner/spinner.component';
import { TooltipModule } from 'primeng/tooltip';
import { ZonesService } from './Services/zones.service';
@Component({
  selector: 'app-stations',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SpinnerComponent,
    TooltipModule,
  ],
  templateUrl: './zones.component.html',
  styleUrl: './zones.component.scss',
})
export class ZonesComponent {
  addZoneForm!: FormGroup;
  updateZoneForm!: FormGroup;
  choosedZone: any;
  isLoading: boolean = false;
  zones: any[] = [];
  constructor(
    private zonesService: ZonesService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initializeStationsForm();
    // this.initializeUpdateZoneForm();

    this.getAllZones();
  }

  initializeStationsForm() {
    this.addZoneForm = this.fb.group({
      nameEn: [null, Validators.required],
      nameAr: [null, Validators.required],
      geometry: this.fb.array([this.createGeometryGroup()]),
    });
  }
  // initializeUpdateZoneForm() {
  //   this.updateZoneForm = this.fb.group({
  //     nameEn: [null, Validators.required],
  //     nameAr: [null, Validators.required],
  //     geometry: this.fb.array([]), // Initialize with empty geometry array
  //   });
  // }
  get geometryArray(): FormArray {
    return this.addZoneForm.get('geometry') as FormArray;
  }

  createGeometryGroup(x: number = 0, y: number = 0): FormGroup {
    return this.fb.group({
      x: [x, Validators.required],
      y: [y, Validators.required],
    });
  }

  addGeometry() {
    this.geometryArray.push(this.createGeometryGroup());
  }

  openZoneDetailsModal(content: any, selectedZone: any) {
    this.choosedZone = selectedZone;
    this.setZoneDataDetailsForm(selectedZone);
    this.modalService.open(content, {
      size: 'xl',
      backdrop: 'static',
      centered: true,
      scrollable: true,
    });
  }

  setZoneDataDetailsForm(selectedZone: any) {
    // Reset the form and clear the geometry array
    this.addZoneForm.reset();
    this.geometryArray.clear();

    // Set form values for name fields
    this.addZoneForm.patchValue({
      nameEn: selectedZone.nameEn,
      nameAr: selectedZone.nameAr,
    });
    this.addZoneForm.get('nameEn')?.disable();
    this.addZoneForm.get('nameAr')?.disable();
    // Populate the geometry array with coordinates
    if (selectedZone.geometry && selectedZone.geometry.length) {
      selectedZone.geometry.forEach((coordinate: any) => {
        const geometryGroup = this.createGeometryGroup(
          coordinate.x,
          coordinate.y
        );
        geometryGroup.disable(); // Disable geometry group
        this.geometryArray.push(geometryGroup);
      });
    } else {
      // Add a default geometry group if no coordinates are available
      this.geometryArray.push(this.createGeometryGroup());
    }
  }
  openAddModal(content: any) {
    this.addZoneForm.reset(); // Reset the entire form
    this.resetGeometry(); // Reset the geometry array specifically
    this.addZoneForm.get('nameEn')?.enable();
    this.addZoneForm.get('nameAr')?.enable();
    this.modalService.open(content, {
      size: 'xl',
      backdrop: 'static',
      centered: true,
      scrollable: true,
    });
  }
  resetGeometry() {
    this.geometryArray.clear(); // Clear all existing controls in the array
    this.geometryArray.push(this.createGeometryGroup()); // Add one default geometry group
  }
  closeModal() {
    this.modalService.dismissAll();
  }

  addZone() {
    let body = this.addZoneForm.value;
    this.zonesService.addNewZone(body).subscribe({
      next: (res: any) => {
        this.getAllZones();
        this.modalService.dismissAll();
        this.addZoneForm.reset();
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  getAllZones() {
    this.zonesService.getAllZones().subscribe((res: any) => {
      this.zones = res;
    });
  }
  checkboxEvent(event: any) {}
}
