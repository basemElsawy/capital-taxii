import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { DashboardService } from './services/dashboard.service';
import { ArrivedTripsComponent } from './arrived-trips/arrived-trips.component';
import { CancledTripsComponent } from './cancled-trips/cancled-trips.component';
import { NewTripsComponent } from './new-trips/new-trips.component';
import { ConfirmedTripsComponent } from './confirmed-trips/confirmed-trips.component';
import { InProgressTripsComponent } from './in-progress-trips/in-progress-trips.component';
import { environment } from '../../../environments/environment.development';
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
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  isChoosed: boolean = false;
  public readonly imgUrl = environment.image;
  dashboardStatisticalData: any[] = [];
  newRequestDetails: any[] = [];
  confirmedRequestDetails: any[] = [];
  arrivedRequestDetails: any[] = [];
  cancledRequestDetails: any[] = [];
  inProgressTrips: any[] = [];
  allDrivers: any[] = [];

  IsNewRequests: boolean = false;
  IsConfirmedRequests: boolean = false;
  IsCancledRequests: boolean = false;
  IsArrivedRequests: boolean = false;
  IsInProgressTrips: boolean = false;

  dashboardData: any;
  private dashboardService = inject(DashboardService);

  ngOnInit(): void {
    this.getAllDashboardStatisticalData();
    this.getAllDrivers();
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

        res.tripsDetails.forEach((element: any) => {
          this.dashboardStatisticalData.push({
            count: element.count,
            statusName: element.requestStatusName,
            requestStatusId: element.requestStatusId,
            requestRoutes: element.requestRoutes,
          });
        });
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  selectedStatusId: any;
  getStatusDetails(choosedData: any) {
    debugger;
    this.IsNewRequests = false;
    this.isChoosed = false;
    this.IsConfirmedRequests = false;
    this.IsCancledRequests = false;
    this.IsArrivedRequests = false;
    this.IsInProgressTrips = false;
    this.newRequestDetails = [];
    this.confirmedRequestDetails = [];
    this.cancledRequestDetails = [];
    this.arrivedRequestDetails = [];
    this.inProgressTrips = [];
    this.selectedStatusId = choosedData.requestStatusId;
    switch (choosedData.requestStatusId) {
      case 1:
        this.IsNewRequests = true;
        this.newRequestDetails = choosedData.requestRoutes;
        this.isChoosed = true;
        break;
      case 2:
        this.IsConfirmedRequests = true;
        this.confirmedRequestDetails = choosedData.requestRoutes;
        this.isChoosed = true;
        break;
      case 5:
        this.IsCancledRequests = true;
        this.cancledRequestDetails = choosedData.requestRoutes;
        this.isChoosed = true;
        break;
      case 4:
        this.IsArrivedRequests = true;
        this.arrivedRequestDetails = choosedData.requestRoutes;
        this.isChoosed = true;
        break;
      case 8:
        this.IsInProgressTrips = true;
        this.inProgressTrips = choosedData.requestRoutes;
        this.isChoosed = true;
    }
  }

  getAllDrivers(): void {
    this.dashboardService.getAllDrivers(1, 10).subscribe({
      next: (drivers: any) => {
        debugger;
        this.allDrivers = drivers.items;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
