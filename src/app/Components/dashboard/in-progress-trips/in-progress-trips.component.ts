import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-in-progress-trips',
  standalone: true,
  templateUrl: './in-progress-trips.component.html',
  styleUrls: ['./in-progress-trips.component.scss'],
})
export class InProgressTripsComponent implements OnInit {
  @Input() inProgressTrips: any[] = [];
  constructor() {}

  ngOnInit() {}
}
