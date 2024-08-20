import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-trips',
  standalone: true,
  templateUrl: './new-trips.component.html',
  styleUrls: ['./new-trips.component.scss'],
})
export class NewTripsComponent implements OnInit {
  @Input() newTrips: any[] = [];
  constructor() {}

  ngOnInit() {}
}
