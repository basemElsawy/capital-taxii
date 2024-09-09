import { Component, Input } from '@angular/core';

@Component({
  selector: 'dashboard-shared-table',
  standalone: true,
  imports: [],
  templateUrl: './shared-table.component.html',
  styleUrl: './shared-table.component.scss',
})
export class SharedTableComponent {
  @Input('tableRow') tableRowData: any;

  ngOnInit() {
    console.log(this.tableRowData);
  }
}
