import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SpinnerComponent } from '../../shared-ui/spinner/spinner.component';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { AddRequestService } from './services/add-request.service.service';
import { TranslationService } from '../../Core/Services/translation.service';
import { GoogleMapsModule } from '@angular/google-maps';
import { SignalRService } from './services/signalR-service.service';

@Component({
  selector: 'app-add-request',
  standalone: true,
  imports: [
    NgbNavModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    SpinnerComponent,
    TranslateModule,
    GoogleMapsModule,
  ],
  templateUrl: './add-request.component.html',
  styleUrl: './add-request.component.scss',
})
export class AddRequestComponent implements OnInit, AfterViewInit {
  requestForm!: FormGroup;
  setIsLoading: any = signal(false);

  vehicleServiceTypes: any[] = [];
  drivers: any[] = [];
  lang!: string;
  @ViewChild('fromInput') fromInput!: ElementRef;
  @ViewChild('toInput') toInput!: ElementRef;
  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private addRequestService: AddRequestService,
    private translationService: TranslationService,
    private translate: TranslateService,
    private signalRService: SignalRService
  ) {}

  ngOnInit() {
    this.requestForm = new FormGroup({
      fromLocationName: new FormControl('', Validators.required),
      toLocationName: new FormControl('', Validators.required),
      customerFromLocationLatitude: new FormControl('', Validators.required),
      customerFromLocationLongitude: new FormControl('', Validators.required),
      customerToLocationLatitude: new FormControl('', Validators.required),
      customerToLocationLongitude: new FormControl('', Validators.required),
      vehicleServiceTypeId: new FormControl('', Validators.required),
      driverId: new FormControl('', Validators.required),
      customerName: new FormControl('', Validators.required),
      customerPhone: new FormControl('', Validators.required),
    });
    this.languageSetter();

    // Fetch vehicle service types on load
    this.getAllVehicleServiceTypes();
  }
  ngAfterViewInit() {
    // Call initializeAutocomplete here
    this.initializeAutocomplete();
  }
  languageSetter() {
    if (!this.lang) {
      this.lang = this.translate.currentLang;
    }
    this.translationService.getLanguage.subscribe((val: string) => {
      this.lang = val;
    });
  }
  // Google Maps autocomplete logic for "from" and "to" location

  // Initialize Google Places Autocomplete
  // Initialize Google Places Autocomplete
  initializeAutocomplete() {
    const fromAutocomplete = new google.maps.places.Autocomplete(
      this.fromInput.nativeElement,
      {
        componentRestrictions: { country: 'EG' }, // Restrict results to Egypt
      }
    );

    const toAutocomplete = new google.maps.places.Autocomplete(
      this.toInput.nativeElement,
      {
        componentRestrictions: { country: 'EG' }, // Restrict results to Egypt
      }
    );

    // Set up the event listeners for the from location input
    fromAutocomplete.addListener('place_changed', () => {
      const place = fromAutocomplete.getPlace();
      if (place && place.geometry && place.geometry.location) {
        this.requestForm.patchValue({
          fromLocationName: place.name,
          customerFromLocationLatitude: place.geometry.location.lat(),
          customerFromLocationLongitude: place.geometry.location.lng(),
        });
      } else {
        // Handle the case where no geometry is available
        this.toastr.error(
          'Could not retrieve location data for the selected place.'
        );
      }
    });

    // Set up the event listeners for the to location input
    toAutocomplete.addListener('place_changed', () => {
      const place = toAutocomplete.getPlace();
      if (place && place.geometry && place.geometry.location) {
        this.requestForm.patchValue({
          toLocationName: place.name,
          customerToLocationLatitude: place.geometry.location.lat(),
          customerToLocationLongitude: place.geometry.location.lng(),
        });
      } else {
        // Handle the case where no geometry is available
        this.toastr.error(
          'Could not retrieve location data for the selected place.'
        );
      }
    });
  }

  // Fetch all vehicle service types from API
  getAllVehicleServiceTypes() {
    this.addRequestService.getAllVehicleServiceTypes().subscribe({
      next: (res: any) => {
        this.vehicleServiceTypes = res;
      },
      error: (error: any) => {
        this.toastr.error('Error loading vehicle service types');
      },
    });
  }

  // When vehicle service type changes, load drivers
  onVehicleServiceTypeChange(event: any) {
    const selectedVehicleServiceTypeId = event.target.value;
    this.addRequestService
      .getDriversByVehicleServiceType(selectedVehicleServiceTypeId)
      .subscribe({
        next: (res: any) => {
          this.drivers = res.data;
          this.requestForm.patchValue({
            driverName: '',
            driverPhone: '',
          });
        },
        error: (error: any) => {
          this.requestForm.patchValue({
            driverName: '',
            driverPhone: '',
            driver: '',
          });
          this.toastr.error('Error loading drivers');
        },
      });
  }

  onSubmit() {
    this.setIsLoading.set(true);
    if (this.requestForm.valid) {
      const formData = {
        fromLocationName: this.requestForm.value.fromLocationName,
        toLocationName: this.requestForm.value.toLocationName,
        customerFromLocationLatitude:
          this.requestForm.value.customerFromLocationLatitude,
        customerFromLocationLongitude:
          this.requestForm.value.customerFromLocationLongitude,
        customerToLocationLatitude:
          this.requestForm.value.customerToLocationLatitude,
        customerToLocationLongitude:
          this.requestForm.value.customerToLocationLongitude,
        vehicleServiceTypeId: +this.requestForm.value.vehicleServiceTypeId,
        driverId: +this.requestForm.value.driverId,
        customerName: this.requestForm.value.customerName,
        customerPhone: this.requestForm.value.customerPhone,
      };

      // Send data via SignalR and handle the response message
      this.signalRService
        .sendTripData(formData)
        .then((responseMessage: any) => {
          this.setIsLoading.set(false);
          console.log(responseMessage);
          if (responseMessage.isSuccess) {
            this.toastr.success(
              `Done: RequestRouteId =  ${responseMessage.data.requestRouteId}`
            );
            this.requestForm.reset();
          } else {
            this.toastr.error(` ${responseMessage.error.errors[0].errorAr}`);
          }
        })
        .catch((error) => {
          this.setIsLoading.set(false);
          console.error('Error sending SignalR request:', error);
          this.toastr.error('Failed to send request via SignalR.');
        });
    } else {
      this.toastr.error('Please fill all required fields');
    }
  }
}
