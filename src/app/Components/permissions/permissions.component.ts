import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { RatingModule } from 'primeng/rating';
import { CalendarModule } from 'primeng/calendar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslationService } from '../../Core/Services/translation.service';
import { PermissionsService } from './services/permissions.service';
@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RatingModule,
    CalendarModule,
    TranslateModule,
  ],
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss'],
})
export class PermissionsComponent implements OnInit {
  permissions: any[] = [];
  addPermissionForm!: FormGroup;
  lang!: string;

  constructor(
    private fb: FormBuilder,
    private permissionsService: PermissionsService,
    private modalService: NgbModal,
    private translation: TranslationService,
    private translate: TranslateService
  ) {}
  ngOnInit() {
    this.initialiseAddUserForm();
    // this.dateFormInitializer();

    this.getAllPermissions();
    this.languageSetter();
  }
  languageSetter() {
    if (!this.lang) {
      this.lang = this.translate.currentLang;
    }
    this.translation.getLanguage.subscribe((val: string) => {
      this.lang = val;
    });
  }

  initialiseAddUserForm() {
    this.addPermissionForm = this.fb.group({
      nameEN: [null, Validators.required],
      nameAR: [null, Validators.required],
      url: [null, Validators.required],
    });
  }

  getAllPermissions(): void {
    this.permissionsService.getPermissions().subscribe({
      next: (res: any) => {
        this.permissions = res;
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  checkboxEvent(ev: any) {}

  addPermission() {
    let PermissionBody = this.addPermissionForm.value;
    console.log(PermissionBody);
    this.permissionsService.addPermission(PermissionBody).subscribe({
      next: (res: any) => {
        this.modalService.dismissAll();
        this.getAllPermissions();
        this.addPermissionForm.reset();
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  openAddModal(content: any) {
    this.modalService.open(content, {
      size: 'xl',
      backdrop: 'static',
      centered: true,
      scrollable: true,
    });
  }
}
