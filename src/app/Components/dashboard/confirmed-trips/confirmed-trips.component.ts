import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-confirmed-trips',
  standalone: true,
  templateUrl: './confirmed-trips.component.html',
  styleUrls: ['./confirmed-trips.component.scss'],
})
export class ConfirmedTripsComponent implements OnInit {
  @Input() confirmedTripsDetails: any[] = [];
  constructor() {}

  ngOnInit() {}
}
