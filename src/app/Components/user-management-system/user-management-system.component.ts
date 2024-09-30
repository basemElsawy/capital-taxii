import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SpinnerComponent } from '../../shared-ui/spinner/spinner.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslationService } from '../../Core/Services/translation.service';
import { StationsPricesComponent } from '../stations-prices/stations-prices.component';
import { CommonModule } from '@angular/common';
import { TablePricesComponent } from '../table-prices/table-prices.component';
import { ZonesComponent } from '../zones/zones.component';
import { VehicleServiceTypeComponent } from '../vehicle-service-type/vehicle-service-type.component';
import { PeakTimeComponent } from '../peak-time/peak-time.component';
import { environment } from '../../../environments/environment.development';
import { MultiSelectModule } from 'primeng/multiselect';
import { forkJoin } from 'rxjs';
import { ShiftsComponent } from '../shifts/shifts.component';
import { UserManagementSystemService } from './services/user-management-system.service';
import { UsersComponent } from '../users/users.component';
import { RolesComponent } from '../roles/roles.component';
import { PermissionsComponent } from '../permissions/permissions.component';
@Component({
  selector: 'app-user-management-system',
  standalone: true,
  imports: [
    NgbNavModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    SpinnerComponent,
    TranslateModule,
    MultiSelectModule,
    UsersComponent,
    RolesComponent,
    PermissionsComponent,
  ],
  templateUrl: './user-management-system.component.html',
  styleUrls: ['./user-management-system.component.scss'],
})
export class UserManagementSystemComponent implements OnInit {
  active = 1;
  lang!: string;
  isLoading: boolean = false;

  constructor(
    private userManagementSystemService: UserManagementSystemService,
    private fb: FormBuilder,
    private translate: TranslateService,
    private translation: TranslationService,
    private modalService: NgbModal
  ) {}
  ngOnInit() {
    this.setLanguage();

    this.languageSetter();
  }
  setLanguage() {
    if (!this.lang) {
      this.lang = this.translate.currentLang;
    }

    this.translation.getLanguage.subscribe((val: string) => {
      this.lang = val;
    });
  }

  languageSetter() {
    if (!this.lang) {
      this.lang = this.translate.currentLang;
    }
    this.translation.getLanguage.subscribe((val: string) => {
      this.lang = val;
    });
  }

  closeModal() {
    this.modalService.dismissAll();
  }
  print() {
    window.print();
  }
}
