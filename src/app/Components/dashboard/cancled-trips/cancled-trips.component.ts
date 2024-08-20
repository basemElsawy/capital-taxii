import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-cancled-trips',
  standalone: true,
  templateUrl: './cancled-trips.component.html',
  styleUrls: ['./cancled-trips.component.scss'],
})
export class CancledTripsComponent implements OnInit {
  @Input() cancledTrips: any[] = [];
  constructor() {}

  ngOnInit() {}
}
