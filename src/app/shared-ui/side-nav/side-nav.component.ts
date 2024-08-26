import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss',
})
export class SideNavComponent implements OnInit {
  userData: string | any = jwtDecode(localStorage.getItem('token') as string);

  ngOnInit(): void {
    console.log(this.userData);
  }
}
