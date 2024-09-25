import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { DashboardService } from './services/dashboard.service';
import { ArrivedTripsComponent } from './arrived-trips/arrived-trips.component';
import { CancledTripsComponent } from './cancled-trips/cancled-trips.component';
import { NewTripsComponent } from './new-trips/new-trips.component';
import { ConfirmedTripsComponent } from './confirmed-trips/confirmed-trips.component';
import { InProgressTripsComponent } from './in-progress-trips/in-progress-trips.component';
import { environment } from '../../../environments/environment.development';
import { SpinnerComponent } from '../../shared-ui/spinner/spinner.component';
import { SharedTableComponent } from './shared-table/shared-table.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslationService } from '../../Core/Services/translation.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    ArrivedTripsComponent,
    CommonModule,
    CancledTripsComponent,
    NewTripsComponent,
    ConfirmedTripsComponent,
    InProgressTripsComponent,
    SpinnerComponent,
    SharedTableComponent,
    TranslateModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  isChoosed: boolean = false;
  private imageBaseURL: string = environment.image;
  dashboardStatisticalData: any[] = [];
  newRequestDetails: any[] = [];
  confirmedRequestDetails: any[] = [];
  arrivedRequestDetails: any[] = [];
  cancledRequestDetails: any[] = [];
  inProgressTrips: any[] = [];
  allDrivers: any[] = [];

  choosenCardData: any = signal([]);
  setIsLoading: any = signal(true);
  lang!: string;
  IsNewRequests: boolean = false;
  IsConfirmedRequests: boolean = false;
  IsCancledRequests: boolean = false;
  IsArrivedRequests: boolean = false;
  IsInProgressTrips: boolean = false;

  dashboardData: any;
  constructor(
    private dashboardService: DashboardService,
    private translate: TranslateService,
    private translation: TranslationService,
    private toastr: ToastrService
  ) {}
  ngOnInit(): void {
    this.getAllDashboardStatisticalData();
    this.getAllDrivers();
  }

  languageSetter() {
    if (!this.lang) {
      this.lang = this.translate.currentLang;
    }
    this.translation.getLanguage.subscribe((val: string) => {
      this.lang = val;
    });
  }

  getAllDashboardStatisticalData() {
    this.newRequestDetails = [];
    this.cancledRequestDetails = [];
    this.confirmedRequestDetails = [];
    this.arrivedRequestDetails = [];
    this.dashboardService.getAllDashboardData().subscribe({
      next: (res: any) => {
        this.dashboardData = {
          availableDrivers: res.availableDrivers,
          totalDriver: res.totalDriver,
          totalRevenue: res.totalRevenue,
          totalTrips: res.totalTrips,
          unavailableDrivers: res.unavailableDrivers,
          totalrevenue: res.totalRevenue,
        };

        console.log(res);
        res.tripsDetails.forEach((element: any) => {
          this.dashboardStatisticalData.push({
            count: element.count,
            statusName: element.requestStatusName,
            requestStatusId: element.requestStatusId,
            requestRoutes: element.requestRoutes,
          });
        });
        this.setIsLoading.set(false);
      },
      error: (error) => {
        this.setIsLoading.set(false);
        console.log(error);
      },
    });
  }

  selectedStatusId: any;
  getStatusDetails(choosedData: any) {
    this.choosenCardData.set(choosedData.requestRoutes);
    console.log(this.choosenCardData());

    // this.IsNewRequests = false;
    // this.isChoosed = false;
    // this.IsConfirmedRequests = false;
    // this.IsCancledRequests = false;
    // this.IsArrivedRequests = false;
    // this.IsInProgressTrips = false;
    // this.newRequestDetails = [];
    // this.confirmedRequestDetails = [];
    // this.cancledRequestDetails = [];
    // this.arrivedRequestDetails = [];
    // this.inProgressTrips = [];
    // this.selectedStatusId = choosedData.requestStatusId;
    // switch (choosedData.requestStatusId) {
    //   case 1:
    //     this.IsNewRequests = true;
    //     this.newRequestDetails = choosedData.requestRoutes;
    //     this.isChoosed = true;
    //     break;
    //   case 2:
    //     this.IsCancledRequests = true;
    //     this.cancledRequestDetails = choosedData.requestRoutes;
    //     this.isChoosed = true;
    //     break;
    //   // this.IsConfirmedRequests = true;
    //   // this.confirmedRequestDetails = choosedData.requestRoutes;
    //   // this.isChoosed = true;
    //   // break;
    //   // case 5:
    //   // case 4:
    //   //   this.IsArrivedRequests = true;
    //   //   this.arrivedRequestDetails = choosedData.requestRoutes;
    //   //   this.isChoosed = true;
    //   //   break;
    //   // case 8:
    //   //   this.IsInProgressTrips = true;
    //   //   this.inProgressTrips = choosedData.requestRoutes;
    //   //   this.isChoosed = true;
    //   //   break;
    // }
  }

  getAllDrivers(): void {
    this.setIsLoading.set(true);
    this.dashboardService.getAllDrivers(1, 10).subscribe({
      next: (drivers: any) => {
        this.setIsLoading.set(false);
        this.allDrivers = drivers.items;
      },
      error: (error) => {
        this.setIsLoading.set(false);
        console.log(error);
      },
    });
  }

  get imageUrl() {
    return this.imageBaseURL;
  }
}
