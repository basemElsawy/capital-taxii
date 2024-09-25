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

declare var google: any;

@Component({
  selector: 'app-stations',
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
    private zone: NgZone
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

  setZoneDataDetailsForm(selectedZone: any) {
    this.checkedStatus = selectedZone.status;
    this.addZoneForm.patchValue({
      nameEn: selectedZone.nameEn,
      nameAr: selectedZone.nameAr,
      status: this.checkedStatus,
    });
    this.addZoneForm.get('nameEn')?.disable();
    this.addZoneForm.get('nameAr')?.disable();
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

  getAllZones() {
    this.zonesService.getAllZones().subscribe((res: any) => {
      this.zones = res.map((zone: any) => {
        return { ...zone, isChecked: false };
      });
    });
  }
  checkboxEvent(event: any, item: any) {
    this.geometricalCoordinates = item.zone.geometry.map((geo: any) => {
      return { lat: geo.x, lng: geo.y };
    });

    console.log(this.geometricalCoordinates);
  }
}
