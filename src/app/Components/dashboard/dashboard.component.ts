import { Component, inject, OnInit } from '@angular/core';
import { DashboardService } from './services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  dashboardStatisticalData: any[] = [];
  private dashboardService = inject(DashboardService);

  ngOnInit(): void {
    this.getAllDashboardStatisticalData();
  }

  getAllDashboardStatisticalData() {
    this.dashboardService.getAllDashboardData().subscribe({
      next: (dashboardData) => {
        debugger;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
