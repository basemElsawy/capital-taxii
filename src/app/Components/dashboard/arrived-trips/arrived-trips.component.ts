import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-arrived-trips',
  standalone: true,
  templateUrl: './arrived-trips.component.html',
  styleUrls: ['./arrived-trips.component.scss'],
})
export class ArrivedTripsComponent implements OnInit {
  @Input() arrivedTripDetails: any[] = [];
  constructor() {}

  ngOnInit() {}
}
