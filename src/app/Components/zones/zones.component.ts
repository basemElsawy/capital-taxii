import { Component, NgZone, ViewChild } from '@angular/core';
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
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslationService } from '../../Core/Services/translation.service';
import {
  GoogleMap,
  GoogleMapsModule,
  MapAdvancedMarker,
  MapInfoWindow,
  MapMarker,
} from '@angular/google-maps';
import { ToastrService } from 'ngx-toastr';

declare var google: any;

@Component({
  selector: 'app-zones',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SpinnerComponent,
    TooltipModule,
    TranslateModule,
    GoogleMapsModule,
    MapMarker,
    MapInfoWindow,
    MapAdvancedMarker,
  ],
  templateUrl: './zones.component.html',
  styleUrl: './zones.component.scss',
})
export class ZonesComponent {
  checkedStatus: any;
  isEdit: boolean = false;
  isNew: boolean = false;
  @ViewChild(GoogleMap) mapInstance!: GoogleMap;
  addZoneForm!: FormGroup;
  updateZoneForm!: FormGroup;
  choosedZone: any;
  isLoading: boolean = false;
  zones: any[] = [];
  lang!: string;
  center!: google.maps.LatLngLiteral;
  zoom: number = 14;
  polygonData: any = [];
  geometricalCoordinates: google.maps.LatLngLiteral[] = [];

  map: any;
  drawingManager: any;

  options: google.maps.PolylineOptions = {
    strokeColor: '#F0944D',
    strokeWeight: 4,
  };
  constructor(
    private zonesService: ZonesService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private translate: TranslateService,
    private translation: TranslationService,
    private zone: NgZone,
    private toastr: ToastrService
  ) {}

  ngAfterViewInit() {
    this.initializeDrawingManager();
  }

  initializeDrawingManager() {
    if (!this.mapInstance.googleMap) return;

    const drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [google.maps.drawing.OverlayType.POLYGON],
      },

      circleOptions: {
        fillColor: '#ffff00',
        fillOpacity: 1,
        strokeWeight: 5,
        clickable: true,
        editable: true,
        zIndex: 1,
      },
    });

    // Set the map on the DrawingManager instance
    drawingManager.setMap(this.mapInstance.googleMap);

    google.maps.event.addListener(
      drawingManager,
      'polygoncomplete',
      (event: any) => {
        this.handlePolygonComplete(event);
      }
    );
  }

  polygons: any[] = [];

  updatePolygonCount() {
    let polygonCount = this.polygons.length;
  }

  ngOnInit(): void {
    this.initializeStationsForm();
    // this.initializeUpdateZoneForm();

    this.getAllZones();
    this.languageSetter();
    this.getCurrentPosition();
    console.log(this.geometryArray.value);
  }
  languageSetter() {
    if (!this.lang) {
      this.lang = this.translate.currentLang;
    }
    this.translation.getLanguage.subscribe((val: string) => {
      this.lang = val;
    });
  }
  getCurrentPosition() {
    this.zonesService
      .getCurrentLocation()
      .then((res: any) => {
        let latitude = res.coords.latitude;
        let longitude = res.coords.longitude;
        this.center = { lat: latitude, lng: longitude };
      })
      .catch((err) => console.log(err));
  }
  initializeStationsForm() {
    this.addZoneForm = this.fb.group({
      nameEn: [null, Validators.required],
      nameAr: [null, Validators.required],
      status: [false, Validators.required],
      geometry: this.fb.array([]),
    });
    this.updateZoneForm = this.fb.group({
      nameEn: [null, Validators.required],
      nameAr: [null, Validators.required],
      status: [false, Validators.required],
    });
  }

  setChoosedStatus(ev: any) {
    this.checkedStatus = ev.target.checked;
  }

  get geometryArray(): FormArray {
    return this.addZoneForm.get('geometry') as FormArray;
  }

  createGeometryGroup(x: number, y: number): FormGroup {
    return this.fb.group({
      x: [x, Validators.required], //here is the lat
      y: [y, Validators.required], //here is the lng
    });
  }

  addGeometry(lat: number, lng: number) {
    this.geometryArray.push(this.createGeometryGroup(lat, lng));
    console.log(this.geometryArray);
  }

  handlePolygonComplete(event: any) {
    const vertices = event.getPath();
    const coordinates: any[] = [];
    vertices.forEach((vertex: any) => {
      const lat = vertex.lat();
      const lng = vertex.lng();

      coordinates.push({ latitude: lat, longitude: lng });

      this.addGeometry(lat, lng);
    });

    this.polygons.push(coordinates);
    this.updatePolygonCount();
  }
  polygonPaths: google.maps.LatLngLiteral[] = [];
  PolygonCenter!: google.maps.LatLngLiteral;
  openZoneDetailsModal(content: any, selectedZone: any) {
    this.polygonPaths = selectedZone.geometry.map((coord: any) => ({
      lat: coord.x,
      lng: coord.y,
    }));

    this.PolygonCenter = {
      lat: this.polygonPaths[0].lat,
      lng: this.polygonPaths[0].lng,
    };
    this.setZoneDataDetailsForm(selectedZone);
    this.modalService.open(content, {
      size: 'xl',
      backdrop: 'static',
      centered: true,
      scrollable: true,
    });
  }
  selectedZoneId: any;
  setZoneDataDetailsForm(selectedZone: any) {
    this.selectedZoneId = selectedZone.id;
    this.checkedStatus = selectedZone.status;
    this.updateZoneForm.patchValue({
      nameEn: selectedZone.nameEn,
      nameAr: selectedZone.nameAr,
      status: this.checkedStatus,
    });
    // this.addZoneForm.get('nameEn')?.disable();
    // this.addZoneForm.get('nameAr')?.disable();
  }
  openAddModal(content: any) {
    if (!this.geometryArray.length) {
      return;
    }

    // this.geometryArray.controls.forEach((element) => {
    //   element.disable();
    // });
    this.addZoneForm.get('nameEn')?.enable();
    this.addZoneForm.get('nameAr')?.enable();
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

  addZone() {
    this.addZoneForm.patchValue({
      status: this.checkedStatus,
    });
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
  updateZone() {
    // Update the status field with the current checked status
    this.updateZoneForm.patchValue({
      status: this.checkedStatus,
    });

    // Prepare the request body with the updated form values and the selected zone ID
    let body = {
      ...this.updateZoneForm.value,
      id: this.selectedZoneId,
    };

    // Call the zones service to update the zone
    this.zonesService.updateZone(body).subscribe({
      next: (res: any) => {
        // If the update is successful, refresh the zones list, close the modal, and reset the form
        this.getAllZones();
        this.modalService.dismissAll();
        this.addZoneForm.reset();
      },
      error: (error: any) => {
        console.error('Error updating zone:', error);

        // Check the language and display the error message accordingly
        let errorMessage = '';
        if (this.lang === 'En') {
          errorMessage =
            error.MesgEn?.non_field_errors?.[0] ||
            'An error occurred while updating the zone';
        } else if (this.lang === 'Ar') {
          errorMessage = error.MesgAr || 'حدث خطأ أثناء تحديث المنطقة';
        }

        // Show error message in toastr
        this.toastr.error(errorMessage, 'Error');
      },
    });
  }

  getAllZones() {
    this.zonesService.getAllZones().subscribe((res: any) => {
      this.zones = res.map((zone: any) => {
        return { ...zone, isChecked: false };
      });
    });
  }
  checkboxEvent(event: any, item: any) {
    if (event.target.checked) {
      // Add the selected location's polygon to the array
      const polygonCoordinates = item.zone.geometry.map((geo: any) => ({
        lat: geo.x,
        lng: geo.y,
      }));

      this.polygonData.push(polygonCoordinates);
      this.geometricalCoordinates = [
        ...this.geometricalCoordinates,
        ...polygonCoordinates,
      ];
    } else {
      // Remove the unchecked location's polygon from the array
      this.polygonData = this.polygonData.filter(
        (polygon: google.maps.LatLngLiteral[]) => {
          // Compare coordinates to remove unchecked polygons
          return !polygon.some(
            (coord: any) =>
              coord.lat === item.zone.geometry[0].x &&
              coord.lng === item.zone.geometry[0].y
          );
        }
      );

      this.geometricalCoordinates = this.geometricalCoordinates.filter(
        (coord: any) =>
          !item.zone.geometry.some(
            (geo: any) => coord.lat === geo.x && coord.lng === geo.y
          )
      );
    }

    // Update the map to fit the bounds of all selected polygons
    this.fitBoundsToPolygons();
  }

  fitBoundsToPolygons() {
    if (this.polygonData.length > 0) {
      // Create new bounds object
      const bounds = new google.maps.LatLngBounds();

      // Extend bounds to include all polygons
      this.polygonData.forEach((polygon: google.maps.LatLngLiteral[]) => {
        polygon.forEach((coordinate: google.maps.LatLngLiteral) => {
          bounds.extend(coordinate);
        });
      });

      // If any polygons exist, fit the map to show them
      if (this.mapInstance) {
        this.mapInstance.fitBounds(bounds);
      }
    } else {
      // If no polygons are selected, center the map on Cairo
      this.center = { lat: 30.0444, lng: 31.2357 }; // Cairo coordinates
      this.zoom = 12; // Default zoom level for Cairo
    }
  }
}
